import { createRouter, createWebHistory } from 'vue-router';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import Dashboard from '../pages/Dashboard.vue';
import PublicCard from '../pages/PublicCard.vue';
import AdminLogin from '../pages/AdminLogin.vue';
import AdminDashboard from '../pages/AdminDashboard.vue';

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
    { path: '/card/:phone', component: PublicCard },

    { path: '/admin/login', component: AdminLogin },
    { path: '/admin', component: AdminDashboard, meta: { requiresAdmin: true } },

    {
        path: "/admin/login",
        name: "AdminLogin",
        component: AdminLogin,
    },
    {
        path: "/admin/dashboard",
        name: "AdminDashboard",
        component: AdminDashboard,
        meta: { requiresAdminAuth: true }, // ✅ Protected route
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// ✅ Navigation Guard
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');

    if (to.meta.requiresAuth && !token) {
        // User not logged in — redirect to login
        next('/login');
    } else if ((to.path === '/login' || to.path === '/register') && token) {
        // Already logged in — redirect to dashboard
        next('/dashboard');
    } else {
        next();
    }

    const adminToken = localStorage.getItem('admin_token');
    if (to.meta.requiresAdmin && !adminToken) return next('/admin/login');
    next();
});

export default router;
