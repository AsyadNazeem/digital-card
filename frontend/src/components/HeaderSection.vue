<template>
  <div class="header-section" :class="{ 'header-section-group': isGroup }">
    <!-- Language Button -->
    <button
        @click="onToggleLanguage"
        class="language-button"
        :class="{ 'language-button-group': isGroup }"
        :title="t('selectLanguage')"
    >
      <span v-if="locale === 'en'" class="lang-switch" :class="{ 'lang-switch-group': isGroup }">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
          />
        </svg>
        <span class="lang-text" :class="{ 'lang-text-group': isGroup }">عربي</span>
      </span>

      <span v-else class="lang-switch" :class="{ 'lang-switch-group': isGroup }">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
          />
        </svg>
        <span class="lang-text" :class="{ 'lang-text-group': isGroup }">English</span>
      </span>
    </button>

    <!-- Share Button -->
    <button
        @click="onShare"
        class="share-button"
        :class="{ 'share-button-group': isGroup }"
        :title="t('share')"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="18" cy="5" r="3"></circle>
        <circle cx="6" cy="12" r="3"></circle>
        <circle cx="18" cy="19" r="3"></circle>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
      </svg>
    </button>

    <!-- Company Logo Background -->
    <div
        class="company-logo-container"
        :class="{ 'company-logo-container-group': isGroup }"
        v-if="company.logo"
    >
      <img
          :src="`${VITE_IMAGE_UPLOAD_URL}${company.logo}`"
          alt="Company Logo"
          class="company-logo-bg"
          :class="{ 'company-logo-bg-group': isGroup }"
      />
      <div class="logo-overlay" :class="{ 'logo-overlay-group': isGroup }"></div>
    </div>

    <!-- Centered Contact Photo -->
    <div
        class="contact-photo-center"
        :class="{ 'contact-photo-center-group': isGroup }"
        v-if="contacts.length && contacts[0].photo"
    >
      <img
          :src="`${VITE_IMAGE_UPLOAD_URL}${contacts[0].photo}`"
          alt="Contact Photo"
          class="contact-photo-circle"
          :class="{ 'contact-photo-circle-group': isGroup }"
      />
    </div>
  </div>
</template>

<script setup>
import { VITE_IMAGE_UPLOAD_URL } from '../config.js';

defineProps({
  locale: String,
  company: Object,
  contacts: Array,
  onToggleLanguage: Function,
  onShare: Function,
  isGroup: {
    type: Boolean,
    default: false
  },
  t: Function
});

// Note: The t function is passed from handlers in the parent
// If not available, we can import useI18n directly:
import { useI18n } from 'vue-i18n';
const { t: i18nT } = useI18n();
const t = (key) => {
  // Use passed t function if available, otherwise use i18n
  return i18nT(key);
};
</script>
