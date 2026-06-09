<template>
  <header :class="['top-header', { 'dark-mode': isDarkMode }]">
    <div class="header-content">
      <img
          src="../../../public/images/logo.webp"
          alt="Tapmyname digital business card Logo"
          class="header-logo"
          width="800"
          height="173"
          loading="eager"
          fetchpriority="high"
      />

      <div class="header-right">

        <!-- ── Plan Status Pill (ALWAYS VISIBLE) ─────────────────────────────────── -->
        <div
            v-if="planPill.visible"
            class="plan-pill"
            :class="planPill.color"
            :title="planPill.tooltip"
        >
          <!-- Pulsing dot -->
          <span class="pill-dot" :class="planPill.color"></span>

          <!-- Icon -->
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2.2"
               stroke-linecap="round" stroke-linejoin="round"
               class="pill-icon">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>

          <span class="pill-text">{{ planPill.label }}</span>
        </div>
        <!-- ──────────────────────────────────────────────────────────────────────── -->

        <button
            class="icon-button"
            :title="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
            @click="$emit('toggle-dark-mode')"
        >
          <svg v-if="isDarkMode" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>

        <button class="icon-button" title="Settings" @click="$emit('open-settings')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="1.8"
               stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.14 12.94a7.48 7.48 0 0 0 .05-.94 7.48 7.48 0 0 0-.05-.94l2.03-1.58a.5.5 0 0 0 .12-.65l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.28 7.28 0 0 0-1.63-.94l-.36-2.54a.5.5 0 0 0-.5-.42h-3.84a.5.5 0 0 0-.5.42l-.36 2.54a7.28 7.28 0 0 0-1.63.94l-2.39-.96a.5.5 0 0 0-.6.22L2.71 8.83a.5.5 0 0 0 .12.65l2.03 1.58a7.48 7.48 0 0 0-.05.94 7.48 7.48 0 0 0 .05.94l-2.03 1.58a.5.5 0 0 0-.12.65l1.92 3.32a.5.5 0 0 0 .6.22l2.39-.96a7.28 7.28 0 0 0 1.63.94l.36 2.54a.5.5 0 0 0 .5.42h3.84a.5.5 0 0 0 .5-.42l.36-2.54a7.28 7.28 0 0 0 1.63-.94l2.39.96a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.65l-2.03-1.58z"/>
          </svg>
        </button>

        <UserNotification
            :notifications="notifications"
            @notification-click="handleNotificationClick"
            @view-all-notifications="handleViewAllNotifications"
        />
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, inject, computed, onMounted } from 'vue'
import UserNotification from './UserNotification.vue'
import {API_BASE_URL, VITE_FRONTEND_URL, VITE_IMAGE_UPLOAD_URL} from '@/config.js';
import axios from 'axios'

const theme = inject('theme', { isDark: ref(false) })
const isDarkMode = theme.isDark

defineProps({
  notifications: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits([
  'toggle-sidebar',
  'open-settings',
  'toggle-dark-mode',
  'notification-click',
  'view-all-notifications'
])

function handleNotificationClick(notification) {
  emit('notification-click', notification)
}

function handleViewAllNotifications() {
  emit('view-all-notifications')
}

// ── Plan status pill ──────────────────────────────────────────────────────────
// ✅ NOW SHOWS FOR ALL PLANS: free, demo, expired, and active paid plans

const activePlan = ref(null)  // raw data from API

async function fetchActivePlan() {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      console.warn('❌ No token found for plan fetch')
      return
    }

    const { data } = await axios.get(`${API_BASE_URL}/api/dashboard/user/plan`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    console.log('📊 Plan data received:', data)
    activePlan.value = data
  } catch (err) {
    console.warn('❌ Plan fetch failed:', err?.response?.status, err?.message)
  }
}

// ✅ UPDATED: Computed pill state — shows for ALL plans
const planPill = computed(() => {
  const data = activePlan.value

  // ✅ CHANGED: Always show pill (removed the early null check)
  if (!data) {
    return {
      visible: false
    }
  }

  const plan = data.plan || 'free'
  const duration = data.duration || 'monthly'
  const endDate = data.endDate ? new Date(data.endDate) : null

  // ========================================
  // CASE 1: Free or Demo Plan
  // ========================================
  if (plan === 'free') {
    return {
      visible: true,
      color: 'gray',
      label: 'Free',
      tooltip: 'You are on the Free plan. Upgrade to get more features.',
    }
  }

  if (plan === 'demo') {
    return {
      visible: true,
      color: 'blue',
      label: 'Demo',
      tooltip: 'You are on the Demo plan.',
    }
  }

  // ========================================
  // CASE 2: Paid Plan (plus, pro, enterprise, etc)
  // ========================================

  // ✅ Plan is expired (endDate is null or in the past)
  if (!endDate) {
    // Plan is expired
    return {
      visible: true,
      color: 'red',
      label: 'Expired',
      tooltip: `Your ${plan.charAt(0).toUpperCase() + plan.slice(1)} plan has expired. Please upgrade.`,
    }
  }

  // ✅ Plan is active with endDate in the future
  const now = new Date()
  const msLeft = endDate - now

  if (msLeft <= 0) {
    // Already expired
    return {
      visible: true,
      color: 'red',
      label: 'Expired',
      tooltip: `Your ${plan.charAt(0).toUpperCase() + plan.slice(1)} plan has expired. Please upgrade.`,
    }
  }

  // ✅ Plan is still active - show remaining days
  const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24))

  // Color logic:
  //   monthly  → red if ≤ 10 days, green otherwise
  //   annually → red if ≤ 30 days (final month), green otherwise
  const redThreshold = duration === 'annually' ? 30 : 10
  const color = daysLeft <= redThreshold ? 'red' : 'green'

  const label = daysLeft === 1
      ? `${plan} · 1 day left`
      : `${plan} · ${daysLeft} days left`

  const expireDate = endDate.toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  })

  return {
    visible: true,
    color,
    label,
    tooltip: `${plan.charAt(0).toUpperCase() + plan.slice(1)} plan (${duration}) — expires ${expireDate}`,
  }
})

onMounted(() => {
  fetchActivePlan()
})
</script>

<style scoped>
/* ══ CSS Custom Properties ══ */
.top-header {
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
  --c-shadow-xs: 0 1px 2px rgba(28,20,16,0.06);
  --c-shadow-sm: 0 2px 6px rgba(28,20,16,0.08), 0 1px 2px rgba(28,20,16,0.04);
  --c-radius-sm: 8px;
  --c-radius-xs: 5px;

  /* Pill colours — light mode */
  --pill-green-bg:     #f0fdf4;
  --pill-green-border: #bbf7d0;
  --pill-green-text:   #15803d;
  --pill-green-dot:    #22c55e;

  --pill-red-bg:       #fff1f2;
  --pill-red-border:   #fecdd3;
  --pill-red-text:     #be123c;
  --pill-red-dot:      #f43f5e;

  --pill-gray-bg:      #f3f4f6;
  --pill-gray-border:  #e5e7eb;
  --pill-gray-text:    #374151;
  --pill-gray-dot:     #9ca3af;

  --pill-blue-bg:      #eff6ff;
  --pill-blue-border:  #bfdbfe;
  --pill-blue-text:    #1e40af;
  --pill-blue-dot:     #3b82f6;

  font-family: 'Segoe UI', 'SF Pro Display', system-ui, -apple-system, sans-serif;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: var(--c-surface);
  border-bottom: 1.5px solid var(--c-border);
  z-index: 200;
  transition: background 0.2s ease, border-color 0.2s ease;
  box-shadow: var(--c-shadow-xs);
}

.top-header.dark-mode {
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
  --c-shadow-xs: 0 1px 2px rgba(0,0,0,0.2);
  --c-shadow-sm: 0 2px 6px rgba(0,0,0,0.3);

  /* Pill colours — dark mode */
  --pill-green-bg:     #052e16;
  --pill-green-border: #166534;
  --pill-green-text:   #4ade80;
  --pill-green-dot:    #4ade80;

  --pill-red-bg:       #1c0b0e;
  --pill-red-border:   #9f1239;
  --pill-red-text:     #fb7185;
  --pill-red-dot:      #fb7185;

  --pill-gray-bg:      #1f2937;
  --pill-gray-border:  #374151;
  --pill-gray-text:    #d1d5db;
  --pill-gray-dot:     #9ca3af;

  --pill-blue-bg:      #0c1e3d;
  --pill-blue-border:  #1e3a8a;
  --pill-blue-text:    #93c5fd;
  --pill-blue-dot:     #3b82f6;
}

*, *::before, *::after { box-sizing: border-box; }
button { font-family: inherit; cursor: pointer; }

/* Layout */
.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 20px;
}

.header-logo {
  height: 36px;
  width: auto;
  cursor: pointer;
  border-radius: var(--c-radius-xs);
  display: block;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* ── Plan Status Pill ──────────────────────────────────────────────────────── */
.plan-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 0 10px;
  height: 28px;
  border-radius: 9999px;
  border: 1px solid;
  font-size: 0.72rem;
  font-weight: 650;
  letter-spacing: 0.01em;
  white-space: nowrap;
  cursor: default;
  transition: opacity 0.2s;
  margin-right: 4px;
}

/* ✅ Color variants */
.plan-pill.green {
  background:    var(--pill-green-bg);
  border-color:  var(--pill-green-border);
  color:         var(--pill-green-text);
}

.plan-pill.red {
  background:    var(--pill-red-bg);
  border-color:  var(--pill-red-border);
  color:         var(--pill-red-text);
}

.plan-pill.gray {
  background:    var(--pill-gray-bg);
  border-color:  var(--pill-gray-border);
  color:         var(--pill-gray-text);
}

.plan-pill.blue {
  background:    var(--pill-blue-bg);
  border-color:  var(--pill-blue-border);
  color:         var(--pill-blue-text);
}

/* Pulsing status dot */
.pill-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.pill-dot.green {
  background: var(--pill-green-dot);
  animation: pulse-green 2s ease-in-out infinite;
}

.pill-dot.red {
  background: var(--pill-red-dot);
  animation: pulse-red 1.4s ease-in-out infinite;
}

.pill-dot.gray {
  background: var(--pill-gray-dot);
  animation: pulse-gray 2s ease-in-out infinite;
}

.pill-dot.blue {
  background: var(--pill-blue-dot);
  animation: pulse-blue 2s ease-in-out infinite;
}

.pill-icon {
  flex-shrink: 0;
  opacity: 0.75;
}

.pill-text {
  line-height: 1;
}

@keyframes pulse-green {
  0%, 100% { opacity: 1;   transform: scale(1);    }
  50%       { opacity: 0.5; transform: scale(0.85); }
}

@keyframes pulse-red {
  0%, 100% { opacity: 1;   transform: scale(1);   box-shadow: 0 0 0 0 var(--pill-red-dot); }
  50%       { opacity: 0.7; transform: scale(1.2); box-shadow: 0 0 0 3px transparent;       }
}

@keyframes pulse-gray {
  0%, 100% { opacity: 1;   transform: scale(1);    }
  50%       { opacity: 0.6; transform: scale(0.9); }
}

@keyframes pulse-blue {
  0%, 100% { opacity: 1;   transform: scale(1);    }
  50%       { opacity: 0.6; transform: scale(0.9); }
}

/* Icon buttons */
.icon-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--c-surface-2);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-xs);
  color: var(--c-accent);
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s, transform 0.1s;
  -webkit-tap-highlight-color: transparent;
}

.icon-button:hover {
  background: var(--c-accent-light);
  border-color: var(--c-accent-2);
  color: var(--c-accent-hover);
}

.icon-button:active {
  transform: scale(0.94);
  background: var(--c-accent-light);
}

/* Mobile */
@media (max-width: 480px) {
  .header-content {
    padding: 0 14px;
  }

  .header-logo {
    height: 30px;
  }

  .header-right {
    gap: 4px;
  }

  .icon-button {
    width: 38px;
    height: 38px;
  }

  /* On very small screens hide the label, keep dot + icon only */
  .pill-text {
    display: none;
  }

  .plan-pill {
    padding: 0 7px;
    gap: 4px;
  }
}

/* Touch targets */
@media (hover: none) and (pointer: coarse) {
  .icon-button {
    min-width: 44px;
    min-height: 44px;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  * { transition-duration: 0.01ms !important; }
  .pill-dot { animation: none !important; }
}
</style>
