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
            <th>Google Wallet</th>
            <th>Apple Wallet</th>
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
              <img v-if="c.photo" :src="`${VITE_IMAGE_UPLOAD_URL}${c.photo}`" class="photo-thumb" alt="Contact Photo"/>
              <span v-else>-</span>
            </td>

            <!-- ── GOOGLE WALLET COLUMN ── -->
            <td data-label="Google Wallet">
              <div class="wallet-cell">
                <button class="btn-action wallet google" @click="saveToGoogleWallet(c)" title="Save to Google Wallet">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                       stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2" y="6" width="20" height="12" rx="2"/>
                    <path d="M16 12h4"/>
                    <circle cx="16" cy="12" r="1"/>
                  </svg>
                  G-Wallet
                </button>
                <button class="btn-action copy-link google-link" @click="copyGoogleWalletLink(c)"
                        title="Copy Google Wallet link to share">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                       stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                  G-Link
                </button>
              </div>
            </td>

            <!-- ── APPLE WALLET COLUMN ── -->
            <td data-label="Apple Wallet">
              <div class="wallet-cell">
                <button
                    class="btn-action wallet apple"
                    :class="{ 'apple-disabled': !appleConfigured }"
                    @click="saveToAppleWallet(c)"
                    :title="appleConfigured ? 'Download Apple Wallet pass' : 'Apple Wallet not configured yet'"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"/>
                    <path d="M12 8v8M8 12l4-4 4 4"/>
                  </svg>
                  A-Wallet
                </button>
                <button
                    class="btn-action copy-link apple-dl"
                    :class="{ 'apple-disabled': !appleConfigured }"
                    @click="copyAppleWalletLink(c)"
                    :title="appleConfigured ? 'Download .pkpass file to share manually' : 'Apple Wallet not configured yet'"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  A-File
                </button>
              </div>
            </td>

            <td class="action-buttons">
              <a :href="`/${c.mobile.replace(/\D/g, '')}`" target="_blank" rel="noopener" class="btn-action view">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                View
              </a>
              <button class="btn-action qr" @click="openQrPopup(c)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="5" height="5"/>
                  <rect x="16" y="3" width="5" height="5"/>
                  <rect x="3" y="16" width="5" height="5"/>
                  <path d="M16 16h2v2h-2zM20 16h1v5h-5v-1"/>
                </svg>
                QR
              </button>
              <button class="btn-action edit" @click="editContact(c)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 20h9"/>
                  <path d="M16.5 3.5l4 4L7 21H3v-4z"/>
                </svg>
                Edit
              </button>
              <button class="btn-action delete" @click="deleteContact(c.id)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-2 14H7L5 6"/>
                </svg>
                Delete
              </button>
            </td>
          </tr>
          </tbody>
        </table>

        <div class="pagination">
          <button @click="contactPage--" :disabled="contactPage === 1">Prev</button>
          <button
              v-for="page in contactTotalPages"
              :key="page"
              @click="contactPage = page"
              :class="['page-btn', { active: contactPage === page }]"
          >{{ page }}
          </button>
          <button @click="contactPage++" :disabled="contactPage === contactTotalPages">Next</button>
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

      <div class="contact-type-selector">
        <label class="radio-option">
          <input type="radio" v-model="contactType" value="individual" name="contactType"/>
          <span class="radio-label">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Individual
          </span>
        </label>
        <label class="radio-option">
          <input type="radio" v-model="contactType" value="group" name="contactType"/>
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

      <!-- INDIVIDUAL FORM -->
      <div v-if="contactType === 'individual'" class="form-container">
        <div class="form-group full-width">
          <label class="form-label">Contact Photo</label>
          <div class="upload-area">
            <input type="file" @change="handlePhotoUpload" accept="image/*" id="photo-upload" class="file-input"/>
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
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">First Name <span class="required">*</span></label>
            <input v-model="contactForm.firstName" type="text" class="form-input" required/>
          </div>
          <div class="form-group">
            <label class="form-label">Last Name <span class="required">*</span></label>
            <input v-model="contactForm.lastName" type="text" class="form-input" required/>
          </div>
          <div class="form-group">
            <label>Telephone</label>
            <div class="phone-input-group">
              <CountryCodeDropdown v-model="telephoneCountryCode"/>
              <input v-model="contactForm.telephone" type="tel" class="form-input" placeholder="Enter phone number"
                     @input="handleContactTelephone"/>
            </div>
            <p v-if="phoneValidation.telephone.message"
               :style="{ color: phoneValidation.telephone.isValid ? '#27ae60' : '#e74c3c', fontSize: '0.85rem', marginTop: '0.5rem' }">
              {{ phoneValidation.telephone.message }}</p>
          </div>
          <div class="form-group">
            <label>Mobile <span style="color: red;">*</span></label>
            <div class="phone-input-group">
              <CountryCodeDropdown v-model="mobileCountryCode"/>
              <input v-model="contactForm.mobile" type="tel" class="form-input" placeholder="Enter mobile number"
                     @input="handleContactMobile" required/>
            </div>
            <p v-if="phoneValidation.mobile.message && !checkingMobile"
               :style="{ color: phoneValidation.mobile.isValid ? '#27ae60' : '#e74c3c', fontSize: '0.85rem', marginTop: '0.5rem' }">
              {{ phoneValidation.mobile.message }}</p>
            <p v-if="mobileExistsMessage"
               :style="{ color: mobileExists ? '#e74c3c' : (checkingMobile ? '#3498db' : '#27ae60'), fontSize: '0.85rem', marginTop: '0.5rem' }">
              {{ mobileExistsMessage }}</p>
          </div>
          <div class="url-preview-container">
            <div class="url-preview-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
              <span>Public Card URL Preview:</span>
            </div>
            <div class="url-preview-box">
              <input type="text" :value="publicCardUrl" readonly class="url-preview-input"
                     @click="$event.target.select()"/>
              <button @click="copyPublicCardUrl" class="url-copy-btn" type="button" title="Copy to clipboard">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
              <a v-if="contactForm.mobile && phoneValidation.mobile.isValid" :href="publicCardUrl" target="_blank"
                 class="url-open-btn" title="Open in new tab">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label"><input type="checkbox" v-model="whatsappSameAsMobile" style="margin-right: 8px;"/>WhatsApp
              (Same as Mobile)</label>
            <div class="phone-input-group">
              <CountryCodeDropdown v-model="whatsappCountryCode" :disabled="whatsappSameAsMobile"/>
              <input v-model="contactForm.whatsapp" type="tel" class="form-input" placeholder="Enter WhatsApp number"
                     @input="handleContactWhatsApp" :disabled="whatsappSameAsMobile"
                     :style="{ opacity: whatsappSameAsMobile ? 0.6 : 1 }"/>
            </div>
            <p v-if="phoneValidation.whatsapp.message && !whatsappSameAsMobile"
               :style="{ color: phoneValidation.whatsapp.isValid ? '#27ae60' : '#e74c3c', fontSize: '0.85rem', marginTop: '0.5rem' }">
              {{ phoneValidation.whatsapp.message }}</p>
          </div>
          <div class="form-group">
            <label class="form-label">WhatsApp Channel Link</label>
            <input v-model="contactForm.whatsappChannel" type="url" class="form-input"
                   placeholder="https://whatsapp.com/channel/..."/>
            <p style="color: #7f8c8d; font-size: 0.85rem; margin-top: 0.5rem;">📢 Enter your WhatsApp Channel invite link
              (optional)</p>
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
              <option v-for="company in userCompanies" :key="company.id" :value="company.id">{{
                  company.companyName
                }}
              </option>
            </select>
            <p v-if="userCompanies.length === 0" class="no-companies-note">⚠️ You don't have any active companies.
              Please activate or create one first.</p>
          </div>
          <div class="form-group">
            <label class="form-label">Status <span class="required">*</span></label>
            <select v-model="contactForm.status" class="form-input" required>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
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

      <!-- GROUP FORM -->
      <div v-else-if="contactType === 'group'" class="form-container">
        <div class="form-group full-width">
          <label class="form-label">Contact Photo</label>
          <div class="upload-area">
            <input type="file" @change="handlePhotoUpload" accept="image/*" id="group-photo-upload" class="file-input"/>
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
        <div class="form-grid">
          <div class="form-group"><label class="form-label">First Name <span class="required">*</span></label><input
              v-model="contactForm.firstName" type="text" class="form-input" required/></div>
          <div class="form-group"><label class="form-label">Last Name <span class="required">*</span></label><input
              v-model="contactForm.lastName" type="text" class="form-input" required/></div>
          <div class="form-group">
            <label>Mobile <span style="color: red;">*</span></label>
            <div class="phone-input-group">
              <CountryCodeDropdown v-model="mobileCountryCode"/>
              <input v-model="contactForm.mobile" type="tel" class="form-input" placeholder="Enter mobile number"
                     @input="handleContactMobile" required/></div>
            <p v-if="phoneValidation.mobile.message && !checkingMobile"
               :style="{ color: phoneValidation.mobile.isValid ? '#27ae60' : '#e74c3c', fontSize: '0.85rem', marginTop: '0.5rem' }">
              {{ phoneValidation.mobile.message }}</p>
            <p v-if="mobileExistsMessage"
               :style="{ color: mobileExists ? '#e74c3c' : (checkingMobile ? '#3498db' : '#27ae60'), fontSize: '0.85rem', marginTop: '0.5rem' }">
              {{ mobileExistsMessage }}</p>
          </div>
          <div class="form-group"><label class="form-label">WhatsApp Channel Link</label><input
              v-model="contactForm.whatsappChannel" type="url" class="form-input"
              placeholder="https://whatsapp.com/channel/..."/>
            <p style="color: #7f8c8d; font-size: 0.85rem; margin-top: 0.5rem;">📢 Enter your WhatsApp Channel invite link
              (optional)</p></div>
          <div class="form-group"><label class="form-label">Email <span class="required">*</span></label><input
              v-model="contactForm.email" type="email" class="form-input" required/></div>
          <div class="form-group"><label class="form-label">Company</label><select v-model="contactForm.companyId"
                                                                                   class="form-input">
            <option disabled value="">Select a company</option>
            <option v-for="company in userCompanies" :key="company.id" :value="company.id">{{
                company.companyName
              }}
            </option>
          </select>
            <p v-if="userCompanies.length === 0" class="no-companies-note">⚠️ You don't have any active companies.</p>
          </div>
          <div class="form-group"><label class="form-label">Designation <span class="required">*</span></label><input
              v-model="contactForm.designation" type="text" class="form-input" required/></div>
          <div class="form-group"><label class="form-label">Status <span class="required">*</span></label><select
              v-model="contactForm.status" class="form-input" required>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select></div>
        </div>
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

  <!-- QR POPUP -->
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
import {computed, inject, nextTick, onMounted, ref, watch} from 'vue';
import {useRouter} from 'vue-router';
import api from '@/services/api.js';
import {API_BASE_URL, VITE_FRONTEND_URL, VITE_IMAGE_UPLOAD_URL} from '@/config.js';
import CountryCodeDropdown from '@/components/CountryCodeDropdown.vue';
import {isValidPhoneNumber, parsePhoneNumber} from 'libphonenumber-js';
import QRCode from "qrcode";
import ImageCropperModal from '@/components/ImageCropper.vue';

const router = useRouter();
const isDarkMode = inject('isDarkMode', ref(false));

const props = defineProps({
  activeTab: {type: String, required: true},
  contactCount: {type: Number, required: true},
  userLimits: {type: Object, required: true}
});

const emit = defineEmits(['contact-added', 'contact-deleted', 'contact-updated']);

// ── State ────────────────────────────────────────────────
const contactType = ref('individual');
const contacts = ref([]);
const userCompanies = ref([]);
const showContactForm = ref(false);
const contactSearch = ref('');
const contactPage = ref(1);
const contactPerPage = ref(5);
const saving = ref(false);
const photoPreview = ref(null);
const photoFileName = ref('');
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

// ── Apple Wallet state ───────────────────────────────────
const appleConfigured = ref(false);

const phoneValidation = ref({
  telephone: {isValid: false, message: ''},
  mobile: {isValid: false, message: ''},
  whatsapp: {isValid: false, message: ''}
});

const contactForm = ref({
  id: null, firstName: '', lastName: '', telephone: '', mobile: '',
  whatsapp: '', whatsappChannel: '', email: '', designation: '',
  companyId: '', photo: null, status: 'active', existingPhotoPath: null
});

// ── Computed ─────────────────────────────────────────────
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

const paginatedContacts = computed(() => {
  const start = (contactPage.value - 1) * contactPerPage.value;
  return filteredContacts.value.slice(start, start + contactPerPage.value);
});

const contactTotalPages = computed(() =>
    Math.ceil(filteredContacts.value.length / contactPerPage.value)
);

const publicCardUrl = computed(() => {
  const baseUrl = VITE_FRONTEND_URL || 'https://tapmy.name/';
  if (!contactForm.value.mobile || !mobileCountryCode.value) return `${baseUrl}/`;
  const cleanMobile = contactForm.value.mobile.replace(/\D/g, '');
  if (!cleanMobile) return `${baseUrl}/`;
  const cleanCountryCode = mobileCountryCode.value.replace(/\+/g, '');
  return `${baseUrl}/${cleanCountryCode}${cleanMobile}`;
});

// ── Helpers ───────────────────────────────────────────────
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
    return {isValid: false, error: 'Invalid phone number'};
  } catch (error) {
    return {isValid: false, error: error.message};
  }
}

// Build contact payload for wallet calls
function buildWalletContact(c) {
  const cleanedPhone = c.cardMobileNum || c.mobile;
  const shareUrl = `${window.location.origin}/${cleanedPhone.replace(/\D/g, '')}`;

  // Send full absolute URLs — same pattern that works for Google Wallet
  const companyLogo = c.Company?.logo
      ? (c.Company.logo.startsWith('http')
          ? c.Company.logo
          : `${VITE_IMAGE_UPLOAD_URL}${c.Company.logo}`)
      : '';

  const photo = c.photo
      ? (c.photo.startsWith('http')
          ? c.photo
          : `${VITE_IMAGE_UPLOAD_URL}${c.photo}`)
      : '';

  return {
    name: `${c.firstName} ${c.lastName}`,
    firstName: c.firstName,
    lastName: c.lastName,
    phone: cleanedPhone,
    email: c.email,
    designation: c.designation || '',
    companyName: c.Company?.companyName || '',
    companyLogo,
    photo,
    website: c.Company?.website || '',
    address: c.Company?.streetAddress || '',
    whatsapp: c.whatsapp || '',
    shareUrl,
    googleReview: c.Company?.googleReviews || '',
    tripAdvisor: c.Company?.tripAdvisor || '',
  };
}

// ── Load data ─────────────────────────────────────────────
async function loadContacts() {
  try {
    const res = await api.get('/dashboard/data', {
      headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
    });
    contacts.value = res.data.contacts || [];
    userCompanies.value = res.data.companies || [];
    emit('contact-added', contacts.value.length);
  } catch (err) {
    console.error('❌ Failed to load contacts:', err);
    alert('Failed to load contacts');
  }
}

async function checkAppleWalletStatus() {
  try {
    const res = await api.get('/wallet/apple/status');
    appleConfigured.value = res.data?.configured ?? false;
  } catch {
    appleConfigured.value = false;
  }
}

// ── Google Wallet ─────────────────────────────────────────
async function saveToGoogleWallet(contact) {
  try {
    const walletContact = buildWalletContact(contact);
    const res = await api.post('/wallet/google/save-url', {
      contact: walletContact,
      objectIdSuffix: `contact_${contact.id}`,
    });

    if (res.data.saveUrl) {
      try {
        await api.post(`/wallet/google/track/${walletContact.phone.replace(/\D/g, '')}`, {
          userAgent: navigator.userAgent
        });
      } catch (trackErr) {
        console.warn('⚠️ Tracking failed:', trackErr);
      }

      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        window.location.href = res.data.saveUrl;
      } else {
        const w = window.open(res.data.saveUrl, '_blank');
        if (!w) window.location.href = res.data.saveUrl;
      }
    } else {
      alert('Could not generate Google Wallet link.');
    }
  } catch (err) {
    console.error('❌ Google Wallet error:', err);
    alert(err.response?.data?.message || 'Failed to generate Google Wallet link');
  }
}

async function copyGoogleWalletLink(contact) {
  try {
    const walletContact = buildWalletContact(contact);
    const res = await api.post('/wallet/google/save-url', {
      contact: walletContact,
      objectIdSuffix: `contact_${contact.id}`,
    });

    if (res.data.saveUrl) {
      await navigator.clipboard.writeText(res.data.saveUrl);
      alert('✅ Google Wallet link copied! Send it to anyone — they tap to add to their wallet.');
    } else {
      alert('❌ Could not generate Google Wallet link.');
    }
  } catch (err) {
    console.error('❌ Copy G-Wallet Link error:', err);
    alert(err.response?.data?.message || '❌ Failed to generate Google Wallet link');
  }
}

// ── Apple Wallet ──────────────────────────────────────────
// FIX: use api axios instance with responseType blob instead of raw fetch
async function saveToAppleWallet(contact) {
  if (!appleConfigured.value) {
    alert('⏳ Apple Wallet is not configured yet.\nWaiting for Apple Developer credentials from the client.');
    return;
  }

  try {
    const walletContact = buildWalletContact(contact);

    const response = await api.post('/wallet/apple/pass', {contact: walletContact}, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data], {type: 'application/vnd.apple.pkpass'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(contact.firstName || 'card')}_${(contact.lastName || '')}.pkpass`.replace(/\s+/g, '_');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

  } catch (err) {
    console.error('❌ Apple Wallet error:', err);

    // ✅ Unwrap the blob to get the real server error message
    if (err.response?.data instanceof Blob) {
      try {
        const text = await err.response.data.text();
        console.error('🔴 Server error response:', text);
        const json = JSON.parse(text);
        // Show the full details including stack trace
        alert(`❌ Server Error:\n\n${json.message || 'Unknown error'}\n\n${json.stack || ''}`);
      } catch (parseErr) {
        const raw = await err.response?.data?.text?.() || 'Could not read response';
        alert(`❌ Raw server error:\n\n${raw}`);
      }
    } else {
      alert(`❌ ${err.response?.data?.message || err.message}`);
    }
  }
}

async function copyAppleWalletLink(contact) {
  if (!appleConfigured.value) {
    alert('⏳ Apple Wallet is not configured yet.\nWaiting for Apple Developer credentials from the client.');
    return;
  }

  try {
    const walletContact = buildWalletContact(contact);

    const response = await api.post('/wallet/apple/pass', { contact: walletContact }, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data], { type: 'application/vnd.apple.pkpass' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${contact.firstName || 'card'}_${contact.lastName || ''}_wallet.pkpass`.replace(/\s+/g, '_');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

  } catch (err) {
    console.error('❌ Apple Wallet download error:', err);

    if (err.response?.data instanceof Blob) {
      try {
        const text = await err.response.data.text();
        const json = JSON.parse(text);
        alert(`❌ ${json.message || 'Failed to download pass'}`);
      } catch {
        alert('❌ Failed to download Apple Wallet pass');
      }
    } else {
      alert(`❌ ${err.response?.data?.message || err.message}`);
    }
  }
}

// ── Form handlers ──────────────────────────────────────────
function resetForm() {
  contactType.value = 'individual';
  contactForm.value = {
    id: null, firstName: '', lastName: '', telephone: '', mobile: '',
    whatsapp: '', whatsappChannel: '', email: '', designation: '',
    companyId: '', photo: null, status: 'active', existingPhotoPath: null
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
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file');
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    alert('Image size should be less than 5MB');
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    tempImageSrc.value = e.target.result;
    cropperType.value = 'photo';
    showCropperModal.value = true;
  };
  reader.readAsDataURL(file);
}

function handleCroppedImage(blob) {
  const fileName = `cropped_photo_${Date.now()}.jpg`;
  const croppedFile = new File([blob], fileName, {type: 'image/jpeg'});
  photoFileName.value = fileName;
  contactForm.value.photo = croppedFile;
  photoPreview.value = URL.createObjectURL(blob);
  showCropperModal.value = false;
  tempImageSrc.value = '';
  const fileInput = document.getElementById('photo-upload');
  if (fileInput) fileInput.value = '';
}

function removePhoto() {
  contactForm.value.photo = null;
  contactForm.value.existingPhotoPath = null;
  photoPreview.value = null;
  photoFileName.value = '';
  tempImageSrc.value = '';
  const fileInput = document.getElementById('photo-upload');
  if (fileInput) fileInput.value = '';
}

function handleContactTelephone(event) {
  const value = event.target.value.replace(/\D/g, '');
  contactForm.value.telephone = value;
  if (value.length > 0) {
    const v = validatePhone(value, telephoneCountryCode.value);
    phoneValidation.value.telephone = {
      isValid: v.isValid,
      message: v.isValid ? `✅ Valid ${v.type || 'phone'} number` : `⚠️ ${v.error}`
    };
  } else {
    phoneValidation.value.telephone = {isValid: false, message: ''};
  }
}

function handleContactMobile(event) {
  const value = event.target.value.replace(/\D/g, '');
  contactForm.value.mobile = value;
  if (value.length > 0) {
    const v = validatePhone(value, mobileCountryCode.value);
    phoneValidation.value.mobile = {
      isValid: v.isValid,
      message: v.isValid ? `✅ Valid ${v.type || 'phone'} number` : `⚠️ ${v.error}`
    };
    if (v.isValid) checkMobileDuplicate();
  } else {
    phoneValidation.value.mobile = {isValid: false, message: ''};
    mobileExistsMessage.value = '';
    mobileExists.value = false;
  }
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
    const v = validatePhone(value, whatsappCountryCode.value);
    phoneValidation.value.whatsapp = {
      isValid: v.isValid,
      message: v.isValid ? `✅ Valid ${v.type || 'phone'} number` : `⚠️ ${v.error}`
    };
  } else {
    phoneValidation.value.whatsapp = {isValid: false, message: ''};
  }
}

async function checkMobileDuplicate() {
  clearTimeout(mobileCheckTimeout);
  const v = validatePhone(contactForm.value.mobile, mobileCountryCode.value);
  if (!v.isValid) {
    mobileExistsMessage.value = '';
    mobileExists.value = false;
    return;
  }
  mobileCheckTimeout = setTimeout(async () => {
    try {
      checkingMobile.value = true;
      mobileExistsMessage.value = '🔍 Checking availability...';
      const res = await api.post('/dashboard/check-contact-mobile', {
        mobile: v.e164,
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
  navigator.clipboard.writeText(publicCardUrl.value)
      .then(() => alert('✅ URL copied to clipboard!'))
      .catch(() => alert('Failed to copy URL'));
}

function editContact(contact) {
  resetForm();
  contactType.value = contact.type || 'individual';
  const extractNumber = (fullNumber) => {
    if (!fullNumber) return '';
    try {
      return parsePhoneNumber(fullNumber).nationalNumber;
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
  try {
    if (contact.mobile) {
      const m = parsePhoneNumber(contact.mobile);
      mobileCountryCode.value = `+${m.countryCallingCode}`;
    }
    if (contact.telephone) {
      const t = parsePhoneNumber(contact.telephone);
      telephoneCountryCode.value = `+${t.countryCallingCode}`;
    }
    if (contact.whatsapp) {
      const w = parsePhoneNumber(contact.whatsapp);
      whatsappCountryCode.value = `+${w.countryCallingCode}`;
      whatsappSameAsMobile.value = contact.whatsapp === contact.mobile;
    } else {
      whatsappSameAsMobile.value = true;
      whatsappCountryCode.value = mobileCountryCode.value;
    }
  } catch (err) {
    console.error('Error parsing phone numbers:', err);
  }
  if (contact.photo) {
    photoPreview.value = `${VITE_IMAGE_UPLOAD_URL}${contact.photo}`;
    photoFileName.value = contact.photo.split('/').pop();
  }
  showContactForm.value = true;
}

async function saveContact() {
  try {
    const mobileValidation = validatePhone(contactForm.value.mobile, mobileCountryCode.value);
    if (!mobileValidation.isValid) {
      alert(`Mobile number error: ${mobileValidation.error}`);
      return;
    }
    if (mobileExists.value) {
      alert('❌ This mobile number is already registered.');
      return;
    }

    let telephoneE164 = null;
    if (contactForm.value.telephone) {
      const telV = validatePhone(contactForm.value.telephone, telephoneCountryCode.value);
      if (!telV.isValid) {
        alert(`Telephone number error: ${telV.error}`);
        return;
      }
      telephoneE164 = telV.e164;
    }

    let whatsappE164 = mobileValidation.e164;
    if (!whatsappSameAsMobile.value && contactForm.value.whatsapp) {
      const wV = validatePhone(contactForm.value.whatsapp, whatsappCountryCode.value);
      if (!wV.isValid) {
        alert(`WhatsApp number error: ${wV.error}`);
        return;
      }
      whatsappE164 = wV.e164;
    }

    if (contactForm.value.whatsappChannel?.trim() && !/^https?:\/\/.+/i.test(contactForm.value.whatsappChannel.trim())) {
      alert('WhatsApp Channel must be a valid URL starting with http:// or https://');
      return;
    }

    saving.value = true;
    const formData = new FormData();
    formData.append('type', contactType.value);
    formData.append('firstName', contactForm.value.firstName);
    formData.append('lastName', contactForm.value.lastName);
    formData.append('mobile', mobileValidation.e164);
    formData.append('whatsapp', whatsappE164);
    formData.append('whatsappChannel', contactForm.value.whatsappChannel || '');
    formData.append('email', contactForm.value.email);
    formData.append('designation', contactForm.value.designation);
    formData.append('companyId', contactForm.value.companyId || '');
    formData.append('status', contactForm.value.status);
    if (telephoneE164) formData.append('telephone', telephoneE164);
    if (contactForm.value.photo instanceof File) formData.append('photo', contactForm.value.photo);

    const isUpdate = !!contactForm.value.id;
    const url = isUpdate
        ? `${API_BASE_URL}/api/dashboard/contact/${contactForm.value.id}`
        : `${API_BASE_URL}/api/dashboard/contact`;

    const response = await fetch(url, {
      method: isUpdate ? 'PUT' : 'POST',
      headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`},
      body: formData
    });
    const data = await response.json();

    if (response.ok) {
      alert(isUpdate ? '✅ Contact updated successfully!' : '✅ Contact created successfully!');
      await loadContacts();
      showContactForm.value = false;
      resetForm();
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
    await api.delete(`/dashboard/contact/${contactId}`, {
      headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
    });
    alert('✅ Contact deleted successfully!');
    await loadContacts();
  } catch (err) {
    alert('❌ Failed to delete contact');
  }
}

async function openQrPopup(contact) {
  const phone = contact.mobile.replace(/\D/g, "");
  qrUrl.value = `${VITE_FRONTEND_URL}/${phone}`;
  qrName.value = `${contact.firstName} ${contact.lastName}`;
  showQrPopup.value = true;
  await nextTick();
  await QRCode.toCanvas(qrCanvas.value, qrUrl.value, {
    width: 280, margin: 2,
    color: {dark: "#000000", light: "#ffffff"}
  });
}

function downloadQr() {
  const canvas = qrCanvas.value;
  if (!canvas) return;
  const link = document.createElement('a');
  link.download = `${qrName.value}-qr.png`;
  link.href = canvas.toDataURL();
  link.click();
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
  ctx.drawImage(qr, poster.width / 2 - 175, 120, 350, 350);
  ctx.fillStyle = "#000";
  ctx.font = "bold 32px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Scan to view my", poster.width / 2, 540);
  ctx.fillText("Digital Business Card", poster.width / 2, 590);
  poster.toBlob(async (blob) => {
    const file = new File([blob], `${qrName.value}-digital-card.png`, {type: "image/png"});
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Digital Business Card",
          text: "Scan this QR to view my Digital Card!",
          files: [file]
        });
      } catch (err) {
        console.log("Share canceled:", err);
      }
    } else {
      alert("Sharing not supported on this device.");
    }
  });
}

// ── Watchers ──────────────────────────────────────────────
watch([() => contactForm.value.mobile, () => mobileCountryCode.value], ([newMobile, newCode]) => {
  if (whatsappSameAsMobile.value && newMobile) {
    contactForm.value.whatsapp = newMobile;
    whatsappCountryCode.value = newCode;
    phoneValidation.value.whatsapp = phoneValidation.value.mobile;
  }
});

watch(() => props.activeTab, (newTab) => {
  if (newTab === 'contact' && contacts.value.length === 0) loadContacts();
});

// ── Lifecycle ─────────────────────────────────────────────
onMounted(() => {
  if (props.activeTab === 'contact') loadContacts();
  checkAppleWalletStatus();
});
</script>

<style scoped>
/* ── Wallet cell layout ──────────────────────────────────── */
.wallet-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* Google Wallet button */
.btn-action.google {
  background: #e8f5e9;
  color: #1b5e20;
  border: 1px solid #a5d6a7;
}

.btn-action.google:hover {
  background: #4caf50;
  color: #fff;
  border-color: #4caf50;
}

.dark-mode .btn-action.google {
  background: #1a2e1a;
  color: #81c784;
  border-color: #2e4a2e;
}

.dark-mode .btn-action.google:hover {
  background: #2e7d32;
  color: #fff;
}

/* Google Wallet link button */
.btn-action.google-link {
  background: #e3f2fd;
  color: #0d47a1;
  border: 1px solid #90caf9;
}

.btn-action.google-link:hover {
  background: #1565c0;
  color: #fff;
  border-color: #1565c0;
}

.dark-mode .btn-action.google-link {
  background: #1a2535;
  color: #64b5f6;
  border-color: #2a3f5f;
}

.dark-mode .btn-action.google-link:hover {
  background: #1565c0;
  color: #fff;
}

/* Apple Wallet button */
.btn-action.apple {
  background: #000;
  color: #fff;
  border: 1px solid #333;
}

.btn-action.apple:hover:not(.apple-disabled) {
  background: #333;
  color: #fff;
}

.dark-mode .btn-action.apple {
  background: #1a1a1a;
  color: #e5e7eb;
  border-color: #444;
}

.dark-mode .btn-action.apple:hover:not(.apple-disabled) {
  background: #333;
}

/* Apple Wallet file download button */
.btn-action.apple-dl {
  background: #f5f5f5;
  color: #1a1a1a;
  border: 1px solid #ccc;
}

.btn-action.apple-dl:hover:not(.apple-disabled) {
  background: #1a1a1a;
  color: #fff;
  border-color: #1a1a1a;
}

.dark-mode .btn-action.apple-dl {
  background: #2a2a2a;
  color: #ccc;
  border-color: #555;
}

.dark-mode .btn-action.apple-dl:hover:not(.apple-disabled) {
  background: #444;
  color: #fff;
}

/* Apple Wallet link button */
.btn-action.apple-link {
  background: #f5f5f5;
  color: #1a1a1a;
  border: 1px solid #ccc;
}

.btn-action.apple-link:hover:not(.apple-disabled) {
  background: #555;
  color: #fff;
  border-color: #555;
}

.dark-mode .btn-action.apple-link {
  background: #2a2a2a;
  color: #ccc;
  border-color: #555;
}

.dark-mode .btn-action.apple-link:hover:not(.apple-disabled) {
  background: #444;
  color: #fff;
}

/* Disabled state for Apple buttons when not configured */
.btn-action.apple-disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Copy link base style */
.btn-action.copy-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

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

.url-preview-input {
  flex: 1;
  border: none;
  background: transparent;
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  color: #0c4a6e;
  padding: 4px 8px;
  cursor: pointer;
}

.dark-mode .url-preview-input {
  color: #D4A574;
}

.url-copy-btn {
  padding: 6px 10px;
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.url-open-btn {
  padding: 6px 10px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  text-decoration: none;
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
}

.dark-mode .btn-close {
  color: #9ca3af;
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

.pagination button {
  background: white;
  border: 1px solid #ccc;
  color: #0f172a;
  padding: 6px 12px;
  cursor: pointer;
  border-radius: 4px;
}

.dark-mode .pagination button {
  background: #0f0d1a;
  border-color: #2d2640;
  color: #e5e7eb;
}

.pagination button:disabled {
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

.btn-action.view:hover {
  background: #bfdbfe;
}

.btn-action.edit {
  background: #fef3c7;
  color: #92400e;
}

.btn-action.edit:hover {
  background: #fde68a;
}

.btn-action.delete {
  background: #fee2e2;
  color: #991b1b;
}

.btn-action.delete:hover {
  background: #fecaca;
}

.btn-action.qr {
  background: #e5e7eb;
  color: #374151;
}

.btn-action.qr:hover {
  background: #d1d5db;
}

.btn-action.whatsapp {
  background: #dcfce7;
  color: #166534;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
}

.btn-action.whatsapp:hover {
  background: #bbf7d0;
}

.search-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  outline: none;
  background: white;
  color: #0f172a;
}

.dark-mode .search-input {
  background: #0f0d1a;
  border-color: #2d2640;
  color: #e5e7eb;
}

.form-group {
  display: flex;
  flex-direction: column;
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
  color: #0f172a;
}

.dark-mode .form-input {
  background: #0f0d1a;
  border-color: #2d2640;
  color: #e5e7eb;
}

.form-input:focus {
  outline: none;
  border-color: #4f46e5;
}

.form-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
}

.btn-primary:hover {
  background: #4338ca;
}

.btn-primary:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

.btn-secondary {
  padding: 0.5rem 1.5rem;
  background: #f1f5f9;
  color: #475569;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
}

.dark-mode .btn-secondary {
  background: #0f0d1a;
  color: #9ca3af;
  border: 1px solid #2d2640;
}

.content-card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  padding: 1.5rem;
}

.dark-mode.content-card {
  background: #1a1626;
  border-color: #2d2640;
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
}

.status-badge.active {
  background: #dcfce7;
  color: #166534;
}

.status-badge.inactive {
  background: #fee2e2;
  color: #991b1b;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}

.empty-icon {
  margin: 0 auto 1rem;
  color: #cbd5e1;
}

.empty-text {
  color: #64748b;
  margin-bottom: 1rem;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.required {
  color: #ef4444;
}

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
  color: #64748b;
}

.dark-mode .upload-label {
  background: #0f0d1a;
  border-color: #2d2640;
  color: #9ca3af;
}

.image-preview {
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 2px solid #e2e8f0;
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
}

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
}

.dark-mode.qr-popup {
  background: #1a1626;
}

.qr-popup h3 {
  color: #0f172a;
  margin-bottom: 1rem;
}

.dark-mode.qr-popup h3 {
  color: #e5e7eb;
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

.qr-container {
  margin: 20px 0;
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
}

.btn-download {
  background: #3b82f6;
  color: white;
}

.btn-share {
  background: #10b981;
  color: white;
}

.contact-type-selector {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8f6f4 0%, #fff 100%);
  border-radius: 12px;
  border: 2px solid #e5e1dc;
}

.dark-mode .contact-type-selector {
  background: linear-gradient(135deg, #1a1626 0%, #0f0d1a 100%);
  border-color: #2d2640;
}

.radio-option {
  flex: 1;
  cursor: pointer;
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
  color: #64748b;
}

.dark-mode .radio-label {
  background: #0f0d1a;
  border-color: #2d2640;
  color: #9ca3af;
}

.radio-option input[type="radio"]:checked + .radio-label {
  background: linear-gradient(135deg, #5c4033 0%, #7d5a4f 100%);
  border-color: #5c4033;
  color: white;
}

.phone-input-group {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.no-companies-note {
  color: #e67e22;
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.dark-mode .form-actions {
  border-top-color: #2d2640;
}

@media (max-width: 768px) {
  .wallet-cell {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .data-table thead {
    display: none;
  }

  .data-table, .data-table tbody, .data-table tr, .data-table td {
    display: block;
    width: 100%;
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
    overflow: hidden;
  }

  .dark-mode .data-table tr {
    background: #0f0d1a;
    border-color: #2d2640;
  }

  .data-table td {
    border: none;
    padding: 1rem 1.25rem;
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 1rem;
    align-items: center;
    border-bottom: 1px solid #f5f3f0;
  }

  .dark-mode .data-table td {
    border-bottom-color: #2d2640;
  }

  .data-table td:before {
    content: attr(data-label);
    font-weight: 600;
    font-size: 0.8rem;
    color: #64748b;
    text-transform: uppercase;
  }

  .data-table td.action-buttons {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    padding: 1.25rem;
    background: #f8f6f4;
  }

  .dark-mode .data-table td.action-buttons {
    background: #0a0a0a;
  }

  .data-table td.action-buttons .btn-action {
    width: 100%;
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    border-radius: 8px;
    font-weight: 600;
    justify-content: center;
  }

  .contact-type-selector {
    flex-direction: column;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
