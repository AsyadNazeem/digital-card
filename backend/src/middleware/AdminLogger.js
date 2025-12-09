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
        // Validate and sanitize targetId
        let validTargetId = null;
        if (targetId !== null && targetId !== undefined && targetId !== 'undefined') {
            const parsed = parseInt(targetId, 10);
            if (!isNaN(parsed)) {
                validTargetId = parsed;
            }
        }

        // Ensure action is not null or undefined
        if (!action) {
            console.error("❌ Cannot log admin action: action is required");
            return;
        }

        await AdminLog.create({
            adminId,
            action,
            targetType,
            targetId: validTargetId, // Use validated ID
            targetName,
            description,
            changes: changes ? (typeof changes === 'string' ? changes : JSON.stringify(changes)) : null,
            ipAddress,
            userAgent,
            status,
            errorMessage
        });
    } catch (err) {
        console.error("❌ Failed to log admin action:", err);
        console.error("Action parameters:", { adminId, action, targetType, targetId, targetName });
        // Don't throw - logging failures shouldn't break the app
    }
};

/**
 * Middleware to automatically log admin actions
 */
export const autoLogMiddleware = (action, targetType = null) => {
    return async (req, res, next) => {
        // Validate action parameter
        if (!action) {
            console.error("❌ autoLogMiddleware: action is required");
            return next();
        }

        // Store original res.json
        const originalJson = res.json.bind(res);

        // Override res.json to capture response
        res.json = function(data) {
            // Log the action after response is sent
            const status = res.statusCode >= 200 && res.statusCode < 300 ? 'success' : 'failed';

            // Extract and validate targetId
            const rawTargetId = req.params.id || req.params.userId || req.params.companyId || req.params.contactId;
            let validTargetId = null;
            if (rawTargetId && rawTargetId !== 'undefined') {
                const parsed = parseInt(rawTargetId, 10);
                if (!isNaN(parsed)) {
                    validTargetId = parsed;
                }
            }

            logAdminAction({
                adminId: req.admin?.id,
                action,
                targetType,
                targetId: validTargetId,
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

    // Review Management - ADD THESE
    CREATE_REVIEW: 'CREATE_REVIEW',
    UPDATE_REVIEW: 'UPDATE_REVIEW',
    DELETE_REVIEW: 'DELETE_REVIEW',
    VIEW_REVIEW: 'VIEW_REVIEW',
    VIEW_REVIEWS: 'VIEW_REVIEWS',

    // Request Management
    APPROVE_REQUEST: 'APPROVE_REQUEST',
    REJECT_REQUEST: 'REJECT_REQUEST',
    VIEW_REQUESTS: 'VIEW_REQUESTS',

    // System
    VIEW_STATS: 'VIEW_STATS',
    EXPORT_DATA: 'EXPORT_DATA'
};
