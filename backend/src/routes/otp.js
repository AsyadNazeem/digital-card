import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Temporary in-memory storage for OTPs
const otpStore = new Map(); // key: email, value: { otp, expires }

// ✅ CRITICAL FIX: Correct Gmail configuration
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // use SSL
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
    // Add these to help with potential SSL issues
    tls: {
        rejectUnauthorized: false
    }
});

// ✅ Verify transporter on startup
transporter.verify((error, success) => {
    if (error) {
        console.error("❌ Email transporter error:", error);
        console.error("❌ MAIL_USER:", process.env.MAIL_USER);
        console.error("❌ MAIL_PASS exists:", !!process.env.MAIL_PASS);
    } else {
        console.log("✅ Email transporter ready");
    }
});

// ✅ Test endpoint to verify email config
router.get("/test-email", async (req, res) => {
    try {
        console.log("🧪 Testing email configuration...");
        console.log("📧 MAIL_USER:", process.env.MAIL_USER);
        console.log("🔐 MAIL_PASS exists:", !!process.env.MAIL_PASS);

        const testEmail = await transporter.sendMail({
            from: `"TapMyName Test" <${process.env.MAIL_USER}>`,
            to: process.env.MAIL_USER,
            subject: "✅ Test Email - OTP Configuration",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2 style="color: #28a745;">✅ Email Configuration Working!</h2>
                    <p>Test sent at: ${new Date().toLocaleString()}</p>
                </div>
            `
        });

        console.log("✅ Test email sent:", testEmail.messageId);
        res.json({
            success: true,
            message: "Test email sent successfully! Check " + process.env.MAIL_USER,
            messageId: testEmail.messageId
        });
    } catch (err) {
        console.error("❌ Test email error:", err);
        res.status(500).json({
            success: false,
            message: "Test email failed",
            error: err.message,
            code: err.code
        });
    }
});

// ✅ Send OTP with enhanced error handling
router.post("/send", async (req, res) => {
    try {
        console.log("🔵 OTP Send request received");
        const { email } = req.body;

        if (!email) {
            console.log("❌ No email provided");
            return res.status(400).json({
                success: false,
                message: "Email required"
            });
        }

        const trimmedEmail = email.trim().toLowerCase();
        console.log("📧 Sending OTP to:", trimmedEmail);

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log("🔢 Generated OTP:", otp);

        // Store with expiry (5 minutes)
        const expiryTime = Date.now() + 5 * 60 * 1000;
        otpStore.set(trimmedEmail, {
            otp,
            expires: expiryTime,
        });

        console.log("💾 OTP stored, expires at:", new Date(expiryTime));

        // Enhanced email HTML
        const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #5c4033 0%, #3e2a23 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #ffffff; padding: 30px; border: 1px solid #e5e1dc; border-top: none; }
                .otp-box { background: #fafaf8; border: 2px solid #5c4033; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center; }
                .otp-code { font-size: 36px; font-weight: bold; color: #5c4033; letter-spacing: 8px; margin: 10px 0; }
                .warning { background: #fff1f0; border-left: 4px solid #cf1322; padding: 12px; margin: 20px 0; border-radius: 4px; }
                .footer { text-align: center; color: #6b5d57; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e1dc; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1 style="margin: 0; color: #f5e6d3;">Email Verification</h1>
                    <p style="margin: 10px 0 0 0; color: rgba(255, 255, 255, 0.9);">TapMyName - Digital Business Cards</p>
                </div>
                <div class="content">
                    <p>Hello,</p>
                    <p>Thank you for registering with TapMyName. Please use the following verification code to complete your registration:</p>
                    
                    <div class="otp-box">
                        <p style="margin: 0; font-size: 14px; color: #6b5d57;">Your Verification Code</p>
                        <div class="otp-code">${otp}</div>
                        <p style="margin: 0; font-size: 12px; color: #9b8b7e;">Enter this code in the registration form</p>
                    </div>
                    
                    <div class="warning">
                        <strong>⚠️ Important:</strong>
                        <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                            <li>This code will expire in <strong>5 minutes</strong></li>
                            <li>Do not share this code with anyone</li>
                            <li>If you didn't request this code, please ignore this email</li>
                        </ul>
                    </div>
                    
                    <p style="color: #6b5d57; font-size: 14px;">If you're having trouble, please contact our support team.</p>
                </div>
                <div class="footer">
                    <p>This is an automated message from TapMyName. Please do not reply to this email.</p>
                    <p>© ${new Date().getFullYear()} TapMyName. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        `;

        // Send Email
        console.log("📤 Attempting to send email...");

        const info = await transporter.sendMail({
            from: `"TapMyName Verification" <${process.env.MAIL_USER}>`,
            to: trimmedEmail,
            subject: "Your TapMyName Verification Code",
            html: emailHtml,
        });

        console.log("✅ OTP email sent successfully");
        console.log("📧 Message ID:", info.messageId);

        res.json({
            success: true,
            message: "OTP sent successfully. Please check your email."
        });

    } catch (err) {
        console.error("❌ Error sending OTP:");
        console.error("Error code:", err.code);
        console.error("Error message:", err.message);
        console.error("Error response:", err.response);

        // Specific error messages
        let errorMessage = "Failed to send OTP. Please try again.";

        if (err.code === 'EAUTH') {
            errorMessage = "Email authentication failed. Please contact support.";
            console.error("❌ Authentication failed. Check MAIL_USER and MAIL_PASS");
        } else if (err.code === 'ESOCKET' || err.code === 'ETIMEDOUT') {
            errorMessage = "Network error. Please check your connection and try again.";
        } else if (err.code === 'EENVELOPE') {
            errorMessage = "Invalid email address.";
        }

        res.status(500).json({
            success: false,
            message: errorMessage,
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

// ✅ Verify OTP
router.post("/verify", async (req, res) => {
    try {
        console.log("🔵 OTP Verify request received");
        const { email, otp } = req.body;

        if (!email || !otp) {
            console.log("❌ Missing email or OTP");
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required"
            });
        }

        const trimmedEmail = email.trim().toLowerCase();
        const trimmedOTP = otp.trim();

        console.log("🔍 Verifying OTP for:", trimmedEmail);
        console.log("🔢 Received OTP:", trimmedOTP);

        // Check in-memory store
        const record = otpStore.get(trimmedEmail);

        if (!record) {
            console.log("❌ No OTP record found");
            return res.status(400).json({
                success: false,
                message: "OTP not found or expired. Please request a new one."
            });
        }

        console.log("💾 Stored OTP:", record.otp);
        console.log("⏰ Expires at:", new Date(record.expires));

        // Check if OTP expired
        if (Date.now() > record.expires) {
            console.log("❌ OTP has expired");
            otpStore.delete(trimmedEmail);
            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please request a new one."
            });
        }

        // Check if OTP matches
        if (record.otp !== trimmedOTP) {
            console.log("❌ OTP mismatch");
            return res.status(400).json({
                success: false,
                message: "Invalid OTP. Please check and try again."
            });
        }

        // ✅ OTP verified successfully
        console.log("✅ OTP verified successfully");
        otpStore.delete(trimmedEmail); // One-time use

        res.json({
            success: true,
            message: "Email verified successfully! ✅"
        });

    } catch (err) {
        console.error("❌ Error verifying OTP:", err);
        res.status(500).json({
            success: false,
            message: "Server error verifying OTP. Please try again.",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

// ✅ Cleanup expired OTPs (runs every 10 minutes)
setInterval(() => {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [email, record] of otpStore.entries()) {
        if (now > record.expires) {
            otpStore.delete(email);
            cleanedCount++;
        }
    }

    if (cleanedCount > 0) {
        console.log(`🧹 Cleaned up ${cleanedCount} expired OTP(s)`);
    }
}, 10 * 60 * 1000);

export default router;
