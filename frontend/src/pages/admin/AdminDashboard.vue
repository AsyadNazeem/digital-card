<template>
  <div class="dashboard-page">

    <!-- ⭐ STATS SECTION -->
    <section class="stats-section">
      <div class="stat-card" v-for="item in statItems" :key="item.label">
        <div class="stat-icon" :class="item.color">{{ item.icon }}</div>
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
        <p>Last 5 users who joined</p>
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
                {{ u.provider === 'google' ? '🔵 Google' : '📧 Local' }}
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
          <span class="empty-icon">👥</span>
          <p>No users found</p>
        </div>

        <div v-else class="user-card" v-for="u in recentUsers" :key="u.id">
          <div class="user-card-header">
            <div class="user-avatar-large">{{ getInitials(u.name) }}</div>
            <div class="user-card-info">
              <h3>{{ u.name }}</h3>
              <span class="provider-badge" :class="u.provider">
                {{ u.provider === 'google' ? '🔵 Google' : '📧 Local' }}
              </span>
            </div>
          </div>
          <div class="user-card-details">
            <div class="detail-row">
              <span class="detail-label">📞 Phone</span>
              <span class="detail-value">{{ u.phone }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">✉️ Email</span>
              <span class="detail-value">{{ u.email }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">📅 Joined</span>
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

const stats = ref({});
const recentUsers = ref([]);

// For mapping stats to icons & colors
const statItems = [
  { key: "total", label: "Total Users", icon: "📈", color: "purple" },
  { key: "today", label: "Today's Signups", icon: "📅", color: "blue" },
  { key: "month", label: "This Month", icon: "📆", color: "green" },
  { key: "active", label: "Active Users", icon: "✅", color: "orange" },
  { key: "google", label: "Google Signups", icon: "🧠", color: "red" },
  { key: "local", label: "Local Signups", icon: "📧", color: "gray" }
];

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
  font-size: 1.8rem;
  color: white;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
  min-width: 0;
}

/* Stat Card Colors */
.purple { background: linear-gradient(135deg, #5c4033, #3e2a23); }
.blue { background: linear-gradient(135deg, #6b5d57, #5c4033); }
.green { background: linear-gradient(135deg, #10b981, #059669); }
.orange { background: linear-gradient(135deg, #d4af37, #b8941f); }
.red { background: linear-gradient(135deg, #ef4444, #dc2626); }
.gray { background: linear-gradient(135deg, #9b8b7e, #6b5d57); }

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
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
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
  font-size: 3rem;
  display: block;
  margin-bottom: 12px;
  opacity: 0.5;
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
    font-size: 1.5rem;
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
    font-size: 1.3rem;
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
