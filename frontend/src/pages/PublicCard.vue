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
        <a @click.prevent="handlePhoneClick(contacts[0].cardMobileNum)" class="action-btn call">
          <span v-html="getIcon('phone_mobile')" class="action-icon"></span>
          <span>{{ t('mobile') }}</span>
        </a>

        <a @click.prevent="handleWhatsAppClick" class="action-btn whatsapp">
          <span v-html="getIcon('whatsapp')" class="action-icon"></span>
          <span>{{ t('whatsapp') }}</span>
        </a>

        <a @click.prevent="handleEmailClick(contacts[0].email)" class="action-btn email">
          <span v-html="getIcon('mail')" class="action-icon"></span>
          <span>{{ t('email') }}</span>
        </a>

        <!-- Row 2: Company/General Actions -->
        <a @click.prevent="handleOfficePhoneClick(contacts[0].telephone)" class="action-btn office-phone">
          <span v-html="getIcon('phone-office')" class="action-icon"></span>
          <span>{{ t('office') }}</span>
        </a>

        <a @click.prevent="handleWebsiteClick(company.website)" class="action-btn website">
          <span v-html="getIcon('globe')" class="action-icon"></span>
          <span>{{ t('website') }}</span>
        </a>

        <a @click.prevent="handleLocationClick(company.googleLocation)" class="action-btn maps">
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
      <div
          class="additional-actions"
          v-if="company.view360 || hasReviewLinks() || shopNowLinks.length || orderNowLinks.length || brochureLinks.length || menuLinks.length"
          :class="{'additional-actions--two-lines': additionalActionsCount > 3}"
      >
        <a
            v-if="company.view360"
            @click.prevent="handle360Click(company.view360)"
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

        <!-- Shop Now Links -->
        <template v-for="(file, idx) in shopNowLinks" :key="'shop-' + idx">
          <a
              @click.prevent="handleFileClick(file, 'shop_now')"
              class="action-link-secondary shop-now-btn"
              :title="file.name"
          >
            <span v-html="getFileIcon(file)" class="action-icon"></span>
            <span>{{ locale === 'ar' ? 'تسوق الآن' : 'Shop Now' }}</span>
          </a>
        </template>

        <!-- Order Now Links -->
        <template v-for="(file, idx) in orderNowLinks" :key="'order-' + idx">
          <a
              @click.prevent="handleFileClick(file, 'order_now')"
              class="action-link-secondary order-now-btn"
              :title="file.name"
          >
            <span v-html="getFileIcon(file)" class="action-icon"></span>
            <span>{{ locale === 'ar' ? 'اطلب الآن' : 'Order Now' }}</span>
          </a>
        </template>

        <!-- Brochure Links -->
        <template v-for="(file, idx) in brochureLinks" :key="'brochure-' + idx">
          <a
              @click.prevent="handleFileClick(file, 'brochure')"
              class="action-link-secondary brochure-btn"
              :title="file.name"
          >
            <span v-html="getFileIcon(file)" class="action-icon"></span>
            <span>{{ locale === 'ar' ? 'بروشور' : 'Brochure' }}</span>
          </a>
        </template>

        <!-- Menu Links -->
        <template v-for="(file, idx) in menuLinks" :key="'menu-' + idx">
          <a
              @click.prevent="handleFileClick(file, 'menu')"
              class="action-link-secondary menu-btn"
              :title="file.name"
          >
            <span v-html="getFileIcon(file)" class="action-icon"></span>
            <span>{{ locale === 'ar' ? 'قائمة' : 'Menu' }}</span>
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
              @click.prevent="handleSocialClick(name, url)"
              class="social-icon-link"
              :title="name"
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

    <!-- WhatsApp Popup Modal - Replace your existing WhatsApp popup with this -->
    <div v-if="showWhatsAppPopup" class="whatsapp-modal-overlay" @click="closeWhatsAppPopup">
      <div class="whatsapp-modal" @click.stop>
        <button class="modal-close-btn" @click="closeWhatsAppPopup">&times;</button>

        <h3>{{ locale === 'ar' ? 'تواصل عبر واتساب' : 'Connect via WhatsApp' }}</h3>

        <div style="display: flex; gap: 5px; margin-bottom: 20px; justify-content: center;">
          <!-- WhatsApp icon decoration -->
          <svg width="40" height="40" viewBox="0 0 24 24" fill="#25D366">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        </div>

        <div class="whatsapp-options">
          <!-- WhatsApp Personal Message Button -->
          <button
              v-if="contacts[0]?.whatsapp"
              @click="redirectToWhatsApp(`https://wa.me/${contacts[0].whatsapp.replace(/[^0-9]/g, '')}`)"
              class="whatsapp-icon-btn"
              :title="locale === 'ar' ? 'واتساب شخصي' : 'Personal WhatsApp'"
          >
            <!-- Personal Chat Icon -->
            <svg width="50" height="50" viewBox="0 0 24 24" fill="#25D366">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            <p>{{ locale === 'ar' ? 'رسالة شخصية' : 'Personal Message' }}</p>
          </button>

          <!-- WhatsApp Channel Button -->
          <button
              v-if="contacts[0]?.whatsappChannel"
              @click="redirectToWhatsApp(contacts[0].whatsappChannel)"
              class="whatsapp-icon-btn"
              :title="locale === 'ar' ? 'قناة واتساب' : 'WhatsApp Channel'"
          >
            <!-- Channel Icon (WhatsApp with broadcast symbol) -->
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none">
              <!-- WhatsApp base -->
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
                    fill="#075E54"/>
              <!-- Broadcast/Channel indicator -->
              <g transform="translate(14, 2)">
                <circle cx="4" cy="4" r="3.5" fill="#25D366" stroke="white" stroke-width="1"/>
                <path d="M 2 4 L 4 6 L 6.5 2.5" stroke="white" stroke-width="1.2" fill="none" stroke-linecap="round"/>
              </g>
            </svg>
            <p>{{ locale === 'ar' ? 'قناة واتساب' : 'WhatsApp Channel' }}</p>
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
import {translateBatch} from "../utils/translator";

const route = useRoute();
const {t, locale} = useI18n();
const company = ref({});
const contacts = ref([]);
const loaded = ref(false);
const theme = ref(null);
const showReviewPopup = ref(false);
const translatedData = ref({});
const isTranslating = ref(false);

const showWhatsAppPopup = ref(false);
const hasWhatsAppLinks = () => {
  return !!(contacts.value[0]?.whatsapp || contacts.value[0]?.whatsappChannel);
};


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

// Device detection helper
function getDeviceType() {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

// Track page view
async function trackPageView() {
  try {
    const phone = route.params.phone;
    const referrer = document.referrer || 'direct';
    const userAgent = navigator.userAgent;
    const deviceType = getDeviceType();

    await api.post(`/analytics/view/${phone}`, {
      referrer,
      userAgent,
      deviceType,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      language: navigator.language
    });
  } catch (error) {
    // Silently fail - don't disrupt user experience
    console.error('Analytics tracking error:', error);
  }
}

// Track clicks
async function trackClick(clickType, linkUrl = '') {
  try {
    const phone = route.params.phone;
    const userAgent = navigator.userAgent;

    await api.post(`/analytics/click/${phone}`, {
      clickType,
      linkUrl,
      userAgent
    });
  } catch (error) {
    console.error('Click tracking error:', error);
  }
}

const handleWhatsAppClick = async () => {
  const whatsapp = contacts.value[0]?.whatsapp;
  const whatsappChannel = contacts.value[0]?.whatsappChannel;

  if (whatsapp && !whatsappChannel) {
    await trackClick('whatsapp', `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`);
    window.open(`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`, '_blank');
  } else if (whatsappChannel && !whatsapp) {
    await trackClick('whatsapp_channel', whatsappChannel);
    window.open(whatsappChannel, '_blank');
  } else if (whatsapp && whatsappChannel) {
    showWhatsAppPopup.value = true;
  }
};

const closeWhatsAppPopup = () => {
  showWhatsAppPopup.value = false;
};

// 5. ADD: Redirect to selected WhatsApp option (add after redirectToReview function, around line 180)
const redirectToWhatsApp = async (url) => {
  const isChannel = url.includes('whatsapp.com/channel') || url === contacts.value[0]?.whatsappChannel;
  await trackClick(isChannel ? 'whatsapp_channel' : 'whatsapp', url);
  window.open(url, '_blank');
  closeWhatsAppPopup();
};

const additionalActionsCount = computed(() => {
  let count = 0;

  if (company.value.view360) count++;
  if (hasReviewLinks()) count++;

  count += shopNowLinks.value.length;
  count += orderNowLinks.value.length;
  count += brochureLinks.value.length;
  count += menuLinks.value.length;

  return count;
});


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

// Phone click
const handlePhoneClick = async (phoneNumber) => {
  await trackClick('phone', `tel:${phoneNumber}`);
  window.location.href = `tel:${phoneNumber}`;
};

// Email click
const handleEmailClick = async (email) => {
  await trackClick('email', `mailto:${email}`);
  window.location.href = `mailto:${email}`;
};

const handleOfficePhoneClick = async (phone) => {
  await trackClick('office_phone', `tel:${phone}`);
  window.location.href = `tel:${phone}`;
};

// Website click
const handleWebsiteClick = async (url) => {
  await trackClick('website', url);
  window.open(formatUrl(url), '_blank');
};

// Social media clicks
const handleSocialClick = async (platform, url) => {
  await trackClick(`social_${platform}`, url); // ✅ Already correct
  window.open(formatUrl(url), '_blank');
};


// 360 view tracking
const handle360Click = async () => {
  await trackClick('360_view', company.value.view360);
  window.open(company.value.view360, '_blank');
};

const handleLocationClick = async (url) => {
  await trackClick('location', url);
  window.open(formatUrl(url), '_blank');
};

// Brochure/Menu clicks
const handleFileClick = async (file) => {
  const fileType = file.isBrochure ? 'brochure' :
      file.isMenu ? 'menu' :
          file.isShopNow ? 'shop_now' :
              file.isOrderNow ? 'order_now' : 'file';

  await trackClick(fileType, getFileUrl(file));
  window.open(getFileUrl(file), '_blank');
};

// ✅ FIXED: Update the getFileUrl function (around line 40)
const getFileUrl = (file) => {
  if (!file || !file.url) return '';

  // If it's already an absolute URL (http:// or https://), return as-is
  if (/^https?:\/\//i.test(file.url)) {
    return file.url;
  }

  // Otherwise, prepend the base URL (for uploaded files)
  return `${VITE_IMAGE_UPLOAD_URL}${file.url}`;
};

// Choose label for button
const getFileLabel = (file) => {
  if (!file) return locale.value === 'ar' ? 'ملف' : 'File';

  // Priority order: Shop Now > Order Now > Menu > Brochure
  if (file.isShopNow) return locale.value === 'ar' ? 'تسوق الآن' : 'Shop Now';
  if (file.isOrderNow) return locale.value === 'ar' ? 'اطلب الآن' : 'Order Now';
  if (file.isMenu) return locale.value === 'ar' ? 'قائمة' : 'Menu';
  if (file.isBrochure) return locale.value === 'ar' ? 'بروشور' : 'Brochure';

  return locale.value === 'ar' ? 'ملف' : 'File';
};


const getFileIcon = (file) => {
  if (!file) {
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;
  }

  // Priority order for icons
  if (file.isShopNow) {
    // Shopping bag icon
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>`;
  }

  if (file.isOrderNow) {
    // Shopping cart icon
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>`;
  }

  if (file.isMenu) {
    // List icon
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><circle cx="3" cy="6" r="1.5"></circle><circle cx="3" cy="12" r="1.5"></circle><circle cx="3" cy="18" r="1.5"></circle></svg>`;
  }

  if (file.isBrochure) {
    // Document icon
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;
  }

  // Default file icon
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

const shopNowLinks = computed(() => {
  if (!company.value || !company.value.files) return [];
  const files = Array.isArray(company.value.files)
      ? company.value.files
      : (() => {
        try {
          return JSON.parse(company.value.files);
        } catch {
          return [];
        }
      })();
  return files.filter(file => file.isShopNow);
});

const orderNowLinks = computed(() => {
  if (!company.value || !company.value.files) return [];
  const files = Array.isArray(company.value.files)
      ? company.value.files
      : (() => {
        try {
          return JSON.parse(company.value.files);
        } catch {
          return [];
        }
      })();
  return files.filter(file => file.isOrderNow);
});

const brochureLinks = computed(() => {
  if (!company.value || !company.value.files) return [];
  const files = Array.isArray(company.value.files)
      ? company.value.files
      : (() => {
        try {
          return JSON.parse(company.value.files);
        } catch {
          return [];
        }
      })();
  return files.filter(file => file.isBrochure);
});

const menuLinks = computed(() => {
  if (!company.value || !company.value.files) return [];
  const files = Array.isArray(company.value.files)
      ? company.value.files
      : (() => {
        try {
          return JSON.parse(company.value.files);
        } catch {
          return [];
        }
      })();
  return files.filter(file => file.isMenu);
});


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
const handleReviewClick = async () => {
  await trackClick('review');
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
const redirectToReview = async (url) => {
  const platform = url.includes('google') ? 'google_review' : 'tripadvisor_review';
  await trackClick(platform, url);
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

  await trackPageView();

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

    // Replace this section (starting from "let vcard = `BEGIN:VCARD`")
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

// Add social media links
    if (company.value.socialLinks && Object.keys(company.value.socialLinks).length > 0) {
      for (const [platform, url] of Object.entries(company.value.socialLinks)) {
        if (url) {
          const formattedUrl = formatUrl(url);
          const platformName = platform.charAt(0).toUpperCase() + platform.slice(1);
          vcard += `\nURL;TYPE=${platformName}:${formattedUrl}`;
        }
      }
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
    twitch: `<svg width="28" height="28" viewBox="0 0 24 24" fill="#6441A5"><path d="M4.3 0L1 3.3v17.4h5.8V24l3.4-3.3h4.4L23 12.3V0H4.3zm16.3 11.1l-3.4 3.3h-4.4l-3.4 3.3v-3.3H4.4V2.2h16.2v8.9zM13.2 6.7h2.2v4.5h-2.2V6.7zm-4.5 0h2.2v4.5H8.7V6.7z"/></svg>`,
    threads: `<svg width="28" height="28" viewBox="0 0 24 24" fill="#000000"><path d="M12 0C5.37 0 0 5.34 0 12s5.37 12 12 12 12-5.34 12-12S18.63 0 12 0zm3.23 14.69c-.42 1.53-1.94 2.58-3.98 2.58-2.56 0-4.14-1.63-4.14-4.17 0-2.5 1.65-4.22 4.1-4.22 2.39 0 3.96 1.57 4.07 3.84h-2.09c-.1-1.12-.85-1.89-1.98-1.89-1.26 0-2.04.97-2.04 2.45 0 1.55.81 2.49 2.09 2.49 1.02 0 1.76-.45 2.02-1.23h-1.91v-1.54h4c.05.3.06.64.06.97 0 .42-.04.82-.14 1.32z"/></svg>`,
    github: `<svg width="28" height="28" viewBox="0 0 24 24" fill="#000000"><path d="M12 .3A12 12 0 000 12.6c0 5.4 3.4 10 8.2 11.6.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.5-1.3-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 .1 1.6-.7 1.9-1.1.1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.4-5.5-6a4.7 4.7 0 011.3-3.3 4.3 4.3 0 01.1-3.2s1-.3 3.3 1.2a11.4 11.4 0 016 0c2.3-1.5 3.3-1.2 3.3-1.2a4.3 4.3 0 01.1 3.2 4.7 4.7 0 011.3 3.3c0 4.6-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.3v3.3c0 .3.2.7.8.6A12.1 12.1 0 0024 12.6 12 12 0 0012 .3z"/></svg>`,
    telegram: `<svg width="28" height="28" viewBox="0 0 240 240" fill="#0088cc"><path d="M120 0C53.7 0 0 53.7 0 120s53.7 120 120 120 120-53.7 120-120S186.3 0 120 0zm52.1 83.8l-18.1 85.3c-1.4 6.2-5.1 7.7-10.3 4.8l-28.6-21.1-13.8 13.3c-1.5 1.5-2.7 2.7-5.5 2.7l2-28.5 51.9-46.9c2.3-2.1-.5-3.3-3.5-1.2l-64.2 40.4-27.7-8.7c-6-1.9-6.1-6-1.3-8.9l108.2-41.7c5-1.9 9.4 1.2 7.8 8.2z"/></svg>`,
    steam: `<svg width="28" height="28" viewBox="0 0 24 24" fill="#1B2838"><path d="M12 0a12 12 0 00-11.9 11.1l6.4 2.8a3.6 3.6 0 013.5-2.7l3.1-4.9a4.7 4.7 0 11-1.7 6.5l-3-.8a3.6 3.6 0 110 5.2L.7 16.9A12 12 0 1012 0z"/></svg>`,
    discord: `<svg width="28" height="28" viewBox="0 0 24 24" fill="#5865F2"><path d="M20 0H4C1.8 0 0 1.8 0 4v16c0 2.2 1.8 4 4 4h14l-.7-2.5 1.7 1.6 1.7 1.5 3.3-3.3V4c0-2.2-1.8-4-4-4zm-6.3 15.2c0 0-1.1-1.3-2-1.3s-2 1.3-2 1.3c-2.4-.1-3.4-1.7-3.4-1.7 0-3.6 1.6-6.5 1.6-6.5 1.6-1.2 3.1-1.2 3.1-1.2l.1.1c-.7.2-1.3.6-1.8 1.1.8-.4 1.7-.6 2.6-.6.9 0 1.8.2 2.6.6-.5-.5-1.1-.9-1.8-1.1l.1-.1s1.5 0 3.1 1.2c0 0 1.6 2.9 1.6 6.5 0 0-1 1.6-3.4 1.7z"/></svg>`,
    vimeo: `<svg width="28" height="28" viewBox="0 0 24 24" fill="#1AB7EA"><path d="M23.98 6.62c-.1 2.22-1.64 5.26-4.64 9.15C16.1 19.88 13.8 22 11.7 22c-1.33 0-2.46-1.28-3.38-3.84-.62-2.27-1.17-4.53-1.75-6.8C5.97 9.59 5.3 8.92 4.3 9.03a9.32 9.32 0 01-2.2.41L1.36 7.7C2.92 6.06 4.36 4.36 5.67 2.6c1.07-1.27 2.3-1.94 3.68-2 2.4-.1 3.87 1.7 4.4 5.4.3 2.4.5 3.88.67 4.43.37 1.6.78 2.4 1.24 2.4.35 0 .87-.55 1.55-1.65.68-1.1 1.04-2 1.07-2.7.04-.95-.28-1.43-.97-1.43-.33 0-.66.07-1 .2.66-2.14 1.92-3.2 3.8-3.16 2.52.06 3.71 1.72 3.56 5.06z"/></svg>`,
    medium: `<svg width="28" height="28" viewBox="0 0 24 24" fill="#000000"><path d="M2 4v16h20V4H2zm6.8 4.6a2.3 2.3 0 110 4.6 2.3 2.3 0 010-4.6zm7.7 2.3c0 2.54-2 4.6-4.46 4.6-2.46 0-4.46-2.06-4.46-4.6s2-4.6 4.46-4.6C14.47 6.3 16.5 8.36 16.5 11zm2.7-2.3a1.6 1.6 0 110 3.2 1.6 1.6 0 010-3.2z"/></svg>`,
    behance: `<svg width="28" height="28" viewBox="0 0 24 24" fill="#1769FF"><path d="M7.2 10.2c.75 0 1.35-.63 1.35-1.38S7.95 7.5 7.2 7.5H3v2.7h4.2zm.15 1.35H3V15h4.35c.75 0 1.35-.66 1.35-1.5s-.6-1.35-1.35-1.35zm10.8-1.95c-1.41 0-2.52 1.11-2.52 2.52 0 1.41 1.11 2.52 2.52 2.52 1.41 0 2.55-1.11 2.55-2.52 0-1.41-1.14-2.52-2.55-2.52zM12 4.5h6.75v1.5H12V4.5z"/></svg>`,
    dribbble: `<svg width="28" height="28" viewBox="0 0 24 24" fill="#EA4C89"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.314 5.672a9.49 9.49 0 011.993 5.898c-.315-.063-3.482-.687-6.634-.297-.093-.211-.18-.423-.273-.634-.267-.6-.566-1.21-.886-1.81 3.375-1.35 5.351-3.204 5.8-3.657zm-2.402-1.64c-.387.404-2.165 2.137-5.41 3.329-1.7-3.115-3.585-5.602-3.987-6.139a9.49 9.49 0 019.397 2.81zM6.44 2.945c.372.472 2.24 2.927 3.992 6.116-4.258 1.126-8.03 1.097-8.613 1.084a9.49 9.49 0 014.62-7.2zM2.017 12.01v-.198c.58.013 5.313.04 9.953-1.299.258.503.503 1.017.733 1.53-.116.034-.233.067-.35.103-4.697 1.487-7.221 5.561-7.506 6.032a9.43 9.43 0 01-2.83-6.168zm4.74 7.32c.248-.46 2.055-3.617 6.94-5.33 1.195 3.108 1.69 5.722 1.79 6.38a9.455 9.455 0 01-8.73-1.05zm10.78.1c-.08-.53-.56-3.05-1.71-6.14 2.99-.47 5.614.3 6.07.44a9.44 9.44 0 01-4.36 5.7z"/></svg>`,
    reddit: `<svg width="28" height="28" viewBox="0 0 24 24" fill="#FF4500"><path d="M12 0a12 12 0 100 24 12 12 0 000-24zm5.48 10.52c.66 0 1.2.54 1.2 1.2s-.54 1.2-1.2 1.2c-.44 0-.82-.24-1.03-.6a5.48 5.48 0 01-2.98 1.6c.06.2.09.41.09.63 0 1.8-1.52 3.26-3.4 3.26-1.87 0-3.4-1.46-3.4-3.26 0-.22.03-.43.09-.63a5.48 5.48 0 01-2.98-1.6c-.21.36-.59.6-1.03.6-.66 0-1.2-.54-1.2-1.2s.54-1.2 1.2-1.2c.66 0 1.2.54 1.2 1.2 0 .22-.06.42-.16.6a4.11 4.11 0 002.45 1.3c.54-.86 1.58-1.46 2.76-1.46s2.22.6 2.76 1.46a4.11 4.11 0 002.45-1.3c-.1-.18-.16-.38-.16-.6 0-.66.54-1.2 1.2-1.2z"/></svg>`,
    snapchat: `<svg width="28" height="28" viewBox="0 0 24 24" fill="#FFFC00"><path d="M12 0c-2.77 0-5.02 2.25-5.02 5.02v.29c0 .47-.21.92-.57 1.22-.67.57-1.44 1.13-1.51 1.99-.09 1.14 1.1 1.85 2.03 2.18.46.16.94.34 1.07.79.17.58-.34 1.06-.85 1.3-.7.32-1.46.55-2.23.61-.52.04-.87.51-.75 1.02.2.84 1.22 1.22 2 1.39.57.12 1.18.17 1.64.53.35.27.51.73.66 1.14.43 1.16 1.43 2.02 2.64 2.34 1.79.46 3.71.46 5.5 0 1.21-.32 2.21-1.18 2.64-2.34.15-.41.31-.86.66-1.14.46-.36 1.07-.41 1.64-.53.78-.17 1.79-.55 2-1.39.12-.51-.23-.98-.75-1.02-.77-.06-1.53-.29-2.23-.61-.51-.24-1.03-.72-.85-1.3.13-.45.61-.63 1.07-.79.93-.33 2.12-1.04 2.03-2.18-.07-.86-.84-1.42-1.51-1.99-.36-.3-.57-.75-.57-1.22v-.29C17.02 2.25 14.77 0 12 0z"/></svg>`,
    pinterest: `<svg width="28" height="28" viewBox="0 0 24 24" fill="#E60023"><path d="M12 0C5.373 0 0 5.372 0 12c0 4.991 3.657 9.128 8.438 10.062-.117-.855-.223-2.168.047-3.103.242-.83 1.558-5.29 1.558-5.29s-.397-.794-.397-1.965c0-1.84 1.067-3.214 2.397-3.214 1.13 0 1.676.848 1.676 1.864 0 1.136-.724 2.835-1.095 4.413-.311 1.315.662 2.387 1.962 2.387 2.355 0 3.941-3.031 3.941-6.623 0-2.732-1.839-4.776-5.184-4.776-3.777 0-6.13 2.816-6.13 5.96 0 1.084.416 2.247.936 2.879.103.125.118.235.087.362-.095.398-.311 1.266-.354 1.441-.056.232-.183.281-.423.17-1.577-.733-2.557-3.034-2.557-4.889 0-3.976 2.892-7.626 8.342-7.626 4.376 0 7.771 3.12 7.771 7.289 0 4.343-2.739 7.834-6.54 7.834-1.277 0-2.478-.662-2.892-1.448l-.786 3c-.283 1.088-1.051 2.45-1.566 3.282C9.87 23.83 10.91 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>`,
  };
  return icons[normalizedName] || icons.facebook;
};
</script>
