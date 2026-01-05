// routes/wallet.js - WITH ANALYTICS TRACKING
import express from "express";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = path.join(__dirname, "../config/tapmyname-06b39e405c92.json");
const SERVICE_ACCOUNT = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

const ISSUER_ID = process.env.GW_ISSUER_ID;
const CLASS_SUFFIX = process.env.GW_WALLET_CLASS_ID;
const ORIGINS = (process.env.GW_ORIGINS || "").split(",").filter(Boolean);
const IMAGE_BASE_URL = process.env.IMAGE_UPLOAD_URL || "https://tapmy.name";
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'local';

function createSaveJwtForContact({ objectIdSuffix, contact }) {
    if (!SERVICE_ACCOUNT?.private_key) throw new Error("Missing service account private key");
    if (!ISSUER_ID) throw new Error("ISSUER_ID missing");
    if (!CLASS_SUFFIX) throw new Error("GW_WALLET_CLASS_ID missing");
    if (!ORIGINS.length) throw new Error("GW_ORIGINS missing");

    const now = Math.floor(Date.now() / 1000);
    const classId = `${ISSUER_ID}.${CLASS_SUFFIX}`;
    const objectId = `${ISSUER_ID}.${objectIdSuffix}_${Date.now()}`;

    console.log("🎫 Creating wallet object:", { classId, objectId });

    // Build image URLs
    let logoUrl = null;
    let heroImageUrl = null;

    if (contact.companyLogo && contact.companyLogo.trim()) {
        logoUrl = contact.companyLogo.startsWith('http')
            ? contact.companyLogo
            : `${IMAGE_BASE_URL}${contact.companyLogo}`;
    } else if (contact.photo && contact.photo.trim()) {
        logoUrl = contact.photo.startsWith('http')
            ? contact.photo
            : `${IMAGE_BASE_URL}${contact.photo}`;
    }

    if (contact.photo && contact.photo.trim()) {
        heroImageUrl = contact.photo.startsWith('http')
            ? contact.photo
            : `${IMAGE_BASE_URL}${contact.photo}`;
    }

    console.log("📸 Image URLs:", {
        logoUrl,
        heroImageUrl,
        IMAGE_BASE_URL,
        IS_DEVELOPMENT,
        companyLogo: contact.companyLogo,
        photo: contact.photo
    });

    const isValidUrl = (url) => {
        try {
            const parsed = new URL(url);
            if (IS_DEVELOPMENT) {
                return parsed.protocol === 'https:' || parsed.protocol === 'http:';
            } else {
                return parsed.protocol === 'https:';
            }
        } catch {
            return false;
        }
    };

    if (logoUrl && !isValidUrl(logoUrl)) {
        console.warn("⚠️ Invalid logo URL, removing:", logoUrl);
        logoUrl = null;
    }

    if (heroImageUrl && !isValidUrl(heroImageUrl)) {
        console.warn("⚠️ Invalid hero image URL, removing:", heroImageUrl);
        heroImageUrl = null;
    }

    if (!IS_DEVELOPMENT) {
        if (logoUrl && !logoUrl.startsWith('https://')) {
            console.warn("🚫 Production requires HTTPS for logo, removing:", logoUrl);
            logoUrl = null;
        }
        if (heroImageUrl && !heroImageUrl.startsWith('https://')) {
            console.warn("🚫 Production requires HTTPS for hero image, removing:", heroImageUrl);
            heroImageUrl = null;
        }
    }

    const jwtPayload = {
        iss: SERVICE_ACCOUNT.client_email,
        aud: "google",
        typ: "savetowallet",
        iat: now,
        exp: now + 3600,
        origins: ORIGINS,
        payload: {
            genericObjects: [
                {
                    id: objectId,
                    classId: classId,
                    state: "ACTIVE",

                    ...(logoUrl ? {
                        logo: {
                            sourceUri: { uri: logoUrl },
                            contentDescription: {
                                defaultValue: {
                                    language: "en-US",
                                    value: "Company Logo"
                                }
                            }
                        }
                    } : {}),

                    ...(heroImageUrl ? {
                        heroImage: {
                            sourceUri: { uri: heroImageUrl },
                            contentDescription: {
                                defaultValue: {
                                    language: "en-US",
                                    value: "Profile Photo"
                                }
                            }
                        }
                    } : {}),

                    cardTitle: {
                        defaultValue: {
                            language: "en-US",
                            value: contact.name ||
                                `${contact.firstName || ""} ${contact.lastName || ""}`.trim() ||
                                "Contact Card"
                        }
                    },

                    header: {
                        defaultValue: {
                            language: "en-US",
                            value: contact.designation || "Digital Business Card"
                        }
                    },

                    subheader: contact.companyName ? {
                        defaultValue: {
                            language: "en-US",
                            value: contact.companyName
                        }
                    } : undefined,

                    barcode: contact.shareUrl ? {
                        type: "QR_CODE",
                        value: contact.shareUrl,
                        alternateText: "Scan to view card"
                    } : undefined,

                    textModulesData: [
                        contact.phone ? {
                            id: "phone",
                            header: "Phone",
                            body: contact.phone
                        } : null,
                        contact.email ? {
                            id: "email",
                            header: "Email",
                            body: contact.email
                        } : null,
                    ].filter(Boolean),

                    linksModuleData: {
                        uris: [
                            contact.shareUrl ? {
                                id: "view_card",
                                uri: contact.shareUrl,
                                description: "View Digital Card"
                            } : null,
                            contact.phone ? {
                                id: "call",
                                uri: `tel:${contact.phone.replace(/\D/g, '')}`,
                                description: "Call Now"
                            } : null,
                        ].filter(Boolean)
                    }
                }
            ]
        }
    };

    try {
        const signedJwt = jwt.sign(jwtPayload, SERVICE_ACCOUNT.private_key, {
            algorithm: "RS256",
            keyid: SERVICE_ACCOUNT.private_key_id
        });

        console.log("✅ JWT created successfully");
        return { saveUrl: `https://pay.google.com/gp/v/save/${signedJwt}` };
    } catch (err) {
        console.error("❌ JWT signing failed:", err);
        throw err;
    }
}

router.post("/google/save-url", authenticateToken, async (req, res) => {
    try {
        const { contact, objectIdSuffix } = req.body;

        if (!contact) return res.status(400).json({ message: "contact object required" });
        if (!contact.shareUrl) return res.status(400).json({ message: "contact.shareUrl required" });

        console.log("📱 Processing wallet request:", {
            userId: req.userId,
            contactName: contact.name,
            shareUrl: contact.shareUrl,
            hasLogo: !!contact.companyLogo,
            hasPhoto: !!contact.photo,
            environment: IS_DEVELOPMENT ? 'development' : 'production'
        });

        const suffix = objectIdSuffix || `contact_${req.userId}`;
        const { saveUrl } = createSaveJwtForContact({ objectIdSuffix: suffix, contact });

        console.log("✅ Save URL generated");
        return res.json({ saveUrl });

    } catch (err) {
        console.error("❌ Wallet error:", {
            message: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });

        return res.status(500).json({
            message: "Failed to generate Google Wallet URL",
            error: err.message
        });
    }
});

// NEW: Track Google Wallet clicks (public endpoint - no auth required)
router.post("/google/track/:phone", async (req, res) => {
    try {
        const phone = req.params.phone;
        const { userAgent } = req.body;

        console.log("👛 Google Wallet click tracked:", {
            phone,
            userAgent: userAgent || req.headers['user-agent']
        });

        // Import analytics tracking function
        const { trackWalletClick } = await import("../controllers/analyticsController.js");

        // Use the analytics tracking
        await trackWalletClick(phone, {
            userAgent: userAgent || req.headers['user-agent'],
            ip: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress
        });

        res.status(200).json({ success: true });
    } catch (err) {
        console.error("❌ Wallet tracking error:", err);
        // Don't fail the request if tracking fails
        res.status(200).json({ success: true, warning: "Tracking failed" });
    }
});

export default router;
