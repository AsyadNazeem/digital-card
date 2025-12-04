<template>
  <div class="review-container">
    <!-- Loading State -->
    <div v-if="loading" class="loading-screen">
      <div class="spinner"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-screen">
      <div class="error-icon">⚠️</div>
      <h2>Page Not Found</h2>
      <p>{{ error }}</p>
    </div>

    <!-- Main Content -->
    <div v-else class="review-card">
      <!-- Gradient Background -->
      <div class="gradient-bg"></div>

      <!-- Company Logo -->
      <div class="logo-section">
        <div class="logo-circle">
          <img
              v-if="review.logo"
              :src="`${VITE_IMAGE_UPLOAD_URL}${review.logo}`"
              alt="Company Logo"
              class="logo-img"
          />
          <div v-else class="logo-placeholder">
            {{ review.company?.charAt(0) || '?' }}
          </div>
        </div>
      </div>

      <!-- Company Info -->
      <div class="company-info">
        <h1 class="branch-name">{{ review.branchName }}</h1>
        <p v-if="review.company" class="company-name">{{ review.company }}</p>
      </div>

      <!-- Review Buttons -->
      <div class="button-section">
        <a
            v-if="review.googleLink"
            :href="review.googleLink"
            target="_blank"
            class="review-btn google-btn"
        >
          <svg width="24" height="24" viewBox="0 0 48 48" class="btn-icon">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
          </svg>
          Google Review
        </a>

        <a
            v-if="review.tripadvisorLink"
            :href="review.tripadvisorLink"
            target="_blank"
            class="review-btn tripadvisor-btn"
        >
          <svg width="24" height="24" viewBox="0 0 50 50" class="btn-icon">
            <path d="M 25 11 C 19.167969 11 13.84375 12.511719 9.789063 15 L 2 15 C 2 15 3.753906 17.152344 4.578125 19.578125 C 2.96875 21.621094 2 24.195313 2 27 C 2 33.628906 7.371094 39 14 39 C 17.496094 39 20.636719 37.492188 22.828125 35.105469 L 25 38 L 27.171875 35.105469 C 29.363281 37.492188 32.503906 39 36 39 C 42.628906 39 48 33.628906 48 27 C 48 24.195313 47.03125 21.621094 45.421875 19.578125 C 46.246094 17.152344 48 15 48 15 L 40.203125 15 C 36.148438 12.511719 30.828125 11 25 11 Z M 14 18 C 18.972656 18 23 22.027344 23 27 C 23 31.972656 18.972656 36 14 36 C 9.027344 36 5 31.972656 5 27 C 5 22.027344 9.027344 18 14 18 Z M 36 18 C 40.972656 18 45 22.027344 45 27 C 45 31.972656 40.972656 36 36 36 C 31.027344 36 27 31.972656 27 27 C 27 22.027344 31.027344 18 36 18 Z M 14 21 C 10.6875 21 8 23.6875 8 27 C 8 30.3125 10.6875 33 14 33 C 17.3125 33 20 30.3125 20 27 C 20 23.6875 17.3125 21 14 21 Z M 36 21 C 32.6875 21 30 23.6875 30 27 C 30 30.3125 32.6875 33 36 33 C 39.3125 33 42 30.3125 42 27 C 42 23.6875 39.3125 21 36 21 Z" fill="#26E07F"></path>
          </svg>
          Tripadvisor
        </a>
      </div>

      <!-- Additional Links (Optional) -->
      <div v-if="review.website || review.email" class="extra-links">
        <a v-if="review.website" :href="review.website" target="_blank" class="extra-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
          Website
        </a>

        <a v-if="review.email" :href="`mailto:${review.email}`" class="extra-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          Email
        </a>
      </div>

      <!-- Footer -->
      <div class="footer">
        Powered by <span class="brand">TapMyName</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../services/api';

const VITE_IMAGE_UPLOAD_URL = import.meta.env.VITE_IMAGE_UPLOAD_URL || 'http://localhost:4000';

const route = useRoute();
const loading = ref(true);
const error = ref('');
const review = ref(null);

onMounted(async () => {
  try {
    const companyName = route.params.companyName;
    const branchName = route.params.branchName;

    if (!companyName || !branchName) {
      error.value = 'Invalid review page link';
      loading.value = false;
      return;
    }

    const res = await api.get(`/reviews/share/${companyName}/${branchName}`);
    review.value = res.data;
    loading.value = false;

  } catch (err) {
    console.error('Error loading review page:', err);
    error.value = err.response?.data?.message || 'Review page not found';
    loading.value = false;
  }
});
</script>

<style scoped>
* {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.review-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Loading State */
.loading-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
}

.spinner {
  width: 56px;
  height: 56px;
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error State */
.error-screen {
  background: white;
  border-radius: 24px;
  padding: 60px 40px;
  text-align: center;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.error-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.error-screen h2 {
  font-size: 28px;
  color: #333;
  margin-bottom: 12px;
}

.error-screen p {
  color: #666;
  font-size: 16px;
}

/* Main Card */
.review-card {
  width: 100%;
  max-width: 440px;
  background: white;
  border-radius: 32px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
}

/* Gradient Background */
.gradient-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 380px;
  background: linear-gradient(180deg, #5B86E5 0%, #E96FB4 100%);
  z-index: 0;
}

/* Logo Section */
.logo-section {
  position: relative;
  z-index: 1;
  padding: 60px 0 20px;
  display: flex;
  justify-content: center;
}

.logo-circle {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.logo-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 48px;
  font-weight: 700;
}

/* Company Info */
.company-info {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 120px 30px 40px;
  color: white;
}

.branch-name {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.company-name {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 12px;
  opacity: 0.95;
}

.company-bio {
  font-size: 15px;
  line-height: 1.5;
  opacity: 0.9;
  max-width: 340px;
  margin: 0 auto;
}

/* Button Section */
.button-section {
  position: relative;
  z-index: 1;
  padding: 30px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.review-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 18px 24px;
  background: white;
  color: #5B6B8A;
  text-decoration: none;
  border-radius: 16px;
  font-size: 18px;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.review-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.review-btn:active {
  transform: translateY(0);
}

.btn-icon {
  flex-shrink: 0;
}

/* Extra Links */
.extra-links {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  gap: 24px;
  padding: 20px 24px 30px;
}

.extra-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #5B6B8A;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  transition: color 0.3s ease;
}

.extra-link:hover {
  color: #667eea;
}

.extra-link svg {
  opacity: 0.7;
}

/* Footer */
.footer {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 24px;
  color: #999;
  font-size: 13px;
  background: #f8f9fa;
}

.brand {
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Mobile Responsive */
@media (max-width: 480px) {
  .review-container {
    padding: 0;
  }

  .review-card {
    border-radius: 0;
    min-height: 100vh;
  }

  .branch-name {
    font-size: 28px;
  }

  .company-name {
    font-size: 16px;
  }

  .logo-circle {
    width: 120px;
    height: 120px;
  }

  .review-btn {
    font-size: 16px;
    padding: 16px 20px;
  }
}
</style>
