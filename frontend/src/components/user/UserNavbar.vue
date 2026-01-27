<template>
  <!-- Desktop Sidebar -->
  <aside :class="['desktop-sidebar', { collapsed: !sidebarExpanded }]">
    <nav class="sidebar-nav">
      <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="selectTab(tab.id)"
          :class="['nav-item', { active: modelValue === tab.id }]"
          :title="tab.label"
      >
        <span class="nav-icon" v-html="tab.icon"></span>
        <span class="nav-label">{{ tab.label }}</span>
      </button>
    </nav>

    <!-- User Profile Section -->
    <div class="sidebar-footer">
      <button class="user-profile" @click="showProfilePopup = !showProfilePopup">
        <div class="user-avatar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <div class="user-info">
          <div class="user-name">{{ userName }}</div>
          <div class="user-role">{{ userRole }}</div>
        </div>
      </button>
    </div>
  </aside>

  <!-- Desktop Profile Popup -->
  <transition name="fade">
    <div v-if="showProfilePopup" class="profile-overlay" @click="showProfilePopup = false">
      <transition name="scale">
        <div v-if="showProfilePopup" class="profile-popup desktop-popup" @click.stop>
          <!-- User Header -->
          <div class="profile-header">
            <div class="profile-user-info">
              <div class="profile-avatar">
                {{ userInitials }}
              </div>
              <div class="profile-details">
                <div class="profile-name">{{ userName }}</div>
                <div class="profile-plan">{{ userRole }}</div>
              </div>
            </div>
          </div>

          <!-- Profile Menu Items -->
          <div class="profile-menu">
            <button
                v-for="item in profileMenuItems"
                :key="item.id"
                @click="handleProfileAction(item.id)"
                class="profile-menu-item"
            >
              <span class="profile-item-icon" v-html="item.icon"></span>
              <span class="profile-item-label">{{ item.label }}</span>
              <svg v-if="item.hasChevron" class="chevron-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>

            <!-- Divider before logout -->
            <div class="profile-divider"></div>

            <button @click="handleProfileAction('logout')" class="profile-menu-item logout-item">
              <span class="profile-item-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </span>
              <span class="profile-item-label">Log out</span>
            </button>
          </div>
        </div>
      </transition>
    </div>
  </transition>

  <!-- Mobile Bottom Navigation -->
  <nav class="mobile-bottom-nav">
    <button
        v-for="tab in tabs.slice(0, 4)"
        :key="tab.id"
        @click="selectTab(tab.id)"
        :class="['mobile-nav-item', { active: modelValue === tab.id }]"
    >
      <span class="mobile-icon" v-html="tab.icon"></span>
      <span class="mobile-label">{{ tab.label }}</span>
    </button>

    <!-- More Button -->
    <button
        @click="showMoreMenu = !showMoreMenu"
        class="mobile-nav-item"
        :class="{ active: showMoreMenu }"
    >
      <span class="mobile-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </span>
      <span class="mobile-label">More</span>
    </button>
  </nav>

  <!-- Mobile More Menu Popup -->
  <transition name="fade">
    <div v-if="showMoreMenu" class="more-menu-overlay" @click="showMoreMenu = false">
      <transition name="slide-up">
        <div v-if="showMoreMenu" class="more-menu-popup" @click.stop>
          <div class="more-menu-content">
            <div class="more-menu-header">
              <span>More Options</span>
              <button @click="showMoreMenu = false" class="close-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div class="more-menu-items">
              <!-- Additional Tabs -->
              <button
                  v-for="tab in tabs.slice(4)"
                  :key="tab.id"
                  @click="selectTabAndClose(tab.id)"
                  :class="['more-menu-item', { active: modelValue === tab.id }]"
              >
                <span class="menu-item-icon" v-html="tab.icon"></span>
                <span class="menu-item-label">{{ tab.label }}</span>
              </button>

              <!-- Divider -->
              <div class="mobile-divider"></div>

              <!-- Settings & Upgrade Plan -->
              <button
                  v-for="item in mobileProfileItems"
                  :key="item.id"
                  @click="handleMobileProfileAction(item.id)"
                  class="more-menu-item profile-item"
              >
                <span class="menu-item-icon" v-html="item.icon"></span>
                <span class="menu-item-label">{{ item.label }}</span>
                <svg v-if="item.hasChevron" class="chevron-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>

              <!-- User Profile -->
              <div class="mobile-user-section">
                <button
                    class="mobile-user-profile"
                    @click="showProfilePopup = !showProfilePopup"
                >
                  <div class="mobile-user-avatar">{{ userInitials }}</div>

                  <div class="mobile-user-info">
                    <div class="mobile-user-name">{{ userName }}</div>
                    <div class="mobile-user-role">{{ userRole }}</div>
                  </div>

                  <!-- Dynamic Arrow -->
                  <div
                      class="mobile-user-arrow"
                      :class="{ open: showProfilePopup }"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </button>
              </div>

            </div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed } from 'vue';

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

const emit = defineEmits(['update:modelValue', 'toggle-sidebar', 'open-settings', 'open-upgrade']);

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
    label: 'Company',
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"></path></svg>'
  },
  {
    id: 'contact',
    label: 'Contacts',
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path></svg>'
  },
  {
    id: 'review',
    label: 'Review',
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>'
  },
  {
    id: 'theme',
    label: 'Themes',
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="13.5" cy="6.5" r=".5"></circle><circle cx="17.5" cy="10.5" r=".5"></circle><circle cx="8.5" cy="7.5" r=".5"></circle><circle cx="6.5" cy="12.5" r=".5"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path></svg>'
  },
];

const profileMenuItems = [
  {
    id: 'settings',
    label: 'Settings',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M12 1v6m0 6v6m5.2-13.2l-4.2 4.2m0 6l4.2 4.2M23 12h-6m-6 0H1m18.2 5.2l-4.2-4.2m0-6l4.2-4.2"></path></svg>',
    hasChevron: true
  },
  {
    id: 'upgrade',
    label: 'Upgrade plan',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>',
    hasChevron: false
  },
];

// const mobileProfileItems = [
//   {
//     id: 'settings',
//     label: 'Settings',
//     icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M12 1v6m0 6v6m5.2-13.2l-4.2 4.2m0 6l4.2 4.2M23 12h-6m-6 0H1m18.2 5.2l-4.2-4.2m0-6l4.2-4.2"></path></svg>',
//     hasChevron: true
//   },
//   {
//     id: 'upgrade',
//     label: 'Upgrade plan',
//     icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>',
//     hasChevron: false
//   }
// ];

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
    emit('logout');
  }

}


function handleMobileProfileAction(actionId) {
  showMoreMenu.value = false;

  if (actionId === 'upgrade') {
    emit('open-upgrade');
  }

  if (actionId === 'settings') {
    emit('open-settings');
  }
}

</script>

<style scoped>
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
  transition: width 0.3s ease, top 0.3s ease;
  z-index: 900;
  overflow: hidden;
}

.desktop-sidebar.collapsed {
  width: 72px;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0.5rem;
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

.nav-item:hover {
  background: #f3f4f6;
  color: #8B5A3C;
}

.nav-item.active {
  background: #FDF8F3;
  color: #8B5A3C;
  font-weight: 600;
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
}

.desktop-sidebar.collapsed .nav-label {
  display: none;
}

.desktop-sidebar.collapsed .nav-item {
  justify-content: center;
  padding: 0.75rem;
}

/* Sidebar Footer */
.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
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
}

.user-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 0.75rem;
  color: #6b7280;
}

.desktop-sidebar.collapsed .user-info {
  display: none;
}

.desktop-sidebar.collapsed .user-profile {
  justify-content: center;
  padding: 0.5rem;
}

/* Profile Popup Overlay */
.profile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1100;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
}

/* Desktop Profile Popup */
.profile-popup.desktop-popup {
  position: absolute;
  left: 20px;
  bottom: 90px;
  width: 280px;
  background: #2b2b2b;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  color: #e5e5e5;
}

/* Profile Header */
.profile-header {
  padding: 1rem;
  border-bottom: 1px solid #404040;
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
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.profile-plan {
  font-size: 0.75rem;
  color: #a0a0a0;
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
  color: #e5e5e5;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.profile-menu-item:hover {
  background: #383838;
}

.profile-item-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  color: #a0a0a0;
}

.profile-item-label {
  flex: 1;
}

.chevron-icon {
  flex-shrink: 0;
  color: #606060;
}

.profile-divider {
  height: 1px;
  background: #404040;
  margin: 0.5rem 0;
}

.logout-item {
  color: #ef4444;
}

.logout-item .profile-item-icon {
  color: #ef4444;
}

.logout-item:hover {
  background: rgba(239, 68, 68, 0.1);
}

/* Mobile Bottom Navigation */
.mobile-bottom-nav {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 65px;
  background: #ffffff;
  border-top: 1px solid #e5e7eb;
  z-index: 1000;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
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

.mobile-nav-item.active {
  color: #000;
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

/* More Menu Overlay */
.more-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1001;
  display: flex;
  align-items: flex-end;
}

/* More Menu Popup */
.more-menu-popup {
  width: 100%;
}

.more-menu-content {
  background: #ffffff;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  max-height: 70vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
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

.close-btn:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.more-menu-items {
  padding: 0.75rem;
  overflow-y: auto;
  flex: 1;
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

.more-menu-item:hover {
  background: #f9fafb;
}

.more-menu-item.active {
  background: #f0f0f0;
}

.more-menu-item.profile-item {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
}

.more-menu-item.profile-item:hover {
  background: #f3f4f6;
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

.mobile-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 1rem 0;
}

/* Mobile User Section */
.mobile-user-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.mobile-user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: #f9fafb;
  border-radius: 12px;
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

.mobile-user-role {
  font-size: 0.8rem;
  color: #6b7280;
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
}

:global(body.banner-active) .desktop-sidebar {
  top: 140px;
}

</style>
