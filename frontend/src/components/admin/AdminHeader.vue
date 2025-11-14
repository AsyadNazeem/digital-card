<template>
  <header class="dashboard-header">
    <div>
      <h1 class="page-title">{{ title }}</h1>
      <p class="page-subtitle">Welcome back, Admin</p>
    </div>

    <div class="header-actions">
      <NotificationBell />
      <div class="admin-avatar">👤</div>
    </div>
  </header>
</template>

<script setup>
import { computed } from "vue"
import { useRoute } from "vue-router"
import NotificationBell from "./NotificationBell.vue"

const route = useRoute()

const title = computed(() => {
  switch (route.name) {
    case "AdminDashboard":
      return "Dashboard"
    case "AdminUsers":
      return "Users Management"
    case "AdminRequests":
      return "Limit Requests"
    case "AdminSettings":
      return "Settings"
    default:
      return "Admin Portal"
  }
})
</script>

<style scoped>
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 50;
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

@media (max-width: 768px) {
  .dashboard-header {
    padding: 20px;
  }

  .page-title {
    font-size: 1.5rem;
  }
}
</style>
