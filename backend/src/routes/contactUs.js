import express from "express";
import { transporter } from "./otp.js"; // ✅ Reuse existing Zoho transporter
import Message from "../models/Message.js"; // ✅ ADD THIS IMPORT

const router = express.Router();

// ============================================
// POST /contact-us
// Public route — no auth required
// ============================================

router.post("/contact-us", async (req, res) => {
    try {
        const { firstName, lastName, email, subject, message, planRequest } = req.body;

        // ── Validation ──────────────────────────────────────
        const missing = [];
        if (!firstName?.trim()) missing.push("firstName");
        if (!email?.trim())     missing.push("email");
        if (!subject?.trim())   missing.push("subject");
        if (!message?.trim())   missing.push("message");

        if (missing.length) {
            return res.status(400).json({
                message: `Missing required fields: ${missing.join(", ")}`
            });
        }

        // Basic email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            return res.status(400).json({ message: "Invalid email address" });
        }

        const fullName = lastName?.trim()
            ? `${firstName.trim()} ${lastName.trim()}`
            : firstName.trim();
        const submittedAt = new Date().toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short"
        });

        // ✅ DETERMINE MESSAGE TYPE ──────────────────────────
        let messageType = 'contact';
        if (planRequest) {
            const { from, to } = planRequest;
            if (!from || !to) {
                return res.status(400).json({ message: "Invalid plan request format" });
            }
            const planOrder = { free: 0, plus: 1, premium: 2 };
            messageType = planOrder[to] > planOrder[from] ? 'plan_upgrade' : 'plan_downgrade';
        }

        // ✅ SAVE TO DATABASE ────────────────────────────────
        const dbMessage = await Message.create({
            userId: req.body.userId || null,  // ✅ ADD THIS LINE
            senderName: fullName,
            senderEmail: email.trim(),
            subject: subject.trim(),
            body: message.trim(),
            messageType: messageType,
            planRequest: planRequest || null,
            isRead: false
        });

        // ── Email to admin (hello@tapmy.name) ───────────────
        const adminHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header {
                    background: linear-gradient(135deg, #5c4033 0%, #3e2a23 100%);
                    color: white; padding: 30px; text-align: center;
                    border-radius: 10px 10px 0 0;
                }
                .content {
                    background: #ffffff; padding: 30px;
                    border: 1px solid #e5e1dc; border-top: none;
                    border-radius: 0 0 10px 10px;
                }
                .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                .info-table td { padding: 12px 16px; border-bottom: 1px solid #f0ece8; font-size: 14px; }
                .info-table td:first-child {
                    font-weight: bold; color: #5c4033; width: 35%;
                    background: #fafaf8;
                }
                .message-box {
                    background: #fafaf8; border-left: 4px solid #5c4033;
                    padding: 16px 18px; margin: 20px 0;
                    border-radius: 0 6px 6px 0; font-size: 14px;
                    color: #444; white-space: pre-wrap; line-height: 1.7;
                }
                .badge {
                    display: inline-block; padding: 4px 12px;
                    background: #d4a880; color: white; border-radius: 4px;
                    font-size: 12px; font-weight: 600; margin-top: 8px;
                }
                .footer {
                    text-align: center; color: #9b8b7e; font-size: 12px;
                    margin-top: 24px; padding-top: 16px;
                    border-top: 1px solid #e5e1dc;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1 style="margin:0; font-size:22px; color:#f5e6d3;">📩 New Contact Form Submission</h1>
                    <p style="margin:8px 0 0 0; color:rgba(255,255,255,0.85); font-size:14px;">
                        Submitted via TapMyName Dashboard
                    </p>
                </div>
                <div class="content">
                    <p>A user has sent a message through the contact form. Details below:</p>
                    <table class="info-table">
                        <tr>
                            <td>Name</td>
                            <td>${fullName}</td>
                        </tr>
                        <tr>
                            <td>Email</td>
                            <td><a href="mailto:${email.trim()}" style="color:#5c4033;">${email.trim()}</a></td>
                        </tr>
                        <tr>
                            <td>Subject</td>
                            <td>${subject.trim()}</td>
                        </tr>
                        <tr>
                            <td>Submitted At</td>
                            <td>${submittedAt}</td>
                        </tr>
                        ${planRequest ? `
                        <tr>
                            <td>Request Type</td>
                            <td>
                                <span style="text-transform: capitalize;">
                                    ${messageType === 'plan_upgrade' ? '⬆️ Upgrade Request' : '⬇️ Downgrade Request'}
                                </span>
                                <br/>
                                <span style="font-size: 12px; color: #6b5d57;">
                                    ${planRequest.from} → ${planRequest.to}
                                </span>
                            </td>
                        </tr>
                        ` : ''}
                    </table>

                    <p style="font-weight:bold; color:#5c4033; margin-bottom:6px;">Message:</p>
                    <div class="message-box">${message.trim()}</div>

                    <p style="font-size: 12px; color: #9b8b7e;">
                        Message ID: ${dbMessage.id}
                    </p>
                </div>
                <div class="footer">
                    <p>This is an automated notification from TapMyName.</p>
                    <p>© ${new Date().getFullYear()} TapMyName. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        `;

        // ── Auto-reply to the user ───────────────────────────
        const userHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header {
                    background: linear-gradient(135deg, #5c4033 0%, #3e2a23 100%);
                    color: white; padding: 40px 30px; text-align: center;
                    border-radius: 10px 10px 0 0;
                }
                .content {
                    background: #ffffff; padding: 40px 30px;
                    border: 1px solid #e5e1dc; border-top: none;
                    border-radius: 0 0 10px 10px;
                }
                .success-box {
                    background: #f6ffed; border-left: 4px solid #52c41a;
                    padding: 15px 18px; margin: 20px 0; border-radius: 4px;
                }
                .summary-box {
                    background: #fafaf8; border-left: 4px solid #5c4033;
                    padding: 16px 18px; margin: 20px 0;
                    border-radius: 0 6px 6px 0; font-size: 14px;
                    color: #444; white-space: pre-wrap; line-height: 1.7;
                }
                .footer {
                    text-align: center; color: #6b5d57; font-size: 14px;
                    margin-top: 30px; padding-top: 20px;
                    border-top: 1px solid #e5e1dc;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1 style="margin:0; color:#f5e6d3; font-size:26px;">We've Received Your Message</h1>
                    <p style="margin:10px 0 0 0; color:rgba(255,255,255,0.9); font-size:15px;">
                        TapMyName — Digital Business Cards
                    </p>
                </div>
                <div class="content">
                    <p>Hi <strong>${firstName.trim()}</strong>,</p>

                    <div class="success-box">
                        <strong>✅ Message received!</strong> Thank you for reaching out to us.
                    </div>

                    <p>We've received your message and our team will get back to you within <strong>24 hours</strong>.</p>

                    <p style="font-weight:bold; color:#5c4033; margin-bottom:6px;">Your message:</p>
                    <p style="font-style:italic; color:#5c4033; font-size:13px; margin-bottom:4px;">
                        Subject: ${subject.trim()}
                    </p>
                    <div class="summary-box">${message.trim()}</div>

                    <p style="margin-top:24px; color:#6b5d57; font-size:14px;">
                        If your matter is urgent, feel free to reply to this email or reach us directly at
                        <a href="mailto:hello@tapmy.name" style="color:#5c4033; font-weight:600;">hello@tapmy.name</a>.
                    </p>

                    <p style="margin-top:30px; color:#6b5d57;">
                        <strong>Best regards,</strong><br>
                        The TapMyName Team
                    </p>
                </div>
                <div class="footer">
                    <p>This is an automated confirmation. Please do not reply to this email.</p>
                    <p>© ${new Date().getFullYear()} TapMyName. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        `;

        // ── Send both emails ─────────────────────────────────
        await Promise.all([
            transporter.sendMail({
                from: `"TapMyName Notifications" <${process.env.MAIL_USER}>`,
                to: "hello@tapmy.name",
                replyTo: email.trim(),
                subject: `📩 Contact Form: ${subject.trim()} — ${fullName}`,
                html: adminHtml
            }),
            transporter.sendMail({
                from: `"TapMyName Support" <${process.env.MAIL_USER}>`,
                to: email.trim(),
                subject: "We've received your message — TapMyName",
                html: userHtml
            })
        ]);

        console.log(`✅ Contact form submitted by ${fullName} (${email}) - Message ID: ${dbMessage.id}`);

        return res.status(200).json({
            success: true,
            message: "Your message has been sent. We'll be in touch within 24 hours.",
            messageId: dbMessage.id
        });

    } catch (err) {
        console.error("❌ Contact form error:", err);
        return res.status(500).json({
            message: "Failed to send your message. Please try again later.",
            error: process.env.NODE_ENV === "development" ? err.message : undefined
        });
    }
});

export default router;
