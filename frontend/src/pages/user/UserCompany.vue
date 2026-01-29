<template>
  <div v-if="activeTab === 'company'" class="content-card">
    <div v-if="!showCompanyForm">
      <div class="card-header">
        <h2 class="card-title">Company Information</h2>
        <button
            class="btn-primary"
            @click="openCompanyForm"
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
          <tr v-for="(c, index) in paginatedCompanies" :key="c.id">
            <td data-label="#">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
            <td data-label="Company Name">{{ c.companyName }}</td>
            <td data-label="Logo">
              <img
                  v-if="c.logo"
                  :src="`${VITE_IMAGE_UPLOAD_URL}${c.logo}`"
                  alt="Logo"
                  class="logo-thumb"
              />
              <span v-else>No logo</span>
            </td>
            <td data-label="Website">
              <a :href="c.website" target="_blank" class="link">{{ c.website }}</a>
            </td>
            <td data-label="Email">{{ c.email }}</td>
            <td data-label="360° View">
              <a v-if="c.view360" :href="c.view360" target="_blank" class="link">View</a>
              <span v-else>-</span>
            </td>
            <td data-label="Location">
              <a v-if="c.googleLocation" :href="c.googleLocation" target="_blank" class="link">Location</a>
              <span v-else>-</span>
            </td>
            <td data-label="Reviews">
              <a v-if="c.googleReviews" :href="c.googleReviews" target="_blank" class="link">Reviews</a>
              <span v-else>-</span>
            </td>
            <td data-label="Status">
              <span :class="['status-badge', c.status]">{{ c.status }}</span>
            </td>
            <td class="action-buttons">
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
<!--        <button @click="openCompanyForm" class="link-button">Add your first company</button>-->
      </div>
    </div>

    <!-- Company Form -->
    <div v-else>
      <div class="card-header">
        <h2 class="card-title">{{ companyForm.id ? 'Edit Company' : 'Add Company' }}</h2>
        <button @click="closeCompanyForm" class="btn-close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Plan Badge -->
      <div v-if="userPlan" style="margin: 16px 24px; padding: 12px; background: #f5f5f5; border-radius: 8px; display: flex; align-items: center; justify-content: space-between;">
        <div>
          <span style="font-weight: 600; text-transform: uppercase; color: #666;">Current Plan: </span>
          <span :style="{
            fontWeight: 'bold',
            color: userPlan === 'free' ? '#ff9800' : userPlan === 'plus' ? '#2196f3' : '#4caf50',
            fontSize: '1.1rem'
          }">{{ userPlan.toUpperCase() }}</span>
        </div>
        <div v-if="userPlan === 'free'" style="font-size: 0.85rem; color: #666;">
          ⚠️ Free plan: Limited to 2 social media links and brochure features disabled
        </div>
      </div>

      <div class="form-container">
        <!-- Basic Information -->
        <div class="form-grid">
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

        <!-- Brochure/Menu Links Section -->
        <div class="form-group full-width">
          <label class="form-label">
            Links (Brochures, Menus, Shop, Orders)
            <span v-if="isBrochureDisabled" style="color: #ff9800; font-size: 0.85rem; margin-left: 8px;">
              🔒 Upgrade to Plus or Pro to enable this feature
            </span>
          </label>

          <!-- Add New Link Form -->
          <div
              class="link-input-container"
              :style="{
                border: '1px solid #e0e0e0',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '16px',
                opacity: isBrochureDisabled ? '0.5' : '1',
                pointerEvents: isBrochureDisabled ? 'none' : 'auto',
                position: 'relative'
              }"
          >
            <div v-if="isBrochureDisabled" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; z-index: 10;">
              <div style="background: white; padding: 16px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <p style="margin: 0; font-weight: 600; color: #ff9800;">🔒 Premium Feature</p>
                <p style="margin: 8px 0 0 0; font-size: 0.85rem; color: #666;">Upgrade to unlock brochure links</p>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr auto; gap: 12px; align-items: start;">
              <div>
                <input
                    v-model="pendingLinkUrl"
                    type="url"
                    class="form-input"
                    placeholder="Enter link URL (e.g., https://example.com/brochure.pdf)"
                    style="margin-bottom: 8px;"
                    :disabled="isBrochureDisabled"
                />
                <input
                    v-model="pendingLinkName"
                    type="text"
                    class="form-input"
                    placeholder="Link name (e.g., 2024 Product Catalog)"
                    style="margin-bottom: 12px;"
                    :disabled="isBrochureDisabled"
                />

                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                  <label style="display: flex; align-items: center; cursor: pointer;">
                    <input
                        type="checkbox"
                        v-model="pendingLinkType.isBrochure"
                        style="margin-right: 8px;"
                        :disabled="isBrochureDisabled"
                    />
                    <span>📄 Brochure</span>
                  </label>

                  <label style="display: flex; align-items: center; cursor: pointer;">
                    <input
                        type="checkbox"
                        v-model="pendingLinkType.isMenu"
                        style="margin-right: 8px;"
                        :disabled="isBrochureDisabled"
                    />
                    <span>🍽️ Menu</span>
                  </label>

                  <label style="display: flex; align-items: center; cursor: pointer;">
                    <input
                        type="checkbox"
                        v-model="pendingLinkType.isShopNow"
                        style="margin-right: 8px;"
                        :disabled="isBrochureDisabled"
                    />
                    <span>🛒 Shop Now</span>
                  </label>

                  <label style="display: flex; align-items: center; cursor: pointer;">
                    <input
                        type="checkbox"
                        v-model="pendingLinkType.isOrderNow"
                        style="margin-right: 8px;"
                        :disabled="isBrochureDisabled"
                    />
                    <span>📦 Order Now</span>
                  </label>
                </div>
              </div>

              <button
                  type="button"
                  @click="addLinkToList"
                  class="btn-primary"
                  style="height: 40px; white-space: nowrap;"
                  :disabled="isBrochureDisabled"
              >
                + Add Link
              </button>
            </div>
          </div>

          <!-- List of Added Links -->
          <div v-if="companyForm.files && companyForm.files.length > 0" style="margin-top: 16px;">
            <div
                v-for="(link, index) in companyForm.files"
                :key="index"
                style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px;
                border: 1px solid #e0e0e0;
                border-radius: 6px;
                margin-bottom: 8px;
                background: #f9f9f9;
              "
            >
              <div style="flex: 1;">
                <div style="font-weight: 600; margin-bottom: 4px;">
                  {{ link.name || 'Untitled Link' }}
                </div>
                <div style="font-size: 0.85rem; color: #666; word-break: break-all; margin-bottom: 6px;">
                  {{ link.url || link.path }}
                </div>
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <span
                    v-if="link.isBrochure"
                    style="
                      background: #e3f2fd;
                      color: #1976d2;
                      padding: 2px 8px;
                      border-radius: 4px;
                      font-size: 0.75rem;
                    "
                >
                  📄 Brochure
                </span>
                  <span
                      v-if="link.isMenu"
                      style="
                      background: #fff3e0;
                      color: #f57c00;
                      padding: 2px 8px;
                      border-radius: 4px;
                      font-size: 0.75rem;
                    "
                  >
                  🍽️ Menu
                </span>
                  <span
                      v-if="link.isShopNow"
                      style="
                      background: #e8f5e9;
                      color: #388e3c;
                      padding: 2px 8px;
                      border-radius: 4px;
                      font-size: 0.75rem;
                    "
                  >
                  🛒 Shop Now
                </span>
                  <span
                      v-if="link.isOrderNow"
                      style="
                      background: #f3e5f5;
                      color: #7b1fa2;
                      padding: 2px 8px;
                      border-radius: 4px;
                      font-size: 0.75rem;
                    "
                  >
                  📦 Order Now
                </span>
                </div>
              </div>

              <button
                  type="button"
                  @click="removeLink(index)"
                  style="
                  background: #f44336;
                  color: white;
                  border: none;
                  padding: 8px 12px;
                  border-radius: 6px;
                  cursor: pointer;
                  margin-left: 12px;
                "
                  :disabled="isBrochureDisabled"
              >
                🗑️ Remove
              </button>
            </div>
          </div>

          <p v-else style="color: #999; font-style: italic; margin-top: 8px;">
            No links added yet. Add brochures, menus, or other links above.
          </p>
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
              <input v-model="companyForm.streetAddress" type="text" class="form-input" placeholder=""/>
            </div>

            <div class="form-group full-width">
              <label class="form-label">Street Address Line 2</label>
              <input v-model="companyForm.streetAddressLine2" type="text" class="form-input" placeholder=""/>
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
          <h3 class="section-title">
            Social Media Links
            <span v-if="userPlan === 'free'" style="color: #ff9800; font-size: 0.85rem; margin-left: 8px; font-weight: normal;">
              (Free plan: Maximum 2 social media links - {{ enabledSocialMediaCount }}/2 used)
            </span>
          </h3>

          <div class="social-links-grid">
            <div v-for="social in mainSocialMedia" :key="social.name" class="social-link-item">
              <div class="social-checkbox">
                <input
                    type="checkbox"
                    :id="`social-${social.name}`"
                    v-model="social.enabled"
                    class="checkbox-input"
                    @change="handleSocialToggle(social)"
                    :disabled="userPlan === 'free' && !social.enabled && enabledSocialMediaCount >= 2"
                />
                <label :for="`social-${social.name}`" class="checkbox-label">
                  {{ social.label }}
                  <span v-if="userPlan === 'free' && !social.enabled && enabledSocialMediaCount >= 2" style="color: #ff9800; font-size: 0.75rem;">
                    (Limit reached)
                  </span>
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
                    @change="handleCustomSocialToggle(custom)"
                    :disabled="userPlan === 'free' && !custom.enabled && enabledSocialMediaCount >= 2"
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

          <button
              @click="addCustomSocial"
              class="btn-add-more"
              type="button"
              :disabled="userPlan === 'free' && enabledSocialMediaCount >= 2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add More
            <span v-if="userPlan === 'free' && enabledSocialMediaCount >= 2" style="font-size: 0.75rem; margin-left: 4px;">
              (Upgrade to add more)
            </span>
          </button>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button @click="saveCompany" class="btn-primary" :disabled="saving">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            {{ saving ? 'Saving...' : 'Save Company' }}
          </button>
          <button @click="closeCompanyForm" class="btn-secondary" :disabled="saving">Cancel</button>
        </div>
      </div>
    </div>
  </div>

  <ImageCropperModal
      :show="showCropperModal"
      :image-src="tempImageSrc"
      :type="cropperType"
      :title="cropperType === 'logo' ? 'Crop Company Logo' : 'Crop Image'"
      @cropped="handleCroppedImage"
      @close="showCropperModal = false; tempImageSrc = ''"
  />

</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import api from '@/services/api.js';
import { VITE_IMAGE_UPLOAD_URL, API_BASE_URL } from '@/config.js';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import CountrySelector from '@/components/CountrySelector.vue';
import ImageCropperModal from '@/components/ImageCropper.vue';

const props = defineProps({
  activeTab: {
    type: String,
    required: true
  },
  companyCount: {
    type: Number,
    required: true
  },
  userLimits: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['company-added', 'company-deleted', 'company-updated']);

// State
const userCompanies = ref([]);
const showCompanyForm = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(5);
const saving = ref(false);
const userPlan = ref('free'); // Default to free, will be loaded from API

const logoPreview = ref(null);
const logoFileName = ref('');

const showCropperModal = ref(false);
const tempImageSrc = ref('');
const cropperType = ref('logo');

const pendingLinkUrl = ref('');
const pendingLinkName = ref('');
const pendingLinkType = ref({
  isBrochure: false,
  isMenu: false,
  isShopNow: false,
  isOrderNow: false
});

const mainSocialMedia = ref([
  { name: 'facebook', label: 'Facebook', enabled: false, url: '' },
  { name: 'twitter', label: 'X (Twitter)', enabled: false, url: '' },
  { name: 'linkedin', label: 'LinkedIn', enabled: false, url: '' },
  { name: 'instagram', label: 'Instagram', enabled: false, url: '' },
  { name: 'youtube', label: 'YouTube', enabled: false, url: '' },
  { name: 'tiktok', label: 'TikTok', enabled: false, url: '' }
]);

const customSocialMedia = ref([]);

const companyForm = ref({
  id: null,
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
  files: [],
  existingLogoPath: null,
  country: '',
  streetAddress: '',
  streetAddressLine2: '',
  city: '',
  postalCode: '',
  poBox: '',
  label: ''
});

// Computed - Plan-based restrictions
const isBrochureDisabled = computed(() => {
  return userPlan.value === 'free';
});

const enabledSocialMediaCount = computed(() => {
  const mainEnabled = mainSocialMedia.value.filter(s => s.enabled).length
  const customEnabled = customSocialMedia.value.filter(s => s.enabled).length
  return mainEnabled + customEnabled
})

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

const totalPages = computed(() => {
  return Math.ceil(filteredCompanies.value.length / itemsPerPage.value);
});

// Watch for page changes
watch(() => filteredCompanies.value.length, () => {
  if (currentPage.value > totalPages.value && totalPages.value > 0) {
    currentPage.value = totalPages.value;
  }
});

// Fetch user plan
const fetchUserPlan = async () => {
  try {
    const response = await api.get('/auth/me')

    if (response.data && response.data.user && response.data.user.plan) {
      userPlan.value = response.data.user.plan.toLowerCase()
    } else if (response.data && response.data.plan) {
      // fallback if your API returns plan at root
      userPlan.value = response.data.plan.toLowerCase()
    } else {
      console.warn('Plan not found in /auth/me response, defaulting to free')
      userPlan.value = 'free'
    }
  } catch (error) {
    console.error('Error fetching user plan:', error)
    userPlan.value = 'free'
  }
}


// Fetch companies
// Change fetchCompanies function
const fetchCompanies = async () => {
  try {
    // Use /dashboard/data instead of /companies
    const response = await api.get('/dashboard/data');
    userCompanies.value = response.data.companies || [];
  } catch (error) {
    console.error('Error fetching companies:', error);
    alert('Failed to load companies');
  }
};

// Open company form
const openCompanyForm = () => {
  resetForm();
  showCompanyForm.value = true;
};

// Close company form
const closeCompanyForm = () => {
  showCompanyForm.value = false;
  resetForm();
};

// Reset form
const resetForm = () => {
  companyForm.value = {
    id: null,
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
    files: [],
    existingLogoPath: null,
    country: '',
    streetAddress: '',
    streetAddressLine2: '',
    city: '',
    postalCode: '',
    poBox: '',
    label: ''
  };

  logoPreview.value = null;
  logoFileName.value = '';

  pendingLinkUrl.value = '';
  pendingLinkName.value = '';
  pendingLinkType.value = {
    isBrochure: false,
    isMenu: false,
    isShopNow: false,
    isOrderNow: false
  };

  // Reset social media
  mainSocialMedia.value.forEach(s => {
    s.enabled = false;
    s.url = '';
  });
  customSocialMedia.value = [];
};

// Handle logo upload
const handleLogoUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Validate file type
  if (!file.type.startsWith('image/')) {
    alert('Please upload an image file');
    return;
  }

  // Validate file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    alert('File size must be less than 5MB');
    return;
  }

  logoFileName.value = file.name;

  const reader = new FileReader();
  reader.onload = (e) => {
    tempImageSrc.value = e.target.result;
    cropperType.value = 'logo';
    showCropperModal.value = true;
  };
  reader.readAsDataURL(file);
};

// Handle cropped image
const handleCroppedImage = (croppedData) => {
  if (cropperType.value === 'logo') {
    logoPreview.value = croppedData.url;
    companyForm.value.logo = croppedData.file;
  }
  showCropperModal.value = false;
  tempImageSrc.value = '';
};

// Remove logo
const removeLogo = () => {
  logoPreview.value = null;
  logoFileName.value = '';
  companyForm.value.logo = null;
  companyForm.value.existingLogoPath = null;
  document.getElementById('logo-upload').value = '';
};

// Add link to list
const addLinkToList = () => {
  if (!pendingLinkUrl.value.trim()) {
    alert('Please enter a URL');
    return;
  }

  const hasType = pendingLinkType.value.isBrochure ||
      pendingLinkType.value.isMenu ||
      pendingLinkType.value.isShopNow ||
      pendingLinkType.value.isOrderNow;

  if (!hasType) {
    alert('Please select at least one link type');
    return;
  }

  const newLink = {
    url: pendingLinkUrl.value.trim(),
    name: pendingLinkName.value.trim() || 'Untitled Link',
    isBrochure: pendingLinkType.value.isBrochure,
    isMenu: pendingLinkType.value.isMenu,
    isShopNow: pendingLinkType.value.isShopNow,
    isOrderNow: pendingLinkType.value.isOrderNow
  };

  companyForm.value.files.push(newLink);

  // Reset pending inputs
  pendingLinkUrl.value = '';
  pendingLinkName.value = '';
  pendingLinkType.value = {
    isBrochure: false,
    isMenu: false,
    isShopNow: false,
    isOrderNow: false
  };
};

// Remove link
const removeLink = (index) => {
  companyForm.value.files.splice(index, 1);
};

// Handle social toggle
const handleSocialToggle = (social) => {
  if (userPlan.value !== 'free') return

  // If trying to turn ON
  if (!social.enabled) {
    const nextCount = enabledSocialMediaCount.value + 1

    if (nextCount > 2) {
      alert('Free plan allows only 2 social platforms. Upgrade to Plus or Pro for more.')
      return
    }

    social.enabled = true
  } else {
    // Turning OFF is always allowed
    social.enabled = false
  }
}


// Handle custom social toggle
const handleCustomSocialToggle = (custom) => {
  if (userPlan.value !== 'free') return

  if (!custom.enabled) {
    const nextCount = enabledSocialMediaCount.value + 1

    if (nextCount > 2) {
      alert('Free plan allows only 2 social platforms. Upgrade to Plus or Pro for more.')
      return
    }

    custom.enabled = true
  } else {
    custom.enabled = false
  }
}


// Add custom social
const addCustomSocial = () => {
  if (userPlan.value === 'free' && enabledSocialMediaCount.value >= 2) {
    alert('Free plan allows maximum 2 social media links. Upgrade to Plus or Pro for unlimited links.');
    return;
  }

  customSocialMedia.value.push({
    name: '',
    url: '',
    enabled: false
  });
};

// Remove custom social
const removeCustomSocial = (index) => {
  customSocialMedia.value.splice(index, 1);
};

// Validate social media count before save
const validateSocialMediaCount = () => {
  if (userPlan.value === 'free') {
    const enabledCount = enabledSocialMediaCount.value;
    if (enabledCount > 2) {
      alert(`Free plan allows maximum 2 social media links. You have ${enabledCount} enabled. Please disable ${enabledCount - 2} link(s) or upgrade your plan.`);
      return false;
    }
  }
  return true;
};

// Validate brochure links
const validateBrochureLinks = () => {
  if (userPlan.value === 'free' && companyForm.value.files.length > 0) {
    alert('Brochure/Menu links are disabled for free plan users. Please upgrade to Plus or Pro to use this feature.');
    return false;
  }
  return true;
};

// Save company
const saveCompany = async () => {
  // Validate required fields
  if (!companyForm.value.companyName.trim()) {
    alert('Company name is required');
    return;
  }
  if (!companyForm.value.website.trim()) {
    alert('Website is required');
    return;
  }
  if (!companyForm.value.email.trim()) {
    alert('Email is required');
    return;
  }

  // Validate social media count for free plan
  if (!validateSocialMediaCount()) {
    return;
  }

  // Validate brochure links for free plan
  if (!validateBrochureLinks()) {
    return;
  }

  // Logo validation
  if (!companyForm.value.id && !companyForm.value.logo) {
    alert('Company logo is required');
    return;
  }

  saving.value = true;

  try {
    const formData = new FormData();

    // Basic fields
    formData.append('companyName', companyForm.value.companyName);
    formData.append('website', companyForm.value.website);
    formData.append('displayUrl', companyForm.value.displayUrl || '');
    formData.append('email', companyForm.value.email);
    formData.append('bio', companyForm.value.bio || '');
    formData.append('view360', companyForm.value.view360 || '');
    formData.append('googleLocation', companyForm.value.googleLocation || '');
    formData.append('googleReviews', companyForm.value.googleReviews || '');
    formData.append('tripAdvisor', companyForm.value.tripAdvisor || '');
    formData.append('status', companyForm.value.status);

    // Address fields
    formData.append('country', companyForm.value.country || '');
    formData.append('streetAddress', companyForm.value.streetAddress || '');
    formData.append('streetAddressLine2', companyForm.value.streetAddressLine2 || '');
    formData.append('city', companyForm.value.city || '');
    formData.append('postalCode', companyForm.value.postalCode || '');
    formData.append('poBox', companyForm.value.poBox || '');
    formData.append('label', companyForm.value.label || '');

    // Logo
    if (companyForm.value.logo) {
      formData.append('logo', companyForm.value.logo);
    } else if (companyForm.value.existingLogoPath) {
      formData.append('existingLogoPath', companyForm.value.existingLogoPath);
    }

    // Brochure/Menu links (only if not free plan)
    if (userPlan.value !== 'free') {
      formData.append('files', JSON.stringify(companyForm.value.files));
    }

    // Social media links
    const socialMediaLinks = [];

    // Main social media
    mainSocialMedia.value.forEach(social => {
      if (social.enabled && social.url.trim()) {
        socialMediaLinks.push({
          name: social.name,
          label: social.label,
          url: social.url.trim()
        });
      }
    });

    // Custom social media
    customSocialMedia.value.forEach(custom => {
      if (custom.enabled && custom.url.trim() && custom.name.trim()) {
        socialMediaLinks.push({
          name: custom.name.trim().toLowerCase().replace(/\s+/g, '_'),
          label: custom.name.trim(),
          url: custom.url.trim()
        });
      }
    });

    formData.append('socialLinks', JSON.stringify(socialMediaLinks));

    let response;
    if (companyForm.value.id) {
      // Update existing company
      response = await api.put(`/companies/${companyForm.value.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Company updated successfully!');
      emit('company-updated');
    } else {
      // Create new company
      response = await api.post('/companies', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Company added successfully!');
      emit('company-added');
    }

    closeCompanyForm();
    await fetchCompanies();

  } catch (error) {
    console.error('Error saving company:', error);
    alert(error.response?.data?.message || 'Failed to save company. Please try again.');
  } finally {
    saving.value = false;
  }
};

// Edit company
const editCompany = (company) => {
  try {
    console.log("📝 Editing company:", company); // Debug log
    const data = company;

    // Reset social state
    mainSocialMedia.value.forEach(s => {
      s.enabled = false;
      s.url = '';
    });
    customSocialMedia.value = [];

    // Parse files safely
    let parsedFiles = [];
    if (data.files) {
      try {
        parsedFiles = Array.isArray(data.files)
            ? data.files
            : JSON.parse(data.files);
      } catch (e) {
        console.error("Error parsing files:", e);
        parsedFiles = [];
      }
    }

    // Populate form
    companyForm.value = {
      id: data.id,
      companyName: data.companyName || '',
      website: data.website || '',
      displayUrl: data.displayUrl || '',
      email: data.email || '',
      bio: data.bio || '',
      logo: null,
      view360: data.view360 || '',
      googleLocation: data.googleLocation || '',
      googleReviews: data.googleReviews || '',
      tripAdvisor: data.tripAdvisor || '',
      status: data.status || 'active',
      files: parsedFiles,
      existingLogoPath: data.logo || null,
      country: data.country || '',
      streetAddress: data.streetAddress || '',
      streetAddressLine2: data.streetAddressLine2 || '',
      city: data.city || '',
      postalCode: data.postalCode || '',
      poBox: data.poBox || '',
      label: data.label || ''
    };

    // Set logo preview
    if (data.logo) {
      logoPreview.value = `${VITE_IMAGE_UPLOAD_URL}${data.logo}`;
      logoFileName.value = data.logo.split('/').pop();
    } else {
      logoPreview.value = null;
      logoFileName.value = '';
    }

    // Load social media safely with debugging
    let parsedSocial = [];

    // Try to get the raw social data
    const rawSocial = data.socialLinks || data.socialMedia || [];

    console.log("🔍 Raw social data:", rawSocial); // Debug log
    console.log("🔍 Type of rawSocial:", typeof rawSocial); // Debug log

    try {
      // If it's already an array, use it
      if (Array.isArray(rawSocial)) {
        parsedSocial = rawSocial;
      }
      // If it's a string, try to parse it
      else if (typeof rawSocial === 'string' && rawSocial.trim()) {
        parsedSocial = JSON.parse(rawSocial);
      }
      // If it's an object but not an array, convert to array
      else if (typeof rawSocial === 'object' && rawSocial !== null) {
        parsedSocial = Object.entries(rawSocial).map(([key, value]) => ({
          name: key,
          label: key.charAt(0).toUpperCase() + key.slice(1),
          url: value
        }));
      }
    } catch (e) {
      console.error("Error parsing social media:", e);
      parsedSocial = [];
    }

    console.log("✅ Parsed social media:", parsedSocial); // Debug log

    // Map to UI
    parsedSocial.forEach(social => {
      const main = mainSocialMedia.value.find(
          s => s.name.toLowerCase() === social.name.toLowerCase()
      );

      if (main) {
        main.enabled = true;
        main.url = social.url || '';
        console.log(`✅ Mapped ${social.name} to main social`); // Debug log
      } else {
        customSocialMedia.value.push({
          name: social.label || social.name,
          url: social.url || '',
          enabled: true
        });
        console.log(`✅ Added ${social.name} to custom social`); // Debug log
      }
    });

    showCompanyForm.value = true;
  } catch (error) {
    console.error('❌ Error loading company:', error);
    alert('Failed to load company data');
  }
};



// Delete company
const deleteCompany = async (id) => {
  if (!confirm('Are you sure you want to delete this company?')) return;

  try {
    await api.delete(`/companies/${id}`);
    alert('Company deleted successfully!');
    emit('company-deleted');
    await fetchCompanies();
  } catch (error) {
    console.error('Error deleting company:', error);
    alert('Failed to delete company');
  }
};

// Lifecycle
onMounted(async () => {
  await fetchUserPlan();
  await fetchCompanies();
});
</script>

<style scoped>


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
  background: #5c4033;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #5c4033;
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
  color: #5c4033;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s;
}

.link-button:hover {
  color: #5c4033;
}

.btn-add-more {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  color: #5c4033;
  border: 1px solid #5c4033;
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
  border-color: #5c4033;
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

.logo-thumb {
  width: 45px;
  height: 45px;
  object-fit: contain;
  border-radius: 8px;
  background: #f3f3f3;
  padding: 4px;
  border: 1px solid #ddd;
}

.search-input {
  width: 100%;
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

.table-controls {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
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

/* Small tablets (768px and below) */
@media (max-width: 768px) {

  /* Content Cards */
  .content-card {
    padding: 1rem;
    border-radius: 0.75rem;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }

  /* Forms */
  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .custom-social-item {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .custom-social-item .checkbox-input {
    grid-column: 1 / -1;
  }

  /* Form Actions */
  .form-actions {
    flex-direction: column;
    gap: 0.75rem;
  }

  .form-actions button {
    width: 100%;
  }

  /* Upload Areas */
  .upload-label {
    padding: 1.5rem 1rem;
  }

  .image-preview {
    width: 120px;
    height: 120px;
  }

  /* Table Controls */
  .table-controls {
    margin-bottom: 1rem;
  }

  .search-input {
    width: 100%;
    max-width: none;
  }

  /* ============================================
     MOBILE TABLE CARDS - COMPANY TABLE
     ============================================ */
  /* Hide table headers on mobile */
  .data-table thead {
    display: none;
  }

  /* Reset table display */
  .data-table,
  .data-table tbody,
  .data-table tr,
  .data-table td {
    display: block;
    width: 100%;
  }

  .data-table {
    border: 0;
    font-size: 0.875rem;
  }

  /* Table body - card container */
  .data-table tbody {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  /* Individual card row */
  .data-table tr {
    background: #ffffff;
    border: 1px solid #e5e1dc;
    border-radius: 12px;
    padding: 0;
    margin-bottom: 0;
    box-shadow: 0 2px 8px rgba(92, 64, 51, 0.08);
    transition: all 0.3s ease;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .data-table tr:hover {
    box-shadow: 0 4px 16px rgba(92, 64, 51, 0.12);
    transform: translateY(-2px);
  }

  /* Card header (first cell - Company #) */
  .data-table td:first-child {
    background: linear-gradient(135deg, #5c4033 0%, #7d5a4f 100%);
    color: white;
    padding: 0.75rem 1.25rem;
    font-weight: 700;
    font-size: 0.875rem;
    border: none;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    grid-template-columns: 1fr;
    gap: 0;
    text-align: left;
    min-height: auto;
  }

  .data-table td:first-child:before {
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-right: 0.5rem;
  }

  /* Regular data cells */
  .data-table td {
    border: none;
    padding: 1rem 1.25rem;
    text-align: left;
    position: relative;
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 1rem;
    align-items: center;
    min-height: 50px;
    border-bottom: 1px solid #f5f3f0;
  }

  .data-table td:last-child {
    border-bottom: none;
  }

  /* Data labels */
  .data-table td:before {
    content: attr(data-label);
    font-weight: 600;
    font-size: 0.8rem;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    grid-column: 1;
  }

  /* Data values */
  .data-table td > * {
    grid-column: 2;
  }

  /* Logo thumbnail */
  .logo-thumb {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    object-fit: contain;
    background: #f8f6f4;
    padding: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    justify-self: start;
  }

  /* Links */
  .data-table td .link {
    color: #5c4033;
    text-decoration: none;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    transition: color 0.2s;
    word-break: break-all;
  }

  .data-table td .link:hover {
    color: #7d5a4f;
    text-decoration: underline;
  }

  /* Status badges */
  .status-badge {
    display: inline-flex;
    padding: 0.375rem 0.875rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    justify-self: start;
  }

  .status-badge.active {
    background: #dcfce7;
    color: #166534;
  }

  .status-badge.inactive {
    background: #fee2e2;
    color: #991b1b;
  }

  /* Action buttons section */
  .data-table td.action-buttons {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    padding: 1.25rem;
    background: #f8f6f4;
    margin-top: 0;
    display: flex;
    flex-direction: column;
  }

  .data-table td.action-buttons:before {
    content: 'Actions';
    grid-column: 1 / -1;
    color: #5c4033;
    font-weight: 700;
    font-size: 0.85rem;
    margin-bottom: 0.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #e5e1dc;
    display: block;
  }

  .data-table td.action-buttons > * {
    grid-column: auto;
  }

  .data-table td.action-buttons .btn-action {
    width: 60%;
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    border-radius: 8px;
    border: none;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .btn-action.edit {
    background: #f39c12;
    color: white;
  }

  .btn-action.edit:hover {
    background: #e67e22;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(243, 156, 18, 0.3);
  }

  .btn-action.delete {
    background: #e74c3c;
    color: white;
  }

  .btn-action.delete:hover {
    background: #c0392b;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(231, 76, 60, 0.3);
  }

  /* Table container adjustments */
  .table-container {
    overflow-x: visible;
    margin: 0;
    padding: 0;
    border-radius: 0;
  }

  /* Pagination */
  .pagination {
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
    margin-top: 1.5rem;
  }

  .page-btn {
    padding: 0.5rem 0.875rem;
    font-size: 0.875rem;
    min-width: 40px;
  }

  /* Empty State */
  .empty-state {
    padding: 3rem 1.5rem;
    text-align: center;
  }

  .empty-icon {
    width: 48px;
    height: 48px;
    margin-bottom: 1rem;
    color: #94a3b8;
  }

  .empty-text {
    font-size: 1rem;
    color: #64748b;
    margin-bottom: 1rem;
  }

  .link-button {
    color: #5c4033;
    font-weight: 600;
    text-decoration: none;
    border-bottom: 2px solid #5c4033;
    transition: all 0.2s;
  }

  .link-button:hover {
    color: #7d5a4f;
  }

  /* Social Media Section */
  .social-links-grid {
    grid-template-columns: 1fr;
  }

  .btn-add-more {
    width: 100%;
  }
}

/* Mobile phones (480px and below) */
@media (max-width: 480px) {

  /* Cards */
  .content-card {
    padding: 0.875rem;
  }

  .card-title {
    font-size: 1rem;
  }

  /* Enhanced Mobile Card Styling */
  .data-table tbody {
    gap: 1rem;
  }

  .data-table tr {
    border-radius: 10px;
  }

  .data-table td {
    padding: 0.875rem 1rem;
    grid-template-columns: 100px 1fr;
    gap: 0.75rem;
    font-size: 0.85rem;
  }

  .data-table td:first-child {
    padding: 0.875rem 1rem;
    font-size: 0.8rem;
  }

  .data-table td:first-child:before {
    font-size: 0.65rem;
  }

  .data-table td:before {
    font-size: 0.75rem;
  }

  .logo-thumb {
    width: 50px;
    height: 50px;
  }

  .data-table td.action-buttons {
    padding: 1rem;
    gap: 0.625rem;
  }

  .data-table td.action-buttons .btn-action {
    padding: 0.625rem 0.875rem;
    font-size: 0.8rem;
  }

  /* Forms */
  .form-label {
    font-size: 0.8rem;
  }

  /* Buttons */
  .btn-primary,
  .btn-secondary,
  .btn-add-more {
    padding: 0.625rem 1rem;
    font-size: 0.875rem;
  }

  /* Upload Areas */
  .upload-label {
    padding: 1.25rem 0.75rem;
    font-size: 0.875rem;
  }

  .image-preview {
    width: 100px;
    height: 100px;
  }

  /* Status Badges */
  .status-badge {
    font-size: 0.7rem;
    padding: 0.3rem 0.625rem;
  }
}

/* Extra small devices (360px and below) */
@media (max-width: 360px) {
  .btn-primary,
  .btn-secondary {
    padding: 0.5rem 0.875rem;
    font-size: 0.8rem;
  }

  .data-table td {
    grid-template-columns: 90px 1fr;
    padding: 0.75rem 0.875rem;
    font-size: 0.8rem;
  }

  .data-table td:before {
    font-size: 0.7rem;
  }
}

/* Touch-friendly improvements */
@media (hover: none) and (pointer: coarse) {
  /* Increase tap targets */
  .btn-action,
  .btn-close,
  .btn-remove,
  .remove-image {
    min-width: 44px;
    min-height: 44px;
  }

  /* Improve scroll behavior */
  .table-container {
    -webkit-overflow-scrolling: touch;
  }

  /* Prevent zoom on input focus */
  input,
  select,
  textarea {
    font-size: 16px !important;
  }
}

/* Accessibility improvements for mobile */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Print styles */
@media print {
  .data-table thead {
    display: table-header-group;
  }

  .data-table,
  .data-table tbody,
  .data-table tr,
  .data-table td {
    display: table;
  }

  .data-table tr {
    display: table-row;
  }

  .data-table td {
    display: table-cell;
  }

  .btn-action,
  .pagination {
    display: none;
  }
}

</style>
