import express from "express";
import { authenticateAdmin } from "../middleware/adminAuth.js";
import { ADMIN_ACTIONS, getClientIp, logAdminAction } from "../middleware/adminLogger.js";
import User from "../models/User.js";
import Request from "../models/Request.js";
import Company from "../models/Company.js";
import Contact from "../models/Contact.js";
import Review from "../models/Review.js";
import { Op } from "sequelize";
import bcrypt from "bcryptjs";
import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { PKPass } from "passkit-generator";
import jwt from "jsonwebtoken";
import https from "https";
import http from "http";

// ── MUST BE FIRST before any path.join(__dirname, ...) ──
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Wallet config (now __dirname is defined) ──────────────
const SERVICE_ACCOUNT = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../config/tapmyname-06b39e405c92.json"), "utf8")
);
const ISSUER_ID    = process.env.GW_ISSUER_ID;
const CLASS_SUFFIX = process.env.GW_WALLET_CLASS_ID;
const ORIGINS      = (process.env.GW_ORIGINS || "").split(",").filter(Boolean);

const PROJECT_ROOT      = path.resolve(__dirname, "../../../");
const APPLE_TEMPLATE_PATH = path.join(PROJECT_ROOT, "pass-template.pass");
const wwdrPath          = path.join(PROJECT_ROOT, "certs/wwdr.pem");
const signerCertPath    = path.join(PROJECT_ROOT, "certs/signerCert.pem");
const signerKeyPath     = path.join(PROJECT_ROOT, "certs/signerKey.pem");

const router = express.Router();

// [Keep all your existing multer and directory setup code here]
const uploadsDir = path.join(__dirname, "..", "uploads");
const logosDir = path.join(uploadsDir, "logos");
const photosDir = path.join(uploadsDir, "photos");

[uploadsDir, logosDir, photosDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {recursive: true});
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
    limits: {fileSize: 5 * 1024 * 1024},
    fileFilter: imageFilter
}).single("logo");

const uploadPhoto = multer({
    storage: photoStorage,
    limits: {fileSize: 5 * 1024 * 1024},
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
                createdAt: {[Op.gte]: new Date().setHours(0, 0, 0, 0)},
            },
        });

        const monthStart = new Date();
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);

        const month = await User.count({
            where: {createdAt: {[Op.gte]: monthStart}},
        });

        const google = await User.count({where: {provider: "google"}});
        const local = await User.count({where: {provider: "local"}});
        const apple = await User.count({
            where: {
                appleId: {[Op.ne]: null},
            },
        });

        // Log the action
        await logAdminAction({
            adminId: req.admin.id,
            action: ADMIN_ACTIONS.VIEW_STATS,
            targetType: 'system',
            description: 'Viewed overview statistics',
            ipAddress: getClientIp(req),
            userAgent: req.headers['user-agent']
        });

        res.json({total, today, month, google, local, apple});
    } catch (err) {
        console.error("❌ Error in stats route:", err);
        res.status(500).json({message: "Error fetching stats"});
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
                "createdAt", "plan"
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

        res.json({users});
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({message: "Error fetching users"});
    }
});

// ✅ GET: user's companies - ADD 'files' to attributes
router.get("/user/:userId/companies", authenticateAdmin, async (req, res) => {
    try {
        const {userId} = req.params;
        const companies = await Company.findAll({
            where: {userId},
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

        res.json({success: true, companies});
    } catch (err) {
        console.error("❌ Error fetching user companies:", err);
        res.status(500).json({
            message: "Error fetching companies",
            error: err.message
        });
    }
});


// ✅ GET: user's contacts
router.get("/user/:userId/contacts", authenticateAdmin, async (req, res) => {
    try {
        const {userId} = req.params;
        const contacts = await Contact.findAll({
            where: {userId},
            include: [{
                model: Company,
                as: "Company",
                attributes: ["id", "companyName"]
            }],
            attributes: [
                'id', 'type',
                'firstName', 'lastName', 'email', 'mobile',
                'telephone', 'whatsapp', 'whatsappChannel', 'designation', 'photo', 'companyId',
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

        res.json({success: true, contacts});
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
        const {userId} = req.params;
        const {companyLimit, contactLimit, plan} = req.body;

        if (!companyLimit || companyLimit < 1 || !contactLimit || contactLimit < 1) {
            return res.status(400).json({message: "Limits must be at least 1"});
        }

        const allowedPlans = ["free", "plus", "pro"];
        if (plan && !allowedPlans.includes(plan)) {
            return res.status(400).json({message: "Invalid plan value"});
        }

        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({message: "user not found"});

        const oldData = {
            companyLimit: user.companyLimit,
            contactLimit: user.contactLimit,
            plan: user.plan
        };

        await user.update({
            companyLimit: parseInt(companyLimit),
            contactLimit: parseInt(contactLimit),
            plan: plan || user.plan
        });

        await logAdminAction({
            adminId: req.admin.id,
            action: ADMIN_ACTIONS.UPDATE_USER_LIMITS,
            targetType: "user",
            targetId: userId,
            targetName: user.name || user.email,
            description: `Updated limits/plan for ${user.email}`,
            changes: {
                before: oldData,
                after: {
                    companyLimit: user.companyLimit,
                    contactLimit: user.contactLimit,
                    plan: user.plan
                }
            },
            ipAddress: getClientIp(req),
            userAgent: req.headers["user-agent"]
        });

        res.json({
            success: true,
            message: "Limits and plan updated successfully",
            user: {
                id: user.id,
                companyLimit: user.companyLimit,
                contactLimit: user.contactLimit,
                plan: user.plan
            }
        });
    } catch (err) {
        console.error("Error updating limits/plan:", err);
        res.status(500).json({message: "Error updating limits/plan"});
    }
});


// ✅ DELETE: Delete user
router.delete("/user/:id", authenticateAdmin, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({message: "user not found"});

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

        res.json({message: "user deleted successfully"});
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).json({message: "Error deleting user"});
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

        res.json({requests});
    } catch (err) {
        console.error("Error fetching requests:", err);
        res.status(500).json({message: "Error fetching requests"});
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
            return res.status(404).json({message: "Request not found"});
        }

        if (request.status !== "pending") {
            return res.status(400).json({message: "Request already processed"});
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

        await request.update({status: "approved"});

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
        res.status(500).json({message: "Error approving request"});
    }
});

// ✅ POST: Reject request
router.post("/request/:id/reject", authenticateAdmin, async (req, res) => {
    try {
        const request = await Request.findByPk(req.params.id, {
            include: [User]
        });

        if (!request) {
            return res.status(404).json({message: "Request not found"});
        }

        if (request.status !== "pending") {
            return res.status(400).json({message: "Request already processed"});
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

        res.json({message: "Request rejected", request});
    } catch (err) {
        console.error("Error rejecting request:", err);
        res.status(500).json({message: "Error rejecting request"});
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

        const existingUser = await User.findOne({where: {email}});
        if (existingUser) {
            return res.status(400).json({
                message: "user with this email already exists"
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

        const existingPhone = await User.findOne({where: {phone: formattedPhone}});
        if (existingPhone) {
            return res.status(400).json({
                message: "user with this phone number already exists"
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
            message: "user created successfully",
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

// ✅ PUT: Update company (UPDATED - Logo Optional)
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
                return res.status(404).json({message: "Company not found"});
            }

            const oldData = {...company.dataValues};

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

            // Handle links
            let processedLinks = [];

            if (req.body.files) {
                try {
                    const links = JSON.parse(req.body.files);

                    if (Array.isArray(links)) {
                        for (const link of links) {
                            if (!link.url || !isValidUrl(link.url)) {
                                return res.status(400).json({
                                    message: `Invalid URL: ${link.url || 'empty'}`
                                });
                            }

                            if (!link.name || !link.name.trim()) {
                                return res.status(400).json({
                                    message: 'Link name is required'
                                });
                            }

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
                                isShopNow: Boolean(link.isShopNow),
                                isOrderNow: Boolean(link.isOrderNow),
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
                files: processedLinks,
                label: req.body.label || null,
                country: req.body.country || null,
                streetAddress: req.body.streetAddress || null,
                streetAddressLine2: req.body.streetAddressLine2 || null,
                city: req.body.city || null,
                postalCode: req.body.postalCode || null,
                poBox: req.body.poBox || null
            };

            // ✅ FIXED: Handle logo update (OPTIONAL)
            if (req.file) {
                // New logo uploaded - delete old one if exists
                if (company.logo) {
                    const oldLogoPath = path.join(__dirname, "..", company.logo);
                    if (fs.existsSync(oldLogoPath)) {
                        fs.unlinkSync(oldLogoPath);
                    }
                }
                updateData.logo = `/uploads/logos/${req.file.filename}`;
            } else if (req.body.existingLogo) {
                // Keep existing logo
                updateData.logo = req.body.existingLogo;
            }
            // ✅ If no file and no existingLogo, logo remains unchanged (keeps current value)

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
                return res.status(404).json({message: "Contact not found"});
            }

            const oldData = {...contact.dataValues};

            // -------------------------
            // FORMAT MOBILE
            // -------------------------
            let formattedMobile = req.body.mobile;
            if (!isValidPhoneNumber(formattedMobile)) {
                return res.status(400).json({message: "Invalid mobile number"});
            }
            formattedMobile = parsePhoneNumber(formattedMobile).format("E.164");

            // -------------------------
            // FORMAT TELEPHONE
            // -------------------------
            let formattedTelephone = null;
            if (req.body.telephone) {
                if (!isValidPhoneNumber(req.body.telephone)) {
                    return res.status(400).json({message: "Invalid telephone number"});
                }
                formattedTelephone = parsePhoneNumber(req.body.telephone).format("E.164");
            }

            // -------------------------
            // FORMAT WHATSAPP
            // -------------------------
            let formattedWhatsapp = req.body.whatsapp;

            if (req.body.whatsappChannel && req.body.whatsappChannel.trim()) {
                const urlPattern = /^https?:\/\/.+/i;
                if (!urlPattern.test(req.body.whatsappChannel.trim())) {
                    return res.status(400).json({
                        message: "WhatsApp Channel must be a valid URL"
                    });
                }
            }

            // -------------------------
            // FORMAT NEW CARD MOBILE FIELD
            // -------------------------
            let formattedCardMobile = req.body.cardMobileNum;

            if (formattedCardMobile) {
                // user typed a manual number
                formattedCardMobile = parsePhoneNumber(formattedCardMobile).format("E.164");
            } else {
                // Checkbox ON → use mobile
                formattedCardMobile = formattedMobile;
            }

            // ✅ Validate contact type if provided
            const contactType = req.body.type;
            if (contactType && !['individual', 'group'].includes(contactType)) {
                return res.status(400).json({
                    message: "Type must be either 'individual' or 'group'"
                });
            }

            const updateData = {
                type: contactType || contact.type,              // ✅ NEW — keep existing if not sent
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                telephone: formattedTelephone,
                mobile: formattedMobile,
                whatsapp: formattedWhatsapp,
                cardMobileNum: formattedCardMobile,
                whatsappChannel: req.body.whatsappChannel ? req.body.whatsappChannel.trim() : null,
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
                return res.status(404).json({message: "user not found"});
            }

            // Check company limit
            const companyCount = await Company.count({where: {userId}});
            if (companyCount >= user.companyLimit) {
                return res.status(400).json({
                    message: "Company limit reached for this user"
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

            // Handle links
            let processedLinks = [];

            if (req.body.files) {
                try {
                    const links = JSON.parse(req.body.files);

                    if (Array.isArray(links)) {
                        for (const link of links) {
                            if (!link.url || !isValidUrl(link.url)) {
                                return res.status(400).json({
                                    message: `Invalid URL: ${link.url || 'empty'}`
                                });
                            }

                            if (!link.name || !link.name.trim()) {
                                return res.status(400).json({
                                    message: 'Link name is required'
                                });
                            }

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
                                isShopNow: Boolean(link.isShopNow),
                                isOrderNow: Boolean(link.isOrderNow),
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
                files: processedLinks,
                label: req.body.label || null,
                country: req.body.country || null,
                streetAddress: req.body.streetAddress || null,
                streetAddressLine2: req.body.streetAddressLine2 || null,
                city: req.body.city || null,
                postalCode: req.body.postalCode || null,
                poBox: req.body.poBox || null,
                logo: null // ✅ Initialize as null
            };

            // ✅ FIXED: Only add logo if file was uploaded
            if (req.file) {
                companyData.logo = `/uploads/logos/${req.file.filename}`;
            }

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
                return res.status(404).json({message: "user not found"});
            }

            // Check contact limit
            const contactCount = await Contact.count({where: {userId}});
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

            // ✅ ADD: Validate WhatsApp Channel URL if provided
            if (req.body.whatsappChannel && req.body.whatsappChannel.trim()) {
                const urlPattern = /^https?:\/\/.+/i;
                if (!urlPattern.test(req.body.whatsappChannel.trim())) {
                    return res.status(400).json({
                        message: "WhatsApp Channel must be a valid URL"
                    });
                }
            }

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

            const contactType = req.body.type || 'individual';
            if (!['individual', 'group'].includes(contactType)) {
                return res.status(400).json({
                    message: "Type must be either 'individual' or 'group'"
                });
            }

            const contactData = {
                userId,
                type: contactType,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                telephone: formattedTelephone,
                mobile: formattedMobile,
                whatsapp: formattedWhatsapp,
                whatsappChannel: req.body.whatsappChannel?.trim() || null,
                cardMobileNum: formattedCardMobile,
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
        const {userId} = req.params;
        const reviews = await Review.findAll({
            where: {userId},
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

        res.json({success: true, reviews});
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
        const {userId, reviewId} = req.params;

        const review = await Review.findOne({
            where: {
                id: reviewId,
                userId: userId
            }
        });

        if (!review) {
            return res.status(404).json({message: "Review not found"});
        }

        res.json({success: true, review});
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
            return res.status(404).json({message: "user not found"});
        }

        // Check review limit
        const reviewCount = await Review.count({where: {userId}});
        if (reviewCount >= user.reviewLimit) {
            return res.status(400).json({
                message: "Review limit reached for this user"
            });
        }

        // Validate required fields
        if (!req.body.companyId) {
            return res.status(400).json({message: "Company is required"});
        }

        if (!req.body.branchName || !req.body.branchName.trim()) {
            return res.status(400).json({message: "Branch name is required"});
        }

        // Validate URLs if provided
        if (req.body.googleLink && !isValidUrl(req.body.googleLink)) {
            return res.status(400).json({message: "Invalid Google Review URL"});
        }

        if (req.body.tripadvisorLink && !isValidUrl(req.body.tripadvisorLink)) {
            return res.status(400).json({message: "Invalid Tripadvisor URL"});
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
            return res.status(404).json({message: "Review not found"});
        }

        const oldData = {...review.dataValues};

        // Validate required fields
        if (!req.body.companyId) {
            return res.status(400).json({message: "Company is required"});
        }

        if (!req.body.branchName || !req.body.branchName.trim()) {
            return res.status(400).json({message: "Branch name is required"});
        }

        // Validate URLs if provided
        if (req.body.googleLink && !isValidUrl(req.body.googleLink)) {
            return res.status(400).json({message: "Invalid Google Review URL"});
        }

        if (req.body.tripadvisorLink && !isValidUrl(req.body.tripadvisorLink)) {
            return res.status(400).json({message: "Invalid Tripadvisor URL"});
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
            return res.status(404).json({message: "Review not found"});
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

// ── GOOGLE WALLET: generate save URL (admin) ──────────────────
// POST /api/admin/google-wallet/save-url
router.post("/google-wallet/save-url", authenticateAdmin, async (req, res) => {
    try {
        const {contact, objectIdSuffix} = req.body;
        if (!contact) return res.status(400).json({message: "contact required"});

        const now = Math.floor(Date.now() / 1000);
        const classId = `${ISSUER_ID}.${CLASS_SUFFIX}`;
        const objectId = `${ISSUER_ID}.${objectIdSuffix || `contact_admin_${Date.now()}`}_${Date.now()}`;
        const IMAGE_BASE_URL = process.env.IMAGE_UPLOAD_URL || "https://tapmy.name";

        let logoUrl = contact.companyLogo?.trim()
            ? contact.companyLogo
            : contact.photo?.trim()
                ? contact.photo
                : null;

        const heroImageUrl = contact.photo?.trim() ? contact.photo : null;

        const jwtPayload = {
            iss: SERVICE_ACCOUNT.client_email,
            aud: "google",
            typ: "savetowallet",
            iat: now,
            exp: now + 3600,
            origins: ORIGINS,
            payload: {
                genericObjects: [{
                    id: objectId,
                    classId,
                    state: "ACTIVE",
                    ...(logoUrl && {
                        logo: {
                            sourceUri: {uri: logoUrl},
                            contentDescription: {defaultValue: {language: "en-US", value: "Logo"}},
                        },
                    }),
                    ...(heroImageUrl && {
                        heroImage: {
                            sourceUri: {uri: heroImageUrl},
                            contentDescription: {defaultValue: {language: "en-US", value: "Photo"}},
                        },
                    }),
                    cardTitle: {defaultValue: {language: "en-US", value: contact.name || "Contact Card"}},
                    header: {defaultValue: {language: "en-US", value: contact.designation || "Digital Business Card"}},
                    ...(contact.companyName && {
                        subheader: {defaultValue: {language: "en-US", value: contact.companyName}},
                    }),
                    ...(contact.shareUrl && {barcode: {type: "QR_CODE", value: contact.shareUrl}}),
                    textModulesData: [
                        contact.phone ? {id: "phone", header: "Phone", body: contact.phone} : null,
                        contact.email ? {id: "email", header: "Email", body: contact.email} : null,
                    ].filter(Boolean),
                }],
            },
        };

        const signedJwt = jwt.sign(jwtPayload, SERVICE_ACCOUNT.private_key, {
            algorithm: "RS256",
            keyid: SERVICE_ACCOUNT.private_key_id,
        });

        res.json({saveUrl: `https://pay.google.com/gp/v/save/${signedJwt}`});

    } catch (err) {
        console.error("Admin Google Wallet error:", err);
        res.status(500).json({message: "Failed to generate Google Wallet URL", error: err.message});
    }
});


// ── APPLE WALLET: download pkpass (admin) ─────────────────────
// POST /api/admin/apple-wallet/pass
router.post("/apple-wallet/pass", authenticateAdmin, async (req, res) => {
    try {

        const APPLE_CONFIGURED =
            !!process.env.PASS_TYPE_ID &&
            !!process.env.APPLE_TEAM_ID &&
            fs.existsSync(path.join(PROJECT_ROOT, "certs/wwdr.pem")) &&
            fs.existsSync(path.join(PROJECT_ROOT, "certs/signerCert.pem")) &&
            fs.existsSync(path.join(PROJECT_ROOT, "certs/signerKey.pem"));

        if (!APPLE_CONFIGURED) {
            return res.status(503).json({message: "Apple Wallet not configured"});
        }

        const {contact} = req.body;
        if (!contact) return res.status(400).json({message: "contact required"});

        const ROOT = path.resolve(__dirname, "../../../");
        const certsDir = path.join(ROOT, "certs");
        const templateDir = path.join(ROOT, "pass-template.pass");

        const pass = await PKPass.from(
            {
                model: templateDir,
                certificates: {
                    wwdr: fs.readFileSync(path.join(certsDir, "wwdr.pem")),
                    signerCert: fs.readFileSync(path.join(certsDir, "signerCert.pem")),
                    signerKey: fs.readFileSync(path.join(certsDir, "signerKey.pem")),
                    ...(process.env.CERT_PASSWORD
                        ? {signerKeyPassphrase: process.env.CERT_PASSWORD}
                        : {}),
                },
            },
            {
                serialNumber: `admin-contact-${Date.now()}`,
                description: "Digital Business Card",
                organizationName: contact.companyName || "TapMyName",
                passTypeIdentifier: process.env.PASS_TYPE_ID,
                teamIdentifier: process.env.APPLE_TEAM_ID,
                foregroundColor: "rgb(255,255,255)",
                backgroundColor: "rgb(0,0,0)",
                labelColor: "rgb(180,180,180)",
                logoText: contact.companyName || contact.name,
            }
        );

        pass.type = "generic";

        pass.primaryFields.push({key: "name", label: "", value: contact.name || ""});
        pass.secondaryFields.push(
            {key: "title", label: "TITLE", value: contact.designation || ""},
            {key: "company", label: "COMPANY", value: contact.companyName || ""}
        );
        if (contact.phone) pass.auxiliaryFields.push({key: "phone", label: "PHONE", value: contact.phone});
        if (contact.email) pass.auxiliaryFields.push({key: "email", label: "EMAIL", value: contact.email});

        // Back fields
        if (contact.shareUrl) pass.backFields.push({
            key: "card", label: "Digital Card", value: contact.shareUrl,
            attributedValue: `<a href="${contact.shareUrl}">Open Digital Card</a>`,
        });
        if (contact.phone) pass.backFields.push({
            key: "phone", label: "Call", value: contact.phone,
            attributedValue: `<a href="tel:${contact.phone}">${contact.phone}</a>`,
        });
        if (contact.email) pass.backFields.push({
            key: "email", label: "Email", value: contact.email,
            attributedValue: `<a href="mailto:${contact.email}">${contact.email}</a>`,
        });
        if (contact.whatsapp) {
            const waNum = contact.whatsapp.replace(/\D/g, "");
            pass.backFields.push({
                key: "whatsapp", label: "WhatsApp", value: contact.whatsapp,
                attributedValue: `<a href="https://wa.me/${waNum}">Message on WhatsApp</a>`,
            });
        }

        // QR
        if (contact.shareUrl) pass.setBarcodes({
            message: contact.shareUrl,
            format: "PKBarcodeFormatQR",
            messageEncoding: "iso-8859-1",
            altText: "Scan to open digital card",
        });

        // Images — reuse loadImageBuffer from top of file or inline fetch
        const fetchBuf = async (url) => {
            if (!url) return null;
            try {
                if (url.startsWith("http")) {
                    const client = url.startsWith("https") ? (await import("https")).default : (await import("http")).default;
                    return await new Promise((resolve, reject) => {
                        client.get(url, (r) => {
                            const chunks = [];
                            r.on("data", (c) => chunks.push(c));
                            r.on("end", () => resolve(Buffer.concat(chunks)));
                            r.on("error", reject);
                        });
                    });
                }
                const local = path.join(ROOT, url.replace(/^\/+/, ""));
                return fs.existsSync(local) ? fs.readFileSync(local) : null;
            } catch {
                return null;
            }
        };

        const [photoBuf, logoBuf] = await Promise.all([
            fetchBuf(contact.photo),
            fetchBuf(contact.companyLogo),
        ]);

        if (logoBuf) {
            pass.addBuffer("logo.png", logoBuf);
            pass.addBuffer("logo@2x.png", logoBuf);
        }
        if (photoBuf) {
            pass.addBuffer("thumbnail.png", photoBuf);
            pass.addBuffer("thumbnail@2x.png", photoBuf);
            pass.addBuffer("thumbnail@3x.png", photoBuf);
            pass.addBuffer("strip.png", photoBuf);
            pass.addBuffer("strip@2x.png", photoBuf);
            pass.addBuffer("strip@3x.png", photoBuf);
        }

        const buffer = pass.getAsBuffer();
        const safeName = (contact.name || "card").replace(/[^a-z0-9]/gi, "_");

        res.set({
            "Content-Type": "application/vnd.apple.pkpass",
            "Content-Disposition": `attachment; filename=${safeName}.pkpass`,
            "Content-Length": buffer.length,
        });
        res.send(buffer);

    } catch (err) {
        console.error("Admin Apple Wallet error:", err);
        res.status(500).json({message: "Failed to generate Apple Wallet pass", error: err.message});
    }
});

// DELETE: Delete company (cascades to contacts and reviews)
router.delete("/user/:userId/company/:companyId", authenticateAdmin, async (req, res) => {
    try {
        const { userId, companyId } = req.params

        const company = await Company.findOne({ where: { id: companyId, userId } })
        if (!company) return res.status(404).json({ message: "Company not found" })

        const companyName = company.companyName

        // Delete all reviews under this company
        await Review.destroy({ where: { companyId } })

        // Delete all contacts under this company
        await Contact.destroy({ where: { companyId } })

        // Delete the company itself
        await company.destroy()

        await logAdminAction({
            adminId: req.admin.id,
            action: ADMIN_ACTIONS.DELETE_USER,
            targetType: 'company',
            targetId: companyId,
            targetName: companyName,
            description: `Deleted company: ${companyName} and all related contacts/reviews`,
            ipAddress: getClientIp(req),
            userAgent: req.headers['user-agent']
        })

        res.json({ success: true, message: "Company and all related data deleted successfully" })
    } catch (err) {
        console.error("❌ Error deleting company:", err)
        res.status(500).json({ message: "Failed to delete company", error: err.message })
    }
})

// DELETE: Delete single contact
router.delete("/user/:userId/contact/:contactId", authenticateAdmin, async (req, res) => {
    try {
        const { userId, contactId } = req.params

        const contact = await Contact.findOne({ where: { id: contactId, userId } })
        if (!contact) return res.status(404).json({ message: "Contact not found" })

        const contactName = `${contact.firstName} ${contact.lastName}`
        await contact.destroy()

        await logAdminAction({
            adminId: req.admin.id,
            action: ADMIN_ACTIONS.DELETE_USER,
            targetType: 'contact',
            targetId: contactId,
            targetName: contactName,
            description: `Deleted contact: ${contactName}`,
            ipAddress: getClientIp(req),
            userAgent: req.headers['user-agent']
        })

        res.json({ success: true, message: "Contact deleted successfully" })
    } catch (err) {
        console.error("❌ Error deleting contact:", err)
        res.status(500).json({ message: "Failed to delete contact", error: err.message })
    }
})

export default router;

