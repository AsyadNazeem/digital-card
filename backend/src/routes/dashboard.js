import express from "express";
import multer from "multer";
import path from "path";
import jwt from "jsonwebtoken";
import Company from "../models/Company.js";
import Contact from "../models/Contact.js";
import Request from "../models/Request.js";
import Review from "../models/Review.js";
import User from "../models/User.js"; // ✅ ADD THIS LINE
import { authenticateToken } from "../middleware/authMiddleware.js";
import { Op } from 'sequelize';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';
import sanitizeHtml from 'sanitize-html';
import { customAlphabet } from 'nanoid';


const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 8); // 8 chars
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

        if (!isValidPhoneNumber(phoneNumber)) {
            return { isValid: false, error: "Invalid phone number format" };
        }

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

// ✅ Define middleware for company logo upload (SINGLE FILE ONLY)
const uploadCompanyLogo = upload.single('logo');


// ============================================
// HELPER FUNCTIONS
// ============================================

// ✅ Helper function to validate URLs
function isValidUrl(string) {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
        return false;
    }
}


// ============================================
// COMPANY ROUTES
// ============================================

// ✅ Create a new company
router.post("/company", authenticate, uploadCompanyLogo, async (req, res) => {
    try {
        console.log("📥 Received body:", req.body);

        // Required fields validation
        if (!req.body.companyName || !req.body.website || !req.body.displayUrl || !req.body.email) {
            return res.status(400).json({
                message: "Missing required fields: companyName, website, displayUrl, email"
            });
        }

        // Check if logo exists
        if (!req.file) {
            return res.status(400).json({
                message: "Company logo is required"
            });
        }

        // Parse social links
        let socialLinks = {};
        if (req.body.socialLinks) {
            try {
                socialLinks = JSON.parse(req.body.socialLinks);
            } catch (e) {
                console.error("Error parsing socialLinks:", e);
                socialLinks = {};
            }
        }

        // Sanitize bio
        const cleanBio = sanitizeHtml(req.body.bio || "", {
            allowedTags: ['p','br','strong','em','u','h1','h2','h3','ul','ol','li','a','blockquote'],
            allowedAttributes: { 'a': ['href','target','rel'] }
        });

        // ✅ Handle links (brochures/menus)
        let processedLinks = [];

        if (req.body.files) {
            try {
                const links = JSON.parse(req.body.files);

                if (Array.isArray(links)) {
                    for (const link of links) {
                        // Validate URL
                        if (!link.url || !isValidUrl(link.url)) {
                            return res.status(400).json({
                                message: `Invalid URL: ${link.url || 'empty'}`
                            });
                        }

                        // Validate name
                        if (!link.name || !link.name.trim()) {
                            return res.status(400).json({
                                message: 'Link name is required'
                            });
                        }

                        // Validate at least one type is selected - UPDATED
                        if (!link.isBrochure && !link.isMenu && !link.isShopNow && !link.isOrderNow) {
                            return res.status(400).json({
                                message: 'Each link must be marked as Brochure, Menu, Shop Now, or Order Now'
                            });
                        }

                        // UPDATED: Include new fields
                        processedLinks.push({
                            url: link.url.trim(),
                            name: link.name.trim(),
                            isBrochure: Boolean(link.isBrochure),
                            isMenu: Boolean(link.isMenu),
                            isShopNow: Boolean(link.isShopNow),      // NEW
                            isOrderNow: Boolean(link.isOrderNow),    // NEW
                            addedAt: new Date().toISOString()
                        });
                    }
                }
            } catch (e) {
                console.error("Error parsing files:", e);
                return res.status(400).json({
                    message: "Invalid files format"
                });
            }
        }

        console.log("✅ Processed links:", processedLinks);

        // Create company
        const company = await Company.create({
            heading: null,
            companyName: req.body.companyName,
            website: req.body.website,
            displayUrl: req.body.displayUrl,
            email: req.body.email,
            bio: cleanBio || null,
            logo: `/uploads/logos/${req.file.filename}`,
            view360: req.body.view360 || null,
            googleLocation: req.body.googleLocation || null,
            googleReviews: req.body.googleReviews || null,
            tripAdvisor: req.body.tripAdvisor || null,
            socialLinks: socialLinks,
            files: processedLinks,
            label: req.body.label || null,
            country: req.body.country || null,
            streetAddress: req.body.streetAddress || null,
            streetAddressLine2: req.body.streetAddressLine2 || null,
            city: req.body.city || null,
            postalCode: req.body.postalCode || null,
            poBox: req.body.poBox || null,
            status: req.body.status || 'active',
            userId: req.userId
        });

        console.log("✅ Company created successfully:", company.id);

        res.status(201).json({
            message: "Company created successfully",
            company
        });
    } catch (err) {
        console.error("❌ Company save error:", err);
        res.status(500).json({
            message: "Error creating company",
            error: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
});

// ✅ Update company
router.put("/company/:id", authenticate, uploadCompanyLogo, async (req, res) => {
    try {
        console.log("📝 Updating company:", req.params.id);
        console.log("📥 Received body:", req.body);

        const company = await Company.findByPk(req.params.id);
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        if (company.userId !== req.userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Parse social links
        let socialLinks = {};
        if (req.body.socialLinks) {
            try {
                socialLinks = JSON.parse(req.body.socialLinks);
            } catch (e) {
                console.error("Error parsing socialLinks:", e);
                socialLinks = {};
            }
        }

        // Sanitize bio
        const cleanBio = sanitizeHtml(req.body.bio || '', {
            allowedTags: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'a', 'blockquote'],
            allowedAttributes: { 'a': ['href', 'target', 'rel'] }
        });

        // ✅ Handle links
        let processedLinks = [];

        if (req.body.files) {
            try {
                const links = JSON.parse(req.body.files);

                if (Array.isArray(links)) {
                    for (const link of links) {
                        // Validate URL
                        if (!link.url || !isValidUrl(link.url)) {
                            return res.status(400).json({
                                message: `Invalid URL: ${link.url || 'empty'}`
                            });
                        }

                        // Validate name
                        if (!link.name || !link.name.trim()) {
                            return res.status(400).json({
                                message: 'Link name is required'
                            });
                        }

                        // Validate at least one type - UPDATED
                        if (!link.isBrochure && !link.isMenu && !link.isShopNow && !link.isOrderNow) {
                            return res.status(400).json({
                                message: 'Each link must be marked as Brochure, Menu, Shop Now, or Order Now'
                            });
                        }

                        // UPDATED: Include new fields
                        processedLinks.push({
                            url: link.url.trim(),
                            name: link.name.trim(),
                            isBrochure: Boolean(link.isBrochure),
                            isMenu: Boolean(link.isMenu),
                            isShopNow: Boolean(link.isShopNow),      // NEW
                            isOrderNow: Boolean(link.isOrderNow),    // NEW
                            addedAt: link.addedAt || new Date().toISOString()
                        });
                    }
                }
            } catch (e) {
                console.error("Error parsing files:", e);
                return res.status(400).json({
                    message: "Invalid files format"
                });
            }
        }

        console.log("✅ Processed links:", processedLinks);

        const updateData = {
            heading: req.body.heading || null,
            companyName: req.body.companyName,
            website: req.body.website,
            displayUrl: req.body.displayUrl,
            email: req.body.email,
            bio: cleanBio || null,
            view360: req.body.view360 || null,
            googleLocation: req.body.googleLocation || null,
            googleReviews: req.body.googleReviews || null,
            tripAdvisor: req.body.tripAdvisor || null,
            status: req.body.status || null,
            socialLinks: socialLinks,
            files: processedLinks,
            label: req.body.label || null,
            country: req.body.country || null,
            streetAddress: req.body.streetAddress || null,
            streetAddressLine2: req.body.streetAddressLine2 || null,
            city: req.body.city || null,
            postalCode: req.body.postalCode || null,
            poBox: req.body.poBox || null,
        };

        // Handle logo update
        if (req.file) {
            updateData.logo = `/uploads/logos/${req.file.filename}`;
        } else if (req.body.existingLogo) {
            updateData.logo = req.body.existingLogo;
        }

        await company.update(updateData);
        const updatedCompany = await Company.findByPk(req.params.id);

        console.log("✅ Company updated successfully");

        res.json({
            message: "Company updated successfully",
            company: updatedCompany
        });
    } catch (err) {
        console.error("❌ Update error:", err);
        res.status(500).json({
            message: "Error updating company",
            error: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
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
                whatsappChannel  // ✅ NEW
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

            // ✅ FIX: Validate WhatsApp if provided, otherwise use mobile
            let validatedWhatsapp = mobileValidation.e164; // Default to mobile
            if (req.body.whatsapp && req.body.whatsapp !== mobile) {
                const whatsappValidation = validatePhoneNumber(req.body.whatsapp);
                if (!whatsappValidation.isValid) {
                    return res.status(400).json({
                        message: `WhatsApp: ${whatsappValidation.error}`
                    });
                }
                validatedWhatsapp = whatsappValidation.e164;
            }

            if (whatsappChannel && whatsappChannel.trim()) {
                const urlPattern = /^https?:\/\/.+/i;
                if (!urlPattern.test(whatsappChannel.trim())) {
                    return res.status(400).json({
                        message: "WhatsApp Channel must be a valid URL"
                    });
                }
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
                whatsapp: validatedWhatsapp, // ✅ CHANGED: Use validated WhatsApp
                whatsappChannel: whatsappChannel ? whatsappChannel.trim() : null,  // ✅ NEW
                email,
                designation,
                companyId: companyId || null,
                photo,
                status,
                userId: req.userId,
                cardMobileNum: mobileValidation.e164,
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

// ✅ Update contact (ADDRESS FIELDS REMOVED)
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
            whatsappChannel  // ✅ NEW
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

        let validatedWhatsApp = contact.whatsapp;
        if (req.body.whatsapp) {
            const whatsappValidation = validatePhoneNumber(req.body.whatsapp);
            if (!whatsappValidation.isValid) {
                return res.status(400).json({
                    message: `WhatsApp: ${whatsappValidation.error}`
                });
            }
            validatedWhatsApp = whatsappValidation.e164;
        }

        if (whatsappChannel && whatsappChannel.trim()) {
            const urlPattern = /^https?:\/\/.+/i;
            if (!urlPattern.test(whatsappChannel.trim())) {
                return res.status(400).json({
                    message: "WhatsApp Channel must be a valid URL"
                });
            }
        }


        await contact.update({
            firstName,
            lastName,
            telephone: validatedTelephone,
            mobile: validatedMobile,
            whatsapp: validatedWhatsApp,
            whatsappChannel: whatsappChannel !== undefined ? (whatsappChannel ? whatsappChannel.trim() : null) : contact.whatsappChannel,  // ✅ NEW
            email,
            designation,
            companyId: companyId || null,
            status,
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

        const validation = validatePhoneNumber(mobile);
        if (!validation.isValid) {
            return res.status(400).json({
                message: validation.error
            });
        }

        const whereClause = {
            mobile: validation.e164,
            userId: req.userId
        };

        if (contactId) {
            whereClause.id = { [Op.ne]: contactId };
        }

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
                    as: "Company",
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
        const { companies, contacts, reviews, reason } = req.body; // ADD reviews

        if (!companies && !contacts && !reviews) { // UPDATE validation
            return res.status(400).json({
                message: "Request must include companies, contacts, or reviews"
            });
        }

        const newRequest = await Request.create({
            userId,
            requestedCompanies: companies || 0,
            requestedContacts: contacts || 0,
            requestedReviews: reviews || 0, // ADD THIS
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
                "requestedReviews",
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

router.get("/review-count", authenticate, async (req, res) => {
    try {
        const count = await Review.count({
            where: { userId: req.userId }
        });
        res.json({ count });
    } catch (err) {
        console.error("❌ Review count error:", err);
        res.status(500).json({ message: "Failed to get review count" });
    }
});


// GET /reviews - list reviews for logged-in user
router.get("/reviews", authenticate, async (req, res) => {
    try {
        const reviews = await Review.findAll({
            where: { userId: req.userId },
            include: [
                {
                    model: Company,
                    as: "Company",
                    attributes: ["id", "companyName"]
                }
            ],
            order: [["createdAt", "DESC"]]
        });

        return res.json({ reviews });
    } catch (err) {
        console.error("❌ Error fetching reviews:", err);
        return res.status(500).json({ message: "Failed to load reviews" });
    }
});

// Helper: simple URL validator (accepts empty)
function isValidUrlOrEmpty(v) {
    if (!v || !String(v).trim()) return true;
    try {
        new URL(v);
        return true;
    } catch {
        return false;
    }
}

// Update the POST /reviews endpoint to check limits (replace existing)
router.post("/reviews", authenticate, async (req, res) => {
    try {
        // Check review limit first
        const user = await User.findByPk(req.userId);
        const currentCount = await Review.count({
            where: { userId: req.userId }
        });

        if (currentCount >= user.reviewLimit) {
            return res.status(403).json({
                message: "You've reached your review limit. Please request more from admin.",
                limitReached: true
            });
        }

        const { companyId = null, branchName, location = null, googleLink = null, tripadvisorLink = null } = req.body;

        if (!branchName || !String(branchName).trim()) {
            return res.status(400).json({ message: "Branch name is required" });
        }

        if (!isValidUrlOrEmpty(googleLink)) {
            return res.status(400).json({ message: "Invalid googleLink URL" });
        }
        if (!isValidUrlOrEmpty(tripadvisorLink)) {
            return res.status(400).json({ message: "Invalid tripadvisorLink URL" });
        }

        if (companyId) {
            const company = await Company.findByPk(companyId);
            if (!company || company.userId !== req.userId) {
                return res.status(403).json({ message: "Invalid company selection" });
            }
        }

        const created = await Review.create({
            userId: req.userId,
            companyId: companyId || null,
            branchName: String(branchName).trim(),
            location: location ? String(location).trim() : null,
            googleLink: googleLink ? String(googleLink).trim() : null,
            tripadvisorLink: tripadvisorLink ? String(tripadvisorLink).trim() : null,
            status: "active"
        });

        return res.status(201).json({ message: "Review saved", review: created });
    } catch (err) {
        console.error("❌ Create review error:", err);
        if (err?.name === "SequelizeUniqueConstraintError") {
            return res.status(409).json({ message: "Duplicate entry: same branch already exists" });
        }
        return res.status(500).json({ message: "Failed to create review", error: err.message });
    }
});


// PUT /reviews/:id - update single review (owner only)
router.put("/reviews/:id", authenticate, async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id);
        if (!review) return res.status(404).json({ message: "Review not found" });

        if (review.userId !== req.userId) return res.status(403).json({ message: "Unauthorized" });

        const { companyId = null, branchName, location = null, googleLink = null, tripadvisorLink = null, status } = req.body;

        if (branchName && !String(branchName).trim()) {
            return res.status(400).json({ message: "Branch name cannot be empty" });
        }

        if (!isValidUrlOrEmpty(googleLink)) {
            return res.status(400).json({ message: "Invalid googleLink URL" });
        }
        if (!isValidUrlOrEmpty(tripadvisorLink)) {
            return res.status(400).json({ message: "Invalid tripadvisorLink URL" });
        }

        // optional: ensure company belongs to user (if provided)
        if (companyId) {
            const company = await Company.findByPk(companyId);
            if (!company || company.userId !== req.userId) {
                return res.status(403).json({ message: "Invalid company selection" });
            }
        }

        await review.update({
            companyId: companyId || null,
            branchName: branchName ? String(branchName).trim() : review.branchName,
            location: location !== undefined ? (location ? String(location).trim() : null) : review.location,
            googleLink: googleLink !== undefined ? (googleLink ? String(googleLink).trim() : null) : review.googleLink,
            tripadvisorLink: tripadvisorLink !== undefined ? (tripadvisorLink ? String(tripadvisorLink).trim() : null) : review.tripadvisorLink,
            status: status || review.status
        });

        return res.json({ message: "Review updated", review });
    } catch (err) {
        console.error("❌ Update review error:", err);
        if (err?.name === "SequelizeUniqueConstraintError") {
            return res.status(409).json({ message: "Duplicate entry: same branch already exists" });
        }
        return res.status(500).json({ message: "Failed to update review", error: err.message });
    }
});

// DELETE /reviews/:id - delete review (owner only)
router.delete("/reviews/:id", authenticate, async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id);
        if (!review) return res.status(404).json({ message: "Review not found" });
        if (review.userId !== req.userId) return res.status(403).json({ message: "Unauthorized" });

        await review.destroy();
        return res.json({ message: "Review deleted" });
    } catch (err) {
        console.error("❌ Delete review error:", err);
        return res.status(500).json({ message: "Failed to delete review", error: err.message });
    }
});

// Update bulk-save to also check limits (replace existing)
router.post("/reviews/bulk-save", authenticate, async (req, res) => {
    const items = Array.isArray(req.body.items) ? req.body.items : [];
    if (!items.length) return res.status(400).json({ message: "No items provided" });

    // Check review limit
    const user = await User.findByPk(req.userId);
    const currentCount = await Review.count({
        where: { userId: req.userId }
    });

    // Count new items (those without id)
    const newItemsCount = items.filter(item => !item.id).length;

    if (currentCount + newItemsCount > user.reviewLimit) {
        return res.status(403).json({
            message: `You can only add ${user.reviewLimit - currentCount} more review(s). Please request more from admin.`,
            limitReached: true
        });
    }

    const sequelizeInstance = Review.sequelize;
    const results = [];

    const t = await sequelizeInstance.transaction();
    try {
        for (const raw of items) {
            const id = raw.id || null;
            const companyId = raw.companyId || null;
            const branchName = raw.branchName ? String(raw.branchName).trim() : null;
            const location = raw.location ? String(raw.location).trim() : null;
            const googleLink = raw.googleLink ? String(raw.googleLink).trim() : null;
            const tripadvisorLink = raw.tripadvisorLink ? String(raw.tripadvisorLink).trim() : null;

            if (!branchName) {
                await t.rollback();
                return res.status(400).json({ message: "Branch name is required for each item" });
            }

            if (!isValidUrlOrEmpty(googleLink) || !isValidUrlOrEmpty(tripadvisorLink)) {
                await t.rollback();
                return res.status(400).json({ message: "Invalid URL in one of the items" });
            }

            if (companyId) {
                const company = await Company.findByPk(companyId);
                if (!company || company.userId !== req.userId) {
                    await t.rollback();
                    return res.status(403).json({ message: "Invalid company selection in one of the items" });
                }
            }

            if (id) {
                const existing = await Review.findByPk(id, { transaction: t });
                if (!existing) {
                    await t.rollback();
                    return res.status(404).json({ message: `Review id=${id} not found` });
                }
                if (existing.userId !== req.userId) {
                    await t.rollback();
                    return res.status(403).json({ message: `Unauthorized for review id=${id}` });
                }

                const updated = await existing.update({
                    companyId: companyId || null,
                    branchName,
                    location,
                    googleLink: googleLink || null,
                    tripadvisorLink: tripadvisorLink || null,
                    status: raw.status || existing.status
                }, { transaction: t });

                results.push(updated);
            } else {
                const created = await Review.create({
                    userId: req.userId,
                    companyId: companyId || null,
                    branchName,
                    location,
                    googleLink: googleLink || null,
                    tripadvisorLink: tripadvisorLink || null,
                    status: raw.status || "active"
                }, { transaction: t });

                results.push(created);
            }
        }

        await t.commit();
        const userReviews = await Review.findAll({
            where: { userId: req.userId },
            include: [{ model: Company, as: "Company", attributes: ["id","companyName"] }],
            order: [["createdAt", "DESC"]]
        });

        return res.json({ message: "Bulk save completed", reviews: userReviews });
    } catch (err) {
        console.error("❌ Bulk save error:", err);
        try { await t.rollback(); } catch (e) { /* ignore */ }
        if (err?.name === "SequelizeUniqueConstraintError") {
            return res.status(409).json({ message: "Duplicate branch entry detected" });
        }
        return res.status(500).json({ message: "Failed to bulk-save reviews", error: err.message });
    }
});


// ADD: Generate shareable URL helper
router.post('/reviews/:id/generate-share', authenticate, async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id, {
            include: [{ model: Company, as: 'Company' }]
        });

        if (!review) return res.status(404).json({ message: 'Review not found' });
        if (review.userId !== req.userId) return res.status(403).json({ message: 'Unauthorized' });

        // Create URL-friendly names
        const companySlug = review.Company.companyName.toLowerCase().replace(/\s+/g, '-');
        const branchSlug = review.branchName.toLowerCase().replace(/\s+/g, '-');

        const frontendBase = process.env.FRONTEND_URL || 'http://localhost:5173';
        const shareUrl = `${frontendBase}/${companySlug}/${branchSlug}`;

        return res.json({ shareUrl });
    } catch (err) {
        console.error('Generate share error', err);
        return res.status(500).json({ message: 'Failed to generate share link' });
    }
});


export default router;
