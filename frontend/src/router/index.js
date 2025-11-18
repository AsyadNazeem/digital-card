import { createRouter, createWebHistory } from "vue-router";

import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import Dashboard from "../pages/Dashboard.vue";
import PublicCard from "../pages/PublicCard.vue";

import AdminLogin from "../pages/admin/AdminLogin.vue";
import { startIdleTimer, stopIdleTimer } from "../utils/idleLogout";

const routes = [
    // USER ROUTES
    { path: "/", redirect: "/login" },
    { path: "/login", component: Login },
    { path: "/register", component: Register },
    { path: "/dashboard", component: Dashboard, meta: { requiresAuth: true } },
    { path: "/:phone", component: PublicCard },

    // ADMIN LOGIN
    { path: "/admin/login", name: "AdminLogin", component: AdminLogin },

    // ADMIN LAYOUT + ADMIN PAGES
    {
        path: "/admin",
        component: () => import("../components/admin/AdminLayout.vue"),
        meta: { requiresAdminAuth: true },
        children: [
            {
                path: "dashboard",
                name: "AdminDashboard",
                component: () => import("../pages/admin/AdminDashboard.vue"),
            },
            {
                path: "users",
                name: "AdminUsers",
                component: () => import("../pages/admin/AdminUsers.vue"),
            },
            {
                path: "users/create",
                name: "AdminRegisterUser",
                component: () => import("../pages/admin/AdminRegisterUser.vue"),
            },
            {
                path: "requests",
                name: "AdminRequests",
                component: () => import("../pages/admin/AdminRequests.vue"),
            },
            {
                path: "themes",
                name: "AdminThemes",
                component: () => import("../pages/admin/AdminAddTheme.vue"),
            },
            {
                path: "settings",
                name: "AdminSettings",
                component: () => import("../pages/admin/AdminSettings.vue"),
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Navigation Guard
router.beforeEach((to, from, next) => {
    const userToken = localStorage.getItem("token");
    const adminToken = localStorage.getItem("adminToken");

    // USER PROTECTED ROUTE
    if (to.meta.requiresAuth) {
        if (!userToken) return next("/login");

        // Start inactivity timer only when user is logged in
        startIdleTimer(() => {
            localStorage.removeItem("token");
            stopIdleTimer();
            alert("You were logged out due to inactivity.");
            next("/login");
            window.location.reload();
        }, 10); // 5 = minutes timeout
    }

    // ADMIN PROTECTED ROUTE
    if (to.meta.requiresAdminAuth) {
        if (!adminToken) return next("/admin/login");

        startIdleTimer(() => {
            localStorage.removeItem("adminToken");
            stopIdleTimer();
            alert("Admin session ended due to inactivity.");
            next("/admin/login");
            window.location.reload();
        }, 10); // Example: Admin 10 minute timeout
    }

    return next();
});

export default router;
