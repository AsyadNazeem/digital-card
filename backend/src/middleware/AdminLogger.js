import AdminLog from "../models/AdminLog.js";

/**
 * Create an admin log entry
 */
export const logAdminAction = async ({
                                         adminId,
                                         action,
                                         targetType = null,
                                         targetId = null,
                                         targetName = null,
                                         description = null,
                                         changes = null,
                                         ipAddress = null,
                                         userAgent = null,
                                         status = 'success',
                                         errorMessage = null
                                     }) => {
    try {
        await AdminLog.create({
            adminId,
            action,
            targetType,
            targetId,
            targetName,
            description,
            changes,
            ipAddress,
            userAgent,
            status,
            errorMessage
        });
    } catch (err) {
        console.error("❌ Failed to log admin action:", err);
        // Don't throw - logging failures shouldn't break the app
    }
};

/**
 * Middleware to automatically log admin actions
 */
export const autoLogMiddleware = (action, targetType = null) => {
    return async (req, res, next) => {
        // Store original res.json
        const originalJson = res.json.bind(res);

        // Override res.json to capture response
        res.json = function(data) {
            // Log the action after response is sent
            const status = res.statusCode >= 200 && res.statusCode < 300 ? 'success' : 'failed';

            logAdminAction({
                adminId: req.admin?.id,
                action,
                targetType,
                targetId: req.params.id || req.params.userId || req.params.companyId || req.params.contactId || null,
                targetName: data?.user?.name || data?.user?.email || data?.company?.companyName || data?.contact?.firstName || null,
                description: `${action} - ${status}`,
                ipAddress: req.ip || req.connection.remoteAddress,
                userAgent: req.headers['user-agent'],
                status,
                errorMessage: status === 'failed' ? data?.message : null
            });

            return originalJson(data);
        };

        next();
    };
};

/**
 * Helper to extract IP address
 */
export const getClientIp = (req) => {
    return req.headers['x-forwarded-for']?.split(',')[0] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.ip;
};

/**
 * Action constants for consistency
 */
export const ADMIN_ACTIONS = {
    // Auth
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',

    // User Management
    CREATE_USER: 'CREATE_USER',
    UPDATE_USER: 'UPDATE_USER',
    DELETE_USER: 'DELETE_USER',
    UPDATE_USER_LIMITS: 'UPDATE_USER_LIMITS',
    VIEW_USER: 'VIEW_USER',
    VIEW_USERS: 'VIEW_USERS',

    // Company Management
    CREATE_COMPANY: 'CREATE_COMPANY',
    UPDATE_COMPANY: 'UPDATE_COMPANY',
    DELETE_COMPANY: 'DELETE_COMPANY',
    VIEW_COMPANY: 'VIEW_COMPANY',
    VIEW_COMPANIES: 'VIEW_COMPANIES',

    // Contact Management
    CREATE_CONTACT: 'CREATE_CONTACT',
    UPDATE_CONTACT: 'UPDATE_CONTACT',
    DELETE_CONTACT: 'DELETE_CONTACT',
    VIEW_CONTACT: 'VIEW_CONTACT',
    VIEW_CONTACTS: 'VIEW_CONTACTS',

    // Request Management
    APPROVE_REQUEST: 'APPROVE_REQUEST',
    REJECT_REQUEST: 'REJECT_REQUEST',
    VIEW_REQUESTS: 'VIEW_REQUESTS',

    // System
    VIEW_STATS: 'VIEW_STATS',
    EXPORT_DATA: 'EXPORT_DATA'
};
