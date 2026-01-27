<template>
<transition name="modal">
        <div v-if="open" class="modal-overlay" @click="closePopup">
          <div class="modal-container" @click.stop>
            <div class="modal-layout">
              <!-- Sidebar -->
              <aside class="settings-sidebar">
                <div class="settings-sidebar-header">
                  <h3 class="settings-sidebar-title">Account Settings</h3>
                </div>
                <nav class="settings-nav">
                  <button
                      @click="activeSetting = 'username'"
                      :class="['settings-nav-item', { active: activeSetting === 'username' }]"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    Username
                  </button>
                  <button
                      @click="activeSetting = 'email'"
                      :class="['settings-nav-item', { active: activeSetting === 'email' }]"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    Email
                  </button>
                  <!--                  <button-->
                  <!--                      @click="activeSetting = 'phone'"-->
                  <!--                      :class="['settings-nav-item', { active: activeSetting === 'phone' }]"-->
                  <!--                  >-->
                  <!--                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">-->
                  <!--                      <path-->
                  <!--                          d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>-->
                  <!--                    </svg>-->
                  <!--                    Phone-->
                  <!--                  </button>-->
                  <button
                      @click="activeSetting = 'password'"
                      :class="['settings-nav-item', { active: activeSetting === 'password' }]"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    Password
                  </button>

                  <!-- NEW: Request Limits -->
                  <button
                      @click="activeSetting = 'limits'"
                      :class="['settings-nav-item', { active: activeSetting === 'limits' }]"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path>
                    </svg>
                    Request Limits
                  </button>

                  <button
                      @click="activeSetting = 'history'"
                      :class="['settings-nav-item', { active: activeSetting === 'history' }]"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M3 3h18v18H3zM21 9H3M21 15H3M12 3v18"></path>
                    </svg>
                    Request History
                  </button>
                </nav>
              </aside>

              <!-- Content -->
              <section class="settings-content">
                <button type="button" class="modal-close-btn" @click="closePopup">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>

                <!-- Username Panel -->
                <div v-if="activeSetting === 'username'" class="settings-panel">
                  <h2 class="settings-panel-title">Change Username</h2>
                  <p class="settings-panel-desc">Your username can be changed only once every 30 days.</p>

                  <div class="form-group">
                    <label class="form-label">New Username</label>
                    <input
                        type="text"
                        v-model="settingsForm.username"
                        class="form-input"
                        placeholder="Enter new username"
                    />
                  </div>

                  <button class="btn-primary" @click="updateUsername">Save Username</button>

                  <p v-if="usernameMessage" :class="['otp-message', usernameSuccess ? 'success' : 'error']">
                    {{ usernameMessage }}
                  </p>
                </div>

                <!-- Email Panel -->
                <div v-if="activeSetting === 'email'" class="settings-panel">
                  <h2 class="settings-panel-title">Change Email</h2>
                  <p class="settings-panel-desc">
                    Enter your new email address. We'll send a verification OTP before applying changes.
                  </p>

                  <!-- Step 1️⃣ - Enter new email -->
                  <div class="form-group">
                    <label class="form-label">New Email</label>
                    <div class="input-wrapper">
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
                          style="margin-top: 20px"
                      >
                        <span v-if="!emailLoading">Send OTP</span>
                        <span v-else>⏳ Sending...</span>
                      </button>
                    </div>
                  </div>

                  <!-- Step 2️⃣ - OTP input -->
                  <div v-if="emailOtpSent && !emailVerified" class="form-group">
                    <label class="form-label">Enter OTP</label>
                    <div class="input-wrapper">
                      <input
                          type="text"
                          v-model="emailOtp"
                          class="form-input"
                          placeholder="Enter OTP"
                      />
                      <button
                          class="btn-small"
                          @click="verifyEmailOtp"
                          :disabled="emailLoading"
                      >
                        <span v-if="!emailLoading">Verify OTP</span>
                        <span v-else>⏳ Verifying...</span>
                      </button>
                    </div>
                  </div>

                  <!-- Step 3️⃣ - Confirm change -->
                  <div v-if="emailVerified" class="form-group">
                    <button class="btn-primary" @click="confirmEmailChange" :disabled="emailLoading">
                      <span v-if="!emailLoading">Confirm Change</span>
                      <span v-else>⏳ Saving...</span>
                    </button>
                  </div>

                  <p v-if="emailMessage" :class="['otp-message', emailVerified ? 'success' : 'error']">
                    {{ emailMessage }}
                  </p>
                </div>


                <!-- Phone Panel -->
                <!--                <div v-if="activeSetting === 'phone'" class="settings-panel">-->
                <!--                  <h2 class="settings-panel-title">Change Phone Number</h2>-->
                <!--                  <p class="settings-panel-desc">Enter your new phone number to receive an OTP for verification.</p>-->
                <!--                  <div class="form-group">-->
                <!--                    <label class="form-label">New Phone Number</label>-->
                <!--                    <div class="phone-input-group">-->
                <!--                      <CountryCodeDropdown v-model="countryCode"/>-->
                <!--                      <input-->
                <!--                          type="tel"-->
                <!--                          v-model="settingsForm.phone"-->
                <!--                          class="form-input"-->
                <!--                          maxlength="15"-->
                <!--                          placeholder="Enter 9-15 digits"-->
                <!--                          @input="handleSettingsPhone"-->
                <!--                      />-->
                <!--                    </div>-->
                <!--                  </div>-->
                <!--                  <button class="btn-primary" @click="updatePhone">Send OTP</button>-->
                <!--                </div>-->

                <!-- Password Panel -->
                <div v-if="activeSetting === 'password'" class="settings-panel">
                  <h2 class="settings-panel-title">Change Password</h2>
                  <p class="settings-panel-desc">Please enter your current password and choose a new one.</p>

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

                  <p v-if="passwordMessage" :class="['otp-message', passwordSuccess ? 'success' : 'error']">
                    {{ passwordMessage }}
                  </p>
                </div>

                <!-- Request Limits Panel -->
                <div v-if="activeSetting === 'limits'" class="settings-panel">
                  <h2 class="settings-panel-title">Request More Limits</h2>
                  <p class="settings-panel-desc">
                    Need more companies or contacts? Request an increase and our admin will review your request.
                  </p>

                  <!-- Current Limits Display -->
                  <div class="settings-limits-display">
                    <div class="settings-limit-card">
                      <div class="settings-limit-icon company">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             stroke-width="2">
                          <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                          <path
                              d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"></path>
                        </svg>
                      </div>
                      <div class="settings-limit-details">
                        <span class="settings-limit-label">Companies</span>
                        <div class="settings-limit-progress">
                          <div class="settings-progress-bar">
                            <div
                                class="settings-progress-fill company"
                                :style="{ width: `${(companyCount / userLimits.companyLimit) * 100}%` }"
                            ></div>
                          </div>
                          <span class="settings-limit-text">{{ companyCount }} / {{ userLimits.companyLimit }}</span>
                        </div>
                      </div>
                    </div>

                    <div class="settings-limit-card">
                      <div class="settings-limit-icon contact">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             stroke-width="2">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                      </div>
                      <div class="settings-limit-details">
                        <span class="settings-limit-label">Contacts</span>
                        <div class="settings-limit-progress">
                          <div class="settings-progress-bar">
                            <div
                                class="settings-progress-fill contact"
                                :style="{ width: `${(contactCount / userLimits.contactLimit) * 100}%` }"
                            ></div>
                          </div>
                          <span class="settings-limit-text">{{ contactCount }} / {{ userLimits.contactLimit }}</span>
                        </div>
                      </div>
                    </div>

                    <div class="settings-limit-card">
                      <div class="settings-limit-icon review">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             stroke-width="2">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                      </div>
                      <div class="settings-limit-details">
                        <span class="settings-limit-label">Review</span>
                        <div class="settings-limit-progress">
                          <div class="settings-progress-bar">
                            <div
                                class="settings-progress-fill contact"
                                :style="{ width: `${(reviewCount / userLimits.reviewLimit) * 100}%` }"
                            ></div>
                          </div>
                          <span class="settings-limit-text">{{ reviewCount }} / {{ userLimits.reviewLimit }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Request Form -->
                  <form @submit.prevent="submitSettingsRequest" class="settings-request-form">
                    <div class="form-group">
                      <label class="form-label">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             stroke-width="2">
                          <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                        </svg>
                        Additional Companies Needed
                      </label>
                      <div class="settings-quantity-selector">
                        <button type="button" @click="decrementSettingsCompanies" class="settings-qty-btn">
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
                            class="settings-qty-input"
                        />
                        <button type="button" @click="incrementSettingsCompanies" class="settings-qty-btn">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                               stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div class="form-group">
                      <label class="form-label">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             stroke-width="2">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                        </svg>
                        Additional Contacts Needed
                      </label>
                      <div class="settings-quantity-selector">
                        <button type="button" @click="decrementSettingsContacts" class="settings-qty-btn">
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
                            class="settings-qty-input"
                        />
                        <button type="button" @click="incrementSettingsContacts" class="settings-qty-btn">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                               stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div class="form-group">
                      <label class="form-label">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             stroke-width="2">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                        </svg>
                        Additional Review Needed
                      </label>
                      <div class="settings-quantity-selector">
                        <button type="button" @click="decrementSettingsReviews" class="settings-qty-btn">
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
                            class="settings-qty-input"
                        />
                        <button type="button" @click="incrementSettingsReviews" class="settings-qty-btn">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                               stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div class="form-group">
                      <label class="form-label">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             stroke-width="2">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        Reason for Request (Optional)
                      </label>
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
                      <svg v-if="!settingsRequestLoading" width="16" height="16" viewBox="0 0 24 24" fill="none"
                           stroke="currentColor" stroke-width="2">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path>
                      </svg>
                      <span v-if="!settingsRequestLoading">Submit Request</span>
                      <span v-else>⏳ Submitting...</span>
                    </button>

                    <p v-if="settingsRequestMessage"
                       :class="['otp-message', settingsRequestSuccess ? 'success' : 'error']">
                      {{ settingsRequestMessage }}
                    </p>
                  </form>
                </div>

                <!-- Request History Panel -->
                <div v-if="activeSetting === 'history'" class="settings-panel">
                  <h2 class="settings-panel-title">Request History</h2>
                  <p class="settings-panel-desc">
                    View all your limit increase requests and their current status.
                  </p>

                  <!-- Loading State -->
                  <div v-if="historyLoading" class="history-loading">
                    <div class="spinner"></div>
                    <p>Loading your requests...</p>
                  </div>

                  <!-- Error State -->
                  <div v-else-if="historyError" class="history-error">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <p>{{ historyError }}</p>
                    <button @click="loadRequestHistory" class="btn-retry">Try Again</button>
                  </div>

                  <!-- Empty State -->
                  <div v-else-if="!requestHistory || requestHistory.length === 0" class="history-empty">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M3 3h18v18H3zM21 9H3M21 15H3M12 3v18"></path>
                    </svg>
                    <h3>No Requests Yet</h3>
                    <p>You haven't submitted any limit increase requests.</p>
                    <button @click="activeSetting = 'limits'" class="btn-make-request">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                           stroke-width="2">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path>
                      </svg>
                      Make Your First Request
                    </button>
                  </div>

                  <!-- Request List -->
                  <div v-else class="history-list">
                    <!-- Filter Tabs -->
                    <div class="history-filters">
                      <button
                          @click="historyFilter = 'all'"
                          :class="['filter-btn', { active: historyFilter === 'all' }]"
                      >
                        All ({{ requestHistory.length }})
                      </button>
                      <button
                          @click="historyFilter = 'pending'"
                          :class="['filter-btn', { active: historyFilter === 'pending' }]"
                      >
                        Pending ({{ filteredHistory('pending').length }})
                      </button>
                      <button
                          @click="historyFilter = 'approved'"
                          :class="['filter-btn', { active: historyFilter === 'approved' }]"
                      >
                        Approved ({{ filteredHistory('approved').length }})
                      </button>
                      <button
                          @click="historyFilter = 'rejected'"
                          :class="['filter-btn', { active: historyFilter === 'rejected' }]"
                      >
                        Rejected ({{ filteredHistory('rejected').length }})
                      </button>
                    </div>

                    <!-- Request Cards -->
                    <div class="history-cards">
                      <div
                          v-for="request in displayedHistory"
                          :key="request.id"
                          class="history-card"
                      >
                        <!-- Card Header -->
                        <div class="history-card-header">
                          <div class="history-card-title">
                            <span class="request-id">#{{ request.id }}</span>
                            <span :class="['status-pill', request.status]">
              <svg v-if="request.status === 'pending'" width="12" height="12" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
              </svg>
              <svg v-else-if="request.status === 'approved'" width="12" height="12" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
              {{ request.status.charAt(0).toUpperCase() + request.status.slice(1) }}
            </span>
                          </div>
                          <div class="request-date">
                            {{ formatDate(request.createdAt) }}
                          </div>
                        </div>

                        <!-- Card Body -->
                        <div class="history-card-body">
                          <div class="request-details">
                            <div class="detail-item" v-if="request.requestedCompanies > 0">
                              <div class="detail-icon company">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                     stroke-width="2">
                                  <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                                </svg>
                              </div>
                              <div class="detail-content">
                                <span class="detail-label">Companies Requested</span>
                                <span class="detail-value">{{ request.requestedCompanies }}</span>
                              </div>
                            </div>

                            <div class="detail-item" v-if="request.requestedContacts > 0">
                              <div class="detail-icon contact">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                     stroke-width="2">
                                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                  <circle cx="9" cy="7" r="4"></circle>
                                </svg>
                              </div>
                              <div class="detail-content">
                                <span class="detail-label">Contacts Requested</span>
                                <span class="detail-value">{{ request.requestedContacts }}</span>
                              </div>
                            </div>

                            <!-- After the contacts detail-item div -->
                            <div class="detail-item" v-if="request.requestedReviews > 0">
                              <div class="detail-icon review">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                     stroke-width="2">
                                  <path d="M3 7h18M3 12h18M3 17h18"></path>
                                </svg>
                              </div>
                              <div class="detail-content">
                                <span class="detail-label">Reviews Requested</span>
                                <span class="detail-value">{{ request.requestedReviews }}</span>
                              </div>
                            </div>
                          </div>

                          <div v-if="request.reason" class="request-reason">
                            <div class="reason-header">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                   stroke-width="2">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                              </svg>
                              <span>Reason</span>
                            </div>
                            <p class="reason-text">{{ request.reason }}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Pagination (if needed) -->
                    <div v-if="displayedHistory.length === 0 && historyFilter !== 'all'" class="no-filtered-results">
                      <p>No {{ historyFilter }} requests found.</p>
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
import { ref, computed, watch } from "vue";
import api from "@/services/api";

// =======================
// CORE STATE
// =======================
const activeSetting = ref("username");

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["close"]);

// =======================
// USER + LIMIT DATA
// =======================
const userLimits = ref({
  companyLimit: 1,
  contactLimit: 1,
  reviewLimit: 1,
});

const companyCount = ref(0);
const contactCount = ref(0);
const reviewCount = ref(0);

// =======================
// SETTINGS FORMS
// =======================
const settingsForm = ref({
  username: "",
  email: "",
  phone: "",
});

// =======================
// USERNAME
// =======================
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

// =======================
// EMAIL CHANGE
// =======================
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

// =======================
// PASSWORD CHANGE
// =======================
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

// =======================
// REQUEST LIMITS
// =======================
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

// =======================
// REQUEST HISTORY
// =======================
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

// Auto-load history when tab opens
watch(activeSetting, val => {
  if (val === "history" && requestHistory.value.length === 0) {
    loadRequestHistory();
  }
});

// =======================
// CLOSE HANDLERS
// =======================
function closePopup() {
  emit("close");
}

// Close with ESC key
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
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 20px;
}

.modal-container {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  animation: modalSlideUp 0.3s ease-out;
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

.modal-layout {
  display: flex;
  height: 600px;
}

/* Settings Sidebar */
.settings-sidebar {
  width: 240px;
  background: #f8fafc;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.settings-sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.settings-sidebar-title {
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}

.settings-nav {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.settings-nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  border-radius: 0.5rem;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  font-family: inherit;
}

.settings-nav-item:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.settings-nav-item.active {
  background: #4f46e5;
  color: white;
}

/* Settings Content */
.settings-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  position: relative;
}

.modal-close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  border: none;
  border-radius: 0.5rem;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-close-btn:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.settings-panel {
  max-width: 500px;
}

.settings-panel-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.5rem 0;
}

.settings-panel-desc {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 1.5rem 0;
  line-height: 1.6;
}

/* Form Styles */
.form-group {
  margin-bottom: 1.25rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.625rem 0.875rem;
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.btn-primary:hover {
  background: #4338ca;
}

.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input-wrapper .form-input {
  padding-right: 45px;
  flex: 1;
}

.password-toggle-btn {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
  z-index: 10;
}

.password-toggle-btn:hover {
  color: #334155;
}

.password-toggle-btn:focus {
  outline: none;
  color: #0ea5e9;
}

.password-toggle-btn svg {
  flex-shrink: 0;
}

/* Settings Limits Display */
.settings-limits-display {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1.5rem 0;
  padding: 1.25rem;
  background: #f8fafc;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
}

.settings-limit-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
}

.settings-limit-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.settings-limit-icon.company {
  background: #dbeafe;
  color: #1e40af;
}

.settings-limit-icon.contact {
  background: #dcfce7;
  color: #166534;
}

.settings-limit-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.settings-limit-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #0f172a;
}

.settings-limit-progress {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.settings-progress-bar {
  flex: 1;
  height: 0.5rem;
  background: #e2e8f0;
  border-radius: 9999px;
  overflow: hidden;
}

.settings-progress-fill {
  height: 100%;
  border-radius: 9999px;
  transition: width 0.3s ease;
}

.settings-progress-fill.company {
  background: linear-gradient(90deg, #3b82f6 0%, #1e40af 100%);
}

.settings-progress-fill.contact {
  background: linear-gradient(90deg, #22c55e 0%, #166534 100%);
}

.settings-limit-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  white-space: nowrap;
}

/* Settings Request Form */
.settings-request-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.settings-quantity-selector {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  gap: 1rem;
}

.settings-qty-btn {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
  color: #475569;
  flex-shrink: 0;
}

.settings-qty-btn:hover {
  background: #4f46e5;
  border-color: #4f46e5;
  color: white;
  transform: scale(1.05);
}

.settings-qty-btn:active {
  transform: scale(0.95);
}

.settings-qty-input {
  flex: 1;
  text-align: center;
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
  background: transparent;
  border: none;
  outline: none;
  padding: 0.25rem;
}

.settings-qty-input::-webkit-inner-spin-button,
.settings-qty-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* History Loading State */
.history-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  gap: 1rem;
}

.spinner {
  width: 2.5rem;
  height: 2.5rem;
  border: 3px solid #e2e8f0;
  border-top-color: #4f46e5;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.history-loading p {
  color: #64748b;
  font-size: 0.875rem;
}

/* History Error State */
.history-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  gap: 1rem;
  text-align: center;
}

.history-error svg {
  color: #ef4444;
}

.history-error p {
  color: #64748b;
  font-size: 0.875rem;
  max-width: 300px;
}

.btn-retry {
  padding: 0.5rem 1.25rem;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 0.5rem;
}

.btn-retry:hover {
  background: #4338ca;
}

/* History Empty State */
.history-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  gap: 1rem;
  text-align: center;
}

.history-empty svg {
  color: #cbd5e1;
  margin-bottom: 0.5rem;
}

.history-empty h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}

.history-empty p {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0;
}

.btn-make-request {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 1rem;
}

.btn-make-request:hover {
  background: #4338ca;
  transform: translateY(-1px);
}

/* History List */
.history-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Filter Tabs */
.history-filters {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #f8fafc;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  flex-wrap: wrap;
}

.filter-btn {
  flex: 1;
  min-width: fit-content;
  padding: 0.5rem 1rem;
  background: transparent;
  color: #64748b;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.filter-btn:hover {
  background: white;
  color: #0f172a;
}

.filter-btn.active {
  background: white;
  color: #4f46e5;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* History Cards */
.history-cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.history-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  overflow: hidden;
  transition: all 0.2s;
}

.history-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #cbd5e1;
}

/* Card Header */
.history-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.history-card-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.request-id {
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-pill.pending {
  background: #fef3c7;
  color: #92400e;
}

.status-pill.approved {
  background: #dcfce7;
  color: #166534;
}

.status-pill.rejected {
  background: #fee2e2;
  color: #991b1b;
}

.request-date {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 500;
}

/* Card Body */
.history-card-body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.request-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
}

.detail-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.detail-icon.company {
  background: #dbeafe;
  color: #1e40af;
}

.detail-icon.contact {
  background: #dcfce7;
  color: #166534;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-label {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
}

.detail-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
}

/* Request Reason */
.request-reason {
  padding: 1rem;
  background: #fefce8;
  border: 1px solid #fef08a;
  border-radius: 0.5rem;
}

.reason-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: #854d0e;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.reason-text {
  margin: 0;
  font-size: 0.875rem;
  color: #713f12;
  line-height: 1.6;
}
</style>

