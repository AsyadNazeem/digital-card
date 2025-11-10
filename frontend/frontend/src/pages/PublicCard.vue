<template>
  <div class="public-card-wrapper" v-if="loaded">
    <!-- Header Profile Section -->
    <div class="profile-header">
      <div class="profile-avatar">
        <img
            v-if="company.logo"
            :src="`http://localhost:4000${company.logo}`"
            alt="Company Logo"
        />
        <div v-else class="avatar-placeholder">
          {{ company.companyName?.charAt(0) }}
        </div>
      </div>
      <h1 class="profile-name">{{ company.heading || company.companyName }}</h1>
      <p class="profile-bio">{{ company.bio }}</p>
    </div>

    <!-- Action Buttons -->
    <div class="action-buttons">
      <a :href="`tel:${company.phone}`" class="action-btn primary">
        <span class="btn-icon">📞</span>
        Call
      </a>
      <a :href="`mailto:${company.email}`" class="action-btn primary">
        <span class="btn-icon">✉️</span>
        Email
      </a>
      <a :href="company.website" target="_blank" class="action-btn primary">
        <span class="btn-icon">🌐</span>
        Website
      </a>
      <button @click="saveContact" class="action-btn secondary">
        <span class="btn-icon">💾</span>
        Save Contact
      </button>
    </div>

    <!-- Company Information Card -->
    <div class="info-card">
      <div class="info-header">
        <span class="info-icon">🏢</span>
        <h2>Company Information</h2>
      </div>
      <div class="info-list">
        <div class="info-row">
          <span class="label">Company</span>
          <span class="value">{{ company.companyName }}</span>
        </div>
        <div class="info-row">
          <span class="label">Email</span>
          <span class="value">{{ company.email }}</span>
        </div>
        <div class="info-row">
          <span class="label">Website</span>
          <a :href="company.website" target="_blank" class="link-value">
            {{ company.displayUrl || company.website }}
          </a>
        </div>
        <div class="info-row">
          <span class="label">Status</span>
          <span class="badge" :class="company.status?.toLowerCase()">{{ company.status }}</span>
        </div>
      </div>
    </div>

    <!-- Contacts Section -->
    <div class="info-card" v-if="contacts.length">
      <div class="info-header">
        <span class="info-icon">👥</span>
        <h2>Team Members</h2>
      </div>
      <div class="contacts-list">
        <div v-for="c in contacts" :key="c.id" class="contact-item">
          <div class="contact-avatar-small">
            <img
                v-if="c.photo"
                :src="`http://localhost:4000${c.photo}`"
                alt="Contact Photo"
            />
            <div v-else class="avatar-placeholder-small">
              {{ c.firstName?.charAt(0) }}{{ c.lastName?.charAt(0) }}
            </div>
          </div>
          <div class="contact-info">
            <h3>{{ c.firstName }} {{ c.lastName }}</h3>
            <p class="designation">{{ c.designation }}</p>
            <div class="contact-details">
              <a :href="`mailto:${c.email}`" class="contact-link">
                <span class="icon">📧</span>
                {{ c.email }}
              </a>
              <a :href="`tel:${c.mobile}`" class="contact-link">
                <span class="icon">📱</span>
                {{ c.mobile }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Social Links -->
    <div class="info-card" v-if="company.socialLinks">
      <div class="info-header">
        <span class="info-icon">🔗</span>
        <h2>Connect With Us</h2>
      </div>
      <div class="social-grid">
        <a
            v-for="(url, name) in company.socialLinks"
            :key="name"
            :href="url"
            target="_blank"
            class="social-btn"
        >
          <span class="social-icon">{{ getSocialIcon(name) }}</span>
          <span>{{ name }}</span>
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>Powered by Your Company</p>
    </div>
  </div>

  <div v-else class="loading-screen">
    <div class="spinner"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../services/api'

const route = useRoute()
const company = ref({})
const contacts = ref([])
const user = ref({})
const loaded = ref(false)

onMounted(async () => {
  try {
    const phone = route.params.phone
    const res = await api.get(`/public/${phone}`)
    company.value = res.data.company || {}
    contacts.value = res.data.contacts || []
    user.value = res.data.user
    loaded.value = true
  } catch (err) {
    console.error("❌ Error loading public card:", err)
  }
})

const saveContact = () => {
  alert('Contact save functionality coming soon!')
}

const getSocialIcon = (name) => {
  const icons = {
    facebook: '📘',
    twitter: '🐦',
    linkedin: '💼',
    instagram: '📷',
    youtube: '📺',
    tiktok: '🎵',
    whatsapp: '💬'
  }
  return icons[name.toLowerCase()] || '🔗'
}
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.public-card-wrapper {
  min-height: 100vh;
  background: linear-gradient(180deg, #1a1a2e 0%, #0f0f1e 100%);
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* Profile Header */
.profile-header {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  padding: 60px 20px 40px;
  text-align: center;
  position: relative;
}

.profile-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="30" r="2" fill="rgba(255,255,255,0.1)"/></svg>');
  opacity: 0.3;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  margin: 0 auto 20px;
  position: relative;
  z-index: 1;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  background: white;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: 700;
  color: white;
  border: 4px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.profile-name {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 12px;
  position: relative;
  z-index: 1;
}

.profile-bio {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
  position: relative;
  z-index: 1;
}

/* Action Buttons */
.action-buttons {
  padding: 30px 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  max-width: 800px;
  margin: 0 auto;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border-radius: 16px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.action-btn.primary {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
}

.action-btn.primary:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
}

.action-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.action-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-4px);
}

.btn-icon {
  font-size: 1.5rem;
}

/* Info Cards */
.info-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 24px;
  margin: 20px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.info-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.info-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 12px;
}

.info-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin: 0;
}

/* Info List */
.info-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.info-row:last-child {
  border-bottom: none;
}

.label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
}

.value {
  font-size: 0.95rem;
  color: white;
  font-weight: 500;
  text-align: right;
}

.link-value {
  font-size: 0.95rem;
  color: #8b5cf6;
  text-decoration: none;
  font-weight: 500;
  text-align: right;
  transition: color 0.2s;
}

.link-value:hover {
  color: #a78bfa;
}

.badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.badge.inactive {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

/* Contacts List */
.contacts-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.contact-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;
}

.contact-item:hover {
  background: rgba(255, 255, 255, 0.06);
  transform: translateX(4px);
}

.contact-avatar-small {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
}

.contact-avatar-small img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(139, 92, 246, 0.3);
}

.avatar-placeholder-small {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  border: 2px solid rgba(139, 92, 246, 0.3);
}

.contact-info {
  flex: 1;
  min-width: 0;
}

.contact-info h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  margin-bottom: 4px;
}

.designation {
  font-size: 0.875rem;
  color: #8b5cf6;
  margin-bottom: 8px;
}

.contact-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.contact-link {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: color 0.2s;
}

.contact-link:hover {
  color: white;
}

.contact-link .icon {
  font-size: 1rem;
}

/* Social Grid */
.social-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  color: white;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  text-transform: capitalize;
}

.social-btn:hover {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-color: transparent;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4);
}

.social-icon {
  font-size: 1.25rem;
}

/* Footer */
.footer {
  text-align: center;
  padding: 40px 20px;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.875rem;
}

/* Loading Screen */
.loading-screen {
  min-height: 100vh;
  background: linear-gradient(180deg, #1a1a2e 0%, #0f0f1e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(139, 92, 246, 0.2);
  border-top-color: #8b5cf6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 640px) {
  .profile-name {
    font-size: 1.5rem;
  }

  .profile-bio {
    font-size: 0.9rem;
  }

  .action-buttons {
    grid-template-columns: repeat(2, 1fr);
  }

  .info-card {
    margin: 16px;
    padding: 20px;
  }

  .info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .value, .link-value {
    text-align: left;
  }

  .contact-item {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .contact-details {
    align-items: center;
  }

  .social-grid {
    grid-template-columns: 1fr;
  }
}
</style>
