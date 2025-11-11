import express from "express";
import multer from "multer";
import path from "path";
import jwt from "jsonwebtoken";
import Company from "../models/Company.js";
import Contact from "../models/Contact.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { ensurePhoneNumber } from "../middleware/checkPhone.js";

const router = express.Router();

// ✅ Middleware to authenticate JWT
function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token provided" });
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.userId = decoded.id;
        next();
    });
}

// ✅ Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "logo") cb(null, "uploads/logos");
        else if (file.fieldname === "photo") cb(null, "uploads/photos");
        else cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// ✅ Add or Update Company
router.post(
    "/company",
    authenticate,
    upload.single("logo"),
    async (req, res) => {
        try {
            let { heading, companyName, website, displayUrl, email, bio, view360, googleLocation, googleReviews, socialLinks, status } = req.body;
            const logo = req.file ? `/uploads/logos/${req.file.filename}` : null;

            // Parse social links JSON
            if (socialLinks) {
                try {
                    socialLinks = JSON.parse(socialLinks);
                } catch {
                    socialLinks = {};
                }
            }

            // Check existing company
            let existing = await Company.findOne({ where: { userId: req.userId } });

            if (existing) {
                await existing.update({
                    heading,
                    companyName,
                    website,
                    displayUrl,
                    email,
                    bio,
                    logo: logo || existing.logo,
                    view360,
                    googleLocation,
                    googleReviews,
                    socialLinks,
                    status,
                });
                return res.json({ message: "Company updated", company: existing });
            }

            const company = await Company.create({
                heading,
                companyName,
                website,
                displayUrl,
                email,
                bio,
                logo,
                view360,
                googleLocation,
                googleReviews,
                socialLinks,
                status,
                userId: req.userId,
            });

            res.status(201).json({ message: "Company created", company });
        } catch (err) {
            console.error("❌ Company save error:", err);
            res.status(500).json({ message: err.message });
        }
    }
);

// ✅ Add or Update Contact
router.post(
    "/contact",
    authenticate,
    upload.single("photo"),
    async (req, res) => {
        try {
            const { firstName, lastName, telephoneCountryCode, telephone, mobileCountryCode, mobile, email, designation, company, status } = req.body;
            const photo = req.file ? `/uploads/photos/${req.file.filename}` : null;

            const contact = await Contact.create({
                firstName,
                lastName,
                telephoneCountryCode,
                telephone,
                mobileCountryCode,
                mobile,
                email,
                designation,
                company,
                photo,
                status,
                userId: req.userId,
            });

            res.status(201).json({ message: "Contact created", contact });
        } catch (err) {
            console.error("❌ Contact save error:", err);
            res.status(500).json({ message: err.message });
        }
    }
);

// ✅ Get dashboard data (company + contacts)
router.get("/data", authenticate, async (req, res) => {
    try {
        const company = await Company.findOne({ where: { userId: req.userId } });
        const contacts = await Contact.findAll({ where: { userId: req.userId } });
        res.json({ company, contacts });
    } catch (err) {
        console.error("❌ Dashboard data error:", err);
        res.status(500).json({ message: err.message });
    }
});

router.get("/data", authenticateToken, ensurePhoneNumber, async (req, res) => {
    // Only users with phone number reach here
    res.json({ message: "Dashboard data loaded!" });
});

// 🟢 Get all companies for the logged-in user
// 🟢 Get all ACTIVE companies for the logged-in user
router.get("/companies", authenticate, async (req, res) => {
    try {
        const companies = await Company.findAll({
            where: {
                userId: req.userId,
                status: "active", // ✅ Only fetch active companies
            },
            attributes: ["id", "companyName", "status"],
            order: [["companyName", "ASC"]],
        });

        res.json(companies);
    } catch (err) {
        console.error("❌ Error fetching companies:", err);
        res.status(500).json({ message: "Failed to load companies" });
    }
});



export default router;
