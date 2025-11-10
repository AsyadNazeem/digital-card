import express from "express";
import { authenticateAdmin } from "../middleware/adminAuth.js";
import User from "../models/User.js";
import { Op } from "sequelize";

const router = express.Router();

// ✅ GET: Overview stats
router.get("/stats/overview", authenticateAdmin, async (req, res) => {
    console.log("🟢 Stats route hit by admin:", req.admin?.username);
    try {
        console.log("Fetching total users...");
        const total = await User.count();
        console.log("Total users:", total);

        const today = await User.count({
            where: {
                createdAt: {
                    [Op.gte]: new Date().setHours(0, 0, 0, 0),
                },
            },
        });
        console.log("Today:", today);

        const monthStart = new Date();
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);

        const month = await User.count({
            where: { createdAt: { [Op.gte]: monthStart } },
        });

        const active = await User.count({ where: { status: "active" } });

        res.json({ total, today, month, active });
    } catch (err) {
        console.error("❌ Error in stats route:", err);
        res.status(500).json({ message: "Error fetching stats" });
    }
});


// ✅ GET: All users
router.get("/users", authenticateAdmin, async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ["id", "name", "phone", "email", "status", "createdAt"],
            order: [["createdAt", "DESC"]],
        });
        res.json({ users });
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ message: "Error fetching users" });
    }
});

// ✅ PATCH: Toggle user status
router.patch("/user/:id/status", authenticateAdmin, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.status = user.status === "active" ? "inactive" : "active";
        await user.save();
        res.json({ message: "User status updated", status: user.status });
    } catch (err) {
        console.error("Error updating user status:", err);
        res.status(500).json({ message: "Error updating user status" });
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

export default router;
