// routes/theme.js - UPDATED VERSION with Layout Integration

import express from "express";
import Theme from "../models/Theme.js";
import User from "../models/User.js";
import Company from "../models/Company.js";
import Contact from "../models/Contact.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Get all themes with layout information
router.get("/", async (req, res) => {
    try {
        const themes = await Theme.findAll({
            order: [['id', 'ASC']],
            attributes: ['id', 'name', 'description', 'previewImage', 'cssFile', 'isPremium', 'layoutType']
        });
        res.json(themes);
    } catch (err) {
        console.error("Error fetching themes:", err);
        res.status(500).json({ message: "Failed to load themes" });
    }
});

// Get theme CSS content (for live preview) - PUBLIC ROUTE
router.get("/:themeId/css", async (req, res) => {
    try {
        const theme = await Theme.findByPk(req.params.themeId);

        if (!theme) {
            return res.status(404).json({ message: "Theme not found" });
        }

        // Try different path resolutions
        const pathAttempts = [
            path.join(__dirname, "..", theme.cssFile),
            path.join(__dirname, "../..", theme.cssFile),
            path.join(process.cwd(), theme.cssFile),
            path.join(process.cwd(), "public", theme.cssFile)
        ];

        let cssPath = null;

        for (const attempt of pathAttempts) {
            if (fs.existsSync(attempt)) {
                cssPath = attempt;
                break;
            }
        }

        if (!cssPath) {
            console.error("❌ CSS file not found:", theme.cssFile);
            return res.status(404).json({
                message: "Theme CSS file not found",
                cssFile: theme.cssFile
            });
        }

        const cssContent = fs.readFileSync(cssPath, 'utf8');

        res.setHeader('Content-Type', 'text/css; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.setHeader('Access-Control-Allow-Origin', '*');

        res.send(cssContent);

    } catch (err) {
        console.error("Theme CSS error:", err);
        res.status(500).json({ message: "Failed to load theme CSS" });
    }
});

// Get theme preview data with user's actual data
router.get("/:themeId/preview", authenticateToken, async (req, res) => {
    try {
        const theme = await Theme.findByPk(req.params.themeId);

        if (!theme) {
            return res.status(404).json({ message: "Theme not found" });
        }

        const userId = req.user.id;
        const user = await User.findByPk(userId, {
            include: [
                {
                    model: Company,
                    as: 'companies',
                    limit: 1,
                    order: [['createdAt', 'DESC']]
                },
                {
                    model: Contact,
                    as: 'contacts',
                    limit: 1,
                    order: [['createdAt', 'DESC']]
                }
            ]
        });

        const contact = user.contacts?.[0] || {
            firstName: 'John',
            lastName: 'Doe',
            designation: 'CEO & Founder',
            mobile: '+1234567890',
            email: 'john@company.com',
            photo: null
        };

        const company = user.companies?.[0] || {
            companyName: 'Tech Solutions Inc.',
            bio: 'Leading the future of digital innovation',
            website: 'www.company.com',
            phone: '+1234567890',
            logo: null,
            googleLocation: 'https://maps.google.com',
            view360: null,
            googleReviews: null,
            layoutType: theme.layoutType || 'classic', // Use theme's layout
            socialLinks: {
                facebook: 'https://facebook.com',
                linkedin: 'https://linkedin.com',
                twitter: 'https://twitter.com'
            }
        };

        res.json({
            theme,
            contact,
            company
        });

    } catch (err) {
        console.error("Theme preview error:", err);
        res.status(500).json({ message: "Failed to load theme preview" });
    }
});

// ============================================
// NEW: Select theme with layout type update
// ============================================
router.post("/select", authenticateToken, async (req, res) => {
    try {
        const { themeId, applyLayout } = req.body; // applyLayout = true to update company layout
        const userId = req.user.id;

        if (!themeId) {
            return res.status(400).json({ message: "Theme ID is required" });
        }

        const user = await User.findByPk(userId);
        const theme = await Theme.findByPk(themeId);

        if (!theme) {
            return res.status(404).json({ message: "Theme not found" });
        }

        // Check if theme is premium and user has free plan
        if (theme.isPremium && user.plan === 'free') {
            return res.status(403).json({
                message: "This theme is only available for premium users. Please upgrade your plan.",
                isPremium: true
            });
        }

        // Update user's selected theme
        await user.update({ selectedThemeId: themeId });

        // ============================================
        // NEW: Update company layout if applyLayout is true
        // ============================================
        if (applyLayout && theme.layoutType) {
            const companies = await Company.findAll({
                where: { userId: userId }
            });

            for (const company of companies) {
                await company.update({ layoutType: theme.layoutType });
            }
        }

        res.json({
            message: "Theme updated successfully",
            theme: {
                id: theme.id,
                name: theme.name,
                isPremium: theme.isPremium,
                cssFile: theme.cssFile,
                layoutType: theme.layoutType
            },
            layoutUpdated: applyLayout && theme.layoutType ? true : false
        });

    } catch (err) {
        console.error("Theme update error:", err);
        res.status(500).json({ message: "Failed to update theme" });
    }
});

// routes/theme.js - Add this PATCH route

// ============================================
// UPDATE THEME LAYOUT TYPE
// ============================================
router.patch("/:themeId", authenticateToken, async (req, res) => {
    try {
        const { themeId } = req.params;
        const { layoutType } = req.body;

        // Validate layoutType
        const validLayouts = ['classic', 'modern', 'compact', 'minimal'];
        if (!validLayouts.includes(layoutType)) {
            return res.status(400).json({
                message: "Invalid layout type. Must be: classic, modern, compact, or minimal"
            });
        }

        // Get user's selected theme
        const user = await User.findByPk(req.user.id);

        if (user.selectedThemeId !== themeId) {
            return res.status(403).json({
                message: "You can only update your currently selected theme's layout"
            });
        }

        // Find and update the theme
        const theme = await Theme.findByPk(themeId);

        if (!theme) {
            return res.status(404).json({
                message: "Theme not found"
            });
        }

        // Update layoutType
        await theme.update({ layoutType });

        res.json({
            success: true,
            message: "Layout updated successfully",
            theme: {
                id: theme.id,
                name: theme.name,
                layoutType: theme.layoutType,
                cssFile: theme.cssFile
            }
        });

    } catch (err) {
        console.error("Theme layout update error:", err);
        res.status(500).json({
            message: "Failed to update layout",
            error: err.message
        });
    }
});


export default router;
