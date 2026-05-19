<template>
  <div>
    <!-- Tooltip -->
    <transition name="fade">
      <div v-if="showTooltip && !isOpen" class="float-tooltip">
        Contact us
      </div>
    </transition>

    <!-- Floating Button -->
    <button
        class="float-btn"
        :class="{ 'is-open': isOpen }"
        @click="isOpen = !isOpen"
        @mouseenter="showTooltip = true"
        @mouseleave="showTooltip = false"
        aria-label="Contact TapMy Name"
    >
      <div class="pulse-ring" v-if="!isOpen"></div>
      <svg v-if="!isOpen" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
           stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>

    <!-- Overlay + Modal -->
    <transition name="overlay-fade">
      <div
          v-if="isOpen"
          :class="['contact-float-overlay', { 'dark-mode': isDarkMode }]"
          @click.self="close"
      >
        <transition name="modal-pop">
          <div v-if="isOpen" class="contact-float-modal" @click.stop>

            <!-- Header -->
            <div class="cfm-header">
              <div class="cfm-header-left">
                <div class="cfm-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"
                       stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>
                <div>
                  <div class="cfm-title">{{ modalTitle }}</div>
                  <div class="cfm-subtitle">TapMy Name · We reply within 24h</div>
                </div>
              </div>
              <button class="cfm-close-btn" @click="close" type="button" aria-label="Close">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <!-- Success State -->
            <div v-if="submitted" class="cfm-success">
              <div class="success-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60b88a" stroke-width="2.5"
                     stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div class="success-title">Message sent!</div>
              <div class="success-sub">Thanks for reaching out. We'll get back to you shortly.</div>
              <button class="btn-send" style="margin-top: 8px; width: 100%; justify-content: center;" @click="close">
                Close
              </button>
            </div>

            <!-- Form -->
            <template v-else>
              <div class="cfm-body">
                <div class="field">
                  <label>
                    Name
                    <span class="field-locked">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                           stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                      Auto-filled
                    </span>
                  </label>
                  <input v-model="form.name" type="text" disabled class="input-disabled"/>
                </div>
                <div class="field">
                  <label>
                    Email
                    <span class="field-locked">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                           stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                      Auto-filled
                    </span>
                  </label>
                  <input v-model="form.email" type="email" disabled class="input-disabled"/>
                </div>
                <div class="field">
                  <label>Subject</label>
                  <input v-model="form.subject" type="text" placeholder="How can we help?"
                         :class="{ 'has-error': errors.subject }" @input="errors.subject = ''"/>
                  <span class="field-error" v-if="errors.subject">{{ errors.subject }}</span>
                </div>
                <div class="field">
                  <label>Message</label>
                  <textarea v-model="form.message" placeholder="Tell us more…" :class="{ 'has-error': errors.message }"
                            @input="errors.message = ''"></textarea>
                  <span class="field-error" v-if="errors.message">{{ errors.message }}</span>
                </div>
              </div>

              <div class="cfm-footer">
                <button class="btn-cancel" @click="close" type="button">Cancel</button>
                <button class="btn-send" @click="handleSend" type="button" :disabled="sending">
                  <span v-if="sending">Sending…</span>
                  <template v-else>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                         stroke-linecap="round" stroke-linejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"/>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                    Send Message
                  </template>
                </button>
              </div>
            </template>

          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script setup>
import {computed, inject, reactive, ref, watch} from 'vue'
import api from '@/services/api.js'

// ── Theme ──────────────────────────────────────────────
const theme = inject('theme', {isDark: ref(false)})
const isDarkMode = theme.isDark

// ── State ──────────────────────────────────────────────
const isOpen = ref(false)
const showTooltip = ref(false)
const submitted = ref(false)
const sending = ref(false)

// Plan upgrade tracking
const planUpgradeRequest = ref(null) // { from: 'free', to: 'plus' }

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
  userId: null  // ✅ ADD THIS LINE
})

const errors = reactive({
  subject: '',
  message: ''
})

// ── Modal Title (changes based on context) ──────────────
const modalTitle = computed(() => {
  if (planUpgradeRequest.value) {
    const {from, to} = planUpgradeRequest.value
    if (from === to) return 'Contact Us'
    return 'Plan Change Request'
  }
  return 'Contact Us'
})

// ── Plan upgrade message templates ─────────────────────
const planMessages = {
  upgrade: {
    'free-plus': {
      subject: 'Upgrade Request: Free → Plus Plan',
      message: `Hi TapMyName Team,

I'm currently on the Free Plan and would like to upgrade to the Plus Plan.

Could you please provide:
• Detailed information about the Plus Plan features
• Pricing and payment options
• How to proceed with the upgrade

Thank you!`
    },
    'free-premium': {
      subject: 'Upgrade Request: Free → Premium Plan',
      message: `Hi TapMyName Team,

I'm currently on the Free Plan and would like to upgrade to the Premium Plan.

Could you please provide:
• Detailed information about the Premium Plan features
• Pricing and payment options
• How to proceed with the upgrade

Thank you!`
    },
    'free-custom': {
      subject: 'Custom Plan Inquiry: Free → Custom',
      message: `Hi TapMyName Team,

I'm on the Free Plan and interested in the Custom Plan for my organisation.

Could you please share:
• What the Custom Plan includes and its minimum requirements
• Pricing based on our team size and needs
• How onboarding and setup works
• Any enterprise-specific features (SSO, dedicated support, etc.)

A bit about us: [please describe your organisation / team size here]

Thank you!`
    },
    'plus-custom': {
      subject: 'Custom Plan Inquiry: Plus → Custom',
      message: `Hi TapMyName Team,

I'm currently on the Plus Plan and would like to explore upgrading to the Custom Plan.

Could you please share:
• What additional features the Custom Plan unlocks
• Pricing options for our team size
• Minimum contact/company thresholds

A bit about us: [please describe your organisation / team size here]

Thank you!`
    },
    'premium-custom': {
      subject: 'Custom Plan Inquiry: Premium → Custom',
      message: `Hi TapMyName Team,

I'm on the Premium Plan and would like to discuss upgrading to a Custom Plan.

Could you please share:
• Pricing and volume options beyond the Premium tier
• Any enterprise add-ons (dedicated manager, custom integrations, SLA)
• How migration from Premium would work

A bit about us: [please describe your organisation / team size here]

Thank you!`
    },
    'free-demo': {
      subject: 'Demo Request: TapMyName Platform',
      message: `Hi TapMyName Team,

I would like to request a live demo of the TapMyName platform.

I'd love to learn more about:
• Digital business card features
• Team/company management
• Analytics and wallet integrations
• Available plans and pricing
• How TapMyName can fit our workflow

Please let me know the next available demo slot.

Thank you!`
    },

    'plus-demo': {
      subject: 'Demo Request: Advanced TapMyName Features',
      message: `Hi TapMyName Team,

I'm currently on the Plus Plan and would like to schedule a live demo to explore more advanced capabilities.

I'd like to learn more about:
• Premium/custom features
• Scaling for teams
• Advanced analytics
• Enterprise workflows

Please let me know the next available demo session.

Thank you!`
    },

    'premium-demo': {
      subject: 'Enterprise Demo Request',
      message: `Hi TapMyName Team,

I'm currently on the Premium Plan and would like to schedule a live platform demo for our organisation.

We're interested in:
• Enterprise capabilities
• Team scaling
• Custom workflows
• Dedicated onboarding/support
• Long-term partnership options

Please let us know the next available demo session.

Thank you!`
    },

    'custom-demo': {
      subject: 'Custom Enterprise Demo Request',
      message: `Hi TapMyName Team,

We would like to request a dedicated enterprise demo of TapMyName.

We're interested in exploring:
• Large-scale deployment
• Enterprise onboarding
• Custom integrations
• Dedicated support
• Advanced organisation management

Please contact us to arrange a suitable demo session.

Thank you!`
    },
  },
  downgrade: {
    'plus-free': {
      subject: 'Downgrade Request: Plus → Free Plan',
      message: `Hi TapMyName Team,

I'm currently on the Plus Plan and would like to downgrade to the Free Plan.

Could you please:
• Confirm if downgrading is possible
• Explain what I'll lose/what features will be limited
• Provide the steps to downgrade

Thank you!`
    },
    'premium-plus': {
      subject: 'Downgrade Request: Premium → Plus Plan',
      message: `Hi TapMyName Team,

I'm currently on the Premium Plan and would like to downgrade to the Plus Plan.

Could you please:
• Confirm if downgrading is possible
• Explain what I'll lose/what features will be limited
• Handle any prorated refunds if applicable
• Provide the steps to downgrade

Thank you!`
    },
    'premium-free': {
      subject: 'Downgrade Request: Premium → Free Plan',
      message: `Hi TapMyName Team,

I'm currently on the Premium Plan and would like to downgrade to the Free Plan.

Could you please:
• Confirm if downgrading is possible
• Explain what I'll lose/what features will be limited
• Handle any prorated refunds if applicable
• Provide the steps to downgrade

Thank you!`
    },
    'custom-free': {
      subject: 'Downgrade Request: Custom → Free Plan',
      message: `Hi TapMyName Team,

I'm currently on the Custom Plan and would like to downgrade to the Free Plan.

Could you please:
• Confirm what will be lost (companies, contacts, features)
• Handle any billing adjustments
• Outline the steps to proceed

Thank you!`
    },
    'custom-plus': {
      subject: 'Downgrade Request: Custom → Plus Plan',
      message: `Hi TapMyName Team,

I'm on the Custom Plan and would like to downgrade to the Plus Plan.

Could you please:
• Confirm what will be limited under Plus
• Handle any billing adjustments or prorated refunds
• Outline the steps to proceed

Thank you!`
    },
    'custom-premium': {
      subject: 'Downgrade Request: Custom → Premium Plan',
      message: `Hi TapMyName Team,

I'm on the Custom Plan and would like to move to the Premium Plan.

Could you please:
• Confirm what changes under Premium
• Handle any billing adjustments
• Outline the steps to proceed

Thank you!`
    },
  }
}

// ── Fetch logged-in user on first open ─────────────────
watch(isOpen, async (val) => {
  if (val && !form.name) {
    try {
      const token = localStorage.getItem('token')
      const res = await api.get('/auth/me', {
        headers: {Authorization: `Bearer ${token}`}
      })
      form.name = res.data.name || ''
      form.email = res.data.email || ''
      form.userId = res.data.id || null  // ✅ ADD THIS LINE - capture userId
    } catch (err) {
      console.error('Failed to load user info:', err)
      // ✅ If not authenticated, userId stays null (anonymous submission)
    }
  }
})

// ── Methods ────────────────────────────────────────────

/**
 * Open contact form with plan upgrade/downgrade context
 * @param {string} targetPlan - The plan user wants to upgrade/downgrade to
 * @param {string} currentPlan - The user's current plan
 */
function openPlanRequest(targetPlan, currentPlan) {
  planUpgradeRequest.value = {from: currentPlan, to: targetPlan}

  // Determine if it's upgrade or downgrade
  const planOrder = { free: 0, plus: 1, premium: 2, custom: 3, demo: 4 }
  const isUpgrade = planOrder[targetPlan] > planOrder[currentPlan]

  // Get the key based on upgrade/downgrade direction
  const direction = isUpgrade ? 'upgrade' : 'downgrade'
  if (targetPlan === 'demo') {
    const demoKey = `${currentPlan}-demo`
    const template = planMessages.upgrade?.[demoKey]

    if (template) {
      form.subject = template.subject
      form.message = template.message
    }

    isOpen.value = true
    return
  }
  const key = `${currentPlan}-${targetPlan}`

  // Prefill form with plan-specific message
  const template = planMessages[direction]?.[key]
  if (template) {
    form.subject = template.subject
    form.message = template.message
  }

  isOpen.value = true
}

function close() {
  isOpen.value = false
  showTooltip.value = false
  planUpgradeRequest.value = null
  setTimeout(() => {
    submitted.value = false
    form.subject = ''
    form.message = ''
    form.userId = null  // ✅ ADD THIS LINE - clear userId
    errors.subject = ''
    errors.message = ''
  }, 300)
}

function validate() {
  let valid = true
  if (!form.subject.trim()) {
    errors.subject = 'Required';
    valid = false
  }
  if (!form.message.trim()) {
    errors.message = 'Required';
    valid = false
  }
  return valid
}

async function handleSend() {
  if (!validate()) return

  sending.value = true

  try {
    await api.post('/dashboard/contact-us', {
      userId: form.userId || null,  // ✅ ADD THIS LINE - send userId
      firstName: form.name,
      lastName: '',
      email: form.email,
      subject: form.subject,
      message: form.message,
      ...(planUpgradeRequest.value && {planRequest: planUpgradeRequest.value})
    })
    submitted.value = true
  } catch (err) {
    console.error('Contact form error:', err)
    errors.message = err.response?.data?.message || 'Something went wrong. Please try again.'
  } finally {
    sending.value = false
  }
}

// ── Expose for parent component ────────────────────────
defineExpose({openPlanRequest})
</script>

<style scoped>
/* ── CSS Custom Properties ────────────────────────────── */
.contact-float-overlay {
  --c-bg: #ffffff;
  --c-surface: #ffffff;
  --c-surface-2: #faf9f7;
  --c-border: #e8e3dc;
  --c-text-primary: #1c1410;
  --c-text-secondary: #5a4f46;
  --c-text-muted: #9e8e84;
  --c-accent: #7c5c4e;
  --c-accent-2: #a07060;
  --c-accent-hover: #5e443a;
  --c-accent-light: #f0e8e4;
  --c-danger: #b83232;
  --c-danger-light: #fdf0f0;
  --c-success: #2d6a50;
  --c-shadow-lg: 0 16px 48px rgba(28, 20, 16, .16), 0 4px 12px rgba(28, 20, 16, .08);
  --c-radius: 14px;
  --c-radius-sm: 8px;
  --c-radius-xs: 5px;
}

.contact-float-overlay.dark-mode {
  --c-bg: #100e14;
  --c-surface: #1a1720;
  --c-surface-2: #1e1b26;
  --c-border: #2c2838;
  --c-text-primary: #f2ede8;
  --c-text-secondary: #a89490;
  --c-text-muted: #6a5e5a;
  --c-accent: #c4906e;
  --c-accent-2: #d4a880;
  --c-accent-hover: #d4a070;
  --c-accent-light: #281e18;
  --c-danger: #e06060;
  --c-danger-light: #281414;
  --c-success: #60b88a;
  --c-shadow-lg: 0 16px 48px rgba(0, 0, 0, .5), 0 4px 12px rgba(0, 0, 0, .3);
}

*, *::before, *::after {
  box-sizing: border-box;
}

/* ── Floating Button ──────────────────────────────────── */
.float-btn {
  position: fixed;
  bottom: 28px;
  right: 28px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: linear-gradient(135deg, #c4906e, #d4a880);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(196, 144, 110, .4), 0 2px 8px rgba(0, 0, 0, .35);
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  z-index: 9998;
  color: #fff;
}

.float-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 28px rgba(196, 144, 110, .5), 0 4px 12px rgba(0, 0, 0, .35);
}

.float-btn:active {
  transform: scale(0.96);
}

.float-btn.is-open {
  background: linear-gradient(135deg, #7c5c4e, #a07060);
}

.pulse-ring {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 2px solid rgba(196, 144, 110, .45);
  animation: pulse-ring 2.2s ease-out infinite;
  pointer-events: none;
}

@keyframes pulse-ring {
  0% {
    transform: scale(1);
    opacity: .65;
  }
  100% {
    transform: scale(1.6);
    opacity: 0;
  }
}

/* ── Tooltip ─────────────────────────────────────────── */
.float-tooltip {
  position: fixed;
  bottom: 40px;
  right: 90px;
  background: #1a1720;
  border: 1.5px solid #2c2838;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  color: #a89490;
  white-space: nowrap;
  box-shadow: 0 4px 16px rgba(0, 0, 0, .3);
  z-index: 9997;
  pointer-events: none;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

.float-tooltip::after {
  content: '';
  position: absolute;
  top: 50%;
  right: -6px;
  transform: translateY(-50%);
  border: 5px solid transparent;
  border-left-color: #2c2838;
}

/* ── Overlay ──────────────────────────────────────────── */
.contact-float-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 8, 16, .6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 9999;
  font-family: 'Segoe UI', 'SF Pro Display', system-ui, sans-serif;
  font-size: 14px;
  overflow-y: auto;
}

/* ── Modal ────────────────────────────────────────────── */
.contact-float-modal {
  background: var(--c-surface);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius);
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--c-shadow-lg);
  color: var(--c-text-primary);
  transform-origin: center center;
  margin: auto;
}

/* ── Header ───────────────────────────────────────────── */
.cfm-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 28px;
  background: linear-gradient(135deg, rgba(196, 144, 110, .1) 0%, transparent 100%);
  border-bottom: 1.5px solid var(--c-border);
}

.cfm-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cfm-icon {
  width: 34px;
  height: 34px;
  border-radius: var(--c-radius-sm);
  background: linear-gradient(135deg, var(--c-accent), var(--c-accent-2));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.cfm-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--c-text-primary);
  letter-spacing: -0.3px;
}

.cfm-subtitle {
  font-size: 11px;
  color: var(--c-text-muted);
  margin-top: 1px;
}

.cfm-close-btn {
  width: 28px;
  height: 28px;
  background: var(--c-surface-2);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-xs);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--c-text-secondary);
  transition: all 0.15s;
  flex-shrink: 0;
}

.cfm-close-btn:hover {
  border-color: var(--c-danger);
  color: var(--c-danger);
  background: var(--c-danger-light);
}

/* ── Body / Form ──────────────────────────────────────── */
.cfm-body {
  padding: 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.field label {
  font-size: 11px;
  font-weight: 650;
  color: var(--c-text-muted);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 6px;
}

.field-locked {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 10px;
  font-weight: 600;
  color: var(--c-accent);
  background: var(--c-accent-light);
  border: 1px solid rgba(196, 144, 110, .25);
  border-radius: 20px;
  padding: 1px 7px;
  letter-spacing: 0.02em;
  text-transform: none;
}

.field input,
.field textarea {
  background: var(--c-surface-2);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-xs);
  padding: 8px 10px;
  font-size: 13px;
  color: var(--c-text-primary);
  font-family: inherit;
  transition: border-color 0.15s, box-shadow 0.15s;
  outline: none;
  width: 100%;
}

.field input::placeholder,
.field textarea::placeholder {
  color: var(--c-text-muted);
}

.field input:focus,
.field textarea:focus {
  border-color: var(--c-accent);
  box-shadow: 0 0 0 3px rgba(196, 144, 110, .15);
}

.field input.input-disabled,
.field input:disabled {
  background: var(--c-surface-2);
  border-color: var(--c-border);
  color: var(--c-text-secondary);
  cursor: not-allowed;
  opacity: 0.75;
  user-select: none;
}

.field input.input-disabled:focus,
.field input:disabled:focus {
  border-color: var(--c-border);
  box-shadow: none;
}

.field textarea {
  resize: none;
  height: 100px;
  line-height: 1.5;
}

.field-error {
  font-size: 11px;
  color: var(--c-danger);
  margin-top: 2px;
}

/* ── Footer ───────────────────────────────────────────── */
.cfm-footer {
  padding: 16px 28px 24px;
  border-top: 1.5px solid var(--c-border);
  display: flex;
  gap: 8px;
}

.btn-cancel {
  padding: 9px 14px;
  background: var(--c-surface-2);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-sm);
  font-size: 12px;
  font-weight: 650;
  color: var(--c-text-secondary);
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
  flex-shrink: 0;
}

.btn-cancel:hover {
  border-color: var(--c-accent);
  color: var(--c-accent);
}

.btn-send {
  flex: 1;
  padding: 9px 14px;
  background: linear-gradient(135deg, var(--c-accent), var(--c-accent-2));
  border: none;
  border-radius: var(--c-radius-sm);
  font-size: 12px;
  font-weight: 750;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 10px rgba(196, 144, 110, .3);
  transition: all 0.15s;
  font-family: inherit;
}

.btn-send:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(196, 144, 110, .45);
}

.btn-send:active:not(:disabled) {
  transform: scale(0.97);
}

.btn-send:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

/* ── Success State ────────────────────────────────────── */
.cfm-success {
  padding: 28px 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
}

.success-icon {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba(96, 184, 138, .12);
  border: 1.5px solid rgba(96, 184, 138, .3);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: success-pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes success-pop {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

.success-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--c-text-primary);
}

.success-sub {
  font-size: 12px;
  color: var(--c-text-muted);
  max-width: 220px;
  line-height: 1.65;
}

/* ── Transitions ──────────────────────────────────────── */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.overlay-fade-enter-active, .overlay-fade-leave-active {
  transition: opacity 0.22s ease;
}

.overlay-fade-enter-from, .overlay-fade-leave-to {
  opacity: 0;
}

.modal-pop-enter-active {
  transition: opacity 0.25s ease, transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-pop-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.modal-pop-enter-from, .modal-pop-leave-to {
  opacity: 0;
  transform: scale(0.92) translateY(10px);
}

/* ── Mobile ───────────────────────────────────────────── */
@media (max-width: 640px) {
  .contact-float-overlay {
    align-items: flex-end;
    padding: 0;
  }

  .contact-float-modal {
    max-width: 100%;
    max-height: 92vh;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom: none;
  }

  .float-btn {
    bottom: 80px;
    right: 20px;
  }
}

/* ── Reduced motion ───────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
