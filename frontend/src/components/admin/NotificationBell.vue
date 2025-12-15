<template>
  <div class="notification-wrapper">
    <button class="icon-btn" @click.stop="toggle" aria-label="Notifications">
      🔔
      <span v-if="count > 0" class="notification-badge">{{ displayCount }}</span>
    </button>

    <transition name="dropdown">
      <div v-if="open" class="notifications-dropdown" @click.stop>
        <div class="notifications-header">
          <h3>Notifications</h3>
          <button class="close-dropdown" @click="open = false" aria-label="Close">✕</button>
        </div>

        <div v-if="count === 0" class="notifications-empty">
          <span class="empty-icon">🔕</span>
          <p>No new notifications</p>
        </div>

        <div v-else class="notifications-list">
          <div
              v-for="r in pending"
              :key="r.id"
              class="notification-item"
              @click="goToRequests"
          >
            <div class="notification-icon">📋</div>
            <div class="notification-content">
              <p class="notification-title">New Limit Request</p>
              <p class="notification-desc">
                {{ r.User?.name }} requested
                <strong>{{ r.requestedCompanies }} companies</strong> and
                <strong>{{ r.requestedContacts }} contacts</strong>
              </p>
              <span class="notification-time">{{ formatTimeAgo(r.createdAt) }}</span>
            </div>
          </div>
        </div>

        <div v-if="count > 0" class="notifications-footer">
          <button class="view-all-btn" @click="goToRequests">
            View All Requests
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue"
import { useRouter } from "vue-router"
import { useAdminStore } from "../../store/adminStore"

const admin = useAdminStore()
const router = useRouter()

const open = ref(false)

const count = computed(() => admin.requests.filter(r => r.status === "pending").length)
const pending = computed(() => admin.requests.filter(r => r.status === "pending").slice(0, 5))

// Display 99+ for counts over 99
const displayCount = computed(() => count.value > 99 ? '99+' : count.value)

function toggle() {
  open.value = !open.value
}

function goToRequests() {
  open.value = false
  router.push("/admin/requests")
}

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

// Close dropdown when clicking outside
function handleClickOutside(event) {
  if (open.value && !event.target.closest('.notification-wrapper')) {
    open.value = false
  }
}

// Close on escape key
function handleEscape(event) {
  if (event.key === 'Escape' && open.value) {
    open.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
.notification-wrapper {
  position: relative;
}

.icon-btn {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: none;
  background: white;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.icon-btn:active {
  transform: scale(0.95);
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #d4af37;
  color: #2d1f1a;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

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
  border-bottom: 1px solid #e5e1dc;
}

.notifications-header h3 {
  font-size: 1rem;
  font-weight: 700;
  color: #2d1f1a;
  margin: 0;
}

.close-dropdown {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #9b8b7e;
  cursor: pointer;
  padding: 4px;
  line-height: 1;
  transition: color 0.2s ease;
}

.close-dropdown:hover {
  color: #2d1f1a;
}

.notifications-empty {
  padding: 40px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 8px;
  opacity: 0.5;
  display: block;
}

.notifications-empty p {
  color: #6b5d57;
  font-size: 0.875rem;
  margin: 0;
}

.notifications-list {
  max-height: 400px;
  overflow-y: auto;
}

.notifications-list::-webkit-scrollbar {
  width: 6px;
}

.notifications-list::-webkit-scrollbar-track {
  background: #f5f5f0;
}

.notifications-list::-webkit-scrollbar-thumb {
  background: #d4af37;
  border-radius: 3px;
}

.notification-item {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid #f5f5f0;
  cursor: pointer;
  transition: background 0.2s ease;
}

.notification-item:hover {
  background: #fafaf8;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #5c4033 0%, #3e2a23 100%);
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
  color: #2d1f1a;
  margin: 0 0 4px 0;
}

.notification-desc {
  font-size: 0.8125rem;
  color: #6b5d57;
  margin: 0 0 4px 0;
  line-height: 1.4;
  word-break: break-word;
}

.notification-desc strong {
  color: #5c4033;
  font-weight: 600;
}

.notification-time {
  font-size: 0.75rem;
  color: #9b8b7e;
}

.notifications-footer {
  padding: 12px 20px;
  border-top: 1px solid #e5e1dc;
}

.view-all-btn {
  width: 100%;
  padding: 8px;
  background: #fafaf8;
  border: none;
  border-radius: 8px;
  color: #5c4033;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-all-btn:hover {
  background: #f5e6d3;
}

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

/* Tablet Styles */
@media (max-width: 1024px) {
  .notifications-dropdown {
    width: 340px;
  }
}

/* Mobile Styles */
@media (max-width: 768px) {
  .icon-btn {
    width: 40px;
    height: 40px;
    font-size: 1.125rem;
  }

  .notifications-dropdown {
    width: 320px;
    right: -10px;
    max-height: 450px;
  }

  .notification-desc {
    font-size: 0.8rem;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .notifications-dropdown {
    position: fixed;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    max-height: 70vh;
    border-radius: 16px 16px 0 0;
  }

  .notification-item {
    padding: 14px 16px;
  }

  .notification-icon {
    width: 36px;
    height: 36px;
    font-size: 1.125rem;
  }
}
</style>
