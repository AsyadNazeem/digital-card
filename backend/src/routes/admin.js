import express from "express";
import { authenticateAdmin } from "../middleware/adminAuth.js";
import User from "../models/User.js";
import Request from "../models/Request.js";  // ✅ Add this import
import { Op } from "sequelize";

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

        // 🟢 Count Google users using `provider`
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
            attributes: ["id", "name", "phone", "email", "provider", "createdAt"],
            order: [["createdAt", "DESC"]],
        });
        res.json({ users });
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ message: "Error fetching users" });
    }
});

// ✅ PATCH: (Disabled toggle, since no status column)
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

        // Update user limits
        await user.update({
            companyLimit: user.companyLimit + request.requestedCompanies,
            contactLimit: user.contactLimit + request.requestedContacts,
        });

        // Update request status
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

        // Update request status and optionally store rejection reason
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

export default router;
