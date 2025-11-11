import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import User from "../models/User.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import bcrypt from "bcryptjs";



dotenv.config();
const router = express.Router();

const emailOtpStore = new Map();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

// Check if email already exists
router.post("/check-email", async (req, res) => {
    try {
        const { email } = req.body;
        const existing = await User.findOne({ where: { email } });
        res.json({ exists: !!existing });
    } catch (err) {
        res.status(500).json({ message: "Error checking email." });
    }
});

// Send OTP
router.post("/send-email-otp", async (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    emailOtpStore.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 });

    try {
        await transporter.sendMail({
            from: `"Contact Card" <${process.env.MAIL_USER}>`,
            to: email,
            subject: "Email Change OTP",
            html: `<p>Your OTP is:</p><h2>${otp}</h2><p>Expires in 5 minutes.</p>`,
        });
        res.json({ success: true, message: "OTP sent to your new email." });
    } catch (err) {
        res.status(500).json({ message: "Failed to send OTP." });
    }
});

// Verify OTP
router.post("/verify-email-otp", (req, res) => {
    const { email, otp } = req.body;
    const record = emailOtpStore.get(email);

    if (!record) return res.status(400).json({ success: false, message: "OTP not found or expired." });
    if (Date.now() > record.expires) return res.status(400).json({ success: false, message: "OTP expired." });
    if (record.otp !== otp) return res.status(400).json({ success: false, message: "Invalid OTP." });

    emailOtpStore.delete(email);
    res.json({ success: true, message: "OTP verified successfully." });
});

// Confirm change (authenticated)
router.post("/confirm-email-change", authenticateToken, async (req, res) => {
    try {
        const { email } = req.body;
        const userId = req.user.id;

        await User.update({ email }, { where: { id: userId } });
        res.json({ success: true, message: "Email updated successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Error updating email." });
    }
});

router.post("/change-password", authenticateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // 1️⃣ Find user
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // 2️⃣ Compare current password
        const validPassword = await bcrypt.compare(currentPassword, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Current password is incorrect." });
        }

        // 3️⃣ Check if new password is same as old
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).json({ message: "New password cannot be the same as your old password." });
        }

        // 4️⃣ Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 5️⃣ Update password
        await User.update({ password: hashedPassword }, { where: { id: userId } });

        res.json({ success: true, message: "Password updated successfully!" });
    } catch (err) {
        console.error("Error changing password:", err);
        res.status(500).json({ message: "Server error updating password." });
    }
});

router.post("/change-username", authenticateToken, async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user.id;

        if (!name || name.length < 3) {
            return res.status(400).json({ message: "Name must be at least 3 characters long." });
        }

        // 1️⃣ Find the user
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ message: "User not found." });

        // 2️⃣ Check if the last name change was < 30 days ago
        const lastChange = user.lastUsernameChange;
        const now = new Date();

        if (lastChange && now - new Date(lastChange) < 30 * 24 * 60 * 60 * 1000) {
            const nextAllowed = new Date(
                new Date(lastChange).getTime() + 30 * 24 * 60 * 60 * 1000
            ).toLocaleDateString();
            return res.status(400).json({
                message: `You can change your name again after ${nextAllowed}.`,
            });
        }

        // 3️⃣ Update name + timestamp
        user.name = name;
        user.lastUsernameChange = new Date();
        await user.save();

        res.json({
            success: true,
            message: "✅ Name updated successfully!",
        });
    } catch (err) {
        console.error("Error updating name:", err);
        res.status(500).json({ message: "Server error updating name." });
    }
});

router.post("/add-phone", authenticateToken, async (req, res) => {
    try {
        const { phone, countryCode } = req.body;

        if (!phone || !/^\d{10}$/.test(phone)) {
            return res.status(400).json({ message: "Invalid phone number format." });
        }

        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.phone = phone;
        user.countryCode = countryCode || "+94";
        await user.save();

        res.json({ message: "Phone number added successfully!" });
    } catch (err) {
        console.error("❌ Add phone error:", err);
        res.status(500).json({ message: "Failed to save phone number." });
    }
});



export default router;
