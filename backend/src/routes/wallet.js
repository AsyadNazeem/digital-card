// routes/wallet.js
import express from "express";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";
import { authenticateToken } from "../middleware/authMiddleware.js"; // you already have this

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load service account JSON
const serviceAccountPath = path.join(__dirname, "../config/tapmyname-06b39e405c92.json");
const SERVICE_ACCOUNT = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

const ISSUER_ID = process.env.GW_ISSUER_ID;
const CLASS_ID = process.env.GW_WALLET_CLASS_ID; // e.g. "issuerId.TapMyNameCard"
const ORIGINS = (process.env.GW_ORIGINS || "").split(",").filter(Boolean);

// Helper: build Save-to-Wallet JWT for one contact card
// helper inside routes/wallet.js (replace your existing createSaveJwtForContact)
function createSaveJwtForContact({ objectIdSuffix, contact }) {
    // basic sanity checks
    if (!SERVICE_ACCOUNT || !SERVICE_ACCOUNT.private_key) {
        throw new Error("Missing service account private key. Check service account JSON path.");
    }
    if (!ISSUER_ID) throw new Error("ISSUER_ID env missing");
    if (!CLASS_ID) throw new Error("CLASS_ID env missing");
    if (!Array.isArray(ORIGINS) || ORIGINS.length === 0) {
        throw new Error("ORIGINS missing - set GW_ORIGINS to your frontend domain(s), e.g. https://tapmy.name");
    }

    // ensure CLASS_ID includes issuer prefix
    const expectedPrefix = `${ISSUER_ID}.`;
    const classId = CLASS_ID.startsWith(expectedPrefix) ? CLASS_ID : `${expectedPrefix}${CLASS_ID}`;

    const now = Math.floor(Date.now() / 1000);
    const objectId = `${ISSUER_ID}.${objectIdSuffix}`;

    const jwtPayload = {
        iss: SERVICE_ACCOUNT.client_email,
        aud: "google",
        typ: "savetowallet",
        iat: now,
        exp: now + 60 * 60, // 1 hour
        origins: ORIGINS,
        payload: {
            genericObjects: [
                {
                    id: objectId,
                    classId: classId,
                    title: contact.name || `${contact.firstName || ""} ${contact.lastName || ""}`.trim() || "Contact Card",
                    description: contact.designation || "Digital business card",
                    // barcode will show as QR on the Wallet entry
                    barcode: contact.shareUrl ? {
                        type: "QR_CODE",
                        value: contact.shareUrl,
                        alternateText: "Scan to view card"
                    } : undefined,
                    textModulesData: [
                        contact.phone ? { header: "Phone", body: contact.phone } : null,
                        contact.email ? { header: "Email", body: contact.email } : null,
                        contact.companyName ? { header: "Company", body: contact.companyName } : null,
                    ].filter(Boolean),
                    linksModuleData: {
                        uris: [
                            contact.shareUrl ? { uri: contact.shareUrl, description: "Open Digital Card" } : null,
                            contact.googleReview ? { uri: contact.googleReview, description: "Google Reviews" } : null,
                            contact.tripAdvisor ? { uri: contact.tripAdvisor, description: "Tripadvisor" } : null,
                        ].filter(Boolean)
                    }
                }
            ]
        }
    };

    // sign the jwt
    try {
        const signedJwt = jwt.sign(jwtPayload, SERVICE_ACCOUNT.private_key, {
            algorithm: "RS256",
            keyid: SERVICE_ACCOUNT.private_key_id // optional but fine
        });

        // Helpful for debugging — remove or restrict logging in production
        console.log("🔐 Signed Google Wallet JWT (first 200 chars):", signedJwt.slice(0, 200));

        return { saveUrl: `https://pay.google.com/gp/v/save/${signedJwt}` };
    } catch (err) {
        console.error("❌ JWT sign error:", err);
        throw err;
    }
}

// route handler (small improvement to return helpful errors)
router.post("/google/save-url", authenticateToken, async (req, res) => {
    try {
        const contact = req.body.contact;

        // Validation
        if (!contact) return res.status(400).json({ message: "contact is required in body" });
        if (!contact.shareUrl) return res.status(400).json({ message: "contact.shareUrl is required" });

        // Log what we're receiving
        console.log("📱 Incoming wallet request:", {
            userId: req.userId,
            contactName: contact.name,
            shareUrl: contact.shareUrl,
            hasPhone: !!contact.phone,
            hasEmail: !!contact.email
        });

        const suffix = req.body.objectIdSuffix || `contact_${req.userId}_${Date.now()}`;

        // Log environment variables (only once at startup is better, but this helps debug)
        console.log("🔧 Config check:", {
            hasServiceAccount: !!SERVICE_ACCOUNT?.private_key,
            issuerId: ISSUER_ID,
            classId: CLASS_ID,
            origins: ORIGINS,
            serviceEmail: SERVICE_ACCOUNT?.client_email
        });

        const { saveUrl } = createSaveJwtForContact({ objectIdSuffix: suffix, contact });

        console.log("✅ Generated save URL successfully");

        return res.json({ saveUrl });
    } catch (err) {
        console.error("❌ Google Wallet error:", {
            message: err?.message,
            stack: err?.stack,
            name: err?.name
        });
        return res.status(500).json({
            message: "Failed to generate Google Wallet URL",
            error: err?.message || "unknown",
            details: process.env.NODE_ENV === 'development' ? err?.stack : undefined
        });
    }
});

export default router;
