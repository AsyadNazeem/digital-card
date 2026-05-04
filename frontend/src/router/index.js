import { createRouter, createWebHistory } from "vue-router";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import UserLayout from "../components/user/UserLayout.vue";
import PublicCard from "../pages/PublicCard.vue";
import ResetPassword from "../pages/ResetPassword.vue";
import AdminLogin from "../pages/admin/AdminLogin.vue";
import ReviewShare from "../pages/ReviewShare.vue";
import { startIdleTimer, stopIdleTimer } from "../utils/idleLogout";
import { useAdminStore } from "@/store/adminStore.js";
import { ADMIN_PAGES, ADMIN_ROLES } from "@/config/permissionRegistry.js";

const adminChildRoutes = ADMIN_PAGES.map(page => ({
    path: page.path,
    name: page.name.replace(/\s+/g, ''),
    component: () => import(`../pages/admin/${page.component}.vue`),
    meta: {
        requiresPermission: page.permission,
        requiresSuperAdmin: page.defaultRoles.length === 1 && page.defaultRoles[0] === ADMIN_ROLES.SUPER_ADMIN
    }
}))

const routes = [
    { path: "/", redirect: "/login" },
    { path: "/login", component: Login },
    { path: "/register", component: Register },
    { path: "/reset-password", component: ResetPassword },
    { path: "/dashboard", component: UserLayout, meta: { requiresAuth: true } },
    { path: "/:phone", component: PublicCard },
    { path: "/admin/login", name: "AdminLogin", component: AdminLogin },
    {
        path: "/admin",
        component: () => import("../components/admin/AdminLayout.vue"),
        meta: { requiresAdminAuth: true },
        children: adminChildRoutes
    },
    {
        path: '/:companyName/:branchName',
        name: 'ReviewShare',
        component: ReviewShare,
        meta: { requiresAuth: false, title: 'Leave a Review' }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Navigation Guard — async so we can await permission fetch
router.beforeEach(async (to, from, next) => {
    const userToken = localStorage.getItem("token");
    const adminToken = localStorage.getItem("adminToken");
    const adminStore = useAdminStore();

    // USER PROTECTED ROUTE
    if (to.meta.requiresAuth) {
        if (!userToken) {
            return next("/login");
        }
        startIdleTimer(() => {
            localStorage.removeItem("token");
            stopIdleTimer();
            alert("You were logged out due to inactivity.");
            window.location.href = "/login";
        }, 10);
        return next();
    }

    // ADMIN PROTECTED ROUTE
    if (to.meta.requiresAdminAuth) {
        if (!adminToken) {
            return next("/admin/login");
        }

        if (!adminStore.isAuthenticated) {
            adminStore.initializeAuth();
            if (!adminStore.isAuthenticated) {
                localStorage.removeItem("adminToken");
                localStorage.removeItem("adminUser");
                return next("/admin/login");
            }
        }

        // Check super admin requirement
        if (to.meta.requiresSuperAdmin && !adminStore.isSuperAdmin) {
            return next("/admin/dashboard");
        }

        // Check specific permission
        if (to.meta.requiresPermission && !adminStore.isSuperAdmin) {
            if (adminStore.myPermissions.length === 0) {
                await adminStore.fetchMyPermissions();
            }
            const hasPermission = adminStore.myPermissions.includes(to.meta.requiresPermission);
            if (!hasPermission) {
                return next("/admin/dashboard");
            }
        }

        startIdleTimer(() => {
            localStorage.removeItem("adminToken");
            localStorage.removeItem("adminUser");
            adminStore.logout();
            stopIdleTimer();
            alert("Admin session ended due to inactivity.");
            window.location.href = "/admin/login";
        }, 10);

        return next();
    }

    next();
});

export default router;
