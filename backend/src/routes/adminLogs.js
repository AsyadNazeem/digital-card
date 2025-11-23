import express from "express";
import { authenticateAdmin } from "../middleware/adminAuth.js";
import AdminLog from "../models/AdminLog.js";
import Admin from "../models/Admin.js";
import { Op } from "sequelize";

const router = express.Router();

// ✅ GET: All admin logs (with filters and pagination)
router.get("/logs", authenticateAdmin, async (req, res) => {
    try {
        const {
            page = 1,
            limit = 50,
            adminId,
            action,
            targetType,
            status,
            startDate,
            endDate,
            search
        } = req.query;

        const offset = (page - 1) * limit;
        const where = {};

        // Apply filters
        if (adminId) where.adminId = adminId;
        if (action) where.action = action;
        if (targetType) where.targetType = targetType;
        if (status) where.status = status;

        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) where.createdAt[Op.gte] = new Date(startDate);
            if (endDate) where.createdAt[Op.lte] = new Date(endDate);
        }

        if (search) {
            where[Op.or] = [
                { description: { [Op.like]: `%${search}%` } },
                { targetName: { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows: logs } = await AdminLog.findAndCountAll({
            where,
            include: [{
                model: Admin,
                as: 'Admin',
                attributes: ['id', 'username', 'name', 'email']
            }],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            success: true,
            logs,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            }
        });
    } catch (err) {
        console.error("❌ Error fetching admin logs:", err);
        res.status(500).json({
            message: "Error fetching logs",
            error: err.message
        });
    }
});

// ✅ GET: Logs for a specific admin
router.get("/logs/admin/:adminId", authenticateAdmin, async (req, res) => {
    try {
        const { adminId } = req.params;
        const { page = 1, limit = 50 } = req.query;
        const offset = (page - 1) * limit;

        const { count, rows: logs } = await AdminLog.findAndCountAll({
            where: { adminId },
            include: [{
                model: Admin,
                as: 'Admin',
                attributes: ['id', 'username', 'name', 'email']
            }],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            success: true,
            logs,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            }
        });
    } catch (err) {
        console.error("❌ Error fetching admin logs:", err);
        res.status(500).json({
            message: "Error fetching logs",
            error: err.message
        });
    }
});

// ✅ GET: Logs for a specific target
router.get("/logs/target/:targetType/:targetId", authenticateAdmin, async (req, res) => {
    try {
        const { targetType, targetId } = req.params;
        const { page = 1, limit = 50 } = req.query;
        const offset = (page - 1) * limit;

        const { count, rows: logs } = await AdminLog.findAndCountAll({
            where: {
                targetType,
                targetId
            },
            include: [{
                model: Admin,
                as: 'Admin',
                attributes: ['id', 'username', 'name', 'email']
            }],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            success: true,
            logs,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            }
        });
    } catch (err) {
        console.error("❌ Error fetching target logs:", err);
        res.status(500).json({
            message: "Error fetching logs",
            error: err.message
        });
    }
});

// ✅ GET: Log statistics
router.get("/logs/stats", authenticateAdmin, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const where = {};

        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) where.createdAt[Op.gte] = new Date(startDate);
            if (endDate) where.createdAt[Op.lte] = new Date(endDate);
        }

        const totalLogs = await AdminLog.count({ where });

        const actionCounts = await AdminLog.findAll({
            where,
            attributes: [
                'action',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['action'],
            raw: true
        });

        const adminActivity = await AdminLog.findAll({
            where,
            attributes: [
                'adminId',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            include: [{
                model: Admin,
                as: 'Admin',
                attributes: ['username', 'name']
            }],
            group: ['adminId'],
            raw: true
        });

        const failedActions = await AdminLog.count({
            where: {
                ...where,
                status: 'failed'
            }
        });

        res.json({
            success: true,
            stats: {
                totalLogs,
                failedActions,
                actionCounts,
                adminActivity
            }
        });
    } catch (err) {
        console.error("❌ Error fetching log stats:", err);
        res.status(500).json({
            message: "Error fetching stats",
            error: err.message
        });
    }
});

// ✅ GET: Recent activity (last 24 hours)
router.get("/logs/recent", authenticateAdmin, async (req, res) => {
    try {
        const yesterday = new Date();
        yesterday.setHours(yesterday.getHours() - 24);

        const logs = await AdminLog.findAll({
            where: {
                createdAt: { [Op.gte]: yesterday }
            },
            include: [{
                model: Admin,
                as: 'Admin',
                attributes: ['id', 'username', 'name']
            }],
            order: [['createdAt', 'DESC']],
            limit: 100
        });

        res.json({
            success: true,
            logs
        });
    } catch (err) {
        console.error("❌ Error fetching recent logs:", err);
        res.status(500).json({
            message: "Error fetching recent logs",
            error: err.message
        });
    }
});

// ✅ DELETE: Clear old logs (optional cleanup)
router.delete("/logs/cleanup", authenticateAdmin, async (req, res) => {
    try {
        const { daysOld = 90 } = req.body;

        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);

        const deleted = await AdminLog.destroy({
            where: {
                createdAt: { [Op.lt]: cutoffDate }
            }
        });

        res.json({
            success: true,
            message: `Deleted ${deleted} logs older than ${daysOld} days`
        });
    } catch (err) {
        console.error("❌ Error cleaning up logs:", err);
        res.status(500).json({
            message: "Error cleaning up logs",
            error: err.message
        });
    }
});

export default router;
