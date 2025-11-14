<template>
  <div class="dashboard-page">

    <!-- ⭐ STATS SECTION -->
    <section class="stats-section">
      <div class="stat-card" v-for="item in statItems" :key="item.label">
        <div class="stat-icon" :class="item.color">{{ item.icon }}</div>
        <div>
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

      <table class="recent-table">
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
          <td>{{ u.name }}</td>
          <td>{{ u.phone }}</td>
          <td>{{ u.email }}</td>
          <td>{{ u.provider }}</td>
          <td>{{ formatDate(u.createdAt) }}</td>
        </tr>
        </tbody>

        <tbody v-if="recentUsers.length === 0">
        <tr>
          <td colspan="5" class="empty-row">No users found</td>
        </tr>
        </tbody>
      </table>
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
  transition: 0.2s;
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
}

.purple { background: linear-gradient(135deg,#667eea,#764ba2); }
.blue { background: linear-gradient(135deg,#3b82f6,#2563eb); }
.green { background: linear-gradient(135deg,#10b981,#059669); }
.orange { background: linear-gradient(135deg,#f59e0b,#d97706); }
.red { background: linear-gradient(135deg,#ef4444,#dc2626); }
.gray { background: linear-gradient(135deg,#6b7280,#4b5563); }

.stat-value {
  font-size: 2rem;
  font-weight: 700;
}

.stat-label {
  font-size: 0.9rem;
  color: #6b7280;
}

/* 👤 RECENT USERS SECTION */
.recent-section {
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.section-header {
  margin-bottom: 16px;
}

.section-header h2 {
  font-size: 1.4rem;
  font-weight: 700;
}

.section-header p {
  color: #718096;
  font-size: 0.9rem;
}

/* 📋 RECENT USERS TABLE */
.recent-table {
  width: 100%;
  border-collapse: collapse;
}

.recent-table th {
  text-align: left;
  background: #f8f9fa;
  padding: 14px;
  font-size: 0.85rem;
  color: #4a5568;
}

.recent-table td {
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  color: #2d3748;
}

.empty-row {
  text-align: center;
  padding: 20px;
  color: #718096;
}
</style>
