import { defineStore } from "pinia";
import adminApi from "../services/adminApi";

export const useAdminStore = defineStore("adminStore", {
    state: () => ({
        requests: [],
        admin: null,
        token: localStorage.getItem("admin_token") || null,
    }),

    actions: {
        async loadRequests() {
            try {
                const res = await adminApi.get("/requests");
                this.requests = res.data.requests || [];
            } catch (err) {
                console.error("Failed to load requests:", err);
            }
        },

        setToken(token) {
            this.token = token;
            localStorage.setItem("admin_token", token);
        },

        logout() {
            this.token = null;
            this.admin = null;
            localStorage.removeItem("admin_token");
            localStorage.removeItem("adminUser");
        },
    },
});
