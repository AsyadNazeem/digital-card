<template>
  <div class="notification-wrapper">
    <button
        class="icon-button notification-btn"
        title="Notifications"
        @click.stop="toggleNotifications"
        :class="{ 'dark-mode': isDarkMode }"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
      </svg>
      <span v-if="notificationCount > 0" class="notification-badge">{{ displayCount }}</span>
    </button>

    <!-- Notification Dropdown -->
    <transition name="dropdown">
      <div
          v-if="showNotifications"
          class="notifications-dropdown"
          :class="{ 'dark-mode': isDarkMode }"
          @click.stop
          ref="dropdownRef"
      >
        <div class="notifications-header">
          <h3>Notifications</h3>
          <button class="close-dropdown" @click="showNotifications = false" aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div v-if="notificationCount === 0" class="notifications-empty">
          <span class="empty-icon">🔕</span>
          <p>No new notifications</p>
        </div>

        <div v-else class="notifications-list" ref="listRef">
          <div
              v-for="notification in notifications"
              :key="notification.id"
              class="notification-item"
              @click="handleNotificationClick(notification)"
          >
            <div class="notification-icon">
              {{ notification.icon || '📋' }}
            </div>
            <div class="notification-content">
              <p class="notification-title">{{ notification.title }}</p>
              <p class="notification-desc" v-html="notification.description"></p>
              <span class="notification-time">{{ formatTimeAgo(notification.createdAt) }}</span>
            </div>
          </div>
        </div>

        <div v-if="notificationCount > 0" class="notifications-footer">
          <button class="view-all-btn" @click="handleViewAll">
            View All Notifications
          </button>
        </div>
      </div>
    </transition>

    <!-- Mobile Overlay -->
    <transition name="overlay-fade">
      <div v-if="showNotifications" class="notification-overlay" @click="showNotifications = false"></div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, inject } from 'vue';

// Props
const props = defineProps({
  notifications: {
    type: Array,
    default: () => []
  }
});

// Emits
const emit = defineEmits(['notification-click', 'view-all-notifications']);

// Inject dark mode state
const isDarkMode = inject('isDarkMode', ref(false));

// State
const showNotifications = ref(false);
const dropdownRef = ref(null);
const listRef = ref(null);
let scrollPosition = 0;

// Computed
const notificationCount = computed(() => props.notifications.length);
const displayCount = computed(() => notificationCount.value > 99 ? '99+' : notificationCount.value);

// Mobile scroll lock
watch(showNotifications, (isOpen) => {
  if (window.innerWidth <= 480) {
    if (isOpen) {
      scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPosition}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollPosition);
    }
  }
});

// Methods
function toggleNotifications() {
  showNotifications.value = !showNotifications.value;
}

function handleNotificationClick(notification) {
  showNotifications.value = false;
  emit('notification-click', notification);
}

function handleViewAll() {
  showNotifications.value = false;
  emit('view-all-notifications');
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

// Close dropdown when clicking outside (desktop only)
function handleClickOutside(event) {
  if (window.innerWidth > 480 && showNotifications.value && !event.target.closest('.notification-wrapper')) {
    showNotifications.value = false;
  }
}

// Close on escape key
function handleEscape(event) {
  if (event.key === 'Escape' && showNotifications.value) {
    showNotifications.value = false;
  }
}

// Prevent touch move
function preventTouchMove(e) {
  if (window.innerWidth <= 480 && showNotifications.value) {
    const dropdown = dropdownRef.value;
    const list = listRef.value;

    if (!dropdown) {
      e.preventDefault();
      return;
    }

    if (!dropdown.contains(e.target)) {
      e.preventDefault();
      return;
    }

    if (list && list.contains(e.target)) {
      const isScrollable = list.scrollHeight > list.clientHeight;

      if (isScrollable) {
        const scrollTop = list.scrollTop;
        const scrollHeight = list.scrollHeight;
        const clientHeight = list.clientHeight;

        const touch = e.touches[0];
        const deltaY = touch.clientY - (list._lastTouchY || touch.clientY);
        list._lastTouchY = touch.clientY;

        if (scrollTop <= 0 && deltaY > 0) {
          e.preventDefault();
          return;
        }

        if (scrollTop + clientHeight >= scrollHeight && deltaY < 0) {
          e.preventDefault();
          return;
        }

        return;
      }
    }

    e.preventDefault();
  }
}

function handleTouchEnd() {
  if (listRef.value) {
    delete listRef.value._lastTouchY;
  }
}

function preventWheel(e) {
  if (window.innerWidth <= 480 && showNotifications.value) {
    const list = listRef.value;

    if (!list || !list.contains(e.target)) {
      e.preventDefault();
      return;
    }

    const isScrollable = list.scrollHeight > list.clientHeight;
    if (!isScrollable) {
      e.preventDefault();
    }
  }
}

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', handleEscape);
  document.addEventListener('touchmove', preventTouchMove, { passive: false });
  document.addEventListener('touchend', handleTouchEnd, { passive: true });
  document.addEventListener('wheel', preventWheel, { passive: false });
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', handleEscape);
  document.removeEventListener('touchmove', preventTouchMove);
  document.removeEventListener('touchend', handleTouchEnd);
  document.removeEventListener('wheel', preventWheel);

  // Cleanup scroll lock if component unmounts while open
  if (showNotifications.value && window.innerWidth <= 480) {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
  }
});
</script>

<style scoped>
/* Notification Wrapper */
.notification-wrapper {
  position: relative;
  z-index: 1000;
}

.icon-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  color: #6B4423;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
}

.icon-button:hover {
  background: #f3f4f6;
  color: #8B5A3C;
}

.icon-button.dark-mode {
  color: #D4A574;
}

.icon-button.dark-mode:hover {
  background: #2d2640;
  color: #E5C4A0;
}

.notification-btn {
  position: relative;
}

.notification-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  min-width: 18px;
  height: 18px;
  background: #ef4444;
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 4px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Notification Overlay */
.notification-overlay {
  display: none;
}

/* Notifications Dropdown */
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
  z-index: 10001;
}

.notifications-dropdown.dark-mode {
  background: #1a1626;
  border: 1px solid #2d2640;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  background: white;
  position: relative;
  z-index: 1;
}

.dark-mode .notifications-header {
  background: #0f0d1a;
  border-bottom: 1px solid #2d2640;
}

.notifications-header h3 {
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.dark-mode .notifications-header h3 {
  color: #e5e7eb;
}

.close-dropdown {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  line-height: 1;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-dropdown:hover {
  color: #1f2937;
}

.dark-mode .close-dropdown {
  color: #9ca3af;
}

.dark-mode .close-dropdown:hover {
  color: #e5e7eb;
}

.notifications-empty {
  padding: 40px 20px;
  text-align: center;
  background: white;
}

.dark-mode .notifications-empty {
  background: #1a1626;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 8px;
  opacity: 0.5;
  display: block;
}

.notifications-empty p {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
}

.dark-mode .notifications-empty p {
  color: #9ca3af;
}

.notifications-list {
  max-height: 400px;
  overflow-y: auto;
  background: white;
}

.dark-mode .notifications-list {
  background: #1a1626;
}

.notifications-list::-webkit-scrollbar {
  width: 6px;
}

.notifications-list::-webkit-scrollbar-track {
  background: #f5f5f0;
}

.dark-mode .notifications-list::-webkit-scrollbar-track {
  background: #0f0d1a;
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
}

.dark-mode .notification-item {
  background: #1a1626;
  border-bottom: 1px solid #2d2640;
}

.notification-item:hover {
  background: #fafaf8;
}

.dark-mode .notification-item:hover {
  background: #2d2640;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #8B5A3C 0%, #6B4423 100%);
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
  color: #1f2937;
  margin: 0 0 4px 0;
}

.dark-mode .notification-title {
  color: #e5e7eb;
}

.notification-desc {
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 0 0 4px 0;
  line-height: 1.4;
  word-break: break-word;
}

.dark-mode .notification-desc {
  color: #9ca3af;
}

.notification-desc :deep(strong) {
  color: #8B5A3C;
  font-weight: 600;
}

.dark-mode .notification-desc :deep(strong) {
  color: #E5C4A0;
}

.notification-time {
  font-size: 0.75rem;
  color: #9ca3af;
}

.dark-mode .notification-time {
  color: #6b7280;
}

.notifications-footer {
  padding: 12px 20px;
  border-top: 1px solid #e5e7eb;
  background: white;
}

.dark-mode .notifications-footer {
  background: #0f0d1a;
  border-top: 1px solid #2d2640;
}

.view-all-btn {
  width: 100%;
  padding: 8px;
  background: #fafaf8;
  border: none;
  border-radius: 8px;
  color: #8B5A3C;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-all-btn:hover {
  background: #FDF8F3;
}

.dark-mode .view-all-btn {
  background: #2d2640;
  color: #E5C4A0;
}

.dark-mode .view-all-btn:hover {
  background: #3d3555;
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

/* Responsive */
@media (max-width: 1024px) {
  .notifications-dropdown {
    width: 340px;
  }
}

@media (max-width: 768px) {
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
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    z-index: 10000;
    touch-action: none;
    -webkit-overflow-scrolling: auto;
  }

  .dark-mode ~ .notification-overlay {
    background: rgba(0, 0, 0, 0.7);
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
    border-bottom: 1px solid #e5e7eb;
    z-index: 2;
  }

  .dark-mode .notifications-header {
    border-bottom: 1px solid #2d2640;
  }

  .notifications-header h3 {
    font-size: 1.125rem;
  }

  .close-dropdown {
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
    position: relative;
    z-index: 1;
    touch-action: none;
    overscroll-behavior: none;
  }

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 16px;
    opacity: 0.6;
  }

  .notifications-empty p {
    font-size: 1rem;
  }

  .notification-item {
    padding: 14px 16px;
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
    padding: 16px 20px;
    padding-bottom: calc(16px + env(safe-area-inset-bottom));
    border-top: 1px solid #e5e7eb;
    z-index: 2;
  }

  .dark-mode .notifications-footer {
    border-top: 1px solid #2d2640;
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
