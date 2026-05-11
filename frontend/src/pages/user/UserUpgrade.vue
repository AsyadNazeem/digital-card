<template>
  <transition name="modal-fade">
    <div v-if="open" :class="['upgrade-overlay', { 'dark-mode': isDarkMode }]" @click.self="$emit('close')">
      <div :class="['upgrade-modal', { 'dark-mode': isDarkMode }]">

        <!-- Header -->
        <div class="upgrade-modal-header">
          <h2 class="upgrade-modal-title">Choose Your Plan</h2>
          <button class="qr-close-btn" @click="$emit('close')" type="button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="upgrade-modal-body">

          <!-- Info strip -->
          <div class="info-strip">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            <span>
              You are currently on the
              <strong>{{ planLabel(currentPlan) }}</strong>.
              Upgrade to unlock premium themes and advanced features.
            </span>
          </div>

          <!-- Plans Grid -->
          <div class="plans-grid">

            <!-- Free -->
            <div class="plan-card" :class="{ 'current-plan': fetchedPlan === 'free' }">
              <span v-if="fetchedPlan === 'free'" class="current-badge">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Current
              </span>
              <div class="plan-top">
                <div class="plan-title">Free</div>
                <div class="plan-price">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  Contact admin to get started
                </div>
              </div>
              <ul class="plan-features">
                <li>
                  <svg class="feat-check" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  1 Company (limited features)
                </li>
                <li>
                  <svg class="feat-check" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  1 Contact
                </li>
                <li>
                  <svg class="feat-check" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  1 Review
                </li>
                <li class="disabled">
                  <svg class="feat-cross" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       stroke-width="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                  No Analytics
                </li>
                <li class="disabled">
                  <svg class="feat-cross" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       stroke-width="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                  No Premium Themes
                </li>
              </ul>
              <button
                  class="plan-btn"
                  :class="fetchedPlan === 'free' ? 'btn-current' : 'btn-outline'"
                  :disabled="fetchedPlan === 'free'"
              >
                {{ fetchedPlan === 'free' ? 'Current Plan' : 'Choose Free' }}
              </button>
            </div>

            <!-- Plus -->
            <div class="plan-card" :class="{ 'current-plan': fetchedPlan === 'plus', featured: fetchedPlan !== 'plus' }">
<span v-if="fetchedPlan === 'plus'" class="current-badge">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Current
              </span>
              <div class="plan-top">
                <div class="plan-title">Plus</div>
                <div class="plan-price">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  Contact admin to upgrade
                </div>
              </div>
              <ul class="plan-features">
                <li>
                  <svg class="feat-check" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  2 Companies (full features)
                </li>
                <li>
                  <svg class="feat-check" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  6 Contacts
                </li>
                <li>
                  <svg class="feat-check" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  2 Reviews
                </li>
                <li>
                  <svg class="feat-check" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Analytics Included
                </li>
                <li>
                  <svg class="feat-check" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Plus Themes
                </li>
              </ul>
              <button
                  class="plan-btn"
                  :class="fetchedPlan === 'plus' ? 'btn-current' : 'btn-primary'"
                  :disabled="fetchedPlan === 'plus'"
              >
                {{ fetchedPlan === 'plus' ? 'Current Plan' : 'Choose Plus →' }}
              </button>
            </div>

            <!-- Premium -->
            <div class="plan-card" :class="{ 'current-plan': fetchedPlan === 'premium' }">
<span v-if="fetchedPlan === 'premium'" class="current-badge">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Current
              </span>
              <div class="plan-top">
                <div class="plan-title">Premium</div>
                <div class="plan-price">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  Contact admin to upgrade
                </div>
              </div>
              <ul class="plan-features">
                <li>
                  <svg class="feat-check" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  5 Companies (full features)
                </li>
                <li>
                  <svg class="feat-check" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  15 Contacts
                </li>
                <li>
                  <svg class="feat-check" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  5 Reviews
                </li>
                <li>
                  <svg class="feat-check" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Analytics Included
                </li>
                <li>
                  <svg class="feat-check" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  All Premium Themes
                </li>
              </ul>
              <button
                  class="plan-btn"
                  :class="fetchedPlan === 'premium' ? 'btn-current' : 'btn-outline'"
                  :disabled="fetchedPlan === 'premium'"
              >
                {{ fetchedPlan === 'premium' ? 'Current Plan' : 'Choose Premium →' }}
              </button>
            </div>

          </div>

          <!-- Contact note -->
          <div class="contact-note">
            <p>
              Ready to upgrade? Contact us at
              <a href="mailto:hello@tapmy.name">hello@tapmy.name</a>
            </p>
          </div>

        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import {inject, ref, watch} from 'vue';
import api from '@/services/api.js';

const isDarkMode = inject('isDarkMode', ref(false));

const props = defineProps({
  open: Boolean,
  currentPlan: {type: String, default: 'free'}
});

defineEmits(['close']);

const fetchedPlan = ref(props.currentPlan);

// Fetch the live plan from the backend whenever the modal opens
watch(() => props.open, async (isOpen) => {
  if (isOpen) {
    try {
      const res = await api.get('/dashboard/user/plan');
      let plan = (res.data?.plan || 'free').toLowerCase();
      // Normalize DB value 'pro' to display name 'premium'
      if (plan === 'pro') plan = 'premium';
      fetchedPlan.value = plan;
    } catch {
      let plan = (props.currentPlan || 'free').toLowerCase();
      if (plan === 'pro') plan = 'premium';
      fetchedPlan.value = plan;
    }
  }
}, {immediate: true});

function planLabel(plan) {
  const normalized = plan === 'pro' ? 'premium' : plan;
  return { free: 'Free Plan', plus: 'Plus Plan', premium: 'Premium Plan' }[normalized] ?? 'Free Plan';
}
</script>

<style scoped>
/* ══ CSS Custom Properties — mirrors Theme tab exactly ══ */
.upgrade-overlay {
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
  --c-accent-subtle: #f8f3f0;
  --c-danger: #b83232;
  --c-danger-light: #fdf0f0;
  --c-success: #2d6a50;
  --c-shadow-sm: 0 2px 6px rgba(28, 20, 16, 0.08), 0 1px 2px rgba(28, 20, 16, 0.04);
  --c-shadow-md: 0 6px 20px rgba(28, 20, 16, 0.10), 0 2px 6px rgba(28, 20, 16, 0.06);
  --c-shadow-lg: 0 16px 48px rgba(28, 20, 16, 0.16), 0 4px 12px rgba(28, 20, 16, 0.08);
  --c-radius: 14px;
  --c-radius-sm: 8px;
  --c-radius-xs: 5px;
  --c-radius-pill: 100px;
  font-family: 'Segoe UI', 'SF Pro Display', system-ui, -apple-system, sans-serif;
  font-size: 14px;
}

.upgrade-overlay.dark-mode {
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
  --c-accent-subtle: #1e1612;
  --c-danger: #e06060;
  --c-danger-light: #281414;
  --c-success: #60b88a;
  --c-shadow-sm: 0 2px 6px rgba(0, 0, 0, 0.3);
  --c-shadow-md: 0 6px 20px rgba(0, 0, 0, 0.4);
  --c-shadow-lg: 0 16px 48px rgba(0, 0, 0, 0.5);
}

*, *::before, *::after {
  box-sizing: border-box;
}

button {
  font-family: inherit;
  cursor: pointer;
}

/* Overlay */
.upgrade-overlay {
  position: fixed;
  inset: 0;
  background: rgba(16, 14, 20, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  padding: 16px;
  overflow-y: auto;
}

/* Modal Shell */
.upgrade-modal {
  background: var(--c-surface);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius);
  width: 100%;
  max-width: 920px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: var(--c-shadow-lg);
  margin: auto;
  color: var(--c-text-primary);
}

/* Header */
.upgrade-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 28px;
  background: linear-gradient(135deg, var(--c-accent-subtle) 0%, var(--c-surface) 100%);
  border-bottom: 1.5px solid var(--c-border);
  flex-shrink: 0;
}

.upgrade-modal-title {
  font-size: 22px;
  font-weight: 750;
  color: var(--c-text-primary);
  margin: 0;
  letter-spacing: -0.5px;
}

.qr-close-btn {
  background: var(--c-surface-2);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-xs);
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--c-text-secondary);
  transition: all 0.15s;
}

.qr-close-btn:hover {
  border-color: var(--c-danger);
  color: var(--c-danger);
  background: var(--c-danger-light);
}

/* Body */
.upgrade-modal-body {
  padding: 24px 28px;
  overflow-y: auto;
  flex: 1;
}

/* Info strip */
.info-strip {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 14px;
  margin-bottom: 24px;
  background: var(--c-accent-subtle);
  border: 1.5px solid var(--c-accent-light);
  border-radius: var(--c-radius-sm);
  font-size: 13px;
  color: var(--c-text-secondary);
}

.info-strip svg {
  color: var(--c-accent);
  flex-shrink: 0;
  margin-top: 1px;
}

/* Plans grid */
.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

/* Plan card — mirrors .theme-card */
.plan-card {
  background: var(--c-surface);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius);
  padding: 20px 18px;
  display: flex;
  flex-direction: column;
  box-shadow: var(--c-shadow-sm);
  transition: box-shadow 0.22s, border-color 0.22s, transform 0.18s;
  position: relative;
}

.plan-card:hover {
  box-shadow: var(--c-shadow-md);
  border-color: var(--c-accent-2);
  transform: translateY(-3px);
}

.plan-card.current-plan {
  border-color: var(--c-accent);
  box-shadow: 0 0 0 3px rgba(124, 92, 78, 0.14), var(--c-shadow-sm);
}

.dark-mode .plan-card.current-plan {
  box-shadow: 0 0 0 3px rgba(196, 144, 110, 0.18), var(--c-shadow-sm);
}

/* Current badge — mirrors .active-badge */
.current-badge {
  position: absolute;
  top: 14px;
  right: 14px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 11px;
  background: linear-gradient(135deg, var(--c-accent), var(--c-accent-2));
  color: #fff;
  border-radius: var(--c-radius-pill);
  font-size: 11px;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(124, 92, 78, 0.35);
  letter-spacing: 0.02em;
}

/* Plan top section */
.plan-top {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1.5px solid var(--c-border);
}

.plan-title {
  font-size: 17px;
  font-weight: 750;
  color: var(--c-accent);
  letter-spacing: -0.3px;
  margin-bottom: 6px;
}

.plan-price {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--c-text-muted);
}

.plan-price svg {
  flex-shrink: 0;
  color: var(--c-text-muted);
}

/* Feature list */
.plan-features {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 9px;
  margin-bottom: 20px;
}

.plan-features li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--c-text-secondary);
}

.plan-features li.disabled {
  color: var(--c-text-muted);
  text-decoration: line-through;
}

.feat-check {
  color: var(--c-success);
  flex-shrink: 0;
}

.feat-cross {
  color: var(--c-text-muted);
  flex-shrink: 0;
}

/* Buttons — mirror save-btn / cancel-btn */
.plan-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 11px 20px;
  border-radius: var(--c-radius-sm);
  font-size: 13px;
  font-weight: 750;
  transition: all 0.15s;
  letter-spacing: 0.01em;
  width: 100%;
}

.btn-primary {
  background: var(--c-accent);
  color: #fff;
  border: none;
  box-shadow: 0 2px 8px rgba(124, 92, 78, 0.3);
}

.btn-primary:hover {
  background: var(--c-accent-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(124, 92, 78, 0.4);
}

.btn-outline {
  background: var(--c-surface-2);
  color: var(--c-text-secondary);
  border: 1.5px solid var(--c-border);
}

.btn-outline:hover {
  border-color: var(--c-accent);
  color: var(--c-accent);
  background: var(--c-accent-light);
}

.btn-current {
  background: var(--c-surface-2);
  color: var(--c-text-muted);
  border: 1.5px solid var(--c-border);
  cursor: default;
  opacity: 0.7;
}

/* Contact note */
.contact-note {
  margin-top: 24px;
  padding-top: 18px;
  border-top: 1.5px solid var(--c-border);
  text-align: center;
}

.contact-note p {
  font-size: 13px;
  color: var(--c-text-muted);
}

.contact-note a {
  color: var(--c-accent);
  font-weight: 650;
  text-decoration: none;
}

.contact-note a:hover {
  color: var(--c-accent-hover);
  text-decoration: underline;
}

/* Modal transition */
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.22s ease;
}

.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}

/* Tablet */
@media (max-width: 900px) {
  .upgrade-modal-header {
    padding: 18px 20px;
  }

  .upgrade-modal-body {
    padding: 20px;
  }

  .plans-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

/* Mobile */
@media (max-width: 640px) {
  .upgrade-overlay {
    padding: 0;
    align-items: flex-end;
  }

  .upgrade-modal {
    max-height: 92vh;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom: none;
  }

  .upgrade-modal-header {
    padding: 16px;
  }

  .upgrade-modal-title {
    font-size: 18px;
  }

  .upgrade-modal-body {
    padding: 16px;
  }

  .plans-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .plan-card:hover {
    transform: none;
  }
}

/* Touch */
@media (hover: none) and (pointer: coarse) {
  .qr-close-btn, .plan-btn {
    min-height: 44px;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
