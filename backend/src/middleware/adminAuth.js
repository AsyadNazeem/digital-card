import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import UserPermission from '../models/UserPermission.js';
import { DEFAULT_ROLE_PERMISSIONS, ADMIN_ROLES } from '../config/adminPermissions.js';

export const authenticateAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);

        const admin = await Admin.findByPk(decoded.id);

        if (!admin || admin.status !== 'active') {
            return res.status(401).json({ message: 'Invalid or inactive admin' });
        }

        req.admin = {
            id: admin.id,
            role: admin.role,
            username: admin.username,
            email: admin.email
        };

        next();
    } catch (err) {
        console.error('Admin auth error:', err);
        res.status(401).json({ message: 'Invalid token' });
    }
};

export const requireSuperAdmin = (req, res, next) => {
    if (req.admin.role !== ADMIN_ROLES.SUPER_ADMIN) {
        return res.status(403).json({ message: 'Super admin access required' });
    }
    next();
};

export const requirePermission = (permission) => {
    return async (req, res, next) => {
        try {
            // Super admin always has all permissions
            if (req.admin.role === ADMIN_ROLES.SUPER_ADMIN) {
                return next();
            }

            // Check default permissions based on role
            const defaultPerms = DEFAULT_ROLE_PERMISSIONS[req.admin.role] || [];
            if (defaultPerms.includes(permission)) {
                return next();
            }

            // Check custom user permissions
            const customPerm = await UserPermission.findOne({
                where: {
                    userId: req.admin.id,
                    permission
                }
            });

            if (customPerm) {
                return next();
            }

            return res.status(403).json({
                message: 'Insufficient permissions',
                required: permission
            });
        } catch (err) {
            console.error('Permission check error:', err);
            return res.status(500).json({ message: 'Permission check failed' });
        }
    };
};
