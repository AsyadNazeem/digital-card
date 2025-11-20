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

    <!-- Right Side - Reset Password Form -->
    <div class="form-section">
      <div class="form-container">
        <!-- Success State -->
        <div v-if="success" class="success-wrapper">
          <div class="success-icon-wrapper">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h2 class="success-title">Password Reset Successful!</h2>
          <p class="success-subtitle">Your password has been updated successfully.</p>
          <router-link to="/login" class="login-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
            <span>Go to Login</span>
          </router-link>
        </div>

        <!-- Reset Password Form -->
        <div v-else class="form-wrapper">
          <div class="form-header">
            <div class="icon-wrapper">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <h2 class="form-title">Create New Password</h2>
            <p class="form-subtitle">Enter your new password below</p>
          </div>

          <form @submit.prevent="handleResetPassword" class="reset-form">
            <div class="form-group">
              <label class="form-label">New Password</label>
              <div class="input-group">
                <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input
                    v-model="newPassword"
                    :type="showPassword ? 'text' : 'password'"
                    class="form-input"
                    placeholder="Enter new password"
                    required
                    minlength="6"
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

            <div class="form-group">
              <label class="form-label">Confirm Password</label>
              <div class="input-group">
                <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input
                    v-model="confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    class="form-input"
                    placeholder="Confirm new password"
                    required
                />
                <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="password-toggle">
                  <svg v-if="!showConfirmPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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

            <div class="password-requirements">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <span>Password must be at least 6 characters long</span>
            </div>

            <button type="submit" class="submit-btn" :disabled="loading">
              <svg v-if="loading" class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="2" x2="12" y2="6"></line>
                <line x1="12" y1="18" x2="12" y2="22"></line>
                <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
              </svg>
              <span v-else>Reset Password</span>
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

          <div class="back-to-login">
            <p>Remember your password? <router-link to="/login" class="login-link">Back to Login</router-link></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../services/api.js'

const router = useRouter()
const route = useRoute()

const newPassword = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const message = ref('')
const messageType = ref('error')
const success = ref(false)
const token = ref('')

onMounted(() => {
  token.value = route.query.token
  if (!token.value) {
    message.value = 'Invalid or missing reset token'
    messageType.value = 'error'
  }
})

async function handleResetPassword() {
  if (loading.value) return

  // Validate passwords match
  if (newPassword.value !== confirmPassword.value) {
    message.value = 'Passwords do not match'
    messageType.value = 'error'
    return
  }

  // Validate password length
  if (newPassword.value.length < 6) {
    message.value = 'Password must be at least 6 characters long'
    messageType.value = 'error'
    return
  }

  try {
    loading.value = true
    message.value = ''

    const res = await api.post('/auth/reset-password', {
      token: token.value,
      newPassword: newPassword.value
    })

    messageType.value = 'success'
    message.value = res.data.message
    success.value = true

  } catch (err) {
    console.error('❌ Reset password error:', err)
    messageType.value = 'error'
    message.value = err.response?.data?.message || 'Failed to reset password. Please try again.'
  } finally {
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

/* Form */
.reset-form {
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
  padding: 0.875rem 3rem 0.875rem 3rem;
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

.password-requirements {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #9b8b7e;
  margin-top: -0.5rem;
}

.password-requirements svg {
  flex-shrink: 0;
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

/* Back to Login */
.back-to-login {
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e1dc;
}

.back-to-login p {
  font-size: 0.95rem;
  color: #6b5d57;
}

.login-link {
  color: #5c4033;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.login-link:hover {
  color: #3e2a23;
  text-decoration: underline;
}

/* Success State */
.success-wrapper {
  text-align: center;
}

.success-icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
  border-radius: 50%;
  margin-bottom: 2rem;
  box-shadow: 0 8px 24px rgba(82, 196, 26, 0.3);
  animation: scaleIn 0.5s ease;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.success-icon-wrapper svg {
  color: white;
}

.success-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2d1f1a;
  margin-bottom: 0.5rem;
}

.success-subtitle {
  font-size: 1rem;
  color: #6b5d57;
  margin-bottom: 2rem;
}

.login-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #5c4033 0%, #3e2a23 100%);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(92, 64, 51, 0.3);
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(92, 64, 51, 0.4);
}

/* Responsive */
@media (max-width: 1024px) {
  .branding-section {
    display: none;
  }
}

@media (max-width: 480px) {
  .form-section {
    padding: 2rem 1.5rem;
  }

  .form-title {
    font-size: 1.75rem;
  }

  .success-title {
    font-size: 1.75rem;
  }

  .icon-wrapper {
    width: 70px;
    height: 70px;
  }

  .icon-wrapper svg {
    width: 40px;
    height: 40px;
  }

  .success-icon-wrapper {
    width: 80px;
    height: 80px;
  }

  .success-icon-wrapper svg {
    width: 48px;
    height: 48px;
  }
}
</style>
