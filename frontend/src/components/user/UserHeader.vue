<template>
  <header :class="['top-header', { 'dark-mode': isDarkMode }]">
    <div class="header-content">
      <img
          src="../../assets/images/logo.jpeg"
          alt="Logo"
          class="header-logo"
      />

      <div class="header-right">
        <button
            class="icon-button"
            :title="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
            @click="$emit('toggle-dark-mode')"
        >
          <svg v-if="isDarkMode" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>

        <button class="icon-button" title="Settings" @click="$emit('open-settings')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="1.8"
               stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.14 12.94a7.48 7.48 0 0 0 .05-.94 7.48 7.48 0 0 0-.05-.94l2.03-1.58a.5.5 0 0 0 .12-.65l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.28 7.28 0 0 0-1.63-.94l-.36-2.54a.5.5 0 0 0-.5-.42h-3.84a.5.5 0 0 0-.5.42l-.36 2.54a7.28 7.28 0 0 0-1.63.94l-2.39-.96a.5.5 0 0 0-.6.22L2.71 8.83a.5.5 0 0 0 .12.65l2.03 1.58a7.48 7.48 0 0 0-.05.94 7.48 7.48 0 0 0 .05.94l-2.03 1.58a.5.5 0 0 0-.12.65l1.92 3.32a.5.5 0 0 0 .6.22l2.39-.96a7.28 7.28 0 0 0 1.63.94l.36 2.54a.5.5 0 0 0 .5.42h3.84a.5.5 0 0 0 .5-.42l.36-2.54a7.28 7.28 0 0 0 1.63-.94l2.39.96a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.65l-2.03-1.58z"/>
          </svg>
        </button>

        <UserNotification
            :notifications="notifications"
            @notification-click="handleNotificationClick"
            @view-all-notifications="handleViewAllNotifications"
        />
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, inject } from 'vue'
import UserNotification from './UserNotification.vue'

const theme = inject('theme', { isDark: ref(false) })
const isDarkMode = theme.isDark

defineProps({
  notifications: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits([
  'toggle-sidebar',
  'open-settings',
  'toggle-dark-mode',
  'notification-click',
  'view-all-notifications'
])

function handleNotificationClick(notification) {
  emit('notification-click', notification)
}

function handleViewAllNotifications() {
  emit('view-all-notifications')
}
</script>

<style scoped>
/* ══ CSS Custom Properties — mirrors Theme tab exactly ══ */
.top-header {
  --c-bg: #ffffff;
  --c-surface: #ffffff;
  --c-surface-2: #faf9f7;
  --c-border: #e8e3dc;
  --c-text-primary: #1c1410;
  --c-text-secondary: #5a4f46;
  --c-text-muted: #9e8e84;
  --c-accent: #7c5c4e;
  --c-accent-2: #a07060;
  --c-accent-hover: #5e443a;
  --c-accent-light: #f0e8e4;
  --c-accent-subtle: #f8f3f0;
  --c-shadow-xs: 0 1px 2px rgba(28,20,16,0.06);
  --c-shadow-sm: 0 2px 6px rgba(28,20,16,0.08), 0 1px 2px rgba(28,20,16,0.04);
  --c-radius-sm: 8px;
  --c-radius-xs: 5px;
  font-family: 'Segoe UI', 'SF Pro Display', system-ui, -apple-system, sans-serif;

  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: var(--c-surface);
  border-bottom: 1.5px solid var(--c-border);
  z-index: 200;
  transition: background 0.2s ease, border-color 0.2s ease;
  box-shadow: var(--c-shadow-xs);
}

.top-header.dark-mode {
  --c-bg: #100e14;
  --c-surface: #1a1720;
  --c-surface-2: #1e1b26;
  --c-border: #2c2838;
  --c-text-primary: #f2ede8;
  --c-text-secondary: #a89490;
  --c-text-muted: #6a5e5a;
  --c-accent: #c4906e;
  --c-accent-2: #d4a880;
  --c-accent-hover: #d4a070;
  --c-accent-light: #281e18;
  --c-accent-subtle: #1e1612;
  --c-shadow-xs: 0 1px 2px rgba(0,0,0,0.2);
  --c-shadow-sm: 0 2px 6px rgba(0,0,0,0.3);
}

*, *::before, *::after { box-sizing: border-box; }
button { font-family: inherit; cursor: pointer; }

/* Layout */
.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 20px;
}

.header-logo {
  height: 36px;
  width: auto;
  cursor: pointer;
  border-radius: var(--c-radius-xs);
  display: block;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Icon buttons — mirrors sub-tab-btn / qr-close-btn style */
.icon-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--c-surface-2);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-xs);
  color: var(--c-accent);
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s, transform 0.1s;
  -webkit-tap-highlight-color: transparent;
}

.icon-button:hover {
  background: var(--c-accent-light);
  border-color: var(--c-accent-2);
  color: var(--c-accent-hover);
}

.icon-button:active {
  transform: scale(0.94);
  background: var(--c-accent-light);
}

/* Mobile */
@media (max-width: 480px) {
  .header-content {
    padding: 0 14px;
  }

  .header-logo {
    height: 30px;
  }

  .header-right {
    gap: 4px;
  }

  .icon-button {
    width: 38px;
    height: 38px;
  }
}

/* Touch targets */
@media (hover: none) and (pointer: coarse) {
  .icon-button {
    min-width: 44px;
    min-height: 44px;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  * { transition-duration: 0.01ms !important; }
}

</style>
