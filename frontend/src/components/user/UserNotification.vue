<template>
  <div class="notification-wrapper">
    <button
        class="notif-trigger-btn"
        :class="{ 'dark-mode': isDarkMode }"
        title="Notifications"
        @click.stop="toggleNotifications"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
      <span v-if="notificationCount > 0" class="notif-badge">{{ displayCount }}</span>
    </button>

    <!-- Dropdown -->
    <transition name="dropdown">
      <div
          v-if="showNotifications"
          class="notif-dropdown"
          :class="{ 'dark-mode': isDarkMode }"
          @click.stop
          ref="dropdownRef"
      >
        <!-- Header -->
        <div class="notif-header">
          <div class="notif-header-left">
            <div class="notif-header-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </div>
            <h3 class="notif-title">Notifications</h3>
            <span v-if="notificationCount > 0" class="notif-count-pill">{{ displayCount }}</span>
          </div>
          <button class="notif-close-btn" @click="showNotifications = false" type="button" aria-label="Close">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <!-- Empty State -->
        <div v-if="notificationCount === 0" class="notif-empty">
          <div class="notif-empty-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </div>
          <p class="notif-empty-title">All caught up!</p>
          <p class="notif-empty-sub">No new notifications</p>
        </div>

        <!-- List -->
        <div v-else class="notif-list" ref="listRef">
          <div
              v-for="notification in notifications"
              :key="notification.id"
              class="notif-item"
              @click="handleNotificationClick(notification)"
          >
            <div class="notif-item-icon">
              {{ notification.icon || '📋' }}
            </div>
            <div class="notif-item-body">
              <p class="notif-item-title">{{ notification.title }}</p>
              <p class="notif-item-desc" v-html="notification.description"></p>
              <span class="notif-item-time">{{ formatTimeAgo(notification.createdAt) }}</span>
            </div>
            <div class="notif-item-arrow">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div v-if="notificationCount > 0" class="notif-footer">
          <button class="notif-view-all-btn" @click="handleViewAll" type="button">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>
            </svg>
            View All Notifications
          </button>
        </div>
      </div>
    </transition>

    <!-- Mobile Overlay -->
    <transition name="overlay-fade">
      <div v-if="showNotifications" class="notif-overlay" @click="showNotifications = false"></div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, inject } from 'vue';

const props = defineProps({
  notifications: { type: Array, default: () => [] }
});

const emit = defineEmits(['notification-click', 'view-all-notifications']);

const isDarkMode = inject('isDarkMode', ref(false));

const showNotifications = ref(false);
const dropdownRef = ref(null);
const listRef = ref(null);
let scrollPosition = 0;

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

function toggleNotifications() { showNotifications.value = !showNotifications.value; }

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
  const diffMins  = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays  = Math.floor(diffMs / 86400000);
  if (diffMins < 1)  return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7)   return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function handleClickOutside(event) {
  if (window.innerWidth > 480 && showNotifications.value && !event.target.closest('.notification-wrapper')) {
    showNotifications.value = false;
  }
}

function handleEscape(event) {
  if (event.key === 'Escape' && showNotifications.value) showNotifications.value = false;
}

function preventTouchMove(e) {
  if (window.innerWidth <= 480 && showNotifications.value) {
    const dropdown = dropdownRef.value;
    const list = listRef.value;
    if (!dropdown) { e.preventDefault(); return; }
    if (!dropdown.contains(e.target)) { e.preventDefault(); return; }
    if (list && list.contains(e.target)) {
      const isScrollable = list.scrollHeight > list.clientHeight;
      if (isScrollable) {
        const scrollTop = list.scrollTop;
        const scrollHeight = list.scrollHeight;
        const clientHeight = list.clientHeight;
        const touch = e.touches[0];
        const deltaY = touch.clientY - (list._lastTouchY || touch.clientY);
        list._lastTouchY = touch.clientY;
        if (scrollTop <= 0 && deltaY > 0) { e.preventDefault(); return; }
        if (scrollTop + clientHeight >= scrollHeight && deltaY < 0) { e.preventDefault(); return; }
        return;
      }
    }
    e.preventDefault();
  }
}

function handleTouchEnd() { if (listRef.value) delete listRef.value._lastTouchY; }

function preventWheel(e) {
  if (window.innerWidth <= 480 && showNotifications.value) {
    const list = listRef.value;
    if (!list || !list.contains(e.target)) { e.preventDefault(); return; }
    if (!(list.scrollHeight > list.clientHeight)) e.preventDefault();
  }
}

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
/* ══════════════════════════════════════
   DESIGN TOKENS — mirrors contact-tab
══════════════════════════════════════ */
.notification-wrapper,
.notif-dropdown {
  --c-bg: #ffffff;
  --c-surface: #ffffff;
  --c-surface-2: #faf9f7;
  --c-border: #e8e3dc;
  --c-border-focus: #7c5c4e;
  --c-text-primary: #1c1410;
  --c-text-secondary: #5a4f46;
  --c-text-muted: #9e8e84;
  --c-accent: #7c5c4e;
  --c-accent-2: #a07060;
  --c-accent-hover: #5e443a;
  --c-accent-light: #f0e8e4;
  --c-accent-subtle: #f8f3f0;
  --c-danger: #b83232;
  --c-danger-light: #fdf0f0;
  --c-success: #2d6a50;
  --c-success-light: #ecf7f2;
  --c-shadow-xs: 0 1px 2px rgba(28,20,16,.06);
  --c-shadow-sm: 0 2px 6px rgba(28,20,16,.08), 0 1px 2px rgba(28,20,16,.04);
  --c-shadow-lg: 0 16px 48px rgba(28,20,16,.16), 0 4px 12px rgba(28,20,16,.08);
  --c-radius: 14px;
  --c-radius-sm: 8px;
  --c-radius-xs: 5px;
  --c-radius-pill: 100px;
  font-family: 'Segoe UI', 'SF Pro Display', system-ui, -apple-system, sans-serif;
  font-size: 14px;
  color: var(--c-text-primary);
}

.notif-dropdown.dark-mode {
  --c-bg: #131118;
  --c-surface: #1a1720;
  --c-surface-2: #1e1b26;
  --c-border: #2c2838;
  --c-border-focus: #c4906e;
  --c-text-primary: #f2ede8;
  --c-text-secondary: #a89490;
  --c-text-muted: #6a5e5a;
  --c-accent: #c4906e;
  --c-accent-2: #d4a880;
  --c-accent-hover: #d4a070;
  --c-accent-light: #281e18;
  --c-accent-subtle: #1e1612;
  --c-danger: #e06060;
  --c-danger-light: #281414;
  --c-success: #60b88a;
  --c-success-light: #102418;
  --c-shadow-lg: 0 16px 48px rgba(0,0,0,.5), 0 4px 12px rgba(0,0,0,.3);
}

*, *::before, *::after { box-sizing: border-box; }
button { font-family: inherit; cursor: pointer; }

/* ══════════════════════════════════════
   TRIGGER BUTTON
══════════════════════════════════════ */
.notification-wrapper { position: relative; z-index: 1001; }

.notif-trigger-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  background: transparent;
  border: 1.5px solid transparent;
  border-radius: var(--c-radius-sm);
  color: var(--c-accent);
  transition: all 0.15s;
}

.notif-trigger-btn:hover {
  background: var(--c-accent-light);
  border-color: var(--c-border);
  color: var(--c-accent-hover);
}

.notif-trigger-btn.dark-mode { color: var(--c-accent); }
.notif-trigger-btn.dark-mode:hover { background: var(--c-accent-light); }

.notif-badge {
  position: absolute;
  top: 5px;
  right: 5px;
  min-width: 17px;
  height: 17px;
  background: var(--c-danger);
  color: #fff;
  font-size: 10px;
  font-weight: 800;
  padding: 1px 4px;
  border-radius: var(--c-radius-pill);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--c-surface);
  box-shadow: var(--c-shadow-xs);
  letter-spacing: 0;
}

/* ══════════════════════════════════════
   DROPDOWN PANEL
══════════════════════════════════════ */
.notif-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 380px;
  max-height: 520px;
  background: var(--c-surface);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius);
  box-shadow: var(--c-shadow-lg);
  overflow: hidden;
  z-index: 10002;
  display: flex;
  flex-direction: column;
}

/* ── Header ── */
.notif-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 14px 18px;
  background: var(--c-surface);
  border-bottom: 1.5px solid var(--c-border);
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 2;
}

.notif-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.notif-header-icon {
  width: 30px;
  height: 30px;
  background: var(--c-accent);
  border-radius: var(--c-radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(124,92,78,.25);
}

.notif-title {
  font-size: 15px;
  font-weight: 750;
  letter-spacing: -0.3px;
  color: var(--c-text-primary);
  margin: 0;
}

.notif-count-pill {
  background: var(--c-accent-light);
  color: var(--c-accent);
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: var(--c-radius-pill);
  letter-spacing: 0.02em;
  flex-shrink: 0;
}

.notif-close-btn {
  background: var(--c-surface-2);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-xs);
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--c-text-secondary);
  transition: all 0.15s;
  flex-shrink: 0;
}

.notif-close-btn:hover {
  border-color: var(--c-danger);
  color: var(--c-danger);
  background: var(--c-danger-light);
}

/* ── Empty State ── */
.notif-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
  background: var(--c-surface);
  flex: 1;
}

.notif-empty-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--c-accent-light);
  color: var(--c-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.notif-empty-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--c-text-primary);
  margin: 0 0 6px;
  letter-spacing: -0.2px;
}

.notif-empty-sub {
  font-size: 13px;
  color: var(--c-text-muted);
  margin: 0;
}

/* ── List ── */
.notif-list {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  background: var(--c-surface);
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}

.notif-list::-webkit-scrollbar { width: 4px; }
.notif-list::-webkit-scrollbar-track { background: transparent; }
.notif-list::-webkit-scrollbar-thumb { background: var(--c-border); border-radius: 4px; }
.notif-list::-webkit-scrollbar-thumb:hover { background: var(--c-accent-2); }

/* ── Item ── */
.notif-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 18px;
  border-bottom: 1px solid var(--c-border);
  cursor: pointer;
  transition: background 0.15s;
  background: var(--c-surface);
  position: relative;
}

.notif-item:last-child { border-bottom: none; }

.notif-item:hover {
  background: var(--c-accent-subtle);
}

.notif-item:hover .notif-item-arrow { opacity: 1; transform: translateX(0); }

.notif-item-icon {
  width: 38px;
  height: 38px;
  border-radius: var(--c-radius-sm);
  background: linear-gradient(135deg, var(--c-accent) 0%, var(--c-accent-2) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(124,92,78,.2);
}

.notif-item-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.notif-item-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--c-text-primary);
  margin: 0;
  letter-spacing: -0.1px;
}

.notif-item-desc {
  font-size: 12px;
  color: var(--c-text-secondary);
  margin: 0;
  line-height: 1.45;
  word-break: break-word;
}

.notif-item-desc :deep(strong) {
  color: var(--c-accent);
  font-weight: 700;
}

.notif-item-time {
  font-size: 11px;
  color: var(--c-text-muted);
  font-weight: 500;
  margin-top: 2px;
}

.notif-item-arrow {
  color: var(--c-text-muted);
  opacity: 0;
  transform: translateX(-4px);
  transition: all 0.15s;
  flex-shrink: 0;
  margin-top: 2px;
}

/* ── Footer ── */
.notif-footer {
  padding: 12px 18px;
  border-top: 1.5px solid var(--c-border);
  background: var(--c-surface-2);
  flex-shrink: 0;
}

.notif-view-all-btn {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 9px 14px;
  background: var(--c-accent-light);
  border: 1.5px solid rgba(124,92,78,.15);
  border-radius: var(--c-radius-sm);
  color: var(--c-accent);
  font-size: 13px;
  font-weight: 650;
  letter-spacing: 0.01em;
  transition: all 0.15s;
}

.notif-view-all-btn:hover {
  background: var(--c-accent);
  color: #fff;
  border-color: var(--c-accent);
  box-shadow: 0 2px 8px rgba(124,92,78,.3);
}

/* ══════════════════════════════════════
   MOBILE OVERLAY
══════════════════════════════════════ */
.notif-overlay { display: none; }

/* ══════════════════════════════════════
   TRANSITIONS — desktop
══════════════════════════════════════ */
.dropdown-enter-active,
.dropdown-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }

.dropdown-enter-from { opacity: 0; transform: translateY(-8px) scale(0.98); }
.dropdown-leave-to   { opacity: 0; transform: translateY(-4px) scale(0.98); }

.overlay-fade-enter-active,
.overlay-fade-leave-active { transition: opacity 0.2s ease; }
.overlay-fade-enter-from,
.overlay-fade-leave-to { opacity: 0; }

/* ══════════════════════════════════════
   RESPONSIVE — tablet (≤ 1024px)
══════════════════════════════════════ */
@media (max-width: 1024px) {
  .notif-dropdown { width: 340px; }
}

/* ══════════════════════════════════════
   RESPONSIVE — small tablet (≤ 768px)
══════════════════════════════════════ */
@media (max-width: 768px) {
  .notif-dropdown {
    width: 320px;
    right: -8px;
    max-height: 460px;
  }
}

/* ══════════════════════════════════════
   RESPONSIVE — mobile fullscreen (≤ 480px)
══════════════════════════════════════ */
@media (max-width: 480px) {
  /* Overlay */
  .notif-overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(16,14,20,.5);
    backdrop-filter: blur(4px);
    z-index: 10000;
    touch-action: none;
  }

  /* Panel — full-screen sheet */
  .notif-dropdown {
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
    border: none;
    z-index: 10001;
    overscroll-behavior: none;
  }

  /* Slide-up animation on mobile */
  .dropdown-enter-active {
    transition: transform 0.32s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  .dropdown-leave-active {
    transition: transform 0.26s cubic-bezier(0.55, 0.085, 0.68, 0.53);
  }
  .dropdown-enter-from { transform: translateY(100%); opacity: 1; }
  .dropdown-enter-to   { transform: translateY(0); }
  .dropdown-leave-from { transform: translateY(0); }
  .dropdown-leave-to   { transform: translateY(100%); opacity: 1; }

  .notif-header {
    padding: 16px 20px;
    padding-top: max(16px, env(safe-area-inset-top));
  }

  .notif-title { font-size: 16px; }

  .notif-list {
    flex: 1;
    min-height: 0;
    max-height: none;
    -webkit-overflow-scrolling: touch;
  }

  .notif-empty {
    flex: 1;
    min-height: 0;
    touch-action: none;
    overscroll-behavior: none;
  }

  .notif-item { padding: 14px 18px; }

  .notif-footer {
    padding: 14px 18px;
    padding-bottom: calc(14px + env(safe-area-inset-bottom));
  }

  .notif-item-arrow { display: none; }
}

/* ══════════════════════════════════════
   TOUCH TARGETS
══════════════════════════════════════ */
@media (hover: none) and (pointer: coarse) {
  .notif-trigger-btn,
  .notif-close-btn,
  .notif-view-all-btn { min-height: 44px; min-width: 44px; }

  .notif-item { padding: 16px 18px; }
}

/* ══════════════════════════════════════
   REDUCED MOTION
══════════════════════════════════════ */
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition-duration: 0.01ms !important; }
}
</style>
