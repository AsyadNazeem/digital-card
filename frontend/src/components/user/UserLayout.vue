<template>
  <div :class="['dashboard-wrapper', { 'dark-mode': isDarkMode }]">
    <!-- Top Header -->
    <UserHeader
        @toggle-sidebar="toggleSidebar"
        @open-settings="showSettings = true"
        @toggle-dark-mode="toggleDarkMode"
    />

    <UserNavbar
        v-model="activeTab"
        :sidebar-expanded="sidebarExpanded"
        :user-name="userName"
        :user-role="userRole"
        @toggle-sidebar="toggleSidebar"
        @open-settings="showSettings = true"
        @open-upgrade="showUpgrade = true"
        @logout="logout"
    />

    <!-- MOVE MODALS HERE - OUTSIDE MAIN CONTENT -->
    <UserSettings
        :open="showSettings"
        @close="showSettings = false"
    />

    <UserUpgrade
        :open="showUpgrade"
        :current-plan="userPlan"
        @close="showUpgrade = false"
    />

    <RequestLimitPopup
        :company-count="companyCount"
        :contact-count="contactCount"
        :review-count="reviewCount"
        :user-limits="userLimits"
    />

    <UserPhoneModal
        :show-phone-popup="showPhonePopup"
        @phone-added="handlePhoneAdded"
        @close="showPhonePopup = false"
    />

    <!-- Main Content Area -->
    <main :class="['main-content', { expanded: !sidebarExpanded }]">
      <UserCompanySection
          :active-tab="activeTab"
          :company-count="companyCount"
          :user-limits="userLimits"
          @company-added="companyCount = $event"
          @company-deleted="companyCount = $event"
          @company-updated="loadData"
      />

      <UserContactSection
          :active-tab="activeTab"
          :contact-count="contactCount"
          :user-limits="userLimits"
          @contact-added="contactCount = $event"
          @contact-deleted="contactCount = $event"
          @contact-updated="loadData"
      />

      <UserReviewSection
          v-if="activeTab === 'review'"
          :active-tab="activeTab"
          :review-count="reviewCount"
          :user-limits="userLimits"
          @review-added="reviewCount = $event"
          @review-deleted="reviewCount = $event"
          @review-updated="loadData"
      />

      <UserAnalytics
          v-if="activeTab === 'analytics'"
          :active-tab="activeTab"
          :contacts="contacts"
          :user-plan="userPlan"
          @open-upgrade="showUpgrade = true"
      />

      <UserTheme
          v-if="activeTab === 'theme'"
          :active-tab="activeTab"
      />
    </main>
  </div>
</template>

<script setup>
import {onMounted, provide, ref, watch} from 'vue';
import api from '@/services/api.js';
import UserSettings from '@/components/user/UserSettings.vue';
import RequestLimitPopup from '@/components/user/UserRequestModel.vue';
import UserCompanySection from '@/pages/user/UserCompany.vue';
import UserContactSection from '@/pages/user/UserContact.vue';
import UserReviewSection from '@/pages/user/UserReview.vue';
import UserAnalytics from '@/pages/user/UserAnalytics.vue';
import UserTheme from '@/pages/user/UserThemes.vue';
import UserPhoneModal from '@/components/user/UserPhoneModel.vue';
import UserHeader from "@/components/user/UserHeader.vue";
import UserNavbar from "@/components/user/UserNavbar.vue";
import UserUpgrade from '@/pages/user/UserUpgrade.vue';
import {useRouter} from 'vue-router';

const router = useRouter();

// State
const activeTab = ref('company');
const showSettings = ref(false);
const showPhonePopup = ref(false);
const showUpgrade = ref(false);
const contacts = ref([]);
const sidebarExpanded = ref(true);
const userName = ref('John Doe');
const userRole = ref('User');
const userPlan = ref('free');

// Load dark mode from localStorage (default to false if not set)
const isDarkMode = ref(localStorage.getItem('darkMode') === 'true');

// Counts
const companyCount = ref(0);
const contactCount = ref(0);
const reviewCount = ref(0);

// User limits
const userLimits = ref({
  companyLimit: 3,
  contactLimit: 10,
  reviewLimit: 5,
  role: 'user'
});

// Provide activeTab and isDarkMode to child components
provide('activeTab', activeTab);
provide('isDarkMode', isDarkMode);

// Watch for dark mode changes and save to localStorage
watch(isDarkMode, (newValue) => {
  localStorage.setItem('darkMode', newValue.toString());
}, {immediate: true});

function toggleSidebar() {
  sidebarExpanded.value = !sidebarExpanded.value;
}

function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value;
}

const token = localStorage.getItem('token');

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/login');
}

async function checkUserPhone() {
  if (!token) {
    router.push('/login');
    return;
  }

  try {
    const res = await api.get('/auth/me', {
      headers: {Authorization: `Bearer ${token}`}
    });

    if (res.data.name) userName.value = res.data.name;
    if (res.data.role) userRole.value = res.data.role;

    if (!res.data.phone) {
      showPhonePopup.value = true;
    }
  } catch (err) {
    console.error('Error checking user phone:', err);
    if (err.response?.status === 401) {
      router.push('/login');
    }
  }
}

function handlePhoneAdded(phone) {
  console.log('Phone added:', phone);
  showPhonePopup.value = false;
  loadData();
}

async function loadData() {
  if (!token) {
    router.push('/login');
    return;
  }

  try {
    const res = await api.get('/dashboard/data', {
      headers: {Authorization: `Bearer ${token}`}
    });

    contacts.value = res.data.contacts || [];
    companyCount.value = res.data.companies?.length || 0;
    contactCount.value = res.data.contacts?.length || 0;

    const userRes = await api.get('/auth/me', {
      headers: {Authorization: `Bearer ${token}`}
    });

    const userData = userRes.data;
    userLimits.value = {
      companyLimit: userData.companyLimit || 3,
      contactLimit: userData.contactLimit || 10,
      reviewLimit: userData.reviewLimit || 5,
      role: userData.role || 'user'
    };

    const reviewRes = await api.get('/dashboard/reviews', {
      headers: {Authorization: `Bearer ${token}`}
    });
    reviewCount.value = reviewRes.data.reviews?.length || 0;

    console.log('✅ Dashboard data loaded successfully');
  } catch (err) {
    console.error('❌ Load dashboard error:', err);
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
    } else {
      alert('Error loading dashboard data. Please refresh or log in again.');
    }
  }
}

async function loadUserPlan() {
  try {
    const token = localStorage.getItem('token')
    const res = await api.get('/dashboard/user/plan', {
      headers: {Authorization: `Bearer ${token}`}
    })

    userPlan.value = (res.data.plan || 'free').toLowerCase()

    console.log('✅ USER PLAN:', userPlan.value)
  } catch (err) {
    console.error('❌ Failed to load plan', err)
    userPlan.value = 'free'
  }
}

onMounted(() => {
  checkUserPhone();
  loadData();
  loadUserPlan();
});

defineExpose({
  activeTab
});
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.dashboard-wrapper {
  display: flex;
  min-height: 100vh;
  background: #f8f9fa;
  transition: background 0.3s ease;
}

/* Dark Mode - Professional Dark Purple-Blue */
.dashboard-wrapper.dark-mode {
  background: #0f0d1a;
}

/* Main Content - FIXED */
.main-content {
  margin-top: 64px;
  padding: 2rem;
  min-height: calc(100vh - 64px);
  position: relative;
  z-index: auto;
  overflow-x: hidden;
}

/* Desktop with sidebar - ONLY apply sidebar margins on desktop */
@media (min-width: 1025px) {
  .main-content {
    width: calc(100vw - 260px);
    margin-left: 260px;
  }

  .main-content.expanded {
    width: calc(100vw - 72px);
    margin-left: 72px;
  }
}

/* Tablet and Mobile - NO sidebar margins */
@media (max-width: 1024px) {
  .main-content {
    width: 100vw;
    margin-left: 0 !important;
    /* Add safe area padding for notched devices + bottom nav */
    padding-bottom: calc(80px + env(safe-area-inset-bottom));
    z-index: 1;
  }

  .main-content.expanded {
    width: 100vw;
    margin-left: 0 !important;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
    padding-bottom: calc(80px + env(safe-area-inset-bottom));
  }
}
</style>
