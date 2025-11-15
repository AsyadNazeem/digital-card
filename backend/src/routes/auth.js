import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import axios from "axios";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";

dotenv.config();
const router = express.Router();

// ✅ FIXED: Remove "postmessage" - let it use default
const oauthClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
    // ❌ Don't set redirect_uri here - it comes from the frontend
);

console.log("🔍 ENV TEST:", {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ? "✅ Loaded" : "❌ Missing",
});

// ✅ REGISTER ROUTE
router.post("/register", async (req, res) => {
    try {
        const { name, email, phone, password, countryCode } = req.body;

        if (!name || !email || !phone || !password || !countryCode)
            return res.status(400).json({ message: "All fields are required" });

        const existing = await User.findOne({ where: { phone } });
        if (existing) return res.status(409).json({ message: "Phone already registered" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            phone,
            countryCode,
            password: hashedPassword,
            provider: "local",
            registrationType: "self"
        });

        return res.status(201).json({ message: "Registered successfully", user });
    } catch (err) {
        console.error("❌ Register error:", err);
        return res.status(500).json({ message: err.message || "Registration failed" });
    }
});

// ✅ LOGIN ROUTE
router.post("/login", async (req, res) => {
    try {
        const { phone, password } = req.body;

        if (!phone || !password)
            return res.status(400).json({ message: "Phone and password are required" });

        const user = await User.findOne({ where: { phone } });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ message: "Invalid phone or password" });

        const token = jwt.sign(
            { id: user.id, phone: user.phone },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
            },
        });
    } catch (err) {
        console.error("❌ Login error:", err);
        res.status(500).json({ message: "Server error during login" });
    }
});

// ✅ GET CURRENT USER INFO
router.get("/me", authenticateToken, async (req, res) => {
    try {
        console.log("🟢 /auth/me called");
        console.log("User ID from token:", req.userId);

        const user = await User.findByPk(req.userId, {
            attributes: [
                "id",
                "name",
                "email",
                "phone",
                "provider",
                "status",
                "companyLimit",
                "contactLimit",
                "role",
            ],
        });

        if (!user) {
            console.error("❌ User not found for ID:", req.userId);
            return res.status(404).json({ message: "User not found" });
        }

        console.log("✅ User found:", user.email);

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone || "",
            provider: user.provider || "local",
            status: user.status,
            companyLimit: user.companyLimit || 1,
            contactLimit: user.contactLimit || 1,
            role: user.role || "user",
        });
    } catch (err) {
        console.error("❌ /auth/me error:", err);
        res.status(500).json({
            message: "Error fetching user info",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

// 🟢 Google Simple Auth (using access token)
router.post("/google", async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(400).json({ success: false, message: "Missing token" });

        const googleRes = await axios.get(
            `https://www.googleapis.com/oauth2/v3/userinfo`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        const { email, name, picture, sub: googleId } = googleRes.data;
        console.log("✅ Google User Info:", googleRes.data);

        let user = await User.findOne({ where: { email } });

        if (!user) {
            user = await User.create({
                name,
                email,
                phone: "",
                password: null,
                googleId,
                provider: "google",
            });
        }

        const jwtToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({
            success: true,
            message: "User authenticated via Google",
            token: jwtToken,
            user: { id: user.id, name: user.name, email: user.email },
        });
    } catch (err) {
        console.error("❌ Google Auth Error:", err.response?.data || err.message);
        res.status(500).json({ success: false, message: "Google authentication failed." });
    }
});

// ✅ FIXED Google Register (using authorization code)
router.post("/google-register", async (req, res) => {
    try {
        console.log("🔵 Google register request received");
        console.log("🔵 Request body:", req.body);

        const { code } = req.body;

        if (!code) {
            console.log("❌ No code provided");
            return res.status(400).json({
                success: false,
                message: "Missing authorization code"
            });
        }

        console.log("🔵 Exchanging code for tokens...");

        // ✅ FIXED: Specify redirect_uri explicitly
        const tokenResponse = await oauthClient.getToken({
            code: code,
            redirect_uri: 'postmessage' // This tells Google it's from the popup
        });

        const { id_token } = tokenResponse.tokens;

        if (!id_token) {
            console.log("❌ No ID token received");
            return res.status(400).json({
                success: false,
                message: "No ID token received"
            });
        }

        console.log("🔵 Verifying ID token...");

        const ticket = await oauthClient.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        console.log("✅ Google payload:", payload);

        const { email, name, sub: googleId, picture } = payload;

        if (!email || !name) {
            console.log("❌ Missing required fields from Google");
            return res.status(400).json({
                success: false,
                message: "Missing required user information from Google"
            });
        }

        console.log("🔵 Checking if user exists...");

        let user = await User.findOne({ where: { email } });

        if (user) {
            console.log("✅ User already exists:", user.id);
        } else {
            console.log("🔵 Creating new user...");

            user = await User.create({
                name,
                email,
                phone: "",
                password: null,
                googleId: googleId,
                provider: 'google',
                registrationType: 'google',
            });

            console.log("✅ User created:", user.id);
        }

        console.log("🔵 Generating JWT token...");

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        console.log("✅ JWT token generated");

        return res.status(200).json({
            success: true,
            message: "Google registration successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
            },
        });

    } catch (err) {
        console.error("❌ Google register error:");
        console.error("Error name:", err.name);
        console.error("Error message:", err.message);
        console.error("Error stack:", err.stack);

        if (err.parent) {
            console.error("❌ Database error:", err.parent);
        }

        if (err.response) {
            console.error("❌ Google API error:", err.response.data);
        }

        return res.status(500).json({
            success: false,
            message: "Google Sign-In failed",
            error: process.env.NODE_ENV === 'development' ? err.message : "Internal server error"
        });
    }
});

export default router;
