import express from "express";
import User from "../models/User.js";
import Company from "../models/Company.js";
import Contact from "../models/Contact.js";
import Theme from "../models/Theme.js";
import nodemailer from "nodemailer";

const router = express.Router();

// Email transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});



// API endpoint for Vue app to fetch contact data
router.get("/:mobile", async (req, res) => {
    try {
        let mobile = "+" + req.params.mobile;

        const contact = await Contact.findOne({
            where: { mobile, status: "active" }
        });

        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }

        const company = await Company.findByPk(contact.companyId);

        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        const user = await User.findByPk(company.userId, {
            include: [{
                model: Theme,
                as: "theme",
                attributes: ['id', 'name', 'cssFile', 'isPremium']
            }]
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return the data as JSON for Vue app
        res.json({
            company,
            contact,
            theme: user.theme || null
        });

    } catch (err) {
        res.status(500).json({
            message: "Failed to load public card",
            error: err.message
        });
    }
});

// ✅ Submit public contact message
router.post("/contact-message", async (req, res) => {
    try {
        const { recipientEmail, recipientName, senderName, senderEmail, subject, message, contactPhone } = req.body;

        // Validate input
        if (!recipientEmail || !senderName || !senderEmail || !subject || !message) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(senderEmail) || !emailRegex.test(recipientEmail)) {
            return res.status(400).json({
                message: "Invalid email format"
            });
        }

        if (senderName.length > 100 || subject.length > 200 || message.length > 1000) {
            return res.status(400).json({
                message: "Input exceeds maximum length"
            });
        }

        // Email content to recipient (contact owner)
        const mailOptions = {
            from: process.env.MAIL_USER,
            to: recipientEmail,
            replyTo: senderEmail,
            subject: `New Message: ${subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #333; border-bottom: 2px solid #10b981; padding-bottom: 10px;">📬 New Message from Your Digital Card</h2>
                    
                    <div style="margin: 20px 0;">
                        <h3 style="color: #10b981; margin-bottom: 10px;">From:</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px; background: #f9f9f9; font-weight: bold; width: 100px;">Name:</td>
                                <td style="padding: 8px; background: #fff;">${senderName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; background: #f9f9f9; font-weight: bold;">Email:</td>
                                <td style="padding: 8px; background: #fff;"><a href="mailto:${senderEmail}">${senderEmail}</a></td>
                            </tr>
                        </table>
                    </div>

                    <div style="margin: 20px 0;">
                        <h3 style="color: #10b981; margin-bottom: 10px;">Subject:</h3>
                        <p style="background: #f9f9f9; padding: 12px; border-radius: 5px; margin: 0; font-weight: 600;">${subject}</p>
                    </div>

                    <div style="margin: 20px 0;">
                        <h3 style="color: #10b981; margin-bottom: 10px;">Message:</h3>
                        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; line-height: 1.6;">
                            ${message.replace(/\n/g, '<br>')}
                        </div>
                    </div>

                    <div style="margin-top: 20px; padding: 15px; background: #d1fae5; border-left: 4px solid #10b981; border-radius: 5px;">
                        <p style="margin: 0; color: #065f46; font-weight: bold;">💡 Tip: Click Reply to respond directly to ${senderName}</p>
                    </div>

                    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; text-align: center;">
                        <p>This message was sent via your TapMyName digital business card</p>
                        <p>Received on: ${new Date().toLocaleString()}</p>
                    </div>
                </div>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.json({
            success: true,
            message: "Your message has been sent successfully!"
        });

    } catch (err) {
        console.error("❌ Contact message error:", err);
        res.status(500).json({
            message: "Failed to send message. Please try again later.",
            error: err.message
        });
    }
});

export default router;
