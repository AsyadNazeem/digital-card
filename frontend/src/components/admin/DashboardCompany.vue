<template>
  <transition name="modal-fade">
    <div v-if="show" class="modal-overlay">
      <div class="modal-container" @click.stop>
        <!-- Modal Header -->
        <div class="modal-header">
          <h2 class="modal-title">{{ company?.id ? 'Edit Company' : 'Create Company' }}</h2>
          <button @click="closeModal" class="btn-close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Form Content -->
        <div class="modal-content">
          <div class="form-container">
            <!-- Basic Information -->
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Company Name <span class="required">*</span></label>
                <input v-model="form.companyName" type="text" class="form-input" required/>
              </div>
              <div class="form-group">
                <label class="form-label">Website <span class="required">*</span></label>
                <input v-model="form.website" type="url" class="form-input" required/>
              </div>
              <div class="form-group">
                <label class="form-label">Website Display URL</label>
                <input v-model="form.displayUrl" type="text" class="form-input"/>
              </div>
              <div class="form-group">
                <label class="form-label">Email <span class="required">*</span></label>
                <input v-model="form.email" type="email" class="form-input" required/>
              </div>
              <div class="form-group">
                <label class="form-label">Status <span class="required">*</span></label>
                <select v-model="form.status" class="form-input" required>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <!-- Logo Upload -->
            <div class="form-group full-width">
              <label class="form-label">Company Logo</label>
              <div class="upload-area">
                <input
                    type="file"
                    @change="handleLogoUpload"
                    accept="image/*"
                    id="edit-logo-upload"
                    class="file-input"
                />
                <label for="edit-logo-upload" class="upload-label">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  <span>{{ logoFileName || 'Click to upload new logo' }}</span>
                </label>
                <div v-if="logoPreview" class="image-preview">
                  <img :src="logoPreview" alt="Logo preview"/>
                  <button @click="removeLogo" class="remove-image" type="button">×</button>
                </div>
              </div>
            </div>

            <!-- Additional Information -->
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">360 View Link</label>
                <input v-model="form.view360" type="url" class="form-input"/>
              </div>
              <div class="form-group">
                <label class="form-label">Google Location</label>
                <input v-model="form.googleLocation" type="text" class="form-input"/>
              </div>
              <div class="form-group">
                <label class="form-label">Google Reviews</label>
                <input v-model="form.googleReviews" type="text" class="form-input"/>
              </div>
              <div class="form-group">
                <label class="form-label">Trip Advisor</label>
                <input v-model="form.tripAdvisor" type="text" class="form-input"/>
              </div>
            </div>

            <div class="form-section">
              <!-- REPLACE the entire "Company Files" section in Document 5 with this -->
              <div class="form-section">
                <h3 class="section-title">Links (Brochure, Menu, Shop Now, Order Now)</h3>

                <!-- Add New Link Form -->
                <div class="link-input-container"
                     style="border: 1px solid #e0e0e0; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                  <div style="display: grid; grid-template-columns: 1fr auto; gap: 12px; align-items: start;">
                    <div>
                      <input
                          v-model="pendingLinkUrl"
                          type="url"
                          class="form-input"
                          placeholder="Enter link URL (e.g., https://example.com/brochure.pdf)"
                          style="margin-bottom: 8px;"
                      />
                      <input
                          v-model="pendingLinkName"
                          type="text"
                          class="form-input"
                          placeholder="Link name (e.g., 2024 Product Catalog)"
                          style="margin-bottom: 12px;"
                      />

                      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                        <label style="display: flex; align-items: center; cursor: pointer;">
                          <input type="checkbox" v-model="pendingLinkType.isBrochure" style="margin-right: 8px;"/>
                          <span>📄 Brochure</span>
                        </label>
                        <label style="display: flex; align-items: center; cursor: pointer;">
                          <input type="checkbox" v-model="pendingLinkType.isMenu" style="margin-right: 8px;"/>
                          <span>🍽️ Menu</span>
                        </label>
                        <label style="display: flex; align-items: center; cursor: pointer;">
                          <input type="checkbox" v-model="pendingLinkType.isShopNow" style="margin-right: 8px;"/>
                          <span>🛒 Shop Now</span>
                        </label>
                        <label style="display: flex; align-items: center; cursor: pointer;">
                          <input type="checkbox" v-model="pendingLinkType.isOrderNow" style="margin-right: 8px;"/>
                          <span>🛍️ Order Now</span>
                        </label>
                      </div>
                    </div>

                    <button
                        type="button"
                        @click="addLinkToList"
                        class="btn-primary"
                        style="height: 40px; white-space: nowrap;"
                    >
                      + Add Link
                    </button>
                  </div>
                </div>

                <!-- List of Added Links -->
                <div v-if="form.files && form.files.length > 0" style="margin-top: 16px;">
                  <div
                      v-for="(link, index) in form.files"
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
                      <div style="display: flex; gap: 8px;">
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
      color: #2e7d32;
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
  🛍️ Order Now
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
                    >
                      🗑️ Remove
                    </button>
                  </div>
                </div>

                <p v-else style="color: #999; font-style: italic; margin-top: 8px;">
                  No links added yet. Add brochures or menu links above.
                </p>
              </div>
            </div>
          </div>

          <!-- Address Section -->
          <div class="form-section">
            <h3 class="section-title">Company Address</h3>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Label</label>
                <select v-model="form.label" class="form-input">
                  <option value="">Select Label</option>
                  <option value="Home">🏠 Home</option>
                  <option value="Work">💼 Work</option>
                  <option value="Office">🏢 Office</option>
                  <option value="Other">📍 Other</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Country/Region</label>
                <CountrySelector v-model="form.country"/>
              </div>
              <div class="form-group full-width">
                <label class="form-label">Street Address</label>
                <input v-model="form.streetAddress" type="text" class="form-input"/>
              </div>
              <div class="form-group full-width">
                <label class="form-label">Street Address Line 2</label>
                <input v-model="form.streetAddressLine2" type="text" class="form-input"/>
              </div>
              <div class="form-group">
                <label class="form-label">City</label>
                <input v-model="form.city" type="text" class="form-input"/>
              </div>
              <div class="form-group">
                <label class="form-label">Postal Code</label>
                <input v-model="form.postalCode" type="text" class="form-input"/>
              </div>
              <div class="form-group">
                <label class="form-label">PO Box</label>
                <input v-model="form.poBox" type="text" class="form-input"/>
              </div>
            </div>
          </div>

          <!-- Company Bio -->
          <div class="form-group full-width">
            <label class="form-label">Company Bio</label>
            <QuillEditor
                v-model:content="form.bio"
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
                      :id="`edit-social-${social.name}`"
                      v-model="social.enabled"
                      class="checkbox-input"
                  />
                  <label :for="`edit-social-${social.name}`" class="checkbox-label">
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
                      :id="`edit-custom-social-${index}`"
                      v-model="custom.enabled"
                      class="checkbox-input"
                  />
                  <label :for="`edit-custom-social-${index}`" class="checkbox-label-small">
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
                <button @click="removeCustomSocial(index)" class="btn-remove" type="button">×</button>
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
            <button @click="saveCompany" class="btn-save" :disabled="saving">
              <span v-if="saving">Saving...</span>
              <span v-else>💾 Save Changes</span>
            </button>
            <button @click="closeModal" class="btn-cancel">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <!-- Logo Cropper Modal -->
  <ImageCropperModal
      :show="showLogoCropper"
      :imageSrc="tempLogoSrc"
      type="logo"
      title="Crop Company Logo"
      @close="showLogoCropper = false"
      @cropped="handleLogoCropped"
  />
</template>

<script setup>
import {ref, watch} from 'vue'
import adminApi from '../../services/adminApi'
import {VITE_IMAGE_UPLOAD_URL} from '@/config.js'
import CountrySelector from "@/components/CountrySelector.vue"
import ImageCropperModal from "@/components/ImageCropper.vue"
import {QuillEditor} from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import Quill from 'quill'

// Configure Quill to use <p> tags
const Block = Quill.import('blots/block');
Block.tagName = 'p';
Quill.register(Block, true);

const props = defineProps({
  show: Boolean,
  company: Object
})

const emit = defineEmits(['close', 'saved'])

const pendingLinkUrl = ref('');
const pendingLinkName = ref('');
const pendingLinkType = ref({
  isBrochure: false,
  isMenu: false,
  isShopNow: false,    // NEW
  isOrderNow: false    // NEW
});

const form = ref({
  companyName: '',
  website: '',
  displayUrl: '',
  email: '',
  status: 'active',
  view360: '',
  googleLocation: '',
  googleReviews: '',
  tripAdvisor: '',
  bio: '',
  label: '',
  country: '',
  streetAddress: '',
  streetAddressLine2: '',
  city: '',
  postalCode: '',
  poBox: '',
  files: [] // Initialize files array
})

const mainSocialMedia = ref([
  {name: 'facebook', label: 'Facebook', enabled: false, url: ''},
  {name: 'instagram', label: 'Instagram', enabled: false, url: ''},
  {name: 'twitter', label: 'Twitter', enabled: false, url: ''},
  {name: 'linkedin', label: 'LinkedIn', enabled: false, url: ''},
  {name: 'youtube', label: 'YouTube', enabled: false, url: ''},
  {name: 'tiktok', label: 'TikTok', enabled: false, url: ''}
])

const customSocialMedia = ref([])
const logoFile = ref(null)
const logoFileName = ref('')
const logoPreview = ref('')
const saving = ref(false)

// Image cropper states
const showLogoCropper = ref(false)
const tempLogoSrc = ref('')

// Validate URL format
function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

// Add link to the list
function addLinkToList() {
  const url = pendingLinkUrl.value.trim();
  const name = pendingLinkName.value.trim();

  if (!url) {
    alert('Please enter a URL');
    return;
  }

  if (!isValidUrl(url)) {
    alert('Please enter a valid URL (must start with http:// or https://)');
    return;
  }

  if (!name) {
    alert('Please enter a name for this link');
    return;
  }

  // ✅ UPDATED: Check all 4 checkboxes
  if (!pendingLinkType.value.isBrochure &&
      !pendingLinkType.value.isMenu &&
      !pendingLinkType.value.isShopNow &&
      !pendingLinkType.value.isOrderNow) {
    alert('Please select at least one type (Brochure, Menu, Shop Now, or Order Now)');
    return;
  }

  if (!form.value.files) {
    form.value.files = [];
  }

  // ✅ UPDATED: Add all 4 fields
  form.value.files.push({
    url: url,
    name: name,
    isBrochure: pendingLinkType.value.isBrochure,
    isMenu: pendingLinkType.value.isMenu,
    isShopNow: pendingLinkType.value.isShopNow,      // NEW
    isOrderNow: pendingLinkType.value.isOrderNow,    // NEW
    isNew: true
  });

  console.log('✅ Link added to list:', {
    name: name,
    url: url,
    isBrochure: pendingLinkType.value.isBrochure,
    isMenu: pendingLinkType.value.isMenu,
    isShopNow: pendingLinkType.value.isShopNow,
    isOrderNow: pendingLinkType.value.isOrderNow
  });

  // ✅ UPDATED: Reset all 4 fields
  pendingLinkUrl.value = '';
  pendingLinkName.value = '';
  pendingLinkType.value = {
    isBrochure: false,
    isMenu: false,
    isShopNow: false,    // NEW
    isOrderNow: false    // NEW
  };
}

// Remove link from list
function removeLink(index) {
  if (confirm('Are you sure you want to remove this link?')) {
    form.value.files.splice(index, 1);
    console.log('🗑️ Link removed at index:', index);
  }
}


// Watch for company prop changes
watch(() => props.company, (newCompany) => {
  if (newCompany) {
    const isCreating = !newCompany.id

    // Parse files - handle both string and array formats
    let parsedFiles = [];
    if (newCompany.files) {
      try {
        // If files is a string, parse it
        if (typeof newCompany.files === 'string') {
          parsedFiles = JSON.parse(newCompany.files);
        }
        // If it's already an array, use it
        else if (Array.isArray(newCompany.files)) {
          parsedFiles = newCompany.files;
        }
      } catch (e) {
        console.error('Error parsing files:', e);
        parsedFiles = [];
      }
    }

    console.log('🔗 Loading company links:', parsedFiles);

    form.value = {
      companyName: newCompany.companyName || '',
      website: newCompany.website || '',
      displayUrl: newCompany.displayUrl || '',
      email: newCompany.email || '',
      status: newCompany.status || 'active',
      view360: newCompany.view360 || '',
      googleLocation: newCompany.googleLocation || '',
      googleReviews: newCompany.googleReviews || '',
      tripAdvisor: newCompany.tripAdvisor || '',
      bio: newCompany.bio || '',
      label: newCompany.label || '',
      country: newCompany.country || '',
      streetAddress: newCompany.streetAddress || '',
      streetAddressLine2: newCompany.streetAddressLine2 || '',
      city: newCompany.city || '',
      postalCode: newCompany.postalCode || '',
      poBox: newCompany.poBox || '',
      files: parsedFiles // ✅ Load links
    }

    // Reset link inputs
    pendingLinkUrl.value = ''
    pendingLinkName.value = ''
    pendingLinkType.value = {
      isBrochure: false,
      isMenu: false,
      isShopNow: false,    // NEW
      isOrderNow: false    // NEW
    }

    // Only set logo preview if editing existing company
    if (!isCreating && newCompany.logo) {
      logoPreview.value = `${VITE_IMAGE_UPLOAD_URL}${newCompany.logo}`
      logoFileName.value = newCompany.logo.split('/').pop()
    } else {
      logoPreview.value = ''
      logoFileName.value = ''
    }

    // Load social links
    const socialLinks = newCompany.socialLinks || {}

    // Reset and populate main social media
    mainSocialMedia.value.forEach(social => {
      if (socialLinks[social.name]) {
        social.enabled = true
        social.url = socialLinks[social.name]
      } else {
        social.enabled = false
        social.url = ''
      }
    })

    // Reset custom social media
    customSocialMedia.value = []

    // Add custom social links (those not in mainSocialMedia)
    if (!isCreating) {
      const mainSocialNames = mainSocialMedia.value.map(s => s.name)
      Object.entries(socialLinks).forEach(([name, url]) => {
        if (!mainSocialNames.includes(name)) {
          customSocialMedia.value.push({
            name: name,
            url: url,
            enabled: true
          })
        }
      })
    }
  }
}, {immediate: true})

function handleLogoUpload(e) {
  const file = e.target.files[0]
  if (file) {
    logoFileName.value = file.name

    // Create temporary URL for cropper
    const reader = new FileReader()
    reader.onload = (event) => {
      tempLogoSrc.value = event.target.result
      showLogoCropper.value = true
    }
    reader.readAsDataURL(file)
  }
}

function handleLogoCropped(blob) {
  // Convert blob to file
  const file = new File([blob], logoFileName.value || 'logo.jpg', {type: 'image/jpeg'})
  logoFile.value = file

  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    logoPreview.value = e.target.result
  }
  reader.readAsDataURL(blob)

  showLogoCropper.value = false
}

function removeLogo() {
  logoFile.value = null
  logoFileName.value = ''
  if (props.company?.logo) {
    logoPreview.value = `${VITE_IMAGE_UPLOAD_URL}${props.company.logo}`
  } else {
    logoPreview.value = ''
  }

  // Clear file input
  const fileInput = document.getElementById('edit-logo-upload')
  if (fileInput) {
    fileInput.value = ''
  }
}

function addCustomSocial() {
  customSocialMedia.value.push({
    name: '',
    url: '',
    enabled: true
  })
}

function removeCustomSocial(index) {
  customSocialMedia.value.splice(index, 1)
}

async function saveCompany() {
  if (!form.value.companyName || !form.value.website || !form.value.email) {
    alert('Please fill in all required fields')
    return
  }

  if (!props.company?.userId) {
    alert('Invalid company data')
    return
  }

  const isCreating = !props.company?.id

  saving.value = true
  try {
    const formData = new FormData()

    // Append all form fields (except files)
    Object.keys(form.value).forEach(key => {
      if (key !== 'files' && form.value[key] !== null && form.value[key] !== '') {
        formData.append(key, form.value[key])
      }
    })

    // Prepare social links
    const socialLinks = {}
    mainSocialMedia.value.forEach(social => {
      if (social.enabled && social.url) {
        socialLinks[social.name] = social.url
      }
    })
    customSocialMedia.value.forEach(custom => {
      if (custom.enabled && custom.name && custom.url) {
        socialLinks[custom.name] = custom.url
      }
    })
    formData.append('socialLinks', JSON.stringify(socialLinks))

    // Handle logo
    if (logoFile.value) {
      formData.append('logo', logoFile.value)
      console.log('📷 Uploading new logo');
    } else if (!isCreating && props.company.logo) {
      formData.append('existingLogo', props.company.logo)
      console.log('📷 Keeping existing logo');
    }

    // ✅ NEW: Handle links instead of files
    const linksToSave = [];

    if (form.value.files && form.value.files.length > 0) {
      console.log('🔗 Processing links:', form.value.files.length);

      form.value.files.forEach((linkObj) => {
        linksToSave.push({
          url: linkObj.url || linkObj.path,
          name: linkObj.name,
          isBrochure: linkObj.isBrochure || false,
          isMenu: linkObj.isMenu || false,
          isShopNow: linkObj.isShopNow || false,      // NEW
          isOrderNow: linkObj.isOrderNow || false,    // NEW
          addedAt: linkObj.addedAt || new Date().toISOString()
        });
      });
    }

    // Send links as JSON string
    if (linksToSave.length > 0) {
      formData.append('files', JSON.stringify(linksToSave));
      console.log('📤 Sending links:', linksToSave);
    }

    console.log('📦 Form data prepared:', {
      isCreating,
      linksCount: linksToSave.length
    });

    // Make API call
    const url = isCreating
        ? `/user/${props.company.userId}/company`
        : `/user/${props.company.userId}/company/${props.company.id}`

    const method = isCreating ? 'post' : 'put'

    const response = await adminApi[method](
        url,
        formData,
        {
          headers: {'Content-Type': 'multipart/form-data'}
        }
    )

    console.log('✅ Company saved:', response.data)
    alert(isCreating ? 'Company created successfully!' : 'Company updated successfully!')
    emit('saved')
    closeModal()
  } catch (err) {
    console.error('❌ Error saving company:', err)
    console.error('Error details:', err.response?.data)
    alert(err.response?.data?.message || 'Failed to save company')
  } finally {
    saving.value = false
  }
}


function closeModal() {
  logoFile.value = null
  logoFileName.value = ''
  logoPreview.value = ''

  // Reset link inputs
  pendingLinkUrl.value = ''
  pendingLinkName.value = ''
  pendingLinkType.value = {
    isBrochure: false,
    isMenu: false,
    isShopNow: false,    // NEW
    isOrderNow: false    // NEW
  }


  emit('close')
}

</script>

<style scoped>
/* File Upload Styles for Admin Modal */

/* Quill Editor Styles */
.quill-editor {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.quill-editor :deep(.ql-toolbar) {
  background: #f8f6f4;
  border: 1px solid #e5e1dc;
  border-bottom: none;
  border-radius: 8px 8px 0 0;
}

.quill-editor :deep(.ql-container) {
  border: 1px solid #e5e1dc;
  border-radius: 0 0 8px 8px;
  min-height: 150px;
  font-size: 0.95rem;
}

.quill-editor :deep(.ql-editor) {
  min-height: 150px;
  padding: 16px;
}

.quill-editor :deep(.ql-editor.ql-blank::before) {
  color: #8a7b75;
  font-style: italic;
}

.field-hint {
  margin-top: 6px;
  font-size: 0.85rem;
  color: #6b5d57;
  font-style: italic;
}

.file-upload-section {
  margin-top: 1rem;
}

.uploaded-files-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.uploaded-file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.2s;
}

.uploaded-file-item:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.file-info svg {
  color: #64748b;
  flex-shrink: 0;
}

.file-details {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.file-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1e293b;
  word-break: break-word;
}

.file-badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.file-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 4px;
  background: #e0e7ff;
  color: #4338ca;
}

.file-badge.brochure {
  background: #dbeafe;
  color: #1e40af;
}

.file-badge.menu {
  background: #fef3c7;
  color: #92400e;
}

.btn-remove-file {
  padding: 0.5rem;
  background: transparent;
  border: none;
  color: #ef4444;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
  flex-shrink: 0;
}

.btn-remove-file:hover {
  background: #fee2e2;
  color: #dc2626;
}

.btn-remove-file svg {
  display: block;
}

.file-type-selection {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.selection-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
  margin-bottom: 0.75rem;
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

.checkbox-input {
  width: 1rem;
  height: 1rem;
  cursor: pointer;
}

.checkbox-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #334155;
  cursor: pointer;
  user-select: none;
}

.btn-add-file {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-add-file:hover:not(:disabled) {
  background: #2563eb;
}

.btn-add-file:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-add-file svg {
  width: 16px;
  height: 16px;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .uploaded-file-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .btn-remove-file {
    align-self: flex-end;
  }

  .file-type-checkboxes {
    flex-direction: column;
    gap: 0.75rem;
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(45, 31, 26, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
}

.modal-container {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(45, 31, 26, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid #e5e1dc;
  background: linear-gradient(135deg, #f8f6f4 0%, #f1ede8 100%);
}

.modal-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d1f1a;
}

.btn-close {
  padding: 8px;
  background: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: #6b5d57;
  transition: all 0.2s;
}

.btn-close:hover {
  background: #fee2e2;
  color: #dc2626;
}

.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;
}

.form-section {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e5e1dc;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d1f1a;
  margin-bottom: 16px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-weight: 600;
  margin-bottom: 8px;
  color: #2d1f1a;
  font-size: 0.9rem;
}

.required {
  color: #dc2626;
}

.form-input, .form-textarea {
  padding: 10px 12px;
  border: 1px solid #e5e1dc;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: border-color 0.2s;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #5c4033;
}

.form-input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.upload-area {
  border: 2px dashed #e5e1dc;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}

.file-input {
  display: none;
}

.upload-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #6b5d57;
}

.image-preview {
  margin-top: 16px;
  position: relative;
  display: inline-block;
}

.image-preview img {
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
}

.remove-image {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
}

.social-links-grid {
  display: grid;
  gap: 16px;
}

.social-link-item {
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 12px;
  align-items: center;
}

.social-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
}

.checkbox-input {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.checkbox-label {
  font-weight: 500;
  color: #2d1f1a;
  cursor: pointer;
}

.checkbox-label-small {
  font-size: 0.9rem;
  font-weight: 500;
  color: #2d1f1a;
  cursor: pointer;
}

.custom-social-section {
  margin-top: 16px;
  display: grid;
  gap: 12px;
}

.custom-social-item {
  display: grid;
  grid-template-columns: 100px 1fr 2fr auto;
  gap: 12px;
  align-items: center;
}

.btn-remove {
  padding: 8px;
  background: #fee2e2;
  color: #dc2626;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  transition: all 0.2s;
}

.btn-remove:hover {
  background: #dc2626;
  color: white;
}

.btn-add-more {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #f1ede8;
  color: #2d1f1a;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  margin-top: 12px;
  transition: all 0.2s;
}

.btn-add-more:hover {
  background: #e5e1dc;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e5e1dc;
}

.btn-save {
  padding: 12px 24px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-save:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-cancel {
  padding: 12px 24px;
  background: #f1ede8;
  color: #2d1f1a;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background: #e5e1dc;
}

.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}
</style>
