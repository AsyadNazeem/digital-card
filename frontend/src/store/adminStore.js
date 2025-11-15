// store/adminStore.js
import {defineStore} from "pinia";
import adminApi from "../services/adminApi";

export const useAdminStore = defineStore("adminStore", {
    state: () => ({
        users: [],              // ✅ Added for user management
        requests: [],
        admin: null,
        token: localStorage.getItem("adminToken") || null,
        stats: {                // ✅ Added for dashboard stats
            total: 0,
            today: 0,
            month: 0,
            google: 0,
            local: 0
        },
        loading: false,         // ✅ Added for loading states
        error: null,            // ✅ Added for error handling
    }),

    actions: {
        // ✅ NEW: Fetch all users
        async fetchUsers() {
            this.loading = true;
            this.error = null;
            try {
                console.log("🔵 Fetching users...");
                const response = await adminApi.get("/users");
                this.users = response.data.users || [];
                console.log("✅ Users fetched:", this.users.length);
            } catch (err) {
                console.error("❌ Error fetching users:", err);
                this.error = err.response?.data?.message || "Failed to fetch users";
                this.users = []; // Ensure it's an empty array on error
            } finally {
                this.loading = false;
            }
        },

        // ✅ NEW: Fetch dashboard stats
        async fetchStats() {
            this.loading = true;
            this.error = null;
            try {
                const response = await adminApi.get("/stats/overview");
                this.stats = {
                    total: response.data.total || 0,
                    today: response.data.today || 0,
                    month: response.data.month || 0,
                    google: response.data.google || 0,
                    local: response.data.local || 0
                };
                console.log("✅ Stats fetched:", this.stats);
            } catch (err) {
                console.error("❌ Error fetching stats:", err);
                this.error = err.response?.data?.message || "Failed to fetch stats";
            } finally {
                this.loading = false;
            }
        },

        // ✅ EXISTING: Load requests (kept your original function)
        async loadRequests() {
            this.loading = true;
            this.error = null;
            try {
                const res = await adminApi.get("/requests");
                this.requests = res.data.requests || [];
                console.log("✅ Requests loaded:", this.requests.length);
            } catch (err) {
                console.error("❌ Failed to load requests:", err);
                this.error = err.response?.data?.message || "Failed to load requests";
                this.requests = [];
            } finally {
                this.loading = false;
            }
        },

        // ✅ NEW: Alias for consistency
        async fetchRequests() {
            return this.loadRequests();
        },

        // ✅ NEW: Delete user
        async deleteUser(userId) {
            try {
                await adminApi.delete(`/user/${userId}`);
                // Remove from local state
                this.users = this.users.filter(u => u.id !== userId);
                console.log("✅ User deleted:", userId);
                return {success: true};
            } catch (err) {
                console.error("❌ Error deleting user:", err);
                throw err;
            }
        },

        // ✅ NEW: Approve request
        async approveRequest(requestId) {
            try {
                const response = await adminApi.post(`/request/${requestId}/approve`);
                // Update local state
                const request = this.requests.find(r => r.id === requestId);
                if (request) {
                    request.status = "approved";
                }
                console.log("✅ Request approved:", requestId);
                return response.data;
            } catch (err) {
                console.error("❌ Error approving request:", err);
                throw err;
            }
        },

        // ✅ NEW: Reject request
        async rejectRequest(requestId, reason = "") {
            try {
                const response = await adminApi.post(`/request/${requestId}/reject`, {reason});
                // Update local state
                const request = this.requests.find(r => r.id === requestId);
                if (request) {
                    request.status = "rejected";
                    request.reason = reason;
                }
                console.log("✅ Request rejected:", requestId);
                return response.data;
            } catch (err) {
                console.error("❌ Error rejecting request:", err);
                throw err;
            }
        },

        // ✅ EXISTING: Set token (kept your original)
        setToken(token) {
            this.token = token;
            localStorage.setItem("adminToken", token);
        },

        // ✅ UPDATED: Logout (enhanced with cleanup)
        logout() {
            this.token = null;
            this.admin = null;
            this.users = [];
            this.requests = [];
            localStorage.removeItem("adminToken");
            localStorage.removeItem("adminUser");
            console.log("✅ Admin logged out");
        },

        // ✅ NEW: Reset store
        resetStore() {
            this.users = [];
            this.requests = [];
            this.stats = {
                total: 0,
                today: 0,
                month: 0,
                google: 0,
                local: 0
            };
            this.loading = false;
            this.error = null;
        }
    },

    getters: {
        // ✅ NEW: Get pending requests count
        pendingRequestsCount: (state) => {
            return state.requests.filter(r => r.status === "pending").length;
        },

        // ✅ NEW: Get active users count
        activeUsersCount: (state) => {
            return state.users.filter(u => u.status === "active").length;
        },

        // ✅ NEW: Get users by provider
        usersByProvider: (state) => (provider) => {
            return state.users.filter(u => u.provider === provider);
        },

        // ✅ NEW: Get users by registration type
        usersByRegistrationType: (state) => (type) => {
            return state.users.filter(u => u.registrationType === type);
        }
    }
});
