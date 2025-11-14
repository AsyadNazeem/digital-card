import { createRouter, createWebHistory } from "vue-router";

import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import Dashboard from "../pages/Dashboard.vue";
import PublicCard from "../pages/PublicCard.vue";

import AdminLogin from "../pages/admin/AdminLogin.vue";

const routes = [
    // USER ROUTES
    { path: "/", redirect: "/login" },
    { path: "/login", component: Login },
    { path: "/register", component: Register },
    { path: "/dashboard", component: Dashboard, meta: { requiresAuth: true } },
    { path: "/card/:phone", component: PublicCard },

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
                path: "requests",
                name: "AdminRequests",
                component: () => import("../pages/admin/AdminRequests.vue"),
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


// =============================================
// 🚀 FIXED & SECURE NAVIGATION GUARD
// =============================================
router.beforeEach((to, from, next) => {
    const userToken = localStorage.getItem("token");
    const adminToken = localStorage.getItem("adminToken");

    // -----------------------------
    // USER-PROTECTED ROUTES
    // -----------------------------
    if (to.meta.requiresAuth && !userToken) {
        return next("/login");
    }

    if ((to.path === "/login" || to.path === "/register") && userToken) {
        return next("/dashboard");
    }

    // -----------------------------
    // ADMIN-PROTECTED ROUTES
    // -----------------------------
    if (to.meta.requiresAdminAuth && !adminToken) {
        return next("/admin/login");
    }

    // Always allow navigation if no conditions block it
    return next();
});


export default router;
