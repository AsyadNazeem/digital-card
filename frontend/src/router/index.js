import { createRouter, createWebHistory } from "vue-router";
import Login from "../pages/user/Login.vue";
import Register from "../pages/user/Register.vue";
import UserLayout from "../components/user/UserLayout.vue";
import PublicCard from "../pages/common/PublicCard.vue";
import ResetPassword from "../pages/user/ResetPassword.vue";
import AdminLogin from "../pages/admin/AdminLogin.vue";
import ReviewShare from "../pages/common/ReviewShare.vue";

// ── Landing shell + pages ──
import LandingLayout from "../components/landing/LandingLayout.vue";
import Home     from "../pages/landing/Home.vue";
import Features from "../pages/landing/Features.vue";
import Pricing  from "../pages/landing/Pricing.vue";
import Contact  from "../pages/landing/Contact.vue";
import About    from "../pages/landing/About.vue";

// ✅ IMPORT AdminMessages directly from components
import AdminMessages from "../components/admin/AdminMessage.vue";

import { startIdleTimer, stopIdleTimer } from "../utils/idleLogout";
import { useAdminStore } from "@/store/adminStore.js";
import { ADMIN_PAGES, ADMIN_ROLES } from "@/config/permissionRegistry.js";

// ✅ FIXED: Load from BOTH pages/admin/ AND components/
const adminPageModules = import.meta.glob('../pages/admin/*.vue')
const adminComponentModules = import.meta.glob('../components/Admin*.vue')

// ✅ FIXED: Route generator that handles both locations
const adminChildRoutes = ADMIN_PAGES.map(page => {
    let component = null;

    // First, try to find in pages/admin/
    const pageKey = `../pages/admin/${page.component}.vue`
    if (pageKey in adminPageModules) {
        component = adminPageModules[pageKey]
    }
    // If not found, try components/ with "Admin" prefix
    else if (page.component === 'AdminMessages') {
        component = AdminMessages  // ✅ Use direct import
    }
    // Fallback: try components glob
    else {
        const componentKey = `../components/${page.component}.vue`
        if (componentKey in adminComponentModules) {
            component = adminComponentModules[componentKey]
        }
    }

    // ⚠️ WARN if component not found
    if (!component) {
        console.warn(`⚠️ Component not found for page: ${page.component}`)
    }

    return {
        path: page.path,
        name: page.name.replace(/\s+/g, ''),
        component: component || (() => import("../pages/admin/AdminDashboard.vue")), // fallback to dashboard
        meta: {
            requiresPermission: page.permission,
            requiresSuperAdmin:
                page.defaultRoles.length === 1 &&
                page.defaultRoles[0] === ADMIN_ROLES.SUPER_ADMIN,
        },
    }
})

const routes = [
    {
        path: "/",
        component: LandingLayout,
        children: [
            { path: "",         name: "Home",     component: Home     },
            { path: "features", name: "Features", component: Features },
            { path: "pricing",  name: "Pricing",  component: Pricing  },
            { path: "contact",  name: "Contact",  component: Contact  },
            { path: "about",    name: "About",    component: About    },
        ],
    },
    // { path: "/", redirect: "/login" },
    // ── Auth ──
    { path: "/login",          component: Login          },
    { path: "/register",       component: Register       },
    { path: "/reset-password", component: ResetPassword  },

    // ── User dashboard ──
    { path: "/dashboard", component: UserLayout, meta: { requiresAuth: true } },

    // ── Admin ──
    { path: "/admin/login", name: "AdminLogin", component: AdminLogin },
    {
        path: "/admin",
        component: () => import("../components/admin/AdminLayout.vue"),
        meta: { requiresAdminAuth: true },
        children: adminChildRoutes,
    },

    // ── Public / misc ──
    {
        path: "/:companyName/:branchName",
        name: "ReviewShare",
        component: ReviewShare,
        meta: { requiresAuth: false, title: "Leave a Review" },
    },
    { path: "/:phone", component: PublicCard }, // keep last — catch-all for phone numbers
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// ── Navigation Guard ──
router.beforeEach(async (to, from, next) => {
    const userToken  = localStorage.getItem("token");
    const adminToken = localStorage.getItem("adminToken");
    const adminStore = useAdminStore();

    // USER PROTECTED ROUTE
    if (to.meta.requiresAuth) {
        if (!userToken) return next("/login");

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
        if (!adminToken) return next("/admin/login");

        if (!adminStore.isAuthenticated) {
            adminStore.initializeAuth();
            if (!adminStore.isAuthenticated) {
                localStorage.removeItem("adminToken");
                localStorage.removeItem("adminUser");
                return next("/admin/login");
            }
        }

        if (to.meta.requiresSuperAdmin && !adminStore.isSuperAdmin) {
            return next("/admin/dashboard");
        }

        if (to.meta.requiresPermission && !adminStore.isSuperAdmin) {
            if (adminStore.myPermissions.length === 0) {
                await adminStore.fetchMyPermissions();
            }
            const hasPermission = adminStore.myPermissions.includes(to.meta.requiresPermission);
            if (!hasPermission) return next("/admin/dashboard");
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
