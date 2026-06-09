<template>
  <div v-if="activeTab === 'company'" :class="['company-tab', { 'dark-mode': isDarkMode }]">

    <!-- ═══════════════════════════════════════════ LIST VIEW ═══════════════════════════════════════════ -->
    <div v-if="!showCompanyForm" class="list-view">

      <!-- Header Bar -->
      <div class="list-header">
        <div class="list-header-left">
          <h2 class="page-title">Companies</h2>
          <span class="company-count-pill">{{ userCompanies.length }} <span style="opacity:0.5">/</span> {{ userLimits.companyLimit }} companies</span>
        </div>
        <button
            v-if="companyCount < userLimits.companyLimit"
            class="add-btn"
            @click="openCompanyForm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          <span>Add Company</span>
        </button>
        <div v-else class="limit-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          Limit Reached
        </div>
      </div>

      <!-- Search -->
      <div class="search-bar" v-if="userCompanies.length > 0">
        <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
            type="text"
            v-model="searchQuery"
            placeholder="Search by name, email or website…"
            class="search-input"
        />
        <button v-if="searchQuery" @click="searchQuery = ''" class="search-clear" type="button">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <!-- Company Cards (mobile-first card grid) -->
      <div v-if="paginatedCompanies.length > 0" class="company-grid">
        <div
            v-for="(c, index) in paginatedCompanies"
            :key="c.id"
            class="company-card"
        >
          <!-- Card Top -->
          <div class="card-top">
            <div class="card-logo-wrap">
              <img
                  v-if="c.logo"
                  :src="`${VITE_IMAGE_UPLOAD_URL}${c.logo}`"
                  :alt="c.companyName"
                  class="card-logo"
              />
              <div v-else class="card-logo-placeholder">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="4" y="2" width="16" height="20" rx="2"/>
                  <path d="M9 22v-4h6v4"/>
                </svg>
              </div>
            </div>
            <div class="card-identity">
              <h3 class="card-company-name">{{ c.companyName }}</h3>
              <a :href="c.website" target="_blank" class="card-website">
                {{ c.displayUrl || c.website }}
              </a>
            </div>
            <span :class="['status-dot', c.status === 'active' ? 'active' : 'inactive']">
              {{ c.status }}
            </span>
          </div>

          <!-- Card Body -->
          <div class="card-body">
            <div class="card-meta-row">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <span>{{ c.email }}</span>
            </div>
            <div class="card-links-row">
              <a v-if="c.view360" :href="c.view360" target="_blank" class="card-pill-link">
                360°
              </a>
              <a v-if="c.googleLocation" :href="c.googleLocation" target="_blank" class="card-pill-link">
                📍 Map
              </a>
              <a v-if="c.googleReviews" :href="c.googleReviews" target="_blank" class="card-pill-link">
                ⭐ Reviews
              </a>
            </div>
          </div>

          <!-- Card Actions -->
          <div class="card-actions">
            <button class="action-btn edit-btn" @click="editCompany(c)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5l4 4L7 21H3v-4z"/>
              </svg>
              Edit
            </button>
            <button class="action-btn delete-btn" @click="deleteCompany(c.id)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-2 14H7L5 6"/>
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="searchQuery" class="empty-state">
        <div class="empty-icon-wrap">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
        <p class="empty-title">No results for "{{ searchQuery }}"</p>
        <p class="empty-sub">Try a different search term</p>
        <button @click="searchQuery = ''" class="empty-action-btn">Clear search</button>
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon-wrap">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="4" y="2" width="16" height="20" rx="2"/>
            <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M8 10h.01"/>
          </svg>
        </div>
        <p class="empty-title">No companies yet</p>
        <p class="empty-sub">Add your first company to get started</p>
        <button @click="openCompanyForm" class="empty-action-btn" v-if="companyCount < userLimits.companyLimit">
          + Add Company
        </button>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination-bar">
        <button class="pag-btn arrow" @click="currentPage--" :disabled="currentPage === 1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <button
            v-for="page in totalPages"
            :key="page"
            @click="currentPage = page"
            :class="['pag-btn', { active: currentPage === page }]"
        >{{ page }}
        </button>
        <button class="pag-btn arrow" @click="currentPage++" :disabled="currentPage === totalPages">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════ FORM VIEW ═══════════════════════════════════════════ -->
    <div v-else class="form-view">

      <!-- Sticky Form Header -->
      <div class="form-topbar">
        <button @click="closeCompanyForm" class="back-btn" type="button">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          <span class="back-label">Back</span>
        </button>
        <h2 class="form-page-title">{{ companyForm.id ? 'Edit Company' : 'New Company' }}</h2>
        <div class="form-topbar-right">
          <button @click="saveCompany" class="save-btn-top" :disabled="saving" type="button">
            <svg v-if="!saving" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/>
              <polyline points="7 3 7 8 15 8"/>
            </svg>
            <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                 class="spin-icon">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            {{ saving ? 'Saving…' : 'Save' }}
          </button>
        </div>
      </div>

      <!-- Plan Banner -->
      <div v-if="userPlan" class="plan-banner" :class="userPlan">
        <div class="plan-info">
          <span class="plan-icon">{{ userPlan === 'free' ? '🔓' : userPlan === 'plus' ? '⚡' : '💎' }}</span>
          <span class="plan-name">{{ userPlan.charAt(0).toUpperCase() + userPlan.slice(1) }} Plan</span>
        </div>
        <span v-if="userPlan === 'free'" class="plan-note">2 social links · No brochures</span>
        <span v-else class="plan-note">All features unlocked</span>
      </div>

      <div class="form-body">

        <!-- ── SECTION: Basic Info ── -->
        <div class="form-section">
          <div class="section-label">
            <span class="section-number">01</span>
            <span class="section-title">Basic Information</span>
          </div>
          <div class="fields-grid">
            <div class="field-wrap">
              <label class="field-label">Company Name <span class="req">*</span></label>
              <input v-model="companyForm.companyName" type="text" class="field-input" placeholder="Acme Corporation"/>
            </div>
            <div class="field-wrap">
              <label class="field-label">Email <span class="req">*</span></label>
              <input v-model="companyForm.email" type="email" class="field-input" placeholder="hello@company.com"/>
            </div>
            <div class="field-wrap">
              <label class="field-label">Website <span class="req">*</span></label>
              <input v-model="companyForm.website" type="url" class="field-input" placeholder="https://company.com"/>
            </div>
            <div class="field-wrap">
              <label class="field-label">Display URL</label>
              <input v-model="companyForm.displayUrl" type="text" class="field-input" placeholder="company.com"/>
            </div>
            <div class="field-wrap">
              <label class="field-label">Status <span class="req">*</span></label>
              <div class="status-toggle-group">
                <button
                    type="button"
                    :class="['status-toggle-btn', { active: companyForm.status === 'active' }]"
                    @click="companyForm.status = 'active'"
                >
                  <span class="toggle-dot active-dot"></span> Active
                </button>
                <button
                    type="button"
                    :class="['status-toggle-btn', { active: companyForm.status === 'inactive' }]"
                    @click="companyForm.status = 'inactive'"
                >
                  <span class="toggle-dot inactive-dot"></span> Inactive
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ── SECTION: Logo ── -->
        <div class="form-section">
          <div class="section-label">
            <span class="section-number">02</span>
            <span class="section-title">Company Logo <span class="req">*</span></span>
          </div>
          <div class="logo-upload-area">
            <div v-if="logoPreview" class="logo-preview-wrap">
              <img :src="logoPreview" alt="Logo preview" class="logo-preview-img"/>
              <button @click="removeLogo" class="logo-remove-btn" type="button">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <label for="logo-upload" class="logo-dropzone">
              <input type="file" @change="handleLogoUpload" accept="image/*" id="logo-upload" class="hidden-file"/>
              <div class="dropzone-content">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <span class="dropzone-text">{{ logoPreview ? 'Change logo' : 'Upload logo' }}</span>
                <span class="dropzone-hint">PNG, JPG · Max 10MB (auto-compressed to 1MB)</span>
              </div>
            </label>
          </div>
        </div>

        <!-- ── SECTION: Online Presence ── -->
        <div class="form-section">
          <div class="section-label">
            <span class="section-number">03</span>
            <span class="section-title">Online Presence</span>
          </div>
          <div class="fields-grid">
            <div class="field-wrap">
              <label class="field-label">360° View Link</label>
              <div class="input-icon-wrap">
                <svg class="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 8v4l3 3"/>
                </svg>
                <input v-model="companyForm.view360" type="url" class="field-input icon-padded"
                       placeholder="https://..."/>
              </div>
            </div>
            <div class="field-wrap">
              <label class="field-label">Google Location</label>
              <div class="input-icon-wrap">
                <svg class="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <input v-model="companyForm.googleLocation" type="text" class="field-input icon-padded"
                       placeholder="Google Maps URL"/>
              </div>
            </div>
            <div class="field-wrap">
              <label class="field-label">Google Reviews</label>
              <div class="input-icon-wrap">
                <svg class="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     stroke-width="2">
                  <polygon
                      points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                <input v-model="companyForm.googleReviews" type="text" class="field-input icon-padded"
                       placeholder="Reviews URL"/>
              </div>
            </div>
            <div class="field-wrap">
              <label class="field-label">TripAdvisor</label>
              <div class="input-icon-wrap">
                <svg class="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                </svg>
                <input v-model="companyForm.tripAdvisor" type="text" class="field-input icon-padded"
                       placeholder="TripAdvisor URL"/>
              </div>
            </div>
          </div>
        </div>

        <!-- ── SECTION: Brochure / Links ── -->
        <div class="form-section">
          <div class="section-label">
            <span class="section-number">04</span>
            <span class="section-title">
              Links & Brochures
              <span v-if="isBrochureDisabled" class="lock-badge">🔒 Plus/Pro only</span>
            </span>
          </div>

          <div :class="['brochure-panel', { locked: isBrochureDisabled }]">
            <div v-if="isBrochureDisabled" class="lock-overlay">
              <div class="lock-card">
                <span class="lock-emoji">🔒</span>
                <p class="lock-title">Premium Feature</p>
                <p class="lock-desc">Upgrade to Plus or Pro to add brochures and menus.</p>
              </div>
            </div>

            <!-- Add link form -->
            <div class="link-form-row">
              <div class="link-fields">
                <input
                    v-model="pendingLinkUrl"
                    type="url"
                    class="field-input"
                    placeholder="https://example.com/brochure.pdf"
                    :disabled="isBrochureDisabled"
                />
                <input
                    v-model="pendingLinkName"
                    type="text"
                    class="field-input"
                    placeholder="Link name (e.g. 2024 Catalog)"
                    :disabled="isBrochureDisabled"
                />
              </div>
              <div class="link-type-chips">
                <label v-for="lt in linkTypes" :key="lt.key"
                       :class="['type-chip', { selected: pendingLinkType[lt.key] }]">
                  <input type="checkbox" v-model="pendingLinkType[lt.key]" :disabled="isBrochureDisabled"
                         class="hidden-check"/>
                  {{ lt.icon }} {{ lt.label }}
                </label>
              </div>
              <button type="button" @click="addLinkToList" class="add-link-btn" :disabled="isBrochureDisabled">
                + Add
              </button>
            </div>

            <!-- Added links list -->
            <div v-if="companyForm.files && companyForm.files.length > 0" class="link-list">
              <div v-for="(link, index) in companyForm.files" :key="index" class="link-item">
                <div class="link-item-info">
                  <span class="link-item-name">{{ link.name || 'Untitled' }}</span>
                  <span class="link-item-url">{{ link.url || link.path }}</span>
                  <div class="link-item-tags">
                    <span v-if="link.isBrochure" class="link-tag brochure">📄 Brochure</span>
                    <span v-if="link.isMenu" class="link-tag menu">🍽️ Menu</span>
                    <span v-if="link.isShopNow" class="link-tag shop">🛒 Shop</span>
                    <span v-if="link.isOrderNow" class="link-tag order">📦 Order</span>
                  </div>
                </div>
                <button type="button" @click="removeLink(index)" class="link-remove-btn" :disabled="isBrochureDisabled">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-2 14H7L5 6"/>
                  </svg>
                </button>
              </div>
            </div>
            <p v-else class="link-empty-text">No links added yet.</p>
          </div>
        </div>

        <!-- ── SECTION: Address ── -->
        <div class="form-section">
          <div class="section-label">
            <span class="section-number">05</span>
            <span class="section-title">Address</span>
          </div>
          <div class="fields-grid">
            <div class="field-wrap">
              <label class="field-label">Label</label>
              <select v-model="companyForm.label" class="field-input field-select">
                <option value="">Select label</option>
                <option value="Home">🏠 Home</option>
                <option value="Work">💼 Work</option>
                <option value="Office">🏢 Office</option>
                <option value="Other">📍 Other</option>
              </select>
            </div>
            <div class="field-wrap">
              <label class="field-label">Country / Region</label>
              <CountrySelector v-model="companyForm.country"/>
            </div>
            <div class="field-wrap full">
              <label class="field-label">Street Address</label>
              <input v-model="companyForm.streetAddress" type="text" class="field-input" placeholder="123 Main St"/>
            </div>
            <div class="field-wrap full">
              <label class="field-label">Street Address Line 2</label>
              <input v-model="companyForm.streetAddressLine2" type="text" class="field-input"
                     placeholder="Suite, floor, etc."/>
            </div>
            <div class="field-wrap">
              <label class="field-label">City</label>
              <input v-model="companyForm.city" type="text" class="field-input" placeholder="City"/>
            </div>
            <div class="field-wrap">
              <label class="field-label">Postal Code</label>
              <input v-model="companyForm.postalCode" type="text" class="field-input" placeholder="00000"/>
            </div>
            <div class="field-wrap">
              <label class="field-label">PO Box</label>
              <input v-model="companyForm.poBox" type="text" class="field-input" placeholder="PO Box"/>
            </div>
          </div>
        </div>

        <!-- ── SECTION: Bio ── -->
        <div class="form-section">
          <div class="section-label">
            <span class="section-number">06</span>
            <span class="section-title">Company Bio</span>
          </div>
          <Suspense>
            <CompanyBioEditor
                v-if="showCompanyForm"
                v-model="companyForm.bio"
            />
          </Suspense>
        </div>

        <!-- ── SECTION: Social Media ── -->
        <div class="form-section">
          <div class="section-label">
            <span class="section-number">07</span>
            <span class="section-title">
              Social Media
              <span v-if="userPlan === 'free'" class="social-count-badge">{{ enabledSocialMediaCount }}/2 used</span>
            </span>
          </div>

          <div class="social-grid">
            <div v-for="social in mainSocialMedia" :key="social.name" class="social-item">
              <div class="social-item-header">
                <label :class="['social-toggle', { enabled: social.enabled }]">
                  <input
                      type="checkbox"
                      v-model="social.enabled"
                      @change="handleSocialToggle(social)"
                      :disabled="userPlan === 'free' && !social.enabled && enabledSocialMediaCount >= 2"
                      class="hidden-check"
                  />
                  <span class="toggle-track">
                    <span class="toggle-thumb"></span>
                  </span>
                  <span class="social-label-text">{{ social.label }}</span>
                  <span v-if="userPlan === 'free' && !social.enabled && enabledSocialMediaCount >= 2"
                        class="social-limit-note">Limit reached</span>
                </label>
              </div>
              <input
                  v-model="social.url"
                  type="url"
                  class="field-input"
                  :placeholder="`${social.label} profile URL`"
                  :disabled="!social.enabled"
              />
            </div>
          </div>

          <!-- Custom Social -->
          <div v-if="customSocialMedia.length > 0" class="custom-social-list">
            <div v-for="(custom, index) in customSocialMedia" :key="index" class="custom-social-row">
              <label :class="['social-toggle compact', { enabled: custom.enabled }]">
                <input
                    type="checkbox"
                    v-model="custom.enabled"
                    @change="handleCustomSocialToggle(custom)"
                    :disabled="userPlan === 'free' && !custom.enabled && enabledSocialMediaCount >= 2"
                    class="hidden-check"
                />
                <span class="toggle-track"><span class="toggle-thumb"></span></span>
              </label>
              <input v-model="custom.name" type="text" class="field-input" placeholder="Platform name"
                     :disabled="!custom.enabled"/>
              <input v-model="custom.url" type="url" class="field-input" placeholder="Profile URL"
                     :disabled="!custom.enabled"/>
              <button @click="removeCustomSocial(index)" class="remove-custom-social" type="button">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>

          <button
              @click="addCustomSocial"
              class="add-more-social-btn"
              type="button"
              :disabled="userPlan === 'free' && enabledSocialMediaCount >= 2"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Custom Platform
            <span v-if="userPlan === 'free' && enabledSocialMediaCount >= 2"
                  class="upgrade-hint">(Upgrade to add more)</span>
          </button>
        </div>

        <!-- ── Bottom Actions ── -->
        <div class="form-bottom-actions">
          <button @click="closeCompanyForm" class="cancel-btn" :disabled="saving" type="button">Cancel</button>
          <button @click="saveCompany" class="save-btn" :disabled="saving" type="button">
            <svg v-if="!saving" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/>
            </svg>
            {{ saving ? 'Saving…' : 'Save Company' }}
          </button>
        </div>

      </div><!-- /form-body -->
    </div><!-- /form-view -->

    <ImageCropperModal
        :show="showCropperModal"
        :image-src="tempImageSrc"
        :type="cropperType"
        :title="cropperType === 'logo' ? 'Crop Company Logo' : 'Crop Image'"
        @cropped="handleCroppedImage"
        @close="showCropperModal = false; tempImageSrc = ''"
    />
    <AlertModal
        v-bind="alertState"
        @confirm="alertState.onConfirm"
        @cancel="alertState.onCancel"
    />
  </div>
</template>

<script setup>
import {computed, inject, onMounted, ref, watch, defineAsyncComponent} from 'vue';
import api from '@/services/api.js';
import {VITE_IMAGE_UPLOAD_URL} from '@/config.js';
import CountrySelector from '@/components/common/CountrySelector.vue';
import ImageCropperModal from '@/components/contactCard/ImageCropper.vue';
import AlertModal from '@/components/user/AlertModal.vue'; // ← NEW
import {useAlert} from '@/composables/useAlert.js'; // ← NEW

const theme = inject('theme', { isDark: ref(false) })
const isDarkMode = theme.isDark

const props = defineProps({
  activeTab: {type: String, required: true},
  companyCount: {type: Number, required: true},
  userLimits: {type: Object, required: true}
});

const CompanyBioEditor = defineAsyncComponent(() =>
    import('@/components/common/CompanyBioEditor.vue')
)

const emit = defineEmits(['company-added', 'company-deleted', 'company-updated']);

// ── Alert composable ──────────────────────────────────────────────── ← NEW
const {alertState, showAlert, showConfirm} = useAlert();

// ── State (unchanged) ──
const userCompanies = ref([]);
const showCompanyForm = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(9);
const saving = ref(false);
const userPlan = ref('free');

const logoPreview = ref(null);
const logoFileName = ref('');
const showCropperModal = ref(false);
const tempImageSrc = ref('');
const cropperType = ref('logo');

const pendingLinkUrl = ref('');
const pendingLinkName = ref('');
const pendingLinkType = ref({isBrochure: false, isMenu: false, isShopNow: false, isOrderNow: false});

const linkTypes = [
  {key: 'isBrochure', icon: '📄', label: 'Brochure'},
  {key: 'isMenu', icon: '🍽️', label: 'Menu'},
  {key: 'isShopNow', icon: '🛒', label: 'Shop'},
  {key: 'isOrderNow', icon: '📦', label: 'Order'}
];

const mainSocialMedia = ref([
  {name: 'facebook', label: 'Facebook', enabled: false, url: ''},
  {name: 'twitter', label: 'X (Twitter)', enabled: false, url: ''},
  {name: 'linkedin', label: 'LinkedIn', enabled: false, url: ''},
  {name: 'instagram', label: 'Instagram', enabled: false, url: ''},
  {name: 'youtube', label: 'YouTube', enabled: false, url: ''},
  {name: 'tiktok', label: 'TikTok', enabled: false, url: ''}
]);

const customSocialMedia = ref([]);

const companyForm = ref({
  id: null, companyName: '', website: '', displayUrl: '', email: '', bio: '',
  logo: null, view360: '', googleLocation: '', googleReviews: '', tripAdvisor: '',
  status: 'active', files: [], existingLogoPath: null, country: '',
  streetAddress: '', streetAddressLine2: '', city: '', postalCode: '', poBox: '', label: ''
});

// Image compression utility — compresses to under 1MB before cropping
const compressImage = (file, maxSizeMB = 1) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      let quality = 0.92;

      // Scale down dimensions if image is very large
      const maxDimension = 1600;
      if (width > maxDimension || height > maxDimension) {
        const scale = Math.min(maxDimension / width, maxDimension / height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const tryCompress = () => {
        canvas.toBlob((blob) => {
          if (blob.size <= maxSizeMB * 1024 * 1024 || quality <= 0.4) {
            resolve(new File([blob], file.name, { type: 'image/jpeg' }));
          } else {
            quality -= 0.1;
            canvas.toBlob(b => resolve(new File([b], file.name, { type: 'image/jpeg' })), 'image/jpeg', quality);
          }
        }, 'image/jpeg', quality);
      };

      tryCompress();
    };

    img.src = url;
  });
};

// ── Computed (unchanged) ──
const isBrochureDisabled = computed(() => userPlan.value === 'free');

const enabledSocialMediaCount = computed(() =>
    mainSocialMedia.value.filter(s => s.enabled).length +
    customSocialMedia.value.filter(s => s.enabled).length
);

const filteredCompanies = computed(() => {
  if (!searchQuery.value.trim()) return userCompanies.value;
  const q = searchQuery.value.toLowerCase();
  return userCompanies.value.filter(c =>
      c.companyName?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.website?.toLowerCase().includes(q)
  );
});

const paginatedCompanies = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredCompanies.value.slice(start, start + itemsPerPage.value);
});

const totalPages = computed(() =>
    Math.ceil(filteredCompanies.value.length / itemsPerPage.value)
);

watch(() => filteredCompanies.value.length, () => {
  if (currentPage.value > totalPages.value && totalPages.value > 0)
    currentPage.value = totalPages.value;
});

// ── API ──
const fetchUserPlan = async () => {
  try {
    const res = await api.get('/auth/me');
    userPlan.value = (res.data?.user?.plan || res.data?.plan || 'free').toLowerCase();
  } catch {
    userPlan.value = 'free';
  }
};

const fetchCompanies = async () => {
  try {
    const res = await api.get('/dashboard/data');
    userCompanies.value = res.data.companies || [];
  } catch {
    await showAlert({                                                    // ← NEW
      type: 'error',
      title: 'Failed to Load',
      message: 'Could not load your companies. Please refresh the page.',
      confirmLabel: 'OK'
    });
  }
};

// ── Form helpers ──
const openCompanyForm = () => {
  resetForm();
  showCompanyForm.value = true;
};
const closeCompanyForm = () => {
  showCompanyForm.value = false;
  resetForm();
};

const resetForm = () => {
  companyForm.value = {
    id: null, companyName: '', website: '', displayUrl: '', email: '', bio: '',
    logo: null, view360: '', googleLocation: '', googleReviews: '', tripAdvisor: '',
    status: 'active', files: [], existingLogoPath: null, country: '',
    streetAddress: '', streetAddressLine2: '', city: '', postalCode: '', poBox: '', label: ''
  };
  logoPreview.value = null;
  logoFileName.value = '';
  pendingLinkUrl.value = '';
  pendingLinkName.value = '';
  pendingLinkType.value = {isBrochure: false, isMenu: false, isShopNow: false, isOrderNow: false};
  mainSocialMedia.value.forEach(s => {
    s.enabled = false;
    s.url = '';
  });
  customSocialMedia.value = [];
};

const handleLogoUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    showAlert({
      type: 'error',
      title: 'Invalid File',
      message: 'Please upload an image file (PNG, JPG, etc.).',
      confirmLabel: 'OK'
    });
    return;
  }

  // Hard limit at 10MB — anything beyond is unreasonable even before compression
  if (file.size > 10 * 1024 * 1024) {
    showAlert({
      type: 'warning',
      title: 'File Too Large',
      message: 'Image size must be less than 10MB.',
      confirmLabel: 'OK'
    });
    return;
  }

  logoFileName.value = file.name;

  // Compress silently if over 1MB, then open cropper
  const processedFile = file.size > 1 * 1024 * 1024
      ? await compressImage(file, 1)
      : file;

  const reader = new FileReader();
  reader.onload = (ev) => {
    tempImageSrc.value = ev.target.result;
    cropperType.value = 'logo';
    showCropperModal.value = true;
  };
  reader.readAsDataURL(processedFile);
};

const handleCroppedImage = (blob) => {
  const file = new File([blob], 'logo.jpg', {type: 'image/jpeg'});
  logoPreview.value = URL.createObjectURL(blob);
  companyForm.value.logo = file;
};

const removeLogo = () => {
  logoPreview.value = null;
  logoFileName.value = '';
  companyForm.value.logo = null;
  companyForm.value.existingLogoPath = null;
  const el = document.getElementById('logo-upload');
  if (el) el.value = '';
};

const addLinkToList = async () => {
  if (!pendingLinkUrl.value.trim()) {
    await showAlert({
      type: 'warning',
      title: 'URL Required',
      message: 'Please enter a URL for the link.',
      confirmLabel: 'OK'
    }); // ← NEW
    return;
  }
  const hasType = Object.values(pendingLinkType.value).some(Boolean);
  if (!hasType) {
    await showAlert({
      type: 'warning',
      title: 'Type Required',
      message: 'Please select at least one link type (Brochure, Menu, Shop or Order).',
      confirmLabel: 'OK'
    }); // ← NEW
    return;
  }
  companyForm.value.files.push({
    url: pendingLinkUrl.value.trim(),
    name: pendingLinkName.value.trim() || 'Untitled Link',
    ...pendingLinkType.value
  });
  pendingLinkUrl.value = '';
  pendingLinkName.value = '';
  pendingLinkType.value = {isBrochure: false, isMenu: false, isShopNow: false, isOrderNow: false};
};

const removeLink = (i) => companyForm.value.files.splice(i, 1);

const handleSocialToggle = async (social) => {
  if (userPlan.value !== 'free') return;
  if (social.enabled && enabledSocialMediaCount.value > 2) {
    await showAlert({
      type: 'warning',
      title: 'Limit Reached',
      message: 'Free plan allows only 2 social media platforms. Disable one to enable another.',
      confirmLabel: 'Got it'
    }); // ← NEW
    social.enabled = false;
  }
};

const handleCustomSocialToggle = async (custom) => {
  if (userPlan.value !== 'free') return;
  if (custom.enabled && enabledSocialMediaCount.value > 2) {
    await showAlert({
      type: 'warning',
      title: 'Limit Reached',
      message: 'Free plan allows only 2 social media platforms. Disable one to enable another.',
      confirmLabel: 'Got it'
    }); // ← NEW
    custom.enabled = false;
  }
};

const addCustomSocial = async () => {
  if (userPlan.value === 'free' && enabledSocialMediaCount.value >= 2) {
    await showAlert({
      type: 'warning',
      title: 'Limit Reached',
      message: 'Free plan allows a maximum of 2 social media links. Upgrade to add more.',
      confirmLabel: 'Got it'
    }); // ← NEW
    return;
  }
  customSocialMedia.value.push({name: '', url: '', enabled: false});
};

const removeCustomSocial = (i) => customSocialMedia.value.splice(i, 1);

// ── Save ──────────────────────────────────────────────────────────── ← NEW (all alerts replaced)
const saveCompany = async () => {
  if (!companyForm.value.companyName.trim()) {
    await showAlert({
      type: 'warning',
      title: 'Required Field',
      message: 'Company name is required.',
      confirmLabel: 'OK'
    });
    return;
  }
  if (!companyForm.value.website.trim()) {
    await showAlert({type: 'warning', title: 'Required Field', message: 'Website is required.', confirmLabel: 'OK'});
    return;
  }
  if (!companyForm.value.email.trim()) {
    await showAlert({
      type: 'warning',
      title: 'Required Field',
      message: 'Email address is required.',
      confirmLabel: 'OK'
    });
    return;
  }
  if (userPlan.value === 'free' && enabledSocialMediaCount.value > 2) {
    await showAlert({
      type: 'warning', title: 'Social Limit Exceeded',
      message: `Free plan allows max 2 social links. Please disable ${enabledSocialMediaCount.value - 2} link(s) before saving.`,
      confirmLabel: 'OK'
    });
    return;
  }
  if (userPlan.value === 'free' && companyForm.value.files.length > 0) {
    await showAlert({
      type: 'warning',
      title: 'Premium Feature',
      message: 'Brochure links require a Plus or Pro plan.',
      confirmLabel: 'OK'
    });
    return;
  }
  if (!companyForm.value.id && !companyForm.value.logo) {
    await showAlert({
      type: 'warning',
      title: 'Logo Required',
      message: 'Please upload a company logo before saving.',
      confirmLabel: 'OK'
    });
    return;
  }

  saving.value = true;
  try {
    const fd = new FormData();
    const fields = ['companyName', 'website', 'displayUrl', 'email', 'bio', 'view360', 'googleLocation', 'googleReviews', 'tripAdvisor', 'status', 'country', 'streetAddress', 'streetAddressLine2', 'city', 'postalCode', 'poBox', 'label'];
    fields.forEach(f => fd.append(f, companyForm.value[f] || ''));
    if (companyForm.value.logo) fd.append('logo', companyForm.value.logo);
    else if (companyForm.value.existingLogoPath) fd.append('existingLogoPath', companyForm.value.existingLogoPath);
    if (userPlan.value !== 'free') fd.append('files', JSON.stringify(companyForm.value.files));

    const socialLinks = {};
    mainSocialMedia.value.filter(s => s.enabled && s.url.trim()).forEach(s => {
      socialLinks[s.name] = s.url.trim();
    });
    customSocialMedia.value.filter(c => c.enabled && c.url.trim() && c.name.trim()).forEach(c => {
      socialLinks[c.name.trim().toLowerCase().replace(/\s+/g, '_')] = c.url.trim();
    });
    fd.append('socialLinks', JSON.stringify(socialLinks));

    const cfg = {headers: {'Content-Type': 'multipart/form-data'}};
    const isUpdate = !!companyForm.value.id;

    if (isUpdate) {
      await api.put(`/dashboard/company/${companyForm.value.id}`, fd, cfg);
    } else {
      await api.post('/dashboard/company', fd, cfg);
    }

    // Show success THEN close form                                      ← NEW
    await showAlert({
      type: 'success',
      title: isUpdate ? 'Company Updated!' : 'Company Created!',
      message: isUpdate
          ? 'Your company details have been updated successfully.'
          : 'Your new company has been created successfully.',
      confirmLabel: 'Great!'
    });

    closeCompanyForm();
    await fetchCompanies();
    emit(isUpdate ? 'company-updated' : 'company-added');

  } catch (e) {
    await showAlert({
      type: 'error',
      title: 'Save Failed',
      message: e.response?.data?.message || 'Something went wrong while saving. Please try again.',
      confirmLabel: 'OK'
    });
  } finally {
    saving.value = false;
  }
};

// ── Edit ──────────────────────────────────────────────────────────── ← NEW (alert replaced)
const editCompany = async (company) => {
  try {
    mainSocialMedia.value.forEach(s => {
      s.enabled = false;
      s.url = '';
    });
    customSocialMedia.value = [];

    let parsedFiles = [];
    if (company.files) {
      try {
        parsedFiles = Array.isArray(company.files) ? company.files : JSON.parse(company.files);
      } catch {
        parsedFiles = [];
      }
    }

    companyForm.value = {
      id: company.id, companyName: company.companyName || '', website: company.website || '',
      displayUrl: company.displayUrl || '', email: company.email || '', bio: company.bio || '',
      logo: null, view360: company.view360 || '', googleLocation: company.googleLocation || '',
      googleReviews: company.googleReviews || '', tripAdvisor: company.tripAdvisor || '',
      status: company.status || 'active', files: parsedFiles, existingLogoPath: company.logo || null,
      country: company.country || '', streetAddress: company.streetAddress || '',
      streetAddressLine2: company.streetAddressLine2 || '', city: company.city || '',
      postalCode: company.postalCode || '', poBox: company.poBox || '', label: company.label || ''
    };

    if (company.logo) {
      logoPreview.value = `${VITE_IMAGE_UPLOAD_URL}${company.logo}`;
      logoFileName.value = company.logo.split('/').pop();
    } else {
      logoPreview.value = null;
      logoFileName.value = '';
    }

    let parsedSocial = [];
    const raw = company.socialLinks || company.socialMedia || [];
    try {
      if (Array.isArray(raw)) parsedSocial = raw;
      else if (typeof raw === 'string' && raw.trim()) parsedSocial = JSON.parse(raw);
      else if (typeof raw === 'object' && raw !== null)
        parsedSocial = Object.entries(raw).map(([k, v]) => ({
          name: k,
          label: k.charAt(0).toUpperCase() + k.slice(1),
          url: v
        }));
    } catch {
      parsedSocial = [];
    }

    parsedSocial.forEach(s => {
      const main = mainSocialMedia.value.find(m => m.name.toLowerCase() === s.name.toLowerCase());
      if (main) {
        main.enabled = true;
        main.url = s.url || '';
      } else customSocialMedia.value.push({name: s.label || s.name, url: s.url || '', enabled: true});
    });

    showCompanyForm.value = true;
  } catch {
    await showAlert({                                                   // ← NEW
      type: 'error',
      title: 'Load Failed',
      message: 'Could not load company data for editing. Please try again.',
      confirmLabel: 'OK'
    });
  }
};

// ── Delete ───────────────────────────────────────────────────────── ← NEW (confirm + alert replaced)
const deleteCompany = async (id) => {
  const confirmed = await showConfirm({
    type: 'danger',
    title: 'Delete Company?',
    message: 'This action cannot be undone. All data associated with this company will be permanently removed.',
    confirmLabel: 'Delete',
    cancelLabel: 'Cancel'
  });

  if (!confirmed) return;

  try {
    await api.delete(`/dashboard/company/${id}`);
    await showAlert({
      type: 'success',
      title: 'Company Deleted',
      message: 'The company has been permanently removed.',
      confirmLabel: 'OK'
    });
    emit('company-deleted');
    await fetchCompanies();
  } catch {
    await showAlert({
      type: 'error',
      title: 'Delete Failed',
      message: 'Could not delete the company. Please try again.',
      confirmLabel: 'OK'
    });
  }
};

onMounted(async () => {
  await fetchUserPlan();
  await fetchCompanies();
});
</script>

<style scoped>
/* ═══════════════════════════════════════
   CSS CUSTOM PROPERTIES
═══════════════════════════════════════ */
.company-tab {
  --c-bg: #ffffff;
  --c-surface: #ffffff;
  --c-border: #ece9e4;
  --c-border-focus: #8B6355;
  --c-text-primary: #1a1410;
  --c-text-secondary: #6b5f56;
  --c-text-muted: #a09080;
  --c-accent: #8B6355;
  --c-accent-hover: #6d4c3d;
  --c-accent-light: #f5ede8;
  --c-danger: #c0392b;
  --c-danger-light: #fdf0ee;
  --c-success: #27695c;
  --c-success-light: #edf7f4;
  --c-warning: #b7720a;
  --c-warning-light: #fef8ec;
  --c-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.07), 0 1px 2px rgba(0, 0, 0, 0.05);
  --c-shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.05);
  --c-shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.06);
  --c-radius: 12px;
  --c-radius-sm: 8px;
  --c-radius-pill: 100px;
  --c-order: rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  font-size: 14px;
  color: var(--c-text-primary);
  background: var(--c-bg);
  border-radius: 0.5rem;
}

.company-tab.dark-mode {
  --c-bg: #131118;
  --c-surface: #1e1b27;
  --c-border: #2a2438;
  --c-border-focus: #c49a7a;
  --c-text-primary: #f0ece8;
  --c-text-secondary: #a897a2;
  --c-text-muted: #6b5f6e;
  --c-accent: #c49a7a;
  --c-accent-hover: #d4b090;
  --c-accent-light: #2a2020;
  --c-danger: #e57373;
  --c-danger-light: #2a1a1a;
  --c-success: #66bb8a;
  --c-success-light: #0f2a1e;
  --c-warning: #ffb74d;
  --c-warning-light: #2a1e0a;
  --c-order: rgba(0, 0, 0, 0.2);
}

/* ── Shared base ── */
*, *::before, *::after {
  box-sizing: border-box;
}

button {
  font-family: inherit;
  cursor: pointer;
}

input, select, textarea {
  font-family: inherit;
}

a {
  text-decoration: none;
}

/* ═══════════════════════════════════════
   LIST VIEW
═══════════════════════════════════════ */
.list-view {
  padding: 24px;
  max-width: 1800px;
  margin: 0 auto;
  border-radius: 0.5rem;
}

/* Header */
.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.list-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.4px;
  color: var(--c-text-primary);
  margin: 0;
}

.company-count-pill {
  background: var(--c-accent-light);
  color: var(--c-accent);
  font-size: 12px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: var(--c-radius-pill);
}

.remaining-pill {
  background: var(--c-success-light);
  color: var(--c-success);
}

.add-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 18px;
  background: var(--c-accent);
  color: #fff;
  border: none;
  border-radius: var(--c-radius-sm);
  font-size: 14px;
  font-weight: 600;
  transition: background 0.18s, transform 0.12s;
  white-space: nowrap;
}

.add-btn:hover {
  background: var(--c-accent-hover);
  transform: translateY(-1px);
}

.add-btn:active {
  transform: translateY(0);
}

.limit-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: var(--c-border);
  color: var(--c-text-muted);
  border-radius: var(--c-radius-sm);
  font-size: 13px;
  font-weight: 500;
}

/* Search */
.search-bar {
  position: relative;
  margin-bottom: 20px;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--c-text-muted);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 11px 40px 11px 42px;
  background: var(--c-surface);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-sm);
  font-size: 14px;
  color: var(--c-text-primary);
  transition: border-color 0.15s, box-shadow 0.15s;
}

.search-input::placeholder {
  color: var(--c-text-muted);
}

.search-input:focus {
  outline: none;
  border-color: var(--c-border-focus);
  box-shadow: 0 0 0 3px rgba(139, 99, 85, 0.12);
}

.dark-mode .search-input:focus {
  box-shadow: 0 0 0 3px rgba(196, 154, 122, 0.15);
}

.search-clear {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: var(--c-border);
  border: none;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--c-text-secondary);
  transition: background 0.15s;
}

.search-clear:hover {
  background: var(--c-danger-light);
  color: var(--c-danger);
}

/* Company Cards Grid */
.company-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 14px;
  margin-bottom: 24px;
}

.company-card {
  background: var(--c-surface);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s, border-color 0.2s, transform 0.15s;
  box-shadow: var(--c-shadow-sm);
}

.company-card:hover {
  box-shadow: var(--c-shadow-md);
  border-color: var(--c-accent);
  transform: translateY(-2px);
}

.card-top {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 16px 12px;
  background: linear-gradient(135deg, var(--c-accent-subtle) 0%, var(--c-surface) 100%);
  border-bottom: 1px solid var(--c-border);
  position: relative;
}

.company-tab.dark-mode .card-top {
  background: linear-gradient(135deg, #1e1612 0%, #1e1b27 100%);
}

.card-logo-wrap {
  flex-shrink: 0;
}

.card-logo {
  width: 46px;
  height: 46px;
  object-fit: contain;
  border-radius: var(--c-radius-sm);
  border: 1.5px solid var(--c-border);
  background: var(--c-bg);
  padding: 4px;
}

.card-logo-placeholder {
  width: 46px;
  height: 46px;
  border-radius: var(--c-radius-sm);
  border: 1.5px dashed var(--c-border);
  background: var(--c-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--c-text-muted);
}

.card-identity {
  flex: 1;
  min-width: 0;
}

.card-company-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--c-text-primary);
  margin: 0 0 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-website {
  font-size: 12px;
  color: var(--c-accent);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

.card-website:hover {
  text-decoration: underline;
}

.status-dot {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  padding: 3px 9px;
  border-radius: var(--c-radius-pill);
  font-size: 11px;
  font-weight: 600;
  text-transform: capitalize;
  letter-spacing: 0.3px;
  margin-top: 2px;
}

.status-dot.active {
  background: var(--c-success-light);
  color: var(--c-success);
}

.status-dot.inactive {
  background: var(--c-danger-light);
  color: var(--c-danger);
}

.card-body {
  padding: 12px 16px;
  flex: 1;
}

.card-meta-row {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--c-text-secondary);
  font-size: 13px;
  margin-bottom: 10px;
  overflow: hidden;
}

.card-meta-row svg {
  flex-shrink: 0;
  color: var(--c-text-muted);
}

.card-meta-row span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-links-row {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.card-pill-link {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  background: var(--c-accent-light);
  color: var(--c-accent);
  border-radius: var(--c-radius-pill);
  font-size: 11px;
  font-weight: 600;
  transition: background 0.15s;
}

.card-pill-link:hover {
  background: var(--c-accent);
  color: #fff;
}

.card-actions {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid var(--c-border);
  background: var(--c-bg);
}

.action-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  border: none;
  border-radius: var(--c-radius-sm);
  font-size: 13px;
  font-weight: 600;
  transition: all 0.15s;
}

.edit-btn {
  background: var(--c-warning-light);
  color: var(--c-warning);
}

.edit-btn:hover {
  background: #f39c12;
  color: #fff;
}

.delete-btn {
  background: var(--c-danger-light);
  color: var(--c-danger);
}

.delete-btn:hover {
  background: var(--c-danger);
  color: #fff;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 56px 24px;
  background: var(--c-surface);
  border: 1.5px dashed var(--c-border);
  border-radius: var(--c-radius);
}

.empty-icon-wrap {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: var(--c-accent-light);
  color: var(--c-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 18px;
}

.empty-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--c-text-primary);
  margin: 0 0 6px;
}

.empty-sub {
  font-size: 13px;
  color: var(--c-text-muted);
  margin: 0 0 20px;
}

.empty-action-btn {
  display: inline-flex;
  align-items: center;
  padding: 10px 22px;
  background: var(--c-accent);
  color: #fff;
  border: none;
  border-radius: var(--c-radius-sm);
  font-size: 14px;
  font-weight: 600;
  transition: background 0.15s;
}

.empty-action-btn:hover {
  background: var(--c-accent-hover);
}

/* Pagination */
.pagination-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 8px;
}

.pag-btn {
  min-width: 36px;
  height: 36px;
  padding: 0 10px;
  background: var(--c-surface);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-sm);
  color: var(--c-text-secondary);
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.pag-btn:hover:not(:disabled) {
  border-color: var(--c-accent);
  color: var(--c-accent);
}

.pag-btn.active {
  background: var(--c-accent);
  border-color: var(--c-accent);
  color: #fff;
}

.pag-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pag-btn.arrow {
  background: var(--c-bg);
}

/* ═══════════════════════════════════════
   FORM VIEW
═══════════════════════════════════════ */
.form-view {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

/* Sticky top bar */
.form-topbar {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 24px;
  background: var(--c-surface);
  border-bottom: 1.5px solid var(--c-border);
  box-shadow: var(--c-shadow-sm);
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 7px 12px;
  background: var(--c-bg);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-sm);
  color: var(--c-text-secondary);
  font-size: 13px;
  font-weight: 500;
  transition: all 0.15s;
}

.back-btn:hover {
  border-color: var(--c-accent);
  color: var(--c-accent);
}

.form-page-title {
  flex: 1;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.3px;
  color: var(--c-text-primary);
  margin: 0;
}

.form-topbar-right {
  display: flex;
  gap: 8px;
}

.save-btn-top {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 18px;
  background: var(--c-accent);
  color: #fff;
  border: none;
  border-radius: var(--c-radius-sm);
  font-size: 14px;
  font-weight: 600;
  transition: background 0.15s;
}

.save-btn-top:hover:not(:disabled) {
  background: var(--c-accent-hover);
}

.save-btn-top:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Plan Banner */
.plan-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 24px;
  border-bottom: 1px solid var(--c-border);
  background: var(--c-bg);
  flex-wrap: wrap;
}

.plan-banner.free {
  background: var(--c-warning-light);
}

.plan-banner.plus {
  background: var(--c-accent-light);
}

.plan-banner.pro {
  background: var(--c-success-light);
}

.plan-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.plan-icon {
  font-size: 18px;
}

.plan-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--c-text-primary);
}

.plan-note {
  font-size: 12px;
  color: var(--c-text-secondary);
}

/* Form Body */
.form-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* Sections */
.form-section {
  padding: 24px 0;
  border-bottom: 1px solid var(--c-border);
}

.form-section:last-child {
  border-bottom: none;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
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
  letter-spacing: 0.3px;
  flex-shrink: 0;
}

.section-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--c-text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

/* Fields Grid */
.fields-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.field-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-wrap.full {
  grid-column: 1 / -1;
}

.field-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--c-text-secondary);
}

.req {
  color: var(--c-danger);
}

.field-input {
  width: 100%;
  padding: 10px 14px;
  background: var(--c-surface);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-sm);
  font-size: 14px;
  color: var(--c-text-primary);
  transition: border-color 0.15s, box-shadow 0.15s;
}

.field-input::placeholder {
  color: var(--c-text-muted);
}

.field-input:focus {
  outline: none;
  border-color: var(--c-border-focus);
  box-shadow: 0 0 0 3px rgba(139, 99, 85, 0.12);
}

.dark-mode .field-input:focus {
  box-shadow: 0 0 0 3px rgba(196, 154, 122, 0.15);
}

.field-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: var(--c-bg);
}

.field-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23a09080' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
}

/* Status Toggle */
.status-toggle-group {
  display: flex;
  gap: 8px;
}

.status-toggle-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 10px 12px;
  background: var(--c-bg);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-sm);
  font-size: 13px;
  font-weight: 600;
  color: var(--c-text-secondary);
  transition: all 0.15s;
}

.status-toggle-btn.active {
  border-color: var(--c-accent);
  background: var(--c-accent-light);
  color: var(--c-accent);
}

.toggle-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.toggle-dot.active-dot {
  background: var(--c-success);
}

.toggle-dot.inactive-dot {
  background: var(--c-danger);
}

/* Input with icon */
.input-icon-wrap {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--c-text-muted);
  pointer-events: none;
}

.field-input.icon-padded {
  padding-left: 38px;
}

/* ── Logo Upload ── */
.logo-upload-area {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  flex-wrap: wrap;
}

.logo-preview-wrap {
  position: relative;
  width: 90px;
  height: 90px;
  flex-shrink: 0;
}

.logo-preview-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: var(--c-radius-sm);
  border: 1.5px solid var(--c-border);
  background: var(--c-bg);
  padding: 6px;
}

.logo-remove-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--c-danger);
  color: #fff;
  border: 2px solid var(--c-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s;
}

.logo-remove-btn:hover {
  transform: scale(1.1);
}

.logo-dropzone {
  flex: 1;
  min-width: 160px;
  cursor: pointer;
  display: block;
}

.hidden-file {
  display: none;
}

.hidden-check {
  display: none;
}

.dropzone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 24px;
  border: 2px dashed var(--c-border);
  border-radius: var(--c-radius-sm);
  background: var(--c-bg);
  color: var(--c-text-muted);
  text-align: center;
  transition: border-color 0.15s, background 0.15s;
}

.logo-dropzone:hover .dropzone-content {
  border-color: var(--c-accent);
  background: var(--c-accent-light);
  color: var(--c-accent);
}

.dropzone-text {
  font-size: 14px;
  font-weight: 600;
  color: var(--c-text-primary);
}

.dropzone-hint {
  font-size: 11px;
  color: var(--c-text-muted);
}

/* ── Brochure Panel ── */
.brochure-panel {
  background: var(--c-bg);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius);
  padding: 20px;
  position: relative;
}

.brochure-panel.locked {
  overflow: hidden;
}

.lock-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  backdrop-filter: blur(2px);
  border-radius: var(--c-radius);
}

.dark-mode .lock-overlay {
  background: rgba(20, 18, 30, 0.75);
}

.lock-card {
  background: var(--c-surface);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius);
  padding: 20px 28px;
  text-align: center;
  box-shadow: var(--c-shadow-md);
}

.lock-emoji {
  font-size: 28px;
  display: block;
  margin-bottom: 8px;
}

.lock-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--c-text-primary);
  margin: 0 0 4px;
}

.lock-desc {
  font-size: 12px;
  color: var(--c-text-muted);
  margin: 0;
}

.link-form-row {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}

.link-fields {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.link-type-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.type-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-pill);
  font-size: 12px;
  font-weight: 600;
  color: var(--c-text-secondary);
  cursor: pointer;
  transition: all 0.15s;
  user-select: none;
}

.type-chip.selected {
  border-color: var(--c-accent);
  background: var(--c-accent-light);
  color: var(--c-accent);
}

.add-link-btn {
  align-self: flex-start;
  padding: 10px 20px;
  background: var(--c-accent);
  color: #fff;
  border: none;
  border-radius: var(--c-radius-sm);
  font-size: 13px;
  font-weight: 600;
  transition: background 0.15s;
}

.add-link-btn:hover:not(:disabled) {
  background: var(--c-accent-hover);
}

.add-link-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.link-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.link-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 14px;
  background: var(--c-surface);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-sm);
}

.link-item-info {
  flex: 1;
  min-width: 0;
}

.link-item-name {
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: var(--c-text-primary);
  margin-bottom: 3px;
}

.link-item-url {
  display: block;
  font-size: 12px;
  color: var(--c-text-muted);
  word-break: break-all;
  margin-bottom: 7px;
}

.link-item-tags {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.link-tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: var(--c-radius-pill);
  font-size: 11px;
  font-weight: 600;
}

.link-tag.brochure {
  background: #e3f2fd;
  color: #1565c0;
}

.link-tag.menu {
  background: #fff3e0;
  color: #e65100;
}

.link-tag.shop {
  background: var(--c-success-light);
  color: var(--c-success);
}

.link-tag.order {
  background: #f3e5f5;
  color: #6a1b9a;
}

.dark-mode .link-tag.brochure {
  background: #0d1f3c;
  color: #64b5f6;
}

.dark-mode .link-tag.menu {
  background: #2a1500;
  color: #ffb74d;
}

.dark-mode .link-tag.shop {
  background: var(--c-success-light);
  color: var(--c-success);
}

.dark-mode .link-tag.order {
  background: #1e0a2a;
  color: #ce93d8;
}

.link-remove-btn {
  padding: 8px;
  background: var(--c-danger-light);
  color: var(--c-danger);
  border: none;
  border-radius: var(--c-radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.15s;
}

.link-remove-btn:hover:not(:disabled) {
  background: var(--c-danger);
  color: #fff;
}

.link-empty-text {
  font-size: 13px;
  color: var(--c-text-muted);
  font-style: italic;
  margin: 0;
}

/* ── Social Media ── */
.lock-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  background: var(--c-warning-light);
  color: var(--c-warning);
  border-radius: var(--c-radius-pill);
  font-size: 11px;
  font-weight: 600;
}

.social-count-badge {
  display: inline-flex;
  padding: 2px 9px;
  background: var(--c-accent-light);
  color: var(--c-accent);
  border-radius: var(--c-radius-pill);
  font-size: 11px;
  font-weight: 600;
}

.social-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-bottom: 16px;
}

.social-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.social-item-header {
}

.social-toggle {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}

/* iOS-style toggle switch */
.toggle-track {
  position: relative;
  display: inline-block;
  width: 38px;
  height: 22px;
  border-radius: 11px;
  background: var(--c-border);
  transition: background 0.2s;
  flex-shrink: 0;
}

.social-toggle.enabled .toggle-track {
  background: var(--c-accent);
}

.toggle-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: left 0.2s;
}

.social-toggle.enabled .toggle-thumb {
  left: 19px;
}

.social-label-text {
  font-size: 13px;
  font-weight: 600;
  color: var(--c-text-primary);
}

.social-limit-note {
  font-size: 11px;
  color: var(--c-warning);
  background: var(--c-warning-light);
  padding: 2px 8px;
  border-radius: var(--c-radius-pill);
}

/* Custom Social */
.custom-social-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 14px;
}

.custom-social-row {
  display: grid;
  grid-template-columns: auto 1fr 1.5fr auto;
  gap: 10px;
  align-items: center;
  padding: 10px 12px;
  background: var(--c-bg);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-sm);
}

.social-toggle.compact {
  gap: 0;
}

.remove-custom-social {
  padding: 8px;
  background: none;
  border: none;
  color: var(--c-danger);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: background 0.15s;
}

.remove-custom-social:hover {
  background: var(--c-danger-light);
}

.add-more-social-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 16px;
  background: var(--c-surface);
  border: 1.5px dashed var(--c-border);
  border-radius: var(--c-radius-sm);
  font-size: 13px;
  font-weight: 600;
  color: var(--c-text-secondary);
  transition: all 0.15s;
}

.add-more-social-btn:hover:not(:disabled) {
  border-color: var(--c-accent);
  color: var(--c-accent);
  background: var(--c-accent-light);
}

.add-more-social-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.upgrade-hint {
  color: var(--c-warning);
  font-size: 11px;
}

/* ── Quill Editor ── */
.quill-editor {
  border-radius: var(--c-radius-sm);
  overflow: hidden;
}

:deep(.ql-toolbar) {
  border: 1.5px solid var(--c-border) !important;
  border-bottom: 1px solid var(--c-border) !important;
  border-radius: var(--c-radius-sm) var(--c-radius-sm) 0 0;
  background: var(--c-bg);
}

:deep(.ql-container) {
  border: 1.5px solid var(--c-border) !important;
  border-top: none !important;
  border-radius: 0 0 var(--c-radius-sm) var(--c-radius-sm);
  background: var(--c-surface);
  font-size: 14px;
  color: var(--c-text-primary);
  min-height: 120px;
}

:deep(.ql-editor) {
  min-height: 120px;
  color: var(--c-text-primary);
}

:deep(.ql-editor.ql-blank::before) {
  color: var(--c-text-muted);
  font-style: normal;
}

:deep(.ql-stroke) {
  stroke: var(--c-text-secondary) !important;
}

:deep(.ql-fill) {
  fill: var(--c-text-secondary) !important;
}

:deep(.ql-picker-label) {
  color: var(--c-text-secondary) !important;
}

:deep(.ql-picker-options) {
  background: var(--c-surface) !important;
  border-color: var(--c-border) !important;
}

/* ── Bottom Actions ── */
.form-bottom-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 24px 0 0;
}

.cancel-btn {
  padding: 11px 24px;
  background: var(--c-bg);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-sm);
  font-size: 14px;
  font-weight: 600;
  color: var(--c-text-secondary);
  transition: all 0.15s;
}

.cancel-btn:hover:not(:disabled) {
  border-color: var(--c-danger);
  color: var(--c-danger);
}

.save-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 28px;
  background: var(--c-accent);
  color: #fff;
  border: none;
  border-radius: var(--c-radius-sm);
  font-size: 14px;
  font-weight: 700;
  transition: background 0.15s, transform 0.12s;
}

.save-btn:hover:not(:disabled) {
  background: var(--c-accent-hover);
  transform: translateY(-1px);
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Spin animation */
.spin-icon {
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ═══════════════════════════════════════
   RESPONSIVE — TABLET
═══════════════════════════════════════ */
@media (max-width: 768px) {
  .list-view {
    padding: 16px;
  }

  .form-body {
    padding: 16px;
  }

  .form-topbar {
    padding: 12px 16px;
  }

  .plan-banner {
    padding: 10px 16px;
  }

  .back-label {
    display: none;
  }

  .company-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .fields-grid {
    grid-template-columns: 1fr;
  }

  .social-grid {
    grid-template-columns: 1fr;
  }

  .form-bottom-actions {
    flex-direction: column;
  }

  .cancel-btn, .save-btn {
    width: 100%;
    justify-content: center;
  }
}

/* ═══════════════════════════════════════
   RESPONSIVE — MOBILE
═══════════════════════════════════════ */
@media (max-width: 480px) {
  .list-view {
    padding: 12px;
  }

  .form-body {
    padding: 12px;
  }

  .form-topbar {
    padding: 10px 12px;
    gap: 8px;
  }

  .page-title {
    font-size: 18px;
  }

  .form-page-title {
    font-size: 15px;
  }

  .card-actions {
    flex-direction: column;
    gap: 6px;
  }

  .custom-social-row {
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto;
  }

  .custom-social-row .field-input:first-of-type {
    grid-column: 2;
  }

  .custom-social-row .field-input:last-of-type {
    grid-column: 1 / -1;
  }

  .remove-custom-social {
    grid-row: 1;
    grid-column: 3;
    display: none;
  }

  .link-type-chips {
    gap: 6px;
  }

  .type-chip {
    padding: 5px 10px;
    font-size: 11px;
  }

  .logo-upload-area {
    flex-direction: column;
  }

  .logo-dropzone {
    width: 100%;
  }

  .status-toggle-group {
    flex-direction: column;
    gap: 6px;
  }

  .form-bottom-actions {
    gap: 8px;
    padding-top: 16px;
  }

  .section-number {
    width: 24px;
    height: 24px;
    font-size: 10px;
  }

  .section-title {
    font-size: 14px;
  }

  .form-section {
    padding: 18px 0;
  }
}

/* ═══════════════════════════════════════
   TOUCH TARGETS
═══════════════════════════════════════ */
@media (hover: none) and (pointer: coarse) {
  .action-btn, .add-btn, .save-btn, .cancel-btn, .save-btn-top, .back-btn,
  .add-link-btn, .add-more-social-btn, .pag-btn, .search-clear {
    min-height: 44px;
  }

  input, select, textarea {
    font-size: 16px !important;
  }
}

/* ═══════════════════════════════════════
   ACCESSIBILITY
═══════════════════════════════════════ */
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition-duration: 0.01ms !important;
  }
}

/* Print */
@media print {
  .form-topbar, .card-actions, .pagination-bar, .add-btn {
    display: none;
  }
}
</style>
