import express from "express";
import User from "../models/User.js";
import Company from "../models/Company.js";
import Contact from "../models/Contact.js";
import Theme from "../models/Theme.js";

const router = express.Router();


router.get("/:mobile", async (req, res) => {
    try {
        let mobile = "+" + req.params.mobile;

        const contact = await Contact.findOne({
            where: { mobile, status: "active" }
        });

        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }

        const company = await Company.findByPk(contact.companyId);

        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        const user = await User.findByPk(company.userId, {
            include: [{
                model: Theme,
                as: "theme",
                attributes: ['id', 'name', 'cssFile', 'isPremium']
            }]
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return the data
        res.json({
            company,
            contact,
            theme: user.theme || null
        });

    } catch (err) {
        res.status(500).json({
            message: "Failed to load public card",
            error: err.message
        });
    }
});


export default router;

