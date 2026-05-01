<template>
  <!-- Request Limit Increase Banner - Fixed to header -->
  <div v-if="showBanner" :class="['limit-banner', { 'dark-mode': isDarkMode }]">
    <div class="limit-banner-content">
      <div class="limit-banner-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.5"
             stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 9v4"/>
          <path d="M12 17h.01"/>
          <path d="M10.3 3.86l-7.18 12.42A2 2 0 0 0 4.82 19h14.36a2 2 0 0 0 1.7-2.72L13.7 3.86a2 2 0 0 0-3.4 0z"/>
        </svg>
      </div>
      <div class="limit-banner-text">
        <h3>You've reached your limit!</h3>
        <p>Request more companies, contacts, or reviews from the admin to continue adding.</p>
      </div>
      <button @click="showRequestModal = true" class="btn-request">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
        </svg>
        Request More
      </button>
    </div>
  </div>

  <!-- Request Limit Increase Modal -->
  <transition name="modal-fade">
    <div v-if="showRequestModal" class="modal-overlay" @click.self="showRequestModal = false">
      <div :class="['request-modal-container', { 'dark-mode': isDarkMode }]">

        <!-- Modal Header -->
        <div class="request-modal-header">
          <div class="modal-header-left">
            <div class="modal-header-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
            </div>
            <h2 class="request-modal-title">Request Additional Limits</h2>
          </div>
          <button @click="showRequestModal = false" class="btn-close" type="button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="request-modal-body">

          <!-- Current Limits Display -->
          <div class="current-limits">
            <div class="section-label">
              <span class="section-number">01</span>
              <span class="section-title">Your Current Limits</span>
            </div>
            <div class="limits-grid">
              <div class="limit-card">
                <div class="limit-icon company">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="4" y="2" width="16" height="20" rx="2"/>
                  </svg>
                </div>
                <div class="limit-info">
                  <span class="limit-label">Companies</span>
                  <span class="limit-value">{{ companyCount }} / {{ userLimits.companyLimit }}</span>
                </div>
                <div class="limit-progress-wrap">
                  <div class="limit-progress-bar">
                    <div
                        class="limit-progress-fill"
                        :style="{ width: Math.min(100, (companyCount / userLimits.companyLimit) * 100) + '%' }"
                        :class="companyCount >= userLimits.companyLimit ? 'full' : ''"
                    ></div>
                  </div>
                </div>
              </div>

              <div class="limit-card">
                <div class="limit-icon contact">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                  </svg>
                </div>
                <div class="limit-info">
                  <span class="limit-label">Contacts</span>
                  <span class="limit-value">{{ contactCount }} / {{ userLimits.contactLimit }}</span>
                </div>
                <div class="limit-progress-wrap">
                  <div class="limit-progress-bar">
                    <div
                        class="limit-progress-fill"
                        :style="{ width: Math.min(100, (contactCount / userLimits.contactLimit) * 100) + '%' }"
                        :class="contactCount >= userLimits.contactLimit ? 'full' : ''"
                    ></div>
                  </div>
                </div>
              </div>

              <div class="limit-card">
                <div class="limit-icon review">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                </div>
                <div class="limit-info">
                  <span class="limit-label">Reviews</span>
                  <span class="limit-value">{{ reviewCount }} / {{ userLimits.reviewLimit }}</span>
                </div>
                <div class="limit-progress-wrap">
                  <div class="limit-progress-bar">
                    <div
                        class="limit-progress-fill"
                        :style="{ width: Math.min(100, (reviewCount / userLimits.reviewLimit) * 100) + '%' }"
                        :class="reviewCount >= userLimits.reviewLimit ? 'full' : ''"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Request Form -->
          <div class="request-form-section">
            <div class="section-label">
              <span class="section-number">02</span>
              <span class="section-title">Request Additional</span>
            </div>

            <div class="fields-grid">
              <!-- Companies -->
              <div class="field-wrap">
                <label class="field-label">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="4" y="2" width="16" height="20" rx="2"/>
                  </svg>
                  Additional Companies
                </label>
                <div class="quantity-selector">
                  <button type="button" @click="decrementCompanies" class="qty-btn" :disabled="requestForm.companies === 0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  </button>
                  <input type="number" v-model.number="requestForm.companies" min="0" max="100" class="qty-input" />
                  <button type="button" @click="incrementCompanies" class="qty-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Contacts -->
              <div class="field-wrap">
                <label class="field-label">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                  </svg>
                  Additional Contacts
                </label>
                <div class="quantity-selector">
                  <button type="button" @click="decrementContacts" class="qty-btn" :disabled="requestForm.contacts === 0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  </button>
                  <input type="number" v-model.number="requestForm.contacts" min="0" max="500" class="qty-input" />
                  <button type="button" @click="incrementContacts" class="qty-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Reviews -->
              <div class="field-wrap">
                <label class="field-label">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  Additional Reviews
                </label>
                <div class="quantity-selector">
                  <button type="button" @click="decrementReviews" class="qty-btn" :disabled="requestForm.reviews === 0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  </button>
                  <input type="number" v-model.number="requestForm.reviews" min="0" max="100" class="qty-input" />
                  <button type="button" @click="incrementReviews" class="qty-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Reason -->
              <div class="field-wrap full">
                <label class="field-label">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  Reason for Request
                  <span class="field-optional">optional</span>
                </label>
                <textarea
                    v-model="requestForm.reason"
                    rows="3"
                    class="field-input field-textarea"
                    placeholder="Tell us why you need more limits…"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Result message -->
          <p v-if="requestMessage" :class="['request-message', requestSuccess ? 'success' : 'error']">
            {{ requestMessage }}
          </p>

          <!-- Actions -->
          <div class="form-bottom-actions">
            <button type="button" @click="showRequestModal = false" class="cancel-btn" :disabled="requestLoading">
              Cancel
            </button>
            <button
                type="button"
                @click="submitRequest"
                class="save-btn"
                :disabled="requestLoading || (requestForm.companies === 0 && requestForm.contacts === 0 && requestForm.reviews === 0)"
            >
              <svg v-if="!requestLoading" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
              <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin-icon">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              {{ requestLoading ? 'Submitting…' : 'Submit Request' }}
            </button>
          </div>

        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, watch, onUnmounted, inject } from "vue";
import api from "@/services/api";

const isDarkMode = inject('isDarkMode', ref(false));

const props = defineProps({
  companyCount: { type: Number, required: true },
  contactCount:  { type: Number, required: true },
  reviewCount:   { type: Number, required: true },
  userLimits:    { type: Object, required: true },
});

const emit = defineEmits(['banner-visibility']);

const showRequestModal = ref(false);
const requestForm = ref({ companies: 0, contacts: 0, reviews: 0, reason: "" });
const requestLoading = ref(false);
const requestMessage = ref("");
const requestSuccess = ref(false);

const showBanner = computed(() =>
    props.companyCount >= props.userLimits.companyLimit ||
    props.contactCount >= props.userLimits.contactLimit ||
    props.reviewCount  >= props.userLimits.reviewLimit
);

watch(showBanner, (newVal) => {
  emit('banner-visibility', newVal);
  document.body.classList.toggle('banner-active', newVal);
}, { immediate: true });

onUnmounted(() => { document.body.classList.remove('banner-active'); });

function incrementCompanies() { requestForm.value.companies++; }
function decrementCompanies() { if (requestForm.value.companies > 0) requestForm.value.companies--; }
function incrementContacts()  { requestForm.value.contacts++; }
function decrementContacts()  { if (requestForm.value.contacts > 0) requestForm.value.contacts--; }
function incrementReviews()   { requestForm.value.reviews++; }
function decrementReviews()   { if (requestForm.value.reviews > 0) requestForm.value.reviews--; }

async function submitRequest() {
  requestMessage.value = "";
  requestSuccess.value = false;

  if (!requestForm.value.companies && !requestForm.value.contacts && !requestForm.value.reviews) {
    requestMessage.value = "Please request at least one item.";
    return;
  }

  try {
    requestLoading.value = true;
    const res = await api.post("/dashboard/request-limits", {
      companies: requestForm.value.companies,
      contacts:  requestForm.value.contacts,
      reviews:   requestForm.value.reviews,
      reason:    requestForm.value.reason,
    });
    requestSuccess.value = true;
    requestMessage.value = res.data.message || "Request submitted successfully.";
    requestForm.value = { companies: 0, contacts: 0, reviews: 0, reason: "" };
    setTimeout(() => { showRequestModal.value = false; requestMessage.value = ""; }, 1500);
  } catch (err) {
    requestSuccess.value = false;
    requestMessage.value = err.response?.data?.message || "Failed to submit request.";
  } finally {
    requestLoading.value = false;
  }
}
</script>

<style scoped>
/* ══════════════════════════════════════
   DESIGN TOKENS — mirrors contact-tab exactly
══════════════════════════════════════ */
.limit-banner,
.modal-overlay,
.request-modal-container {
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
  --c-shadow-xs: 0 1px 2px rgba(28,20,16,.06);
  --c-shadow-sm: 0 2px 6px rgba(28,20,16,.08), 0 1px 2px rgba(28,20,16,.04);
  --c-shadow-md: 0 6px 20px rgba(28,20,16,.10), 0 2px 6px rgba(28,20,16,.06);
  --c-shadow-lg: 0 16px 48px rgba(28,20,16,.16), 0 4px 12px rgba(28,20,16,.08);
  --c-radius: 14px;
  --c-radius-sm: 8px;
  --c-radius-xs: 5px;
  --c-radius-pill: 100px;
  font-family: 'Segoe UI', 'SF Pro Display', system-ui, -apple-system, sans-serif;
  font-size: 14px;
  color: var(--c-text-primary);
}

.limit-banner.dark-mode,
.request-modal-container.dark-mode {
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
}

*, *::before, *::after { box-sizing: border-box; }
button { font-family: inherit; cursor: pointer; }
input, textarea { font-family: inherit; }

/* ══════════════════════════════════════
   BANNER
══════════════════════════════════════ */
/* KEEP only this, remove the transition line: */
.limit-banner {
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  background: var(--c-accent-subtle);
  border-bottom: 2px solid var(--c-border);
  padding: 20px 24px;
  z-index: 101;
  box-shadow: var(--c-shadow-sm);
  animation: slideDown 0.3s ease-out;
  /* transition line removed */
}

.limit-banner.dark-mode {
  background: var(--c-surface-2);
  border-bottom-color: var(--c-border);
}

@keyframes slideDown {
  from { transform: translateY(-100%); opacity: 0; }
  to   { transform: translateY(0);     opacity: 1; }
}

.limit-banner-content {
  max-width: 1750px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 14px;
}

.limit-banner-icon {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  background: var(--c-warning-light);
  border: 1.5px solid rgba(160,96,16,.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--c-warning);
}

.limit-banner-text { flex: 1; }

.limit-banner-text h3 {
  margin: 0 0 2px;
  font-size: 14px;
  font-weight: 750;
  color: var(--c-text-primary);
  letter-spacing: -0.2px;
}

.limit-banner-text p {
  margin: 0;
  font-size: 12px;
  color: var(--c-text-secondary);
}

.btn-request {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 18px;
  background: var(--c-accent);
  color: #fff;
  border: none;
  border-radius: var(--c-radius-sm);
  font-size: 13px;
  font-weight: 650;
  white-space: nowrap;
  transition: background 0.18s, transform 0.12s, box-shadow 0.18s;
  box-shadow: 0 2px 8px rgba(124,92,78,.3);
  letter-spacing: 0.01em;
}

.btn-request:hover {
  background: var(--c-accent-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(124,92,78,.4);
}

/* ══════════════════════════════════════
   MODAL OVERLAY
══════════════════════════════════════ */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(16,14,20,.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  padding: 16px;
}

/* ══════════════════════════════════════
   MODAL CONTAINER
══════════════════════════════════════ */
.request-modal-container {
  background: var(--c-surface);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius);
  width: 100%;
  max-width: 640px;
  max-height: 88vh;
  overflow-y: auto;
  box-shadow: var(--c-shadow-lg);
  display: flex;
  flex-direction: column;
}

/* Scrollbar */
.request-modal-container::-webkit-scrollbar { width: 5px; }
.request-modal-container::-webkit-scrollbar-track { background: transparent; }
.request-modal-container::-webkit-scrollbar-thumb { background: var(--c-border); border-radius: 4px; }

/* ── Modal Header ── */
.request-modal-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 16px 22px;
  background: var(--c-surface);
  border-bottom: 1.5px solid var(--c-border);
  box-shadow: var(--c-shadow-xs);
}

.modal-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-header-icon {
  width: 34px;
  height: 34px;
  background: var(--c-accent);
  border-radius: var(--c-radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(124,92,78,.25);
}

.request-modal-title {
  font-size: 17px;
  font-weight: 750;
  letter-spacing: -0.4px;
  color: var(--c-text-primary);
  margin: 0;
}

.btn-close {
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
  flex-shrink: 0;
}

.btn-close:hover {
  border-color: var(--c-danger);
  color: var(--c-danger);
  background: var(--c-danger-light);
}

/* ── Modal Body ── */
.request-modal-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* ── Section Labels (same as contact) ── */
.section-label {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.section-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--c-accent);
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  flex-shrink: 0;
  letter-spacing: 0.02em;
}

.section-title {
  font-size: 14px;
  font-weight: 750;
  color: var(--c-text-primary);
  letter-spacing: -0.2px;
}

/* ── Current Limits Block ── */
.current-limits {
  padding-bottom: 22px;
  border-bottom: 1px solid var(--c-border);
  margin-bottom: 22px;
}

.limits-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.limit-card {
  background: var(--c-surface-2);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-sm);
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: box-shadow 0.2s, border-color 0.2s;
  box-shadow: var(--c-shadow-xs);
}

.limit-card:hover {
  box-shadow: var(--c-shadow-sm);
  border-color: var(--c-accent-2);
}

.limit-icon {
  width: 34px;
  height: 34px;
  border-radius: var(--c-radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.limit-icon.company { background: var(--c-accent-light); color: var(--c-accent); }
.limit-icon.contact { background: var(--c-success-light); color: var(--c-success); }
.limit-icon.review  { background: var(--c-warning-light); color: var(--c-warning); }

.limit-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.limit-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--c-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.limit-value {
  font-size: 16px;
  font-weight: 750;
  color: var(--c-text-primary);
  letter-spacing: -0.3px;
}

.limit-progress-wrap { margin-top: 2px; }

.limit-progress-bar {
  height: 4px;
  background: var(--c-border);
  border-radius: var(--c-radius-pill);
  overflow: hidden;
}

.limit-progress-fill {
  height: 100%;
  background: var(--c-accent);
  border-radius: var(--c-radius-pill);
  transition: width 0.4s ease;
}

.limit-progress-fill.full { background: var(--c-danger); }

/* ── Request Form Section ── */
.request-form-section {
  padding-bottom: 20px;
  border-bottom: 1px solid var(--c-border);
  margin-bottom: 20px;
}

/* ── Fields Grid (matches contact) ── */
.fields-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.field-wrap { display: flex; flex-direction: column; gap: 7px; }
.field-wrap.full { grid-column: 1 / -1; }

.field-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--c-text-secondary);
  display: flex;
  align-items: center;
  gap: 6px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.field-optional {
  font-size: 10px;
  font-weight: 600;
  color: var(--c-text-muted);
  background: var(--c-surface-2);
  padding: 2px 7px;
  border-radius: var(--c-radius-pill);
  border: 1px solid var(--c-border);
  text-transform: none;
  letter-spacing: 0;
  margin-left: auto;
}

/* ── Quantity Selector ── */
.quantity-selector {
  display: flex;
  align-items: center;
  gap: 0;
  background: var(--c-surface);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-sm);
  overflow: hidden;
  box-shadow: var(--c-shadow-xs);
  transition: border-color 0.15s, box-shadow 0.15s;
}

.quantity-selector:focus-within {
  border-color: var(--c-border-focus);
  box-shadow: 0 0 0 3px rgba(124,92,78,.12);
}

.dark-mode .quantity-selector:focus-within {
  box-shadow: 0 0 0 3px rgba(196,144,110,.15);
}

.qty-btn {
  width: 38px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--c-surface-2);
  border: none;
  border-right: 1.5px solid var(--c-border);
  color: var(--c-text-secondary);
  transition: all 0.15s;
  flex-shrink: 0;
}

.qty-btn:last-child {
  border-right: none;
  border-left: 1.5px solid var(--c-border);
}

.qty-btn:hover:not(:disabled) {
  background: var(--c-accent);
  color: #fff;
}

.qty-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.qty-input {
  flex: 1;
  text-align: center;
  font-size: 17px;
  font-weight: 750;
  color: var(--c-text-primary);
  background: transparent;
  border: none;
  outline: none;
  padding: 10px 4px;
  min-width: 0;
  letter-spacing: -0.3px;
}

.qty-input::-webkit-inner-spin-button,
.qty-input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
.qty-input[type=number] { -moz-appearance: textfield; }

/* ── Textarea ── */
.field-input {
  width: 100%;
  padding: 11px 14px;
  background: var(--c-surface);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-sm);
  font-size: 14px;
  color: var(--c-text-primary);
  transition: border-color 0.15s, box-shadow 0.15s;
  box-shadow: var(--c-shadow-xs);
}

.field-input::placeholder { color: var(--c-text-muted); }

.field-input:focus {
  outline: none;
  border-color: var(--c-border-focus);
  box-shadow: 0 0 0 3px rgba(124,92,78,.12);
}

.dark-mode .field-input:focus { box-shadow: 0 0 0 3px rgba(196,144,110,.15); }

.field-textarea { resize: vertical; min-height: 80px; }

/* ── Request Message ── */
.request-message {
  font-size: 13px;
  font-weight: 600;
  padding: 10px 14px;
  border-radius: var(--c-radius-sm);
  margin-bottom: 4px;
}

.request-message.success {
  background: var(--c-success-light);
  color: var(--c-success);
}

.request-message.error {
  background: var(--c-danger-light);
  color: var(--c-danger);
}

/* ── Bottom Actions (matches contact) ── */
.form-bottom-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.cancel-btn {
  padding: 11px 24px;
  background: var(--c-surface-2);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-sm);
  font-size: 14px;
  font-weight: 650;
  color: var(--c-text-secondary);
  transition: all 0.15s;
}

.cancel-btn:hover:not(:disabled) {
  border-color: var(--c-danger);
  color: var(--c-danger);
  background: var(--c-danger-light);
}

.cancel-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.save-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 26px;
  background: var(--c-accent);
  color: #fff;
  border: none;
  border-radius: var(--c-radius-sm);
  font-size: 14px;
  font-weight: 750;
  transition: all 0.15s;
  box-shadow: 0 2px 8px rgba(124,92,78,.3);
  letter-spacing: 0.01em;
}

.save-btn:hover:not(:disabled) {
  background: var(--c-accent-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(124,92,78,.4);
}

.save-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

/* Spin */
.spin-icon { animation: spin 0.9s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ══════════════════════════════════════
   MODAL TRANSITION
══════════════════════════════════════ */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.22s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

/* ══════════════════════════════════════
   RESPONSIVE — TABLET (≤ 768px)
══════════════════════════════════════ */
@media (max-width: 768px) {
  .limit-banner { top: 60px; padding: 10px 16px; }

  .limits-grid { grid-template-columns: 1fr; gap: 10px; }
  .fields-grid { grid-template-columns: 1fr; }

  .request-modal-body { padding: 18px; }
  .request-modal-header { padding: 14px 18px; }
}

/* ══════════════════════════════════════
   RESPONSIVE — MOBILE (≤ 640px)
══════════════════════════════════════ */
@media (max-width: 640px) {
  .limit-banner { padding: 9px 14px; }

  .limit-banner-text p { display: none; }

  .btn-request { padding: 8px 14px; font-size: 12px; }

  .modal-overlay { padding: 10px; align-items: flex-end; }

  .request-modal-container {
    max-height: 92vh;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .request-modal-header { padding: 13px 16px; }
  .request-modal-title  { font-size: 15px; }

  .request-modal-body { padding: 16px; }

  .limits-grid { grid-template-columns: repeat(3, 1fr); gap: 8px; }

  .limit-card { padding: 10px; gap: 6px; }
  .limit-icon { width: 28px; height: 28px; }
  .limit-value { font-size: 14px; }
  .limit-label { font-size: 10px; }

  .fields-grid { grid-template-columns: 1fr; gap: 14px; }

  .form-bottom-actions { flex-direction: column; }
  .cancel-btn, .save-btn { width: 100%; justify-content: center; }
}

/* ══════════════════════════════════════
   TOUCH TARGETS
══════════════════════════════════════ */
@media (hover: none) and (pointer: coarse) {
  .qty-btn, .btn-request, .save-btn, .cancel-btn, .btn-close { min-height: 44px; }
  .qty-input, .field-input { font-size: 16px !important; }
}

/* ══════════════════════════════════════
   REDUCED MOTION
══════════════════════════════════════ */
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition-duration: 0.01ms !important; }
}

/* ══════════════════════════════════════
   GLOBAL BANNER LAYOUT HELPERS
══════════════════════════════════════ */
:global(body.banner-active) { --banner-height: 60px; }
</style>
