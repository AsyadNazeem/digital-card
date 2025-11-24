import express from 'express';
import UserPermission from '../models/UserPermission.js';
import PermissionChange from '../models/PermissionChange.js';
import Admin from '../models/Admin.js';
import { PERMISSIONS, ADMIN_ROLES, DEFAULT_ROLE_PERMISSIONS, PERMISSION_CATEGORIES } from '../config/adminPermissions.js';
import { authenticateAdmin, requireSuperAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

// Get all available permissions with categories
router.get('/available', authenticateAdmin, requireSuperAdmin, async (req, res) => {
    try {
        res.json({
            permissions: Object.values(PERMISSIONS),
            categories: PERMISSION_CATEGORIES
        });
    } catch (err) {
        console.error('Error fetching available permissions:', err);
        res.status(500).json({ message: 'Failed to fetch permissions' });
    }
});

// Get all admins with their permissions
router.get('/users', authenticateAdmin, requireSuperAdmin, async (req, res) => {
    try {
        const admins = await Admin.findAll({
            where: { status: 'active' },
            attributes: ['id', 'username', 'email', 'name', 'role'],
            order: [['username', 'ASC']]
        });

        // Get custom permissions for each admin
        const adminsWithPermissions = await Promise.all(
            admins.map(async (admin) => {
                const defaultPerms = DEFAULT_ROLE_PERMISSIONS[admin.role] || [];

                let customPerms = [];
                if (admin.role !== ADMIN_ROLES.SUPER_ADMIN) {
                    const userPerms = await UserPermission.findAll({
                        where: { userId: admin.id },
                        attributes: ['permission']
                    });
                    customPerms = userPerms.map(p => p.permission);
                }

                const allPermissions = admin.role === ADMIN_ROLES.SUPER_ADMIN
                    ? Object.values(PERMISSIONS)
                    : [...new Set([...defaultPerms, ...customPerms])];

                return {
                    id: admin.id,
                    username: admin.username,
                    email: admin.email,
                    name: admin.name,
                    role: admin.role,
                    defaultPermissions: defaultPerms,
                    customPermissions: customPerms,
                    allPermissions: allPermissions,
                    isSuperAdmin: admin.role === ADMIN_ROLES.SUPER_ADMIN
                };
            })
        );

        res.json({ users: adminsWithPermissions });
    } catch (err) {
        console.error('Error fetching users with permissions:', err);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
});

// Get permissions for a specific user
router.get('/user/:userId', authenticateAdmin, requireSuperAdmin, async (req, res) => {
    try {
        const { userId } = req.params;

        const admin = await Admin.findByPk(userId, {
            attributes: ['id', 'username', 'email', 'name', 'role']
        });

        if (!admin) {
            return res.status(404).json({ message: 'Admin user not found' });
        }

        // Get default permissions based on role
        const defaultPermissions = DEFAULT_ROLE_PERMISSIONS[admin.role] || [];

        // Get custom permissions
        let customPermissions = [];
        if (admin.role !== ADMIN_ROLES.SUPER_ADMIN) {
            const userPerms = await UserPermission.findAll({
                where: { userId },
                attributes: ['permission']
            });
            customPermissions = userPerms.map(p => p.permission);
        }

        // Merge permissions
        const allPermissions = admin.role === ADMIN_ROLES.SUPER_ADMIN
            ? Object.values(PERMISSIONS)
            : [...new Set([...defaultPermissions, ...customPermissions])];

        res.json({
            user: {
                id: admin.id,
                username: admin.username,
                email: admin.email,
                name: admin.name,
                role: admin.role,
                isSuperAdmin: admin.role === ADMIN_ROLES.SUPER_ADMIN
            },
            defaultPermissions,
            customPermissions,
            allPermissions,
            availablePermissions: Object.values(PERMISSIONS)
        });
    } catch (err) {
        console.error('Error fetching user permissions:', err);
        res.status(500).json({ message: 'Failed to fetch permissions' });
    }
});

// Grant permission to a user
router.post('/user/:userId/grant', authenticateAdmin, requireSuperAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        const { permission } = req.body;

        if (!Object.values(PERMISSIONS).includes(permission)) {
            return res.status(400).json({ message: 'Invalid permission' });
        }

        const admin = await Admin.findByPk(userId);

        if (!admin) {
            return res.status(404).json({ message: 'Admin user not found' });
        }

        // Can't modify super admin permissions
        if (admin.role === ADMIN_ROLES.SUPER_ADMIN) {
            return res.status(400).json({
                message: 'Cannot modify Super Admin permissions. Super Admins have all permissions by default.'
            });
        }

        // Check if permission already exists
        const [userPermission, created] = await UserPermission.findOrCreate({
            where: { userId, permission },
            defaults: { grantedBy: req.admin.id }
        });

        if (!created) {
            return res.status(409).json({ message: 'Permission already granted to this user' });
        }

        // Log the change
        await PermissionChange.create({
            adminId: req.admin.id,
            targetUserId: userId,
            targetUsername: admin.username,
            permission,
            action: 'granted'
        });

        res.json({
            message: 'Permission granted successfully',
            permission: userPermission
        });
    } catch (err) {
        console.error('Error granting permission:', err);
        res.status(500).json({ message: 'Failed to grant permission' });
    }
});

// Revoke permission from a user
router.delete('/user/:userId/revoke/:permission', authenticateAdmin, requireSuperAdmin, async (req, res) => {
    try {
        const { userId, permission } = req.params;

        const admin = await Admin.findByPk(userId);

        if (!admin) {
            return res.status(404).json({ message: 'Admin user not found' });
        }

        // Can't modify super admin permissions
        if (admin.role === ADMIN_ROLES.SUPER_ADMIN) {
            return res.status(400).json({
                message: 'Cannot modify Super Admin permissions.'
            });
        }

        // Check if it's a default permission
        const defaultPermissions = DEFAULT_ROLE_PERMISSIONS[admin.role] || [];
        if (defaultPermissions.includes(permission)) {
            return res.status(400).json({
                message: 'Cannot revoke default permission. This permission is built into the role.'
            });
        }

        const deleted = await UserPermission.destroy({
            where: { userId, permission }
        });

        if (deleted === 0) {
            return res.status(404).json({ message: 'Permission not found for this user' });
        }

        // Log the change
        await PermissionChange.create({
            adminId: req.admin.id,
            targetUserId: userId,
            targetUsername: admin.username,
            permission,
            action: 'revoked'
        });

        res.json({ message: 'Permission revoked successfully' });
    } catch (err) {
        console.error('Error revoking permission:', err);
        res.status(500).json({ message: 'Failed to revoke permission' });
    }
});

// Get permission change history
router.get('/history', authenticateAdmin, requireSuperAdmin, async (req, res) => {
    try {
        const history = await PermissionChange.findAll({
            order: [['changedAt', 'DESC']],
            limit: 100
        });

        res.json({ history });
    } catch (err) {
        console.error('Error fetching permission history:', err);
        res.status(500).json({ message: 'Failed to fetch history' });
    }
});

// Get permissions for current admin (used for permission checking)
router.get('/my-permissions', authenticateAdmin, async (req, res) => {
    try {
        const userId = req.admin.id;
        const admin = await Admin.findByPk(userId);

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Super admin has all permissions
        if (admin.role === ADMIN_ROLES.SUPER_ADMIN) {
            return res.json({ permissions: Object.values(PERMISSIONS) });
        }

        // Get default permissions
        const defaultPermissions = DEFAULT_ROLE_PERMISSIONS[admin.role] || [];

        // Get custom permissions
        const customPerms = await UserPermission.findAll({
            where: { userId },
            attributes: ['permission']
        });
        const customPermissions = customPerms.map(p => p.permission);

        // Merge permissions
        const allPermissions = [...new Set([...defaultPermissions, ...customPermissions])];

        res.json({ permissions: allPermissions });
    } catch (err) {
        console.error('Error fetching my permissions:', err);
        res.status(500).json({ message: 'Failed to fetch permissions' });
    }
});

export default router;
