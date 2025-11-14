import axios from "axios";
import router from "../router";

const adminApi = axios.create({
    baseURL: "http://localhost:4000/api/admin",
});

// ✅ Always attach the admin token
adminApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("adminToken"); // ✅ Must match saved key
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log("🟢 Attached Authorization header:", config.headers.Authorization);
        } else {
            console.warn("⚠️ No adminToken found in localStorage!");
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ✅ Auto-logout if token invalid or expired
adminApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.warn("⛔ admin unauthorized, logging out...");
            localStorage.removeItem("adminToken");
            localStorage.removeItem("adminUser");
            router.push("/admin/login");
        }
        return Promise.reject(error);
    }
);

export default adminApi;
