<template>
  <div
      class="public-card-container"
      :dir="locale === 'ar' ? 'rtl' : 'ltr'"
  >
    <template v-if="contactType === 'individual'">
      <div class="public-card">
        <!-- Header Section -->
        <HeaderSection
            :locale="locale"
            :company="company"
            :contacts="contacts"
            :on-toggle-language="handlers.toggleLanguage"
            :on-share="handlers.shareCard"
        />

        <!-- Identity Section -->
        <IdentitySection
            :locale="locale"
            :display-first-name="displayFirstName"
            :display-last-name="displayLastName"
            :display-designation="displayDesignation"
            :display-bio="displayBio"
        />

        <!-- Primary Action Buttons (3x2 Grid) -->
        <PrimaryButtons
            :locale="locale"
            :contacts="contacts"
            :company="company"
            :handlers="handlers"
        />

        <!-- Save Contact Button -->
        <SaveContactButton
            :locale="locale"
            :on-save="handlers.saveContact"
        />

        <!-- Secondary Action Buttons -->
        <SecondaryButtons
            :locale="locale"
            :company="company"
            :handlers="handlers"
            :shop-now-links="shopNowLinks"
            :order-now-links="orderNowLinks"
            :brochure-links="brochureLinks"
            :menu-links="menuLinks"
        />

        <!-- Company Details -->
        <CompanyInfo
            :display-company-name="displayCompanyName"
            :company="company"
        />

        <!-- Social Section -->
        <SocialSection
            :company="company"
            :handlers="handlers"
        />

        <!-- Footer -->
        <FooterSection :locale="locale" />
      </div>

      <!-- Floating Contact Button -->
      <button
          @click="handlers.openContactPopup"
          class="floating-contact-btn"
          :title="handlers.t('contactUs')"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <span class="floating-btn-tooltip">{{ handlers.t('contactUs') }}</span>
      </button>

      <!-- Review Popup -->
      <ReviewPopup
          v-if="showReviewPopup"
          :locale="locale"
          :company="company"
          :handlers="handlers"
          :on-close="handlers.closeReviewPopup"
      />

      <!-- WhatsApp Popup -->
      <WhatsAppPopup
          v-if="props.showWhatsAppPopup"
          :locale="locale"
          :contacts="contacts"
          :handlers="handlers"
          :on-close="handlers.closeWhatsAppPopup"
      />

      <!-- Contact Message Popup -->
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
    </template>

    <template v-else-if="contactType === 'group'">
      <div class="public-card">
        <!-- Header for Group -->
        <HeaderSection
            :locale="locale"
            :company="company"
            :contacts="contacts"
            :on-toggle-language="handlers.toggleLanguage"
            :on-share="handlers.shareCard"
            :is-group="true"
        />

        <!-- Identity -->
        <IdentitySection
            :locale="locale"
            :display-first-name="displayFirstName"
            :display-last-name="displayLastName"
            :display-designation="displayDesignation"
            :display-bio="displayBio"
            :is-group="true"
        />

        <div>
          <!-- WhatsApp Channel Standalone -->
          <div v-if="contacts[0]?.whatsappChannel" class="whatsapp-standalone-container">
            <button
                @click="handlers.redirectToWhatsApp(contacts[0].whatsappChannel)"
                class="action-link-secondary action-link-secondary-group whatsapp-channel-btn whatsapp-channel-standalone"
            >
              <span class="action-icon action-icon-group">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </span>
              <span>{{ locale === 'ar' ? 'قناة واتساب' : 'WhatsApp Channel' }}</span>
            </button>
          </div>

          <!-- Group Secondary Buttons -->
          <SecondaryButtons
              :locale="locale"
              :company="company"
              :handlers="handlers"
              :shop-now-links="shopNowLinks"
              :order-now-links="orderNowLinks"
              :brochure-links="brochureLinks"
              :menu-links="menuLinks"
              :is-group="true"
          />

          <!-- Company Details -->
          <CompanyInfo
              :display-company-name="displayCompanyName"
              :company="company"
              :is-group="true"
          />

          <!-- Social -->
          <SocialSection
              :company="company"
              :handlers="handlers"
              :is-group="true"
          />

          <!-- Footer -->
          <FooterSection :locale="locale" :is-group="true" />
        </div>
      </div>

      <!-- Review Popup for Group -->
      <ReviewPopup
          v-if="showReviewPopup"
          :locale="locale"
          :company="company"
          :handlers="handlers"
          :on-close="handlers.closeReviewPopup"
          :is-group="true"
      />
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import HeaderSection from '../components/HeaderSection.vue';
import IdentitySection from '../components/IdentitySection.vue';
import PrimaryButtons from '../components/PrimaryButtons.vue';
import SaveContactButton from '../components/SaveContactButton.vue';
import SecondaryButtons from '../components/SecondaryButtons.vue';
import CompanyInfo from '../components/CompanyInfo.vue';
import SocialSection from '../components/SocialSection.vue';
import FooterSection from '../components/FooterSection.vue';
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

const contactType = computed(() => {
  return props.contacts[0]?.type || 'individual';
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

const displayCompanyName = computed(() => {
  if (props.locale === 'ar' && props.translatedData.companyName) {
    return props.translatedData.companyName;
  }
  return props.company.companyName || '';
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
    console.warn('Could not parse company.files', e);
    return [];
  }
});

const shopNowLinks = computed(() => filesList.value.filter(file => file.isShopNow));
const orderNowLinks = computed(() => filesList.value.filter(file => file.isOrderNow));
const brochureLinks = computed(() => filesList.value.filter(file => file.isBrochure));
const menuLinks = computed(() => filesList.value.filter(file => file.isMenu));
</script>
