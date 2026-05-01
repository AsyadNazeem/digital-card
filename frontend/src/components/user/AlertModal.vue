<template>
  <transition name="modal-fade">
    <div
        v-if="show"
        class="alert-modal-overlay"
        :class="{ 'dark-mode': isDarkMode }"
        @click.self="onOverlayClick"
    >
      <transition name="modal-scale">
        <div v-if="show" class="alert-modal" :class="[type]">

          <!-- Icon -->
          <div class="alert-icon-wrap" :class="type">
            <!-- success -->
            <svg v-if="type === 'success'" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <!-- error / danger -->
            <svg v-else-if="type === 'error' || type === 'danger'" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-2 14H7L5 6"/>
            </svg>
            <!-- warning / confirm -->
            <svg v-else-if="type === 'warning' || type === 'confirm'" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M10.3 3.86l-7.18 12.42A2 2 0 0 0 4.82 19h14.36a2 2 0 0 0 1.7-2.72L13.7 3.86a2 2 0 0 0-3.4 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <!-- info (default) -->
            <svg v-else width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>

          <!-- Content -->
          <h2 class="alert-title">{{ title }}</h2>
          <p class="alert-message">{{ message }}</p>

          <!-- Actions -->
          <div class="alert-actions" :class="{ single: !showCancel }">
            <button
                v-if="showCancel"
                @click="$emit('cancel')"
                class="alert-btn cancel-btn"
                type="button"
            >
              {{ cancelLabel }}
            </button>
            <button
                @click="$emit('confirm')"
                class="alert-btn confirm-btn"
                :class="type"
                type="button"
            >
              <svg v-if="type === 'error' || type === 'danger'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-2 14H7L5 6"/>
              </svg>
              <svg v-else-if="type === 'success'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {{ confirmLabel }}
            </button>
          </div>

        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup>
import { inject, ref } from 'vue';

const props = defineProps({
  show:         { type: Boolean, default: false },
  type:         { type: String,  default: 'info' }, // success | error | danger | warning | confirm | info
  title:        { type: String,  default: 'Notice' },
  message:      { type: String,  default: '' },
  confirmLabel: { type: String,  default: 'OK' },
  cancelLabel:  { type: String,  default: 'Cancel' },
  showCancel:   { type: Boolean, default: false },
  closeOnOverlay: { type: Boolean, default: true }
});

const emit = defineEmits(['confirm', 'cancel']);
const isDarkMode = inject('isDarkMode', ref(false));

function onOverlayClick() {
  if (props.closeOnOverlay) emit('cancel');
}
</script>

<style scoped>
/* ══════════════════════════════════════
   DESIGN TOKENS — contact-tab palette
══════════════════════════════════════ */
.alert-modal-overlay {
  --c-bg: #ffffff;
  --c-surface: #ffffff;
  --c-surface-2: #faf9f7;
  --c-border: #e8e3dc;
  --c-text-primary: #1c1410;
  --c-text-secondary: #5a4f46;
  --c-text-muted: #9e8e84;
  --c-accent: #7c5c4e;
  --c-accent-hover: #5e443a;
  --c-accent-light: #f0e8e4;
  --c-danger: #b83232;
  --c-danger-hover: #922828;
  --c-danger-light: #fdf0f0;
  --c-success: #2d6a50;
  --c-success-hover: #225240;
  --c-success-light: #ecf7f2;
  --c-warning: #a06010;
  --c-warning-light: #fef6ec;
  --c-info: #1a5a9e;
  --c-info-light: #eaf2fc;
  --c-shadow-lg: 0 16px 48px rgba(28,20,16,.18), 0 4px 12px rgba(28,20,16,.10);
  --c-radius: 16px;
  --c-radius-sm: 8px;
  --c-radius-pill: 100px;
  font-family: 'Segoe UI', 'SF Pro Display', system-ui, -apple-system, sans-serif;
}

.alert-modal-overlay.dark-mode {
  --c-bg: #131118;
  --c-surface: #1a1720;
  --c-surface-2: #1e1b26;
  --c-border: #2c2838;
  --c-text-primary: #f2ede8;
  --c-text-secondary: #a89490;
  --c-text-muted: #6a5e5a;
  --c-accent: #c4906e;
  --c-accent-hover: #d4a070;
  --c-accent-light: #281e18;
  --c-danger: #e06060;
  --c-danger-hover: #c84040;
  --c-danger-light: #281414;
  --c-success: #60b88a;
  --c-success-hover: #48a070;
  --c-success-light: #102418;
  --c-warning: #e8a840;
  --c-warning-light: #281c08;
  --c-info: #60a8e8;
  --c-info-light: #101c2e;
  --c-shadow-lg: 0 16px 48px rgba(0,0,0,.5), 0 4px 12px rgba(0,0,0,.3);
}

*, *::before, *::after { box-sizing: border-box; }
button { font-family: inherit; cursor: pointer; }

/* ── Overlay ── */
.alert-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(16,14,20,.55);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999999;
  padding: 16px;
}

/* ── Modal card ── */
.alert-modal {
  background: var(--c-surface);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius);
  padding: 32px 28px 28px;
  max-width: 400px;
  width: 100%;
  box-shadow: var(--c-shadow-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 14px;
}

/* ── Icon wrap ── */
.alert-icon-wrap {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
  flex-shrink: 0;
}

.alert-icon-wrap.success {
  background: var(--c-success-light);
  color: var(--c-success);
}

.alert-icon-wrap.error,
.alert-icon-wrap.danger {
  background: var(--c-danger-light);
  color: var(--c-danger);
}

.alert-icon-wrap.warning,
.alert-icon-wrap.confirm {
  background: var(--c-warning-light);
  color: var(--c-warning);
}

.alert-icon-wrap.info {
  background: var(--c-info-light);
  color: var(--c-info);
}

/* ── Text ── */
.alert-title {
  font-size: 20px;
  font-weight: 750;
  letter-spacing: -0.4px;
  color: var(--c-text-primary);
  margin: 0;
}

.alert-message {
  font-size: 14px;
  color: var(--c-text-secondary);
  line-height: 1.6;
  margin: 0;
  max-width: 320px;
}

/* ── Actions ── */
.alert-actions {
  display: flex;
  gap: 10px;
  width: 100%;
  margin-top: 6px;
}

.alert-actions.single { justify-content: center; }
.alert-actions.single .confirm-btn { min-width: 140px; }

.alert-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 12px 20px;
  border: none;
  border-radius: var(--c-radius-sm);
  font-size: 14px;
  font-weight: 650;
  transition: all 0.15s;
  letter-spacing: 0.01em;
}

/* Cancel */
.cancel-btn {
  background: var(--c-surface-2);
  border: 1.5px solid var(--c-border);
  color: var(--c-text-secondary);
}

.cancel-btn:hover {
  border-color: var(--c-accent);
  color: var(--c-accent);
  background: var(--c-accent-light);
}

/* Confirm — type variants */
.confirm-btn.success {
  background: var(--c-success);
  color: #fff;
  box-shadow: 0 2px 8px rgba(45,106,80,.25);
}
.confirm-btn.success:hover {
  background: var(--c-success-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(45,106,80,.35);
}

.confirm-btn.error,
.confirm-btn.danger {
  background: var(--c-danger);
  color: #fff;
  box-shadow: 0 2px 8px rgba(184,50,50,.25);
}
.confirm-btn.error:hover,
.confirm-btn.danger:hover {
  background: var(--c-danger-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(184,50,50,.35);
}

.confirm-btn.warning,
.confirm-btn.confirm {
  background: var(--c-accent);
  color: #fff;
  box-shadow: 0 2px 8px rgba(124,92,78,.25);
}
.confirm-btn.warning:hover,
.confirm-btn.confirm:hover {
  background: var(--c-accent-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(124,92,78,.35);
}

.confirm-btn.info {
  background: var(--c-info);
  color: #fff;
  box-shadow: 0 2px 8px rgba(26,90,158,.25);
}
.confirm-btn.info:hover {
  background: #144880;
  transform: translateY(-1px);
}

/* ── Transitions ── */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.22s ease; }
.modal-fade-enter-from,  .modal-fade-leave-to      { opacity: 0; }

.modal-scale-enter-active, .modal-scale-leave-active {
  transition: opacity 0.22s ease, transform 0.22s cubic-bezier(0.34,1.56,0.64,1);
}
.modal-scale-enter-from, .modal-scale-leave-to {
  opacity: 0;
  transform: scale(0.88) translateY(16px);
}

/* ── Mobile ── */
@media (max-width: 480px) {
  .alert-modal { padding: 26px 20px 22px; gap: 12px; }
  .alert-icon-wrap { width: 60px; height: 60px; }
  .alert-icon-wrap svg { width: 26px; height: 26px; }
  .alert-title { font-size: 18px; }
  .alert-message { font-size: 13px; }
  .alert-actions { flex-direction: column; gap: 8px; }
  .alert-btn { width: 100%; }
}

@media (hover: none) and (pointer: coarse) {
  .alert-btn { min-height: 48px; }
}

@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition-duration: 0.01ms !important; }
}
</style>
