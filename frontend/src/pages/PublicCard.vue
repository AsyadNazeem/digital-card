<template>
  <div v-if="!loaded" class="loading-screen">
    <div class="spinner"></div>
  </div>

  <div
      class="public-card-container"
      v-if="loaded"
      :dir="locale === 'ar' ? 'rtl' : 'ltr'"
  >

    <!-- Inner Card -->
    <div class="public-card">

      <!-- Header Section -->
      <div class="header-section">

        <button @click="toggleLanguage" class="language-button" :title="t('selectLanguage')">
          <!-- Show Arabic with decorative icon -->
          <span v-if="locale === 'en'" class="lang-switch">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
    </svg>
    <span class="lang-text">عربي</span>
  </span>

          <!-- Show English -->
          <span v-else class="lang-switch">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
    </svg>
    <span class="lang-text">English</span>
  </span>
        </button>

        <!-- Share Button (Top Right) -->
        <button @click="shareCard" class="share-button" :title="t('share')">
          <!-- Add share SVG icon here -->
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
        </button>

        <!-- Company Logo as background -->
        <div class="company-logo-container" v-if="company.logo">
          <img
              :src="`${VITE_IMAGE_UPLOAD_URL}${company.logo}`"
              alt="Company Logo"
              class="company-logo-bg"
          />
          <div class="logo-overlay"></div>
        </div>

        <!-- Centered Contact Photo -->
        <div class="contact-photo-center" v-if="contacts.length && contacts[0].photo">
          <img
              :src="`${VITE_IMAGE_UPLOAD_URL}${contacts[0].photo}`"
              alt="Contact Photo"
              class="contact-photo-circle"
          />
        </div>
      </div>

      <!-- Company Info Section -->
      <div class="company-info">

        <h1 class="company-name" v-if="contacts.length">
          {{ displayFirstName }} {{ displayLastName }}
        </h1>
        <p class="designation" v-if="displayDesignation">{{ displayDesignation }}</p>

        <div class="company-bio" v-if="displayBio" v-html="displayBio"></div>
      </div>

      <!-- Action Buttons (3x2 Grid) -->
      <div class="action-buttons">
        <!-- Row 1: Personal Contact Actions -->
        <a :href="`tel:${contacts[0].cardMobileNum}`" class="action-btn call">
          <span v-html="getIcon('phone_mobile')" class="action-icon"></span>
          <span>{{ t('mobile') }}</span>
        </a>
        <a :href="`https://wa.me/${contacts[0].whatsapp?.replace(/[^0-9]/g, '')}`" target="_blank"
           class="action-btn whatsapp" v-if="contacts.length && contacts[0].mobile">
          <span v-html="getIcon('whatsapp')" class="action-icon"></span>
          <span>{{ t('whatsapp') }}</span>
        </a>

        <a :href="`mailto:${contacts[0].email}`" class="action-btn email" v-if="contacts.length && contacts[0].email">
          <span v-html="getIcon('mail')" class="action-icon"></span>
          <span>{{ t('email') }}</span>
        </a>

        <!-- Row 2: Company/General Actions -->
        <a :href="`tel:${contacts[0].telephone}`" class="action-btn office-phone">
          <span v-html="getIcon('phone-office')" class="action-icon"></span>
          <span>{{ t('office') }}</span>
        </a>

        <a :href="formatUrl(company.website)" target="_blank" class="action-btn website">
          <span v-html="getIcon('globe')" class="action-icon"></span>
          <span>{{ t('website') }}</span>
        </a>

        <a :href="company.googleLocation" target="_blank" class="action-btn maps">
          <span v-html="getIcon('map')" class="action-icon"></span>
          <span>{{ t('location') }}</span>
        </a>
      </div>

      <!-- Save Contact Button -->
      <button @click="saveContact" class="action-btn save">
        <!-- Add save SVG icon here -->
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
          <polyline points="17 21 17 13 7 13 7 21"></polyline>
          <polyline points="7 3 7 8 15 8"></polyline>
        </svg>
        {{ t('saveContact') }}
      </button>

      <!-- Additional Action Buttons -->
      <!-- Additional Action Buttons -->
      <div class="additional-actions" v-if="company.view360 || hasReviewLinks() || filesList.length">
        <a
            v-if="company.view360"
            :href="company.view360"
            target="_blank"
            class="action-link-secondary"
        >
          <span v-html="getIcon('360')" class="action-icon"></span>
          <span>{{ t('view360') }}</span>
        </a>

        <button
            v-if="hasReviewLinks()"
            @click="handleReviewClick"
            class="action-link-secondary"
        >
          <span v-html="getIcon('review')" class="action-icon"></span>
          <span>{{ t('reviews') }}</span>
        </button>

        <!-- FILE BUTTONS: one button per saved file -->
        <template v-for="(file, idx) in filesList" :key="idx">
          <a
              :href="getFileUrl(file.path)"
              class="action-link-secondary file-btn"
              target="_blank"
              :title="getFileLabel(file)"
              rel="noopener noreferrer"
          >
            <span v-html="getFileIcon(file)" class="action-icon"></span>
            <span>{{ getFileLabel(file) }}</span>
          </a>
        </template>
      </div>


      <div class="company-details">
        <h2 v-if="displayCompanyName">{{ displayCompanyName }}</h2>
        <h2 v-if="company.website">{{ company.displayUrl }}</h2>
      </div>

      <!-- Social Links -->
      <div class="social-section" v-if="company.socialLinks && Object.keys(company.socialLinks).length > 0">
        <div class="social-divider"></div>
        <div class="social-links">
          <a
              v-for="(url, name) in company.socialLinks"
              :key="name"
              :href="formatUrl(url)"
              target="_blank"
              class="social-icon-link"
              :title="name.charAt(0).toUpperCase() + name.slice(1)"
          >
            <span v-html="getSocialIcon(name)"></span>
          </a>
        </div>
        <div class="social-divider"></div>
      </div>

      <!-- Footer -->
      <footer class="footer">
        {{ t('poweredBy') }} <span>TapMyName</span>
      </footer>

    </div>

    <!-- Floating Contact Button -->
    <button @click="showContactPopup = true" class="floating-contact-btn" :title="t('contactUs')">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      <span class="floating-btn-tooltip">{{ t('contactUs') }}</span>
    </button>

    <!-- Review Popup Modal -->
    <div v-if="showReviewPopup" class="review-modal-overlay" @click="closeReviewPopup">
      <div class="review-modal" @click.stop>
        <button class="modal-close-btn" @click="closeReviewPopup">&times;</button>
        <h3>{{ t('reviewUs') }}</h3>
        <div style="display: flex; gap: 5px; margin-bottom: 20px; justify-content: center;">
          <!-- Add star SVG icons here (5 stars) -->
          <img v-for="i in 5" :key="i"
               src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADPklEQVR4nO3Z3UtTYRwH8ANREESEgVeFUESZ842UXiEyCypSe4EoZqaz1RYLuogIgopuuuo+6qZLZ1P3nJP/QrAzw5rbjjMMesGX57jyJjXm+cY5y83ppjtzz3GH9oVzuec8n/2ec55nv3FcMcUUs+7BiOMEfrw6ypk9CDRFQN/2c2YORhxH4KsAqAegpJ4zaxBoGoZvXxwiEy9n6mr4FiA8QPvqOLMFgWZJQyyGyHwvZ6bgi+tQohopFSEKqHCAM0sw1BxKIFIromI8nBmCYefBlGoshyiY4Ku5Qg8CLcEUxFJIHNPNFX41LMgCoiDqreIKNQi0BJYh0kE0DN/FFWIw7KyBWAkdkHlE31VyhRR8vrUnsYtnC4kvsR6MeUqNneyoswyS3Ypw2wuErvZrr9jBxin46+YzAlaDJC4yA8oHQYkbMnkOKtghC40YF3blNtmIaysijuOQ2p+lTPbD4T/wla882TVBVrgoiUIm/hRklBzDz95tmSHqty3uz33CLCByWpwCWXCtXJXwjadpX6GFAqHqMYc4s1tioY7HEC2FB6H8PGTSru95CXc8yhsmHxDKxyDzbboQycrYHmbcG4yEUD4GKlhzQiQr0+mCWKWsG4SqCHJtTYgERrLfgVitGA6h/Bxk/kJeEAlMpPN2zphcIJSfA/U25xWRwEg3W+GvUdhDyCwoOc8EkcTYrRBrFYaQ35C9p5giUjB6Nk09EOptMAShQYZsJbqOMroq0r/DOIj6rLBaWlPkjHGQUOtrZhBK7hsHCV4UGULeGAf5eFpm+NYaMA4yUBdjByEzgHsDe0TEtZv5hkj79rKHqIdIPYiB+hhoz6jOI8pl9pCQtSsrgLr7a7/7bSWAf6P2W5uS71mes56sT0s0BVClIHjpPUYcO5d9Fu5N8Q4JP77Km6ubPWSwYTo9ogJa1yV017LqGBPuLaDCA1DyKwNGYg8Rl5x+1aOKCgg7dP/vgume7VqLRzso8ouXVgxf3ZsZN6kXEOXAp3PfINlPrnncMU9pHERmE5jJvtr8zDpTd0VFqE07yXEl7+NHhTLI5OW/RsP1fI+fvJFku4ewTV87Jpf7TPEWTPJnWd+nmGL+l/wFaFDV+oS5VJ0AAAAASUVORK5CYII="
               alt="star">
        </div>
        <div class="review-options">
          <button
              v-if="company.googleReviews"
              @click="redirectToReview(company.googleReviews)"
              class="review-icon-btn google"
              title="Google Reviews"
          >
            <!-- Add Google SVG icon here -->
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
              <path fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
              <path fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
              <path fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
              <path fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
            </svg>
          </button>
          <button
              v-if="company.tripAdvisor"
              @click="redirectToReview(company.tripAdvisor)"
              class="review-icon-btn tripadvisor"
              title="TripAdvisor"
          >
            <!-- Add TripAdvisor SVG icon here -->
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="60" height="60" viewBox="0 0 50 50">
              <path
                  d="M 25 11 C 19.167969 11 13.84375 12.511719 9.789063 15 L 2 15 C 2 15 3.753906 17.152344 4.578125 19.578125 C 2.96875 21.621094 2 24.195313 2 27 C 2 33.628906 7.371094 39 14 39 C 17.496094 39 20.636719 37.492188 22.828125 35.105469 L 25 38 L 27.171875 35.105469 C 29.363281 37.492188 32.503906 39 36 39 C 42.628906 39 48 33.628906 48 27 C 48 24.195313 47.03125 21.621094 45.421875 19.578125 C 46.246094 17.152344 48 15 48 15 L 40.203125 15 C 36.148438 12.511719 30.828125 11 25 11 Z M 14 18 C 18.972656 18 23 22.027344 23 27 C 23 31.972656 18.972656 36 14 36 C 9.027344 36 5 31.972656 5 27 C 5 22.027344 9.027344 18 14 18 Z M 36 18 C 40.972656 18 45 22.027344 45 27 C 45 31.972656 40.972656 36 36 36 C 31.027344 36 27 31.972656 27 27 C 27 22.027344 31.027344 18 36 18 Z M 14 21 C 10.6875 21 8 23.6875 8 27 C 8 30.3125 10.6875 33 14 33 C 17.3125 33 20 30.3125 20 27 C 20 23.6875 17.3125 21 14 21 Z M 36 21 C 32.6875 21 30 23.6875 30 27 C 30 30.3125 32.6875 33 36 33 C 39.3125 33 42 30.3125 42 27 C 42 23.6875 39.3125 21 36 21 Z M 14 23 C 16.210938 23 18 24.789063 18 27 C 18 29.210938 16.210938 31 14 31 C 11.789063 31 10 29.210938 10 27 C 10 24.789063 11.789063 23 14 23 Z M 36 23 C 38.210938 23 40 24.789063 40 27 C 40 29.210938 38.210938 31 36 31 C 33.789063 31 32 29.210938 32 27 C 32 24.789063 33.789063 23 36 23 Z M 14 25 C 12.894531 25 12 25.894531 12 27 C 12 28.105469 12.894531 29 14 29 C 15.105469 29 16 28.105469 16 27 C 16 25.894531 15.105469 25 14 25 Z M 36 25 C 34.894531 25 34 25.894531 34 27 C 34 28.105469 34.894531 29 36 29 C 37.105469 29 38 28.105469 38 27 C 38 25.894531 37.105469 25 36 25 Z"
                  fill="#26e07f"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Contact Us Popup Modal -->
    <div v-if="showContactPopup" class="contact-modal-overlay" @click="closeContactPopup">
      <div class="contact-modal" @click.stop>
        <button class="modal-close-btn" @click="closeContactPopup">&times;</button>

        <div class="contact-modal-header">
          <h3>{{ t('contactUs') }}</h3>
          <p>{{ t('sendMessageTo') }} {{ displayFirstName }} {{ displayLastName }}</p>
        </div>

        <form @submit.prevent="submitContactMessage" class="contact-modal-form">
          <!-- Name Field -->
          <div class="form-group">
            <label for="sender-name">{{ t('yourName') }} *</label>
            <input
                id="sender-name"
                v-model="contactMessageForm.name"
                type="text"
                :placeholder="t('enterYourName')"
                maxlength="100"
                required
                :disabled="contactMessageLoading"
            />
          </div>

          <!-- Email Field -->
          <div class="form-group">
            <label for="sender-email">{{ t('yourEmail') }} *</label>
            <input
                id="sender-email"
                v-model="contactMessageForm.email"
                type="email"
                :placeholder="t('enterYourEmail')"
                maxlength="150"
                required
                :disabled="contactMessageLoading"
            />
          </div>

          <!-- Subject Field -->
          <div class="form-group">
            <label for="message-subject">{{ t('subject') }} *</label>
            <input
                id="message-subject"
                v-model="contactMessageForm.subject"
                type="text"
                :placeholder="t('messageSubject')"
                maxlength="200"
                required
                :disabled="contactMessageLoading"
            />
            <span class="char-count">{{ contactMessageForm.subject.length }}/200</span>
          </div>

          <!-- Message Field -->
          <div class="form-group">
            <label for="message-content">{{ t('message') }} *</label>
            <textarea
                id="message-content"
                v-model="contactMessageForm.message"
                :placeholder="t('enterYourMessage')"
                rows="6"
                maxlength="1000"
                required
                :disabled="contactMessageLoading"
            ></textarea>
            <span class="char-count">{{ contactMessageForm.message.length }}/1000</span>
          </div>

          <!-- Status Message -->
          <div v-if="contactMessageStatus.message"
               :class="['alert', contactMessageStatus.success ? 'alert-success' : 'alert-error']">
            {{ contactMessageStatus.message }}
          </div>

          <button
              type="submit"
              class="submit-contact-btn"
              :disabled="contactMessageLoading"
          >
        <span v-if="contactMessageLoading">
          <svg class="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke-width="3" stroke-dasharray="32" stroke-dashoffset="32">
              <animate attributeName="stroke-dashoffset" values="32;0" dur="1s" repeatCount="indefinite"/>
            </circle>
          </svg>
          {{ t('sending') }}
        </span>
            <span v-else>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
          {{ t('sendMessage') }}
        </span>
          </button>
        </form>
      </div>
    </div>


    <div v-if="isTranslating" class="translation-loading">
      <span>{{ locale === 'ar' ? 'جاري الترجمة...' : 'Translating...' }}</span>
    </div>
  </div>

</template>

<script setup>
import {computed, onMounted, ref, watch} from "vue";
import {useRoute} from "vue-router";
import {useI18n} from 'vue-i18n';
import api from "../services/api";
import {API_BASE_URL, VITE_IMAGE_UPLOAD_URL} from "../config.js";
import { translateBatch, translateWithGoogle } from "../utils/translator";

const route = useRoute();
const {t, locale} = useI18n();
const company = ref({});
const contacts = ref([]);
const loaded = ref(false);
const theme = ref(null);
const showReviewPopup = ref(false);
const translatedData = ref({});
const isTranslating = ref(false);

// Contact Message Form State
const showContactPopup = ref(false);
const contactMessageForm = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
});
const contactMessageLoading = ref(false);
const contactMessageStatus = ref({
  message: '',
  success: false
});

// Close contact popup
const closeContactPopup = () => {
  showContactPopup.value = false;
  contactMessageForm.value = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };
  contactMessageStatus.value = {
    message: '',
    success: false
  };
};

const filesList = computed(() => {
  if (!company.value || !company.value.files) return [];
  if (Array.isArray(company.value.files)) return company.value.files;
  try {
    const parsed = JSON.parse(company.value.files);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('Could not parse company.files', e);
    return [];
  }
});

const getFileUrl = (path) => {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path; // already absolute
  // API_BASE_URL is already imported at top of your file
  return `${VITE_IMAGE_UPLOAD_URL}${path}`;
};

// Choose label for button
const getFileLabel = (file) => {
  if (!file) return locale.value === 'ar' ? 'ملف' : 'File';
  if (file.isMenu) return locale.value === 'ar' ? 'قائمة' : 'Menu';
  if (file.isBrochure) return locale.value === 'ar' ? 'بروشور' : 'Brochure';
  return file.name || (locale.value === 'ar' ? 'ملف' : 'File');
};

const getFileIcon = (file) => {
  if (!file) {
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;
  }
  // Menu (use a list icon)
  if (file.isMenu) {
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><circle cx="3" cy="6" r="1.5"></circle><circle cx="3" cy="12" r="1.5"></circle><circle cx="3" cy="18" r="1.5"></circle></svg>`;
  }
  // Brochure / PDF (use document icon)
  if (file.isBrochure) {
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;
  }
  // default file icon
  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 7h8M8 12h8M8 17h5"/></svg>`;
};

// Submit contact message
async function submitContactMessage() {
  contactMessageStatus.value = {message: '', success: false};

  // Validation
  if (!contactMessageForm.value.name.trim()) {
    contactMessageStatus.value = {
      message: locale.value === 'ar' ? 'الرجاء إدخال اسمك' : 'Please enter your name',
      success: false
    };
    return;
  }

  if (!contactMessageForm.value.email.trim()) {
    contactMessageStatus.value = {
      message: locale.value === 'ar' ? 'الرجاء إدخال بريدك الإلكتروني' : 'Please enter your email',
      success: false
    };
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(contactMessageForm.value.email)) {
    contactMessageStatus.value = {
      message: locale.value === 'ar' ? 'البريد الإلكتروني غير صالح' : 'Invalid email address',
      success: false
    };
    return;
  }

  if (!contactMessageForm.value.subject.trim()) {
    contactMessageStatus.value = {
      message: locale.value === 'ar' ? 'الرجاء إدخال الموضوع' : 'Please enter subject',
      success: false
    };
    return;
  }

  if (!contactMessageForm.value.message.trim()) {
    contactMessageStatus.value = {
      message: locale.value === 'ar' ? 'الرجاء إدخال رسالتك' : 'Please enter your message',
      success: false
    };
    return;
  }

  try {
    contactMessageLoading.value = true;

    const res = await api.post('/public/contact-message', {
      recipientEmail: contacts.value[0].email,
      recipientName: `${contacts.value[0].firstName} ${contacts.value[0].lastName}`,
      senderName: contactMessageForm.value.name.trim(),
      senderEmail: contactMessageForm.value.email.trim(),
      subject: contactMessageForm.value.subject.trim(),
      message: contactMessageForm.value.message.trim(),
      contactPhone: route.params.phone
    });

    contactMessageStatus.value = {
      message: locale.value === 'ar'
          ? 'تم إرسال رسالتك بنجاح!'
          : 'Your message has been sent successfully!',
      success: true
    };

    // Reset form after 2 seconds
    setTimeout(() => {
      closeContactPopup();
    }, 2000);

  } catch (err) {
    contactMessageStatus.value = {
      message: err.response?.data?.message ||
          (locale.value === 'ar' ? 'فشل في إرسال الرسالة' : 'Failed to send message'),
      success: false
    };
  } finally {
    contactMessageLoading.value = false;
  }
}

// Computed properties for displaying translated or original content
const displayFirstName = computed(() => {
  if (locale.value === 'ar' && translatedData.value.firstName) {
    return translatedData.value.firstName;
  }
  return contacts.value[0]?.firstName || '';
});

const displayLastName = computed(() => {
  if (locale.value === 'ar' && translatedData.value.lastName) {
    return translatedData.value.lastName;
  }
  return contacts.value[0]?.lastName || '';
});

const displayDesignation = computed(() => {
  if (locale.value === 'ar' && translatedData.value.designation) {
    return translatedData.value.designation;
  }
  return contacts.value[0]?.designation || '';
});

const displayCompanyName = computed(() => {
  if (locale.value === 'ar' && translatedData.value.companyName) {
    return translatedData.value.companyName;
  }
  return company.value.companyName || '';
});

const displayBio = computed(() => {
  if (locale.value === 'ar' && translatedData.value.bio) {
    return translatedData.value.bio;
  }
  return company.value.bio || '';
});

// Watch for language changes and translate content
watch(locale, async (newLocale) => {
  if (newLocale === 'ar') {
    await translateDatabaseContent();
  } else {
    translatedData.value = {}; // Clear translations for English
  }
});

// Translate all database content
async function translateDatabaseContent() {
  if (contacts.value.length === 0) return;

  isTranslating.value = true;

  try {
    const contact = contacts.value[0];

    const textsToTranslate = [
      contact.firstName || '',
      contact.lastName || '',
      contact.designation || '',
      company.value.companyName || '',
      company.value.bio || ''
    ];

    // Use Google Translate (set useGoogle to true)
    const translations = await translateBatch(textsToTranslate, 'ar', 'en', true);

    translatedData.value = {
      firstName: translations[0],
      lastName: translations[1],
      designation: translations[2],
      companyName: translations[3],
      bio: translations[4]
    };

    console.log('✅ Translation completed', translatedData.value);

  } catch (error) {
    console.error('Translation error:', error);
  } finally {
    isTranslating.value = false;
  }
}

// Toggle language between English and Arabic
const toggleLanguage = async () => {
  const newLocale = locale.value === 'en' ? 'ar' : 'en';
  locale.value = newLocale;

  // Save preference to localStorage
  localStorage.setItem('preferredLanguage', newLocale);

  // Translate if switching to Arabic
  if (newLocale === 'ar' && Object.keys(translatedData.value).length === 0) {
    await translateDatabaseContent();
  }
};

// Check if there are review links available
const hasReviewLinks = () => {
  return !!(company.value.googleReviews || company.value.tripAdvisor);
};

// Handle review button click
const handleReviewClick = () => {
  const googleReviews = company.value.googleReviews;
  const tripAdvisor = company.value.tripAdvisor;

  if (googleReviews && !tripAdvisor) {
    window.open(googleReviews, '_blank');
  } else if (tripAdvisor && !googleReviews) {
    window.open(tripAdvisor, '_blank');
  } else if (googleReviews && tripAdvisor) {
    showReviewPopup.value = true;
  }
};

// Close review popup
const closeReviewPopup = () => {
  showReviewPopup.value = false;
};

// Redirect to selected review platform
const redirectToReview = (url) => {
  window.open(url, '_blank');
  closeReviewPopup();
};

// Share function using native Web Share API
const shareCard = async () => {
  if (!contacts.value.length) return;

  const contact = contacts.value[0];
  const fullName = `${displayFirstName.value} ${displayLastName.value}`;
  const shareUrl = window.location.href;
  const shareText = locale.value === 'ar'
      ? `تحقق من بطاقة العمل الرقمية لـ ${fullName}`
      : `Check out ${fullName}'s Digital Business Card`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: locale.value === 'ar'
            ? `${fullName} - بطاقة عمل رقمية`
            : `${fullName} - Digital Business Card`,
        text: shareText,
        url: shareUrl,
      });
      console.log('✅ Shared successfully');
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('❌ Error sharing:', err);
        fallbackShare(shareUrl, shareText);
      }
    }
  } else {
    fallbackShare(shareUrl, shareText);
  }
};

// Fallback share method - copy to clipboard
const fallbackShare = (url, text) => {
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

// Function to update meta tags
function updateMetaTags(contact, company) {
  const fullName = `${contact.firstName} ${contact.lastName}`;
  const designation = contact.designation || '';

  const title = company.companyName
      ? `${fullName} - ${company.companyName}`
      : `${fullName} - Digital Business Card`;

  const description = locale.value === 'ar'
      ? `تواصل مع ${fullName}${designation ? ' - ' + designation : ''}`
      : `Connect with ${fullName}${designation ? ' - ' + designation : ''}`;

  document.title = company.companyName || title;

  const existingMeta = document.querySelectorAll('meta[property^="og:"], meta[name="description"], meta[name="twitter:"]');
  existingMeta.forEach(tag => tag.remove());

  const metaTags = [
    {property: 'og:title', content: title},
    {property: 'og:description', content: description},
    {property: 'og:type', content: 'profile'},
    {property: 'og:url', content: window.location.href},
    {
      property: 'og:image',
      content: contact.photo ? `${VITE_IMAGE_UPLOAD_URL}${contact.photo}` : `${VITE_IMAGE_UPLOAD_URL}${company.logo}`
    },
    {property: 'og:site_name', content: company.companyName || 'TapMyName'},
    {name: 'description', content: description},
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:title', content: title},
    {name: 'twitter:description', content: description},
    {
      name: 'twitter:image',
      content: contact.photo ? `${VITE_IMAGE_UPLOAD_URL}${contact.photo}` : `${VITE_IMAGE_UPLOAD_URL}${company.logo}`
    },
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

    const phone = route.params.phone;
    const res = await api.get(`/public/${phone}`);

    company.value = res.data.company;
    contacts.value = [res.data.contact];
    theme.value = res.data.theme;

    updatePageTitle();
    updateMetaTags(res.data.contact, res.data.company);

    // If Arabic is selected, translate immediately
    if (locale.value === 'ar') {
      await translateDatabaseContent();
    }

    let themeLoaded = true;

    if (theme.value?.cssFile) {
      themeLoaded = await applyTheme(theme.value.cssFile);
    }

    loaded.value = themeLoaded;

  } catch (err) {
    console.error(err);
    loaded.value = true;
  }
});

function updatePageTitle() {
  if (company.value && company.value.companyName) {
    document.title = company.value.companyName;
  } else if (contacts.value.length > 0) {
    const contact = contacts.value[0];
    document.title = `${contact.firstName} ${contact.lastName}`;
  }
}

function applyTheme(cssFile) {
  return new Promise((resolve) => {
    const existingTheme = document.querySelector('link[data-theme-css]');
    if (existingTheme) existingTheme.remove();

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.setAttribute('data-theme-css', 'true');
    link.href = `${API_BASE_URL}${cssFile}`;

    link.onload = () => {
      console.log("Theme fully loaded!");
      resolve(true);
    };

    link.onerror = () => {
      console.error("Failed to load theme");
      resolve(true);
    };

    document.head.appendChild(link);
  });
}

const formatUrl = (url) => {
  if (!url) return "";
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }
  return url;
};

const saveContact = async () => {
  if (!contacts.value.length) {
    console.error("No contact information available to save.");
    return;
  }

  const contact = contacts.value[0];

  try {
    let photoBase64 = '';
    if (contact.photo) {
      try {
        const photoUrl = `${VITE_IMAGE_UPLOAD_URL}${contact.photo}`;
        const response = await fetch(photoUrl);
        const blob = await response.blob();

        photoBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = reader.result.split(',')[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        console.warn("Failed to fetch photo:", error);
      }
    }

    const addressParts = [];
    addressParts.push('');
    addressParts.push('');
    addressParts.push(contact.streetAddress || '');
    addressParts.push(contact.city || '');
    addressParts.push('');
    addressParts.push(contact.postalCode || '');
    addressParts.push(contact.country || '');

    const addressString = addressParts.join(';');
    const hasAddress = contact.streetAddress || contact.city || contact.postalCode || contact.country;

    let vcard = `BEGIN:VCARD
VERSION:3.0
FN:${contact.firstName} ${contact.lastName}
N:${contact.lastName};${contact.firstName};;;
ORG:${company.value.companyName || ''}
TITLE:${contact.designation || ''}`;

    if (contact.telephone) {
      vcard += `\nTEL;TYPE=VOICE:${contact.telephone}`;
    }

    if (contact.cardMobileNum) {
      vcard += `\nTEL;TYPE=CELL:${contact.cardMobileNum}`;
    }

    if (company.value.phone) {
      vcard += `\nTEL;TYPE=WORK:${company.value.phone}`;
    }

    if (contact.email) {
      vcard += `\nEMAIL;TYPE=PREF,INTERNET:${contact.email}`;
    }

    if (company.value.website) {
      vcard += `\nURL;TYPE=WORK:${company.value.website}`;
    }

    if (hasAddress) {
      const label = contact.label || 'WORK';
      vcard += `\nADR;TYPE=${label}:${addressString}`;

      const formattedAddress = [
        contact.streetAddress,
        contact.streetAddressLine2,
        contact.city,
        contact.postalCode,
        contact.country
      ].filter(Boolean).join(', ');

      if (formattedAddress) {
        vcard += `\nLABEL;TYPE=${label}:${formattedAddress}`;
      }
    }

    if (photoBase64) {
      const photoLines = photoBase64.match(/.{1,76}/g);
      vcard += `\nPHOTO;ENCODING=b;TYPE=JPEG:${photoLines.join('\n ')}`;
    }

    vcard += `\nEND:VCARD`;

    const vcfBlob = new Blob([vcard], {type: 'text/vcard;charset=utf-8'});
    const url = URL.createObjectURL(vcfBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${contact.firstName}_${contact.lastName}.vcf`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
    console.log("✅ Contact VCF downloaded successfully.");
  } catch (error) {
    console.error("❌ Error generating VCF:", error);
  }
};

const getIcon = (name) => {
  const icons = {
    phone_mobile: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="7" y="2" width="10" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>`,
    whatsapp: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>`,
    mail: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
    'phone-office': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/><path d="M14.05 2a9 9 0 0 1 8 7.94"/><path d="M14.05 6A5 5 0 0 1 18 10"/></svg>`,
    globe: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`,
    map: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
    '360': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20"/><path d="M12 2c2.5 0 5 4.5 5 10s-2.5 10-5 10M12 2C9.5 2 7 6.5 7 12s2.5 10 5 10"/></svg>`,
    review: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/></svg>`,
  };
  return icons[name] || icons.phone;
};

const getSocialIcon = (name) => {
  const normalizedName = name.toLowerCase();
  const icons = {
    facebook: `<svg width="28" height="28" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
    twitter: `<svg width="28" height="28" viewBox="0 0 24 24" fill="#000000"><path d="M17.53 3h3.44l-7.51 8.59L22 21h-6.59l-4.7-6.14L5.39 21H1.94l7.98-9.13L2 3h6.7l4.23 5.53L17.53 3z"/></svg>`,
    linkedin: `<svg width="28" height="28" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
    youtube: `<svg width="28" height="28" viewBox="0 0 24 24" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
    tiktok: `<svg width="28" height="28" viewBox="0 0 24 24" fill="#000000"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>`,
    instagram: `<svg width="28" height="28" viewBox="0 0 24 24" fill="url(#instagram-gradient)"><defs><linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#FD5949;stop-opacity:1" /><stop offset="50%" style="stop-color:#D6249F;stop-opacity:1" /><stop offset="100%" style="stop-color:#285AEB;stop-opacity:1" /></linearGradient></defs><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>`,
    whatsapp: `<svg width="28" height="28" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>`,
    // Add other social icons as needed (same as before)
  };
  return icons[normalizedName] || icons.facebook;
};
</script>
