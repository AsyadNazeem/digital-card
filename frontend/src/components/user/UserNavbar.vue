<template>
  <!-- Desktop Sidebar (unchanged) -->
  <aside :class="['desktop-sidebar', { collapsed: !sidebarExpanded, 'dark-mode': isDarkMode }]">
    <button
        class="sidebar-toggle-btn"
        @click="$emit('toggle-sidebar')"
        :title="sidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
           :class="['toggle-icon', { rotated: !sidebarExpanded }]">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
    </button>

    <nav class="sidebar-nav">
      <button
          v-for="tab in tabs" :key="tab.id"
          @click="selectTab(tab.id)"
          :class="['nav-item', { active: modelValue === tab.id }]"
          :title="tab.label"
      >
        <span class="nav-icon" v-html="tab.icon"/>
        <span class="nav-label">{{ tab.label }}</span>
      </button>
    </nav>

    <div class="sidebar-footer">
      <button class="user-profile" @click="showProfilePopup = !showProfilePopup">
        <div class="user-avatar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <div class="user-info">
          <div class="user-name">{{ userName }}</div>
          <div class="user-role">{{ userRole }}</div>
        </div>
      </button>
    </div>
  </aside>

  <!-- Desktop Profile Popup (unchanged) -->
  <transition name="fade">
    <div v-if="showProfilePopup" class="profile-overlay" @click="showProfilePopup = false">
      <transition name="scale">
        <div v-if="showProfilePopup"
             :class="['profile-popup desktop-popup', { 'dark-mode': isDarkMode }]"
             @click.stop>
          <div class="profile-header">
            <div class="profile-user-info">
              <div class="profile-avatar">{{ userInitials }}</div>
              <div class="profile-details">
                <div class="profile-name">{{ userName }}</div>
                <div class="profile-plan">{{ userRole }}</div>
              </div>
            </div>
          </div>
          <div class="profile-menu">
            <button
                v-for="item in profileMenuItems" :key="item.id"
                @click="handleProfileAction(item.id)"
                class="profile-menu-item"
            >
              <span class="profile-item-icon" v-html="item.icon"/>
              <span class="profile-item-label">{{ item.label }}</span>
              <svg v-if="item.hasChevron" class="chevron-icon" width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
            <div class="profile-divider"/>
            <button @click="handleProfileAction('logout')" class="profile-menu-item logout-item">
              <span class="profile-item-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </span>
              <span class="profile-item-label">Log out</span>
            </button>
          </div>
        </div>
      </transition>
    </div>
  </transition>

  <!-- Mobile Bottom Nav -->
  <nav :class="['mobile-bottom-nav', { 'dark-mode': isDarkMode }]">
    <button
        v-for="tab in tabs.slice(0, 4)" :key="tab.id"
        @click="selectTab(tab.id)"
        :class="['mobile-nav-item', { active: modelValue === tab.id }]"
    >
      <span class="mobile-icon" v-html="tab.icon"/>
      <span class="mobile-label">{{ tab.label }}</span>
      <span v-if="modelValue === tab.id" class="active-dot"/>
    </button>

    <button
        @click="showMoreMenu = !showMoreMenu"
        :class="['mobile-nav-item', { active: showMoreMenu }]"
    >
      <span class="mobile-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </span>
      <span class="mobile-label">More</span>
      <span v-if="showMoreMenu" class="active-dot"/>
    </button>
  </nav>

  <!-- Mobile More Sheet -->
  <transition name="fade">
    <div v-if="showMoreMenu" class="more-overlay" @click="showMoreMenu = false">
      <transition name="slide-up">
        <div v-if="showMoreMenu" class="more-sheet" :class="{ 'dark-mode': isDarkMode }" @click.stop>

          <!-- Drag handle -->
          <div class="drag-handle"/>

          <!-- Sheet header -->
          <div class="sheet-header">
            <span class="sheet-title">Menu</span>
            <button class="close-btn" @click="showMoreMenu = false">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <!-- User card -->
          <div class="user-card">
            <div class="sheet-avatar">{{ userInitials }}</div>
            <div class="sheet-user-info">
              <div class="sheet-user-name">{{ userName }}</div>
              <div class="sheet-user-role">{{ userRole }}</div>
            </div>
            <button class="upgrade-btn" @click="handleMobileProfileAction('upgrade')">Upgrade</button>
          </div>

          <div class="sheet-body">
            <!-- Extra tabs (Themes etc.) -->
            <div v-if="tabs.slice(4).length" class="section-label">Navigation</div>
            <button
                v-for="tab in tabs.slice(4)" :key="tab.id"
                @click="selectTabAndClose(tab.id)"
                :class="['sheet-row', { 'sheet-row-active': modelValue === tab.id }]"
            >
              <div class="row-icon-wrap" :class="{ 'row-icon-active': modelValue === tab.id }" v-html="tab.icon"/>
              <span class="row-label">{{ tab.label }}</span>
              <svg class="row-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>

            <div class="sheet-divider"/>

            <!-- Account section -->
            <div class="section-label">Account</div>
            <button
                v-for="item in mobileProfileItems" :key="item.id"
                @click="handleMobileProfileAction(item.id)"
                class="sheet-row"
            >
              <div class="row-icon-wrap" v-html="item.icon"/>
              <span class="row-label">{{ item.label }}</span>
              <svg v-if="item.hasChevron" class="row-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>

            <!-- Logout — always visible -->
            <button class="sheet-row logout-row" @click="handleMobileProfileAction('logout')">
              <div class="row-icon-wrap logout-icon-wrap">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </div>
              <span class="logout-label">Log out</span>
            </button>
          </div>
        </div>
      </transition>
    </div>
  </transition>

  <LogoutConfirmModal
      :show="showLogoutModal"
      @close="showLogoutModal = false"
      @confirm="handleLogout"
  />
</template>


<script setup>
import {computed, inject, ref} from 'vue';
import LogoutConfirmModal from './LogoutModal.vue';

const showLogoutModal = ref(false);

const props = defineProps({
  modelValue: {
    type: String,
    default: 'company'
  },
  userName: {
    type: String,
    default: 'Asyad Nazeem'
  },
  userRole: {
    type: String,
    default: 'Free plan'
  },
  sidebarExpanded: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:modelValue', 'toggle-sidebar', 'open-settings', 'open-upgrade', 'logout']);

// Inject dark mode state from parent
const isDarkMode = inject('isDarkMode', ref(false));

const showMoreMenu = ref(false);
const showProfilePopup = ref(false);

const userInitials = computed(() => {
  return props.userName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
});

const tabs = [
  {
    id: 'company',
    label: 'Companies',
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 21v-6h6v6"/><path d="M9 7h.01M15 7h.01M9 11h.01M15 11h.01"/></svg>'
  },
  {
    id: 'contact',
    label: 'Contacts',
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="7" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>'
  },
  {
    id: 'review',
    label: 'Review',
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/></svg>'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><rect x="7" y="13" width="3" height="5"/><rect x="12" y="9" width="3" height="9"/><rect x="17" y="5" width="3" height="13"/></svg>'
  },
  {
    id: 'theme',
    label: 'Themes',
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a9 9 0 1 0 9 9c0-1.5-1.2-2.5-2.7-2.5H16a2 2 0 0 1-2-2V5.7C14 4.2 13 3 12 3z"/></svg>'
  }
];

const profileMenuItems = [
  {
    id: 'settings',
    label: 'Settings',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5h.1a1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9c0 .6.4 1 1 1h.1a2 2 0 1 1 0 4h-.1c-.6 0-1 .4-1 1z"/></svg>',
    hasChevron: true
  },
  {
    id: 'upgrade',
    label: 'Upgrade plan',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l10 5-10 5-10-5 10-5z"/><path d="M2 12l10 5 10-5"/><path d="M2 17l10 5 10-5"/></svg>',
    hasChevron: false
  },
];

const mobileProfileItems = [
  {
    id: 'settings',
    label: 'Settings',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5h.1a1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9c0 .6.4 1 1 1h.1a2 2 0 1 1 0 4h-.1c-.6 0-1 .4-1 1z"/></svg>',
    hasChevron: true
  }
];

function selectTab(tabId) {
  emit('update:modelValue', tabId);
}

function selectTabAndClose(tabId) {
  emit('update:modelValue', tabId);
  showMoreMenu.value = false;
}

function handleProfileAction(actionId) {
  showProfilePopup.value = false;

  if (actionId === 'settings') {
    emit('open-settings');
  }

  if (actionId === 'upgrade') {
    emit('open-upgrade');
  }

  if (actionId === 'logout') {
    showLogoutModal.value = true;
  }
}

function handleLogout() {
  showLogoutModal.value = false;
  emit('logout');
  console.log('LOGOUT EVENT EMITTED');
}


function handleMobileProfileAction(actionId) {
  showMoreMenu.value = false;

  if (actionId === 'upgrade') {
    emit('open-upgrade');
  }

  if (actionId === 'settings') {
    emit('open-settings');
  }
  if (actionId === 'logout') showLogoutModal.value = true
}


</script>

<style scoped>

:root {
  --safe-area-inset-bottom: env(safe-area-inset-bottom, 0px);
}

/* ── Mobile bottom nav ── */
.mobile-bottom-nav {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  padding-bottom: env(safe-area-inset-bottom, 0px);
  background: #ffffff;
  border-top: 1px solid #e5e7eb;
  z-index: 100;
}

.mobile-bottom-nav.dark-mode {
  background: #1a1626;
  border-top-color: #2d2640;
}

.mobile-nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  background: transparent;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 6px 4px 4px;
  -webkit-tap-highlight-color: transparent;
  transition: color 0.15s;
}

.mobile-nav-item.active {
  color: #6B4423;
}

.dark-mode .mobile-nav-item {
  color: #6b5d57;
}

.dark-mode .mobile-nav-item.active {
  color: #D4A574;
}

.mobile-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
}

.mobile-label {
  font-size: 10px;
  font-weight: 500;
}

.active-dot {
  width: 4px;
  height: 4px;
  background: #6B4423;
  border-radius: 50%;
  margin-top: 1px;
}

.dark-mode .active-dot {
  background: #D4A574;
}

/* ── More sheet overlay ── */
.more-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10000;
  display: flex;
  align-items: flex-end;
}

.more-sheet {
  width: 100%;
  background: #ffffff;
  border-radius: 20px 20px 0 0;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

.more-sheet.dark-mode {
  background: #131118;
}

.drag-handle {
  width: 36px;
  height: 4px;
  background: #e0dbd4;
  border-radius: 2px;
  margin: 12px auto 0;
  flex-shrink: 0;
}

.dark-mode .drag-handle {
  background: #2c2838;
}

.sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px 10px;
  flex-shrink: 0;
}

.sheet-title {
  font-size: 17px;
  font-weight: 700;
  color: #1f2937;
}

.dark-mode .sheet-title {
  color: #e5e7eb;
}

.close-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: #f3f4f6;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.dark-mode .close-btn {
  background: #2d2640;
  color: #9ca3af;
}

/* User card */
.user-card {
  margin: 0 12px 8px;
  background: #fdf8f3;
  border: 1px solid #e8dfd4;
  border-radius: 14px;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.dark-mode .user-card {
  background: #0f0d1a;
  border-color: #2d2640;
}

.sheet-avatar {
  width: 44px;
  height: 44px;
  background: #6B4423;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  flex-shrink: 0;
}

.sheet-user-info {
  flex: 1;
  min-width: 0;
}

.sheet-user-name {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.dark-mode .sheet-user-name {
  color: #e5e7eb;
}

.sheet-user-role {
  font-size: 12px;
  color: #8a7060;
  margin-top: 2px;
}

.dark-mode .sheet-user-role {
  color: #9ca3af;
}

.upgrade-btn {
  background: #6B4423;
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  -webkit-tap-highlight-color: transparent;
}

/* Sheet scrollable body */
.sheet-body {
  flex: 1;
  overflow-y: auto;
  padding: 0 12px 16px;
}

.section-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #9ca3af;
  padding: 8px 4px 4px;
}

.sheet-row {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 11px 8px;
  background: transparent;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  text-align: left;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.12s;
  margin-bottom: 2px;
}

.sheet-row:hover, .sheet-row:active {
  background: #f9f6f2;
}

.dark-mode .sheet-row:hover {
  background: #1e1b26;
}

.sheet-row-active {
  background: #fdf3eb;
}

.dark-mode .sheet-row-active {
  background: #1e1b26;
}

.row-icon-wrap {
  width: 38px;
  height: 38px;
  background: #f5f0eb;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #6B4423;
}

.dark-mode .row-icon-wrap {
  background: #2d2640;
  color: #D4A574;
}

.row-icon-active {
  background: #6B4423 !important;
  color: #fff !important;
}

.row-label {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
}

.dark-mode .row-label {
  color: #e5e7eb;
}

.sheet-row-active .row-label {
  color: #6B4423;
}

.dark-mode .sheet-row-active .row-label {
  color: #D4A574;
}

.row-chevron {
  color: #d1d5db;
  flex-shrink: 0;
}

.sheet-divider {
  height: 1px;
  background: #f0ebe4;
  margin: 8px 0;
}

.dark-mode .sheet-divider {
  background: #2c2838;
}

/* Logout row */
.logout-row:hover {
  background: #fef2f2 !important;
}

.dark-mode .logout-row:hover {
  background: #2a1a1a !important;
}

.logout-icon-wrap {
  background: #fef2f2 !important;
  color: #ef4444 !important;
}

.dark-mode .logout-icon-wrap {
  background: #2a1a1a !important;
  color: #f87171 !important;
}

.logout-label {
  color: #ef4444;
  font-size: 14px;
  font-weight: 500;
}

.dark-mode .logout-label {
  color: #f87171;
}

/* Animations */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from, .slide-up-leave-to {
  transform: translateY(100%);
}

/* Responsive */
@media (max-width: 1024px) {
  .desktop-sidebar {
    display: none;
  }

  .mobile-bottom-nav {
    display: flex;
  }

  .profile-overlay {
    display: none;
  }
}

@media (max-width: 480px) {
  .more-sheet {
    max-height: 88vh;
  }
}

.mobile-user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: #f9fafb;
  border-radius: 12px;
  width: 100%;
  border: none;
  cursor: pointer;
}

.mobile-user-arrow {
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, color 0.2s ease;
  color: #6b7280;
}

.mobile-user-arrow.open {
  transform: rotate(180deg);
  color: #4f46e5;
}

/* Desktop Sidebar */
.desktop-sidebar {
  position: fixed;
  left: 0;
  top: 64px;
  bottom: 0;
  width: 260px;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease, border 0.3s ease; /* border instead of border-color */
  z-index: 100;
  overflow: hidden;
}

/* Dark Mode for Desktop Sidebar - Professional Dark Purple-Blue */
.desktop-sidebar.dark-mode {
  background: #131118;
  border-right: 1px solid #2c2838;
}

.sidebar-toggle-btn {
  position: fixed;
  top: calc(64px + 1rem);
  left: 248px;
  width: 28px;
  height: 28px;
  background: #ffffff;
  border: 1.5px solid #e5e7eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 101;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.desktop-sidebar.dark-mode ~ .sidebar-toggle-btn,
.desktop-sidebar.dark-mode .sidebar-toggle-btn {
  background: #1a1720;
  border-color: #2c2838;
}

.desktop-sidebar.collapsed {
  width: 72px;
}

.desktop-sidebar.collapsed .sidebar-toggle-btn {
  left: 60px;
}

.desktop-sidebar.collapsed .sidebar-footer {
  border-top-color: transparent;
}

/* Hide the sidebar-footer border in dark mode when collapsed */
.desktop-sidebar.dark-mode.collapsed .sidebar-footer {
  border-top-color: transparent;
}

.sidebar-toggle-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  transform: scale(1.1);
}

.desktop-sidebar.dark-mode .sidebar-toggle-btn:hover {
  background: #1e1b26;
  border-color: #2c2838;
}

.sidebar-toggle-btn:active {
  transform: scale(0.95);
}

.toggle-icon {
  transition: transform 0.3s ease;
  color: #6B4423;
}

.desktop-sidebar.dark-mode .toggle-icon {
  color: #D4A574;
}

.toggle-icon.rotated {
  transform: rotate(180deg);
}

.sidebar-nav {
  flex: 1;
  padding: 3rem 0.5rem 1rem 0.5rem;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.75rem 1rem;
  margin-bottom: 0.25rem;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: #6B4423;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  gap: 0.75rem;
}

.desktop-sidebar.dark-mode .nav-item {
  color: #D4A574;
}

.nav-item:hover {
  background: #f3f4f6;
  color: #8B5A3C;
}

.desktop-sidebar.dark-mode .nav-item:hover {
  background: #1e1b26;
  color: #E5C4A0;
}

.nav-item.active {
  background: #FDF8F3;
  color: #8B5A3C;
  font-weight: 600;
}

.desktop-sidebar.dark-mode .nav-item.active {
  background: #1e1b26;
  color: #E5C4A0;
}

.nav-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
}

.nav-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 1;
  transition: opacity 0.2s ease;
}

.desktop-sidebar.collapsed .nav-label {
  opacity: 0;
  width: 0;
}

.desktop-sidebar.collapsed .nav-item {
  justify-content: center;
  padding: 0.75rem 0;
  gap: 0;
}

/* Sidebar Footer */
.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
}

.desktop-sidebar.dark-mode .sidebar-footer {
  border-top: 1px solid #2c2838;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background 0.2s;
  cursor: pointer;
  width: 100%;
  background: transparent;
  border: none;
  text-align: left;
}

.user-profile:hover {
  background: #f3f4f6;
}

.desktop-sidebar.dark-mode .user-profile:hover {
  background: #1e1b26;
}

.user-avatar {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #8B5A3C 0%, #6B4423 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.user-info {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  opacity: 1;
  transition: opacity 0.2s ease;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.desktop-sidebar.dark-mode .user-name {
  color: #e5e7eb;
}

.user-role {
  font-size: 0.75rem;
  color: #6b7280;
}

.desktop-sidebar.dark-mode .user-role {
  color: #9ca3af;
}

.desktop-sidebar.collapsed .user-info {
  opacity: 0;
  width: 0;
}

.desktop-sidebar.collapsed .user-profile {
  justify-content: center;
  padding: 0.5rem 0;   /* same here */
  gap: 0;
}

/* Profile Popup Overlay */
.profile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 10000;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
}

/* Desktop Profile Popup */
.profile-popup.desktop-popup {
  position: absolute;
  left: 5px;
  bottom: 90px;
  width: 247px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  border: 1px solid #e5e7eb;
  z-index: 10001;
  transition: all 0.3s ease;
}

.profile-popup.desktop-popup.dark-mode {
  background: #1a1720;
  border-color: #2c2838;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

/* Profile Header */
.profile-header {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  background: #fafaf8;
}

.dark-mode .profile-header {
  background: #0f0d1a;
  border-bottom: 1px solid #2d2640;
}

.profile-user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.profile-avatar {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #8B5A3C 0%, #6B4423 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
}

.profile-details {
  flex: 1;
  min-width: 0;
}

.profile-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dark-mode .profile-name {
  color: #e5e7eb;
}

.profile-plan {
  font-size: 0.75rem;
  color: #6b7280;
}

.dark-mode .profile-plan {
  color: #9ca3af;
}

/* Profile Menu */
.profile-menu {
  padding: 0.5rem;
}

.profile-menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.65rem 0.75rem;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: #1f2937;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.dark-mode .profile-menu-item {
  color: #e5e7eb;
}

.profile-menu-item:hover {
  background: #FDF8F3;
  color: #8B5A3C;
}

.dark-mode .profile-menu-item:hover {
  background: #2d2640;
  color: #E5C4A0;
}

.profile-item-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  color: #6b7280;
}

.dark-mode .profile-item-icon {
  color: #9ca3af;
}

.profile-menu-item:hover .profile-item-icon {
  color: #8B5A3C;
}

.dark-mode .profile-menu-item:hover .profile-item-icon {
  color: #E5C4A0;
}

.profile-item-label {
  flex: 1;
}

.chevron-icon {
  flex-shrink: 0;
  color: #9ca3af;
}

.profile-menu-item:hover .chevron-icon {
  color: #8B5A3C;
}

.dark-mode .profile-menu-item:hover .chevron-icon {
  color: #E5C4A0;
}

.profile-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 0.5rem 0;
}

.dark-mode .profile-divider {
  background: #2d2640;
}

.logout-item {
  color: #ef4444;
}

.logout-item .profile-item-icon {
  color: #ef4444;
}

.logout-item:hover {
  background: #fef2f2;
  color: #dc2626;
}

.dark-mode .logout-item:hover {
  background: #2a1a1a;
}

.logout-item:hover .profile-item-icon {
  color: #dc2626;
}

/* ===================================
   MOBILE BOTTOM NAVIGATION (UPDATED)
   =================================== */
.mobile-bottom-nav {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 65px;
  /* Add safe area padding for mobile browser controls */
  padding-bottom: env(safe-area-inset-bottom, 0px);
  background: #ffffff;
  border-top: 1px solid #e5e7eb;
  z-index: 100;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.mobile-bottom-nav.dark-mode {
  background: #131118;
  border-top: 1px solid #2c2838;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.3);
}

.mobile-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  background: transparent;
  border: none;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0.5rem;
  gap: 0.3rem;
}

.dark-mode .mobile-nav-item {
  color: #9ca3af;
}

.mobile-nav-item.active {
  color: #000;
}

.dark-mode .mobile-nav-item.active {
  color: #E5C4A0;
}

.mobile-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  transition: all 0.2s;
}

.mobile-label {
  font-size: 0.625rem;
  font-weight: 500;
  color: #000;
}

.dark-mode .mobile-label {
  color: #e5e7eb;
}

/* More Menu Overlay */
.more-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 10000;
  display: flex;
  align-items: flex-end;
}

.more-menu-popup {
  width: 100%;
  z-index: 10001;
  /* Add safe area padding at bottom */
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

/* More Menu Content */
.more-menu-content {
  background: #ffffff;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  max-height: 70vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.more-menu-content.dark-mode {
  background: #1a1626;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.5);
}

.more-menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 600;
  font-size: 1.125rem;
  color: #1f2937;
  flex-shrink: 0;
}

.dark-mode .more-menu-header {
  border-bottom: 1px solid #2d2640;
  color: #e5e7eb;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
}

.dark-mode .close-btn {
  color: #9ca3af;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.dark-mode .close-btn:hover {
  background: #2d2640;
  color: #e5e7eb;
}

.more-menu-items {
  padding: 0.75rem;
  overflow-y: auto;
  flex: 1;
  /* Add safe area padding at bottom for scrollable content */
  padding-bottom: calc(0.75rem + env(safe-area-inset-bottom, 0px));
}

.more-menu-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 1rem 1.25rem;
  background: transparent;
  border: none;
  border-radius: 12px;
  color: #1f2937;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  margin-bottom: 0.25rem;
}

.dark-mode .more-menu-item {
  color: #e5e7eb;
}

.more-menu-item:hover {
  background: #f9fafb;
}

.dark-mode .more-menu-item:hover {
  background: #2d2640;
}

.more-menu-item.active {
  background: #f0f0f0;
}

.dark-mode .more-menu-item.active {
  background: #2d2640;
}

.more-menu-item.profile-item {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
}

.dark-mode .more-menu-item.profile-item {
  background: #0f0d1a;
  border: 1px solid #2d2640;
}

.more-menu-item.profile-item:hover {
  background: #f3f4f6;
}

.dark-mode .more-menu-item.profile-item:hover {
  background: #2d2640;
}

.menu-item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.menu-item-label {
  flex: 1;
  color: #1f2937;
}

.dark-mode .menu-item-label {
  color: #e5e7eb;
}

.mobile-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 1rem 0;
}

.dark-mode .mobile-divider {
  background: #2d2640;
}

/* Mobile User Section */
.mobile-user-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.dark-mode .mobile-user-section {
  border-top: 1px solid #2d2640;
}

.mobile-user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: #f9fafb;
  border-radius: 12px;
}

.dark-mode .mobile-user-profile {
  background: #0f0d1a;
}

.mobile-user-avatar {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #8B5A3C 0%, #6B4423 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
  font-weight: 600;
}

.mobile-user-info {
  flex: 1;
}

.mobile-user-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1f2937;
}

.dark-mode .mobile-user-name {
  color: #e5e7eb;
}

.mobile-user-role {
  font-size: 0.8rem;
  color: #6b7280;
}

.dark-mode .mobile-user-role {
  color: #9ca3af;
}

/* Fade Animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Scale Animation */
.scale-enter-active,
.scale-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}

/* Slide Up Animation */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}

/* ===================================
   RESPONSIVE BREAKPOINTS
   =================================== */
@media (max-width: 1024px) {
  .desktop-sidebar {
    display: none;
  }

  .mobile-bottom-nav {
    display: flex;
  }

  .profile-overlay {
    display: none;
  }

  /* Add body padding to prevent content from going under the nav */
  body {
    padding-bottom: calc(65px + env(safe-area-inset-bottom, 0px));
  }
}

@media (max-width: 768px) {
  .mobile-bottom-nav {
    height: 60px;
  }

  .mobile-icon {
    width: 22px;
    height: 22px;
  }

  .mobile-label {
    font-size: 0.6rem;
  }

  body {
    padding-bottom: calc(60px + env(safe-area-inset-bottom, 0px));
  }
}

/* ===================================
   CRITICAL: Banner active adjustments
   =================================== */
body.banner-active .desktop-sidebar {
  top: 140px !important;
}

body.banner-active .sidebar-toggle-btn {
  top: calc(140px + 1rem) !important;
}

@media (max-width: 768px) {
  body.banner-active .sidebar-toggle-btn {
    top: calc(130px + 1rem) !important;
  }
}

@media (max-width: 480px) {
  body.banner-active .sidebar-toggle-btn {
    top: calc(120px + 1rem) !important;
  }
}

</style>
