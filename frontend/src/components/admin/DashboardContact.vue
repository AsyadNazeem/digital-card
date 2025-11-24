<template>
  <transition name="modal-fade">
    <div v-if="show" class="modal-overlay" @click="closeModal">
      <div class="modal-container" @click.stop>
        <!-- Modal Header -->
        <div class="modal-header">
          <h2 class="modal-title">{{ contact?.id ? 'Edit Contact' : 'Create Contact' }}</h2>
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
            <!-- Contact Photo Upload -->
            <div class="form-group full-width">
              <label class="form-label">Contact Photo</label>
              <div class="upload-area">
                <input
                    type="file"
                    @change="handlePhotoUpload"
                    accept="image/*"
                    id="edit-photo-upload"
                    class="file-input"
                />
                <label for="edit-photo-upload" class="upload-label">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  <span>{{ photoFileName || 'Click to upload new photo' }}</span>
                </label>
                <div v-if="photoPreview" class="image-preview">
                  <img :src="photoPreview" alt="Photo preview"/>
                  <button @click="removePhoto" class="remove-image" type="button">×</button>
                </div>
              </div>
            </div>

            <!-- Contact Information -->
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">First Name <span class="required">*</span></label>
                <input v-model="form.firstName" type="text" class="form-input" required/>
              </div>
              <div class="form-group">
                <label class="form-label">Last Name <span class="required">*</span></label>
                <input v-model="form.lastName" type="text" class="form-input" required/>
              </div>

              <!-- Telephone with Country Code -->
              <div class="form-group">
                <label class="form-label">Telephone</label>
                <div class="phone-input-group">
                  <CountryCodeDropdown
                      v-model="telephoneCountryCode"
                  />
                  <input
                      v-model="form.telephone"
                      type="tel"
                      class="form-input phone-input"
                      placeholder="Enter phone number"
                      @input="validateTelephone"
                  />
                </div>
                <p v-if="telephoneValidation.message" :class="telephoneValidation.isValid ? 'validation-success' : 'validation-error'">
                  {{ telephoneValidation.message }}
                </p>
              </div>

              <!-- Mobile with Country Code -->
              <div class="form-group">
                <label class="form-label">Mobile <span class="required">*</span></label>
                <div class="phone-input-group">
                  <CountryCodeDropdown
                      v-model="mobileCountryCode"
                  />
                  <input
                      v-model="form.mobile"
                      type="tel"
                      class="form-input phone-input"
                      placeholder="Enter mobile number"
                      @input="validateMobile"
                      required
                  />
                </div>
                <p v-if="mobileValidation.message" :class="mobileValidation.isValid ? 'validation-success' : 'validation-error'">
                  {{ mobileValidation.message }}
                </p>
              </div>

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
                      v-model="form.whatsapp"
                      type="tel"
                      class="form-input phone-input"
                      placeholder="Enter mobile number"
                      @input="handleContactWhatsApp"
                      :disabled="whatsappSameAsMobile"
                      :style="{ opacity: whatsappSameAsMobile ? 0.6 : 1 }"
                  />
                </div>
                <p v-if="mobileValidation.whatsapp?.message && !whatsappSameAsMobile"
                   :class="mobileValidation.whatsapp?.isValid ? 'validation-success' : 'validation-error'">
                  {{ mobileValidation.whatsapp.message }}
                </p>
              </div>

              <div class="form-group">
                <label class="form-label">Email <span class="required">*</span></label>
                <input v-model="form.email" type="email" class="form-input" required/>
              </div>
              <div class="form-group">
                <label class="form-label">Designation <span class="required">*</span></label>
                <input v-model="form.designation" type="text" class="form-input" required/>
              </div>
              <div class="form-group">
                <label class="form-label">Company</label>
                <select v-model="form.companyId" class="form-input">
                  <option value="">Select a company</option>
                  <option
                      v-for="company in companies"
                      :key="company.id"
                      :value="company.id"
                  >
                    {{ company.companyName }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Status <span class="required">*</span></label>
                <select v-model="form.status" class="form-input" required>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="form-actions">
              <button @click="saveContact" class="btn-save" :disabled="saving || !isFormValid">
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

  <!-- Photo Cropper Modal -->
  <ImageCropperModal
      :show="showPhotoCropper"
      :imageSrc="tempPhotoSrc"
      type="photo"
      title="Crop Contact Photo"
      @close="showPhotoCropper = false"
      @cropped="handlePhotoCropped"
  />
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import adminApi from '../../services/adminApi'
import { VITE_IMAGE_UPLOAD_URL } from '@/config.js'
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js'
import ImageCropperModal from "@/components/ImageCropper.vue"
import CountryCodeDropdown from "@/components/CountryCodeDropdown.vue";

const props = defineProps({
  show: Boolean,
  contact: Object,
  userId: Number
})

const emit = defineEmits(['close', 'saved'])

const form = ref({
  firstName: '',
  lastName: '',
  telephone: '',
  mobile: '',
  whatsapp: "", // ADD THIS
  email: '',
  designation: '',
  companyId: '',
  status: 'active'
})

const telephoneCountryCode = ref('+971')
const mobileCountryCode = ref('+971')
const telephoneValidation = ref({isValid: false, message: ''})
const mobileValidation = ref({
  isValid: false,
  message: '',
  whatsapp: { isValid: false, message: '' }
})

const photoFile = ref(null)
const photoFileName = ref('')
const photoPreview = ref('')
const saving = ref(false)
const companies = ref([])

// Image cropper states
const showPhotoCropper = ref(false)
const tempPhotoSrc = ref('')
const whatsappSameAsMobile = ref(true);
const whatsappCountryCode = ref('+971');


function handleContactWhatsApp(event) {
  const value = event.target.value.replace(/\D/g, '');
  form.value.whatsapp = value;

  if (value.length > 0) {
    const fullNumber = whatsappCountryCode.value + value;
    try {
      if (isValidPhoneNumber(fullNumber)) {
        const phoneNumber = parsePhoneNumber(fullNumber);
        mobileValidation.value.whatsapp = {
          isValid: true,
          message: `✓ Valid ${phoneNumber.country} number`
        };
      } else {
        mobileValidation.value.whatsapp = {
          isValid: false,
          message: '✗ Invalid WhatsApp number'
        };
      }
    } catch (error) {
      mobileValidation.value.whatsapp = {
        isValid: false,
        message: '✗ Invalid WhatsApp number format'
      };
    }
  } else {
    mobileValidation.value.whatsapp = { isValid: false, message: '' };
  }
}
// Watch mobile field changes to sync WhatsApp
watch([() => form.value.mobile, () => mobileCountryCode.value], ([newMobile, newCode]) => {
  if (whatsappSameAsMobile.value && newMobile) {
    form.value.whatsapp = newMobile;
    whatsappCountryCode.value = newCode;
    mobileValidation.value.whatsapp = mobileValidation.value;
  }
});

const isFormValid = computed(() => {
  return form.value.firstName &&
      form.value.lastName &&
      form.value.mobile &&
      form.value.email &&
      form.value.designation &&
      mobileValidation.value.isValid
})

// Watch for contact prop changes
// Replace the existing watch function for props.contact:
watch(() => props.contact, (newContact) => {
  if (newContact) {
    const isCreating = !newContact.id

    // Extract number without country code
    const extractNumber = (fullNumber) => {
      if (!fullNumber) return ''
      try {
        const phoneNumber = parsePhoneNumber(fullNumber)
        return phoneNumber.nationalNumber
      } catch {
        return fullNumber.replace(/\D/g, '')
      }
    }

    form.value = {
      firstName: newContact.firstName || '',
      lastName: newContact.lastName || '',
      telephone: isCreating ? '' : extractNumber(newContact.telephone),
      mobile: isCreating ? '' : extractNumber(newContact.mobile),
      whatsapp: isCreating ? '' : extractNumber(newContact.whatsapp),
      email: newContact.email || '',
      designation: newContact.designation || '',
      companyId: newContact.companyId || '',
      status: newContact.status || 'active'
    }

    // Extract country codes only if editing
    if (!isCreating) {
      try {
        if (newContact.mobile) {
          const mobilePhone = parsePhoneNumber(newContact.mobile)
          mobileCountryCode.value = `+${mobilePhone.countryCallingCode}`
        }
        if (newContact.whatsapp) {
          const whatsappPhone = parsePhoneNumber(newContact.whatsapp)
          whatsappCountryCode.value = `+${whatsappPhone.countryCallingCode}`
          whatsappSameAsMobile.value = newContact.whatsapp === newContact.mobile
        } else {
          whatsappSameAsMobile.value = true
          whatsappCountryCode.value = mobileCountryCode.value
        }
        if (newContact.telephone) {
          const telPhone = parsePhoneNumber(newContact.telephone)
          telephoneCountryCode.value = `+${telPhone.countryCallingCode}`
        }
      } catch (err) {
        console.error('Error parsing phone numbers:', err)
      }

      // Set existing photo preview only if editing
      if (newContact.photo) {
        photoPreview.value = `${VITE_IMAGE_UPLOAD_URL}${newContact.photo}`
        photoFileName.value = newContact.photo.split('/').pop()
      } else {
        photoPreview.value = ''
        photoFileName.value = ''
      }

      // Validate initial phone numbers
      if (form.value.telephone) {
        validateTelephone()
      }
      if (form.value.mobile) {
        validateMobile()
      }
    } else {
      // Reset defaults for new contact
      photoPreview.value = ''
      photoFileName.value = ''
      whatsappSameAsMobile.value = true
      mobileCountryCode.value = '+971'
      telephoneCountryCode.value = '+971'
      whatsappCountryCode.value = '+971'
    }
  }
}, {immediate: true})

// Fetch companies when modal opens
watch(() => props.show, async (isShown) => {
  if (isShown && props.userId) {
    try {
      const res = await adminApi.get(`/user/${props.userId}/companies`)
      companies.value = res.data.companies || []
    } catch (err) {
      console.error('Error fetching companies:', err)
      companies.value = []
    }
  }
})

function validateTelephone() {
  const fullNumber = telephoneCountryCode.value + form.value.telephone

  if (!form.value.telephone) {
    telephoneValidation.value = {isValid: true, message: ''}
    return
  }

  try {
    if (isValidPhoneNumber(fullNumber)) {
      const phoneNumber = parsePhoneNumber(fullNumber)
      telephoneValidation.value = {
        isValid: true,
        message: `✓ Valid ${phoneNumber.country} number`
      }
    } else {
      telephoneValidation.value = {
        isValid: false,
        message: '✗ Invalid phone number'
      }
    }
  } catch (error) {
    telephoneValidation.value = {
      isValid: false,
      message: '✗ Invalid phone number format'
    }
  }
}

function validateMobile() {
  const fullNumber = mobileCountryCode.value + form.value.mobile

  if (!form.value.mobile) {
    mobileValidation.value = {isValid: false, message: 'Mobile number is required'}
    return
  }

  try {
    if (isValidPhoneNumber(fullNumber)) {
      const phoneNumber = parsePhoneNumber(fullNumber)
      mobileValidation.value = {
        isValid: true,
        message: `✓ Valid ${phoneNumber.country} number`
      }
    } else {
      mobileValidation.value = {
        isValid: false,
        message: '✗ Invalid mobile number'
      }
    }
  } catch (error) {
    mobileValidation.value = {
      isValid: false,
      message: '✗ Invalid mobile number format'
    }
  }
}

function handlePhotoUpload(e) {
  const file = e.target.files[0]
  if (file) {
    photoFileName.value = file.name

    // Create temporary URL for cropper
    const reader = new FileReader()
    reader.onload = (event) => {
      tempPhotoSrc.value = event.target.result
      showPhotoCropper.value = true
    }
    reader.readAsDataURL(file)
  }
}

function handlePhotoCropped(blob) {
  // Convert blob to file
  const file = new File([blob], photoFileName.value || 'photo.jpg', {type: 'image/jpeg'})
  photoFile.value = file

  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    photoPreview.value = e.target.result
  }
  reader.readAsDataURL(blob)

  showPhotoCropper.value = false
}

function removePhoto() {
  photoFile.value = null
  photoFileName.value = ''
  if (props.contact?.photo) {
    photoPreview.value = `${VITE_IMAGE_UPLOAD_URL}${props.contact.photo}`
  } else {
    photoPreview.value = ''
  }

  // Clear file input
  const fileInput = document.getElementById('edit-photo-upload')
  if (fileInput) {
    fileInput.value = ''
  }
}

async function saveContact() {
  if (!isFormValid.value) {
    alert('Please fill in all required fields correctly')
    return
  }

  if (!props.userId) {
    alert('Invalid contact data')
    return
  }

  // Determine if we're creating or editing
  const isCreating = !props.contact?.id

  saving.value = true
  try {
    const formData = new FormData()

    // Append basic fields
    formData.append('firstName', form.value.firstName)
    formData.append('lastName', form.value.lastName)
    formData.append('email', form.value.email)
    formData.append('designation', form.value.designation)
    formData.append('status', form.value.status)

    // Append phone numbers with country codes
    const fullMobile = mobileCountryCode.value + form.value.mobile
    formData.append('mobile', fullMobile)

    const fullWhatsapp = whatsappCountryCode.value + form.value.whatsapp
    formData.append('whatsapp', fullWhatsapp)

    if (form.value.telephone) {
      const fullTelephone = telephoneCountryCode.value + form.value.telephone
      formData.append('telephone', fullTelephone)
    }

    // Append company if selected
    if (form.value.companyId) {
      formData.append('companyId', form.value.companyId)
    }

    // Append photo if changed
    if (photoFile.value) {
      formData.append('photo', photoFile.value)
    } else if (!isCreating && props.contact.photo) {
      formData.append('existingPhoto', props.contact.photo)
    }

    // Different endpoints for create vs edit
    const url = isCreating
        ? `/user/${props.userId}/contact`
        : `/user/${props.userId}/contact/${props.contact.id}`

    const method = isCreating ? 'post' : 'put'

    const response = await adminApi[method](
        url,
        formData,
        {
          headers: {'Content-Type': 'multipart/form-data'}
        }
    )

    console.log(isCreating ? '✅ Contact created:' : '✅ Contact updated:', response.data)
    alert(isCreating ? 'Contact created successfully!' : 'Contact updated successfully!')
    emit('saved')
    closeModal()
  } catch (err) {
    console.error('❌ Error saving contact:', err)
    alert(err.response?.data?.message || 'Failed to save contact')
  } finally {
    saving.value = false
  }
}

function closeModal() {
  photoFile.value = null
  photoFileName.value = ''
  photoPreview.value = ''
  telephoneValidation.value = {isValid: false, message: ''}
  mobileValidation.value = {isValid: false, message: ''}
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
  max-width: 800px;
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

.form-input {
  padding: 10px 12px;
  border: 1px solid #e5e1dc;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #5c4033;
}

.phone-input-group {
  display: flex;
  gap: 8px;
}

.country-code-select {
  width: 100px;
  padding: 10px 8px;
  border: 1px solid #e5e1dc;
  border-radius: 8px;
  font-size: 0.95rem;
  background: white;
  cursor: pointer;
}

.country-code-select:focus {
  outline: none;
  border-color: #5c4033;
}

.phone-input {
  flex: 1;
}

.validation-success {
  color: #27ae60;
  font-size: 0.85rem;
  margin-top: 4px;
}

.validation-error {
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 4px;
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
