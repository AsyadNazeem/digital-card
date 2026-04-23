
<template>
  <div
      class="modern-card-container"
      :dir="locale === 'ar' ? 'rtl' : 'ltr'"
  >
    <div class="modern-card">
      <!-- Full Width Hero Header -->
      <div class="modern-hero-header">
        <!-- Language & Share - Top Corners -->
        <div class="modern-header-controls">
          <button @click="handlers.toggleLanguage" class="modern-lang-btn" :title="handlers.t('selectLanguage')">
            <span v-if="locale === 'en'">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
              عربي
            </span>
            <span v-else>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
              English
            </span>
          </button>

          <button @click="handlers.shareCard" class="modern-share-btn" :title="handlers.t('share')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
          </button>
        </div>

        <!-- Company Background -->
        <div class="modern-bg-overlay" v-if="company.logo">
          <img
              :src="`${VITE_IMAGE_UPLOAD_URL}${company.logo}`"
              alt="Company Background"
              class="modern-bg-img"
          />
          <div class="modern-bg-gradient"></div>
        </div>

        <!-- Centered Profile Photo -->
        <div class="modern-profile-center" v-if="contacts.length && contacts[0].photo">
          <img
              :src="`${VITE_IMAGE_UPLOAD_URL}${contacts[0].photo}`"
              alt="Profile Photo"
              class="modern-profile-img"
          />
        </div>

        <!-- Identity Information -->
        <div class="modern-identity">
          <h1 class="modern-name" v-if="contacts.length">
            {{ displayFirstName }} {{ displayLastName }}
          </h1>
          <p class="modern-designation" v-if="displayDesignation">{{ displayDesignation }}</p>
          <div class="modern-bio" v-if="displayBio" v-html="displayBio"></div>
        </div>
      </div>

      <!-- Vertical Action Buttons -->
      <div class="modern-actions-vertical">
        <!-- Primary Contact Methods -->
        <button
            @click="handlers.handlePhoneClick(contacts[0].cardMobileNum)"
            class="modern-action-btn modern-primary"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="7" y="2" width="10" height="20" rx="2"/>
            <line x1="12" y1="18" x2="12" y2="18"/>
          </svg>
          <span>{{ handlers.t('mobile') }}</span>
        </button>

        <button
            @click="handlers.handleWhatsAppClick"
            class="modern-action-btn modern-primary"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          <span>{{ handlers.t('whatsapp') }}</span>
        </button>

        <button
            @click="handlers.handleEmailClick(contacts[0].email)"
            class="modern-action-btn modern-primary"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="4" width="20" height="16" rx="2"/>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
          <span>{{ handlers.t('email') }}</span>
        </button>

        <button
            @click="handlers.handleWebsiteClick(company.website)"
            class="modern-action-btn modern-secondary"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
            <path d="M2 12h20"/>
          </svg>
          <span>{{ handlers.t('website') }}</span>
        </button>

        <button
            @click="handlers.handleLocationClick(company.googleLocation)"
            class="modern-action-btn modern-secondary"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span>{{ handlers.t('location') }}</span>
        </button>
      </div>

      <!-- Floating Save Contact Button -->
      <button @click="handlers.saveContact" class="modern-save-floating">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
          <polyline points="17 21 17 13 7 13 7 21"></polyline>
          <polyline points="7 3 7 8 15 8"></polyline>
        </svg>
        <span>{{ handlers.t('saveContact') }}</span>
      </button>

      <!-- Secondary Features -->
      <div class="modern-secondary-features" v-if="hasSecondaryFeatures">
        <a
            v-if="company.view360"
            @click.prevent="handlers.handle360Click(company.view360)"
            class="modern-feature-link"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            <path d="M2 12h20"/>
          </svg>
          {{ handlers.t('view360') }}
        </a>

        <button
            v-if="handlers.hasReviewLinks()"
            @click="handlers.handleReviewClick"
            class="modern-feature-link"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          {{ handlers.t('reviews') }}
        </button>

        <template v-for="(file, idx) in shopNowLinks" :key="'shop-' + idx">
          <a
              @click.prevent="handlers.handleFileClick(file)"
              class="modern-feature-link"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {{ locale === 'ar' ? 'تسوق الآن' : 'Shop Now' }}
          </a>
        </template>
      </div>

      <!-- Social Icons Inline -->
      <div class="modern-social-inline" v-if="company.socialLinks && Object.keys(company.socialLinks).length > 0">
        <a
            v-for="(url, name) in company.socialLinks"
            :key="name"
            @click.prevent="handlers.handleSocialClick(name, url)"
            class="modern-social-icon"
            :title="name"
        >
          <span v-html="getSocialIcon(name)"></span>
        </a>
      </div>

      <!-- Minimal Footer -->
      <footer class="modern-footer">
        <span>{{ handlers.t('poweredBy') }} <strong>TapMyName</strong></span>
      </footer>
    </div>

    <!-- Popups remain the same -->
    <ReviewPopup
        v-if="showReviewPopup"
        :locale="locale"
        :company="company"
        :handlers="handlers"
        :on-close="handlers.closeReviewPopup"
    />

    <WhatsAppPopup
        v-if="showWhatsAppPopup"
        :locale="locale"
        :contacts="contacts"
        :handlers="handlers"
        :on-close="handlers.closeWhatsAppPopup"
    />

    <ContactPopup
        v-if="showContactPopup"
        :locale="locale"
        :contacts="contacts"
        :form="contactMessageForm"
        :loading="contactMessageLoading"
        :status="contactMessageStatus"
        :handlers="handlers"
        :on-close="handlers.closeContactPopup"
    />

    <div v-if="isTranslating" class="translation-loading">
      <span>{{ locale === 'ar' ? 'جاري الترجمة...' : 'Translating...' }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { VITE_IMAGE_UPLOAD_URL } from '../config.js';
import ReviewPopup from '../components/ReviewPopup.vue';
import WhatsAppPopup from '../components/WhatsAppPopup.vue';
import ContactPopup from '../components/ContactPopup.vue';

const props = defineProps({
  company: Object,
  contacts: Array,
  theme: Object,
  locale: String,
  translatedData: Object,
  isTranslating: Boolean,
  showReviewPopup: Boolean,
  showWhatsAppPopup: Boolean,
  showContactPopup: Boolean,
  contactMessageForm: Object,
  contactMessageLoading: Boolean,
  contactMessageStatus: Object,
  handlers: Object
});

const displayFirstName = computed(() => {
  if (props.locale === 'ar' && props.translatedData.firstName) {
    return props.translatedData.firstName;
  }
  return props.contacts[0]?.firstName || '';
});

const displayLastName = computed(() => {
  if (props.locale === 'ar' && props.translatedData.lastName) {
    return props.translatedData.lastName;
  }
  return props.contacts[0]?.lastName || '';
});

const displayDesignation = computed(() => {
  if (props.locale === 'ar' && props.translatedData.designation) {
    return props.translatedData.designation;
  }
  return props.contacts[0]?.designation || '';
});

const displayBio = computed(() => {
  if (props.locale === 'ar' && props.translatedData.bio) {
    return props.translatedData.bio;
  }
  return props.company.bio || '';
});

const filesList = computed(() => {
  if (!props.company || !props.company.files) return [];
  if (Array.isArray(props.company.files)) return props.company.files;
  try {
    const parsed = JSON.parse(props.company.files);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
});

const shopNowLinks = computed(() => filesList.value.filter(file => file.isShopNow));

const hasSecondaryFeatures = computed(() => {
  return props.company.view360 ||
      props.handlers.hasReviewLinks() ||
      shopNowLinks.value.length > 0;
});

const getSocialIcon = (name) => {
  const normalizedName = name.toLowerCase();
  const icons = {
    facebook: `<svg width="24" height="24" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
    instagram: `<svg width="24" height="24" viewBox="0 0 24 24" fill="url(#instagram-gradient)"><defs><linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#FD5949;stop-opacity:1" /><stop offset="50%" style="stop-color:#D6249F;stop-opacity:1" /><stop offset="100%" style="stop-color:#285AEB;stop-opacity:1" /></linearGradient></defs><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>`,
    linkedin: `<svg width="24" height="24" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
  };
  return icons[normalizedName] || '';
};
</script>

<style scoped>
.modern-card-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0;
}

.modern-card {
  max-width: 500px;
  margin: 0 auto;
  background: white;
  min-height: 100vh;
  position: relative;
}

.modern-hero-header {
  position: relative;
  height: 400px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  overflow: hidden;
}

.modern-header-controls {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  display: flex;
  justify-content: space-between;
  z-index: 10;
}

.modern-lang-btn,
.modern-share-btn {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: none;
  border-radius: 12px;
  padding: 10px 16px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.modern-lang-btn:hover,
.modern-share-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.modern-bg-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.modern-bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.2;
}

.modern-bg-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%);
}

.modern-profile-center {
  position: relative;
  z-index: 5;
  margin-bottom: 20px;
}

.modern-profile-img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid white;
  object-fit: cover;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.modern-identity {
  position: relative;
  z-index: 5;
  text-align: center;
  color: white;
}

.modern-name {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.modern-designation {
  font-size: 16px;
  opacity: 0.95;
  margin: 0 0 12px 0;
}

.modern-bio {
  font-size: 14px;
  opacity: 0.9;
  max-width: 400px;
  margin: 0 auto;
}

.modern-actions-vertical {
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modern-action-btn {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border-radius: 16px;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.modern-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.modern-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.modern-secondary {
  background: #f5f5f5;
  color: #333;
}

.modern-secondary:hover {
  background: #e8e8e8;
  transform: translateY(-2px);
}

.modern-save-floating {
  position: sticky;
  bottom: 20px;
  margin: 0 20px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 18px;
  background: #000;
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.modern-save-floating:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
}

.modern-secondary-features {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 0 20px 30px;
}

.modern-feature-link {
  flex: 1;
  min-width: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.modern-feature-link:hover {
  border-color: #667eea;
  color: #667eea;
  transform: translateY(-2px);
}

.modern-social-inline {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 20px;
  border-top: 1px solid #e0e0e0;
}

.modern-social-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f5f5f5;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modern-social-icon:hover {
  transform: translateY(-4px) scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.modern-footer {
  text-align: center;
  padding: 30px 20px;
  font-size: 14px;
  color: #666;
  border-top: 1px solid #e0e0e0;
}

.modern-footer strong {
  color: #333;
  font-weight: 700;
}

@media (max-width: 768px) {
  .modern-hero-header {
    height: 350px;
  }

  .modern-name {
    font-size: 24px;
  }
}
</style>
