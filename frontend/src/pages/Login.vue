<template>
  <div class="auth-wrapper">
    <!-- Left Side - Branding -->
    <div class="branding-section">
      <div class="branding-content">
        <div class="logo-container">
          <img src="/images/logo.jpeg" alt="TapMyName" class="main-logo" />
        </div>
        <h1 class="brand-title">Digital Business Cards</h1>
        <p class="brand-description">
          Create, share, and manage your professional digital contact cards with ease.
          Make networking seamless and eco-friendly.
        </p>
        <div class="features">
          <div class="feature-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>Instant sharing via NFC & QR</span>
          </div>
          <div class="feature-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>Customizable themes</span>
          </div>
          <div class="feature-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>Real-time updates</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Side - Login/Forgot Password Form -->
    <div class="form-section">
      <div class="form-container">
        <!-- Login Form -->
        <div v-if="!showForgotPassword" class="form-wrapper">
          <div class="form-header">
            <h2 class="form-title">Welcome Back</h2>
            <p class="form-subtitle">Sign in to continue to your account</p>
          </div>

          <!-- Google Login -->
          <button class="google-btn" @click="handleGoogleLogin" :disabled="loading">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" class="google-icon" />
            <span>Continue with Google</span>
          </button>

          <div class="divider">
            <span>or sign in with email</span>
          </div>

          <!-- Login Form -->
          <form @submit.prevent="login" class="login-form">
            <div class="form-group">
              <label class="form-label">Email or Phone Number</label>
              <div class="input-group">
                <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <input
                    v-model="identifier"
                    type="text"
                    class="form-input"
                    placeholder="Enter your email or phone"
                    required
                />
              </div>
              <div class="input-hint">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <span>Use format: +12154567890 for phone</span>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Password</label>
              <div class="input-group">
                <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    class="form-input"
                    placeholder="Enter your password"
                    required
                />
                <button type="button" @click="showPassword = !showPassword" class="password-toggle">
                  <svg v-if="!showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                </button>
              </div>
            </div>

            <div class="form-options">
              <label class="checkbox-label">
                <input type="checkbox" class="checkbox-input" />
                <span>Remember me</span>
              </label>
              <a href="#" @click.prevent="showForgotPassword = true" class="forgot-link">Forgot password?</a>
            </div>

            <button type="submit" class="submit-btn" :disabled="loading">
              <svg v-if="loading" class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="2" x2="12" y2="6"></line>
                <line x1="12" y1="18" x2="12" y2="22"></line>
                <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
              </svg>
              <span v-else>Sign In</span>
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
            <p>Don't have an account? <router-link to="/register" class="signup-link">Create one</router-link></p>
          </div>
        </div>

        <!-- Forgot Password Form -->
        <div v-else class="form-wrapper forgot-password-wrapper">
          <button @click="showForgotPassword = false" class="back-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Back to Login</span>
          </button>

          <div class="form-header">
            <div class="icon-wrapper">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <h2 class="form-title">Forgot Password?</h2>
            <p class="form-subtitle">No worries! Enter your email and we'll send you a reset link.</p>
          </div>

          <form @submit.prevent="handleForgotPassword" class="login-form">
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <div class="input-group">
                <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <input
                    v-model="resetEmail"
                    type="email"
                    class="form-input"
                    placeholder="Enter your email address"
                    required
                />
              </div>
            </div>

            <button type="submit" class="submit-btn" :disabled="loading">
              <svg v-if="loading" class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="2" x2="12" y2="6"></line>
                <line x1="12" y1="18" x2="12" y2="22"></line>
                <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
              </svg>
              <span v-else>Send Reset Link</span>
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

          <div class="help-text">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <div>
              <p><strong>Note:</strong> If you signed up with Google, please use the "Continue with Google" button to login.</p>
              <p style="margin-top: 0.5rem;">Check your spam folder if you don't receive the email within 5 minutes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const identifier = ref('')
const password = ref('')
const resetEmail = ref('')
const message = ref('')
const messageType = ref('error')
const showPassword = ref(false)
const showForgotPassword = ref(false)
const loading = ref(false)

async function login() {
  if (loading.value) return

  try {
    loading.value = true
    message.value = ''

    const res = await api.post('/auth/login', {
      identifier: identifier.value.trim(),
      password: password.value.trim(),
    })

    const token = res.data.token
    if (!token) {
      throw new Error("No token received from backend")
    }

    localStorage.setItem('token', token)
    messageType.value = 'success'
    message.value = 'Login successful! Redirecting...'

    setTimeout(() => {
      router.push('/dashboard')
    }, 800)
  } catch (err) {
    console.error("❌ Login error:", err)
    messageType.value = 'error'
    message.value =
        err.response?.data?.message ||
        err.message ||
        'Login failed. Please check your credentials.'
  } finally {
    loading.value = false
  }
}

async function handleForgotPassword() {
  if (loading.value) return

  try {
    loading.value = true
    message.value = ''

    const res = await api.post('/auth/forgot-password', {
      email: resetEmail.value.trim()
    })

    messageType.value = 'success'
    message.value = res.data.message || 'Password reset link sent! Check your email.'

    setTimeout(() => {
      showForgotPassword.value = false
      resetEmail.value = ''
      message.value = ''
    }, 3000)
  } catch (err) {
    console.error("❌ Forgot password error:", err)
    messageType.value = 'error'
    message.value =
        err.response?.data?.message ||
        err.message ||
        'Failed to send reset link. Please try again.'
  } finally {
    loading.value = false
  }
}

async function handleGoogleLogin() {
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
    console.error("❌ Google Login Error:", err)
    messageType.value = "error"
    message.value = err.message || "Google Sign-In failed. Please try again."
    loading.value = false
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.auth-wrapper {
  min-height: 100vh;
  display: flex;
  background: #f5f5f0;
}

/* Left Side - Branding */
.branding-section {
  flex: 1;
  background: linear-gradient(135deg, #5c4033 0%, #3e2a23 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 3rem;
  position: relative;
  overflow: hidden;
}

.branding-section::before {
  content: '';
  position: absolute;
  width: 500px;
  height: 500px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  top: -200px;
  right: -200px;
}

.branding-section::after {
  content: '';
  position: absolute;
  width: 400px;
  height: 400px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 50%;
  bottom: -150px;
  left: -150px;
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
}

.brand-description {
  font-size: 1.1rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2.5rem;
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
  color: #d4af37;
}

/* Right Side - Form */
.form-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  background: #ffffff;
}

.form-container {
  width: 100%;
  max-width: 460px;
}

.form-wrapper {
  position: relative;
}

.form-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.form-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2d1f1a;
  margin-bottom: 0.5rem;
}

.form-subtitle {
  font-size: 1rem;
  color: #6b5d57;
}

/* Icon Wrapper for Forgot Password */
.icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #5c4033 0%, #3e2a23 100%);
  border-radius: 20px;
  margin-bottom: 1.5rem;
  box-shadow: 0 8px 24px rgba(92, 64, 51, 0.25);
}

.icon-wrapper svg {
  color: #f5e6d3;
}

/* Back Button */
.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  background: none;
  border: none;
  color: #5c4033;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 1.5rem;
  transition: all 0.2s;
}

.back-button:hover {
  color: #3e2a23;
  transform: translateX(-4px);
}

.back-button svg {
  transition: transform 0.2s;
}

.back-button:hover svg {
  transform: translateX(-2px);
}

/* Google Button */
.google-btn {
  width: 100%;
  padding: 0.875rem 1.5rem;
  background: white;
  border: 2px solid #e5e1dc;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  color: #2d1f1a;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  transition: all 0.3s;
  margin-bottom: 1.5rem;
}

.google-btn:hover:not(:disabled) {
  border-color: #5c4033;
  background: #fafaf8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(92, 64, 51, 0.15);
}

.google-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.google-icon {
  width: 20px;
  height: 20px;
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
  background: #e5e1dc;
}

.divider span {
  position: relative;
  background: white;
  padding: 0 1rem;
  font-size: 0.875rem;
  color: #6b5d57;
  font-weight: 500;
}

/* Form */
.login-form {
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
  color: #2d1f1a;
}

.input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  color: #9b8b7e;
  pointer-events: none;
  z-index: 1;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  background: #fafaf8;
  border: 2px solid #e5e1dc;
  border-radius: 12px;
  font-size: 0.95rem;
  color: #2d1f1a;
  transition: all 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #5c4033;
  background: white;
  box-shadow: 0 0 0 4px rgba(92, 64, 51, 0.1);
}

.form-input::placeholder {
  color: #9b8b7e;
}

.input-hint {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #9b8b7e;
  margin-top: 0.25rem;
}

.input-hint svg {
  flex-shrink: 0;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: #9b8b7e;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
  z-index: 1;
}

.password-toggle:hover {
  color: #5c4033;
}

/* Form Options */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: #2d1f1a;
}

.checkbox-input {
  width: 1rem;
  height: 1rem;
  cursor: pointer;
  accent-color: #5c4033;
}

.forgot-link {
  font-size: 0.875rem;
  color: #5c4033;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.forgot-link:hover {
  color: #3e2a23;
  text-decoration: underline;
}

/* Submit Button */
.submit-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #5c4033 0%, #3e2a23 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(92, 64, 51, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(92, 64, 51, 0.4);
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

/* Alert */
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
  background: #fff1f0;
  color: #cf1322;
  border: 1px solid #ffccc7;
}

.alert.success {
  background: #f6ffed;
  color: #389e0d;
  border: 1px solid #b7eb8f;
}

/* Help Text */
.help-text {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: #fafaf8;
  border-radius: 12px;
  margin-top: 1.5rem;
  border: 1px solid #e5e1dc;
}

.help-text svg {
  flex-shrink: 0;
  color: #9b8b7e;
  margin-top: 0.1rem;
}

.help-text p {
  font-size: 0.875rem;
  color: #6b5d57;
  line-height: 1.5;
  margin: 0;
}

/* Signup Prompt */
.signup-prompt {
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e1dc;
}

.signup-prompt p {
  font-size: 0.95rem;
  color: #6b5d57;
}

.signup-link {
  color: #5c4033;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.signup-link:hover {
  color: #3e2a23;
  text-decoration: underline;
}

/* Forgot Password Specific Styles */
.forgot-password-wrapper .form-header {
  margin-bottom: 2rem;
}

.forgot-password-wrapper .login-form {
  gap: 1.5rem;
}

/* Responsive */
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

  .main-logo {
    width: 220px;
  }

  .icon-wrapper {
    width: 70px;
    height: 70px;
  }

  .icon-wrapper svg {
    width: 40px;
    height: 40px;
  }
}
</style>
