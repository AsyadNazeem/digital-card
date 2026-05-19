import express from "express";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import https from "https";
import http from "http";
import { fileURLToPath } from "url";
import { authenticateToken } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import { PKPass } from "passkit-generator";
import { buildThumbnail, buildStrip, buildLogo } from "../controllers/passImageComposer.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* -------------------------------------------------------
   PROJECT PATHS
------------------------------------------------------- */

const PROJECT_ROOT = path.resolve(__dirname, "../../../");

const APPLE_CERTS_PATH = path.join(PROJECT_ROOT, "certs");
const APPLE_TEMPLATE_PATH = path.join(PROJECT_ROOT, "pass-template.pass");

const wwdrPath = path.join(APPLE_CERTS_PATH, "wwdr.pem");
const signerCertPath = path.join(APPLE_CERTS_PATH, "signerCert.pem");
const signerKeyPath = path.join(APPLE_CERTS_PATH, "signerKey.pem");

/* -------------------------------------------------------
   APPLE WALLET CONFIG
------------------------------------------------------- */

const PASS_TYPE_ID = process.env.PASS_TYPE_ID;
const TEAM_ID = process.env.APPLE_TEAM_ID;

const APPLE_CONFIGURED =
    !!PASS_TYPE_ID &&
    !!TEAM_ID &&
    fs.existsSync(wwdrPath) &&
    fs.existsSync(signerCertPath) &&
    fs.existsSync(signerKeyPath);

/* -------------------------------------------------------
   GOOGLE WALLET CONFIG
------------------------------------------------------- */

const serviceAccountPath = path.join(
    __dirname,
    "../config/tapmyname-06b39e405c92.json"
);

const SERVICE_ACCOUNT = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

const ISSUER_ID = process.env.GW_ISSUER_ID;
const CLASS_SUFFIX = process.env.GW_WALLET_CLASS_ID;
const ORIGINS = (process.env.GW_ORIGINS || "").split(",").filter(Boolean);

const IMAGE_BASE_URL =
    process.env.IMAGE_UPLOAD_URL || "https://tapmy.name";

/* ═══════════════════════════════════════════════════════════
   ✅ PLAN-BASED ACCESS VALIDATION MIDDLEWARE
═══════════════════════════════════════════════════════════ */

/**
 * Middleware to validate wallet access based on user plan
 * Free plan users are blocked, paid plan users have access
 */
async function validateWalletAccess(req, res, next) {
    try {
        const user = await User.findByPk(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // ✅ Block free plan users
        if (user.plan === 'free') {
            console.warn(`[WALLET BLOCKED] User ${req.userId} on free plan attempted wallet access`);

            return res.status(403).json({
                message: "Wallet features are only available on paid plans. Please upgrade to use Google Wallet or Apple Wallet.",
                feature: "wallet",
                requiresUpgrade: true,
                currentPlan: "free",
                accessDenied: true
            });
        }

        // ✅ Attach user plan to request for logging
        req.userPlan = user.plan;

        console.log(`[WALLET ACCESS GRANTED] User ${req.userId} on ${user.plan} plan`);

        next();

    } catch (err) {
        console.error("❌ Wallet access validation error:", err);
        res.status(500).json({
            message: "Error validating wallet access",
            error: err.message
        });
    }
}

/* ═══════════════════════════════════════════════════════════
   ✅ WALLET ACCESS CHECK ENDPOINT (For Frontend)
═══════════════════════════════════════════════════════════ */

/**
 * GET /wallet/access-check
 * Returns user's wallet access status and available features
 */
router.get("/access-check", authenticateToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const hasWalletAccess = user.plan !== 'free';

        return res.json({
            currentPlan: user.plan || 'free',
            hasWalletAccess: hasWalletAccess,
            features: {
                googleWallet: hasWalletAccess,
                appleWallet: hasWalletAccess,
                googleWalletLink: hasWalletAccess,
                appleWalletFile: hasWalletAccess
            },
            planName: user.plan === 'free' ? 'Free' : (user.plan?.charAt(0).toUpperCase() + user.plan?.slice(1))
        });

    } catch (err) {
        console.error("❌ Access check error:", err);
        res.status(500).json({
            message: "Error checking wallet access",
            error: err.message
        });
    }
});

/* -------------------------------------------------------
   HELPER: IMAGE LOADER
------------------------------------------------------- */

async function loadImageBuffer(imagePath) {
    try {
        if (!imagePath) return null;

        if (imagePath.startsWith("http")) {
            const client = imagePath.startsWith("https") ? https : http;

            return await new Promise((resolve, reject) => {
                client.get(imagePath, res => {
                    const data = [];

                    res.on("data", chunk => data.push(chunk));

                    res.on("end", () => resolve(Buffer.concat(data)));

                    res.on("error", reject);
                });
            });
        }

        const safePath = imagePath.replace(/^\/+/, "");
        const localPath = path.join(PROJECT_ROOT, safePath);

        if (fs.existsSync(localPath)) {
            return fs.readFileSync(localPath);
        }

        return null;

    } catch {
        return null;
    }
}

/* -------------------------------------------------------
   GOOGLE WALLET JWT
------------------------------------------------------- */

function createSaveJwtForContact({ objectIdSuffix, contact }) {

    const now = Math.floor(Date.now() / 1000);

    const classId = `${ISSUER_ID}.${CLASS_SUFFIX}`;
    const objectId = `${ISSUER_ID}.${objectIdSuffix}_${Date.now()}`;

    let logoUrl = null;
    let heroImageUrl = null;

    // COMPANY LOGO
    if (contact.companyLogo?.trim()) {

        logoUrl = contact.companyLogo.startsWith("http")
            ? contact.companyLogo
            : `${IMAGE_BASE_URL}${contact.companyLogo}`;

    }
    // FALLBACK TO PROFILE PHOTO
    else if (contact.photo?.trim()) {

        logoUrl = contact.photo.startsWith("http")
            ? contact.photo
            : `${IMAGE_BASE_URL}${contact.photo}`;

    }

    // HERO IMAGE
    if (contact.photo?.trim()) {

        heroImageUrl = contact.photo.startsWith("http")
            ? contact.photo
            : `${IMAGE_BASE_URL}${contact.photo}`;

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
                    classId,
                    state: "ACTIVE",

                    ...(logoUrl && {
                        logo: {
                            sourceUri: { uri: logoUrl },
                            contentDescription: {
                                defaultValue: {
                                    language: "en-US",
                                    value: "Company Logo",
                                },
                            },
                        },
                    }),

                    ...(heroImageUrl && {
                        heroImage: {
                            sourceUri: { uri: heroImageUrl },
                            contentDescription: {
                                defaultValue: {
                                    language: "en-US",
                                    value: "Profile Photo",
                                },
                            },
                        },
                    }),

                    cardTitle: {
                        defaultValue: {
                            language: "en-US",
                            value: contact.name || "Contact Card",
                        },
                    },

                    header: {
                        defaultValue: {
                            language: "en-US",
                            value: contact.designation || "Digital Business Card",
                        },
                    },

                    subheader: contact.companyName
                        ? {
                            defaultValue: {
                                language: "en-US",
                                value: contact.companyName,
                            },
                        }
                        : undefined,

                    barcode: contact.shareUrl
                        ? {
                            type: "QR_CODE",
                            value: contact.shareUrl,
                        }
                        : undefined,

                    textModulesData: [
                        contact.phone
                            ? {
                                id: "phone",
                                header: "Phone",
                                body: contact.phone,
                            }
                            : null,

                        contact.email
                            ? {
                                id: "email",
                                header: "Email",
                                body: contact.email,
                            }
                            : null,
                    ].filter(Boolean),
                },
            ],
        },
    };

    const signedJwt = jwt.sign(jwtPayload, SERVICE_ACCOUNT.private_key, {
        algorithm: "RS256",
        keyid: SERVICE_ACCOUNT.private_key_id,
    });

    return {
        saveUrl: `https://pay.google.com/gp/v/save/${signedJwt}`,
    };
}

/* ═══════════════════════════════════════════════════════════
   ✅ GOOGLE WALLET ROUTES (WITH PLAN VALIDATION)
═══════════════════════════════════════════════════════════ */

router.post("/google/save-url", authenticateToken, validateWalletAccess, async (req, res) => {
    try {

        const { contact, objectIdSuffix } = req.body;

        if (!contact) {
            return res.status(400).json({ message: "contact required" });
        }

        const suffix = objectIdSuffix || `contact_${req.userId}`;

        const { saveUrl } = createSaveJwtForContact({
            objectIdSuffix: suffix,
            contact,
        });

        res.json({ saveUrl });

    } catch (err) {

        console.error("Google Wallet error:", err);

        res.status(500).json({
            message: "Failed to generate Google Wallet URL",
            error: err.message,
        });

    }
});

/* ═══════════════════════════════════════════════════════════
   ✅ APPLE WALLET STATUS (No restriction needed)
═══════════════════════════════════════════════════════════ */

router.get("/apple/status", (req, res) => {

    res.json({
        success: true,
        configured: APPLE_CONFIGURED,
        message: APPLE_CONFIGURED
            ? "Apple Wallet is ready"
            : "Apple Wallet credentials missing",
    });

});

/* ═══════════════════════════════════════════════════════════
   ✅ APPLE WALLET PASS (WITH PLAN VALIDATION)
═══════════════════════════════════════════════════════════ */

router.post("/apple/pass", authenticateToken, validateWalletAccess, async (req, res) => {
    try {

        if (!APPLE_CONFIGURED) {
            return res.status(503).json({ message: "Apple Wallet not configured" });
        }

        const { contact } = req.body;

        if (!contact) {
            return res.status(400).json({ message: "contact required" });
        }

        const pass = await PKPass.from(
            {
                model: APPLE_TEMPLATE_PATH,
                certificates: {
                    wwdr: fs.readFileSync(wwdrPath),
                    signerCert: fs.readFileSync(signerCertPath),
                    signerKey: fs.readFileSync(signerKeyPath),
                    ...(process.env.CERT_PASSWORD
                        ? { signerKeyPassphrase: process.env.CERT_PASSWORD }
                        : {}),
                },
            },
            {
                serialNumber: `contact-${Date.now()}`,
                description: "Digital Business Card",
                organizationName: contact.companyName || "TapMyName",
                passTypeIdentifier: PASS_TYPE_ID,
                teamIdentifier: TEAM_ID,

                foregroundColor: "rgb(255,255,255)",
                backgroundColor: "rgb(0,0,0)",
                labelColor: "rgb(180,180,180)",

                logoText: contact.companyName || contact.name,
            }
        );

        pass.type = "generic";

        /* ---------------------------
           CARD FRONT
        --------------------------- */

        pass.primaryFields.push({
            key: "name",
            label: "",
            value: contact.name || "",
        });

        pass.secondaryFields.push(
            {
                key: "title",
                label: "TITLE",
                value: contact.designation || "",
            },
            {
                key: "company",
                label: "COMPANY",
                value: contact.companyName || "",
            }
        );

        if (contact.phone) {
            pass.auxiliaryFields.push({
                key: "phone",
                label: "PHONE",
                value: contact.phone,
            });
        }

        if (contact.email) {
            pass.auxiliaryFields.push({
                key: "email",
                label: "EMAIL",
                value: contact.email,
            });
        }

        /* ---------------------------
           BACK OF CARD
        --------------------------- */

        if (contact.phone) {
            pass.backFields.push({
                key: "phone",
                label: "Call",
                value: contact.phone,
                attributedValue: `<a href="tel:${contact.phone}">${contact.phone}</a>`,
            });
        }

        if (contact.email) {
            pass.backFields.push({
                key: "email",
                label: "Email",
                value: contact.email,
                attributedValue: `<a href="mailto:${contact.email}">${contact.email}</a>`,
            });
        }

        if (contact.website) {
            pass.backFields.push({
                key: "website",
                label: "Website",
                value: contact.website,
                attributedValue: `<a href="${contact.website}">${contact.website}</a>`,
            });
        }

        if (contact.shareUrl) {
            pass.backFields.push({
                key: "card",
                label: "Digital Card",
                value: contact.shareUrl,
                attributedValue: `<a href="${contact.shareUrl}">Open Digital Card</a>`,
            });
        }

        /* ---------------------------
           QR CODE
        --------------------------- */

        if (contact.shareUrl) {
            pass.setBarcodes({
                message: contact.shareUrl,
                format: "PKBarcodeFormatQR",
                messageEncoding: "iso-8859-1",
                altText: "Scan to open digital card",
            });
        }

        /* ---------------------------
           LOAD RAW IMAGE BUFFERS
        --------------------------- */

        const [rawPhoto, rawLogo] = await Promise.all([
            contact.photo   ? loadImageBuffer(contact.photo)       : Promise.resolve(null),
            contact.companyLogo ? loadImageBuffer(contact.companyLogo) : Promise.resolve(null),
        ]);

        /* ---------------------------
           THUMBNAIL  (circular, white ring)
           Uses buildThumbnail() from passImageComposer
        --------------------------- */

        if (rawPhoto) {
            const thumbnail = await buildThumbnail(rawPhoto);
            if (thumbnail) {
                pass.addBuffer("thumbnail.png",   thumbnail);
                pass.addBuffer("thumbnail@2x.png", thumbnail);
                pass.addBuffer("thumbnail@3x.png", thumbnail);
            }
        }

        /* ---------------------------
           LOGO  (company logo or styled wordmark)
           Uses buildLogo() from passImageComposer
        --------------------------- */

        const logo = await buildLogo(rawLogo, contact.companyName || contact.name);
        if (logo) {
            pass.addBuffer("logo.png",   logo);
            pass.addBuffer("logo@2x.png", logo);
            pass.addBuffer("logo@3x.png", logo);
        }

        /* ---------------------------
           STRIP BANNER  (dark gradient + photo + name/title/company)
           Uses buildStrip() from passImageComposer
        --------------------------- */

        const strip = await buildStrip(contact, rawPhoto, rawLogo);
        if (strip) {
            pass.addBuffer("strip.png",   strip);
            pass.addBuffer("strip@2x.png", strip);
            pass.addBuffer("strip@3x.png", strip);
        }

        /* ---------------------------
           GENERATE PASS
        --------------------------- */

        const buffer = pass.getAsBuffer();

        res.set({
            "Content-Type": "application/vnd.apple.pkpass",
            "Content-Disposition": "attachment; filename=contact.pkpass",
            "Content-Length": buffer.length,
        });

        res.send(buffer);

    } catch (err) {

        console.error("Apple Wallet error:", err);

        res.status(500).json({
            message: "Failed to generate Apple Wallet pass",
            error: err.message,
        });

    }
});

export default router;
