<template>
  <div class="auth-wrapper" :class="{ 'dark-mode': isDark }">
    <!-- Left Side - Branding -->
    <div class="branding-section">
      <div class="branding-content">
        <div class="logo-container">
          <img src="/images/logo.jpeg" alt="TapMyName" class="main-logo" />
        </div>
        <h1 class="brand-title">Start Networking Smarter</h1>
        <p class="brand-description">
          Join thousands of professionals who've made the switch to digital business cards.
          Create your profile in minutes and start sharing instantly.
        </p>
        <div class="features">
          <div class="feature-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>No credit card required</span>
          </div>
          <div class="feature-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>Free to get started</span>
          </div>
          <div class="feature-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>Setup in under 5 minutes</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Side - Register Form -->
    <div class="form-section">
      <div class="form-container">
        <div class="form-header">
          <h2 class="form-title">Create Your Account</h2>
          <p class="form-subtitle">Get started with your digital business card</p>
        </div>

        <!-- Google Register -->
        <button class="oauth-btn google-btn" @click="handleGoogleRegister" :disabled="loading">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" class="oauth-icon" />
          <span>Sign up with Google</span>
        </button>

        <Applesigninbutton />

        <div class="divider">
          <span>or register with email</span>
        </div>

        <!-- Register Form -->
        <form @submit.prevent="register" class="register-form">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <div class="input-group">
              <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <input
                  v-model="name"
                  type="text"
                  class="form-input"
                  placeholder="Enter your full name"
                  required
              />
            </div>
          </div>

          <!-- Email with OTP -->
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <div class="input-group">
              <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <input
                  v-model="email"
                  type="email"
                  class="form-input"
                  :class="{ 'has-action': !otpVerified }"
                  placeholder="Enter your email"
                  required
                  :disabled="otpSent && !otpVerified"
              />
              <button
                  v-if="!otpVerified"
                  type="button"
                  class="input-action-btn"
                  @click="sendOtp"
                  :disabled="sendingOtp || !email"
              >
                {{ sendingOtp ? 'Sending...' : (otpSent ? 'Resend' : 'Verify') }}
              </button>
              <span v-if="otpVerified" class="verified-badge">✓</span>
            </div>

            <!-- OTP Input -->
            <div v-if="otpSent && !otpVerified" class="otp-container">
              <div class="input-group">
                <input
                    v-model="otp"
                    type="text"
                    class="form-input"
                    placeholder="Enter OTP code"
                    maxlength="6"
                />
                <button
                    type="button"
                    class="input-action-btn"
                    @click="verifyOtp"
                    :disabled="verifyingOtp || !otp"
                >
                  {{ verifyingOtp ? 'Verifying...' : 'Verify' }}
                </button>
              </div>
            </div>

            <p v-if="otpMessage" :class="['input-message', otpVerified ? 'success' : 'error']">
              {{ otpMessage }}
            </p>
          </div>

          <!-- Phone with Country Code -->
          <div class="form-group">
            <label class="form-label">Phone Number</label>
            <div class="phone-input-wrapper">
              <div class="country-selector" ref="dropdownRef">
                <button type="button" class="country-btn" @click="toggleDropdown">
                  <span>{{ selectedCountry?.name || '+94' }}</span>
                  <svg class="dropdown-icon" :class="{ open: isDropdownOpen }" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                <transition name="dropdown">
                  <div v-if="isDropdownOpen" class="country-dropdown" @click.stop>
                    <div class="dropdown-search">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                      </svg>
                      <input
                          ref="searchInputRef"
                          v-model="searchQuery"
                          type="text"
                          placeholder="Search country..."
                          class="search-input"
                      />
                    </div>
                    <div class="country-list">
                      <div
                          v-for="country in filteredCountries"
                          :key="country.code"
                          class="country-option"
                          :class="{ active: country.code === countryCode }"
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

              <div class="input-group flex-grow">
                <input
                    v-model="phone"
                    type="tel"
                    class="form-input phone-input"
                    placeholder="Enter phone number"
                    required
                />
              </div>
            </div>
          </div>

          <!-- Password -->
          <div class="form-row">

            <!-- Password -->
            <div class="form-group half">
              <label class="form-label">Password</label>
              <div class="input-group">
                <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>

                <input
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    class="form-input"
                    placeholder="Create password"
                    required
                />
              </div>
            </div>

            <!-- Confirm Password -->
            <div class="form-group half">
              <label class="form-label">Confirm Password</label>
              <div class="input-group">
                <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>

                <input
                    v-model="confirmPassword"
                    :type="showPassword ? 'text' : 'password'"
                    class="form-input"
                    placeholder="Confirm password"
                    required
                />
              </div>
            </div>

          </div>

          <!-- Terms -->
          <label class="checkbox-label terms-checkbox">
            <input type="checkbox" v-model="agreeTerms" class="checkbox-input" required />
            <span>I agree to the <a href="#" class="link">Terms of Service</a> and <a href="#" class="link">Privacy Policy</a></span>
          </label>

          <button type="submit" class="submit-btn" :disabled="!agreeTerms || loading || !otpVerified">
            <svg v-if="loading" class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="2" x2="12" y2="6"></line>
              <line x1="12" y1="18" x2="12" y2="22"></line>
              <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
              <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
            </svg>
            <span v-else>Create Account</span>
          </button>

          <div v-if="message" class="alert" :class="messageType">
            <svg v-if="messageType === 'error'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>{{ message }}</span>
          </div>
        </form>

        <div class="signup-prompt">
          <p>Already have an account? <router-link to="/login" class="signup-link">Sign in</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick, inject } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../services/api.js'
import countriesData from '../../assets/country_code.json'
import Applesigninbutton from "@/components/user/Applesigninbutton.vue"

const router = useRouter()
const { isDark, toggleDarkMode } = inject('theme')

const countryCode = ref("+1")
const name = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
const message = ref('')
const messageType = ref('error')
const showPassword = ref(false)
const agreeTerms = ref(false)
const loading = ref(false)

// OTP states
const otp = ref('')
const otpSent = ref(false)
const otpVerified = ref(false)
const otpMessage = ref('')
const sendingOtp = ref(false)
const verifyingOtp = ref(false)
const verifiedEmail = ref('')

// Country dropdown
const isDropdownOpen = ref(false)
const searchQuery = ref('')
const dropdownRef = ref(null)
const searchInputRef = ref(null)

const allCountries = ref(
    countriesData.map(country => ({
      flag: country.flag,
      name: `${country.flag} ${country.code}`,
      fullName: country.name,
      code: country.code,
      searchText: country.name.toLowerCase()
    }))
)

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
  return allCountries.value.find(c => c.code === countryCode.value)
})

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
  countryCode.value = country.code
  isDropdownOpen.value = false
  searchQuery.value = ''
}

function handleClickOutside(event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false
    searchQuery.value = ''
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

watch(email, (newEmail) => {
  if (otpVerified.value && newEmail.trim() !== verifiedEmail.value) {
    otpVerified.value = false
    otpSent.value = false
    otp.value = ''
    otpMessage.value = 'Email changed. Please verify your new email.'
    verifiedEmail.value = ''
  }
})

async function sendOtp() {
  const emailValue = email.value.trim()
  if (!emailValue) {
    otpMessage.value = "Enter your email first!"
    return
  }

  try {
    sendingOtp.value = true
    otpMessage.value = ''
    const res = await api.post('/otp/send', { email: emailValue })
    otpSent.value = true
    message.value = ''
    otpMessage.value = res.data.message || "OTP sent successfully! Check your email."
  } catch (err) {
    console.error('Send OTP error:', err)
    otpMessage.value = err.response?.data?.message || "Failed to send OTP."
  } finally {
    sendingOtp.value = false
  }
}

async function verifyOtp() {
  const otpValue = otp.value.trim()
  const emailValue = email.value.trim()

  if (!otpValue) {
    otpMessage.value = "Enter the OTP!"
    return
  }

  try {
    verifyingOtp.value = true
    otpMessage.value = ''

    const res = await api.post('/otp/verify', {
      email: emailValue,
      otp: otpValue,
    })

    if (res.data && (res.data.success === true || res.data.success === 'true')) {
      otpVerified.value = true
      verifiedEmail.value = emailValue
      otpMessage.value = res.data.message || "✅ Email verified successfully!"
    } else {
      otpVerified.value = false
      otpMessage.value = res.data?.message || "Invalid OTP."
    }
  } catch (err) {
    console.error('❌ Verify OTP error:', err)
    otpVerified.value = false
    otpMessage.value = err.response?.data?.message || "Invalid OTP or Server Error."
  } finally {
    verifyingOtp.value = false
  }
}

const passwordStrength = computed(() => {
  const pwd = password.value
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

async function register() {
  if (!name.value.trim() || !email.value.trim() || !phone.value.trim() || !password.value.trim()) {
    messageType.value = 'error'
    message.value = 'Please fill out all required fields.'
    return
  }

  if (passwordStrength.value.class === 'weak') {
    messageType.value = 'error'
    message.value = 'Please choose a stronger password.'
    return
  }

  if (password.value !== confirmPassword.value) {
    messageType.value = 'error'
    message.value = 'Passwords do not match.'
    return
  }

  if (!otpVerified.value) {
    messageType.value = 'error'
    message.value = 'Please verify your email address before registering.'
    return
  }

  if (email.value.trim() !== verifiedEmail.value) {
    messageType.value = 'error'
    message.value = 'Email has changed. Please verify your new email address.'
    otpVerified.value = false
    return
  }

  if (loading.value || !agreeTerms.value) return

  try {
    loading.value = true
    message.value = ''

    const res = await api.post('/auth/register', {
      name: name.value.trim(),
      email: email.value.trim(),
      phone: phone.value.trim(),
      password: password.value.trim(),
      countryCode: countryCode.value,
      country: selectedCountry.value?.fullName || null,
    })

    messageType.value = 'success'
    message.value = res.data.message || 'Registration successful! Redirecting to login...'

    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (err) {
    console.error("Registration error:", err)
    messageType.value = 'error'
    message.value = err.response?.data?.message || 'Registration failed. Please try again.'
  } finally {
    loading.value = false
  }
}

async function handleGoogleRegister() {
  try {
    loading.value = true
    message.value = ""

    if (!window.google) {
      await new Promise((resolve, reject) => {
        const script = document.createElement("script")
        script.src = "https://accounts.google.com/gsi/client"
        script.onload = resolve
        script.onerror = () => reject(new Error("Failed to load Google SDK"))
        document.head.appendChild(script)
      })
    }

    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

    if (!GOOGLE_CLIENT_ID) {
      throw new Error("Google Client ID not configured")
    }

    const client = window.google.accounts.oauth2.initCodeClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: "openid email profile",
      ux_mode: "popup",
      callback: async (response) => {
        try {
          if (response.error) {
            throw new Error(response.error)
          }

          if (!response.code) {
            throw new Error("No authorization code received")
          }

          const res = await api.post("/auth/google-register", {
            code: response.code
          })

          if (res.data.success && res.data.token) {
            localStorage.setItem("token", res.data.token)

            if (res.data.user) {
              localStorage.setItem("user", JSON.stringify(res.data.user))
            }

            messageType.value = "success"
            message.value = "Successfully signed in with Google!"

            setTimeout(() => {
              router.push("/dashboard")
            }, 1000)
          } else {
            throw new Error("Invalid response from server")
          }

        } catch (err) {
          console.error("❌ Callback error:", err)
          messageType.value = "error"
          message.value = err.response?.data?.message || "Google Sign-In failed. Please try again."
        } finally {
          loading.value = false
        }
      },
    })

    client.requestCode()

  } catch (err) {
    console.error("❌ Google Register Error:", err)
    messageType.value = "error"
    message.value = err.message || "Google Sign-In failed. Please try again."
    loading.value = false
  }
}
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════
   DESIGN TOKENS — Matching features page color theme
═══════════════════════════════════════════════════════ */
:root {
  --c-bg:             #faf9f7;
  --c-surface:        #ffffff;
  --c-border:         #e8e3dc;
  --c-text-primary:   #1c1410;
  --c-text-secondary: #5a4f46;
  --c-text-muted:     #9e8e84;
  --c-accent:         #7c5c4e;
  --c-accent-2:       #a07060;
  --c-accent-hover:   #5e443a;
  --c-accent-light:   #f0e8e4;
  --c-accent-subtle:  #f8f3f0;
  --c-success:        #2d6a50;
  --c-error:          #cf1322;
  --c-warning:        #faad14;
}

.auth-wrapper.dark-mode {
  --c-bg:             #100e14;
  --c-surface:        #1a1720;
  --c-border:         #2c2838;
  --c-text-primary:   #f2ede8;
  --c-text-secondary: #a89490;
  --c-text-muted:     #6a5e5a;
  --c-accent:         #c4906e;
  --c-accent-2:       #d4a880;
  --c-accent-hover:   #d4a070;
  --c-accent-light:   #281e18;
  --c-accent-subtle:  #1e1612;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.auth-wrapper {
  min-height: 100vh;
  display: flex;
  background: var(--c-bg);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
  color: var(--c-text-primary);
  transition: background-color 0.3s ease;
}

/* ═══════════════════════════════════════════════════════
   BRANDING SECTION
═══════════════════════════════════════════════════════ */
.branding-section {
  flex: 1;
  background: linear-gradient(135deg, var(--c-accent-hover) 0%, var(--c-accent) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 3rem;
  position: relative;
  overflow: hidden;
  max-height: 100vh;
  transition: background 0.3s ease;
}

/* Dark mode branding - professional deep color */
.auth-wrapper.dark-mode .branding-section {
  background: linear-gradient(135deg, #0d0b10 0%, #1a1720 100%);
}

.branding-section::before {
  content: '';
  position: absolute;
  width: 500px;
  height: 500px;
  background: rgba(196, 144, 110, 0.08);
  border-radius: 50%;
  top: -200px;
  right: -200px;
  transition: background 0.3s ease;
}

.auth-wrapper.dark-mode .branding-section::before {
  background: rgba(196, 144, 110, 0.05);
}

.branding-section::after {
  content: '';
  position: absolute;
  width: 400px;
  height: 400px;
  background: rgba(196, 144, 110, 0.05);
  border-radius: 50%;
  bottom: -150px;
  left: -150px;
  transition: background 0.3s ease;
}

.auth-wrapper.dark-mode .branding-section::after {
  background: rgba(196, 144, 110, 0.03);
}

.branding-content {
  max-width: 500px;
  z-index: 1;
  color: white;
}

.logo-container {
  margin-bottom: 2rem;
}

.main-logo {
  width: 280px;
  height: auto;
  filter: brightness(1.1);
}

.brand-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #f5e6d3;
  transition: color 0.3s ease;
}

.auth-wrapper.dark-mode .brand-title {
  color: #d4a880;
}

.brand-description {
  font-size: 1.1rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2.5rem;
  transition: color 0.3s ease;
}

.auth-wrapper.dark-mode .brand-description {
  color: rgba(242, 237, 232, 0.85);
}

.features {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.95);
}

.feature-item svg {
  flex-shrink: 0;
  color: rgba(255, 255, 255, 0.9);
}

/* ═══════════════════════════════════════════════════════
   FORM SECTION
═══════════════════════════════════════════════════════ */
.form-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: var(--c-bg);
  overflow-y: auto;
  transition: background-color 0.3s ease;
}

.form-container {
  width: 100%;
  max-width: 500px;
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--c-text-primary);
  margin-bottom: 0.5rem;
}

.form-subtitle {
  font-size: 1rem;
  color: var(--c-text-secondary);
}

/* ═══════════════════════════════════════════════════════
   OAUTH BUTTONS
═══════════════════════════════════════════════════════ */
.oauth-btn {
  width: 100%;
  padding: 0.875rem 1.5rem;
  background: var(--c-surface);
  border: 2px solid var(--c-border);
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  color: var(--c-text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  transition: all 0.3s;
  margin-bottom: 1rem;
  height: 50px;
}

.oauth-btn:hover:not(:disabled) {
  border-color: var(--c-accent);
  background: var(--c-accent-subtle);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(124, 92, 78, 0.15);
}

.oauth-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.oauth-icon {
  width: 20px;
  height: 20px;
}

.divider {
  position: relative;
  text-align: center;
  margin: 1.5rem 0;
}

.divider::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 1px;
  background: var(--c-border);
}

.divider span {
  position: relative;
  background: var(--c-bg);
  padding: 0 1rem;
  font-size: 0.875rem;
  color: var(--c-text-muted);
  font-weight: 500;
  transition: background-color 0.3s ease;
}

/* ═══════════════════════════════════════════════════════
   FORM ELEMENTS
═══════════════════════════════════════════════════════ */
.register-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--c-text-primary);
}

.input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  color: var(--c-text-muted);
  pointer-events: none;
  z-index: 1;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  background: var(--c-surface);
  border: 2px solid var(--c-border);
  border-radius: 12px;
  font-size: 0.95rem;
  color: var(--c-text-primary);
  transition: all 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: var(--c-accent);
  background: var(--c-surface);
  box-shadow: 0 0 0 4px rgba(124, 92, 78, 0.1);
}

.dark-mode .form-input:focus {
  box-shadow: 0 0 0 4px rgba(196, 144, 110, 0.1);
}

.form-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-input::placeholder {
  color: var(--c-text-muted);
}

.form-input.has-action {
  padding-right: 100px !important;
}

.input-action-btn {
  position: absolute;
  right: 8px;
  background: var(--c-accent);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 1;
}

.input-action-btn:hover:not(:disabled) {
  background: var(--c-accent-hover);
}

.input-action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.verified-badge {
  position: absolute;
  right: 12px;
  color: var(--c-success);
  font-size: 1.5rem;
  font-weight: bold;
}

.otp-container {
  margin-top: 0.75rem;
}

.input-message {
  font-size: 0.8rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.input-message.success {
  color: var(--c-success);
}

.input-message.error {
  color: var(--c-error);
}

/* ═══════════════════════════════════════════════════════
   PHONE INPUT & COUNTRY SELECTOR
═══════════════════════════════════════════════════════ */
.phone-input-wrapper {
  display: flex;
  gap: 0.75rem;
}

.country-selector {
  position: relative;
  flex-shrink: 0;
}

.country-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1rem;
  background: var(--c-surface);
  border: 2px solid var(--c-border);
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--c-text-primary);
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
  height: 51px;
}

.country-btn:hover {
  border-color: var(--c-accent);
  background: var(--c-accent-subtle);
}

.dropdown-icon {
  transition: transform 0.2s;
  color: var(--c-text-muted);
}

.dropdown-icon.open {
  transform: rotate(180deg);
}

.country-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  width: 320px;
  background: var(--c-surface);
  border: 2px solid var(--c-border);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(124, 92, 78, 0.15);
  z-index: 1000;
  max-height: 320px;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

.dark-mode .country-dropdown {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.dropdown-search {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-bottom: 1px solid var(--c-border);
}

.dropdown-search svg {
  color: var(--c-text-muted);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 0.875rem;
  color: var(--c-text-primary);
  background: transparent;
}

.search-input::placeholder {
  color: var(--c-text-muted);
}

.country-list {
  max-height: 260px;
  overflow-y: auto;
}

.country-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid var(--c-border);
}

.country-option:hover {
  background: var(--c-accent-subtle);
}

.country-option.active {
  background: var(--c-accent-light);
  border-left: 3px solid var(--c-accent);
}

.country-flag {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.country-name {
  flex: 1;
  font-size: 0.875rem;
  color: var(--c-text-primary);
}

.country-code {
  font-size: 0.875rem;
  color: var(--c-text-secondary);
  font-weight: 600;
}

.no-results {
  padding: 2rem 1rem;
  text-align: center;
  color: var(--c-text-muted);
  font-size: 0.875rem;
}

.flex-grow {
  flex: 1;
}

.phone-input {
  padding-left: 1rem !important;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

/* ═══════════════════════════════════════════════════════
   PASSWORD & FORM ROW
═══════════════════════════════════════════════════════ */
.form-row {
  display: flex;
  gap: 1rem;
}

.form-group.half {
  flex: 1;
}

.password-strength {
  height: 4px;
  background: var(--c-border);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 0.5rem;
}

.strength-bar {
  height: 100%;
  transition: all 0.3s;
  border-radius: 2px;
}

.strength-bar.weak {
  background: var(--c-error);
}

.strength-bar.medium {
  background: var(--c-warning);
}

.strength-bar.strong {
  background: var(--c-success);
}

.password-hint {
  font-size: 0.8rem;
  color: var(--c-text-muted);
  margin-top: 0.25rem;
}

/* ═══════════════════════════════════════════════════════
   CHECKBOX & TERMS
═══════════════════════════════════════════════════════ */
.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--c-text-primary);
  margin: 0.5rem 0;
}

.checkbox-input {
  width: 1rem;
  height: 1rem;
  cursor: pointer;
  accent-color: var(--c-accent);
  margin-top: 0.125rem;
  flex-shrink: 0;
}

.terms-checkbox {
  margin: 0.5rem 0;
  font-size: 0.875rem;
}

.terms-checkbox .link {
  color: var(--c-accent);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.terms-checkbox .link:hover {
  text-decoration: underline;
  color: var(--c-accent-hover);
}

/* ═══════════════════════════════════════════════════════
   SUBMIT BUTTON & ALERTS
═══════════════════════════════════════════════════════ */
.submit-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, var(--c-accent-hover) 0%, var(--c-accent) 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(124, 92, 78, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(124, 92, 78, 0.4);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.alert {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 0.5rem;
  animation: slideDown 0.3s ease;
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

.alert.error {
  background: rgba(207, 19, 34, 0.1);
  color: var(--c-error);
  border: 1px solid rgba(207, 19, 34, 0.2);
}

.alert.success {
  background: rgba(45, 106, 80, 0.1);
  color: var(--c-success);
  border: 1px solid rgba(45, 106, 80, 0.2);
}

/* ═══════════════════════════════════════════════════════
   SIGNUP PROMPT
═══════════════════════════════════════════════════════ */
.signup-prompt {
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--c-border);
}

.signup-prompt p {
  font-size: 0.95rem;
  color: var(--c-text-secondary);
}

.signup-link {
  color: var(--c-accent);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.signup-link:hover {
  color: var(--c-accent-hover);
  text-decoration: underline;
}

/* ═══════════════════════════════════════════════════════
   RESPONSIVE
═══════════════════════════════════════════════════════ */
@media (max-width: 1024px) {
  .branding-section {
    display: none;
  }

  .form-section {
    flex: 1;
  }
}

@media (max-width: 480px) {
  .form-section {
    padding: 2rem 1.5rem;
  }

  .form-title {
    font-size: 1.75rem;
  }

  .phone-input-wrapper {
    flex-direction: column;
  }

  .country-btn {
    width: 100%;
  }

  .form-row {
    flex-direction: column;
  }
}

@media (max-height: 900px) {
  .form-section {
    padding: 2rem;
  }

  .form-header {
    margin-bottom: 1.5rem;
  }
}

/* ═══════════════════════════════════════════════════════
   DARK MODE SPECIFIC OVERRIDES
═══════════════════════════════════════════════════════ */
.auth-wrapper.dark-mode .oauth-btn:hover:not(:disabled) {
  border-color: var(--c-accent);
  background: var(--c-accent-subtle);
  box-shadow: 0 4px 12px rgba(196, 144, 110, 0.15);
}

.auth-wrapper.dark-mode .country-option:hover {
  background: var(--c-accent-subtle);
}

.auth-wrapper.dark-mode .submit-btn {
  box-shadow: 0 4px 12px rgba(196, 144, 110, 0.3);
}

.auth-wrapper.dark-mode .submit-btn:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(196, 144, 110, 0.4);
}
</style>
