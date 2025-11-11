<template>
  <div class="auth-wrapper">
    <div class="auth-container">
      <!-- Logo/Brand Section -->
      <div class="auth-header">
        <div class="brand-logo">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="8.5" cy="7" r="4"></circle>
            <line x1="20" y1="8" x2="20" y2="14"></line>
            <line x1="23" y1="11" x2="17" y2="11"></line>
          </svg>
        </div>
        <h2 class="auth-title">Create Account</h2>
        <p class="auth-subtitle">Join us today and get started</p>
      </div>

      <!-- Register Form Card -->
      <div class="auth-card">
        <div class="form-container">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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

          <div class="form-group">
            <label class="form-label">Email Address</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <input
                  v-model="email"
                  type="email"
                  class="form-input"
                  placeholder="Enter your email"
                  required
                  :disabled="otpSent && !otpVerified"
              />
              <button
                  v-if="!otpVerified"
                  type="button"
                  class="send-otp-button"
                  @click="sendOtp"
                  :disabled="sendingOtp"
              >
                <span v-if="!sendingOtp">Verify Email</span>
                <span v-else>Sending...</span>
              </button>

              <span v-if="otpVerified" class="otp-send-btn verified-icon">✅</span>
            </div>

            <!-- OTP Field -->
            <div v-if="otpSent && !otpVerified" class="otp-field">
              <label class="form-label">Enter OTP</label>
              <div class="input-wrapper">
                <input
                    v-model="otp"
                    type="text"
                    class="form-input"
                    placeholder="Enter OTP"
                />
                <button
                    type="button"
                    class="verify-button"
                    @click="verifyOtp"
                    :disabled="verifyingOtp"
                >
                  <span v-if="!verifyingOtp">Verify OTP</span>
                  <span v-else>Verifying...</span>
                </button>

              </div>
            </div>

            <p v-if="otpMessage" :class="['otp-message', otpVerified ? 'success' : 'error']">
              {{ otpMessage }}
            </p>
          </div>


          <div class="form-group">
            <label class="form-label">Phone Number</label>
            <div class="input-wrapper phone-input-group">
              <svg
                  class="input-icon"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
              >
                <path
                    d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                ></path>
              </svg>

              <!-- ✅ Searchable Country Code Dropdown -->
              <div class="country-dropdown-wrapper" ref="dropdownRef">
                <div class="country-trigger" @click="toggleDropdown">
                  <span class="selected-country">{{ selectedCountry?.name || '+94' }}</span>
                  <svg
                      class="dropdown-arrow"
                      :class="{ 'rotate': isDropdownOpen }"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>

                <!-- Dropdown Menu -->
                <transition name="dropdown-slide">
                  <div v-if="isDropdownOpen" class="country-dropdown-menu" @click="handleDropdownClick">
                    <div class="search-box">
                      <svg
                          class="search-icon"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                      >
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                      </svg>
                      <input
                          ref="searchInputRef"
                          v-model="searchQuery"
                          type="text"
                          class="search-input"
                          placeholder="Search country..."
                      />
                    </div>

                    <div class="country-list">
                      <div
                          v-for="country in filteredCountries"
                          :key="country.code + country.name"
                          class="country-item"
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

              <!-- 📱 Phone Input -->
              <input
                  v-model="phone"
                  type="tel"
                  class="form-input phone-number-input"
                  placeholder="Enter your phone number"
                  required
              />
            </div>
          </div>


          <div class="form-group">
            <label class="form-label">Password</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-input password-input"
                  placeholder="Create a strong password"
                  required
              />
              <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="password-toggle"
              >
                <svg v-if="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              </button>
            </div>
            <div class="password-strength">
              <div class="strength-bar" :class="passwordStrength.class" :style="{ width: passwordStrength.width }"></div>
            </div>
            <p class="password-hint">{{ passwordStrength.text }}</p>
          </div>

          <div class="form-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" class="checkbox-input" v-model="agreeTerms" required />
              <span class="checkbox-label">
                I agree to the <a href="#" class="terms-link">Terms of Service</a> and <a href="#" class="terms-link">Privacy Policy</a>
              </span>
            </label>
          </div>

          <button @click="register" class="btn-register" :disabled="!agreeTerms || loading">
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
            <span v-else>Create Account</span>
          </button>

          <!-- Google Register -->
          <div class="social-login">
            <button class="google-btn" @click="handleGoogleRegister">
              <img class="g-image" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
              Continue with Google
            </button>
          </div>


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

        <!-- Divider -->
        <div class="divider">
          <span>or</span>
        </div>

        <!-- Login Link -->
        <div class="login-section">
          <p class="login-text">Already have an account?</p>
          <router-link to="/login" class="login-link">
            Sign in instead
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </router-link>
        </div>
      </div>

      <!-- Footer -->
      <div class="auth-footer">
        <p>&copy; 2024 Contact Card. All rights reserved.</p>
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import countriesData from '../assets/country_code.json' // ✅ Import JSON file

const router = useRouter()

// Form fields
const countryCode = ref("+94");
const name = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')

// UI states
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

// ✅ Country dropdown states
const isDropdownOpen = ref(false)
const searchQuery = ref('')
const dropdownRef = ref(null)
const searchInputRef = ref(null)

// ✅ Load countries from JSON file
const allCountries = ref(
    countriesData.map(country => ({
      flag: country.flag,
      name: `${country.flag} ${country.code}`,
      fullName: country.name,
      code: country.code,
      searchText: country.name.toLowerCase()
    }))
);

// Filtered countries based on search
const normalize = str =>
    str.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

const filteredCountries = computed(() => {
  const query = normalize(searchQuery.value.trim());
  if (!query) return allCountries.value;

  return allCountries.value.filter((country) =>
      [country.fullName, country.code].some(field =>
          normalize(field).includes(query)
      )
  );
});


// Selected country display
const selectedCountry = computed(() => {
  return allCountries.value.find(c => c.code === countryCode.value)
})

// Toggle dropdown
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

// Select country
function selectCountry(country) {
  countryCode.value = country.code
  isDropdownOpen.value = false
  searchQuery.value = ''
}

// Close dropdown when clicking outside
function handleClickOutside(event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false
    searchQuery.value = ''
  }
}

// Prevent dropdown from closing when clicking inside
function handleDropdownClick(event) {
  event.stopPropagation()
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  console.log('✅ Loaded', allCountries.value.length, 'countries')
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// ✅ FIXED: Only reset OTP if email actually changes from verified email
watch(email, (newEmail) => {
  // Only reset if the email is different from the one that was verified
  if (otpVerified.value && newEmail.trim() !== verifiedEmail.value) {
    otpVerified.value = false
    otpSent.value = false
    otp.value = ''
    otpMessage.value = 'Email changed. Please verify your new email.'
    verifiedEmail.value = ''
  }
})

async function handleGoogleRegister() {
  try {
    loading.value = true;
    message.value = "";

    console.log("🔵 Starting Google Sign-In...");

    // Load Google script dynamically
    if (!window.google) {
      console.log("🔵 Loading Google SDK...");
      await new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.onload = resolve;
        script.onerror = () => {
          throw new Error("Failed to load Google SDK");
        };
        document.head.appendChild(script);
      });
      console.log("✅ Google SDK loaded");
    }

    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    console.log("🔵 Google Client ID:", GOOGLE_CLIENT_ID);

    if (!GOOGLE_CLIENT_ID) {
      throw new Error("Google Client ID not configured");
    }

    const client = window.google.accounts.oauth2.initCodeClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: "openid email profile",
      ux_mode: "popup",
      callback: async (response) => {
        try {
          if (response.error) {
            console.error("❌ Google OAuth error:", response.error);
            throw new Error(response.error);
          }

          if (!response.code) {
            throw new Error("No authorization code received");
          }

          console.log("✅ Got authorization code from Google");
          console.log("🔵 Sending to backend...");

          const res = await api.post("/auth/google-register", {
            code: response.code
          });

          console.log("✅ Backend response:", res.data);

          if (res.data.success && res.data.token) {
            // Store JWT token
            localStorage.setItem("token", res.data.token);

            // Store user info if needed
            if (res.data.user) {
              localStorage.setItem("user", JSON.stringify(res.data.user));
            }

            messageType.value = "success";
            message.value = "Successfully signed in with Google!";

            // Redirect after a short delay
            setTimeout(() => {
              router.push("/dashboard");
            }, 1000);
          } else {
            throw new Error("Invalid response from server");
          }

        } catch (err) {
          console.error("❌ Callback error:", err);
          messageType.value = "error";
          message.value = err.response?.data?.message || "Google Sign-In failed. Please try again.";
        } finally {
          loading.value = false;
        }
      },
    });

    console.log("🔵 Requesting authorization code...");
    client.requestCode();

  } catch (err) {
    console.error("❌ Google Register Error:", err);
    messageType.value = "error";
    message.value = err.message || "Google Sign-In failed. Please try again.";
    loading.value = false;
  }
}

// Send OTP
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
    otpMessage.value = err.response?.data?.message || "Failed to send OTP. Please check the email address."
  } finally {
    sendingOtp.value = false
  }
}

// Verify OTP
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

    console.log('📤 Sending OTP verification request:', { email: emailValue, otp: otpValue })

    const res = await api.post('/otp/verify', {
      email: emailValue,
      otp: otpValue,
    })

    console.log('📥 OTP Verify Full Response:', res) // Full response object
    console.log('📥 OTP Verify Response Data:', res.data) // Just the data
    console.log('📥 Success value:', res.data.success)
    console.log('📥 Success type:', typeof res.data.success)
    console.log('📥 OTP Verify Response:', res.data);
    console.log('📥 OTP Verify success value:', res.data.success);
    console.log('📥 OTP Verify status:', res.status);


    // Check multiple conditions
    if (res.data && (res.data.success === true || res.data.success === 'true')) {
      console.log('✅ Setting otpVerified to TRUE')
      otpVerified.value = true
      verifiedEmail.value = emailValue
      otpMessage.value = res.data.message || "✅ Email verified successfully!"
      console.log('✅ otpVerified is now TRUE')
    } else {
      console.log('❌ OTP verification failed:', res.data)
      otpVerified.value = false
      otpMessage.value = res.data?.message || "Invalid OTP."
    }
  } catch (err) {
    console.error('❌ Verify OTP error:', err)
    console.error('❌ Error response:', err.response)
    otpVerified.value = false
    otpMessage.value = err.response?.data?.message || "Invalid OTP or Server Error."
  } finally {
    verifyingOtp.value = false
    console.log('🏁 Final otpVerified state:', otpVerified.value)
  }
}

// Password Strength
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

// Register user (requires verified OTP)
async function register() {
  console.log('Register clicked. OTP Verified:', otpVerified.value) // ✅ Debug log

  // 1. Check all fields are filled
  if (!name.value.trim() || !email.value.trim() || !phone.value.trim() || !password.value.trim()) {
    messageType.value = 'error'
    message.value = 'Please fill out all required fields (Name, Email, Phone, Password).'
    return
  }

  // 2. Check password strength
  if (passwordStrength.value.class === 'weak') {
    messageType.value = 'error'
    message.value = 'Please choose a stronger password.'
    return
  }

  // 3. Check OTP verification status
  if (!otpVerified.value) {
    messageType.value = 'error'
    message.value = 'Please verify your email address before registering.'
    return
  }

  // 4. Ensure email hasn't changed since verification
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
</script>


<style scoped>
* {
  box-sizing: border-box;
}

.auth-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 1rem;
}

.auth-container {
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.verify-button {
  background-color: #2563eb; /* Blue */
  color: #ffffff; /* White text */
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.25s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.verify-button:hover:not(:disabled) {
  background-color: #000000; /* Black on hover */
  color: #ffffff; /* White text stays */
}

.send-otp-button {
  background-color: #2563eb; /* Blue */
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.25s;
  margin-left: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.send-otp-button:hover:not(:disabled) {
  background-color: #000000; /* Hover Black */
  color: white;
}

.send-otp-button:disabled {
  background-color: #9ca3af; /* Disabled Gray */
  cursor: not-allowed;
}

.verified-email-icon {
  margin-left: 8px;
  font-size: 20px;
  color: #22c55e; /* Green */
}


.verify-button:disabled {
  background-color: #9ca3af; /* Disabled gray */
  cursor: not-allowed;
}

.phone-input-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
}

.input-icon {
  color: #94a3b8;
  flex-shrink: 0;
}

/* Country Dropdown Styles */
.country-dropdown-wrapper {
  position: relative;
  flex-shrink: 0;
}

.country-trigger {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 0.75rem;
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 100px;
  user-select: none;
}

.country-trigger:hover {
  border-color: #94a3b8;
  background: #f8fafc;
}

.selected-country {
  font-size: 0.875rem;
  font-weight: 500;
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
  top: calc(100% + 0.5rem);
  left: 0;
  width: 320px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
}

.search-box {
  position: relative;
  padding: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
}

.search-icon {
  position: absolute;
  left: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.5rem 0.75rem 0.5rem 2rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  outline: none;
  transition: all 0.2s;
}

.search-input:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.country-list {
  max-height: 280px;
  overflow-y: auto;
}

.country-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background 0.15s;
  border-bottom: 1px solid #f1f5f9;
}

.country-item:last-child {
  border-bottom: none;
}

.country-item:hover {
  background: #f8fafc;
}

.country-item.active {
  background: #eef2ff;
  border-left: 3px solid #4f46e5;
}

.country-flag {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.country-name {
  flex: 1;
  font-size: 0.875rem;
  color: #0f172a;
}

.country-code {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
  flex-shrink: 0;
}

.no-results {
  padding: 2rem 1rem;
  text-align: center;
  color: #94a3b8;
  font-size: 0.875rem;
}

.phone-number-input {
  flex: 1;
}

/* Dropdown transition */
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

/* Scrollbar styling */
.country-list::-webkit-scrollbar {
  width: 6px;
}

.country-list::-webkit-scrollbar-track {
  background: #f8fafc;
}

.country-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.country-list::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}



/* Google Button */
.social-login-top {
  margin-bottom: 0.5rem;
}

.g-image{
  width: 18px;
}

.google-btn {
  width: 100%;
  padding: 0.875rem;
  background: white;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  transition: all 0.2s;
}

.google-btn:hover:not(:disabled) {
  border-color: #cbd5e1;
  background: #f8fafc;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.google-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Header */
.auth-header {
  text-align: center;
  color: white;
}

.brand-logo {
  margin: 0 auto 1rem;
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.auth-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: white;
}

.auth-subtitle {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

.otp-send-btn, .otp-verify-btn {
  position: absolute;
  right: 0.5rem;
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
}

.otp-field {
  margin-top: 1rem;
}

.otp-message {
  margin-top: 0.25rem;
  font-size: 0.875rem;
}

.otp-message.success {
  color: #16a34a;
}

.otp-message.error {
  color: #dc2626;
}


/* Card */
.auth-card {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

/* Form */
.form-container {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #334155;
  text-align: left;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  color: #94a3b8;
  pointer-events: none;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  background: white;
  border: 1.5px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  transition: all 0.2s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.password-input {
  padding-right: 3rem;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.password-toggle:hover {
  color: #667eea;
}

/* Password Strength */
.password-strength {
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
  margin-top: 0.25rem;
}

.strength-bar {
  height: 100%;
  transition: all 0.3s;
  border-radius: 2px;
}

.strength-bar.weak {
  background: #ef4444;
}

.strength-bar.medium {
  background: #f59e0b;
}

.strength-bar.strong {
  background: #10b981;
}

.password-hint {
  font-size: 0.75rem;
  color: #64748b;
  margin: 0;
  text-align: left;
}

/* Checkbox */
.checkbox-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
}

.checkbox-input {
  width: 1rem;
  height: 1rem;
  cursor: pointer;
  accent-color: #667eea;
  margin-top: 0.125rem;
  flex-shrink: 0;
}

.checkbox-label {
  font-size: 0.875rem;
  color: #64748b;
  text-align: left;
  line-height: 1.4;
}

.terms-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.terms-link:hover {
  text-decoration: underline;
}

/* Register Button */
.btn-register {
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-register:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.btn-register:active:not(:disabled) {
  transform: translateY(0);
}

.btn-register:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Message Box */
.message-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
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
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.message-box.success {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}

/* Divider */
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
  background: #e2e8f0;
}

.divider span {
  position: relative;
  background: white;
  padding: 0 1rem;
  font-size: 0.875rem;
  color: #94a3b8;
  font-weight: 500;
}

/* Login Section */
.login-section {
  text-align: center;
}

.login-text {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 0.75rem 0;
}

.login-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.2s;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
}

.login-link:hover {
  background: #f1f5f9;
  color: #764ba2;
}

/* Footer */
.auth-footer {
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
}

.auth-footer p {
  margin: 0;
}

/* Responsive */
@media (max-width: 480px) {
  .auth-wrapper {
    padding: 1rem 0.5rem;
  }

  .auth-card {
    padding: 1.5rem;
  }

  .auth-title {
    font-size: 1.75rem;
  }

  .brand-logo {
    width: 56px;
    height: 56px;
  }

  .form-container {
    gap: 1rem;
  }
}

@media (max-height: 800px) {
  .auth-wrapper {
    padding: 1rem;
  }

  .auth-header {
    margin-bottom: 1rem;
  }

  .brand-logo {
    width: 48px;
    height: 48px;
    margin-bottom: 0.5rem;
  }

  .auth-title {
    font-size: 1.5rem;
    margin-bottom: 0.25rem;
  }

  .auth-subtitle {
    font-size: 0.875rem;
  }

  .form-container {
    gap: 1rem;
  }
}
</style>
