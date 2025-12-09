import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import axios from "axios";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";
import { validatePhoneNumberGoogle } from "../utils/phoneValidator.js";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import nodemailer from "nodemailer";

console.log("🟢 AUTH ROUTES FILE LOADED - TIMESTAMP:", new Date().toISOString());

dotenv.config();
const router = express.Router();

// ✅ FIXED: Remove "postmessage" - let it use default
const oauthClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
);

console.log("🔍 ENV TEST:", {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ? "✅ Loaded" : "❌ Missing",
});

// ✅ Email Transporter Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail', // or use 'smtp.gmail.com'
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS, // Use App Password for Gmail
    },
});

// ✅ Verify email configuration on startup
transporter.verify((error, success) => {
    if (error) {
        console.error("❌ Email configuration error:", error);
    } else {
        console.log("✅ Email server is ready to send messages");
    }
});

// ========== EXISTING ROUTES ==========

router.post("/register", async (req, res) => {
    try {
        const { name, email, phone, password, countryCode } = req.body;

        if (!name || !email || !phone || !password || !countryCode)
            return res.status(400).json({ message: "All fields are required" });

        // Combine country code + phone
        const fullPhone = `${countryCode}${phone}`.replace(/\s+/g, "");

        // Validate with Google/libphonenumber-js
        const validated = validatePhoneNumberGoogle(fullPhone);
        if (!validated.isValid) {
            return res.status(400).json({ message: validated.error });
        }

        const phoneE164 = validated.e164;

        const existing = await User.findOne({ where: { phone: phoneE164 } });
        if (existing) {
            return res.status(409).json({ message: "Phone already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            phone: phoneE164,
            password: hashedPassword,
            provider: "local",
            registrationType: "self",
            selectedThemeId: 1,
            plan: "free",
        });

        return res.status(201).json({
            message: "Registered successfully",
            user
        });

    } catch (err) {
        console.error("❌ Register error:", err);
        return res.status(500).json({ message: "Registration failed" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password)
            return res.status(400).json({ message: "Email/Phone and password are required" });

        let user = null;

        if (identifier.includes("@")) {
            user = await User.findOne({ where: { email: identifier.trim() } });
        } else {
            let parsed = parsePhoneNumberFromString(identifier);

            if (!parsed || !parsed.isValid()) {
                return res.status(400).json({
                    message: "Invalid phone number format. Example: +94771234567"
                });
            }

            const phoneE164 = parsed.format("E.164");
            user = await User.findOne({ where: { phone: phoneE164 } });
        }

        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ message: "Invalid credentials" });

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
            }
        });

    } catch (err) {
        console.error("❌ Login error:", err);
        res.status(500).json({ message: "Server error during login" });
    }
});

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
                "reviewLimit",
                "role",
                "plan",
                "selectedThemeId"
            ],
        });

        if (!user) {
            console.error("❌ User not found for ID:", req.userId);
            return res.status(404).json({ message: "User not found" });
        }

        console.log("✅ User found:", user.email);
        res.json(user);
    } catch (err) {
        console.error("❌ /auth/me error:", err);
        res.status(500).json({
            message: "Error fetching user info",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

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

        const tokenResponse = await oauthClient.getToken({
            code: code,
            redirect_uri: 'postmessage'
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
                selectedThemeId: '1'
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

// ========== NEW FORGOT PASSWORD ROUTES ==========

// ✅ Forgot Password - Send Reset Email
router.post("/forgot-password", async (req, res) => {
    try {
        console.log("🔵 Forgot password request received");
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const trimmedEmail = email.trim().toLowerCase();
        console.log("🔍 Looking for user with email:", trimmedEmail);

        // Check if user exists
        const user = await User.findOne({ where: { email: trimmedEmail } });

        // ✅ Security: Always return success (don't reveal if email exists)
        // But only send email if user actually exists
        if (!user) {
            console.log("⚠️ User not found, but returning success for security");
            return res.status(200).json({
                success: true,
                message: "If an account exists with this email, a password reset link has been sent."
            });
        }

        console.log("✅ User found:", user.id);

        // Generate secure random token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Hash token before storing (security best practice)
        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        // Set token expiry to 5 minutes from now
        const resetTokenExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // Save hashed token and expiry to database
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = resetTokenExpiry;
        await user.save();

        console.log("✅ Reset token saved to database");
        console.log("⏰ Token expires at:", resetTokenExpiry);

        // Create reset URL with original (unhashed) token
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        // Email HTML template
        const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #5c4033 0%, #3e2a23 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #ffffff; padding: 30px; border: 1px solid #e5e1dc; border-top: none; }
                .button { display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #5c4033 0%, #3e2a23 100%); color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
                .button:hover { background: linear-gradient(135deg, #3e2a23 0%, #5c4033 100%); }
                .warning { background: #fff1f0; border-left: 4px solid #cf1322; padding: 12px; margin: 20px 0; border-radius: 4px; }
                .footer { text-align: center; color: #6b5d57; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e1dc; }
                .link { color: #5c4033; word-break: break-all; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1 style="margin: 0; color: #f5e6d3;">Reset Your Password</h1>
                    <p style="margin: 10px 0 0 0; color: rgba(255, 255, 255, 0.9);">TapMyName - Digital Business Cards</p>
                </div>
                <div class="content">
                    <p>Hello <strong>${user.name}</strong>,</p>
                    <p>We received a request to reset your password. Click the button below to create a new password:</p>
                    
                    <div style="text-align: center;">
                        <a href="${resetUrl}" class="button">Reset Password</a>
                    </div>
                    
                    <p>Or copy and paste this link into your browser:</p>
                    <p class="link">${resetUrl}</p>
                    
                    <div class="warning">
                        <strong>⚠️ Important:</strong>
                        <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                            <li>This link will expire in <strong>5 minutes</strong></li>
                            <li>For security reasons, you can only use this link once</li>
                            <li>If you didn't request this, please ignore this email</li>
                        </ul>
                    </div>
                    
                    <p style="margin-top: 30px; color: #6b5d57;">If you're having trouble with the button, copy and paste the URL above into your web browser.</p>
                </div>
                <div class="footer">
                    <p>This is an automated message from TapMyName. Please do not reply to this email.</p>
                    <p>© ${new Date().getFullYear()} TapMyName. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        `;

        // Email options
        const mailOptions = {
            from: `"TapMyName Support" <${process.env.MAIL_USER}>`,
            to: user.email,
            subject: "Password Reset Request - TapMyName",
            html: emailHtml,
        };

        // Send email
        console.log("📧 Sending reset email to:", user.email);
        await transporter.sendMail(mailOptions);
        console.log("✅ Reset email sent successfully");

        return res.status(200).json({
            success: true,
            message: "If an account exists with this email, a password reset link has been sent.",
        });

    } catch (err) {
        console.error("❌ Forgot password error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to process password reset request. Please try again.",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

// ✅ Reset Password - Verify Token and Update Password
router.post("/reset-password", async (req, res) => {
    try {
        console.log("🔵 Reset password request received");
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Token and new password are required"
            });
        }

        // Validate password strength
        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long"
            });
        }

        console.log("🔍 Looking for valid reset token");

        // Hash the token from URL to match database
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        // Find user with valid token that hasn't expired
        const user = await User.findOne({
            where: {
                resetPasswordToken: hashedToken,
            },
        });

        if (!user) {
            console.log("❌ Invalid token - user not found");
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token. Please request a new password reset."
            });
        }

        // Check if token has expired (5 minutes)
        const now = new Date();
        const tokenExpiry = new Date(user.resetPasswordExpires);

        console.log("⏰ Current time:", now);
        console.log("⏰ Token expires:", tokenExpiry);

        if (now > tokenExpiry) {
            console.log("❌ Token has expired");

            // Clear expired token
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;
            await user.save();

            return res.status(400).json({
                success: false,
                message: "Reset token has expired. Please request a new password reset."
            });
        }

        console.log("✅ Token is valid and not expired");
        console.log("🔐 Updating password for user:", user.email);

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and clear reset token
        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        console.log("✅ Password updated successfully");

        // Optional: Send confirmation email
        try {
            const confirmationEmail = {
                from: `"TapMyName Support" <${process.env.MAIL_USER}>`,
                to: user.email,
                subject: "Password Changed Successfully - TapMyName",
                html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #5c4033 0%, #3e2a23 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #ffffff; padding: 30px; border: 1px solid #e5e1dc; }
                        .success { background: #f6ffed; border-left: 4px solid #389e0d; padding: 12px; margin: 20px 0; border-radius: 4px; color: #389e0d; }
                        .footer { text-align: center; color: #6b5d57; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e1dc; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1 style="margin: 0; color: #f5e6d3;">Password Changed</h1>
                        </div>
                        <div class="content">
                            <div class="success">
                                <strong>✅ Success!</strong> Your password has been changed successfully.
                            </div>
                            <p>Hello <strong>${user.name}</strong>,</p>
                            <p>This is a confirmation that your password was successfully changed on ${new Date().toLocaleString()}.</p>
                            <p>If you did not make this change, please contact our support team immediately.</p>
                        </div>
                        <div class="footer">
                            <p>© ${new Date().getFullYear()} TapMyName. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
                `
            };

            await transporter.sendMail(confirmationEmail);
            console.log("✅ Confirmation email sent");
        } catch (emailErr) {
            console.error("⚠️ Failed to send confirmation email:", emailErr);
            // Don't fail the request if confirmation email fails
        }

        return res.status(200).json({
            success: true,
            message: "Password reset successful! You can now login with your new password."
        });

    } catch (err) {
        console.error("❌ Reset password error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to reset password. Please try again.",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

export default router;
