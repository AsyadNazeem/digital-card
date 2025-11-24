<!-- ============================================ -->
<!-- FILE 3: frontend/src/components/admin/AdminSidebar.vue (REPLACE) -->
<!-- ============================================ -->

<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="logo">
        <img src="../../assets/images/logo.jpeg" alt="Dashboard Logo" class="header-logo" />
      </div>
    </div>

    <nav class="sidebar-nav">
      <!-- ✅ AUTO-GENERATE navigation from ADMIN_PAGES -->
      <router-link
          v-for="page in visiblePages"
          :key="page.permission"
          :to="`/admin/${page.path}`"
          class="nav-item"
          active-class="active"
      >
        <span class="nav-icon">{{ page.icon }}</span>
        <span>{{ page.name }}</span>

        <!-- Show badge if page has badge config -->
        <span
            v-if="page.showBadge && getBadgeCount(page.showBadge) > 0"
            class="badge"
        >
          {{ getBadgeCount(page.showBadge) }}
        </span>
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <button @click="logout" class="logout-btn">
        <span class="nav-icon">🚪</span>
        <span>Logout</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed } from "vue"
import { useRouter } from "vue-router"
import { useAdminStore } from "@/store/adminStore.js"
import { ADMIN_PAGES } from "@/config/permissionRegistry.js"
import adminApi from "../../services/adminApi.js"

const router = useRouter()
const adminStore = useAdminStore()

// ✅ AUTO-FILTER pages based on permissions
const visiblePages = computed(() => {
  return ADMIN_PAGES.filter(page => {
    // Don't show if hideFromSidebar is true
    if (page.hideFromSidebar) return false

    // Super admin sees everything
    if (adminStore.isSuperAdmin) return true

    // Check if user has permission
    return adminStore.myPermissions.includes(page.permission)
  })
})

// Get badge count from store
const getBadgeCount = (badgeKey) => {
  const counts = {
    pendingRequests: adminStore.pendingRequestsCount || 0,
    // Add more badge counts here if needed
    // activeUsers: adminStore.activeUsersCount || 0,
  }
  return counts[badgeKey] || 0
}

function logout() {
  adminStore.logout()
  delete adminApi.defaults.headers.common["Authorization"]
  router.push("/admin/login")
}
</script>

<style scoped>
.header-logo {
  width: 220px;
}

.sidebar {
  width: 260px;
  background: linear-gradient(180deg, #2d1f1a 0%, #1a1310 100%);
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.15);
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

.sidebar-nav {
  flex: 1;
  padding: 20px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
}

.sidebar-nav::-webkit-scrollbar {
  width: 6px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.nav-item {
  position: relative;
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
  background: linear-gradient(135deg, #5c4033 0%, #3e2a23 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(92, 64, 51, 0.3);
}

.nav-icon {
  font-size: 1.25rem;
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.badge {
  margin-left: auto;
  background: #d4af37;
  color: #2d1f1a;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
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

@media (max-width: 1024px) {
  .sidebar {
    width: 220px;
  }
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
}
</style>
