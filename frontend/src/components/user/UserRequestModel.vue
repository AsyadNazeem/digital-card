<template>
  <!-- Request Limit Increase Banner - Fixed to header -->
  <div
      v-if="showBanner"
      :class="['limit-banner', { 'dark-mode': isDarkMode }]">
    <div class="limit-banner-content">
      <div class="limit-banner-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 9v4"/>
          <path d="M12 17h.01"/>
          <path d="M10.3 3.86l-7.18 12.42A2 2 0 0 0 4.82 19h14.36a2 2 0 0 0 1.7-2.72L13.7 3.86a2 2 0 0 0-3.4 0z"/>
        </svg>
      </div>
      <div class="limit-banner-text">
        <h3>You've reached your limit!</h3>
        <p>Request more companies, contacts, or reviews from the admin to continue adding.</p>
      </div>
      <button @click="showRequestModal = true" class="btn-request">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path>
        </svg>
        Request More
      </button>
    </div>
  </div>

  <!-- Request Limit Increase Modal -->
  <transition name="modal">
    <div v-if="showRequestModal" class="modal-overlay" @click="showRequestModal = false">
      <div :class="['request-modal-container', { 'dark-mode': isDarkMode }]" @click.stop>
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
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div class="limit-info">
                  <span class="limit-label">Contacts</span>
                  <span class="limit-value">{{ contactCount }} / {{ userLimits.contactLimit }}</span>
                </div>
              </div>
              <div class="limit-card">
                <div class="limit-icon review">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </div>
                <div class="limit-info">
                  <span class="limit-label">Reviews</span>
                  <span class="limit-value">{{ reviewCount }} / {{ userLimits.reviewLimit }}</span>
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
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
              </div>
            </div>

            <div class="request-form-group">
              <label class="request-label">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                How many reviews do you need?
              </label>
              <div class="quantity-selector">
                <button type="button" @click="decrementReviews" class="qty-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
                <input
                    type="number"
                    v-model.number="requestForm.reviews"
                    min="0"
                    max="100"
                    class="qty-input"
                />
                <button type="button" @click="incrementReviews" class="qty-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
                      :disabled="requestLoading || (requestForm.companies === 0 && requestForm.contacts === 0 && requestForm.reviews === 0)">
                <svg v-if="!requestLoading" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
</template>

<script setup>
import { ref, computed, watch, onUnmounted, inject } from "vue";
import api from "@/services/api";

const props = defineProps({
  companyCount: {
    type: Number,
    required: true,
  },
  contactCount: {
    type: Number,
    required: true,
  },
  reviewCount: {
    type: Number,
    required: true,
  },
  userLimits: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['banner-visibility']);

// Inject dark mode state
const isDarkMode = inject('isDarkMode', ref(false));

const showRequestModal = ref(false);

const requestForm = ref({
  companies: 0,
  contacts: 0,
  reviews: 0,
  reason: "",
});

const requestLoading = ref(false);
const requestMessage = ref("");
const requestSuccess = ref(false);

// Computed property to determine if banner should show
const showBanner = computed(() => {
  return props.companyCount >= props.userLimits.companyLimit ||
      props.contactCount >= props.userLimits.contactLimit ||
      props.reviewCount >= props.userLimits.reviewLimit;
});

// Watch for banner visibility changes and emit to parent
watch(showBanner, (newVal) => {
  emit('banner-visibility', newVal);

  // Add/remove class to body to adjust layout
  if (newVal) {
    document.body.classList.add('banner-active');
  } else {
    document.body.classList.remove('banner-active');
  }
}, { immediate: true });

// Cleanup on component unmount
onUnmounted(() => {
  document.body.classList.remove('banner-active');
});

function incrementCompanies() {
  requestForm.value.companies++;
}

function decrementCompanies() {
  if (requestForm.value.companies > 0) {
    requestForm.value.companies--;
  }
}

function incrementContacts() {
  requestForm.value.contacts++;
}

function decrementContacts() {
  if (requestForm.value.contacts > 0) {
    requestForm.value.contacts--;
  }
}

function incrementReviews() {
  requestForm.value.reviews++;
}

function decrementReviews() {
  if (requestForm.value.reviews > 0) {
    requestForm.value.reviews--;
  }
}

async function submitRequest() {
  requestMessage.value = "";
  requestSuccess.value = false;

  if (
      requestForm.value.companies === 0 &&
      requestForm.value.contacts === 0 &&
      requestForm.value.reviews === 0
  ) {
    requestMessage.value = "Please request at least one item.";
    return;
  }

  try {
    requestLoading.value = true;

    const res = await api.post("/dashboard/request-limits", {
      companies: requestForm.value.companies,
      contacts: requestForm.value.contacts,
      reviews: requestForm.value.reviews,
      reason: requestForm.value.reason,
    });

    requestSuccess.value = true;
    requestMessage.value = res.data.message || "Request submitted successfully.";

    requestForm.value = {
      companies: 0,
      contacts: 0,
      reviews: 0,
      reason: "",
    };

    setTimeout(() => {
      showRequestModal.value = false;
      requestMessage.value = "";
    }, 1500);
  } catch (err) {
    requestSuccess.value = false;
    requestMessage.value = err.response?.data?.message || "Failed to submit request.";
  } finally {
    requestLoading.value = false;
  }
}
</script>

<style scoped>
/* Fixed Limit Banner - Stuck to Header */
.limit-banner {
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #FDF8F3 0%, #F5E6D3 100%);
  border-bottom: 2px solid #C19A6B;
  padding: 1rem 2rem;
  z-index: 99;
  box-shadow: 0 4px 12px rgba(107, 68, 35, 0.15);
  animation: slideDown 0.3s ease-out;
  transition: all 0.3s ease;
}

/* Dark Mode for Banner - Professional Dark Purple-Blue */
.limit-banner.dark-mode {
  background: linear-gradient(135deg, #2d2640 0%, #1a1626 100%);
  border-bottom: 2px solid #3d3555;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.limit-banner-content {
  max-width: 1700px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.limit-banner-icon {
  flex-shrink: 0;
  width: 2.75rem;
  height: 2.75rem;
  background: linear-gradient(135deg, #D4AF37 0%, #C19A6B 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
}

.limit-banner-text {
  flex: 1;
}

.limit-banner-text h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.0625rem;
  font-weight: 700;
  color: #6B4423;
  letter-spacing: -0.01em;
}

.dark-mode .limit-banner-text h3 {
  color: #E5C4A0;
}

.limit-banner-text p {
  margin: 0;
  font-size: 0.875rem;
  color: #8B5A3C;
}

.dark-mode .limit-banner-text p {
  color: #D4A574;
}

.btn-request {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #6B4423 0%, #8B5A3C 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(107, 68, 35, 0.25);
}

.btn-request:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(107, 68, 35, 0.35);
  background: linear-gradient(135deg, #8B5A3C 0%, #A67C52 100%);
}

.btn-request:active {
  transform: translateY(0);
}

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

/* Request Modal */
.request-modal-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(107, 68, 35, 0.3);
  max-width: 650px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  animation: modalSlideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transition: all 0.3s ease;
}

/* Dark Mode for Modal - Professional Dark Purple-Blue */
.request-modal-container.dark-mode {
  background: #1a1626;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
}

@keyframes modalSlideUp {
  from {
    transform: translateY(30px) scale(0.95);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

.request-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  border-bottom: 1px solid #F5E6D3;
  background: linear-gradient(135deg, #FDF8F3 0%, #ffffff 100%);
  border-radius: 16px 16px 0 0;
}

.dark-mode .request-modal-header {
  border-bottom: 1px solid #2d2640;
  background: linear-gradient(135deg, #2d2640 0%, #1a1626 100%);
}

.request-modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  letter-spacing: -0.02em;
}

.dark-mode .request-modal-title {
  color: #e5e7eb;
}

.btn-close {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  transition: all 0.2s;
}

.dark-mode .btn-close {
  color: #9ca3af;
}

.btn-close:hover {
  background: #FDF8F3;
  color: #6B4423;
}

.dark-mode .btn-close:hover {
  background: #2d2640;
  color: #E5C4A0;
}

.request-modal-body {
  padding: 2rem;
}

/* Current Limits */
.current-limits {
  margin-bottom: 2rem;
  padding: 1.75rem;
  background: linear-gradient(135deg, #FDF8F3 0%, #F5E6D3 100%);
  border-radius: 12px;
  border: 1px solid #F5E6D3;
}

.dark-mode .current-limits {
  background: linear-gradient(135deg, #2d2640 0%, #1a1626 100%);
  border: 1px solid #3d3555;
}

.current-limits h3 {
  margin: 0 0 1.25rem 0;
  font-size: 1.0625rem;
  font-weight: 600;
  color: #6B4423;
}

.dark-mode .current-limits h3 {
  color: #E5C4A0;
}

.limits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.limit-card {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1.25rem;
  background: white;
  border-radius: 10px;
  border: 1px solid #F5E6D3;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(107, 68, 35, 0.05);
}

.dark-mode .limit-card {
  background: #0f0d1a;
  border: 1px solid #2d2640;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.limit-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(107, 68, 35, 0.1);
}

.dark-mode .limit-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.limit-icon {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.limit-icon.company {
  background: linear-gradient(135deg, #6B4423 0%, #8B5A3C 100%);
  color: white;
}

.limit-icon.contact {
  background: linear-gradient(135deg, #A67C52 0%, #C19A6B 100%);
  color: white;
}

.limit-icon.review {
  background: linear-gradient(135deg, #D4AF37 0%, #DEB887 100%);
  color: white;
}

.limit-info {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.limit-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dark-mode .limit-label {
  color: #9ca3af;
}

.limit-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
}

.dark-mode .limit-value {
  color: #e5e7eb;
}

/* Request Form */
.request-form {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.request-form-group {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.request-label {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1f2937;
}

.dark-mode .request-label {
  color: #e5e7eb;
}

.request-label svg {
  color: #6B4423;
}

.dark-mode .request-label svg {
  color: #D4A574;
}

/* Quantity Selector */
.quantity-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: #FDF8F3;
  border: 2px solid #F5E6D3;
  border-radius: 10px;
  transition: all 0.2s;
}

.dark-mode .quantity-selector {
  background: #0f0d1a;
  border: 2px solid #2d2640;
}

.quantity-selector:focus-within {
  border-color: #8B5A3C;
  box-shadow: 0 0 0 3px rgba(139, 90, 60, 0.1);
}

.dark-mode .quantity-selector:focus-within {
  border-color: #D4A574;
  box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.2);
}

.qty-btn {
  width: 2.25rem;
  height: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  color: #6B4423;
  flex-shrink: 0;
}

.dark-mode .qty-btn {
  background: #1a1626;
  border: 1px solid #3d3555;
  color: #D4A574;
}

.qty-btn:hover {
  background: linear-gradient(135deg, #6B4423 0%, #8B5A3C 100%);
  border-color: #6B4423;
  color: white;
  transform: scale(1.05);
}

.dark-mode .qty-btn:hover {
  background: linear-gradient(135deg, #D4A574 0%, #E5C4A0 100%);
  border-color: #D4A574;
}

.qty-btn:active {
  transform: scale(0.95);
}

.qty-input {
  flex: 1;
  text-align: center;
  font-size: 1.375rem;
  font-weight: 700;
  color: #1f2937;
  background: transparent;
  border: none;
  outline: none;
  padding: 0.25rem;
}

.dark-mode .qty-input {
  color: #e5e7eb;
}

.qty-input::-webkit-inner-spin-button,
.qty-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.request-textarea {
  width: 100%;
  padding: 1rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.9375rem;
  font-family: inherit;
  resize: vertical;
  transition: all 0.2s;
  color: #1f2937;
}

.dark-mode .request-textarea {
  background: #0f0d1a;
  border: 2px solid #2d2640;
  color: #e5e7eb;
}

.request-textarea:focus {
  outline: none;
  border-color: #8B5A3C;
  box-shadow: 0 0 0 3px rgba(139, 90, 60, 0.1);
}

.dark-mode .request-textarea:focus {
  border-color: #D4A574;
  box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.2);
}

.request-textarea::placeholder {
  color: #9ca3af;
}

.dark-mode .request-textarea::placeholder {
  color: #6b7280;
}

/* Request Actions */
.request-actions {
  display: flex;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid #F5E6D3;
}

.dark-mode .request-actions {
  border-top: 1px solid #2d2640;
}

.btn-submit-request {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  padding: 0.875rem 1.75rem;
  background: linear-gradient(135deg, #6B4423 0%, #8B5A3C 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
  box-shadow: 0 2px 8px rgba(107, 68, 35, 0.25);
}

.btn-submit-request:hover:not(:disabled) {
  background: linear-gradient(135deg, #8B5A3C 0%, #A67C52 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(107, 68, 35, 0.35);
}

.btn-submit-request:active:not(:disabled) {
  transform: translateY(0);
}

.btn-submit-request:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.dark-mode .btn-submit-request:disabled {
  background: #2d2640;
  color: #6b7280;
}

.btn-cancel-request {
  padding: 0.875rem 1.75rem;
  background: white;
  color: #6b7280;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.dark-mode .btn-cancel-request {
  background: #0f0d1a;
  color: #9ca3af;
  border: 2px solid #2d2640;
}

.btn-cancel-request:hover {
  background: #FDF8F3;
  border-color: #F5E6D3;
  color: #6B4423;
}

.dark-mode .btn-cancel-request:hover {
  background: #2d2640;
  border-color: #3d3555;
  color: #E5C4A0;
}

.request-message {
  padding: 1rem 1.25rem;
  border-radius: 10px;
  font-size: 0.9375rem;
  font-weight: 500;
  text-align: center;
  animation: messageSlide 0.3s ease-out;
}

@keyframes messageSlide {
  from {
    transform: translateY(-10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.request-message.success {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  color: #166534;
  border: 2px solid #86efac;
}

.dark-mode .request-message.success {
  background: linear-gradient(135deg, #1a3a23 0%, #1e4f2a 100%);
  color: #86efac;
  border: 2px solid #166534;
}

.request-message.error {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #991b1b;
  border: 2px solid #fca5a5;
}

.dark-mode .request-message.error {
  background: linear-gradient(135deg, #3a1a1a 0%, #4f1e1e 100%);
  color: #fca5a5;
  border: 2px solid #991b1b;
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

.modal-enter-active .request-modal-container,
.modal-leave-active .request-modal-container {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from .request-modal-container,
.modal-leave-to .request-modal-container {
  transform: translateY(30px) scale(0.95);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .limit-banner {
    padding: 1rem 1.5rem;
  }

  .limit-banner-content {
    gap: 0.875rem;
  }
}

@media (max-width: 768px) {
  .limit-banner {
    top: 60px;
    padding: 0.875rem 1rem;
  }

  .limit-banner-content {
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .limit-banner-icon {
    width: 2.25rem;
    height: 2.25rem;
  }

  .limit-banner-icon svg {
    width: 20px;
    height: 20px;
  }

  .limit-banner-text h3 {
    font-size: 0.9375rem;
  }

  .limit-banner-text p {
    font-size: 0.8125rem;
  }

  .btn-request {
    width: 100%;
    justify-content: center;
    padding: 0.625rem 1.25rem;
  }

  .request-modal-container {
    margin: 0.5rem;
    max-height: 85vh;
  }

  .request-modal-header {
    padding: 1.5rem;
  }

  .request-modal-title {
    font-size: 1.25rem;
  }

  .request-modal-body {
    padding: 1.5rem;
  }

  .current-limits {
    padding: 1.25rem;
  }

  .limits-grid {
    grid-template-columns: 1fr;
    gap: 0.875rem;
  }

  .limit-card {
    padding: 1rem;
  }

  .limit-icon {
    width: 2.5rem;
    height: 2.5rem;
  }

  .request-form {
    gap: 1.5rem;
  }

  .quantity-selector {
    padding: 0.875rem 1rem;
  }

  .qty-btn {
    width: 2rem;
    height: 2rem;
  }

  .qty-input {
    font-size: 1.25rem;
  }

  .request-actions {
    flex-direction: column;
    gap: 0.75rem;
  }

  .btn-submit-request,
  .btn-cancel-request {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .limit-banner {
    padding: 0.75rem;
  }

  .limit-banner-text h3 {
    font-size: 0.875rem;
  }

  .limit-banner-text p {
    font-size: 0.75rem;
    display: none;
  }

  .btn-request {
    padding: 0.5rem 1rem;
    font-size: 0.8125rem;
  }

  .btn-request svg {
    width: 16px;
    height: 16px;
  }

  .request-modal-header {
    padding: 1.25rem;
  }

  .request-modal-title {
    font-size: 1.125rem;
  }

  .request-modal-body {
    padding: 1.25rem;
  }

  .current-limits {
    padding: 1rem;
  }

  .limit-card {
    padding: 0.875rem;
  }

  .limit-icon {
    width: 2.25rem;
    height: 2.25rem;
  }

  .limit-value {
    font-size: 1.125rem;
  }

  .request-label {
    font-size: 0.875rem;
  }

  .quantity-selector {
    padding: 0.75rem;
  }

  .qty-input {
    font-size: 1.125rem;
  }
}

/* Adjust main content when banner is visible */
.main-content-with-banner {
  margin-top: 130px !important;
}

@media (max-width: 768px) {
  .main-content-with-banner {
    margin-top: 120px !important;
  }
}

@media (max-width: 480px) {
  .main-content-with-banner {
    margin-top: 110px !important;
  }
}

/* Global styles to push content down when banner is active */
:global(body.banner-active) {
  --banner-height: 76px;
}

@media (max-width: 768px) {
  :global(body.banner-active) {
    --banner-height: 70px;
  }
}

@media (max-width: 480px) {
  :global(body.banner-active) {
    --banner-height: 60px;
  }
}
</style>
