<template>
  <div class="admin-wrapper">
    <!-- Left Side - Branding -->
    <div class="admin-branding">
      <div class="branding-content">
        <div class="logo-container">
          <img src="/images/logo.jpeg" alt="TapMyName" class="admin-logo" />
        </div>
        <h1 class="admin-brand-title">Admin Portal</h1>
        <p class="admin-brand-description">
          Secure access to your administrative dashboard. Manage users, content,
          and monitor system performance from one centralized location.
        </p>
        <div class="security-features">
          <div class="security-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <span>Secure authentication</span>
          </div>
          <div class="security-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <span>Encrypted connections</span>
          </div>
          <div class="security-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
            <span>Activity monitoring</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Side - Login Form -->
    <div class="admin-form-section">
      <div class="form-container">
        <div class="form-header">
          <div class="admin-icon-badge">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
          </div>
          <h2 class="form-title">Admin Sign In</h2>
          <p class="form-subtitle">Enter your credentials to access the dashboard</p>
        </div>

        <form @submit.prevent="login" class="admin-form">
          <div class="form-group">
            <label for="username" class="form-label">Username or Email</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <input
                  id="username"
                  v-model="usernameOrEmail"
                  type="text"
                  class="form-input"
                  placeholder="Enter your username or email"
                  required
                  autocomplete="username"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-input"
                  placeholder="Enter your password"
                  required
                  autocomplete="current-password"
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

          <button type="submit" class="submit-btn" :disabled="isLoading">
            <svg v-if="isLoading" class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="2" x2="12" y2="6"></line>
              <line x1="12" y1="18" x2="12" y2="22"></line>
              <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
              <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
            </svg>
            <span v-else>Sign In to Dashboard</span>
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

        <div class="security-notice">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <span>This is a restricted area. All access is monitored and logged.</span>
        </div>

        <div class="footer-text">
          <p>© 2024 TapMyName Admin Dashboard</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import adminApi from "../../services/adminApi.js"

const router = useRouter()
const usernameOrEmail = ref("")
const password = ref("")
const message = ref("")
const messageType = ref("error")
const isLoading = ref(false)
const showPassword = ref(false)

async function login() {
  try {
    isLoading.value = true
    message.value = ""
    console.log("🔹 Attempting admin login...")

    const res = await adminApi.post("/auth/login", {
      usernameOrEmail: usernameOrEmail.value.trim(),
      password: password.value.trim(),
    })

    console.log("✅ Login success:", res.data)

    // Store token
    localStorage.setItem("adminToken", res.data.token)
    localStorage.setItem("adminUser", JSON.stringify(res.data.admin))

    // Show success message
    messageType.value = "success"
    message.value = "Login successful! Redirecting..."

    // Navigate to dashboard
    setTimeout(() => {
      router.push("/admin/dashboard")
    }, 1000)

  } catch (err) {
    console.error("❌ Login error:", err.response?.data || err)
    messageType.value = "error"
    message.value = err.response?.data?.message || "Login failed. Please check your credentials."
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.admin-wrapper {
  min-height: 98vh;
  display: flex;
  background: #f5f5f0;
}

/* Left Side - Branding */
.admin-branding {
  flex: 1;
  background: linear-gradient(135deg, #2d1f1a 0%, #1a1310 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 3rem;
  position: relative;
  overflow: hidden;
}

.admin-branding::before {
  content: '';
  position: absolute;
  width: 500px;
  height: 500px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 50%;
  top: -200px;
  right: -200px;
}

.admin-branding::after {
  content: '';
  position: absolute;
  width: 400px;
  height: 400px;
  background: rgba(255, 255, 255, 0.02);
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

.admin-logo {
  width: 280px;
  height: auto;
  filter: brightness(1.2);
}

.admin-brand-title {
  font-size: 2.75rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #f5e6d3;
  letter-spacing: -0.5px;
}

.admin-brand-description {
  font-size: 1.1rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 2.5rem;
}

.security-features {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.security-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
}

.security-item svg {
  flex-shrink: 0;
  color: #d4af37;
}

/* Right Side - Form */
.admin-form-section {
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

.form-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.admin-icon-badge {
  width: 72px;
  height: 72px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, #2d1f1a 0%, #1a1310 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(45, 31, 26, 0.2);
  color: #d4af37;
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
.admin-form {
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

.input-wrapper {
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
  border-color: #2d1f1a;
  background: white;
  box-shadow: 0 0 0 4px rgba(45, 31, 26, 0.1);
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
  color: #2d1f1a;
}

/* Submit Button */
.submit-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #2d1f1a 0%, #1a1310 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(45, 31, 26, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(45, 31, 26, 0.4);
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
  margin-top: 1rem;
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

/* Security Notice */
.security-notice {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 2rem;
  padding: 1rem;
  background: #fffbeb;
  border: 1px solid #fef3c7;
  border-radius: 12px;
  font-size: 0.85rem;
  color: #92400e;
}

.security-notice svg {
  flex-shrink: 0;
  color: #f59e0b;
}

/* Footer */
.footer-text {
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e1dc;
}

.footer-text p {
  font-size: 0.875rem;
  color: #9b8b7e;
}

/* Responsive */
@media (max-width: 1024px) {
  .admin-branding {
    display: none;
  }

  .admin-form-section {
    flex: 1;
  }
}

@media (max-width: 480px) {
  .admin-form-section {
    padding: 2rem 1.5rem;
  }

  .form-title {
    font-size: 1.75rem;
  }

  .admin-icon-badge {
    width: 64px;
    height: 64px;
  }
}
</style>
