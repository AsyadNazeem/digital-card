<template>
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
</template>

<script setup>
import { ref } from 'vue';
import CountryCodeDropdown from '@/components/CountryCodeDropdown.vue';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';
import api from '@/services/api';

const props = defineProps({
  showPhonePopup: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['phone-added', 'close']);

// State
const phoneNumber = ref('');
const countryCode = ref('+1');
const errorMsg = ref('');
const loading = ref(false);

const phoneValidation = ref({
  isValid: false,
  message: ''
});

// Validate phone number
function validatePhone(value, code) {
  try {
    const digitsOnly = value.replace(/\D/g, '');
    const fullNumber = `${code}${digitsOnly}`;

    if (isValidPhoneNumber(fullNumber)) {
      const phoneNumber = parsePhoneNumber(fullNumber);
      return {
        isValid: true,
        formatted: phoneNumber.formatInternational(),
        e164: phoneNumber.format('E.164'),
        countryCode: phoneNumber.country,
        type: phoneNumber.getType()
      };
    }

    return {
      isValid: false,
      error: 'Invalid phone number'
    };
  } catch (error) {
    return {
      isValid: false,
      error: error.message || 'Invalid phone number'
    };
  }
}

// Handle phone input
function handleContactMobile(event) {
  const value = event.target.value.replace(/\D/g, '');
  phoneNumber.value = value;

  if (value.length > 0) {
    const validation = validatePhone(value, countryCode.value);
    phoneValidation.value = {
      isValid: validation.isValid,
      message: validation.isValid
          ? `✅ Valid ${validation.type || 'phone'} number`
          : `⚠️ ${validation.error}`
    };
  } else {
    phoneValidation.value = { isValid: false, message: '' };
  }

  // Clear error message when typing
  errorMsg.value = '';
}

// Submit phone number
async function submitPhone() {
  const validation = validatePhone(phoneNumber.value, countryCode.value);

  if (!validation.isValid) {
    errorMsg.value = validation.error || 'Please enter a valid phone number.';
    return;
  }

  try {
    loading.value = true;
    errorMsg.value = '';

    const token = localStorage.getItem('token');

    const res = await api.post(
        '/settings/add-phone',
        {
          phone: validation.e164 // Send in E.164 format
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
    );

    // Success - emit event and close modal
    emit('phone-added', validation.e164);
    emit('close');

    // Show success message
    alert('✅ ' + (res.data.message || 'Phone number saved successfully!'));

  } catch (err) {
    errorMsg.value = err.response?.data?.message || 'Failed to save phone number. Please try again.';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
/* Modal Overlay */
.phone-popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  padding: 1rem;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Modal Container */
.phone-popup-container {
  background: white;
  border-radius: 1.25rem;
  max-width: 480px;
  width: 100%;
  padding: 2.5rem;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  animation: modalSlideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
}

@keyframes modalSlideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Header */
.phone-popup-header {
  text-align: center;
  margin-bottom: 2rem;
}

.phone-popup-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.75rem 0;
  line-height: 1.2;
}

.phone-popup-description {
  font-size: 0.9375rem;
  color: #64748b;
  margin: 0;
  line-height: 1.6;
}

/* Form */
.phone-popup-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.phone-form-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.phone-form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  text-align: left;
}

.phone-input-group {
  display: flex;
  gap: 0.75rem;
  align-items: stretch;
}

.phone-form-input {
  flex: 1;
  padding: 0.875rem 1rem;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 1rem;
  color: #0f172a;
  transition: all 0.2s;
  font-family: inherit;
}

.phone-form-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
}

.phone-form-input::placeholder {
  color: #94a3b8;
}

/* Submit Button */
.phone-submit-btn {
  width: 100%;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.phone-submit-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #4338ca 0%, #4f46e5 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(79, 70, 229, 0.4);
}

.phone-submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.phone-submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Error Message */
.phone-error-message {
  margin: 0;
  padding: 0.75rem 1rem;
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  color: #991b1b;
  font-size: 0.875rem;
  text-align: center;
  animation: shake 0.4s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  75% { transform: translateX(8px); }
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

.modal-enter-active .phone-popup-container,
.modal-leave-active .phone-popup-container {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from .phone-popup-container,
.modal-leave-to .phone-popup-container {
  opacity: 0;
  transform: translateY(30px) scale(0.9);
}

/* Loading State Animation */
.phone-submit-btn:disabled::after {
  content: '';
  display: inline-block;
  width: 1rem;
  height: 1rem;
  margin-left: 0.5rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Validation Feedback */
.phone-input-group:has(.phone-form-input:focus) {
  position: relative;
}

.phone-form-input:valid {
  border-color: #22c55e;
}

.phone-form-input:invalid:not(:placeholder-shown) {
  border-color: #ef4444;
}

/* Mobile Responsive */
@media (max-width: 640px) {
  .phone-popup-overlay {
    padding: 0;
    align-items: stretch;
  }

  .phone-popup-container {
    max-width: 100%;
    border-radius: 0;
    padding: 2rem 1.5rem;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .phone-popup-title {
    font-size: 1.5rem;
  }

  .phone-popup-description {
    font-size: 0.875rem;
  }

  .phone-input-group {
    flex-direction: column;
  }

  .phone-form-input {
    padding: 1rem;
  }

  .phone-submit-btn {
    padding: 1.125rem 1.5rem;
    font-size: 1.0625rem;
  }
}

/* Tablet */
@media (max-width: 768px) {
  .phone-popup-container {
    max-width: 90%;
    padding: 2rem;
  }
}

/* Accessibility - Focus Visible */
.phone-form-input:focus-visible,
.phone-submit-btn:focus-visible {
  outline: 2px solid #4f46e5;
  outline-offset: 2px;
}

/* High Contrast Mode Support */
@media (prefers-contrast: high) {
  .phone-popup-container {
    border: 2px solid #0f172a;
  }

  .phone-form-input {
    border-width: 3px;
  }
}

/* Dark Mode Support (Optional) */
@media (prefers-color-scheme: dark) {
  .phone-popup-container {
    background: #1e293b;
    color: #f1f5f9;
  }

  .phone-popup-title {
    color: #f1f5f9;
  }

  .phone-popup-description {
    color: #cbd5e1;
  }

  .phone-form-label {
    color: #cbd5e1;
  }

  .phone-form-input {
    background: #334155;
    border-color: #475569;
    color: #f1f5f9;
  }

  .phone-form-input::placeholder {
    color: #64748b;
  }

  .phone-form-input:focus {
    border-color: #6366f1;
    background: #334155;
  }
}

/* Print Styles */
@media print {
  .phone-popup-overlay {
    display: none;
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .phone-popup-overlay,
  .phone-popup-container,
  .phone-submit-btn,
  .phone-error-message {
    animation: none;
    transition: none;
  }
}
</style>
