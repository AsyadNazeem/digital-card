<template>
  <div class="dashboard-wrapper">
    <!-- Header -->
    <header class="dashboard-header">
      <div class="header-content">
        <h1 class="header-title">Dashboard</h1>
        <div class="user-info">
          <span class="welcome-text">Welcome back</span>
          <div class="user-avatar">A</div>
          <div><button @click="logout" class="logout-btn">Logout</button></div>
        </div>
      </div>
    </header>

    <div class="dashboard-container">
      <!-- Tabs -->
      <div class="tabs-container">
        <button
            @click="activeTab = 'company'"
            :class="['tab-button', { active: activeTab === 'company' }]"
        >
          <svg class="tab-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
            <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"></path>
          </svg>
          Company Details
        </button>
        <button
            @click="activeTab = 'contact'"
            :class="['tab-button', { active: activeTab === 'contact' }]"
        >
          <svg class="tab-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          Contact Details
        </button>
      </div>

      <!-- COMPANY TAB -->
      <div v-if="activeTab === 'company'" class="content-card">
        <div v-if="!showCompanyForm">
          <div class="card-header">
            <h2 class="card-title">Company Information</h2>
            <button @click="showCompanyForm = true" class="btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              {{ company ? 'Edit Company' : 'Add Company' }}
            </button>
          </div>

          <div v-if="company" class="table-container">
            <table class="data-table">
              <thead>
              <tr>
                <th>Heading</th>
                <th>Company Name</th>
                <th>Website</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>{{ company.heading }}</td>
                <td>{{ company.companyName }}</td>
                <td>
                  <a :href="company.website" target="_blank" class="link">{{ company.website }}</a>
                </td>
                <td>{{ company.email }}</td>
                <td>
                  <span :class="['status-badge', company.status]">{{ company.status }}</span>
                </td>
              </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="empty-state">
            <svg class="empty-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
              <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"></path>
            </svg>
            <p class="empty-text">No company data found</p>
            <button @click="showCompanyForm = true" class="link-button">Add your first company</button>
          </div>
        </div>

        <!-- Company Form -->
        <div v-else>
          <div class="card-header">
            <h2 class="card-title">{{ company ? 'Edit Company' : 'Add Company' }}</h2>
            <button @click="showCompanyForm = false" class="btn-close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div class="form-container">
            <!-- Basic Information -->
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Heading <span class="required">*</span></label>
                <input v-model="companyForm.heading" type="text" class="form-input" required />
              </div>
              <div class="form-group">
                <label class="form-label">Company Name <span class="required">*</span></label>
                <input v-model="companyForm.companyName" type="text" class="form-input" required />
              </div>
              <div class="form-group">
                <label class="form-label">Website <span class="required">*</span></label>
                <input v-model="companyForm.website" type="url" class="form-input" required />
              </div>
              <div class="form-group">
                <label class="form-label">Website Display URL</label>
                <input v-model="companyForm.displayUrl" type="text" class="form-input" />
              </div>
              <div class="form-group">
                <label class="form-label">Email <span class="required">*</span></label>
                <input v-model="companyForm.email" type="email" class="form-input" required />
              </div>
              <div class="form-group">
                <label class="form-label">Status <span class="required">*</span></label>
                <select v-model="companyForm.status" class="form-input" required>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <!-- Logo Upload -->
            <div class="form-group full-width">
              <label class="form-label">Company Logo <span class="required">*</span></label>
              <div class="upload-area">
                <input
                    type="file"
                    @change="handleLogoUpload"
                    accept="image/*"
                    id="logo-upload"
                    class="file-input"
                />
                <label for="logo-upload" class="upload-label">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  <span>{{ logoFileName || 'Click to upload logo' }}</span>
                </label>
                <div v-if="logoPreview" class="image-preview">
                  <img :src="logoPreview" alt="Logo preview" />
                  <button @click="removeLogo" class="remove-image" type="button">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Additional Information -->
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">360 View Link</label>
                <input v-model="companyForm.view360" type="url" class="form-input" />
              </div>
              <div class="form-group">
                <label class="form-label">Google Location</label>
                <input v-model="companyForm.googleLocation" type="text" class="form-input" />
              </div>
              <div class="form-group full-width">
                <label class="form-label">Google Reviews</label>
                <input v-model="companyForm.googleReviews" type="text" class="form-input" />
              </div>
            </div>

            <!-- Company Bio -->
            <div class="form-group full-width">
              <label class="form-label">Company Bio</label>
              <textarea v-model="companyForm.bio" rows="4" class="form-input"></textarea>
            </div>

            <!-- Social Media Links -->
            <div class="form-section">
              <h3 class="section-title">Social Media Links</h3>

              <div class="social-links-grid">
                <div v-for="social in mainSocialMedia" :key="social.name" class="social-link-item">
                  <div class="social-checkbox">
                    <input
                        type="checkbox"
                        :id="`social-${social.name}`"
                        v-model="social.enabled"
                        class="checkbox-input"
                    />
                    <label :for="`social-${social.name}`" class="checkbox-label">
                      {{ social.label }}
                    </label>
                  </div>
                  <input
                      v-model="social.url"
                      type="url"
                      class="form-input"
                      :placeholder="`Enter ${social.label} URL`"
                      :disabled="!social.enabled"
                  />
                </div>
              </div>

              <!-- Custom Social Media Links -->
              <div v-if="customSocialMedia.length > 0" class="custom-social-section">
                <div v-for="(custom, index) in customSocialMedia" :key="index" class="custom-social-item">
                  <div class="social-checkbox">
                    <input
                        type="checkbox"
                        :id="`custom-social-${index}`"
                        v-model="custom.enabled"
                        class="checkbox-input"
                    />
                    <label :for="`custom-social-${index}`" class="checkbox-label-small">
                      Enable
                    </label>
                  </div>
                  <input
                      v-model="custom.name"
                      type="text"
                      class="form-input"
                      placeholder="Social media name"
                      :disabled="!custom.enabled"
                  />
                  <input
                      v-model="custom.url"
                      type="url"
                      class="form-input"
                      placeholder="Enter URL"
                      :disabled="!custom.enabled"
                  />
                  <button @click="removeCustomSocial(index)" class="btn-remove" type="button">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>

              <button @click="addCustomSocial" class="btn-add-more" type="button">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add More
              </button>
            </div>

            <!-- Form Actions -->
            <div class="form-actions">
              <button @click="saveCompany" class="btn-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Save Company
              </button>
              <button @click="showCompanyForm = false" class="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      </div>

      <!-- CONTACT TAB -->
      <div v-if="activeTab === 'contact'" class="content-card">
        <div v-if="!showContactForm">
          <div class="card-header">
            <h2 class="card-title">Contact Information</h2>
            <button @click="showContactForm = true" class="btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add Contact
            </button>
          </div>

          <div v-if="contacts.length > 0" class="table-container">
            <table class="data-table">
              <thead>
              <tr>
                <th>Name</th>
                <th>Telephone</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Designation</th>
                <th>Status</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="c in contacts" :key="c.id">
                <td><strong>{{ c.firstName }} {{ c.lastName }}</strong></td>
                <td>{{ c.telephone }}</td>
                <td>{{ c.mobile }}</td>
                <td>{{ c.email }}</td>
                <td>{{ c.designation }}</td>
                <td>
                  <span :class="['status-badge', c.status]">{{ c.status }}</span>
                </td>
              </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="empty-state">
            <svg class="empty-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <p class="empty-text">No contact data found</p>
            <button @click="showContactForm = true" class="link-button">Add your first contact</button>
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

          <div class="form-container">
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
                  <img :src="photoPreview" alt="Photo preview" />
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
                <input v-model="contactForm.firstName" type="text" class="form-input" required />
              </div>
              <div class="form-group">
                <label class="form-label">Last Name <span class="required">*</span></label>
                <input v-model="contactForm.lastName" type="text" class="form-input" required />
              </div>
              <div class="form-group">
                <label class="form-label">Telephone</label>
                <input v-model="contactForm.telephone" type="tel" class="form-input" />
              </div>
              <div class="form-group">
                <label class="form-label">Mobile <span class="required">*</span></label>
                <input v-model="contactForm.mobile" type="tel" class="form-input" readonly />
              </div>
              <div class="form-group">
                <label class="form-label">Email <span class="required">*</span></label>
                <input v-model="contactForm.email" type="email" class="form-input" readonly />
              </div>
              <div class="form-group">
                <label class="form-label">Designation <span class="required">*</span></label>
                <input v-model="contactForm.designation" type="text" class="form-input" required />
              </div>
              <div class="form-group">
                <label class="form-label">Company</label>
                <input v-model="contactForm.company" type="text" class="form-input" />
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import api from "../services/api";
import { useRouter } from 'vue-router';

const activeTab = ref("company");
const showCompanyForm = ref(false);
const showContactForm = ref(false);

const company = ref(null);
const contacts = ref([]);
const router = useRouter();

function logout() {
  localStorage.removeItem('token');
  router.push('/login');
}

const companyForm = ref({
  heading: "",
  companyName: "",
  website: "",
  displayUrl: "",
  email: "",
  bio: "",
  logo: null,
  view360: "",
  googleLocation: "",
  googleReviews: "",
  status: "active",
});

const contactForm = ref({
  firstName: "",
  lastName: "",
  telephone: "",
  mobile: "",
  email: "",
  designation: "",
  company: "",
  photo: null,
  status: "active",
});

const user = ref({
  email: "",
  phone: ""
});


// Social Media
const mainSocialMedia = ref([
  { name: 'facebook', label: 'Facebook', enabled: false, url: '' },
  { name: 'twitter', label: 'X (Twitter)', enabled: false, url: '' },
  { name: 'linkedin', label: 'LinkedIn', enabled: false, url: '' },
  { name: 'instagram', label: 'Instagram', enabled: false, url: '' },
  { name: 'youtube', label: 'YouTube', enabled: false, url: '' },
  { name: 'tiktok', label: 'TikTok', enabled: false, url: '' }
]);

const customSocialMedia = ref([]);

// Image Upload States
const logoPreview = ref(null);
const logoFileName = ref('');
const photoPreview = ref(null);
const photoFileName = ref('');

const token = localStorage.getItem("token");

function handleLogoUpload(event) {
  const file = event.target.files[0];
  if (file) {
    companyForm.value.logo = file;
    logoFileName.value = file.name;

    const reader = new FileReader();
    reader.onload = (e) => {
      logoPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function removeLogo() {
  companyForm.value.logo = null;
  logoFileName.value = '';
  logoPreview.value = null;
  document.getElementById('logo-upload').value = '';
}

function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (file) {
    contactForm.value.photo = file;
    photoFileName.value = file.name;

    const reader = new FileReader();
    reader.onload = (e) => {
      photoPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function removePhoto() {
  contactForm.value.photo = null;
  photoFileName.value = '';
  photoPreview.value = null;
  document.getElementById('photo-upload').value = '';
}

function addCustomSocial() {
  customSocialMedia.value.push({
    name: '',
    url: '',
    enabled: true
  });
}

function removeCustomSocial(index) {
  customSocialMedia.value.splice(index, 1);
}

async function loadData() {
  try {
    // Fetch dashboard data
    const res = await api.get("/dashboard/data", {
      headers: { Authorization: `Bearer ${token}` },
    });
    company.value = res.data.company;
    contacts.value = res.data.contacts;

    // Fetch logged-in user info
    const userRes = await api.get("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    user.value.email = userRes.data.email;
    user.value.phone = userRes.data.phone;

    // Pre-fill contact form
    contactForm.value.email = user.value.email;
    contactForm.value.mobile = user.value.phone;

  } catch (err) {
    console.error("❌ Load dashboard error:", err);
  }
}


async function saveCompany() {
  try {
    const formData = new FormData();

    // Add all form fields
    Object.keys(companyForm.value).forEach(key => {
      if (key === 'logo' && companyForm.value[key]) {
        formData.append('logo', companyForm.value[key]);
      } else if (key !== 'logo') {
        formData.append(key, companyForm.value[key]);
      }
    });

    // Add social media links
    const socialLinks = {};
    mainSocialMedia.value.forEach(social => {
      if (social.enabled && social.url) {
        socialLinks[social.name] = social.url;
      }
    });
    customSocialMedia.value.forEach(social => {
      if (social.enabled && social.name && social.url) {
        socialLinks[social.name] = social.url;
      }
    });
    formData.append('socialLinks', JSON.stringify(socialLinks));

    const res = await api.post("/dashboard/company", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      },
    });
    alert(res.data.message);
    showCompanyForm.value = false;
    loadData();
  } catch (err) {
    alert("Error saving company: " + (err.response?.data?.message || err.message));
  }
}

async function saveContact() {
  try {
    const formData = new FormData();

    // Add all form fields
    Object.keys(contactForm.value).forEach(key => {
      if (key === 'photo' && contactForm.value[key]) {
        formData.append('photo', contactForm.value[key]);
      } else if (key !== 'photo') {
        formData.append(key, contactForm.value[key]);
      }
    });

    const res = await api.post("/dashboard/contact", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      },
    });
    alert(res.data.message);
    showContactForm.value = false;
    loadData();
  } catch (err) {
    alert("Error saving contact: " + (err.response?.data?.message || err.message));
  }
}

onMounted(loadData);
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.dashboard-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

/* Header */
.dashboard-header {
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #e2e8f0;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.welcome-text {
  font-size: 0.875rem;
  color: #64748b;
}

.user-avatar {
  width: 2rem;
  height: 2rem;
  background: #4f46e5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Container */
.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

/* Tabs */
.tabs-container {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;
  display: flex;
  border-bottom: 1px solid #e2e8f0;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  border-bottom: 2px solid transparent;
}

.tab-button:hover {
  color: #0f172a;
  background: #f8fafc;
}

.tab-button.active {
  color: #4f46e5;
  background: #eef2ff;
  border-bottom-color: #4f46e5;
}

.tab-icon {
  flex-shrink: 0;
}

/* Content Card */
.content-card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  padding: 1.5rem;
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

.btn-secondary:hover {
  background: #e2e8f0;
}

.btn-close {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 0.25rem;
  transition: color 0.2s;
}

.btn-close:hover {
  color: #64748b;
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

.link-button:hover {
  color: #4338ca;
}

.btn-add-more {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  color: #4f46e5;
  border: 1px solid #4f46e5;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 1rem;
}

.btn-add-more:hover {
  background: #eef2ff;
}

.btn-remove {
  padding: 0.5rem;
  background: #fee2e2;
  color: #991b1b;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.btn-remove:hover {
  background: #fecaca;
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

.data-table th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.data-table tbody tr {
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.2s;
}

.data-table tbody tr:hover {
  background: #f8fafc;
}

.data-table td {
  padding: 1rem;
  font-size: 0.875rem;
  color: #0f172a;
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
  text-transform: capitalize;
}

.status-badge.active {
  background: #dcfce7;
  color: #166534;
}

.status-badge.inactive {
  background: #fee2e2;
  color: #991b1b;
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

.empty-text {
  color: #64748b;
  margin-bottom: 1rem;
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

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
  margin-bottom: 0.5rem;
  text-align: left;
}

.required {
  color: #ef4444;
}

.form-input {
  padding: 0.625rem 0.875rem;
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.form-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.form-input:disabled {
  background: #f1f5f9;
  color: #94a3b8;
  cursor: not-allowed;
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

.upload-label:hover {
  border-color: #4f46e5;
  background: #f8fafc;
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

.remove-image:hover {
  background: white;
  transform: scale(1.1);
}

/* Social Media Section */
.form-section {
  border-top: 1px solid #e2e8f0;
  padding-top: 1.5rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 1.25rem 0;
  text-align: left;
}

.social-links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1rem;
}

.social-link-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.social-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-input {
  width: 1.125rem;
  height: 1.125rem;
  cursor: pointer;
  accent-color: #4f46e5;
}

.checkbox-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  user-select: none;
}

.checkbox-label-small {
  font-size: 0.75rem;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  user-select: none;
}

/* Custom Social Media */
.custom-social-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.custom-social-item {
  display: grid;
  grid-template-columns: auto 1fr 2fr auto;
  gap: 0.75rem;
  align-items: center;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .form-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }

  .social-links-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem;
  }

  .header-content {
    padding: 1rem;
  }

  .content-card {
    padding: 1rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .social-links-grid {
    grid-template-columns: 1fr;
  }

  .tabs-container {
    flex-direction: column;
  }

  .tab-button {
    border-bottom: none;
    border-left: 2px solid transparent;
    justify-content: flex-start;
  }

  .tab-button.active {
    border-left-color: #4f46e5;
    border-bottom-color: transparent;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }

  .custom-social-item {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .table-container {
    border-radius: 0.5rem;
    border: 1px solid #e2e8f0;
  }

  .data-table {
    font-size: 0.75rem;
  }

  .data-table th,
  .data-table td {
    padding: 0.5rem;
  }
}

@media (max-width: 480px) {
  .header-title {
    font-size: 1.25rem;
  }

  .welcome-text {
    display: none;
  }

  .upload-label {
    padding: 1.5rem 1rem;
    font-size: 0.875rem;
  }

  .image-preview {
    width: 120px;
    height: 120px;
  }
}

/* Desktop Optimization */
@media (min-width: 1400px) {
  .form-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .social-links-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}


</style>
