<template>
  <div v-if="activeTab === 'contact'" :class="['content-card', { 'dark-mode': isDarkMode }]">
    <div v-if="!showContactForm">
      <div class="card-header">
        <h2 class="card-title">Contact Information</h2>
        <button
            class="btn-primary"
            @click="showContactForm = true"
            :disabled="contactCount >= userLimits.contactLimit"
            v-if="contactCount < userLimits.contactLimit"
        >
          + Add Contact
        </button>
      </div>

      <div v-if="contacts.length > 0" class="table-container">
        <div class="table-controls">
          <input
              type="text"
              v-model="contactSearch"
              placeholder="Search contacts..."
              class="search-input"
          />
        </div>

        <table class="data-table">
          <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Mobile</th>
            <th>Email</th>
            <th>Designation</th>
            <th>Company</th>
            <th>WhatsApp Channel</th>
            <th>Status</th>
            <th>Photo</th>
            <th>Wallet</th>
            <th>Actions</th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="(c, index) in paginatedContacts" :key="c.id">
            <td data-label="#">{{ index + 1 }}</td>
            <td data-label="Name"><strong>{{ c.firstName }} {{ c.lastName }}</strong></td>
            <td data-label="Mobile">
              <a :href="`/${c.mobile.replace(/\D/g, '')}`" target="_blank" class="link">
                {{ c.mobile }}
              </a>
            </td>
            <td data-label="Email">{{ c.email }}</td>
            <td data-label="Designation">{{ c.designation }}</td>
            <td data-label="Company">{{ c.Company?.companyName || '-' }}</td>
            <td data-label="WhatsApp Channel">
              <a
                  v-if="c.whatsappChannel"
                  :href="c.whatsappChannel"
                  target="_blank"
                  class="btn-action whatsapp"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2"
                     stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 11.5a8.5 8.5 0 1 1-3-6.5"/>
                  <path d="M16 8c-1.5-1.5-4-1-5 1s1 4 2 5 3 3 5 2 2.5-3.5 1-5"/>
                </svg>
                Channel
              </a>

              <span v-else>-</span>
            </td>
            <td data-label="Status">
              <span :class="['status-badge', c.status]">{{ c.status }}</span>
            </td>
            <td data-label="Photo">
              <img v-if="c.photo" :src="`${VITE_IMAGE_UPLOAD_URL}${c.photo}`" class="photo-thumb"
                   alt="Contact Photo"/>
              <span v-else>-</span>
            </td>
            <td data-label="Wallet">
              <button class="btn-action wallet" @click="saveToGoogleWallet(c)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2"
                     stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="6" width="20" height="12" rx="2"/>
                  <path d="M16 12h4"/>
                  <circle cx="16" cy="12" r="1"/>
                </svg>
                Save
              </button>
            </td>
            <td class="action-buttons">
              <a
                  :href="`/${c.mobile.replace(/\D/g, '')}`"
                  target="_blank"
                  rel="noopener"
                  class="btn-action view"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg> View
              </a>
              <button class="btn-action qr" @click="openQrPopup(c)"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="5" height="5"/>
                <rect x="16" y="3" width="5" height="5"/>
                <rect x="3" y="16" width="5" height="5"/>
                <path d="M16 16h2v2h-2zM20 16h1v5h-5v-1"/>
              </svg> QR</button>
              <button class="btn-action edit" @click="editContact(c)"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5l4 4L7 21H3v-4z"/>
              </svg> Edit</button>
              <button class="btn-action delete" @click="deleteContact(c.id)"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-2 14H7L5 6"/>
              </svg> Delete</button>
            </td>
          </tr>
          </tbody>
        </table>
        <div class="pagination">
          <button
              @click="contactPage--"
              :disabled="contactPage === 1"
          >
            Prev
          </button>

          <button
              v-for="page in contactTotalPages"
              :key="page"
              @click="contactPage = page"
              :class="['page-btn', { active: contactPage === page }]"
          >
            {{ page }}
          </button>

          <button
              @click="contactPage++"
              :disabled="contactPage === contactTotalPages"
          >
            Next
          </button>
        </div>
      </div>

      <div v-else class="empty-state">
        <svg class="empty-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
        <p class="empty-text">No contact data found</p>
<!--        <button @click="showContactForm = true" class="link-button">Add your first contact</button>-->
      </div>
    </div>

    <!-- Contact Form -->
    <div v-else>
      <div class="card-header">
        <h2 class="card-title">Add Contact</h2>
        <button @click="showContactForm = false" class="btn-close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Contact Type Selection -->
      <div class="contact-type-selector">
        <label class="radio-option">
          <input
              type="radio"
              v-model="contactType"
              value="individual"
              name="contactType"
          />
          <span class="radio-label">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Individual
          </span>
        </label>

        <label class="radio-option">
          <input
              type="radio"
              v-model="contactType"
              value="group"
              name="contactType"
          />
          <span class="radio-label">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            Group
          </span>
        </label>
      </div>

      <!-- INDIVIDUAL FORM (Keep ALL existing fields) -->
      <div v-if="contactType === 'individual'" class="form-container">
        <!-- Contact Photo Upload -->
        <div class="form-group full-width">
          <label class="form-label">Contact Photo</label>
          <div class="upload-area">
            <input
                type="file"
                @change="handlePhotoUpload"
                accept="image/*"
                id="photo-upload"
                class="file-input"
            />
            <label for="photo-upload" class="upload-label">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <span>{{ photoFileName || 'Click to upload photo' }}</span>
            </label>
            <div v-if="photoPreview" class="image-preview">
              <img :src="photoPreview" alt="Photo preview"/>
              <button @click="removePhoto" class="remove-image" type="button">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Contact Information -->
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">First Name <span class="required">*</span></label>
            <input v-model="contactForm.firstName" type="text" class="form-input" required/>
          </div>
          <div class="form-group">
            <label class="form-label">Last Name <span class="required">*</span></label>
            <input v-model="contactForm.lastName" type="text" class="form-input" required/>
          </div>

          <!-- CONTACT FORM - TELEPHONE -->
          <div class="form-group">
            <label>Telephone</label>
            <div class="phone-input-group">
              <CountryCodeDropdown v-model="telephoneCountryCode"/>
              <input
                  v-model="contactForm.telephone"
                  type="tel"
                  class="form-input"
                  placeholder="Enter phone number"
                  @input="handleContactTelephone"
              />
            </div>
            <p
                v-if="phoneValidation.telephone.message"
                :style="{
                  color: phoneValidation.telephone.isValid ? '#27ae60' : '#e74c3c',
                  fontSize: '0.85rem',
                  marginTop: '0.5rem'
                }"
            >
              {{ phoneValidation.telephone.message }}
            </p>
          </div>

          <!-- CONTACT FORM - MOBILE -->
          <div class="form-group">
            <label>Mobile <span style="color: red;">*</span></label>
            <div class="phone-input-group">
              <CountryCodeDropdown v-model="mobileCountryCode"/>
              <input
                  v-model="contactForm.mobile"
                  type="tel"
                  class="form-input"
                  placeholder="Enter mobile number"
                  @input="handleContactMobile"
                  required
              />
            </div>
            <p
                v-if="phoneValidation.mobile.message && !checkingMobile"
                :style="{
                  color: phoneValidation.mobile.isValid ? '#27ae60' : '#e74c3c',
                  fontSize: '0.85rem',
                  marginTop: '0.5rem'
                }"
            >
              {{ phoneValidation.mobile.message }}
            </p>
            <p
                v-if="mobileExistsMessage"
                :style="{
                  color: mobileExists ? '#e74c3c' : (checkingMobile ? '#3498db' : '#27ae60'),
                  fontSize: '0.85rem',
                  marginTop: '0.5rem'
                }"
            >
              {{ mobileExistsMessage }}
            </p>
          </div>

          <!-- Public Card URL Preview -->
          <div class="url-preview-container">
            <div class="url-preview-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
              <span>Public Card URL Preview:</span>
            </div>

            <div class="url-preview-box">
              <input
                  type="text"
                  :value="publicCardUrl"
                  readonly
                  class="url-preview-input"
                  @click="$event.target.select()"
              />
              <button
                  @click="copyPublicCardUrl"
                  class="url-copy-btn"
                  type="button"
                  title="Copy to clipboard"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>

              <a
                  v-if="contactForm.mobile && phoneValidation.mobile.isValid"
                  :href="publicCardUrl"
                  target="_blank"
                  class="url-open-btn"
                  title="Open in new tab"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            </div>
          </div>

          <!-- CONTACT FORM - WHATSAPP -->
          <div class="form-group">
            <label class="form-label">
              <input
                  type="checkbox"
                  v-model="whatsappSameAsMobile"
                  style="margin-right: 8px;"
              />
              WhatsApp (Same as Mobile)
            </label>
            <div class="phone-input-group">
              <CountryCodeDropdown
                  v-model="whatsappCountryCode"
                  :disabled="whatsappSameAsMobile"
              />
              <input
                  v-model="contactForm.whatsapp"
                  type="tel"
                  class="form-input"
                  placeholder="Enter WhatsApp number"
                  @input="handleContactWhatsApp"
                  :disabled="whatsappSameAsMobile"
                  :style="{ opacity: whatsappSameAsMobile ? 0.6 : 1 }"
              />
            </div>
            <p
                v-if="phoneValidation.whatsapp.message && !whatsappSameAsMobile"
                :style="{
                  color: phoneValidation.whatsapp.isValid ? '#27ae60' : '#e74c3c',
                  fontSize: '0.85rem',
                  marginTop: '0.5rem'
                }"
            >
              {{ phoneValidation.whatsapp.message }}
            </p>
          </div>

          <div class="form-group">
            <label class="form-label">WhatsApp Channel Link</label>
            <input
                v-model="contactForm.whatsappChannel"
                type="url"
                class="form-input"
                placeholder="https://whatsapp.com/channel/..."
            />
            <p style="color: #7f8c8d; font-size: 0.85rem; margin-top: 0.5rem;">
              📢 Enter your WhatsApp Channel invite link (optional)
            </p>
          </div>

          <div class="form-group">
            <label class="form-label">Email <span class="required">*</span></label>
            <input v-model="contactForm.email" type="email" class="form-input" required/>
          </div>

          <div class="form-group">
            <label class="form-label">Designation <span class="required">*</span></label>
            <input v-model="contactForm.designation" type="text" class="form-input" required/>
          </div>

          <div class="form-group">
            <label class="form-label">Company</label>
            <select v-model="contactForm.companyId" class="form-input">
              <option disabled value="">Select a company</option>
              <option
                  v-for="company in userCompanies"
                  :key="company.id"
                  :value="company.id"
              >
                {{ company.companyName }}
              </option>
            </select>
            <p v-if="userCompanies.length === 0" class="no-companies-note">
              ⚠️ You don't have any active companies. Please activate or create one first.
            </p>
          </div>

          <div class="form-group">
            <label class="form-label">Status <span class="required">*</span></label>
            <select v-model="contactForm.status" class="form-input" required>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button @click="saveContact" class="btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            Save Contact
          </button>
          <button @click="showContactForm = false" class="btn-secondary">Cancel</button>
        </div>
      </div>

      <!-- GROUP FORM (New form with specific fields) -->
      <div v-else-if="contactType === 'group'" class="form-container">
        <!-- Contact Photo Upload -->
        <div class="form-group full-width">
          <label class="form-label">Contact Photo</label>
          <div class="upload-area">
            <input
                type="file"
                @change="handlePhotoUpload"
                accept="image/*"
                id="group-photo-upload"
                class="file-input"
            />
            <label for="group-photo-upload" class="upload-label">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <span>{{ photoFileName || 'Click to upload photo' }}</span>
            </label>
            <div v-if="photoPreview" class="image-preview">
              <img :src="photoPreview" alt="Photo preview"/>
              <button @click="removePhoto" class="remove-image" type="button">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Group Contact Information -->
        <div class="form-grid">
          <!-- First Name -->
          <div class="form-group">
            <label class="form-label">First Name <span class="required">*</span></label>
            <input v-model="contactForm.firstName" type="text" class="form-input" required/>
          </div>

          <!-- Last Name -->
          <div class="form-group">
            <label class="form-label">Last Name <span class="required">*</span></label>
            <input v-model="contactForm.lastName" type="text" class="form-input" required/>
          </div>

          <!-- Mobile -->
          <div class="form-group">
            <label>Mobile <span style="color: red;">*</span></label>
            <div class="phone-input-group">
              <CountryCodeDropdown v-model="mobileCountryCode"/>
              <input
                  v-model="contactForm.mobile"
                  type="tel"
                  class="form-input"
                  placeholder="Enter mobile number"
                  @input="handleContactMobile"
                  required
              />
            </div>
            <p
                v-if="phoneValidation.mobile.message && !checkingMobile"
                :style="{
                  color: phoneValidation.mobile.isValid ? '#27ae60' : '#e74c3c',
                  fontSize: '0.85rem',
                  marginTop: '0.5rem'
                }"
            >
              {{ phoneValidation.mobile.message }}
            </p>
            <p
                v-if="mobileExistsMessage"
                :style="{
                  color: mobileExists ? '#e74c3c' : (checkingMobile ? '#3498db' : '#27ae60'),
                  fontSize: '0.85rem',
                  marginTop: '0.5rem'
                }"
            >
              {{ mobileExistsMessage }}
            </p>
          </div>

          <!-- WhatsApp Channel Link -->
          <div class="form-group">
            <label class="form-label">WhatsApp Channel Link</label>
            <input
                v-model="contactForm.whatsappChannel"
                type="url"
                class="form-input"
                placeholder="https://whatsapp.com/channel/..."
            />
            <p style="color: #7f8c8d; font-size: 0.85rem; margin-top: 0.5rem;">
              📢 Enter your WhatsApp Channel invite link (optional)
            </p>
          </div>

          <!-- Email -->
          <div class="form-group">
            <label class="form-label">Email <span class="required">*</span></label>
            <input v-model="contactForm.email" type="email" class="form-input" required/>
          </div>

          <!-- Company -->
          <div class="form-group">
            <label class="form-label">Company</label>
            <select v-model="contactForm.companyId" class="form-input">
              <option disabled value="">Select a company</option>
              <option
                  v-for="company in userCompanies"
                  :key="company.id"
                  :value="company.id"
              >
                {{ company.companyName }}
              </option>
            </select>
            <p v-if="userCompanies.length === 0" class="no-companies-note">
              ⚠️ You don't have any active companies. Please activate or create one first.
            </p>
          </div>

          <div class="form-group">
            <label class="form-label">Designation <span class="required">*</span></label>
            <input v-model="contactForm.designation" type="text" class="form-input" required/>
          </div>

          <!-- Status -->
          <div class="form-group">
            <label class="form-label">Status <span class="required">*</span></label>
            <select v-model="contactForm.status" class="form-input" required>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <!-- Group Form Actions -->
        <div class="form-actions">
          <button @click="saveContact" class="btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            Save Group Contact
          </button>
          <button @click="showContactForm = false" class="btn-secondary">Cancel</button>
        </div>
      </div>
    </div>

  </div>

  <!-- QR CODE POPUP -->
  <transition name="modal">
    <div v-if="showQrPopup" class="qr-popup-overlay">
      <div :class="['qr-popup', { 'dark-mode': isDarkMode }]">
        <button class="close-btn" @click="showQrPopup = false">×</button>

        <h3>QR Code – {{ qrName }}</h3>

        <div class="qr-container">
          <canvas ref="qrCanvas"></canvas>
        </div>

        <div class="qr-actions">
          <button class="btn-download" @click="downloadQr">⬇️ Download</button>
          <button class="btn-share" @click="sharePoster">📤 Share Poster</button>
        </div>
      </div>
    </div>
  </transition>

  <ImageCropperModal
      :show="showCropperModal"
      :image-src="tempImageSrc"
      :type="cropperType"
      :title="cropperType === 'photo' ? 'Crop Contact Photo' : 'Crop Image'"
      @cropped="handleCroppedImage"
      @close="showCropperModal = false; tempImageSrc = ''"
  />
</template>

<script setup>
import {computed, nextTick, onMounted, ref, watch, inject} from 'vue'; // Add inject
import { useRouter } from 'vue-router';
import api from '@/services/api.js';
import {API_BASE_URL, VITE_FRONTEND_URL, VITE_IMAGE_UPLOAD_URL} from '@/config.js';
import CountryCodeDropdown from '@/components/CountryCodeDropdown.vue';
import {isValidPhoneNumber, parsePhoneNumber} from 'libphonenumber-js';
import QRCode from "qrcode";
import ImageCropperModal from '@/components/ImageCropper.vue';

const router = useRouter();

// Inject dark mode state
const isDarkMode = inject('isDarkMode', ref(false));

const props = defineProps({
  activeTab: {
    type: String,
    required: true
  },
  contactCount: {
    type: Number,
    required: true
  },
  userLimits: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['contact-added', 'contact-deleted', 'contact-updated']);

const contactType = ref('individual');

// State
const contacts = ref([]);
const userCompanies = ref([]);
const showContactForm = ref(false);
const contactSearch = ref('');
const contactPage = ref(1);
const contactPerPage = ref(5);
const saving = ref(false);

const photoPreview = ref(null);
const photoFileName = ref('');

// Phone validation state
const telephoneCountryCode = ref('+1');
const mobileCountryCode = ref('+1');
const whatsappCountryCode = ref('+1');
const whatsappSameAsMobile = ref(true);

const mobileExistsMessage = ref('');
const mobileExists = ref(false);
const checkingMobile = ref(false);
let mobileCheckTimeout = null;

const showQrPopup = ref(false);
const qrCanvas = ref(null);
const qrUrl = ref("");
const qrName = ref("");

const showCropperModal = ref(false);
const tempImageSrc = ref('');
const cropperType = ref('photo');

const phoneValidation = ref({
  telephone: {isValid: false, message: ''},
  mobile: {isValid: false, message: ''},
  whatsapp: {isValid: false, message: ''}
});

const contactForm = ref({
  id: null,
  firstName: '',
  lastName: '',
  telephone: '',
  mobile: '',
  whatsapp: '',
  whatsappChannel: '',
  email: '',
  designation: '',
  companyId: '',
  photo: null,
  status: 'active',
  existingPhotoPath: null
});

// Computed
const filteredContacts = computed(() => {
  if (!contactSearch.value.trim()) return contacts.value;

  const q = contactSearch.value.toLowerCase();
  return contacts.value.filter(c =>
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
      c.mobile?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.designation?.toLowerCase().includes(q) ||
      c.Company?.companyName?.toLowerCase().includes(q)
  );
});

function openPublicCard(contact) {
  if (!contact?.mobile) return;

  const phone = contact.mobile.replace(/\D/g, '');

  if (contact.type === 'group') {
    router.push(`/card/${phone}?type=group`);
  } else {
    router.push(`/card/${phone}`);
  }
}



const paginatedContacts = computed(() => {
  const start = (contactPage.value - 1) * contactPerPage.value;
  return filteredContacts.value.slice(start, start + contactPerPage.value);
});

const contactTotalPages = computed(() =>
    Math.ceil(filteredContacts.value.length / contactPerPage.value)
);

const publicCardUrl = computed(() => {
  const baseUrl = VITE_FRONTEND_URL || 'https://tapmy.name/';

  if (!contactForm.value.mobile || !mobileCountryCode.value) {
    return `${baseUrl}/`;
  }

  const cleanMobile = contactForm.value.mobile.replace(/\D/g, '');
  if (!cleanMobile) {
    return `${baseUrl}/`;
  }

  const cleanCountryCode = mobileCountryCode.value.replace(/\+/g, '');
  const fullNumber = cleanCountryCode + cleanMobile;

  return `${baseUrl}/${fullNumber}`;
});

// Phone validation helper
function validatePhone(value, countryCode) {
  try {
    const digitsOnly = value.replace(/\D/g, '');
    const fullNumber = `${countryCode}${digitsOnly}`;

    if (isValidPhoneNumber(fullNumber)) {
      const phoneNumber = parsePhoneNumber(fullNumber);
      return {
        isValid: true,
        formatted: phoneNumber.formatInternational(),
        national: phoneNumber.formatNational(),
        e164: phoneNumber.format('E.164'),
        countryCode: phoneNumber.country,
        type: phoneNumber.getType()
      };
    }

    return {
      isValid: false,
      error: 'Invalid phone number'
    };
  } catch (error) {
    return {
      isValid: false,
      error: error.message
    };
  }
}

// Methods
async function loadContacts() {
  try {
    const token = localStorage.getItem('token');
    const res = await api.get('/dashboard/data', {
      headers: {Authorization: `Bearer ${token}`}
    });

    contacts.value = res.data.contacts || [];
    userCompanies.value = res.data.companies || [];
    emit('contact-added', contacts.value.length);
  } catch (err) {
    console.error('❌ Failed to load contacts:', err);
    alert('Failed to load contacts');
  }
}

function openContactForm() {
  if (props.contactCount >= props.userLimits.contactLimit) {
    alert(`⚠️ You've reached your contact limit (${props.userLimits.contactLimit})`);
    return;
  }
  resetForm();
  showContactForm.value = true;
}

function closeContactForm() {
  showContactForm.value = false;
  resetForm();
}

function resetForm() {
  contactType.value = 'individual'; // Add this line
  contactForm.value = {
    id: null,
    firstName: '',
    lastName: '',
    telephone: '',
    mobile: '',
    whatsapp: '',
    whatsappChannel: '',
    email: '',
    designation: '',
    companyId: '',
    photo: null,
    status: 'active',
    existingPhotoPath: null
  };

  photoPreview.value = null;
  photoFileName.value = '';

  telephoneCountryCode.value = '+1';
  mobileCountryCode.value = '+1';
  whatsappCountryCode.value = '+1';
  whatsappSameAsMobile.value = true;

  mobileExistsMessage.value = '';
  mobileExists.value = false;

  phoneValidation.value = {
    telephone: {isValid: false, message: ''},
    mobile: {isValid: false, message: ''},
    whatsapp: {isValid: false, message: ''}
  };
}

function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    // Read file and show cropper
    const reader = new FileReader();
    reader.onload = (e) => {
      tempImageSrc.value = e.target.result;
      cropperType.value = 'photo';
      showCropperModal.value = true;
    };
    reader.readAsDataURL(file);
  }
}

function handleCroppedImage(blob) {
  // Create a File object from the blob
  const fileName = `cropped_photo_${Date.now()}.jpg`;
  const croppedFile = new File([blob], fileName, {type: 'image/jpeg'});

  // Set the cropped file
  photoFileName.value = fileName;
  contactForm.value.photo = croppedFile;

  // Create preview URL
  photoPreview.value = URL.createObjectURL(blob);

  // Close cropper
  showCropperModal.value = false;
  tempImageSrc.value = '';

  // Clear file input
  const fileInput = document.getElementById('photo-upload');
  if (fileInput) fileInput.value = '';
}

function removePhoto() {
  contactForm.value.photo = null;
  contactForm.value.existingPhotoPath = null;
  photoPreview.value = null;
  photoFileName.value = '';
  tempImageSrc.value = ''; // ✅ Add this

  const fileInput = document.getElementById('photo-upload');
  if (fileInput) fileInput.value = '';
}

function handleContactTelephone(event) {
  const value = event.target.value.replace(/\D/g, '');
  contactForm.value.telephone = value;

  if (value.length > 0) {
    const validation = validatePhone(value, telephoneCountryCode.value);
    phoneValidation.value.telephone = {
      isValid: validation.isValid,
      message: validation.isValid
          ? `✅ Valid ${validation.type || 'phone'} number`
          : `⚠️ ${validation.error}`
    };
  } else {
    phoneValidation.value.telephone = {isValid: false, message: ''};
  }
}

function handleContactMobile(event) {
  const value = event.target.value.replace(/\D/g, '');
  contactForm.value.mobile = value;

  if (value.length > 0) {
    const validation = validatePhone(value, mobileCountryCode.value);
    phoneValidation.value.mobile = {
      isValid: validation.isValid,
      message: validation.isValid
          ? `✅ Valid ${validation.type || 'phone'} number`
          : `⚠️ ${validation.error}`
    };

    if (validation.isValid) {
      checkMobileDuplicate();
    }
  } else {
    phoneValidation.value.mobile = {isValid: false, message: ''};
    mobileExistsMessage.value = '';
    mobileExists.value = false;
  }

  // Sync WhatsApp if enabled
  if (whatsappSameAsMobile.value) {
    contactForm.value.whatsapp = value;
    whatsappCountryCode.value = mobileCountryCode.value;
    phoneValidation.value.whatsapp = phoneValidation.value.mobile;
  }
}

function handleContactWhatsApp(event) {
  const value = event.target.value.replace(/\D/g, '');
  contactForm.value.whatsapp = value;

  if (value.length > 0) {
    const validation = validatePhone(value, whatsappCountryCode.value);
    phoneValidation.value.whatsapp = {
      isValid: validation.isValid,
      message: validation.isValid
          ? `✅ Valid ${validation.type || 'phone'} number`
          : `⚠️ ${validation.error}`
    };
  } else {
    phoneValidation.value.whatsapp = {isValid: false, message: ''};
  }
}

async function checkMobileDuplicate() {
  clearTimeout(mobileCheckTimeout);

  const validation = validatePhone(contactForm.value.mobile, mobileCountryCode.value);

  if (!validation.isValid) {
    mobileExistsMessage.value = '';
    mobileExists.value = false;
    return;
  }

  mobileCheckTimeout = setTimeout(async () => {
    try {
      checkingMobile.value = true;
      mobileExistsMessage.value = '🔍 Checking availability...';

      const res = await api.post('/dashboard/check-contact-mobile', {
        mobile: validation.e164,
        contactId: contactForm.value.id || null
      });

      if (res.data.exists) {
        mobileExists.value = true;
        mobileExistsMessage.value = '❌ This mobile number is already registered!';
      } else {
        mobileExists.value = false;
        mobileExistsMessage.value = '✅ Number available';
      }
    } catch (err) {
      mobileExists.value = false;
      mobileExistsMessage.value = '⚠️ Error validating number.';
      console.error('Mobile check error:', err);
    } finally {
      checkingMobile.value = false;
    }
  }, 500);
}

function copyPublicCardUrl() {
  if (!contactForm.value.mobile) {
    alert('Please enter a mobile number first');
    return;
  }

  navigator.clipboard.writeText(publicCardUrl.value).then(() => {
    alert('✅ URL copied to clipboard!');
  }).catch(err => {
    console.error('Failed to copy:', err);
    alert('Failed to copy URL');
  });
}

function editContact(contact) {
  resetForm();

  // ✅ SET CONTACT TYPE FROM DATABASE
  contactType.value = contact.type || 'individual';

  // Extract just the number part (remove country code) for display
  const extractNumber = (fullNumber) => {
    if (!fullNumber) return '';
    try {
      const phoneNumber = parsePhoneNumber(fullNumber);
      return phoneNumber.nationalNumber;
    } catch {
      return fullNumber.replace(/\D/g, '');
    }
  };

  contactForm.value = {
    id: contact.id,
    firstName: contact.firstName,
    lastName: contact.lastName,
    telephone: extractNumber(contact.telephone),
    mobile: extractNumber(contact.mobile),
    whatsapp: extractNumber(contact.whatsapp || contact.mobile),
    whatsappChannel: contact.whatsappChannel || '',
    email: contact.email,
    designation: contact.designation,
    companyId: contact.companyId,
    status: contact.status,
    photo: null,
    existingPhotoPath: contact.photo
  };

  // Extract country codes
  try {
    if (contact.mobile) {
      const mobilePhone = parsePhoneNumber(contact.mobile);
      mobileCountryCode.value = `+${mobilePhone.countryCallingCode}`;
    }
    if (contact.telephone) {
      const telPhone = parsePhoneNumber(contact.telephone);
      telephoneCountryCode.value = `+${telPhone.countryCallingCode}`;
    }
    if (contact.whatsapp) {
      const whatsappPhone = parsePhoneNumber(contact.whatsapp);
      whatsappCountryCode.value = `+${whatsappPhone.countryCallingCode}`;
      whatsappSameAsMobile.value = contact.whatsapp === contact.mobile;
    } else {
      whatsappSameAsMobile.value = true;
      whatsappCountryCode.value = mobileCountryCode.value;
    }
  } catch (err) {
    console.error('Error parsing phone numbers:', err);
  }

  // Load photo preview
  if (contact.photo) {
    photoPreview.value = `${VITE_IMAGE_UPLOAD_URL}${contact.photo}`;
    photoFileName.value = contact.photo.split('/').pop();
  }

  showContactForm.value = true;
}

async function saveContact() {
  try {
    // Validate mobile (required)
    const mobileValidation = validatePhone(contactForm.value.mobile, mobileCountryCode.value);
    if (!mobileValidation.isValid) {
      alert(`Mobile number error: ${mobileValidation.error}`);
      return;
    }

    // Check if mobile exists
    if (mobileExists.value) {
      alert('❌ This mobile number is already registered.');
      return;
    }

    // Validate telephone (optional)
    let telephoneE164 = null;
    if (contactForm.value.telephone) {
      const telValidation = validatePhone(contactForm.value.telephone, telephoneCountryCode.value);
      if (!telValidation.isValid) {
        alert(`Telephone number error: ${telValidation.error}`);
        return;
      }
      telephoneE164 = telValidation.e164;
    }

    // Validate WhatsApp
    let whatsappE164 = mobileValidation.e164;
    if (!whatsappSameAsMobile.value && contactForm.value.whatsapp) {
      const whatsappValidation = validatePhone(contactForm.value.whatsapp, whatsappCountryCode.value);
      if (!whatsappValidation.isValid) {
        alert(`WhatsApp number error: ${whatsappValidation.error}`);
        return;
      }
      whatsappE164 = whatsappValidation.e164;
    }

    // Validate WhatsApp Channel URL
    if (contactForm.value.whatsappChannel && contactForm.value.whatsappChannel.trim()) {
      const urlPattern = /^https?:\/\/.+/i;
      if (!urlPattern.test(contactForm.value.whatsappChannel.trim())) {
        alert('WhatsApp Channel must be a valid URL starting with http:// or https://');
        return;
      }
    }

    saving.value = true;

    const formData = new FormData();
    formData.append('type', contactType.value); // 'individual' or 'group'

    formData.append('firstName', contactForm.value.firstName);
    formData.append('lastName', contactForm.value.lastName);
    formData.append('mobile', mobileValidation.e164);
    formData.append('whatsapp', whatsappE164);
    formData.append('whatsappChannel', contactForm.value.whatsappChannel || '');
    formData.append('email', contactForm.value.email);
    formData.append('designation', contactForm.value.designation);
    formData.append('companyId', contactForm.value.companyId || '');
    formData.append('status', contactForm.value.status);

    if (telephoneE164) {
      formData.append('telephone', telephoneE164);
    }

    if (contactForm.value.photo instanceof File) {
      formData.append('photo', contactForm.value.photo);
    }

    const isUpdate = !!contactForm.value.id;
    const url = isUpdate
        ? `${API_BASE_URL}/api/dashboard/contact/${contactForm.value.id}`
        : `${API_BASE_URL}/api/dashboard/contact`;
    const method = isUpdate ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });

    const data = await response.json();

    if (response.ok) {
      alert(isUpdate ? '✅ Contact updated successfully!' : '✅ Contact created successfully!');
      await loadContacts();
      closeContactForm();
    } else {
      alert('❌ Error: ' + (data.message || 'Failed to save contact'));
    }
  } catch (err) {
    console.error('❌ Save error:', err);
    alert('❌ Failed to save contact: ' + err.message);
  } finally {
    saving.value = false;
  }
}

async function deleteContact(contactId) {
  if (!confirm('Are you sure you want to delete this contact?')) return;

  try {
    const token = localStorage.getItem('token');
    await api.delete(`/dashboard/contact/${contactId}`, {
      headers: {Authorization: `Bearer ${token}`}
    });

    alert('✅ Contact deleted successfully!');
    await loadContacts();
  } catch (err) {
    console.error('❌ Delete error:', err);
    alert('❌ Failed to delete contact');
  }
}

async function saveToGoogleWallet(contact) {
  try {
    const cleanedPhone = contact.cardMobileNum || contact.mobile;
    const shareUrl = `${window.location.origin}/${cleanedPhone.replace(/\D/g, '')}`;

    const companyLogo = contact.Company?.logo
        ? (contact.Company.logo.startsWith('http')
            ? contact.Company.logo
            : `/uploads/photos/${contact.Company.logo.split('/').pop()}`)
        : '';

    const photo = contact.photo
        ? (contact.photo.startsWith('http')
            ? contact.photo
            : `/uploads/photos/${contact.photo.split('/').pop()}`)
        : '';

    const res = await api.post('/wallet/google/save-url', {
      contact: {
        name: `${contact.firstName} ${contact.lastName}`,
        firstName: contact.firstName,
        lastName: contact.lastName,
        phone: cleanedPhone,
        email: contact.email,
        designation: contact.designation || '',
        companyName: contact.Company?.companyName || '',
        companyLogo,
        photo,
        website: contact.Company?.website || '',
        address: contact.Company?.streetAddress || '',
        whatsapp: contact.whatsapp || '',
        shareUrl,
        googleReview: contact.Company?.googleReviews || '',
        tripAdvisor: contact.Company?.tripAdvisor || '',
      },
      objectIdSuffix: `contact_${contact.id}`,
    });

    if (res.data.saveUrl) {
      try {
        await api.post(`/wallet/google/track/${cleanedPhone.replace(/\D/g, '')}`, {
          userAgent: navigator.userAgent
        });
      } catch (trackErr) {
        console.warn('⚠️ Tracking failed:', trackErr);
      }

      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        window.location.href = res.data.saveUrl;
      } else {
        const walletWindow = window.open(res.data.saveUrl, '_blank');
        if (!walletWindow) {
          window.location.href = res.data.saveUrl;
        }
      }
    } else {
      alert('Could not generate Google Wallet link.');
    }
  } catch (err) {
    console.error('❌ Save to Google Wallet error:', err);
    alert(err.response?.data?.message || 'Failed to generate Google Wallet link');
  }
}

async function openQrPopup(contact) {
  const phone = contact.mobile.replace(/\D/g, "");

  qrUrl.value = `${VITE_FRONTEND_URL}/${phone}`;
  qrName.value = `${contact.firstName} ${contact.lastName}`;

  showQrPopup.value = true;

  // Wait until DOM renders the <canvas>
  await nextTick();

  await generatePlainQr();
}


async function generatePlainQr() {
  const canvas = qrCanvas.value;
  if (!canvas) return;

  await QRCode.toCanvas(canvas, qrUrl.value, {
    width: 280,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#ffffff"
    }
  });
}

async function sharePoster() {
  const qr = qrCanvas.value;
  if (!qr) return;

  const poster = document.createElement("canvas");
  poster.width = 600;
  poster.height = 900;
  const ctx = poster.getContext("2d");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, poster.width, poster.height);

  // Draw QR
  const qrSize = 350;
  const qrY = 120;

  ctx.drawImage(
      qr,
      poster.width / 2 - qrSize / 2,
      qrY,
      qrSize,
      qrSize
  );

  // Text
  ctx.fillStyle = "#000";
  ctx.font = "bold 32px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Scan to view my", poster.width / 2, 540);
  ctx.fillText("Digital Business Card", poster.width / 2, 590);

  // Convert to Blob
  poster.toBlob(async (blob) => {
    const file = new File([blob], `${qrName.value}-digital-card.png`, {type: "image/png"});

    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Digital Business Card",
          text: "Scan this QR to view my Digital Card!",
          files: [file],
        });
      } catch (err) {
        console.log("Share canceled or failed:", err);
      }
    } else {
      alert("Sharing not supported on this device.");
    }
  });
}

// Watch for mobile field changes to sync WhatsApp
watch([() => contactForm.value.mobile, () => mobileCountryCode.value], ([newMobile, newCode]) => {
  if (whatsappSameAsMobile.value && newMobile) {
    contactForm.value.whatsapp = newMobile;
    whatsappCountryCode.value = newCode;
    phoneValidation.value.whatsapp = phoneValidation.value.mobile;
  }
});

// Watch for tab changes
watch(() => props.activeTab, (newTab) => {
  if (newTab === 'contact' && contacts.value.length === 0) {
    loadContacts();
  }
});

// Load contacts when component mounts
onMounted(() => {
  if (props.activeTab === 'contact') {
    loadContacts();
  }
});
</script>

<style scoped>
/* URL Preview Container */
.url-preview-container {
  margin-top: 12px;
  padding: 12px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 2px solid #bae6fd;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.dark-mode .url-preview-container {
  background: linear-gradient(135deg, #1e2a3a 0%, #1a1626 100%);
  border-color: #2d2640;
}

.url-preview-container:hover {
  border-color: #7dd3fc;
  box-shadow: 0 4px 12px rgba(56, 189, 248, 0.15);
}

.dark-mode .url-preview-container:hover {
  border-color: #3d3555;
  box-shadow: 0 4px 12px rgba(61, 53, 85, 0.3);
}

/* URL Label */
.url-preview-label {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #0369a1;
}

.dark-mode .url-preview-label {
  color: #D4A574;
}

.url-preview-label svg {
  color: #0284c7;
}

.dark-mode .url-preview-label svg {
  color: #D4A574;
}

/* URL Preview Box */
.url-preview-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #e0f2fe;
}

.dark-mode .url-preview-box {
  background: #0f0d1a;
  border-color: #2d2640;
}

/* URL Input (readonly) */
.url-preview-input {
  flex: 1;
  border: none;
  background: transparent;
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  color: #0c4a6e;
  padding: 4px 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dark-mode .url-preview-input {
  color: #D4A574;
}

.url-preview-input:hover {
  background: #f0f9ff;
  border-radius: 6px;
}

.dark-mode .url-preview-input:hover {
  background: #1a1626;
}

.url-preview-input:focus {
  outline: none;
  background: #f0f9ff;
  border-radius: 6px;
}

.dark-mode .url-preview-input:focus {
  background: #1a1626;
}

/* Copy Button */
.url-copy-btn {
  padding: 6px 10px;
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.url-copy-btn:hover {
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
}

.url-copy-btn:active {
  transform: translateY(0);
}

/* Open in New Tab Button */
.url-open-btn {
  padding: 6px 10px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

.url-open-btn:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.url-open-btn:active {
  transform: translateY(0);
}

.confirm-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.dark-mode .confirm-header h3 {
  color: #e5e7eb;
}

.btn-close {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s;
}

.dark-mode .btn-close {
  color: #9ca3af;
}

.btn-close:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.dark-mode .btn-close:hover {
  background: #2d2640;
  color: #e5e7eb;
}

* {
  box-sizing: border-box;
}

.full-width {
  grid-column: 1 / -1;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.table-controls {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
}

.pagination {
  margin-top: 15px;
  display: flex;
  gap: 8px;
  justify-content: center;
}

.page-btn {
  padding: 6px 12px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
  border-radius: 4px;
  color: #0f172a;
}

.dark-mode .page-btn {
  background: #0f0d1a;
  border-color: #2d2640;
  color: #e5e7eb;
}

.page-btn.active {
  background: #1a472a;
  color: white;
  border-color: #1a472a;
}

.dark-mode .page-btn.active {
  background: #D4A574;
  color: #0f0d1a;
  border-color: #D4A574;
}

.pagination button {
  background: white;
  border: 1px solid #ccc;
  color: #0f172a;
}

.dark-mode .pagination button {
  background: #0f0d1a;
  border-color: #2d2640;
  color: #e5e7eb;
}

.pagination button:hover:not(:disabled) {
  background: #f8fafc;
}

.dark-mode .pagination button:hover:not(:disabled) {
  background: #2d2640;
}

.pagination button[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

.photo-thumb {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #ddd;
}

.dark-mode .photo-thumb {
  border-color: #3d3555;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.btn-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 6px 12px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
  white-space: nowrap;
}

.btn-action.view {
  background: #dbeafe;
  color: #1d4ed8;
}

.dark-mode .btn-action.view {
  background: #1e2a3a;
  color: #93c5fd;
}

.btn-action.view:hover {
  background: #bfdbfe;
}

.dark-mode .btn-action.view:hover {
  background: #2d2640;
}

.btn-action.edit {
  background: #fef3c7;
  color: #92400e;
}

.dark-mode .btn-action.edit {
  background: #3a2a1a;
  color: #fde68a;
}

.btn-action.edit:hover {
  background: #fde68a;
}

.dark-mode .btn-action.edit:hover {
  background: #4a3a2a;
}

.btn-action.delete {
  background: #fee2e2;
  color: #991b1b;
}

.dark-mode .btn-action.delete {
  background: #2a1a1a;
  color: #fca5a5;
}

.btn-action.delete:hover {
  background: #fecaca;
}

.dark-mode .btn-action.delete:hover {
  background: #3a1a1a;
}

.btn-action.qr {
  background: #e5e7eb;
  color: #374151;
}

.dark-mode .btn-action.qr {
  background: #2d2640;
  color: #d1d5db;
}

.btn-action.qr:hover {
  background: #d1d5db;
}

.dark-mode .btn-action.qr:hover {
  background: #3d3555;
}

.search-input {
  width: 100%;
  padding: 0.5rem 0.75rem 0.5rem 2rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  outline: none;
  transition: all 0.2s;
  background: white;
  color: #0f172a;
}

.dark-mode .search-input {
  background: #0f0d1a;
  border-color: #2d2640;
  color: #e5e7eb;
}

.dark-mode .search-input::placeholder {
  color: #6b7280;
}

.search-input:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.dark-mode .search-input:focus {
  border-color: #D4A574;
  box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.2);
}

/* Form Styles */
.form-group {
  margin-bottom: 1.25rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
  margin-bottom: 0.5rem;
}

.dark-mode .form-label {
  color: #9ca3af;
}

.form-input {
  width: 100%;
  padding: 0.625rem 0.875rem;
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  font-family: inherit;
  color: #0f172a;
}

.dark-mode .form-input {
  background: #0f0d1a;
  border-color: #2d2640;
  color: #e5e7eb;
}

.dark-mode .form-input::placeholder {
  color: #6b7280;
}

.form-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.dark-mode .form-input:focus {
  border-color: #D4A574;
  box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.2);
}

.form-input:disabled {
  background: #f1f5f9;
  color: #94a3b8;
  cursor: not-allowed;
}

.dark-mode .form-input:disabled {
  background: #1a1626;
  color: #6b7280;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.btn-primary:hover {
  background: #4338ca;
}

.btn-primary:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

.dark-mode .btn-primary:disabled {
  background: #2d2640;
  color: #6b7280;
}

.btn-action.wallet {
  background: #e0f2fe;
  color: #0369a1;
}

.dark-mode .btn-action.wallet {
  background: #1a2a36;
  color: #7dd3fc;
}

.btn-action.wallet:hover {
  background: #bae6fd;
}

.dark-mode .btn-action.wallet:hover {
  background: #22384a;
}

.btn-action.whatsapp {
  background: #dcfce7;
  color: #166534;
}

.dark-mode .btn-action.whatsapp {
  background: #1a3a23;
  color: #86efac;
}

.btn-action.whatsapp:hover {
  background: #bbf7d0;
}

.dark-mode .btn-action.whatsapp:hover {
  background: #224a33;
}

/* Content Card */
.content-card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.dark-mode.content-card {
  background: #1a1626;
  border-color: #2d2640;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}

.dark-mode .card-title {
  color: #e5e7eb;
}

/* Buttons */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #4338ca;
}

.btn-secondary {
  padding: 0.5rem 1.5rem;
  background: #f1f5f9;
  color: #475569;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.dark-mode .btn-secondary {
  background: #0f0d1a;
  color: #9ca3af;
  border: 1px solid #2d2640;
}

.btn-secondary:hover {
  background: #e2e8f0;
}

.dark-mode .btn-secondary:hover {
  background: #2d2640;
  color: #e5e7eb;
}

.link-button {
  background: none;
  border: none;
  color: #4f46e5;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s;
}

.dark-mode .link-button {
  color: #D4A574;
}

.link-button:hover {
  color: #4338ca;
}

.dark-mode .link-button:hover {
  color: #E5C4A0;
}

/* Table */
.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead tr {
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

.dark-mode .data-table thead tr {
  border-bottom: 1px solid #2d2640;
  background: #0f0d1a;
}

.data-table th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dark-mode .data-table th {
  color: #9ca3af;
}

.data-table tbody tr {
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.2s;
}

.dark-mode .data-table tbody tr {
  border-bottom: 1px solid #2d2640;
}

.data-table tbody tr:hover {
  background: #f8fafc;
}

.dark-mode .data-table tbody tr:hover {
  background: #2d2640;
}

.data-table td {
  padding: 1rem;
  font-size: 0.875rem;
  color: #0f172a;
}

.dark-mode .data-table td {
  color: #e5e7eb;
}

.link {
  color: #4f46e5;
  text-decoration: none;
}

.dark-mode .link {
  color: #818cf8;
}

.link:hover {
  text-decoration: underline;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
}

.status-badge.active {
  background: #dcfce7;
  color: #166534;
}

.dark-mode .status-badge.active {
  background: #1a3a23;
  color: #86efac;
}

.status-badge.inactive {
  background: #fee2e2;
  color: #991b1b;
}

.dark-mode .status-badge.inactive {
  background: #3a1a1a;
  color: #fca5a5;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}

.empty-icon {
  margin: 0 auto 1rem;
  color: #cbd5e1;
}

.dark-mode .empty-icon {
  color: #4b5563;
}

.empty-text {
  color: #64748b;
  margin-bottom: 1rem;
}

.dark-mode .empty-text {
  color: #9ca3af;
}

/* Form */
.form-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.required {
  color: #ef4444;
}

/* File Upload */
.upload-area {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.file-input {
  display: none;
}

.upload-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 2rem;
  background: white;
  border: 2px dashed #cbd5e1;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  color: #64748b;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.dark-mode .upload-label {
  background: #0f0d1a;
  border-color: #2d2640;
  color: #9ca3af;
}

.upload-label:hover {
  border-color: #4f46e5;
  background: #f8fafc;
}

.dark-mode .upload-label:hover {
  border-color: #D4A574;
  background: #1a1626;
}

.image-preview {
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 2px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.dark-mode .image-preview {
  border-color: #2d2640;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.375rem;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  color: #ef4444;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.dark-mode .remove-image {
  background: rgba(26, 22, 38, 0.95);
  color: #fca5a5;
}

.remove-image:hover {
  background: white;
  transform: scale(1.1);
}

.dark-mode .remove-image:hover {
  background: #1a1626;
}

/* QR Popup */
.qr-popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
}

.qr-popup {
  background: white;
  padding: 25px;
  border-radius: 12px;
  width: 330px;
  text-align: center;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.dark-mode.qr-popup {
  background: #1a1626;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.qr-popup h3 {
  color: #0f172a;
  margin-bottom: 1rem;
}

.dark-mode.qr-popup h3 {
  color: #e5e7eb;
}

.qr-container {
  margin: 20px 0;
}

.close-btn {
  position: absolute;
  top: 8px;
  right: 10px;
  border: none;
  background: none;
  font-size: 22px;
  cursor: pointer;
  color: #64748b;
}

.dark-mode .close-btn {
  color: #9ca3af;
}

.close-btn:hover {
  color: #0f172a;
}

.dark-mode .close-btn:hover {
  color: #e5e7eb;
}

.qr-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.qr-actions button {
  padding: 10px 15px;
  margin: 5px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-download {
  background: #3b82f6;
  color: white;
}

.btn-download:hover {
  background: #2563eb;
}

.btn-share {
  background: #10b981;
  color: white;
}

.btn-share:hover {
  background: #059669;
}

/* Contact Type Selector */
.contact-type-selector {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8f6f4 0%, #fff 100%);
  border-radius: 12px;
  border: 2px solid #e5e1dc;
  transition: all 0.3s ease;
}

.dark-mode .contact-type-selector {
  background: linear-gradient(135deg, #1a1626 0%, #0f0d1a 100%);
  border-color: #2d2640;
}

.radio-option {
  flex: 1;
  cursor: pointer;
  transition: all 0.3s ease;
}

.radio-option input[type="radio"] {
  display: none;
}

.radio-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: white;
  border: 2px solid #e5e1dc;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  color: #64748b;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.dark-mode .radio-label {
  background: #0f0d1a;
  border-color: #2d2640;
  color: #9ca3af;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.radio-label svg {
  color: #94a3b8;
  transition: all 0.3s ease;
}

.dark-mode .radio-label svg {
  color: #6b7280;
}

.radio-option input[type="radio"]:checked + .radio-label {
  background: linear-gradient(135deg, #5c4033 0%, #7d5a4f 100%);
  border-color: #5c4033;
  color: white;
  box-shadow: 0 4px 12px rgba(92, 64, 51, 0.25);
  transform: translateY(-2px);
}

.radio-option input[type="radio"]:checked + .radio-label svg {
  color: white;
}

.radio-option:hover .radio-label {
  border-color: #5c4033;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(92, 64, 51, 0.15);
}

.dark-mode .radio-option:hover .radio-label {
  border-color: #D4A574;
  box-shadow: 0 4px 8px rgba(212, 165, 116, 0.2);
}

/* Phone Input Group */
.phone-input-group {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

/* No companies note */
.no-companies-note {
  color: #e67e22;
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

.dark-mode .no-companies-note {
  color: #f39c12;
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.dark-mode .form-actions {
  border-top-color: #2d2640;
}

/* Small tablets (768px and below) */
@media (max-width: 768px) {
  .content-card {
    padding: 1rem;
    border-radius: 0.75rem;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .contact-type-selector {
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem;
  }

  .radio-label {
    padding: 0.875rem 1.25rem;
    font-size: 0.9rem;
  }

  .form-actions {
    flex-direction: column;
    gap: 0.75rem;
  }

  .form-actions button {
    width: 100%;
  }

  .upload-label {
    padding: 1.5rem 1rem;
  }

  .image-preview {
    width: 120px;
    height: 120px;
  }

  .table-controls {
    margin-bottom: 1rem;
  }

  .search-input {
    width: 100%;
    max-width: none;
  }

  /* Mobile Table Cards */
  .data-table thead {
    display: none;
  }

  .data-table,
  .data-table tbody,
  .data-table tr,
  .data-table td {
    display: block;
    width: 100%;
  }

  .data-table {
    border: 0;
    font-size: 0.875rem;
  }

  .data-table tbody {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .data-table tr {
    background: #ffffff;
    border: 1px solid #e5e1dc;
    border-radius: 12px;
    padding: 0;
    margin-bottom: 0;
    box-shadow: 0 2px 8px rgba(92, 64, 51, 0.08);
    transition: all 0.3s ease;
    overflow: hidden;
  }

  .dark-mode .data-table tr {
    background: #0f0d1a;
    border-color: #2d2640;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .data-table tr:hover {
    box-shadow: 0 4px 16px rgba(92, 64, 51, 0.12);
    transform: translateY(-2px);
  }

  .dark-mode .data-table tr:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
  }

  .data-table td:first-child {
    background: linear-gradient(135deg, #5c4033 0%, #7d5a4f 100%);
    color: white;
    padding: 1rem 1.25rem;
    font-weight: 700;
    font-size: 1.1rem;
    border: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .data-table td:first-child:before {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .data-table td {
    border: none;
    padding: 1rem 1.25rem;
    text-align: left;
    position: relative;
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 1rem;
    align-items: center;
    min-height: 50px;
    border-bottom: 1px solid #f5f3f0;
  }

  .dark-mode .data-table td {
    border-bottom-color: #2d2640;
  }

  .data-table td:last-child {
    border-bottom: none;
  }

  .data-table td:before {
    content: attr(data-label);
    font-weight: 600;
    font-size: 0.8rem;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    grid-column: 1;
  }

  .dark-mode .data-table td:before {
    color: #9ca3af;
  }

  .data-table td > * {
    grid-column: 2;
  }

  .photo-thumb {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    object-fit: cover;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    justify-self: start;
  }

  .dark-mode .photo-thumb {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .data-table td .link {
    color: #5c4033;
    text-decoration: none;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    transition: color 0.2s;
    word-break: break-all;
  }

  .dark-mode .data-table td .link {
    color: #D4A574;
  }

  .data-table td .link:hover {
    color: #7d5a4f;
    text-decoration: underline;
  }

  .dark-mode .data-table td .link:hover {
    color: #E5C4A0;
  }

  .data-table td.action-buttons {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    padding: 1.25rem;
    background: #f8f6f4;
    margin-top: 0.5rem;
  }

  .dark-mode .data-table td.action-buttons {
    background: #0a0a0a;
  }

  .data-table td.action-buttons:before {
    content: 'Actions';
    grid-column: 1 / -1;
    color: #5c4033;
    font-weight: 700;
    font-size: 0.85rem;
    margin-bottom: 0.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #e5e1dc;
  }

  .dark-mode .data-table td.action-buttons:before {
    color: #D4A574;
    border-bottom-color: #2d2640;
  }

  .data-table td.action-buttons .btn-action {
    width: 100%;
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    border-radius: 8px;
    border: none;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .btn-action.view {
    background: #3498db;
    color: white;
  }

  .btn-action.view:hover {
    background: #2980b9;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(52, 152, 219, 0.3);
  }

  .btn-action.qr {
    background: #9b59b6;
    color: white;
  }

  .btn-action.qr:hover {
    background: #8e44ad;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(155, 89, 182, 0.3);
  }

  .btn-action.edit {
    background: #f39c12;
    color: white;
  }

  .btn-action.edit:hover {
    background: #e67e22;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(243, 156, 18, 0.3);
  }

  .btn-action.delete {
    background: #e74c3c;
    color: white;
  }

  .btn-action.delete:hover {
    background: #c0392b;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(231, 76, 60, 0.3);
  }

  .data-table td .btn-primary {
    width: auto;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    justify-self: start;
  }

  .table-container {
    overflow-x: visible;
    margin: 0;
    padding: 0;
    border-radius: 0;
  }

  .pagination {
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
    margin-top: 1.5rem;
  }

  .page-btn {
    padding: 0.5rem 0.875rem;
    font-size: 0.875rem;
    min-width: 40px;
  }

  .phone-input-group {
    flex-direction: column;
    gap: 0.5rem;
  }

  .url-preview-container {
    margin-top: 0.75rem;
    padding: 1rem;
  }

  .url-preview-box {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .url-preview-input {
    font-size: 0.8rem;
    padding: 0.75rem;
  }

  .url-copy-btn,
  .url-open-btn {
    padding: 0.75rem;
    width: 100%;
  }

  .qr-popup {
    width: 90%;
    max-width: 320px;
    padding: 1.5rem;
  }

  .qr-actions {
    flex-direction: column;
    gap: 0.5rem;
  }

  .qr-actions button {
    width: 100%;
  }

  .empty-state {
    padding: 3rem 1.5rem;
  }
}

/* Mobile phones (480px and below) */
@media (max-width: 480px) {
  .content-card {
    padding: 0.875rem;
  }

  .card-title {
    font-size: 1rem;
  }

  .data-table tbody {
    gap: 1rem;
  }

  .data-table tr {
    border-radius: 10px;
  }

  .data-table td {
    padding: 0.875rem 1rem;
    grid-template-columns: 100px 1fr;
    gap: 0.75rem;
    font-size: 0.85rem;
  }

  .data-table td:first-child {
    padding: 0.875rem 1rem;
    font-size: 1rem;
  }

  .data-table td:before {
    font-size: 0.75rem;
  }

  .photo-thumb {
    width: 50px;
    height: 50px;
  }

  .data-table td.action-buttons {
    padding: 1rem;
    gap: 0.625rem;
  }

  .data-table td.action-buttons .btn-action {
    padding: 0.625rem 0.875rem;
    font-size: 0.8rem;
  }

  .form-label {
    font-size: 0.8rem;
  }

  .btn-primary,
  .btn-secondary {
    padding: 0.625rem 1rem;
    font-size: 0.875rem;
  }

  .upload-label {
    padding: 1.25rem 0.75rem;
    font-size: 0.875rem;
  }

  .image-preview {
    width: 100px;
    height: 100px;
  }

  .status-badge {
    font-size: 0.7rem;
    padding: 0.3rem 0.625rem;
  }

  .contact-type-selector {
    padding: 0.875rem;
  }

  .radio-label {
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
    gap: 0.5rem;
  }

  .radio-label svg {
    width: 18px;
    height: 18px;
  }
}

/* Touch-friendly improvements */
@media (hover: none) and (pointer: coarse) {
  .btn-action,
  .btn-close,
  .remove-image {
    min-width: 44px;
    min-height: 44px;
  }

  .table-container {
    -webkit-overflow-scrolling: touch;
  }

  input,
  select,
  textarea {
    font-size: 16px !important;
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Print styles */
@media print {
  .data-table thead {
    display: table-header-group;
  }

  .data-table,
  .data-table tbody,
  .data-table tr,
  .data-table td {
    display: table;
  }

  .data-table tr {
    display: table-row;
  }

  .data-table td {
    display: table-cell;
  }

  .btn-action,
  .pagination {
    display: none;
  }
}
</style>
