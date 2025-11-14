import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { Op } from "sequelize";
import User from "../models/User.js";

const router = express.Router();

// admin login
router.post("/login", async (req, res) => {
    try {
        const { usernameOrEmail, password } = req.body;
        if (!usernameOrEmail || !password) return res.status(400).json({ message: "Missing fields" });

        const admin = await Admin.findOne({
            where: {
                [Op.or]: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
            }
        });

        if (!admin) return res.status(404).json({ message: "admin not found" });
        if (admin.status !== "active") return res.status(403).json({ message: "admin is inactive" });

        const ok = await bcrypt.compare(password, admin.password);
        if (!ok) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: admin.id, role: "admin" }, process.env.ADMIN_JWT_SECRET, { expiresIn: process.env.ADMIN_TOKEN_EXPIRY || "1d" });

        res.json({ token, admin: { id: admin.id, username: admin.username, email: admin.email, name: admin.name } });
    } catch (err) {
        console.error("admin login error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
