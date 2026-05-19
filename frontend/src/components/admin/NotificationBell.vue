<template>
  <div class="notification-wrapper">
    <button class="icon-btn" @click.stop="toggle" aria-label="Notifications">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
      </svg>
      <span v-if="totalCount > 0" class="notification-badge">{{ displayCount }}</span>
    </button>

    <transition name="dropdown">
      <div v-if="open" class="notifications-dropdown" @click.stop ref="dropdownRef">
        <div class="notifications-header">
          <h3>Notifications</h3>
          <button class="close-dropdown" @click="open = false" aria-label="Close">✕</button>
        </div>

        <div v-if="totalCount === 0" class="notifications-empty">
          <span class="empty-icon">🔕</span>
          <p>No new notifications</p>
        </div>

        <div v-else class="notifications-list" ref="listRef">
          <!-- ✅ MESSAGE NOTIFICATIONS -->
          <div v-for="msg in pendingMessages" :key="`msg-${msg.id}`" class="notification-item message-notification" @click="goToMessages">
            <div class="notification-icon message-icon">💬</div>
            <div class="notification-content">
              <p class="notification-title">New Message</p>
              <p class="notification-desc">
                <strong>{{ msg.senderName }}</strong>
                <span v-if="msg.messageType !== 'contact'" class="message-badge" :class="`badge-${msg.messageType}`">
                  {{ formatMessageType(msg.messageType) }}
                </span>
              </p>
              <p class="notification-preview">{{ msg.subject }}</p>
              <span class="notification-time">{{ formatTimeAgo(msg.createdAt) }}</span>
            </div>
            <div class="unread-indicator" v-if="!msg.isRead"></div>
          </div>

          <!-- ✅ REQUEST NOTIFICATIONS -->
          <div v-for="r in pendingRequests" :key="`req-${r.id}`" class="notification-item request-notification" @click="goToRequests">
            <div class="notification-icon request-icon">📋</div>
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

        <div v-if="totalCount > 0" class="notifications-footer">
          <div class="notification-tabs">
            <button
                v-if="messageCount > 0"
                class="tab-link"
                @click="goToMessages"
            >
              Messages <span v-if="messageCount > 0" class="tab-badge">{{ messageCount }}</span>
            </button>
            <button
                v-if="requestCount > 0"
                class="tab-link"
                @click="goToRequests"
            >
              Requests <span v-if="requestCount > 0" class="tab-badge">{{ requestCount }}</span>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Mobile Overlay -->
    <transition name="overlay-fade">
      <div v-if="open" class="notification-overlay" @click="open = false"></div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue"
import { useRouter } from "vue-router"
import { useAdminStore } from "../../store/adminStore"

const admin = useAdminStore()
const router = useRouter()

const open = ref(false)
const dropdownRef = ref(null)
const listRef = ref(null)
let scrollPosition = 0

// ✅ POLL FOR NEW MESSAGES AND REQUESTS
let pollInterval = null

function startPolling() {
  // Poll every 30 seconds
  pollInterval = setInterval(async () => {
    if (admin.isAuthenticated) {
      await admin.loadUnreadMessages()
      await admin.loadRequests()
    }
  }, 30000)
}

function stopPolling() {
  if (pollInterval) {
    clearInterval(pollInterval)
    pollInterval = null
  }
}

// Mobile scroll lock with improved touch handling
watch(open, (isOpen) => {
  if (window.innerWidth <= 480) {
    if (isOpen) {
      // Store scroll position
      scrollPosition = window.pageYOffset || document.documentElement.scrollTop

      // Lock body scroll
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollPosition}px`
      document.body.style.left = '0'
      document.body.style.right = '0'
      document.body.style.width = '100%'
    } else {
      // Unlock scroll
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      document.body.style.width = ''

      // Restore scroll position
      window.scrollTo(0, scrollPosition)
    }
  }
})

// ✅ COMPUTED PROPERTIES FOR MESSAGES AND REQUESTS

// Unread messages (most recent first)
const pendingMessages = computed(() => {
  return admin.messages
      .filter(m => !m.isRead)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
})

// Pending requests (most recent first)
const pendingRequests = computed(() => {
  return admin.requests
      .filter(r => r.status === "pending")
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
})

// Count unread messages
const messageCount = computed(() => {
  return admin.messages.filter(m => !m.isRead).length
})

// Count pending requests
const requestCount = computed(() => {
  return admin.requests.filter(r => r.status === "pending").length
})

// Total count
const totalCount = computed(() => messageCount.value + requestCount.value)

// Display 99+ for counts over 99
const displayCount = computed(() => totalCount.value > 99 ? '99+' : totalCount.value)

function toggle() {
  open.value = !open.value
}

function goToMessages() {
  open.value = false
  router.push("/admin/messages")
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

// ✅ FORMAT MESSAGE TYPE BADGE
function formatMessageType(type) {
  const typeMap = {
    'contact': '💬 Contact',
    'plan_upgrade': '⬆️ Upgrade',
    'plan_downgrade': '⬇️ Downgrade',
    'support': '🆘 Support'
  }
  return typeMap[type] || type
}

// Close dropdown when clicking outside (desktop only)
function handleClickOutside(event) {
  if (window.innerWidth > 480 && open.value && !event.target.closest('.notification-wrapper')) {
    open.value = false
  }
}

// Close on escape key
function handleEscape(event) {
  if (event.key === 'Escape' && open.value) {
    open.value = false
  }
}

// Improved touch move handler
function preventTouchMove(e) {
  if (window.innerWidth <= 480 && open.value) {
    const dropdown = dropdownRef.value
    const list = listRef.value

    // If dropdown doesn't exist, prevent all scrolling
    if (!dropdown) {
      e.preventDefault()
      return
    }

    // Check if touch is inside the dropdown
    if (!dropdown.contains(e.target)) {
      e.preventDefault()
      return
    }

    // If there's a scrollable list and the touch is inside it
    if (list && list.contains(e.target)) {
      const isScrollable = list.scrollHeight > list.clientHeight

      if (isScrollable) {
        // Check if we're at boundaries
        const scrollTop = list.scrollTop
        const scrollHeight = list.scrollHeight
        const clientHeight = list.clientHeight

        // Get touch direction
        const touch = e.touches[0]
        const deltaY = touch.clientY - (list._lastTouchY || touch.clientY)
        list._lastTouchY = touch.clientY

        // Prevent overscroll at top
        if (scrollTop <= 0 && deltaY > 0) {
          e.preventDefault()
          return
        }

        // Prevent overscroll at bottom
        if (scrollTop + clientHeight >= scrollHeight && deltaY < 0) {
          e.preventDefault()
          return
        }

        // Allow normal scrolling within the list
        return
      }
    }

    // Prevent all other touches
    e.preventDefault()
  }
}

// Reset last touch position on touch end
function handleTouchEnd(e) {
  if (listRef.value) {
    delete listRef.value._lastTouchY
  }
}

// Prevent scroll on wheel events (for mouse users on mobile devices)
function preventWheel(e) {
  if (window.innerWidth <= 480 && open.value) {
    const list = listRef.value

    if (!list || !list.contains(e.target)) {
      e.preventDefault()
      return
    }

    const isScrollable = list.scrollHeight > list.clientHeight
    if (!isScrollable) {
      e.preventDefault()
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscape)
  document.addEventListener('touchmove', preventTouchMove, { passive: false })
  document.addEventListener('touchend', handleTouchEnd, { passive: true })
  document.addEventListener('wheel', preventWheel, { passive: false })

  // ✅ LOAD INITIAL DATA AND START POLLING
  admin.loadUnreadMessages()
  admin.loadRequests()
  startPolling()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscape)
  document.removeEventListener('touchmove', preventTouchMove)
  document.removeEventListener('touchend', handleTouchEnd)
  document.removeEventListener('wheel', preventWheel)

  // ✅ STOP POLLING
  stopPolling()

  // Cleanup scroll lock if component unmounts while open
  if (open.value && window.innerWidth <= 480) {
    document.body.style.overflow = ''
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.left = ''
    document.body.style.right = ''
    document.body.style.width = ''
  }
})
</script>

<style scoped>
.notification-wrapper {
  position: relative;
  z-index: 100;
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
  color: #5c4033;
}

.icon-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  background: #fafaf8;
}

.icon-btn:active {
  transform: scale(0.95);
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ff3b30;
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  50% {
    box-shadow: 0 2px 8px rgba(255, 59, 48, 0.4);
  }
}

.notifications-dropdown {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  width: 420px;
  max-height: 500px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  z-index: 10001;
}

.notification-overlay {
  display: none;
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e1dc;
  background: white;
  position: relative;
  z-index: 1;
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
  background: white;
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
  background: white;
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
  background: white;
  position: relative;
}

.notification-item:hover {
  background: #fafaf8;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-item.message-notification {
  background: #fafaf8;
}

.notification-item.message-notification:hover {
  background: #f5f0eb;
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.notification-icon.message-icon {
  background: rgba(76, 175, 80, 0.2);
  color: #2e7d32;
}

.notification-icon.request-icon {
  background: linear-gradient(135deg, #5c4033 0%, #3e2a23 100%);
  color: white;
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
  margin: 0 0 2px 0;
  line-height: 1.4;
  word-break: break-word;
}

.notification-desc strong {
  color: #5c4033;
  font-weight: 600;
}

.message-badge {
  display: inline-block;
  margin-left: 6px;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 600;
  white-space: nowrap;
}

.badge-plan_upgrade {
  background: #c8e6c9;
  color: #2e7d32;
}

.badge-plan_downgrade {
  background: #ffcccc;
  color: #c62828;
}

.badge-support {
  background: #ffe0b2;
  color: #e65100;
}

.notification-preview {
  font-size: 0.75rem;
  color: #9b8b7e;
  margin: 2px 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.notification-time {
  font-size: 0.75rem;
  color: #9b8b7e;
}

.unread-indicator {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  background: #4caf50;
  border-radius: 50%;
  animation: blink 2s infinite;
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.notifications-footer {
  padding: 0;
  border-top: 1px solid #e5e1dc;
  background: white;
}

.notification-tabs {
  display: flex;
  gap: 0;
}

.tab-link {
  flex: 1;
  padding: 12px 16px;
  background: white;
  border: none;
  border-right: 1px solid #e5e1dc;
  color: #5c4033;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.tab-link:last-child {
  border-right: none;
}

.tab-link:hover {
  background: #fafaf8;
}

.tab-link .tab-badge {
  margin-left: 6px;
  background: #ff3b30;
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 0.7rem;
  min-width: 18px;
  text-align: center;
  display: inline-block;
}

/* Dropdown transitions for desktop */
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

/* Overlay transitions */
.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.3s ease;
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}

/* Tablet Styles */
@media (max-width: 1024px) {
  .notifications-dropdown {
    width: 380px;
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

/* Small Mobile - FULLSCREEN MODE */
@media (max-width: 480px) {
  .notification-overlay {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(45, 31, 26, 0.5);
    backdrop-filter: blur(4px);
    z-index: 10000;
    touch-action: none;
    -webkit-overflow-scrolling: auto;
  }

  .notifications-dropdown {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100vh;
    height: 100dvh;
    max-height: none;
    border-radius: 0;
    display: flex;
    flex-direction: column;
    z-index: 10001;
    overflow: hidden;
    overscroll-behavior: none;
    background: white;
  }

  .dropdown-enter-active {
    transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .dropdown-leave-active {
    transition: transform 0.3s cubic-bezier(0.55, 0.085, 0.68, 0.53);
  }

  .dropdown-enter-from {
    transform: translateY(100%);
  }

  .dropdown-enter-to {
    transform: translateY(0);
  }

  .dropdown-leave-from {
    transform: translateY(0);
  }

  .dropdown-leave-to {
    transform: translateY(100%);
  }

  .notifications-header {
    padding: 16px 20px;
    padding-top: max(16px, env(safe-area-inset-top));
    flex-shrink: 0;
    border-bottom: 1px solid #e5e1dc;
    background: white;
    z-index: 2;
  }

  .notifications-header h3 {
    font-size: 1.125rem;
  }

  .close-dropdown {
    font-size: 1.5rem;
    padding: 8px;
    z-index: 3;
  }

  .notifications-list {
    flex: 1;
    min-height: 0;
    max-height: none;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
    background: white;
    position: relative;
    z-index: 1;
  }

  .notifications-empty {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    overflow: hidden;
    background: white;
    position: relative;
    z-index: 1;
    touch-action: none;
    overscroll-behavior: none;
  }

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 16px;
    opacity: 0.6;
    display: block;
  }

  .notifications-empty p {
    color: #6b5d57;
    font-size: 1rem;
    margin: 0;
  }

  .notification-item {
    padding: 14px 16px;
    background: white;
    position: relative;
    z-index: 1;
  }

  .notification-icon {
    width: 36px;
    height: 36px;
    font-size: 1.125rem;
  }

  .notifications-footer {
    flex-shrink: 0;
    padding: 0;
    background: white;
    border-top: 1px solid #e5e1dc;
    z-index: 2;
  }

  .notification-tabs {
    flex-direction: column;
  }

  .tab-link {
    border-right: none;
    border-bottom: 1px solid #e5e1dc;
    padding: 12px 16px;
  }

  .tab-link:last-child {
    border-bottom: none;
  }
}

/* Very small devices */
@media (max-width: 360px) {
  .notification-item {
    padding: 12px 14px;
    gap: 10px;
  }

  .notification-icon {
    width: 32px;
    height: 32px;
    font-size: 1rem;
  }

  .notification-title {
    font-size: 0.8125rem;
  }

  .notification-desc {
    font-size: 0.75rem;
  }
}
</style>
