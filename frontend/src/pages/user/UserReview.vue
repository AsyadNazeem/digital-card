<template>
  <div v-if="activeTab === 'review'" :class="['review-tab', { 'dark-mode': isDarkMode }]">

    <!-- ══════════════════════════════════ LIST VIEW ══════════════════════════════════ -->
    <div v-if="!showReviewForm" class="list-view">

      <!-- Header -->
      <div class="list-header">
        <div class="list-header-left">
          <h2 class="page-title">Reviews / Branch Links</h2>
          <span class="count-pill">{{ reviewItems.length }} total</span>
        </div>
        <button
            v-if="reviewCount < userLimits.reviewLimit"
            class="add-btn"
            @click="openReviewForm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Review
        </button>
        <div v-else class="limit-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          Limit Reached
        </div>
      </div>

      <!-- Review Cards -->
      <div v-if="reviewItems.length > 0" class="review-grid">
        <div
            v-for="(r, idx) in reviewItems"
            :key="r._tempId || r.id"
            class="review-card"
        >
          <!-- Card Top -->
          <div class="card-top">
            <div class="branch-avatar">
              {{ (r.branchName?.[0] || '#').toUpperCase() }}
            </div>
            <div class="card-identity">
              <h3 class="branch-name">{{ r.branchName }}</h3>
              <p class="branch-location">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                {{ r.location || 'No location set' }}
              </p>
              <span class="company-tag" v-if="companyNameById(r.companyId)">
                {{ companyNameById(r.companyId) }}
              </span>
            </div>
            <span class="row-num">#{{ idx + 1 }}</span>
          </div>

          <!-- Card Body -->
          <div class="card-body">
            <div class="link-list">
              <div class="link-row" v-if="r.googleLink">
                <span class="link-label">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
                  </svg>
                  Google
                </span>
                <a :href="r.googleLink" target="_blank" class="link-value">{{ shortLink(r.googleLink) }}</a>
              </div>
              <div class="link-row empty-link" v-else>
                <span class="link-label">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
                  </svg>
                  Google
                </span>
                <span class="link-empty">Not set</span>
              </div>

              <div class="link-row" v-if="r.tripadvisorLink">
                <span class="link-label">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11l2 2m-2-2v10a1 1 0 0 1-1 1h-3"/>
                  </svg>
                  Tripadvisor
                </span>
                <a :href="r.tripadvisorLink" target="_blank" class="link-value tripadvisor">{{ shortLink(r.tripadvisorLink) }}</a>
              </div>
              <div class="link-row empty-link" v-else>
                <span class="link-label">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11l2 2m-2-2v10a1 1 0 0 1-1 1h-3"/>
                  </svg>
                  Tripadvisor
                </span>
                <span class="link-empty">Not set</span>
              </div>
            </div>
          </div>

          <!-- Card Actions -->
          <div class="card-actions">
            <button class="action-btn view-btn" @click="openReviewShareModal(r)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>
              </svg>
              View
            </button>
            <button class="action-btn edit-btn" @click="editReview(idx)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 20h9"/><path d="M16.5 3.5l4 4L7 21H3v-4z"/>
              </svg>
              Edit
            </button>
            <button class="action-btn delete-btn" @click="removeReview(idx)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-2 14H7L5 6"/>
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon-wrap">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 0 0 .95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 0 0-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 0 0-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 0 0-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 0 0 .951-.69l1.519-4.674z"/>
          </svg>
        </div>
        <p class="empty-title">No review entries yet</p>
        <p class="empty-sub">Add your first branch review link to get started</p>
        <button
            @click="openReviewForm"
            class="empty-action-btn"
            v-if="reviewCount < userLimits.reviewLimit"
        >
          + Add Review
        </button>
      </div>
    </div>

    <!-- ══════════════════════════════════ FORM VIEW ══════════════════════════════════ -->
    <div v-else class="form-view">

      <!-- Sticky Top Bar -->
      <div class="form-topbar">
        <button @click="closeReviewForm" class="back-btn" type="button">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          <span class="back-label">Back</span>
        </button>
        <h2 class="form-page-title">Add / Edit Reviews</h2>
        <button @click="saveAllReviews" class="save-btn-top" :disabled="savingReviews" type="button">
          <svg v-if="!savingReviews" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
            <polyline points="17 21 17 13 7 13 7 21"/>
          </svg>
          <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin-icon">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
          {{ savingReviews ? 'Saving…' : 'Save All' }}
        </button>
      </div>

      <!-- Form Body -->
      <div class="form-body">
        <div
            v-for="(item, index) in reviewFormRows"
            :key="item._tempId"
            class="form-section"
        >
          <!-- Section Header -->
          <div class="section-label">
            <span class="section-number">{{ String(index + 1).padStart(2, '0') }}</span>
            <span class="section-title">Branch Entry</span>
            <button
                class="remove-row-btn"
                @click="removeRow(index)"
                type="button"
                title="Remove this entry"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              Remove
            </button>
          </div>

          <div class="fields-grid">
            <!-- Company -->
            <div class="field-wrap">
              <label class="field-label">Company <span class="req">*</span></label>
              <select v-model="item.companyId" class="field-input field-select">
                <option disabled value="">Select a company</option>
                <option v-for="c in userCompanies" :key="c.id" :value="c.id">{{ c.companyName }}</option>
              </select>
              <p v-if="item._errors?.companyId" class="field-note error">{{ item._errors.companyId }}</p>
            </div>

            <!-- Branch Name -->
            <div class="field-wrap">
              <label class="field-label">Branch Name <span class="req">*</span></label>
              <input v-model="item.branchName" type="text" class="field-input" placeholder="e.g. Colombo Branch" />
              <p v-if="item._errors?.branchName" class="field-note error">{{ item._errors.branchName }}</p>
            </div>

            <!-- Location -->
            <div class="field-wrap full">
              <label class="field-label">Branch Location</label>
              <div class="input-icon-wrap">
                <svg class="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <input v-model="item.location" type="text" class="field-input icon-padded" placeholder="City, Area, Address" />
              </div>
            </div>

            <!-- Google Review Link -->
            <div class="field-wrap">
              <label class="field-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
                Google Review Link
              </label>
              <input v-model="item.googleLink" type="url" class="field-input" placeholder="https://g.page/r/..." />
              <p v-if="item._errors?.googleLink" class="field-note error">{{ item._errors.googleLink }}</p>
            </div>

            <!-- Tripadvisor Link -->
            <div class="field-wrap">
              <label class="field-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
                Tripadvisor Link
              </label>
              <input v-model="item.tripadvisorLink" type="url" class="field-input" placeholder="https://tripadvisor.com/..." />
              <p v-if="item._errors?.tripadvisorLink" class="field-note error">{{ item._errors.tripadvisorLink }}</p>
            </div>
          </div>

          <!-- Add More Button (per row) -->
          <div class="row-add-action">
            <button class="add-more-btn" @click="addMore(index)" type="button">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Another Branch
            </button>
          </div>
        </div>

        <!-- Bottom Actions -->
        <div class="form-bottom-actions">
          <button @click="closeReviewForm" class="cancel-btn" :disabled="savingReviews" type="button">Cancel</button>
          <button @click="saveAllReviews" class="save-btn" :disabled="savingReviews" type="button">
            <svg v-if="!savingReviews" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/>
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin-icon">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            {{ savingReviews ? 'Saving…' : 'Save All' }}
          </button>
        </div>
      </div>
    </div>
    <AlertModal
        v-bind="alertState"
        @confirm="alertState.onConfirm"
        @cancel="alertState.onCancel"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, inject } from 'vue';
import api from '@/services/api.js';
import AlertModal from '@/components/user/AlertModal.vue';          // ← NEW
import { useAlert } from '@/composables/useAlert.js';               // ← NEW

const isDarkMode = inject('isDarkMode', ref(false));

const props = defineProps({
  activeTab: { type: String, required: true },
  reviewCount: { type: Number, required: true },
  userLimits: { type: Object, required: true }
});

const emit = defineEmits(['review-added', 'review-deleted', 'review-updated']);

// ── Alert composable ──────────────────────────────────────────────── ← NEW
const { alertState, showAlert, showConfirm } = useAlert();

// ── State ──
const reviewItems = ref([]);
const userCompanies = ref([]);
const showReviewForm = ref(false);
const reviewFormRows = ref([]);
const savingReviews = ref(false);
const token = localStorage.getItem('token');

function makeEmptyReviewRow(overrides = {}) {
  return {
    _tempId: 'tmp_' + Math.random().toString(36).substr(2, 9),
    id: overrides.id || null,
    companyId: overrides.companyId || '',
    branchName: overrides.branchName || '',
    location: overrides.location || '',
    googleLink: overrides.googleLink || '',
    tripadvisorLink: overrides.tripadvisorLink || '',
    _errors: {}
  };
}

function validateRow(row) {
  row._errors = {};
  if (!row.companyId) row._errors.companyId = 'Please select a company.';
  if (!row.branchName?.trim()) row._errors.branchName = 'Branch name is required.';
  if (row.googleLink?.trim()) {
    try { new URL(row.googleLink); } catch { row._errors.googleLink = 'Invalid URL'; }
  }
  if (row.tripadvisorLink?.trim()) {
    try { new URL(row.tripadvisorLink); } catch { row._errors.tripadvisorLink = 'Invalid URL'; }
  }
  return Object.keys(row._errors).length === 0;
}

async function loadUserCompanies() {
  try {
    const res = await api.get('/dashboard/data', { headers: { Authorization: `Bearer ${token}` } });
    userCompanies.value = res.data.companies || [];
  } catch { userCompanies.value = []; }
}

async function loadReviews() {
  try {
    const res = await api.get('/dashboard/reviews', { headers: { Authorization: `Bearer ${token}` } });
    reviewItems.value = res.data.reviews || [];
    emit('review-added', reviewItems.value.length);
  } catch {
    reviewItems.value = [];
    emit('review-added', 0);
  }
}

// ── Open Form ─────────────────────────────────────────────────────── ← NEW
async function openReviewForm() {
  if (props.reviewCount >= props.userLimits.reviewLimit) {
    await showAlert({
      type: 'warning',
      title: 'Limit Reached',
      message: `You've reached your review limit (${props.userLimits.reviewLimit}).`,
      confirmLabel: 'OK'
    });
    return;
  }
  showReviewForm.value = true;
  if (reviewFormRows.value.length === 0) reviewFormRows.value.push(makeEmptyReviewRow());
}

function closeReviewForm() {
  showReviewForm.value = false;
  reviewFormRows.value = [];
}

// ── Add More ──────────────────────────────────────────────────────── ← NEW
async function addMore(index) {
  const row = reviewFormRows.value[index];
  if (!row || !validateRow(row)) {
    await showAlert({
      type: 'warning',
      title: 'Validation Error',
      message: 'Please fill all mandatory fields before adding a new row.',
      confirmLabel: 'OK'
    });
    return;
  }
  const newItemsCount = reviewFormRows.value.filter(r => !r.id).length + 1;
  if (props.reviewCount + newItemsCount > props.userLimits.reviewLimit) {
    await showAlert({
      type: 'warning',
      title: 'Limit Reached',
      message: `Adding another row would exceed your limit (${props.userLimits.reviewLimit}).`,
      confirmLabel: 'OK'
    });
    return;
  }
  reviewFormRows.value.splice(index + 1, 0, makeEmptyReviewRow());
}

function removeRow(index) {
  if (reviewFormRows.value.length === 1) {
    reviewFormRows.value[0] = makeEmptyReviewRow();
    return;
  }
  reviewFormRows.value.splice(index, 1);
}

// ── Save All ──────────────────────────────────────────────────────── ← NEW
async function saveAllReviews() {
  let ok = true;
  for (const r of reviewFormRows.value) { if (!validateRow(r)) ok = false; }
  if (!ok) {
    await showAlert({
      type: 'warning',
      title: 'Validation Error',
      message: 'Please fix all validation errors before saving.',
      confirmLabel: 'OK'
    });
    return;
  }

  savingReviews.value = true;
  try {
    const payload = reviewFormRows.value.map(r => ({
      id: r.id || null, companyId: r.companyId, branchName: r.branchName,
      location: r.location, googleLink: r.googleLink, tripadvisorLink: r.tripadvisorLink
    }));
    const res = await api.post(
        '/dashboard/reviews/bulk-save',
        { items: payload },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    reviewItems.value = res.data.reviews || [];
    await loadReviews();
    emit('review-added', reviewItems.value.length);
    reviewFormRows.value = [];
    showReviewForm.value = false;
    await showAlert({                                                   // ← NEW
      type: 'success',
      title: 'Saved!',
      message: 'All review entries have been saved successfully.',
      confirmLabel: 'Great!'
    });
  } catch (err) {
    await showAlert({                                                   // ← NEW
      type: 'error',
      title: 'Save Failed',
      message: err.response?.data?.message || 'Failed to save reviews. Please try again.',
      confirmLabel: 'OK'
    });
  } finally { savingReviews.value = false; }
}

function editReview(index) {
  const item = reviewItems.value[index];
  reviewFormRows.value = [makeEmptyReviewRow({
    id: item.id, companyId: item.companyId, branchName: item.branchName,
    location: item.location, googleLink: item.googleLink, tripadvisorLink: item.tripadvisorLink
  })];
  showReviewForm.value = true;
}

// ── Delete ───────────────────────────────────────────────────────── ← NEW
async function removeReview(index) {
  const item = reviewItems.value[index];

  const confirmed = await showConfirm({
    type: 'danger',
    title: 'Delete Review Entry?',
    message: 'This action cannot be undone. The review entry will be permanently removed.',
    confirmLabel: 'Delete',
    cancelLabel: 'Cancel'
  });

  if (!confirmed) return;

  try {
    if (item.id) {
      await api.delete(`/dashboard/reviews/${item.id}`, { headers: { Authorization: `Bearer ${token}` } });
    }
    reviewItems.value.splice(index, 1);
    emit('review-deleted', reviewItems.value.length);
    await showAlert({                                                   // ← NEW
      type: 'success',
      title: 'Entry Deleted',
      message: 'The review entry has been permanently removed.',
      confirmLabel: 'OK'
    });
  } catch {
    await showAlert({                                                   // ← NEW
      type: 'error',
      title: 'Delete Failed',
      message: 'Could not delete the review entry. Please try again.',
      confirmLabel: 'OK'
    });
  }
}

// ── Share / View ──────────────────────────────────────────────────── ← NEW
async function openReviewShareModal(review) {
  try {
    const res = await api.post(
        `/dashboard/reviews/${review.id}/generate-share`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
    );
    window.open(res.data.shareUrl, '_blank');
  } catch (err) {
    await showAlert({                                                   // ← NEW
      type: 'error',
      title: 'Failed to Open',
      message: 'Could not open the review page: ' + (err.response?.data?.message || err.message),
      confirmLabel: 'OK'
    });
  }
}

function shortLink(url) {
  try {
    const u = new URL(url);
    return u.hostname + (u.pathname && u.pathname !== '/' ? u.pathname.slice(0, 18) + '…' : '');
  } catch { return url; }
}

function companyNameById(id) {
  return userCompanies.value.find(x => x.id === id)?.companyName || null;
}

watch(() => props.activeTab, (newTab) => {
  if (newTab === 'review' && reviewItems.value.length === 0) {
    loadReviews(); loadUserCompanies();
  }
});

onMounted(() => {
  if (props.activeTab === 'review') { loadReviews(); loadUserCompanies(); }
});
</script>

<style scoped>
/* ══════════════════════════════════════
   CSS CUSTOM PROPERTIES — matches ContactTab palette exactly
══════════════════════════════════════ */
.review-tab {
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
  --c-info: #1a5a9e;
  --c-info-light: #eaf2fc;
  --c-tripadvisor: #2a7a3a;
  --c-tripadvisor-light: #eaf6ec;
  --c-shadow-xs: 0 1px 2px rgba(28,20,16,0.06);
  --c-shadow-sm: 0 2px 6px rgba(28,20,16,0.08), 0 1px 2px rgba(28,20,16,0.04);
  --c-shadow-md: 0 6px 20px rgba(28,20,16,0.10), 0 2px 6px rgba(28,20,16,0.06);
  --c-shadow-lg: 0 16px 48px rgba(28,20,16,0.16), 0 4px 12px rgba(28,20,16,0.08);
  --c-radius: 14px;
  --c-radius-sm: 8px;
  --c-radius-xs: 5px;
  --c-radius-pill: 100px;
  font-family: 'Segoe UI', 'SF Pro Display', system-ui, -apple-system, sans-serif;
  font-size: 14px;
  color: var(--c-text-primary);
  background: var(--c-bg);
  line-height: 1.5;
  border-radius: 0.5rem;
}

.review-tab.dark-mode {
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
  --c-info: #60a8e8;
  --c-info-light: #101c2e;
  --c-tripadvisor: #60c870;
  --c-tripadvisor-light: #0e1e10;
}

*, *::before, *::after { box-sizing: border-box; }
button { font-family: inherit; cursor: pointer; }
input, select { font-family: inherit; }
a { text-decoration: none; }

/* ══════════════════════════════════════
   LIST VIEW
══════════════════════════════════════ */
.list-view {
  padding: 24px;
  max-width: 1800px;
  margin: 0 auto;
  border-radius: 0.5rem;
}


.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 24px;
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
  background: var(--c-accent-light);
  color: var(--c-accent);
  font-size: 12px;
  font-weight: 700;
  padding: 4px 11px;
  border-radius: var(--c-radius-pill);
  letter-spacing: 0.02em;
}

.add-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: var(--c-accent);
  color: #fff;
  border: none;
  border-radius: var(--c-radius-sm);
  font-size: 14px;
  font-weight: 650;
  transition: background 0.18s, transform 0.12s, box-shadow 0.18s;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(124,92,78,0.3);
  letter-spacing: 0.01em;
}

.add-btn:hover {
  background: var(--c-accent-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(124,92,78,0.4);
}

.add-btn:active { transform: translateY(0); }

.limit-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 16px;
  background: var(--c-surface);
  color: var(--c-text-muted);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-sm);
  font-size: 13px;
  font-weight: 600;
}

/* Review Grid */
.review-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
  margin-bottom: 28px;
}

.review-card {
  background: var(--c-surface);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.22s, border-color 0.22s, transform 0.18s;
  box-shadow: var(--c-shadow-sm);
}

.review-card:hover {
  box-shadow: var(--c-shadow-md);
  border-color: var(--c-accent-2);
  transform: translateY(-3px);
}

/* Card Top */
.card-top {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 18px 18px 14px;
  background: linear-gradient(135deg, var(--c-accent-subtle) 0%, var(--c-surface) 100%);
  border-bottom: 1px solid var(--c-border);
  position: relative;
}

.branch-avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--c-accent) 0%, var(--c-accent-2) 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 800;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(124,92,78,0.3);
}

.card-identity { flex: 1; min-width: 0; }

.branch-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--c-text-primary);
  margin: 0 0 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  letter-spacing: -0.2px;
}

.branch-location {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: var(--c-text-secondary);
  margin: 0 0 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.branch-location svg { flex-shrink: 0; color: var(--c-text-muted); }

.company-tag {
  display: inline-flex;
  align-items: center;
  padding: 3px 9px;
  background: var(--c-accent-light);
  color: var(--c-accent);
  border-radius: var(--c-radius-pill);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.01em;
}

.row-num {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: var(--c-radius-pill);
  font-size: 11px;
  font-weight: 700;
  background: var(--c-surface-2);
  color: var(--c-text-muted);
  border: 1px solid var(--c-border);
  margin-top: 2px;
}

/* Card Body */
.card-body {
  padding: 14px 18px;
  flex: 1;
}

.link-list { display: flex; flex-direction: column; gap: 8px; }

.link-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  overflow: hidden;
}

.link-label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 700;
  color: var(--c-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  flex-shrink: 0;
  width: 88px;
}

.link-label svg { color: var(--c-text-muted); flex-shrink: 0; }

.link-value {
  color: var(--c-info);
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.link-value:hover { text-decoration: underline; }

.link-value.tripadvisor { color: var(--c-tripadvisor); }

.link-empty { color: var(--c-text-muted); font-style: italic; font-size: 12px; }
.empty-link { opacity: 0.55; }

/* Card Actions */
.card-actions {
  display: flex;
  gap: 5px;
  padding: 12px 18px;
  border-top: 1px solid var(--c-border);
  background: var(--c-surface-2);
  flex-wrap: wrap;
}

.action-btn {
  flex: 1;
  min-width: 60px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 6px;
  border: 1.5px solid transparent;
  border-radius: var(--c-radius-xs);
  font-size: 12px;
  font-weight: 650;
  transition: all 0.15s;
  white-space: nowrap;
  cursor: pointer;
  letter-spacing: 0.01em;
  background: none;
}

.view-btn {
  background: var(--c-info-light);
  color: var(--c-info);
  border-color: rgba(26,90,158,0.12);
}

.view-btn:hover { background: var(--c-info); color: #fff; border-color: var(--c-info); }

.edit-btn {
  background: var(--c-warning-light);
  color: var(--c-warning);
  border-color: rgba(160,96,16,0.12);
}

.edit-btn:hover { background: #e07020; color: #fff; border-color: #e07020; }

.delete-btn {
  background: var(--c-danger-light);
  color: var(--c-danger);
  border-color: rgba(184,50,50,0.12);
}

.delete-btn:hover { background: var(--c-danger); color: #fff; border-color: var(--c-danger); }

/* Empty State */
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

.empty-title { font-size: 17px; font-weight: 700; color: var(--c-text-primary); margin: 0 0 8px; letter-spacing: -0.2px; }
.empty-sub { font-size: 13px; color: var(--c-text-muted); margin: 0 0 22px; }

.empty-action-btn {
  display: inline-flex;
  align-items: center;
  padding: 10px 24px;
  background: var(--c-accent);
  color: #fff;
  border: none;
  border-radius: var(--c-radius-sm);
  font-size: 14px;
  font-weight: 650;
  transition: background 0.15s, box-shadow 0.15s;
  box-shadow: 0 2px 8px rgba(124,92,78,0.25);
}

.empty-action-btn:hover { background: var(--c-accent-hover); box-shadow: 0 4px 14px rgba(124,92,78,0.35); }

/* ══════════════════════════════════════
   FORM VIEW
══════════════════════════════════════ */
.form-view { display: flex; flex-direction: column; min-height: 100%; background: var(--c-bg); }

.form-topbar {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 28px;
  background: var(--c-surface);
  border-bottom: 1.5px solid var(--c-border);
  box-shadow: var(--c-shadow-sm);
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: var(--c-surface-2);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-sm);
  color: var(--c-text-secondary);
  font-size: 13px;
  font-weight: 600;
  transition: all 0.15s;
}

.back-btn:hover { border-color: var(--c-accent); color: var(--c-accent); background: var(--c-accent-subtle); }

.form-page-title {
  flex: 1;
  font-size: 18px;
  font-weight: 750;
  letter-spacing: -0.4px;
  color: var(--c-text-primary);
  margin: 0;
}

.save-btn-top {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 20px;
  background: var(--c-accent);
  color: #fff;
  border: none;
  border-radius: var(--c-radius-sm);
  font-size: 14px;
  font-weight: 650;
  transition: background 0.15s, box-shadow 0.15s;
  box-shadow: 0 2px 8px rgba(124,92,78,0.25);
}

.save-btn-top:hover:not(:disabled) { background: var(--c-accent-hover); box-shadow: 0 4px 14px rgba(124,92,78,0.35); }
.save-btn-top:disabled { opacity: 0.6; cursor: not-allowed; }

/* Form Body */
.form-body {
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  max-width: 100%;
}

/* Sections */
.form-section {
  padding: 24px 0;
  border-bottom: 1px solid var(--c-border);
}

.form-section:last-of-type { border-bottom: none; }

.section-label {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.section-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--c-accent);
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  flex-shrink: 0;
  letter-spacing: 0.02em;
}

.section-title {
  font-size: 15px;
  font-weight: 750;
  color: var(--c-text-primary);
  letter-spacing: -0.2px;
  flex: 1;
}

.remove-row-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  background: var(--c-danger-light);
  color: var(--c-danger);
  border: 1.5px solid rgba(184,50,50,0.15);
  border-radius: var(--c-radius-xs);
  font-size: 12px;
  font-weight: 650;
  transition: all 0.15s;
  margin-left: auto;
}

.remove-row-btn:hover { background: var(--c-danger); color: #fff; border-color: var(--c-danger); }

/* Fields Grid */
.fields-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
}

.field-wrap { display: flex; flex-direction: column; gap: 7px; }
.field-wrap.full { grid-column: 1 / -1; }

.field-label {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--c-text-secondary);
  display: flex;
  align-items: center;
  gap: 6px;
  letter-spacing: 0.01em;
  text-transform: uppercase;
}

.req { color: var(--c-danger); }

.field-input {
  width: 100%;
  padding: 11px 14px;
  background: var(--c-surface);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-sm);
  font-size: 14px;
  color: var(--c-text-primary);
  transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
  box-shadow: var(--c-shadow-xs);
}

.field-input::placeholder { color: var(--c-text-muted); }

.field-input:focus {
  outline: none;
  border-color: var(--c-border-focus);
  box-shadow: 0 0 0 3px rgba(124,92,78,0.12);
  background: var(--c-surface);
}

.dark-mode .field-input:focus { box-shadow: 0 0 0 3px rgba(196,144,110,0.15); }

.field-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239e8e84' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 13px center;
  padding-right: 38px;
  cursor: pointer;
}

.field-note {
  font-size: 12px;
  margin: 0;
  padding: 5px 10px;
  border-radius: var(--c-radius-xs);
  font-weight: 500;
}

.field-note.error { color: var(--c-danger); background: var(--c-danger-light); }

/* Input with Icon */
.input-icon-wrap { position: relative; }
.input-icon { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: var(--c-text-muted); pointer-events: none; }
.icon-padded { padding-left: 40px; }

/* Add More Button */
.row-add-action {
  padding-top: 16px;
  display: flex;
}

.add-more-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 18px;
  background: var(--c-accent-light);
  color: var(--c-accent);
  border: 1.5px dashed var(--c-accent-2);
  border-radius: var(--c-radius-sm);
  font-size: 13px;
  font-weight: 650;
  transition: all 0.15s;
  letter-spacing: 0.01em;
}

.add-more-btn:hover {
  background: var(--c-accent);
  color: #fff;
  border-style: solid;
  border-color: var(--c-accent);
  box-shadow: 0 2px 8px rgba(124,92,78,0.25);
}

/* Bottom Actions */
.form-bottom-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 28px 0 0;
}

.cancel-btn {
  padding: 12px 26px;
  background: var(--c-surface-2);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-sm);
  font-size: 14px;
  font-weight: 650;
  color: var(--c-text-secondary);
  transition: all 0.15s;
}

.cancel-btn:hover:not(:disabled) { border-color: var(--c-danger); color: var(--c-danger); background: var(--c-danger-light); }

.save-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 30px;
  background: var(--c-accent);
  color: #fff;
  border: none;
  border-radius: var(--c-radius-sm);
  font-size: 14px;
  font-weight: 750;
  transition: all 0.15s;
  box-shadow: 0 2px 8px rgba(124,92,78,0.3);
  letter-spacing: 0.01em;
}

.save-btn:hover:not(:disabled) {
  background: var(--c-accent-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(124,92,78,0.4);
}

.save-btn:disabled { opacity: 0.6; cursor: not-allowed; }

/* Spin */
.spin-icon { animation: spin 0.9s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ══════════════════════════════════════
   RESPONSIVE — TABLET (≤ 900px)
══════════════════════════════════════ */
@media (max-width: 900px) {
  .list-view { padding: 20px; }
  .form-body { padding: 20px; }
  .form-topbar { padding: 12px 20px; }
  .review-grid { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
  .fields-grid { grid-template-columns: 1fr; }
}

/* ══════════════════════════════════════
   RESPONSIVE — MOBILE (≤ 640px)
══════════════════════════════════════ */
@media (max-width: 640px) {
  .list-view { padding: 14px; }
  .form-body { padding: 14px; }
  .form-topbar { padding: 12px 14px; gap: 10px; }
  .back-label { display: none; }

  .page-title { font-size: 20px; }
  .form-page-title { font-size: 15px; }

  .list-header { margin-bottom: 16px; }

  .review-grid { grid-template-columns: 1fr; gap: 12px; }

  .card-actions {
    padding: 10px 14px;
    gap: 4px;
  }

  .action-btn {
    font-size: 11px;
    padding: 8px 4px;
    gap: 3px;
  }

  .card-top { padding: 14px 14px 12px; gap: 12px; }
  .card-body { padding: 12px 14px; }

  .section-label { flex-wrap: wrap; }
  .remove-row-btn { margin-left: 0; }

  .form-bottom-actions { flex-direction: column; padding-top: 20px; }
  .cancel-btn, .save-btn { width: 100%; justify-content: center; }

  .section-number { width: 26px; height: 26px; font-size: 10px; }
  .section-title { font-size: 14px; }
  .form-section { padding: 18px 0; }

  .row-add-action { justify-content: stretch; }
  .add-more-btn { width: 100%; justify-content: center; }
}

/* ══════════════════════════════════════
   TOUCH TARGETS
══════════════════════════════════════ */
@media (hover: none) and (pointer: coarse) {
  .action-btn, .add-btn, .save-btn, .cancel-btn,
  .save-btn-top, .back-btn, .add-more-btn,
  .remove-row-btn, .empty-action-btn { min-height: 44px; }
  input, select { font-size: 16px !important; }
}

/* ══════════════════════════════════════
   ACCESSIBILITY
══════════════════════════════════════ */
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition-duration: 0.01ms !important; }
}
</style>
