// ✅ Define ADMIN_ROLES here directly (don't import from adminPermissions)
export const ADMIN_ROLES = {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin'
}

// ✅ SINGLE SOURCE OF TRUTH - Add all your admin pages here
export const ADMIN_PAGES = [
    {
        path: 'dashboard',
        name: 'Dashboard',
        component: 'AdminDashboard',
        permission: 'view_dashboard',
        category: 'System',
        description: 'Access admin dashboard and view statistics',
        icon: '📊',
        defaultRoles: [ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN],
    },
    {
        path: 'users',
        name: 'Users',
        component: 'AdminUsers',
        permission: 'view_users',
        category: 'User Management',
        description: 'View list of all users in the system',
        icon: '👥',
        defaultRoles: [ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN],
    },
    {
        path: 'users/create',
        name: 'Create User',
        component: 'AdminRegisterUser',
        permission: 'create_user',
        category: 'User Management',
        description: 'Create new user accounts manually',
        icon: '➕',
        defaultRoles: [ADMIN_ROLES.SUPER_ADMIN],
        hideFromSidebar: true, // Don't show as separate link
    },
    {
        path: 'requests',
        name: 'Requests',
        component: 'AdminRequests',
        permission: 'view_requests',
        category: 'Request Management',
        description: 'View user registration requests',
        icon: '📋',
        defaultRoles: [ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN],
        showBadge: 'pendingRequests', // Show badge from store
    },
    {
        path: 'themes',
        name: 'Themes',
        component: 'AdminAddTheme',
        permission: 'manage_themes',
        category: 'Theme Management',
        description: 'Create, edit, and delete themes',
        icon: '🎨',
        defaultRoles: [ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN],
    },
    {
        path: 'permissions',
        name: 'Permissions',
        component: 'PermissionManagement',
        permission: 'manage_permissions',
        category: 'Permission Management',
        description: 'Manage user permissions and access control',
        icon: '🔐',
        defaultRoles: [ADMIN_ROLES.SUPER_ADMIN],
    },
    {
        path: 'registration',
        name: 'Admin Register',
        component: 'AdminRegistration',
        permission: 'register_admin',
        category: 'Admin Management',
        description: 'Register new admin users in the system',
        icon: '✚',
        defaultRoles: [ADMIN_ROLES.SUPER_ADMIN],
    },
    {
        path: 'settings',
        name: 'Settings',
        component: 'AdminSettings',
        permission: 'view_settings',
        category: 'System',
        description: 'View and modify system settings',
        icon: '⚙️',
        defaultRoles: [ADMIN_ROLES.SUPER_ADMIN],
    },
    // ✅ TO ADD NEW PAGE: Just add one entry here!
    // {
    //     path: 'my-new-page',
    //     name: 'My New Page',
    //     component: 'AdminMyNewPage',
    //     permission: 'access_my_new_page',
    //     category: 'My Category',
    //     description: 'What this page does',
    //     icon: '🆕',
    //     defaultRoles: [ADMIN_ROLES.SUPER_ADMIN],
    // },
]

// Auto-generate permissions object
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

// Helper functions
export function getPermissionDetails(permission) {
    return ADMIN_PAGES.find(p => p.permission === permission)
}

export function getPermissionsByCategory(category) {
    return ADMIN_PAGES.filter(p => p.category === category)
}

export function getPermissionDescription(permission) {
    const page = ADMIN_PAGES.find(p => p.permission === permission)
    return page?.description || 'No description available'
}

export function getPermissionIcon(permission) {
    const page = ADMIN_PAGES.find(p => p.permission === permission)
    return page?.icon || '📌'
}

export function getCategoryIcon(category) {
    const page = ADMIN_PAGES.find(p => p.category === category)
    return page?.icon || '📌'
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
