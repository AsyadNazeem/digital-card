<template>
  <transition name="modal">
    <div v-if="open" :class="['modal-overlay-full', { 'dark-mode': isDarkMode }]" @click="closePopup">
      <div class="modal-container" @click.stop>

        <!-- Close Button (Top Right) -->
        <button type="button" class="modal-close-btn-top" @click="closePopup">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div class="modal-layout">
          <!-- Sidebar -->
          <aside class="settings-sidebar">
            <div class="settings-sidebar-header">
              <h2 class="settings-main-title">Account Settings</h2>
            </div>
            <nav class="settings-nav">
              <button
                  @click="activeSetting = 'username'"
                  :class="['settings-nav-item', { active: activeSetting === 'username' }]"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Username
              </button>
              <button
                  @click="activeSetting = 'email'"
                  :class="['settings-nav-item', { active: activeSetting === 'email' }]"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                Email
              </button>
              <button
                  @click="activeSetting = 'password'"
                  :class="['settings-nav-item', { active: activeSetting === 'password' }]"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                Password
              </button>
              <button
                  @click="activeSetting = 'limits'"
                  :class="['settings-nav-item', { active: activeSetting === 'limits' }]"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path>
                </svg>
                Request Limits
              </button>
              <button
                  @click="activeSetting = 'history'"
                  :class="['settings-nav-item', { active: activeSetting === 'history' }]"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 3h18v18H3zM21 9H3M21 15H3M12 3v18"></path>
                </svg>
                Request History
              </button>
            </nav>
          </aside>

          <!-- Content -->
          <section class="settings-content">
            <!-- Username Panel -->
            <div v-if="activeSetting === 'username'" class="settings-panel">
              <div class="panel-header">
                <h2 class="panel-title">Change Username</h2>
                <p class="panel-description">Your username can be changed only once every 30 days.</p>
              </div>

              <div class="panel-body">
                <div class="form-group">
                  <label class="form-label">New Username</label>
                  <input
                      type="text"
                      v-model="settingsForm.username"
                      class="form-input"
                      placeholder="Enter new username"
                  />
                </div>

                <button class="btn-primary" @click="updateUsername">
                  Save Username
                </button>

                <p v-if="usernameMessage" :class="['feedback-message', usernameSuccess ? 'success' : 'error']">
                  {{ usernameMessage }}
                </p>
              </div>
            </div>

            <!-- Email Panel -->
            <div v-if="activeSetting === 'email'" class="settings-panel">
              <div class="panel-header">
                <h2 class="panel-title">Change Email</h2>
                <p class="panel-description">
                  Enter your new email address. We'll send a verification OTP before applying changes.
                </p>
              </div>

              <div class="panel-body">
                <div class="form-group">
                  <label class="form-label">New Email</label>
                  <input
                      type="email"
                      v-model="settingsForm.email"
                      class="form-input"
                      placeholder="Enter new email"
                      :disabled="emailOtpSent || emailVerified"
                  />
                  <button
                      v-if="!emailOtpSent"
                      class="btn-primary"
                      @click="sendEmailOtp"
                      :disabled="emailLoading"
                  >
                    <span v-if="!emailLoading">Send OTP</span>
                    <span v-else>Sending...</span>
                  </button>
                </div>

                <div v-if="emailOtpSent && !emailVerified" class="form-group">
                  <label class="form-label">Enter OTP</label>
                  <div class="input-with-button">
                    <input
                        type="text"
                        v-model="emailOtp"
                        class="form-input"
                        placeholder="Enter OTP"
                    />
                    <button
                        class="btn-secondary"
                        @click="verifyEmailOtp"
                        :disabled="emailLoading"
                    >
                      <span v-if="!emailLoading">Verify OTP</span>
                      <span v-else>Verifying...</span>
                    </button>
                  </div>
                </div>

                <div v-if="emailVerified" class="form-group">
                  <button class="btn-primary" @click="confirmEmailChange" :disabled="emailLoading">
                    <span v-if="!emailLoading">Confirm Change</span>
                    <span v-else>Saving...</span>
                  </button>
                </div>

                <p v-if="emailMessage" :class="['feedback-message', emailVerified ? 'success' : 'error']">
                  {{ emailMessage }}
                </p>
              </div>
            </div>

            <!-- Password Panel -->
            <div v-if="activeSetting === 'password'" class="settings-panel">
              <div class="panel-header">
                <h2 class="panel-title">Change Password</h2>
                <p class="panel-description">Please enter your current password and choose a new one.</p>
              </div>

              <div class="panel-body">
                <div class="form-group">
                  <label class="form-label">Current Password</label>
                  <div class="password-input-wrapper">
                    <input
                        :type="showCurrentPassword ? 'text' : 'password'"
                        v-model="passwordForm.current"
                        class="form-input"
                        placeholder="Enter current password"
                    />
                    <button
                        type="button"
                        @click="showCurrentPassword = !showCurrentPassword"
                        class="password-toggle-btn"
                    >
                      <svg v-if="!showCurrentPassword" width="20" height="20" viewBox="0 0 24 24" fill="none"
                           stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                           stroke-width="2">
                        <path
                            d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">New Password</label>
                  <div class="password-input-wrapper">
                    <input
                        :type="showNewPassword ? 'text' : 'password'"
                        v-model="passwordForm.new"
                        class="form-input"
                        placeholder="Enter new password"
                    />
                    <button
                        type="button"
                        @click="showNewPassword = !showNewPassword"
                        class="password-toggle-btn"
                    >
                      <svg v-if="!showNewPassword" width="20" height="20" viewBox="0 0 24 24" fill="none"
                           stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                           stroke-width="2">
                        <path
                            d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Confirm New Password</label>
                  <div class="password-input-wrapper">
                    <input
                        :type="showConfirmPassword ? 'text' : 'password'"
                        v-model="passwordForm.confirm"
                        class="form-input"
                        placeholder="Re-enter new password"
                    />
                    <button
                        type="button"
                        @click="showConfirmPassword = !showConfirmPassword"
                        class="password-toggle-btn"
                    >
                      <svg v-if="!showConfirmPassword" width="20" height="20" viewBox="0 0 24 24" fill="none"
                           stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                           stroke-width="2">
                        <path
                            d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    </button>
                  </div>
                </div>

                <button class="btn-primary" @click="updatePassword">Update Password</button>

                <p v-if="passwordMessage" :class="['feedback-message', passwordSuccess ? 'success' : 'error']">
                  {{ passwordMessage }}
                </p>
              </div>
            </div>

            <!-- Request Limits Panel -->
            <div v-if="activeSetting === 'limits'" class="settings-panel">
              <div class="panel-header">
                <h2 class="panel-title">Request More Limits</h2>
                <p class="panel-description">
                  Need more companies or contacts? Request an increase and our admin will review your request.
                </p>
              </div>

              <div class="panel-body">
                <!-- Current Limits Display -->
                <div class="limits-overview">
                  <div class="limit-card">
                    <div class="limit-card-header">
                      <div class="limit-icon company">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             stroke-width="2">
                          <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                        </svg>
                      </div>
                      <span class="limit-label">Companies</span>
                    </div>
                    <div class="limit-stats">
                      <span class="limit-current">{{ companyCount }}</span>
                      <span class="limit-divider">/</span>
                      <span class="limit-max">{{ userLimits.companyLimit }}</span>
                    </div>
                    <div class="limit-progress-bar">
                      <div
                          class="limit-progress-fill company"
                          :style="{ width: `${(companyCount / userLimits.companyLimit) * 100}%` }"
                      ></div>
                    </div>
                  </div>

                  <div class="limit-card">
                    <div class="limit-card-header">
                      <div class="limit-icon contact">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             stroke-width="2">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                        </svg>
                      </div>
                      <span class="limit-label">Contacts</span>
                    </div>
                    <div class="limit-stats">
                      <span class="limit-current">{{ contactCount }}</span>
                      <span class="limit-divider">/</span>
                      <span class="limit-max">{{ userLimits.contactLimit }}</span>
                    </div>
                    <div class="limit-progress-bar">
                      <div
                          class="limit-progress-fill contact"
                          :style="{ width: `${(contactCount / userLimits.contactLimit) * 100}%` }"
                      ></div>
                    </div>
                  </div>

                  <div class="limit-card">
                    <div class="limit-card-header">
                      <div class="limit-icon review">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             stroke-width="2">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                      </div>
                      <span class="limit-label">Reviews</span>
                    </div>
                    <div class="limit-stats">
                      <span class="limit-current">{{ reviewCount }}</span>
                      <span class="limit-divider">/</span>
                      <span class="limit-max">{{ userLimits.reviewLimit }}</span>
                    </div>
                    <div class="limit-progress-bar">
                      <div
                          class="limit-progress-fill review"
                          :style="{ width: `${(reviewCount / userLimits.reviewLimit) * 100}%` }"
                      ></div>
                    </div>
                  </div>
                </div>

                <!-- Request Form -->
                <form @submit.prevent="submitSettingsRequest" class="request-form">
                  <div class="form-group">
                    <label class="form-label">Additional Companies Needed</label>
                    <div class="quantity-selector">
                      <button type="button" @click="decrementSettingsCompanies" class="qty-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             stroke-width="2">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                      </button>
                      <input
                          type="number"
                          v-model.number="settingsRequestForm.companies"
                          min="0"
                          max="100"
                          class="qty-input"
                      />
                      <button type="button" @click="incrementSettingsCompanies" class="qty-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             stroke-width="2">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Additional Contacts Needed</label>
                    <div class="quantity-selector">
                      <button type="button" @click="decrementSettingsContacts" class="qty-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             stroke-width="2">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                      </button>
                      <input
                          type="number"
                          v-model.number="settingsRequestForm.contacts"
                          min="0"
                          max="500"
                          class="qty-input"
                      />
                      <button type="button" @click="incrementSettingsContacts" class="qty-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             stroke-width="2">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Additional Reviews Needed</label>
                    <div class="quantity-selector">
                      <button type="button" @click="decrementSettingsReviews" class="qty-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             stroke-width="2">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                      </button>
                      <input
                          type="number"
                          v-model.number="settingsRequestForm.reviews"
                          min="0"
                          max="500"
                          class="qty-input"
                      />
                      <button type="button" @click="incrementSettingsReviews" class="qty-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             stroke-width="2">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Reason for Request (Optional)</label>
                    <textarea
                        v-model="settingsRequestForm.reason"
                        rows="3"
                        class="form-input"
                        placeholder="Tell us why you need more limits..."
                    ></textarea>
                  </div>

                  <button
                      type="submit"
                      class="btn-primary"
                      :disabled="settingsRequestLoading || (settingsRequestForm.companies === 0 && settingsRequestForm.contacts === 0 && settingsRequestForm.reviews === 0)"
                  >
                    <span v-if="!settingsRequestLoading">Submit Request</span>
                    <span v-else>Submitting...</span>
                  </button>

                  <p v-if="settingsRequestMessage"
                     :class="['feedback-message', settingsRequestSuccess ? 'success' : 'error']">
                    {{ settingsRequestMessage }}
                  </p>
                </form>
              </div>
            </div>

            <!-- Request History Panel -->
            <div v-if="activeSetting === 'history'" class="settings-panel">
              <div class="panel-header">
                <h2 class="panel-title">Request History</h2>
                <p class="panel-description">
                  View all your limit increase requests and their current status.
                </p>
              </div>

              <div class="panel-body">
                <!-- Loading State -->
                <div v-if="historyLoading" class="state-container">
                  <div class="spinner"></div>
                  <p class="state-text">Loading your requests...</p>
                </div>

                <!-- Error State -->
                <div v-else-if="historyError" class="state-container">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <p class="state-text">{{ historyError }}</p>
                  <button @click="loadRequestHistory" class="btn-secondary">Try Again</button>
                </div>

                <!-- Empty State -->
                <div v-else-if="!requestHistory || requestHistory.length === 0" class="state-container">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 3h18v18H3zM21 9H3M21 15H3M12 3v18"></path>
                  </svg>
                  <h3 class="state-title">No Requests Yet</h3>
                  <p class="state-text">You haven't submitted any limit increase requests.</p>
                  <button @click="activeSetting = 'limits'" class="btn-primary">
                    Make Your First Request
                  </button>
                </div>

                <!-- Request List -->
                <div v-else class="history-container">
                  <!-- Filter Tabs -->
                  <div class="filter-tabs">
                    <button
                        @click="historyFilter = 'all'"
                        :class="['filter-tab', { active: historyFilter === 'all' }]"
                    >
                      All
                    </button>
                    <button
                        @click="historyFilter = 'pending'"
                        :class="['filter-tab', { active: historyFilter === 'pending' }]"
                    >
                      Pending
                    </button>
                    <button
                        @click="historyFilter = 'approved'"
                        :class="['filter-tab', { active: historyFilter === 'approved' }]"
                    >
                      Approved
                    </button>
                    <button
                        @click="historyFilter = 'rejected'"
                        :class="['filter-tab', { active: historyFilter === 'rejected' }]"
                    >
                      Rejected
                    </button>
                  </div>

                  <!-- Request Cards -->
                  <div class="history-list">
                    <div
                        v-for="request in displayedHistory"
                        :key="request.id"
                        class="history-item"
                    >
                      <div class="history-item-header">
                        <span class="request-id">#{{ request.id }}</span>
                        <span :class="['status-badge', request.status]">
                          {{ request.status }}
                        </span>
                      </div>
                      <div class="history-item-body">
                        <div class="request-details-grid">
                          <div v-if="request.requestedCompanies > 0" class="detail-row">
                            <span class="detail-label">Companies:</span>
                            <span class="detail-value">{{ request.requestedCompanies }}</span>
                          </div>
                          <div v-if="request.requestedContacts > 0" class="detail-row">
                            <span class="detail-label">Contacts:</span>
                            <span class="detail-value">{{ request.requestedContacts }}</span>
                          </div>
                          <div v-if="request.requestedReviews > 0" class="detail-row">
                            <span class="detail-label">Reviews:</span>
                            <span class="detail-value">{{ request.requestedReviews }}</span>
                          </div>
                        </div>
                        <div v-if="request.reason" class="request-reason">
                          <p class="reason-text">{{ request.reason }}</p>
                        </div>
                      </div>
                      <div class="history-item-footer">
                        <span class="request-date">{{ formatDate(request.createdAt) }}</span>
                      </div>
                    </div>
                  </div>

                  <div v-if="displayedHistory.length === 0 && historyFilter !== 'all'" class="no-results">
                    <p>No {{ historyFilter }} requests found.</p>
                  </div>
                </div>
              </div>
            </div>

          </section>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, watch, inject } from "vue";
import api from "@/services/api";

const isDarkMode = inject('isDarkMode', ref(false));

const activeSetting = ref("username");

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["close"]);

// User + Limit Data
const userLimits = ref({
  companyLimit: 1,
  contactLimit: 1,
  reviewLimit: 1,
});

const companyCount = ref(0);
const contactCount = ref(0);
const reviewCount = ref(0);

// Settings Forms
const settingsForm = ref({
  username: "",
  email: "",
  phone: "",
});

// Username
const usernameMessage = ref("");
const usernameSuccess = ref(false);
const usernameLoading = ref(false);

async function updateUsername() {
  const newName = settingsForm.value.username.trim();
  usernameMessage.value = "";
  usernameSuccess.value = false;

  if (!newName) {
    usernameMessage.value = "Please enter your new username.";
    return;
  }

  try {
    usernameLoading.value = true;
    const res = await api.post("/settings/change-username", {
      name: newName,
    });
    usernameSuccess.value = true;
    usernameMessage.value = res.data.message || "Username updated successfully!";
    settingsForm.value.username = "";
  } catch (err) {
    usernameMessage.value = err.response?.data?.message || "Failed to update username.";
  } finally {
    usernameLoading.value = false;
  }
}

// Email Change
const emailOtp = ref("");
const emailOtpSent = ref(false);
const emailVerified = ref(false);
const emailLoading = ref(false);
const emailMessage = ref("");

async function sendEmailOtp() {
  if (!settingsForm.value.email) {
    emailMessage.value = "Please enter a valid email.";
    return;
  }

  try {
    emailLoading.value = true;
    const res = await api.post("/settings/send-email-otp", {
      email: settingsForm.value.email,
    });
    emailOtpSent.value = true;
    emailMessage.value = res.data.message || "OTP sent successfully.";
  } catch (err) {
    emailMessage.value = err.response?.data?.message || "Failed to send OTP.";
  } finally {
    emailLoading.value = false;
  }
}

async function verifyEmailOtp() {
  if (!emailOtp.value) {
    emailMessage.value = "Please enter the OTP.";
    return;
  }

  try {
    emailLoading.value = true;
    const res = await api.post("/settings/verify-email-otp", {
      email: settingsForm.value.email,
      otp: emailOtp.value,
    });

    if (res.data.success) {
      emailVerified.value = true;
      emailMessage.value = "OTP verified successfully.";
    } else {
      emailMessage.value = "Invalid OTP.";
    }
  } catch (err) {
    emailMessage.value = err.response?.data?.message || "OTP verification failed.";
  } finally {
    emailLoading.value = false;
  }
}

async function confirmEmailChange() {
  try {
    emailLoading.value = true;
    const res = await api.post("/settings/confirm-email-change", {
      email: settingsForm.value.email,
    });
    alert(res.data.message || "Email updated successfully.");
    resetEmailState();
  } catch (err) {
    emailMessage.value = err.response?.data?.message || "Failed to update email.";
  } finally {
    emailLoading.value = false;
  }
}

function resetEmailState() {
  emailOtp.value = "";
  emailOtpSent.value = false;
  emailVerified.value = false;
  emailMessage.value = "";
  settingsForm.value.email = "";
}

// Password Change
const passwordForm = ref({
  current: "",
  new: "",
  confirm: "",
});

const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const passwordMessage = ref("");
const passwordSuccess = ref(false);
const passwordLoading = ref(false);

async function updatePassword() {
  passwordMessage.value = "";
  passwordSuccess.value = false;

  if (
      !passwordForm.value.current ||
      !passwordForm.value.new ||
      !passwordForm.value.confirm
  ) {
    passwordMessage.value = "All fields are required.";
    return;
  }

  if (passwordForm.value.new !== passwordForm.value.confirm) {
    passwordMessage.value = "Passwords do not match.";
    return;
  }

  try {
    passwordLoading.value = true;
    const res = await api.post("/settings/change-password", {
      currentPassword: passwordForm.value.current,
      newPassword: passwordForm.value.new,
    });

    passwordSuccess.value = true;
    passwordMessage.value = res.data.message || "Password updated successfully.";
    passwordForm.value = { current: "", new: "", confirm: "" };
  } catch (err) {
    passwordMessage.value = err.response?.data?.message || "Failed to update password.";
  } finally {
    passwordLoading.value = false;
  }
}

// Request Limits
const settingsRequestForm = ref({
  companies: 0,
  contacts: 0,
  reviews: 0,
  reason: "",
});

const settingsRequestLoading = ref(false);
const settingsRequestMessage = ref("");
const settingsRequestSuccess = ref(false);

function incrementSettingsCompanies() {
  settingsRequestForm.value.companies++;
}
function decrementSettingsCompanies() {
  if (settingsRequestForm.value.companies > 0)
    settingsRequestForm.value.companies--;
}

function incrementSettingsContacts() {
  settingsRequestForm.value.contacts++;
}
function decrementSettingsContacts() {
  if (settingsRequestForm.value.contacts > 0)
    settingsRequestForm.value.contacts--;
}

function incrementSettingsReviews() {
  settingsRequestForm.value.reviews++;
}
function decrementSettingsReviews() {
  if (settingsRequestForm.value.reviews > 0)
    settingsRequestForm.value.reviews--;
}

async function submitSettingsRequest() {
  if (
      settingsRequestForm.value.companies === 0 &&
      settingsRequestForm.value.contacts === 0 &&
      settingsRequestForm.value.reviews === 0
  ) {
    settingsRequestMessage.value = "Please request at least one item.";
    return;
  }

  try {
    settingsRequestLoading.value = true;
    const res = await api.post("/dashboard/request-limits", settingsRequestForm.value);
    settingsRequestSuccess.value = true;
    settingsRequestMessage.value = res.data.message || "Request submitted successfully.";
    settingsRequestForm.value = { companies: 0, contacts: 0, reviews: 0, reason: "" };
  } catch (err) {
    settingsRequestSuccess.value = false;
    settingsRequestMessage.value =
        err.response?.data?.message || "Failed to submit request.";
  } finally {
    settingsRequestLoading.value = false;
  }
}

// Request History
const requestHistory = ref([]);
const historyLoading = ref(false);
const historyError = ref("");
const historyFilter = ref("all");

async function loadRequestHistory() {
  try {
    historyLoading.value = true;
    const res = await api.get("/dashboard/request-history");
    requestHistory.value = res.data.requests || [];
  } catch (err) {
    historyError.value = "Failed to load request history.";
  } finally {
    historyLoading.value = false;
  }
}

function filteredHistory(status) {
  if (status === "all") return requestHistory.value;
  return requestHistory.value.filter(r => r.status === status);
}

const displayedHistory = computed(() => {
  return historyFilter.value === "all"
      ? requestHistory.value
      : requestHistory.value.filter(r => r.status === historyFilter.value);
});

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString();
}

watch(activeSetting, val => {
  if (val === 'history' && requestHistory.value.length === 0) {
    loadRequestHistory();
  }
});

function closePopup() {
  emit("close");
}

function onKeydown(e) {
  if (e.key === "Escape") closePopup();
}

watch(
    () => props.open,
    val => {
      if (val) document.addEventListener("keydown", onKeydown);
      else document.removeEventListener("keydown", onKeydown);
    }
);
</script>

<style scoped>
/* ===================================
   MODERN PROFESSIONAL DESIGN
   =================================== */

/* Modal Overlay */
.modal-overlay-full {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  padding: 20px;
}

.dark-mode.modal-overlay-full {
  background: rgba(0, 0, 0, 0.9);
}

/* Modal Container */
.modal-container {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: 1000px;
  width: 100%;
  max-height: 85vh;
  overflow: hidden;
  position: relative;
  animation: modalSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.dark-mode .modal-container {
  background: #18181b;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Top Close Button */
.modal-close-btn-top {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: #71717a;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 10;
}

.modal-close-btn-top:hover {
  background: #f4f4f5;
  color: #18181b;
}

.dark-mode .modal-close-btn-top {
  color: #a1a1aa;
}

.dark-mode .modal-close-btn-top:hover {
  background: #27272a;
  color: #ffffff;
}

/* Modal Layout */
.modal-layout {
  display: flex;
  height: 650px;
}

/* ===================================
   SIDEBAR
   =================================== */

.settings-sidebar {
  width: 280px;
  background: #fafafa;
  border-right: 1px solid #e4e4e7;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.dark-mode .settings-sidebar {
  background: #09090b;
  border-right-color: #27272a;
}

.settings-sidebar-header {
  padding: 32px 24px 24px 24px;
  border-bottom: 1px solid #e4e4e7;
}

.dark-mode .settings-sidebar-header {
  border-bottom-color: #27272a;
}

.settings-main-title {
  font-size: 18px;
  font-weight: 700;
  color: #18181b;
  margin: 0;
  letter-spacing: -0.01em;
}

.dark-mode .settings-main-title {
  color: #fafafa;
}

/* Navigation */
.settings-nav {
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  overflow-y: auto;
}

.settings-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: transparent;
  border: none;
  border-radius: 10px;
  color: #52525b;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.dark-mode .settings-nav-item {
  color: #a1a1aa;
}

.settings-nav-item:hover {
  background: #f4f4f5;
  color: #18181b;
}

.dark-mode .settings-nav-item:hover {
  background: #18181b;
  color: #fafafa;
}

.settings-nav-item.active {
  background: #6366f1;
  color: #ffffff;
  font-weight: 600;
}

.settings-nav-item svg {
  flex-shrink: 0;
}

/* ===================================
   CONTENT AREA
   =================================== */

.settings-content {
  flex: 1;
  padding: 32px 40px;
  overflow-y: auto;
  background: #ffffff;
}

.dark-mode .settings-content {
  background: #18181b;
}

.settings-panel {
  max-width: 560px;
  margin: 0 auto;
}

/* Panel Header */
.panel-header {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e4e4e7;
}

.dark-mode .panel-header {
  border-bottom-color: #27272a;
}

.panel-title {
  font-size: 24px;
  font-weight: 700;
  color: #18181b;
  margin: 0 0 8px 0;
  letter-spacing: -0.02em;
}

.dark-mode .panel-title {
  color: #fafafa;
}

.panel-description {
  font-size: 14px;
  color: #71717a;
  margin: 0;
  line-height: 1.6;
}

.dark-mode .panel-description {
  color: #a1a1aa;
}

/* Panel Body */
.panel-body {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* ===================================
   FORM ELEMENTS
   =================================== */

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 13px;
  font-weight: 600;
  color: #18181b;
  letter-spacing: -0.01em;
}

.dark-mode .form-label {
  color: #fafafa;
}

.form-input {
  width: 94%;
  padding: 12px 16px;
  background: #ffffff;
  border: 1.5px solid #e4e4e7;
  border-radius: 10px;
  font-size: 14px;
  color: #18181b;
  transition: all 0.2s;
  font-family: inherit;
}

.dark-mode .form-input {
  background: #09090b;
  border-color: #27272a;
  color: #fafafa;
}

.form-input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-input:disabled {
  background: #f4f4f5;
  cursor: not-allowed;
  opacity: 0.6;
}

.dark-mode .form-input:disabled {
  background: #18181b;
}

.form-input::placeholder {
  color: #a1a1aa;
}

textarea.form-input {
  resize: vertical;
  min-height: 100px;
}

/* Password Input */
.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input-wrapper .form-input {
  padding-right: 48px;
}

.password-toggle-btn {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: #71717a;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.password-toggle-btn:hover {
  color: #6366f1;
}

.dark-mode .password-toggle-btn {
  color: #a1a1aa;
}

.dark-mode .password-toggle-btn:hover {
  color: #818cf8;
}

/* Input with Button */
.input-with-button {
  display: flex;
  gap: 12px;
}

.input-with-button .form-input {
  flex: 1;
}

/* ===================================
   BUTTONS
   =================================== */

.btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background: #6366f1;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.btn-primary:hover:not(:disabled) {
  background: #4f46e5;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  background: transparent;
  color: #6366f1;
  border: 1.5px solid #6366f1;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
  white-space: nowrap;
}

.btn-secondary:hover:not(:disabled) {
  background: #6366f1;
  color: #ffffff;
}

.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dark-mode .btn-secondary {
  color: #818cf8;
  border-color: #818cf8;
}

.dark-mode .btn-secondary:hover:not(:disabled) {
  background: #818cf8;
  color: #18181b;
}

/* ===================================
   FEEDBACK MESSAGES
   =================================== */

.feedback-message {
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
}

.feedback-message.success {
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #86efac;
}

.dark-mode .feedback-message.success {
  background: #14532d;
  color: #86efac;
  border-color: #166534;
}

.feedback-message.error {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fca5a5;
}

.dark-mode .feedback-message.error {
  background: #450a0a;
  color: #fca5a5;
  border-color: #991b1b;
}

/* ===================================
   LIMITS OVERVIEW
   =================================== */

.limits-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.limit-card {
  background: #fafafa;
  border: 1px solid #e4e4e7;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s;
}

.dark-mode .limit-card {
  background: #09090b;
  border-color: #27272a;
}

.limit-card:hover {
  border-color: #6366f1;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
}

.limit-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.limit-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.limit-icon.company {
  background: #ede9fe;
  color: #6366f1;
}

.dark-mode .limit-icon.company {
  background: #312e81;
  color: #a78bfa;
}

.limit-icon.contact {
  background: #dbeafe;
  color: #2563eb;
}

.dark-mode .limit-icon.contact {
  background: #1e3a8a;
  color: #60a5fa;
}

.limit-icon.review {
  background: #fef3c7;
  color: #d97706;
}

.dark-mode .limit-icon.review {
  background: #78350f;
  color: #fbbf24;
}

.limit-label {
  font-size: 13px;
  font-weight: 600;
  color: #52525b;
}

.dark-mode .limit-label {
  color: #a1a1aa;
}

.limit-stats {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 12px;
}

.limit-current {
  font-size: 28px;
  font-weight: 700;
  color: #18181b;
}

.dark-mode .limit-current {
  color: #fafafa;
}

.limit-divider {
  font-size: 18px;
  color: #a1a1aa;
  margin: 0 4px;
}

.limit-max {
  font-size: 18px;
  font-weight: 600;
  color: #71717a;
}

.dark-mode .limit-max {
  color: #a1a1aa;
}

.limit-progress-bar {
  height: 6px;
  background: #e4e4e7;
  border-radius: 9999px;
  overflow: hidden;
}

.dark-mode .limit-progress-bar {
  background: #27272a;
}

.limit-progress-fill {
  height: 100%;
  border-radius: 9999px;
  transition: width 0.3s ease;
}

.limit-progress-fill.company {
  background: linear-gradient(90deg, #6366f1 0%, #4f46e5 100%);
}

.limit-progress-fill.contact {
  background: linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%);
}

.limit-progress-fill.review {
  background: linear-gradient(90deg, #d97706 0%, #b45309 100%);
}

/* ===================================
   QUANTITY SELECTOR
   =================================== */

.quantity-selector {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fafafa;
  border: 1.5px solid #e4e4e7;
  border-radius: 10px;
  padding: 8px;
  gap: 12px;
}

.dark-mode .quantity-selector {
  background: #09090b;
  border-color: #27272a;
}

.qty-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border: 1.5px solid #e4e4e7;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  color: #52525b;
  flex-shrink: 0;
}

.dark-mode .qty-btn {
  background: #18181b;
  border-color: #27272a;
  color: #a1a1aa;
}

.qty-btn:hover {
  background: #6366f1;
  border-color: #6366f1;
  color: #ffffff;
  transform: scale(1.05);
}

.qty-btn:active {
  transform: scale(0.95);
}

.qty-input {
  flex: 1;
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  color: #18181b;
  background: transparent;
  border: none;
  outline: none;
  min-width: 40px;
}

.dark-mode .qty-input {
  color: #fafafa;
}

.qty-input::-webkit-inner-spin-button,
.qty-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* ===================================
   REQUEST HISTORY
   =================================== */

.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
  text-align: center;
}

.state-container svg {
  color: #d4d4d8;
}

.dark-mode .state-container svg {
  color: #52525b;
}

.state-title {
  font-size: 18px;
  font-weight: 700;
  color: #18181b;
  margin: 0;
}

.dark-mode .state-title {
  color: #fafafa;
}

.state-text {
  font-size: 14px;
  color: #71717a;
  margin: 0;
}

.dark-mode .state-text {
  color: #a1a1aa;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e4e4e7;
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.dark-mode .spinner {
  border-color: #27272a;
  border-top-color: #818cf8;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Filter Tabs */
.filter-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  padding: 6px;
  background: #fafafa;
  border-radius: 12px;
  border: 1px solid #e4e4e7;
}

.dark-mode .filter-tabs {
  background: #09090b;
  border-color: #27272a;
}

.filter-tab {
  flex: 1;
  padding: 10px 16px;
  background: transparent;
  color: #71717a;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.dark-mode .filter-tab {
  color: #a1a1aa;
}

.filter-tab:hover {
  background: #ffffff;
  color: #18181b;
}

.dark-mode .filter-tab:hover {
  background: #18181b;
  color: #fafafa;
}

.filter-tab.active {
  background: #ffffff;
  color: #6366f1;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.dark-mode .filter-tab.active {
  background: #18181b;
  color: #818cf8;
}

/* History List */
.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  background: #fafafa;
  border: 1px solid #e4e4e7;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s;
}

.dark-mode .history-item {
  background: #09090b;
  border-color: #27272a;
}

.history-item:hover {
  border-color: #6366f1;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
}

.history-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #ffffff;
  border-bottom: 1px solid #e4e4e7;
}

.dark-mode .history-item-header {
  background: #18181b;
  border-bottom-color: #27272a;
}

.request-id {
  font-size: 13px;
  font-weight: 700;
  color: #71717a;
}

.dark-mode .request-id {
  color: #a1a1aa;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.dark-mode .status-badge.pending {
  background: #78350f;
  color: #fbbf24;
}

.status-badge.approved {
  background: #d1fae5;
  color: #065f46;
}

.dark-mode .status-badge.approved {
  background: #064e3b;
  color: #6ee7b7;
}

.status-badge.rejected {
  background: #fee2e2;
  color: #991b1b;
}

.dark-mode .status-badge.rejected {
  background: #7f1d1d;
  color: #fca5a5;
}

.history-item-body {
  padding: 20px;
}

.request-details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-size: 13px;
  color: #71717a;
  font-weight: 500;
}

.dark-mode .detail-label {
  color: #a1a1aa;
}

.detail-value {
  font-size: 16px;
  font-weight: 700;
  color: #18181b;
}

.dark-mode .detail-value {
  color: #fafafa;
}

.request-reason {
  padding: 12px;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e4e4e7;
}

.dark-mode .request-reason {
  background: #18181b;
  border-color: #27272a;
}

.reason-text {
  margin: 0;
  font-size: 13px;
  color: #52525b;
  line-height: 1.6;
}

.dark-mode .reason-text {
  color: #a1a1aa;
}

.history-item-footer {
  padding: 12px 20px;
  background: #ffffff;
  border-top: 1px solid #e4e4e7;
}

.dark-mode .history-item-footer {
  background: #18181b;
  border-top-color: #27272a;
}

.request-date {
  font-size: 12px;
  color: #a1a1aa;
  font-weight: 500;
}

.no-results {
  padding: 40px 20px;
  text-align: center;
  color: #71717a;
  font-size: 14px;
}

.dark-mode .no-results {
  color: #a1a1aa;
}

/* ===================================
   SCROLLBAR STYLING
   =================================== */

.settings-content::-webkit-scrollbar,
.settings-nav::-webkit-scrollbar {
  width: 8px;
}

.settings-content::-webkit-scrollbar-track,
.settings-nav::-webkit-scrollbar-track {
  background: #fafafa;
}

.dark-mode .settings-content::-webkit-scrollbar-track,
.dark-mode .settings-nav::-webkit-scrollbar-track {
  background: #18181b;
}

.settings-content::-webkit-scrollbar-thumb,
.settings-nav::-webkit-scrollbar-thumb {
  background: #6366f1;
  border-radius: 4px;
}

.settings-content::-webkit-scrollbar-thumb:hover,
.settings-nav::-webkit-scrollbar-thumb:hover {
  background: #4f46e5;
}

/* ===================================
   MOBILE RESPONSIVE
   =================================== */

@media (max-width: 768px) {
  .modal-overlay-full {
    padding: 0;
    align-items: flex-end;
  }

  .modal-container {
    max-width: 100%;
    max-height: 95vh;
    border-radius: 20px 20px 0 0;
  }

  .modal-layout {
    flex-direction: column;
    height: auto;
    min-height: 500px;
    max-height: 95vh;
  }

  .modal-close-btn-top {
    top: 16px;
    right: 16px;
    width: 32px;
    height: 32px;
  }

  .settings-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e4e4e7;
  }

  .dark-mode .settings-sidebar {
    border-bottom-color: #27272a;
  }

  .settings-sidebar-header {
    padding: 20px 16px 16px 16px;
  }

  .settings-main-title {
    font-size: 16px;
  }

  .settings-nav {
    flex-direction: row;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 12px;
    scrollbar-width: none;
  }

  .settings-nav::-webkit-scrollbar {
    display: none;
  }

  .settings-nav-item {
    flex-shrink: 0;
    padding: 10px 16px;
    font-size: 13px;
    white-space: nowrap;
  }

  .settings-nav-item svg {
    width: 18px;
    height: 18px;
  }

  .settings-content {
    padding: 24px 16px;
    flex: 1;
  }

  .settings-panel {
    max-width: 100%;
  }

  .panel-header {
    margin-bottom: 24px;
    padding-bottom: 20px;
    padding-right: 40px;
  }

  .panel-title {
    font-size: 20px;
  }

  .panel-description {
    font-size: 13px;
  }

  .limits-overview {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .limit-card {
    padding: 16px;
  }

  .filter-tabs {
    overflow-x: auto;
    flex-wrap: nowrap;
    scrollbar-width: none;
  }

  .filter-tabs::-webkit-scrollbar {
    display: none;
  }

  .filter-tab {
    flex-shrink: 0;
  }

  .request-details-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .input-with-button {
    flex-direction: column;
  }

  .input-with-button .form-input {
    width: 100%;
  }

  .btn-secondary {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .modal-container {
    border-radius: 0;
    max-height: 100vh;
  }

  .modal-layout {
    min-height: 100vh;
    max-height: 100vh;
  }

  .settings-content {
    padding: 20px 16px;
  }

  .panel-header {
    margin-bottom: 20px;
    padding-bottom: 16px;
  }

  .panel-title {
    font-size: 18px;
  }

  .panel-body {
    gap: 20px;
  }

  .form-group {
    gap: 6px;
  }

  .form-label {
    font-size: 12px;
  }

  .form-input {
    padding: 10px 14px;
    font-size: 14px;
    width: 92%;
  }

  .btn-primary,
  .btn-secondary {
    padding: 10px 20px;
    font-size: 13px;
  }
}

/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-enter-from .modal-container {
  transform: scale(0.96) translateY(20px);
}

.modal-leave-to .modal-container {
  transform: scale(0.96) translateY(20px);
}

@media (max-width: 768px) {
  .modal-enter-from .modal-container {
    transform: translateY(100%);
  }

  .modal-leave-to .modal-container {
    transform: translateY(100%);
  }
}

/* Accessibility */
.btn-primary:focus-visible,
.btn-secondary:focus-visible,
.modal-close-btn-top:focus-visible,
.settings-nav-item:focus-visible,
.filter-tab:focus-visible,
.qty-btn:focus-visible {
  outline: 2px solid #6366f1;
  outline-offset: 2px;
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
