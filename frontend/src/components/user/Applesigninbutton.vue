
<template>
  <button class="apple-btn" @click="handleAppleSignIn" :disabled="loading">
    <svg class="apple-icon" viewBox="0 0 24 24">
      <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
    </svg>

    <span>{{ loading ? 'Signing in...' : 'Continue with Apple' }}</span>
  </button>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../services/api.js'

const emit = defineEmits(['success', 'error'])
const router = useRouter()
const loading = ref(false)

async function handleAppleSignIn() {
  if (loading.value) return

  try {
    loading.value = true

    // ✅ Make sure Apple JS SDK is loaded
    if (!window.AppleID) {
      await new Promise((resolve, reject) => {
        // SDK should already be loaded from index.html — this is a safety fallback
        const existing = document.querySelector(
            'script[src*="appleid.cdn-apple.com"]'
        )
        if (existing) {
          // Wait for it
          let attempts = 0
          const poll = setInterval(() => {
            attempts++
            if (window.AppleID) {
              clearInterval(poll)
              resolve()
            } else if (attempts > 20) {
              clearInterval(poll)
              reject(new Error('Apple SDK did not load in time'))
            }
          }, 200)
        } else {
          reject(new Error('Apple Sign In SDK not loaded. Add it to index.html'))
        }
      })
    }

    // ✅ Initialize Apple Sign In
    window.AppleID.auth.init({
      clientId:     import.meta.env.VITE_APPLE_CLIENT_ID,  // e.g. com.tapmyname.app
      scope:        'name email',
      redirectURI:  import.meta.env.VITE_APPLE_REDIRECT_URI || window.location.origin,
      usePopup:     true,   // Popup mode — no page redirect needed
    })

    // ✅ Trigger the Apple Sign In popup
    const response = await window.AppleID.auth.signIn()

    if (!response?.authorization?.id_token) {
      throw new Error('No identity token received from Apple')
    }

    // ✅ Send to your backend
    const res = await api.post('/auth/apple', {
      identityToken:     response.authorization.id_token,
      authorizationCode: response.authorization.code,
      user:              response.user || null,   // only on first sign-in
    })

    if (res.data.success && res.data.token) {
      localStorage.setItem('token', res.data.token)

      if (res.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user))
      }

      emit('success', res.data)
      router.push('/dashboard')
    } else {
      throw new Error(res.data.message || 'Apple Sign In failed')
    }

  } catch (err) {
    // Apple cancelled = user closed popup, not a real error
    if (err?.error === 'popup_closed_by_user' || err?.error === 'user_cancelled_authorize') {
      console.log('ℹ️ Apple Sign In cancelled by user')
      loading.value = false
      return
    }

    console.error('❌ Apple Sign In error:', err)
    emit('error', err?.response?.data?.message || err?.message || 'Apple Sign In failed')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Apple Button */
.apple-btn {
  width: 100%;
  padding: 0.875rem 1.5rem;
  background: #000;
  border: 2px solid #000;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;

  transition: all 0.3s;
  margin-bottom: 1.5rem;

  height: 50px;
}

.apple-btn:hover:not(:disabled) {
  background: #1a1a1a;
  border-color: #1a1a1a;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.25);
}

.apple-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.apple-icon {
  width: 23px;
  height: 23px;
  fill: white;
}
</style>
