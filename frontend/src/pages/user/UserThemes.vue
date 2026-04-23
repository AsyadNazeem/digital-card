<template>
  <div v-if="activeTab === 'theme'" :class="['content-card', 'theme-section', { 'dark-mode': isDarkMode }]">
    <div class="theme-header">
      <div class="theme-header-content">
        <h2 class="theme-title">Customize Your Contact Card</h2>
        <p class="theme-subtitle">
          Choose your layout structure and visual style
          <span v-if="userPlan === 'free'" class="plan-badge free">Free Plan</span>
          <span v-else class="plan-badge premium">Premium Plan</span>
        </p>
      </div>
    </div>

    <!-- Sub-Tabs: Structural vs Style -->
    <div class="sub-tabs">
      <button
          class="sub-tab"
          :class="{ active: subTab === 'structural' }"
          @click="subTab = 'structural'"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
        <span>Structural Changes</span>
        <span class="sub-tab-desc">Layout Structure</span>
      </button>

      <button
          class="sub-tab"
          :class="{ active: subTab === 'style' }"
          @click="subTab = 'style'"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
        </svg>
        <span>Style Changes</span>
        <span class="sub-tab-desc">Colors & Themes</span>
      </button>
    </div>

    <!-- STRUCTURAL CHANGES TAB - Shows Layout Options -->
    <div v-if="subTab === 'structural'" class="tab-content">
      <div class="info-banner">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
        <span>Choose your card layout structure. This changes how buttons and sections are arranged.</span>
      </div>

      <div class="theme-grid">
        <!-- Classic Layout Option -->
        <div
            class="theme-card"
            :class="{ active: currentLayoutType === 'classic' }"
            @click="selectLayout('classic')"
        >
          <div class="theme-preview-wrapper structural-preview">
            <!-- Show LayoutClassic.vue preview -->
            <div class="layout-preview-classic">
              <div class="preview-header">Header</div>
              <div class="preview-grid-3x2">
                <div class="preview-btn">Phone</div>
                <div class="preview-btn">WhatsApp</div>
                <div class="preview-btn">Email</div>
                <div class="preview-btn">Office</div>
                <div class="preview-btn">Website</div>
                <div class="preview-btn">Location</div>
              </div>
              <div class="preview-save">Save Contact</div>
              <div class="preview-secondary">
                <div class="preview-btn-small">360°</div>
                <div class="preview-btn-small">Reviews</div>
                <div class="preview-btn-small">Shop</div>
              </div>
            </div>

            <div v-if="currentLayoutType === 'classic'" class="active-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Active</span>
            </div>
          </div>

          <div class="theme-info">
            <h3 class="theme-name">Classic Grid</h3>
            <p class="theme-description">Traditional 3×2 button grid layout</p>
            <ul class="feature-list">
              <li>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                3×2 Grid Buttons
              </li>
              <li>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Traditional Layout
              </li>
              <li>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                All Features
              </li>
            </ul>
          </div>
        </div>

        <!-- Modern Layout Option -->
        <div
            class="theme-card"
            :class="{ active: currentLayoutType === 'modern' }"
            @click="selectLayout('modern')"
        >
          <div class="theme-preview-wrapper structural-preview">
            <!-- Show LayoutModern.vue preview -->
            <div class="layout-preview-modern">
              <div class="preview-hero">
                <div class="preview-avatar"></div>
                <div class="preview-name">Name</div>
              </div>
              <div class="preview-vertical">
                <div class="preview-btn-full">Phone</div>
                <div class="preview-btn-full">WhatsApp</div>
                <div class="preview-btn-full">Email</div>
                <div class="preview-btn-full">Website</div>
              </div>
              <div class="preview-floating">💾 Save</div>
            </div>

            <div v-if="currentLayoutType === 'modern'" class="active-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Active</span>
            </div>
          </div>

          <div class="theme-info">
            <h3 class="theme-name">Modern Hero</h3>
            <p class="theme-description">Full-width hero header with vertical stack</p>
            <ul class="feature-list">
              <li>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Hero Header
              </li>
              <li>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Vertical Buttons
              </li>
              <li>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Floating Save Button
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- STYLE CHANGES TAB - Shows Color/CSS Themes -->
    <div v-if="subTab === 'style'" class="tab-content">
      <div class="current-layout-banner">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
        <div>
          <strong>Current Layout:</strong> {{ currentLayoutType === 'modern' ? 'Modern Hero' : 'Classic Grid' }}
          <span class="change-layout" @click="subTab = 'structural'">Change Layout →</span>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="themesLoading" class="themes-loading">
        <div class="spinner"></div>
        <p>Loading style themes...</p>
      </div>

      <!-- Style Themes Grid (from database - CSS only) -->
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

          <!-- Real Theme Preview (using RealThemePreview component) -->
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
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
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
  </div>

  <!-- Confirmation Modal -->
  <transition name="modal">
    <div v-if="showConfirmModal" class="modal-overlay" @click="showConfirmModal = false">
      <div class="theme-confirm-modal" @click.stop>
        <div class="confirm-header">
          <h3>{{ confirmType === 'structural' ? 'Change Layout Structure' : 'Change Style Theme' }}</h3>
          <button @click="showConfirmModal = false" class="btn-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="confirm-body">
          <!-- LARGE PREVIEW SECTION -->
          <div class="confirm-preview-large">
            <!-- Show Style Theme Preview (RealThemePreview component) -->
            <div v-if="confirmType === 'style' && pendingChange" class="modal-theme-preview">
              <RealThemePreview
                  :theme="pendingChange"
                  :contact="previewContact"
                  :company="previewCompany"
              />
            </div>

            <!-- Show Structural Layout Preview -->
            <div v-if="confirmType === 'structural'" class="modal-layout-preview">
              <!-- Classic Layout Preview -->
              <div v-if="pendingChange === 'classic'" class="layout-preview-classic-large">
                <div class="preview-header">Header</div>
                <div class="preview-grid-3x2">
                  <div class="preview-btn">Phone</div>
                  <div class="preview-btn">WhatsApp</div>
                  <div class="preview-btn">Email</div>
                  <div class="preview-btn">Office</div>
                  <div class="preview-btn">Website</div>
                  <div class="preview-btn">Location</div>
                </div>
                <div class="preview-save">Save Contact</div>
                <div class="preview-secondary">
                  <div class="preview-btn-small">360°</div>
                  <div class="preview-btn-small">Reviews</div>
                  <div class="preview-btn-small">Shop</div>
                </div>
              </div>

              <!-- Modern Layout Preview -->
              <div v-if="pendingChange === 'modern'" class="layout-preview-modern-large">
                <div class="preview-hero">
                  <div class="preview-avatar"></div>
                  <div class="preview-name">John Doe</div>
                  <div class="preview-title">CEO & Founder</div>
                </div>
                <div class="preview-vertical">
                  <div class="preview-btn-full">📞 Phone</div>
                  <div class="preview-btn-full">💬 WhatsApp</div>
                  <div class="preview-btn-full">📧 Email</div>
                  <div class="preview-btn-full">🌐 Website</div>
                </div>
                <div class="preview-floating">💾 Save Contact</div>
              </div>
            </div>
          </div>

          <!-- THEME DETAILS -->
          <div class="confirm-content">
            <h4>{{ pendingChange?.name || (pendingChange === 'classic' ? 'Classic Grid' : 'Modern Hero') }}</h4>
            <p>{{ pendingChange?.description || 'Apply this ' + confirmType + ' change to your contact card?' }}</p>

            <div v-if="confirmType === 'structural'" class="theme-details">
              <div class="detail-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                <span><strong>Layout:</strong> {{ pendingChange === 'modern' ? 'Modern Hero' : 'Classic Grid' }}</span>
              </div>
            </div>

            <div v-if="pendingChange?.isPremium" class="premium-notice">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span>Premium Theme</span>
            </div>
          </div>
        </div>

        <div class="confirm-actions">
          <button @click="showConfirmModal = false" class="btn-cancel">Cancel</button>
          <button @click="applyChange" class="btn-confirm" :disabled="applying">
            <svg v-if="!applying" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <div v-if="applying" class="spinner-small"></div>
            <span>{{ applying ? 'Applying...' : 'Apply Changes' }}</span>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue';
import api from '@/services/api.js';
import RealThemePreview from '@/components/RealThemePreview.vue';

const isDarkMode = inject('isDarkMode', ref(false));

const props = defineProps({
  activeTab: {
    type: String,
    required: true
  }
});

// State
const subTab = ref('structural');
const currentLayoutType = ref('classic'); // classic or modern
const themes = ref([]); // CSS themes from database
const selectedTheme = ref(null);
const userPlan = ref('free');
const themesLoading = ref(true);
const applying = ref(false);

const showConfirmModal = ref(false);
const confirmType = ref('structural'); // 'structural' or 'style'
const pendingChange = ref(null);

// Preview data
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

// Select layout (structural change)
function selectLayout(layoutType) {
  confirmType.value = 'structural';
  pendingChange.value = layoutType;
  showConfirmModal.value = true;
}

// Handle theme click (style change)
function handleThemeClick(theme) {
  if (theme.isPremium && userPlan.value === 'free') {
    alert('⭐ This is a premium theme. Upgrade your plan to unlock premium themes!');
    return;
  }

  confirmType.value = 'style';
  pendingChange.value = theme;
  showConfirmModal.value = true;
}

// Apply changes
// Replace your applyChange() function with this:

// ThemeSection.vue - Replace your applyChange() function with this:

async function applyChange() {
  if (!pendingChange.value) return;

  try {
    applying.value = true;

    if (confirmType.value === 'structural') {
      // ============================================
      // STRUCTURAL: Update current theme's layoutType
      // ============================================

      const currentThemeObj = themes.value.find(t => t.id === selectedTheme.value);

      if (!currentThemeObj) {
        alert('❌ No theme selected. Please select a style theme first.');
        return;
      }

      // Update the theme's layoutType
      const response = await api.patch(`/themes/${currentThemeObj.id}`, {
        layoutType: pendingChange.value  // 'classic' or 'modern'
      });

      if (response.data) {
        // Update local state
        currentLayoutType.value = pendingChange.value;
        currentThemeObj.layoutType = pendingChange.value;

        alert(`✅ Layout changed to ${pendingChange.value === 'modern' ? 'Modern Hero' : 'Classic Grid'}! Refresh your public card to see changes.`);
      }

    } else {
      // ============================================
      // STYLE: Update selected theme
      // ============================================
      const response = await api.post('/themes/select', {
        themeId: pendingChange.value.id
      });

      if (response.data) {
        selectedTheme.value = pendingChange.value.id;
        currentLayoutType.value = pendingChange.value.layoutType || 'classic';

        alert(`✅ Theme "${pendingChange.value.name}" applied successfully!`);
      }
    }

    showConfirmModal.value = false;

  } catch (err) {
    console.error('Failed to apply change:', err);
    alert(`❌ ${err.response?.data?.message || 'Failed to apply changes'}`);
  } finally {
    applying.value = false;
  }
}

// Load themes and user data
async function loadThemesAndData() {
  try {
    themesLoading.value = true;

    // Load CSS themes
    const themesRes = await api.get('/themes');
    themes.value = themesRes.data;

    // Load user data
    const userRes = await api.get('/auth/me');
    selectedTheme.value = userRes.data.selectedThemeId;
    userPlan.value = userRes.data.plan || 'free';

    // Get current layout type from selected theme
    const selectedThemeObj = themes.value.find(t => t.id === selectedTheme.value);
    if (selectedThemeObj) {
      currentLayoutType.value = selectedThemeObj.layoutType || 'classic';
    }

    // Load preview data
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

onMounted(() => {
  if (props.activeTab === 'theme') {
    loadThemesAndData();
  }
});
</script>


<style scoped>

/* ===================================
   MODAL POSITIONING FIX
   Position modal below request strip
   =================================== */

/* Modal Overlay - Start below request strip */
.modal-overlay {
  position: fixed;
  top: 0; /* Will be adjusted on mobile */
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  padding: 1rem;
  overflow-y: auto;
}

/* Desktop Modal */
.theme-confirm-modal {
  background: #ffffff;
  border-radius: 14px;
  max-width: 650px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.3);
  border: 2px solid #E8D5C4;
  margin: auto;
  position: relative;
  z-index: 100000;
}

.dark-mode .theme-confirm-modal {
  background: #1a1626;
  border-color: #2d2640;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.6);
}

/* Header */
.confirm-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, #FDF8F3 0%, #F5EBE0 100%);
  border-bottom: 2px solid #E8D5C4;
  flex-shrink: 0;
}

.dark-mode .confirm-header {
  background: linear-gradient(135deg, #2d2640 0%, #1a1626 100%);
  border-bottom-color: #3d3555;
}

.confirm-header h3 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #8B5A3C;
  margin: 0;
}

.dark-mode .confirm-header h3 {
  color: #D4A574;
}

.btn-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #fef2f2;
  color: #dc2626;
  border: 2px solid #fecaca;
  border-radius: 7px;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.dark-mode .btn-close {
  background: #2a1a26;
  color: #fca5a5;
  border-color: #3a1a2a;
}

.btn-close:hover {
  background: #fee2e2;
  transform: rotate(90deg);
}

/* Body */
.confirm-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
  background: #f8fafc;
}

.dark-mode .confirm-body {
  background: #0f0d1a;
}

/* Preview Container */
.confirm-preview-large {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border: 2px solid #E8D5C4;
  min-height: 350px;
}

.dark-mode .confirm-preview-large {
  background: linear-gradient(135deg, #1a1626 0%, #0f0d1a 100%);
  border-color: #2d2640;
}

/* Theme Preview */
.modal-theme-preview {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.modal-theme-preview :deep(.theme-preview-content) {
  transform: scale(0.85);
  transform-origin: top center;
  width: 400px;
  min-height: 500px;
}

/* Layout Preview */
.modal-layout-preview {
  width: 100%;
  max-width: 350px;
  margin: 0 auto;
}

/* Classic Preview */
.layout-preview-classic-large {
  width: 100%;
  max-width: 320px;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin: 0 auto;
}

.dark-mode .layout-preview-classic-large {
  background: #1a1626;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.layout-preview-classic-large .preview-header {
  height: 70px;
  background: linear-gradient(135deg, #8B5A3C 0%, #6B4423 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 16px;
}

.layout-preview-classic-large .preview-grid-3x2 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 8px;
}

.layout-preview-classic-large .preview-btn {
  background: white;
  border: 2px solid #E8D5C4;
  border-radius: 8px;
  padding: 14px 8px;
  text-align: center;
  font-size: 11px;
  font-weight: 600;
  color: #6B4423;
}

.dark-mode .layout-preview-classic-large .preview-btn {
  background: #2d2640;
  border-color: #3d3555;
  color: #D4A574;
}

.layout-preview-classic-large .preview-save {
  height: 45px;
  background: #000;
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
}

.layout-preview-classic-large .preview-secondary {
  display: flex;
  gap: 8px;
}

.layout-preview-classic-large .preview-btn-small {
  flex: 1;
  background: white;
  border: 2px solid #E8D5C4;
  border-radius: 8px;
  padding: 12px 6px;
  text-align: center;
  font-size: 10px;
  font-weight: 600;
  color: #6B4423;
}

.dark-mode .layout-preview-classic-large .preview-btn-small {
  background: #2d2640;
  border-color: #3d3555;
  color: #D4A574;
}

/* Modern Preview */
.layout-preview-modern-large {
  width: 100%;
  max-width: 320px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0 auto;
}

.dark-mode .layout-preview-modern-large {
  background: #1a1626;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.layout-preview-modern-large .preview-hero {
  background: linear-gradient(135deg, #8B5A3C 0%, #6B4423 100%);
  padding: 35px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.layout-preview-modern-large .preview-avatar {
  width: 70px;
  height: 70px;
  background: white;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.layout-preview-modern-large .preview-name {
  font-size: 18px;
  font-weight: 700;
  color: white;
}

.layout-preview-modern-large .preview-title {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}

.layout-preview-modern-large .preview-vertical {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 15px;
}

.layout-preview-modern-large .preview-btn-full {
  background: linear-gradient(135deg, #8B5A3C 0%, #6B4423 100%);
  color: white;
  padding: 14px;
  border-radius: 10px;
  text-align: center;
  font-size: 12px;
  font-weight: 700;
}

.layout-preview-modern-large .preview-floating {
  background: #000;
  color: white;
  padding: 14px;
  margin: 0 15px 15px;
  border-radius: 10px;
  text-align: center;
  font-size: 12px;
  font-weight: 700;
}

/* Content */
.confirm-content {
  background: #ffffff;
  padding: 1.25rem;
  border-radius: 10px;
  border: 2px solid #E8D5C4;
}

.dark-mode .confirm-content {
  background: #1a1626;
  border-color: #2d2640;
}

.confirm-content h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.4rem 0;
}

.dark-mode .confirm-content h4 {
  color: #e5e7eb;
}

.confirm-content p {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 0.875rem 0;
  line-height: 1.6;
}

.dark-mode .confirm-content p {
  color: #9ca3af;
}

/* Theme Details */
.theme-details {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  padding: 0.875rem;
  background: #f8fafc;
  border-radius: 7px;
  margin-bottom: 0.875rem;
}

.dark-mode .theme-details {
  background: #0f0d1a;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-size: 0.875rem;
  color: #475569;
}

.dark-mode .detail-item {
  color: #9ca3af;
}

.detail-item svg {
  color: #8B5A3C;
  flex-shrink: 0;
  width: 15px;
  height: 15px;
}

.dark-mode .detail-item svg {
  color: #D4A574;
}

.detail-item strong {
  color: #1f2937;
}

.dark-mode .detail-item strong {
  color: #e5e7eb;
}

/* Premium Notice */
.premium-notice {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.875rem 1.1rem;
  background: linear-gradient(135deg, #F5EBE0 0%, #E8D5C4 100%);
  border-radius: 8px;
  color: #6B4423;
  font-size: 0.875rem;
  font-weight: 600;
  border: 1px solid #D4A574;
}

.dark-mode .premium-notice {
  background: linear-gradient(135deg, #3d3555 0%, #4c1d95 100%);
  color: #D4A574;
  border-color: #8B5A3C;
}

/* Actions */
.confirm-actions {
  display: flex;
  gap: 0.875rem;
  padding: 1.25rem 1.5rem;
  border-top: 2px solid #E8D5C4;
  background: #ffffff;
  flex-shrink: 0;
}

.dark-mode .confirm-actions {
  border-top-color: #2d2640;
  background: #1a1626;
}

.btn-cancel,
.btn-confirm {
  flex: 1;
  padding: 0.75rem 1.25rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  border: none;
}

.btn-cancel {
  background: #f3f4f6;
  color: #64748b;
  border: 2px solid #e5e7eb;
}

.dark-mode .btn-cancel {
  background: #0f0d1a;
  color: #9ca3af;
  border-color: #2d2640;
}

.btn-confirm {
  background: linear-gradient(135deg, #8B5A3C 0%, #6B4423 100%);
  color: white;
  box-shadow: 0 3px 10px rgba(139, 90, 60, 0.25);
}

.dark-mode .btn-confirm {
  background: linear-gradient(135deg, #D4A574 0%, #8B5A3C 100%);
  box-shadow: 0 3px 10px rgba(212, 165, 116, 0.25);
}

.btn-confirm:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ===================================
   MOBILE (≤768px)
   Modal starts BELOW request strip
   =================================== */

@media (max-width: 768px) {
  /* Position modal below request strip */
  .modal-overlay {
    top: 140px; /* Request strip + button height = ~140px */
    padding: 0.5rem;
    align-items: flex-start; /* Start from top */
    padding-top: 0.5rem;
  }

  /* Compact modal */
  .theme-confirm-modal {
    max-width: 92%;
    width: 92%;
    max-height: calc(100vh - 160px); /* Account for request strip + bottom nav */
    border-radius: 10px;
    margin-top: 0;
  }

  .confirm-header {
    padding: 0.75rem 0.875rem;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .confirm-header h3 {
    font-size: 0.9rem;
  }

  .btn-close {
    width: 26px;
    height: 26px;
  }

  .confirm-body {
    padding: 0.75rem;
  }

  .confirm-preview-large {
    padding: 0.5rem;
    margin-bottom: 0.75rem;
    min-height: 150px;
    border-radius: 8px;
  }

  .modal-theme-preview :deep(.theme-preview-content) {
    transform: scale(0.35);
    width: 280px;
    min-height: 350px;
  }

  .layout-preview-classic-large,
  .layout-preview-modern-large {
    max-width: 200px;
    padding: 10px;
  }

  .layout-preview-classic-large .preview-header {
    height: 40px;
    font-size: 11px;
  }

  .layout-preview-classic-large .preview-grid-3x2 {
    gap: 4px;
  }

  .layout-preview-classic-large .preview-btn {
    padding: 8px 4px;
    font-size: 8px;
    border-radius: 5px;
  }

  .layout-preview-classic-large .preview-save {
    height: 28px;
    font-size: 9px;
  }

  .layout-preview-classic-large .preview-secondary {
    gap: 4px;
  }

  .layout-preview-classic-large .preview-btn-small {
    padding: 6px 3px;
    font-size: 7px;
  }

  .layout-preview-modern-large .preview-hero {
    padding: 20px 12px;
  }

  .layout-preview-modern-large .preview-avatar {
    width: 40px;
    height: 40px;
    border: 2px solid white;
  }

  .layout-preview-modern-large .preview-name {
    font-size: 13px;
  }

  .layout-preview-modern-large .preview-title {
    font-size: 10px;
  }

  .layout-preview-modern-large .preview-vertical {
    gap: 5px;
    padding: 0 10px;
  }

  .layout-preview-modern-large .preview-btn-full {
    padding: 8px;
    font-size: 9px;
    border-radius: 7px;
  }

  .layout-preview-modern-large .preview-floating {
    padding: 8px;
    margin: 0 10px 10px;
    font-size: 9px;
  }

  .confirm-content {
    padding: 0.75rem;
  }

  .confirm-content h4 {
    font-size: 0.875rem;
  }

  .confirm-content p {
    font-size: 0.75rem;
    line-height: 1.4;
    margin-bottom: 0.5rem;
  }

  .theme-details {
    padding: 0.625rem;
    margin-bottom: 0.625rem;
  }

  .detail-item {
    font-size: 0.75rem;
    gap: 0.5rem;
  }

  .detail-item svg {
    width: 13px;
    height: 13px;
  }

  .premium-notice {
    padding: 0.625rem 0.75rem;
    font-size: 0.75rem;
  }

  .confirm-actions {
    padding: 0.75rem;
    gap: 0.625rem;
    position: sticky;
    bottom: 0;
    z-index: 10;
  }

  .btn-cancel,
  .btn-confirm {
    padding: 0.625rem 0.875rem;
    font-size: 0.8rem;
    border-radius: 8px;
  }
}

/* ===================================
   SMALL MOBILE (≤480px)
   =================================== */

@media (max-width: 480px) {
  .modal-overlay {
    top: 80px !important; /* Same - below request strip */
    padding: 0.5rem;
  }

  .theme-confirm-modal {
    max-width: 94%;
    width: 95%;
    max-height: calc(100vh - 360px) !important;
  }

  .confirm-header {
    padding: 0.625rem 0.75rem;
  }

  .confirm-header h3 {
    font-size: 0.85rem;
  }

  .btn-close {
    width: 24px;
    height: 24px;
  }

  .confirm-body {
    padding: 0.625rem;
  }

  .confirm-preview-large {
    padding: 0.5rem;
    margin-bottom: 0.625rem;
    min-height: 130px;
  }

  .modal-theme-preview :deep(.theme-preview-content) {
    transform: scale(0.3);
    width: 250px;
    min-height: 320px;
  }

  .layout-preview-classic-large,
  .layout-preview-modern-large {
    max-width: 180px;
    padding: 8px;
  }

  .layout-preview-classic-large .preview-header {
    height: 35px;
    font-size: 10px;
  }

  .layout-preview-classic-large .preview-grid-3x2 {
    gap: 3px;
  }

  .layout-preview-classic-large .preview-btn {
    padding: 6px 3px;
    font-size: 7px;
  }

  .layout-preview-classic-large .preview-save {
    height: 25px;
    font-size: 8px;
  }

  .layout-preview-classic-large .preview-btn-small {
    padding: 5px 2px;
    font-size: 6px;
  }

  .layout-preview-modern-large .preview-hero {
    padding: 15px 10px;
  }

  .layout-preview-modern-large .preview-avatar {
    width: 35px;
    height: 35px;
  }

  .layout-preview-modern-large .preview-name {
    font-size: 12px;
  }

  .layout-preview-modern-large .preview-title {
    font-size: 9px;
  }

  .layout-preview-modern-large .preview-btn-full {
    padding: 7px;
    font-size: 8px;
  }

  .layout-preview-modern-large .preview-floating {
    padding: 7px;
    margin: 0 8px 8px;
    font-size: 8px;
  }

  .confirm-content {
    padding: 0.625rem;
  }

  .confirm-content h4 {
    font-size: 0.8rem;
  }

  .confirm-content p {
    font-size: 0.7rem;
  }

  .confirm-actions {
    padding: 0.625rem;
  }

  .btn-cancel,
  .btn-confirm {
    padding: 0.55rem 0.75rem;
    font-size: 0.75rem;
  }
}

/* Modal Animation */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .theme-confirm-modal,
.modal-leave-active .theme-confirm-modal {
  transition: transform 0.3s ease;
}

.modal-enter-from .theme-confirm-modal,
.modal-leave-to .theme-confirm-modal {
  transform: scale(0.9);
}



/* ===================================
   LANDSCAPE MODE FIX
   =================================== */

@media (max-height: 600px) and (orientation: landscape) {
  .confirm-preview-large {
    min-height: 200px;
    max-height: 250px;
  }

  .modal-theme-preview :deep(.theme-preview-content) {
    transform: scale(0.5);
  }

  .layout-preview-classic-large,
  .layout-preview-modern-large {
    max-width: 200px;
    padding: 10px;
  }
}

/* ===================================
   THEME COMPONENT - COMPLETE STYLES
   =================================== */

/* Base Card Styles */
.content-card.theme-section {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid #f3f4f6;
  padding: 0;
  min-height: calc(100vh - 260px);
  width: 100%;
  transition: all 0.3s ease;
}

.dark-mode.content-card.theme-section {
  background: #1a1626;
  border-color: #2d2640;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

/* Theme Header */
.theme-header {
  background: linear-gradient(135deg, #FDF8F3 0%, #F5EBE0 100%);
  padding: 1.5rem 1.5rem;
  border-bottom: 2px solid #E8D5C4;
  transition: all 0.3s ease;
}

.dark-mode .theme-header {
  background: linear-gradient(135deg, #2d2640 0%, #1a1626 100%);
  border-bottom-color: #3d3555;
}

.theme-header-content {
  max-width: 100%;
  margin: 0;
}

.theme-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #8B5A3C;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
  transition: color 0.3s ease;
}

.dark-mode .theme-title {
  color: #D4A574;
}

.theme-subtitle {
  font-size: 0.9rem;
  color: #64748b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  transition: color 0.3s ease;
}

.dark-mode .theme-subtitle {
  color: #9ca3af;
}

.plan-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 1px solid;
  transition: all 0.3s ease;
}

.plan-badge.free {
  background: linear-gradient(135deg, #E8D5C4 0%, #D4A574 100%);
  color: #6B4423;
  border-color: #8B5A3C;
}

.dark-mode .plan-badge.free {
  background: linear-gradient(135deg, #3d3555 0%, #4c1d95 100%);
  color: #D4A574;
  border-color: #8B5A3C;
}

.plan-badge.premium {
  background: linear-gradient(135deg, #8B5A3C 0%, #6B4423 100%);
  color: #ffffff;
  border-color: #8B5A3C;
  box-shadow: 0 2px 8px rgba(139, 90, 60, 0.3);
}

.dark-mode .plan-badge.premium {
  background: linear-gradient(135deg, #8B5A3C 0%, #D4A574 100%);
  color: #ffffff;
  border-color: #8B5A3C;
  box-shadow: 0 2px 8px rgba(212, 165, 116, 0.3);
}

/* Sub-Tabs */
.sub-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #FDF8F3 0%, #F5EBE0 100%);
  border-bottom: 2px solid #E8D5C4;
}

.dark-mode .sub-tabs {
  background: linear-gradient(135deg, #2d2640 0%, #1a1626 100%);
  border-bottom-color: #3d3555;
}

.sub-tab {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
  padding: 0.875rem;
  background: white;
  border: 2px solid #E8D5C4;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.dark-mode .sub-tab {
  background: #1a1626;
  border-color: #2d2640;
}

.sub-tab svg {
  color: #8B5A3C;
  width: 18px;
  height: 18px;
  transition: all 0.3s ease;
}

.dark-mode .sub-tab svg {
  color: #D4A574;
}

.sub-tab > span:first-of-type {
  font-weight: 600;
  font-size: 0.9rem;
  color: #1f2937;
  transition: color 0.3s ease;
}

.dark-mode .sub-tab > span:first-of-type {
  color: #e5e7eb;
}

.sub-tab-desc {
  font-size: 0.75rem;
  color: #64748b;
  transition: color 0.3s ease;
}

.dark-mode .sub-tab-desc {
  color: #9ca3af;
}

.sub-tab:hover {
  border-color: #8B5A3C;
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(139, 90, 60, 0.15);
}

.dark-mode .sub-tab:hover {
  border-color: #D4A574;
  box-shadow: 0 3px 10px rgba(212, 165, 116, 0.3);
}

.sub-tab.active {
  background: linear-gradient(135deg, #8B5A3C 0%, #6B4423 100%);
  border-color: #8B5A3C;
  box-shadow: 0 4px 12px rgba(139, 90, 60, 0.25);
}

.dark-mode .sub-tab.active {
  background: linear-gradient(135deg, #8B5A3C 0%, #D4A574 100%);
  border-color: #D4A574;
  box-shadow: 0 4px 12px rgba(212, 165, 116, 0.25);
}

.sub-tab.active svg {
  color: white;
}

.sub-tab.active span {
  color: white !important;
}

/* Tab Content */
.tab-content {
  animation: fadeIn 0.3s ease-out;
  padding: 1.5rem;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Info Banner */
.info-banner {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  margin: 0 0 1.5rem 0;
  background: linear-gradient(135deg, #F5EBE0 0%, #E8D5C4 100%);
  border: 2px solid #D4A574;
  border-radius: 10px;
  color: #6B4423;
  font-size: 0.85rem;
  line-height: 1.5;
}

.dark-mode .info-banner {
  background: linear-gradient(135deg, #2d2640 0%, #3d3555 100%);
  border-color: #8B5A3C;
  color: #D4A574;
}

.info-banner svg {
  flex-shrink: 0;
  margin-top: 2px;
}

/* Current Layout Banner */
.current-layout-banner {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  margin: 0 0 1.5rem 0;
  background: linear-gradient(135deg, #F5EBE0 0%, #E8D5C4 100%);
  border: 2px solid #D4A574;
  border-radius: 10px;
  color: #6B4423;
  font-size: 0.85rem;
}

.dark-mode .current-layout-banner {
  background: linear-gradient(135deg, #2d2640 0%, #3d3555 100%);
  border-color: #8B5A3C;
  color: #D4A574;
}

.current-layout-banner svg {
  flex-shrink: 0;
  margin-top: 2px;
}

.current-layout-banner strong {
  font-weight: 600;
}

.change-layout {
  margin-left: 0.75rem;
  color: #8B5A3C;
  cursor: pointer;
  text-decoration: underline;
  font-weight: 500;
  transition: color 0.2s;
}

.dark-mode .change-layout {
  color: #D4A574;
}

.change-layout:hover {
  color: #6B4423;
}

.dark-mode .change-layout:hover {
  color: #E8D5C4;
}

/* Theme Grid */
.theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
  padding: 0;
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
  height: 100%;
}

.dark-mode .theme-card {
  background: #1a1626;
  border-color: #2d2640;
}

.theme-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(139, 90, 60, 0.15);
  border-color: #8B5A3C;
}

.dark-mode .theme-card:hover {
  box-shadow: 0 10px 25px rgba(212, 165, 116, 0.3);
  border-color: #D4A574;
}

.theme-card.active {
  border-color: #8B5A3C;
  box-shadow: 0 0 0 3px rgba(139, 90, 60, 0.15);
}

.dark-mode .theme-card.active {
  border-color: #D4A574;
  box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.2);
}

.theme-card.disabled {
  cursor: not-allowed;
  opacity: 0.65;
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
  gap: 0.875rem;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.3s;
}

.dark-mode .premium-overlay {
  background: rgba(139, 90, 60, 0.95);
}

.theme-card.disabled:hover .premium-overlay {
  opacity: 1;
}

.premium-lock-icon {
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, #8B5A3C 0%, #6B4423 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 6px 20px rgba(139, 90, 60, 0.4);
  animation: pulse-lock 2s ease-in-out infinite;
}

.dark-mode .premium-lock-icon {
  background: linear-gradient(135deg, #D4A574 0%, #8B5A3C 100%);
  box-shadow: 0 6px 20px rgba(212, 165, 116, 0.4);
}

@keyframes pulse-lock {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.upgrade-text {
  color: white;
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Theme Preview Wrapper */
.theme-preview-wrapper {
  position: relative;
  height: 220px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.875rem;
  transition: all 0.3s ease;
}

.dark-mode .theme-preview-wrapper {
  background: linear-gradient(135deg, #0f0d1a 0%, #1a1626 100%);
}

.theme-preview-wrapper :deep(.theme-preview-content) {
  transform: scale(0.32);
  transform-origin: center center;
  width: 400px;
  height: 600px;
  pointer-events: none;
}

.theme-card:hover .theme-preview-wrapper :deep(.theme-preview-content) {
  transform: scale(0.35);
  transition: transform 0.3s ease;
}

/* Structural Preview Styles */
.structural-preview {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.dark-mode .structural-preview {
  background: linear-gradient(135deg, #0f0d1a 0%, #1a1626 100%);
}

/* Classic Layout Preview */
.layout-preview-classic {
  width: 100%;
  height: 100%;
  padding: 8px;
  font-size: 7px;
  color: #333;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.preview-header {
  height: 26px;
  background: #8B5A3C;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 7px;
}

.preview-grid-3x2 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 3px;
}

.preview-btn {
  background: white;
  border: 1px solid #E8D5C4;
  border-radius: 3px;
  padding: 6px 3px;
  text-align: center;
  font-size: 6px;
  font-weight: 500;
  color: #6B4423;
}

.preview-save {
  height: 18px;
  background: #000;
  color: white;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 6px;
  font-weight: 600;
}

.preview-secondary {
  display: flex;
  gap: 3px;
}

.preview-btn-small {
  flex: 1;
  background: white;
  border: 1px solid #E8D5C4;
  border-radius: 3px;
  padding: 5px 3px;
  text-align: center;
  font-size: 5px;
  color: #6B4423;
}

/* Modern Layout Preview */
.layout-preview-modern {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 6px;
  color: white;
}

.preview-hero {
  background: linear-gradient(135deg, #8B5A3C 0%, #6B4423 100%);
  height: 65px;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  position: relative;
}

.preview-avatar {
  width: 18px;
  height: 18px;
  background: white;
  border-radius: 50%;
  border: 2px solid white;
}

.preview-name {
  font-size: 7px;
  font-weight: 600;
}

.preview-vertical {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 0 8px;
}

.preview-btn-full {
  background: linear-gradient(135deg, #8B5A3C 0%, #6B4423 100%);
  color: white;
  padding: 6px;
  border-radius: 4px;
  text-align: center;
  font-size: 6px;
  font-weight: 600;
}

.preview-floating {
  background: #000;
  color: white;
  padding: 6px;
  margin: 0 8px;
  border-radius: 4px;
  text-align: center;
  font-size: 6px;
  font-weight: 600;
}

/* Badges */
.active-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: linear-gradient(135deg, #8B5A3C 0%, #6B4423 100%);
  color: white;
  padding: 0.375rem 0.75rem;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  box-shadow: 0 3px 10px rgba(139, 90, 60, 0.4);
  z-index: 5;
  animation: bounce-in 0.5s ease-out;
}

.dark-mode .active-badge {
  background: linear-gradient(135deg, #D4A574 0%, #8B5A3C 100%);
  box-shadow: 0 3px 10px rgba(212, 165, 116, 0.4);
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
  top: 0.75rem;
  left: 0.75rem;
  background: linear-gradient(135deg, #8B5A3C 0%, #6B4423 100%);
  color: white;
  padding: 0.3rem 0.65rem;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.7rem;
  font-weight: 600;
  box-shadow: 0 3px 10px rgba(139, 90, 60, 0.4);
  z-index: 5;
}

.dark-mode .premium-badge {
  background: linear-gradient(135deg, #D4A574 0%, #8B5A3C 100%);
  box-shadow: 0 3px 10px rgba(212, 165, 116, 0.4);
}

/* Theme Info */
.theme-info {
  padding: 1rem;
  border-top: 2px solid #f3f4f6;
  background: #ffffff;
  flex-grow: 1;
  transition: all 0.3s ease;
}

.dark-mode .theme-info {
  border-top-color: #2d2640;
  background: #1a1626;
}

.theme-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.375rem 0;
  transition: color 0.3s ease;
}

.dark-mode .theme-name {
  color: #e5e7eb;
}

.theme-description {
  font-size: 0.8rem;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.3s ease;
}

.dark-mode .theme-description {
  color: #9ca3af;
}

/* Feature List */
.feature-list {
  list-style: none;
  padding: 0;
  margin: 0.625rem 0 0 0;
}

.feature-list li {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  color: #64748b;
  margin-bottom: 0.4rem;
}

.dark-mode .feature-list li {
  color: #9ca3af;
}

.feature-list svg {
  color: #10b981;
  flex-shrink: 0;
  width: 13px;
  height: 13px;
}

/* Loading State */
.themes-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  gap: 1.25rem;
  min-height: 350px;
}

.themes-loading p {
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.3s ease;
}

.dark-mode .themes-loading p {
  color: #9ca3af;
}

.spinner {
  width: 2.5rem;
  height: 2.5rem;
  border: 3px solid #E8D5C4;
  border-top-color: #8B5A3C;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.dark-mode .spinner {
  border-color: #2d2640;
  border-top-color: #D4A574;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner-small {
  width: 0.875rem;
  height: 0.875rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
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
}

.theme-confirm-modal {
  background: #ffffff;
  border-radius: 14px;
  max-width: 650px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.3);
  border: 2px solid #E8D5C4;
}

.dark-mode .theme-confirm-modal {
  background: #1a1626;
  border-color: #2d2640;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.6);
}

.confirm-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, #FDF8F3 0%, #F5EBE0 100%);
  border-bottom: 2px solid #E8D5C4;
}

.dark-mode .confirm-header {
  background: linear-gradient(135deg, #2d2640 0%, #1a1626 100%);
  border-bottom-color: #3d3555;
}

.confirm-header h3 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #8B5A3C;
  margin: 0;
}

.dark-mode .confirm-header h3 {
  color: #D4A574;
}

.btn-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #fef2f2;
  color: #dc2626;
  border: 2px solid #fecaca;
  border-radius: 7px;
  cursor: pointer;
  transition: all 0.2s;
}

.dark-mode .btn-close {
  background: #2a1a26;
  color: #fca5a5;
  border-color: #3a1a2a;
}

.btn-close:hover {
  background: #fee2e2;
  transform: rotate(90deg);
}

.confirm-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
  background: #f8fafc;
}

.dark-mode .confirm-body {
  background: #0f0d1a;
}

.confirm-preview-large {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
  overflow: auto;
  border: 2px solid #E8D5C4;
  max-height: 500px;
}

.dark-mode .confirm-preview-large {
  background: linear-gradient(135deg, #1a1626 0%, #0f0d1a 100%);
  border-color: #2d2640;
}

.confirm-preview-large :deep(.theme-preview-content) {
  transform: scale(0.7);
  transform-origin: top center;
}

.confirm-content {
  background: #ffffff;
  padding: 1.25rem;
  border-radius: 10px;
  border: 2px solid #E8D5C4;
}

.dark-mode .confirm-content {
  background: #1a1626;
  border-color: #2d2640;
}

.confirm-content h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.4rem 0;
}

.dark-mode .confirm-content h4 {
  color: #e5e7eb;
}

.confirm-content p {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 0.875rem 0;
  line-height: 1.6;
}

.dark-mode .confirm-content p {
  color: #9ca3af;
}

/* Theme Details */
.theme-details {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  padding: 0.875rem;
  background: #f8fafc;
  border-radius: 7px;
  margin-bottom: 0.875rem;
}

.dark-mode .theme-details {
  background: #0f0d1a;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-size: 0.875rem;
  color: #475569;
}

.dark-mode .detail-item {
  color: #9ca3af;
}

.detail-item svg {
  color: #8B5A3C;
  flex-shrink: 0;
  width: 15px;
  height: 15px;
}

.dark-mode .detail-item svg {
  color: #D4A574;
}

.detail-item strong {
  color: #1f2937;
}

.dark-mode .detail-item strong {
  color: #e5e7eb;
}

.premium-notice {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.875rem 1.1rem;
  background: linear-gradient(135deg, #F5EBE0 0%, #E8D5C4 100%);
  border-radius: 8px;
  color: #6B4423;
  font-size: 0.875rem;
  font-weight: 600;
  border: 1px solid #D4A574;
}

.dark-mode .premium-notice {
  background: linear-gradient(135deg, #3d3555 0%, #4c1d95 100%);
  color: #D4A574;
  border-color: #8B5A3C;
}

.confirm-actions {
  display: flex;
  gap: 0.875rem;
  padding: 1.25rem 1.5rem;
  border-top: 2px solid #E8D5C4;
  background: #ffffff;
}

.dark-mode .confirm-actions {
  border-top-color: #2d2640;
  background: #1a1626;
}

.btn-cancel,
.btn-confirm {
  flex: 1;
  padding: 0.75rem 1.25rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  border: none;
}

.btn-cancel {
  background: #f3f4f6;
  color: #64748b;
  border: 2px solid #e5e7eb;
}

.dark-mode .btn-cancel {
  background: #0f0d1a;
  color: #9ca3af;
  border-color: #2d2640;
}

.btn-cancel:hover {
  background: #e5e7eb;
}

.dark-mode .btn-cancel:hover {
  background: #1a1626;
  border-color: #3d3555;
}

.btn-confirm {
  background: linear-gradient(135deg, #8B5A3C 0%, #6B4423 100%);
  color: white;
  box-shadow: 0 3px 10px rgba(139, 90, 60, 0.25);
}

.dark-mode .btn-confirm {
  background: linear-gradient(135deg, #D4A574 0%, #8B5A3C 100%);
  box-shadow: 0 3px 10px rgba(212, 165, 116, 0.25);
}

.btn-confirm:hover {
  transform: translateY(-1px);
  box-shadow: 0 5px 15px rgba(139, 90, 60, 0.35);
}

.btn-confirm:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Modal Animation */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .theme-confirm-modal,
.modal-leave-active .theme-confirm-modal {
  transition: transform 0.3s ease;
}

.modal-enter-from .theme-confirm-modal,
.modal-leave-to .theme-confirm-modal {
  transform: scale(0.9);
}

/* ===================================
   MOBILE RESPONSIVE STYLES
   =================================== */

@media (max-width: 768px) {
  .theme-header {
    padding: 1.25rem 1rem;
  }

  .theme-title {
    font-size: 1.25rem;
  }

  .theme-subtitle {
    font-size: 0.85rem;
  }

  .sub-tabs {
    grid-template-columns: 1fr;
    gap: 0.625rem;
    padding: 1rem;
  }

  .sub-tab {
    padding: 0.75rem;
  }

  .tab-content {
    padding: 1rem;
  }

  .info-banner,
  .current-layout-banner {
    padding: 0.75rem;
    font-size: 0.8rem;
    margin: 0 0 1.25rem 0;
  }

  .theme-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .theme-preview-wrapper {
    height: 200px;
  }

  .theme-info {
    padding: 0.875rem;
  }

  .theme-name {
    font-size: 0.95rem;
  }

  .theme-description {
    font-size: 0.75rem;
  }

  .feature-list li {
    font-size: 0.7rem;
  }

  .theme-confirm-modal {
    max-width: 100%;
    margin: 0.5rem;
  }

  .confirm-header {
    padding: 1rem 1.25rem;
  }

  .confirm-header h3 {
    font-size: 1.15rem;
  }

  .confirm-body {
    padding: 1.25rem;
  }

  .confirm-actions {
    padding: 1rem 1.25rem;
    flex-direction: column;
  }

  .btn-cancel,
  .btn-confirm {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .theme-header {
    padding: 1rem 0.875rem;
  }

  .theme-title {
    font-size: 1.1rem;
  }

  .theme-subtitle {
    font-size: 0.8rem;
    flex-direction: column;
    align-items: flex-start;
  }

  .sub-tabs {
    padding: 0.875rem;
  }

  .sub-tab {
    padding: 0.625rem;
  }

  .sub-tab > span:first-of-type {
    font-size: 0.85rem;
  }

  .sub-tab-desc {
    font-size: 0.7rem;
  }

  .tab-content {
    padding: 0.875rem;
  }

  .theme-preview-wrapper {
    height: 180px;
    padding: 0.625rem;
  }

  .active-badge,
  .premium-badge {
    padding: 0.3rem 0.6rem;
    font-size: 0.65rem;
  }

  .theme-confirm-modal {
    border-radius: 12px;
  }

  .confirm-preview-large {
    padding: 1rem;
  }
}
</style>
<!--<style scoped>-->
<!--.info-banner {-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  gap: 1rem;-->
<!--  padding: 1rem 2rem;-->
<!--  margin: 0 2rem 2rem;-->
<!--  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);-->
<!--  border: 2px solid #93c5fd;-->
<!--  border-radius: 12px;-->
<!--  color: #1e40af;-->
<!--  font-size: 0.9375rem;-->
<!--}-->

<!--.dark-mode .info-banner {-->
<!--  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);-->
<!--  border-color: #4c1d95;-->
<!--  color: #a5b4fc;-->
<!--}-->

<!--/* Structural Preview Styles */-->
<!--.structural-preview {-->
<!--  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);-->
<!--}-->

<!--.dark-mode .structural-preview {-->
<!--  background: linear-gradient(135deg, #0f0d1a 0%, #1a1626 100%);-->
<!--}-->

<!--/* Classic Layout Preview */-->
<!--.layout-preview-classic {-->
<!--  width: 100%;-->
<!--  height: 100%;-->
<!--  padding: 10px;-->
<!--  font-size: 8px;-->
<!--  color: #333;-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  gap: 8px;-->
<!--}-->

<!--.preview-header {-->
<!--  height: 30px;-->
<!--  background: #8B5A3C;-->
<!--  border-radius: 4px;-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  justify-content: center;-->
<!--  color: white;-->
<!--  font-weight: 600;-->
<!--}-->

<!--.preview-grid-3x2 {-->
<!--  display: grid;-->
<!--  grid-template-columns: repeat(3, 1fr);-->
<!--  grid-template-rows: repeat(2, 1fr);-->
<!--  gap: 4px;-->
<!--}-->

<!--.preview-btn {-->
<!--  background: white;-->
<!--  border: 1px solid #E8D5C4;-->
<!--  border-radius: 4px;-->
<!--  padding: 8px 4px;-->
<!--  text-align: center;-->
<!--  font-size: 7px;-->
<!--  font-weight: 500;-->
<!--}-->

<!--.preview-save {-->
<!--  height: 20px;-->
<!--  background: #000;-->
<!--  color: white;-->
<!--  border-radius: 4px;-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  justify-content: center;-->
<!--  font-size: 7px;-->
<!--  font-weight: 600;-->
<!--}-->

<!--.preview-secondary {-->
<!--  display: flex;-->
<!--  gap: 4px;-->
<!--}-->

<!--.preview-btn-small {-->
<!--  flex: 1;-->
<!--  background: white;-->
<!--  border: 1px solid #E8D5C4;-->
<!--  border-radius: 4px;-->
<!--  padding: 6px 4px;-->
<!--  text-align: center;-->
<!--  font-size: 6px;-->
<!--}-->

<!--/* Modern Layout Preview */-->
<!--.layout-preview-modern {-->
<!--  width: 100%;-->
<!--  height: 100%;-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  gap: 6px;-->
<!--  font-size: 7px;-->
<!--  color: white;-->
<!--}-->

<!--.preview-hero {-->
<!--  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);-->
<!--  height: 70px;-->
<!--  border-radius: 4px;-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  align-items: center;-->
<!--  justify-content: center;-->
<!--  gap: 4px;-->
<!--  position: relative;-->
<!--}-->

<!--.preview-avatar {-->
<!--  width: 20px;-->
<!--  height: 20px;-->
<!--  background: white;-->
<!--  border-radius: 50%;-->
<!--  border: 2px solid white;-->
<!--}-->

<!--.preview-name {-->
<!--  font-size: 8px;-->
<!--  font-weight: 600;-->
<!--}-->

<!--.preview-vertical {-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  gap: 4px;-->
<!--  padding: 0 10px;-->
<!--}-->

<!--.preview-btn-full {-->
<!--  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);-->
<!--  color: white;-->
<!--  padding: 8px;-->
<!--  border-radius: 6px;-->
<!--  text-align: center;-->
<!--  font-size: 7px;-->
<!--  font-weight: 600;-->
<!--}-->

<!--.preview-floating {-->
<!--  background: #000;-->
<!--  color: white;-->
<!--  padding: 8px;-->
<!--  margin: 0 10px;-->
<!--  border-radius: 6px;-->
<!--  text-align: center;-->
<!--  font-size: 7px;-->
<!--  font-weight: 600;-->
<!--}-->

<!--/* Theme Details */-->
<!--.theme-details {-->
<!--  padding: 1rem;-->
<!--  background: #f8fafc;-->
<!--  border-radius: 8px;-->
<!--  margin-bottom: 1rem;-->
<!--}-->

<!--.dark-mode .theme-details {-->
<!--  background: #0f0d1a;-->
<!--}-->

<!--.detail-item {-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  gap: 0.75rem;-->
<!--  font-size: 0.9375rem;-->
<!--  color: #475569;-->
<!--}-->

<!--.dark-mode .detail-item {-->
<!--  color: #9ca3af;-->
<!--}-->

<!--.detail-item svg {-->
<!--  color: #8B5A3C;-->
<!--  flex-shrink: 0;-->
<!--}-->

<!--.dark-mode .detail-item svg {-->
<!--  color: #a78bfa;-->
<!--}-->

<!--/* Feature List */-->
<!--.feature-list {-->
<!--  list-style: none;-->
<!--  padding: 0;-->
<!--  margin: 0.75rem 0 0 0;-->
<!--}-->

<!--.feature-list li {-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  gap: 0.5rem;-->
<!--  font-size: 0.8125rem;-->
<!--  color: #64748b;-->
<!--  margin-bottom: 0.5rem;-->
<!--}-->

<!--.dark-mode .feature-list li {-->
<!--  color: #9ca3af;-->
<!--}-->

<!--.feature-list svg {-->
<!--  color: #10b981;-->
<!--  flex-shrink: 0;-->
<!--}-->

<!--.layouts-container {-->
<!--  padding: 2rem;-->
<!--  max-width: 1400px;-->
<!--  margin: 0 auto;-->
<!--}-->

<!--.layout-group {-->
<!--  margin-bottom: 3rem;-->
<!--}-->

<!--.layout-group:last-child {-->
<!--  margin-bottom: 0;-->
<!--}-->

<!--.layout-group-header {-->
<!--  margin-bottom: 1.5rem;-->
<!--  padding-bottom: 1rem;-->
<!--  border-bottom: 2px solid #E8D5C4;-->
<!--}-->

<!--.dark-mode .layout-group-header {-->
<!--  border-bottom-color: #2d2640;-->
<!--}-->

<!--.layout-group-header h3 {-->
<!--  font-size: 1.5rem;-->
<!--  font-weight: 700;-->
<!--  color: #6B4423;-->
<!--  margin: 0 0 0.5rem 0;-->
<!--}-->

<!--.dark-mode .layout-group-header h3 {-->
<!--  color: #a78bfa;-->
<!--}-->

<!--.layout-group-header p {-->
<!--  font-size: 0.9375rem;-->
<!--  color: #64748b;-->
<!--  margin: 0;-->
<!--}-->

<!--.dark-mode .layout-group-header p {-->
<!--  color: #9ca3af;-->
<!--}-->

<!--/* Layout Badge */-->
<!--.layout-badge {-->
<!--  position: absolute;-->
<!--  bottom: 1rem;-->
<!--  left: 1rem;-->
<!--  background: rgba(255, 255, 255, 0.95);-->
<!--  color: #6B4423;-->
<!--  padding: 0.375rem 0.75rem;-->
<!--  border-radius: 20px;-->
<!--  font-size: 0.75rem;-->
<!--  font-weight: 600;-->
<!--  border: 2px solid #E8D5C4;-->
<!--  z-index: 5;-->
<!--  backdrop-filter: blur(8px);-->
<!--}-->

<!--.dark-mode .layout-badge {-->
<!--  background: rgba(26, 22, 38, 0.95);-->
<!--  color: #a78bfa;-->
<!--  border-color: #2d2640;-->
<!--}-->

<!--/* Theme Details */-->
<!--.theme-details {-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  gap: 0.75rem;-->
<!--  padding: 1rem;-->
<!--  background: #f8fafc;-->
<!--  border-radius: 8px;-->
<!--  margin-bottom: 1rem;-->
<!--}-->

<!--.dark-mode .theme-details {-->
<!--  background: #0f0d1a;-->
<!--}-->

<!--.detail-item {-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  gap: 0.75rem;-->
<!--  font-size: 0.9375rem;-->
<!--  color: #475569;-->
<!--}-->

<!--.dark-mode .detail-item {-->
<!--  color: #9ca3af;-->
<!--}-->

<!--.detail-item svg {-->
<!--  color: #8B5A3C;-->
<!--  flex-shrink: 0;-->
<!--}-->

<!--.dark-mode .detail-item svg {-->
<!--  color: #a78bfa;-->
<!--}-->

<!--.detail-item strong {-->
<!--  color: #1f2937;-->
<!--}-->

<!--.dark-mode .detail-item strong {-->
<!--  color: #e5e7eb;-->
<!--}-->

<!--/* Keep ALL existing styles from original component below */-->
<!--/* Base Styles */-->
<!--.content-card.theme-section {-->
<!--  background: #ffffff;-->
<!--  border-radius: 16px;-->
<!--  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);-->
<!--  border: 1px solid #f3f4f6;-->
<!--  padding: 0;-->
<!--  min-height: calc(100vh - 260px);-->
<!--  width: 100%;-->
<!--  transition: all 0.3s ease;-->
<!--}-->

<!--.dark-mode.content-card.theme-section {-->
<!--  background: #1a1626;-->
<!--  border-color: #2d2640;-->
<!--  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);-->
<!--}-->

<!--/* Theme Header */-->
<!--.theme-header {-->
<!--  background: linear-gradient(135deg, #FDF8F3 0%, #F5EBE0 100%);-->
<!--  padding: 2rem;-->
<!--  border-bottom: 2px solid #E8D5C4;-->
<!--  transition: all 0.3s ease;-->
<!--}-->

<!--.dark-mode .theme-header {-->
<!--  background: linear-gradient(135deg, #2d2640 0%, #1a1626 100%);-->
<!--  border-bottom-color: #3d3555;-->
<!--}-->

<!--.theme-header-content {-->
<!--  max-width: 1300px;-->
<!--  margin: 0 auto;-->
<!--}-->

<!--.theme-title {-->
<!--  font-size: 1.75rem;-->
<!--  font-weight: 700;-->
<!--  color: #6B4423;-->
<!--  margin: 0 0 0.75rem 0;-->
<!--  letter-spacing: -0.02em;-->
<!--  transition: color 0.3s ease;-->
<!--}-->

<!--.dark-mode .theme-title {-->
<!--  color: #a78bfa;-->
<!--}-->

<!--.theme-subtitle {-->
<!--  font-size: 1rem;-->
<!--  color: #64748b;-->
<!--  margin: 0;-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  gap: 0.75rem;-->
<!--  flex-wrap: wrap;-->
<!--  transition: color 0.3s ease;-->
<!--}-->

<!--.dark-mode .theme-subtitle {-->
<!--  color: #9ca3af;-->
<!--}-->

<!--.plan-badge {-->
<!--  display: inline-flex;-->
<!--  align-items: center;-->
<!--  padding: 0.375rem 0.875rem;-->
<!--  border-radius: 20px;-->
<!--  font-size: 0.75rem;-->
<!--  font-weight: 600;-->
<!--  text-transform: uppercase;-->
<!--  letter-spacing: 0.05em;-->
<!--  border: 1px solid;-->
<!--  transition: all 0.3s ease;-->
<!--}-->

<!--.plan-badge.free {-->
<!--  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);-->
<!--  color: #1e40af;-->
<!--  border-color: #93c5fd;-->
<!--}-->

<!--.dark-mode .plan-badge.free {-->
<!--  background: linear-gradient(135deg, #312e81 0%, #4c1d95 100%);-->
<!--  color: #a5b4fc;-->
<!--  border-color: #4c1d95;-->
<!--}-->

<!--.plan-badge.premium {-->
<!--  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);-->
<!--  color: #ffffff;-->
<!--  border-color: #f59e0b;-->
<!--  box-shadow: 0 2px 8px rgba(251, 191, 36, 0.3);-->
<!--}-->

<!--.dark-mode .plan-badge.premium {-->
<!--  background: linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%);-->
<!--  color: #ffffff;-->
<!--  border-color: #7c3aed;-->
<!--  box-shadow: 0 2px 8px rgba(124, 58, 237, 0.3);-->
<!--}-->

<!--/* Sub-Tabs */-->
<!--.sub-tabs {-->
<!--  display: flex;-->
<!--  gap: 1rem;-->
<!--  padding: 0 2rem 2rem;-->
<!--  background: linear-gradient(135deg, #FDF8F3 0%, #F5EBE0 100%);-->
<!--  border-bottom: 2px solid #E8D5C4;-->
<!--}-->

<!--.dark-mode .sub-tabs {-->
<!--  background: linear-gradient(135deg, #2d2640 0%, #1a1626 100%);-->
<!--  border-bottom-color: #3d3555;-->
<!--}-->

<!--.sub-tab {-->
<!--  flex: 1;-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  align-items: center;-->
<!--  gap: 0.5rem;-->
<!--  padding: 1.25rem;-->
<!--  background: white;-->
<!--  border: 2px solid #E8D5C4;-->
<!--  border-radius: 12px;-->
<!--  cursor: pointer;-->
<!--  transition: all 0.3s ease;-->
<!--}-->

<!--.dark-mode .sub-tab {-->
<!--  background: #1a1626;-->
<!--  border-color: #2d2640;-->
<!--}-->

<!--.sub-tab svg {-->
<!--  color: #8B5A3C;-->
<!--  transition: all 0.3s ease;-->
<!--}-->

<!--.dark-mode .sub-tab svg {-->
<!--  color: #a78bfa;-->
<!--}-->

<!--.sub-tab span:first-of-type {-->
<!--  font-weight: 600;-->
<!--  font-size: 1rem;-->
<!--  color: #1f2937;-->
<!--  transition: color 0.3s ease;-->
<!--}-->

<!--.dark-mode .sub-tab span:first-of-type {-->
<!--  color: #e5e7eb;-->
<!--}-->

<!--.sub-tab-desc {-->
<!--  font-size: 0.8125rem;-->
<!--  color: #64748b;-->
<!--  transition: color 0.3s ease;-->
<!--}-->

<!--.dark-mode .sub-tab-desc {-->
<!--  color: #9ca3af;-->
<!--}-->

<!--.sub-tab:hover {-->
<!--  border-color: #8B5A3C;-->
<!--  transform: translateY(-2px);-->
<!--  box-shadow: 0 4px 12px rgba(107, 68, 35, 0.15);-->
<!--}-->

<!--.dark-mode .sub-tab:hover {-->
<!--  border-color: #6366f1;-->
<!--  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);-->
<!--}-->

<!--.sub-tab.active {-->
<!--  background: linear-gradient(135deg, #8B5A3C 0%, #6B4423 100%);-->
<!--  border-color: #8B5A3C;-->
<!--  box-shadow: 0 4px 16px rgba(107, 68, 35, 0.25);-->
<!--}-->

<!--.dark-mode .sub-tab.active {-->
<!--  background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%);-->
<!--  border-color: #6366f1;-->
<!--  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.25);-->
<!--}-->

<!--.sub-tab.active svg {-->
<!--  color: white;-->
<!--}-->

<!--.sub-tab.active span {-->
<!--  color: white !important;-->
<!--}-->

<!--/* Tab Content Animation */-->
<!--.tab-content {-->
<!--  animation: fadeIn 0.3s ease-out;-->
<!--}-->

<!--@keyframes fadeIn {-->
<!--  from {-->
<!--    opacity: 0;-->
<!--    transform: translateY(10px);-->
<!--  }-->
<!--  to {-->
<!--    opacity: 1;-->
<!--    transform: translateY(0);-->
<!--  }-->
<!--}-->

<!--/* Current Layout Banner */-->
<!--.current-layout-banner {-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  gap: 1rem;-->
<!--  padding: 1rem 2rem;-->
<!--  margin: 0 2rem 2rem;-->
<!--  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);-->
<!--  border: 2px solid #93c5fd;-->
<!--  border-radius: 12px;-->
<!--  color: #1e40af;-->
<!--}-->

<!--.dark-mode .current-layout-banner {-->
<!--  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);-->
<!--  border-color: #4c1d95;-->
<!--  color: #a5b4fc;-->
<!--}-->

<!--.current-layout-banner svg {-->
<!--  flex-shrink: 0;-->
<!--}-->

<!--.current-layout-banner strong {-->
<!--  font-weight: 600;-->
<!--}-->

<!--.change-layout {-->
<!--  margin-left: 1rem;-->
<!--  color: #2563eb;-->
<!--  cursor: pointer;-->
<!--  text-decoration: underline;-->
<!--  font-weight: 500;-->
<!--  transition: color 0.2s;-->
<!--}-->

<!--.dark-mode .change-layout {-->
<!--  color: #818cf8;-->
<!--}-->

<!--.change-layout:hover {-->
<!--  color: #1d4ed8;-->
<!--}-->

<!--.dark-mode .change-layout:hover {-->
<!--  color: #a78bfa;-->
<!--}-->

<!--/* Loading State */-->
<!--.themes-loading {-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  align-items: center;-->
<!--  justify-content: center;-->
<!--  padding: 4rem 2rem;-->
<!--  gap: 1.5rem;-->
<!--  min-height: 400px;-->
<!--}-->

<!--.themes-loading p {-->
<!--  color: #64748b;-->
<!--  font-size: 1rem;-->
<!--  font-weight: 500;-->
<!--  transition: color 0.3s ease;-->
<!--}-->

<!--.dark-mode .themes-loading p {-->
<!--  color: #9ca3af;-->
<!--}-->

<!--.spinner {-->
<!--  width: 3rem;-->
<!--  height: 3rem;-->
<!--  border: 4px solid #E8D5C4;-->
<!--  border-top-color: #8B5A3C;-->
<!--  border-radius: 50%;-->
<!--  animation: spin 0.8s linear infinite;-->
<!--}-->

<!--.dark-mode .spinner {-->
<!--  border-color: #2d2640;-->
<!--  border-top-color: #a78bfa;-->
<!--}-->

<!--@keyframes spin {-->
<!--  to { transform: rotate(360deg); }-->
<!--}-->

<!--.spinner-small {-->
<!--  width: 1rem;-->
<!--  height: 1rem;-->
<!--  border: 2px solid rgba(255, 255, 255, 0.3);-->
<!--  border-top-color: white;-->
<!--  border-radius: 50%;-->
<!--  animation: spin 0.6s linear infinite;-->
<!--}-->

<!--/* Theme Grid */-->
<!--.theme-grid {-->
<!--  display: grid;-->
<!--  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));-->
<!--  gap: 1.5rem;-->
<!--}-->

<!--/* Theme Card */-->
<!--.theme-card {-->
<!--  background: #ffffff;-->
<!--  border-radius: 12px;-->
<!--  overflow: hidden;-->
<!--  border: 2px solid #E8D5C4;-->
<!--  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);-->
<!--  cursor: pointer;-->
<!--  position: relative;-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--}-->

<!--.dark-mode .theme-card {-->
<!--  background: #1a1626;-->
<!--  border-color: #2d2640;-->
<!--}-->

<!--.theme-card:hover {-->
<!--  transform: translateY(-4px);-->
<!--  box-shadow: 0 12px 32px rgba(107, 68, 35, 0.15);-->
<!--  border-color: #8B5A3C;-->
<!--}-->

<!--.dark-mode .theme-card:hover {-->
<!--  box-shadow: 0 12px 32px rgba(99, 102, 241, 0.3);-->
<!--  border-color: #6366f1;-->
<!--}-->

<!--.theme-card.active {-->
<!--  border-color: #8B5A3C;-->
<!--  box-shadow: 0 0 0 4px rgba(139, 90, 60, 0.15);-->
<!--}-->

<!--.dark-mode .theme-card.active {-->
<!--  border-color: #6366f1;-->
<!--  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2);-->
<!--}-->

<!--.theme-card.disabled {-->
<!--  cursor: not-allowed;-->
<!--  opacity: 0.7;-->
<!--}-->

<!--/* Premium Overlay */-->
<!--.premium-overlay {-->
<!--  position: absolute;-->
<!--  top: 0;-->
<!--  left: 0;-->
<!--  right: 0;-->
<!--  bottom: 0;-->
<!--  background: rgba(107, 68, 35, 0.95);-->
<!--  backdrop-filter: blur(8px);-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  align-items: center;-->
<!--  justify-content: center;-->
<!--  gap: 1rem;-->
<!--  z-index: 10;-->
<!--  opacity: 0;-->
<!--  transition: opacity 0.3s;-->
<!--}-->

<!--.dark-mode .premium-overlay {-->
<!--  background: rgba(99, 102, 241, 0.95);-->
<!--}-->

<!--.theme-card.disabled:hover .premium-overlay {-->
<!--  opacity: 1;-->
<!--}-->

<!--.premium-lock-icon {-->
<!--  width: 3.5rem;-->
<!--  height: 3.5rem;-->
<!--  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);-->
<!--  border-radius: 50%;-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  justify-content: center;-->
<!--  color: white;-->
<!--  box-shadow: 0 8px 24px rgba(251, 191, 36, 0.4);-->
<!--  animation: pulse-lock 2s ease-in-out infinite;-->
<!--}-->

<!--.dark-mode .premium-lock-icon {-->
<!--  background: linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%);-->
<!--  box-shadow: 0 8px 24px rgba(124, 58, 237, 0.4);-->
<!--}-->

<!--@keyframes pulse-lock {-->
<!--  0%, 100% {-->
<!--    transform: scale(1);-->
<!--  }-->
<!--  50% {-->
<!--    transform: scale(1.05);-->
<!--  }-->
<!--}-->

<!--.upgrade-text {-->
<!--  color: white;-->
<!--  font-weight: 600;-->
<!--  font-size: 0.875rem;-->
<!--  text-transform: uppercase;-->
<!--  letter-spacing: 0.05em;-->
<!--  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);-->
<!--}-->

<!--/* Theme Preview */-->
<!--.theme-preview-wrapper {-->
<!--  position: relative;-->
<!--  height: 240px;-->
<!--  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);-->
<!--  overflow: hidden;-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  justify-content: center;-->
<!--  padding: 1rem;-->
<!--  transition: all 0.3s ease;-->
<!--}-->

<!--.dark-mode .theme-preview-wrapper {-->
<!--  background: linear-gradient(135deg, #0f0d1a 0%, #1a1626 100%);-->
<!--}-->

<!--.theme-preview-wrapper :deep(.theme-preview-content) {-->
<!--  transform: scale(0.35);-->
<!--  transform-origin: center center;-->
<!--  width: 400px;-->
<!--  height: 600px;-->
<!--  pointer-events: none;-->
<!--}-->

<!--.theme-card:hover .theme-preview-wrapper :deep(.theme-preview-content) {-->
<!--  transform: scale(0.38);-->
<!--  transition: transform 0.3s ease;-->
<!--}-->

<!--/* Badges */-->
<!--.active-badge {-->
<!--  position: absolute;-->
<!--  top: 1rem;-->
<!--  right: 1rem;-->
<!--  background: linear-gradient(135deg, #8B5A3C 0%, #6B4423 100%);-->
<!--  color: white;-->
<!--  padding: 0.5rem 1rem;-->
<!--  border-radius: 20px;-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  gap: 0.5rem;-->
<!--  font-size: 0.8125rem;-->
<!--  font-weight: 600;-->
<!--  box-shadow: 0 4px 12px rgba(107, 68, 35, 0.4);-->
<!--  z-index: 5;-->
<!--  animation: bounce-in 0.5s ease-out;-->
<!--}-->

<!--.dark-mode .active-badge {-->
<!--  background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%);-->
<!--  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);-->
<!--}-->

<!--@keyframes bounce-in {-->
<!--  0% {-->
<!--    transform: scale(0);-->
<!--    opacity: 0;-->
<!--  }-->
<!--  50% {-->
<!--    transform: scale(1.1);-->
<!--  }-->
<!--  100% {-->
<!--    transform: scale(1);-->
<!--    opacity: 1;-->
<!--  }-->
<!--}-->

<!--.premium-badge {-->
<!--  position: absolute;-->
<!--  top: 1rem;-->
<!--  left: 1rem;-->
<!--  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);-->
<!--  color: white;-->
<!--  padding: 0.375rem 0.75rem;-->
<!--  border-radius: 20px;-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  gap: 0.375rem;-->
<!--  font-size: 0.75rem;-->
<!--  font-weight: 600;-->
<!--  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.4);-->
<!--  z-index: 5;-->
<!--}-->

<!--.dark-mode .premium-badge {-->
<!--  background: linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%);-->
<!--  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);-->
<!--}-->

<!--/* Theme Info */-->
<!--.theme-info {-->
<!--  padding: 1.25rem;-->
<!--  border-top: 2px solid #f3f4f6;-->
<!--  background: #ffffff;-->
<!--  flex-grow: 1;-->
<!--  transition: all 0.3s ease;-->
<!--}-->

<!--.dark-mode .theme-info {-->
<!--  border-top-color: #2d2640;-->
<!--  background: #1a1626;-->
<!--}-->

<!--.theme-name {-->
<!--  font-size: 1.125rem;-->
<!--  font-weight: 600;-->
<!--  color: #1f2937;-->
<!--  margin: 0 0 0.5rem 0;-->
<!--  transition: color 0.3s ease;-->
<!--}-->

<!--.dark-mode .theme-name {-->
<!--  color: #e5e7eb;-->
<!--}-->

<!--.theme-description {-->
<!--  font-size: 0.875rem;-->
<!--  color: #64748b;-->
<!--  margin: 0;-->
<!--  line-height: 1.5;-->
<!--  display: -webkit-box;-->
<!--  -webkit-line-clamp: 2;-->
<!--  -webkit-box-orient: vertical;-->
<!--  overflow: hidden;-->
<!--  transition: color 0.3s ease;-->
<!--}-->

<!--.dark-mode .theme-description {-->
<!--  color: #9ca3af;-->
<!--}-->

<!--/* Modal Styles */-->
<!--.modal-overlay {-->
<!--  position: fixed;-->
<!--  inset: 0;-->
<!--  background: rgba(0, 0, 0, 0.75);-->
<!--  backdrop-filter: blur(8px);-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  justify-content: center;-->
<!--  z-index: 9999;-->
<!--  padding: 1rem;-->
<!--}-->

<!--.theme-confirm-modal {-->
<!--  background: #ffffff;-->
<!--  border-radius: 16px;-->
<!--  max-width: 800px;-->
<!--  width: 100%;-->
<!--  max-height: 90vh;-->
<!--  overflow: hidden;-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);-->
<!--  border: 2px solid #E8D5C4;-->
<!--}-->

<!--.dark-mode .theme-confirm-modal {-->
<!--  background: #1a1626;-->
<!--  border-color: #2d2640;-->
<!--  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.6);-->
<!--}-->

<!--.confirm-header {-->
<!--  display: flex;-->
<!--  justify-content: space-between;-->
<!--  align-items: center;-->
<!--  padding: 1.5rem 2rem;-->
<!--  background: linear-gradient(135deg, #FDF8F3 0%, #F5EBE0 100%);-->
<!--  border-bottom: 2px solid #E8D5C4;-->
<!--}-->

<!--.dark-mode .confirm-header {-->
<!--  background: linear-gradient(135deg, #2d2640 0%, #1a1626 100%);-->
<!--  border-bottom-color: #3d3555;-->
<!--}-->

<!--.confirm-header h3 {-->
<!--  font-size: 1.5rem;-->
<!--  font-weight: 700;-->
<!--  color: #6B4423;-->
<!--  margin: 0;-->
<!--}-->

<!--.dark-mode .confirm-header h3 {-->
<!--  color: #a78bfa;-->
<!--}-->

<!--.btn-close {-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  justify-content: center;-->
<!--  width: 36px;-->
<!--  height: 36px;-->
<!--  background: #fef2f2;-->
<!--  color: #dc2626;-->
<!--  border: 2px solid #fecaca;-->
<!--  border-radius: 8px;-->
<!--  cursor: pointer;-->
<!--  transition: all 0.2s;-->
<!--}-->

<!--.dark-mode .btn-close {-->
<!--  background: #2a1a26;-->
<!--  color: #fca5a5;-->
<!--  border-color: #3a1a2a;-->
<!--}-->

<!--.btn-close:hover {-->
<!--  background: #fee2e2;-->
<!--  transform: rotate(90deg);-->
<!--}-->

<!--.confirm-body {-->
<!--  padding: 2rem;-->
<!--  overflow-y: auto;-->
<!--  flex: 1;-->
<!--  background: #f8fafc;-->
<!--}-->

<!--.dark-mode .confirm-body {-->
<!--  background: #0f0d1a;-->
<!--}-->

<!--.confirm-preview-large {-->
<!--  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);-->
<!--  border-radius: 12px;-->
<!--  padding: 2rem;-->
<!--  margin-bottom: 2rem;-->
<!--  display: flex;-->
<!--  justify-content: center;-->
<!--  overflow: auto;-->
<!--  border: 2px solid #E8D5C4;-->
<!--  max-height: 600px;-->
<!--}-->

<!--.dark-mode .confirm-preview-large {-->
<!--  background: linear-gradient(135deg, #1a1626 0%, #0f0d1a 100%);-->
<!--  border-color: #2d2640;-->
<!--}-->

<!--.confirm-preview-large :deep(.theme-preview-content) {-->
<!--  transform: scale(0.75);-->
<!--  transform-origin: top center;-->
<!--}-->

<!--.confirm-content {-->
<!--  background: #ffffff;-->
<!--  padding: 1.5rem;-->
<!--  border-radius: 12px;-->
<!--  border: 2px solid #E8D5C4;-->
<!--}-->

<!--.dark-mode .confirm-content {-->
<!--  background: #1a1626;-->
<!--  border-color: #2d2640;-->
<!--}-->

<!--.confirm-content h4 {-->
<!--  font-size: 1.25rem;-->
<!--  font-weight: 600;-->
<!--  color: #1f2937;-->
<!--  margin: 0 0 0.5rem 0;-->
<!--}-->

<!--.dark-mode .confirm-content h4 {-->
<!--  color: #e5e7eb;-->
<!--}-->

<!--.confirm-content p {-->
<!--  font-size: 0.9375rem;-->
<!--  color: #64748b;-->
<!--  margin: 0 0 1rem 0;-->
<!--  line-height: 1.6;-->
<!--}-->

<!--.dark-mode .confirm-content p {-->
<!--  color: #9ca3af;-->
<!--}-->

<!--.premium-notice {-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  gap: 0.75rem;-->
<!--  padding: 1rem 1.25rem;-->
<!--  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);-->
<!--  border-radius: 10px;-->
<!--  color: #92400e;-->
<!--  font-size: 0.9375rem;-->
<!--  font-weight: 600;-->
<!--  border: 1px solid #fcd34d;-->
<!--}-->

<!--.dark-mode .premium-notice {-->
<!--  background: linear-gradient(135deg, #312e81 0%, #4c1d95 100%);-->
<!--  color: #c4b5fd;-->
<!--  border-color: #6366f1;-->
<!--}-->

<!--.confirm-actions {-->
<!--  display: flex;-->
<!--  gap: 1rem;-->
<!--  padding: 1.5rem 2rem;-->
<!--  border-top: 2px solid #E8D5C4;-->
<!--  background: #ffffff;-->
<!--}-->

<!--.dark-mode .confirm-actions {-->
<!--  border-top-color: #2d2640;-->
<!--  background: #1a1626;-->
<!--}-->

<!--.btn-cancel,-->
<!--.btn-confirm {-->
<!--  flex: 1;-->
<!--  padding: 0.875rem 1.5rem;-->
<!--  border-radius: 12px;-->
<!--  font-size: 0.9375rem;-->
<!--  font-weight: 600;-->
<!--  cursor: pointer;-->
<!--  transition: all 0.3s;-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  justify-content: center;-->
<!--  gap: 0.5rem;-->
<!--  border: none;-->
<!--}-->

<!--.btn-cancel {-->
<!--  background: #f3f4f6;-->
<!--  color: #64748b;-->
<!--  border: 2px solid #e5e7eb;-->
<!--}-->

<!--.dark-mode .btn-cancel {-->
<!--  background: #0f0d1a;-->
<!--  color: #9ca3af;-->
<!--  border-color: #2d2640;-->
<!--}-->

<!--.btn-confirm {-->
<!--  background: linear-gradient(135deg, #8B5A3C 0%, #6B4423 100%);-->
<!--  color: white;-->
<!--  box-shadow: 0 4px 12px rgba(107, 68, 35, 0.25);-->
<!--}-->

<!--.dark-mode .btn-confirm {-->
<!--  background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%);-->
<!--  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);-->
<!--}-->

<!--.btn-confirm:disabled {-->
<!--  opacity: 0.6;-->
<!--  cursor: not-allowed;-->
<!--}-->

<!--/* Mobile Responsive */-->
<!--@media (max-width: 768px) {-->
<!--  .sub-tabs {-->
<!--    flex-direction: column;-->
<!--    padding: 1rem;-->
<!--    gap: 0.75rem;-->
<!--  }-->

<!--  .theme-grid {-->
<!--    grid-template-columns: 1fr;-->
<!--    gap: 1.25rem;-->
<!--  }-->

<!--  .layouts-container {-->
<!--    padding: 1rem;-->
<!--  }-->

<!--  .layout-group {-->
<!--    margin-bottom: 2rem;-->
<!--  }-->

<!--  .current-layout-banner {-->
<!--    margin: 0 1rem 1.5rem;-->
<!--    padding: 0.875rem 1rem;-->
<!--    flex-direction: column;-->
<!--    align-items: flex-start;-->
<!--  }-->
<!--}-->
<!--</style>-->



