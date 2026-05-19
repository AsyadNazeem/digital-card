import express from "express";
import { authenticateAdmin, requireSuperAdmin } from "../middleware/adminAuth.js";
import { ADMIN_ACTIONS, getClientIp, logAdminAction } from "../middleware/adminLogger.js";
import User from "../models/User.js";
import Request from "../models/Request.js";
import Company from "../models/Company.js";
import Contact from "../models/Contact.js";
import Review from "../models/Review.js";
import Admin from "../models/admin.js";
import Message from "../models/Message.js"; // ✅ ADD THIS IMPORT
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
import nodemailer from "nodemailer"; // ✅ ADD THIS IMPORT

// ── MUST BE FIRST before any path.join(__dirname, ...) ──
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Setup email transporter for replies
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtp.zoho.com',
    port: parseInt(process.env.MAIL_PORT) || 465,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

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
        // Build where clause based on role
        const whereClause = req.admin.role === 'super_admin'
            ? {}
            : { createdBy: req.admin.username }

        const total = await User.count({ where: whereClause });

        const today = await User.count({
            where: {
                ...whereClause,
                createdAt: { [Op.gte]: new Date().setHours(0, 0, 0, 0) }
            }
        });

        let userLimitInfo = null;
        if (req.admin.role !== 'super_admin') {
            const limit = req.admin.userLimit ?? 0;
            userLimitInfo = {
                userLimit: limit,
                usersCreated: total,
                remaining: limit > 0 ? Math.max(0, limit - total) : 0
            };
        }

        const monthStart = new Date();
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);

        const month = await User.count({
            where: {
                ...whereClause,
                createdAt: { [Op.gte]: monthStart }
            }
        });

        const google = await User.count({ where: { ...whereClause, provider: "google" } });
        const local  = await User.count({ where: { ...whereClause, provider: "local"  } });
        const apple  = await User.count({
            where: { ...whereClause, appleId: { [Op.ne]: null } }
        });

        await logAdminAction({
            adminId: req.admin.id,
            action: ADMIN_ACTIONS.VIEW_STATS,
            targetType: 'system',
            description: 'Viewed overview statistics',
            ipAddress: getClientIp(req),
            userAgent: req.headers['user-agent']
        });

        res.json({ total, today, month, google, local, apple, userLimitInfo});
    } catch (err) {
        console.error("❌ Error in stats route:", err);
        res.status(500).json({ message: "Error fetching stats" });
    }
});

// ✅ GET: All users
router.get("/users", authenticateAdmin, async (req, res) => {
    try {
        // Build where clause based on role
        const whereClause = req.admin.role === 'super_admin'
            ? {}
            : { createdBy: req.admin.username }

        const users = await User.findAll({
            where: whereClause,
            attributes: [
                "id", "name", "phone", "email", "provider",
                "registrationType", "companyLimit", "contactLimit",
                "reviewLimit", "createdBy",
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

// ✅ GET: user's companies
router.get("/user/:userId/companies", authenticateAdmin, async (req, res) => {
    try {
        const {userId} = req.params;
        const companies = await Company.findAll({
            where: {userId},
            attributes: [
                'id', 'companyName', 'website', 'displayUrl', 'email',
                'logo', 'bio', 'view360', 'googleLocation', 'googleReviews',
                'tripAdvisor', 'socialLinks', 'files', 'status', 'label', 'country',
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
        const {companyLimit, contactLimit, reviewLimit, plan} = req.body;

        const allowedPlans = ["free", "demo", "plus", "pro", "custom"];
        if (plan && !allowedPlans.includes(plan)) {
            return res.status(400).json({message: "Invalid plan value"});
        }

        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({message: "User not found"});

        const planDefaults = {
            free:   { companyLimit: 1,   contactLimit: 1,   reviewLimit: 1  },
            demo:   { companyLimit: 1,   contactLimit: 1,   reviewLimit: 1  },
            plus:   { companyLimit: 2,   contactLimit: 5,   reviewLimit: 2  },
            pro:    { companyLimit: 5,   contactLimit: 15,  reviewLimit: 5  },
            custom: { companyLimit: 5,   contactLimit: 30, reviewLimit: 10 },
        };

        const planMinimums = {
            free:   { companyLimit: 1, contactLimit: 1  },
            demo:   { companyLimit: 1, contactLimit: 1  },
            plus:   { companyLimit: 2, contactLimit: 5  },
            pro:    { companyLimit: 5, contactLimit: 15 },
            custom: { companyLimit: 5, contactLimit: 30  },
        };

        const currentPlan = plan || user.plan;
        const planChanged = plan && plan !== user.plan;

        const newCompanyLimit = planChanged ? planDefaults[plan].companyLimit : parseInt(companyLimit) || user.companyLimit;
        const newContactLimit = planChanged ? planDefaults[plan].contactLimit : parseInt(contactLimit) || user.contactLimit;
        const newReviewLimit  = planChanged ? planDefaults[plan].reviewLimit  : parseInt(reviewLimit)  || user.reviewLimit;

        if (newCompanyLimit < 1 || newContactLimit < 1) {
            return res.status(400).json({message: "Limits must be at least 1"});
        }

        const minimums = planMinimums[currentPlan];
        if (newCompanyLimit < minimums.companyLimit || newContactLimit < minimums.contactLimit) {
            return res.status(400).json({
                message: `Limits cannot be below ${currentPlan} plan minimums (${minimums.companyLimit} companies, ${minimums.contactLimit} contacts).`
            });
        }

        await user.update({
            companyLimit: newCompanyLimit,
            contactLimit: newContactLimit,
            reviewLimit: newReviewLimit,
            plan: plan || user.plan
        });

        res.json({
            success: true,
            message: "Limits and plan updated successfully",
            user: {
                id: user.id,
                companyLimit: user.companyLimit,
                contactLimit: user.contactLimit,
                reviewLimit: user.reviewLimit,
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
                attributes: ["id", "name", "email", "companyLimit", "contactLimit", "reviewLimit"],
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
            reviewLimit: user.reviewLimit
        };

        await user.update({
            companyLimit: user.companyLimit + request.requestedCompanies,
            contactLimit: user.contactLimit + request.requestedContacts,
            reviewLimit: user.reviewLimit + request.requestedReviews,
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
                    reviewLimit: user.reviewLimit
                },
                requested: {
                    companies: request.requestedCompanies,
                    contacts: request.requestedContacts,
                    reviews: request.requestedReviews
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
                reviewLimit: user.reviewLimit,
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
        if (req.admin.role !== 'super_admin') {
            const createdCount = await User.count({
                where: { createdBy: req.admin.username }
            });

            const limit = req.admin.userLimit ?? Infinity;
            if (createdCount >= limit) {
                return res.status(403).json({
                    message: `User creation limit reached. You can only create ${req.admin.userLimit} users.`
                });
            }
        }

        const {
            name, email, countryCode, phone, password,
            companyLimit, contactLimit, registrationType,
            country
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
            status: "active",
            country: country || null,
            createdBy: req.admin.username || null,
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
                return res.status(404).json({message: "Contact not found"});
            }

            const oldData = {...contact.dataValues};

            let formattedMobile = req.body.mobile;
            if (!isValidPhoneNumber(formattedMobile)) {
                return res.status(400).json({message: "Invalid mobile number"});
            }
            formattedMobile = parsePhoneNumber(formattedMobile).format("E.164");

            let formattedTelephone = null;
            if (req.body.telephone) {
                if (!isValidPhoneNumber(req.body.telephone)) {
                    return res.status(400).json({message: "Invalid telephone number"});
                }
                formattedTelephone = parsePhoneNumber(req.body.telephone).format("E.164");
            }

            let formattedWhatsapp = req.body.whatsapp;

            if (req.body.whatsappChannel && req.body.whatsappChannel.trim()) {
                const urlPattern = /^https?:\/\/.+/i;
                if (!urlPattern.test(req.body.whatsappChannel.trim())) {
                    return res.status(400).json({
                        message: "WhatsApp Channel must be a valid URL"
                    });
                }
            }

            let formattedCardMobile = req.body.cardMobileNum;

            if (formattedCardMobile) {
                formattedCardMobile = parsePhoneNumber(formattedCardMobile).format("E.164");
            } else {
                formattedCardMobile = formattedMobile;
            }

            const contactType = req.body.type;
            if (contactType && !['individual', 'group'].includes(contactType)) {
                return res.status(400).json({
                    message: "Type must be either 'individual' or 'group'"
                });
            }

            const updateData = {
                type: contactType || contact.type,
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

            if (req.file) {
                if (contact.photo) {
                    const oldPath = path.join(__dirname, "..", contact.photo);
                    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
                }
                updateData.photo = `/uploads/photos/${req.file.filename}`;
            } else if (req.body.existingPhoto) {
                updateData.photo = req.body.existingPhoto;
            }

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
                logo: null
            };

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

            const contactCount = await Contact.count({where: {userId}});
            if (contactCount >= user.contactLimit) {
                return res.status(400).json({
                    message: "Contact limit reached for this user"
                });
            }

            let formattedMobile = req.body.mobile;
            if (!isValidPhoneNumber(formattedMobile)) {
                return res.status(400).json({
                    message: "Invalid mobile number format"
                });
            }
            formattedMobile = parsePhoneNumber(formattedMobile).format("E.164");

            let formattedTelephone = null;
            if (req.body.telephone) {
                if (!isValidPhoneNumber(req.body.telephone)) {
                    return res.status(400).json({
                        message: "Invalid telephone number format"
                    });
                }
                formattedTelephone = parsePhoneNumber(req.body.telephone).format("E.164");
            }

            let formattedWhatsapp = req.body.whatsapp;

            if (req.body.whatsappChannel && req.body.whatsappChannel.trim()) {
                const urlPattern = /^https?:\/\/.+/i;
                if (!urlPattern.test(req.body.whatsappChannel.trim())) {
                    return res.status(400).json({
                        message: "WhatsApp Channel must be a valid URL"
                    });
                }
            }

            let formattedCardMobile = req.body.cardMobileNum;

            if (formattedCardMobile) {
                const parsed = parsePhoneNumber(formattedCardMobile);
                formattedCardMobile = parsed.format("E.164");
            } else {
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

            if (req.file) {
                contactData.photo = `/uploads/photos/${req.file.filename}`;
            }

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

        const reviewCount = await Review.count({where: {userId}});
        if (reviewCount >= user.reviewLimit) {
            return res.status(400).json({
                message: "Review limit reached for this user"
            });
        }

        if (!req.body.companyId) {
            return res.status(400).json({message: "Company is required"});
        }

        if (!req.body.branchName || !req.body.branchName.trim()) {
            return res.status(400).json({message: "Branch name is required"});
        }

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

        if (!req.body.companyId) {
            return res.status(400).json({message: "Company is required"});
        }

        if (!req.body.branchName || !req.body.branchName.trim()) {
            return res.status(400).json({message: "Branch name is required"});
        }

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

// DELETE: Delete company (cascades to contacts and reviews)
router.delete("/user/:userId/company/:companyId", authenticateAdmin, async (req, res) => {
    try {
        const { userId, companyId } = req.params

        const company = await Company.findOne({ where: { id: companyId, userId } })
        if (!company) return res.status(404).json({ message: "Company not found" })

        const companyName = company.companyName

        await Review.destroy({ where: { companyId } })
        await Contact.destroy({ where: { companyId } })
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

// POST: Create admin account
router.post("/admins/create", authenticateAdmin, requireSuperAdmin, async (req, res) => {
    try {
        const { name, username, email, password, role, status, userLimit } = req.body

        if (!name || !username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const existing = await Admin.findOne({ where: { email } })
        if (existing) {
            return res.status(400).json({ message: "Admin with this email already exists" })
        }

        const existingUsername = await Admin.findOne({ where: { username } })
        if (existingUsername) {
            return res.status(400).json({ message: "Username already taken" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newAdmin = await Admin.create({
            name,
            username,
            email,
            password: hashedPassword,
            role: role || 'admin',
            status: status || 'active',
            userLimit: role === 'super_admin' ? null : (parseInt(userLimit) || 10),
        })

        res.status(201).json({
            success: true,
            message: "Admin created successfully",
            admin: {
                id: newAdmin.id,
                name: newAdmin.name,
                username: newAdmin.username,
                email: newAdmin.email,
                role: newAdmin.role,
                status: newAdmin.status,
                userLimit: newAdmin.userLimit,
            }
        })
    } catch (err) {
        console.error("❌ Error creating admin:", err)
        res.status(500).json({ message: "Failed to create admin", error: err.message })
    }
})

// ✅ ============================================
// ✅ MESSAGE ROUTES - ROLE-BASED FILTERING
// ✅ ============================================

// ✅ GET: Unread messages count (role-aware)
router.get("/messages/unread-count", authenticateAdmin, async (req, res) => {
    try {
        let whereClause = { isRead: false };
        let includeClause = [];

        // Normal admin can only see unread count for their users' messages
        if (req.admin.role !== 'super_admin') {
            includeClause = [{
                model: User,
                as: 'User',
                attributes: [],
                where: { createdBy: req.admin.username },
                required: false
            }];
        }

        const count = await Message.count({
            where: whereClause,
            include: includeClause
        });

        res.json({ count });
    } catch (err) {
        console.error("❌ Error fetching unread count:", err);
        res.status(500).json({ message: "Error fetching unread count" });
    }
});

// ✅ GET: All messages with pagination (role-aware)
router.get("/messages", authenticateAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        let whereClause = {};
        let includeClause = [];

        if (req.admin.role !== 'super_admin') {
            // Normal admin sees only messages from users they created
            includeClause = [{
                model: User,
                as: 'User',
                attributes: [],
                where: { createdBy: req.admin.username },
                required: true
            }];
        }

        const { count, rows } = await Message.findAndCountAll({
            where: whereClause,
            include: includeClause,
            order: [['createdAt', 'DESC']],
            limit,
            offset,
            attributes: [
                'id',
                'userId',
                'senderName',
                'senderEmail',
                'subject',
                'body',
                'isRead',
                'messageType',
                'planRequest',
                'createdAt'
            ]
        });

        await logAdminAction({
            adminId: req.admin.id,
            action: ADMIN_ACTIONS.VIEW_MESSAGES,
            targetType: 'message',
            description: `Viewed ${rows.length} messages (page ${page})`,
            ipAddress: getClientIp(req),
            userAgent: req.headers['user-agent']
        });

        res.json({
            messages: rows,
            pagination: {
                page,
                limit,
                total: count,
                pages: Math.ceil(count / limit)
            }
        });
    } catch (err) {
        console.error("❌ Error fetching messages:", err);
        res.status(500).json({ message: "Error fetching messages" });
    }
});

// ✅ GET: Single message by ID (role-aware)
router.get("/messages/:id", authenticateAdmin, async (req, res) => {
    try {
        let includeClause = [];

        if (req.admin.role !== 'super_admin') {
            includeClause = [{
                model: User,
                as: 'User',
                attributes: ['id', 'createdBy'],
                required: true,
                where: { createdBy: req.admin.username }
            }];
        }

        const message = await Message.findByPk(req.params.id, {
            include: includeClause
        });

        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        if (!message.isRead) {
            await message.update({ isRead: true });
        }

        await logAdminAction({
            adminId: req.admin.id,
            action: ADMIN_ACTIONS.VIEW_MESSAGES,
            targetType: 'message',
            targetId: req.params.id,
            targetName: message.senderName,
            description: `Viewed message from ${message.senderName}`,
            ipAddress: getClientIp(req),
            userAgent: req.headers['user-agent']
        });

        res.json({ success: true, message });
    } catch (err) {
        console.error("❌ Error fetching message:", err);
        res.status(500).json({ message: "Error fetching message" });
    }
});

// ✅ PUT: Mark message as read (role-aware)
router.put("/messages/:id/read", authenticateAdmin, async (req, res) => {
    try {
        let includeClause = [];

        if (req.admin.role !== 'super_admin') {
            includeClause = [{
                model: User,
                as: 'User',
                attributes: ['createdBy'],
                required: true,
                where: { createdBy: req.admin.username }
            }];
        }

        const message = await Message.findByPk(req.params.id, {
            include: includeClause
        });

        if (!message) return res.status(404).json({ message: "Message not found" });

        await message.update({ isRead: true });

        await logAdminAction({
            adminId: req.admin.id,
            action: ADMIN_ACTIONS.UPDATE_MESSAGES,
            targetType: 'message',
            targetId: req.params.id,
            targetName: message.senderName,
            description: `Marked message as read`,
            ipAddress: getClientIp(req),
            userAgent: req.headers['user-agent']
        });

        res.json({ success: true, message: "Message marked as read" });
    } catch (err) {
        console.error("❌ Error marking message as read:", err);
        res.status(500).json({ message: "Error marking message as read" });
    }
});

// ✅ PUT: Mark all messages as read (role-aware)
router.put("/messages/mark-all-read", authenticateAdmin, async (req, res) => {
    try {
        let whereClause = { isRead: false };

        if (req.admin.role !== 'super_admin') {
            const userMessages = await Message.findAll({
                attributes: ['id'],
                include: [{
                    model: User,
                    as: 'User',
                    attributes: ['createdBy'],
                    where: { createdBy: req.admin.username },
                    required: true
                }]
            });

            const messageIds = userMessages.map(m => m.id);
            if (messageIds.length === 0) {
                return res.json({ success: true, message: "No messages to update" });
            }

            whereClause = { id: { [Op.in]: messageIds }, isRead: false };
        }

        const result = await Message.update(
            { isRead: true },
            { where: whereClause }
        );

        await logAdminAction({
            adminId: req.admin.id,
            action: ADMIN_ACTIONS.UPDATE_MESSAGES,
            targetType: 'message',
            description: `Marked ${result[0]} messages as read`,
            ipAddress: getClientIp(req),
            userAgent: req.headers['user-agent']
        });

        res.json({ success: true, message: "All messages marked as read" });
    } catch (err) {
        console.error("❌ Error marking all as read:", err);
        res.status(500).json({ message: "Error marking all as read" });
    }
});

// ✅ DELETE: Delete message (role-aware)
router.delete("/messages/:id", authenticateAdmin, async (req, res) => {
    try {
        let includeClause = [];

        if (req.admin.role !== 'super_admin') {
            includeClause = [{
                model: User,
                as: 'User',
                attributes: ['createdBy'],
                required: true,
                where: { createdBy: req.admin.username }
            }];
        }

        const message = await Message.findByPk(req.params.id, {
            include: includeClause
        });

        if (!message) return res.status(404).json({ message: "Message not found" });

        const messageSender = message.senderName;
        await message.destroy();

        await logAdminAction({
            adminId: req.admin.id,
            action: ADMIN_ACTIONS.DELETE_MESSAGES,
            targetType: 'message',
            targetId: req.params.id,
            targetName: messageSender,
            description: `Deleted message from ${messageSender}`,
            ipAddress: getClientIp(req),
            userAgent: req.headers['user-agent']
        });

        res.json({ success: true, message: "Message deleted successfully" });
    } catch (err) {
        console.error("❌ Error deleting message:", err);
        res.status(500).json({ message: "Error deleting message" });
    }
});

// ✅ POST: Send reply to message sender (role-aware)
router.post("/messages/:id/reply", authenticateAdmin, async (req, res) => {
    try {
        const { replyText } = req.body;

        if (!replyText || !replyText.trim()) {
            return res.status(400).json({ message: "Reply text is required" });
        }

        let includeClause = [];

        if (req.admin.role !== 'super_admin') {
            includeClause = [{
                model: User,
                as: 'User',
                attributes: ['createdBy'],
                required: true,
                where: { createdBy: req.admin.username }
            }];
        }

        const message = await Message.findByPk(req.params.id, {
            include: includeClause
        });

        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        const replyHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header {
                    background: linear-gradient(135deg, #5c4033 0%, #3e2a23 100%);
                    color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;
                }
                .content { background: #fff; padding: 20px; border: 1px solid #e5e1dc; border-top: none; border-radius: 0 0 10px 10px; }
                .reply-box { background: #fafaf8; border-left: 4px solid #5c4033; padding: 16px; margin: 20px 0; border-radius: 4px; white-space: pre-wrap; }
                .footer { text-align: center; color: #9b8b7e; font-size: 12px; margin-top: 20px; padding-top: 16px; border-top: 1px solid #e5e1dc; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2 style="margin:0; color:#f5e6d3;">Re: ${message.subject}</h2>
                </div>
                <div class="content">
                    <p>Hi ${message.senderName},</p>
                    <p>Thank you for your message. Here's our response:</p>
                    <div class="reply-box">${replyText.trim()}</div>
                    <p>Best regards,<br/>The TapMyName Team</p>
                </div>
                <div class="footer">
                    <p>© ${new Date().getFullYear()} TapMyName. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        `;

        await transporter.sendMail({
            from: `"TapMyName Support" <${process.env.MAIL_USER}>`,
            to: message.senderEmail,
            replyTo: "hello@tapmy.name",
            subject: `Re: ${message.subject}`,
            html: replyHtml
        });

        await logAdminAction({
            adminId: req.admin.id,
            action: ADMIN_ACTIONS.SEND_MESSAGE,
            targetType: 'message',
            targetId: req.params.id,
            targetName: message.senderName,
            description: `Sent reply to ${message.senderName}`,
            ipAddress: getClientIp(req),
            userAgent: req.headers['user-agent']
        });

        res.json({ success: true, message: "Reply sent successfully" });
    } catch (err) {
        console.error("❌ Error sending reply:", err);
        res.status(500).json({ message: "Error sending reply" });
    }
});

// ✅ GET: Messages by type (filter) - role-aware
router.get("/messages/filter/:type", authenticateAdmin, async (req, res) => {
    try {
        const validTypes = ['contact', 'plan_upgrade', 'plan_downgrade', 'support'];
        const type = req.params.type.toLowerCase();

        if (!validTypes.includes(type)) {
            return res.status(400).json({ message: "Invalid message type" });
        }

        let whereClause = { messageType: type };
        let includeClause = [];

        if (req.admin.role !== 'super_admin') {
            includeClause = [{
                model: User,
                as: 'User',
                attributes: [],
                where: { createdBy: req.admin.username },
                required: true
            }];
        }

        const messages = await Message.findAll({
            where: whereClause,
            include: includeClause,
            order: [['createdAt', 'DESC']],
            attributes: [
                'id', 'userId', 'senderName', 'senderEmail', 'subject', 'body',
                'isRead', 'messageType', 'planRequest', 'createdAt'
            ]
        });

        res.json({ messages, type, count: messages.length });
    } catch (err) {
        console.error("❌ Error filtering messages:", err);
        res.status(500).json({ message: "Error filtering messages" });
    }
});

// ✅ GET: Search messages - role-aware
router.get("/messages/search/:query", authenticateAdmin, async (req, res) => {
    try {
        const { query } = req.params;

        let whereClause = {
            [Op.or]: [
                { senderName: { [Op.iLike]: `%${query}%` } },
                { senderEmail: { [Op.iLike]: `%${query}%` } },
                { subject: { [Op.iLike]: `%${query}%` } },
                { body: { [Op.iLike]: `%${query}%` } }
            ]
        };

        let includeClause = [];

        if (req.admin.role !== 'super_admin') {
            includeClause = [{
                model: User,
                as: 'User',
                attributes: [],
                where: { createdBy: req.admin.username },
                required: true
            }];
        }

        const messages = await Message.findAll({
            where: whereClause,
            include: includeClause,
            order: [['createdAt', 'DESC']],
            attributes: [
                'id', 'userId', 'senderName', 'senderEmail', 'subject', 'body',
                'isRead', 'messageType', 'planRequest', 'createdAt'
            ]
        });

        res.json({ messages, query, count: messages.length });
    } catch (err) {
        console.error("❌ Error searching messages:", err);
        res.status(500).json({ message: "Error searching messages" });
    }
});

// ✅ ============================================
// ✅ END OF MESSAGE ROUTES
// ✅ ============================================

// ✅ GOOGLE WALLET: generate save URL (admin)
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

// ✅ APPLE WALLET: download pkpass (admin)
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

        if (contact.shareUrl) pass.setBarcodes({
            message: contact.shareUrl,
            format: "PKBarcodeFormatQR",
            messageEncoding: "iso-8859-1",
            altText: "Scan to open digital card",
        });

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

export default router;
