import express from "express";
import { authenticateAdmin } from "../middleware/adminAuth.js";
import User from "../models/User.js";
import Request from "../models/Request.js";
import { Op } from "sequelize";
import bcrypt from "bcryptjs";
import Company from "../models/Company.js";
import Contact from "../models/Contact.js";
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Ensure upload directories exist
const uploadsDir = path.join(__dirname, "..", "uploads");
const logosDir = path.join(uploadsDir, "logos");
const photosDir = path.join(uploadsDir, "photos");

[uploadsDir, logosDir, photosDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Logo storage configuration
const logoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, logosDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

// Photo storage configuration
const photoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, photosDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

// File filter for images
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

// Multer upload instances
const uploadLogo = multer({
    storage: logoStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: imageFilter
}).single("logo");

const uploadPhoto = multer({
    storage: photoStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: imageFilter
}).single("photo");

// ✅ GET: Overview stats
router.get("/stats/overview", authenticateAdmin, async (req, res) => {
    console.log("🟢 Stats route hit by admin:", req.admin?.username);

    try {
        console.log("Fetching total users...");
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

        res.json({ total, today, month, google, local });
    } catch (err) {
        console.error("❌ Error in stats route:", err);
        res.status(500).json({ message: "Error fetching stats" });
    }
});

// ✅ GET: All users
router.get("/users", authenticateAdmin, async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: [
                "id",
                "name",
                "phone",
                "email",
                "provider",
                "registrationType",
                "companyLimit",
                "contactLimit",
                "createdAt"
            ],
            order: [["createdAt", "DESC"]],
        });
        res.json({ users });
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ message: "Error fetching users" });
    }
});

// ✅ GET: User's companies
router.get("/user/:userId/companies", authenticateAdmin, async (req, res) => {
    try {
        const { userId } = req.params;

        const companies = await Company.findAll({
            where: { userId },
            attributes: [
                'id',
                'companyName',
                'website',
                'displayUrl',
                'email',
                'logo',
                'bio',
                'view360',
                'googleLocation',
                'googleReviews',
                'tripAdvisor',
                'socialLinks',
                'status',
                'label',
                'country',
                'streetAddress',
                'streetAddressLine2',
                'city',
                'postalCode',
                'poBox',
                'createdAt'
            ],
            order: [['createdAt', 'DESC']]
        });

        console.log(`📊 Found ${companies.length} companies for user ${userId}`);
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
            include: [
                {
                    model: Company,
                    as: "Company",
                    attributes: ["id", "companyName"]
                }
            ],
            attributes: [
                'id',
                'firstName',
                'lastName',
                'email',
                'mobile',
                'telephone',
                'designation',
                'photo',
                'companyId',
                'status',
                'createdAt'
            ],
            order: [['createdAt', 'DESC']]
        });

        console.log(`📞 Found ${contacts.length} contacts for user ${userId}`);
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

        await user.update({
            companyLimit: parseInt(companyLimit),
            contactLimit: parseInt(contactLimit)
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

        await user.destroy();
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).json({ message: "Error deleting user" });
    }
});

// ✅ GET: All requests with user details
router.get("/requests", authenticateAdmin, async (req, res) => {
    try {
        const requests = await Request.findAll({
            include: [
                {
                    model: User,
                    attributes: ["id", "name", "email", "companyLimit", "contactLimit"],
                },
            ],
            order: [["createdAt", "DESC"]],
        });
        res.json({ requests });
    } catch (err) {
        console.error("Error fetching requests:", err);
        res.status(500).json({ message: "Error fetching requests" });
    }
});

// ✅ POST: Approve request
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

        await user.update({
            companyLimit: user.companyLimit + request.requestedCompanies,
            contactLimit: user.contactLimit + request.requestedContacts,
        });

        await request.update({ status: "approved" });

        res.json({
            message: "Request approved successfully",
            request,
            newLimits: {
                companyLimit: user.companyLimit,
                contactLimit: user.contactLimit,
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
        const request = await Request.findByPk(req.params.id);

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

        res.json({ message: "Request rejected", request });
    } catch (err) {
        console.error("Error rejecting request:", err);
        res.status(500).json({ message: "Error rejecting request" });
    }
});

// ✅ POST: Admin creates a new user (with validation)
router.post("/create-user", authenticateAdmin, async (req, res) => {
    try {
        const {
            name,
            email,
            countryCode,
            phone,
            password,
            companyLimit,
            contactLimit,
            registrationType
        } = req.body;

        console.log("🟢 Admin creating user:", { name, email, registrationType });

        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                message: "Name, email, phone, and password are required"
            });
        }

        if (!companyLimit || companyLimit < 1) {
            return res.status(400).json({
                message: "Company limit must be at least 1"
            });
        }

        if (!contactLimit || contactLimit < 1) {
            return res.status(400).json({
                message: "Contact limit must be at least 1"
            });
        }

        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                message: "User with this email already exists"
            });
        }

        // ✅ Combine and validate phone number
        const fullPhoneNumber = `${countryCode}${phone}`;

        // Validate phone number format
        try {
            if (!isValidPhoneNumber(fullPhoneNumber)) {
                return res.status(400).json({
                    message: "Invalid phone number format"
                });
            }

            const parsedPhone = parsePhoneNumber(fullPhoneNumber);
            const formattedPhone = parsedPhone.format('E.164');

            // Check if phone already exists
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

            console.log("✅ User created by admin:", newUser.email, "Phone:", formattedPhone);

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
        } catch (phoneError) {
            return res.status(400).json({
                message: "Invalid phone number format: " + phoneError.message
            });
        }
    } catch (err) {
        console.error("❌ Error creating user:", err);
        res.status(500).json({
            message: "Error creating user",
            error: err.message
        });
    }
});

router.put("/user/:userId/company/:companyId", authenticateAdmin, (req, res) => {
    console.log("🟢 Admin company update route hit");
    console.log("User ID:", req.params.userId);
    console.log("Company ID:", req.params.companyId);

    uploadLogo(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            console.error("❌ Multer error:", err);
            return res.status(400).json({
                message: "File upload error",
                error: err.message
            });
        } else if (err) {
            console.error("❌ Upload error:", err);
            return res.status(400).json({
                message: err.message
            });
        }

        try {
            console.log("📝 Request body:", JSON.stringify(req.body, null, 2));
            console.log("📁 File uploaded:", req.file ? req.file.filename : "No file");

            const company = await Company.findOne({
                where: {
                    id: req.params.companyId,
                    userId: req.params.userId
                }
            });

            if (!company) {
                console.error("❌ Company not found");
                return res.status(404).json({ message: "Company not found" });
            }

            console.log("✅ Company found:", company.companyName);

            // Parse social links if provided
            let socialLinks = company.socialLinks || {};
            if (req.body.socialLinks) {
                try {
                    socialLinks = typeof req.body.socialLinks === 'string'
                        ? JSON.parse(req.body.socialLinks)
                        : req.body.socialLinks;
                    console.log("📱 Parsed social links:", socialLinks);
                } catch (e) {
                    console.error("❌ Error parsing socialLinks:", e);
                }
            }

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
                // Address fields
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
                console.log("🖼️ New logo uploaded:", req.file.filename);
                // Delete old logo if exists
                if (company.logo) {
                    const oldLogoPath = path.join(__dirname, "..", company.logo);
                    console.log("🗑️ Attempting to delete old logo:", oldLogoPath);
                    if (fs.existsSync(oldLogoPath)) {
                        fs.unlinkSync(oldLogoPath);
                        console.log("✅ Old logo deleted");
                    }
                }
                updateData.logo = `/uploads/logos/${req.file.filename}`;
            } else if (req.body.existingLogo) {
                console.log("♻️ Keeping existing logo:", req.body.existingLogo);
                updateData.logo = req.body.existingLogo;
            }

            console.log("📝 Update data prepared:", JSON.stringify(updateData, null, 2));

            await company.update(updateData);
            console.log("✅ Company updated successfully");

            const updatedCompany = await Company.findByPk(req.params.companyId);

            res.json({
                success: true,
                message: "Company updated successfully",
                company: updatedCompany
            });
        } catch (err) {
            console.error("❌ Error updating company:", err);
            console.error("Stack trace:", err.stack);
            res.status(500).json({
                message: "Failed to update company",
                error: err.message,
                details: err.stack
            });
        }
    });
});

router.put("/user/:userId/contact/:contactId", authenticateAdmin, (req, res) => {

    uploadPhoto(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            console.error("❌ Multer error:", err);
            return res.status(400).json({
                message: "File upload error",
                error: err.message
            });
        } else if (err) {
            console.error("❌ Upload error:", err);
            return res.status(400).json({
                message: err.message
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

            // Validate phone numbers if provided
            let formattedMobile = req.body.mobile;
            let formattedTelephone = req.body.telephone || null;

            if (req.body.mobile) {
                try {
                    if (!isValidPhoneNumber(req.body.mobile)) {
                        return res.status(400).json({
                            message: "Invalid mobile number format"
                        });
                    }
                    const parsedMobile = parsePhoneNumber(req.body.mobile);
                    formattedMobile = parsedMobile.format('E.164');
                } catch (phoneError) {
                    return res.status(400).json({
                        message: "Invalid mobile number: " + phoneError.message
                    });
                }
            }

            if (req.body.telephone) {
                try {
                    if (!isValidPhoneNumber(req.body.telephone)) {
                        return res.status(400).json({
                            message: "Invalid telephone number format"
                        });
                    }
                    const parsedTelephone = parsePhoneNumber(req.body.telephone);
                    formattedTelephone = parsedTelephone.format('E.164');
                } catch (phoneError) {
                    return res.status(400).json({
                        message: "Invalid telephone number: " + phoneError.message
                    });
                }
            }

            const updateData = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                telephone: formattedTelephone,
                mobile: formattedMobile,
                email: req.body.email,
                designation: req.body.designation,
                companyId: req.body.companyId || null,
                status: req.body.status || 'active'
            };

            // Handle photo update
            if (req.file) {
                // Delete old photo if exists
                if (contact.photo) {
                    const oldPhotoPath = path.join(__dirname, "..", contact.photo);
                    if (fs.existsSync(oldPhotoPath)) {
                        fs.unlinkSync(oldPhotoPath);
                    }
                }
                updateData.photo = `/uploads/photos/${req.file.filename}`;
            } else if (req.body.existingPhoto) {
                updateData.photo = req.body.existingPhoto;
            }

            await contact.update(updateData);

            const updatedContact = await Contact.findByPk(req.params.contactId, {
                include: [
                    {
                        model: Company,
                        as: "Company",
                        attributes: ["id", "companyName"]
                    }
                ]
            });

            res.json({
                success: true,
                message: "Contact updated successfully",
                contact: updatedContact
            });
        } catch (err) {
            res.status(500).json({
                message: "Failed to update contact",
                error: err.message,
                details: err.stack
            });
        }
    });
});

export default router;
