<template>
  <div v-if="activeTab === 'contact'" :class="['contact-tab', { 'dark-mode': isDarkMode }]">

    <!-- ══════════════════════════════════ LIST VIEW ══════════════════════════════════ -->
    <div v-if="!showContactForm" class="list-view">

      <!-- Header -->
      <div class="list-header">
        <div class="list-header-left">
          <h2 class="page-title">Contacts</h2>
          <span class="count-pill">{{ contacts.length }} total</span>
        </div>
        <button
            v-if="contactCount < userLimits.contactLimit"
            class="add-btn"
            @click="showContactForm = true"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Contact
        </button>
        <div v-else class="limit-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          Limit Reached
        </div>
      </div>

      <!-- Search -->
      <div class="search-bar" v-if="contacts.length > 0">
        <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
            type="text"
            v-model="contactSearch"
            placeholder="Search by name, email, company…"
            class="search-input"
        />
        <button v-if="contactSearch" @click="contactSearch = ''" class="search-clear" type="button">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <!-- Contact Cards -->
      <div v-if="paginatedContacts.length > 0" class="contact-grid">
        <div
            v-for="c in paginatedContacts"
            :key="c.id"
            class="contact-card"
        >
          <!-- Card Top -->
          <div class="card-top">
            <div class="avatar-wrap">
              <img
                  v-if="c.photo"
                  :src="`${VITE_IMAGE_UPLOAD_URL}${c.photo}`"
                  :alt="`${c.firstName} ${c.lastName}`"
                  class="avatar-img"
              />
              <div v-else class="avatar-placeholder">
                {{ (c.firstName?.[0] || '') + (c.lastName?.[0] || '') }}
              </div>
            </div>
            <div class="card-identity">
              <h3 class="contact-name">{{ c.firstName }} {{ c.lastName }}</h3>
              <p class="contact-designation">{{ c.designation }}</p>
              <span class="company-tag" v-if="c.Company?.companyName">
                {{ c.Company.companyName }}
              </span>
            </div>
            <span :class="['status-dot', c.status === 'active' ? 'active' : 'inactive']">
              {{ c.status }}
            </span>
          </div>

          <!-- Card Body -->
          <div class="card-body">
            <div class="contact-meta">
              <div class="meta-row">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 11.9a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <a :href="`/${c.mobile?.replace(/\D/g,'')}`" target="_blank" class="meta-link">{{ c.mobile }}</a>
              </div>
              <div class="meta-row">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
                <span class="meta-text">{{ c.email }}</span>
              </div>
            </div>

            <!-- Quick Links Row -->
            <div class="quick-links">
              <a
                  v-if="c.whatsappChannel"
                  :href="c.whatsappChannel"
                  target="_blank"
                  class="quick-pill whatsapp-pill"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 11.5a8.5 8.5 0 1 1-3-6.5"/><path d="M16 8c-1.5-1.5-4-1-5 1s1 4 2 5 3 3 5 2 2.5-3.5 1-5"/>
                </svg>
                WA Channel
              </a>
            </div>

            <!-- Wallet Buttons -->
            <div class="wallet-row">
              <div class="wallet-group">
                <button class="wallet-btn google" @click="saveToGoogleWallet(c)" title="Save to Google Wallet">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="6" width="20" height="12" rx="2"/><path d="M16 12h4"/><circle cx="16" cy="12" r="1"/>
                  </svg>
                  G-Wallet
                </button>
                <button class="wallet-btn google-copy" @click="copyGoogleWalletLink(c)" title="Copy Google Wallet link">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                  G-Link
                </button>
              </div>
              <div class="wallet-group">
                <button
                    class="wallet-btn apple"
                    :class="{ disabled: !appleConfigured }"
                    @click="saveToAppleWallet(c)"
                    :title="appleConfigured ? 'Download Apple Wallet pass' : 'Apple Wallet not configured'"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"/>
                    <path d="M12 8v8M8 12l4-4 4 4"/>
                  </svg>
                  A-Wallet
                </button>
                <button
                    class="wallet-btn apple-copy"
                    :class="{ disabled: !appleConfigured }"
                    @click="copyAppleWalletLink(c)"
                    :title="appleConfigured ? 'Download .pkpass file' : 'Apple Wallet not configured'"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  A-File
                </button>
              </div>
            </div>
          </div>

          <!-- Card Actions -->
          <div class="card-actions">
            <a :href="`/${c.mobile?.replace(/\D/g,'')}`" target="_blank" rel="noopener" class="action-btn view-btn">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>
              </svg>
              View
            </a>
            <button class="action-btn qr-btn" @click="openQrPopup(c)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="5" height="5"/><rect x="16" y="3" width="5" height="5"/><rect x="3" y="16" width="5" height="5"/>
                <path d="M16 16h2v2h-2zM20 16h1v5h-5v-1"/>
              </svg>
              QR
            </button>
            <button class="action-btn edit-btn" @click="editContact(c)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 20h9"/><path d="M16.5 3.5l4 4L7 21H3v-4z"/>
              </svg>
              Edit
            </button>
            <button class="action-btn delete-btn" @click="deleteContact(c.id)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-2 14H7L5 6"/>
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Empty States -->
      <div v-else-if="contactSearch" class="empty-state">
        <div class="empty-icon-wrap">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
        <p class="empty-title">No results for "{{ contactSearch }}"</p>
        <p class="empty-sub">Try a different search term</p>
        <button @click="contactSearch = ''" class="empty-action-btn">Clear search</button>
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon-wrap">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <p class="empty-title">No contacts yet</p>
        <p class="empty-sub">Add your first contact to get started</p>
        <button @click="showContactForm = true" class="empty-action-btn" v-if="contactCount < userLimits.contactLimit">
          + Add Contact
        </button>
      </div>

      <!-- Pagination -->
      <div v-if="contactTotalPages > 1" class="pagination-bar">
        <button class="pag-btn arrow" @click="contactPage--" :disabled="contactPage === 1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <button
            v-for="page in contactTotalPages"
            :key="page"
            @click="contactPage = page"
            :class="['pag-btn', { active: contactPage === page }]"
        >{{ page }}</button>
        <button class="pag-btn arrow" @click="contactPage++" :disabled="contactPage === contactTotalPages">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- ══════════════════════════════════ FORM VIEW ══════════════════════════════════ -->
    <div v-else class="form-view">

      <!-- Sticky Top Bar -->
      <div class="form-topbar">
        <button @click="showContactForm = false; resetForm()" class="back-btn" type="button">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          <span class="back-label">Back</span>
        </button>
        <h2 class="form-page-title">{{ contactForm.id ? 'Edit Contact' : 'New Contact' }}</h2>
        <button @click="saveContact" class="save-btn-top" :disabled="saving" type="button">
          <svg v-if="!saving" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
            <polyline points="17 21 17 13 7 13 7 21"/>
          </svg>
          <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin-icon">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
          {{ saving ? 'Saving…' : 'Save' }}
        </button>
      </div>

      <!-- ── FIXED: Contact Type Selector using v-model binding ── -->
      <div class="type-selector-bar">
        <div class="type-selector-label">Contact Type</div>
        <div class="type-selector-group">
          <button
              type="button"
              :class="['type-tab', { active: contactType === 'individual' }]"
              @click="setContactType('individual')"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            <span>Individual</span>
            <span v-if="contactType === 'individual'" class="type-active-dot"></span>
          </button>
          <button
              type="button"
              :class="['type-tab', { active: contactType === 'group' }]"
              @click="setContactType('group')"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span>Group</span>
            <span v-if="contactType === 'group'" class="type-active-dot"></span>
          </button>
        </div>
        <!-- Current type indicator -->
        <div class="type-indicator">
          <span class="type-indicator-text">
            {{ contactType === 'individual' ? '👤 Individual contact form' : '👥 Group contact form' }}
          </span>
        </div>
      </div>

      <div class="form-body">

        <!-- ══════════ SHARED: Photo (both types) ══════════ -->
        <div class="form-section">
          <div class="section-label">
            <span class="section-number">01</span>
            <span class="section-title">Contact Photo</span>
          </div>
          <div class="photo-upload-area">
            <div v-if="photoPreview" class="photo-preview-wrap">
              <img :src="photoPreview" alt="Preview" class="photo-preview-img" />
              <button @click="removePhoto" class="photo-remove-btn" type="button">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <label for="photo-upload" class="photo-dropzone">
              <input type="file" @change="handlePhotoUpload" accept="image/*" id="photo-upload" class="hidden-file" />
              <div class="dropzone-inner">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <span class="dropzone-text">{{ photoPreview ? 'Change photo' : 'Upload photo' }}</span>
                <span class="dropzone-hint">PNG, JPG · Max 5MB · Square preferred</span>
              </div>
            </label>
          </div>
        </div>

        <!-- ══════════════════════════════════════
             INDIVIDUAL FORM
        ══════════════════════════════════════ -->
        <template v-if="contactType === 'individual'">

          <!-- ── SECTION 02: Basic Info ── -->
          <div class="form-section">
            <div class="section-label">
              <span class="section-number">02</span>
              <span class="section-title">Basic Information</span>
            </div>
            <div class="fields-grid">
              <div class="field-wrap">
                <label class="field-label">First Name <span class="req">*</span></label>
                <input v-model="contactForm.firstName" type="text" class="field-input" placeholder="John" required />
              </div>
              <div class="field-wrap">
                <label class="field-label">Last Name <span class="req">*</span></label>
                <input v-model="contactForm.lastName" type="text" class="field-input" placeholder="Doe" required />
              </div>
              <div class="field-wrap">
                <label class="field-label">Email <span class="req">*</span></label>
                <input v-model="contactForm.email" type="email" class="field-input" placeholder="john@example.com" required />
              </div>
              <div class="field-wrap">
                <label class="field-label">Designation <span class="req">*</span></label>
                <input v-model="contactForm.designation" type="text" class="field-input" placeholder="e.g. Sales Manager" required />
              </div>
              <div class="field-wrap">
                <label class="field-label">Company</label>
                <select v-model="contactForm.companyId" class="field-input field-select">
                  <option disabled value="">Select a company</option>
                  <option v-for="company in userCompanies" :key="company.id" :value="company.id">
                    {{ company.companyName }}
                  </option>
                </select>
                <p v-if="userCompanies.length === 0" class="field-note warning">
                  ⚠️ No active companies. Please create or activate one first.
                </p>
              </div>
              <div class="field-wrap">
                <label class="field-label">Status <span class="req">*</span></label>
                <div class="status-toggle-group">
                  <button type="button" :class="['status-toggle-btn', { active: contactForm.status === 'active' }]" @click="contactForm.status = 'active'">
                    <span class="toggle-dot active-dot"></span> Active
                  </button>
                  <button type="button" :class="['status-toggle-btn', { active: contactForm.status === 'inactive' }]" @click="contactForm.status = 'inactive'">
                    <span class="toggle-dot inactive-dot"></span> Inactive
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- ── SECTION 03: Phone Numbers (Individual) ── -->
          <div class="form-section">
            <div class="section-label">
              <span class="section-number">03</span>
              <span class="section-title">Phone Numbers</span>
            </div>
            <div class="fields-grid">
              <!-- Mobile -->
              <div class="field-wrap full">
                <label class="field-label">Mobile <span class="req">*</span></label>
                <div class="phone-row">
                  <CountryCodeDropdown v-model="mobileCountryCode" class="country-code-picker" />
                  <input v-model="contactForm.mobile" type="tel" class="field-input phone-num-input" placeholder="Enter mobile number" @input="handleContactMobile" required />
                </div>
                <p v-if="phoneValidation.mobile.message && !checkingMobile" class="field-note" :class="phoneValidation.mobile.isValid ? 'success' : 'error'">
                  {{ phoneValidation.mobile.message }}
                </p>
                <p v-if="mobileExistsMessage" class="field-note" :class="mobileExists ? 'error' : checkingMobile ? 'info' : 'success'">
                  {{ mobileExistsMessage }}
                </p>
              </div>

              <!-- Public Card URL -->
              <div class="field-wrap full">
                <label class="field-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                  </svg>
                  Public Card URL
                </label>
                <div class="url-preview-row">
                  <input type="text" :value="publicCardUrl" readonly class="field-input url-readonly" @click="$event.target.select()" />
                  <button @click="copyPublicCardUrl" class="url-icon-btn copy" type="button" title="Copy URL">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                  </button>
                  <a v-if="contactForm.mobile && phoneValidation.mobile.isValid" :href="publicCardUrl" target="_blank" class="url-icon-btn open" title="Open card">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </a>
                </div>
              </div>

              <!-- Telephone -->
              <div class="field-wrap">
                <label class="field-label">Telephone</label>
                <div class="phone-row">
                  <CountryCodeDropdown v-model="telephoneCountryCode" class="country-code-picker" />
                  <input v-model="contactForm.telephone" type="tel" class="field-input phone-num-input" placeholder="Landline / alternate" @input="handleContactTelephone" />
                </div>
                <p v-if="phoneValidation.telephone.message" class="field-note" :class="phoneValidation.telephone.isValid ? 'success' : 'error'">
                  {{ phoneValidation.telephone.message }}
                </p>
              </div>

              <!-- WhatsApp -->
              <div class="field-wrap">
                <label class="field-label">
                  WhatsApp
                  <label class="same-toggle">
                    <input type="checkbox" v-model="whatsappSameAsMobile" class="hidden-check" />
                    <span class="same-toggle-track" :class="{ 'toggle-on': whatsappSameAsMobile }">
                      <span class="same-toggle-thumb" :class="{ 'thumb-on': whatsappSameAsMobile }"></span>
                    </span>
                    Same as mobile
                  </label>
                </label>
                <div class="phone-row">
                  <CountryCodeDropdown v-model="whatsappCountryCode" :disabled="whatsappSameAsMobile" class="country-code-picker" />
                  <input
                      v-model="contactForm.whatsapp"
                      type="tel"
                      class="field-input phone-num-input"
                      placeholder="WhatsApp number"
                      @input="handleContactWhatsApp"
                      :disabled="whatsappSameAsMobile"
                  />
                </div>
                <p v-if="phoneValidation.whatsapp.message && !whatsappSameAsMobile" class="field-note" :class="phoneValidation.whatsapp.isValid ? 'success' : 'error'">
                  {{ phoneValidation.whatsapp.message }}
                </p>
              </div>

              <!-- WhatsApp Channel -->
              <div class="field-wrap full">
                <label class="field-label">WhatsApp Channel Link</label>
                <div class="input-icon-wrap">
                  <svg class="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 11.5a8.5 8.5 0 1 1-3-6.5"/><path d="M16 8c-1.5-1.5-4-1-5 1s1 4 2 5 3 3 5 2 2.5-3.5 1-5"/>
                  </svg>
                  <input v-model="contactForm.whatsappChannel" type="url" class="field-input icon-padded" placeholder="https://whatsapp.com/channel/..." />
                </div>
                <p class="field-note info-note">📢 Optional — your WhatsApp Channel invite link</p>
              </div>
            </div>
          </div>

        </template><!-- /individual -->

        <!-- ══════════════════════════════════════
             GROUP FORM
        ══════════════════════════════════════ -->
        <template v-else-if="contactType === 'group'">

          <!-- ── SECTION 02: Basic Info (Group) ── -->
          <div class="form-section">
            <div class="section-label">
              <span class="section-number">02</span>
              <span class="section-title">Group Information</span>
            </div>
            <div class="fields-grid">
              <div class="field-wrap">
                <label class="field-label">First Name <span class="req">*</span></label>
                <input v-model="contactForm.firstName" type="text" class="field-input" placeholder="John" required />
              </div>
              <div class="field-wrap">
                <label class="field-label">Last Name <span class="req">*</span></label>
                <input v-model="contactForm.lastName" type="text" class="field-input" placeholder="Doe" required />
              </div>
              <div class="field-wrap">
                <label class="field-label">Email <span class="req">*</span></label>
                <input v-model="contactForm.email" type="email" class="field-input" placeholder="group@example.com" required />
              </div>
              <div class="field-wrap">
                <label class="field-label">Designation <span class="req">*</span></label>
                <input v-model="contactForm.designation" type="text" class="field-input" placeholder="e.g. Team Lead" required />
              </div>
              <div class="field-wrap">
                <label class="field-label">Company</label>
                <select v-model="contactForm.companyId" class="field-input field-select">
                  <option disabled value="">Select a company</option>
                  <option v-for="company in userCompanies" :key="company.id" :value="company.id">
                    {{ company.companyName }}
                  </option>
                </select>
                <p v-if="userCompanies.length === 0" class="field-note warning">
                  ⚠️ No active companies.
                </p>
              </div>
              <div class="field-wrap">
                <label class="field-label">Status <span class="req">*</span></label>
                <div class="status-toggle-group">
                  <button type="button" :class="['status-toggle-btn', { active: contactForm.status === 'active' }]" @click="contactForm.status = 'active'">
                    <span class="toggle-dot active-dot"></span> Active
                  </button>
                  <button type="button" :class="['status-toggle-btn', { active: contactForm.status === 'inactive' }]" @click="contactForm.status = 'inactive'">
                    <span class="toggle-dot inactive-dot"></span> Inactive
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- ── SECTION 03: Contact Details (Group) ── -->
          <div class="form-section">
            <div class="section-label">
              <span class="section-number">03</span>
              <span class="section-title">Contact Details</span>
            </div>
            <div class="fields-grid">
              <!-- Mobile -->
              <div class="field-wrap full">
                <label class="field-label">Mobile <span class="req">*</span></label>
                <div class="phone-row">
                  <CountryCodeDropdown v-model="mobileCountryCode" class="country-code-picker" />
                  <input v-model="contactForm.mobile" type="tel" class="field-input phone-num-input" placeholder="Enter mobile number" @input="handleContactMobile" required />
                </div>
                <p v-if="phoneValidation.mobile.message && !checkingMobile" class="field-note" :class="phoneValidation.mobile.isValid ? 'success' : 'error'">
                  {{ phoneValidation.mobile.message }}
                </p>
                <p v-if="mobileExistsMessage" class="field-note" :class="mobileExists ? 'error' : checkingMobile ? 'info' : 'success'">
                  {{ mobileExistsMessage }}
                </p>
              </div>

              <!-- Public Card URL -->
              <div class="field-wrap full">
                <label class="field-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                  </svg>
                  Public Card URL
                </label>
                <div class="url-preview-row">
                  <input type="text" :value="publicCardUrl" readonly class="field-input url-readonly" @click="$event.target.select()" />
                  <button @click="copyPublicCardUrl" class="url-icon-btn copy" type="button" title="Copy URL">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                  </button>
                  <a v-if="contactForm.mobile && phoneValidation.mobile.isValid" :href="publicCardUrl" target="_blank" class="url-icon-btn open" title="Open card">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </a>
                </div>
              </div>

              <!-- WhatsApp Channel -->
              <div class="field-wrap full">
                <label class="field-label">WhatsApp Channel Link</label>
                <div class="input-icon-wrap">
                  <svg class="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 11.5a8.5 8.5 0 1 1-3-6.5"/><path d="M16 8c-1.5-1.5-4-1-5 1s1 4 2 5 3 3 5 2 2.5-3.5 1-5"/>
                  </svg>
                  <input v-model="contactForm.whatsappChannel" type="url" class="field-input icon-padded" placeholder="https://whatsapp.com/channel/..." />
                </div>
                <p class="field-note info-note">📢 Optional — your WhatsApp Channel invite link</p>
              </div>
            </div>
          </div>

        </template><!-- /group -->

        <!-- ── Bottom Actions ── -->
        <div class="form-bottom-actions">
          <button @click="showContactForm = false; resetForm()" class="cancel-btn" :disabled="saving" type="button">Cancel</button>
          <button @click="saveContact" class="save-btn" :disabled="saving" type="button">
            <svg v-if="!saving" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/>
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin-icon">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            {{ saving ? 'Saving…' : contactType === 'group' ? 'Save Group Contact' : 'Save Contact' }}
          </button>
        </div>

      </div><!-- /form-body -->
    </div><!-- /form-view -->

    <!-- ══════════════════════════════════ QR POPUP ══════════════════════════════════ -->
    <transition name="modal-fade">
      <div v-if="showQrPopup" class="qr-overlay" @click.self="showQrPopup = false">
        <div :class="['qr-modal', { 'dark-mode': isDarkMode }]">
          <div class="qr-modal-header">
            <h3 class="qr-modal-title">QR Code</h3>
            <button class="qr-close-btn" @click="showQrPopup = false" type="button">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <p class="qr-modal-name">{{ qrName }}</p>
          <div class="qr-canvas-wrap">
            <canvas ref="qrCanvas"></canvas>
          </div>
          <p class="qr-modal-url">{{ qrUrl }}</p>
          <div class="qr-modal-actions">
            <button class="qr-action-btn download" @click="downloadQr" type="button">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download
            </button>
            <button class="qr-action-btn share" @click="sharePoster" type="button">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
              Share Poster
            </button>
          </div>
        </div>
      </div>
    </transition>

    <ImageCropperModal
        :show="showCropperModal"
        :image-src="tempImageSrc"
        :type="cropperType"
        :title="cropperType === 'photo' ? 'Crop Contact Photo' : 'Crop Image'"
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
import { computed, inject, nextTick, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api.js';
import { API_BASE_URL, VITE_FRONTEND_URL, VITE_IMAGE_UPLOAD_URL } from '@/config.js';
import CountryCodeDropdown from '@/components/CountryCodeDropdown.vue';
import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';
import QRCode from 'qrcode';
import ImageCropperModal from '@/components/ImageCropper.vue';
import AlertModal from '@/components/user/AlertModal.vue';          // ← NEW
import { useAlert } from '@/composables/useAlert.js';               // ← NEW

const router = useRouter();
const isDarkMode = inject('isDarkMode', ref(false));

const props = defineProps({
  activeTab: { type: String, required: true },
  contactCount: { type: Number, required: true },
  userLimits: { type: Object, required: true }
});

const emit = defineEmits(['contact-added', 'contact-deleted', 'contact-updated']);

// ── Alert composable ──────────────────────────────────────────────── ← NEW
const { alertState, showAlert, showConfirm } = useAlert();

// ── State ──
const contactType = ref('individual');
const contacts = ref([]);
const userCompanies = ref([]);
const showContactForm = ref(false);
const contactSearch = ref('');
const contactPage = ref(1);
const contactPerPage = ref(9);
const saving = ref(false);

const photoPreview = ref(null);
const photoFileName = ref('');
const telephoneCountryCode = ref('+1');
const mobileCountryCode = ref('+1');
const whatsappCountryCode = ref('+1');
const whatsappSameAsMobile = ref(true);
const mobileExistsMessage = ref('');
const mobileExists = ref(false);
const checkingMobile = ref(false);
let mobileCheckTimeout = null;

const showQrPopup = ref(false);
const qrCanvas = ref(null);
const qrUrl = ref('');
const qrName = ref('');

const showCropperModal = ref(false);
const tempImageSrc = ref('');
const cropperType = ref('photo');
const appleConfigured = ref(false);

const phoneValidation = ref({
  telephone: { isValid: false, message: '' },
  mobile: { isValid: false, message: '' },
  whatsapp: { isValid: false, message: '' }
});

const contactForm = ref({
  id: null, firstName: '', lastName: '', telephone: '', mobile: '',
  whatsapp: '', whatsappChannel: '', email: '', designation: '',
  companyId: '', photo: null, status: 'active', existingPhotoPath: null
});

// ── FIXED: Explicit setter for contactType to ensure reactivity ──
function setContactType(type) {
  contactType.value = type;
}

// ── Computed ──
const filteredContacts = computed(() => {
  if (!contactSearch.value.trim()) return contacts.value;
  const q = contactSearch.value.toLowerCase();
  return contacts.value.filter(c =>
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
      c.mobile?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.designation?.toLowerCase().includes(q) ||
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

const publicCardUrl = computed(() => {
  const base = VITE_FRONTEND_URL || 'https://tapmy.name/';
  if (!contactForm.value.mobile || !mobileCountryCode.value) return `${base}/`;
  const clean = contactForm.value.mobile.replace(/\D/g, '');
  if (!clean) return `${base}/`;
  const code = mobileCountryCode.value.replace(/\+/g, '');
  return `${base}/${code}${clean}`;
});

// ── Helpers ──
function validatePhone(value, countryCode) {
  try {
    const digits = value.replace(/\D/g, '');
    const full = `${countryCode}${digits}`;
    if (isValidPhoneNumber(full)) {
      const p = parsePhoneNumber(full);
      return { isValid: true, formatted: p.formatInternational(), national: p.formatNational(), e164: p.format('E.164'), countryCode: p.country, type: p.getType() };
    }
    return { isValid: false, error: 'Invalid phone number' };
  } catch (e) {
    return { isValid: false, error: e.message };
  }
}

function buildWalletContact(c) {
  const cleaned = c.cardMobileNum || c.mobile;
  const shareUrl = `${window.location.origin}/${cleaned.replace(/\D/g, '')}`;
  const companyLogo = c.Company?.logo ? (c.Company.logo.startsWith('http') ? c.Company.logo : `${VITE_IMAGE_UPLOAD_URL}${c.Company.logo}`) : '';
  const photo = c.photo ? (c.photo.startsWith('http') ? c.photo : `${VITE_IMAGE_UPLOAD_URL}${c.photo}`) : '';
  return {
    name: `${c.firstName} ${c.lastName}`, firstName: c.firstName, lastName: c.lastName,
    phone: cleaned, email: c.email, designation: c.designation || '',
    companyName: c.Company?.companyName || '', companyLogo, photo,
    website: c.Company?.website || '', address: c.Company?.streetAddress || '',
    whatsapp: c.whatsapp || '', shareUrl, googleReview: c.Company?.googleReviews || '',
    tripAdvisor: c.Company?.tripAdvisor || ''
  };
}

// ── Data Loading ──
async function loadContacts() {
  try {
    const res = await api.get('/dashboard/data', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    contacts.value = res.data.contacts || [];
    userCompanies.value = res.data.companies || [];
    emit('contact-added', contacts.value.length);
  } catch {
    await showAlert({                                                   // ← NEW
      type: 'error',
      title: 'Failed to Load',
      message: 'Could not load your contacts. Please refresh the page.',
      confirmLabel: 'OK'
    });
  }
}

async function checkAppleWalletStatus() {
  try {
    const res = await api.get('/wallet/apple/status');
    appleConfigured.value = res.data?.configured ?? false;
  } catch { appleConfigured.value = false; }
}

// ── Wallet ──
async function saveToGoogleWallet(contact) {
  try {
    const walletContact = buildWalletContact(contact);
    const res = await api.post('/wallet/google/save-url', { contact: walletContact, objectIdSuffix: `contact_${contact.id}` });
    if (res.data.saveUrl) {
      try { await api.post(`/wallet/google/track/${walletContact.phone.replace(/\D/g,'')}`, { userAgent: navigator.userAgent }); } catch {}
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        window.location.href = res.data.saveUrl;
      } else {
        const w = window.open(res.data.saveUrl, '_blank');
        if (!w) window.location.href = res.data.saveUrl;
      }
    } else {
      await showAlert({ type: 'error', title: 'Wallet Error', message: 'Could not generate Google Wallet link.', confirmLabel: 'OK' }); // ← NEW
    }
  } catch (e) {
    await showAlert({ type: 'error', title: 'Wallet Error', message: e.response?.data?.message || 'Failed to generate Google Wallet link.', confirmLabel: 'OK' }); // ← NEW
  }
}

async function copyGoogleWalletLink(contact) {
  try {
    const res = await api.post('/wallet/google/save-url', { contact: buildWalletContact(contact), objectIdSuffix: `contact_${contact.id}` });
    if (res.data.saveUrl) {
      await navigator.clipboard.writeText(res.data.saveUrl);
      await showAlert({ type: 'success', title: 'Link Copied!', message: 'Google Wallet link copied! Send it to anyone — they tap to add to their wallet.', confirmLabel: 'Great!' }); // ← NEW
    } else {
      await showAlert({ type: 'error', title: 'Wallet Error', message: 'Could not generate Google Wallet link.', confirmLabel: 'OK' }); // ← NEW
    }
  } catch (e) {
    await showAlert({ type: 'error', title: 'Wallet Error', message: e.response?.data?.message || 'Failed to generate Google Wallet link.', confirmLabel: 'OK' }); // ← NEW
  }
}

async function saveToAppleWallet(contact) {
  if (!appleConfigured.value) {
    await showAlert({ type: 'warning', title: 'Not Configured', message: 'Apple Wallet is not configured yet.', confirmLabel: 'OK' }); // ← NEW
    return;
  }
  try {
    const response = await api.post('/wallet/apple/pass', { contact: buildWalletContact(contact) }, { responseType: 'blob' });
    const blob = new Blob([response.data], { type: 'application/vnd.apple.pkpass' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(contact.firstName || 'card')}_${(contact.lastName || '')}.pkpass`.replace(/\s+/g, '_');
    document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(url);
  } catch (err) {
    let message = 'Failed to download Apple Wallet pass.';
    if (err.response?.data instanceof Blob) {
      try { const t = await err.response.data.text(); const j = JSON.parse(t); message = j.message || message; } catch {}
    } else { message = err.response?.data?.message || err.message || message; }
    await showAlert({ type: 'error', title: 'Apple Wallet Error', message, confirmLabel: 'OK' }); // ← NEW
  }
}

async function copyAppleWalletLink(contact) {
  if (!appleConfigured.value) {
    await showAlert({ type: 'warning', title: 'Not Configured', message: 'Apple Wallet is not configured yet.', confirmLabel: 'OK' }); // ← NEW
    return;
  }
  try {
    const response = await api.post('/wallet/apple/pass', { contact: buildWalletContact(contact) }, { responseType: 'blob' });
    const blob = new Blob([response.data], { type: 'application/vnd.apple.pkpass' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${contact.firstName || 'card'}_${contact.lastName || ''}_wallet.pkpass`.replace(/\s+/g, '_');
    document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(url);
  } catch (err) {
    let message = 'Failed to download Apple Wallet pass.';
    if (err.response?.data instanceof Blob) {
      try { const t = await err.response.data.text(); const j = JSON.parse(t); message = j.message || message; } catch {}
    } else { message = err.response?.data?.message || err.message || message; }
    await showAlert({ type: 'error', title: 'Apple Wallet Error', message, confirmLabel: 'OK' }); // ← NEW
  }
}

// ── Form ──
function resetForm() {
  contactType.value = 'individual';
  contactForm.value = { id: null, firstName: '', lastName: '', telephone: '', mobile: '', whatsapp: '', whatsappChannel: '', email: '', designation: '', companyId: '', photo: null, status: 'active', existingPhotoPath: null };
  photoPreview.value = null; photoFileName.value = '';
  telephoneCountryCode.value = '+1'; mobileCountryCode.value = '+1'; whatsappCountryCode.value = '+1';
  whatsappSameAsMobile.value = true; mobileExistsMessage.value = ''; mobileExists.value = false;
  phoneValidation.value = { telephone: { isValid: false, message: '' }, mobile: { isValid: false, message: '' }, whatsapp: { isValid: false, message: '' } };
}

async function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    await showAlert({ type: 'error', title: 'Invalid File', message: 'Please select an image file (PNG, JPG, etc.).', confirmLabel: 'OK' }); // ← NEW
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    await showAlert({ type: 'warning', title: 'File Too Large', message: 'Image size must be less than 5MB.', confirmLabel: 'OK' }); // ← NEW
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => { tempImageSrc.value = e.target.result; cropperType.value = 'photo'; showCropperModal.value = true; };
  reader.readAsDataURL(file);
}

function handleCroppedImage(blob) {
  const fileName = `cropped_photo_${Date.now()}.jpg`;
  const croppedFile = new File([blob], fileName, { type: 'image/jpeg' });
  photoFileName.value = fileName;
  contactForm.value.photo = croppedFile;
  photoPreview.value = URL.createObjectURL(blob);
  showCropperModal.value = false; tempImageSrc.value = '';
  const fi = document.getElementById('photo-upload');
  if (fi) fi.value = '';
}

function removePhoto() {
  contactForm.value.photo = null; contactForm.value.existingPhotoPath = null;
  photoPreview.value = null; photoFileName.value = ''; tempImageSrc.value = '';
  const fi = document.getElementById('photo-upload');
  if (fi) fi.value = '';
}

function handleContactTelephone(event) {
  const value = event.target.value.replace(/\D/g, '');
  contactForm.value.telephone = value;
  if (value.length > 0) {
    const v = validatePhone(value, telephoneCountryCode.value);
    phoneValidation.value.telephone = { isValid: v.isValid, message: v.isValid ? `✅ Valid ${v.type || 'phone'} number` : `⚠️ ${v.error}` };
  } else { phoneValidation.value.telephone = { isValid: false, message: '' }; }
}

function handleContactMobile(event) {
  const value = event.target.value.replace(/\D/g, '');
  contactForm.value.mobile = value;
  if (value.length > 0) {
    const v = validatePhone(value, mobileCountryCode.value);
    phoneValidation.value.mobile = { isValid: v.isValid, message: v.isValid ? `✅ Valid ${v.type || 'phone'} number` : `⚠️ ${v.error}` };
    if (v.isValid) checkMobileDuplicate();
  } else { phoneValidation.value.mobile = { isValid: false, message: '' }; mobileExistsMessage.value = ''; mobileExists.value = false; }
  if (whatsappSameAsMobile.value) { contactForm.value.whatsapp = value; whatsappCountryCode.value = mobileCountryCode.value; phoneValidation.value.whatsapp = phoneValidation.value.mobile; }
}

function handleContactWhatsApp(event) {
  const value = event.target.value.replace(/\D/g, '');
  contactForm.value.whatsapp = value;
  if (value.length > 0) {
    const v = validatePhone(value, whatsappCountryCode.value);
    phoneValidation.value.whatsapp = { isValid: v.isValid, message: v.isValid ? `✅ Valid ${v.type || 'phone'} number` : `⚠️ ${v.error}` };
  } else { phoneValidation.value.whatsapp = { isValid: false, message: '' }; }
}

async function checkMobileDuplicate() {
  clearTimeout(mobileCheckTimeout);
  const v = validatePhone(contactForm.value.mobile, mobileCountryCode.value);
  if (!v.isValid) { mobileExistsMessage.value = ''; mobileExists.value = false; return; }
  mobileCheckTimeout = setTimeout(async () => {
    try {
      checkingMobile.value = true; mobileExistsMessage.value = '🔍 Checking availability…';
      const res = await api.post('/dashboard/check-contact-mobile', { mobile: v.e164, contactId: contactForm.value.id || null });
      if (res.data.exists) { mobileExists.value = true; mobileExistsMessage.value = '❌ This mobile number is already registered!'; }
      else { mobileExists.value = false; mobileExistsMessage.value = '✅ Number available'; }
    } catch { mobileExists.value = false; mobileExistsMessage.value = '⚠️ Error validating number.'; }
    finally { checkingMobile.value = false; }
  }, 500);
}

async function copyPublicCardUrl() {
  if (!contactForm.value.mobile) {
    await showAlert({ type: 'warning', title: 'No Number', message: 'Please enter a mobile number first.', confirmLabel: 'OK' }); // ← NEW
    return;
  }
  try {
    await navigator.clipboard.writeText(publicCardUrl.value);
    await showAlert({ type: 'success', title: 'Copied!', message: 'Public card URL copied to clipboard.', confirmLabel: 'OK' }); // ← NEW
  } catch {
    await showAlert({ type: 'error', title: 'Copy Failed', message: 'Failed to copy URL. Please try manually.', confirmLabel: 'OK' }); // ← NEW
  }
}

function editContact(contact) {
  resetForm();
  contactType.value = contact.type || 'individual';
  const extractNumber = (fullNumber) => {
    if (!fullNumber) return '';
    try { return parsePhoneNumber(fullNumber).nationalNumber; } catch { return fullNumber.replace(/\D/g, ''); }
  };
  contactForm.value = {
    id: contact.id, firstName: contact.firstName, lastName: contact.lastName,
    telephone: extractNumber(contact.telephone), mobile: extractNumber(contact.mobile),
    whatsapp: extractNumber(contact.whatsapp || contact.mobile), whatsappChannel: contact.whatsappChannel || '',
    email: contact.email, designation: contact.designation, companyId: contact.companyId,
    status: contact.status, photo: null, existingPhotoPath: contact.photo
  };
  try {
    if (contact.mobile) { const m = parsePhoneNumber(contact.mobile); mobileCountryCode.value = `+${m.countryCallingCode}`; }
    if (contact.telephone) { const t = parsePhoneNumber(contact.telephone); telephoneCountryCode.value = `+${t.countryCallingCode}`; }
    if (contact.whatsapp) { const w = parsePhoneNumber(contact.whatsapp); whatsappCountryCode.value = `+${w.countryCallingCode}`; whatsappSameAsMobile.value = contact.whatsapp === contact.mobile; }
    else { whatsappSameAsMobile.value = true; whatsappCountryCode.value = mobileCountryCode.value; }
  } catch {}
  if (contact.photo) { photoPreview.value = `${VITE_IMAGE_UPLOAD_URL}${contact.photo}`; photoFileName.value = contact.photo.split('/').pop(); }
  showContactForm.value = true;
}

// ── Save ─────────────────────────────────────────────────────────── ← NEW (all alerts replaced)
async function saveContact() {
  const mobileVal = validatePhone(contactForm.value.mobile, mobileCountryCode.value);
  if (!mobileVal.isValid) {
    await showAlert({ type: 'warning', title: 'Invalid Mobile', message: `Mobile number error: ${mobileVal.error}`, confirmLabel: 'OK' });
    return;
  }
  if (mobileExists.value) {
    await showAlert({ type: 'error', title: 'Duplicate Number', message: 'This mobile number is already registered.', confirmLabel: 'OK' });
    return;
  }

  let telephoneE164 = null;
  if (contactForm.value.telephone) {
    const telV = validatePhone(contactForm.value.telephone, telephoneCountryCode.value);
    if (!telV.isValid) {
      await showAlert({ type: 'warning', title: 'Invalid Telephone', message: `Telephone error: ${telV.error}`, confirmLabel: 'OK' });
      return;
    }
    telephoneE164 = telV.e164;
  }

  let whatsappE164 = mobileVal.e164;
  if (!whatsappSameAsMobile.value && contactForm.value.whatsapp) {
    const wV = validatePhone(contactForm.value.whatsapp, whatsappCountryCode.value);
    if (!wV.isValid) {
      await showAlert({ type: 'warning', title: 'Invalid WhatsApp', message: `WhatsApp error: ${wV.error}`, confirmLabel: 'OK' });
      return;
    }
    whatsappE164 = wV.e164;
  }

  if (contactForm.value.whatsappChannel?.trim() && !/^https?:\/\/.+/i.test(contactForm.value.whatsappChannel.trim())) {
    await showAlert({ type: 'warning', title: 'Invalid URL', message: 'WhatsApp Channel must be a valid URL starting with http:// or https://', confirmLabel: 'OK' });
    return;
  }

  saving.value = true;
  try {
    const fd = new FormData();
    fd.append('type', contactType.value);
    fd.append('firstName', contactForm.value.firstName);
    fd.append('lastName', contactForm.value.lastName);
    fd.append('mobile', mobileVal.e164);
    fd.append('whatsapp', whatsappE164);
    fd.append('whatsappChannel', contactForm.value.whatsappChannel || '');
    fd.append('email', contactForm.value.email);
    fd.append('designation', contactForm.value.designation);
    fd.append('companyId', contactForm.value.companyId || '');
    fd.append('status', contactForm.value.status);
    if (telephoneE164) fd.append('telephone', telephoneE164);
    if (contactForm.value.photo instanceof File) fd.append('photo', contactForm.value.photo);

    const isUpdate = !!contactForm.value.id;
    const url = isUpdate
        ? `${API_BASE_URL}/api/dashboard/contact/${contactForm.value.id}`
        : `${API_BASE_URL}/api/dashboard/contact`;

    const response = await fetch(url, {
      method: isUpdate ? 'PUT' : 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: fd
    });
    const data = await response.json();

    if (response.ok) {
      await showAlert({                                                 // ← NEW
        type: 'success',
        title: isUpdate ? 'Contact Updated!' : 'Contact Created!',
        message: isUpdate
            ? 'Contact details have been updated successfully.'
            : 'New contact has been created successfully.',
        confirmLabel: 'Great!'
      });
      await loadContacts();
      showContactForm.value = false;
      resetForm();
      emit(isUpdate ? 'contact-updated' : 'contact-added');
    } else {
      await showAlert({ type: 'error', title: 'Save Failed', message: data.message || 'Failed to save contact. Please try again.', confirmLabel: 'OK' }); // ← NEW
    }
  } catch (err) {
    await showAlert({ type: 'error', title: 'Save Failed', message: err.message || 'Something went wrong. Please try again.', confirmLabel: 'OK' }); // ← NEW
  } finally {
    saving.value = false;
  }
}

// ── Delete ───────────────────────────────────────────────────────── ← NEW (confirm + alert replaced)
async function deleteContact(contactId) {
  const confirmed = await showConfirm({
    type: 'danger',
    title: 'Delete Contact?',
    message: 'This action cannot be undone. All data associated with this contact will be permanently removed.',
    confirmLabel: 'Delete',
    cancelLabel: 'Cancel'
  });

  if (!confirmed) return;

  try {
    await api.delete(`/dashboard/contact/${contactId}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    await showAlert({
      type: 'success',
      title: 'Contact Deleted',
      message: 'The contact has been permanently removed.',
      confirmLabel: 'OK'
    });
    emit('contact-deleted');
    await loadContacts();
  } catch {
    await showAlert({
      type: 'error',
      title: 'Delete Failed',
      message: 'Could not delete the contact. Please try again.',
      confirmLabel: 'OK'
    });
  }
}

async function openQrPopup(contact) {
  const phone = contact.mobile.replace(/\D/g, '');
  qrUrl.value = `${VITE_FRONTEND_URL}/${phone}`;
  qrName.value = `${contact.firstName} ${contact.lastName}`;
  showQrPopup.value = true;
  await nextTick();
  await QRCode.toCanvas(qrCanvas.value, qrUrl.value, { width: 240, margin: 2, color: { dark: '#1a1410', light: '#ffffff' } });
}

function downloadQr() {
  const canvas = qrCanvas.value;
  if (!canvas) return;
  const link = document.createElement('a');
  link.download = `${qrName.value}-qr.png`;
  link.href = canvas.toDataURL();
  link.click();
}

async function sharePoster() {
  const qr = qrCanvas.value;
  if (!qr) return;
  const poster = document.createElement('canvas');
  poster.width = 600; poster.height = 900;
  const ctx = poster.getContext('2d');
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, poster.width, poster.height);
  ctx.drawImage(qr, poster.width / 2 - 160, 120, 320, 320);
  ctx.fillStyle = '#1a1410'; ctx.font = 'bold 28px system-ui'; ctx.textAlign = 'center';
  ctx.fillText('Scan to view my', poster.width / 2, 510);
  ctx.fillText('Digital Business Card', poster.width / 2, 550);
  poster.toBlob(async (blob) => {
    const file = new File([blob], `${qrName.value}-digital-card.png`, { type: 'image/png' });
    if (navigator.share) {
      try { await navigator.share({ title: 'My Digital Business Card', text: 'Scan this QR to view my Digital Card!', files: [file] }); } catch {}
    } else {
      await showAlert({ type: 'info', title: 'Not Supported', message: 'Sharing is not supported on this device.', confirmLabel: 'OK' }); // ← NEW
    }
  });
}

// ── Watchers ──
watch([() => contactForm.value.mobile, () => mobileCountryCode.value], ([newMobile, newCode]) => {
  if (whatsappSameAsMobile.value && newMobile) { contactForm.value.whatsapp = newMobile; whatsappCountryCode.value = newCode; phoneValidation.value.whatsapp = phoneValidation.value.mobile; }
});

watch(() => props.activeTab, (newTab) => { if (newTab === 'contact' && contacts.value.length === 0) loadContacts(); });

onMounted(() => { if (props.activeTab === 'contact') loadContacts(); checkAppleWalletStatus(); });
</script>

<style scoped>
/* ══════════════════════════════════════
   CSS CUSTOM PROPERTIES — Refined Professional Palette
══════════════════════════════════════ */
.contact-tab {
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
  --c-google: #1e5c26;
  --c-google-light: #eaf5eb;
  --c-google-copy: #0a4a8e;
  --c-google-copy-light: #e6f0fb;
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

.contact-tab.dark-mode {
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
  --c-google: #70c880;
  --c-google-light: #101e12;
  --c-google-copy: #60a8e8;
  --c-google-copy-light: #101c2e;
}

*, *::before, *::after { box-sizing: border-box; }
button { font-family: inherit; cursor: pointer; }
input, select, textarea { font-family: inherit; }
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
  border-radius: 0.5rem;
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

/* Search */
.search-bar {
  position: relative;
  margin-bottom: 24px;
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--c-text-muted);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 12px 44px 12px 44px;
  background: var(--c-surface);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-sm);
  font-size: 14px;
  color: var(--c-text-primary);
  transition: border-color 0.15s, box-shadow 0.15s;
  box-shadow: var(--c-shadow-xs);
}

.search-input::placeholder { color: var(--c-text-muted); }
.search-input:focus {
  outline: none;
  border-color: var(--c-border-focus);
  box-shadow: 0 0 0 3px rgba(124,92,78,0.1);
}

.dark-mode .search-input:focus { box-shadow: 0 0 0 3px rgba(196,144,110,0.15); }

.search-clear {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: var(--c-border);
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--c-text-secondary);
  transition: all 0.15s;
}

.search-clear:hover { background: var(--c-danger-light); color: var(--c-danger); }

/* Contact Grid */
.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
  margin-bottom: 28px;
}

.contact-card {
  background: var(--c-surface);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.22s, border-color 0.22s, transform 0.18s;
  box-shadow: var(--c-shadow-sm);
}

.contact-card:hover {
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

.avatar-wrap { flex-shrink: 0; }

.avatar-img {
  width: 52px;
  height: 52px;
  object-fit: cover;
  border-radius: 50%;
  border: 2.5px solid var(--c-accent-light);
  box-shadow: var(--c-shadow-sm);
}

.avatar-placeholder {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--c-accent) 0%, var(--c-accent-2) 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: -0.5px;
  box-shadow: 0 2px 8px rgba(124,92,78,0.3);
}

.card-identity { flex: 1; min-width: 0; }

.contact-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--c-text-primary);
  margin: 0 0 3px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  letter-spacing: -0.2px;
}

.contact-designation {
  font-size: 12px;
  color: var(--c-text-secondary);
  margin: 0 0 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

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

.status-dot {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: var(--c-radius-pill);
  font-size: 11px;
  font-weight: 700;
  text-transform: capitalize;
  margin-top: 2px;
  letter-spacing: 0.02em;
}

.status-dot.active {
  background: var(--c-success-light);
  color: var(--c-success);
}

.status-dot.inactive {
  background: var(--c-danger-light);
  color: var(--c-danger);
}

/* Card Body */
.card-body {
  padding: 14px 18px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contact-meta { display: flex; flex-direction: column; gap: 7px; }

.meta-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--c-text-secondary);
  overflow: hidden;
}

.meta-row svg { flex-shrink: 0; color: var(--c-text-muted); }

.meta-link {
  color: var(--c-accent);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
}

.meta-link:hover { text-decoration: underline; }
.meta-text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.quick-links { display: flex; gap: 6px; flex-wrap: wrap; }

.quick-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 11px;
  border-radius: var(--c-radius-pill);
  font-size: 11px;
  font-weight: 700;
  transition: all 0.15s;
}

.whatsapp-pill { background: var(--c-success-light); color: var(--c-success); }
.whatsapp-pill:hover { background: var(--c-success); color: #fff; }

/* Wallet Buttons */
.wallet-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.wallet-group { display: flex; gap: 5px; }

.wallet-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border: 1.5px solid transparent;
  border-radius: var(--c-radius-xs);
  font-size: 11px;
  font-weight: 650;
  transition: all 0.15s;
  white-space: nowrap;
  letter-spacing: 0.01em;
}

.wallet-btn.google {
  background: var(--c-google-light);
  color: var(--c-google);
  border-color: rgba(30,92,38,0.15);
}

.wallet-btn.google:hover { background: #4caf50; color: #fff; border-color: #4caf50; }

.wallet-btn.google-copy {
  background: var(--c-google-copy-light);
  color: var(--c-google-copy);
  border-color: rgba(10,74,142,0.15);
}

.wallet-btn.google-copy:hover { background: var(--c-google-copy); color: #fff; }

.wallet-btn.apple {
  background: var(--c-text-primary);
  color: var(--c-surface);
  border-color: var(--c-text-primary);
}

.wallet-btn.apple:hover:not(.disabled) { background: var(--c-text-secondary); }

.wallet-btn.apple-copy {
  background: var(--c-surface-2);
  color: var(--c-text-primary);
  border-color: var(--c-border);
}

.wallet-btn.apple-copy:hover:not(.disabled) { background: var(--c-text-primary); color: var(--c-surface); }
.wallet-btn.disabled { opacity: 0.4; cursor: not-allowed; }

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
  min-width: 56px;
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
}

.view-btn {
  background: var(--c-info-light);
  color: var(--c-info);
  border-color: rgba(26,90,158,0.12);
}

.view-btn:hover { background: var(--c-info); color: #fff; border-color: var(--c-info); }

.qr-btn {
  background: var(--c-surface);
  color: var(--c-text-secondary);
  border-color: var(--c-border);
}

.qr-btn:hover { background: var(--c-text-secondary); color: #fff; border-color: var(--c-text-secondary); }

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

/* Pagination */
.pagination-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 8px;
}

.pag-btn {
  min-width: 38px;
  height: 38px;
  padding: 0 10px;
  background: var(--c-surface);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-sm);
  color: var(--c-text-secondary);
  font-size: 13px;
  font-weight: 650;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.pag-btn:hover:not(:disabled) { border-color: var(--c-accent); color: var(--c-accent); background: var(--c-accent-subtle); }
.pag-btn.active { background: var(--c-accent); border-color: var(--c-accent); color: #fff; }
.pag-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.pag-btn.arrow { background: var(--c-surface-2); }

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

/* ── IMPROVED Type Selector ── */
.type-selector-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 28px;
  background: var(--c-surface-2);
  border-bottom: 1.5px solid var(--c-border);
  flex-wrap: wrap;
}

.type-selector-label {
  font-size: 13px;
  font-weight: 700;
  color: var(--c-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  white-space: nowrap;
}

.type-selector-group {
  display: flex;
  gap: 0;
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-sm);
  overflow: hidden;
  background: var(--c-surface);
  box-shadow: var(--c-shadow-xs);
}

.type-tab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 22px;
  background: transparent;
  border: none;
  border-right: 1.5px solid var(--c-border);
  font-size: 14px;
  font-weight: 600;
  color: var(--c-text-secondary);
  transition: all 0.18s;
  cursor: pointer;
  position: relative;
}

.type-tab:last-child { border-right: none; }

.type-tab.active {
  background: var(--c-accent);
  color: #fff;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.15);
}

.type-tab:hover:not(.active) {
  background: var(--c-accent-light);
  color: var(--c-accent);
}

.type-active-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255,255,255,0.7);
  flex-shrink: 0;
}

.type-indicator {
  margin-left: auto;
}

.type-indicator-text {
  font-size: 12px;
  color: var(--c-text-muted);
  background: var(--c-accent-light);
  padding: 5px 12px;
  border-radius: var(--c-radius-pill);
  font-weight: 600;
}

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

.form-section:first-child { padding-top: 0; }
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
}

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
  flex-wrap: wrap;
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
.field-input:disabled { opacity: 0.5; cursor: not-allowed; background: var(--c-surface-2); }

.field-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239e8e84' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 13px center;
  padding-right: 38px;
  cursor: pointer;
}

/* Field Notes */
.field-note {
  font-size: 12px;
  margin: 0;
  padding: 5px 10px;
  border-radius: var(--c-radius-xs);
  font-weight: 500;
}

.field-note.success { color: var(--c-success); background: var(--c-success-light); }
.field-note.error { color: var(--c-danger); background: var(--c-danger-light); }
.field-note.info { color: var(--c-info); background: var(--c-info-light); }
.field-note.warning { color: var(--c-warning); background: var(--c-warning-light); }
.field-note.info-note { color: var(--c-text-muted); background: none; padding-left: 0; }

/* Status Toggle */
.status-toggle-group { display: flex; gap: 8px; }

.status-toggle-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 14px;
  background: var(--c-surface-2);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-sm);
  font-size: 13px;
  font-weight: 650;
  color: var(--c-text-secondary);
  transition: all 0.15s;
  cursor: pointer;
}

.status-toggle-btn.active {
  border-color: var(--c-accent);
  background: var(--c-accent-light);
  color: var(--c-accent);
}

.toggle-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.active-dot { background: var(--c-success); }
.inactive-dot { background: var(--c-danger); }

/* Photo Upload */
.photo-upload-area { display: flex; gap: 18px; align-items: flex-start; flex-wrap: wrap; }

.photo-preview-wrap { position: relative; width: 96px; height: 96px; flex-shrink: 0; }

.photo-preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid var(--c-accent);
  box-shadow: 0 4px 14px rgba(124,92,78,0.2);
}

.photo-remove-btn {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--c-danger);
  color: #fff;
  border: 2.5px solid var(--c-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s, box-shadow 0.15s;
  box-shadow: 0 2px 6px rgba(184,50,50,0.3);
}

.photo-remove-btn:hover { transform: scale(1.12); box-shadow: 0 4px 10px rgba(184,50,50,0.4); }

.photo-dropzone { flex: 1; min-width: 180px; cursor: pointer; display: block; }

.hidden-file { display: none; }
.hidden-check { display: none; }

.dropzone-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  padding: 26px 20px;
  border: 2px dashed var(--c-border);
  border-radius: var(--c-radius-sm);
  background: var(--c-surface-2);
  color: var(--c-text-muted);
  text-align: center;
  transition: border-color 0.15s, background 0.15s, color 0.15s;
}

.photo-dropzone:hover .dropzone-inner {
  border-color: var(--c-accent);
  background: var(--c-accent-light);
  color: var(--c-accent);
}

.dropzone-text { font-size: 14px; font-weight: 650; color: var(--c-text-primary); }
.dropzone-hint { font-size: 11px; color: var(--c-text-muted); }

/* Phone Row */
.phone-row { display: flex; gap: 9px; align-items: stretch; }
.country-code-picker { flex-shrink: 0; }
.phone-num-input { flex: 1; }

/* URL Preview */
.url-preview-row {
  display: flex;
  gap: 6px;
  align-items: center;
  background: var(--c-info-light);
  border: 1.5px solid rgba(26,90,158,0.2);
  border-radius: var(--c-radius-sm);
  padding: 6px 8px;
}

.dark-mode .url-preview-row { border-color: rgba(96,168,232,0.2); }

.url-readonly {
  flex: 1;
  border: none !important;
  background: transparent !important;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: var(--c-info);
  padding: 4px 6px;
  cursor: pointer;
  box-shadow: none !important;
}

.url-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: none;
  border-radius: var(--c-radius-xs);
  cursor: pointer;
  transition: all 0.15s;
  flex-shrink: 0;
}

.url-icon-btn.copy { background: var(--c-info); color: #fff; }
.url-icon-btn.copy:hover { background: var(--c-google-copy); }
.url-icon-btn.open { background: var(--c-success); color: #fff; }
.url-icon-btn.open:hover { background: var(--c-accent-hover); }

/* Input with Icon */
.input-icon-wrap { position: relative; }
.input-icon { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: var(--c-text-muted); pointer-events: none; }
.icon-padded { padding-left: 40px; }

/* WhatsApp toggle */
.same-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
  color: var(--c-text-secondary);
  margin-left: 8px;
  text-transform: none;
  letter-spacing: 0;
}

.same-toggle-track {
  position: relative;
  display: inline-block;
  width: 30px;
  height: 17px;
  border-radius: 9px;
  background: var(--c-border);
  transition: background 0.2s;
  flex-shrink: 0;
}

.toggle-on { background: var(--c-accent); }

.same-toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  transition: left 0.2s;
}

.thumb-on { left: 15px; }

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
   QR POPUP
══════════════════════════════════════ */
.qr-overlay {
  position: fixed;
  inset: 0;
  background: rgba(16,14,20,0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  padding: 16px;
}

.qr-modal {
  background: var(--c-surface);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius);
  width: 100%;
  max-width: 360px;
  padding: 26px;
  position: relative;
  box-shadow: var(--c-shadow-lg);
}

.qr-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.qr-modal-title {
  font-size: 17px;
  font-weight: 750;
  color: var(--c-text-primary);
  margin: 0;
  letter-spacing: -0.3px;
}

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

.qr-close-btn:hover { border-color: var(--c-danger); color: var(--c-danger); background: var(--c-danger-light); }

.qr-modal-name {
  font-size: 14px;
  font-weight: 650;
  color: var(--c-text-secondary);
  margin: 0 0 18px;
}

.qr-canvas-wrap {
  display: flex;
  justify-content: center;
  padding: 18px;
  background: var(--c-surface-2);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-sm);
  margin-bottom: 14px;
}

.qr-modal-url {
  font-size: 11px;
  color: var(--c-text-muted);
  text-align: center;
  margin: 0 0 18px;
  word-break: break-all;
  font-family: 'Courier New', monospace;
}

.qr-modal-actions { display: flex; gap: 10px; }

.qr-action-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 11px 14px;
  border: none;
  border-radius: var(--c-radius-sm);
  font-size: 13px;
  font-weight: 650;
  transition: all 0.15s;
}

.qr-action-btn.download { background: var(--c-info-light); color: var(--c-info); }
.qr-action-btn.download:hover { background: var(--c-info); color: #fff; }

.qr-action-btn.share { background: var(--c-success-light); color: var(--c-success); }
.qr-action-btn.share:hover { background: var(--c-success); color: #fff; }

/* Modal Transition */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.22s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

/* ══════════════════════════════════════
   RESPONSIVE — TABLET (≤ 900px)
══════════════════════════════════════ */
@media (max-width: 900px) {
  .list-view { padding: 20px; }
  .form-body { padding: 20px; }
  .form-topbar { padding: 12px 20px; }
  .type-selector-bar { padding: 12px 20px; gap: 10px; }
  .type-indicator { display: none; }

  .contact-grid { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
  .fields-grid { grid-template-columns: 1fr; }
}

/* ══════════════════════════════════════
   RESPONSIVE — MOBILE (≤ 640px)
══════════════════════════════════════ */
@media (max-width: 640px) {
  .list-view { padding: 14px; }
  .form-body { padding: 14px; }
  .form-topbar { padding: 12px 14px; gap: 10px; }
  .type-selector-bar { padding: 12px 14px; gap: 8px; flex-wrap: wrap; }
  .type-indicator { display: none; }
  .back-label { display: none; }

  .page-title { font-size: 20px; }
  .form-page-title { font-size: 15px; }

  .list-header { margin-bottom: 16px; }

  .contact-grid { grid-template-columns: 1fr; gap: 12px; }

  /* Compact card actions on mobile */
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
  .card-body { padding: 12px 14px; gap: 10px; }

  .wallet-row { flex-direction: column; gap: 6px; }
  .wallet-group { justify-content: stretch; }
  .wallet-btn { flex: 1; justify-content: center; }

  .photo-upload-area { flex-direction: column; }
  .photo-dropzone { width: 100%; }

  .phone-row { flex-direction: column; }
  .country-code-picker { width: 100%; }

  .url-preview-row { flex-wrap: wrap; }
  .url-readonly { min-width: 0; width: 100%; }

  .status-toggle-group { flex-direction: row; }

  .type-selector-group { width: 100%; }
  .type-tab { flex: 1; justify-content: center; padding: 10px 14px; font-size: 13px; }

  .form-bottom-actions { flex-direction: column; padding-top: 20px; }
  .cancel-btn, .save-btn { width: 100%; justify-content: center; }

  .qr-modal { padding: 18px; }
  .qr-canvas-wrap { padding: 12px; }

  .section-number { width: 26px; height: 26px; font-size: 10px; }
  .section-title { font-size: 14px; }
  .form-section { padding: 18px 0; }
}

/* ══════════════════════════════════════
   TOUCH TARGETS
══════════════════════════════════════ */
@media (hover: none) and (pointer: coarse) {
  .action-btn, .add-btn, .save-btn, .cancel-btn, .save-btn-top,
  .back-btn, .wallet-btn, .pag-btn, .search-clear, .qr-action-btn,
  .type-tab { min-height: 44px; }
  input, select, textarea { font-size: 16px !important; }
}

/* ══════════════════════════════════════
   ACCESSIBILITY
══════════════════════════════════════ */
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition-duration: 0.01ms !important; }
}
</style>
