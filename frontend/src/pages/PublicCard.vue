<template>
  <div
      class="public-card-container"
      v-if="loaded"
  >
    <!-- Inner Card -->
    <div class="public-card">
      <!-- Header Section -->

      <!-- Header Section -->
      <div class="header-section">
        <!-- Contact Photo (Half-screen background) -->
        <!-- Header Section -->
        <div class="header-section">
          <!-- Company Logo as background (SWAPPED) -->
          <div class="company-logo-container" v-if="company.logo">
            <img
                :src="`${API_BASE_URL}${company.logo}`"
                alt="Company Logo"
                class="company-logo-bg"
            />
            <div class="logo-overlay"></div>
          </div>

          <!-- Centered Contact Photo (Overlapping Boundary) (SWAPPED) -->
          <div class="contact-photo-center" v-if="contacts.length && contacts[0].photo">
            <img
                :src="`${API_BASE_URL}${contacts[0].photo}`"
                alt="Contact Photo"
                class="contact-photo-circle"
            />
          </div>
        </div>


      </div>

      <!-- Company Info Section (White Background) -->
      <div class="company-info">
        <h1 class="company-name" v-if="contacts.length">{{`${contacts[0].firstName} ${contacts[0].lastName}`}}</h1>

        <p class="company-designation" v-if="contacts.length">
          {{ contacts[0].designation }}
        </p>

        <p class="company-bio" v-if="company.bio">
          {{ company.bio }}
        </p>
      </div>


      <!-- Action Buttons (3x2 Grid) -->
      <div class="action-buttons">
        <!-- Row 1: Personal Contact Actions -->

        <!-- 1. Contact Mobile/Call (contacts[0].mobile) -->
        <a :href="`tel:${contacts[0].mobile}`" class="action-btn call" v-if="contacts.length && contacts[0].mobile">
          <span v-html="getIcon('phone')" class="action-icon"></span>
          <span>Mobile</span>
        </a>

        <!-- 2. Contact WhatsApp (contacts[0].mobile) -->
        <a :href="`https://wa.me/${contacts[0].mobile?.replace(/[^0-9]/g, '')}`" target="_blank" class="action-btn whatsapp" v-if="contacts.length && contacts[0].mobile">
          <span v-html="getIcon('whatsapp')" class="action-icon"></span>
          <span>WhatsApp</span>
        </a>

        <!-- 3. Contact Email (contacts[0].email) -->
        <a :href="`mailto:${contacts[0].email}`" class="action-btn email" v-if="contacts.length && contacts[0].email">
          <span v-html="getIcon('mail')" class="action-icon"></span>
          <span>Email</span>
        </a>

        <!-- Row 2: Company/General Actions -->

        <!-- 4. Company Phone/Office (company.phone) -->
        <a :href="`tel:${company.phone}`" class="action-btn office-phone">
          <span v-html="getIcon('phone-office')" class="action-icon"></span>
          <span>Office</span>
        </a>

        <!-- 5. Company Website (company.website) -->
        <a :href="formatUrl(company.website)" target="_blank" class="action-btn website">
          <span v-html="getIcon('globe')" class="action-icon"></span>
          <span>Website</span>
        </a>

        <!-- 6. Google Maps (company.address) -->
        <a :href="company.googleLocation" target="_blank" class="action-btn maps">
          <span v-html="getIcon('map')" class="action-icon"></span>
          <span>Location</span>
        </a>
      </div>

      <!-- Save Contact Button (Full Width) -->
      <button @click="saveContact" class="action-btn save">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
          <polyline points="17 21 17 13 7 13 7 21"></polyline>
          <polyline points="7 3 7 8 15 8"></polyline>
        </svg>
        Save Contact
      </button>

      <!-- Additional Action Buttons (360 & Reviews) -->
      <div class="additional-actions" v-if="company.view360 || company.googleReviews">
        <!-- 360° View -->
        <a
            v-if="company.view360"
            :href="company.view360"
            target="_blank"
            class="action-link-secondary"
        >
          <span v-html="getIcon('360')" class="action-icon"></span>
          <span>360° View</span>
        </a>

        <!-- Google Reviews -->
        <a
            v-if="company.googleReviews"
            :href="company.googleReviews"
            target="_blank"
            class="action-link-secondary"
        >
          <span v-html="getIcon('review')" class="action-icon"></span>
          <span>Reviews</span>
        </a>
      </div>

      <div class="company-details">
        <h2 v-if="company.companyName">{{company.companyName}}</h2>
        <h2 v-if="company.website">{{company.website}}</h2>
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
        Powered by <span>Digital Business Card</span>
      </footer>
    </div>

  </div>

  <div v-else class="loading">
    <div class="spinner"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import api from "../services/api";
import { API_BASE_URL } from "../config.js";

const route = useRoute();
const company = ref({});
const contacts = ref([]);
const loaded = ref(false);
const theme = ref(null);

// Theme confirmation modal
const showThemeConfirm = ref(false);
const selectedThemeForConfirm = ref(null);

// onMounted(() => {
//   // Force load theme1 for testing
//   const link = document.createElement("link");
//   link.rel = "stylesheet";
//   link.href = "http://localhost:4000/uploads/themes/theme1.css"; // Use your backend URL
//   document.head.appendChild(link);
//   console.log("Test theme loaded");
// });

onMounted(async () => {
  try {
    const phone = route.params.phone;

    console.log("📞 Fetching contact card for:", phone);
    const res = await api.get(`/public/${phone}`);

    company.value = res.data.company || {};
    contacts.value = res.data.contact ? [res.data.contact] : [];
    theme.value = res.data.theme;

    // Debug logging
    console.log("📦 Response data:", res.data);
    console.log("🎨 Theme data received:", theme.value);

    if (theme.value && theme.value.cssFile) {
      console.log("✅ Applying theme CSS:", theme.value.cssFile);
      applyTheme(theme.value.cssFile);
    } else {
      console.warn("⚠️ No theme CSS file found!");
      console.log("Theme object:", theme.value);
    }

    loaded.value = true;
  } catch (error) {
    console.error("❌ Error loading public card:", error);
    console.error("Error details:", error.response?.data);
    loaded.value = true;
  }
});

function applyTheme(cssFile) {
  // Remove any existing theme stylesheets
  const existingTheme = document.querySelector('link[data-theme-css]');
  if (existingTheme) {
    console.log("🗑️ Removing existing theme");
    existingTheme.remove();
  }

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.setAttribute('data-theme-css', 'true');

  // Build the full URL
  const fullUrl = `${API_BASE_URL}${cssFile}`;
  link.href = fullUrl;

  console.log("🔗 Loading CSS from:", fullUrl);

  // Add error handling
  link.onerror = () => {
    console.error("❌ Failed to load theme CSS:", fullUrl);
  };

  link.onload = () => {
    console.log("✅ Theme CSS loaded successfully!");
  };

  document.head.appendChild(link);
  console.log("📎 CSS link added to <head>");
}

// For dashboard theme selection (if this is in dashboard)
function confirmThemeSelection(theme) {
  selectedThemeForConfirm.value = theme;
  showThemeConfirm.value = true;
}

async function applySelectedTheme() {
  try {
    await api.post("/themes/select", {
      themeId: selectedThemeForConfirm.value.id
    });

    // Apply theme immediately
    if (selectedThemeForConfirm.value.cssFile) {
      applyTheme(selectedThemeForConfirm.value.cssFile);
    }

    alert("✅ Theme updated successfully!");
    showThemeConfirm.value = false;
  } catch (err) {
    if (err.response?.data?.isPremium) {
      alert("⭐ " + err.response.data.message);
    } else {
      alert("❌ Failed to update theme");
    }
  }
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
    // Fetch and convert photo to base64 if available
    let photoBase64 = '';
    if (contact.photo) {
      try {
        const photoUrl = `${API_BASE_URL}${contact.photo}`;
        const response = await fetch(photoUrl);
        const blob = await response.blob();

        // Convert blob to base64
        photoBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            // Remove the data:image/xxx;base64, prefix
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

    // Build address components
    const addressParts = [];

    // VCF ADR format: ;;street;city;region;postal-code;country
    addressParts.push(''); // PO Box
    addressParts.push(''); // Extended address
    addressParts.push(contact.streetAddress || ''); // Street address
    addressParts.push(contact.city || ''); // City
    addressParts.push(''); // State/Province (if you add this field later)
    addressParts.push(contact.postalCode || ''); // Postal code
    addressParts.push(contact.country || ''); // Country

    const addressString = addressParts.join(';');
    const hasAddress = contact.streetAddress || contact.city || contact.postalCode || contact.country;

    // Build VCF content
    let vcard = `BEGIN:VCARD
VERSION:3.0
FN:${contact.firstName} ${contact.lastName}
N:${contact.lastName};${contact.firstName};;;
ORG:${company.value.companyName || ''}
TITLE:${contact.designation || ''}`;

    // Add telephone if available
    if (contact.telephone) {
      vcard += `\nTEL;TYPE=VOICE:${contact.telephone}`;
    }

    // Add mobile
    if (contact.mobile) {
      vcard += `\nTEL;TYPE=CELL:${contact.mobile}`;
    }

    // Add company phone
    if (company.value.phone) {
      vcard += `\nTEL;TYPE=WORK:${company.value.phone}`;
    }

    // Add email
    if (contact.email) {
      vcard += `\nEMAIL;TYPE=PREF,INTERNET:${contact.email}`;
    }

    // Add website
    if (company.value.website) {
      vcard += `\nURL;TYPE=WORK:${company.value.website}`;
    }

    // Add address with proper label
    if (hasAddress) {
      const label = contact.label || 'WORK';
      vcard += `\nADR;TYPE=${label}:${addressString}`;

      // Add formatted address label for better display
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

    // Add photo if available
    if (photoBase64) {
      // Split base64 into 76-character lines as per VCF spec
      const photoLines = photoBase64.match(/.{1,76}/g);
      vcard += `\nPHOTO;ENCODING=b;TYPE=JPEG:${photoLines.join('\n ')}`;
    }

    vcard += `\nEND:VCARD`;

    // Create and download VCF file
    const vcfBlob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(vcfBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${contact.firstName}_${contact.lastName}.vcf`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
    console.log("✅ Contact VCF with photo and address downloaded successfully.");
  } catch (error) {
    console.error("❌ Error generating VCF:", error);
  }
};

const getIcon = (name) => {
  const icons = {
    phone: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`,
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
    twitter: `<svg width="28" height="28" viewBox="0 0 24 24" fill="#1DA1F2"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>`,
    linkedin: `<svg width="28" height="28" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
    youtube: `<svg width="28" height="28" viewBox="0 0 24 24" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
    tiktok: `<svg width="28" height="28" viewBox="0 0 24 24" fill="#000000"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>`,
    instagram: `<svg width="28" height="28" viewBox="0 0 24 24" fill="url(#instagram-gradient)"><defs><linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#FD5949;stop-opacity:1" /><stop offset="50%" style="stop-color:#D6249F;stop-opacity:1" /><stop offset="100%" style="stop-color:#285AEB;stop-opacity:1" /></linearGradient></defs><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>`,
    whatsapp: `<svg width="28" height="28" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>`,
  };
  return icons[normalizedName] || icons.facebook;
};
</script>

<style>


</style>
