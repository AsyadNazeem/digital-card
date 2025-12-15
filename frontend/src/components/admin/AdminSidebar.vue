<template>
  <!-- Desktop/Tablet Sidebar -->
  <aside
      v-if="!isMobile"
      :class="['sidebar', { collapsed: isCollapsed }]"
  >
    <div class="sidebar-content">
      <div class="sidebar-header">
        <div class="logo">
          <img
              v-if="!isCollapsed"
              src="../../assets/images/logo.jpeg"
              alt="Dashboard Logo"
              class="header-logo"
          />
          <div v-else class="logo-icon">📊</div>
        </div>

        <button
            @click="toggleSidebar"
            class="toggle-btn desktop-toggle"
            :title="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        >
          <span class="toggle-icon">{{ isCollapsed ? '→' : '←' }}</span>
        </button>
      </div>

      <nav class="sidebar-nav">
        <router-link
            v-for="page in visiblePages"
            :key="page.permission"
            :to="`/admin/${page.path}`"
            class="nav-item"
            active-class="active"
        >
          <span class="nav-icon" :title="isCollapsed ? page.name : ''">{{ page.icon }}</span>
          <span v-if="!isCollapsed" class="nav-text">{{ page.name }}</span>

          <span
              v-if="!isCollapsed && page.showBadge && getBadgeCount(page.showBadge) > 0"
              class="badge"
          >
            {{ getBadgeCount(page.showBadge) }}
          </span>

          <span
              v-if="isCollapsed && page.showBadge && getBadgeCount(page.showBadge) > 0"
              class="badge-dot"
          ></span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <button @click="logout" class="logout-btn" :title="isCollapsed ? 'Logout' : ''">
          <span class="nav-icon">🚪</span>
          <span v-if="!isCollapsed">Logout</span>
        </button>
      </div>
    </div>
  </aside>

  <!-- Mobile Bottom Navigation -->
  <nav v-else class="mobile-bottom-nav">
    <!-- First 4 main navigation items -->
    <router-link
        v-for="page in mainNavItems"
        :key="page.permission"
        :to="`/admin/${page.path}`"
        class="bottom-nav-item"
        active-class="active"
    >
      <div class="nav-icon-wrapper">
        <span class="nav-icon">{{ page.icon }}</span>
        <span
            v-if="page.showBadge && getBadgeCount(page.showBadge) > 0"
            class="nav-badge-dot"
        ></span>
      </div>
      <span class="nav-label">{{ page.name }}</span>
    </router-link>

    <!-- More menu button (5th position) -->
    <button
        @click="toggleMoreMenu"
        class="bottom-nav-item more-btn"
        :class="{ active: moreMenuOpen }"
    >
      <div class="nav-icon-wrapper">
        <span class="nav-icon">☰</span>
        <span
            v-if="hasMoreNotifications"
            class="nav-badge-dot"
        ></span>
      </div>
      <span class="nav-label">More</span>
    </button>

    <!-- More Menu Dropdown (slides up from bottom) -->
    <transition name="slide-up">
      <div v-if="moreMenuOpen" class="more-menu-overlay" @click="closeMoreMenu">
        <div class="more-menu-content" @click.stop>
          <div class="more-menu-header">
            <h3>More Options</h3>
            <button @click="closeMoreMenu" class="close-btn">✕</button>
          </div>

          <div class="more-menu-items">
            <router-link
                v-for="page in moreNavItems"
                :key="page.permission"
                :to="`/admin/${page.path}`"
                class="more-menu-item"
                active-class="active"
                @click="closeMoreMenu"
            >
              <span class="nav-icon">{{ page.icon }}</span>
              <span class="nav-text">{{ page.name }}</span>
              <span
                  v-if="page.showBadge && getBadgeCount(page.showBadge) > 0"
                  class="badge"
              >
                {{ getBadgeCount(page.showBadge) }}
              </span>
            </router-link>

            <button @click="handleLogout" class="more-menu-item logout-item">
              <span class="nav-icon">🚪</span>
              <span class="nav-text">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue"
import { useRouter } from "vue-router"
import { useAdminStore } from "@/store/adminStore.js"
import { ADMIN_PAGES } from "@/config/permissionRegistry.js"
import { useSidebar } from "@/composables/useSidebar.js"
import adminApi from "../../services/adminApi.js"

const router = useRouter()
const adminStore = useAdminStore()

// Use the shared sidebar state
const { isCollapsed, isMobile, toggleSidebar, initialize, cleanup } = useSidebar()

const moreMenuOpen = ref(false)

onMounted(() => {
  initialize()
})

onUnmounted(() => {
  cleanup()
})

const toggleMoreMenu = () => {
  moreMenuOpen.value = !moreMenuOpen.value
}

const closeMoreMenu = () => {
  moreMenuOpen.value = false
}

// Filter visible pages
const visiblePages = computed(() => {
  return ADMIN_PAGES.filter(page => {
    if (page.hideFromSidebar) return false
    if (adminStore.isSuperAdmin) return true
    return adminStore.myPermissions.includes(page.permission)
  })
})

// First 4 items for bottom nav
const mainNavItems = computed(() => visiblePages.value.slice(0, 4))

// Remaining items for "More" menu
const moreNavItems = computed(() => visiblePages.value.slice(4))

// Check if any "more" items have notifications
const hasMoreNotifications = computed(() => {
  return moreNavItems.value.some(page =>
      page.showBadge && getBadgeCount(page.showBadge) > 0
  )
})

const getBadgeCount = (badgeKey) => {
  const counts = {
    pendingRequests: adminStore.pendingRequestsCount || 0,
  }
  return counts[badgeKey] || 0
}

function logout() {
  adminStore.logout()
  delete adminApi.defaults.headers.common["Authorization"]
  router.push("/admin/login")
}

function handleLogout() {
  closeMoreMenu()
  logout()
}
</script>

<style scoped>
/* Desktop Sidebar Styles */
.sidebar {
  width: 260px;
  background: linear-gradient(180deg, #2d1f1a 0%, #1a1310 100%);
  color: white;
  position: fixed;
  height: 100vh;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.15);
  z-index: 100;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.sidebar-header {
  position: relative;
  padding: 24px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 88px;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.header-logo {
  width: 180px;
  transition: opacity 0.2s ease;
}

.logo-icon {
  font-size: 2rem;
}

.toggle-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.toggle-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: scale(1.05);
}

.collapsed .toggle-btn {
  position: absolute;
  right: 8px;
  top: 28px;
}

.sidebar-nav {
  flex: 1;
  padding: 20px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  overflow-x: hidden;
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
  white-space: nowrap;
}

.collapsed .nav-item {
  justify-content: center;
  padding: 12px;
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

.nav-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.collapsed .nav-text {
  display: none;
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

.badge-dot {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  background: #d4af37;
  border-radius: 50%;
  border: 2px solid #2d1f1a;
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
  white-space: nowrap;
}

.collapsed .logout-btn {
  justify-content: center;
  padding: 12px;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  transform: translateX(4px);
}

.collapsed .logout-btn:hover {
  transform: scale(1.05);
}

/* Mobile Bottom Navigation */
.mobile-bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 8px 8px calc(8px + env(safe-area-inset-bottom));
  box-shadow: 0 -2px 16px rgba(0, 0, 0, 0.1);
  z-index: 100;
  border-top: 1px solid #e5e1dc;
}

.bottom-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border-radius: 12px;
  text-decoration: none;
  color: #6b5d57;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  background: none;
  font-family: inherit;
  flex: 1;
  max-width: 80px;
}

.bottom-nav-item.active {
  color: #5c4033;
  background: #fafaf8;
}

.bottom-nav-item .nav-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bottom-nav-item .nav-icon {
  font-size: 1.5rem;
  width: auto;
}

.bottom-nav-item.active .nav-icon {
  transform: scale(1.1);
}

.bottom-nav-item .nav-label {
  font-size: 0.7rem;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

.nav-badge-dot {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  background: #d4af37;
  border-radius: 50%;
  border: 2px solid white;
}

/* More Menu Overlay */
.more-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 200;
  display: flex;
  align-items: flex-end;
}

.more-menu-content {
  background: white;
  width: 100%;
  max-height: 60vh;
  border-radius: 24px 24px 0 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.more-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e1dc;
}

.more-menu-header h3 {
  font-size: 1.125rem;
  font-weight: 700;
  color: #2d1f1a;
  margin: 0;
}

.close-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: #fafaf8;
  color: #6b5d57;
  font-size: 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #f5f5f0;
  color: #2d1f1a;
}

.more-menu-items {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.more-menu-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border-radius: 12px;
  text-decoration: none;
  color: #2d1f1a;
  transition: all 0.2s ease;
  margin-bottom: 4px;
  border: none;
  background: none;
  width: 100%;
  font-family: inherit;
  font-size: 1rem;
  cursor: pointer;
  text-align: left;
}

.more-menu-item:hover {
  background: #fafaf8;
}

.more-menu-item.active {
  background: linear-gradient(135deg, #5c4033 0%, #3e2a23 100%);
  color: white;
}

.more-menu-item .nav-icon {
  font-size: 1.5rem;
}

.more-menu-item .nav-text {
  flex: 1;
  font-weight: 500;
}

.more-menu-item .badge {
  margin-left: auto;
}

.logout-item {
  color: #ef4444;
  font-weight: 600;
  margin-top: 8px;
}

.logout-item:hover {
  background: rgba(239, 68, 68, 0.1);
}

/* Slide up animation */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from .more-menu-content,
.slide-up-leave-to .more-menu-content {
  transform: translateY(100%);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
}

/* Tablet Styles */
@media (min-width: 769px) and (max-width: 1024px) {
  .sidebar {
    width: 80px;
  }
}
</style>
