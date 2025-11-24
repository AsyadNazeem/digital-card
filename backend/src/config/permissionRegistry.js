export const ADMIN_ROLES = {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin'
}

export const ADMIN_PAGES = [
    {
        permission: 'view_dashboard',
        category: 'System',
        description: 'Access admin dashboard and view statistics',
        defaultRoles: ['super_admin', 'admin'],
    },
    {
        permission: 'view_users',
        category: 'User Management',
        description: 'View list of all users in the system',
        defaultRoles: ['super_admin', 'admin'],
    },
    {
        permission: 'create_user',
        category: 'User Management',
        description: 'Create new user accounts manually',
        defaultRoles: ['super_admin'],
    },
    {
        permission: 'view_requests',
        category: 'Request Management',
        description: 'View user registration requests',
        defaultRoles: ['super_admin', 'admin'],
    },
    {
        permission: 'manage_themes',
        category: 'Theme Management',
        description: 'Create, edit, and delete themes',
        defaultRoles: ['super_admin', 'admin'],
    },
    {
        permission: 'manage_permissions',
        category: 'Permission Management',
        description: 'Manage user permissions and access control',
        defaultRoles: ['super_admin'],
    },
    {
        permission: 'register_admin',
        category: 'Admin Management',
        description: 'Register new admin users in the system',
        defaultRoles: ['super_admin'],
    },
    {
        permission: 'view_settings',
        category: 'System',
        description: 'View and modify system settings',
        defaultRoles: ['super_admin'],
    },
]

// Auto-generate permissions
export const PERMISSIONS = ADMIN_PAGES.reduce((acc, page) => {
    const key = page.permission.toUpperCase().replace(/-/g, '_')
    acc[key] = page.permission
    return acc
}, {})

// Auto-generate categories
export const PERMISSION_CATEGORIES = ADMIN_PAGES.reduce((acc, page) => {
    if (!acc[page.category]) {
        acc[page.category] = []
    }
    if (!acc[page.category].includes(page.permission)) {
        acc[page.category].push(page.permission)
    }
    return acc
}, {})

// Auto-generate default role permissions
export const DEFAULT_ROLE_PERMISSIONS = {
    [ADMIN_ROLES.SUPER_ADMIN]: ADMIN_PAGES.map(p => p.permission),
    [ADMIN_ROLES.ADMIN]: ADMIN_PAGES
        .filter(p => p.defaultRoles.includes(ADMIN_ROLES.ADMIN))
        .map(p => p.permission)
}

export function hasPermission(userRole, permission) {
    const permissions = DEFAULT_ROLE_PERMISSIONS[userRole] || []
    return permissions.includes(permission)
}

export function hasAllPermissions(userRole, permissionsArray) {
    return permissionsArray.every(permission => hasPermission(userRole, permission))
}

export function hasAnyPermission(userRole, permissionsArray) {
    return permissionsArray.some(permission => hasPermission(userRole, permission))
}
