<template>
  <div class="admin-register-wrapper">
    <div class="register-card">
      <div class="form-container">
        <!-- Name Field -->
        <div class="form-group">
          <label class="form-label">Full Name</label>
          <div class="input-wrapper">
            <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <input
                v-model="form.name"
                type="text"
                class="form-input"
                placeholder="Enter user's full name"
                required
            />
          </div>
        </div>

        <!-- Email Field -->
        <div class="form-group">
          <label class="form-label">Email Address</label>
          <div class="input-wrapper">
            <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <input
                v-model="form.email"
                type="email"
                class="form-input"
                placeholder="Enter email address"
                required
            />
          </div>
        </div>

        <!-- Phone Field -->
        <div class="form-group">
          <label class="form-label">Phone Number</label>
          <div class="input-wrapper phone-input-group">
            <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>

            <!-- Country Code Dropdown -->
            <div class="country-dropdown-wrapper" ref="dropdownRef">
              <div class="country-trigger" @click="toggleDropdown">
                <span class="selected-country">{{ selectedCountry?.name || '+94' }}</span>
                <svg class="dropdown-arrow" :class="{ 'rotate': isDropdownOpen }" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>

              <transition name="dropdown-slide">
                <div v-if="isDropdownOpen" class="country-dropdown-menu">
                  <div class="search-box">
                    <svg class="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <input
                        ref="searchInputRef"
                        v-model="searchQuery"
                        type="text"
                        class="search-input"
                        placeholder="Search country..."
                        @click.stop
                    />
                  </div>

                  <div class="country-list">
                    <div
                        v-for="country in filteredCountries"
                        :key="country.code + country.name"
                        class="country-item"
                        :class="{ active: country.code === form.countryCode }"
                        @click="selectCountry(country)"
                    >
                      <span class="country-flag">{{ country.flag }}</span>
                      <span class="country-name">{{ country.fullName }}</span>
                      <span class="country-code">{{ country.code }}</span>
                    </div>

                    <div v-if="filteredCountries.length === 0" class="no-results">
                      No countries found
                    </div>
                  </div>
                </div>
              </transition>
            </div>

            <input
                v-model="form.phone"
                type="tel"
                class="form-input phone-number-input"
                placeholder="Enter phone number"
                required
            />
          </div>
        </div>

        <!-- Password Field -->
        <div class="form-group">
          <label class="form-label">Password</label>
          <div class="input-wrapper">
            <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input password-input"
                placeholder="Create password for user"
                required
            />
            <button type="button" @click="showPassword = !showPassword" class="password-toggle">
              <svg v-if="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            </button>
            <button type="button" @click="generatePassword" class="generate-btn" title="Generate Password">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23 4 23 10 17 10"></polyline>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
              </svg>
            </button>
          </div>
          <div class="password-strength">
            <div class="strength-bar" :class="passwordStrength.class" :style="{ width: passwordStrength.width }"></div>
          </div>
          <p class="password-hint">{{ passwordStrength.text }}</p>
        </div>

        <!-- Limits Section -->
        <div class="limits-section">
          <div class="section-header">
            <h3 class="section-title">📊 User Limits</h3>
            <p class="section-subtitle">Set resource allocation for this user</p>
          </div>

          <div class="limits-grid">
            <div class="form-group">
              <label class="form-label">Company Limit</label>
              <div class="input-wrapper">
                <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                <input
                    v-model.number="form.companyLimit"
                    type="number"
                    min="1"
                    class="form-input"
                    placeholder="Number of companies"
                    required
                />
              </div>
              <p class="field-hint">Maximum companies user can create</p>
            </div>

            <div class="form-group">
              <label class="form-label">Contact Limit</label>
              <div class="input-wrapper">
                <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <input
                    v-model.number="form.contactLimit"
                    type="number"
                    min="1"
                    class="form-input"
                    placeholder="Number of contacts"
                    required
                />
              </div>
              <p class="field-hint">Maximum contacts user can create</p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <button @click="createUser" class="btn-primary" :disabled="loading || !isFormValid">
            <svg v-if="loading" class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="2" x2="12" y2="6"></line>
              <line x1="12" y1="18" x2="12" y2="22"></line>
              <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
              <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
              <line x1="2" y1="12" x2="6" y2="12"></line>
              <line x1="18" y1="12" x2="22" y2="12"></line>
              <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
              <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
            </svg>
            <span v-else>Create User</span>
          </button>

          <button @click="$router.push('/admin/users')" class="btn-secondary">
            Cancel
          </button>
        </div>

        <!-- Message Box -->
        <div v-if="message" class="message-box" :class="messageType">
          <svg v-if="messageType === 'error'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span>{{ message }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import adminApi from '../../services/adminApi'
import countriesData from '../../assets/country_code.json'

const router = useRouter()

// Form data
const form = ref({
  name: '',
  email: '',
  countryCode: '+94',
  phone: '',
  password: '',
  companyLimit: 1,
  contactLimit: 1
})

// UI states
const loading = ref(false)
const message = ref('')
const messageType = ref('error')
const showPassword = ref(false)

// Country dropdown
const isDropdownOpen = ref(false)
const searchQuery = ref('')
const dropdownRef = ref(null)
const searchInputRef = ref(null)

// Countries data
const allCountries = ref(
    countriesData.map(country => ({
      flag: country.flag,
      name: `${country.flag} ${country.code}`,
      fullName: country.name,
      code: country.code,
      searchText: country.name.toLowerCase()
    }))
)

// Computed properties
const normalize = str =>
    str.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase()

const filteredCountries = computed(() => {
  const query = normalize(searchQuery.value.trim())
  if (!query) return allCountries.value

  return allCountries.value.filter((country) =>
      [country.fullName, country.code].some(field =>
          normalize(field).includes(query)
      )
  )
})

const selectedCountry = computed(() => {
  return allCountries.value.find(c => c.code === form.value.countryCode)
})

const passwordStrength = computed(() => {
  const pwd = form.value.password
  if (!pwd) return { class: '', width: '0%', text: '' }

  let strength = 0
  if (pwd.length >= 8) strength++
  if (pwd.length >= 12) strength++
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++
  if (/\d/.test(pwd)) strength++
  if (/[^A-Za-z0-9]/.test(pwd)) strength++

  if (strength <= 2) return { class: 'weak', width: '33%', text: 'Weak password' }
  if (strength <= 4) return { class: 'medium', width: '66%', text: 'Medium strength' }
  return { class: 'strong', width: '100%', text: 'Strong password' }
})

const isFormValid = computed(() => {
  return form.value.name.trim() &&
      form.value.email.trim() &&
      form.value.phone.trim() &&
      form.value.password.trim() &&
      form.value.companyLimit > 0 &&
      form.value.contactLimit > 0
})

// Methods
function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value
  if (isDropdownOpen.value) {
    nextTick(() => {
      searchInputRef.value?.focus()
    })
  } else {
    searchQuery.value = ''
  }
}

function selectCountry(country) {
  form.value.countryCode = country.code
  isDropdownOpen.value = false
  searchQuery.value = ''
}

function handleClickOutside(event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false
    searchQuery.value = ''
  }
}

function generatePassword() {
  const length = 12
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
  let password = ""

  password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)]
  password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)]
  password += "0123456789"[Math.floor(Math.random() * 10)]
  password += "!@#$%^&*"[Math.floor(Math.random() * 8)]

  for (let i = password.length; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)]
  }

  form.value.password = password.split('').sort(() => Math.random() - 0.5).join('')
}

async function createUser() {
  if (!isFormValid.value || loading.value) return

  try {
    loading.value = true
    message.value = ''

    const payload = {
      name: form.value.name.trim(),
      email: form.value.email.trim(),
      countryCode: form.value.countryCode,
      phone: form.value.phone.trim(),
      password: form.value.password.trim(),
      companyLimit: form.value.companyLimit,
      contactLimit: form.value.contactLimit,
      registrationType: 'admin'
    }

    const res = await adminApi.post('/create-user', payload)

    messageType.value = 'success'
    message.value = res.data.message || 'User created successfully!'

    setTimeout(() => {
      alert(`User Created!\n\nEmail: ${form.value.email}\nPassword: ${form.value.password}\n\nPlease save these credentials securely.`)
      router.push('/admin/users')
    }, 1500)

  } catch (err) {
    console.error('Create user error:', err)
    messageType.value = 'error'
    message.value = err.response?.data?.message || 'Failed to create user. Please try again.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.admin-register-wrapper {
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 0;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 8px 0;
}

.title-icon {
  font-size: 2rem;
}

.page-subtitle {
  color: #64748b;
  margin: 0;
  font-size: 0.95rem;
}

.register-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.2s;
}

.register-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #334155;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  color: #94a3b8;
  pointer-events: none;
  z-index: 1;
}

.form-input {
  width: 100%;
  padding: 12px 16px 12px 48px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.password-input {
  padding-right: 100px;
}

.password-toggle,
.generate-btn {
  position: absolute;
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  border-radius: 8px;
}

.password-toggle {
  right: 52px;
}

.password-toggle:hover {
  color: #667eea;
  background: #f8fafc;
}

.generate-btn {
  right: 8px;
  background: #f1f5f9;
}

.generate-btn:hover {
  background: #e2e8f0;
  color: #667eea;
  transform: rotate(180deg);
}

/* Phone input styles */
.phone-input-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.country-dropdown-wrapper {
  position: relative;
  flex-shrink: 0;
}

.country-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 110px;
  user-select: none;
}

.country-trigger:hover {
  border-color: #667eea;
  background: #f8fafc;
}

.selected-country {
  font-size: 0.9rem;
  font-weight: 600;
  color: #0f172a;
}

.dropdown-arrow {
  transition: transform 0.2s;
  color: #64748b;
  flex-shrink: 0;
}

.dropdown-arrow.rotate {
  transform: rotate(180deg);
}

.country-dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 320px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
}

.search-box {
  position: relative;
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
  background: #f8f9fa;
}

.search-icon {
  position: absolute;
  left: 24px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 10px 12px 10px 36px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.9rem;
  outline: none;
  transition: all 0.2s;
}

.search-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.country-list {
  max-height: 280px;
  overflow-y: auto;
}

.country-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.15s;
  border-bottom: 1px solid #f1f5f9;
}

.country-item:hover {
  background: #f8fafc;
}

.country-item.active {
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
  border-left: 3px solid #667eea;
}

.country-flag {
  font-size: 1.25rem;
}

.country-name {
  flex: 1;
  font-size: 0.9rem;
  color: #0f172a;
  font-weight: 500;
}

.country-code {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 600;
}

.no-results {
  padding: 32px 16px;
  text-align: center;
  color: #94a3b8;
  font-size: 0.9rem;
}

.phone-number-input {
  flex: 1;
}

.dropdown-slide-enter-active,
.dropdown-slide-leave-active {
  transition: all 0.2s ease;
}

.dropdown-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-slide-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

/* Password strength */
.password-strength {
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
  margin-top: 4px;
}

.strength-bar {
  height: 100%;
  transition: all 0.3s;
  border-radius: 3px;
}

.strength-bar.weak {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.strength-bar.medium {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.strength-bar.strong {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.password-hint {
  font-size: 0.8rem;
  color: #64748b;
  margin: 0;
  font-weight: 500;
}

.field-hint {
  font-size: 0.8rem;
  color: #64748b;
  margin: 4px 0 0 0;
}

/* Limits section */
.limits-section {
  padding: 24px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.section-header {
  margin-bottom: 20px;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 4px 0;
}

.section-subtitle {
  font-size: 0.85rem;
  color: #64748b;
  margin: 0;
}

.limits-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

/* Action buttons */
.action-buttons {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 14px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: white;
  color: #64748b;
  border: 1px solid #e5e7eb;
}

.btn-secondary:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  transform: translateY(-2px);
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Message box */
.message-box {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 500;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-box.error {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #991b1b;
  border: 1px solid #fca5a5;
}

.message-box.success {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  color: #166534;
  border: 1px solid #86efac;
}

/* Responsive */
@media (max-width: 768px) {
  .admin-register-wrapper {
    padding: 16px;
  }

  .register-card {
    padding: 24px;
  }

  .limits-grid {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }

  .phone-input-group {
    flex-direction: column;
    align-items: stretch;
  }

  .country-trigger {
    width: 100%;
  }
}
</style>
