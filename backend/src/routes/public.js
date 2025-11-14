import express from "express";
import User from "../models/User.js";
import Company from "../models/Company.js";
import Contact from "../models/Contact.js";

const router = express.Router();

// 🟢 Get public card by contact mobile number
router.get("/:mobile", async (req, res) => {
    try {
        let { mobile } = req.params;

        mobile = `+${mobile}`

        console.log(mobile)

        // 1️⃣ Find contact by mobile number
        const contact = await Contact.findOne({
            where: { mobile, status: "active" }
        });

        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }

        // 2️⃣ Find the company using contact.companyId
        const company = await Company.findByPk(contact.companyId);

        if (!company) {
            return res.status(404).json({ message: "Company not found for this contact" });
        }

        // 3️⃣ Find the user who owns the company (optional, if needed)
        const user = await User.findByPk(company.userId);

        res.json({
            user: user ? {
                name: user.name,
                email: user.email,
                phone: user.phone
            } : null,

            company,
            contact
        });

    } catch (err) {
        console.error("❌ Public card error:", err);
        res.status(500).json({ message: "Failed to load public card" });
    }
});

export default router;
