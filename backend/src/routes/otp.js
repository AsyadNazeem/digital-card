import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Temporary in-memory storage for OTPs
const otpStore = new Map(); // key: email, value: { otp, expires }

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER, // your Gmail
        pass: process.env.MAIL_PASS, // your Gmail App Password
    },
});

// ✅ Send OTP
router.post("/send", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email required" });

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store with expiry (5 minutes)
        otpStore.set(email, {
            otp,
            expires: Date.now() + 5 * 60 * 1000,
        });

        // Send Email
        await transporter.sendMail({
            from: `"Contact Card" <${process.env.MAIL_USER}>`,
            to: email,
            subject: "Your OTP Code",
            html: `
                <p>Your verification code is:</p>
                <h2>${otp}</h2>
                <p>This code will expire in 5 minutes.</p>
            `,
        });

        res.json({ message: "OTP sent successfully" });
    } catch (err) {
        console.error("Error sending OTP:", err);
        res.status(500).json({ message: "Failed to send OTP" });
    }
});

// ✅ Verify OTP (Fixed to use in-memory store)
router.post("/verify", async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required"
            });
        }

        // ✅ Check in-memory store instead of database
        const record = otpStore.get(email);

        if (!record) {
            return res.status(400).json({
                success: false,
                message: "OTP not found or expired"
            });
        }

        // Check if OTP expired
        if (Date.now() > record.expires) {
            otpStore.delete(email); // Clean up expired OTP
            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please request a new one."
            });
        }

        // Check if OTP matches
        if (record.otp !== otp.trim()) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        // ✅ OTP verified successfully
        // Optionally delete OTP after successful verification
        otpStore.delete(email);

        res.json({
            success: true,
            message: "OTP verified successfully"
        });
    } catch (err) {
        console.error("Error verifying OTP:", err);
        res.status(500).json({
            success: false,
            message: "Server error verifying OTP"
        });
    }
});

export default router;
