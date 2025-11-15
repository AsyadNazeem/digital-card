import axios from 'axios';
import router from '../router';
import { API_BASE_URL } from "../config.js";

const api = axios.create({
    baseURL: `${API_BASE_URL}/api`, // no trailing slash
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

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
