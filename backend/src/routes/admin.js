import express from "express";
import { authenticateAdmin } from "../middleware/adminAuth.js";
import { logAdminAction, getClientIp, ADMIN_ACTIONS } from "../middleware/adminLogger.js";
import User from "../models/User.js";
import Request from "../models/Request.js";
import Company from "../models/Company.js";
import Contact from "../models/Contact.js";
import Review from "../models/Review.js";
import { Op } from "sequelize";
import bcrypt from "bcryptjs";
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

// [Keep all your existing multer and directory setup code here]
const uploadsDir = path.join(__dirname, "..", "uploads");
const logosDir = path.join(uploadsDir, "logos");
const photosDir = path.join(uploadsDir, "photos");

[uploadsDir, logosDir, photosDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});


const logoStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, logosDir),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});


const photoStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, photosDir),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const imageFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed!"), false);
    }
};

const uploadCompanyLogo = multer({
    storage: logoStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: imageFilter
}).single("logo");

const uploadPhoto = multer({
    storage: photoStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: imageFilter
}).single("photo");

function isValidUrl(string) {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
        return false;
    }
}



// ✅ GET: Overview stats
router.get("/stats/overview", authenticateAdmin, async (req, res) => {
    try {
        const total = await User.count();
        const today = await User.count({
            where: {
                createdAt: { [Op.gte]: new Date().setHours(0, 0, 0, 0) },
            },
        });

        const monthStart = new Date();
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);

        const month = await User.count({
            where: { createdAt: { [Op.gte]: monthStart } },
        });

        const google = await User.count({ where: { provider: "google" } });
        const local = await User.count({ where: { provider: "local" } });

        // Log the action
        await logAdminAction({
            adminId: req.admin.id,
            action: ADMIN_ACTIONS.VIEW_STATS,
            targetType: 'system',
            description: 'Viewed overview statistics',
            ipAddress: getClientIp(req),
            userAgent: req.headers['user-agent']
        });

        res.json({ total, today, month, google, local });
    } catch (err) {
        console.error("❌ Error in stats route:", err);
        res.status(500).json({ message: "Error fetching stats" });
    }
});

// ✅ GET: All users
// ✅ GET: All users - UPDATE THIS
router.get("/users", authenticateAdmin, async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: [
                "id", "name", "phone", "email", "provider",
                "registrationType", "companyLimit", "contactLimit",
                "reviewLimit",  // ADD THIS
                "createdAt"
            ],
            order: [["createdAt", "DESC"]],
        });

        await logAdminAction({
            adminId: req.admin.id,
            action: ADMIN_ACTIONS.VIEW_USERS,
            targetType: 'user',
            description: `Viewed list of ${users.length} users`,
            ipAddress: getClientIp(req),
            userAgent: req.headers['user-agent']
        });

        res.json({ users });
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ message: "Error fetching users" });
    }
});

// ✅ GET: User's companies - ADD 'files' to attributes
router.get("/user/:userId/companies", authenticateAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        const companies = await Company.findAll({
            where: { userId },
            attributes: [
                'id', 'companyName', 'website', 'displayUrl', 'email',
                'logo', 'bio', 'view360', 'googleLocation', 'googleReviews',
                'tripAdvisor', 'socialLinks', 'files', 'status', 'label', 'country', // ADD 'files' here
                'streetAddress', 'streetAddressLine2', 'city', 'postalCode',
                'poBox', 'createdAt'
            ],
            order: [['createdAt', 'DESC']]
        });

        const user = await User.findByPk(userId);

        await logAdminAction({
            adminId: req.admin.id,
            action: ADMIN_ACTIONS.VIEW_COMPANIES,
            targetType: 'user',
            targetId: userId,
            targetName: user?.name || user?.email,
            description: `Viewed ${companies.length} companies for user ${userId}`,
            ipAddress: getClientIp(req),
            userAgent: req.headers['user-agent']
        });

        res.json({ success: true, companies });
    } catch (err) {
        console.error("❌ Error fetching user companies:", err);
        res.status(500).json({
            message: "Error fetching companies",
            error: err.message
        });
    }
});


// ✅ GET: User's contacts
router.get("/user/:userId/contacts", authenticateAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        const contacts = await Contact.findAll({
            where: { userId },
            include: [{
                model: Company,
                as: "Company",
                attributes: ["id", "companyName"]
            }],
            attributes: [
                'id', 'firstName', 'lastName', 'email', 'mobile',
                'telephone', 'whatsapp', 'designation', 'photo', 'companyId',
                'status', 'createdAt', 'cardMobileNum'
            ],
            order: [['createdAt', 'DESC']]
        });

        const user = await User.findByPk(userId);

        await logAdminAction({
            adminId: req.admin.id,
            action: ADMIN_ACTIONS.VIEW_CONTACTS,
            targetType: 'user',
            targetId: userId,
            targetName: user?.name || user?.email,
            description: `Viewed ${contacts.length} contacts for user ${userId}`,
            ipAddress: getClientIp(req),
            userAgent: req.headers['user-agent']
        });

        res.json({ success: true, contacts });
    } catch (err) {
        console.error("❌ Error fetching user contacts:", err);
        res.status(500).json({
            message: "Error fetching contacts",
            error: err.message
        });
    }
});

// ✅ PATCH: Update user limits
router.patch("/user/:userId/limits", authenticateAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        const { companyLimit, contactLimit } = req.body;

        if (!companyLimit || companyLimit < 1 || !contactLimit || contactLimit < 1) {
            return res.status(400).json({ message: "Limits must be at least 1" });
        }

        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const oldLimits = {
            companyLimit: user.companyLimit,
            contactLimit: user.contactLimit
        };

        await user.update({
            companyLimit: parseInt(companyLimit),
            contactLimit: parseInt(contactLimit)
        });

        await logAdminAction({
            adminId: req.admin.id,
            action: ADMIN_ACTIONS.UPDATE_USER_LIMITS,
            targetType: 'user',
            targetId: userId,
            targetName: user.name || user.email,
            description: `Updated limits for ${user.email}`,
            changes: {
                before: oldLimits,
                after: {
                    companyLimit: parseInt(companyLimit),
                    contactLimit: parseInt(contactLimit)
                }
            },
            ipAddress: getClientIp(req),
            userAgent: req.headers['user-agent']
        });

        res.json({
            success: true,
            message: "Limits updated successfully",
            user: {
                id: user.id,
                companyLimit: user.companyLimit,
                contactLimit: user.contactLimit
            }
        });
    } catch (err) {
        console.error("Error updating limits:", err);
        res.status(500).json({ message: "Error updating limits" });
    }
});

// ✅ DELETE: Delete user
router.delete("/user/:id", authenticateAdmin, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const userName = user.name || user.email;
        await user.destroy();

        await logAdminAction({
            adminId: req.admin.id,
            action: ADMIN_ACTIONS.DELETE_USER,
            targetType: 'user',
            targetId: req.params.id,
            targetName: userName,
            description: `Deleted user: ${userName}`,
            ipAddress: getClientIp(req),
            userAgent: req.headers['user-agent']
        });

        res.json({ message: "User deleted successfully" });
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).json({ message: "Error deleting user" });
    }
});

// ✅ GET: All requests
router.get("/requests", authenticateAdmin, async (req, res) => {
    try {
        const requests = await Request.findAll({
            include: [{
                model: User,
                attributes: ["id", "name", "email", "companyLimit", "contactLimit", "reviewLimit"],  // ADD reviewLimit
            }],
            order: [["createdAt", "DESC"]],
        });

        await logAdminAction({
            adminId: req.admin.id,
            action: ADMIN_ACTIONS.VIEW_REQUESTS,
            targetType: 'request',
            description: `Viewed ${requests.length} requests`,
            ipAddress: getClientIp(req),
            userAgent: req.headers['user-agent']
        });

        res.json({ requests });
    } catch (err) {
        console.error("Error fetching requests:", err);
        res.status(500).json({ message: "Error fetching requests" });
    }
});

// ✅ POST: Approve request
// ✅ POST: Approve request - UPDATE THIS FUNCTION
router.post("/request/:id/approve", authenticateAdmin, async (req, res) => {
    try {
        const request = await Request.findByPk(req.params.id, {
            include: [User],
        });

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        if (request.status !== "pending") {
            return res.status(400).json({ message: "Request already processed" });
        }

        const user = request.User;
        const oldLimits = {
            companyLimit: user.companyLimit,
            contactLimit: user.contactLimit,
            reviewLimit: user.reviewLimit  // ADD THIS
        };

        // UPDATE: Include reviewLimit
        await user.update({
            companyLimit: user.companyLimit + request.requestedCompanies,
            contactLimit: user.contactLimit + request.requestedContacts,
            reviewLimit: user.reviewLimit + request.requestedReviews,  // ADD THIS
        });

        await request.update({ status: "approved" });

        await logAdminAction({
            adminId: req.admin.id,
            action: ADMIN_ACTIONS.APPROVE_REQUEST,
            targetType: 'request',
            targetId: req.params.id,
            targetName: user.name || user.email,
            description: `Approved request for ${user.email}`,
            changes: {
                before: oldLimits,
                after: {
                    companyLimit: user.companyLimit,
                    contactLimit: user.contactLimit,
                    reviewLimit: user.reviewLimit  // ADD THIS
                },
                requested: {
                    companies: request.requestedCompanies,
                    contacts: request.requestedContacts,
                    reviews: request.requestedReviews  // ADD THIS
                }
            },
            ipAddress: getClientIp(req),
            userAgent: req.headers['user-agent']
        });

        res.json({
            message: "Request approved successfully",
            request,
            newLimits: {
                companyLimit: user.companyLimit,
                contactLimit: user.contactLimit,
                reviewLimit: user.reviewLimit,  // ADD THIS
            },
        });
    } catch (err) {
        console.error("Error approving request:", err);
        res.status(500).json({ message: "Error approving request" });
    }
});

// ✅ POST: Reject request
router.post("/request/:id/reject", authenticateAdmin, async (req, res) => {
    try {
        const request = await Request.findByPk(req.params.id, {
            include: [User]
        });

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        if (request.status !== "pending") {
            return res.status(400).json({ message: "Request already processed" });
        }

        await request.update({
            status: "rejected",
            reason: req.body.reason || request.reason,
        });

        await logAdminAction({
            adminId: req.admin.id,
            action: ADMIN_ACTIONS.REJECT_REQUEST,
            targetType: 'request',
            targetId: req.params.id,
            targetName: request.User?.name || request.User?.email,
            description: `Rejected request for ${request.User?.email}`,
            changes: {
                reason: req.body.reason
            },
            ipAddress: getClientIp(req),
            userAgent: req.headers['user-agent']
        });

        res.json({ message: "Request rejected", request });
    } catch (err) {
        console.error("Error rejecting request:", err);
        res.status(500).json({ message: "Error rejecting request" });
    }
});

// ✅ POST: Create user
router.post("/create-user", authenticateAdmin, async (req, res) => {
    try {
        const {
            name, email, countryCode, phone, password,
            companyLimit, contactLimit, registrationType
        } = req.body;

        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                message: "Name, email, phone, and password are required"
            });
        }

        if (!companyLimit || companyLimit < 1 || !contactLimit || contactLimit < 1) {
            return res.status(400).json({
                message: "Limits must be at least 1"
            });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                message: "User with this email already exists"
            });
        }

        const fullPhoneNumber = `${countryCode}${phone}`;

        if (!isValidPhoneNumber(fullPhoneNumber)) {
            return res.status(400).json({
                message: "Invalid phone number format"
            });
        }

        const parsedPhone = parsePhoneNumber(fullPhoneNumber);
        const formattedPhone = parsedPhone.format('E.164');

        const existingPhone = await User.findOne({ where: { phone: formattedPhone } });
        if (existingPhone) {
            return res.status(400).json({
                message: "User with this phone number already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            phone: formattedPhone,
            password: hashedPassword,
            provider: "local",
            companyLimit: parseInt(companyLimit),
            contactLimit: parseInt(contactLimit),
            registrationType: registrationType || "admin",
            selectedThemeId: 1,
            status: "active"
        });

        await logAdminAction({
            adminId: req.admin.id,
            action: ADMIN_ACTIONS.CREATE_USER,
            targetType: 'user',
            targetId: newUser.id,
            targetName: newUser.name || newUser.email,
            description: `Created new user: ${newUser.email}`,
            changes: {
                companyLimit: parseInt(companyLimit),
                contactLimit: parseInt(contactLimit),
                registrationType: registrationType || "admin"
            },
            ipAddress: getClientIp(req),
            userAgent: req.headers['user-agent']
        });

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                companyLimit: newUser.companyLimit,
                contactLimit: newUser.contactLimit,
                registrationType: newUser.registrationType,
                selectedThemeId: 1,
            }
        });
    } catch (err) {
        console.error("❌ Error creating user:", err);
        res.status(500).json({
            message: "Error creating user",
            error: err.message
        });
    }
});

// ✅ PUT: Update company
router.put("/user/:userId/company/:companyId", authenticateAdmin, (req, res) => {
    uploadCompanyLogo(req, res, async (err) => {
        if (err) {
            return res.status(400).json({
                message: err.message || "File upload error"
            });
        }

        try {
            console.log("📥 Update company - Body:", req.body);

            const company = await Company.findOne({
                where: {
                    id: req.params.companyId,
                    userId: req.params.userId
                }
            });

            if (!company) {
                return res.status(404).json({ message: "Company not found" });
            }

            const oldData = { ...company.dataValues };

            let socialLinks = company.socialLinks || {};
            if (req.body.socialLinks) {
                try {
                    socialLinks = typeof req.body.socialLinks === 'string'
                        ? JSON.parse(req.body.socialLinks)
                        : req.body.socialLinks;
                } catch (e) {
                    console.error("❌ Error parsing socialLinks:", e);
                }
            }

            // ✅ NEW: Handle links
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

                            // Validate at least one type
                            if (!link.isBrochure && !link.isMenu && !link.isShopNow && !link.isOrderNow) {
                                return res.status(400).json({
                                    message: 'Each link must be marked as Brochure, Menu, Shop Now, or Order Now'
                                });
                            }

                            processedLinks.push({
                                url: link.url.trim(),
                                name: link.name.trim(),
                                isBrochure: Boolean(link.isBrochure),
                                isMenu: Boolean(link.isMenu),
                                isShopNow: Boolean(link.isShopNow),      // NEW
                                isOrderNow: Boolean(link.isOrderNow),    // NEW
                                addedAt: new Date().toISOString()  // or link.addedAt for PUT
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
                companyName: req.body.companyName,
                website: req.body.website,
                displayUrl: req.body.displayUrl || null,
                email: req.body.email,
                status: req.body.status || 'active',
                view360: req.body.view360 || null,
                googleLocation: req.body.googleLocation || null,
                googleReviews: req.body.googleReviews || null,
                tripAdvisor: req.body.tripAdvisor || null,
                bio: req.body.bio || null,
                socialLinks: socialLinks,
                files: processedLinks, // Update links
                label: req.body.label || null,
                country: req.body.country || null,
                streetAddress: req.body.streetAddress || null,
                streetAddressLine2: req.body.streetAddressLine2 || null,
                city: req.body.city || null,
                postalCode: req.body.postalCode || null,
                poBox: req.body.poBox || null
            };

            // Handle logo update
            if (req.file) {
                if (company.logo) {
                    const oldLogoPath = path.join(__dirname, "..", company.logo);
                    if (fs.existsSync(oldLogoPath)) {
                        fs.unlinkSync(oldLogoPath);
                    }
                }
                updateData.logo = `/uploads/logos/${req.file.filename}`;
            } else if (req.body.existingLogo) {
                updateData.logo = req.body.existingLogo;
            }

            await company.update(updateData);
            console.log("✅ Company updated successfully");

            await logAdminAction({
                adminId: req.admin.id,
                action: ADMIN_ACTIONS.UPDATE_COMPANY,
                targetType: 'company',
                targetId: req.params.companyId,
                targetName: company.companyName,
                description: `Updated company: ${company.companyName}`,
                changes: {
                    before: {
                        companyName: oldData.companyName,
                        email: oldData.email,
                        website: oldData.website
                    },
                    after: {
                        companyName: updateData.companyName,
                        email: updateData.email,
                        website: updateData.website
                    }
                },
                ipAddress: getClientIp(req),
                userAgent: req.headers['user-agent']
            });

            const updatedCompany = await Company.findByPk(req.params.companyId);

            res.json({
                success: true,
                message: "Company updated successfully",
                company: updatedCompany
            });
        } catch (err) {
            console.error("❌ Error updating company:", err);
            res.status(500).json({
                message: "Failed to update company",
                error: err.message
            });
        }
    });
});


// ✅ PUT: Update contact
router.put("/user/:userId/contact/:contactId", authenticateAdmin, (req, res) => {
    uploadPhoto(req, res, async (err) => {
        if (err) {
            return res.status(400).json({
                message: err.message || "File upload error"
            });
        }

        try {
            const contact = await Contact.findOne({
                where: {
                    id: req.params.contactId,
                    userId: req.params.userId
                }
            });

            if (!contact) {
                return res.status(404).json({ message: "Contact not found" });
            }

            const oldData = { ...contact.dataValues };

            // -------------------------
            // FORMAT MOBILE
            // -------------------------
            let formattedMobile = req.body.mobile;
            if (!isValidPhoneNumber(formattedMobile)) {
                return res.status(400).json({ message: "Invalid mobile number" });
            }
            formattedMobile = parsePhoneNumber(formattedMobile).format("E.164");

            // -------------------------
            // FORMAT TELEPHONE
            // -------------------------
            let formattedTelephone = null;
            if (req.body.telephone) {
                if (!isValidPhoneNumber(req.body.telephone)) {
                    return res.status(400).json({ message: "Invalid telephone number" });
                }
                formattedTelephone = parsePhoneNumber(req.body.telephone).format("E.164");
            }

            // -------------------------
            // FORMAT WHATSAPP
            // -------------------------
            let formattedWhatsapp = req.body.whatsapp;

            // -------------------------
            // FORMAT NEW CARD MOBILE FIELD
            // -------------------------
            let formattedCardMobile = req.body.cardMobileNum;

            if (formattedCardMobile) {
                // User typed a manual number
                formattedCardMobile = parsePhoneNumber(formattedCardMobile).format("E.164");
            } else {
                // Checkbox ON → use mobile
                formattedCardMobile = formattedMobile;
            }

            // -------------------------
            // BUILD UPDATE OBJECT
            // -------------------------
            const updateData = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                telephone: formattedTelephone,
                mobile: formattedMobile,
                whatsapp: formattedWhatsapp,
                cardMobileNum: formattedCardMobile,   // ✅ added correctly
                email: req.body.email,
                designation: req.body.designation,
                companyId: req.body.companyId || null,
                status: req.body.status || "active"
            };

            // -------------------------
            // PHOTO HANDLING
            // -------------------------
            if (req.file) {
                if (contact.photo) {
                    const oldPath = path.join(__dirname, "..", contact.photo);
                    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
                }
                updateData.photo = `/uploads/photos/${req.file.filename}`;
            } else if (req.body.existingPhoto) {
                updateData.photo = req.body.existingPhoto;
            }

            // -------------------------
            // UPDATE CONTACT
            // -------------------------
            await contact.update(updateData);

            await logAdminAction({
                adminId: req.admin.id,
                action: ADMIN_ACTIONS.UPDATE_CONTACT,
                targetType: "contact",
                targetId: req.params.contactId,
                targetName: `${contact.firstName} ${contact.lastName}`,
                description: `Updated contact: ${contact.firstName} ${contact.lastName}`,
                changes: {
                    before: {
                        firstName: oldData.firstName,
                        lastName: oldData.lastName,
                        email: oldData.email
                    },
                    after: {
                        firstName: updateData.firstName,
                        lastName: updateData.lastName,
                        email: updateData.email
                    }
                },
                ipAddress: getClientIp(req),
                userAgent: req.headers["user-agent"]
            });

            const updatedContact = await Contact.findByPk(req.params.contactId, {
                include: [{
                    model: Company,
                    as: "Company",
                    attributes: ["id", "companyName"]
                }]
            });

            res.json({
                success: true,
                message: "Contact updated successfully",
                contact: updatedContact
            });

        } catch (err) {
            console.error("❌ Error updating contact:", err);
            res.status(500).json({
                message: "Failed to update contact",
                error: err.message
            });
        }
    });
});


// ✅ POST: Create company
router.post("/user/:userId/company", authenticateAdmin, (req, res) => {
    uploadCompanyLogo(req, res, async (err) => {
        if (err) {
            return res.status(400).json({
                message: err.message || "File upload error"
            });
        }

        try {
            console.log("📥 Create company - Body:", req.body);

            const userId = req.params.userId;
            const user = await User.findByPk(userId);

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Check company limit
            const companyCount = await Company.count({ where: { userId } });
            if (companyCount >= user.companyLimit) {
                return res.status(400).json({
                    message: "Company limit reached for this user"
                });
            }

            // Logo is required for new companies
            if (!req.file) {
                return res.status(400).json({
                    message: "Company logo is required"
                });
            }

            let socialLinks = {};
            if (req.body.socialLinks) {
                try {
                    socialLinks = typeof req.body.socialLinks === 'string'
                        ? JSON.parse(req.body.socialLinks)
                        : req.body.socialLinks;
                } catch (e) {
                    console.error("❌ Error parsing socialLinks:", e);
                }
            }

            // ✅ NEW: Handle links (brochures/menus)
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

                            // Validate at least one type is selected
                            if (!link.isBrochure && !link.isMenu && !link.isShopNow && !link.isOrderNow) {
                                return res.status(400).json({
                                    message: 'Each link must be marked as Brochure, Menu, Shop Now, or Order Now'
                                });
                            }

                            processedLinks.push({
                                url: link.url.trim(),
                                name: link.name.trim(),
                                isBrochure: Boolean(link.isBrochure),
                                isMenu: Boolean(link.isMenu),
                                isShopNow: Boolean(link.isShopNow),      // NEW
                                isOrderNow: Boolean(link.isOrderNow),    // NEW
                                addedAt: new Date().toISOString()  // or link.addedAt for PUT
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

            const companyData = {
                userId,
                companyName: req.body.companyName,
                website: req.body.website,
                displayUrl: req.body.displayUrl || null,
                email: req.body.email,
                status: req.body.status || 'active',
                view360: req.body.view360 || null,
                googleLocation: req.body.googleLocation || null,
                googleReviews: req.body.googleReviews || null,
                tripAdvisor: req.body.tripAdvisor || null,
                bio: req.body.bio || null,
                socialLinks: socialLinks,
                files: processedLinks, // Store links array
                label: req.body.label || null,
                country: req.body.country || null,
                streetAddress: req.body.streetAddress || null,
                streetAddressLine2: req.body.streetAddressLine2 || null,
                city: req.body.city || null,
                postalCode: req.body.postalCode || null,
                poBox: req.body.poBox || null,
                logo: `/uploads/logos/${req.file.filename}`
            };

            const newCompany = await Company.create(companyData);
            console.log("✅ Company created successfully");

            await logAdminAction({
                adminId: req.admin.id,
                action: ADMIN_ACTIONS.CREATE_COMPANY,
                targetType: 'company',
                targetId: newCompany.id,
                targetName: newCompany.companyName,
                description: `Created company: ${newCompany.companyName} for user ${user.email}`,
                ipAddress: getClientIp(req),
                userAgent: req.headers['user-agent']
            });

            res.status(201).json({
                success: true,
                message: "Company created successfully",
                company: newCompany
            });
        } catch (err) {
            console.error("❌ Error creating company:", err);
            res.status(500).json({
                message: "Failed to create company",
                error: err.message
            });
        }
    });
});

// ✅ POST: Create contact
router.post("/user/:userId/contact", authenticateAdmin, (req, res) => {
    uploadPhoto(req, res, async (err) => {
        if (err) {
            return res.status(400).json({
                message: err.message || "File upload error"
            });
        }

        try {
            const userId = req.params.userId;
            const user = await User.findByPk(userId);

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Check contact limit
            const contactCount = await Contact.count({ where: { userId } });
            if (contactCount >= user.contactLimit) {
                return res.status(400).json({
                    message: "Contact limit reached for this user"
                });
            }

            // --- FORMAT MOBILE ---
            let formattedMobile = req.body.mobile;
            if (!isValidPhoneNumber(formattedMobile)) {
                return res.status(400).json({
                    message: "Invalid mobile number format"
                });
            }
            formattedMobile = parsePhoneNumber(formattedMobile).format("E.164");

            // --- FORMAT TELEPHONE ---
            let formattedTelephone = null;
            if (req.body.telephone) {
                if (!isValidPhoneNumber(req.body.telephone)) {
                    return res.status(400).json({
                        message: "Invalid telephone number format"
                    });
                }
                formattedTelephone = parsePhoneNumber(req.body.telephone).format("E.164");
            }

            // --- FORMAT WHATSAPP ---
            let formattedWhatsapp = req.body.whatsapp;

            // --- FORMAT CARD MOBILE (NEW FIELD) ---
            let formattedCardMobile = req.body.cardMobileNum;

            if (formattedCardMobile) {
                // user entered a manual number
                const parsed = parsePhoneNumber(formattedCardMobile);
                formattedCardMobile = parsed.format("E.164");
            } else {
                // checkbox ON → same as mobile
                formattedCardMobile = formattedMobile;
            }

            // --- FINAL CONTACT DATA ---
            const contactData = {
                userId,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                telephone: formattedTelephone,
                mobile: formattedMobile,
                whatsapp: formattedWhatsapp,
                cardMobileNum: formattedCardMobile,   // ✅ added correctly here
                email: req.body.email,
                designation: req.body.designation,
                companyId: req.body.companyId || null,
                status: req.body.status || 'active'
            };

            // Photo upload
            if (req.file) {
                contactData.photo = `/uploads/photos/${req.file.filename}`;
            }

            // Create new contact
            const newContact = await Contact.create(contactData);

            await logAdminAction({
                adminId: req.admin.id,
                action: ADMIN_ACTIONS.CREATE_CONTACT,
                targetType: 'contact',
                targetId: newContact.id,
                targetName: `${newContact.firstName} ${newContact.lastName}`,
                description: `Created contact: ${newContact.firstName} ${newContact.lastName} for user ${user.email}`,
                ipAddress: getClientIp(req),
                userAgent: req.headers['user-agent']
            });

            const contactWithCompany = await Contact.findByPk(newContact.id, {
                include: [{
                    model: Company,
                    as: "Company",
                    attributes: ["id", "companyName"]
                }]
            });

            res.status(201).json({
                success: true,
                message: "Contact created successfully",
                contact: contactWithCompany
            });

        } catch (err) {
            console.error("❌ Error creating contact:", err);
            res.status(500).json({
                message: "Failed to create contact",
                error: err.message
            });
        }
    });
});


router.get("/user/:userId/reviews", authenticateAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        const reviews = await Review.findAll({
            where: { userId },
            include: [{
                model: Company,
                as: "Company",
                attributes: ["id", "companyName"]
            }],
            attributes: [
                'id', 'companyId', 'branchName', 'location',
                'googleLink', 'tripadvisorLink', 'createdAt'
            ],
            order: [['createdAt', 'DESC']]
        });

        const user = await User.findByPk(userId);

        await logAdminAction({
            adminId: req.admin.id,
            action: ADMIN_ACTIONS.VIEW_REVIEWS,
            targetType: 'user',
            targetId: userId,
            targetName: user?.name || user?.email,
            description: `Viewed ${reviews.length} reviews for user ${userId}`,
            ipAddress: getClientIp(req),
            userAgent: req.headers['user-agent']
        });

        res.json({ success: true, reviews });
    } catch (err) {
        console.error("❌ Error fetching user reviews:", err);
        res.status(500).json({
            message: "Error fetching reviews",
            error: err.message
        });
    }
});

// ✅ GET: Single review by ID
router.get("/user/:userId/review/:reviewId", authenticateAdmin, async (req, res) => {
    try {
        const { userId, reviewId } = req.params;

        const review = await Review.findOne({
            where: {
                id: reviewId,
                userId: userId
            }
        });

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        res.json({ success: true, review });
    } catch (err) {
        console.error("❌ Error fetching review:", err);
        res.status(500).json({
            message: "Error fetching review",
            error: err.message
        });
    }
});

// ✅ POST: Create review
router.post("/user/:userId/review", authenticateAdmin, async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check review limit
        const reviewCount = await Review.count({ where: { userId } });
        if (reviewCount >= user.reviewLimit) {
            return res.status(400).json({
                message: "Review limit reached for this user"
            });
        }

        // Validate required fields
        if (!req.body.companyId) {
            return res.status(400).json({ message: "Company is required" });
        }

        if (!req.body.branchName || !req.body.branchName.trim()) {
            return res.status(400).json({ message: "Branch name is required" });
        }

        // Validate URLs if provided
        if (req.body.googleLink && !isValidUrl(req.body.googleLink)) {
            return res.status(400).json({ message: "Invalid Google Review URL" });
        }

        if (req.body.tripadvisorLink && !isValidUrl(req.body.tripadvisorLink)) {
            return res.status(400).json({ message: "Invalid Tripadvisor URL" });
        }

        const reviewData = {
            userId,
            companyId: req.body.companyId,
            branchName: req.body.branchName.trim(),
            location: req.body.location?.trim() || null,
            googleLink: req.body.googleLink?.trim() || null,
            tripadvisorLink: req.body.tripadvisorLink?.trim() || null
        };

        const newReview = await Review.create(reviewData);

        await logAdminAction({
            adminId: req.admin.id,
            action: ADMIN_ACTIONS.CREATE_REVIEW,
            targetType: 'review',
            targetId: newReview.id,
            targetName: newReview.branchName,
            description: `Created review: ${newReview.branchName} for user ${user.email}`,
            ipAddress: getClientIp(req),
            userAgent: req.headers['user-agent']
        });

        const reviewWithCompany = await Review.findByPk(newReview.id, {
            include: [{
                model: Company,
                as: "Company",
                attributes: ["id", "companyName"]
            }]
        });

        res.status(201).json({
            success: true,
            message: "Review created successfully",
            review: reviewWithCompany
        });

    } catch (err) {
        console.error("❌ Error creating review:", err);
        res.status(500).json({
            message: "Failed to create review",
            error: err.message
        });
    }
});

// ✅ PUT: Update review
router.put("/user/:userId/review/:reviewId", authenticateAdmin, async (req, res) => {
    try {
        const review = await Review.findOne({
            where: {
                id: req.params.reviewId,
                userId: req.params.userId
            }
        });

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        const oldData = { ...review.dataValues };

        // Validate required fields
        if (!req.body.companyId) {
            return res.status(400).json({ message: "Company is required" });
        }

        if (!req.body.branchName || !req.body.branchName.trim()) {
            return res.status(400).json({ message: "Branch name is required" });
        }

        // Validate URLs if provided
        if (req.body.googleLink && !isValidUrl(req.body.googleLink)) {
            return res.status(400).json({ message: "Invalid Google Review URL" });
        }

        if (req.body.tripadvisorLink && !isValidUrl(req.body.tripadvisorLink)) {
            return res.status(400).json({ message: "Invalid Tripadvisor URL" });
        }

        const updateData = {
            companyId: req.body.companyId,
            branchName: req.body.branchName.trim(),
            location: req.body.location?.trim() || null,
            googleLink: req.body.googleLink?.trim() || null,
            tripadvisorLink: req.body.tripadvisorLink?.trim() || null
        };

        await review.update(updateData);

        await logAdminAction({
            adminId: req.admin.id,
            action: ADMIN_ACTIONS.UPDATE_REVIEW,
            targetType: 'review',
            targetId: req.params.reviewId,
            targetName: review.branchName,
            description: `Updated review: ${review.branchName}`,
            changes: {
                before: {
                    branchName: oldData.branchName,
                    location: oldData.location
                },
                after: {
                    branchName: updateData.branchName,
                    location: updateData.location
                }
            },
            ipAddress: getClientIp(req),
            userAgent: req.headers['user-agent']
        });

        const updatedReview = await Review.findByPk(req.params.reviewId, {
            include: [{
                model: Company,
                as: "Company",
                attributes: ["id", "companyName"]
            }]
        });

        res.json({
            success: true,
            message: "Review updated successfully",
            review: updatedReview
        });

    } catch (err) {
        console.error("❌ Error updating review:", err);
        res.status(500).json({
            message: "Failed to update review",
            error: err.message
        });
    }
});

// ✅ DELETE: Delete review
router.delete("/user/:userId/review/:reviewId", authenticateAdmin, async (req, res) => {
    try {
        const review = await Review.findOne({
            where: {
                id: req.params.reviewId,
                userId: req.params.userId
            }
        });

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        const reviewName = review.branchName;
        await review.destroy();

        await logAdminAction({
            adminId: req.admin.id,
            action: ADMIN_ACTIONS.DELETE_REVIEW,
            targetType: 'review',
            targetId: req.params.reviewId,
            targetName: reviewName,
            description: `Deleted review: ${reviewName}`,
            ipAddress: getClientIp(req),
            userAgent: req.headers['user-agent']
        });

        res.json({
            success: true,
            message: "Review deleted successfully"
        });

    } catch (err) {
        console.error("❌ Error deleting review:", err);
        res.status(500).json({
            message: "Failed to delete review",
            error: err.message
        });
    }
});

export default router;
