import express from "express";
import User from "../models/User.js";
import Company from "../models/Company.js";
import Contact from "../models/Contact.js";

const router = express.Router();

// ✅ Get public card by phone number
router.get("/:phone", async (req, res) => {
    try {
        const { phone } = req.params;

        const user = await User.findOne({ where: { phone } });
        if (!user) return res.status(404).json({ message: "User not found" });

        const company = await Company.findOne({ where: { userId: user.id } });
        const contacts = await Contact.findAll({ where: { userId: user.id, status: "active" } });

        res.json({
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
            },
            company,
            contacts,
        });
    } catch (err) {
        console.error("❌ Public card error:", err);
        res.status(500).json({ message: "Failed to load public card" });
    }
});

export default router;
