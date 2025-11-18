// routes/theme.js - Diagnostic Version

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

// Get all themes
router.get("/", async (req, res) => {
    try {
        const themes = await Theme.findAll({
            order: [['id', 'ASC']]
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

        // DIAGNOSTIC LOGGING
        console.log("\n========== PATH DIAGNOSTIC ==========");
        console.log("📍 __filename:", __filename);
        console.log("📍 __dirname:", __dirname);
        console.log("📍 CSS from DB:", theme.cssFile);

        // Try different path resolutions
        const pathAttempts = [
            { label: "Attempt 1 (up 1 level)", path: path.join(__dirname, "..", theme.cssFile) },
            { label: "Attempt 2 (up 2 levels)", path: path.join(__dirname, "../..", theme.cssFile) },
            { label: "Attempt 3 (up 3 levels)", path: path.join(__dirname, "../../..", theme.cssFile) },
            { label: "Attempt 4 (process.cwd)", path: path.join(process.cwd(), theme.cssFile) },
        ];

        let cssPath = null;
        let foundPath = null;

        for (const attempt of pathAttempts) {
            console.log(`\n${attempt.label}:`);
            console.log("  Path:", attempt.path);
            console.log("  Exists:", fs.existsSync(attempt.path) ? "✅ YES" : "❌ NO");

            if (fs.existsSync(attempt.path) && !foundPath) {
                foundPath = attempt.path;
                cssPath = attempt.path;
            }
        }

        console.log("\n====================================\n");

        if (!cssPath || !fs.existsSync(cssPath)) {
            console.error("❌ CSS file not found in any location!");
            return res.status(404).json({
                message: "Theme CSS file not found",
                triedPaths: pathAttempts.map(a => a.path)
            });
        }

        console.log("✅ Using CSS path:", cssPath);

        const cssContent = fs.readFileSync(cssPath, 'utf8');

        // Set proper headers for CSS
        res.setHeader('Content-Type', 'text/css; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
        res.setHeader('Access-Control-Allow-Origin', '*'); // Allow CORS for CSS

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

        // Get user's actual data for realistic preview
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

        // Use user's actual data or fallback to sample data
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

// Select theme with plan validation
router.post("/select", authenticateToken, async (req, res) => {
    try {
        const { themeId } = req.body;
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

        res.json({
            message: "Theme updated successfully",
            theme: {
                id: theme.id,
                name: theme.name,
                isPremium: theme.isPremium,
                cssFile: theme.cssFile
            }
        });

    } catch (err) {
        console.error("Theme update error:", err);
        res.status(500).json({ message: "Failed to update theme" });
    }
});

export default router;
