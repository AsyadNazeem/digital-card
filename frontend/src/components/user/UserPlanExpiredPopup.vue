<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
          v-if="visible"
          class="overlay"
          @click.self="dismiss"
      >
        <div :class="['popup', { 'dark-mode': isDarkMode }]">

          <!-- Header -->
          <div class="popup-header">
            <div class="icon-circle">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div>
              <p class="title">Your plan has expired</p>
              <p class="subtitle">{{ planLabel }} · {{ duration }}</p>
            </div>
          </div>

          <!-- Body -->
          <div class="popup-body">
            <p class="description">
              Renew your plan to keep full access. If you don't upgrade,
              your account will be downgraded to the
              <strong>free plan</strong> and the following will happen:
            </p>

            <div class="consequences">
              <div class="row">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" class="row-icon">
                  <rect x="2" y="7" width="20" height="14" rx="2"/>
                  <path d="M16 7V5a2 2 0 0 0-4 0v2"/>
                </svg>
                <div>
                  <p class="row-title">Extra companies deactivated</p>
                  <p class="row-desc">Only 1 company allowed on free. Your most recently created companies will be deactivated.</p>
                </div>
              </div>

              <div class="row">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" class="row-icon">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                <div>
                  <p class="row-title">Extra contacts deactivated</p>
                  <p class="row-desc">Only 1 contact allowed on free. Your most recently created contacts will be deactivated.</p>
                </div>
              </div>

              <div class="row">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" class="row-icon restore">
                  <polyline points="23 4 23 10 17 10"/>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
                <div>
                  <p class="row-title">Data restored on upgrade</p>
                  <p class="row-desc">All deactivated data is preserved and reactivated automatically when you upgrade.</p>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="actions">
              <button class="btn-upgrade" @click="upgrade">Upgrade now</button>
              <button class="btn-later" @click="dismiss">Remind me later</button>
            </div>

            <p class="reminder-note">
              This reminder will appear every 10 minutes until your plan is renewed.
            </p>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, inject, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  planData: {
    type: Object,
    default: null
    // expects: { plan, duration, endDate }
  }
})

const emit = defineEmits(['upgrade'])

const theme = inject('theme', { isDark: ref(false) })
const isDarkMode = theme.isDark

const visible = ref(false)
let intervalId = null

const INTERVAL_MS = 10 * 60 * 1000  // 10 minutes

const planLabel = computed(() => {
  const p = props.planData?.plan || 'plus'
  return p.charAt(0).toUpperCase() + p.slice(1)
})

const duration = computed(() => props.planData?.duration || 'monthly')

// ✅ IMPROVED: Comprehensive expiry check
function isExpired() {
  console.log('🔍 [isExpired] Checking with planData:', props.planData)

  // No data provided
  if (!props.planData) {
    console.warn('❌ [isExpired] No planData provided')
    return false
  }

  const plan = props.planData?.plan || 'free'

  console.log('📋 [isExpired] Plan type:', plan)

  // Never show for free/demo plans
  if (['free', 'demo'].includes(plan)) {
    console.log('ℹ️ [isExpired] Plan is free/demo, no expiry popup needed')
    return false
  }

  // Check if endDate exists
  if (!props.planData?.endDate) {
    console.warn('⚠️ [isExpired] No endDate in planData - plan is EXPIRED')
    // If a paid plan has no endDate, it means the plan has expired
    return true
  }

  // Parse the endDate properly
  let endDate
  try {
    endDate = new Date(props.planData.endDate)
  } catch (e) {
    console.error('❌ [isExpired] Failed to parse endDate:', e)
    return false
  }

  // Validate date is real
  if (isNaN(endDate.getTime())) {
    console.error('❌ [isExpired] Invalid endDate value')
    return false
  }

  const now = new Date()

  console.log('📅 [isExpired] Date comparison:', {
    plan,
    endDate: endDate.toISOString(),
    now: now.toISOString(),
    isExpired: now >= endDate
  })

  return now >= endDate
}

function show() {
  console.log('👁️ [show] Attempting to show popup...')
  if (isExpired()) {
    console.log('✅ [show] Plan IS expired, showing popup')
    visible.value = true
  } else {
    console.log('ℹ️ [show] Plan is NOT expired, hiding popup')
    visible.value = false
  }
}

function dismiss() {
  visible.value = false
  console.log('ℹ️ [dismiss] Popup dismissed, will show again in 10 minutes')
}

function upgrade() {
  visible.value = false
  emit('upgrade')
  console.log('🚀 [upgrade] Upgrade event emitted')
}

// ✅ Watch planData changes (deep watch to catch nested updates)
watch(
    () => props.planData,
    (newData) => {
      console.log('👁️ [watch] planData changed:', newData)
      // Small delay to ensure data is stable
      setTimeout(() => {
        show()
      }, 100)
    },
    { deep: true }
)

onMounted(() => {
  console.log('🔧 [onMounted] UserPlanExpiredPopup mounted')
  console.log('📊 [onMounted] Initial planData:', props.planData)

  // Show immediately on mount
  show()

  // Then repeat every 10 minutes
  intervalId = setInterval(() => {
    console.log('⏰ [interval] Checking plan expiry (recurring check)')
    show()
  }, INTERVAL_MS)
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
    console.log('🧹 [onUnmounted] Cleanup: cleared interval')
  }
})
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.popup {
  --bg: #ffffff;
  --header-bg: #fcebeb;
  --header-border: #f7c1c1;
  --title-color: #501313;
  --subtitle-color: #791f1f;
  --icon-bg: #f09595;
  --row-bg: #f8f9fa;
  --row-border: #e9ecef;
  --row-icon-color: #a32d2d;
  --restore-icon-color: #15803d;
  --text: #1c1410;
  --text-muted: #5a4f46;
  --text-hint: #9e8e84;
  --border: #e8e3dc;
  --btn-later-bg: #f8f9fa;

  background: var(--bg);
  border-radius: 14px;
  border: 0.5px solid var(--border);
  width: 100%;
  max-width: 440px;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.popup.dark-mode {
  --bg: #1a1720;
  --header-bg: #1c0b0e;
  --header-border: #9f1239;
  --title-color: #fecdd3;
  --subtitle-color: #fb7185;
  --icon-bg: #9f1239;
  --row-bg: #1e1b26;
  --row-border: #2c2838;
  --row-icon-color: #fb7185;
  --restore-icon-color: #4ade80;
  --text: #f2ede8;
  --text-muted: #a89490;
  --text-hint: #6a5e5a;
  --border: #2c2838;
  --btn-later-bg: #1e1b26;
}

.popup-header {
  background: var(--header-bg);
  padding: 1.25rem 1.5rem 1rem;
  border-bottom: 0.5px solid var(--header-border);
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--icon-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--title-color);
}

.title {
  font-size: 15px;
  font-weight: 500;
  margin: 0;
  color: var(--title-color);
}

.subtitle {
  font-size: 12px;
  color: var(--subtitle-color);
  margin: 0;
}

.popup-body {
  padding: 1.25rem 1.5rem;
}

.description {
  font-size: 14px;
  color: var(--text-muted);
  margin: 0 0 1rem;
  line-height: 1.6;
}

.description strong {
  color: var(--text);
  font-weight: 500;
}

.consequences {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 1.25rem;
}

.row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  background: var(--row-bg);
  border-radius: 8px;
  border: 0.5px solid var(--row-border);
}

.row-icon {
  color: var(--row-icon-color);
  flex-shrink: 0;
  margin-top: 2px;
}

.row-icon.restore {
  color: var(--restore-icon-color);
}

.row-title {
  font-size: 13px;
  font-weight: 500;
  margin: 0 0 2px;
  color: var(--text);
}

.row-desc {
  font-size: 12px;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.5;
}

.actions {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.btn-upgrade {
  flex: 1;
  padding: 10px;
  font-size: 14px;
  font-weight: 500;
  background: #e24b4a;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.15s;
}

.btn-upgrade:hover { opacity: 0.88; }
.btn-upgrade:active { opacity: 0.75; }

.btn-later {
  padding: 10px 16px;
  font-size: 13px;
  color: var(--text-muted);
  background: var(--btn-later-bg);
  border: 0.5px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;
}

.btn-later:hover { background: var(--row-border); }

.reminder-note {
  font-size: 11px;
  color: var(--text-hint);
  text-align: center;
  margin: 0;
}

/* Transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
