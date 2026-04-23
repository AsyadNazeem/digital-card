<template>
  <div v-if="!loaded" class="loading-screen">
    <div class="spinner"></div>
  </div>

  <component
      v-if="loaded"
      :is="layoutComponent"
      :company="company"
      :contacts="contacts"
      :theme="theme"
      :locale="locale"
      :translated-data="translatedData"
      :is-translating="isTranslating"
      :show-review-popup="showReviewPopup"
      :show-whatsapp-popup="showWhatsAppPopup"
      :show-contact-popup="showContactPopup"
      :contact-message-form="contactMessageForm"
      :contact-message-loading="contactMessageLoading"
      :contact-message-status="contactMessageStatus"
      :handlers="handlers"
  />
</template>

<script setup>
import { computed, onMounted, ref, watch, markRaw } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from 'vue-i18n';
import api from "../services/api";
import { API_BASE_URL, VITE_IMAGE_UPLOAD_URL } from "../config.js";
import { translateBatch } from "../utils/translator";

// Import layouts
import LayoutClassic from "../layouts/LayoutClassic.vue";
import LayoutModern from "../layouts/LayoutModern.vue";

const route = useRoute();
const { t, locale } = useI18n();

// ===== STATE =====
const company = ref({});
const contacts = ref([]);
const loaded = ref(false);
const theme = ref(null);
const translatedData = ref({});
const isTranslating = ref(false);

// Popup states
const showReviewPopup = ref(false);
const showWhatsAppPopup = ref(false);
const showContactPopup = ref(false);

// Contact message form state
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

// ===== LAYOUT MAPPING =====
const layoutMap = {
  classic: markRaw(LayoutClassic),
  modern: markRaw(LayoutModern),
};

const layoutComponent = computed(() => {
  const layoutType = theme.value?.layoutType || 'classic';
  return layoutMap[layoutType] || layoutMap.classic;
});

// ===== ANALYTICS FUNCTIONS =====
const getGAClientId = () => {
  return new Promise((resolve) => {
    if (window.gtag) {
      window.gtag('get', 'G-Z9X7JZZVQF', 'client_id', (clientId) => {
        resolve(clientId);
      });
    } else {
      resolve(null);
    }
  });
};

function getDeviceType() {
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  console.log('User Agent:', ua);

  if (/windows phone/i.test(ua)) return 'mobile';
  if (/android/i.test(ua) && !/mobile/i.test(ua)) return 'tablet';
  if (/iPad/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) return 'tablet';
  if (/tablet|playbook|silk/i.test(ua)) return 'tablet';
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini|webos|bb10/i.test(ua)) return 'mobile';
  return 'desktop';
}

async function trackPageView() {
  try {
    const phone = route.params.phone;
    const referrer = document.referrer || 'direct';
    const userAgent = navigator.userAgent;
    const deviceType = getDeviceType();
    const gaClientId = await getGAClientId();

    await api.post(`/analytics/view/${phone}`, {
      referrer,
      userAgent,
      deviceType,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      language: navigator.language,
      gaClientId
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
}

async function trackClick(clickType, linkUrl = '') {
  try {
    const phone = route.params.phone;
    const userAgent = navigator.userAgent;
    const gaClientId = await getGAClientId();

    await api.post(`/analytics/click/${phone}`, {
      clickType,
      linkUrl,
      userAgent,
      gaClientId
    });

    if (window.gtag) {
      const eventMap = {
        'phone': 'contact_phone',
        'email': 'contact_email',
        'whatsapp': 'contact_whatsapp',
        'whatsapp_channel': 'contact_whatsapp_channel',
        'office_phone': 'contact_office',
        'website': 'visit_website',
        'location': 'view_location',
        '360_view': 'view_360',
        'brochure': 'download_brochure',
        'menu': 'view_menu',
        'shop_now': 'shop_now',
        'order_now': 'order_now',
        'review': 'write_review',
        'google_review': 'google_review',
        'tripadvisor_review': 'tripadvisor_review'
      };

      const gaEventName = eventMap[clickType] || clickType;

      window.gtag('event', gaEventName, {
        event_category: 'Contact Card',
        event_label: clickType,
        link_url: linkUrl,
        card_owner: phone,
        client_id: gaClientId
      });

      if (clickType.startsWith('social_')) {
        const platform = clickType.replace('social_', '');
        window.gtag('event', 'social_click', {
          event_category: 'Social Media',
          event_label: platform,
          link_url: linkUrl,
          card_owner: phone,
          client_id: gaClientId
        });
      }
    }
  } catch (error) {
    console.error('Click tracking error:', error);
  }
}

async function trackFileDownload(fileName, fileType) {
  if (window.gtag) {
    window.gtag('event', 'file_download', {
      event_category: 'Downloads',
      event_label: fileName,
      file_extension: fileType,
      card_owner: route.params.phone
    });
  }
}

function setupScrollTracking() {
  let scrollDepths = [25, 50, 75, 100];
  let trackedDepths = new Set();

  window.addEventListener('scroll', () => {
    const scrollPercentage = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );

    scrollDepths.forEach(depth => {
      if (scrollPercentage >= depth && !trackedDepths.has(depth)) {
        trackedDepths.add(depth);

        if (window.gtag) {
          window.gtag('event', 'scroll_depth', {
            event_category: 'Engagement',
            event_label: `${depth}%`,
            value: depth,
            card_owner: route.params.phone
          });
        }
      }
    });
  });
}

function setupEngagementTracking() {
  let startTime = Date.now();
  let engagementSent = false;

  setTimeout(() => {
    if (!engagementSent && window.gtag) {
      const engagementTime = Math.round((Date.now() - startTime) / 1000);

      window.gtag('event', 'user_engagement', {
        event_category: 'Engagement',
        engagement_time_msec: engagementTime * 1000,
        card_owner: route.params.phone
      });
      engagementSent = true;
    }
  }, 30000);

  window.addEventListener('beforeunload', () => {
    if (window.gtag) {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);

      window.gtag('event', 'time_on_page', {
        event_category: 'Engagement',
        value: timeSpent,
        card_owner: route.params.phone
      });
    }
  });
}

// ===== TRANSLATION FUNCTIONS =====
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

watch(locale, async (newLocale) => {
  if (newLocale === 'ar') {
    await translateDatabaseContent();
  } else {
    translatedData.value = {};
  }
});

const toggleLanguage = async () => {
  const newLocale = locale.value === 'en' ? 'ar' : 'en';
  locale.value = newLocale;
  localStorage.setItem('preferredLanguage', newLocale);

  if (newLocale === 'ar' && Object.keys(translatedData.value).length === 0) {
    await translateDatabaseContent();
  }
};

// ===== ACTION HANDLERS =====
const handlePhoneClick = async (phoneNumber) => {
  await trackClick('phone', `tel:${phoneNumber}`);
  window.location.href = `tel:${phoneNumber}`;
};

const handleEmailClick = async (email) => {
  await trackClick('email', `mailto:${email}`);
  window.location.href = `mailto:${email}`;
};

const handleOfficePhoneClick = async (phone) => {
  await trackClick('office_phone', `tel:${phone}`);
  window.location.href = `tel:${phone}`;
};

const formatUrl = (url) => {
  if (!url) return "";
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }
  return url;
};

const handleWebsiteClick = async (url) => {
  await trackClick('website', url);
  window.location.href = formatUrl(url);
};

const handleLocationClick = async (url) => {
  await trackClick('location', url);
  window.location.href = formatUrl(url);
};

const handleSocialClick = async (platform, url) => {
  await trackClick(`social_${platform}`, url);
  window.location.href = formatUrl(url);
};

const handle360Click = async (url) => {
  await trackClick('360_view', url);
  window.location.href = url;
};

const handleFileClick = async (file) => {
  const fileType = file.isBrochure ? 'brochure' :
      file.isMenu ? 'menu' :
          file.isShopNow ? 'shop_now' :
              file.isOrderNow ? 'order_now' : 'file';

  const fileUrl = getFileUrl(file);
  await trackClick(fileType, fileUrl);
  window.location.href = fileUrl;
};

const getFileUrl = (file) => {
  if (!file || !file.url) return '';
  if (/^https?:\/\//i.test(file.url)) {
    return file.url;
  }
  return `${VITE_IMAGE_UPLOAD_URL}${file.url}`;
};

const handleWhatsAppClick = async () => {
  const whatsapp = contacts.value[0]?.whatsapp;
  const whatsappChannel = contacts.value[0]?.whatsappChannel;

  if (whatsapp && !whatsappChannel) {
    await trackClick('whatsapp', `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`);
    window.location.href = `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`;
  } else if (whatsappChannel && !whatsapp) {
    await trackClick('whatsapp_channel', whatsappChannel);
    window.location.href = whatsappChannel;
  } else if (whatsapp && whatsappChannel) {
    showWhatsAppPopup.value = true;
  }
  console.log(whatsapp)
  console.log(whatsappChannel)
};

const closeWhatsAppPopup = () => {
  showWhatsAppPopup.value = false;
};

const redirectToWhatsApp = async (url) => {
  const isChannel = url.includes('whatsapp.com/channel') || url === contacts.value[0]?.whatsappChannel;
  await trackClick(isChannel ? 'whatsapp_channel' : 'whatsapp', url);
  window.location.href = url;
  closeWhatsAppPopup();
};

const hasReviewLinks = () => {
  return !!(company.value.googleReviews || company.value.tripAdvisor);
};

const handleReviewClick = async () => {
  await trackClick('review');
  const googleReviews = company.value.googleReviews;
  const tripAdvisor = company.value.tripAdvisor;

  if (googleReviews && !tripAdvisor) {
    window.location.href = googleReviews;
  } else if (tripAdvisor && !googleReviews) {
    window.location.href = tripAdvisor;
  } else if (googleReviews && tripAdvisor) {
    showReviewPopup.value = true;
  }
};

const closeReviewPopup = () => {
  showReviewPopup.value = false;
};

const redirectToReview = async (url) => {
  const platform = url.includes('google') ? 'google_review' : 'tripadvisor_review';
  await trackClick(platform, url);
  window.location.href = url;
  closeReviewPopup();
};

// ===== CONTACT MESSAGE =====
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

async function submitContactMessage() {
  contactMessageStatus.value = { message: '', success: false };

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

    await api.post('/public/contact-message', {
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

// ===== SHARE FUNCTION =====
const shareCard = async () => {
  if (!contacts.value.length) return;

  const contact = contacts.value[0];
  const displayFirstName = locale.value === 'ar' && translatedData.value.firstName
      ? translatedData.value.firstName
      : contact.firstName || '';
  const displayLastName = locale.value === 'ar' && translatedData.value.lastName
      ? translatedData.value.lastName
      : contact.lastName || '';

  const fullName = `${displayFirstName} ${displayLastName}`;
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

// ===== SAVE CONTACT (VCF) =====
const saveContact = async () => {
  if (!contacts.value.length) {
    console.error("No contact information available to save.");
    return;
  }

  await trackFileDownload('contact.vcf', 'vcf');
  await trackClick('save_contact', 'vcf_download');

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

    const vcfBlob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
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

// ===== META TAGS =====
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
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'profile' },
    { property: 'og:url', content: window.location.href },
    {
      property: 'og:image',
      content: contact.photo ? `${VITE_IMAGE_UPLOAD_URL}${contact.photo}` : `${VITE_IMAGE_UPLOAD_URL}${company.logo}`
    },
    { property: 'og:site_name', content: company.companyName || 'TapMyName' },
    { name: 'description', content: description },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
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

// ===== HANDLERS OBJECT =====
const handlers = {
  // Toggle & Language
  toggleLanguage,
  shareCard,

  // Primary Actions
  handlePhoneClick,
  handleEmailClick,
  handleOfficePhoneClick,
  handleWebsiteClick,
  handleLocationClick,
  handleWhatsAppClick,

  // Secondary Actions
  handle360Click,
  handleFileClick,
  handleReviewClick,
  handleSocialClick,

  // Popups
  closeWhatsAppPopup,
  redirectToWhatsApp,
  closeReviewPopup,
  redirectToReview,
  closeContactPopup,
  submitContactMessage,
  openContactPopup: () => { showContactPopup.value = true; },

  // Save Contact
  saveContact,

  // Utilities
  hasReviewLinks,
  formatUrl,
  getFileUrl,

  // Translation
  t
};

// ===== LIFECYCLE =====
onMounted(async () => {
  const deviceType = getDeviceType();
  console.log('🔍 Detected Device Type:', deviceType);
  console.log('📱 User Agent:', navigator.userAgent);

  await new Promise(resolve => setTimeout(resolve, 500));

  await trackPageView();
  setupScrollTracking();
  setupEngagementTracking();

  try {
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
</script>
