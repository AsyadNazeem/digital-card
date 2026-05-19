// ✅ Define ADMIN_ROLES here directly (don't import from adminPermissions)
export const ADMIN_ROLES = {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin'
}

// ✅ SINGLE SOURCE OF TRUTH - Add all your admin pages here with inline SVG icons
export const ADMIN_PAGES = [
    {
        path: 'dashboard',
        name: 'Dashboard',
        component: 'AdminDashboard',
        permission: 'view_dashboard',
        category: 'System',
        description: 'Access admin dashboard and view statistics',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
        defaultRoles: [ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN],
    },
    {
        path: 'users',
        name: 'Users',
        component: 'AdminUsers',
        permission: 'view_users',
        category: 'User Management',
        description: 'View list of all users in the system',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
        defaultRoles: [ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN],
    },
    // ✅ MESSAGES - Now with correct structure matching other pages:
    {
        path: 'messages',
        name: 'Messages',
        component: 'AdminMessages',  // ✅ IMPORTANT: Match the Vue filename!
        permission: 'view_messages',
        category: 'Messaging',
        description: 'View and manage user messages',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
        defaultRoles: [ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN],
        showBadge: 'unreadMessages',
    },
    {
        path: 'users/create',
        name: 'Create User',
        component: 'AdminRegisterUser',
        permission: 'create_user',
        category: 'User Management',
        description: 'Create new user accounts manually',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
        defaultRoles: [ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN],
        hideFromSidebar: true,
    },
    {
        path: 'requests',
        name: 'Requests',
        component: 'AdminRequests',
        permission: 'view_requests',
        category: 'Request Management',
        description: 'View user registration requests',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>',
        defaultRoles: [ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN],
        showBadge: 'pendingRequests',
    },
    {
        path: 'themes',
        name: 'Themes',
        component: 'AdminAddTheme',
        permission: 'manage_themes',
        category: 'Theme Management',
        description: 'Create, edit, and delete themes',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>',
        defaultRoles: [ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN],
    },
    {
        path: 'permissions',
        name: 'Permissions',
        component: 'PermissionManagement',
        permission: 'manage_permissions',
        category: 'Permission Management',
        description: 'Manage user permissions and access control',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
        defaultRoles: [ADMIN_ROLES.SUPER_ADMIN],
    },
    {
        path: 'registration',
        name: 'Admin Register',
        component: 'AdminRegistration',
        permission: 'register_admin',
        category: 'Admin Management',
        description: 'Register new admin users in the system',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>',
        defaultRoles: [ADMIN_ROLES.SUPER_ADMIN],
    },
    {
        path: 'settings',
        name: 'Settings',
        component: 'AdminSettings',
        permission: 'view_settings',
        category: 'System',
        description: 'View and modify system settings',
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19.14 12.94a7.48 7.48 0 0 0 .05-.94 7.48 7.48 0 0 0-.05-.94l2.03-1.58 a.5.5 0 0 0 .12-.65l-1.92-3.32 a.5.5 0 0 0-.6-.22l-2.39.96 a7.28 7.28 0 0 0-1.63-.94l-.36-2.54 a.5.5 0 0 0-.5-.42h-3.84 a.5.5 0 0 0-.5.42l-.36 2.54 a7.28 7.28 0 0 0-1.63.94l-2.39-.96 a.5.5 0 0 0-.6.22L2.71 8.83 a.5.5 0 0 0 .12.65l2.03 1.58 a7.48 7.48 0 0 0-.05.94 7.48 7.48 0 0 0 .05.94l-2.03 1.58 a.5.5 0 0 0-.12.65l1.92 3.32 a.5.5 0 0 0 .6.22l2.39-.96 a7.28 7.28 0 0 0 1.63.94l.36 2.54 a.5.5 0 0 0 .5.42h3.84 a.5.5 0 0 0 .5-.42l.36-2.54 a7.28 7.28 0 0 0 1.63-.94l2.39.96 a.5.5 0 0 0 .6-.22l1.92-3.32 a.5.5 0 0 0-.12-.65l-2.03-1.58z"/><circle cx="12" cy="12" r="3"/></svg>',
        defaultRoles: [ADMIN_ROLES.SUPER_ADMIN],
    },
    {
        path: 'users',
        name: 'Delete User',
        component: 'AdminUsers',
        permission: 'delete_user',
        category: 'User Management',
        description: 'Delete user accounts',
        icon: '...',
        defaultRoles: [ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN],
        hideFromSidebar: true,
    },
    {
        path: 'users',
        name: 'Edit User Limits',
        component: 'AdminUsers',
        permission: 'edit_user_limits',
        category: 'User Management',
        description: 'Edit user limits and plans',
        icon: '...',
        defaultRoles: [ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN],
        hideFromSidebar: true,
    },
    {
        path: 'users',
        name: 'Edit Company',
        component: 'AdminUsers',
        permission: 'edit_company',
        category: 'User Management',
        description: 'Edit company details',
        icon: '...',
        defaultRoles: [ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN],
        hideFromSidebar: true,
    },
    {
        path: 'users',
        name: 'Edit Contact',
        component: 'AdminUsers',
        permission: 'edit_contact',
        category: 'User Management',
        description: 'Edit contact details',
        icon: '...',
        defaultRoles: [ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN],
        hideFromSidebar: true,
    },
    {
        path: 'users',
        name: 'Edit Review',
        component: 'AdminUsers',
        permission: 'edit_review',
        category: 'User Management',
        description: 'Edit review details',
        icon: '...',
        defaultRoles: [ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN],
        hideFromSidebar: true,
    },
    {
        path: 'users',
        name: 'Delete Review',
        component: 'AdminUsers',
        permission: 'delete_review',
        category: 'User Management',
        description: 'Delete reviews',
        icon: '...',
        defaultRoles: [ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN],
        hideFromSidebar: true,
    },
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
    return page?.icon || '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>'
}

export function getCategoryIcon(category) {
    const page = ADMIN_PAGES.find(p => p.category === category)
    return page?.icon || '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>'
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
