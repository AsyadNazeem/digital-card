<template>
  <section ref="sectionRef" :class="{ 'dark-mode': isDark }" class="hiw">

    <!-- ── Layered background (mirrors features) ── -->
    <div class="hiw-bg">
      <div class="hiw-bg__stripe"></div>
      <div class="hiw-bg__circle hiw-bg__circle--1"></div>
      <div class="hiw-bg__circle hiw-bg__circle--2"></div>
      <div class="hiw-bg__dots"></div>
    </div>

    <!-- ── Header ── -->
    <div :class="{ visible: headerVis }" class="hiw-header">
      <div class="hiw-eyebrow">
        <span class="hiw-eyebrow__line"></span>
        How It Works
        <span class="hiw-eyebrow__line"></span>
      </div>
      <h2 class="hiw-title">
        Set up your company<br>
        <em>in minutes.</em>
      </h2>
      <p class="hiw-subtitle">
        Create your company workspace, assign employee digital cards,
        and start sharing through Apple Wallet, Google Wallet and QR codes instantly.
      </p>
    </div>

    <!-- ── Steps bento grid ── -->
    <div :class="{ visible: cardsVis }" class="hiw-bento">

      <!-- STEP 1 — Register (wide) -->
      <div class="hb hb--wide hb--register" style="--delay:0ms">
        <div class="hb__content">
          <div class="hb__step-badge">01</div>
          <div class="hb__icon-wrap">
            <svg fill="none" height="24" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" width="24">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div class="hb__label">Admin Setup</div>
          <h3 class="hb__title">Create your<br>account.</h3>
          <p class="hb__desc">
            Sign up with email, Apple or Google and create your
            company workspace in seconds.
          </p>
          <div class="hb__chips">
            <span class="hb-chip">Email & password</span>
            <span class="hb-chip">Sign in with Apple</span>
            <span class="hb-chip">Sign in with Google</span>
            <span class="hb-chip hb-chip--accent">Free to start</span>
          </div>
        </div>
        <div class="hb__visual hb__visual--register">
          <div class="reg-card">
            <div class="reg-card__title">Create account</div>
            <div class="reg-field">
              <span class="reg-field__label">Email</span>
              <div class="reg-field__input reg-field__input--filled">sarah@nexusco.com</div>
            </div>
            <div class="reg-field">
              <span class="reg-field__label">Password</span>
              <div class="reg-field__input reg-field__input--filled">••••••••••</div>
            </div>
            <div class="reg-divider">or continue with</div>
            <div class="reg-socials">
              <div class="reg-social reg-social--apple">
                <svg fill="white" height="11" viewBox="0 0 24 24" width="11">
                  <path
                      d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.19 1.28-2.17 3.83.02 3.02 2.65 4.03 2.68 4.04l-.06.25zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Apple
              </div>
              <div class="reg-social reg-social--google">
                <svg height="11" viewBox="0 0 24 24" width="11">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                        fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"/>
                </svg>
                Google
              </div>
            </div>
            <div class="reg-btn">Get started free →</div>
          </div>
        </div>
      </div>

      <!-- STEP 2 — Company (tall) -->
      <div class="hb hb--company" style="--delay:80ms">
        <div class="hb__content">
          <div class="hb__step-badge">02</div>
          <div class="hb__icon-wrap">
            <svg fill="none" height="24" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" width="24">
              <rect height="14" rx="2" width="20" x="2" y="7"/>
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
              <line x1="12" x2="12" y1="12" y2="16"/>
              <line x1="10" x2="14" y1="14" y2="14"/>
            </svg>
          </div>
          <div class="hb__label">Company Workspace</div>
          <h3 class="hb__title">Build your company workspace.</h3>
          <p class="hb__desc">Create a company profile with your name, logo and brand colours. This becomes the central
            hub for every employee card you issue.</p>
          <div class="hb__chips">
            <span class="hb-chip">Company profile</span>
            <span class="hb-chip">Brand colours</span>
            <span class="hb-chip">Admin controls</span>
          </div>
        </div>
        <div class="hb__visual hb__visual--company">
          <div class="co-card">
            <div class="co-card__badge">Company</div>
            <div class="co-card__name">Nexus Co.</div>
            <div class="co-card__sub">Design & Technology · Auckland</div>
            <div class="co-card__avatars">
              <div class="co-av">SM</div>
              <div class="co-av">JR</div>
              <div class="co-av">AL</div>
              <div class="co-av co-av--more">+12</div>
            </div>
          </div>
          <div class="co-actions">
            <div class="co-action co-action--active">
              <svg fill="none" height="11" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="11">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              Add employees
            </div>
            <div class="co-action">
              <svg fill="none" height="11" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="11">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
              </svg>
              Settings
            </div>
          </div>
        </div>
      </div>

      <!-- STEP 3 — Share (tall) -->
      <div class="hb hb--share" style="--delay:160ms">
        <div class="hb__content">
          <div class="hb__step-badge">03</div>
          <div class="hb__icon-wrap">
            <svg fill="none" height="24" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" width="24">
              <rect height="7" rx="1" width="7" x="3" y="3"/>
              <rect height="7" rx="1" width="7" x="14" y="3"/>
              <rect height="7" rx="1" width="7" x="3" y="14"/>
              <rect height="3" rx="0.5" width="3" x="14" y="14"/>
              <rect height="2" rx="0.5" width="2" x="19" y="14"/>
              <rect height="2" rx="0.5" width="2" x="14" y="19"/>
              <rect height="3" rx="0.5" width="3" x="18" y="18"/>
            </svg>
          </div>
          <div class="hb__label">Employee Distribution</div>
          <h3 class="hb__title">Share employee identities instantly.</h3>
          <p class="hb__desc">
            Every employee gets a branded digital business card
            with QR sharing, wallet support and a public profile link.
          </p>
          <div class="hb__chips">
            <span class="hb-chip">QR code</span>
            <span class="hb-chip">Share link</span>
            <span class="hb-chip">Apple Wallet</span>
            <span class="hb-chip">Google Wallet</span>
          </div>
        </div>
        <div class="hb__visual hb__visual--share">
          <div class="share-card">
            <div class="share-card__name">Sarah Mitchell</div>
            <div class="share-card__role">Head of Design · Nexus Co.</div>
          </div>
          <div class="share-tabs">
            <div class="share-tab share-tab--active">
              <svg fill="none" height="10" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="10">
                <rect height="7" rx="1" width="7" x="3" y="3"/>
                <rect height="7" rx="1" width="7" x="14" y="3"/>
                <rect height="7" rx="1" width="7" x="3" y="14"/>
              </svg>
              QR
            </div>
            <div class="share-tab">
              <svg fill="none" height="10" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="10">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
              Link
            </div>
            <div class="share-tab">
              <svg fill="none" height="10" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="10">
                <rect height="14" rx="2" width="20" x="2" y="5"/>
                <path d="M2 10h20"/>
              </svg>
              Wallet
            </div>
          </div>
          <div class="share-qr">
            <svg fill="none" height="64" viewBox="0 0 52 52" width="64">
              <rect height="20" rx="2" stroke="currentColor" stroke-width="2" width="20" x="2" y="2"/>
              <rect fill="currentColor" height="8" width="8" x="8" y="8"/>
              <rect height="20" rx="2" stroke="currentColor" stroke-width="2" width="20" x="30" y="2"/>
              <rect fill="currentColor" height="8" width="8" x="36" y="8"/>
              <rect height="20" rx="2" stroke="currentColor" stroke-width="2" width="20" x="2" y="30"/>
              <rect fill="currentColor" height="8" width="8" x="8" y="36"/>
              <rect fill="currentColor" height="5" width="5" x="30" y="30"/>
              <rect fill="currentColor" height="5" width="5" x="38" y="30"/>
              <rect fill="currentColor" height="5" width="5" x="46" y="30"/>
              <rect fill="currentColor" height="5" width="5" x="30" y="38"/>
              <rect fill="currentColor" height="5" width="5" x="38" y="46"/>
            </svg>
            <span class="share-qr__label">Ready to share</span>
          </div>
        </div>
      </div>

      <!-- STEP 4 — Analytics (wide) -->
      <div class="hb hb--wide2 hb--analytics" style="--delay:240ms">
        <div class="hb__content">
          <div class="hb__step-badge">04</div>
          <div class="hb__icon-wrap">
            <svg fill="none" height="24" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" width="24">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <div class="hb__label">Analytics & Insights</div>
          <h3 class="hb__title">Track every<br>interaction.</h3>
          <p class="hb__desc">
            Monitor scans, wallet saves, profile views and employee engagement
            from one centralized analytics dashboard.
          </p>
          <div class="hb__chips">
            <span class="hb-chip">Company analytics</span>
            <span class="hb-chip">Per-employee stats</span>
            <span class="hb-chip">Scan tracking</span>
            <span class="hb-chip hb-chip--accent">Real-time</span>
          </div>
        </div>
        <div class="hb__visual hb__visual--analytics">
          <div class="an-panel">
            <div class="an-top">
              <span class="an-overview">Company overview</span>
              <span class="an-live">
                <span class="an-live__dot"></span>Live
              </span>
            </div>
            <div class="an-stats">
              <div class="an-stat">
                <span class="an-stat__val">1,284</span>
                <span class="an-stat__lbl">Total views</span>
              </div>
              <div class="an-stat">
                <span class="an-stat__val">196</span>
                <span class="an-stat__lbl">Saves</span>
              </div>
              <div class="an-stat">
                <span class="an-stat__val">↑31%</span>
                <span class="an-stat__lbl">Growth</span>
              </div>
            </div>
            <div class="an-bars">
              <div v-for="(h, idx) in barData" :key="idx" class="an-bar-wrap">
                <div :style="{ '--bh': h + '%', '--bd': idx * 60 + 'ms' }" class="an-bar"></div>
                <span class="an-day">{{ days[idx] }}</span>
              </div>
            </div>
            <div class="an-users">
              <div v-for="u in analyticsUsers" :key="u.name" class="an-user">
                <div :style="{ background: u.color }" class="an-user__av">{{ u.initials }}</div>
                <div class="an-user__info">
                  <div class="an-user__name">{{ u.name }}</div>
                  <div class="an-user__bar-wrap">
                    <div :style="{ width: u.pct, background: u.color }" class="an-user__bar"></div>
                  </div>
                </div>
                <span class="an-user__pct">{{ u.pct }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- ── CTA strip ── -->
    <div :class="{ visible: ctaVis }" class="hiw-cta">
      <div class="hiw-cta__inner">
        <p class="hiw-cta__text">Ready to modernize your company identity?</p>
        <a class="hiw-cta__btn" href="/register">
          Create company workspace
          <svg fill="none" height="15" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" width="15">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
      </div>
    </div>

    <!-- ── Ticker ── -->
    <div class="hiw-ticker">
      <div class="hiw-ticker__track">
        <span v-for="n in 3" :key="n">
          <span v-for="item in tickerItems" :key="item + n" class="hiw-ticker__item">
            <span class="hiw-ticker__dot"></span>{{ item }}
          </span>
        </span>
      </div>
    </div>

  </section>
</template>

<script setup>
import {inject, onMounted, ref} from 'vue'

const { isDark, toggleDarkMode } = inject('theme')

const sectionRef = ref(null)
const headerVis = ref(false)
const cardsVis = ref(false)
const ctaVis = ref(false)

const barData = [42, 68, 55, 88, 72, 95, 60]
const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

const analyticsUsers = [
  {name: 'Sarah M.', initials: 'SM', pct: '88%', color: '#c4906e'},
  {name: 'James R.', initials: 'JR', pct: '64%', color: '#a07060'},
  {name: 'Amy L.', initials: 'AL', pct: '42%', color: '#7c5c4e'},
]

const tickerItems = [
  'Company Workspaces',
  'Employee Digital Cards',
  'Apple Wallet Integration',
  'Google Wallet Support',
  'QR Code Sharing',
  'Centralized Analytics',
  'Team Management',
  'Real-Time Engagement',
  'Public Profile Links',
  'No App Required',
]

onMounted(() => {
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) {
      headerVis.value = true
      setTimeout(() => {
        cardsVis.value = true
      }, 180)
      setTimeout(() => {
        ctaVis.value = true
      }, 600)
      io.unobserve(sectionRef.value)
    }
  }, {threshold: 0.1})
  if (sectionRef.value) io.observe(sectionRef.value)
})
</script>

<style scoped>
/* ═══════════════════════════════════════════
   DESIGN TOKENS  (identical to Features)
═══════════════════════════════════════════ */
.hiw {
  --c-bg: #faf9f7;
  --c-surface: #ffffff;
  --c-surface-2: #f5f1ed;
  --c-border: #e8e3dc;
  --c-text-primary: #1c1410;
  --c-text-secondary: #5a4f46;
  --c-text-muted: #9e8e84;
  --c-accent: #7c5c4e;
  --c-accent-2: #a07060;
  --c-accent-light: #f0e8e4;
  --c-accent-subtle: #f8f3f0;
  --c-success: #2d6a50;
  --c-success-bg: #edf7f2;

  font-family: 'Segoe UI', 'SF Pro Text', system-ui, sans-serif;
  position: relative;
  background: var(--c-bg);
  padding: 130px 40px 100px;
  overflow: hidden;
  color: var(--c-text-primary);
}

.hiw.dark-mode {
  --c-bg: #100e14;
  --c-surface: #1a1720;
  --c-surface-2: #1e1b26;
  --c-border: #2c2838;
  --c-text-primary: #f2ede8;
  --c-text-secondary: #a89490;
  --c-text-muted: #6a5e5a;
  --c-accent: #c4906e;
  --c-accent-2: #d4a880;
  --c-accent-light: #281e18;
  --c-accent-subtle: #1e1612;
  --c-success: #60b88a;
  --c-success-bg: #0d2018;
}

*, *::before, *::after {
  box-sizing: border-box;
}

/* ═══════════════════════════════════════════
   BACKGROUND  (mirrors Features exactly)
═══════════════════════════════════════════ */
.hiw-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.hiw-bg__stripe {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--c-accent), var(--c-accent-2), transparent);
  opacity: 0.5;
}

.hiw-bg__circle {
  position: absolute;
  border-radius: 50%;
  border: 1.5px solid var(--c-border);
}

.hiw-bg__circle--1 {
  width: 700px;
  height: 700px;
  top: -200px;
  right: -200px;
  opacity: 0.35;
}

.hiw-bg__circle--2 {
  width: 440px;
  height: 440px;
  bottom: -100px;
  left: -120px;
  opacity: 0.22;
}

.hiw-bg__dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(var(--c-border) 1px, transparent 1px);
  background-size: 28px 28px;
  mask-image: radial-gradient(ellipse 60% 60% at 80% 10%, black 20%, transparent);
  opacity: 0.6;
}

/* ═══════════════════════════════════════════
   HEADER
═══════════════════════════════════════════ */
.hiw-header {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 680px;
  margin: 0 auto 72px;
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}

.hiw-header.visible {
  opacity: 1;
  transform: translateY(0);
}

.hiw-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2.8px;
  text-transform: uppercase;
  color: var(--c-accent);
  margin-bottom: 22px;
}

.hiw-eyebrow__line {
  display: block;
  height: 1px;
  width: 36px;
  background: linear-gradient(90deg, transparent, var(--c-accent));
}

.hiw-eyebrow__line:last-child {
  transform: scaleX(-1);
}

.hiw-title {
  font-family: 'Georgia', 'Times New Roman', serif;
  font-size: clamp(2.4rem, 4vw, 3.8rem);
  font-weight: 900;
  letter-spacing: -1.5px;
  line-height: 1.08;
  color: var(--c-text-primary);
  margin: 0 0 20px;
}

.hiw-title em {
  font-style: italic;
  color: var(--c-accent);
  position: relative;
  display: inline-block;
}

.hiw-title em::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 2px;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, var(--c-accent), var(--c-accent-2));
  border-radius: 2px;
  opacity: 0.45;
}

.hiw-subtitle {
  font-size: 1.05rem;
  line-height: 1.78;
  color: var(--c-text-secondary);
  margin: 0;
}

/* ═══════════════════════════════════════════
   BENTO GRID  (same pattern as Features)
═══════════════════════════════════════════ */
.hiw-bento {
  position: relative;
  z-index: 2;
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns:repeat(12, 1fr);
  grid-auto-rows: minmax(280px, auto);
  gap: 16px;
}

/* Enter animation */
.hb {
  opacity: 0;
  transform: translateY(36px);
  transition: opacity 0.55s ease, transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--delay, 0ms);
  min-height: 280px;
}

.hiw-bento.visible .hb {
  opacity: 1;
  transform: translateY(0);
}

.hb--register,
.hb--analytics,
.hb--company,
.hb--share {
  min-height: 360px;
}

/* Base card */
.hb {
  grid-column: span 4;
  background: var(--c-surface);
  border: 1.5px solid var(--c-border);
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  cursor: default;
  transition: opacity 0.55s ease,
  transform 0.55s cubic-bezier(0.16, 1, 0.3, 1),
  border-color 0.22s,
  box-shadow 0.22s;
}

.hb:hover {
  border-color: var(--c-accent);
  box-shadow: 0 12px 48px rgba(124, 92, 78, 0.13);
  transform: translateY(-4px) !important;
}

/* Step badge (numbered pill top-left of content) */
.hb__step-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: var(--c-accent-subtle);
  border: 1.5px solid var(--c-accent-light);
  font-family: 'Georgia', serif;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.5px;
  color: var(--c-accent);
  margin-bottom: 10px;
  transition: background 0.2s;
}

.hb:hover .hb__step-badge {
  background: var(--c-accent-light);
}

/* Span variants */
.hb--wide {
  grid-column: span 8;
  flex-direction: row;
}

.hb--wide2 {
  grid-column: span 8;
  flex-direction: row;
}

.hb--company {
  grid-row: span 1;
}

.hb--share {
  grid-row: span 1;
}

/* Content block */
.hb__content {
  padding: 30px 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 7px;
  flex-shrink: 0;
}

.hb--wide .hb__content,
.hb--wide2 .hb__content {
  max-width: 340px;
}

.hb__icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: var(--c-accent-subtle);
  border: 1.5px solid var(--c-accent-light);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--c-accent);
  margin-bottom: 4px;
  transition: background 0.2s, transform 0.2s;
}

.hb:hover .hb__icon-wrap {
  background: var(--c-accent-light);
  transform: scale(1.05);
}

.hb__label {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 1.8px;
  text-transform: uppercase;
  color: var(--c-text-muted);
}

.hb__title {
  font-family: 'Georgia', 'Times New Roman', serif;
  font-size: 1.22rem;
  font-weight: 800;
  line-height: 1.22;
  color: var(--c-text-primary);
  margin: 0;
}

.hb__desc {
  font-size: 13.5px;
  line-height: 1.7;
  color: var(--c-text-secondary);
  margin: 0;
}

.hb__chips {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 4px;
}

.hb-chip {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 100px;
  border: 1.5px solid var(--c-border);
  background: var(--c-surface);
  font-size: 11px;
  font-weight: 600;
  color: var(--c-text-muted);
  transition: border-color 0.2s, color 0.2s;
}

.hb-chip--accent {
  border-color: var(--c-accent-light);
  color: var(--c-accent);
  background: var(--c-accent-subtle);
}

.hb:hover .hb-chip {
  border-color: var(--c-accent-light);
  color: var(--c-accent);
}

/* ── Visuals shared ── */
.hb__visual {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.hb--wide .hb__visual,
.hb--wide2 .hb__visual {
  align-items:center;
  padding: 24px 28px 24px 0;

}

.hb__visual--company,
.hb__visual--share {
  justify-content:center;
}

.reg-card,
.co-card,
.share-card,
.an-panel {
  width: 100%;
  max-width: 320px;
}

.an-panel {
  min-height: 260px;
}

/* ── Register visual ── */
.hb__visual--register {
  background: radial-gradient(circle at 60% 60%, var(--c-accent-subtle), transparent);
}

.reg-card {
  background: var(--c-surface);
  border: 1.5px solid var(--c-border);
  border-radius: 18px;
  padding: 18px;
  width: 220px;
  display: flex;
  flex-direction: column;
  gap: 9px;
  box-shadow: 0 8px 32px rgba(28, 20, 16, 0.09);
}

.reg-card__title {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .8px;
  color: var(--c-text-muted);
}

.reg-field {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.reg-field__label {
  font-size: 9.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .8px;
  color: var(--c-text-muted);
}

.reg-field__input {
  padding: 7px 10px;
  border-radius: 8px;
  border: 1.5px solid var(--c-border);
  font-size: 12px;
  color: var(--c-text-primary);
  background: var(--c-surface-2);
}

.reg-field__input--filled {
  border-color: var(--c-accent-light);
}

.reg-divider {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  color: var(--c-text-muted);
}

.reg-divider::before, .reg-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--c-border);
}

.reg-socials {
  display: flex;
  gap: 8px;
}

.reg-social {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 6px;
  border-radius: 8px;
  border: 1.5px solid var(--c-border);
  font-size: 10px;
  font-weight: 600;
  color: var(--c-text-secondary);
  background: var(--c-surface);
}

.reg-social--apple {
  background: #1a1410;
  color: #fff;
  border-color: #1a1410;
}

.reg-btn {
  padding: 9px;
  border-radius: 10px;
  text-align: center;
  background: linear-gradient(135deg, var(--c-accent-2), var(--c-accent));
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 4px 14px rgba(124, 92, 78, 0.3);
}

/* ── Company visual ── */
.hb__visual--company {
  flex-direction: column;
  gap: 10px;
  padding: 16px 20px 22px;
  justify-content: flex-end;
  background: radial-gradient(circle at 30% 80%, var(--c-accent-subtle), transparent);
}

.co-card {
  border-radius: 14px;
  padding: 14px 16px;
  background: linear-gradient(135deg, #4a3228 0%, #c4906e 100%);
  width: 100%;
}

.co-card__badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 100px;
  background: rgba(255, 255, 255, .18);
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .8px;
  margin-bottom: 7px;
}

.co-card__name {
  font-family: 'Georgia', serif;
  font-size: 16px;
  font-weight: 800;
  color: #fff;
}

.co-card__sub {
  font-size: 10px;
  color: rgba(255, 255, 255, .65);
  margin-top: 2px;
}

.co-card__avatars {
  display: flex;
  gap: 6px;
  margin-top: 10px;
}

.co-av {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: rgba(255, 255, 255, .25);
  border: 2px solid rgba(255, 255, 255, .45);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 700;
  color: #fff;
}

.co-av--more {
  opacity: .65;
  font-size: 8px;
}

.co-actions {
  display: flex;
  gap: 8px;
  width: 100%;
}

.co-action {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 7px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
  border: 1.5px solid var(--c-border);
  color: var(--c-text-muted);
  background: var(--c-surface-2);
}

.co-action--active {
  border-color: var(--c-accent);
  color: var(--c-accent);
  background: var(--c-accent-subtle);
}

/* ── Share visual ── */
.hb__visual--share {
  flex-direction: column;
  gap: 10px;
  padding: 16px 20px 22px;
  justify-content: flex-end;
  background: radial-gradient(circle at 70% 30%, var(--c-accent-subtle), transparent);
}

.share-card {
  border-radius: 12px;
  padding: 10px 14px;
  background: linear-gradient(135deg, #4a3228, #c4906e);
  width: 100%;
}

.share-card__name {
  font-size: 13px;
  font-weight: 700;
  color: #fff;
}

.share-card__role {
  font-size: 10px;
  color: rgba(255, 255, 255, .65);
  margin-top: 2px;
}

.share-tabs {
  display: flex;
  gap: 8px;
  width: 100%;
}

.share-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 6px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 600;
  border: 1.5px solid var(--c-border);
  color: var(--c-text-muted);
  background: var(--c-surface-2);
}

.share-tab--active {
  border-color: var(--c-accent);
  color: var(--c-accent);
  background: var(--c-accent-subtle);
}

.share-qr {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: var(--c-accent);
}

.share-qr__label {
  font-size: 10px;
  font-weight: 700;
  background: var(--c-success-bg);
  color: var(--c-success);
  padding: 3px 10px;
  border-radius: 100px;
  animation: fadeSlide 2.5s ease-in-out infinite;
}

@keyframes fadeSlide {
  0%, 100% {
    opacity: .7;
    transform: translateY(2px);
  }
  50% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ── Analytics visual ── */
.hb__visual--analytics {
  padding: 16px 24px 22px 0;
  align-items: flex-end;
}

.an-panel {
  background: var(--c-surface-2);
  border: 1.5px solid var(--c-border);
  border-radius: 18px;
  padding: 16px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.an-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.an-overview {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .8px;
  color: var(--c-text-muted);
}

.an-live {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10.5px;
  font-weight: 700;
  color: var(--c-success);
}

.an-live__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--c-success);
  animation: livePulse 1.5s ease infinite;
}

@keyframes livePulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .3;
  }
}

.an-stats {
  display: flex;
  gap: 8px;
}

.an-stat {
  flex: 1;
  padding: 8px;
  border-radius: 10px;
  text-align: center;
  background: var(--c-surface);
  border: 1.5px solid var(--c-border);
}

.an-stat__val {
  display: block;
  font-size: 15px;
  font-weight: 900;
  color: var(--c-text-primary);
}

.an-stat__lbl {
  font-size: 9px;
  color: var(--c-text-muted);
  font-weight: 600;
}

.an-bars {
  display: flex;
  align-items: flex-end;
  gap: 5px;
  height: 52px;
}

.an-bar-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 1;
}

.an-bar {
  width: 100%;
  background: linear-gradient(180deg, var(--c-accent-2), var(--c-accent));
  border-radius: 4px 4px 0 0;
  height: var(--bh);
  animation: barGrow 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: var(--bd);
}

@keyframes barGrow {
  from {
    height: 0;
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.an-day {
  font-size: 9px;
  color: var(--c-text-muted);
  font-weight: 600;
}

.an-users {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.an-user {
  display: flex;
  align-items: center;
  gap: 8px;
}

.an-user__av {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}

.an-user__info {
  flex: 1;
}

.an-user__name {
  font-size: 10px;
  font-weight: 600;
  color: var(--c-text-primary);
}

.an-user__bar-wrap {
  height: 4px;
  border-radius: 2px;
  background: var(--c-surface);
  margin-top: 3px;
  overflow: hidden;
}

.an-user__bar {
  height: 100%;
  border-radius: 2px;
}

.an-user__pct {
  font-size: 10px;
  font-weight: 700;
  color: var(--c-text-muted);
}

/* ═══════════════════════════════════════════
   CTA STRIP
═══════════════════════════════════════════ */
.hiw-cta {
  position: relative;
  z-index: 2;
  max-width: 1280px;
  margin: 48px auto 0;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.7s ease 0.5s, transform 0.7s ease 0.5s;
}

.hiw-cta.visible {
  opacity: 1;
  transform: translateY(0);
}

.hiw-cta__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 36px;
  background: var(--c-surface);
  border: 1.5px solid var(--c-border);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(28, 20, 16, 0.07);
}

.hiw-cta__text {
  font-family: 'Georgia', serif;
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -.3px;
  color: var(--c-text-primary);
  margin: 0;
}

.hiw-cta__btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 13px 26px;
  border-radius: 13px;
  text-decoration: none;
  background: linear-gradient(135deg, var(--c-accent-2), var(--c-accent));
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  box-shadow: 0 6px 24px rgba(124, 92, 78, 0.3);
  transition: transform 0.2s, box-shadow 0.2s;
}

.hiw-cta__btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 36px rgba(124, 92, 78, 0.42);
}

.hiw-cta__btn svg {
  transition: transform 0.2s;
}

.hiw-cta__btn:hover svg {
  transform: translateX(3px);
}

/* ═══════════════════════════════════════════
   TICKER  (identical to Features)
═══════════════════════════════════════════ */
.hiw-ticker {
  position: relative;
  z-index: 2;
  margin-top: 64px;
  overflow: hidden;
  mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
}

.hiw-ticker__track {
  display: flex;
  width: max-content;
  animation: tickerScroll 30s linear infinite;
}

.hiw-ticker__item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 22px;
  margin: 0 8px;
  border-radius: 100px;
  border: 1.5px solid var(--c-border);
  background: var(--c-surface);
  color: var(--c-text-secondary);
  font-size: 12.5px;
  font-weight: 600;
  white-space: nowrap;
  transition: border-color 0.2s;
}

.hiw-ticker__item:hover {
  border-color: var(--c-accent);
  color: var(--c-accent);
}

.hiw-ticker__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--c-accent);
  opacity: 0.6;
  flex-shrink: 0;
}

@keyframes tickerScroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-33.333%);
  }
}

/* ═══════════════════════════════════════════
   RESPONSIVE
═══════════════════════════════════════════ */
@media (max-width: 1024px) {
  .hiw-bento {
    grid-template-columns:repeat(6, 1fr);
  }

  .hb {
    grid-column: span 3;
  }

  .hb--wide {
    grid-column: span 6;
    flex-direction: column;
  }

  .hb--wide2 {
    grid-column: span 6;
    flex-direction: column;
  }

  .hb--wide .hb__content,
  .hb--wide2 .hb__content {
    max-width: 100%;
  }

  .hb__visual--analytics {
    padding: 16px 20px 20px;
    align-items: stretch;
  }

  .hb--wide .hb__visual,
  .hb--wide2 .hb__visual {
    padding: 16px 20px 20px;
    align-items: center;
  }
}

@media (max-width: 700px) {
  .hiw {
    padding: 90px 20px 70px;
  }

  .hiw-bento {
    grid-template-columns:1fr;
    grid-auto-rows: auto;
    gap: 12px;
  }

  .hb {
    grid-column: span 1 !important;
    flex-direction: column;
  }

  .hb--wide .hb__content,
  .hb--wide2 .hb__content {
    max-width: 100%;
  }

  .hb:hover {
    transform: none !important;
  }

  .hiw-cta__inner {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hiw-header, .hb, .hiw-cta, .hiw-ticker__track,
  .an-bar, .an-live__dot, .share-qr__label {
    animation: none !important;
  }

  .hiw-header, .hb, .hiw-cta {
    opacity: 1 !important;
    transform: none !important;
  }
}
</style>
