<template>
  <div class="review-share-container">
    <!-- Loading State -->
    <div v-if="loading" class="loading-screen">
      <div class="spinner"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-card">
      <div class="error-icon">⚠️</div>
      <h2>Review Not Found</h2>
      <p>{{ error }}</p>
    </div>

    <!-- Main Content -->
    <div v-else class="review-card">

      <!-- Header Section with Company Logo Background -->
      <div class="header-section">
        <!-- Company Logo as Background -->
        <div v-if="review.logo" class="company-logo-container">
          <img
              :src="`${VITE_IMAGE_UPLOAD_URL}${review.logo}`"
              alt="Company Logo"
              class="company-logo-bg"
          />
          <div class="logo-overlay"></div>
        </div>

        <!-- Fallback gradient if no logo -->
        <div v-else class="gradient-background"></div>

      </div>

      <!-- Review Info -->
      <div class="review-info">
        <h1 class="branch-name">{{ review.branchName }}</h1>
        <p v-if="review.company" class="company-name">{{ review.company }}</p>
        <p v-if="review.location" class="location">📍 {{ review.location }}</p>
      </div>

      <!-- QR Codes Section -->
      <div class="qr-section">
        <h2 class="section-title">Scan to Leave a Review</h2>
        <p class="section-subtitle">Help us improve by sharing your experience</p>

        <!-- QR Code Grid (Vertical Layout) -->
        <div class="qr-grid">

          <!-- Google Review QR -->
          <div v-if="review.googleLink" class="qr-card">
            <div class="qr-card-header">
              <div class="platform-badge google">
                <svg width="24" height="24" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                </svg>
              </div>
              <h3>Google Review</h3>
            </div>

            <div class="qr-canvas-container">
              <canvas ref="googleQrCanvas"></canvas>
            </div>

            <a :href="review.googleLink" target="_blank" class="qr-link-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              Open Google Review
            </a>
          </div>

          <!-- Tripadvisor Review QR -->
          <div v-if="review.tripadvisorLink" class="qr-card">
            <div class="qr-card-header">
              <div class="platform-badge tripadvisor">
                <svg width="24" height="24" viewBox="0 0 50 50">
                  <path d="M 25 11 C 19.167969 11 13.84375 12.511719 9.789063 15 L 2 15 C 2 15 3.753906 17.152344 4.578125 19.578125 C 2.96875 21.621094 2 24.195313 2 27 C 2 33.628906 7.371094 39 14 39 C 17.496094 39 20.636719 37.492188 22.828125 35.105469 L 25 38 L 27.171875 35.105469 C 29.363281 37.492188 32.503906 39 36 39 C 42.628906 39 48 33.628906 48 27 C 48 24.195313 47.03125 21.621094 45.421875 19.578125 C 46.246094 17.152344 48 15 48 15 L 40.203125 15 C 36.148438 12.511719 30.828125 11 25 11 Z M 14 18 C 18.972656 18 23 22.027344 23 27 C 23 31.972656 18.972656 36 14 36 C 9.027344 36 5 31.972656 5 27 C 5 22.027344 9.027344 18 14 18 Z M 36 18 C 40.972656 18 45 22.027344 45 27 C 45 31.972656 40.972656 36 36 36 C 31.027344 36 27 31.972656 27 27 C 27 22.027344 31.027344 18 36 18 Z M 14 21 C 10.6875 21 8 23.6875 8 27 C 8 30.3125 10.6875 33 14 33 C 17.3125 33 20 30.3125 20 27 C 20 23.6875 17.3125 21 14 21 Z M 36 21 C 32.6875 21 30 23.6875 30 27 C 30 30.3125 32.6875 33 36 33 C 39.3125 33 42 30.3125 42 27 C 42 23.6875 39.3125 21 36 21 Z M 14 23 C 16.210938 23 18 24.789063 18 27 C 18 29.210938 16.210938 31 14 31 C 11.789063 31 10 29.210938 10 27 C 10 24.789063 11.789063 23 14 23 Z M 36 23 C 38.210938 23 40 24.789063 40 27 C 40 29.210938 38.210938 31 36 31 C 33.789063 31 32 29.210938 32 27 C 32 24.789063 33.789063 23 36 23 Z M 14 25 C 12.894531 25 12 25.894531 12 27 C 12 28.105469 12.894531 29 14 29 C 15.105469 29 16 28.105469 16 27 C 16 25.894531 15.105469 25 14 25 Z M 36 25 C 34.894531 25 34 25.894531 34 27 C 34 28.105469 34.894531 29 36 29 C 37.105469 29 38 28.105469 38 27 C 38 25.894531 37.105469 25 36 25 Z" fill="#26e07f"></path>
                </svg>
              </div>
              <h3>Tripadvisor</h3>
            </div>

            <div class="qr-canvas-container">
              <canvas ref="tripadvisorQrCanvas"></canvas>
            </div>

            <a :href="review.tripadvisorLink" target="_blank" class="qr-link-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              Open Tripadvisor
            </a>
          </div>
        </div>

        <!-- Download Button -->
        <button @click="downloadBothQRCodes" class="download-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Download QR Codes
        </button>
      </div>

      <!-- Footer -->
      <div class="footer">
        Powered by <span>TapMyName</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, nextTick} from 'vue';
import {useRoute} from 'vue-router';
import QRCode from 'qrcode';
import api from '../services/api';

// ✅ Import image upload URL config
const VITE_IMAGE_UPLOAD_URL = import.meta.env.VITE_IMAGE_UPLOAD_URL || 'http://localhost:4000';

const route = useRoute();
const loading = ref(true);
const error = ref('');
const review = ref(null);

const googleQrCanvas = ref(null);
const tripadvisorQrCanvas = ref(null);

onMounted(async () => {
  try {
    const shareCode = route.params.code;

    if (!shareCode) {
      error.value = 'Invalid share link';
      loading.value = false;
      return;
    }

    const res = await api.get(`/reviews/share/${shareCode}`);
    review.value = res.data;

    loading.value = false;

    await nextTick();
    await generateQRCodes();

  } catch (err) {
    console.error('Error loading review:', err);
    error.value = err.response?.data?.message || 'Review not found or no longer available';
    loading.value = false;
  }
});

async function generateQRCodes() {
  try {
    if (review.value.googleLink && googleQrCanvas.value) {
      await QRCode.toCanvas(googleQrCanvas.value, review.value.googleLink, {
        width: 280,
        margin: 2,
        color: {dark: '#000000', light: '#ffffff'}
      });
    }

    if (review.value.tripadvisorLink && tripadvisorQrCanvas.value) {
      await QRCode.toCanvas(tripadvisorQrCanvas.value, review.value.tripadvisorLink, {
        width: 280,
        margin: 2,
        color: {dark: '#000000', light: '#ffffff'}
      });
    }
  } catch (err) {
    console.error('Error generating QR codes:', err);
  }
}

async function downloadBothQRCodes() {
  try {
    const canvas1 = googleQrCanvas.value;
    const canvas2 = tripadvisorQrCanvas.value;

    if (!canvas1 && !canvas2) {
      alert('No QR codes available to download');
      return;
    }

    const poster = document.createElement('canvas');
    const padding = 40;
    const qrSize = 320;

    const hasGoogle = !!canvas1;
    const hasTripadvisor = !!canvas2;
    const qrCount = (hasGoogle ? 1 : 0) + (hasTripadvisor ? 1 : 0);

    const width = qrSize * qrCount + padding * (qrCount + 1);
    const height = qrSize + 260;

    poster.width = width;
    poster.height = height;
    const ctx = poster.getContext('2d');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    let currentX = padding;

    if (hasGoogle) {
      const img1 = new Image();
      img1.src = canvas1.toDataURL('image/png');
      await new Promise((resolve) => {
        img1.onload = resolve;
      });

      ctx.drawImage(img1, currentX, 40, qrSize, qrSize);

      ctx.fillStyle = '#111';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Google Review', currentX + qrSize / 2, 40 + qrSize + 32);

      currentX += qrSize + padding;
    }

    if (hasTripadvisor) {
      const img2 = new Image();
      img2.src = canvas2.toDataURL('image/png');
      await new Promise((resolve) => {
        img2.onload = resolve;
      });

      ctx.drawImage(img2, currentX, 40, qrSize, qrSize);

      ctx.fillStyle = '#111';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Tripadvisor', currentX + qrSize / 2, 40 + qrSize + 32);
    }

    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(
        review.value.company || review.value.branchName,
        width / 2,
        40 + qrSize + 80
    );

    poster.toBlob((blob) => {
      const file = new File(
          [blob],
          `${review.value.branchName || 'review'}-qr-codes.png`,
          {type: 'image/png'}
      );
      const a = document.createElement('a');
      a.href = URL.createObjectURL(file);
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(a.href);
    }, 'image/png');

  } catch (err) {
    console.error('Download error:', err);
    alert('Failed to download QR codes');
  }
}
</script>

<style scoped>
* {
  font-family: 'Gotham', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.review-share-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 30px 15px;
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
  border: 5px solid rgba(44, 95, 141, 0.2);
  border-top-color: #2c5f8d;
  border-radius: 50%;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Error State */
.error-card {
  background: white;
  border-radius: 24px;
  padding: 60px 40px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  max-width: 500px;
}

.error-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.error-card h2 {
  font-size: 28px;
  color: #1a472a;
  margin-bottom: 12px;
  font-weight: 700;
}

.error-card p {
  color: #666;
  font-size: 16px;
}

/* Main Card */
.review-card {
  width: 100%;
  max-width: 600px;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

/* Header Section with Logo Background */
.header-section {
  position: relative;
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* Company Logo as Background */
.company-logo-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.company-logo-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transform: scale(1.05);
  transition: transform 0.8s ease;
}


/* Fallback gradient background */
.gradient-background {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #2c5f8d 0%, #1a3a52 100%);
}


/* Review Info */
.review-info {
  text-align: center;
  padding: 80px 30px 30px;
  background: white;
  border-bottom: 1px solid #f0f0f0;
}

.branch-name {
  font-size: 1.85rem;
  font-weight: 700;
  color: #1a472a;
  margin-bottom: 8px;
  letter-spacing: 0.02em;
}

.company-name {
  font-size: 1.1rem;
  color: #c5663a;
  font-weight: 600;
  margin: 8px 0;
}

.location {
  font-size: 0.95rem;
  color: #666;
  margin: 8px 0;
}

/* QR Section */
.qr-section {
  padding: 40px 30px;
  background: white;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a472a;
  text-align: center;
  margin-bottom: 8px;
}

.section-subtitle {
  text-align: center;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 30px;
}

/* QR Grid - Vertical Layout */
.qr-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.qr-card {
  background: #fafbfc;
  border-radius: 16px;
  padding: 24px;
  border: 2px solid #e8ecf1;
  transition: all 0.3s ease;
}

.qr-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  border-color: #2c5f8d;
}

.qr-card-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.platform-badge {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.platform-badge.google {
  background: white;
}

.platform-badge.tripadvisor {
  background: white;
}

.qr-card-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a472a;
  margin: 0;
}

.qr-canvas-container {
  background: white;
  padding: 16px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.qr-canvas-container canvas {
  display: block;
  max-width: 100%;
  height: auto;
}

.qr-link-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 93%;
  padding: 12px;
  background: linear-gradient(135deg, #2c5f8d 0%, #1a3a52 100%);
  color: white;
  text-decoration: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(44, 95, 141, 0.25);
}

.qr-link-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(44, 95, 141, 0.35);
}

/* Download Button */
.download-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 16px;
  background: linear-gradient(90deg, rgba(107, 168, 66, 1) 0%, rgba(25, 117, 60, 1) 52%, rgba(94, 102, 63, 1) 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(26, 71, 42, 0.3);
}

.download-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(26, 71, 42, 0.5);
}

.download-btn:active {
  transform: translateY(0);
}

/* Footer */
.footer {
  text-align: center;
  padding: 24px;
  color: #999;
  font-size: 0.8rem;
  background: #fafbfc;
  border-top: 1px solid #f0f0f0;
}

.footer span {
  font-weight: 700;
  background: linear-gradient(135deg, #1a472a 0%, #c5663a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Mobile Responsive */
@media (max-width: 640px) {
  .review-share-container {
    padding: 0;
  }

  .review-card {
    border-radius: 0;
    box-shadow: none;
    min-height: 100vh;
  }

  .header-section {
    height: 240px;
  }

  .qr-grid {
    gap: 16px;
  }

  .qr-section {
    padding: 30px 20px;
  }

  .review-info {
    padding: 80px 20px 30px;
  }

  .branch-name {
    font-size: 1.6rem;
  }

  .company-name {
    font-size: 1rem;
  }

  .qr-card {
    padding: 20px;
  }

  .company-logo-circle {
    bottom: -50px;
  }

  .logo-image-wrapper,
  .logo-placeholder {
    width: 100px;
    height: 100px;
  }

  .logo-placeholder {
    font-size: 40px;
  }
}
</style>
