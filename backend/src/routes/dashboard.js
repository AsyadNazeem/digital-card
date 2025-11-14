import express from "express";
import multer from "multer";
import path from "path";
import jwt from "jsonwebtoken";
import Company from "../models/Company.js";
import Contact from "../models/Contact.js";
import Request from "../models/Request.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { ensurePhoneNumber } from "../middleware/checkPhone.js";
import { Op } from 'sequelize';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

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

// ✅ Phone validation helper function
function validatePhoneNumber(phoneNumber) {
    try {
        if (!phoneNumber) {
            return { isValid: false, error: "Phone number is required" };
        }

        // Check if it's a valid phone number
        if (!isValidPhoneNumber(phoneNumber)) {
            return { isValid: false, error: "Invalid phone number format" };
        }

        // Parse and get details
        const parsed = parsePhoneNumber(phoneNumber);

        return {
            isValid: true,
            e164: parsed.format('E.164'),
            country: parsed.country,
            type: parsed.getType(),
            formatted: parsed.formatInternational()
        };
    } catch (error) {
        return {
            isValid: false,
            error: error.message || "Invalid phone number"
        };
    }
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

// ============================================
// COMPANY ROUTES
// ============================================

// ✅ Create a new company
router.post("/company", authenticate, upload.single("logo"), async (req, res) => {
    try {
        let {
            heading,
            companyName,
            website,
            displayUrl,
            email,
            bio,
            view360,
            googleLocation,
            googleReviews,
            socialLinks,
            status,
        } = req.body;

        const logo = req.file ? `/uploads/logos/${req.file.filename}` : null;

        // Parse social links JSON
        if (socialLinks) {
            try {
                socialLinks = JSON.parse(socialLinks);
            } catch {
                socialLinks = {};
            }
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

        res.status(201).json({ message: "Company created successfully", company });
    } catch (err) {
        console.error("❌ Company save error:", err);
        res.status(500).json({ message: err.message });
    }
});

// ✅ Update company
router.put("/company/:id", authenticate, upload.single("logo"), async (req, res) => {
    try {
        const company = await Company.findByPk(req.params.id);
        if (!company) return res.status(404).json({ message: "Company not found" });

        await company.update({
            ...req.body,
            socialLinks: JSON.parse(req.body.socialLinks || "{}"),
            logo: req.file ? `/uploads/logos/${req.file.filename}` : company.logo,
        });

        res.json({ message: "Company updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error updating company", error: err.message });
    }
});

// ✅ Delete company
router.delete("/company/:id", authenticate, async (req, res) => {
    try {
        const company = await Company.findByPk(req.params.id);
        if (!company) return res.status(404).json({ message: "Company not found" });
        await company.destroy();
        res.json({ message: "Company deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting company", error: err.message });
    }
});

// ✅ Get all active companies for logged-in user
router.get("/companies", authenticate, async (req, res) => {
    try {
        const companies = await Company.findAll({
            where: {
                userId: req.userId,
                status: "active",
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

// ============================================
// CONTACT ROUTES
// ============================================

// ✅ Create a new contact
router.post(
    "/contact",
    authenticate,
    upload.single("photo"),
    async (req, res) => {
        try {
            const {
                firstName,
                lastName,
                telephone,
                mobile,
                email,
                designation,
                companyId,
                status,
                country,
                streetAddress,
                streetAddressLine2,
                city,
                postalCode,
                poBox,
                label
            } = req.body;

            // Validate required fields
            if (!mobile) {
                return res.status(400).json({ message: "Mobile number is required" });
            }

            // Validate mobile number
            const mobileValidation = validatePhoneNumber(mobile);
            if (!mobileValidation.isValid) {
                return res.status(400).json({
                    message: `Mobile: ${mobileValidation.error}`
                });
            }

            // Validate telephone if provided
            let validatedTelephone = null;
            if (telephone) {
                const telValidation = validatePhoneNumber(telephone);
                if (!telValidation.isValid) {
                    return res.status(400).json({
                        message: `Telephone: ${telValidation.error}`
                    });
                }
                validatedTelephone = telValidation.e164;
            }

            // Check for duplicate mobile number
            const existingContact = await Contact.findOne({
                where: {
                    mobile: mobileValidation.e164,
                    userId: req.userId
                }
            });

            if (existingContact) {
                return res.status(409).json({
                    message: "This mobile number is already registered"
                });
            }

            const photo = req.file ? `/uploads/photos/${req.file.filename}` : null;

            const contact = await Contact.create({
                firstName,
                lastName,
                telephone: validatedTelephone,
                mobile: mobileValidation.e164,
                email,
                designation,
                companyId: companyId || null,
                photo,
                status,
                // Address fields
                country: country || null,
                streetAddress: streetAddress || null,
                streetAddressLine2: streetAddressLine2 || null,
                city: city || null,
                postalCode: postalCode || null,
                poBox: poBox || null,
                label: label || null,
                userId: req.userId,
            });

            res.status(201).json({
                message: "Contact created successfully",
                contact
            });
        } catch (err) {
            console.error("❌ Contact save error:", err);
            res.status(500).json({ message: err.message });
        }
    }
);


// ✅ Update contact
// Update the update contact route
router.put("/contact/:id", authenticate, upload.single("photo"), async (req, res) => {
    try {
        const contact = await Contact.findByPk(req.params.id);
        if (!contact) return res.status(404).json({ message: "Contact not found" });

        const {
            firstName,
            lastName,
            telephone,
            mobile,
            email,
            designation,
            companyId,
            status,
            country,
            streetAddress,
            streetAddressLine2,
            city,
            postalCode,
            poBox,
            label
        } = req.body;

        // Validate mobile number if provided
        let validatedMobile = contact.mobile;
        if (mobile) {
            const mobileValidation = validatePhoneNumber(mobile);
            if (!mobileValidation.isValid) {
                return res.status(400).json({
                    message: `Mobile: ${mobileValidation.error}`
                });
            }
            validatedMobile = mobileValidation.e164;

            // Check for duplicate mobile (exclude current contact)
            const existingContact = await Contact.findOne({
                where: {
                    mobile: validatedMobile,
                    userId: req.userId,
                    id: { [Op.ne]: req.params.id }
                }
            });

            if (existingContact) {
                return res.status(409).json({
                    message: "This mobile number is already registered"
                });
            }
        }

        // Validate telephone if provided
        let validatedTelephone = contact.telephone;
        if (telephone) {
            const telValidation = validatePhoneNumber(telephone);
            if (!telValidation.isValid) {
                return res.status(400).json({
                    message: `Telephone: ${telValidation.error}`
                });
            }
            validatedTelephone = telValidation.e164;
        }

        await contact.update({
            firstName,
            lastName,
            telephone: validatedTelephone,
            mobile: validatedMobile,
            email,
            designation,
            companyId: companyId || null,
            status,
            // Address fields
            country: country || null,
            streetAddress: streetAddress || null,
            streetAddressLine2: streetAddressLine2 || null,
            city: city || null,
            postalCode: postalCode || null,
            poBox: poBox || null,
            label: label || null,
            photo: req.file ? `/uploads/photos/${req.file.filename}` : contact.photo,
        });

        res.json({ message: "Contact updated successfully" });
    } catch (err) {
        console.error("❌ Contact update error:", err);
        res.status(500).json({ message: err.message });
    }
});

// ✅ Delete contact
router.delete("/contact/:id", authenticate, async (req, res) => {
    try {
        const contact = await Contact.findByPk(req.params.id);
        if (!contact) return res.status(404).json({ message: "Contact not found" });
        await contact.destroy();
        res.json({ message: "Contact deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting contact", error: err.message });
    }
});

// ============================================
// MOBILE NUMBER VALIDATION
// ============================================

// ✅ Check if mobile number already exists
router.post("/check-contact-mobile", authenticate, async (req, res) => {
    try {
        const { mobile, contactId } = req.body;

        if (!mobile) {
            return res.status(400).json({ message: "Mobile number is required" });
        }

        // Validate the phone number format
        const validation = validatePhoneNumber(mobile);
        if (!validation.isValid) {
            return res.status(400).json({
                message: validation.error
            });
        }

        // Build query - exclude current contact if editing
        const whereClause = {
            mobile: validation.e164,
            userId: req.userId
        };

        if (contactId) {
            whereClause.id = { [Op.ne]: contactId };
        }

        // Check if exists
        const existing = await Contact.findOne({
            where: whereClause
        });

        return res.json({
            exists: !!existing,
            mobile: validation.e164,
            formatted: validation.formatted
        });

    } catch (err) {
        console.error("❌ Mobile Check Error:", err);
        return res.status(500).json({
            message: "Server error checking mobile number"
        });
    }
});

// ============================================
// DATA RETRIEVAL
// ============================================

// ✅ Get all user data (companies + contacts)
router.get("/data", authenticate, async (req, res) => {
    try {
        const companies = await Company.findAll({
            where: { userId: req.userId }
        });

        const contacts = await Contact.findAll({
            where: { userId: req.userId },
            include: [
                {
                    model: Company,
                    attributes: ["companyName"]
                }
            ]
        });

        res.json({ companies, contacts });
    } catch (err) {
        console.error("❌ Dashboard data error:", err);
        res.status(500).json({ message: err.message });
    }
});

// ============================================
// LIMIT INCREASE REQUESTS
// ============================================

// ✅ Submit limit increase request
router.post("/request-limits", authenticateToken, async (req, res) => {
    try {
        const userId = req.userId;
        const { companies, contacts, reason } = req.body;

        if (!companies && !contacts) {
            return res.status(400).json({
                message: "Request must include companies or contacts"
            });
        }

        const newRequest = await Request.create({
            userId,
            requestedCompanies: companies || 0,
            requestedContacts: contacts || 0,
            reason: reason || "",
            status: "pending"
        });

        return res.json({
            success: true,
            message: "Your request has been submitted successfully",
            request: newRequest
        });
    } catch (err) {
        console.error("❌ Request Save Error:", err);
        res.status(500).json({
            message: "Failed to submit request",
            error: err.message
        });
    }
});

// ✅ Get user's request history
router.get("/request-history", authenticateToken, async (req, res) => {
    try {
        const userId = req.userId;

        const requests = await Request.findAll({
            where: { userId },
            order: [["createdAt", "DESC"]],
            attributes: [
                "id",
                "requestedCompanies",
                "requestedContacts",
                "reason",
                "status",
                "createdAt",
                "updatedAt"
            ]
        });

        return res.json({
            success: true,
            requests
        });
    } catch (err) {
        console.error("❌ Request History Error:", err);
        res.status(500).json({
            message: "Failed to load request history",
            error: err.message
        });
    }
});

export default router;

// ============================================
// FRONTEND: Installation & Import
// ============================================

/*
// Install in frontend
npm install libphonenumber-js

// Import in your Vue component
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js'

// Use the validation functions provided in the artifact above
*/
