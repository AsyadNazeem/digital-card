<template>
  <div class="admin-layout">
    <AdminSidebar />
    <div :class="['admin-main', { 'sidebar-collapsed': isCollapsed, 'has-bottom-nav': isMobile }]">
      <AdminHeader />
      <main class="admin-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import AdminSidebar from "./AdminSidebar.vue"
import AdminHeader from "./AdminHeader.vue"
import { useAdminStore } from '@/store/adminStore.js'
import { useSidebar } from '@/composables/useSidebar.js'

const admin = useAdminStore()

// Use the shared sidebar state - this automatically updates when sidebar toggles
const { isCollapsed, isMobile, initialize, cleanup } = useSidebar()

let pollInterval = null          // ✅ ADD THIS - Track the interval
let messageInterval = null       // ✅ ADD THIS - Track messages interval

onMounted(() => {
  admin.initializeAuth()
  admin.loadRequests()
  admin.loadUnreadMessages()     // ✅ ADD THIS - Load unread messages on startup

  // Initialize sidebar state
  initialize()

  // Poll for new requests every 30 seconds
  pollInterval = setInterval(() => {
    admin.loadRequests()
  }, 30000)

  // ✅ ADD THIS BLOCK - Poll for new messages every 30 seconds
  messageInterval = setInterval(() => {
    admin.loadUnreadMessages()
  }, 30000)

  onUnmounted(() => {
    cleanup()
    clearInterval(pollInterval)      // ✅ UPDATED - Use variable
    clearInterval(messageInterval)   // ✅ ADD THIS
  })
})
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #fafaf8;
}

.admin-main {
  flex: 1;
  margin-left: 260px;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 0;
  will-change: margin-left;
}

.admin-main.sidebar-collapsed {
  margin-left: 80px;
}

/* Mobile with bottom navigation */
.admin-main.has-bottom-nav {
  margin-left: 0;
  padding-bottom: calc(70px + env(safe-area-inset-bottom));
}

.admin-content {
  flex: 1;
  padding: 32px;
  overflow-x: auto;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Tablet Styles */
@media (min-width: 769px) and (max-width: 1024px) {
  .admin-main {
    margin-left: 80px;
  }

  .admin-main.sidebar-collapsed {
    margin-left: 80px;
  }

  .admin-content {
    padding: 24px;
  }
}

/* Mobile Styles */
@media (max-width: 768px) {
  .admin-main {
    margin-left: 0;
  }

  .admin-main.sidebar-collapsed {
    margin-left: 0;
  }

  .admin-content {
    padding: 20px 16px;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .admin-content {
    padding: 16px 12px;
  }
}

/* Ensure content doesn't overflow */
@media (max-width: 768px) {
  .admin-layout {
    overflow-x: hidden;
  }
}

/* Force GPU acceleration for smoother transitions */
.admin-main,
.admin-content {
  transform: translateZ(0);
  backface-visibility: hidden;
}
</style>
