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
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 5 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 5 8.51a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 8.51 5a1.65 1.65 0 0 0 1.51-1V4a2 2 0 0 1 4 0v.09A1.65 1.65 0 0 0 15.49 5a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19 8.51c.06.32.06.66 0 .98"></path>
          </svg>
        </button>

        <!-- Notification Button -->
        <button class="icon-button" title="Notifications">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span class="notification-badge">3</span>
        </button>
      </div>
    </div>

  </header>
</template>

<script setup>
import { ref, inject } from 'vue';

const isDarkMode = inject('isDarkMode', ref(false));
const showLogoutModal = ref(false);

// Single defineEmits with all events
const emit = defineEmits(['toggle-sidebar', 'open-settings', 'toggle-dark-mode']);

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

/* Dark Mode Styles - Professional Dark Purple-Blue */
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

.menu-toggle {
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  color: #6B4423;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.2s;
}

.menu-toggle:hover {
  background: #f3f4f6;
}

.dark-mode .menu-toggle {
  color: #D4A574;
}

.dark-mode .menu-toggle:hover {
  background: #2d2640;
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

.notification-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 18px;
  height: 18px;
  background: #ef4444;
  color: white;
  font-size: 10px;
  font-weight: 600;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Responsive */
@media (max-width: 1024px) {
  .menu-toggle {
    display: flex;
  }
}

@media (max-width: 768px) {
  .header-content {
    padding: 0 1rem;
  }

  .header-logo {
    height: 32px;
  }
}
</style>
