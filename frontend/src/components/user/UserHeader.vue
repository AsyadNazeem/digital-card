<template>
  <header class="top-header" :class="{ 'dark-mode': isDarkMode }">
    <div class="header-content">
      <img
          src="../../assets/images/logo.jpeg"
          alt="Logo"
          class="header-logo"
      />

      <div class="header-right">
        <!-- Dark Mode Toggle Button -->
        <button class="icon-button" title="Toggle Dark Mode" @click="$emit('toggle-dark-mode')">
          <!-- Sun icon (shown in dark mode) -->
          <svg v-if="isDarkMode" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          <!-- Moon icon (shown in light mode) -->
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>

        <!-- Settings Button -->
        <button class="icon-button" title="Settings" @click="$emit('open-settings')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="1.8"
               stroke-linecap="round" stroke-linejoin="round">
            <path d="M19.14 12.94a7.48 7.48 0 0 0 .05-.94
           7.48 7.48 0 0 0-.05-.94l2.03-1.58
           a.5.5 0 0 0 .12-.65l-1.92-3.32
           a.5.5 0 0 0-.6-.22l-2.39.96
           a7.28 7.28 0 0 0-1.63-.94l-.36-2.54
           a.5.5 0 0 0-.5-.42h-3.84
           a.5.5 0 0 0-.5.42l-.36 2.54
           a7.28 7.28 0 0 0-1.63.94l-2.39-.96
           a.5.5 0 0 0-.6.22L2.71 8.83
           a.5.5 0 0 0 .12.65l2.03 1.58
           a7.48 7.48 0 0 0-.05.94
           7.48 7.48 0 0 0 .05.94l-2.03 1.58
           a.5.5 0 0 0-.12.65l1.92 3.32
           a.5.5 0 0 0 .6.22l2.39-.96
           a7.28 7.28 0 0 0 1.63.94l.36 2.54
           a.5.5 0 0 0 .5.42h3.84
           a.5.5 0 0 0 .5-.42l.36-2.54
           a7.28 7.28 0 0 0 1.63-.94l2.39.96
           a.5.5 0 0 0 .6-.22l1.92-3.32
           a.5.5 0 0 0-.12-.65l-2.03-1.58z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </button>

        <!-- User Notification Component -->
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
import { ref, inject } from 'vue';
import UserNotification from './UserNotification.vue';

const isDarkMode = inject('isDarkMode', ref(false));

// Props
const props = defineProps({
  notifications: {
    type: Array,
    default: () => []
  }
});

// Emits
const emit = defineEmits(['toggle-sidebar', 'open-settings', 'toggle-dark-mode', 'notification-click', 'view-all-notifications']);

// Methods
function handleNotificationClick(notification) {
  emit('notification-click', notification);
}

function handleViewAllNotifications() {
  emit('view-all-notifications');
}
</script>

<style scoped>
/* Top Header */
.top-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

/* Dark Mode Styles */
.top-header.dark-mode {
  background: #1a1626;
  border-bottom: 1px solid #2d2640;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 1.5rem;
  max-width: 100%;
}

.header-logo {
  height: 40px;
  cursor: pointer;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
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

.dark-mode .icon-button {
  color: #D4A574;
}

.dark-mode .icon-button:hover {
  background: #2d2640;
  color: #E5C4A0;
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    padding: 0 1rem;
  }

  .header-logo {
    height: 32px;
  }
}
</style>
