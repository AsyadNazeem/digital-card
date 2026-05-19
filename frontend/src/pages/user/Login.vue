<template>
  <div class="auth-wrapper" :class="{ 'dark-mode': isDark }">

    <!-- Left Side - Branding -->
    <div class="branding-section">
      <div class="branding-content">
        <div class="logo-container">
          <img src="/images/logo.jpeg" alt="TapMyName" class="main-logo" />
        </div>
        <h1 class="brand-title">Welcome Back</h1>
        <p class="brand-description">
          Sign back into your digital identity hub. Your contacts, cards,
          and analytics are waiting — pick up right where you left off.
        </p>
        <div class="features">
          <div class="feature-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <span>Instant sharing via QR</span>
          </div>
          <div class="feature-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <span>Apple &amp; Google Wallet passes</span>
          </div>
          <div class="feature-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <span>Real-time analytics</span>
          </div>
          <div class="feature-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <span>Team &amp; company management</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Side - Form -->
    <div class="form-section">
      <div class="form-container">

        <!-- ── LOGIN FORM ── -->
        <div v-if="!showForgotPassword" class="form-wrapper">
          <div class="form-header">
            <h2 class="form-title">Sign In</h2>
            <p class="form-subtitle">Continue to your TapMyName dashboard</p>
          </div>

          <!-- Google -->
          <button class="oauth-btn google-btn" @click="handleGoogleLogin" :disabled="loading">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" class="oauth-icon" />
            <span>Continue with Google</span>
          </button>

          <Applesigninbutton />

          <div class="divider"><span>or sign in with email</span></div>

          <form @submit.prevent="login" class="login-form">

            <!-- Identifier -->
            <div class="form-group">
              <label class="form-label">Email or Phone Number</label>
              <div class="input-group">
                <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
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
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <span>Use format: +12154567890 for phone</span>
              </div>
            </div>

            <!-- Password -->
            <div class="form-group">
              <label class="form-label">Password</label>
              <div class="input-group">
                <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
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
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Options row -->
            <div class="form-options">
              <label class="checkbox-label">
                <input type="checkbox" class="checkbox-input" v-model="rememberMe" />
                <span>Remember me</span>
              </label>
              <a href="#" @click.prevent="showForgotPassword = true" class="forgot-link">Forgot password?</a>
            </div>

            <!-- Submit -->
            <button type="submit" class="submit-btn" :disabled="loading">
              <svg v-if="loading" class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="2" x2="12" y2="6"/>
                <line x1="12" y1="18" x2="12" y2="22"/>
                <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
                <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
              </svg>
              <span v-else>Sign In</span>
            </button>

            <!-- Alert -->
            <div v-if="message" class="alert" :class="messageType">
              <svg v-if="messageType === 'error'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <span>{{ message }}</span>
            </div>
          </form>

          <div class="signup-prompt">
            <p>Don't have an account? <router-link to="/register" class="signup-link">Create one</router-link></p>
          </div>
        </div>

        <!-- ── FORGOT PASSWORD ── -->
        <div v-else class="form-wrapper">
          <button @click="showForgotPassword = false" class="back-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            <span>Back to Login</span>
          </button>

          <div class="form-header">
            <div class="icon-wrapper">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <h2 class="form-title">Forgot Password?</h2>
            <p class="form-subtitle">No worries — we'll send you a reset link.</p>
          </div>

          <form @submit.prevent="handleForgotPassword" class="login-form">
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <div class="input-group">
                <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
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
                <line x1="12" y1="2" x2="12" y2="6"/>
                <line x1="12" y1="18" x2="12" y2="22"/>
                <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
                <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
              </svg>
              <span v-else>Send Reset Link</span>
            </button>

            <div v-if="message" class="alert" :class="messageType">
              <svg v-if="messageType === 'error'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <span>{{ message }}</span>
            </div>
          </form>

          <div class="help-text">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            <div>
              <p><strong>Note:</strong> If you signed up with Google, use the "Continue with Google" button instead.</p>
              <p style="margin-top: 0.5rem;">Check your spam folder if you don't receive the email within 5 minutes.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../services/api.js'
import Applesigninbutton from '@/components/user/Applesigninbutton.vue'

const router = useRouter()

// ── Global theme ──────────────────────────────────────────
const { isDark } = inject('theme')

// ── State ─────────────────────────────────────────────────
const identifier        = ref('')
const password          = ref('')
const resetEmail        = ref('')
const message           = ref('')
const messageType       = ref('error')
const showPassword      = ref(false)
const showForgotPassword = ref(false)
const rememberMe        = ref(false)
const loading           = ref(false)

// ── Login ─────────────────────────────────────────────────
async function login() {
  if (loading.value) return
  try {
    loading.value = true
    message.value = ''

    const res = await api.post('/auth/login', {
      identifier: identifier.value.trim(),
      password:   password.value.trim(),
    })

    const token = res.data.token
    if (!token) throw new Error('No token received from backend')

    localStorage.setItem('token', token)
    messageType.value = 'success'
    message.value     = 'Login successful! Redirecting…'

    setTimeout(() => router.push('/dashboard'), 800)
  } catch (err) {
    messageType.value = 'error'
    message.value     = err.response?.data?.message || err.message || 'Login failed. Please check your credentials.'
  } finally {
    loading.value = false
  }
}

// ── Forgot password ───────────────────────────────────────
async function handleForgotPassword() {
  if (loading.value) return
  try {
    loading.value = true
    message.value = ''

    const res = await api.post('/auth/forgot-password', {
      email: resetEmail.value.trim()
    })

    messageType.value = 'success'
    message.value     = res.data.message || 'Password reset link sent! Check your email.'

    setTimeout(() => {
      showForgotPassword.value = false
      resetEmail.value         = ''
      message.value            = ''
    }, 3000)
  } catch (err) {
    messageType.value = 'error'
    message.value     = err.response?.data?.message || err.message || 'Failed to send reset link. Please try again.'
  } finally {
    loading.value = false
  }
}

// ── Google login ──────────────────────────────────────────
async function handleGoogleLogin() {
  try {
    loading.value = true
    message.value = ''

    if (!window.google) {
      await new Promise((resolve, reject) => {
        const script    = document.createElement('script')
        script.src      = 'https://accounts.google.com/gsi/client'
        script.onload   = resolve
        script.onerror  = () => reject(new Error('Failed to load Google SDK'))
        document.head.appendChild(script)
      })
    }

    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!GOOGLE_CLIENT_ID) throw new Error('Google Client ID not configured')

    const client = window.google.accounts.oauth2.initCodeClient({
      client_id:  GOOGLE_CLIENT_ID,
      scope:      'openid email profile',
      ux_mode:    'popup',
      callback: async (response) => {
        try {
          if (response.error) throw new Error(response.error)
          if (!response.code)  throw new Error('No authorization code received')

          const res = await api.post('/auth/google-register', { code: response.code })

          if (res.data.success && res.data.token) {
            localStorage.setItem('token', res.data.token)
            if (res.data.user) localStorage.setItem('user', JSON.stringify(res.data.user))

            messageType.value = 'success'
            message.value     = 'Successfully signed in with Google!'
            setTimeout(() => router.push('/dashboard'), 1000)
          } else {
            throw new Error('Invalid response from server')
          }
        } catch (err) {
          messageType.value = 'error'
          message.value     = err.response?.data?.message || 'Google Sign-In failed. Please try again.'
        } finally {
          loading.value = false
        }
      },
    })

    client.requestCode()
  } catch (err) {
    messageType.value = 'error'
    message.value     = err.message || 'Google Sign-In failed. Please try again.'
    loading.value     = false
  }
}
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════
   DESIGN TOKENS — identical to Register page
═══════════════════════════════════════════════════════ */
.auth-wrapper {
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

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ── Wrapper ── */
.auth-wrapper {
  min-height: 100vh;
  display: flex;
  background: var(--c-bg);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
  color: var(--c-text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
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

.auth-wrapper.dark-mode .branding-section {
  background: linear-gradient(135deg, #0d0b10 0%, #1a1720 100%);
}

.branding-section::before {
  content: '';
  position: absolute;
  width: 500px; height: 500px;
  background: rgba(196, 144, 110, 0.08);
  border-radius: 50%;
  top: -200px; right: -200px;
}

.branding-section::after {
  content: '';
  position: absolute;
  width: 400px; height: 400px;
  background: rgba(196, 144, 110, 0.05);
  border-radius: 50%;
  bottom: -150px; left: -150px;
}

.branding-content {
  max-width: 500px;
  z-index: 1;
  color: white;
}

.logo-container { margin-bottom: 2rem; }

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

.auth-wrapper.dark-mode .brand-title { color: #d4a880; }

.brand-description {
  font-size: 1.1rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2.5rem;
  transition: color 0.3s ease;
}

.auth-wrapper.dark-mode .brand-description { color: rgba(242, 237, 232, 0.85); }

.features { display: flex; flex-direction: column; gap: 1rem; }

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.95);
}

.feature-item svg { flex-shrink: 0; color: rgba(255, 255, 255, 0.9); }

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
  max-width: 460px;
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

/* Icon wrapper (forgot password) */
.icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 68px; height: 68px;
  background: linear-gradient(135deg, var(--c-accent-hover), var(--c-accent));
  border-radius: 18px;
  margin-bottom: 1.25rem;
  box-shadow: 0 8px 24px rgba(124, 92, 78, 0.25);
}

.icon-wrapper svg { color: #f5e6d3; }

/* ── OAuth ── */
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

.auth-wrapper.dark-mode .oauth-btn:hover:not(:disabled) {
  box-shadow: 0 4px 12px rgba(196, 144, 110, 0.15);
}

.oauth-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.oauth-icon { width: 20px; height: 20px; }

/* ── Divider ── */
.divider {
  position: relative;
  text-align: center;
  margin: 1.5rem 0;
}

.divider::before {
  content: '';
  position: absolute;
  left: 0; right: 0; top: 50%;
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

/* ── Form ── */
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

.form-input::placeholder { color: var(--c-text-muted); }

.form-input:focus {
  outline: none;
  border-color: var(--c-accent);
  background: var(--c-surface);
  box-shadow: 0 0 0 4px rgba(124, 92, 78, 0.1);
}

.auth-wrapper.dark-mode .form-input:focus {
  box-shadow: 0 0 0 4px rgba(196, 144, 110, 0.1);
}

.input-hint {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--c-text-muted);
  margin-top: 0.25rem;
}

.input-hint svg { flex-shrink: 0; }

/* Password toggle */
.password-toggle {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: var(--c-text-muted);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
  z-index: 1;
}

.password-toggle:hover { color: var(--c-accent); }

/* Options row */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -0.25rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--c-text-primary);
}

.checkbox-input {
  width: 1rem; height: 1rem;
  cursor: pointer;
  accent-color: var(--c-accent);
}

.forgot-link {
  font-size: 0.875rem;
  color: var(--c-accent);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.forgot-link:hover {
  color: var(--c-accent-hover);
  text-decoration: underline;
}

/* ── Submit ── */
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

.auth-wrapper.dark-mode .submit-btn {
  box-shadow: 0 4px 12px rgba(196, 144, 110, 0.3);
}

.auth-wrapper.dark-mode .submit-btn:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(196, 144, 110, 0.4);
}

.submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

.spinner { animation: spin 1s linear infinite; }

@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

/* ── Alert ── */
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
  from { opacity: 0; transform: translateY(-10px); }
  to   { opacity: 1; transform: translateY(0); }
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

/* ── Signup prompt ── */
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

/* ── Back button (forgot pw) ── */
.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  background: none;
  border: none;
  color: var(--c-accent);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 1.5rem;
  transition: all 0.2s;
}

.back-button:hover { color: var(--c-accent-hover); transform: translateX(-4px); }

/* ── Help text (forgot pw) ── */
.help-text {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--c-accent-subtle);
  border-radius: 12px;
  margin-top: 1.5rem;
  border: 1px solid var(--c-border);
}

.help-text svg { flex-shrink: 0; color: var(--c-text-muted); margin-top: 0.1rem; }

.help-text p {
  font-size: 0.875rem;
  color: var(--c-text-secondary);
  line-height: 1.5;
  margin: 0;
}

/* ═══════════════════════════════════════════════════════
   RESPONSIVE
═══════════════════════════════════════════════════════ */
@media (max-width: 1024px) {
  .branding-section { display: none; }
  .form-section { flex: 1; }
}

@media (max-width: 480px) {
  .form-section { padding: 2rem 1.5rem; }
  .form-title { font-size: 1.75rem; }
}

@media (max-height: 900px) {
  .form-section { padding: 2rem; }
  .form-header { margin-bottom: 1.5rem; }
}
</style>
