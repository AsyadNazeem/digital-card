import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { Op } from "sequelize";
import { logAdminAction, getClientIp, ADMIN_ACTIONS } from "../middleware/adminLogger.js";

const router = express.Router();

// Admin login
router.post("/login", async (req, res) => {
    try {
        const { usernameOrEmail, password } = req.body;

        if (!usernameOrEmail || !password) {
            return res.status(400).json({ message: "Missing fields" });
        }

        const admin = await Admin.findOne({
            where: {
                [Op.or]: [
                    { username: usernameOrEmail },
                    { email: usernameOrEmail }
                ]
            }
        });

        if (!admin) {
            // Log failed login attempt
            await logAdminAction({
                adminId: null,
                action: ADMIN_ACTIONS.LOGIN,
                targetType: 'admin',
                description: `Failed login attempt for: ${usernameOrEmail}`,
                ipAddress: getClientIp(req),
                userAgent: req.headers['user-agent'],
                status: 'failed',
                errorMessage: 'Admin not found'
            });

            return res.status(404).json({ message: "Admin not found" });
        }

        if (admin.status !== "active") {
            await logAdminAction({
                adminId: admin.id,
                action: ADMIN_ACTIONS.LOGIN,
                targetType: 'admin',
                targetName: admin.username,
                description: `Login blocked - inactive admin: ${admin.username}`,
                ipAddress: getClientIp(req),
                userAgent: req.headers['user-agent'],
                status: 'failed',
                errorMessage: 'Admin is inactive'
            });

            return res.status(403).json({ message: "Admin is inactive" });
        }

        const ok = await bcrypt.compare(password, admin.password);

        if (!ok) {
            await logAdminAction({
                adminId: admin.id,
                action: ADMIN_ACTIONS.LOGIN,
                targetType: 'admin',
                targetName: admin.username,
                description: `Failed login - invalid password for: ${admin.username}`,
                ipAddress: getClientIp(req),
                userAgent: req.headers['user-agent'],
                status: 'failed',
                errorMessage: 'Invalid credentials'
            });

            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: admin.id, role: "admin" },
            process.env.ADMIN_JWT_SECRET,
            { expiresIn: process.env.ADMIN_TOKEN_EXPIRY || "1d" }
        );

        // Log successful login
        await logAdminAction({
            adminId: admin.id,
            action: ADMIN_ACTIONS.LOGIN,
            targetType: 'admin',
            targetName: admin.username,
            description: `Successful login: ${admin.username}`,
            ipAddress: getClientIp(req),
            userAgent: req.headers['user-agent'],
            status: 'success'
        });

        res.json({
            token,
            admin: {
                id: admin.id,
                username: admin.username,
                email: admin.email,
                name: admin.name
            }
        });
    } catch (err) {
        console.error("Admin login error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Optional: Logout endpoint to log logout
router.post("/logout", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1];
            const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
            const admin = await Admin.findByPk(decoded.id);

            if (admin) {
                await logAdminAction({
                    adminId: admin.id,
                    action: ADMIN_ACTIONS.LOGOUT,
                    targetType: 'admin',
                    targetName: admin.username,
                    description: `Logged out: ${admin.username}`,
                    ipAddress: getClientIp(req),
                    userAgent: req.headers['user-agent']
                });
            }
        }

        res.json({ message: "Logged out successfully" });
    } catch (err) {
        console.error("Logout error:", err);
        res.status(200).json({ message: "Logged out" });
    }
});

export default router;
