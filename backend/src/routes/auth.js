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

const oauthClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,  // ✅ THIS WAS MISSING!
    "postmessage"
);

// ✅ REGISTER ROUTE
router.post("/register", async (req, res) => {
    try {
        const { name, email, phone, password, countryCode } = req.body;

        if (!name || !email || !phone || !password || !countryCode)
            return res.status(400).json({ message: "All fields are required" });

        // Check if email or phone already exists
        const existing = await User.findOne({ where: { phone } });
        if (existing) return res.status(409).json({ message: "Phone already registered" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            phone,
            countryCode,
            password: hashedPassword,
        });

        return res.status(201).json({ message: "Registered successfully", user });
    } catch (err) {
        console.error("❌ Register error:", err);
        return res.status(500).json({ message: err.message || "Registration failed" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { phone, password } = req.body;

        if (!phone || !password)
            return res.status(400).json({ message: "Phone and password are required" });

        // 1️⃣ Find user by phone
        const user = await User.findOne({ where: { phone } });
        if (!user) return res.status(404).json({ message: "User not found" });

        // 2️⃣ Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ message: "Invalid phone or password" });

        // 3️⃣ Create JWT token
        const token = jwt.sign(
            { id: user.id, phone: user.phone },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
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

router.get("/me", authenticateToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ["id", "name", "email", "phone"],
        });

        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        console.error("Error fetching user profile:", err);
        res.status(500).json({ message: "Error fetching user info" });
    }
});

// 🟢 Google Register/Login
router.post("/google", async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(400).json({ success: false, message: "Missing token" });

        // Verify token with Google
        const googleRes = await axios.get(
            `https://www.googleapis.com/oauth2/v3/userinfo`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        const { email, name, picture } = googleRes.data;
        console.log("✅ Google User Info:", googleRes.data);

        // Check if user exists
        let user = await User.findOne({ where: { email } });

        if (!user) {
            user = await User.create({
                name,
                email,
                phone: "",
                password: null, // Google users don't need a password
            });
        }

        // Generate JWT
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

// ✅ FIXED Google Register Route
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

        // Exchange code for tokens using the properly initialized client
        const tokenResponse = await oauthClient.getToken(code);

        const { id_token } = tokenResponse.tokens;

        if (!id_token) {
            console.log("❌ No ID token received");
            return res.status(400).json({
                success: false,
                message: "No ID token received"
            });
        }

        console.log("🔵 Verifying ID token...");

        // Verify and decode ID token using the same client
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

        // Check if user exists
        let user = await User.findOne({ where: { email } });

        if (user) {
            console.log("✅ User already exists:", user.id);
        } else {
            console.log("🔵 Creating new user...");

            // Create a new user
            user = await User.create({
                name,
                email,
                phone: "", // Empty phone for Google users
                password: null, // No password for Google users
                googleId: googleId, // ✅ Also store the Google ID
                provider: 'google', // ✅ Mark as Google user
            });

            console.log("✅ User created:", user.id);
        }

        console.log("🔵 Generating JWT token...");

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        console.log("✅ JWT token generated");

        // Send response
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

        // Log database-specific errors
        if (err.parent) {
            console.error("❌ Database error:", err.parent);
        }

        // Log Google API errors
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
