<template>
  <div class="admin-layout">
    <AdminSidebar />
    <div class="admin-main">
      <AdminHeader />
      <main class="admin-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import AdminSidebar from "./AdminSidebar.vue"
import AdminHeader from "./AdminHeader.vue"
import { useAdminStore } from '../../store/adminStore'

const admin = useAdminStore()

onMounted(() => {
  // Load requests when layout mounts
  admin.loadRequests()

  // Poll for new requests every 30 seconds
  setInterval(() => {
    admin.loadRequests()
  }, 30000)
})
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f8f9fa;
}

.admin-main {
  flex: 1;
  margin-left: 260px;
  display: flex;
  flex-direction: column;
}

.admin-content {
  flex: 1;
  padding: 32px;
}

@media (max-width: 1024px) {
  .admin-main {
    margin-left: 220px;
  }
}

@media (max-width: 768px) {
  .admin-main {
    margin-left: 0;
  }

  .admin-content {
    padding: 20px;
  }
}
</style>
