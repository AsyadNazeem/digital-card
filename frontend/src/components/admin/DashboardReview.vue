<template>
  <transition name="modal-fade">
    <div v-if="show" class="modal-overlay">
      <div class="modal-container" @click.stop>
        <!-- Modal Header -->
        <div class="modal-header">
          <h2 class="modal-title">
            {{ isEditMode ? 'Edit Review' : 'Add New Review' }}
          </h2>
          <button @click="closeModal" class="btn-close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="modal-body">
          <!-- Company Selection -->
          <div class="form-group">
            <label class="form-label">
              Company <span class="required">*</span>
            </label>
            <select v-model="form.companyId" class="form-input" required>
              <option value="" disabled>Select a company</option>
              <option v-for="company in companies" :key="company.id" :value="company.id">
                {{ company.companyName }}
              </option>
            </select>
            <p v-if="errors.companyId" class="error-text">{{ errors.companyId }}</p>
          </div>

          <!-- Branch Name -->
          <div class="form-group">
            <label class="form-label">
              Branch Name <span class="required">*</span>
            </label>
            <input
                v-model="form.branchName"
                type="text"
                class="form-input"
                placeholder="e.g., Colombo Branch"
                required
            />
            <p v-if="errors.branchName" class="error-text">{{ errors.branchName }}</p>
          </div>

          <!-- Location -->
          <div class="form-group">
            <label class="form-label">Branch Location</label>
            <input
                v-model="form.location"
                type="text"
                class="form-input"
                placeholder="City, Area, Address"
            />
          </div>

          <!-- Google Review Link -->
          <div class="form-group">
            <label class="form-label">Google Review Link</label>
            <input
                v-model="form.googleLink"
                type="url"
                class="form-input"
                placeholder="https://..."
            />
            <p v-if="errors.googleLink" class="error-text">{{ errors.googleLink }}</p>
          </div>

          <!-- Tripadvisor Link -->
          <div class="form-group">
            <label class="form-label">Tripadvisor Link</label>
            <input
                v-model="form.tripadvisorLink"
                type="url"
                class="form-input"
                placeholder="https://..."
            />
            <p v-if="errors.tripadvisorLink" class="error-text">{{ errors.tripadvisorLink }}</p>
          </div>

          <!-- Action Buttons -->
          <div class="form-actions">
            <button type="submit" class="btn-save" :disabled="loading">
              <svg v-if="loading" class="spinner" width="20" height="20" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              <span v-else>{{ isEditMode ? 'Update Review' : 'Create Review' }}</span>
            </button>
            <button type="button" @click="closeModal" class="btn-cancel">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import adminApi from '@/services/adminApi'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  review: {
    type: Object,
    default: null
  },
  userId: {
    type: [Number, String],
    required: true
  },
  companies: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'saved'])

const loading = ref(false)
const errors = ref({})

const isEditMode = computed(() => !!props.review?.id)

const form = ref({
  companyId: '',
  branchName: '',
  location: '',
  googleLink: '',
  tripadvisorLink: ''
})

// Watch for review prop changes
watch(() => props.review, (newReview) => {
  if (newReview) {
    form.value = {
      companyId: newReview.companyId || '',
      branchName: newReview.branchName || '',
      location: newReview.location || '',
      googleLink: newReview.googleLink || '',
      tripadvisorLink: newReview.tripadvisorLink || ''
    }
  } else {
    resetForm()
  }
}, { immediate: true })

// Watch show prop to reset form when modal opens for create
watch(() => props.show, (isShowing) => {
  if (isShowing && !props.review?.id) {
    resetForm()
  }
})

function resetForm() {
  form.value = {
    companyId: '',
    branchName: '',
    location: '',
    googleLink: '',
    tripadvisorLink: ''
  }
  errors.value = {}
}

function validateForm() {
  errors.value = {}

  if (!form.value.companyId) {
    errors.value.companyId = 'Please select a company'
  }

  if (!form.value.branchName.trim()) {
    errors.value.branchName = 'Branch name is required'
  }

  if (form.value.googleLink && !isValidUrl(form.value.googleLink)) {
    errors.value.googleLink = 'Invalid URL format'
  }

  if (form.value.tripadvisorLink && !isValidUrl(form.value.tripadvisorLink)) {
    errors.value.tripadvisorLink = 'Invalid URL format'
  }

  return Object.keys(errors.value).length === 0
}

function isValidUrl(string) {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

async function handleSubmit() {
  if (!validateForm()) return

  loading.value = true

  try {
    if (isEditMode.value) {
      await adminApi.put(`/user/${props.userId}/review/${props.review.id}`, form.value)
      alert('✅ Review updated successfully!')
    } else {
      await adminApi.post(`/user/${props.userId}/review`, form.value)
      alert('✅ Review created successfully!')
    }
    emit('saved')
    closeModal()
  } catch (err) {
    console.error('Error saving review:', err)
    alert(err.response?.data?.message || 'Failed to save review')
  } finally {
    loading.value = false
  }
}

function closeModal() {
  resetForm()
  emit('close')
}
</script>

/* Add these responsive styles to your Review Modal */

<style scoped>
/* ============================================
   BASE STYLES
   ============================================ */

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
  z-index: 2000;
  padding: 12px;
}

.modal-container {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  max-height: calc(100vh - 24px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(45, 31, 26, 0.3);
  border: 2px solid #e5e1dc;
  margin: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid #e5e1dc;
  background: linear-gradient(135deg, #f8f6f4 0%, #f1ede8 100%);
  flex-shrink: 0;
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
  flex-shrink: 0;
}

.btn-close:hover {
  background: #fee2e2;
  color: #dc2626;
  transform: rotate(90deg);
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #2d1f1a;
  font-size: 0.95rem;
}

.required {
  color: #dc2626;
  margin-left: 2px;
}

.form-input,
select.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e5e1dc;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s;
  color: #2d1f1a;
  background: white;
  font-family: inherit;
  box-sizing: border-box;
}

.form-input:focus,
select.form-input:focus {
  outline: none;
  border-color: #5c4033;
  box-shadow: 0 0 0 3px rgba(92, 64, 51, 0.1);
}

.error-text {
  margin-top: 6px;
  color: #dc2626;
  font-size: 0.85rem;
  word-break: break-word;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e5e1dc;
}

.btn-save {
  flex: 1;
  padding: 14px 24px;
  background: linear-gradient(135deg, #5c4033 0%, #3e2a23 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-save:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(92, 64, 51, 0.4);
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-cancel {
  padding: 14px 24px;
  background: white;
  color: #5c4033;
  border: 2px solid #e5e1dc;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.btn-cancel:hover {
  background: #f8f6f4;
}

.spinner {
  animation: spin 1s linear infinite;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-active .modal-container,
.modal-fade-leave-active .modal-container {
  transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-container,
.modal-fade-leave-to .modal-container {
  transform: scale(0.9) translateY(20px);
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* ============================================
   RESPONSIVE - TABLET (768px - 1024px)
   ============================================ */

@media (max-width: 1024px) {
  .modal-header {
    padding: 20px 24px;
  }

  .modal-title {
    font-size: 1.3rem;
  }

  .modal-body {
    padding: 24px;
  }

  .form-group {
    margin-bottom: 20px;
  }
}

/* ============================================
   RESPONSIVE - MOBILE (below 768px)
   ============================================ */

@media (max-width: 768px) {
  .modal-overlay {
    padding: 0;
    align-items: flex-start;
    background: white;
    backdrop-filter: none;
    overflow-y: auto; /* ADD THIS - Enable scrolling */
  }

  .modal-container {
    max-height: none; /* CHANGE from 100vh to none */
    min-height: 100vh;
    border-radius: 0;
    margin: 0;
    box-shadow: none;
  }

  .modal-header {
    padding: 16px;
    border-radius: 0;
    position: sticky;
    top: 0;
    z-index: 10;
    background: linear-gradient(135deg, #f8f6f4 0%, #f1ede8 100%);
  }



  .modal-title {
    font-size: 1.15rem;
  }

  .btn-close {
    padding: 6px;
  }

  .modal-body {
    padding: 20px 16px;
    overflow-y: visible;
  }

  .form-group {
    margin-bottom: 18px;
  }

  .form-label {
    font-size: 0.85rem;
    margin-bottom: 6px;
  }

  .form-input,
  select.form-input {
    font-size: 16px; /* Prevent iOS zoom */
    padding: 12px 14px;
  }

  .error-text {
    font-size: 0.8rem;
    margin-top: 4px;
  }

  /* Stack form actions vertically */
  .form-actions {
    flex-direction: column-reverse;
    gap: 10px;
    margin-top: 24px;
    padding-top: 20px;
  }

  .btn-save,
  .btn-cancel {
    width: 100%;
    padding: 14px;
    font-size: 0.95rem;
  }

  .btn-cancel {
    border-width: 1px;
  }
}

/* ============================================
   RESPONSIVE - SMALL MOBILE (below 480px)
   ============================================ */

@media (max-width: 480px) {
  .modal-header {
    padding: 12px;
  }

  .modal-title {
    font-size: 1rem;
    line-height: 1.3;
  }

  .modal-body {
    padding: 16px 12px;
  }

  .form-group {
    margin-bottom: 16px;
  }

  .form-label {
    font-size: 0.8rem;
    margin-bottom: 5px;
  }

  .form-input,
  select.form-input {
    padding: 10px 12px;
    font-size: 16px;
  }

  .error-text {
    font-size: 0.75rem;
  }

  .form-actions {
    margin-top: 20px;
    padding-top: 16px;
  }

  .btn-save,
  .btn-cancel {
    padding: 12px;
    font-size: 0.9rem;
  }

  .spinner {
    width: 18px;
    height: 18px;
  }
}

/* ============================================
   LANDSCAPE MOBILE OPTIMIZATION
   ============================================ */

@media (max-width: 768px) and (orientation: landscape) {
  .modal-container {
    max-height: 100vh;
  }

  .modal-header {
    padding: 12px 16px;
  }

  .modal-body {
    padding: 16px;
  }

  .form-group {
    margin-bottom: 16px;
  }

  .form-actions {
    margin-top: 20px;
    padding-top: 16px;
  }
}

/* ============================================
   ACCESSIBILITY
   ============================================ */

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .btn-close:hover {
    transform: none;
  }

  .btn-save:hover:not(:disabled) {
    transform: none;
  }
}

/* Focus states for keyboard navigation */
.btn-close:focus-visible,
.btn-save:focus-visible,
.btn-cancel:focus-visible,
.form-input:focus-visible,
select.form-input:focus-visible {
  outline: 2px solid #5c4033;
  outline-offset: 2px;
}

/* Improve touch targets on mobile */
@media (max-width: 768px) {
  .btn-close {
    min-width: 44px;
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .btn-close svg {
    width: 20px;
    height: 20px;
  }
}

/* ============================================
   ENHANCED SELECT DROPDOWN FOR MOBILE
   ============================================ */

@media (max-width: 768px) {
  select.form-input {
    /* Improve native select appearance on mobile */
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%232d1f1a' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 40px;
  }
}

/* ============================================
   INPUT PLACEHOLDER OPTIMIZATION
   ============================================ */

.form-input::placeholder {
  color: #9ca3af;
  opacity: 1;
}

@media (max-width: 768px) {
  .form-input::placeholder {
    font-size: 0.9rem;
  }
}

/* ============================================
   SMOOTH SCROLLING
   ============================================ */

.modal-body {
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}
</style>
