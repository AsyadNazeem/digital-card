<template>
  <section id="features" ref="sectionRef" :class="{ 'dark-mode': isDark }" class="fs">

    <!-- Layered background -->
    <div class="fs-bg">
      <div class="fs-bg__stripe"></div>
      <div class="fs-bg__circle"></div>
      <div class="fs-bg__dots"></div>
    </div>

    <!-- ── Header ── -->
    <div :class="{ visible: headerVis }" class="fs-header">

      <div class="fs-eyebrow">
        <span class="fs-eyebrow__line"></span>
        Company Identity Platform
        <span class="fs-eyebrow__line"></span>
      </div>

      <h2 class="fs-title">
        Everything your team needs
        <span>to share smarter</span>
        with QR &amp; Wallet.
      </h2>

      <p class="fs-subtitle">
        One tap shares a contact. One scan saves it forever.
        Distribute QR-powered business cards to every employee,
        push them straight to Apple and Google Wallet, and track
        every interaction from a single admin dashboard.
      </p>

    </div>

    <!-- ── Feature bento grid ── -->
    <div :class="{ visible: cardsVis }" class="fs-bento">

      <!-- CARD 1 — QR Sharing (wide) -->
      <div class="fb fb--wide fb--qr" style="--delay:0ms">
        <div class="fb__content">
          <div class="fb__icon-wrap">
            <svg fill="none" height="26" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" width="26">
              <rect height="7" rx="1" width="7" x="3" y="3"/>
              <rect height="7" rx="1" width="7" x="14" y="3"/>
              <rect height="7" rx="1" width="7" x="3" y="14"/>
              <rect height="3" rx="0.5" width="3" x="14" y="14"/>
              <rect height="2" rx="0.5" width="2" x="19" y="14"/>
              <rect height="2" rx="0.5" width="2" x="14" y="19"/>
              <rect height="2" rx="0.5" width="3" x="18" y="19"/>
              <rect fill="currentColor" height="3" rx="0.3" width="3" x="5" y="5"/>
              <rect fill="currentColor" height="3" rx="0.3" width="3" x="16" y="5"/>
              <rect fill="currentColor" height="3" rx="0.3" width="3" x="5" y="16"/>
            </svg>
          </div>
          <div class="fb__label">Smart Distribution</div>

          <h3 class="fb__title">
            QR, wallet and link sharing
            for every employee.
          </h3>

          <p class="fb__desc">
            Share company business cards instantly
            through QR codes, Apple Wallet,
            Google Wallet and secure profile links.
          </p>
        </div>
        <div class="fb__visual fb__visual--qr">
          <div class="qr-demo">
            <div class="qr-ring qr-ring--outer"></div>
            <div class="qr-ring qr-ring--mid"></div>
            <div class="qr-ring qr-ring--inner"></div>
            <svg class="qr-code" fill="none" height="72" viewBox="0 0 52 52" width="72">
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
              <rect fill="currentColor" height="5" width="5" x="30" y="46"/>
              <rect fill="currentColor" height="5" width="5" x="38" y="46"/>
              <rect fill="currentColor" height="5" width="5" x="46" y="38"/>
            </svg>
            <span class="qr-pulse"></span>
          </div>
          <div class="scan-badge">
            <svg fill="none" height="12" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" width="12">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Scanned just now
          </div>
        </div>
      </div>

      <!-- CARD 2 — Apple Wallet -->
      <div class="fb fb--apple" style="--delay:80ms">
        <div class="fb__content">
          <div class="fb__icon-wrap">
            <svg fill="currentColor" height="22" viewBox="0 0 24 24" width="22">
              <path
                  d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.19 1.28-2.17 3.83.02 3.02 2.65 4.03 2.68 4.04l-.06.25zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
          </div>
          <div class="fb__label">Apple Wallet</div>
          <h3 class="fb__title">
            Business cards inside Apple Wallet.
          </h3>
          <p class="fb__desc">Your contact is saved as a Wallet pass — always updated, always one swipe away.</p>
        </div>
        <div class="fb__visual fb__visual--wallet apple">
          <div class="wallet-pass apple-pass">
            <div class="wpass-header">
              <div class="wpass-logo">
                <svg fill="white" height="14" viewBox="0 0 24 24" width="14">
                  <path
                      d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.19 1.28-2.17 3.83.02 3.02 2.65 4.03 2.68 4.04l-.06.25zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <span>Wallet</span>
              </div>
              <span class="wpass-type">Business Card</span>
            </div>
            <div class="wpass-name">Sarah Mitchell</div>
            <div class="wpass-role">Head of Design · Nexus Co.</div>
            <div class="wpass-divider"></div>
            <div class="wpass-bottom">
              <span>sarah@nexus.co</span>
              <span class="wpass-dot">·</span>
              <span>tapmy.name/sarah</span>
            </div>
          </div>
        </div>
      </div>

      <!-- CARD 3 — Google Wallet -->
      <div class="fb fb--google" style="--delay:160ms">
        <div class="fb__content">
          <div class="fb__icon-wrap">
            <svg fill="none" height="22" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" width="22">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/>
              <path d="M2 10h20"/>
              <circle cx="6" cy="15" fill="currentColor" r="1.5"/>
            </svg>
          </div>
          <div class="fb__label">Google Wallet</div>
          <h3 class="fb__title">
            Google Wallet support for every employee.
          </h3>
          <p class="fb__desc">Add to Google Wallet in one tap. Your contact card is always ready, even offline.</p>
        </div>
        <div class="fb__visual fb__visual--wallet google">
          <div class="wallet-pass google-pass">
            <div class="gpass-bar"></div>
            <div class="gpass-avatar">SM</div>
            <div class="gpass-name">Sarah Mitchell</div>
            <div class="gpass-meta">Nexus Co. · Head of Design</div>
            <div class="gpass-chips">
              <span class="gchip">📧 Email</span>
              <span class="gchip">🔗 Profile</span>
            </div>
          </div>
        </div>
      </div>

      <!-- CARD 4 — Analytics (tall) -->
      <div class="fb fb--analytics" style="--delay:240ms">
        <div class="fb__content">
          <div class="fb__icon-wrap">
            <svg fill="none" height="22" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" width="22">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <div class="fb__label">Real-Time Analytics</div>
          <h3 class="fb__title">
            Track scans, saves and engagement.
          </h3>
          <p class="fb__desc">
            Monitor employee card performance
            with centralized analytics and real-time insights.
          </p>
        </div>
        <div class="fb__visual fb__visual--analytics">
          <div class="analytics-mini">
            <div class="am-row am-row--head">
              <span>Views this week</span>
              <span class="am-up">↑ 32%</span>
            </div>
            <div class="am-bars">
              <div v-for="(h, idx) in barData" :key="idx" class="am-bar-wrap">
                <div :style="{ '--bh': h + '%', '--bd': idx * 60 + 'ms' }" class="am-bar"></div>
                <span class="am-day">{{ days[idx] }}</span>
              </div>
            </div>
            <div class="am-stats">
              <div class="am-stat">
                <span class="am-stat__val">247</span>
                <span class="am-stat__lbl">Total views</span>
              </div>
              <div class="am-stat">
                <span class="am-stat__val">38</span>
                <span class="am-stat__lbl">Saves</span>
              </div>
              <div class="am-stat">
                <span class="am-stat__val">12</span>
                <span class="am-stat__lbl">Contacts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CARD 5 — Team -->
      <div class="fb fb--team" style="--delay:320ms">
        <div class="fb__content">
          <div class="fb__icon-wrap">
            <svg fill="none" height="22" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" width="22">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div class="fb__label">Team Management</div>
          <h3 class="fb__title">
            Manage employee cards at scale.
          </h3>
          <p class="fb__desc">Create a company profile, provision cards for employees, and manage everything from one
            admin panel.</p>
        </div>
        <div class="fb__visual fb__visual--team">
          <div class="team-stack">
            <div v-for="(m, i) in team" :key="i" :style="{ '--tc': m.color, '--ti': i }" class="team-av">
              {{ m.initials }}
              <span class="team-av__role">{{ m.role }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- CARD 6 — Themes (wide) -->
<!--      <div class="fb fb&#45;&#45;themes fb&#45;&#45;wide2" style="&#45;&#45;delay:400ms">-->
<!--        <div class="fb__content">-->
<!--          <div class="fb__icon-wrap">-->
<!--            <svg fill="none" height="22" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" width="22">-->
<!--              <circle cx="13.5" cy="6.5" r="2.5"/>-->
<!--              <circle cx="6.5" cy="12" r="2.5"/>-->
<!--              <circle cx="13.5" cy="17.5" r="2.5"/>-->
<!--              <circle cx="19" cy="12" r="2.5"/>-->
<!--            </svg>-->
<!--          </div>-->
<!--          <div class="fb__label">Design Customization</div>-->
<!--          <h3 class="fb__title">-->
<!--            Custom branding for every company.-->
<!--          </h3>-->
<!--          <p class="fb__desc">Choose from curated premium themes or customize every detail — colors, fonts, layouts — to-->
<!--            match your identity.</p>-->
<!--        </div>-->
<!--        <div class="fb__visual fb__visual&#45;&#45;themes">-->
<!--          <div class="theme-swatches">-->
<!--            <div class="ts" style="background:linear-gradient(135deg,#1c1410,#7c5c4e)"><span>Classic</span></div>-->
<!--            <div class="ts" style="background:linear-gradient(135deg,#0f2027,#203a43,#2c5364)"><span>Ocean</span></div>-->
<!--            <div class="ts" style="background:linear-gradient(135deg,#2d1b69,#11998e)"><span>Aura</span></div>-->
<!--            <div class="ts" style="background:linear-gradient(135deg,#f8f3f0,#e8e3dc);color:#1c1410"><span>Linen</span>-->
<!--            </div>-->
<!--            <div class="ts ts&#45;&#45;active" style="background:linear-gradient(135deg,#7c5c4e,#c4906e)">-->
<!--              <span>Terracotta ✓</span></div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->

    </div>

    <!-- ── Ticker ── -->
    <div class="fs-ticker">
      <div class="fs-ticker__track">
        <span v-for="n in 3" :key="n">
          <span v-for="item in tickerItems" :key="item + n" class="fs-ticker__item">
            <span class="fs-ticker__dot"></span>{{ item }}
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

const barData = [42, 68, 55, 88, 72, 95, 60]
const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

const team = [
  {initials: 'SM', color: '#c4906e', role: 'Design'},
  {initials: 'RK', color: '#7c5c4e', role: 'Sales'},
  {initials: 'JL', color: '#a07060', role: 'Dev'},
  {initials: 'AP', color: '#5e443a', role: 'CEO'},
]

const tickerItems = [
  'QR Code Sharing', 'Apple Wallet', 'Google Wallet', 'Share via Link',
  'Live Analytics', 'Team Profiles', 'Premium Themes', 'Instant Updates',
  'No App Required', 'CRM Ready',
]

onMounted(() => {
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) {
      headerVis.value = true
      setTimeout(() => {
        cardsVis.value = true
      }, 180)
      io.unobserve(sectionRef.value)
    }
  }, {threshold: 0.12})
  if (sectionRef.value) io.observe(sectionRef.value)
})
</script>

<style scoped>
/* ── Section shell ── */
.fs {
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
}

.fs.dark-mode {
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

.fb,
.team-av,
.am-bar,
.qr-ring {

  --op: 1;
  --bh: 50%;
  --bd: 0ms;
  --ti: 0;
  --tc: #c4906e;
}

*, *::before, *::after {
  box-sizing: border-box;
}

/* ── Background ── */
.fs-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.fs-bg__stripe {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--c-accent), var(--c-accent-2), transparent);
  opacity: 0.5;
}

.fs-bg__circle {
  position: absolute;
  width: 700px;
  height: 700px;
  border-radius: 50%;
  border: 1.5px solid var(--c-border);
  opacity: 0.35;
  top: -200px;
  right: -200px;
}

.fs-bg__dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(var(--c-border) 1px, transparent 1px);
  background-size: 28px 28px;
  mask-image: radial-gradient(ellipse 60% 60% at 80% 10%, black 20%, transparent);
  opacity: 0.6;
}

/* ── Header ── */
.fs-header {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 680px;
  margin: 0 auto 72px;
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}

.fs-header.visible {
  opacity: 1;
  transform: translateY(0);
}

.fs-eyebrow {
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

.fs-eyebrow__line {
  display: block;
  height: 1px;
  width: 36px;
  background: linear-gradient(90deg, transparent, var(--c-accent));
}

.fs-eyebrow__line:last-child {
  transform: scaleX(-1);
}

/* =========================================================
   FEATURES TITLE
========================================================= */

.fs-title {

  margin: 0 0 26px;

  max-width: 980px;

  margin-inline: auto;

  font-family: 'Georgia',
  'Times New Roman',
  serif;

  font-size: clamp(2.1rem, 3.2vw, 3.2rem);

  font-weight: 900;

  line-height: 1.02;

  letter-spacing: -2px;

  color: var(--c-text-primary);

  text-wrap: balance;
}

/* Accent text inline */

.fs-title span {

  position: relative;

  display: inline;

  font-style: italic;

  color: var(--c-accent);

  letter-spacing: -1.5px;
}

/* Underline */

.fs-title span::after {

  content: '';

  position: absolute;

  left: 0;

  bottom: 5px;

  width: 100%;

  height: 3px;

  border-radius: 999px;

  background: linear-gradient(
      90deg,
      var(--c-accent),
      var(--c-accent-2)
  );

  opacity: 0.28;
}

.fs-subtitle {
  font-size: 1.05rem;
  line-height: 1.78;
  color: var(--c-text-secondary);
  margin: 0;
}

/* ── Bento grid ── */
.fs-bento {
  position: relative;
  z-index: 2;
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(13, 1fr);
  grid-auto-rows: minmax(260px, auto);
  gap: 16px;
}

/* Cards enter animation */
.fb {
  opacity: 0;
  transform: translateY(36px);
  transition: opacity 0.55s ease, transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--delay, 0ms);
  min-height: 260px;
}

.fs-bento.visible .fb {
  opacity: 1;
  transform: translateY(0);
}

/* Base card */
.fb {
  grid-column: span 4;
  background: var(--c-surface);
  border: 1.5px solid var(--c-border);
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  transition: opacity 0.55s ease, transform 0.55s cubic-bezier(0.16, 1, 0.3, 1),
  border-color 0.22s, box-shadow 0.22s;
  cursor: default;
}

.fb:hover {
  border-color: var(--c-accent);
  box-shadow: 0 12px 48px rgba(124, 92, 78, 0.13);
  transform: translateY(-4px) !important;
}

/* Span variants */
.fb--wide {
  grid-column: span 8;
  flex-direction: row;
}

.fb--wide2 {
  grid-column: span 8;
  flex-direction: row;
}

.fb--analytics {
  grid-row: span 1;
}

.fb--google,
.fb--team {
  min-height: 320px;
}

/* Content block */
.fb__content {
  padding: 30px 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
}

.fb--wide .fb__content,
.fb--wide2 .fb__content {
  max-width: 340px;
}

.fb__icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: var(--c-accent-subtle);
  border: 1.5px solid var(--c-accent-light);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--c-accent);
  margin-bottom: 6px;
  transition: background 0.2s, transform 0.2s;
}

.fb:hover .fb__icon-wrap {
  background: var(--c-accent-light);
  transform: scale(1.05);
}

.fb__label {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 1.8px;
  text-transform: uppercase;
  color: var(--c-text-muted);
}

.fb__title {
  font-family: 'Georgia', 'Times New Roman', serif;
  font-size: 1.15rem;
  font-weight: 800;
  line-height: 1.35;
  color: var(--c-text-primary);
  margin: 0;
}

.fb__desc {
  font-size: 14px;
  line-height: 1.8;
  color: var(--c-text-secondary);
  margin: 0;
}

/* ── Visuals ── */
.fb__visual {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.fb--wide .fb__visual,
.fb--wide2 .fb__visual {
  align-items: flex-end;
  padding: 24px 28px 24px 0;
}

/* QR visual */
.fb__visual--qr {
  background: radial-gradient(circle at 60% 60%, var(--c-accent-subtle), transparent);
}

.qr-demo {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 140px;
  height: 140px;
}

.qr-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid var(--c-accent-light);
  animation: ringPulse 3s ease-in-out infinite;
}

.qr-ring--outer {
  width: 130px;
  height: 130px;
  opacity: 0.4;
  animation-delay: 0s;
}

.qr-ring--mid {
  width: 100px;
  height: 100px;
  opacity: 0.55;
  animation-delay: 0.6s;
}

.qr-ring--inner {
  width: 70px;
  height: 70px;
  opacity: 0.7;
  animation-delay: 1.2s;
}

@keyframes ringPulse {
  0%, 100% {
    transform: scale(1);
    opacity: var(--op, 0.4);
  }
  50% {
    transform: scale(1.06);
  }
}

.qr-code {
  position: relative;
  z-index: 2;
  color: var(--c-accent);
}

.qr-pulse {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(124, 92, 78, 0.12), transparent 70%);
  animation: qrGlow 2.4s ease infinite;
}

@keyframes qrGlow {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.08);
  }
}

.scan-badge {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 100px;
  background: var(--c-success-bg);
  color: var(--c-success);
  font-size: 11.5px;
  font-weight: 700;
  white-space: nowrap;
  border: 1px solid rgba(45, 106, 80, 0.2);
  animation: fadeSlide 2.5s ease-in-out infinite;
}

@keyframes fadeSlide {
  0%, 100% {
    opacity: 0.7;
    transform: translateX(-50%) translateY(3px);
  }
  50% {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.scan-badge svg {
  color: var(--c-success);
}

/* Wallet visual */
.fb__visual--wallet {
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 20px;
}

.wallet-pass {
  border-radius: 16px;
  overflow: hidden;
  width: 100%;
  height: 100%;
  box-shadow: 0 8px 32px rgba(28, 20, 16, 0.18);
}

.apple-pass {
  background: linear-gradient(135deg, #1c1410 0%, #7c5c4e 60%, #c4906e 100%);
  padding: 6px;
  color: #fff;
  font-family: 'Segoe UI', system-ui, sans-serif;
  top: 20px;
}

.wpass-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.wpass-logo {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.8);
}

.wpass-type {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 1px;
  text-transform: uppercase;
}

.wpass-name {
  font-family: 'Georgia', serif;
  font-size: 17px;
  font-weight: 800;
  color: #fff;
  margin-bottom: 3px;
}

.wpass-role {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.65);
  margin-bottom: 12px;
}

.wpass-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.18);
  margin: 10px 0;
}

.wpass-bottom {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.6);
}

.wpass-dot {
  opacity: 0.4;
}

.google-pass {
  background: #fff;
  border: 1px solid #e0e0e0;
  padding: 14px;
  border-radius: 14px;
  overflow: visible;
  width: 100%;
  max-width: 360px;
}

.dark-mode .google-pass {
  background: #2c2838;
  border-color: #3c3848;
}

.gpass-bar {
  height: 5px;
  border-radius: 3px;
  background: linear-gradient(90deg, #4285F4, #EA4335, #FBBC05, #34A853);
  margin-bottom: 14px;
}

.gpass-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--c-accent), var(--c-accent-2));
  color: #fff;
  font-weight: 700;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.gpass-name {
  font-weight: 700;
  font-size: 14px;
  color: var(--c-text-primary);
  margin-bottom: 2px;
}

.gpass-meta {
  font-size: 11px;
  color: var(--c-text-muted);
  margin-bottom: 10px;
}

.gpass-chips {
  display: flex;
  gap: 6px;
}

.gchip {
  padding: 4px 10px;
  border-radius: 100px;
  font-size: 10.5px;
  font-weight: 600;
  background: var(--c-accent-subtle);
  color: var(--c-accent);
  border: 1px solid var(--c-accent-light);
}

/* Analytics visual */
.fb__visual--analytics {
  padding: 16px 20px 20px;
  align-items: stretch;
  flex-direction: column;
  justify-content: center;
}

.analytics-mini {
  background: var(--c-surface-2);
  border: 1.5px solid var(--c-border);
  border-radius: 16px;
  padding: 16px;
  width: 100%;
}

.am-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.am-row--head {
  font-size: 12px;
  color: var(--c-text-muted);
  font-weight: 600;
}

.am-up {
  color: var(--c-success);
  font-weight: 700;
  font-size: 12px;
}

.am-bars {
  display: flex;
  align-items: flex-end;
  gap: 5px;
  height: 60px;
  margin-bottom: 14px;
}

.am-bar-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 1;
}

.am-bar {
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

.am-day {
  font-size: 9px;
  color: var(--c-text-muted);
  font-weight: 600;
}

.am-stats {
  display: flex;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--c-border);
}

.am-stat {
  flex: 1;
  text-align: center;
}

.am-stat__val {
  display: block;
  font-size: 17px;
  font-weight: 800;
  color: var(--c-text-primary);
}

.am-stat__lbl {
  font-size: 10px;
  color: var(--c-text-muted);
}

/* Team visual */
.fb__visual--team {
  flex-direction: column;
  gap: 8px;
  padding: 0 20px 20px;
  justify-content: center;
}

.team-stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  margin-top: 12px;
}

.team-av {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 12px;
  background: var(--c-surface-2);
  border: 1.5px solid var(--c-border);
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  position: relative;
  animation: teamSlide 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: calc(var(--ti) * 80ms + 400ms);
}

@keyframes teamSlide {
  from {
    opacity: 0;
    transform: translateX(12px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.team-av::before {
  content: attr(data-init);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--tc);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 800;
  flex-shrink: 0;
}

.team-av__role {
  margin-left: auto;
  font-size: 10.5px;
  font-weight: 600;
  color: var(--c-text-muted);
  letter-spacing: 0.5px;
}

/* Themes visual */
.fb__visual--themes {
  gap: 8px;
  flex-wrap: wrap;
  padding: 16px 28px 20px 0;
  align-items: center;
}

.theme-swatches {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
}

.ts {
  width: 80px;
  height: 64px;
  border-radius: 14px;
  display: flex;
  align-items: flex-end;
  padding: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.ts:hover {
  transform: translateY(-4px) scale(1.04);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.25);
}

.ts span {
  font-size: 9px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 0.3px;
}

.ts--active {
  box-shadow: 0 4px 16px rgba(124, 92, 78, 0.45), 0 0 0 2.5px var(--c-accent);
}

.ts--active span {
  color: #fff;
}

/* ── Ticker ── */
.fs-ticker {
  position: relative;
  z-index: 2;
  margin-top: 72px;
  overflow: hidden;
  mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
}

.fs-ticker__track {
  display: flex;
  width: max-content;
  animation: tickerScroll 30s linear infinite;
}

.fs-ticker__item {
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

.fs-ticker__item:hover {
  border-color: var(--c-accent);
  color: var(--c-accent);
}

.fs-ticker__dot {
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

/* ── Responsive ── */
@media (max-width: 1024px) {
  .fs-bento {
    grid-template-columns:repeat(6, 1fr);
  }

  .fb {
    grid-column: span 3;
  }

  .fb--wide {
    grid-column: span 6;
    flex-direction: column;
  }

  .fb--wide2 {
    grid-column: span 6;
    flex-direction: column;
  }

  .fb--analytics {
    grid-row: span 1;
  }

  .fb--wide .fb__content, .fb--wide2 .fb__content {
    max-width: 100%;
  }

  .fb__visual--wallet {
    padding: 12px 16px 20px;
    align-items: center;
  }
}

@media (max-width: 700px) {
  .fs {
    padding: 90px 20px 70px;
  }

  .fs-bento {
    grid-template-columns:1fr;
    grid-auto-rows: auto;
    gap: 12px;
  }

  .fb {
    grid-column: span 1 !important;
    flex-direction: column;
  }

  .fb--wide .fb__content, .fb--wide2 .fb__content {
    max-width: 100%;
  }

  .fb:hover {
    transform: none !important;
  }

  .team-stack {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .team-av {
    min-width: calc(50% - 4px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .qr-ring, .qr-pulse, .scan-badge, .am-bar, .team-av, .fs-ticker__track {
    animation: none !important;
  }

  .fs-header, .fb {
    opacity: 1 !important;
    transform: none !important;
  }
}
</style>
