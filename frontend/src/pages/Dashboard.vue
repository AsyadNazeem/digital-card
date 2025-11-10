<template>
  <div class="dashboard-wrapper">
    <!-- Header -->
    <header class="dashboard-header">
      <div class="header-content">
        <h1 class="header-title">Dashboard</h1>
        <div class="user-info">
          <span class="welcome-text">Welcome back</span>
          <div class="user-avatar">A</div>
          <button @click="openSettings" class="btn-settings">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3"></path>
            </svg>
            Settings
          </button>
          <button @click="logout" class="logout-btn">Logout</button>
        </div>
      </div>
    </header>

    <div class="dashboard-container">
      <!-- Tabs -->
      <div class="tabs-container">
        <button
            @click="activeTab = 'company'"
            :class="['tab-button', { active: activeTab === 'company' }]"
        >
          <svg class="tab-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2">
            <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
            <path
                d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"></path>
          </svg>
          Company Details
        </button>
        <button
            @click="activeTab = 'contact'"
            :class="['tab-button', { active: activeTab === 'contact' }]"
        >
          <svg class="tab-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          Contact Details
        </button>
      </div>

      <!-- COMPANY TAB -->
      <div v-if="activeTab === 'company'" class="content-card">
        <div v-if="!showCompanyForm">
          <div class="card-header">
            <h2 class="card-title">Company Information</h2>
            <button @click="showCompanyForm = true" class="btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              {{ company ? 'Edit Company' : 'Add Company' }}
            </button>
          </div>

          <div v-if="company" class="table-container">
            <table class="data-table">
              <thead>
              <tr>
                <th>Heading</th>
                <th>Company Name</th>
                <th>Website</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>{{ company.heading }}</td>
                <td>{{ company.companyName }}</td>
                <td>
                  <a :href="company.website" target="_blank" class="link">{{ company.website }}</a>
                </td>
                <td>{{ company.email }}</td>
                <td>
                  <span :class="['status-badge', company.status]">{{ company.status }}</span>
                </td>
              </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="empty-state">
            <svg class="empty-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2">
              <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
              <path
                  d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"></path>
            </svg>
            <p class="empty-text">No company data found</p>
            <button @click="showCompanyForm = true" class="link-button">Add your first company</button>
          </div>
        </div>

        <div v-else>
          <div class="card-header">
            <h2 class="card-title">{{ company ? 'Edit Company' : 'Add Company' }}</h2>
            <button @click="showCompanyForm = false" class="btn-close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div class="form-container">
            <!-- Basic Information -->
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Heading <span class="required">*</span></label>
                <input v-model="companyForm.heading" type="text" class="form-input" required/>
              </div>
              <div class="form-group">
                <label class="form-label">Company Name <span class="required">*</span></label>
                <input v-model="companyForm.companyName" type="text" class="form-input" required/>
              </div>
              <div class="form-group">
                <label class="form-label">Website <span class="required">*</span></label>
                <input v-model="companyForm.website" type="url" class="form-input" required/>
              </div>
              <div class="form-group">
                <label class="form-label">Website Display URL</label>
                <input v-model="companyForm.displayUrl" type="text" class="form-input"/>
              </div>
              <div class="form-group">
                <label class="form-label">Email <span class="required">*</span></label>
                <input v-model="companyForm.email" type="email" class="form-input" required/>
              </div>
              <div class="form-group">
                <label class="form-label">Status <span class="required">*</span></label>
                <select v-model="companyForm.status" class="form-input" required>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <!-- Logo Upload -->
            <div class="form-group full-width">
              <label class="form-label">Company Logo <span class="required">*</span></label>
              <div class="upload-area">
                <input
                    type="file"
                    @change="handleLogoUpload"
                    accept="image/*"
                    id="logo-upload"
                    class="file-input"
                />
                <label for="logo-upload" class="upload-label">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  <span>{{ logoFileName || 'Click to upload logo' }}</span>
                </label>
                <div v-if="logoPreview" class="image-preview">
                  <img :src="logoPreview" alt="Logo preview"/>
                  <button @click="removeLogo" class="remove-image" type="button">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Additional Information -->
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">360 View Link</label>
                <input v-model="companyForm.view360" type="url" class="form-input"/>
              </div>
              <div class="form-group">
                <label class="form-label">Google Location</label>
                <input v-model="companyForm.googleLocation" type="text" class="form-input"/>
              </div>
              <div class="form-group full-width">
                <label class="form-label">Google Reviews</label>
                <input v-model="companyForm.googleReviews" type="text" class="form-input"/>
              </div>
            </div>

            <!-- Company Bio -->
            <div class="form-group full-width">
              <label class="form-label">Company Bio</label>
              <textarea v-model="companyForm.bio" rows="4" class="form-input"></textarea>
            </div>

            <!-- Social Media Links -->
            <div class="form-section">
              <h3 class="section-title">Social Media Links</h3>

              <div class="social-links-grid">
                <div v-for="social in mainSocialMedia" :key="social.name" class="social-link-item">
                  <div class="social-checkbox">
                    <input
                        type="checkbox"
                        :id="`social-${social.name}`"
                        v-model="social.enabled"
                        class="checkbox-input"
                    />
                    <label :for="`social-${social.name}`" class="checkbox-label">
                      {{ social.label }}
                    </label>
                  </div>
                  <input
                      v-model="social.url"
                      type="url"
                      class="form-input"
                      :placeholder="`Enter ${social.label} URL`"
                      :disabled="!social.enabled"
                  />
                </div>
              </div>

              <!-- Custom Social Media Links -->
              <div v-if="customSocialMedia.length > 0" class="custom-social-section">
                <div v-for="(custom, index) in customSocialMedia" :key="index" class="custom-social-item">
                  <div class="social-checkbox">
                    <input
                        type="checkbox"
                        :id="`custom-social-${index}`"
                        v-model="custom.enabled"
                        class="checkbox-input"
                    />
                    <label :for="`custom-social-${index}`" class="checkbox-label-small">
                      Enable
                    </label>
                  </div>
                  <input
                      v-model="custom.name"
                      type="text"
                      class="form-input"
                      placeholder="Social media name"
                      :disabled="!custom.enabled"
                  />
                  <input
                      v-model="custom.url"
                      type="url"
                      class="form-input"
                      placeholder="Enter URL"
                      :disabled="!custom.enabled"
                  />
                  <button @click="removeCustomSocial(index)" class="btn-remove" type="button">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>

              <button @click="addCustomSocial" class="btn-add-more" type="button">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add More
              </button>
            </div>

            <!-- Form Actions -->
            <div class="form-actions">
              <button @click="saveCompany" class="btn-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Save Company
              </button>
              <button @click="showCompanyForm = false" class="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      </div>

      <!-- CONTACT TAB -->
      <div v-if="activeTab === 'contact'" class="content-card">
        <div v-if="!showContactForm">
          <div class="card-header">
            <h2 class="card-title">Contact Information</h2>
            <button @click="showContactForm = true" class="btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add Contact
            </button>
          </div>

          <div v-if="contacts.length > 0" class="table-container">
            <table class="data-table">
              <thead>
              <tr>
                <th>Name</th>
                <th>Telephone</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Designation</th>
                <th>Status</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="c in contacts" :key="c.id">
                <td><strong>{{ c.firstName }} {{ c.lastName }}</strong></td>
                <td>{{ c.telephone }}</td>
                <td>{{ c.mobile }}</td>
                <td>{{ c.email }}</td>
                <td>{{ c.designation }}</td>
                <td>
                  <span :class="['status-badge', c.status]">{{ c.status }}</span>
                </td>
              </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="empty-state">
            <svg class="empty-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <p class="empty-text">No contact data found</p>
            <button @click="showContactForm = true" class="link-button">Add your first contact</button>
          </div>
        </div>

        <!-- Contact Form -->
        <div v-else>
          <div class="card-header">
            <h2 class="card-title">Add Contact</h2>
            <button @click="showContactForm = false" class="btn-close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div class="form-container">
            <!-- Contact Photo Upload -->
            <div class="form-group full-width">
              <label class="form-label">Contact Photo</label>
              <div class="upload-area">
                <input
                    type="file"
                    @change="handlePhotoUpload"
                    accept="image/*"
                    id="photo-upload"
                    class="file-input"
                />
                <label for="photo-upload" class="upload-label">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  <span>{{ photoFileName || 'Click to upload photo' }}</span>
                </label>
                <div v-if="photoPreview" class="image-preview">
                  <img :src="photoPreview" alt="Photo preview"/>
                  <button @click="removePhoto" class="remove-image" type="button">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Contact Information -->
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">First Name <span class="required">*</span></label>
                <input v-model="contactForm.firstName" type="text" class="form-input" required/>
              </div>
              <div class="form-group">
                <label class="form-label">Last Name <span class="required">*</span></label>
                <input v-model="contactForm.lastName" type="text" class="form-input" required/>
              </div>
              <div class="form-group">
                <label class="form-label">Telephone</label>
                <input v-model="contactForm.telephone" type="tel" class="form-input"/>
              </div>
              <div class="form-group">
                <label class="form-label">Mobile <span class="required">*</span></label>
                <input v-model="contactForm.mobile" type="tel" class="form-input" readonly/>
              </div>
              <div class="form-group">
                <label class="form-label">Email <span class="required">*</span></label>
                <input v-model="contactForm.email" type="email" class="form-input" readonly/>
              </div>
              <div class="form-group">
                <label class="form-label">Designation <span class="required">*</span></label>
                <input v-model="contactForm.designation" type="text" class="form-input" required/>
              </div>
              <div class="form-group">
                <label class="form-label">Company</label>
                <input v-model="contactForm.company" type="text" class="form-input"/>
              </div>
              <div class="form-group">
                <label class="form-label">Status <span class="required">*</span></label>
                <select v-model="contactForm.status" class="form-input" required>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="form-actions">
              <button @click="saveContact" class="btn-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Save Contact
              </button>
              <button @click="showContactForm = false" class="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      </div>

      <!-- SETTINGS MODAL -->
      <transition name="modal">
        <div v-if="showSettings" class="modal-overlay" @click="showSettings = false">
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
                  <button
                      @click="activeSetting = 'phone'"
                      :class="['settings-nav-item', { active: activeSetting === 'phone' }]"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path
                          d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    Phone
                  </button>
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
                </nav>
              </aside>

              <!-- Content -->
              <section class="settings-content">
                <button @click="showSettings = false" class="modal-close-btn">
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
                          class="btn-small"
                          @click="sendEmailOtp"
                          :disabled="emailLoading"
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
                <div v-if="activeSetting === 'phone'" class="settings-panel">
                  <h2 class="settings-panel-title">Change Phone Number</h2>
                  <p class="settings-panel-desc">Enter your new phone number to receive an OTP for verification.</p>
                  <div class="form-group">
                    <label class="form-label">New Phone Number</label>
                    <input type="tel" v-model="settingsForm.phone" class="form-input" placeholder="+1 123-456-7890"/>
                  </div>
                  <button class="btn-primary" @click="updatePhone">Send OTP</button>
                </div>

                <!-- Password Panel -->
                <div v-if="activeSetting === 'password'" class="settings-panel">
                  <h2 class="settings-panel-title">Change Password</h2>
                  <p class="settings-panel-desc">Please enter your current password and choose a new one.</p>

                  <div class="form-group">
                    <label class="form-label">Current Password</label>
                    <input type="password" v-model="passwordForm.current" class="form-input"
                           placeholder="Enter current password"/>
                  </div>

                  <div class="form-group">
                    <label class="form-label">New Password</label>
                    <input type="password" v-model="passwordForm.new" class="form-input"
                           placeholder="Enter new password"/>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Confirm New Password</label>
                    <input type="password" v-model="passwordForm.confirm" class="form-input"
                           placeholder="Re-enter new password"/>
                  </div>

                  <button class="btn-primary" @click="updatePassword">Update Password</button>

                  <p v-if="passwordMessage" :class="['otp-message', passwordSuccess ? 'success' : 'error']">
                    {{ passwordMessage }}
                  </p>
                </div>

              </section>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import api from "../services/api";
import {useRouter} from 'vue-router';

const passwordForm = ref({
  current: '',
  new: '',
  confirm: ''
});


const passwordMessage = ref('');
const passwordSuccess = ref(false);
const passwordLoading = ref(false);

// Email change state
const emailOtp = ref('');
const emailOtpSent = ref(false);
const emailVerified = ref(false);
const emailLoading = ref(false);
const emailMessage = ref('');

const activeTab = ref("company");
const showCompanyForm = ref(false);
const showContactForm = ref(false);

const company = ref(null);
const contacts = ref([]);
const router = useRouter();

const usernameMessage = ref('');
const usernameSuccess = ref(false);
const usernameLoading = ref(false);


const companyForm = ref({
  heading: "",
  companyName: "",
  website: "",
  displayUrl: "",
  email: "",
  bio: "",
  logo: null,
  view360: "",
  googleLocation: "",
  googleReviews: "",
  status: "active",
});

const contactForm = ref({
  firstName: "",
  lastName: "",
  telephone: "",
  mobile: "",
  email: "",
  designation: "",
  company: "",
  photo: null,
  status: "active",
});

const user = ref({
  email: "",
  phone: ""
});

const showSettings = ref(false);
const activeSetting = ref('username');

const settingsForm = ref({
  username: '',
  email: '',
  phone: ''
});

// Social Media
const mainSocialMedia = ref([
  {name: 'facebook', label: 'Facebook', enabled: false, url: ''},
  {name: 'twitter', label: 'X (Twitter)', enabled: false, url: ''},
  {name: 'linkedin', label: 'LinkedIn', enabled: false, url: ''},
  {name: 'instagram', label: 'Instagram', enabled: false, url: ''},
  {name: 'youtube', label: 'YouTube', enabled: false, url: ''},
  {name: 'tiktok', label: 'TikTok', enabled: false, url: ''}
]);

const customSocialMedia = ref([]);

// Image Upload States
const logoPreview = ref(null);
const logoFileName = ref('');
const photoPreview = ref(null);
const photoFileName = ref('');


const token = localStorage.getItem("token");

function logout() {
  localStorage.removeItem('token');
  router.push('/login');
}

function openSettings() {
  showSettings.value = true;
}

async function updateUsername() {
  const newName = settingsForm.value.username.trim();
  usernameMessage.value = '';
  usernameSuccess.value = false;

  if (!newName) {
    usernameMessage.value = "Please enter your new name.";
    return;
  }

  // Optional: Simple format validation (no weird symbols)
  const nameRegex = /^[A-Za-z\s]{3,50}$/;
  if (!nameRegex.test(newName)) {
    usernameMessage.value =
        "Name must be 3–50 letters long and contain only alphabets and spaces.";
    return;
  }

  try {
    usernameLoading.value = true;

    const res = await api.post(
        "/settings/change-username",
        {name: newName},
        {headers: {Authorization: `Bearer ${token}`}}
    );

    usernameSuccess.value = true;
    usernameMessage.value = res.data.message || "Name updated successfully!";
    settingsForm.value.username = '';
    loadData();
  } catch (err) {
    usernameMessage.value =
        err.response?.data?.message || "Error updating name.";
  } finally {
    usernameLoading.value = false;
  }
}

async function sendEmailOtp() {
  const newEmail = settingsForm.value.email.trim();
  if (!newEmail) {
    emailMessage.value = "Please enter a valid email.";
    return;
  }

  try {
    emailLoading.value = true;
    emailMessage.value = "";

    // Check if email already exists
    const check = await api.post("/settings/check-email", {email: newEmail});
    if (check.data.exists) {
      emailMessage.value = "❌ This email is already in use.";
      return;
    }

    // Send OTP
    const res = await api.post("/settings/send-email-otp", {email: newEmail});
    emailOtpSent.value = true;
    emailMessage.value = res.data.message || "OTP sent successfully! Check your email.";
  } catch (err) {
    emailMessage.value = err.response?.data?.message || "Error sending OTP.";
  } finally {
    emailLoading.value = false;
  }
}

// 2️⃣ Verify OTP
async function verifyEmailOtp() {
  if (!emailOtp.value) {
    emailMessage.value = "Please enter the OTP.";
    return;
  }

  try {
    emailLoading.value = true;
    const res = await api.post("/settings/verify-email-otp", {
      email: settingsForm.value.email.trim(),
      otp: emailOtp.value.trim(),
    });

    if (res.data.success) {
      emailVerified.value = true;
      emailMessage.value = "✅ OTP verified! You can now confirm the change.";
    } else {
      emailMessage.value = res.data.message || "❌ Invalid OTP.";
    }
  } catch (err) {
    emailMessage.value = err.response?.data?.message || "Error verifying OTP.";
  } finally {
    emailLoading.value = false;
  }
}

// 3️⃣ Confirm email change
async function confirmEmailChange() {
  try {
    emailLoading.value = true;
    const res = await api.post(
        "/settings/confirm-email-change",
        {email: settingsForm.value.email.trim()},
        {headers: {Authorization: `Bearer ${token}`}}
    );

    alert(res.data.message || "Email updated successfully!");
    showSettings.value = false;

    // Reset states
    emailOtpSent.value = false;
    emailVerified.value = false;
    emailOtp.value = "";
    emailMessage.value = "";
    settingsForm.value.email = "";

    // Reload user info
    loadData();
  } catch (err) {
    emailMessage.value = err.response?.data?.message || "Error confirming email change.";
  } finally {
    emailLoading.value = false;
  }
}

// ✅ Change Password
async function updatePassword() {
  passwordMessage.value = '';
  passwordSuccess.value = false;

  const current = passwordForm.value.current.trim();
  const newPass = passwordForm.value.new.trim();
  const confirm = passwordForm.value.confirm.trim();

  // 1️⃣ Basic validation
  if (!current || !newPass || !confirm) {
    passwordMessage.value = "All fields are required.";
    return;
  }

  if (newPass !== confirm) {
    passwordMessage.value = "New password and confirmation do not match.";
    return;
  }

  // 2️⃣ Password strength validation
  const isStrong = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(newPass);
  if (!isStrong) {
    passwordMessage.value = "Password must be at least 8 characters long and include uppercase, lowercase, numbers, and symbols.";
    return;
  }

  try {
    passwordLoading.value = true;
    const res = await api.post(
        "/settings/change-password",
        {
          currentPassword: current,
          newPassword: newPass,
        },
        {
          headers: {Authorization: `Bearer ${token}`},
        }
    );

    passwordSuccess.value = true;
    passwordMessage.value = res.data.message || "Password updated successfully!";
    passwordForm.value = {current: '', new: '', confirm: ''};
  } catch (err) {
    passwordMessage.value = err.response?.data?.message || "Error updating password.";
  } finally {
    passwordLoading.value = false;
  }
}

async function updatePhone() {
  if (!settingsForm.value.phone.trim()) return alert("Please enter a valid phone number.");
  try {
    const res = await api.post("/settings/update-phone", {phone: settingsForm.value.phone}, {
      headers: {Authorization: `Bearer ${token}`}
    });
    alert(res.data.message || "OTP sent to your new phone number!");
    showSettings.value = false;
  } catch (err) {
    alert("Error updating phone: " + (err.response?.data?.message || err.message));
  }
}

function handleLogoUpload(event) {
  const file = event.target.files[0];
  if (file) {
    companyForm.value.logo = file;
    logoFileName.value = file.name;

    const reader = new FileReader();
    reader.onload = (e) => {
      logoPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function removeLogo() {
  companyForm.value.logo = null;
  logoFileName.value = '';
  logoPreview.value = null;
  document.getElementById('logo-upload').value = '';
}

function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (file) {
    contactForm.value.photo = file;
    photoFileName.value = file.name;

    const reader = new FileReader();
    reader.onload = (e) => {
      photoPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function removePhoto() {
  contactForm.value.photo = null;
  photoFileName.value = '';
  photoPreview.value = null;
  document.getElementById('photo-upload').value = '';
}

function addCustomSocial() {
  customSocialMedia.value.push({
    name: '',
    url: '',
    enabled: true
  });
}

function removeCustomSocial(index) {
  customSocialMedia.value.splice(index, 1);
}

async function loadData() {
  try {
    // 1️⃣ Fetch dashboard data (company + contacts)
    const res = await api.get("/dashboard/data", {
      headers: {Authorization: `Bearer ${token}`},
    });

    company.value = res.data.company || null;
    contacts.value = res.data.contacts || [];

    // 2️⃣ Fetch logged-in user info
    const userRes = await api.get("/auth/me", {
      headers: {Authorization: `Bearer ${token}`},
    });

    user.value.email = userRes.data.email || "";
    user.value.phone = userRes.data.phone || "";

    // 3️⃣ Pre-fill contact form (if empty)
    if (!contactForm.value.email) contactForm.value.email = user.value.email;
    if (!contactForm.value.mobile) contactForm.value.mobile = user.value.phone;

    console.log("✅ Dashboard and user data loaded successfully.");
  } catch (err) {
    console.error("❌ Load dashboard error:", err);
    alert("Error loading dashboard data. Please refresh or log in again.");
  }
}


async function saveCompany() {
  try {
    const formData = new FormData();

    // Add all form fields
    Object.keys(companyForm.value).forEach(key => {
      if (key === 'logo' && companyForm.value[key]) {
        formData.append('logo', companyForm.value[key]);
      } else if (key !== 'logo') {
        formData.append(key, companyForm.value[key]);
      }
    });

    // Add social media links
    const socialLinks = {};
    mainSocialMedia.value.forEach(social => {
      if (social.enabled && social.url) {
        socialLinks[social.name] = social.url;
      }
    });
    customSocialMedia.value.forEach(social => {
      if (social.enabled && social.name && social.url) {
        socialLinks[social.name] = social.url;
      }
    });
    formData.append('socialLinks', JSON.stringify(socialLinks));

    const res = await api.post("/dashboard/company", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      },
    });
    alert(res.data.message);
    showCompanyForm.value = false;
    loadData();
  } catch (err) {
    alert("Error saving company: " + (err.response?.data?.message || err.message));
  }
}

async function saveContact() {
  try {
    const formData = new FormData();

    // Add all form fields
    Object.keys(contactForm.value).forEach(key => {
      if (key === 'photo' && contactForm.value[key]) {
        formData.append('photo', contactForm.value[key]);
      } else if (key !== 'photo') {
        formData.append(key, contactForm.value[key]);
      }
    });

    const res = await api.post("/dashboard/contact", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      },
    });
    alert(res.data.message);
    showContactForm.value = false;
    loadData();
  } catch (err) {
    alert("Error saving contact: " + (err.response?.data?.message || err.message));
  }
}


onMounted(loadData);
</script>


<style scoped>
* {
  box-sizing: border-box;
}

.dashboard-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

/* Header */
.dashboard-header {
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #e2e8f0;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.welcome-text {
  font-size: 0.875rem;
  color: #64748b;
}

.user-avatar {
  width: 2rem;
  height: 2rem;
  background: #4f46e5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
}

.btn-settings {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  color: #4f46e5;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.btn-settings:hover {
  background: #f8fafc;
  border-color: #4f46e5;
}

.logout-btn {
  padding: 0.5rem 1.5rem;
  background: #fee2e2;
  color: #991b1b;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.logout-btn:hover {
  background: #fecaca;
}

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

/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .modal-layout {
    flex-direction: column;
    height: auto;
    max-height: 90vh;
  }

  .settings-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
  }

  .settings-nav {
    flex-direction: row;
    overflow-x: auto;
  }

  .settings-content {
    padding: 1.5rem;
  }

  .modal-close-btn {
    top: 0.75rem;
    right: 0.75rem;
  }
}

/* Container */
.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

/* Tabs */
.tabs-container {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;
  display: flex;
  border-bottom: 1px solid #e2e8f0;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  border-bottom: 2px solid transparent;
}

.tab-button:hover {
  color: #0f172a;
  background: #f8fafc;
}

.tab-button.active {
  color: #4f46e5;
  background: #eef2ff;
  border-bottom-color: #4f46e5;
}

.tab-icon {
  flex-shrink: 0;
}

/* Content Card */
.content-card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  padding: 1.5rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}

/* Buttons */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #4338ca;
}

.btn-secondary {
  padding: 0.5rem 1.5rem;
  background: #f1f5f9;
  color: #475569;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-secondary:hover {
  background: #e2e8f0;
}

.btn-close {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 0.25rem;
  transition: color 0.2s;
}

.btn-close:hover {
  color: #64748b;
}

.link-button {
  background: none;
  border: none;
  color: #4f46e5;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s;
}

.link-button:hover {
  color: #4338ca;
}

.btn-add-more {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  color: #4f46e5;
  border: 1px solid #4f46e5;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 1rem;
}

.btn-add-more:hover {
  background: #eef2ff;
}

.btn-remove {
  padding: 0.5rem;
  background: #fee2e2;
  color: #991b1b;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.btn-remove:hover {
  background: #fecaca;
}

/* Table */
.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead tr {
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

.data-table th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.data-table tbody tr {
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.2s;
}

.data-table tbody tr:hover {
  background: #f8fafc;
}

.data-table td {
  padding: 1rem;
  font-size: 0.875rem;
  color: #0f172a;
}

.link {
  color: #4f46e5;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
}

.status-badge.active {
  background: #dcfce7;
  color: #166534;
}

.status-badge.inactive {
  background: #fee2e2;
  color: #991b1b;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}

.empty-icon {
  margin: 0 auto 1rem;
  color: #cbd5e1;
}

.empty-text {
  color: #64748b;
  margin-bottom: 1rem;
}

/* Form */
.form-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
  margin-bottom: 0.5rem;
  text-align: left;
}

.required {
  color: #ef4444;
}

.form-input {
  padding: 0.625rem 0.875rem;
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.form-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.form-input:disabled {
  background: #f1f5f9;
  color: #94a3b8;
  cursor: not-allowed;
}

/* File Upload */
.upload-area {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.file-input {
  display: none;
}

.upload-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 2rem;
  background: white;
  border: 2px dashed #cbd5e1;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  color: #64748b;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.upload-label:hover {
  border-color: #4f46e5;
  background: #f8fafc;
}

.image-preview {
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 2px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.375rem;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  color: #ef4444;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.remove-image:hover {
  background: white;
  transform: scale(1.1);
}

/* Social Media Section */
.form-section {
  border-top: 1px solid #e2e8f0;
  padding-top: 1.5rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 1.25rem 0;
  text-align: left;
}

.social-links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1rem;
}

.social-link-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.social-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-input {
  width: 1.125rem;
  height: 1.125rem;
  cursor: pointer;
  accent-color: #4f46e5;
}

.checkbox-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  user-select: none;
}

.checkbox-label-small {
  font-size: 0.75rem;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  user-select: none;
}

/* Custom Social Media */
.custom-social-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.custom-social-item {
  display: grid;
  grid-template-columns: auto 1fr 2fr auto;
  gap: 0.75rem;
  align-items: center;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .form-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }

  .social-links-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem;
  }

  .header-content {
    padding: 1rem;
  }

  .content-card {
    padding: 1rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .social-links-grid {
    grid-template-columns: 1fr;
  }

  .tabs-container {
    flex-direction: column;
  }

  .tab-button {
    border-bottom: none;
    border-left: 2px solid transparent;
    justify-content: flex-start;
  }

  .tab-button.active {
    border-left-color: #4f46e5;
    border-bottom-color: transparent;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }

  .custom-social-item {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .table-container {
    border-radius: 0.5rem;
    border: 1px solid #e2e8f0;
  }

  .data-table {
    font-size: 0.75rem;
  }

  .data-table th,
  .data-table td {
    padding: 0.5rem;
  }
}

@media (max-width: 480px) {
  .header-title {
    font-size: 1.25rem;
  }

  .welcome-text {
    display: none;
  }

  .upload-label {
    padding: 1.5rem 1rem;
    font-size: 0.875rem;
  }

  .image-preview {
    width: 120px;
    height: 120px;
  }
}

/* Desktop Optimization */
@media (min-width: 1400px) {
  .form-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .social-links-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}


</style>
