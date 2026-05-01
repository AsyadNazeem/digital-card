<template>
  <transition name="modal-fade">
    <div v-if="open" :class="['settings-overlay', { 'dark-mode': isDarkMode }]" @click.self="closePopup">
      <div :class="['settings-modal', { 'dark-mode': isDarkMode }]">

        <!-- Header -->
        <div class="settings-modal-header">
          <div class="header-left">
            <!-- Mobile back button (shown only inside content on mobile) -->
            <button v-if="mobileShowContent" class="back-btn" type="button" @click="mobileShowContent = false">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <h2 class="settings-modal-title">
              {{ mobileShowContent ? activeNavItem?.label : 'Account Settings' }}
            </h2>
          </div>
          <button class="qr-close-btn" type="button" @click="closePopup">
            <svg fill="none" height="16" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="16">
              <line x1="18" x2="6" y1="6" y2="18"/>
              <line x1="6" x2="18" y1="6" y2="18"/>
            </svg>
          </button>
        </div>

        <!-- Layout -->
        <div class="settings-layout">

          <!-- Sidebar Nav -->
          <aside :class="['settings-sidebar', { 'mobile-hidden': mobileShowContent }]">
            <nav class="settings-nav">
              <button
                  v-for="item in navItems" :key="item.id"
                  :class="['settings-nav-item', { active: activeSetting === item.id }]"
                  :title="item.label"
                  @click="selectNav(item.id)"
              >
                <div class="nav-item-left">
                  <span class="nav-icon" v-html="item.icon"/>
                  <span class="nav-label">{{ item.label }}</span>
                </div>
                <svg class="nav-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </nav>

            <!-- Mobile user hint -->
            <div class="sidebar-footer-hint">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              Tap a setting to continue
            </div>
          </aside>

          <!-- Content Panel -->
          <section :class="['settings-content', { 'mobile-hidden': !mobileShowContent }]">

            <!-- ── Username ── -->
            <div v-if="activeSetting === 'username'" class="settings-panel">
              <div class="panel-header">
                <h3 class="panel-title">Change Username</h3>
                <p class="panel-desc">Your username can be changed only once every 30 days.</p>
              </div>
              <div class="panel-body">
                <div class="form-group">
                  <label class="form-label">New Username</label>
                  <input v-model="settingsForm.username" class="form-input" placeholder="Enter new username" type="text"/>
                </div>
                <button :disabled="usernameLoading" class="save-btn full-width" type="button" @click="updateUsername">
                  <svg v-if="!usernameLoading" fill="none" height="15" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="15"><polyline points="20 6 9 17 4 12"/></svg>
                  <svg v-else class="spin-icon" fill="none" height="15" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="15"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  {{ usernameLoading ? 'Saving…' : 'Save Username' }}
                </button>
                <p v-if="usernameMessage" :class="['feedback-msg', usernameSuccess ? 'msg-success' : 'msg-error']">{{ usernameMessage }}</p>
              </div>
            </div>

            <!-- ── Email ── -->
            <div v-if="activeSetting === 'email'" class="settings-panel">
              <div class="panel-header">
                <h3 class="panel-title">Change Email</h3>
                <p class="panel-desc">We'll send a verification OTP before applying changes.</p>
              </div>
              <div class="panel-body">
                <div class="form-group">
                  <label class="form-label">New Email</label>
                  <input v-model="settingsForm.email" :disabled="emailOtpSent || emailVerified" class="form-input" placeholder="Enter new email" type="email"/>
                </div>
                <button v-if="!emailOtpSent" :disabled="emailLoading" class="save-btn full-width" type="button" @click="sendEmailOtp">
                  {{ emailLoading ? 'Sending…' : 'Send OTP' }}
                </button>
                <div v-if="emailOtpSent && !emailVerified" class="form-group">
                  <label class="form-label">Enter OTP</label>
                  <input v-model="emailOtp" class="form-input" placeholder="Enter OTP sent to your email" type="text"/>
                  <button :disabled="emailLoading" class="save-btn full-width" type="button" @click="verifyEmailOtp">
                    {{ emailLoading ? 'Verifying…' : 'Verify OTP' }}
                  </button>
                </div>
                <div v-if="emailVerified">
                  <button :disabled="emailLoading" class="save-btn full-width" type="button" @click="confirmEmailChange">
                    {{ emailLoading ? 'Saving…' : 'Confirm Email Change' }}
                  </button>
                </div>
                <p v-if="emailMessage" :class="['feedback-msg', emailVerified ? 'msg-success' : 'msg-error']">{{ emailMessage }}</p>
              </div>
            </div>

            <!-- ── Password ── -->
            <div v-if="activeSetting === 'password'" class="settings-panel">
              <div class="panel-header">
                <h3 class="panel-title">Change Password</h3>
                <p class="panel-desc">Enter your current password and choose a new one.</p>
              </div>
              <div class="panel-body">
                <div v-for="(field, key) in passwordFields" :key="key" class="form-group">
                  <label class="form-label">{{ field.label }}</label>
                  <div class="password-wrap">
                    <input v-model="passwordForm[key]" :placeholder="field.placeholder" :type="field.show ? 'text' : 'password'" class="form-input"/>
                    <button class="eye-btn" type="button" @click="field.show = !field.show">
                      <svg v-if="!field.show" fill="none" height="16" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="16"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      <svg v-else fill="none" height="16" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="16"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" x2="23" y1="1" y2="23"/></svg>
                    </button>
                  </div>
                </div>
                <button :disabled="passwordLoading" class="save-btn full-width" type="button" @click="updatePassword">
                  <svg v-if="!passwordLoading" fill="none" height="15" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="15"><polyline points="20 6 9 17 4 12"/></svg>
                  <svg v-else class="spin-icon" fill="none" height="15" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="15"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  {{ passwordLoading ? 'Updating…' : 'Update Password' }}
                </button>
                <p v-if="passwordMessage" :class="['feedback-msg', passwordSuccess ? 'msg-success' : 'msg-error']">{{ passwordMessage }}</p>
              </div>
            </div>

            <!-- ── Request Limits ── -->
            <div v-if="activeSetting === 'limits'" class="settings-panel">
              <div class="panel-header">
                <h3 class="panel-title">Request More Limits</h3>
                <p class="panel-desc">Need more companies, contacts, or reviews? Submit a request for admin review.</p>
              </div>
              <div class="panel-body">
                <div class="limits-overview">
                  <div v-for="lim in limitCards" :key="lim.key" class="limit-card">
                    <div class="limit-card-top">
                      <div :class="['limit-icon', lim.colorClass]" v-html="lim.icon"/>
                      <span class="limit-label-text">{{ lim.label }}</span>
                    </div>
                    <div class="limit-stats">
                      <span class="limit-current">{{ lim.count }}</span>
                      <span class="limit-sep">/</span>
                      <span class="limit-max">{{ lim.max }}</span>
                    </div>
                    <div class="limit-bar-track">
                      <div :class="['limit-bar-fill', lim.colorClass]" :style="{ width: Math.min((lim.count / lim.max) * 100, 100) + '%' }"/>
                    </div>
                  </div>
                </div>
                <form class="request-form" @submit.prevent="submitSettingsRequest">
                  <div v-for="f in requestFields" :key="f.key" class="form-group">
                    <label class="form-label">{{ f.label }}</label>
                    <div class="quantity-selector">
                      <button class="qty-btn" type="button" @click="decrement(f.key)">
                        <svg fill="none" height="13" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="13"><line x1="5" x2="19" y1="12" y2="12"/></svg>
                      </button>
                      <input v-model.number="settingsRequestForm[f.key]" class="qty-input" max="500" min="0" type="number"/>
                      <button class="qty-btn" type="button" @click="increment(f.key)">
                        <svg fill="none" height="13" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="13"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
                      </button>
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Reason for Request (Optional)</label>
                    <textarea v-model="settingsRequestForm.reason" class="form-input" placeholder="Tell us why you need more limits…" rows="3"/>
                  </div>
                  <button :disabled="settingsRequestLoading || (!settingsRequestForm.companies && !settingsRequestForm.contacts && !settingsRequestForm.reviews)" class="save-btn full-width" type="submit">
                    <svg v-if="!settingsRequestLoading" fill="none" height="15" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="15"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                    <svg v-else class="spin-icon" fill="none" height="15" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="15"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                    {{ settingsRequestLoading ? 'Submitting…' : 'Submit Request' }}
                  </button>
                  <p v-if="settingsRequestMessage" :class="['feedback-msg', settingsRequestSuccess ? 'msg-success' : 'msg-error']">{{ settingsRequestMessage }}</p>
                </form>
              </div>
            </div>

            <!-- ── Request History ── -->
            <div v-if="activeSetting === 'history'" class="settings-panel">
              <div class="panel-header">
                <h3 class="panel-title">Request History</h3>
                <p class="panel-desc">View all your limit increase requests and their current status.</p>
              </div>
              <div class="panel-body">
                <div v-if="historyLoading" class="empty-state">
                  <div class="empty-icon-wrap spin-wrap">
                    <svg class="spin-icon" fill="none" height="26" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="26"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  </div>
                  <p class="empty-title">Loading requests…</p>
                </div>
                <div v-else-if="historyError" class="empty-state">
                  <div class="empty-icon-wrap" style="background: var(--c-danger-light); color: var(--c-danger);">
                    <svg fill="none" height="26" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="26"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                  </div>
                  <p class="empty-title">{{ historyError }}</p>
                  <button class="outline-btn" type="button" @click="loadRequestHistory">Try Again</button>
                </div>
                <div v-else-if="!requestHistory.length" class="empty-state">
                  <div class="empty-icon-wrap">
                    <svg fill="none" height="26" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="26"><path d="M3 3h18v18H3zM21 9H3M21 15H3M12 3v18"/></svg>
                  </div>
                  <p class="empty-title">No Requests Yet</p>
                  <p class="empty-sub">You haven't submitted any limit increase requests.</p>
                  <button class="save-btn" type="button" @click="activeSetting = 'limits'">Make Your First Request</button>
                </div>
                <div v-else class="history-wrap">
                  <div class="filter-tabs">
                    <button v-for="f in ['all','pending','approved','rejected']" :key="f"
                            :class="['filter-tab', { active: historyFilter === f }]"
                            type="button" @click="historyFilter = f">
                      {{ f.charAt(0).toUpperCase() + f.slice(1) }}
                      <span v-if="historyFilter === f" class="tab-active-dot"/>
                    </button>
                  </div>
                  <div class="history-list">
                    <div v-for="req in displayedHistory" :key="req.id" class="history-item">
                      <div class="history-item-header">
                        <span class="req-id">#{{ req.id }}</span>
                        <span :class="['status-badge', req.status]">{{ req.status }}</span>
                      </div>
                      <div class="history-item-body">
                        <div class="detail-grid">
                          <div v-if="req.requestedCompanies > 0" class="detail-row"><span class="detail-label">Companies</span><span class="detail-value">{{ req.requestedCompanies }}</span></div>
                          <div v-if="req.requestedContacts > 0" class="detail-row"><span class="detail-label">Contacts</span><span class="detail-value">{{ req.requestedContacts }}</span></div>
                          <div v-if="req.requestedReviews > 0" class="detail-row"><span class="detail-label">Reviews</span><span class="detail-value">{{ req.requestedReviews }}</span></div>
                        </div>
                        <div v-if="req.reason" class="req-reason"><p>{{ req.reason }}</p></div>
                      </div>
                      <div class="history-item-footer"><span class="req-date">{{ formatDate(req.createdAt) }}</span></div>
                    </div>
                  </div>
                  <div v-if="!displayedHistory.length && historyFilter !== 'all'" class="no-results">No {{ historyFilter }} requests found.</div>
                </div>
              </div>
            </div>

          </section>
        </div>
      </div>
      <AlertModal
          v-bind="alertState"
          @confirm="alertState.onConfirm"
          @cancel="alertState.onCancel"
      />
    </div>
  </transition>
</template>

<script setup>
import { computed, inject, reactive, ref, watch } from 'vue';
import api from '@/services/api';
import AlertModal from '@/components/user/AlertModal.vue';          // ← NEW
import { useAlert } from '@/composables/useAlert.js';               // ← NEW

const isDarkMode = inject('isDarkMode', ref(false));
const activeSetting = ref('username');
const mobileShowContent = ref(false);

const props = defineProps({ open: { type: Boolean, required: true } });
const emit = defineEmits(['close']);

// ── Alert composable ──────────────────────────────────────────────── ← NEW
const { alertState, showAlert, showConfirm } = useAlert();

const activeNavItem = computed(() => navItems.find(n => n.id === activeSetting.value));

function selectNav(id) {
  activeSetting.value = id;
  mobileShowContent.value = true;
}

const navItems = [
  { id: 'username', label: 'Username',       icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' },
  { id: 'email',    label: 'Email',           icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>' },
  { id: 'password', label: 'Password',        icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>' },
  { id: 'limits',   label: 'Request Limits',  icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>' },
  { id: 'history',  label: 'Request History', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3h18v18H3zM21 9H3M21 15H3M12 3v18"/></svg>' },
];

const userLimits = ref({ companyLimit: 1, contactLimit: 1, reviewLimit: 1 });
const companyCount = ref(0);
const contactCount = ref(0);
const reviewCount = ref(0);

const limitCards = computed(() => [
  { key: 'company', label: 'Companies', count: companyCount.value, max: userLimits.value.companyLimit, colorClass: 'company-color', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/></svg>' },
  { key: 'contact', label: 'Contacts',  count: contactCount.value, max: userLimits.value.contactLimit, colorClass: 'contact-color', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>' },
  { key: 'review',  label: 'Reviews',   count: reviewCount.value,  max: userLimits.value.reviewLimit,  colorClass: 'review-color',  icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' },
]);

const requestFields = [
  { key: 'companies', label: 'Additional Companies Needed' },
  { key: 'contacts',  label: 'Additional Contacts Needed'  },
  { key: 'reviews',   label: 'Additional Reviews Needed'   },
];

const settingsForm = ref({ username: '', email: '' });
const passwordFields = reactive({
  current: { label: 'Current Password',    placeholder: 'Enter current password',  show: false },
  new:     { label: 'New Password',         placeholder: 'Enter new password',       show: false },
  confirm: { label: 'Confirm New Password', placeholder: 'Re-enter new password',    show: false },
});
const passwordForm = ref({ current: '', new: '', confirm: '' });
const settingsRequestForm = ref({ companies: 0, contacts: 0, reviews: 0, reason: '' });

const usernameLoading = ref(false); const usernameMessage = ref(''); const usernameSuccess = ref(false);
const emailLoading = ref(false);    const emailMessage = ref('');    const emailOtp = ref('');
const emailOtpSent = ref(false);    const emailVerified = ref(false);
const passwordLoading = ref(false); const passwordMessage = ref(''); const passwordSuccess = ref(false);
const settingsRequestLoading = ref(false); const settingsRequestMessage = ref(''); const settingsRequestSuccess = ref(false);
const requestHistory = ref([]);     const historyLoading = ref(false); const historyError = ref('');
const historyFilter = ref('all');

function increment(key) { settingsRequestForm.value[key]++; }
function decrement(key) { if (settingsRequestForm.value[key] > 0) settingsRequestForm.value[key]--; }

// ── Username ──────────────────────────────────────────────────────── (unchanged, uses inline feedback)
async function updateUsername() {
  const name = settingsForm.value.username.trim();
  usernameMessage.value = ''; usernameSuccess.value = false;
  if (!name) { usernameMessage.value = 'Please enter your new username.'; return; }
  try {
    usernameLoading.value = true;
    const res = await api.post('/settings/change-username', { name });
    usernameSuccess.value = true;
    usernameMessage.value = res.data.message || 'Username updated successfully!';
    settingsForm.value.username = '';
  } catch (err) { usernameMessage.value = err.response?.data?.message || 'Failed to update username.'; }
  finally { usernameLoading.value = false; }
}

// ── Email OTP ─────────────────────────────────────────────────────── (unchanged, uses inline feedback)
async function sendEmailOtp() {
  if (!settingsForm.value.email) { emailMessage.value = 'Please enter a valid email.'; return; }
  try {
    emailLoading.value = true;
    const res = await api.post('/settings/send-email-otp', { email: settingsForm.value.email });
    emailOtpSent.value = true; emailMessage.value = res.data.message || 'OTP sent successfully.';
  } catch (err) { emailMessage.value = err.response?.data?.message || 'Failed to send OTP.'; }
  finally { emailLoading.value = false; }
}

async function verifyEmailOtp() {
  if (!emailOtp.value) { emailMessage.value = 'Please enter the OTP.'; return; }
  try {
    emailLoading.value = true;
    const res = await api.post('/settings/verify-email-otp', { email: settingsForm.value.email, otp: emailOtp.value });
    if (res.data.success) { emailVerified.value = true; emailMessage.value = 'OTP verified successfully.'; }
    else { emailMessage.value = 'Invalid OTP.'; }
  } catch (err) { emailMessage.value = err.response?.data?.message || 'OTP verification failed.'; }
  finally { emailLoading.value = false; }
}

// ── Confirm Email Change ──────────────────────────────────────────── ← NEW
async function confirmEmailChange() {
  try {
    emailLoading.value = true;
    const res = await api.post('/settings/confirm-email-change', { email: settingsForm.value.email });
    await showAlert({
      type: 'success',
      title: 'Email Updated!',
      message: res.data.message || 'Your email address has been updated successfully.',
      confirmLabel: 'Great!'
    });
    emailOtp.value = ''; emailOtpSent.value = false; emailVerified.value = false;
    emailMessage.value = ''; settingsForm.value.email = '';
  } catch (err) {
    emailMessage.value = err.response?.data?.message || 'Failed to update email.';
  } finally { emailLoading.value = false; }
}

// ── Password ──────────────────────────────────────────────────────── (unchanged, uses inline feedback)
async function updatePassword() {
  passwordMessage.value = ''; passwordSuccess.value = false;
  const { current, new: n, confirm } = passwordForm.value;
  if (!current || !n || !confirm) { passwordMessage.value = 'All fields are required.'; return; }
  if (n !== confirm) { passwordMessage.value = 'Passwords do not match.'; return; }
  try {
    passwordLoading.value = true;
    const res = await api.post('/settings/change-password', { currentPassword: current, newPassword: n });
    passwordSuccess.value = true;
    passwordMessage.value = res.data.message || 'Password updated successfully.';
    passwordForm.value = { current: '', new: '', confirm: '' };
  } catch (err) { passwordMessage.value = err.response?.data?.message || 'Failed to update password.'; }
  finally { passwordLoading.value = false; }
}

// ── Submit Limits Request ─────────────────────────────────────────── (unchanged, uses inline feedback)
async function submitSettingsRequest() {
  const { companies, contacts, reviews } = settingsRequestForm.value;
  if (!companies && !contacts && !reviews) { settingsRequestMessage.value = 'Please request at least one item.'; return; }
  try {
    settingsRequestLoading.value = true;
    const res = await api.post('/dashboard/request-limits', settingsRequestForm.value);
    settingsRequestSuccess.value = true;
    settingsRequestMessage.value = res.data.message || 'Request submitted successfully.';
    settingsRequestForm.value = { companies: 0, contacts: 0, reviews: 0, reason: '' };
  } catch (err) {
    settingsRequestSuccess.value = false;
    settingsRequestMessage.value = err.response?.data?.message || 'Failed to submit request.';
  } finally { settingsRequestLoading.value = false; }
}

// ── Request History ───────────────────────────────────────────────── (unchanged, uses inline error state)
async function loadRequestHistory() {
  try {
    historyLoading.value = true; historyError.value = '';
    const res = await api.get('/dashboard/request-history');
    requestHistory.value = res.data.requests || [];
  } catch { historyError.value = 'Failed to load request history.'; }
  finally { historyLoading.value = false; }
}

const displayedHistory = computed(() =>
    historyFilter.value === 'all' ? requestHistory.value
        : requestHistory.value.filter(r => r.status === historyFilter.value)
);

function formatDate(d) { return new Date(d).toLocaleDateString(); }

watch(activeSetting, val => {
  if (val === 'history' && !requestHistory.value.length) loadRequestHistory();
});

watch(() => props.open, val => {
  if (!val) { mobileShowContent.value = false; }
  if (val) document.addEventListener('keydown', onKeydown);
  else document.removeEventListener('keydown', onKeydown);
});

function closePopup() { emit('close'); }
function onKeydown(e) { if (e.key === 'Escape') closePopup(); }
</script>

<style scoped>
/* ══ CSS Custom Properties ══ */
.settings-overlay {
  --c-bg: #ffffff;
  --c-surface: #ffffff;
  --c-surface-2: #faf9f7;
  --c-border: #e8e3dc;
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
  --c-success-border: #7ec8a0;
  --c-warning: #a06010;
  --c-warning-light: #fef6ec;
  --c-warning-border: #e8b870;
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
}

.settings-overlay.dark-mode {
  --c-bg: #100e14;
  --c-surface: #1a1720;
  --c-surface-2: #1e1b26;
  --c-border: #2c2838;
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
  --c-success-border: #1e6040;
  --c-warning: #e8a840;
  --c-warning-light: #281c08;
  --c-warning-border: #6a4810;
  --c-shadow-xs: 0 1px 2px rgba(0,0,0,0.2);
  --c-shadow-sm: 0 2px 6px rgba(0,0,0,0.3);
  --c-shadow-md: 0 6px 20px rgba(0,0,0,0.4);
  --c-shadow-lg: 0 16px 48px rgba(0,0,0,0.5);
}

*, *::before, *::after { box-sizing: border-box; }
button { font-family: inherit; cursor: pointer; }

/* ══════════════════════════════════════
   OVERLAY
══════════════════════════════════════ */
.settings-overlay {
  position: fixed; inset: 0;
  background: rgba(16,14,20,0.6);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  z-index: 99999;
  padding: 16px;
  overflow-y: auto;
}

/* ══════════════════════════════════════
   MODAL SHELL
══════════════════════════════════════ */
.settings-modal {
  background: var(--c-surface);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius);
  width: 100%;
  max-width: 720px;
  max-height: 90vh;
  display: flex; flex-direction: column;
  overflow: hidden;
  box-shadow: var(--c-shadow-lg);
  margin: auto;
  color: var(--c-text-primary);
}

/* ── Header ── */
.settings-modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 24px;
  background: linear-gradient(135deg, var(--c-accent-subtle) 0%, var(--c-surface) 100%);
  border-bottom: 1.5px solid var(--c-border);
  flex-shrink: 0;
  gap: 12px;
}

.header-left {
  display: flex; align-items: center; gap: 10px;
  min-width: 0;
}

.settings-modal-title {
  font-size: 18px; font-weight: 750;
  color: var(--c-text-primary); margin: 0; letter-spacing: -0.4px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

.back-btn {
  display: none;
  width: 32px; height: 32px; flex-shrink: 0;
  background: var(--c-surface-2);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-xs);
  color: var(--c-text-secondary);
  align-items: center; justify-content: center;
  transition: all 0.15s;
}
.back-btn:hover { border-color: var(--c-accent); color: var(--c-accent); background: var(--c-accent-light); }

.qr-close-btn {
  flex-shrink: 0;
  background: var(--c-surface-2);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-xs);
  width: 34px; height: 34px;
  display: flex; align-items: center; justify-content: center;
  color: var(--c-text-secondary); transition: all 0.15s;
}
.qr-close-btn:hover { border-color: var(--c-danger); color: var(--c-danger); background: var(--c-danger-light); }

/* ══════════════════════════════════════
   LAYOUT
══════════════════════════════════════ */
.settings-layout {
  display: flex; flex: 1;
  overflow: hidden; min-height: 0;
}

/* ── Sidebar ── */
.settings-sidebar {
  width: 200px; flex-shrink: 0;
  background: var(--c-surface-2);
  border-right: 1.5px solid var(--c-border);
  display: flex; flex-direction: column;
  overflow-y: auto;
}

.settings-nav {
  padding: 10px 8px;
  display: flex; flex-direction: column; gap: 2px;
  flex: 1;
}

/* Nav item — compact with chevron for mobile affordance */
.settings-nav-item {
  display: flex; align-items: center;
  justify-content: space-between;
  width: 100%; padding: 10px 12px;
  background: transparent; border: none;
  border-radius: var(--c-radius-sm);
  color: var(--c-text-secondary);
  font-size: 13px; font-weight: 500;
  cursor: pointer; transition: background 0.15s, color 0.15s;
  text-align: left;
  -webkit-tap-highlight-color: transparent;
}
.settings-nav-item:hover { background: var(--c-accent-light); color: var(--c-accent); }
.settings-nav-item.active {
  background: var(--c-accent-subtle);
  color: var(--c-accent); font-weight: 650;
  border-left: 3px solid var(--c-accent);
  padding-left: 9px;
}

.nav-item-left {
  display: flex; align-items: center; gap: 9px;
  min-width: 0;
}

.nav-icon {
  flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  width: 18px; height: 18px;
}
.nav-label { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.nav-chevron {
  flex-shrink: 0; color: var(--c-border);
  transition: color 0.15s;
  display: none; /* hidden on desktop, shown on mobile */
}

/* Footer hint — mobile only */
.sidebar-footer-hint {
  display: none;
  align-items: center; gap: 6px;
  padding: 12px 16px;
  font-size: 11px; color: var(--c-text-muted);
  border-top: 1.5px solid var(--c-border);
}
.sidebar-footer-hint svg { flex-shrink: 0; color: var(--c-text-muted); }

/* ── Content ── */
.settings-content {
  flex: 1; padding: 24px 28px;
  overflow-y: auto; background: var(--c-surface);
}

.settings-panel { max-width: 460px; }

.panel-header {
  margin-bottom: 22px; padding-bottom: 16px;
  border-bottom: 1.5px solid var(--c-border);
}
.panel-title {
  font-size: 16px; font-weight: 750;
  color: var(--c-text-primary); margin: 0 0 5px; letter-spacing: -0.3px;
}
.panel-desc { font-size: 13px; color: var(--c-text-muted); margin: 0; line-height: 1.55; }

.panel-body { display: flex; flex-direction: column; gap: 16px; }

/* ══════════════════════════════════════
   FORMS
══════════════════════════════════════ */
.form-group { display: flex; flex-direction: column; gap: 6px; }

.form-label {
  font-size: 11px; font-weight: 700;
  color: var(--c-text-secondary);
  text-transform: uppercase; letter-spacing: 0.06em;
}

.form-input {
  width: 100%; padding: 10px 14px;
  background: var(--c-surface-2);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-sm);
  font-size: 14px; color: var(--c-text-primary);
  font-family: inherit; transition: border-color 0.15s, box-shadow 0.15s;
}
.form-input:focus { outline: none; border-color: var(--c-accent); box-shadow: 0 0 0 3px rgba(124,92,78,0.12); }
.form-input:disabled { opacity: 0.5; cursor: not-allowed; }
.form-input::placeholder { color: var(--c-text-muted); }
textarea.form-input { resize: vertical; min-height: 88px; line-height: 1.5; }

.password-wrap { position: relative; display: flex; align-items: center; }
.password-wrap .form-input { padding-right: 44px; }
.eye-btn {
  position: absolute; right: 12px;
  background: none; border: none; cursor: pointer;
  color: var(--c-text-muted); padding: 4px;
  display: flex; align-items: center; justify-content: center;
  transition: color 0.15s;
}
.eye-btn:hover { color: var(--c-accent); }

/* ── Buttons ── */
.save-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 11px 22px;
  background: var(--c-accent); color: #fff;
  border: none; border-radius: var(--c-radius-sm);
  font-size: 13px; font-weight: 750;
  transition: all 0.15s;
  box-shadow: 0 2px 8px rgba(124,92,78,0.3);
  letter-spacing: 0.01em;
}
.save-btn.full-width { width: 100%; }
.save-btn:hover:not(:disabled) { background: var(--c-accent-hover); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(124,92,78,0.4); }
.save-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

.outline-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 7px;
  padding: 10px 16px;
  background: var(--c-surface-2);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-sm);
  font-size: 13px; font-weight: 650;
  color: var(--c-text-secondary);
  white-space: nowrap; transition: all 0.15s;
}
.outline-btn:hover { border-color: var(--c-accent); color: var(--c-accent); background: var(--c-accent-light); }
.outline-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* ── Feedback ── */
.feedback-msg {
  padding: 10px 14px; border-radius: var(--c-radius-sm);
  font-size: 13px; font-weight: 600; border: 1.5px solid;
}
.msg-success { background: var(--c-success-light); color: var(--c-success); border-color: var(--c-success-border); }
.msg-error   { background: var(--c-danger-light);  color: var(--c-danger);  border-color: var(--c-danger); }

.spin-icon { animation: spin 0.9s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ══════════════════════════════════════
   LIMITS OVERVIEW
══════════════════════════════════════ */
.limits-overview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px; margin-bottom: 18px;
}

.limit-card {
  background: var(--c-surface-2);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-sm);
  padding: 12px;
  transition: box-shadow 0.2s, transform 0.18s;
  box-shadow: var(--c-shadow-xs);
}
.limit-card:hover { box-shadow: var(--c-shadow-sm); transform: translateY(-2px); }
.limit-card-top { display: flex; align-items: center; gap: 7px; margin-bottom: 8px; }

.limit-icon {
  width: 28px; height: 28px;
  border-radius: var(--c-radius-xs);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.company-color { background: linear-gradient(135deg, var(--c-accent), var(--c-accent-2)); color: #fff; }
.contact-color { background: linear-gradient(135deg, var(--c-accent-2), #b88060); color: #fff; }
.review-color  { background: linear-gradient(135deg, #c4a030, #d4b850); color: #fff; }

.limit-label-text { font-size: 11px; font-weight: 700; color: var(--c-text-secondary); }
.limit-stats { display: flex; align-items: baseline; gap: 2px; margin-bottom: 7px; }
.limit-current { font-size: 20px; font-weight: 750; color: var(--c-text-primary); }
.limit-sep { font-size: 13px; color: var(--c-border); margin: 0 2px; }
.limit-max { font-size: 13px; font-weight: 600; color: var(--c-text-muted); }
.limit-bar-track { height: 3px; background: var(--c-border); border-radius: 999px; overflow: hidden; }
.limit-bar-fill { height: 100%; border-radius: 999px; transition: width 0.3s ease; }
.limit-bar-fill.company-color { background: var(--c-accent); }
.limit-bar-fill.contact-color { background: var(--c-accent-2); }
.limit-bar-fill.review-color  { background: #c4a030; }

/* ── Quantity selector ── */
.quantity-selector {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 12px;
  background: var(--c-surface-2);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-sm);
  transition: border-color 0.15s, box-shadow 0.15s;
}
.quantity-selector:focus-within { border-color: var(--c-accent); box-shadow: 0 0 0 3px rgba(124,92,78,0.12); }

.qty-btn {
  width: 30px; height: 30px;
  display: flex; align-items: center; justify-content: center;
  background: var(--c-surface);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-xs);
  color: var(--c-accent); flex-shrink: 0;
  transition: all 0.15s;
  -webkit-tap-highlight-color: transparent;
}
.qty-btn:hover { background: var(--c-accent); border-color: var(--c-accent); color: #fff; }
.qty-btn:active { transform: scale(0.94); }

.qty-input {
  flex: 1; text-align: center;
  font-size: 16px; font-weight: 750;
  color: var(--c-text-primary);
  background: transparent; border: none; outline: none;
}
.qty-input::-webkit-inner-spin-button,
.qty-input::-webkit-outer-spin-button { -webkit-appearance: none; }

/* ══════════════════════════════════════
   EMPTY STATE
══════════════════════════════════════ */
.empty-state {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; gap: 12px;
  padding: 48px 20px; text-align: center;
}
.empty-icon-wrap {
  width: 60px; height: 60px; border-radius: 50%;
  background: var(--c-accent-light); color: var(--c-accent);
  display: flex; align-items: center; justify-content: center;
}
.spin-wrap { background: var(--c-accent-light); }
.empty-title { font-size: 15px; font-weight: 750; color: var(--c-text-primary); margin: 0; }
.empty-sub   { font-size: 13px; color: var(--c-text-muted); margin: 0; }

/* ══════════════════════════════════════
   HISTORY
══════════════════════════════════════ */
.history-wrap { display: flex; flex-direction: column; gap: 12px; }

.filter-tabs {
  display: flex; gap: 0;
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-sm);
  overflow: hidden;
  background: var(--c-surface);
  box-shadow: var(--c-shadow-xs);
}
.filter-tab {
  flex: 1;
  display: inline-flex; align-items: center; justify-content: center; gap: 5px;
  padding: 8px 10px;
  background: transparent; border: none;
  border-right: 1.5px solid var(--c-border);
  font-size: 12px; font-weight: 650;
  color: var(--c-text-secondary);
  transition: all 0.18s; cursor: pointer;
}
.filter-tab:last-child { border-right: none; }
.filter-tab.active { background: var(--c-accent); color: #fff; }
.filter-tab:hover:not(.active) { background: var(--c-accent-light); color: var(--c-accent); }
.tab-active-dot { width: 4px; height: 4px; border-radius: 50%; background: rgba(255,255,255,0.7); flex-shrink: 0; }

.history-list { display: flex; flex-direction: column; gap: 8px; }

.history-item {
  background: var(--c-surface);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-sm);
  overflow: hidden;
  transition: border-color 0.15s, box-shadow 0.15s;
  box-shadow: var(--c-shadow-xs);
}
.history-item:hover { border-color: var(--c-accent-2); box-shadow: var(--c-shadow-sm); }

.history-item-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 14px;
  background: var(--c-surface-2);
  border-bottom: 1.5px solid var(--c-border);
}
.req-id { font-size: 11px; font-weight: 700; color: var(--c-text-muted); }

.status-badge {
  padding: 3px 9px; border-radius: var(--c-radius-pill);
  font-size: 10px; font-weight: 700; text-transform: capitalize; letter-spacing: 0.04em;
}
.status-badge.pending  { background: var(--c-warning-light); color: var(--c-warning);  border: 1px solid var(--c-warning-border); }
.status-badge.approved { background: var(--c-success-light); color: var(--c-success);  border: 1px solid var(--c-success-border); }
.status-badge.rejected { background: var(--c-danger-light);  color: var(--c-danger);   border: 1px solid var(--c-danger); }

.history-item-body { padding: 12px 14px; }
.detail-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(110px,1fr)); gap: 6px 14px; margin-bottom: 8px; }
.detail-row { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
.detail-label { font-size: 12px; color: var(--c-text-muted); font-weight: 600; }
.detail-value { font-size: 14px; font-weight: 750; color: var(--c-text-primary); }

.req-reason {
  padding: 8px 10px;
  background: var(--c-surface-2);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-xs);
  margin-top: 8px;
}
.req-reason p { margin: 0; font-size: 12px; color: var(--c-text-secondary); line-height: 1.5; }

.history-item-footer {
  padding: 7px 14px;
  background: var(--c-surface-2);
  border-top: 1.5px solid var(--c-border);
}
.req-date { font-size: 11px; color: var(--c-text-muted); font-weight: 500; }
.no-results { padding: 28px 20px; text-align: center; font-size: 13px; color: var(--c-text-muted); }

/* Scrollbars */
.settings-content::-webkit-scrollbar,
.settings-sidebar::-webkit-scrollbar { width: 4px; }
.settings-content::-webkit-scrollbar-thumb,
.settings-sidebar::-webkit-scrollbar-thumb { background: var(--c-accent-2); border-radius: 2px; }
.settings-content::-webkit-scrollbar-track,
.settings-sidebar::-webkit-scrollbar-track { background: transparent; }

/* Modal transition */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.22s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

/* ══════════════════════════════════════
   TABLET  ≤ 820px
══════════════════════════════════════ */
@media (max-width: 820px) {
  .settings-sidebar { width: 180px; }
  .settings-content { padding: 20px; }
  .settings-modal-title { font-size: 16px; }
}

/* ══════════════════════════════════════
   MOBILE  ≤ 640px
   Two-panel navigation: list → detail
══════════════════════════════════════ */
@media (max-width: 640px) {
  /* Full screen on mobile */
  .settings-overlay {
    padding: 0;
    align-items: flex-end;
  }

  .settings-modal {
    max-width: 100%;
    max-height: 100vh;
    height: 100vh;
    border-radius: 0;
    border: none;
  }

  /* Smaller header */
  .settings-modal-header { padding: 14px 16px; }
  .settings-modal-title  { font-size: 15px; }

  /* Show back button when in content view */
  .back-btn { display: flex; }

  /* Layout stacks: only show one panel at a time */
  .settings-layout {
    flex-direction: column;
    overflow: hidden;
    flex: 1;
    position: relative;
  }

  /* Sidebar — full width list, takes full height */
  .settings-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: none;
    flex: 1;
    overflow-y: auto;
  }

  /* Nav items — larger, more touch-friendly with full chevron */
  .settings-nav { padding: 8px; gap: 3px; }

  .settings-nav-item {
    padding: 14px 16px;
    border-radius: var(--c-radius-sm);
    border: 1.5px solid transparent;
    font-size: 14px;
  }
  .settings-nav-item:hover {
    border-color: var(--c-accent-light);
    background: var(--c-accent-light);
  }
  .settings-nav-item.active {
    border-left: none;
    padding-left: 16px;
    background: var(--c-accent-subtle);
    border-color: var(--c-accent-light);
  }
  .nav-chevron { display: block; color: var(--c-text-muted); }

  /* Show hint at bottom of sidebar */
  .sidebar-footer-hint { display: flex; }

  /* Content — slides in on top (full width, full height) */
  .settings-content {
    position: absolute;
    inset: 0;
    padding: 20px 16px;
    overflow-y: auto;
    z-index: 1;
    transform: translateX(100%);
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    background: var(--c-surface);
  }

  /* When content is active, slide it in */
  .settings-content:not(.mobile-hidden) {
    transform: translateX(0);
  }

  /* Hide sidebar when content is shown */
  .settings-sidebar.mobile-hidden {
    display: none;
  }

  .settings-panel { max-width: 100%; }

  .panel-header { margin-bottom: 18px; padding-bottom: 14px; }
  .panel-title   { font-size: 15px; }

  /* iOS zoom prevention */
  .form-input   { font-size: 16px; }
  textarea.form-input { font-size: 14px; }

  .limits-overview { grid-template-columns: repeat(3, 1fr); gap: 8px; }
  .limit-card { padding: 10px; }
  .limit-current { font-size: 16px; }

  .filter-tab { padding: 9px 8px; font-size: 11px; }

  .detail-grid { grid-template-columns: 1fr; }
}

/* ══════════════════════════════════════
   SMALL PHONES  ≤ 380px
══════════════════════════════════════ */
@media (max-width: 380px) {
  .limits-overview { grid-template-columns: 1fr; }
  .settings-content { padding: 16px 14px; }
}

/* Touch targets */
@media (hover: none) and (pointer: coarse) {
  .qr-close-btn, .back-btn, .save-btn, .outline-btn,
  .qty-btn, .filter-tab, .settings-nav-item { min-height: 44px; }
}

/* Focus rings */
.save-btn:focus-visible, .outline-btn:focus-visible,
.qr-close-btn:focus-visible, .back-btn:focus-visible,
.settings-nav-item:focus-visible, .filter-tab:focus-visible,
.qty-btn:focus-visible { outline: 2px solid var(--c-accent); outline-offset: 2px; }

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition-duration: 0.01ms !important; }
}
</style>
