the notification palcement is wrong when click bell icon it open some where down in the screen and in side panel when click on requests tab it opens the tab in same page below user managemnt i want it to be in a new page only with top and side navbars


<template>
  <div class="dashboard-wrapper">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <span class="logo-icon">⚡</span>
          <span class="logo-text">Admin Portal</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <a href="#" @click.prevent="activeView = 'dashboard'" :class="['nav-item', { active: activeView === 'dashboard' }]">
          <span class="nav-icon">📊</span>
          <span>Dashboard</span>
        </a>
        <a href="#" @click.prevent="activeView = 'users'" :class="['nav-item', { active: activeView === 'users' }]">
          <span class="nav-icon">👥</span>
          <span>Users</span>
        </a>
        <a href="#" @click.prevent="activeView = 'requests'" :class="['nav-item', { active: activeView === 'requests' }]">
          <span class="nav-icon">📋</span>
          <span>Requests</span>
          <span v-if="pendingRequestsCount > 0" class="badge">{{ pendingRequestsCount }}</span>
        </a>
        <a href="#" @click.prevent="activeView = 'settings'" :class="['nav-item', { active: activeView === 'settings' }]">
          <span class="nav-icon">⚙️</span>
          <span>Settings</span>
        </a>
      </nav>

      <div class="sidebar-footer">
        <button @click="logout" class="logout-btn">
          <span class="nav-icon">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Header -->
      <header class="dashboard-header">
        <div>
          <h1 class="page-title">Dashboard</h1>
          <p class="page-subtitle">Welcome back, Admin</p>
        </div>
        <div class="header-actions">
          <button class="icon-btn" title="Notifications" @click="showNotifications = !showNotifications">
            🔔
            <span v-if="pendingRequestsCount > 0" class="notification-badge">{{ pendingRequestsCount }}</span>
          </button>

          <!-- Notifications Dropdown -->
          <transition name="dropdown">
            <div v-if="showNotifications" class="notifications-dropdown" @click.stop>
              <div class="notifications-header">
                <h3>Notifications</h3>
                <button @click="showNotifications = false" class="close-dropdown">✕</button>
              </div>

              <div v-if="pendingRequestsCount === 0" class="notifications-empty">
                <span class="empty-icon">🔕</span>
                <p>No new notifications</p>
              </div>

              <div v-else class="notifications-list">
                <div
                    v-for="request in recentPendingRequests"
                    :key="request.id"
                    class="notification-item"
                    @click="viewRequest(request)"
                >
                  <div class="notification-icon">📋</div>
                  <div class="notification-content">
                    <p class="notification-title">New Limit Request</p>
                    <p class="notification-desc">
                      {{ request.User?.name }} requested
                      <strong>{{ request.requestedCompanies }} companies</strong> and
                      <strong>{{ request.requestedContacts }} contacts</strong>
                    </p>
                    <span class="notification-time">{{ formatTimeAgo(request.createdAt) }}</span>
                  </div>
                </div>
              </div>

              <div v-if="pendingRequestsCount > 0" class="notifications-footer">
                <button @click="goToRequests" class="view-all-btn">View All Requests</button>
              </div>
            </div>
          </transition>

          <div class="admin-avatar">
            <span>👤</span>
          </div>
        </div>
      </header>

      <!-- Stats Cards -->
      <section class="stats-section">
        <div class="stat-card">
          <div class="stat-icon purple">📈</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.total || 0 }}</div>
            <div class="stat-label">Total Users</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon blue">📅</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.today || 0 }}</div>
            <div class="stat-label">Today's Signups</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon green">📆</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.month || 0 }}</div>
            <div class="stat-label">This Month</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon orange">✅</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.active || 0 }}</div>
            <div class="stat-label">Active Users</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon red">🧠</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.google || 0 }}</div>
            <div class="stat-label">Google Auth Users</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon gray">📧</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.local || 0 }}</div>
            <div class="stat-label">Local Signups</div>
          </div>
        </div>


      </section>

      <!-- Users Table -->
      <section class="table-section">
        <div class="section-header">
          <div>
            <h2 class="section-title">Users Management</h2>
            <p class="section-subtitle">Manage all registered users</p>
          </div>
          <button @click="loadUsers" class="refresh-btn">
            <span class="btn-icon">🔄</span>
            Refresh
          </button>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Provider</th>
              <th>Contact Card</th>
              <th>Actions</th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="u in users" :key="u.id">
              <td>{{ u.id }}</td>
              <td>{{ u.name }}</td>
              <td>{{ u.phone }}</td>
              <td>{{ u.email }}</td>
              <td>{{ u.provider }}</td>
              <td>
                <a
                    :href="`http://localhost:5173/card/${u.phone}`"
                    target="_blank"
                    class="link-btn"
                >
                  🔗 View Card
                </a>
              </td>
              <td>
                <button @click="deleteUser(u)" class="action-btn delete">🗑️</button>
              </td>
            </tr>
            </tbody>
          </table>

          <div v-if="users.length === 0" class="empty-state">
            <div class="empty-icon">📭</div>
            <p>No users found</p>
          </div>
        </div>
      </section>

      <!-- Requests Management Section (NEW) -->
      <section v-if="activeView === 'requests'" class="requests-section">
        <div class="section-header">
          <div>
            <h2 class="section-title">Limit Requests</h2>
            <p class="section-subtitle">Manage user requests for additional limits</p>
          </div>
          <div class="filter-tabs">
            <button
                @click="requestFilter = 'all'"
                :class="['filter-tab', { active: requestFilter === 'all' }]"
            >
              All ({{ allRequests.length }})
            </button>
            <button
                @click="requestFilter = 'pending'"
                :class="['filter-tab', { active: requestFilter === 'pending' }]"
            >
              Pending ({{ pendingRequestsCount }})
            </button>
            <button
                @click="requestFilter = 'approved'"
                :class="['filter-tab', { active: requestFilter === 'approved' }]"
            >
              Approved ({{ approvedRequestsCount }})
            </button>
            <button
                @click="requestFilter = 'rejected'"
                :class="['filter-tab', { active: requestFilter === 'rejected' }]"
            >
              Rejected ({{ rejectedRequestsCount }})
            </button>
          </div>
        </div>

        <!-- Requests Grid -->
        <div v-if="filteredRequests.length > 0" class="requests-grid">
          <div v-for="request in filteredRequests" :key="request.id" class="request-card">
            <!-- Card Header -->
            <div class="request-card-header">
              <div class="request-user-info">
                <div class="request-avatar">
                  {{ request.User?.name?.charAt(0).toUpperCase() || '?' }}
                </div>
                <div>
                  <h3 class="request-user-name">{{ request.User?.name || 'Unknown User' }}</h3>
                  <p class="request-user-email">{{ request.User?.email }}</p>
                </div>
              </div>
              <span :class="['request-status-badge', request.status]">
          <svg v-if="request.status === 'pending'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
          </svg>
          <svg v-else-if="request.status === 'approved'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          {{ request.status }}
        </span>
            </div>

            <!-- Card Body -->
            <div class="request-card-body">
              <!-- Current Limits -->
              <div class="current-limits-info">
                <h4 class="info-title">Current Limits</h4>
                <div class="limits-display">
                  <div class="limit-item">
                    <span class="limit-icon">🏢</span>
                    <span>Companies: <strong>{{ request.User?.companyLimit || 0 }}</strong></span>
                  </div>
                  <div class="limit-item">
                    <span class="limit-icon">👤</span>
                    <span>Contacts: <strong>{{ request.User?.contactLimit || 0 }}</strong></span>
                  </div>
                </div>
              </div>

              <!-- Requested Limits -->
              <div class="requested-limits-info">
                <h4 class="info-title">Requested Additional</h4>
                <div class="limits-display">
                  <div class="limit-item highlight">
                    <span class="limit-icon">🏢</span>
                    <span>+{{ request.requestedCompanies }} companies</span>
                  </div>
                  <div class="limit-item highlight">
                    <span class="limit-icon">👤</span>
                    <span>+{{ request.requestedContacts }} contacts</span>
                  </div>
                </div>
              </div>

              <!-- Reason -->
              <div v-if="request.reason" class="request-reason-box">
                <h4 class="info-title">Reason</h4>
                <p class="reason-text">{{ request.reason }}</p>
              </div>

              <!-- Request Date -->
              <div class="request-meta">
                <span class="meta-label">Requested:</span>
                <span class="meta-value">{{ formatDate(request.createdAt) }}</span>
              </div>
            </div>

            <!-- Card Actions -->
            <div v-if="request.status === 'pending'" class="request-card-actions">
              <button @click="approveRequest(request)" class="action-btn approve" :disabled="processingRequest === request.id">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                {{ processingRequest === request.id ? 'Processing...' : 'Approve' }}
              </button>
              <button @click="rejectRequest(request)" class="action-btn reject" :disabled="processingRequest === request.id">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                Reject
              </button>
            </div>

            <div v-else class="request-processed-info">
              <span class="processed-icon">{{ request.status === 'approved' ? '✅' : '❌' }}</span>
              <span class="processed-text">
          {{ request.status === 'approved' ? 'Request Approved' : 'Request Rejected' }}
        </span>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="requests-empty-state">
          <div class="empty-icon">📭</div>
          <h3>No {{ requestFilter !== 'all' ? requestFilter : '' }} requests found</h3>
          <p>{{ requestFilter === 'pending' ? 'All caught up! No pending requests.' : 'No requests to display.' }}</p>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import adminApi from '../services/adminApi';
import { useRouter } from 'vue-router';

const router = useRouter();
const stats = ref({});
const users = ref([]);
const allRequests = ref([]);
const activeView = ref('dashboard'); // 'dashboard', 'users', 'requests', 'settings'
const requestFilter = ref('all'); // 'all', 'pending', 'approved', 'rejected'
const showNotifications = ref(false);
const processingRequest = ref(null);

// Computed properties
const pendingRequestsCount = computed(() => {
  return allRequests.value.filter(r => r.status === 'pending').length;
});

const approvedRequestsCount = computed(() => {
  return allRequests.value.filter(r => r.status === 'approved').length;
});

const rejectedRequestsCount = computed(() => {
  return allRequests.value.filter(r => r.status === 'rejected').length;
});

const filteredRequests = computed(() => {
  if (requestFilter.value === 'all') return allRequests.value;
  return allRequests.value.filter(r => r.status === requestFilter.value);
});

const recentPendingRequests = computed(() => {
  return allRequests.value
      .filter(r => r.status === 'pending')
      .slice(0, 5); // Show only 5 most recent
});

// Load all requests
async function loadRequests() {
  try {
    const res = await adminApi.get('/requests');
    allRequests.value = res.data.requests || [];
  } catch (err) {
    console.error('Failed to load requests:', err);
  }
}

// Approve request
async function approveRequest(request) {
  if (!confirm(`Approve request for ${request.User?.name}?\n\nThis will add:\n+${request.requestedCompanies} companies\n+${request.requestedContacts} contacts`)) {
    return;
  }

  try {
    processingRequest.value = request.id;
    await adminApi.post(`/request/${request.id}/approve`);

    alert('✅ Request approved successfully!');
    await loadRequests();
    await loadUsers();
    await loadStats();
  } catch (err) {
    console.error('Failed to approve request:', err);
    alert('❌ Failed to approve request: ' + (err.response?.data?.message || err.message));
  } finally {
    processingRequest.value = null;
  }
}

// Reject request
async function rejectRequest(request) {
  const reason = prompt(`Reject request from ${request.User?.name}?\n\nOptional: Enter rejection reason:`);
  if (reason === null) return; // User cancelled

  try {
    processingRequest.value = request.id;
    await adminApi.post(`/request/${request.id}/reject`, { reason });

    alert('Request rejected.');
    await loadRequests();
  } catch (err) {
    console.error('Failed to reject request:', err);
    alert('❌ Failed to reject request: ' + (err.response?.data?.message || err.message));
  } finally {
    processingRequest.value = null;
  }
}

// View specific request (from notification)
function viewRequest(request) {
  showNotifications.value = false;
  activeView.value = 'requests';
  requestFilter.value = 'pending';
}

// Go to requests page
function goToRequests() {
  showNotifications.value = false;
  activeView.value = 'requests';
  requestFilter.value = 'pending';
}

// Format time ago
function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Close notifications when clicking outside
function handleClickOutside(event) {
  if (showNotifications.value && !event.target.closest('.icon-btn') && !event.target.closest('.notifications-dropdown')) {
    showNotifications.value = false;
  }
}

async function loadStats() {
  try {
    const res = await adminApi.get("/stats/overview");
    stats.value = res.data;
  } catch (err) {
    console.error('Failed to load stats:', err);
  }
}

async function loadUsers() {
  try {
    const res = await adminApi.get('/users');
    users.value = res.data.users;
  } catch (err) {
    console.error('Failed to load users:', err);
  }
}

async function toggleStatus(u) {
  try {
    await adminApi.patch(`/user/${u.id}/status`);
    loadUsers();
    loadStats();
  } catch (err) {
    console.error('Failed to toggle status:', err);
    alert('Failed to update user status');
  }
}

async function deleteUser(u) {
  if (!confirm(`Are you sure you want to delete user "${u.name}"?`)) return;

  try {
    await adminApi.delete(`/user/${u.id}`);
    loadUsers();
    loadStats();
  } catch (err) {
    console.error('Failed to delete user:', err);
    alert('Failed to delete user');
  }
}

function logout() {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminUser");
  delete adminApi.defaults.headers.common["Authorization"];
  router.push("/admin/login");
}

onMounted(() => {
  loadStats();
  loadUsers();
  loadRequests();

  // Poll for new requests every 30 seconds
  setInterval(loadRequests, 30000);

  // Add click listener for closing notifications
  document.addEventListener('click', handleClickOutside);
});

</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.dashboard-wrapper {
  display: flex;
  min-height: 100vh;
  background: #f8f9fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* Sidebar */
.sidebar {
  width: 260px;
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.sidebar-header {
  padding: 24px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
}

.sidebar-nav {
  flex: 1;
  padding: 20px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: 500;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: white;
}

.nav-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.nav-icon {
  font-size: 1.25rem;
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-footer {
  padding: 20px 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 10px;
  color: #ef4444;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
  font-size: 1rem;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  transform: translateX(4px);
}

/* Main Content */
.main-content {
  flex: 1;
  margin-left: 260px;
  padding: 32px;
  min-height: 100vh;
}

/* Header */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 4px;
}

.page-subtitle {
  font-size: 0.95rem;
  color: #718096;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon-btn {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: none;
  background: white;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.icon-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.admin-avatar {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

/* Stats Section */
.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  flex-shrink: 0;
}

.stat-icon.purple {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.blue {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.stat-icon.green {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.stat-icon.orange {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.875rem;
  color: #718096;
  font-weight: 500;
}

/* Table Section */
.table-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 4px;
}

.section-subtitle {
  font-size: 0.875rem;
  color: #718096;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
  font-size: 0.9rem;
}

.refresh-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-icon {
  font-size: 1rem;
}

/* Table */
.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead {
  background: #f8f9fa;
  border-radius: 10px;
}

.data-table th {
  padding: 14px 16px;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.data-table tbody tr {
  border-bottom: 1px solid #e2e8f0;
  transition: background 0.2s ease;
}

.data-table tbody tr:hover {
  background: #f8f9fa;
}

.data-table td {
  padding: 16px;
  font-size: 0.95rem;
  color: #2d3748;
}

.cell-id {
  font-weight: 600;
  color: #718096;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.active {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.inactive {
  background: #fee2e2;
  color: #991b1b;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn.toggle {
  background: #dbeafe;
  color: #1e40af;
}

.action-btn.toggle:hover {
  background: #bfdbfe;
  transform: scale(1.1);
}

.action-btn.delete {
  background: #fee2e2;
  color: #991b1b;
}

.action-btn.delete:hover {
  background: #fecaca;
  transform: scale(1.1);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #718096;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 16px;
  opacity: 0.5;
}

/* Responsive */
@media (max-width: 1024px) {
  .sidebar {
    width: 220px;
  }

  .main-content {
    margin-left: 220px;
  }
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .main-content {
    margin-left: 0;
    padding: 20px;
  }

  .stats-section {
    grid-template-columns: repeat(2, 1fr);
  }

  .page-title {
    font-size: 1.5rem;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .data-table {
    font-size: 0.875rem;
  }

  .data-table th,
  .data-table td {
    padding: 10px;
  }
}

@media (max-width: 480px) {
  .stats-section {
    grid-template-columns: 1fr;
  }

  .stat-card {
    padding: 20px;
  }

  .table-section {
    padding: 16px;
  }
}

/* Badge */
.badge {
  position: absolute;
  top: 8px;
  right: 12px;
  background: #ef4444;
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.nav-item {
  position: relative;
}

/* Notification Bell */
.icon-btn {
  position: relative;
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ef4444;
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

/* Notifications Dropdown */
.notifications-dropdown {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  width: 380px;
  max-height: 500px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  z-index: 1000;
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
}

.notifications-header h3 {
  font-size: 1rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
}

.close-dropdown {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #718096;
  cursor: pointer;
  padding: 4px;
  line-height: 1;
}

.close-dropdown:hover {
  color: #1a202c;
}

.notifications-empty {
  padding: 40px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 8px;
  opacity: 0.5;
}

.notifications-empty p {
  color: #718096;
  font-size: 0.875rem;
}

.notifications-list {
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: background 0.2s ease;
}

.notification-item:hover {
  background: #f8fafc;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 4px 0;
}

.notification-desc {
  font-size: 0.8125rem;
  color: #64748b;
  margin: 0 0 4px 0;
  line-height: 1.4;
}

.notification-desc strong {
  color: #4f46e5;
  font-weight: 600;
}

.notification-time {
  font-size: 0.75rem;
  color: #94a3b8;
}

.notifications-footer {
  padding: 12px 20px;
  border-top: 1px solid #e2e8f0;
}

.view-all-btn {
  width: 100%;
  padding: 8px;
  background: #f8fafc;
  border: none;
  border-radius: 8px;
  color: #4f46e5;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-all-btn:hover {
  background: #eef2ff;
}

/* Dropdown Animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

/* Filter Tabs */
.filter-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-tab {
  padding: 8px 16px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  color: #64748b;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-tab:hover {
  border-color: #cbd5e1;
  color: #1a202c;
}

.filter-tab.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: white;
}

/* Requests Section */
.requests-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.requests-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 20px;
  margin-top: 24px;
}

.request-card {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.request-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.request-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
}

.request-user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.request-avatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.25rem;
}

.request-user-name {
  font-size: 1rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 2px 0;
}

.request-user-email {
  font-size: 0.875rem;
  color: #718096;
  margin: 0;
}

.request-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: capitalize;
}

.request-status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.request-status-badge.approved {
  background: #d1fae5;
  color: #065f46;
}

.request-status-badge.rejected {
  background: #fee2e2;
  color: #991b1b;
}

.request-card-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 8px 0;
}

.limits-display {
  display: flex;
  gap: 12px;
}

.limit-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 10px;
  font-size: 0.875rem;
  color: #475569;
}

.limit-item.highlight {
  background: #eef2ff;
  color: #4f46e5;
  font-weight: 600;
  border: 2px solid #c7d2fe;
}

.limit-icon {
  font-size: 1.25rem;
}

.request-reason-box {
  padding: 12px;
  background: #fffbeb;
  border: 1px solid #fef08a;
  border-radius: 10px;
}

.reason-text {
  font-size: 0.875rem;
  color: #713f12;
  margin: 0;
  line-height: 1.5;
}

.request-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8125rem;
  padding-top: 8px;
  border-top: 1px solid #f1f5f9;
}

.meta-label {
  color: #94a3b8;
  font-weight: 500;
}

.meta-value {
  color: #475569;
  font-weight: 600;
}

.request-card-actions {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  background: #f8fafc;
  border-top: 2px solid #e2e8f0;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
}

.action-btn.approve {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.action-btn.approve:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.action-btn.reject {
  background: #fee2e2;
  color: #991b1b;
}

.action-btn.reject:hover:not(:disabled) {
  background: #fecaca;
  transform: translateY(-2px);
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.request-processed-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 20px;
  background: #f8fafc;
  border-top: 2px solid #e2e8f0;
  color: #64748b;
  font-weight: 600;
  font-size: 0.875rem;
}

.processed-icon {
  font-size: 1.25rem;
}

/* Requests Empty State */
.requests-empty-state {
  text-align: center;
  padding: 80px 20px;
}

.requests-empty-state .empty-icon {
  font-size: 5rem;
  margin-bottom: 16px;
  opacity: 0.5;
}

.requests-empty-state h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 8px 0;
}

.requests-empty-state p {
  color: #718096;
  font-size: 0.95rem;
}

.stat-icon.red {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.stat-icon.gray {
  background: linear-gradient(135deg, #64748b 0%, #475569 100%);
}

.link-btn {
  color: #4f46e5;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.link-btn:hover {
  color: #4338ca;
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 1024px) {
  .requests-grid {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }

  .notifications-dropdown {
    width: 340px;
  }
}

@media (max-width: 768px) {
  .requests-grid {
    grid-template-columns: 1fr;
  }

  .filter-tabs {
    width: 100%;
  }

  .filter-tab {
    flex: 1;
    text-align: center;
  }

  .notifications-dropdown {
    width: 300px;
    right: -20px;
  }

  .request-card-actions {
    flex-direction: column;
  }
}
</style>
