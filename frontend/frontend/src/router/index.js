import { createRouter, createWebHistory } from 'vue-router';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import Dashboard from '../pages/Dashboard.vue';
import PublicCard from '../pages/PublicCard.vue';

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
    { path: '/card/:phone', component: PublicCard },
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
});

export default router;
