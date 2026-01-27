<template>
  <div v-if="activeTab === 'theme'" class="content-card theme-section">
    <div class="theme-header">
      <div class="theme-header-content">
        <h2 class="theme-title">Choose Your Contact Card Theme</h2>
        <p class="theme-subtitle">
          Personalize your digital business card with beautiful themes
          <span v-if="userPlan === 'free'" class="plan-badge free">Free Plan</span>
          <span v-else class="plan-badge premium">Premium Plan</span>
        </p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="themesLoading" class="themes-loading">
      <div class="spinner"></div>
      <p>Loading themes...</p>
    </div>

    <!-- Theme Grid -->
    <div v-else class="theme-grid">
      <div
          v-for="theme in themes"
          :key="theme.id"
          class="theme-card"
          :class="{
            active: theme.id === selectedTheme,
            disabled: theme.isPremium && userPlan === 'free'
          }"
          @click="handleThemeClick(theme)"
      >
        <!-- Premium Lock Overlay -->
        <div v-if="theme.isPremium && userPlan === 'free'" class="premium-overlay">
          <div class="premium-lock-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <span class="upgrade-text">Upgrade to Premium</span>
        </div>

        <!-- Real Theme Preview -->
        <div class="theme-preview-wrapper">
          <RealThemePreview
              :theme="theme"
              :contact="previewContact"
              :company="previewCompany"
          />

          <!-- Active Badge -->
          <div v-if="theme.id === selectedTheme" class="active-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Active</span>
          </div>

          <!-- Premium Badge -->
          <div v-if="theme.isPremium" class="premium-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span>Premium</span>
          </div>
        </div>

        <!-- Theme Info -->
        <div class="theme-info">
          <h3 class="theme-name">{{ theme.name }}</h3>
          <p v-if="theme.description" class="theme-description">
            {{ theme.description }}
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- Theme Confirmation Modal with Large Preview -->
  <transition name="modal">
    <div v-if="showThemeConfirm" class="modal-overlay" @click="showThemeConfirm = false">
      <div class="theme-confirm-modal" @click.stop>
        <div class="confirm-header">
          <h3>Confirm Theme Change</h3>
          <button @click="showThemeConfirm = false" class="btn-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="confirm-body">
          <!-- Large Real Preview -->
          <div class="confirm-preview-large">
            <RealThemePreview
                v-if="pendingTheme"
                :theme="pendingTheme"
                :contact="previewContact"
                :company="previewCompany"
                :scale="0.8"
            />
          </div>

          <div class="confirm-content">
            <h4>{{ pendingTheme?.name }}</h4>
            <p>{{ pendingTheme?.description || 'Apply this theme to your contact card?' }}</p>

            <div v-if="pendingTheme?.isPremium" class="premium-notice">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span>Premium Theme</span>
            </div>
          </div>
        </div>

        <div class="confirm-actions">
          <button @click="showThemeConfirm = false" class="btn-cancel">
            Cancel
          </button>
          <button @click="applySelectedTheme" class="btn-confirm" :disabled="themeLoading">
            <svg v-if="!themeLoading" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <div v-if="themeLoading" class="spinner-small"></div>
            <span>{{ themeLoading ? 'Applying...' : 'Apply Theme' }}</span>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api.js';
import RealThemePreview from '@/components/RealThemePreview.vue';

const props = defineProps({
  activeTab: {
    type: String,
    required: true
  }
});

// State
const themes = ref([]);
const selectedTheme = ref(null);
const userPlan = ref('free');
const showThemeConfirm = ref(false);
const pendingTheme = ref(null);
const themeLoading = ref(false);
const themesLoading = ref(true);

// Preview data - sample data for theme previews
const previewContact = ref({
  firstName: 'John',
  lastName: 'Doe',
  designation: 'CEO & Founder',
  mobile: '+1234567890',
  email: 'john@company.com',
  photo: null
});

const previewCompany = ref({
  companyName: 'Tech Solutions Inc.',
  bio: 'Leading the future of digital innovation',
  website: 'www.company.com',
  phone: '+1234567890',
  logo: null,
  googleLocation: 'https://maps.google.com',
  view360: null,
  googleReviews: null,
  tripAdvisor: null,
  socialLinks: {
    facebook: 'https://facebook.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com'
  }
});

// Load themes and user data
async function loadThemesAndData() {
  try {
    themesLoading.value = true;

    // Load themes
    const themesRes = await api.get('/themes');
    themes.value = themesRes.data;

    // Load user data
    const userRes = await api.get('/auth/me');
    selectedTheme.value = userRes.data.selectedThemeId;
    userPlan.value = userRes.data.plan || 'free';

    // Try to load user's actual data for preview
    try {
      const dashData = await api.get('/dashboard/data');

      if (dashData.data.contacts?.[0]) {
        previewContact.value = dashData.data.contacts[0];
      }

      if (dashData.data.companies?.[0]) {
        previewCompany.value = dashData.data.companies[0];
      }
    } catch (err) {
      console.log('Using sample data for preview');
    }

  } catch (err) {
    console.error('Failed to load themes:', err);
    alert('Failed to load themes. Please refresh the page.');
  } finally {
    themesLoading.value = false;
  }
}

// Handle theme click
function handleThemeClick(theme) {
  // Check if theme is premium and user is on free plan
  if (theme.isPremium && userPlan.value === 'free') {
    alert('⭐ This is a premium theme. Upgrade your plan to unlock premium themes!');
    return;
  }

  // Show confirmation modal
  pendingTheme.value = theme;
  showThemeConfirm.value = true;
}

// Apply selected theme
async function applySelectedTheme() {
  if (!pendingTheme.value) return;

  try {
    themeLoading.value = true;

    const response = await api.post('/themes/select', {
      themeId: pendingTheme.value.id
    });

    // Update selected theme
    selectedTheme.value = pendingTheme.value.id;

    // Close modal
    showThemeConfirm.value = false;

    // Show success message
    alert('✅ Theme applied successfully! Your contact card has been updated.');

  } catch (err) {
    console.error('Failed to apply theme:', err);

    if (err.response?.data?.isPremium) {
      alert('⭐ ' + err.response.data.message);
    } else {
      alert('❌ Failed to apply theme. Please try again.');
    }
  } finally {
    themeLoading.value = false;
  }
}

// Load themes when component mounts
onMounted(() => {
  if (props.activeTab === 'theme') {
    loadThemesAndData();
  }
});
</script>

<style scoped>
/* Base Styles */
.content-card.theme-section {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid #f3f4f6;
  padding: 0;
  min-height: calc(100vh - 260px);
}

/* Theme Header */
.theme-header {
  background: linear-gradient(135deg, #FDF8F3 0%, #F5EBE0 100%);
  padding: 2rem;
  border-bottom: 2px solid #E8D5C4;
}

.theme-header-content {
  max-width: 1400px;
  margin: 0 auto;
}

.theme-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #6B4423;
  margin: 0 0 0.75rem 0;
  letter-spacing: -0.02em;
}

.theme-subtitle {
  font-size: 1rem;
  color: #64748b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.plan-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 1px solid;
}

.plan-badge.free {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1e40af;
  border-color: #93c5fd;
}

.plan-badge.premium {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: #ffffff;
  border-color: #f59e0b;
  box-shadow: 0 2px 8px rgba(251, 191, 36, 0.3);
}

/* Loading State */
.themes-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1.5rem;
  min-height: 400px;
}

.themes-loading p {
  color: #64748b;
  font-size: 1rem;
  font-weight: 500;
}

.spinner {
  width: 3rem;
  height: 3rem;
  border: 4px solid #E8D5C4;
  border-top-color: #8B5A3C;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner-small {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

/* Theme Grid */
.theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* Theme Card */
.theme-card {
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid #E8D5C4;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
}

.theme-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(107, 68, 35, 0.15);
  border-color: #8B5A3C;
}

.theme-card.active {
  border-color: #8B5A3C;
  box-shadow: 0 0 0 4px rgba(139, 90, 60, 0.15);
}

.theme-card.active:hover {
  transform: translateY(-4px);
  box-shadow: 0 0 0 4px rgba(139, 90, 60, 0.15), 0 12px 32px rgba(107, 68, 35, 0.15);
}

.theme-card.disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.theme-card.disabled:hover {
  transform: none;
  box-shadow: none;
  border-color: #E8D5C4;
}

/* Premium Overlay */
.premium-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(107, 68, 35, 0.95);
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.3s;
}

.theme-card.disabled:hover .premium-overlay {
  opacity: 1;
}

.premium-lock-icon {
  width: 3.5rem;
  height: 3.5rem;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 24px rgba(251, 191, 36, 0.4);
  animation: pulse-lock 2s ease-in-out infinite;
}

@keyframes pulse-lock {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 8px 24px rgba(251, 191, 36, 0.4);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 12px 32px rgba(251, 191, 36, 0.6);
  }
}

.upgrade-text {
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Theme Preview - Compact Card Style */
.theme-preview-wrapper {
  position: relative;
  height: 240px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

/* Scale down the preview to fit nicely */
.theme-preview-wrapper :deep(.theme-preview-content) {
  transform: scale(0.35);
  transform-origin: center center;
  width: 400px;
  height: 600px;
  pointer-events: none;
}

/* Preview Zoom Effect on Hover */
.theme-card:hover .theme-preview-wrapper :deep(.theme-preview-content) {
  transform: scale(0.38);
  transition: transform 0.3s ease;
}

/* Badges */
.active-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: linear-gradient(135deg, #8B5A3C 0%, #6B4423 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(107, 68, 35, 0.4);
  z-index: 5;
  animation: bounce-in 0.5s ease-out;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.premium-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: white;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.4);
  z-index: 5;
}

.premium-badge svg {
  animation: sparkle 2s ease-in-out infinite;
}

@keyframes sparkle {
  0%, 100% {
    transform: rotate(0deg) scale(1);
  }
  25% {
    transform: rotate(-10deg) scale(1.1);
  }
  75% {
    transform: rotate(10deg) scale(1.1);
  }
}

/* Theme Info */
.theme-info {
  padding: 1.25rem;
  border-top: 2px solid #f3f4f6;
  background: #ffffff;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.theme-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.theme-description {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Preview Button Overlay */
.preview-overlay {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 5;
}

.theme-card:hover .preview-overlay {
  opacity: 1;
}

.btn-preview {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: rgba(139, 90, 60, 0.95);
  backdrop-filter: blur(8px);
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.btn-preview:hover {
  background: rgba(107, 68, 35, 0.95);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.theme-confirm-modal {
  background: #ffffff;
  border-radius: 16px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  animation: modalSlideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid #E8D5C4;
}

@keyframes modalSlideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.confirm-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #FDF8F3 0%, #F5EBE0 100%);
  border-bottom: 2px solid #E8D5C4;
}

.confirm-header h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #6B4423;
  margin: 0;
}

.btn-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: #fef2f2;
  color: #dc2626;
  border: 2px solid #fecaca;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-close:hover {
  background: #fee2e2;
  transform: rotate(90deg);
}

.confirm-body {
  padding: 2rem;
  overflow-y: auto;
  flex: 1;
  background: #f8fafc;
}

/* Large Preview Container */
.confirm-preview-large {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
  overflow: auto;
  border: 2px solid #E8D5C4;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.05);
  max-height: 600px;
}

/* Full size preview in modal */
.confirm-preview-large :deep(.theme-preview-content) {
  transform: scale(0.75);
  transform-origin: top center;
}

.confirm-content {
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  border: 2px solid #E8D5C4;
}

.confirm-content h4 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.confirm-content p {
  font-size: 0.9375rem;
  color: #64748b;
  margin: 0 0 1rem 0;
  line-height: 1.6;
}

.premium-notice {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 10px;
  color: #92400e;
  font-size: 0.9375rem;
  font-weight: 600;
  border: 1px solid #fcd34d;
}

.premium-notice svg {
  flex-shrink: 0;
}

.confirm-actions {
  display: flex;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-top: 2px solid #E8D5C4;
  background: #ffffff;
}

.btn-cancel,
.btn-confirm {
  flex: 1;
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
}

.btn-cancel {
  background: #f3f4f6;
  color: #64748b;
  border: 2px solid #e5e7eb;
}

.btn-cancel:hover {
  background: #e5e7eb;
  color: #475569;
}

.btn-confirm {
  background: linear-gradient(135deg, #8B5A3C 0%, #6B4423 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(107, 68, 35, 0.25);
}

.btn-confirm:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(107, 68, 35, 0.35);
}

.btn-confirm:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .theme-confirm-modal,
.modal-leave-active .theme-confirm-modal {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from .theme-confirm-modal,
.modal-leave-to .theme-confirm-modal {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

/* Scrollbar Styling */
.confirm-body::-webkit-scrollbar {
  width: 8px;
}

.confirm-body::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.confirm-body::-webkit-scrollbar-thumb {
  background: #8B5A3C;
  border-radius: 4px;
}

.confirm-body::-webkit-scrollbar-thumb:hover {
  background: #6B4423;
}

/* Tablet */
@media (max-width: 1024px) {
  .content-card.theme-section {
    border-radius: 12px;
  }

  .theme-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
    padding: 1.5rem;
  }

  .theme-preview-wrapper {
    height: 220px;
  }

  .theme-card {
    border-radius: 10px;
  }
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .content-card.theme-section {
    border-radius: 12px;
    padding: 0;
  }

  .theme-grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
    padding: 1rem;
  }

  .theme-header {
    padding: 1.5rem 1rem;
  }

  .theme-title {
    font-size: 1.5rem;
  }

  .theme-subtitle {
    font-size: 0.875rem;
  }

  .theme-preview-wrapper {
    height: 200px;
  }

  .theme-card {
    border-radius: 10px;
  }

  .theme-card:hover {
    transform: none;
  }

  /* Disable preview zoom on mobile */
  .theme-card:hover .theme-preview-wrapper :deep(.theme-preview-content) {
    transform: scale(0.35);
  }

  .theme-confirm-modal {
    max-width: calc(100% - 1rem);
    max-height: calc(100vh - 1rem);
    border-radius: 12px;
  }

  .confirm-header {
    padding: 1rem 1.25rem;
  }

  .confirm-header h3 {
    font-size: 1.25rem;
  }

  .confirm-body {
    padding: 1.25rem;
  }

  .confirm-preview-large {
    padding: 1rem;
    max-height: 450px;
    overflow-x: auto;
  }

  .confirm-preview-large :deep(.theme-preview-content) {
    transform: scale(0.6);
    min-width: 400px;
  }

  .confirm-content {
    padding: 1rem;
  }

  .confirm-actions {
    padding: 1rem 1.25rem;
    flex-direction: column;
    gap: 0.75rem;
  }

  .btn-cancel,
  .btn-confirm {
    width: 100%;
    padding: 0.875rem 1rem;
  }

  .theme-info {
    padding: 1rem;
  }

  .theme-name {
    font-size: 1rem;
  }

  .theme-description {
    font-size: 0.8125rem;
    -webkit-line-clamp: 2;
  }

  /* Active and Premium badges smaller on mobile */
  .active-badge {
    padding: 0.375rem 0.875rem;
    font-size: 0.75rem;
    top: 0.75rem;
    right: 0.75rem;
  }

  .premium-badge {
    padding: 0.3125rem 0.625rem;
    font-size: 0.6875rem;
    top: 0.75rem;
    left: 0.75rem;
  }

  /* Premium overlay adjustments */
  .premium-lock-icon {
    width: 3rem;
    height: 3rem;
  }

  .upgrade-text {
    font-size: 0.8125rem;
  }
}

/* Extra Large Screens */
@media (min-width: 1400px) {
  .theme-grid {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }

  .theme-preview-wrapper {
    height: 260px;
  }
}

/* Small Screens Portrait */
@media (max-width: 480px) {
  .content-card.theme-section {
    border-radius: 8px;
  }

  .theme-header {
    padding: 1.25rem 1rem;
  }

  .theme-title {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
  }

  .theme-subtitle {
    font-size: 0.8125rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .plan-badge {
    padding: 0.25rem 0.625rem;
    font-size: 0.6875rem;
  }

  .theme-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1rem;
  }

  .theme-card {
    border-radius: 8px;
  }

  .theme-preview-wrapper {
    height: 200px;
  }

  /* Keep same scale on very small screens */
  .theme-preview-wrapper :deep(.theme-preview-content) {
    transform: scale(0.35);
  }

  .theme-card:hover .theme-preview-wrapper :deep(.theme-preview-content) {
    transform: scale(0.35);
  }

  .theme-info {
    padding: 0.875rem;
  }

  .theme-name {
    font-size: 0.9375rem;
  }

  .theme-description {
    font-size: 0.8125rem;
  }

  .active-badge {
    padding: 0.3125rem 0.75rem;
    font-size: 0.6875rem;
    top: 0.5rem;
    right: 0.5rem;
  }

  .active-badge svg {
    width: 14px;
    height: 14px;
  }

  .premium-badge {
    padding: 0.25rem 0.5rem;
    font-size: 0.6875rem;
    top: 0.5rem;
    left: 0.5rem;
  }

  .premium-badge svg {
    width: 10px;
    height: 10px;
  }

  .premium-lock-icon {
    width: 2.5rem;
    height: 2.5rem;
  }

  .premium-lock-icon svg {
    width: 20px;
    height: 20px;
  }

  .upgrade-text {
    font-size: 0.75rem;
  }

  /* Modal adjustments */
  .theme-confirm-modal {
    max-width: calc(100% - 1rem);
    max-height: calc(100vh - 1rem);
    border-radius: 10px;
  }

  .confirm-header {
    padding: 0.875rem 1rem;
  }

  .confirm-header h3 {
    font-size: 1.125rem;
  }

  .btn-close {
    width: 32px;
    height: 32px;
  }

  .btn-close svg {
    width: 18px;
    height: 18px;
  }

  .confirm-body {
    padding: 1rem;
  }

  .confirm-preview-large {
    padding: 0.75rem;
    max-height: 400px;
    border-radius: 8px;
  }

  .confirm-preview-large :deep(.theme-preview-content) {
    transform: scale(0.5);
    min-width: 360px;
  }

  .confirm-content {
    padding: 0.875rem;
    border-radius: 8px;
  }

  .confirm-content h4 {
    font-size: 1rem;
  }

  .confirm-content p {
    font-size: 0.875rem;
  }

  .premium-notice {
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    border-radius: 8px;
  }

  .premium-notice svg {
    width: 18px;
    height: 18px;
  }

  .confirm-actions {
    padding: 1rem;
    gap: 0.625rem;
  }

  .btn-cancel,
  .btn-confirm {
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    border-radius: 10px;
  }

  .btn-cancel svg,
  .btn-confirm svg {
    width: 14px;
    height: 14px;
  }

  /* Loading state */
  .themes-loading {
    padding: 3rem 1rem;
    min-height: 300px;
  }

  .themes-loading p {
    font-size: 0.875rem;
  }

  .spinner {
    width: 2.5rem;
    height: 2.5rem;
  }
}

/* Add Click Indicator */
.theme-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 12px;
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
  background: radial-gradient(circle at center, rgba(139, 90, 60, 0.1) 0%, transparent 70%);
}

.theme-card:active::after {
  opacity: 1;
}

/* Improve Accessibility */
.theme-card:focus-visible {
  outline: 3px solid #8B5A3C;
  outline-offset: 2px;
}

.btn-confirm:focus-visible,
.btn-cancel:focus-visible,
.btn-close:focus-visible {
  outline: 3px solid #8B5A3C;
  outline-offset: 2px;
}
</style>
