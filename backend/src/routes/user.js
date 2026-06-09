import express from "express";
import Message from "../models/Message.js";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/contact-form", async (req, res) => {
    try {
        const { firstName, lastName, email, subject, message } = req.body;

        if (!firstName || !email || !message) {
            return res.status(400).json({ message: "Name, email, and message are required" });
        }

        const fullName = `${firstName} ${lastName || ""}`.trim();
        const subjectLine = subject || "General Enquiry";

        // 1. Save to Message table
        await Message.create({
            userId:       null,               // public form, no user account
            senderName:   fullName,
            senderEmail:  email,
            subject:      subjectLine,
            body:         message,
            isRead:       false,
            messageType:  "contact",
            planRequest:  null,
        });

        // 2. Send email notification
        const transporter = nodemailer.createTransport({
            host:   process.env.MAIL_HOST || "smtp.zoho.com",
            port:   parseInt(process.env.MAIL_PORT) || 465,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        await transporter.sendMail({
            from:    `"TapMyName Contact Form" <${process.env.MAIL_USER}>`,
            to:      "hello@tapmyname.com",
            replyTo: email,
            subject: `📬 New Contact Form Message — ${subjectLine}`,
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header {
              background: linear-gradient(135deg, #5c4033 0%, #3e2a23 100%);
              color: white; padding: 24px; text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #fff; padding: 28px;
              border: 1px solid #e5e1dc; border-top: none;
              border-radius: 0 0 10px 10px;
            }
            .info-table { width: 100%; border-collapse: collapse; margin: 16px 0; }
            .info-table td { padding: 10px 14px; border-bottom: 1px solid #f0ece8; font-size: 14px; }
            .info-table td:first-child {
              font-weight: bold; color: #5c4033;
              width: 35%; background: #fafaf8;
            }
            .message-box {
              background: #fafaf8; border-left: 4px solid #5c4033;
              padding: 16px; margin: 20px 0; border-radius: 0 6px 6px 0;
              white-space: pre-wrap; font-size: 14px; color: #444;
            }
            .footer {
              text-align: center; color: #9b8b7e; font-size: 12px;
              margin-top: 20px; padding-top: 16px; border-top: 1px solid #e5e1dc;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin:0; color:#f5e6d3;">New Contact Form Submission</h2>
            </div>
            <div class="content">
              <table class="info-table">
                <tr><td>Name</td><td>${fullName}</td></tr>
                <tr><td>Email</td><td>${email}</td></tr>
                <tr><td>Subject</td><td>${subjectLine}</td></tr>
                <tr><td>Sent At</td><td>${new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</td></tr>
              </table>
              <p style="font-weight:bold; color:#5c4033; margin-bottom:6px;">Message:</p>
              <div class="message-box">${message}</div>
              <p style="color:#6b5d57; font-size:13px;">
                Reply directly to this email to respond to ${fullName}.
              </p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} TapMyName. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
        });

        return res.json({ success: true, message: "Message sent successfully" });
    } catch (err) {
        console.error("❌ Contact form error:", err);
        return res.status(500).json({ message: "Failed to send message", error: err.message });
    }
});

export default router;
