import axios from 'axios';
import router from '../router';

const api = axios.create({
    baseURL: 'http://localhost:4000/api',
});

// ✅ Automatically attach token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ✅ Automatically handle expired token
api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response && err.response.status === 401) {
            localStorage.removeItem('token');
            router.push('/login');
        }
        return Promise.reject(err);
    }
);

export default api;
