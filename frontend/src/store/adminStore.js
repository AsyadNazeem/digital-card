import {defineStore} from "pinia";
import adminApi from "../services/adminApi";

export const useAdminStore = defineStore("adminStore", {
    state: () => ({
        users: [],
        requests: [],
        adminUsers: [], // ADD THIS
        admin: null,
        role: null,
        token: localStorage.getItem("adminToken") || null,
        stats: {
            total: 0,
            today: 0,
            month: 0,
            google: 0,
            local: 0
        },
        loading: false,
        error: null,
        // Permission management
        myPermissions: [],
        rolePermissions: {},
        permissionHistory: [],
    }),

    getters: {
        isAuthenticated: (state) => !!state.admin,
        isSuperAdmin: (state) => state.role === 'super_admin',
        adminRole: (state) => state.role,

        pendingRequestsCount: (state) => {
            return state.requests.filter(r => r.status === "pending").length;
        },
        activeUsersCount: (state) => {
            return state.users.filter(u => u.status === "active").length;
        },
        usersByProvider: (state) => (provider) => {
            return state.users.filter(u => u.provider === provider);
        },
        usersByRegistrationType: (state) => (type) => {
            return state.users.filter(u => u.registrationType === type);
        }
    },

    actions: {
        initializeAuth() {
            const storedAdmin = localStorage.getItem("adminUser");
            if (storedAdmin) {
                try {
                    const adminData = JSON.parse(storedAdmin);
                    this.admin = adminData;
                    this.role = adminData.role;
                    console.log("✅ Admin restored from localStorage:", adminData);

                    // ADD THIS LINE:
                    this.fetchMyPermissions();
                } catch (err) {
                    console.error("❌ Error parsing stored admin:", err);
                    localStorage.removeItem("adminUser");
                }
            }
        },

        setAdmin(adminData) {
            this.admin = adminData;
            this.role = adminData.role;
            localStorage.setItem("adminUser", JSON.stringify(adminData));
            console.log("✅ Admin set:", adminData);

            // ADD THIS LINE:
            this.fetchMyPermissions();
        },

        // Permission Management Actions
        async fetchMyPermissions() {
            try {
                const response = await adminApi.get("/permissions/my-permissions");
                this.myPermissions = response.data.permissions || [];
                console.log("✅ Permissions loaded:", this.myPermissions);
            } catch (err) {
                console.error("❌ Error fetching permissions:", err);
                this.myPermissions = [];
            }
        },

        async fetchRolePermissions(role) {
            try {
                const response = await adminApi.get(`/permissions/role/${role}`);
                this.rolePermissions[role] = response.data;
                return response.data;
            } catch (err) {
                console.error("❌ Error fetching role permissions:", err);
                throw err;
            }
        },

        async grantPermission(role, permission) {
            try {
                await adminApi.post(`/permissions/role/${role}/grant`, { permission });
                await this.fetchRolePermissions(role);
                return { success: true };
            } catch (err) {
                console.error("❌ Error granting permission:", err);
                return {
                    success: false,
                    error: err.response?.data?.message || "Failed to grant permission"
                };
            }
        },

        async revokePermission(role, permission) {
            try {
                await adminApi.delete(`/permissions/role/${role}/revoke/${permission}`);
                await this.fetchRolePermissions(role);
                return { success: true };
            } catch (err) {
                console.error("❌ Error revoking permission:", err);
                return {
                    success: false,
                    error: err.response?.data?.message || "Failed to revoke permission"
                };
            }
        },

        async fetchPermissionHistory() {
            try {
                const response = await adminApi.get("/permissions/history");
                this.permissionHistory = response.data.history || [];
                return { success: true };
            } catch (err) {
                console.error("❌ Error fetching permission history:", err);
                return { success: false };
            }
        },


        // Existing actions...
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
                this.users = [];
            } finally {
                this.loading = false;
            }
        },

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

        async fetchRequests() {
            return this.loadRequests();
        },

        async deleteUser(userId) {
            try {
                await adminApi.delete(`/user/${userId}`);
                this.users = this.users.filter(u => u.id !== userId);
                console.log("✅ User deleted:", userId);
                return {success: true};
            } catch (err) {
                console.error("❌ Error deleting user:", err);
                throw err;
            }
        },

        async approveRequest(requestId) {
            try {
                const response = await adminApi.post(`/request/${requestId}/approve`);
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

        async rejectRequest(requestId, reason = "") {
            try {
                const response = await adminApi.post(`/request/${requestId}/reject`, {reason});
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

        // Fetch all admin users with their permissions
        async fetchAdminUsers() {
            try {
                const response = await adminApi.get("/permissions/users");
                this.adminUsers = response.data.users || [];
                console.log("✅ Admin users loaded:", this.adminUsers.length);
                return { success: true };
            } catch (err) {
                console.error("❌ Error fetching admin users:", err);
                return { success: false, error: err.response?.data?.message };
            }
        },

// Fetch permissions for a specific user
        async fetchUserPermissions(userId) {
            try {
                const response = await adminApi.get(`/permissions/user/${userId}`);
                console.log("✅ User permissions loaded:", response.data);
                return { success: true, data: response.data };
            } catch (err) {
                console.error("❌ Error fetching user permissions:", err);
                return { success: false, error: err.response?.data?.message };
            }
        },

// Grant permission to a user
        async grantUserPermission(userId, permission) {
            try {
                await adminApi.post(`/permissions/user/${userId}/grant`, { permission });
                console.log("✅ Permission granted to user");
                return { success: true };
            } catch (err) {
                console.error("❌ Error granting permission:", err);
                return {
                    success: false,
                    error: err.response?.data?.message || "Failed to grant permission"
                };
            }
        },

// Revoke permission from a user
        async revokeUserPermission(userId, permission) {
            try {
                await adminApi.delete(`/permissions/user/${userId}/revoke/${permission}`);
                console.log("✅ Permission revoked from user");
                return { success: true };
            } catch (err) {
                console.error("❌ Error revoking permission:", err);
                return {
                    success: false,
                    error: err.response?.data?.message || "Failed to revoke permission"
                };
            }
        },

        setToken(token) {
            this.token = token;
            localStorage.setItem("adminToken", token);
        },

        logout() {
            this.token = null;
            this.admin = null;
            this.role = null;
            this.users = [];
            this.requests = [];
            // ADD THESE THREE LINES:
            this.myPermissions = [];
            this.rolePermissions = {};
            this.permissionHistory = [];
            localStorage.removeItem("adminToken");
            localStorage.removeItem("adminUser");
            console.log("✅ Admin logged out");
        },

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
    }
});
