import { defineStore } from "pinia";
import adminApi from "../services/adminApi";

export const useAdminStore = defineStore("adminStore", {
    state: () => ({
        users: [],
        requests: [],
        adminUsers: [],
        messages: [],                    // ✅ Messages from contact form
        unreadMessagesCount: 0,          // ✅ Unread message count
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
        },
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

                    this.fetchMyPermissions();
                    this.loadUnreadMessages();  // ✅ Load unread count on init
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

            this.fetchMyPermissions();
            this.loadUnreadMessages();  // ✅ Load unread count
        },

        // ============================================
        // ✅ MESSAGE MANAGEMENT ACTIONS
        // ============================================

        /**
         * Load all messages with pagination
         * @param {number} page - Page number (default 1)
         * @param {number} limit - Items per page (default 20)
         */
        async loadMessages(page = 1, limit = 20) {
            this.loading = true;
            this.error = null;
            try {
                console.log("🔵 Fetching messages...");
                // ✅ CORRECTED PATH: /api/admin/messages
                const response = await adminApi.get("/messages", {
                    params: { page, limit }
                });
                this.messages = response.data.messages || [];
                console.log(`✅ Messages loaded: ${this.messages.length} items (page ${page})`);
                return {
                    success: true,
                    messages: this.messages,
                    pagination: response.data.pagination
                };
            } catch (err) {
                console.error("❌ Error fetching messages:", err);
                this.error = err.response?.data?.message || "Failed to load messages";
                this.messages = [];
                return { success: false, error: this.error };
            } finally {
                this.loading = false;
            }
        },

        /**
         * Load count of unread messages
         */
        async loadUnreadMessages() {
            try {
                // ✅ CORRECTED PATH: /api/admin/messages/unread-count
                const response = await adminApi.get("/messages/unread-count");
                this.unreadMessagesCount = response.data.count || 0;
                console.log(`✅ Unread messages count: ${this.unreadMessagesCount}`);
                return { success: true, count: this.unreadMessagesCount };
            } catch (err) {
                console.error("❌ Error fetching unread count:", err);
                this.unreadMessagesCount = 0;
                return { success: false };
            }
        },

        /**
         * Get a single message by ID
         * @param {string} messageId - Message UUID
         */
        async getMessage(messageId) {
            try {
                // ✅ CORRECTED PATH: /api/admin/messages/:id
                const response = await adminApi.get(`/messages/${messageId}`);
                console.log(`✅ Message loaded: ${messageId}`);
                return { success: true, message: response.data.message };
            } catch (err) {
                console.error("❌ Error fetching message:", err);
                return {
                    success: false,
                    error: err.response?.data?.message || "Failed to load message"
                };
            }
        },

        /**
         * Mark a single message as read
         * @param {string} messageId - Message UUID
         */
        async markMessageAsRead(messageId) {
            try {
                // ✅ CORRECTED PATH: /api/admin/messages/:id/read
                await adminApi.put(`/messages/${messageId}/read`);
                const message = this.messages.find(m => m.id === messageId);
                if (message) {
                    message.isRead = true;
                }
                await this.loadUnreadMessages();
                console.log(`✅ Message marked as read: ${messageId}`);
                return { success: true };
            } catch (err) {
                console.error("❌ Error marking message as read:", err);
                return {
                    success: false,
                    error: err.response?.data?.message || "Failed to mark message as read"
                };
            }
        },

        /**
         * Mark all messages as read
         */
        async markAllMessagesAsRead() {
            try {
                // ✅ CORRECTED PATH: /api/admin/messages/mark-all-read
                await adminApi.put("/messages/mark-all-read");
                this.messages.forEach(m => m.isRead = true);
                await this.loadUnreadMessages();
                console.log("✅ All messages marked as read");
                return { success: true };
            } catch (err) {
                console.error("❌ Error marking all messages as read:", err);
                return {
                    success: false,
                    error: err.response?.data?.message || "Failed to mark all messages as read"
                };
            }
        },

        /**
         * Delete a message
         * @param {string} messageId - Message UUID
         */
        async deleteMessage(messageId) {
            try {
                // ✅ CORRECTED PATH: /api/admin/messages/:id
                await adminApi.delete(`/messages/${messageId}`);
                this.messages = this.messages.filter(m => m.id !== messageId);
                await this.loadUnreadMessages();
                console.log(`✅ Message deleted: ${messageId}`);
                return { success: true };
            } catch (err) {
                console.error("❌ Error deleting message:", err);
                return {
                    success: false,
                    error: err.response?.data?.message || "Failed to delete message"
                };
            }
        },

        /**
         * Send a reply to a message sender
         * @param {string} messageId - Message UUID
         * @param {string} replyText - Reply message text
         */
        async sendMessageReply(messageId, replyText) {
            try {
                // ✅ CORRECTED PATH: /api/admin/messages/:id/reply
                const response = await adminApi.post(`/messages/${messageId}/reply`, {
                    replyText
                });
                console.log(`✅ Reply sent for message: ${messageId}`);
                return { success: true, data: response.data };
            } catch (err) {
                console.error("❌ Error sending reply:", err);
                return {
                    success: false,
                    error: err.response?.data?.message || "Failed to send reply"
                };
            }
        },

        /**
         * Filter messages by type
         * @param {string} type - Message type: 'contact', 'plan_upgrade', 'plan_downgrade', 'support'
         */
        async filterMessagesByType(type) {
            try {
                // ✅ CORRECTED PATH: /api/admin/messages/filter/:type
                const response = await adminApi.get(`/messages/filter/${type}`);
                this.messages = response.data.messages || [];
                console.log(`✅ Messages filtered by type '${type}': ${this.messages.length} items`);
                return { success: true, messages: this.messages, count: response.data.count };
            } catch (err) {
                console.error("❌ Error filtering messages:", err);
                return {
                    success: false,
                    error: err.response?.data?.message || "Failed to filter messages"
                };
            }
        },

        /**
         * Search messages
         * @param {string} query - Search query
         */
        async searchMessages(query) {
            try {
                // ✅ CORRECTED PATH: /api/admin/messages/search/:query
                const response = await adminApi.get(`/messages/search/${query}`);
                this.messages = response.data.messages || [];
                console.log(`✅ Search for '${query}': ${this.messages.length} results`);
                return { success: true, messages: this.messages, count: response.data.count };
            } catch (err) {
                console.error("❌ Error searching messages:", err);
                return {
                    success: false,
                    error: err.response?.data?.message || "Failed to search messages"
                };
            }
        },

        // ============================================
        // END OF MESSAGE MANAGEMENT ACTIONS
        // ============================================

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

        // ============================================
        // EXISTING ACTIONS (User & Request Management)
        // ============================================

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
                return { success: true };
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
                const response = await adminApi.post(`/request/${requestId}/reject`, { reason });
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

        async createAdmin(formData) {
            try {
                const res = await adminApi.post('/admins/create', {
                    name: formData.name,
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role,
                    status: formData.status,
                })
                return { success: true, data: res.data }
            } catch (err) {
                return {
                    success: false,
                    error: err.response?.data?.message || err.message
                }
            }
        },

        logout() {
            this.token = null;
            this.admin = null;
            this.role = null;
            this.users = [];
            this.requests = [];
            this.messages = [];                      // ✅ Clear messages
            this.unreadMessagesCount = 0;            // ✅ Clear unread count
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
            this.messages = [];                      // ✅ Clear messages
            this.unreadMessagesCount = 0;            // ✅ Clear unread count
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
