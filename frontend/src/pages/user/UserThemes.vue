<template>
  <div v-if="activeTab === 'theme'" :class="['theme-tab', { 'dark-mode': isDarkMode }]">

    <!-- ══════════════════════════════════ HEADER ══════════════════════════════════ -->
    <div class="list-view">
      <div class="list-header">
        <div class="list-header-left">
          <h2 class="page-title">Themes</h2>
          <span :class="['count-pill', userPlan === 'free' ? 'pill-free' : 'pill-premium']">
            {{ userPlan === 'free' ? 'Free Plan' : 'Premium Plan' }}
          </span>
        </div>
        <!-- Sub-Tab Switcher -->
        <div class="sub-tab-group">
          <button
              type="button"
              :class="['sub-tab-btn', { active: subTab === 'structural' }]"
              @click="subTab = 'structural'"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
            Layout
            <span v-if="subTab === 'structural'" class="tab-active-dot"></span>
          </button>
          <button
              type="button"
              :class="['sub-tab-btn', { active: subTab === 'style' }]"
              @click="subTab = 'style'"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
            </svg>
            Style
            <span v-if="subTab === 'style'" class="tab-active-dot"></span>
          </button>
        </div>
      </div>

      <!-- ══════════════════════════════════ STRUCTURAL TAB ══════════════════════════════════ -->
      <div v-if="subTab === 'structural'">

        <!-- Info strip -->
        <div class="info-strip">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          <span>Choose your card layout structure. This changes how buttons and sections are arranged.</span>
        </div>

        <!-- Layout Cards Grid -->
        <div class="theme-grid">

          <!-- Classic Layout -->
          <div
              class="theme-card"
              :class="{ active: currentLayoutType === 'classic' }"
              @click="selectLayout('classic')"
          >
            <div class="theme-preview-wrapper">
              <div class="layout-preview-classic">
                <div class="lp-header">Header</div>
                <div class="lp-grid-3x2">
                  <div class="lp-btn">Phone</div>
                  <div class="lp-btn">WhatsApp</div>
                  <div class="lp-btn">Email</div>
                  <div class="lp-btn">Office</div>
                  <div class="lp-btn">Website</div>
                  <div class="lp-btn">Location</div>
                </div>
                <div class="lp-save">Save Contact</div>
                <div class="lp-secondary">
                  <div class="lp-btn-sm">360°</div>
                  <div class="lp-btn-sm">Reviews</div>
                  <div class="lp-btn-sm">Shop</div>
                </div>
              </div>
              <div v-if="currentLayoutType === 'classic'" class="active-badge">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Active
              </div>
            </div>
            <div class="theme-info">
              <h3 class="theme-name">Classic Grid</h3>
              <p class="theme-desc">Traditional 3×2 button grid layout</p>
              <ul class="feature-list">
                <li>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  3×2 Grid Buttons
                </li>
                <li>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Traditional Layout
                </li>
                <li>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  All Features
                </li>
              </ul>
            </div>
          </div>

          <!-- Modern Layout -->
          <div
              class="theme-card"
              :class="{ active: currentLayoutType === 'modern' }"
              @click="selectLayout('modern')"
          >
            <div class="theme-preview-wrapper">
              <div class="layout-preview-modern">
                <div class="lp-hero">
                  <div class="lp-avatar"></div>
                  <div class="lp-name">Name</div>
                </div>
                <div class="lp-vertical">
                  <div class="lp-btn-full">Phone</div>
                  <div class="lp-btn-full">WhatsApp</div>
                  <div class="lp-btn-full">Email</div>
                  <div class="lp-btn-full">Website</div>
                </div>
                <div class="lp-floating">💾 Save</div>
              </div>
              <div v-if="currentLayoutType === 'modern'" class="active-badge">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Active
              </div>
            </div>
            <div class="theme-info">
              <h3 class="theme-name">Modern Hero</h3>
              <p class="theme-desc">Full-width hero header with vertical stack</p>
              <ul class="feature-list">
                <li>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Hero Header
                </li>
                <li>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Vertical Buttons
                </li>
                <li>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Floating Save Button
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>

      <!-- ══════════════════════════════════ STYLE TAB ══════════════════════════════════ -->
      <div v-if="subTab === 'style'">

        <!-- Current layout strip -->
        <div class="info-strip">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          <span>
            <strong>Current Layout:</strong> {{ currentLayoutType === 'modern' ? 'Modern Hero' : 'Classic Grid' }}
            <button type="button" class="inline-link" @click="subTab = 'structural'">Change Layout →</button>
          </span>
        </div>

        <!-- Loading -->
        <div v-if="themesLoading" class="empty-state">
          <div class="empty-icon-wrap spin-wrap">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                 class="spin-icon">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
          </div>
          <p class="empty-title">Loading themes…</p>
          <p class="empty-sub">Fetching your style options</p>
        </div>

        <!-- Style Themes Grid -->
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
              <div class="lock-icon-wrap">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <span class="lock-label">Upgrade to Premium</span>
            </div>

            <div class="theme-preview-wrapper">
              <RealThemePreview
                  :theme="theme"
                  :contact="previewContact"
                  :company="previewCompany"
              />
              <div v-if="theme.id === selectedTheme" class="active-badge">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Active
              </div>
              <div v-if="theme.isPremium" class="premium-badge">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                  <path
                      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Premium
              </div>
            </div>

            <div class="theme-info">
              <h3 class="theme-name">{{ theme.name }}</h3>
              <p v-if="theme.description" class="theme-desc">{{ theme.description }}</p>
            </div>
          </div>
        </div>

      </div>
    </div><!-- /list-view -->

    <!-- ══════════════════════════════════ CONFIRM MODAL ══════════════════════════════════ -->
    <transition name="modal-fade">
      <div v-if="showConfirmModal" class="qr-overlay" @click.self="showConfirmModal = false">
        <div :class="['confirm-modal', { 'dark-mode': isDarkMode }]">

          <!-- Modal Header -->
          <div class="confirm-modal-header">
            <h3 class="confirm-modal-title">
              {{ confirmType === 'structural' ? 'Change Layout Structure' : 'Change Style Theme' }}
            </h3>
            <button class="qr-close-btn" @click="showConfirmModal = false" type="button">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="confirm-modal-body">

            <!-- Preview Area -->
            <div class="confirm-preview-area">
              <!-- Style Theme Preview -->
              <div v-if="confirmType === 'style' && pendingChange" class="modal-theme-preview-wrap">
                <RealThemePreview
                    :theme="pendingChange"
                    :contact="previewContact"
                    :company="previewCompany"
                />
              </div>

              <!-- Structural Preview — Classic -->
              <div v-if="confirmType === 'structural' && pendingChange === 'classic'" class="modal-layout-classic">
                <div class="lp-header">Header</div>
                <div class="lp-grid-3x2">
                  <div class="lp-btn">Phone</div>
                  <div class="lp-btn">WhatsApp</div>
                  <div class="lp-btn">Email</div>
                  <div class="lp-btn">Office</div>
                  <div class="lp-btn">Website</div>
                  <div class="lp-btn">Location</div>
                </div>
                <div class="lp-save">Save Contact</div>
                <div class="lp-secondary">
                  <div class="lp-btn-sm">360°</div>
                  <div class="lp-btn-sm">Reviews</div>
                  <div class="lp-btn-sm">Shop</div>
                </div>
              </div>

              <!-- Structural Preview — Modern -->
              <div v-if="confirmType === 'structural' && pendingChange === 'modern'" class="modal-layout-modern">
                <div class="lp-hero">
                  <div class="lp-avatar"></div>
                  <div class="lp-name" style="font-size:14px;">John Doe</div>
                  <div style="font-size:11px;color:rgba(255,255,255,0.85);">CEO &amp; Founder</div>
                </div>
                <div class="lp-vertical" style="padding:0 14px;">
                  <div class="lp-btn-full">📞 Phone</div>
                  <div class="lp-btn-full">💬 WhatsApp</div>
                  <div class="lp-btn-full">📧 Email</div>
                  <div class="lp-btn-full">🌐 Website</div>
                </div>
                <div class="lp-floating" style="margin:0 14px 14px;">💾 Save Contact</div>
              </div>
            </div>

            <!-- Meta -->
            <div class="confirm-meta">
              <h4 class="confirm-meta-title">
                {{ pendingChange?.name || (pendingChange === 'classic' ? 'Classic Grid' : 'Modern Hero') }}
              </h4>
              <p class="confirm-meta-sub">
                {{ pendingChange?.description || 'Apply this ' + confirmType + ' change to your contact card?' }}
              </p>

              <div v-if="confirmType === 'structural'" class="confirm-detail-row">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                </svg>
                <span><strong>Layout:</strong> {{ pendingChange === 'modern' ? 'Modern Hero' : 'Classic Grid' }}</span>
              </div>

              <div v-if="pendingChange?.isPremium" class="premium-notice">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path
                      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Premium Theme
              </div>
            </div>
          </div>

          <!-- Modal Actions -->
          <div class="confirm-modal-actions">
            <button @click="showConfirmModal = false" class="cancel-btn" type="button">Cancel</button>
            <button @click="applyChange" class="save-btn" :disabled="applying" type="button">
              <svg v-if="!applying" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                   class="spin-icon">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              {{ applying ? 'Applying…' : 'Apply Changes' }}
            </button>
          </div>

        </div>
      </div>
    </transition>

    <AlertModal
        v-bind="alertState"
        @confirm="alertState.onConfirm"
        @cancel="alertState.onCancel"
    />

  </div>
</template>

<script setup>
import {inject, onMounted, ref} from 'vue';
import api from '@/services/api.js';
import RealThemePreview from '@/components/contactCard/RealThemePreview.vue';
import AlertModal from '@/components/user/AlertModal.vue'; // ← NEW
import {useAlert} from '@/composables/useAlert.js'; // ← NEW

const theme = inject('theme', { isDark: ref(false) })
const isDarkMode = theme.isDark

const props = defineProps({
  activeTab: {type: String, required: true}
});

// ── Alert composable ──────────────────────────────────────────────── ← NEW
const {alertState, showAlert, showConfirm} = useAlert();

// ── State ──
const subTab = ref('structural');
const currentLayoutType = ref('classic');
const themes = ref([]);
const selectedTheme = ref(null);
const userPlan = ref('free');
const themesLoading = ref(true);
const applying = ref(false);
const showConfirmModal = ref(false);
const confirmType = ref('structural');
const pendingChange = ref(null);

const previewContact = ref({
  firstName: 'John', lastName: 'Doe', designation: 'CEO & Founder',
  mobile: '+1234567890', email: 'john@company.com', photo: null
});

const previewCompany = ref({
  companyName: 'Tech Solutions Inc.',
  bio: 'Leading the future of digital innovation',
  website: 'www.company.com', phone: '+1234567890', logo: null,
  googleLocation: 'https://maps.google.com',
  view360: null, googleReviews: null, tripAdvisor: null,
  socialLinks: {facebook: 'https://facebook.com', linkedin: 'https://linkedin.com', twitter: 'https://twitter.com'}
});

// ── Actions ──
function selectLayout(layoutType) {
  confirmType.value = 'structural';
  pendingChange.value = layoutType;
  showConfirmModal.value = true;
}

// ── Premium theme click ───────────────────────────────────────────── ← NEW
async function handleThemeClick(theme) {
  if (theme.isPremium && userPlan.value === 'free') {
    await showAlert({
      type: 'warning',
      title: 'Premium Theme',
      message: 'This is a premium theme. Upgrade your plan to unlock premium themes!',
      confirmLabel: 'Got it'
    });
    return;
  }
  confirmType.value = 'style';
  pendingChange.value = theme;
  showConfirmModal.value = true;
}

// ── Apply Change ──────────────────────────────────────────────────── ← NEW
async function applyChange() {
  if (!pendingChange.value) return;
  try {
    applying.value = true;

    if (confirmType.value === 'structural') {
      const currentThemeObj = themes.value.find(t => t.id === selectedTheme.value);
      if (!currentThemeObj) {
        await showAlert({
          type: 'warning',
          title: 'No Theme Selected',
          message: 'Please select a style theme first before changing the layout.',
          confirmLabel: 'OK'
        });
        return;
      }
      const response = await api.patch(`/themes/${currentThemeObj.id}`, {layoutType: pendingChange.value});
      if (response.data) {
        currentLayoutType.value = pendingChange.value;
        currentThemeObj.layoutType = pendingChange.value;
        showConfirmModal.value = false;
        await showAlert({                                             // ← NEW
          type: 'success',
          title: 'Layout Updated!',
          message: `Layout changed to ${pendingChange.value === 'modern' ? 'Modern Hero' : 'Classic Grid'} successfully.`,
          confirmLabel: 'Great!'
        });
      }
    } else {
      const response = await api.post('/themes/select', {themeId: pendingChange.value.id});
      if (response.data) {
        selectedTheme.value = pendingChange.value.id;
        currentLayoutType.value = pendingChange.value.layoutType || 'classic';
        showConfirmModal.value = false;
        await showAlert({                                             // ← NEW
          type: 'success',
          title: 'Theme Applied!',
          message: `Theme "${pendingChange.value.name}" has been applied successfully.`,
          confirmLabel: 'Great!'
        });
      }
    }
  } catch (err) {
    await showAlert({                                                 // ← NEW
      type: 'error',
      title: 'Apply Failed',
      message: err.response?.data?.message || 'Failed to apply changes. Please try again.',
      confirmLabel: 'OK'
    });
  } finally {
    applying.value = false;
  }
}

// ── Load Data ─────────────────────────────────────────────────────── ← NEW
async function loadThemesAndData() {
  try {
    themesLoading.value = true;
    const themesRes = await api.get('/themes');
    themes.value = themesRes.data;
    const userRes = await api.get('/auth/me');
    selectedTheme.value = userRes.data.selectedThemeId;
    userPlan.value = userRes.data.plan || 'free';
    const selectedThemeObj = themes.value.find(t => t.id === selectedTheme.value);
    if (selectedThemeObj) currentLayoutType.value = selectedThemeObj.layoutType || 'classic';
    try {
      const dashData = await api.get('/dashboard/data');
      if (dashData.data.contacts?.[0]) previewContact.value = dashData.data.contacts[0];
      if (dashData.data.companies?.[0]) previewCompany.value = dashData.data.companies[0];
    } catch { /* use sample data */
    }
  } catch {
    await showAlert({                                                 // ← NEW
      type: 'error',
      title: 'Failed to Load',
      message: 'Could not load themes. Please refresh the page.',
      confirmLabel: 'OK'
    });
  } finally {
    themesLoading.value = false;
  }
}

onMounted(() => {
  if (props.activeTab === 'theme') loadThemesAndData();
});
</script>

<style scoped>
/* ══════════════════════════════════════
   CSS CUSTOM PROPERTIES — mirrors Contact tab exactly
══════════════════════════════════════ */
.theme-tab {
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
  --c-warning: #a06010;
  --c-warning-light: #fef6ec;
  --c-shadow-xs: 0 1px 2px rgba(28, 20, 16, 0.06);
  --c-shadow-sm: 0 2px 6px rgba(28, 20, 16, 0.08), 0 1px 2px rgba(28, 20, 16, 0.04);
  --c-shadow-md: 0 6px 20px rgba(28, 20, 16, 0.10), 0 2px 6px rgba(28, 20, 16, 0.06);
  --c-shadow-lg: 0 16px 48px rgba(28, 20, 16, 0.16), 0 4px 12px rgba(28, 20, 16, 0.08);
  --c-radius: 14px;
  --c-radius-sm: 8px;
  --c-radius-xs: 5px;
  --c-radius-pill: 100px;
  font-family: 'Segoe UI', 'SF Pro Display', system-ui, -apple-system, sans-serif;
  font-size: 14px;
  color: var(--c-text-primary);
  background: var(--c-bg);
  line-height: 1.5;
}

.theme-tab.dark-mode {
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
  --c-warning: #e8a840;
  --c-warning-light: #281c08;
  --c-shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.2);
  --c-shadow-sm: 0 2px 6px rgba(0, 0, 0, 0.3);
  --c-shadow-md: 0 6px 20px rgba(0, 0, 0, 0.4);
  --c-shadow-lg: 0 16px 48px rgba(0, 0, 0, 0.5);
}

*, *::before, *::after {
  box-sizing: border-box;
}

button {
  font-family: inherit;
  cursor: pointer;
}

/* ══════════════════════════════════════
   LIST VIEW SHELL
══════════════════════════════════════ */
.list-view {
  padding: 24px;
  max-width: 1800px;
  margin: 0 auto;
  border-radius: 0.5rem;
}

/* ── Header ── */
.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.list-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-title {
  font-size: 24px;
  font-weight: 750;
  letter-spacing: -0.6px;
  color: var(--c-text-primary);
  margin: 0;
}

.count-pill {
  font-size: 12px;
  font-weight: 700;
  padding: 4px 11px;
  border-radius: var(--c-radius-pill);
  letter-spacing: 0.02em;
}

.pill-free {
  background: var(--c-accent-light);
  color: var(--c-accent);
}

.pill-premium {
  background: linear-gradient(135deg, var(--c-accent), var(--c-accent-2));
  color: #fff;
}

/* ── Sub-Tab Switcher — matches Contact type-selector-group ── */
.sub-tab-group {
  display: flex;
  gap: 0;
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-sm);
  overflow: hidden;
  background: var(--c-surface);
  box-shadow: var(--c-shadow-xs);
}

.sub-tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 20px;
  background: transparent;
  border: none;
  border-right: 1.5px solid var(--c-border);
  font-size: 13px;
  font-weight: 650;
  color: var(--c-text-secondary);
  transition: all 0.18s;
  cursor: pointer;
  position: relative;
}

.sub-tab-btn:last-child {
  border-right: none;
}

.sub-tab-btn.active {
  background: var(--c-accent);
  color: #fff;
}

.sub-tab-btn:hover:not(.active) {
  background: var(--c-accent-light);
  color: var(--c-accent);
}

.tab-active-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.7);
  flex-shrink: 0;
}

/* ── Info Strip ── */
.info-strip {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 14px;
  margin-bottom: 20px;
  background: var(--c-accent-subtle);
  border: 1.5px solid var(--c-accent-light);
  border-radius: var(--c-radius-sm);
  font-size: 13px;
  color: var(--c-text-secondary);
}

.info-strip svg {
  color: var(--c-accent);
  flex-shrink: 0;
  margin-top: 1px;
}

.inline-link {
  display: inline;
  background: none;
  border: none;
  padding: 0;
  margin-left: 8px;
  font-size: 13px;
  font-weight: 650;
  color: var(--c-accent);
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.15s;
}

.inline-link:hover {
  color: var(--c-accent-hover);
}

/* ── Empty / Loading ── */
.empty-state {
  text-align: center;
  padding: 64px 24px;
  background: var(--c-surface);
  border: 2px dashed var(--c-border);
  border-radius: var(--c-radius);
}

.empty-icon-wrap {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: var(--c-accent-light);
  color: var(--c-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.spin-wrap {
  background: var(--c-accent-light);
}

.spin-icon {
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--c-text-primary);
  margin: 0 0 8px;
}

.empty-sub {
  font-size: 13px;
  color: var(--c-text-muted);
  margin: 0;
}

/* ══════════════════════════════════════
   THEME GRID — matches contact-grid
══════════════════════════════════════ */
.theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

/* ── Theme Card — matches contact-card ── */
.theme-card {
  background: var(--c-surface);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: box-shadow 0.22s, border-color 0.22s, transform 0.18s;
  box-shadow: var(--c-shadow-sm);
  position: relative;
}

.theme-card:hover {
  box-shadow: var(--c-shadow-md);
  border-color: var(--c-accent-2);
  transform: translateY(-3px);
}

.theme-card.active {
  border-color: var(--c-accent);
  box-shadow: 0 0 0 3px rgba(124, 92, 78, 0.14), var(--c-shadow-sm);
}

.dark-mode .theme-card.active {
  box-shadow: 0 0 0 3px rgba(196, 144, 110, 0.18), var(--c-shadow-sm);
}

.theme-card.disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

/* Premium Overlay */
.premium-overlay {
  position: absolute;
  inset: 0;
  background: rgba(28, 20, 16, 0.88);
  backdrop-filter: blur(5px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.2s;
}

.dark-mode .premium-overlay {
  background: rgba(100, 60, 30, 0.92);
}

.theme-card.disabled:hover .premium-overlay {
  opacity: 1;
}

.lock-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--c-accent), var(--c-accent-2));
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 0 4px 14px rgba(124, 92, 78, 0.4);
  animation: pulse-lock 2s ease-in-out infinite;
}

@keyframes pulse-lock {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.06);
  }
}

.lock-label {
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

/* Preview Wrapper — matches card-top gradient */
.theme-preview-wrapper {
  position: relative;
  height: 220px;
  background: linear-gradient(135deg, var(--c-accent-subtle) 0%, var(--c-surface) 100%);
  border-bottom: 1px solid var(--c-border);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px;
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

/* Active Badge — matches contact status-dot style */
.active-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 11px;
  background: linear-gradient(135deg, var(--c-accent), var(--c-accent-2));
  color: #fff;
  border-radius: var(--c-radius-pill);
  font-size: 11px;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(124, 92, 78, 0.35);
  z-index: 5;
  letter-spacing: 0.02em;
}

/* Premium Badge */
.premium-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  background: linear-gradient(135deg, var(--c-accent), var(--c-accent-2));
  color: #fff;
  border-radius: var(--c-radius-pill);
  font-size: 11px;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(124, 92, 78, 0.35);
  z-index: 5;
}

/* Theme Info — matches card-body */
.theme-info {
  padding: 14px 18px;
  background: var(--c-surface);
  flex: 1;
}

.theme-name {
  font-size: 14px;
  font-weight: 750;
  color: var(--c-text-primary);
  margin: 0 0 4px;
  letter-spacing: -0.2px;
}

.theme-desc {
  font-size: 12px;
  color: var(--c-text-muted);
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Feature list */
.feature-list {
  list-style: none;
  padding: 0;
  margin: 10px 0 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.feature-list li {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--c-text-secondary);
}

.feature-list svg {
  color: var(--c-success);
  flex-shrink: 0;
}

/* ══════════════════════════════════════
   LAYOUT PREVIEWS (inside card)
══════════════════════════════════════ */
.layout-preview-classic,
.layout-preview-modern {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 6px;
  font-size: 6.5px;
}

.lp-header {
  height: 24px;
  background: linear-gradient(135deg, var(--c-accent), var(--c-accent-2));
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 7px;
}

.lp-grid-3x2 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 3px;
}

.lp-btn {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: 3px;
  padding: 5px 3px;
  text-align: center;
  font-size: 6px;
  font-weight: 600;
  color: var(--c-accent);
}

.lp-save {
  height: 16px;
  background: var(--c-text-primary);
  color: var(--c-surface);
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 6px;
  font-weight: 700;
}

.lp-secondary {
  display: flex;
  gap: 3px;
}

.lp-btn-sm {
  flex: 1;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: 3px;
  padding: 4px 2px;
  text-align: center;
  font-size: 5.5px;
  color: var(--c-accent);
  font-weight: 600;
}

/* Modern layout preview */
.lp-hero {
  background: linear-gradient(135deg, var(--c-accent), var(--c-accent-2));
  height: 60px;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
}

.lp-avatar {
  width: 16px;
  height: 16px;
  background: #fff;
  border-radius: 50%;
  border: 1.5px solid #fff;
}

.lp-name {
  font-size: 7px;
  font-weight: 700;
  color: #fff;
}

.lp-vertical {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 0 6px;
}

.lp-btn-full {
  background: linear-gradient(135deg, var(--c-accent), var(--c-accent-2));
  color: #fff;
  padding: 5px;
  border-radius: 3px;
  text-align: center;
  font-size: 6px;
  font-weight: 700;
}

.lp-floating {
  background: var(--c-text-primary);
  color: var(--c-surface);
  padding: 5px;
  margin: 0 6px;
  border-radius: 3px;
  text-align: center;
  font-size: 6px;
  font-weight: 700;
}

/* ══════════════════════════════════════
   CONFIRM MODAL — matches QR popup style
══════════════════════════════════════ */
.qr-overlay {
  position: fixed;
  inset: 0;
  background: rgba(16, 14, 20, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  padding: 16px;
  overflow-y: auto;
}

.confirm-modal {
  background: var(--c-surface);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius);
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: var(--c-shadow-lg);
  margin: auto;
}

.confirm-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  background: linear-gradient(135deg, var(--c-accent-subtle) 0%, var(--c-surface) 100%);
  border-bottom: 1.5px solid var(--c-border);
  flex-shrink: 0;
}

.confirm-modal-title {
  font-size: 16px;
  font-weight: 750;
  color: var(--c-text-primary);
  margin: 0;
  letter-spacing: -0.3px;
}

/* Close button — matches qr-close-btn */
.qr-close-btn {
  background: var(--c-surface-2);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-xs);
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--c-text-secondary);
  transition: all 0.15s;
}

.qr-close-btn:hover {
  border-color: var(--c-danger);
  color: var(--c-danger);
  background: var(--c-danger-light);
}

/* Modal Body */
.confirm-modal-body {
  padding: 20px 22px;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* Preview area */
.confirm-preview-area {
  background: var(--c-surface-2);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-sm);
  padding: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 280px;
  overflow: hidden;
}

.modal-theme-preview-wrap {
  width: 100%;
  max-width: 340px;
}

.modal-theme-preview-wrap :deep(.theme-preview-content) {
  transform: scale(0.75);
  transform-origin: top center;
  width: 360px;
}

/* Modal layout previews — bigger versions of card previews */
.modal-layout-classic,
.modal-layout-modern {
  background: var(--c-surface);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-sm);
  padding: 16px;
  width: 100%;
  max-width: 280px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: var(--c-shadow-sm);
}

.modal-layout-classic .lp-header,
.modal-layout-modern .lp-hero {
  font-size: 11px;
}

.modal-layout-classic .lp-btn,
.modal-layout-classic .lp-btn-sm,
.modal-layout-classic .lp-save,
.modal-layout-modern .lp-btn-full,
.modal-layout-modern .lp-floating,
.modal-layout-modern .lp-name {
  font-size: 10px;
}

.modal-layout-classic .lp-header {
  height: 44px;
  border-radius: 6px;
}

.modal-layout-classic .lp-btn {
  padding: 10px 6px;
  font-size: 9px;
  border-radius: 5px;
}

.modal-layout-classic .lp-save {
  height: 32px;
  border-radius: 5px;
}

.modal-layout-classic .lp-btn-sm {
  padding: 9px 4px;
  font-size: 8.5px;
  border-radius: 5px;
}

.modal-layout-modern .lp-hero {
  height: 90px;
  border-radius: 6px;
  gap: 5px;
}

.modal-layout-modern .lp-avatar {
  width: 32px;
  height: 32px;
}

.modal-layout-modern .lp-btn-full {
  padding: 10px;
  font-size: 9px;
  border-radius: 5px;
}

.modal-layout-modern .lp-floating {
  padding: 10px;
  font-size: 9px;
  border-radius: 5px;
  margin: 0;
}

.modal-layout-modern .lp-vertical {
  gap: 5px;
  padding: 0;
}

/* Meta section */
.confirm-meta {
  background: var(--c-surface-2);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-sm);
  padding: 16px;
}

.confirm-meta-title {
  font-size: 15px;
  font-weight: 750;
  color: var(--c-text-primary);
  margin: 0 0 6px;
  letter-spacing: -0.2px;
}

.confirm-meta-sub {
  font-size: 13px;
  color: var(--c-text-muted);
  margin: 0 0 14px;
  line-height: 1.5;
}

.confirm-detail-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--c-text-secondary);
  padding: 10px 12px;
  background: var(--c-surface);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-xs);
  margin-bottom: 10px;
}

.confirm-detail-row svg {
  color: var(--c-accent);
  flex-shrink: 0;
}

.confirm-detail-row strong {
  color: var(--c-text-primary);
}

.premium-notice {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: linear-gradient(135deg, var(--c-accent-light), var(--c-accent-subtle));
  border: 1.5px solid var(--c-accent-light);
  border-radius: var(--c-radius-xs);
  font-size: 13px;
  font-weight: 700;
  color: var(--c-accent);
}

.premium-notice svg {
  color: #d4af37;
  flex-shrink: 0;
}

/* Modal Actions — matches QR modal actions */
.confirm-modal-actions {
  display: flex;
  gap: 10px;
  padding: 16px 22px;
  border-top: 1.5px solid var(--c-border);
  background: var(--c-surface-2);
  flex-shrink: 0;
}

/* Reuse contact-tab button styles */
.cancel-btn {
  flex: 1;
  padding: 11px 20px;
  background: var(--c-surface-2);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-sm);
  font-size: 13px;
  font-weight: 650;
  color: var(--c-text-secondary);
  transition: all 0.15s;
}

.cancel-btn:hover {
  border-color: var(--c-danger);
  color: var(--c-danger);
  background: var(--c-danger-light);
}

.save-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 11px 24px;
  background: var(--c-accent);
  color: #fff;
  border: none;
  border-radius: var(--c-radius-sm);
  font-size: 13px;
  font-weight: 750;
  transition: all 0.15s;
  box-shadow: 0 2px 8px rgba(124, 92, 78, 0.3);
  letter-spacing: 0.01em;
}

.save-btn:hover:not(:disabled) {
  background: var(--c-accent-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(124, 92, 78, 0.4);
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Modal Transition — same as contact tab */
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.22s ease;
}

.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}

/* ══════════════════════════════════════
   RESPONSIVE — TABLET (≤ 900px)
══════════════════════════════════════ */
@media (max-width: 900px) {
  .list-view {
    padding: 20px;
  }

  .theme-grid {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  }
}

/* ══════════════════════════════════════
   RESPONSIVE — MOBILE (≤ 640px)
══════════════════════════════════════ */
@media (max-width: 640px) {
  .list-view {
    padding: 14px;
  }

  .page-title {
    font-size: 20px;
  }

  .list-header {
    margin-bottom: 14px;
  }

  .sub-tab-group {
    width: 100%;
  }

  .sub-tab-btn {
    flex: 1;
    justify-content: center;
    padding: 9px 12px;
    font-size: 12px;
  }

  .theme-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .theme-preview-wrapper {
    height: 190px;
  }

  .confirm-modal {
    max-height: 85vh;
  }

  .confirm-modal-header {
    padding: 14px 16px;
  }

  .confirm-modal-title {
    font-size: 14px;
  }

  .confirm-modal-body {
    padding: 14px 16px;
    gap: 14px;
  }

  .confirm-preview-area {
    min-height: 200px;
    padding: 12px;
  }

  .modal-theme-preview-wrap :deep(.theme-preview-content) {
    transform: scale(0.45);
    width: 280px;
  }

  .modal-layout-classic,
  .modal-layout-modern {
    max-width: 220px;
    padding: 12px;
  }

  .confirm-modal-actions {
    padding: 12px 16px;
    flex-direction: column;
  }

  .cancel-btn, .save-btn {
    width: 100%;
    justify-content: center;
  }
}

/* ══════════════════════════════════════
   TOUCH TARGETS
══════════════════════════════════════ */
@media (hover: none) and (pointer: coarse) {
  .sub-tab-btn, .cancel-btn, .save-btn, .qr-close-btn,
  .inline-link {
    min-height: 44px;
  }
}

/* ══════════════════════════════════════
   ACCESSIBILITY
══════════════════════════════════════ */
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
