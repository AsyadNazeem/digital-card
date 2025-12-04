<template>
  <div class="dashboard-wrapper">
    <!-- Header -->
    <header class="dashboard-header">
      <div class="header-content">
        <img src="../assets/images/logo.jpeg" alt="Dashboard Logo" class="header-logo"/>

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

    <!-- Request Limit Increase Banner -->
    <div v-if="companyCount >= userLimits.companyLimit || contactCount >= userLimits.contactLimit" class="limit-banner">
      <div class="limit-banner-content">
        <div class="limit-banner-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <div class="limit-banner-text">
          <h3>You've reached your limit!</h3>
          <p>Request more companies or contacts from the admin to continue adding.</p>
        </div>
        <button @click="showRequestModal = true" class="btn-request">
          Request More
        </button>
      </div>
    </div>

    <div class="dashboard-container">
      <!-- Tabs -->
      <div class="tabs-container">
        <div class="tab-buttons">
          <button
              @click="activeTab = 'company'"
              :class="['tab-button', { active: activeTab === 'company' }]"
          >
            <svg class="tab-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2">
              <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
              <path
                  d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01">
              </path>
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

          <button
              @click="activeTab = 'Review'"
              :class="['tab-button', { active: activeTab === 'Review' }]"
          >
            <svg class="tab-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2">
              <polygon
                  points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            Review
          </button>

          <button
              @click="activeTab = 'Theme'"
              :class="['tab-button', { active: activeTab === 'Theme' }]"
          >
            <svg class="tab-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2">
              <circle cx="13.5" cy="6.5" r=".5"></circle>
              <circle cx="17.5" cy="10.5" r=".5"></circle>
              <circle cx="8.5" cy="7.5" r=".5"></circle>
              <circle cx="6.5" cy="12.5" r=".5"></circle>
              <path
                  d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
            </svg>
            Contact Card Theme
          </button>
        </div>

      </div>


      <!-- COMPANY TAB -->
      <div v-if="activeTab === 'company'" class="content-card">
        <div v-if="!showCompanyForm">
          <div class="card-header">
            <h2 class="card-title">Company Information</h2>
            <button
                class="btn-primary"
                @click="showCompanyForm = true"
                :disabled="companyCount >= userLimits.companyLimit"
                v-if="companyCount < userLimits.companyLimit"
            >
              + Add Company
            </button>
          </div>

          <div v-if="userCompanies.length > 0" class="table-container">
            <div class="table-controls">
              <input
                  type="text"
                  v-model="searchQuery"
                  placeholder="Search companies..."
                  class="search-input"
              />
            </div>

            <table class="data-table">
              <thead>
              <tr>
                <th>#</th>
                <th>Company Name</th>
                <th>Logo</th>
                <th>Website</th>
                <th>Email</th>
                <th>360° View</th>
                <th>Location</th>
                <th>Reviews</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
              </thead>

              <tbody>
              <tr v-for="(c,index) in paginatedCompanies" :key="c.id">
                <td>{{ index + 1 }}</td>
                <td>{{ c.companyName }}</td>

                <!-- Logo Preview -->
                <td>
                  <img
                      v-if="c.logo"
                      :src="`${VITE_IMAGE_UPLOAD_URL}${c.logo}`"
                      alt="Logo"
                      class="logo-thumb"
                  />
                  <span v-else>No logo</span>
                </td>

                <!-- Website link -->
                <td>
                  <a :href="c.website" target="_blank" class="link">{{ c.website }}</a>
                </td>

                <td>{{ c.email }}</td>

                <!-- 360 View -->
                <td>
                  <a
                      v-if="c.view360"
                      :href="c.view360"
                      target="_blank"
                      class="link"
                  >View</a>
                  <span v-else>-</span>
                </td>

                <!-- Google Location -->
                <td>
                  <a
                      v-if="c.googleLocation"
                      :href="c.googleLocation"
                      target="_blank"
                      class="link"
                  >Location</a>
                  <span v-else>-</span>
                </td>

                <!-- Google Reviews -->
                <td>
                  <a
                      v-if="c.googleReviews"
                      :href="c.googleReviews"
                      target="_blank"
                      class="link"
                  >Reviews</a>
                  <span v-else>-</span>
                </td>

                <td>
                  <span :class="['status-badge', c.status]">{{ c.status }}</span>
                </td>

                <td>
                  <button class="btn-action edit" @click="editCompany(c)">✏️ Edit</button>
                  <button class="btn-action delete" @click="deleteCompany(c.id)">🗑️ Delete</button>
                </td>
              </tr>
              </tbody>
            </table>
            <div class="pagination">
              <button
                  @click="currentPage--"
                  :disabled="currentPage === 1"
              >
                Prev
              </button>

              <button
                  v-for="page in totalPages"
                  :key="page"
                  @click="currentPage = page"
                  :class="['page-btn', { active: currentPage === page }]"
              >
                {{ page }}
              </button>

              <button
                  @click="currentPage++"
                  :disabled="currentPage === totalPages"
              >
                Next
              </button>
            </div>
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
              <!--              <div class="form-group">-->
              <!--                <label class="form-label">Heading <span class="required">*</span></label>-->
              <!--                <input v-model="companyForm.heading" type="text" class="form-input" required/>-->
              <!--              </div>-->
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
            </div>

            <!-- In the form grid after Google Reviews and Trip Advisor -->
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Google Reviews</label>
                <input v-model="companyForm.googleReviews" type="text" class="form-input"/>
              </div>
              <div class="form-group">
                <label class="form-label">Trip Advisor</label>
                <input v-model="companyForm.tripAdvisor" type="text" class="form-input"/>
              </div>
            </div>

            <!-- ✅ NEW: File Upload Section -->
            <div class="form-section">
              <h3 class="section-title">Company Files</h3>

              <!-- Existing Files Display -->
              <div v-if="companyForm.files && companyForm.files.length > 0" class="uploaded-files-list">
                <div
                    v-for="(file, index) in companyForm.files"
                    :key="index"
                    class="uploaded-file-item"
                >
                  <div class="file-info">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                      <polyline points="13 2 13 9 20 9"></polyline>
                    </svg>
                    <div class="file-details">
                      <span class="file-name">{{ file.name || file.path.split('/').pop() }}</span>
                      <div class="file-badges">
                        <span v-if="file.isBrochure" class="file-badge brochure">📄 Brochure</span>
                        <span v-if="file.isMenu" class="file-badge menu">🍽️ Menu</span>
                      </div>
                    </div>
                  </div>
                  <button @click="removeFile(index)" class="btn-remove-file" type="button" title="Remove file">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- File Upload Area -->
              <div class="file-upload-section">
                <div class="form-group full-width">
                  <label class="form-label">Upload File (PDF, Images)</label>
                  <div class="upload-area">
                    <input
                        type="file"
                        @change="handleFileUpload"
                        accept=".pdf,image/*"
                        id="file-upload"
                        class="file-input"
                        ref="fileInput"
                    />
                    <label for="file-upload" class="upload-label">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                      </svg>
                      <span>{{ pendingFileName || 'Click to upload brochure or menu' }}</span>
                    </label>
                  </div>
                </div>

                <!-- File Type Selection (only show when file is selected) -->
                <div v-if="pendingFile" class="file-type-selection">
                  <p class="selection-label">Select file type:</p>
                  <div class="file-type-checkboxes">
                    <div class="file-type-checkbox">
                      <input
                          type="checkbox"
                          id="file-type-brochure"
                          v-model="pendingFileType.isBrochure"
                          class="checkbox-input"
                      />
                      <label for="file-type-brochure" class="checkbox-label">
                        📄 Brochure
                      </label>
                    </div>
                    <div class="file-type-checkbox">
                      <input
                          type="checkbox"
                          id="file-type-menu"
                          v-model="pendingFileType.isMenu"
                          class="checkbox-input"
                      />
                      <label for="file-type-menu" class="checkbox-label">
                        🍽️ Menu
                      </label>
                    </div>
                  </div>
                  <button
                      @click="addFileToList"
                      class="btn-add-file"
                      type="button"
                      :disabled="!pendingFileType.isBrochure && !pendingFileType.isMenu"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Add File
                  </button>
                </div>
              </div>
            </div>


            <!-- Address Section -->
            <div class="form-section">
              <h3 class="section-title">Company Address</h3>

              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Label</label>
                  <select v-model="companyForm.label" class="form-input">
                    <option value="">Select Label</option>
                    <option value="Home">🏠 Home</option>
                    <option value="Work">💼 Work</option>
                    <option value="Office">🏢 Office</option>
                    <option value="Other">📍 Other</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">Country/Region</label>
                  <CountrySelector v-model="companyForm.country"/>
                </div>

                <div class="form-group full-width">
                  <label class="form-label">Street Address</label>
                  <input v-model="companyForm.streetAddress" type="text" class="form-input"
                         placeholder=""/>
                </div>

                <div class="form-group full-width">
                  <label class="form-label">Street Address Line 2</label>
                  <input v-model="companyForm.streetAddressLine2" type="text" class="form-input"
                         placeholder=""/>
                </div>

                <div class="form-group">
                  <label class="form-label">City</label>
                  <input v-model="companyForm.city" type="text" class="form-input" placeholder=""/>
                </div>

                <div class="form-group">
                  <label class="form-label">Postal Code</label>
                  <input v-model="companyForm.postalCode" type="text" class="form-input" placeholder=""/>
                </div>

                <div class="form-group">
                  <label class="form-label">PO Box</label>
                  <input v-model="companyForm.poBox" type="text" class="form-input" placeholder=""/>
                </div>
              </div>
            </div>

            <!-- Company Bio -->
            <div class="form-group full-width">
              <label class="form-label">Company Bio</label>
              <QuillEditor
                  v-model:content="companyForm.bio"
                  contentType="html"
                  theme="snow"
                  :toolbar="[
        ['bold', 'italic', 'underline'],
        [{ 'header': [1, 2, 3, false] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['link'],
        ['clean']
      ]"
                  class="quill-editor"
                  placeholder="Enter company bio..."
              />
              <p class="field-hint">Use the toolbar to format your text</p>
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
            <button
                class="btn-primary"
                @click="showContactForm = true"
                :disabled="contactCount >= userLimits.contactLimit"
                v-if="contactCount < userLimits.contactLimit"
            >
              + Add Contact
            </button>
          </div>

          <div v-if="contacts.length > 0" class="table-container">
            <div class="table-controls">
              <input
                  type="text"
                  v-model="contactSearch"
                  placeholder="Search contacts..."
                  class="search-input"
              />
            </div>

            <table class="data-table">
              <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Designation</th>
                <th>Company</th>
                <th>Status</th>
                <th>Photo</th>
                <th>Wallet</th>
                <th>Actions</th>
              </tr>
              </thead>

              <tbody>
              <tr v-for="(c, index) in paginatedContacts" :key="c.id">

                <td>{{ index + 1 }}</td>
                <!-- Full Name -->
                <td><strong>{{ c.firstName }} {{ c.lastName }}</strong></td>

                <!-- Mobile as clickable link to contact card -->
                <td>
                  <a
                      :href="`/${c.mobile.replace(/\D/g, '')}`"
                      target="_blank"
                      class="link"
                  >
                    {{ c.mobile }}
                  </a>
                </td>

                <td>{{ c.email }}</td>
                <td>{{ c.designation }}</td>

                <!-- Company (show name from relationship or store companyName in table) -->
                <td>{{ c.Company?.companyName || '-' }}</td>

                <td>
                  <span :class="['status-badge', c.status]">{{ c.status }}</span>
                </td>

                <!-- Photo Preview -->
                <td>
                  <img
                      v-if="c.photo"
                      :src="`${VITE_IMAGE_UPLOAD_URL}${c.photo}`"
                      class="photo-thumb"
                      alt="Contact Photo"
                  />
                  <span v-else>-</span>
                </td>

                <td>
                  <button class="btn-primary" @click="saveToGoogleWallet(c)">
                    Save
                  </button>

                </td>

                <!-- Actions -->
                <td class="action-buttons">
                  <a
                      :href="`/${c.mobile.replace(/\D/g, '')}`"
                      target="_blank"
                      class="btn-action view"
                  > 👁 View </a>
                  <button class="btn-action qr" @click="openQrPopup(c)">
                    🔳 QR
                  </button>

                  <button class="btn-action edit" @click="editContact(c)">
                    ✏️ Edit
                  </button>
                  <button class="btn-action delete" @click="deleteContact(c.id)">
                    🗑️ Delete
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
            <div class="pagination">
              <button
                  @click="contactPage--"
                  :disabled="contactPage === 1"
              >
                Prev
              </button>

              <button
                  v-for="page in contactTotalPages"
                  :key="page"
                  @click="contactPage = page"
                  :class="['page-btn', { active: contactPage === page }]"
              >
                {{ page }}
              </button>

              <button
                  @click="contactPage++"
                  :disabled="contactPage === contactTotalPages"
              >
                Next
              </button>
            </div>
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

              <!-- CONTACT FORM - TELEPHONE -->
              <div class="form-group">
                <label>Telephone</label>
                <div class="phone-input-group">
                  <CountryCodeDropdown v-model="telephoneCountryCode"/>
                  <input
                      v-model="contactForm.telephone"
                      type="tel"
                      class="form-input"
                      placeholder="Enter phone number"
                      @input="handleContactTelephone"
                  />
                </div>
                <p
                    v-if="phoneValidation.telephone.message"
                    :style="{
      color: phoneValidation.telephone.isValid ? '#27ae60' : '#e74c3c',
      fontSize: '0.85rem',
      marginTop: '0.5rem'
    }"
                >
                  {{ phoneValidation.telephone.message }}
                </p>
              </div>

              <!-- CONTACT FORM - MOBILE -->
              <div class="form-group">
                <label>Mobile <span style="color: red;">*</span></label>
                <div class="phone-input-group">
                  <CountryCodeDropdown v-model="mobileCountryCode"/>
                  <input
                      v-model="contactForm.mobile"
                      type="tel"
                      class="form-input"
                      placeholder="Enter mobile number"
                      @input="handleContactMobile"
                      required
                  />
                </div>
                <!-- Show validation message OR duplicate check message -->
                <p
                    v-if="phoneValidation.mobile.message && !checkingMobile"
                    :style="{
      color: phoneValidation.mobile.isValid ? '#27ae60' : '#e74c3c',
      fontSize: '0.85rem',
      marginTop: '0.5rem'
    }"
                >
                  {{ phoneValidation.mobile.message }}
                </p>
                <p
                    v-if="mobileExistsMessage"
                    :style="{
      color: mobileExists ? '#e74c3c' : (checkingMobile ? '#3498db' : '#27ae60'),
      fontSize: '0.85rem',
      marginTop: '0.5rem'
    }"
                >
                  {{ mobileExistsMessage }}
                </p>
              </div>


              <!-- ✅ NEW: Public Card URL Preview -->
              <div class="url-preview-container">
                <div class="url-preview-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                  </svg>
                  <span>Public Card URL Preview:</span>
                </div>

                <div class="url-preview-box">
                  <input
                      type="text"
                      :value="publicCardUrl"
                      readonly
                      class="url-preview-input"
                      @click="$event.target.select()"
                  />
                  <button
                      @click="copyPublicCardUrl"
                      class="url-copy-btn"
                      type="button"
                      title="Copy to clipboard"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  </button>

                  <a
                      v-if="contactForm.mobile && phoneValidation.mobile.isValid"
                      :href="publicCardUrl"
                      target="_blank"
                      class="url-open-btn"
                      title="Open in new tab"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </a>
                </div>
              </div>

              <!-- CONTACT FORM - WHATSAPP -->
              <div class="form-group">
                <label class="form-label">
                  <input
                      type="checkbox"
                      v-model="whatsappSameAsMobile"
                      style="margin-right: 8px;"
                  />
                  WhatsApp (Same as Mobile)
                </label>
                <div class="phone-input-group">
                  <CountryCodeDropdown
                      v-model="whatsappCountryCode"
                      :disabled="whatsappSameAsMobile"
                  />
                  <input
                      v-model="contactForm.whatsapp"
                      type="tel"
                      class="form-input"
                      placeholder="Enter WhatsApp number"
                      @input="handleContactWhatsApp"
                      :disabled="whatsappSameAsMobile"
                      :style="{ opacity: whatsappSameAsMobile ? 0.6 : 1 }"
                  />
                </div>
                <p
                    v-if="phoneValidation.whatsapp.message && !whatsappSameAsMobile"
                    :style="{
      color: phoneValidation.whatsapp.isValid ? '#27ae60' : '#e74c3c',
      fontSize: '0.85rem',
      marginTop: '0.5rem'
    }"
                >
                  {{ phoneValidation.whatsapp.message }}
                </p>
              </div>

              <div class="form-group">
                <label class="form-label">Email <span class="required">*</span></label>
                <input v-model="contactForm.email" type="email" class="form-input" required/>
              </div>
              <div class="form-group">
                <label class="form-label">Designation <span class="required">*</span></label>
                <input v-model="contactForm.designation" type="text" class="form-input" required/>
              </div>

              <div class="form-group">
                <label class="form-label">Company</label>
                <select v-model="contactForm.companyId" class="form-input">
                  <option disabled value="">Select a company</option>
                  <option
                      v-for="company in userCompanies"
                      :key="company.id"
                      :value="company.id"
                  >
                    {{ company.companyName }}
                  </option>
                </select>

                <!-- Optional: Add note if no active companies -->
                <p v-if="userCompanies.length === 0" class="no-companies-note">
                  ⚠️ You don't have any active companies. Please activate or create one first.
                </p>
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

      <!-- Theme Selection Section -->
      <div v-if="activeTab === 'Theme'" class="content-card theme-section">
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

      <!-- REVIEW TAB -->
      <div v-if="activeTab === 'Review'" class="content-card">
        <div v-if="!showReviewForm">
          <div class="card-header">
            <h2 class="card-title">Reviews / Branch Links</h2>
            <button
                class="btn-primary"
                @click="openReviewForm"
            >
              + Add Review
            </button>
          </div>

          <div v-if="reviewItems.length > 0" class="table-container">
            <table class="data-table">
              <thead>
              <tr>
                <th>#</th>
                <th>Company</th>
                <th>Branch Name</th>
                <th>Location</th>
                <th>Google Review</th>
                <th>Tripadvisor</th>
                <th>Actions</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(r, idx) in reviewItems" :key="r._tempId || r.id">
                <td>{{ idx + 1 }}</td>
                <td>{{ companyNameById(r.companyId) || '-' }}</td>
                <td>{{ r.branchName }}</td>
                <td>{{ r.location }}</td>
                <td>
                  <a v-if="r.googleLink" :href="r.googleLink" target="_blank" class="link">{{
                      shortLink(r.googleLink)
                    }}</a>
                  <span v-else>-</span>
                </td>
                <td>
                  <a v-if="r.tripadvisorLink" :href="r.tripadvisorLink" target="_blank"
                     class="link">{{ shortLink(r.tripadvisorLink) }}</a>
                  <span v-else>-</span>
                </td>
                <td class="action-buttons">
                  <button class="btn-action view" @click="openReviewShareModal(r)">View</button>
                  <button class="btn-action edit" @click="editReview(idx)">✏️ Edit</button>
                  <button class="btn-action delete" @click="removeReview(idx)">🗑️ Delete</button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="empty-state">
            <svg class="empty-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2">
              <path d="M3 7h18M3 12h18M3 17h18"></path>
            </svg>
            <p class="empty-text">No review entries found</p>
            <button @click="openReviewForm" class="link-button">Add your first review</button>
          </div>
        </div>

        <!-- REVIEW FORM -->
        <div v-else>
          <div class="card-header">
            <h2 class="card-title">Add / Edit Reviews</h2>
            <button @click="closeReviewForm" class="btn-close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div class="form-container">
            <!-- inside the v-for="(item, index) in reviewFormRows" -->
            <div v-for="(item, index) in reviewFormRows" :key="item._tempId" class="review-row">
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Company <span class="required">*</span></label>
                  <select v-model="item.companyId" class="form-input">
                    <option disabled value="">Select a company</option>
                    <option v-for="c in userCompanies" :key="c.id" :value="c.id">{{ c.companyName }}</option>
                  </select>
                  <p v-if="item._errors?.companyId" class="field-error">{{ item._errors.companyId }}</p>
                </div>

                <div class="form-group">
                  <label class="form-label">Branch Name <span class="required">*</span></label>
                  <input v-model="item.branchName" type="text" class="form-input" placeholder="e.g. Colombo Branch"/>
                  <p v-if="item._errors?.branchName" class="field-error">{{ item._errors.branchName }}</p>
                </div>

                <div class="form-group">
                  <label class="form-label">Branch Location</label>
                  <input v-model="item.location" type="text" class="form-input" placeholder="City, Area, Address"/>
                </div>

                <div class="form-group">
                  <label class="form-label">Google Review Link</label>
                  <input v-model="item.googleLink" type="url" class="form-input" placeholder="https://..."/>
                  <p v-if="item._errors?.googleLink" class="field-error">{{ item._errors.googleLink }}</p>
                </div>

                <div class="form-group">
                  <label class="form-label">Tripadvisor Link</label>
                  <input v-model="item.tripadvisorLink" type="url" class="form-input" placeholder="https://..."/>
                  <p v-if="item._errors?.tripadvisorLink" class="field-error">{{ item._errors.tripadvisorLink }}</p>
                </div>
              </div>

              <!-- New row actions: Add More (validates current row) + Remove -->
              <div class="form-actions" style="margin-bottom: 1rem;">
                <button class="btn-outline" @click="addMore(index)" type="button">
                  + Add More
                </button>

                <button
                    class="btn-danger"
                    @click="removeRow(index)"
                    type="button"
                >
                  Remove
                </button>
              </div>

              <hr />
            </div>


            <!-- Add more + final actions -->
            <div class="form-actions" style="margin-top: 8px;">
              <button class="btn-primary" @click="saveAllReviews" :disabled="savingReviews">
                <span v-if="!savingReviews">Save All</span>
                <span v-else>Saving...</span>
              </button>
              <button class="btn-secondary" @click="closeReviewForm">Cancel</button>
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
                        :disabled="settingsRequestLoading || (settingsRequestForm.companies === 0 && settingsRequestForm.contacts === 0)"
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

      <!-- Force Phone Modal -->
      <transition name="modal">
        <div v-if="showPhonePopup" class="phone-popup-overlay">
          <div class="phone-popup-container">
            <div class="phone-popup-header">
              <h2 class="phone-popup-title">Add Your Phone Number</h2>
              <p class="phone-popup-description">
                Please provide your phone number to access your dashboard. This step is mandatory.
              </p>
            </div>

            <form class="phone-popup-form" @submit.prevent="submitPhone">
              <div class="phone-form-group">
                <label class="phone-form-label">Phone Number</label>
                <div class="phone-input-group">
                  <CountryCodeDropdown v-model="countryCode"/>
                  <input
                      v-model="phoneNumber"
                      maxlength="15"
                      type="tel"
                      placeholder="Enter 9-15 digits"
                      class="phone-form-input"
                      @input="handleContactMobile"
                  />
                </div>
              </div>

              <button
                  type="submit"
                  class="phone-submit-btn"
                  :disabled="loading || phoneNumber.length !== 9"
              >
                {{ loading ? "Saving..." : "Save & Continue" }}
              </button>

              <p v-if="errorMsg" class="phone-error-message">{{ errorMsg }}</p>
            </form>
          </div>
        </div>
      </transition>


      <!-- Request Limit Increase Modal -->
      <transition name="modal">
        <div v-if="showRequestModal" class="modal-overlay" @click="showRequestModal = false">
          <div class="request-modal-container" @click.stop>
            <div class="request-modal-header">
              <h2 class="request-modal-title">Request Additional Limits</h2>
              <button @click="showRequestModal = false" class="btn-close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div class="request-modal-body">
              <!-- Current Limits Display -->
              <div class="current-limits">
                <h3>Your Current Limits</h3>
                <div class="limits-grid">
                  <div class="limit-card">
                    <div class="limit-icon company">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                           stroke-width="2">
                        <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                      </svg>
                    </div>
                    <div class="limit-info">
                      <span class="limit-label">Companies</span>
                      <span class="limit-value">{{ companyCount }} / {{ userLimits.companyLimit }}</span>
                    </div>
                  </div>
                  <div class="limit-card">
                    <div class="limit-icon contact">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                           stroke-width="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <div class="limit-info">
                      <span class="limit-label">Contacts</span>
                      <span class="limit-value">{{ contactCount }} / {{ userLimits.contactLimit }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Request Form -->
              <form @submit.prevent="submitRequest" class="request-form">
                <div class="request-form-group">
                  <label class="request-label">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                    </svg>
                    How many companies do you need?
                  </label>
                  <div class="quantity-selector">
                    <button type="button" @click="decrementCompanies" class="qty-btn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                           stroke-width="2">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </button>
                    <input
                        type="number"
                        v-model.number="requestForm.companies"
                        min="0"
                        max="100"
                        class="qty-input"
                    />
                    <button type="button" @click="incrementCompanies" class="qty-btn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                           stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="request-form-group">
                  <label class="request-label">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                    </svg>
                    How many contacts do you need?
                  </label>
                  <div class="quantity-selector">
                    <button type="button" @click="decrementContacts" class="qty-btn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                           stroke-width="2">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </button>
                    <input
                        type="number"
                        v-model.number="requestForm.contacts"
                        min="0"
                        max="500"
                        class="qty-input"
                    />
                    <button type="button" @click="incrementContacts" class="qty-btn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                           stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="request-form-group">
                  <label class="request-label">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    Reason for request (optional)
                  </label>
                  <textarea
                      v-model="requestForm.reason"
                      rows="3"
                      class="request-textarea"
                      placeholder="Tell us why you need more limits..."
                  ></textarea>
                </div>

                <div class="request-actions">
                  <button type="submit" class="btn-submit-request"
                          :disabled="requestLoading || (requestForm.companies === 0 && requestForm.contacts === 0)">
                    <svg v-if="!requestLoading" width="18" height="18" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2">
                      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path>
                    </svg>
                    <span v-if="!requestLoading">Submit Request</span>
                    <span v-else>Submitting...</span>
                  </button>
                  <button type="button" @click="showRequestModal = false" class="btn-cancel-request">
                    Cancel
                  </button>
                </div>

                <p v-if="requestMessage" :class="['request-message', requestSuccess ? 'success' : 'error']">
                  {{ requestMessage }}
                </p>
              </form>
            </div>
          </div>
        </div>
      </transition>


      <!-- QR CODE POPUP -->
      <transition name="modal">
        <div v-if="showQrPopup" class="qr-popup-overlay">
          <div class="qr-popup">
            <button class="close-btn" @click="showQrPopup = false">×</button>

            <h3>QR Code – {{ qrName }}</h3>

            <div class="qr-container">
              <canvas ref="qrCanvas"></canvas>
            </div>

            <div class="qr-actions">
              <button class="btn-download" @click="downloadQr">⬇️ Download</button>
              <button class="btn-share" @click="sharePoster">📤 Share Poster</button>
            </div>
          </div>
        </div>
      </transition>


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

<!--      &lt;!&ndash; REVIEW SHARE QR MODAL &ndash;&gt;-->
<!--      <transition name="modal">-->
<!--        <div v-if="showReviewShareModal" class="modal-overlay" @click="showReviewShareModal = false">-->
<!--          <div class="modal-container" @click.stop>-->
<!--            <div class="modal-header" style="display:flex;justify-content:space-between;align-items:center;">-->
<!--              <h3>Share QR Codes</h3>-->
<!--              <button class="modal-close" @click="showReviewShareModal = false">✕</button>-->
<!--            </div>-->

<!--            <div style="display:flex;gap:28px;align-items:flex-start;justify-content:center;padding:16px 8px;">-->
<!--              <div style="text-align:center;">-->
<!--                <h4 style="margin:6px 0 12px 0;">Google</h4>-->
<!--                <canvas ref="shareQrCanvas1"></canvas>-->
<!--                <p style="max-width:280px;word-break:break-all;font-size:12px;margin-top:8px;">-->
<!--                  {{ reviewShareData.googleLink || reviewShareData.shareUrl }}-->
<!--                </p>-->
<!--              </div>-->

<!--              <div style="text-align:center;">-->
<!--                <h4 style="margin:6px 0 12px 0;">Tripadvisor</h4>-->
<!--                <canvas ref="shareQrCanvas2"></canvas>-->
<!--                <p style="max-width:280px;word-break:break-all;font-size:12px;margin-top:8px;">-->
<!--                  {{ reviewShareData.tripadvisorLink || reviewShareData.shareUrl }}-->
<!--                </p>-->
<!--              </div>-->
<!--            </div>-->

<!--            <div style="text-align:center;padding:12px;">-->
<!--              <a :href="reviewShareData.shareUrl" target="_blank" class="btn-outline" style="margin-right:8px;">Open share page</a>-->
<!--              <button class="btn-primary" @click="downloadBothQRCodes">Download Both</button>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </transition>-->


      <!-- Logo Cropper Modal -->
      <ImageCropperModal
          :show="showLogoCropper"
          :imageSrc="tempLogoSrc"
          type="logo"
          title="Crop Company Logo"
          @close="showLogoCropper = false"
          @cropped="handleLogoCropped"
      />

      <!-- Photo Cropper Modal -->
      <ImageCropperModal
          :show="showPhotoCropper"
          :imageSrc="tempPhotoSrc"
          type="photo"
          title="Crop Contact Photo"
          @close="showPhotoCropper = false"
          @cropped="handlePhotoCropped"
      />

    </div>
  </div>
</template>

<script setup>
import {computed, nextTick, onMounted, ref, watch} from 'vue'
import api from "../services/api";
import {useRouter} from 'vue-router';
import CountryCodeDropdown from '../components/CountryCodeDropdown.vue'
import {isValidPhoneNumber, parsePhoneNumber} from 'libphonenumber-js'
import CountrySelector from '../components/CountrySelector.vue'
import ImageCropperModal from '../components/ImageCropper.vue'
import {API_BASE_URL, VITE_FRONTEND_URL, VITE_IMAGE_UPLOAD_URL} from "../config.js";
import RealThemePreview from "../components/RealThemePreview.vue";
import {QuillEditor} from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import QRCode from "qrcode";
import Quill from 'quill';

const Block = Quill.import('blots/block');
Block.tagName = 'p';   // Force Quill to use <p> instead of <br>
Quill.register(Block, true);

const showQrPopup = ref(false);
const qrCanvas = ref(null);
const qrUrl = ref("");
const qrName = ref("");


const themes = ref([]);
const selectedTheme = ref(null);
const userId = localStorage.getItem("userId");
const userPlan = ref('free'); // Will be loaded from user data
const showThemeConfirm = ref(false);
const pendingTheme = ref(null);
const themeLoading = ref(false);
const themesLoading = ref(true);

const showLogoCropper = ref(false);
const showPhotoCropper = ref(false);
const tempLogoSrc = ref('');
const tempPhotoSrc = ref('');

const passwordForm = ref({
  current: '',
  new: '',
  confirm: ''
});

const userCompanies = ref([]) // holds the list of companies

const showPhonePopup = ref(false);
const phoneNumber = ref("");
const countryCode = ref("+94");
const errorMsg = ref("");
const loading = ref(false);

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

const whatsappSameAsMobile = ref(true);
const whatsappCountryCode = ref('+1');

// Add to your existing ref declarations
const pendingFile = ref(null);
const pendingFileName = ref('');
const pendingFileType = ref({
  isBrochure: false,
  isMenu: false
});
const fileInput = ref(null);

const companyForm = ref({
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
  // NEW ADDRESS FIELDS
  country: "",
  streetAddress: "",
  streetAddressLine2: "",
  city: "",
  postalCode: "",
  poBox: "",
  label: "",
  tripAdvisor: "",
  files: []
});

const contactForm = ref({
  firstName: "",
  lastName: "",
  telephone: "",
  mobile: "",
  whatsapp: "", // ADD THIS
  email: "",
  designation: "",
  companyId: "",
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

const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(5);

const contactSearch = ref("");
const contactPage = ref(1);
const contactPerPage = ref(5);


// Social Media
const mainSocialMedia = ref([
  {name: 'facebook', label: 'Facebook', enabled: false, url: ''},
  {name: 'twitter', label: 'X (Twitter)', enabled: false, url: ''},
  {name: 'linkedin', label: 'LinkedIn', enabled: false, url: ''},
  {name: 'instagram', label: 'Instagram', enabled: false, url: ''},
  {name: 'youtube', label: 'YouTube', enabled: false, url: ''},
  {name: 'tiktok', label: 'TikTok', enabled: false, url: ''}
]);

const telephoneCountryCode = ref('+1')
const mobileCountryCode = ref('+1')

const customSocialMedia = ref([]);

// Image Upload States
const logoPreview = ref(null);
const logoFileName = ref('');
const photoPreview = ref(null);
const photoFileName = ref('');

const token = localStorage.getItem("token");

const showLinkPopup = ref(false);
const copyMessage = ref("");

const userPhone = ref(""); // store the logged user's phone

const userLimits = ref({
  companyLimit: 1,
  contactLimit: 1,
  role: "user",
});

const companyCount = ref(0);
const contactCount = ref(0);


// Request Modal State
const showRequestModal = ref(false);
const requestForm = ref({
  companies: 0,
  contacts: 0,
  reason: ''
});
const requestLoading = ref(false);
const requestMessage = ref('');
const requestSuccess = ref(false);

// Settings Request Form State
const settingsRequestForm = ref({
  companies: 0,
  contacts: 0,
  reason: ''
});
const settingsRequestLoading = ref(false);
const settingsRequestMessage = ref('');
const settingsRequestSuccess = ref(false);

// Request History State
const requestHistory = ref([]);
const historyLoading = ref(false);
const historyError = ref('');
const historyFilter = ref('all'); // 'all', 'pending', 'approved', 'rejected'

const mobileExistsMessage = ref("");
const mobileExists = ref(false);
const checkingMobile = ref(false);

let mobileCheckTimeout = null;

// Preview data - user's actual data
const previewContact = ref({
  firstName: 'John',
  lastName: 'Doe',
  designation: 'CEO & Founder',
  mobile: '+1234567890',
  email: 'john@company.com',
  photo: null
});

// ----- Review tab state & helpers -----
const showReviewForm = ref(false);
const reviewItems = ref([]);      // saved entries from server
const reviewFormRows = ref([]);   // dynamic rows inside the form
const savingReviews = ref(false);

// Review share modal state
const showReviewShareModal = ref(false);
const reviewShareData = ref({
  id: null,
  shareUrl: '',
  googleLink: '',
  tripadvisorLink: '',
  branchName: '',
  companyName: ''
});
const shareQrCanvas1 = ref(null); // google/tripadvisor canvas left
const shareQrCanvas2 = ref(null); // google/tripadvisor canvas right


// Computed property for public card URL preview
const publicCardUrl = computed(() => {
  const baseUrl = import.meta.env.VITE_FRONTEND_URL || 'https://tapmy.name/';

  if (!contactForm.value.mobile || !mobileCountryCode.value) {
    return `${baseUrl}/`;
  }

  // Remove all non-digit characters from mobile
  const cleanMobile = contactForm.value.mobile.replace(/\D/g, '');

  if (!cleanMobile) {
    return `${baseUrl}/`;
  }

  // Remove the + from country code and combine with mobile
  const cleanCountryCode = mobileCountryCode.value.replace(/\+/g, '');
  const fullNumber = cleanCountryCode + cleanMobile;

  return `${baseUrl}/${fullNumber}`;
});


// File upload handler
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF or image file (JPG, PNG)');
      event.target.value = '';
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('File size must be less than 10MB');
      event.target.value = '';
      return;
    }

    pendingFile.value = file;
    pendingFileName.value = file.name;
    pendingFileType.value = {
      isBrochure: false,
      isMenu: false
    };
  }
}

// Add file to the list
function addFileToList() {
  if (!pendingFile.value) return;

  if (!pendingFileType.value.isBrochure && !pendingFileType.value.isMenu) {
    alert('Please select at least one file type (Brochure or Menu)');
    return;
  }

  // Add to files array
  if (!companyForm.value.files) {
    companyForm.value.files = [];
  }

  companyForm.value.files.push({
    file: pendingFile.value,
    name: pendingFileName.value,
    isBrochure: pendingFileType.value.isBrochure,
    isMenu: pendingFileType.value.isMenu,
    isNew: true // Flag to indicate this needs to be uploaded
  });

  // Reset pending file state
  pendingFile.value = null;
  pendingFileName.value = '';
  pendingFileType.value = {
    isBrochure: false,
    isMenu: false
  };

  // Clear file input
  if (fileInput.value) {
    fileInput.value.value = '';
  }
}

// Remove file from list
function removeFile(index) {
  if (confirm('Are you sure you want to remove this file?')) {
    companyForm.value.files.splice(index, 1);
  }
}

async function saveToGoogleWallet(contact) {
  try {
    // Build share URL
    const cleanedPhone = contact.cardMobileNum || contact.mobile;
    const shareUrl = `${window.location.origin}/${cleanedPhone.replace(/\D/g, '')}`;

    console.log("🎫 Requesting wallet save for:", {
      name: `${contact.firstName} ${contact.lastName}`,
      phone: cleanedPhone,
      shareUrl
    });

    const res = await api.post('/wallet/google/save-url', {
      contact: {
        name: `${contact.firstName} ${contact.lastName}`,
        firstName: contact.firstName,
        lastName: contact.lastName,
        phone: cleanedPhone,
        email: contact.email,
        designation: contact.designation || contact.jobTitle || '',
        companyName: contact.Company?.companyName || '',
        shareUrl,
        googleReview: contact.googleReviews || '',
        tripAdvisor: contact.tripAdvisor || '',
      },
      objectIdSuffix: `contact_${contact.id}`,
    });

    console.log("✅ Received save URL:", res.data.saveUrl);

    if (res.data.saveUrl) {
      // Try to open in same tab for mobile devices
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        window.location.href = res.data.saveUrl;
      } else {
        // Desktop: open in new tab
        const walletWindow = window.open(res.data.saveUrl, '_blank');
        if (!walletWindow) {
          // Popup blocked - try direct navigation
          console.warn("⚠️ Popup blocked, redirecting in same tab");
          window.location.href = res.data.saveUrl;
        }
      }
    } else {
      console.error("❌ No saveUrl in response");
      alert('Could not generate Google Wallet link.');
    }
  } catch (err) {
    console.error('❌ Save to Google Wallet error:', {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status
    });
    alert(err.response?.data?.message || 'Failed to generate Google Wallet link');
  }
}

// Function to copy URL to clipboard
function copyPublicCardUrl() {
  if (!contactForm.value.mobile) {
    alert('Please enter a mobile number first');
    return;
  }

  navigator.clipboard.writeText(publicCardUrl.value).then(() => {
    alert('✅ URL copied to clipboard!');
  }).catch(err => {
    console.error('Failed to copy:', err);
    alert('Failed to copy URL');
  });
}


// helper: create an empty row
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

// UI helpers
function openReviewForm() {
  showReviewForm.value = true;
  if (reviewFormRows.value.length === 0) reviewFormRows.value.push(makeEmptyReviewRow());
}

function closeReviewForm() {
  showReviewForm.value = false;
  reviewFormRows.value = [];
}

function addEmptyRow() {
  reviewFormRows.value.push(makeEmptyReviewRow());
}


// New addMore(index) - validate current row then add new empty row after it
function addMore(index) {
  const row = reviewFormRows.value[index];
  if (!row) {
    // fallback: just add a row if something odd
    reviewFormRows.value.push(makeEmptyReviewRow());
    return;
  }

  // Validate current row first
  const ok = validateRow(row);

  if (!ok) {
    // Scroll to the first error field optionally (nice UX), but at minimum show message inline
    // Keep focus on the invalid field - best-effort:
    alert('Please fill all mandatory fields before adding a new row.');
    return;
  }

  // If current row is valid, insert a new empty row after the current index
  reviewFormRows.value.splice(index + 1, 0, makeEmptyReviewRow());
}


// Remove row remains same (no change)
function removeRow(index) {
  // If only one row left, just clear fields instead of removing entirely (optional)
  if (reviewFormRows.value.length === 1) {
    reviewFormRows.value[0] = makeEmptyReviewRow();
    return;
  }
  reviewFormRows.value.splice(index, 1);
}

// small format helper for links
function shortLink(url) {
  try {
    const u = new URL(url);
    return u.hostname + (u.pathname && u.pathname !== '/' ? u.pathname.slice(0, 18) + '…' : '');
  } catch {
    return url;
  }
}

function companyNameById(id) {
  const c = userCompanies.value.find(x => x.id === id);
  return c ? c.companyName : null;
}

// Validate row function (make sure mandatory fields enforced)
function validateRow(row) {
  row._errors = row._errors || {};
  // Clear previous
  row._errors.companyId = undefined;
  row._errors.branchName = undefined;
  row._errors.googleLink = undefined;
  row._errors.tripadvisorLink = undefined;

  // Mandatory checks
  if (!row.companyId) row._errors.companyId = 'Please select a company.';
  if (!row.branchName || !row.branchName.trim()) row._errors.branchName = 'Branch name is required.';

  // Optional URL validation if provided
  if (row.googleLink && row.googleLink.trim()) {
    try {
      new URL(row.googleLink);
    } catch {
      row._errors.googleLink = 'Invalid URL';
    }
  }
  if (row.tripadvisorLink && row.tripadvisorLink.trim()) {
    try {
      new URL(row.tripadvisorLink);
    } catch {
      row._errors.tripadvisorLink = 'Invalid URL';
    }
  }

  // Remove any keys that are undefined to keep object clean
  Object.keys(row._errors).forEach(k => {
    if (row._errors[k] === undefined) delete row._errors[k];
  });

  return Object.keys(row._errors).length === 0;
}

// ----- Load reviews from server -----
async function loadReviews() {
  try {
    const res = await api.get('/dashboard/reviews', {
      headers: {Authorization: `Bearer ${token}`}
    });
    // Expect res.data.reviews as array
    reviewItems.value = res.data.reviews || [];
  } catch (err) {
    console.error('Error loading reviews:', err);
    reviewItems.value = [];
  }
}


// ----- Bulk save all rows (upsert) -----
async function saveAllReviews() {
  // validate
  let ok = true;
  for (const r of reviewFormRows.value) {
    if (!validateRow(r)) ok = false;
  }
  if (!ok) {
    alert('Fix validation errors before saving all rows.');
    return;
  }

  savingReviews.value = true;
  try {
    // send payload (server should handle create/update by id)
    const payload = reviewFormRows.value.map(r => ({
      id: r.id || null,
      companyId: r.companyId,
      branchName: r.branchName,
      location: r.location,
      googleLink: r.googleLink,
      tripadvisorLink: r.tripadvisorLink
    }));

    const res = await api.post('/dashboard/reviews/bulk-save', {items: payload}, {
      headers: {Authorization: `Bearer ${token}`}
    });

    // if server returns the full list, use it; otherwise refresh
    if (res.data.reviews) {
      reviewItems.value = res.data.reviews;
    } else {
      await loadReviews();
    }

    // clear form
    reviewFormRows.value = [];
    showReviewForm.value = false;
    alert('All review entries saved.');
  } catch (err) {
    console.error('Bulk save error:', err);
    alert('Failed to save reviews. You can try saving rows individually.');
  } finally {
    savingReviews.value = false;
  }
}

// ----- Edit or remove existing saved items -----
function editReview(index) {
  const item = reviewItems.value[index];
  const row = makeEmptyReviewRow({
    id: item.id,
    companyId: item.companyId,
    branchName: item.branchName,
    location: item.location,
    googleLink: item.googleLink,
    tripadvisorLink: item.tripadvisorLink
  });
  reviewFormRows.value = [row];
  showReviewForm.value = true;
}

async function removeReview(index) {
  const item = reviewItems.value[index];
  if (!confirm('Delete this review entry?')) return;
  try {
    if (item.id) {
      await api.delete(`/dashboard/reviews/${item.id}`, {
        headers: {Authorization: `Bearer ${token}`}
      });
    }
    reviewItems.value.splice(index, 1);
    alert('Entry deleted.');
  } catch (err) {
    console.error('Delete review error:', err);
    alert('Failed to delete entry.');
  }
}

// Replace the existing openReviewShareModal function in Document 3:

async function openReviewShareModal(review) {
  try {
    const res = await api.post(`/dashboard/reviews/${review.id}/generate-share`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Open the new URL format in a new tab
    window.open(res.data.shareUrl, '_blank');

  } catch (err) {
    console.error("❌ openReviewShareModal error:", err);
    alert("Failed to open review page: " + (err.response?.data?.message || err.message));
  }
}

async function openQrPopup(contact) {
  const phone = contact.mobile.replace(/\D/g, "");

  qrUrl.value = `${VITE_FRONTEND_URL}/${phone}`;
  qrName.value = `${contact.firstName} ${contact.lastName}`;

  showQrPopup.value = true;

  // Wait until DOM renders the <canvas>
  await nextTick();

  await generatePlainQr();
}


async function generatePlainQr() {
  const canvas = qrCanvas.value;
  if (!canvas) return;

  await QRCode.toCanvas(canvas, qrUrl.value, {
    width: 280,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#ffffff"
    }
  });
}


async function downloadBothQRCodes() {
  try {
    const c1 = shareQrCanvas1.value;
    const c2 = shareQrCanvas2.value;
    if (!c1 || !c2) return alert('QRs not ready');

    // Convert canvases to images (ensure drawn)
    // Create a new poster canvas
    const poster = document.createElement('canvas');
    const padding = 40;
    const qrSize = 320; // output size per QR in poster
    const width = qrSize * 2 + padding * 3; // left + right + paddings
    const height = qrSize + 260; // QR + text area
    poster.width = width;
    poster.height = height;
    const ctx = poster.getContext('2d');

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Draw left QR
    const img1 = new Image();
    img1.src = c1.toDataURL('image/png');
    await new Promise((resolve) => { img1.onload = resolve; });

    const img2 = new Image();
    img2.src = c2.toDataURL('image/png');
    await new Promise((resolve) => { img2.onload = resolve; });

    const leftX = padding;
    const rightX = padding * 2 + qrSize;
    const qrY = 40;

    // Draw QR images centered in QR boxes
    ctx.drawImage(img1, leftX, qrY, qrSize, qrSize);
    ctx.drawImage(img2, rightX, qrY, qrSize, qrSize);

    // Draw separators / labels
    ctx.fillStyle = '#111';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';

    // Left label (Google)
    ctx.fillText('Google Review', leftX + qrSize / 2, qrY + qrSize + 32);
    // Right label (Tripadvisor)
    ctx.fillText('Tripadvisor', rightX + qrSize / 2, qrY + qrSize + 32);

    // Add small subtitle or branch name
    ctx.font = 'bold 28px Arial';
    ctx.fillText(reviewShareData.value.companyName || reviewShareData.value.branchName || 'My Business', width / 2, qrY + qrSize + 80);

    // Add share URL for convenience
    ctx.font = '16px Arial';
    ctx.fillText(reviewShareData.value.shareUrl, width / 2, qrY + qrSize + 110);

    // Trigger download
    poster.toBlob((blob) => {
      const file = new File([blob], `${(reviewShareData.value.companyName || 'review')}-qrs.png`, { type: 'image/png' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(file);
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(a.href);
    }, 'image/png');
  } catch (err) {
    console.error('❌ downloadBothQRCodes error:', err);
    alert('Failed to create download.');
  }
}



async function sharePoster() {
  const qr = qrCanvas.value;
  if (!qr) return;

  const poster = document.createElement("canvas");
  poster.width = 600;
  poster.height = 900;
  const ctx = poster.getContext("2d");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, poster.width, poster.height);

  // Draw QR
  const qrSize = 350;
  const qrY = 120;

  ctx.drawImage(
      qr,
      poster.width / 2 - qrSize / 2,
      qrY,
      qrSize,
      qrSize
  );

  // Text
  ctx.fillStyle = "#000";
  ctx.font = "bold 32px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Scan to view my", poster.width / 2, 540);
  ctx.fillText("Digital Business Card", poster.width / 2, 590);

  // Convert to Blob
  poster.toBlob(async (blob) => {
    const file = new File([blob], `${qrName.value}-digital-card.png`, {type: "image/png"});

    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Digital Business Card",
          text: "Scan this QR to view my Digital Card!",
          files: [file],
        });
      } catch (err) {
        console.log("Share canceled or failed:", err);
      }
    } else {
      alert("Sharing not supported on this device.");
    }
  });
}

// Validate and format phone number
function validatePhone(value, countryCode) {
  try {
    // Remove all non-digits first
    const digitsOnly = value.replace(/\D/g, '');

    // Combine country code + number
    const fullNumber = `${countryCode}${digitsOnly}`;

    // Check if valid
    if (isValidPhoneNumber(fullNumber)) {
      const phoneNumber = parsePhoneNumber(fullNumber);
      return {
        isValid: true,
        formatted: phoneNumber.formatInternational(), // e.g., "+94 77 123 4567"
        national: phoneNumber.formatNational(), // e.g., "077 123 4567"
        e164: phoneNumber.format('E.164'), // e.g., "+94771234567"
        countryCode: phoneNumber.country,
        type: phoneNumber.getType() // 'MOBILE', 'FIXED_LINE', etc.
      };
    }

    return {
      isValid: false,
      error: 'Invalid phone number'
    };
  } catch (error) {
    return {
      isValid: false,
      error: error.message
    };
  }
}

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


onMounted(async () => {
  await loadThemesAndData();
});

async function loadThemesAndData() {
  try {
    themesLoading.value = true;

    // Load themes
    const themesRes = await api.get("/themes");
    themes.value = themesRes.data;

    // Load user data
    const userRes = await api.get("/auth/me");
    selectedTheme.value = userRes.data.selectedThemeId;
    userPlan.value = userRes.data.plan || 'free';

    // Try to load user's actual data for preview
    try {
      const dashData = await api.get("/dashboard/data");

      if (dashData.data.contacts?.[0]) {
        previewContact.value = dashData.data.contacts[0];
      }

      if (dashData.data.companies?.[0]) {
        previewCompany.value = dashData.data.companies[0];
      }
    } catch (err) {
      console.log("Using sample data for preview");
    }

  } catch (err) {
    console.error("Failed to load themes:", err);
    alert("Failed to load themes. Please refresh the page.");
  } finally {
    themesLoading.value = false;
  }
}

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

async function applySelectedTheme() {
  if (!pendingTheme.value) return;

  try {
    themeLoading.value = true;

    const response = await api.post("/themes/select", {
      themeId: pendingTheme.value.id
    });

    // Update selected theme
    selectedTheme.value = pendingTheme.value.id;

    // Close modal
    showThemeConfirm.value = false;

    // Show success message
    alert('✅ Theme applied successfully! Your contact card has been updated.');

  } catch (err) {
    console.error("Failed to apply theme:", err);

    if (err.response?.data?.isPremium) {
      alert('⭐ ' + err.response.data.message);
    } else {
      alert('❌ Failed to apply theme. Please try again.');
    }
  } finally {
    themeLoading.value = false;
  }
}


// Real-time validation messages
const phoneValidation = ref({
  telephone: {isValid: false, message: ''},
  mobile: {isValid: false, message: ''},
  whatsapp: {isValid: false, message: ''},
  settingsPhone: {isValid: false, message: ''},
  popupPhone: {isValid: false, message: ''}
});

// Add WhatsApp handler function
function handleContactWhatsApp(event) {
  const value = event.target.value.replace(/\D/g, '');
  contactForm.value.whatsapp = value;

  if (value.length > 0) {
    const validation = validatePhone(value, whatsappCountryCode.value);
    phoneValidation.value.whatsapp = {
      isValid: validation.isValid,
      message: validation.isValid
          ? `✅ Valid ${validation.type || 'phone'} number`
          : `⚠️ ${validation.error}`
    };
  } else {
    phoneValidation.value.whatsapp = {isValid: false, message: ''};
  }
}

// Watch mobile field changes to sync WhatsApp
watch([() => contactForm.value.mobile, () => mobileCountryCode.value], ([newMobile, newCode]) => {
  if (whatsappSameAsMobile.value && newMobile) {
    contactForm.value.whatsapp = newMobile;
    whatsappCountryCode.value = newCode;
    phoneValidation.value.whatsapp = phoneValidation.value.mobile;
  }
});

async function checkMobileDuplicate() {
  // Clear previous timeout
  clearTimeout(mobileCheckTimeout);

  // First validate the phone number format
  const validation = validatePhone(contactForm.value.mobile, mobileCountryCode.value);

  if (!validation.isValid) {
    mobileExistsMessage.value = "";
    mobileExists.value = false;
    phoneValidation.value.mobile = {
      isValid: false,
      message: validation.error
    };
    return;
  }

  // Update validation state
  phoneValidation.value.mobile = {
    isValid: true,
    message: `✅ Valid ${validation.type || 'phone'} number`
  };

  // Debounce the API call
  mobileCheckTimeout = setTimeout(async () => {
    try {
      checkingMobile.value = true;
      mobileExistsMessage.value = "🔍 Checking availability...";

      // Use E.164 format for database check
      const res = await api.post("/dashboard/check-contact-mobile", {
        mobile: validation.e164,
        contactId: contactForm.value.id || null
      });

      if (res.data.exists) {
        mobileExists.value = true;
        mobileExistsMessage.value = "❌ This mobile number is already registered!";
      } else {
        mobileExists.value = false;
        mobileExistsMessage.value = "✅ Number available";
      }
    } catch (err) {
      mobileExists.value = false;
      mobileExistsMessage.value = "⚠️ Error validating number.";
      console.error("Mobile check error:", err);
    } finally {
      checkingMobile.value = false;
    }
  }, 500);
}


// Load Request History
async function loadRequestHistory() {
  try {
    historyLoading.value = true;
    historyError.value = '';

    const res = await api.get("/dashboard/request-history", {
      headers: {Authorization: `Bearer ${token}`}
    });

    requestHistory.value = res.data.requests || [];
  } catch (err) {
    console.error("❌ Error loading request history:", err);
    historyError.value = err.response?.data?.message || "Failed to load request history.";
  } finally {
    historyLoading.value = false;
  }
}

// Filter history by status
function filteredHistory(status) {
  if (status === 'all') return requestHistory.value;
  return requestHistory.value.filter(req => req.status === status);
}


const displayedHistory = computed(() => {
  if (historyFilter.value === 'all') {
    return requestHistory.value;
  }
  return requestHistory.value.filter(req => req.status === historyFilter.value);
});

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}

// Watch for settings modal opening and load history when switching to history tab
watch(activeSetting, (newVal) => {
  if (newVal === 'history' && requestHistory.value.length === 0) {
    loadRequestHistory();
  }
});

// Settings Quantity Control Functions
function incrementSettingsCompanies() {
  if (settingsRequestForm.value.companies < 100) {
    settingsRequestForm.value.companies++;
  }
}

function decrementSettingsCompanies() {
  if (settingsRequestForm.value.companies > 0) {
    settingsRequestForm.value.companies--;
  }
}

function incrementSettingsContacts() {
  if (settingsRequestForm.value.contacts < 500) {
    settingsRequestForm.value.contacts++;
  }
}

function decrementSettingsContacts() {
  if (settingsRequestForm.value.contacts > 0) {
    settingsRequestForm.value.contacts--;
  }
}

// Submit Settings Request Function
async function submitSettingsRequest() {
  if (settingsRequestForm.value.companies === 0 && settingsRequestForm.value.contacts === 0) {
    settingsRequestMessage.value = "Please request at least one company or contact.";
    settingsRequestSuccess.value = false;
    return;
  }

  try {
    settingsRequestLoading.value = true;
    settingsRequestMessage.value = '';

    const res = await api.post(
        "/dashboard/request-limits",
        {
          companies: settingsRequestForm.value.companies,
          contacts: settingsRequestForm.value.contacts,
          reason: settingsRequestForm.value.reason
        },
        {
          headers: {Authorization: `Bearer ${token}`}
        }
    );

    settingsRequestSuccess.value = true;
    settingsRequestMessage.value = res.data.message || "Request submitted successfully! admin will review your request.";

    // Reset form after 3 seconds
    setTimeout(() => {
      settingsRequestForm.value = {companies: 0, contacts: 0, reason: ''};
      settingsRequestMessage.value = '';
    }, 3000);

  } catch (err) {
    settingsRequestSuccess.value = false;
    settingsRequestMessage.value = err.response?.data?.message || "Error submitting request.";
  } finally {
    settingsRequestLoading.value = false;
  }
}

const filteredCompanies = computed(() => {
  if (!searchQuery.value.trim()) return userCompanies.value;

  const q = searchQuery.value.toLowerCase();

  return userCompanies.value.filter(c =>
      (c.companyName?.toLowerCase().includes(q)) ||
      (c.email?.toLowerCase().includes(q)) ||
      (c.website?.toLowerCase().includes(q)) ||
      (c.view360?.toLowerCase().includes(q)) ||
      (c.googleLocation?.toLowerCase().includes(q)) ||
      (c.googleReviews?.toLowerCase().includes(q)) ||
      (c.tripAdvisor?.toLowerCase().includes(q)) ||
      (c.status?.toLowerCase().includes(q)) ||
      String(c.id).includes(q)
  );
});

// Quantity Control Functions
function incrementCompanies() {
  if (requestForm.value.companies < 100) {
    requestForm.value.companies++;
  }
}

function decrementCompanies() {
  if (requestForm.value.companies > 0) {
    requestForm.value.companies--;
  }
}

function incrementContacts() {
  if (requestForm.value.contacts < 500) {
    requestForm.value.contacts++;
  }
}

function decrementContacts() {
  if (requestForm.value.contacts > 0) {
    requestForm.value.contacts--;
  }
}

// Submit Request Function
async function submitRequest() {
  if (requestForm.value.companies === 0 && requestForm.value.contacts === 0) {
    requestMessage.value = "Please request at least one company or contact.";
    requestSuccess.value = false;
    return;
  }

  try {
    requestLoading.value = true;
    requestMessage.value = '';

    const res = await api.post(
        "/dashboard/request-limits",
        {
          companies: requestForm.value.companies,
          contacts: requestForm.value.contacts,
          reason: requestForm.value.reason
        },
        {
          headers: {Authorization: `Bearer ${token}`}
        }
    );

    requestSuccess.value = true;
    requestMessage.value = res.data.message || "Request submitted successfully! admin will review your request.";

    // Reset form after 2 seconds
    setTimeout(() => {
      showRequestModal.value = false;
      requestForm.value = {companies: 0, contacts: 0, reason: ''};
      requestMessage.value = '';
    }, 2000);

  } catch (err) {
    requestSuccess.value = false;
    requestMessage.value = err.response?.data?.message || "Error submitting request.";
  } finally {
    requestLoading.value = false;
  }
}

const paginatedCompanies = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredCompanies.value.slice(start, start + itemsPerPage.value);
});

const totalPages = computed(() =>
    Math.ceil(filteredCompanies.value.length / itemsPerPage.value)
);

const filteredContacts = computed(() => {
  if (!contactSearch.value.trim()) return contacts.value;

  const q = contactSearch.value.toLowerCase();

  return contacts.value.filter(c =>
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
      c.mobile?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.designation?.toLowerCase().includes(q) ||
      c.status?.toLowerCase().includes(q) ||
      c.Company?.companyName?.toLowerCase().includes(q)
  );
});

const paginatedContacts = computed(() => {
  const start = (contactPage.value - 1) * contactPerPage.value;
  return filteredContacts.value.slice(start, start + contactPerPage.value);
});

const contactTotalPages = computed(() =>
    Math.ceil(filteredContacts.value.length / contactPerPage.value)
);


// 🟢 Edit company
// Update the editCompany function to include address fields:
function editCompany(selectedCompany) {
  // Reset form with company data
  companyForm.value = {
    id: selectedCompany.id,
    companyName: selectedCompany.companyName,
    website: selectedCompany.website,
    displayUrl: selectedCompany.displayUrl,
    email: selectedCompany.email,
    bio: selectedCompany.bio,
    view360: selectedCompany.view360,
    googleLocation: selectedCompany.googleLocation,
    googleReviews: selectedCompany.googleReviews,
    status: selectedCompany.status,
    logo: null,
    // NEW ADDRESS FIELDS
    country: selectedCompany.country || "",
    streetAddress: selectedCompany.streetAddress || "",
    streetAddressLine2: selectedCompany.streetAddressLine2 || "",
    city: selectedCompany.city || "",
    postalCode: selectedCompany.postalCode || "",
    poBox: selectedCompany.poBox || "",
    label: selectedCompany.label || "",
    tripAdvisor: selectedCompany.tripAdvisor || "",
    files: selectedCompany.files || [] // ✅ ADD THIS
  };

  // Set logo preview if exists
  if (selectedCompany.logo) {
    logoPreview.value = `${VITE_IMAGE_UPLOAD_URL}${selectedCompany.logo}`;
    logoFileName.value = selectedCompany.logo.split('/').pop();
    companyForm.value.existingLogoPath = selectedCompany.logo;
  } else {
    logoPreview.value = null;
    logoFileName.value = '';
    companyForm.value.existingLogoPath = null;
  }

  // Load social links into checkboxes
  const socialLinks = selectedCompany.socialLinks || {};

  // Reset and populate main social media
  mainSocialMedia.value.forEach(social => {
    if (socialLinks[social.name]) {
      social.enabled = true;
      social.url = socialLinks[social.name];
    } else {
      social.enabled = false;
      social.url = '';
    }
  });

  // Reset custom social media
  customSocialMedia.value = [];

  // Add custom social links (those not in mainSocialMedia)
  const mainSocialNames = mainSocialMedia.value.map(s => s.name);
  Object.entries(socialLinks).forEach(([name, url]) => {
    if (!mainSocialNames.includes(name)) {
      customSocialMedia.value.push({
        name: name,
        url: url,
        enabled: true
      });
    }
  });

  showCompanyForm.value = true;
}


// 🟢 Delete company
async function deleteCompany(companyId) {
  if (!confirm("Are you sure you want to delete this company?")) return;

  try {
    await api.delete(`/dashboard/company/${companyId}`, {
      headers: {Authorization: `Bearer ${token}`},
    });
    alert("✅ Company deleted successfully!");
    loadData();
  } catch (err) {
    alert("❌ Failed to delete company: " + (err.response?.data?.message || err.message));
  }
}

// 🟢 Edit contact
// Update editContact function to remove address fields handling:
function editContact(contact) {
  // Extract just the number part (remove country code) for display
  const extractNumber = (fullNumber) => {
    if (!fullNumber) return '';
    try {
      const phoneNumber = parsePhoneNumber(fullNumber);
      return phoneNumber.nationalNumber;
    } catch {
      return fullNumber.replace(/\D/g, '');
    }
  };

  if (contact.photo) {
    photoPreview.value = `${VITE_IMAGE_UPLOAD_URL}${contact.photo}`;
    photoFileName.value = contact.photo.split('/').pop();
    contactForm.value.existingPhotoPath = contact.photo;
  } else {
    photoPreview.value = null;
    photoFileName.value = '';
    contactForm.value.existingPhotoPath = null;
  }

  contactForm.value = {
    id: contact.id,
    firstName: contact.firstName,
    lastName: contact.lastName,
    telephone: extractNumber(contact.telephone),
    mobile: extractNumber(contact.mobile),
    whatsapp: extractNumber(contact.whatsapp || contact.mobile), // ADD THIS
    email: contact.email,
    designation: contact.designation,
    companyId: contact.companyId,
    status: contact.status,
    photo: null,
    // ADDRESS FIELDS REMOVED
  };

  // Extract country codes
  try {
    if (contact.mobile) {
      const mobilePhone = parsePhoneNumber(contact.mobile);
      mobileCountryCode.value = `+${mobilePhone.countryCallingCode}`;
    }
    if (contact.telephone) {
      const telPhone = parsePhoneNumber(contact.telephone);
      telephoneCountryCode.value = `+${telPhone.countryCallingCode}`;
    }
    // ADD THIS
    if (contact.whatsapp) {
      const whatsappPhone = parsePhoneNumber(contact.whatsapp);
      whatsappCountryCode.value = `+${whatsappPhone.countryCallingCode}`;
      whatsappSameAsMobile.value = contact.whatsapp === contact.mobile;
    } else {
      whatsappSameAsMobile.value = true;
      whatsappCountryCode.value = mobileCountryCode.value;
    }
  } catch (err) {
    console.error("Error parsing phone numbers:", err);
  }

  showContactForm.value = true;
}

// 🟢 Delete contact
async function deleteContact(contactId) {
  if (!confirm("Are you sure you want to delete this contact?")) return;

  try {
    await api.delete(`/dashboard/contact/${contactId}`, {
      headers: {Authorization: `Bearer ${token}`},
    });
    alert("✅ Contact deleted successfully!");
    loadData();
  } catch (err) {
    alert("❌ Failed to delete contact: " + (err.response?.data?.message || err.message));
  }
}


// ✅ Fetch user's phone (from API or localStorage)
onMounted(() => {
  const userData = JSON.parse(localStorage.getItem("user"));
  if (userData && userData.phone) {
    userPhone.value = userData.phone;
  }
});

async function loadUserCompanies() {
  try {
    const res = await api.get('/dashboard/companies', {
      headers: {Authorization: `Bearer ${token}`},
    });

    userCompanies.value = res.data || [];
  } catch (err) {
    console.error("❌ Failed to load companies:", err);
    userCompanies.value = [];
  }
}

onMounted(() => {
  loadUserCompanies();
});


function logout() {
  if (confirm("Are you sure you want to log out?")) {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // optional: clear stored user
    router.push("/login");
  }
}

function openSettings() {
  showSettings.value = true;
}

onMounted(async () => {
  try {
    const res = await api.get("/auth/me", {
      headers: {Authorization: `Bearer ${token}`},
    });

    if (!res.data.phone || res.data.phone === "") {
      showPhonePopup.value = true; // Force popup
    }
  } catch (err) {
    console.error("Error checking phone:", err);
  }
});

async function submitPhone() {
  const validation = validatePhone(phoneNumber.value, countryCode.value);

  if (!validation.isValid) {
    errorMsg.value = validation.error || "Please enter a valid phone number.";
    return;
  }

  try {
    loading.value = true;
    errorMsg.value = "";

    const res = await api.post(
        "/settings/add-phone",
        {
          phone: validation.e164 // Send in E.164 format
        },
        {
          headers: {Authorization: `Bearer ${token}`},
        }
    );

    alert(res.data.message || "Phone number saved!");
    showPhonePopup.value = false;
    loadData();
  } catch (err) {
    errorMsg.value = err.response?.data?.message || "Failed to save phone number.";
  } finally {
    loading.value = false;
  }
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

function handleLogoUpload(event) {
  const file = event.target.files[0];
  if (file) {
    logoFileName.value = file.name;

    // Create temporary URL for cropper
    const reader = new FileReader();
    reader.onload = (e) => {
      tempLogoSrc.value = e.target.result;
      showLogoCropper.value = true; // ← THIS WAS MISSING
    };
    reader.readAsDataURL(file);
  }
}

function handleLogoCropped(blob) {
  // Convert blob to file
  const file = new File([blob], logoFileName.value || 'logo.jpg', {type: 'image/jpeg'});
  companyForm.value.logo = file;

  // Create preview
  const reader = new FileReader();
  reader.onload = (e) => {
    logoPreview.value = e.target.result;
  };
  reader.readAsDataURL(blob);

  showLogoCropper.value = false;
}

function removeLogo() {
  companyForm.value.logo = null;
  companyForm.value.existingLogoPath = null;
  logoPreview.value = null;
  logoFileName.value = '';

  // Clear file input
  const fileInput = document.getElementById('logo-upload');
  if (fileInput) {
    fileInput.value = '';
  }
}

function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (file) {
    photoFileName.value = file.name;

    // Create temporary URL for cropper
    const reader = new FileReader();
    reader.onload = (e) => {
      tempPhotoSrc.value = e.target.result;
      showPhotoCropper.value = true;
    };
    reader.readAsDataURL(file);
  }
}

function handlePhotoCropped(blob) {
  // Convert blob to file
  const file = new File([blob], photoFileName.value || 'photo.jpg', {type: 'image/jpeg'});
  contactForm.value.photo = file;

  // Create preview
  const reader = new FileReader();
  reader.onload = (e) => {
    photoPreview.value = e.target.result;
  };
  reader.readAsDataURL(blob);

  showPhotoCropper.value = false;
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
    const res = await api.get("/dashboard/data", {
      headers: {Authorization: `Bearer ${token}`},
    });

    // ✅ Handle single company from backend
    userCompanies.value = res.data.companies || [];
    contacts.value = res.data.contacts || [];

    // ✅ Update counts
    companyCount.value = userCompanies.value.length;
    contactCount.value = contacts.value.length;

    // ✅ Fetch user info
    const userRes = await api.get("/auth/me", {
      headers: {Authorization: `Bearer ${token}`},
    });

    const userData = userRes.data;
    user.value.email = userData.email || "";
    user.value.phone = userData.phone || "";
    userLimits.value.companyLimit = userData.companyLimit;
    userLimits.value.contactLimit = userData.contactLimit;
    userLimits.value.role = userData.role;

    await loadReviews();

    console.log("✅ Dashboard data loaded successfully.");
  } catch (err) {
    console.error("❌ Load dashboard error:", err);
    alert("Error loading dashboard data. Please refresh or log in again.");
  }
}

// Contact Form Mobile (with duplicate check)
function handleContactMobile(event) {
  const value = event.target.value.replace(/\D/g, '');
  contactForm.value.mobile = value;

  if (value.length > 0) {
    checkMobileDuplicate();
  } else {
    phoneValidation.value.mobile = {isValid: false, message: ''};
    mobileExistsMessage.value = '';
    mobileExists.value = false;
  }
}

// Update the saveCompany function to include address fields:
async function saveCompany() {
  try {
    // Validate required fields
    if (!companyForm.value.companyName || !companyForm.value.email || !companyForm.value.website) {
      alert('Please fill in all required fields');
      return;
    }

    // For new company, logo is required
    if (!companyForm.value.id && !companyForm.value.logo) {
      alert('Please upload a company logo');
      return;
    }

    const formData = new FormData();

    // Add all text fields
    formData.append('companyName', companyForm.value.companyName);
    formData.append('website', companyForm.value.website);
    formData.append('displayUrl', companyForm.value.displayUrl || '');
    formData.append('email', companyForm.value.email);
    formData.append('bio', companyForm.value.bio || '');
    formData.append('view360', companyForm.value.view360 || '');
    formData.append('googleLocation', companyForm.value.googleLocation || '');
    formData.append('googleReviews', companyForm.value.googleReviews || '');
    formData.append('tripAdvisor', companyForm.value.tripAdvisor || '');
    formData.append('status', companyForm.value.status || 'active');

    // Add address fields
    formData.append('country', companyForm.value.country || '');
    formData.append('streetAddress', companyForm.value.streetAddress || '');
    formData.append('streetAddressLine2', companyForm.value.streetAddressLine2 || '');
    formData.append('city', companyForm.value.city || '');
    formData.append('postalCode', companyForm.value.postalCode || '');
    formData.append('poBox', companyForm.value.poBox || '');
    formData.append('label', companyForm.value.label || '');

    // Build socialLinks object
    const socialLinks = {};
    mainSocialMedia.value.forEach(social => {
      if (social.enabled && social.url && social.url.trim()) {
        socialLinks[social.name] = social.url.trim();
      }
    });
    customSocialMedia.value.forEach(custom => {
      if (custom.enabled && custom.name && custom.url && custom.name.trim() && custom.url.trim()) {
        socialLinks[custom.name.trim()] = custom.url.trim();
      }
    });
    formData.append('socialLinks', JSON.stringify(socialLinks));

    // Handle logo
    if (companyForm.value.logo instanceof File) {
      formData.append('logo', companyForm.value.logo);
    } else if (companyForm.value.existingLogoPath) {
      formData.append('existingLogo', companyForm.value.existingLogoPath);
    }

    // ✅ FIXED: Handle files with correct format
    const existingFiles = [];

    if (companyForm.value.files && companyForm.value.files.length > 0) {
      companyForm.value.files.forEach((fileObj) => {
        if (fileObj.isNew && fileObj.file instanceof File) {
          // New file to upload
          formData.append('files', fileObj.file);

          // ✅ Send each file's metadata as a separate JSON string
          formData.append('fileTypes', JSON.stringify({
            isBrochure: fileObj.isBrochure,
            isMenu: fileObj.isMenu,
            name: fileObj.name
          }));
        } else if (!fileObj.isNew) {
          // Existing file to keep
          existingFiles.push({
            path: fileObj.path,
            name: fileObj.name,
            isBrochure: fileObj.isBrochure,
            isMenu: fileObj.isMenu
          });
        }
      });
    }

    // Send existing files as JSON
    if (existingFiles.length > 0) {
      formData.append('existingFiles', JSON.stringify(existingFiles));
    }

    // Determine URL and method
    const isUpdate = !!companyForm.value.id;
    const url = isUpdate
        ? `${API_BASE_URL}/api/dashboard/company/${companyForm.value.id}`
        : `${API_BASE_URL}/api/dashboard/company`;
    const method = isUpdate ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const textResponse = await response.text();
      console.error('Server returned non-JSON response:', textResponse);
      alert('Server error: Expected JSON response but got HTML. Check the console for details.');
      return;
    }

    const data = await response.json();

    if (response.ok) {
      alert(isUpdate ? 'Company updated successfully!' : 'Company created successfully!');

      // Reset form
      showCompanyForm.value = false;
      companyForm.value = {
        companyName: '',
        website: '',
        displayUrl: '',
        email: '',
        bio: '',
        logo: null,
        view360: '',
        googleLocation: '',
        googleReviews: '',
        tripAdvisor: '',
        status: 'active',
        existingLogoPath: null,
        country: '',
        streetAddress: '',
        streetAddressLine2: '',
        city: '',
        postalCode: '',
        poBox: '',
        label: '',
        files: []
      };
      logoPreview.value = null;
      logoFileName.value = '';
      pendingFile.value = null;
      pendingFileName.value = '';

      // Reset social media
      mainSocialMedia.value.forEach(social => {
        social.enabled = false;
        social.url = '';
      });
      customSocialMedia.value = [];

      await loadData();
    } else {
      console.error('Server error:', data);
      alert('Error: ' + (data.message || 'Failed to save company'));
    }
  } catch (err) {
    console.error('Error saving company:', err);
    alert('Failed to save company: ' + err.message);
  }
}

async function saveContact() {
  try {
    // Validate mobile (required)
    const mobileValidation = validatePhone(contactForm.value.mobile, mobileCountryCode.value);
    if (!mobileValidation.isValid) {
      alert(`Mobile number error: ${mobileValidation.error}`);
      return;
    }

    // Check if mobile exists
    if (mobileExists.value) {
      alert("❌ This mobile number is already registered.");
      return;
    }

    // Validate telephone (optional, but if provided must be valid)
    let telephoneE164 = null;
    if (contactForm.value.telephone) {
      const telValidation = validatePhone(contactForm.value.telephone, telephoneCountryCode.value);
      if (!telValidation.isValid) {
        alert(`Telephone number error: ${telValidation.error}`);
        return;
      }
      telephoneE164 = telValidation.e164;
    }

    // Validate WhatsApp if different from mobile
    let whatsappE164 = mobileValidation.e164; // Default to mobile
    if (!whatsappSameAsMobile.value && contactForm.value.whatsapp) {
      const whatsappValidation = validatePhone(contactForm.value.whatsapp, whatsappCountryCode.value);
      if (!whatsappValidation.isValid) {
        alert(`WhatsApp number error: ${whatsappValidation.error}`);
        return;
      }
      whatsappE164 = whatsappValidation.e164;
    }

    const formData = new FormData();

    // ✅ FIXED: Handle special fields explicitly, then add others
    Object.keys(contactForm.value).forEach(key => {
      if (key === "photo" && contactForm.value[key]) {
        formData.append("photo", contactForm.value[key]);
      } else if (key === "mobile") {
        formData.append("mobile", mobileValidation.e164);
      } else if (key === "whatsapp") {
        formData.append("whatsapp", whatsappE164);
      } else if (key === "telephone") {
        if (telephoneE164) {
          formData.append("telephone", telephoneE164);
        }
      } else if (key !== "photo") {
        // Add all other fields except photo (already handled)
        formData.append(key, contactForm.value[key]);
      }
    });

    const endpoint = contactForm.value.id
        ? `/dashboard/contact/${contactForm.value.id}`
        : "/dashboard/contact";
    const method = contactForm.value.id ? "put" : "post";

    const res = await api[method](endpoint, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    alert(res.data.message);
    showContactForm.value = false;
    loadData();

    // Reset form and validation states
    contactForm.value = {
      firstName: "",
      lastName: "",
      telephone: "",
      mobile: "",
      whatsapp: "", // ✅ ADD THIS
      email: "",
      designation: "",
      companyId: "",
      photo: null,
      status: "active",
    };
    mobileExistsMessage.value = "";
    mobileExists.value = false;
    whatsappSameAsMobile.value = true; // ✅ ADD THIS
    phoneValidation.value.telephone = {isValid: false, message: ''};
    phoneValidation.value.mobile = {isValid: false, message: ''};
    phoneValidation.value.whatsapp = {isValid: false, message: ''}; // ✅ ADD THIS

  } catch (err) {
    alert("Error saving contact: " + (err.response?.data?.message || err.message));
  }
}

onMounted(loadData);


</script>


<style scoped>
/* File Upload Section Styles */
.file-upload-section {
  margin-top: 1rem;
}

.uploaded-files-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.uploaded-file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  transition: all 0.2s;
}

.uploaded-file-item:hover {
  background: #e9ecef;
  border-color: #dee2e6;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.file-info svg {
  flex-shrink: 0;
  color: #6c757d;
}

.file-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.file-name {
  font-weight: 500;
  color: #212529;
  font-size: 0.95rem;
}

.file-badges {
  display: flex;
  gap: 0.5rem;
}

.file-badge {
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.file-badge.brochure {
  background: #e3f2fd;
  color: #1976d2;
}

.file-badge.menu {
  background: #fff3e0;
  color: #f57c00;
}

.btn-remove-file {
  padding: 0.5rem;
  background: #fff;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-remove-file:hover {
  background: #f8d7da;
  border-color: #f5c6cb;
  color: #721c24;
}

.file-type-selection {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border: 1px dashed #ced4da;
  border-radius: 8px;
}

.selection-label {
  font-weight: 500;
  margin-bottom: 0.75rem;
  color: #495057;
}

.file-type-checkboxes {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.file-type-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.file-type-checkbox .checkbox-input {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.file-type-checkbox .checkbox-label {
  font-size: 0.95rem;
  cursor: pointer;
  user-select: none;
}

.btn-add-file {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-add-file:hover:not(:disabled) {
  background: #0056b3;
  transform: translateY(-1px);
}

.btn-add-file:disabled {
  background: #6c757d;
  cursor: not-allowed;
  opacity: 0.6;
}

/* URL Preview Container */
.url-preview-container {
  margin-top: 12px;
  padding: 12px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 2px solid #bae6fd;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.url-preview-container:hover {
  border-color: #7dd3fc;
  box-shadow: 0 4px 12px rgba(56, 189, 248, 0.15);
}

/* URL Label */
.url-preview-label {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #0369a1;
}

.url-preview-label svg {
  color: #0284c7;
}

/* URL Preview Box */
.url-preview-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #e0f2fe;
}

/* URL Input (readonly) */
.url-preview-input {
  flex: 1;
  border: none;
  background: transparent;
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  color: #0c4a6e;
  padding: 4px 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.url-preview-input:hover {
  background: #f0f9ff;
  border-radius: 6px;
}

.url-preview-input:focus {
  outline: none;
  background: #f0f9ff;
  border-radius: 6px;
}

/* Copy Button */
.url-copy-btn {
  padding: 6px 10px;
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.url-copy-btn:hover {
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
}

.url-copy-btn:active {
  transform: translateY(0);
}

/* Open in New Tab Button */
.url-open-btn {
  padding: 6px 10px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

.url-open-btn:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.url-open-btn:active {
  transform: translateY(0);
}

/* Responsive Design */
@media (max-width: 640px) {
  .url-preview-input {
    font-size: 0.8rem;
  }

  .url-preview-box {
    flex-wrap: wrap;
  }

  .url-copy-btn,
  .url-open-btn {
    padding: 6px 8px;
  }
}

.header-logo {
  height: 50px;
  width: auto;
  object-fit: contain;
}

/* In your <style> section */
.bio-textarea {
  white-space: pre-wrap; /* Preserves line breaks and spaces */
  font-family: inherit;
  resize: vertical;
  min-height: 120px;
}

.field-hint {
  font-size: 0.8rem;
  color: #64748b;
  margin-top: 4px;
}

/* For displaying bio in read mode (if you show it anywhere) */
.company-bio-display {
  white-space: pre-wrap;
  line-height: 1.6;
}

/* Theme Section */
.theme-section {
  padding: 0;
}

.theme-header {
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px 16px 0 0;
}

.theme-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.theme-subtitle {
  font-size: 1rem;
  opacity: 0.95;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.plan-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.plan-badge.free {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.plan-badge.premium {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #333;
}

/* Themes Loading */
.themes-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
}

.themes-loading p {
  color: #64748b;
  font-size: 0.95rem;
}

/* Theme Grid */
.theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
}

/* Theme Card */
.theme-card {
  position: relative;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
}

.theme-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.theme-card.active {
  border: 3px solid #667eea;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.theme-card.disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.theme-card.disabled:hover {
  transform: none;
}

/* Premium Overlay */
.premium-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  z-index: 10;
  color: white;
}

.premium-lock-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upgrade-text {
  font-size: 0.95rem;
  font-weight: 600;
}

/* Theme Preview Wrapper */
.theme-preview-wrapper {
  position: relative;
  height: 420px;
  background: #f8fafc;
  overflow: hidden;
}

/* Badges */
.active-badge,
.premium-badge {
  position: absolute;
  top: 12px;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  z-index: 5;
}

.active-badge {
  right: 12px;
  background: #10b981;
  color: white;
}

.premium-badge {
  left: 12px;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #333;
}

/* Theme Info */
.theme-info {
  padding: 1.25rem;
  border-top: 1px solid #e2e8f0;
}

.theme-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.theme-description {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.theme-confirm-modal {
  background: white;
  border-radius: 20px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.confirm-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.confirm-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s;
}

.btn-close:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.confirm-body {
  padding: 1.5rem;
}

.confirm-preview-large {
  height: 600px;
  background: #f8fafc;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.confirm-content h4 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.confirm-content p {
  color: #64748b;
  margin: 0 0 1rem 0;
}

.premium-notice {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  border-radius: 8px;
  color: #333;
  font-weight: 600;
  font-size: 0.875rem;
}

.confirm-actions {
  display: flex;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.btn-cancel,
.btn-confirm {
  flex: 1;
  padding: 0.875rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-cancel {
  background: #f1f5f9;
  color: #64748b;
  border: none;
}

.btn-cancel:hover {
  background: #e2e8f0;
}

.btn-confirm {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}

.btn-confirm:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
}

.btn-confirm:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Spinner */
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
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

.modal-enter-active .theme-confirm-modal,
.modal-leave-active .theme-confirm-modal {
  transition: transform 0.3s ease;
}

.modal-enter-from .theme-confirm-modal,
.modal-leave-to .theme-confirm-modal {
  transform: scale(0.9);
}

* {
  box-sizing: border-box;
}

.section-heading {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 1rem 0 0.5rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #3498db;
}

.full-width {
  grid-column: 1 / -1;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.table-controls {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
}

.search-input {
  width: 240px;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.pagination {
  margin-top: 15px;
  display: flex;
  gap: 8px;
  justify-content: center;
}

.page-btn {
  padding: 6px 12px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
  border-radius: 4px;
}

.page-btn.active {
  background: #1a472a;
  color: white;
  border-color: #1a472a;
}

.pagination button[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}


.logo-thumb {
  width: 45px;
  height: 45px;
  object-fit: contain;
  border-radius: 8px;
  background: #f3f3f3;
  padding: 4px;
  border: 1px solid #ddd;
}

.photo-thumb {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #ddd;
}


.dashboard-wrapper {
  min-height: 98vh;
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

.link-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background: white;
  color: #1a472a;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.link-btn:hover {
  background: #1a472a;
  color: white;
  border-color: #1a472a;
}

/* Popup Overlay */
.link-popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.btn-action {
  background: none;
  border: none;
  cursor: pointer;
  margin: 0 4px;
  font-size: 14px;
  transition: 0.2s;
}

.btn-action.edit:hover {
  color: #007bff;
}

.btn-action.delete:hover {
  color: #dc3545;
}


/* Popup Box */
.link-popup-container {
  background: #fff;
  border-radius: 14px;
  width: 90%;
  max-width: 420px;
  padding: 24px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  position: relative;
  animation: fadeIn 0.3s ease;
}

/* Header */
.link-popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.link-popup-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1a472a;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #333;
  transition: transform 0.2s ease;
}

.close-btn:hover {
  transform: rotate(90deg);
}

/* Body */
.link-popup-body {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}

.link-display {
  flex: 1;
  border: 2px solid #e0e0e0;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #333;
  background: #fafafa;
}

.copy-btn {
  background: #1a472a;
  border: none;
  color: white;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.copy-btn:hover {
  background: #c5663a;
}

.copy-message {
  margin-top: 12px;
  text-align: center;
  color: #1a472a;
  font-weight: 600;
  font-size: 0.9rem;
}

@keyframes fadeIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.tabs-container {
  display: flex;
  justify-content: space-between; /* left group + right button */
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
}

.tab-buttons {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Ensure tab buttons align properly */
.tab-button {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Style for the right button */
.link-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background: white;
  color: #1a472a;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.link-btn:hover {
  background: #1a472a;
  color: white;
  border-color: #1a472a;
}


/* Phone Popup Modal */
.phone-popup-overlay {
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

.phone-popup-container {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 480px;
  width: 100%;
  padding: 2rem;
  animation: modalSlideUp 0.3s ease-out;
  position: relative;
}

.phone-popup-header {
  margin-bottom: 1.5rem;
}

.phone-popup-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.5rem 0;
}

.phone-popup-description {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
  line-height: 1.6;
}

.phone-popup-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.phone-form-group {
  display: flex;
  flex-direction: column;
}

.phone-form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
  margin-bottom: 0.5rem;
}

.phone-form-select,
.phone-form-input {
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

.phone-form-select:focus,
.phone-form-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.phone-form-select {
  cursor: pointer;
}

.phone-form-input::placeholder {
  color: #94a3b8;
}

.phone-submit-btn {
  width: 100%;
  padding: 0.75rem 1.25rem;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
  margin-top: 0.5rem;
}

.phone-submit-btn:hover:not(:disabled) {
  background: #4338ca;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.phone-submit-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
  transform: none;
}

.phone-error-message {
  font-size: 0.875rem;
  color: #ef4444;
  text-align: center;
  margin-top: 1rem;
  padding: 0.75rem;
  background: #fee2e2;
  border-radius: 0.5rem;
  border: 1px solid #fecaca;
}

/* Responsive */
@media (max-width: 480px) {
  .phone-popup-container {
    padding: 1.5rem;
  }

  .phone-popup-title {
    font-size: 1.25rem;
  }

  .phone-popup-description {
    font-size: 0.8125rem;
  }
}

.phone-input-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
}

/* Country Dropdown Styles */
.country-dropdown-wrapper {
  position: relative;
  flex-shrink: 0;
}

.country-trigger {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 0.75rem;
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 100px;
  user-select: none;
}

.country-trigger:hover {
  border-color: #94a3b8;
  background: #f8fafc;
}

.selected-country {
  font-size: 0.875rem;
  font-weight: 500;
  color: #0f172a;
}

.dropdown-arrow {
  transition: transform 0.2s;
  color: #64748b;
  flex-shrink: 0;
}

.dropdown-arrow.rotate {
  transform: rotate(180deg);
}

.country-dropdown-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  width: 320px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
}

.search-box {
  position: relative;
  padding: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
}

.search-icon {
  position: absolute;
  left: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.5rem 0.75rem 0.5rem 2rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  outline: none;
  transition: all 0.2s;
}

.search-input:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.country-list {
  max-height: 280px;
  overflow-y: auto;
}

.country-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background 0.15s;
  border-bottom: 1px solid #f1f5f9;
}

.country-item:last-child {
  border-bottom: none;
}

.country-item:hover {
  background: #f8fafc;
}

.country-item.active {
  background: #eef2ff;
  border-left: 3px solid #4f46e5;
}

.country-flag {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.country-name {
  flex: 1;
  font-size: 0.875rem;
  color: #0f172a;
}

.country-code {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
  flex-shrink: 0;
}

.no-results {
  padding: 2rem 1rem;
  text-align: center;
  color: #94a3b8;
  font-size: 0.875rem;
}

.phone-number-input {
  flex: 1;
}

/* Dropdown transition */
.dropdown-slide-enter-active,
.dropdown-slide-leave-active {
  transition: all 0.2s ease;
}

.dropdown-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-slide-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

/* Scrollbar styling */
.country-list::-webkit-scrollbar {
  width: 6px;
}

.country-list::-webkit-scrollbar-track {
  background: #f8fafc;
}

.country-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.country-list::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
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

/* Limit Banner */
.limit-banner {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-bottom: 2px solid #f59e0b;
  padding: 1rem 2rem;
}

.limit-banner-content {
  max-width: 1337px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.limit-banner-icon {
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f59e0b;
}

.limit-banner-text {
  flex: 1;
}

.limit-banner-text h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #92400e;
}

.limit-banner-text p {
  margin: 0;
  font-size: 0.875rem;
  color: #78350f;
}

.btn-request {
  padding: 0.625rem 1.5rem;
  background: white;
  color: #f59e0b;
  border: 2px solid #f59e0b;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-request:hover {
  background: #f59e0b;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

/* Request Modal */
.request-modal-container {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalSlideUp 0.3s ease-out;
}

.request-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.request-modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.request-modal-body {
  padding: 2rem;
}

/* Current Limits */
.current-limits {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
}

.current-limits h3 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
}

.limits-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.limit-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
}

.limit-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.limit-icon.company {
  background: #dbeafe;
  color: #1e40af;
}

.limit-icon.contact {
  background: #dcfce7;
  color: #166534;
}

.limit-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.limit-label {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
}

.limit-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
}

/* Request Form */
.request-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.request-form-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.request-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #0f172a;
}

/* Quantity Selector */
.quantity-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
}

.qty-btn {
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

.qty-btn:hover {
  background: #4f46e5;
  border-color: #4f46e5;
  color: white;
  transform: scale(1.05);
}

.qty-btn:active {
  transform: scale(0.95);
}

.qty-input {
  flex: 1;
  text-align: center;
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  background: transparent;
  border: none;
  outline: none;
  padding: 0.25rem;
}

.qty-input::-webkit-inner-spin-button,
.qty-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.request-textarea {
  width: 100%;
  padding: 0.75rem;
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-family: inherit;
  resize: vertical;
  transition: all 0.2s;
}

.request-textarea:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

/* Request Actions */
.request-actions {
  display: flex;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.btn-submit-request {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.btn-submit-request:hover:not(:disabled) {
  background: #4338ca;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.btn-submit-request:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
  transform: none;
}

.btn-cancel-request {
  padding: 0.75rem 1.5rem;
  background: white;
  color: #64748b;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.btn-cancel-request:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.request-message {
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
}

.request-message.success {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.request-message.error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

/* Responsive */
@media (max-width: 768px) {
  .limit-banner {
    padding: 1rem;
  }

  .limit-banner-content {
    flex-direction: column;
    text-align: center;
  }

  .btn-request {
    width: 100%;
  }

  .limits-grid {
    grid-template-columns: 1fr;
  }

  .request-modal-body {
    padding: 1.5rem;
  }

  .request-actions {
    flex-direction: column;
  }

  .btn-submit-request,
  .btn-cancel-request {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .request-modal-header {
    padding: 1rem 1.5rem;
  }

  .request-modal-title {
    font-size: 1.25rem;
  }

  .quantity-selector {
    padding: 0.5rem 0.75rem;
  }

  .qty-input {
    font-size: 1rem;
  }
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

/* Responsive adjustments for settings limits */
@media (max-width: 768px) {
  .settings-limit-card {
    flex-direction: column;
    text-align: center;
  }

  .settings-limit-progress {
    width: 100%;
    flex-direction: column;
  }

  .settings-progress-bar {
    width: 100%;
  }
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

/* No Filtered Results */
.no-filtered-results {
  padding: 2rem;
  text-align: center;
  color: #64748b;
  font-size: 0.875rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  border: 1px dashed #cbd5e1;
}

/* Responsive */
@media (max-width: 768px) {
  .history-filters {
    flex-direction: column;
  }

  .filter-btn {
    flex: auto;
  }

  .history-card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .request-details {
    grid-template-columns: 1fr;
  }

  .detail-item {
    padding: 0.75rem;
  }
}

@media (max-width: 480px) {
  .history-card-body {
    padding: 1rem;
  }

  .detail-value {
    font-size: 1rem;
  }
}

.dashboard-wrapper {
  background: linear-gradient(135deg, #fafaf8 0%, #f5f5f0 100%); /* Changed from purple gradient */
}

.user-avatar {
  background: #5c4033; /* Changed from #4f46e5 */
}

.link-btn {
  color: #5c4033; /* Changed */
}

.link-btn:hover {
  background: #5c4033; /* Changed */
}

.link-popup-title {
  color: #2d1f1a; /* Changed */
}

.copy-btn {
  background: #5c4033; /* Changed */
}

.copy-btn:hover {
  background: #3e2a23; /* Changed */
}

.copy-message {
  color: #5c4033; /* Changed */
}

.phone-submit-btn {
  background: #5c4033; /* Changed from #4f46e5 */
}

.phone-submit-btn:hover:not(:disabled) {
  background: #3e2a23; /* Changed from #4338ca */
  box-shadow: 0 4px 12px rgba(92, 64, 51, 0.3); /* Changed */
}

.country-trigger:hover {
  border-color: #9b8b7e; /* Changed */
}

.search-input:focus {
  border-color: #5c4033; /* Changed */
  box-shadow: 0 0 0 3px rgba(92, 64, 51, 0.1); /* Changed */
}

.country-item.active {
  background: #f5e6d3; /* Changed */
  border-left: 3px solid #5c4033; /* Changed */
}

.btn-settings {
  color: #5c4033; /* Changed */
}

.btn-settings:hover {
  border-color: #5c4033; /* Changed */
}

.form-input:focus {
  border-color: #5c4033; /* Changed */
  box-shadow: 0 0 0 3px rgba(92, 64, 51, 0.1); /* Changed */
}

.settings-nav-item.active {
  background: #5c4033; /* Changed */
}

.tab-button.active {
  color: #5c4033; /* Changed */
  background: #f5e6d3; /* Changed */
  border-bottom-color: #5c4033; /* Changed */
}

.btn-primary {
  background: #5c4033; /* Changed */
}

.btn-primary:hover {
  background: #3e2a23; /* Changed */
}

.link-button {
  color: #5c4033; /* Changed */
}

.link-button:hover {
  color: #3e2a23; /* Changed */
}

.btn-add-more {
  color: #5c4033; /* Changed */
  border: 1px solid #5c4033; /* Changed */
}

.btn-add-more:hover {
  background: #f5e6d3; /* Changed */
}

.link {
  color: #5c4033; /* Changed */
}

.upload-label:hover {
  border-color: #5c4033; /* Changed */
}

.checkbox-input {
  accent-color: #5c4033; /* Changed */
}

/* Theme Section Updates */
.theme-header {
  background: linear-gradient(135deg, #5c4033 0%, #3e2a23 100%); /* Changed */
}

.theme-card.active {
  border: 3px solid #5c4033; /* Changed */
  box-shadow: 0 8px 20px rgba(92, 64, 51, 0.3); /* Changed */
}

.spinner {
  border-top-color: #5c4033; /* Changed */
}

.btn-confirm {
  background: linear-gradient(135deg, #5c4033 0%, #3e2a23 100%); /* Changed */
}

.btn-confirm:hover:not(:disabled) {
  box-shadow: 0 8px 16px rgba(92, 64, 51, 0.3); /* Changed */
}

/* Limit Banner */
.limit-banner {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-bottom: 2px solid #d4af37; /* Changed to gold */
}

.limit-banner-icon {
  color: #d4af37; /* Gold accent */
}

.btn-request {
  color: #d4af37; /* Gold */
  border: 2px solid #d4af37;
}

.btn-request:hover {
  background: #d4af37;
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
}

/* Quantity Selector */
.qty-btn:hover {
  background: #5c4033; /* Changed */
  border-color: #5c4033;
}

.settings-qty-btn:hover {
  background: #5c4033; /* Changed */
  border-color: #5c4033;
}

.btn-submit-request {
  background: #5c4033; /* Changed */
}

.btn-submit-request:hover:not(:disabled) {
  background: #3e2a23; /* Changed */
  box-shadow: 0 4px 12px rgba(92, 64, 51, 0.3);
}

/* Settings Progress Bars */
.settings-progress-fill.company {
  background: linear-gradient(90deg, #5c4033 0%, #3e2a23 100%); /* Changed */
}

.settings-progress-fill.contact {
  background: linear-gradient(90deg, #6b5d57 0%, #5c4033 100%); /* Changed */
}

/* History Filters */
.filter-btn.active {
  color: #5c4033; /* Changed */
}

.btn-retry,
.btn-make-request {
  background: #5c4033; /* Changed */
}

.btn-retry:hover,
.btn-make-request:hover {
  background: #3e2a23; /* Changed */
}

/* Status Pills - Keep existing colors for clarity */
.status-pill.approved,
.status-badge.active {
  background: #dcfce7;
  color: #166534;
}

.status-pill.rejected,
.status-badge.inactive {
  background: #fee2e2;
  color: #991b1b;
}

.status-pill.pending {
  background: #fef3c7;
  color: #92400e;
}

/* Detail Icons */
.detail-icon.company,
.limit-icon.company,
.settings-limit-icon.company {
  background: #f5e6d3; /* Beige */
  color: #5c4033; /* Brown */
}

.detail-icon.contact,
.limit-icon.contact,
.settings-limit-icon.contact {
  background: #fafaf8; /* Light beige */
  color: #6b5d57; /* Medium brown */
}

/* Request Reason */
.request-reason {
  background: #fefce8;
  border: 1px solid #fef08a;
}

.reason-header {
  color: #92400e;
}

.reason-text {
  color: #78350f;
}

/* Premium Badge */
.premium-badge,
.plan-badge.premium {
  background: linear-gradient(135deg, #d4af37 0%, #f5e6d3 100%); /* Gold gradient */
  color: #2d1f1a;
}

/* Additional accent colors */
.limit-banner-text h3,
.limit-banner-text p {
  color: #78350f;
}

/* Header background stays white for contrast */
.dashboard-header {
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #e5e1dc; /* Updated border */
}

/* Modal backgrounds stay white */
.modal-container,
.request-modal-container,
.phone-popup-container,
.link-popup-container {
  background: white;
}

/* Borders update to beige tones */
.content-card,
.tabs-container,
.theme-card {
  border: 1px solid #e5e1dc; /* Updated border color */
}

.form-input {
  border: 1px solid #e5e1dc; /* Updated */
  background: #fafaf8; /* Light beige background */
}

.form-input:focus {
  background: white;
}

/* Table hover */
.data-table tbody tr:hover {
  background: #fafaf8; /* Light beige hover */
}

/* Settings sidebar */
.settings-sidebar {
  background: #fafaf8; /* Light beige */
  border-right: 1px solid #e5e1dc;
}

.settings-nav-item:hover {
  background: #f5f5f0; /* Lighter beige */
}

/* Upload area */
.upload-label {
  border: 2px dashed #e5e1dc;
  background: #fafaf8;
}

.upload-label:hover {
  background: white;
}

/* Custom social media items */
.custom-social-item {
  background: #fafaf8;
  border: 1px solid #e5e1dc;
}

/* Detail items */
.detail-item {
  background: #fafaf8;
  border: 1px solid #e5e1dc;
}

/* Current limits */
.current-limits {
  background: #fafaf8;
  border: 1px solid #e5e1dc;
}

/* History card backgrounds */
.history-card-header {
  background: #fafaf8;
  border-bottom: 1px solid #e5e1dc;
}

/* Quantity selectors */
.quantity-selector,
.settings-quantity-selector {
  background: #fafaf8;
  border: 2px solid #e5e1dc;
}

/* No results states */
.no-filtered-results,
.empty-state {
  background: #fafaf8;
  border: 1px dashed #e5e1dc;
}

/* Settings limits display */
.settings-limits-display {
  background: #fafaf8;
  border: 1px solid #e5e1dc;
}

/* Progress bar backgrounds */
.settings-progress-bar {
  background: #e5e1dc;
}

/* Filter tabs */
.history-filters {
  background: #fafaf8;
  border: 1px solid #e5e1dc;
}

.filter-btn:hover {
  background: white;
}

.filter-btn.active {
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

/* Quill Editor Styling */
.quill-editor {
  background: white;
  border-radius: 8px;
}

:deep(.ql-container) {
  min-height: 200px;
  font-size: 14px;
  font-family: inherit;
}

:deep(.ql-editor) {
  min-height: 200px;
}

:deep(.ql-toolbar) {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

:deep(.ql-container) {
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.qr-popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
}

.qr-popup {
  background: white;
  padding: 25px;
  border-radius: 12px;
  width: 330px;
  text-align: center;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.qr-container {
  margin: 20px 0;
}

.close-btn {
  position: absolute;
  top: 8px;
  right: 10px;
  border: none;
  background: none;
  font-size: 22px;
  cursor: pointer;
}

.qr-actions button {
  padding: 10px 15px;
  margin: 5px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

.btn-download {
  background: #3b82f6;
  color: white;
}

.btn-share {
  background: #10b981;
  color: white;
}
</style>
