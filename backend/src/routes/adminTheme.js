// routes/adminTheme.js - Admin Theme Management Routes

import express from "express";
import Theme from "../models/Theme.js";
import { authenticateAdmin } from "../middleware/adminAuth.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'cssFile') {
            const cssDir = path.join(__dirname, "../../uploads/themes");
            if (!fs.existsSync(cssDir)) {
                fs.mkdirSync(cssDir, { recursive: true });
            }
            cb(null, cssDir);
        } else if (file.fieldname === 'previewImage') {
            const imgDir = path.join(__dirname, "../../uploads/themes");
            if (!fs.existsSync(imgDir)) {
                fs.mkdirSync(imgDir, { recursive: true });
            }
            cb(null, imgDir);
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, name + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        if (file.fieldname === 'cssFile') {
            // Only allow CSS files
            if (path.extname(file.originalname).toLowerCase() !== '.css') {
                return cb(new Error('Only CSS files are allowed for cssFile'));
            }
        } else if (file.fieldname === 'previewImage') {
            // Only allow image files
            const allowedTypes = /jpeg|jpg|png|gif|webp/;
            const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
            const mimetype = allowedTypes.test(file.mimetype);

            if (!extname || !mimetype) {
                return cb(new Error('Only image files are allowed for previewImage'));
            }
        }
        cb(null, true);
    }
});

// Get all themes (Admin)
router.get("/", authenticateAdmin, async (req, res) => {
    try {
        const themes = await Theme.findAll({
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            themes
        });
    } catch (err) {
        console.error("Error fetching themes:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch themes"
        });
    }
});

// Add new theme (Admin)
router.post("/",
    authenticateAdmin,
    upload.fields([
        { name: 'cssFile', maxCount: 1 },
        { name: 'previewImage', maxCount: 1 }
    ]),
    async (req, res) => {
        try {
            const { name, description, isPremium } = req.body;

            // Validate required fields
            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: "Theme name is required"
                });
            }

            if (!req.files?.cssFile) {
                return res.status(400).json({
                    success: false,
                    message: "CSS file is required"
                });
            }

            if (!req.files?.previewImage) {
                return res.status(400).json({
                    success: false,
                    message: "Preview image is required"
                });
            }

            // Build file paths (relative to backend root)
            const cssFile = `/uploads/themes/${req.files.cssFile[0].filename}`;
            const previewImage = `/uploads/theme-previews/${req.files.previewImage[0].filename}`;

            // Create theme
            const theme = await Theme.create({
                name,
                description: description || null,
                cssFile,
                previewImage,
                isPremium: isPremium === 'true' || isPremium === true
            });

            console.log("✅ Theme created:", theme.id);

            res.status(201).json({
                success: true,
                message: "Theme created successfully",
                theme
            });

        } catch (err) {
            console.error("Error creating theme:", err);

            // Clean up uploaded files if theme creation fails
            if (req.files?.cssFile) {
                fs.unlinkSync(req.files.cssFile[0].path);
            }
            if (req.files?.previewImage) {
                fs.unlinkSync(req.files.previewImage[0].path);
            }

            res.status(500).json({
                success: false,
                message: err.message || "Failed to create theme"
            });
        }
    }
);

// Update theme (Admin)
router.put("/:id",
    authenticateAdmin,
    upload.fields([
        { name: 'cssFile', maxCount: 1 },
        { name: 'previewImage', maxCount: 1 }
    ]),
    async (req, res) => {
        try {
            const { id } = req.params;
            const { name, description, isPremium } = req.body;

            const theme = await Theme.findByPk(id);

            if (!theme) {
                return res.status(404).json({
                    success: false,
                    message: "Theme not found"
                });
            }

            // Update fields
            const updateData = {
                name: name || theme.name,
                description: description !== undefined ? description : theme.description,
                isPremium: isPremium === 'true' || isPremium === true
            };

            // Update CSS file if provided
            if (req.files?.cssFile) {
                // Delete old CSS file
                const oldCssPath = path.join(__dirname, "..", theme.cssFile);
                if (fs.existsSync(oldCssPath)) {
                    fs.unlinkSync(oldCssPath);
                }

                updateData.cssFile = `/uploads/themes/${req.files.cssFile[0].filename}`;
            }

            // Update preview image if provided
            if (req.files?.previewImage) {
                // Delete old preview image
                const oldImagePath = path.join(__dirname, "..", theme.previewImage);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }

                updateData.previewImage = `/uploads/theme-previews/${req.files.previewImage[0].filename}`;
            }

            await theme.update(updateData);

            console.log("✅ Theme updated:", id);

            res.json({
                success: true,
                message: "Theme updated successfully",
                theme
            });

        } catch (err) {
            console.error("Error updating theme:", err);

            // Clean up uploaded files if update fails
            if (req.files?.cssFile) {
                fs.unlinkSync(req.files.cssFile[0].path);
            }
            if (req.files?.previewImage) {
                fs.unlinkSync(req.files.previewImage[0].path);
            }

            res.status(500).json({
                success: false,
                message: err.message || "Failed to update theme"
            });
        }
    }
);

// Delete theme (Admin)
router.delete("/:id", authenticateAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const theme = await Theme.findByPk(id);

        if (!theme) {
            return res.status(404).json({
                success: false,
                message: "Theme not found"
            });
        }

        // Delete CSS file
        const cssPath = path.join(__dirname, "..", theme.cssFile);
        if (fs.existsSync(cssPath)) {
            fs.unlinkSync(cssPath);
            console.log("🗑️ Deleted CSS file:", cssPath);
        }

        // Delete preview image
        const imagePath = path.join(__dirname, "..", theme.previewImage);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
            console.log("🗑️ Deleted preview image:", imagePath);
        }

        // Delete theme from database
        await theme.destroy();

        console.log("✅ Theme deleted:", id);

        res.json({
            success: true,
            message: "Theme deleted successfully"
        });

    } catch (err) {
        console.error("Error deleting theme:", err);
        res.status(500).json({
            success: false,
            message: "Failed to delete theme"
        });
    }
});

// Get single theme (Admin)
router.get("/:id", authenticateAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const theme = await Theme.findByPk(id);

        if (!theme) {
            return res.status(404).json({
                success: false,
                message: "Theme not found"
            });
        }

        res.json({
            success: true,
            theme
        });

    } catch (err) {
        console.error("Error fetching theme:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch theme"
        });
    }
});

export default router;
