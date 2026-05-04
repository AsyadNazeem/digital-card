<template>
  <div class="dashboard-page">

    <!-- ⭐ STATS SECTION -->
    <section class="stats-section">
      <div class="stat-card" v-for="item in statItems" :key="item.label">
        <div class="stat-icon" :class="item.color" v-html="getIconSvg(item.icon)"></div>
        <div class="stat-content">
          <div class="stat-value">{{ stats[item.key] || 0 }}</div>
          <div class="stat-label">{{ item.label }}</div>
        </div>
      </div>
    </section>

    <!-- ⭐ RECENT USERS TABLE (5 Most Recent Registrations) -->
    <section class="recent-section">
      <div class="section-header">
        <h2>Recent Registrations</h2>
        <p v-if="adminStore.isSuperAdmin">Last 5 users who joined across all admins</p>
        <p v-else>Last 5 users you registered</p>
      </div>

      <!-- Desktop/Tablet Table View -->
      <div class="table-wrapper">
        <table class="recent-table desktop-table">
          <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Provider</th>
            <th>Joined</th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="u in recentUsers" :key="u.id">
            <td class="user-name">
              <div class="user-avatar">{{ getInitials(u.name) }}</div>
              <span>{{ u.name }}</span>
            </td>
            <td>{{ u.phone }}</td>
            <td class="email-cell">{{ u.email }}</td>
            <td>
              <span class="provider-badge" :class="u.provider">
                <span v-html="getProviderIcon(u.provider)"></span>
                {{ u.provider === 'google' ? 'Google' : 'Local' }}
              </span>
            </td>
            <td class="date-cell">{{ formatDate(u.createdAt) }}</td>
          </tr>
          </tbody>

          <tbody v-if="recentUsers.length === 0">
          <tr>
            <td colspan="5" class="empty-row">No users found</td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Card View -->
      <div class="mobile-cards">
        <div v-if="recentUsers.length === 0" class="empty-state">
          <span class="empty-icon" v-html="getIconSvg('users')"></span>
          <p>No users found</p>
        </div>

        <div v-else class="user-card" v-for="u in recentUsers" :key="u.id">
          <div class="user-card-header">
            <div class="user-avatar-large">{{ getInitials(u.name) }}</div>
            <div class="user-card-info">
              <h3>{{ u.name }}</h3>
              <span class="provider-badge" :class="u.provider">
                <span v-html="getProviderIcon(u.provider)"></span>
                {{ u.provider === 'google' ? 'Google' : 'Local' }}
              </span>
            </div>
          </div>
          <div class="user-card-details">
            <div class="detail-row">
              <span class="detail-label">
                <span v-html="getIconSvg('phone')"></span>
                Phone
              </span>
              <span class="detail-value">{{ u.phone }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">
                <span v-html="getIconSvg('mail')"></span>
                Email
              </span>
              <span class="detail-value">{{ u.email }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">
                <span v-html="getIconSvg('calendar')"></span>
                Joined
              </span>
              <span class="detail-value">{{ formatDate(u.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import adminApi from "../../services/adminApi";
import { useAdminStore } from '@/store/adminStore'
const adminStore = useAdminStore()

const stats = ref({});
const recentUsers = ref([]);

// For mapping stats to icons & colors
const statItems = [
  { key: "total",  label: "Total Users",      icon: "users",      color: "purple" },
  { key: "today",  label: "Today's Signups",  icon: "user-plus",  color: "blue"   },
  { key: "month",  label: "This Month",       icon: "calendar",   color: "green"  },
  { key: "active", label: "Active Users",     icon: "user-check", color: "orange" },
  { key: "google", label: "Google Signups",   icon: "globe",      color: "red"    },
  { key: "apple",  label: "Apple Signups",    icon: "apple",      color: "silver" },
  { key: "local",  label: "Local Signups",    icon: "mail",       color: "gray"   },
];

// Icon SVG mapping function
const getIconSvg = (iconName) => {
  const iconMap = {
    'users': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',

    'user-plus': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>',

    'user-check': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>',

    'calendar': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',

    'globe': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',

    'mail': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',

    'phone': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',

    'log-out': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',

    // Apple logo mark (the  shape via path)
    'apple': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>',
  };
  return iconMap[iconName] || iconMap['users'];
};

// Provider icon helper
const getProviderIcon = (provider) => {
  if (provider === 'google') {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="provider-icon"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>';
  }
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="provider-icon"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>';
};

async function loadStats() {
  try {
    const res = await adminApi.get("/stats/overview");
    stats.value = res.data || {};
  } catch (err) {
    console.error("Failed to load stats", err);
  }
}

async function loadRecentUsers() {
  try {
    const res = await adminApi.get("/users");
    recentUsers.value = res.data.users
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
  } catch (err) {
    console.error("Failed to load users", err);
  }
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function getInitials(name) {
  return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
}

onMounted(() => {
  loadStats();
  loadRecentUsers();
});
</script>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* 📊 STATS SECTION */
.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.stat-icon :deep(svg) {
  width: 24px;
  height: 24px;
  stroke-width: 2.5;
}

.stat-content {
  flex: 1;
  min-width: 0;
}

/* Stat Card Colors */
.purple { background: linear-gradient(135deg, #5c4033, #3e2a23); }
.blue   { background: linear-gradient(135deg, #6b5d57, #5c4033); }
.green  { background: linear-gradient(135deg, #10b981, #059669); }
.orange { background: linear-gradient(135deg, #d4af37, #b8941f); }
.red    { background: linear-gradient(135deg, #ef4444, #dc2626); }
.silver { background: linear-gradient(135deg, #6e6e73, #1c1c1e); }
.gray   { background: linear-gradient(135deg, #9b8b7e, #6b5d57); }

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #2d1f1a;
  line-height: 1.2;
}

.stat-label {
  font-size: 0.9rem;
  color: #6b5d57;
  margin-top: 4px;
}

/* 👤 RECENT USERS SECTION */
.recent-section {
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.section-header {
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #2d1f1a;
  margin: 0 0 4px 0;
}

.section-header p {
  color: #6b5d57;
  font-size: 0.9rem;
  margin: 0;
}

/* 📋 DESKTOP TABLE */
.table-wrapper {
  overflow-x: auto;
  margin: 0 -24px;
  padding: 0 24px;
}

.desktop-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
}

.desktop-table th {
  text-align: left;
  background: #fafaf8;
  padding: 14px 16px;
  font-size: 0.85rem;
  color: #2d1f1a;
  font-weight: 600;
  border-bottom: 2px solid #e5e1dc;
}

.desktop-table td {
  padding: 16px;
  border-bottom: 1px solid #e5e1dc;
  color: #2d1f1a;
  font-size: 0.9rem;
}

.desktop-table tr:last-child td {
  border-bottom: none;
}

.desktop-table tbody tr {
  transition: background 0.2s ease;
}

.desktop-table tbody tr:hover {
  background: #fafaf8;
}

.user-name {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #5c4033, #3e2a23);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  flex-shrink: 0;
}

.email-cell {
  color: #6b5d57;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.date-cell {
  color: #6b5d57;
  font-size: 0.85rem;
  white-space: nowrap;
}

.provider-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
}

.provider-badge :deep(svg) {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
}

.provider-badge.google {
  background: #e3f2fd;
  color: #1976d2;
}

.provider-badge.local {
  background: #f5f5f0;
  color: #6b5d57;
}

.empty-row {
  text-align: center;
  padding: 40px 20px;
  color: #6b5d57;
  font-style: italic;
}

/* 📱 MOBILE CARDS */
.mobile-cards {
  display: none;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
}

.empty-icon {
  display: block;
  margin: 0 auto 12px;
  opacity: 0.3;
  width: 48px;
  height: 48px;
}

.empty-icon :deep(svg) {
  width: 100%;
  height: 100%;
  stroke: #6b5d57;
}

.empty-state p {
  color: #6b5d57;
  font-style: italic;
  margin: 0;
}

.user-card {
  background: #fafaf8;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  transition: all 0.2s ease;
}

.user-card:hover {
  background: #f5f5f0;
  transform: translateX(4px);
}

.user-card:last-child {
  margin-bottom: 0;
}

.user-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e1dc;
}

.user-avatar-large {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #5c4033, #3e2a23);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 700;
  flex-shrink: 0;
}

.user-card-info {
  flex: 1;
  min-width: 0;
}

.user-card-info h3 {
  font-size: 1rem;
  font-weight: 700;
  color: #2d1f1a;
  margin: 0 0 4px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-card-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.detail-label {
  font-size: 0.85rem;
  color: #6b5d57;
  font-weight: 500;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.detail-label :deep(svg) {
  width: 14px;
  height: 14px;
}

.detail-value {
  font-size: 0.85rem;
  color: #2d1f1a;
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Tablet Styles */
@media (max-width: 1024px) {
  .stats-section {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }

  .stat-card {
    padding: 20px;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
  }

  .stat-icon :deep(svg) {
    width: 20px;
    height: 20px;
  }

  .stat-value {
    font-size: 1.75rem;
  }

  .stat-label {
    font-size: 0.85rem;
  }

  .recent-section {
    padding: 20px;
  }

  .section-header h2 {
    font-size: 1.25rem;
  }

  .desktop-table th,
  .desktop-table td {
    padding: 12px;
    font-size: 0.85rem;
  }
}

/* Mobile Styles */
@media (max-width: 768px) {
  .dashboard-page {
    gap: 24px;
  }

  .stats-section {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .stat-card {
    padding: 16px;
    gap: 12px;
  }

  .stat-icon {
    width: 44px;
    height: 44px;
  }

  .stat-icon :deep(svg) {
    width: 18px;
    height: 18px;
  }

  .stat-value {
    font-size: 1.5rem;
  }

  .stat-label {
    font-size: 0.8rem;
  }

  .recent-section {
    padding: 16px;
  }

  .section-header {
    margin-bottom: 16px;
  }

  .section-header h2 {
    font-size: 1.125rem;
  }

  .section-header p {
    font-size: 0.85rem;
  }

  /* Hide desktop table, show mobile cards */
  .table-wrapper,
  .desktop-table {
    display: none;
  }

  .mobile-cards {
    display: block;
  }
}

/* Small Mobile Styles */
@media (max-width: 480px) {
  .stats-section {
    grid-template-columns: 1fr;
  }

  .stat-card {
    padding: 14px;
  }

  .user-card {
    padding: 14px;
  }

  .user-avatar-large {
    width: 44px;
    height: 44px;
    font-size: 0.9rem;
  }

  .detail-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .detail-value {
    text-align: left;
    white-space: normal;
    word-break: break-word;
  }
}

/* Ensure horizontal scrolling works on tablets */
@media (min-width: 769px) and (max-width: 900px) {
  .table-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .desktop-table {
    min-width: 700px;
  }
}
</style>
