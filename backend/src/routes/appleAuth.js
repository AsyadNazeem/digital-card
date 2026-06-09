import express from "express";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";        // npm install jwks-rsa
import User from "../models/User.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import UserPlan from "../models/UserPlan.js";
import {createFreePlan} from "./auth.js";

dotenv.config();
const router = express.Router();


// ============================
// EMAIL TRANSPORTER
// ============================

const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
    tls: { rejectUnauthorized: false },
});


// ============================
// APPLE JWKS CLIENT
// ============================
// jwks-rsa handles fetching Apple's public keys AND correctly
// converting JWK → PEM. Using x5c (certificate) directly with
// jwt.verify does NOT work — this is the correct approach.

const appleJwksClient = jwksClient({
    jwksUri: "https://appleid.apple.com/auth/keys",
    cache: true,
    cacheMaxEntries: 5,
    cacheMaxAge: 600000, // cache keys for 10 minutes
});

function getApplePublicKey(kid) {
    return new Promise((resolve, reject) => {
        appleJwksClient.getSigningKey(kid, (err, key) => {
            if (err) return reject(err);
            resolve(key.getPublicKey());
        });
    });
}


// ============================
// VERIFY APPLE TOKEN
// ============================

async function verifyAppleToken(identityToken) {

    // Step 1: Decode header to get kid (key ID)
    const decoded = jwt.decode(identityToken, { complete: true });

    if (!decoded || !decoded.header || !decoded.header.kid) {
        throw new Error("Invalid Apple identity token structure");
    }

    const kid = decoded.header.kid;
    console.log("🔑 Apple token kid:", kid);

    // Step 2: Fetch matching Apple public key (JWK → PEM via jwks-rsa)
    const publicKey = await getApplePublicKey(kid);

    // Step 3: Verify signature and standard claims
    const payload = jwt.verify(identityToken, publicKey, {
        algorithms: ["RS256"],
        audience: process.env.APPLE_CLIENT_ID,  // e.g. com.tapmyname.web
        issuer: "https://appleid.apple.com",
    });

    return payload;
}


// ============================
// SEND WELCOME EMAIL
// ============================

async function sendWelcomeEmail(user) {
    try {
        const html = `
        <!DOCTYPE html>
        <html>
        <body style="font-family:Arial,sans-serif;color:#333;">
            <div style="max-width:600px;margin:0 auto;padding:20px;">
                <div style="background:linear-gradient(135deg,#5c4033,#3e2a23);padding:30px;text-align:center;border-radius:10px 10px 0 0;">
                    <h1 style="color:#f5e6d3;margin:0;">Welcome to TapMyName</h1>
                </div>
                <div style="background:#fff;padding:30px;border:1px solid #e5e1dc;border-top:none;">
                    <h2 style="color:#2d1f1a;">Hi ${user.name}! 👋</h2>
                    <p>Your account was successfully created using Apple Sign-In.</p>
                    <p>You can now create and share your digital business cards.</p>
                    <div style="text-align:center;margin:30px 0;">
                        <a href="${process.env.FRONTEND_URL}/dashboard"
                           style="display:inline-block;padding:14px 28px;background:linear-gradient(135deg,#5c4033,#3e2a23);color:white;text-decoration:none;border-radius:8px;font-weight:bold;">
                            Go to Dashboard
                        </a>
                    </div>
                </div>
                <div style="text-align:center;color:#6b5d57;font-size:13px;margin-top:20px;">
                    <p>© ${new Date().getFullYear()} TapMyName. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>`;

        await transporter.sendMail({
            from: `"TapMyName" <${process.env.MAIL_USER}>`,
            to: user.email,
            subject: "Welcome to TapMyName! 🎉",
            html,
        });

        console.log("✅ Welcome email sent to:", user.email);
    } catch (error) {
        console.error("❌ Welcome email error:", error.message);
        // Don't throw — email failure must not break login
    }
}


// ============================
// POST /apple
// Mounted at /api/auth in server.js → gives POST /api/auth/apple
// ============================

router.post("/apple", async (req, res) => {
    try {
        console.log("🔵 Apple Sign In request received");

        const { identityToken, authorizationCode, user: appleUser } = req.body;

        if (!identityToken) {
            return res.status(400).json({
                success: false,
                message: "Missing Apple identity token",
            });
        }

        // ✅ Verify token with Apple's real public keys
        console.log("🔍 Verifying Apple identity token...");
        let payload;
        try {
            payload = await verifyAppleToken(identityToken);
        } catch (verifyErr) {
            console.error("❌ Apple token verification failed:", verifyErr.message);
            return res.status(401).json({
                success: false,
                message: "Invalid Apple identity token. Please try again.",
            });
        }

        const { sub: appleId, email: tokenEmail } = payload;
        console.log("✅ Apple token verified. Apple ID:", appleId);

        // ✅ Extract name and email.
        // Apple ONLY sends the `user` object on the VERY FIRST login.
        // On all subsequent logins user will be null — use DB values instead.
        const firstName = appleUser?.name?.firstName || "";
        const lastName  = appleUser?.name?.lastName  || "";
        const fullName  = [firstName, lastName].filter(Boolean).join(" ") || "Apple User";
        const email     = appleUser?.email || tokenEmail || null;

        // ✅ Find or create user
        let dbUser = await User.findOne({ where: { appleId } });
        let isNewUser = false;

        if (!dbUser) {
            // Try matching by email (user may have registered another way)
            if (email) {
                dbUser = await User.findOne({ where: { email } });
            }

            if (dbUser) {
                // Existing user — link Apple ID
                console.log("🔗 Linking Apple ID to existing account:", dbUser.id);
                dbUser.appleId = appleId;
                dbUser.provider = "apple";
                await dbUser.save();
            } else {
                // Brand new user
                console.log("🔵 Creating new user from Apple Sign In...");
                isNewUser = true;

                dbUser = await User.create({
                    name:             fullName,
                    // Use Apple's private relay email if real email is hidden
                    email:            email || `apple_${appleId}@privaterelay.appleid.com`,
                    phone:            "",
                    password:         null,
                    appleId,
                    provider:         "apple",
                    registrationType: "apple",
                    selectedThemeId:  1,
                    plan:             "free",
                    createdBy: "apple",
                });

                console.log("✅ New user created:", dbUser.id);

                // ✅ Create free plan — same as email and Google registration
                try {
                    await createFreePlan(dbUser.id);
                    console.log("✅ Free plan created for Apple user");
                } catch (planErr) {
                    console.error("❌ Failed to create free plan, rolling back");
                    await dbUser.destroy();
                    return res.status(500).json({ success: false, message: "Failed to initialize user plan" });
                }

                if (email) {
                    await sendWelcomeEmail(dbUser);
                }
            }
        } else {
            console.log("✅ Existing Apple user found:", dbUser.id);
        }

        // ✅ Generate JWT
        const token = jwt.sign(
            { id: dbUser.id, email: dbUser.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.json({
            success: true,
            message: isNewUser ? "Apple registration successful" : "Welcome back",
            token,
            user: {
                id:    dbUser.id,
                name:  dbUser.name,
                email: dbUser.email,
                phone: dbUser.phone,
            },
        });

    } catch (err) {
        console.error("❌ Apple login error:", err.message);
        console.error(err.stack);
        return res.status(500).json({
            success: false,
            message: "Apple Sign In failed. Please try again.",
            error: process.env.NODE_ENV === "development" ? err.message : undefined,
        });
    }
});


export default router;
