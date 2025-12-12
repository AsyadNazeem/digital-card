<template>
  <div v-if="!loaded" class="loading-screen">
    <div class="spinner"></div>
  </div>

  <div v-else-if="error" class="error-screen">
    <div class="error-icon">⚠️</div>
    <h2>{{ locale === 'ar' ? 'الصفحة غير موجودة' : 'Page Not Found' }}</h2>
    <p>{{ error }}</p>
  </div>

  <div
      class="review-share-container"
      v-else
      :dir="locale === 'ar' ? 'rtl' : 'ltr'"
  >
    <!-- Review Card -->
    <div class="review-share-card">

      <!-- Top Image Section with Fade (1/3 of card) -->
      <div class="image-section">
        <img
            v-if="review.logo"
            :src="`${VITE_IMAGE_UPLOAD_URL}${review.logo}`"
            alt="Company Logo"
            class="company-image"
        />
        <div v-else class="placeholder-image">
          <div class="placeholder-text">{{ review.company?.charAt(0) || '?' }}</div>
        </div>
        <div class="image-fade"></div>
      </div>

      <!-- Header Section with Language & Share Buttons -->
      <div class="header-controls">
        <button @click="toggleLanguage" class="language-button" :title="t('selectLanguage')">
          <span v-if="locale === 'en'" class="lang-switch">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
            <span class="lang-text">عربي</span>
          </span>
          <span v-else class="lang-switch">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
            <span class="lang-text">English</span>
          </span>
        </button>

        <button @click="shareCard" class="share-button" :title="t('share')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
        </button>
      </div>

      <!-- Company Info -->
      <div class="company-section">
        <h1 class="company-name">{{ companyname }}</h1>
        <h5 class="branch-name">{{ displayBranchName }}</h5>
      </div>

      <!-- Review Us Title -->
      <div class="review-title">
        <h2>{{ t('reviewUs') }}</h2>
        <div class="stars">
          <svg v-for="i in 5" :key="i" width="32" height="32" viewBox="0 0 24 24" fill="#FFD700">
            <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
          </svg>
        </div>
      </div>

      <!-- Review Buttons -->
      <div class="review-buttons">
        <a
            v-if="review.googleLink"
            :href="review.googleLink"
            target="_blank"
            rel="noopener noreferrer"
            class="review-btn google-btn"
        >
          <svg width="28" height="28" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
          </svg>
          <span>Google</span>
        </a>

        <a
            v-if="review.tripadvisorLink"
            :href="review.tripadvisorLink"
            target="_blank"
            rel="noopener noreferrer"
            class="review-btn tripadvisor-btn"
        >
          <svg width="28" height="28" viewBox="0 0 50 50">
            <path d="M 25 11 C 19.167969 11 13.84375 12.511719 9.789063 15 L 2 15 C 2 15 3.753906 17.152344 4.578125 19.578125 C 2.96875 21.621094 2 24.195313 2 27 C 2 33.628906 7.371094 39 14 39 C 17.496094 39 20.636719 37.492188 22.828125 35.105469 L 25 38 L 27.171875 35.105469 C 29.363281 37.492188 32.503906 39 36 39 C 42.628906 39 48 33.628906 48 27 C 48 24.195313 47.03125 21.621094 45.421875 19.578125 C 46.246094 17.152344 48 15 48 15 L 40.203125 15 C 36.148438 12.511719 30.828125 11 25 11 Z M 14 18 C 18.972656 18 23 22.027344 23 27 C 23 31.972656 18.972656 36 14 36 C 9.027344 36 5 31.972656 5 27 C 5 22.027344 9.027344 18 14 18 Z M 36 18 C 40.972656 18 45 22.027344 45 27 C 45 31.972656 40.972656 36 36 36 C 31.027344 36 27 31.972656 27 27 C 27 22.027344 31.027344 18 36 18 Z M 14 21 C 10.6875 21 8 23.6875 8 27 C 8 30.3125 10.6875 33 14 33 C 17.3125 33 20 30.3125 20 27 C 20 23.6875 17.3125 21 14 21 Z M 36 21 C 32.6875 21 30 23.6875 30 27 C 30 30.3125 32.6875 33 36 33 C 39.3125 33 42 30.3125 42 27 C 42 23.6875 39.3125 21 36 21 Z" fill="#26E07F"></path>
          </svg>
          <span>TripAdvisor</span>
        </a>
      </div>

      <!-- Footer -->
      <footer class="footer">
        {{ t('poweredBy') }} <span>TapMyName</span>
      </footer>
    </div>

    <!-- Translation Loading -->
    <div v-if="isTranslating" class="translation-loading">
      <span>{{ locale === 'ar' ? 'جاري الترجمة...' : 'Translating...' }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../services/api';
import { translateBatch } from '../utils/translator';

const route = useRoute();
const locale = ref('en');
const loaded = ref(false);
const error = ref('');
const translatedData = ref({});
const isTranslating = ref(false);

const VITE_IMAGE_UPLOAD_URL = import.meta.env.VITE_IMAGE_UPLOAD_URL || 'http://localhost:4000';

const review = ref({
  branchName: '',
  location: '',
  company: '',
  companyName: '',     // support both keys if backend uses either
  logo: '',
  googleLink: '',
  tripadvisorLink: '',
});

// ---- single companyname computed (NO duplicate declaration) ----
const companyname = computed(() => {
  // If Arabic selected and we have a translated company name, use it
  if (locale.value === 'ar' && translatedData.value.companyName) {
    return translatedData.value.companyName;
  }
  // Prefer review.company then review.companyName (some endpoints use either)
  return review.value.company || review.value.companyName || '';
});

// Translations
const t = (key) => {
  const translations = {
    en: {
      reviewUs: 'REVIEW US',
      poweredBy: 'Powered by',
      selectLanguage: 'Select Language',
      share: 'Share'
    },
    ar: {
      reviewUs: 'قيمنا',
      poweredBy: 'مدعوم من',
      selectLanguage: 'اختر اللغة',
      share: 'شارك'
    }
  };
  return translations[locale.value][key] || key;
};

// Computed properties for translated content
const displayBranchName = computed(() => {
  if (locale.value === 'ar' && translatedData.value.branchName) {
    return translatedData.value.branchName;
  }
  return review.value.branchName || '';
});

const displayLocation = computed(() => {
  if (locale.value === 'ar' && translatedData.value.location) {
    return translatedData.value.location;
  }
  return review.value.location || '';
});

// Toggle language
const toggleLanguage = async () => {
  const newLocale = locale.value === 'en' ? 'ar' : 'en';
  locale.value = newLocale;
  localStorage.setItem('preferredLanguage', newLocale);

  if (newLocale === 'ar' && Object.keys(translatedData.value).length === 0) {
    await translateContent();
  }
};

// Translate content using your translation utility
const translateContent = async () => {
  isTranslating.value = true;

  try {
    const textsToTranslate = [
      review.value.company || review.value.companyName || '',
      review.value.branchName || '',
      review.value.location || ''
    ];

    // Use your existing translation function with Google Translate
    const translations = await translateBatch(textsToTranslate, 'ar', 'en', true);

    translatedData.value = {
      companyName: translations[0],
      branchName: translations[1],
      location: translations[2]
    };

    console.log('✅ Translation completed', translatedData.value);
  } catch (err) {
    console.error('Translation error:', err);
  } finally {
    isTranslating.value = false;
  }
};

// Share function
const shareCard = async () => {
  const shareUrl = window.location.href;
  const shareText = locale.value === 'ar'
      ? `تحقق من صفحة المراجعة لـ ${companyname.value} - ${displayBranchName.value}`
      : `Check out the review page for ${companyname.value} - ${displayBranchName.value}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: locale.value === 'ar'
            ? `${companyname.value} - صفحة المراجعة`
            : `${companyname.value} - Review Page`,
        text: shareText,
        url: shareUrl,
      });
      console.log('✅ Shared successfully');
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('❌ Error sharing:', err);
        fallbackShare(shareUrl);
      }
    }
  } else {
    fallbackShare(shareUrl);
  }
};

const fallbackShare = (url) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => {
      alert(locale.value === 'ar'
          ? '✅ تم نسخ الرابط! يمكنك الآن لصقه في أي مكان.'
          : '✅ Link copied to clipboard! You can now paste it anywhere.');
    }).catch(err => {
      console.error('Failed to copy:', err);
      promptManualCopy(url);
    });
  } else {
    promptManualCopy(url);
  }
};

const promptManualCopy = (url) => {
  const tempInput = document.createElement('input');
  tempInput.value = url;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
  alert(locale.value === 'ar' ? '✅ تم نسخ الرابط!' : '✅ Link copied to clipboard!');
};

// Update meta tags for social sharing
function updateMetaTags(reviewData) {
  const companyName = reviewData.company || reviewData.companyName || '';
  const branchName = reviewData.branchName || '';

  // Title format: "Company Name - Branch Name"
  const title = companyName
      ? `${companyName} - ${branchName}`
      : branchName;

  const description = locale.value === 'ar'
      ? `تحقق من صفحة المراجعة لـ ${companyName} - ${branchName}`
      : `Check out the review page for ${companyName} - ${branchName}`;

  // Set page title to company name
  document.title = companyName || title;

  const existingMeta = document.querySelectorAll('meta[property^="og:"], meta[name="description"], meta[name="twitter:"]');
  existingMeta.forEach(tag => tag.remove());

  // Use absolute URL for image
  const imageUrl = reviewData.logo
      ? `${VITE_IMAGE_UPLOAD_URL}${reviewData.logo}`
      : '';

  const metaTags = [
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: window.location.href },
    { property: 'og:image', content: imageUrl },
    { property: 'og:image:secure_url', content: imageUrl },
    { property: 'og:image:type', content: 'image/jpeg' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: `${companyName} - ${branchName}` },
    { property: 'og:site_name', content: 'TapMyName' },
    { name: 'description', content: description },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: imageUrl },
  ];

  metaTags.forEach(tag => {
    const meta = document.createElement('meta');
    if (tag.property) {
      meta.setAttribute('property', tag.property);
    } else {
      meta.setAttribute('name', tag.name);
    }
    meta.setAttribute('content', tag.content);
    document.head.appendChild(meta);
  });
}

onMounted(async () => {
  try {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      locale.value = savedLanguage;
    }

    // Get company and branch names from URL params
    const companyName = route.params.companyName;
    const branchName = route.params.branchName;

    if (!companyName || !branchName) {
      error.value = locale.value === 'ar'
          ? 'رابط صفحة المراجعة غير صالح'
          : 'Invalid review page link';
      loaded.value = true;
      return;
    }

    // Fetch review data from API
    const res = await api.get(`/reviews/share/${companyName}/${branchName}`);
    review.value = res.data || {};
    // companyname is derived from computed, no manual ref needed

    // Update meta tags for social sharing
    updateMetaTags(res.data || {});

    loaded.value = true;

    // If Arabic is selected, translate immediately
    if (locale.value === 'ar') {
      await translateContent();
    }

  } catch (err) {
    console.error('Error loading review page:', err);
    error.value = err.response?.data?.message ||
        (locale.value === 'ar' ? 'لم يتم العثور على صفحة المراجعة' : 'Review page not found');
    loaded.value = true;
  }
});
</script>


<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}


.company-name {
  font-size: 28px;
  font-weight: 600;
  color: #111;
  margin-bottom: 4px;
}

/* Loading Screen */
.loading-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

/* Error Screen */
.error-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
  text-align: center;
}

.error-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.error-screen h2 {
  font-size: 28px;
  color: white;
  margin-bottom: 12px;
  font-weight: 700;
}

.error-screen p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  max-width: 400px;
}

.review-share-container {
  min-height: 100vh;               /* full viewport */
  display: flex;
  align-items: center;             /* center horizontally */
  justify-content: center;         /* center horizontally */
  padding: 0;                      /* remove outer padding that caused gaps */
}


/* Card */
.review-share-card {
  width: 100%;
  max-width: 440px;
  display: flex;
  flex-direction: column;          /* footer margin-top:auto works */
  height: 100vh;                   /* fill viewport height */
  position: relative;              /* <-- IMPORTANT: make card a positioned ancestor */
  border-radius: 0;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.25);
}

/* Header Controls (language + share) */
.header-controls {
  position: absolute;
  top: 18px;
  left: 16px;                      /* smaller offset so they stay inside */
  right: 16px;                     /* keeps them inside the card */
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
  pointer-events: auto;            /* ensure buttons clickable */
}

/* Image Section - Takes 1/3 of card */
.image-section {
  position: relative;
  width: 100%;
  height: 480px;
  overflow: hidden;
  background: linear-gradient(135deg, #e63946 0%, #f72c46 100%);
  flex: 0 0 34%;                   /* fixed 34% height for image area */
  min-height: 180px;
}

.company-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e63946 0%, #f72c46 100%);
}

.placeholder-text {
  font-size: 120px;
  font-weight: 700;
  color: white;
  opacity: 0.9;
}

.image-fade {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%);
}

/* Header Controls */
.header-controls {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
}

.language-button,
.share-button {
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 12px;
  padding: 10px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.language-button:hover,
.share-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.language-button:active,
.share-button:active {
  transform: translateY(0);
}

.lang-switch {
  display: flex;
  align-items: center;
  gap: 6px;
}

.lang-text {
  font-size: 14px;
}

/* Company Section */
.company-section {
  padding: 60px 30px 20px;
  text-align: center;
}

.branch-name {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
  line-height: 1.3;
}

.company-location {
  font-size: 16px;
  color: #666;
  font-weight: 500;
}

/* Review Title */
.review-title {
  text-align: center;
  padding: 50px 30px 40px 30px;
}

.review-title h2 {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 12px;
  letter-spacing: 1px;
}

.stars {
  display: flex;
  justify-content: center;
  gap: 4px;
}

/* Review Buttons */
.review-buttons {
  padding: 0 30px 30px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.review-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px 24px;
  border-radius: 16px;
  text-decoration: none;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.review-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.review-btn:active {
  transform: translateY(0);
}

.google-btn {
  background: white;
  color: #5f6368;
  border: 2px solid #e8eaed;
}

.tripadvisor-btn {
  background: white;
  color: #00aa6c;
  border: 2px solid #e8eaed;
}

/* Content sections should not force card to grow further */
.company-section,
.review-title,
.review-buttons {
  flex: 0 0 auto;
  padding-left: 30px;
  padding-right: 30px;
}

/* Make footer stick to bottom */
.footer {
  text-align: center;
  padding: 18px 24px;
  background: #f8f9fa;
  color: #999;
  font-size: 13px;

  margin-top: auto;                /* pushes footer to bottom inside the flex column */
  flex-shrink: 0;                  /* don't let footer shrink */
}

.footer span {
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Translation Loading */
.translation-loading {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 12px 24px;
  border-radius: 24px;
  font-size: 14px;
  z-index: 1000;
}

/* RTL Support */
[dir="rtl"] .header-controls {
  flex-direction: row-reverse;
}

[dir="rtl"] .lang-switch {
  flex-direction: row-reverse;
}

[dir="rtl"] .review-btn {
  flex-direction: row-reverse;
}

/* Responsive */
@media (max-width: 480px) {
  .review-share-container {
    padding: 0;
  }

  .review-share-card {
    display: flex;
    flex-direction: column;
    min-height: 100vh; /* full viewport height so footer can be pushed to bottom */
    border-radius: 0;   /* keeps mobile full-bleed feel */
  }

  .branch-name {
    font-size: 20px;
  }

  .company-location {
    font-size: 14px;
  }

  .image-section {
    height: 340px;
  }

  .review-title h2 {
    font-size: 18px;
  }

  .stars svg {
    width: 28px;
    height: 28px;
  }

  .review-btn {
    font-size: 15px;
    padding: 14px 20px;
  }

  /* Let the scrolling content grow and allow footer to sit at the bottom */
  .image-section {
    /* keep image fixed height but don't prevent layout from using flex */
    flex: 0 0 auto;
  }
  .company-section,
  .review-title,
  .review-buttons {
    flex: 0 0 auto;
  }


  /* This pushes footer down to bottom */
  .footer {
    margin-top: auto;
    position: relative; /* avoid absolute positioning issues */
    left: 0;
    right: 0;
  }
}
</style>
