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
              <textarea v-model="form.bio" class="form-textarea" rows="4"></textarea>
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
import CountrySelector from "@/components/CountrySelector.vue";
import ImageCropperModal from "@/components/ImageCropper.vue";

const props = defineProps({
  show: Boolean,
  company: Object
})

const emit = defineEmits(['close', 'saved'])

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
  poBox: ''
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

// Watch for company prop changes
// Replace the existing watch function with this:
watch(() => props.company, (newCompany) => {
  if (newCompany) {
    // If there's an ID, we're editing; otherwise, we're creating
    const isCreating = !newCompany.id

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
      poBox: newCompany.poBox || ''
    }

    // Only set logo preview if editing existing company
    if (!isCreating && newCompany.logo) {
      logoPreview.value = `${VITE_IMAGE_UPLOAD_URL}${newCompany.logo}`
      logoFileName.value = newCompany.logo.split('/').pop()
    } else {
      logoPreview.value = ''
      logoFileName.value = ''
    }

    // Load social links only if editing
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

  // Determine if we're creating or editing
  const isCreating = !props.company?.id

  saving.value = true
  try {
    const formData = new FormData()

    // Append all form fields
    Object.keys(form.value).forEach(key => {
      if (form.value[key] !== null && form.value[key] !== '') {
        formData.append(key, form.value[key])
      }
    })

    // Prepare social links
    const socialLinks = {}

    // Add enabled main social media
    mainSocialMedia.value.forEach(social => {
      if (social.enabled && social.url) {
        socialLinks[social.name] = social.url
      }
    })

    // Add enabled custom social media
    customSocialMedia.value.forEach(custom => {
      if (custom.enabled && custom.name && custom.url) {
        socialLinks[custom.name] = custom.url
      }
    })

    formData.append('socialLinks', JSON.stringify(socialLinks))

    // Append logo if changed
    if (logoFile.value) {
      formData.append('logo', logoFile.value)
    } else if (!isCreating && props.company.logo) {
      formData.append('existingLogo', props.company.logo)
    }

    // Different endpoints for create vs edit
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

    console.log(isCreating ? '✅ Company created:' : '✅ Company updated:', response.data)
    alert(isCreating ? 'Company created successfully!' : 'Company updated successfully!')
    emit('saved')
    closeModal()
  } catch (err) {
    console.error('❌ Error saving company:', err)
    alert(err.response?.data?.message || 'Failed to save company')
  } finally {
    saving.value = false
  }
}

function closeModal() {
  logoFile.value = null
  logoFileName.value = ''
  logoPreview.value = ''
  emit('close')
}
</script>

<style scoped>
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
