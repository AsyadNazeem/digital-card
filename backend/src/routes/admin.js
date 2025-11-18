import express from "express";
import { authenticateAdmin } from "../middleware/adminAuth.js";
import User from "../models/User.js";
import Request from "../models/Request.js";
import { Op } from "sequelize";
import bcrypt from "bcryptjs";
import Company from "../models/Company.js";
import Contact from "../models/Contact.js";
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

const router = express.Router();

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
                'status',
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
            attributes: [
                'id',
                'firstName',
                'lastName',
                'email',
                'mobile',
                'telephone',
                'designation',
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

// ✅ PATCH: User status toggle
router.patch("/user/:id/status", authenticateAdmin, async (req, res) => {
    return res
        .status(400)
        .json({ message: "Status toggle not available (no status column)" });
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
            const formattedPhone = parsedPhone.format('E.164'); // e.g., +94712334567

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
                phone: formattedPhone, // ✅ Store in E.164 format (+94712334567)
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
export default router;
