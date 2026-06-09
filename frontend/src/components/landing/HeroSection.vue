<template>
  <section class="hero" :class="{ 'dark-mode': isDark }">

    <!-- Ambient background -->
    <div class="hero-canvas">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
      <div class="grid-overlay"></div>
    </div>

    <div class="hero-shell">

      <!-- LEFT: Copy -->
      <div class="hero-copy">

        <div class="eyebrow">
          <span class="eyebrow-dot"></span>
          Digital Business Card
          <span class="eyebrow-sep">·</span>
          One Tap Away
        </div>

        <h1 class="hero-headline">
          Business cards got smarter
          <span>with QR codes</span>
          and digital wallets.
        </h1>

        <p class="hero-sub">
          Forget paper. Share your contact instantly with a
          <strong>QR code tap</strong>, save to
          <strong>Apple or Google Wallet</strong>, and let your
          team shine - all managed from one smart dashboard.
        </p>

        <!-- CTA row -->
        <div class="cta-row">
          <router-link to="/register" class="btn-primary">
            <span>Create Your Digital Business Card</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </router-link>
          <a href="#features" class="btn-ghost">See how it works</a>
        </div>

        <!-- Wallet badges -->
        <div class="wallet-strip">
          <span class="wallet-label">Works with</span>
          <div class="wallet-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path
                  d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.19 1.28-2.17 3.83.02 3.02 2.65 4.03 2.68 4.04l-.06.25zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Apple Wallet
          </div>
          <div class="wallet-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/>
              <path d="M2 10h20"/>
            </svg>
            Google Wallet
          </div>
          <div class="wallet-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M3 9h18M9 21V9"/>
            </svg>
            QR Sharing
          </div>
        </div>

        <!-- Social proof -->
<!--        <div class="hero-pills">-->

<!--          <span>Company Management</span>-->
<!--          <span>Employee Cards</span>-->
<!--          <span>Apple Wallet</span>-->
<!--          <span>Google Wallet</span>-->
<!--          <span>QR Sharing</span>-->
<!--          <span>Analytics</span>-->

<!--        </div>-->

      </div>

      <!-- RIGHT: Visual card stack -->
      <div class="hero-visual">

        <!-- Floating card mock -->
        <div class="card-stage">

          <div class="hero-image-wrap">
            <div class="image-backdrop"></div>
            <img
                :src="isDark ? '/images/darkheader.webp' : '/images/lightheader.webp'"
                alt="TapMyName digital business card platform dashboard"
                class="hero-image"
                width="850"
                height="380"
                fetchpriority="high"
            />
          </div>

          <!-- Main business card -->
          <!--          <div class="biz-card biz-card&#45;&#45;main">-->
          <!--            <div class="biz-card-bg"></div>-->
          <!--            <div class="biz-card-inner">-->
          <!--              <div class="biz-logo">-->
          <!--                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">-->
          <!--                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>-->
          <!--                </svg>-->
          <!--              </div>-->
          <!--              <div class="biz-info">-->
          <!--                <div class="biz-name">Sarah Mitchell</div>-->
          <!--                <div class="biz-title">Head of Design · Nexus Co.</div>-->
          <!--              </div>-->
          <!--              <div class="biz-meta">-->
          <!--                <span>sarah@nexus.co</span>-->
          <!--                <span>+1 (415) 000 0000</span>-->
          <!--              </div>-->
          <!--              <div class="biz-qr-wrap">-->
          <!--                <div class="biz-qr">-->
          <!--                  &lt;!&ndash; Simplified QR visual &ndash;&gt;-->
          <!--                  <svg width="52" height="52" viewBox="0 0 52 52" fill="none">-->
          <!--                    <rect x="2" y="2" width="20" height="20" rx="2" stroke="white" stroke-width="2"/>-->
          <!--                    <rect x="8" y="8" width="8" height="8" fill="white"/>-->
          <!--                    <rect x="30" y="2" width="20" height="20" rx="2" stroke="white" stroke-width="2"/>-->
          <!--                    <rect x="36" y="8" width="8" height="8" fill="white"/>-->
          <!--                    <rect x="2" y="30" width="20" height="20" rx="2" stroke="white" stroke-width="2"/>-->
          <!--                    <rect x="8" y="36" width="8" height="8" fill="white"/>-->
          <!--                    <rect x="30" y="30" width="5" height="5" fill="white"/>-->
          <!--                    <rect x="38" y="30" width="5" height="5" fill="white"/>-->
          <!--                    <rect x="46" y="30" width="5" height="5" fill="white"/>-->
          <!--                    <rect x="30" y="38" width="5" height="5" fill="white"/>-->
          <!--                    <rect x="30" y="46" width="5" height="5" fill="white"/>-->
          <!--                    <rect x="38" y="46" width="5" height="5" fill="white"/>-->
          <!--                    <rect x="46" y="38" width="5" height="5" fill="white"/>-->
          <!--                  </svg>-->
          <!--                </div>-->
          <!--                <span class="biz-qr-label">Tap or scan</span>-->
          <!--              </div>-->
          <!--            </div>-->
          <!--          </div>-->

          <!-- Wallet pass badge -->
          <div class="float-badge badge-wallet">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/>
              <path d="M2 10h20"/>
            </svg>
            <span>Saved to Wallet</span>
            <span class="badge-check">✓</span>
          </div>

          <!-- QR scan notification -->
          <div class="float-badge badge-scan">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            <span>3 new scans today</span>
          </div>

          <!-- Share pill -->
          <div class="float-badge badge-share">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="18" cy="5" r="3"/>
              <circle cx="6" cy="12" r="3"/>
              <circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            <span>Shared via link</span>
          </div>

          <!-- Analytics chip -->
          <div class="analytics-chip">
            <div class="chip-label">This month</div>
            <div class="chip-bars">
              <div class="bar" style="--h:30%"></div>
              <div class="bar" style="--h:60%"></div>
              <div class="bar" style="--h:45%"></div>
              <div class="bar" style="--h:80%"></div>
              <div class="bar" style="--h:55%"></div>
              <div class="bar" style="--h:90%"></div>
              <div class="bar" style="--h:70%"></div>
            </div>
            <div class="chip-stat">↑ 24% views</div>
          </div>

        </div>

      </div>
    </div>

    <!-- Bottom wave -->
    <div class="hero-wave">
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
        <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="var(--wave-fill)"/>
      </svg>
    </div>

  </section>
</template>

<script setup>
import {inject, ref} from 'vue'

const { isDark, toggleDarkMode } = inject('theme')
</script>

<style scoped>
/* ── Design tokens (mirrors existing app palette) ── */
.hero {
  --c-bg: #faf9f7;
  --c-surface: #ffffff;
  --c-border: #e8e3dc;
  --c-text-primary: #1c1410;
  --c-text-secondary: #5a4f46;
  --c-text-muted: #9e8e84;
  --c-accent: #7c5c4e;
  --c-accent-2: #a07060;
  --c-accent-hover: #5e443a;
  --c-accent-light: #f0e8e4;
  --c-accent-subtle: #f8f3f0;
  --c-success: #2d6a50;
  --wave-fill: #f8f3f0;

  font-family: 'Georgia', 'Times New Roman', serif;
  position: relative;
  overflow: hidden;
  min-height: 100vh;
}

.hero.dark-mode {
  --c-bg: #100e14;
  --c-surface: #1a1720;
  --c-border: #2c2838;
  --c-text-primary: #f2ede8;
  --c-text-secondary: #a89490;
  --c-text-muted: #6a5e5a;
  --c-accent: #c4906e;
  --c-accent-2: #d4a880;
  --c-accent-hover: #d4a070;
  --c-accent-light: #281e18;
  --c-accent-subtle: #1e1612;
  --wave-fill: #161220;
}

*, *::before, *::after {
  box-sizing: border-box;
}

/* ── Ambient canvas ── */
.hero-canvas {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.55;
}

.blob-1 {
  width: 520px;
  height: 520px;
  background: radial-gradient(circle, rgba(160, 112, 96, 0.22), transparent);
  top: -120px;
  left: -140px;
}

.blob-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(124, 92, 78, 0.18), transparent);
  bottom: 0;
  right: -80px;
}

.blob-3 {
  width: 260px;
  height: 260px;
  background: radial-gradient(circle, rgba(200, 148, 114, 0.14), transparent);
  top: 40%;
  left: 42%;
}

.dark-mode .blob {
  opacity: 0.65;
}

.grid-overlay {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(124, 92, 78, 0.06) 1px, transparent 1px),
  linear-gradient(90deg, rgba(124, 92, 78, 0.06) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse 70% 70% at 50% 30%, black, transparent);
}

/* ── Shell ── */
.hero-shell {
  position: relative;
  z-index: 2;
  max-width: 1480px;
  margin: 0 auto;
  padding: 110px 48px 20px;
  display: grid;
  grid-template-columns: 1fr 1.05fr;
  align-items: center;
  gap: 72px;
  min-height: 100vh;
}

/* ── LEFT: Copy ── */
.hero-copy {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* Eyebrow */
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2.4px;
  text-transform: uppercase;
  color: var(--c-accent);
  margin-bottom: 28px;
}

.eyebrow-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--c-accent);
  animation: pulse 2.4s ease infinite;
}

.eyebrow-sep {
  color: var(--c-text-muted);
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(124, 92, 78, 0.45);
  }
  50% {
    box-shadow: 0 0 0 6px rgba(124, 92, 78, 0);
  }
}

/* =========================================================
   HERO HEADLINE
========================================================= */

.hero-headline {

  position: relative;

  margin: 0 0 26px;

  max-width: 680px;

  font-family: 'Georgia',
  'Times New Roman',
  serif;

  font-size: clamp(2rem, 4.6vw, 4.9rem);

  font-weight: 900;

  line-height: 0.98;

  letter-spacing: -2px;

  color: var(--c-text-primary);

  text-wrap: balance;
}

/* Accent */

.hero-headline span {

  position: relative;

  display: inline-block;

  margin: 8px 0;

  font-style: italic;

  color: var(--c-accent);
}

.hero-headline span::after {

  content: '';

  position: absolute;

  left: 0;

  bottom: 4px;

  width: 100%;

  height: 3px;

  border-radius: 999px;

  background: linear-gradient(
      90deg,
      var(--c-accent),
      var(--c-accent-2)
  );

  opacity: 0.32;
}

/* =========================================================
   HERO SUBTEXT
========================================================= */

.hero-sub {

  margin: 0 0 42px;

  max-width: 620px;

  font-family: 'Segoe UI',
  system-ui,
  sans-serif;

  font-size: 1.08rem;

  line-height: 1.9;

  font-weight: 400;

  color: var(--c-text-secondary);

  letter-spacing: 0.1px;
}

.hero-sub strong {

  color: var(--c-accent);

  font-weight: 700;
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 980px) {

  .hero-headline {

    max-width: 100%;

    font-size: clamp(3rem, 10vw, 5rem);

    line-height: 0.96;
  }

  .hero-sub {

    max-width: 100%;
  }
}

@media (max-width: 640px) {

  .hero-headline {

    font-size: clamp(2.8rem, 14vw, 4.2rem);

    line-height: 0.98;

    letter-spacing: -2px;
  }

  .hero-headline span {

    margin: 8px 0;
  }

  .hero-sub {

    font-size: 1rem;

    line-height: 1.8;
  }
}

/* CTA */
.cta-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 36px;
  flex-wrap: wrap;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 15px 30px;
  background: linear-gradient(135deg, var(--c-accent-2), var(--c-accent));
  color: #fff;
  border-radius: 14px;
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  letter-spacing: 0.2px;
  box-shadow: 0 8px 32px rgba(124, 92, 78, 0.35);
  transition: transform 0.22s ease, box-shadow 0.22s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 44px rgba(124, 92, 78, 0.45);
}

.btn-primary svg {
  transition: transform 0.2s;
}

.btn-primary:hover svg {
  transform: translateX(3px);
}

.btn-ghost {
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--c-text-secondary);
  text-decoration: none;
  padding: 14px 20px;
  border-radius: 12px;
  border: 1.5px solid var(--c-border);
  background: var(--c-surface);
  transition: border-color 0.2s, color 0.2s;
}

.btn-ghost:hover {
  border-color: var(--c-accent);
  color: var(--c-accent);
}

/* Wallet strip */
.wallet-strip {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 40px;
}

.wallet-label {
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: var(--c-text-muted);
  text-transform: uppercase;
  letter-spacing: 1.2px;
  margin-right: 4px;
}

.wallet-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--c-surface);
  border: 1.5px solid var(--c-border);
  border-radius: 100px;
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: var(--c-text-secondary);
  transition: border-color 0.18s, color 0.18s;
}

.wallet-pill:hover {
  border-color: var(--c-accent);
  color: var(--c-accent);
}

.wallet-pill svg {
  color: var(--c-accent);
}

/* Social proof */
.proof-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.avatar-stack {
  display: flex;
}

.av {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 2.5px solid var(--c-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  margin-left: -8px;
}

.av:first-child {
  margin-left: 0;
}

.proof-text {
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 13px;
  color: var(--c-text-muted);
  margin: 0;
}

.proof-text strong {
  color: var(--c-text-primary);
}

/* ── RIGHT: Visual ── */
.hero-visual {
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-stage {
  position: relative;
  width: 420px;
  height: 500px;
}

/* Main biz card */
.biz-card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -52%) rotate(-4deg);
  width: 340px;
  height: 200px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 30px 80px rgba(28, 20, 16, 0.28), 0 8px 24px rgba(28, 20, 16, 0.14);
  animation: cardFloat 5s ease-in-out infinite;
}

@keyframes cardFloat {
  0%, 100% {
    transform: translate(-50%, -52%) rotate(-4deg) translateY(0);
  }
  50% {
    transform: translate(-50%, -52%) rotate(-4deg) translateY(-10px);
  }
}

.biz-card-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #4a3228 0%, #7c5c4e 40%, #a07060 70%, #c4906e 100%);
}

.biz-card-inner {
  position: relative;
  z-index: 2;
  padding: 22px 22px 18px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.biz-logo {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
}

.biz-info {
  margin-top: 8px;
}

.biz-name {
  font-family: 'Georgia', serif;
  font-size: 17px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.3px;
}

.biz-title {
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.72);
  margin-top: 3px;
  letter-spacing: 0.3px;
}

.biz-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.biz-meta span {
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 10.5px;
  color: rgba(255, 255, 255, 0.65);
}

.biz-qr-wrap {
  position: absolute;
  bottom: 18px;
  right: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.biz-qr {
  background: rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  padding: 6px;
  backdrop-filter: blur(6px);
}

.biz-qr-label {
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 9px;
  color: rgba(255, 255, 255, 0.55);
  letter-spacing: 0.5px;
}

/* Floating badges */
.float-badge {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--c-surface);
  border: 1.5px solid var(--c-border);
  border-radius: 100px;
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: var(--c-text-primary);
  box-shadow: 0 8px 28px rgba(28, 20, 16, 0.12);
  white-space: nowrap;
}

.float-badge svg {
  color: var(--c-accent);
  flex-shrink: 0;
}

.badge-wallet {
  top: 50px;
  right: -110px;
  animation: floatBadge1 4s ease-in-out infinite;
}

.badge-scan {
  bottom: 50px;
  left: -180px;
  animation: floatBadge2 4.5s ease-in-out 0.6s infinite;
}

.badge-share {
  bottom: 20px;
  right: 10px;
  animation: floatBadge1 5s ease-in-out 1.2s infinite;
}

.badge-check {
  color: var(--c-success);
  font-weight: 700;
}

@keyframes floatBadge1 {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}

@keyframes floatBadge2 {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(6px);
  }
}

/* Analytics chip */
.analytics-chip {
  position: absolute;
  top: -50px;
  left: -40px;
  background: var(--c-surface);
  border: 1.5px solid var(--c-border);
  border-radius: 16px;
  padding: 12px 16px;
  box-shadow: 0 8px 28px rgba(28, 20, 16, 0.10);
  animation: floatBadge2 4.8s ease-in-out 0.3s infinite;
  min-width: 130px;
}

.chip-label {
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 10px;
  font-weight: 600;
  color: var(--c-text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.chip-bars {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 36px;
}

.bar {
  flex: 1;
  height: var(--h);
  background: linear-gradient(180deg, var(--c-accent-2), var(--c-accent));
  border-radius: 3px 3px 0 0;
  opacity: 0.75;
}

.chip-stat {
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: var(--c-success);
  margin-top: 7px;
}

/* ── Wave ── */
.hero-wave {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 0;
  overflow: hidden;
}

.hero-wave svg {
  width: 100%;
  height: 100%;
  display: block;
}

/* ── Responsive ── */
@media (max-width: 1024px) {
  .hero-shell {
    grid-template-columns: 1fr;
    padding: 100px 36px 60px;
    gap: 60px;
    min-height: auto;
  }

  .hero-visual {
    justify-content: center;
  }

  .badge-wallet {
    right: -35px;
    top: 60px;
  }

  .analytics-chip {
    left: -20px;
    top: -20px;
  }

  .badge-scan {
    bottom: 160px;
    left: -80px;
  }

  .badge-share {
    bottom: 145px;
    right: -30px;
  }
}

@media (max-width: 640px) {
  .hero-shell {
    padding: 90px 20px 50px;
  }

  .hero-headline {
    font-size: 3rem;
    letter-spacing: -1.5px;
  }

  .card-stage {
    width: 320px;
    height: 400px;
  }

  .biz-card {
    width: 280px;
    height: 166px;
  }

  .badge-wallet {
    right: -35px;
  }

  .analytics-chip {
    left: -20px;
    top: -20px;
  }

  .badge-scan {
    bottom: 100px;
    left: -30px;
  }

  .badge-share {
    bottom: 115px;
    right: -30px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .biz-card, .float-badge, .analytics-chip, .eyebrow-dot {
    animation: none !important;
  }
}

.hero-image-wrap {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-backdrop {
  position: absolute;
  width: 560px;
  height: 560px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(200, 148, 114, 0.20), transparent 70%);
  filter: blur(40px);
}

.hero-image {
  position: relative;
  top: 70px;
  z-index: 2;
  width: 170%;
  max-width: 850px;
  filter: drop-shadow(0 40px 80px rgba(0, 0, 0, 0.30));
  animation: float 5s ease-in-out infinite;
}


@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-12px);
  }
}

@media (max-width: 980px) {
  .hero-image {
    max-width: 650px;
    margin-top: 40px;
  }
}

@media (max-width: 768px) {

  .hero-image {
    max-width: 90%;
    margin-top: 30px;
    height: 180px;
  }

}

/* =========================================================
   HERO PILLS
========================================================= */

.hero-pills {

  display: flex;

  align-items: center;

  flex-wrap: wrap;

  gap: 12px;

  margin-top: 34px;
}

/* =========================================================
   INDIVIDUAL PILL
========================================================= */

.hero-pills span {

  position: relative;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  padding: 11px 18px;

  border-radius: 999px;

  border: 1px solid rgba(196, 144, 110, 0.16);

  background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.03),
      rgba(255, 255, 255, 0.015)
  );

  backdrop-filter: blur(10px);

  color: var(--c-text-secondary);

  font-size: 13px;

  font-weight: 700;

  letter-spacing: 0.2px;

  overflow: hidden;

  transition: transform 0.25s ease,
  border-color 0.25s ease,
  background 0.25s ease,
  color 0.25s ease,
  box-shadow 0.25s ease;
}

/* =========================================================
   GLOW EFFECT
========================================================= */

.hero-pills span::before {

  content: '';

  position: absolute;

  inset: 0;

  background: linear-gradient(
      135deg,
      rgba(196, 144, 110, 0.10),
      transparent 60%
  );

  opacity: 0;

  transition: opacity 0.25s ease;

  pointer-events: none;
}

/* =========================================================
   HOVER
========================================================= */

.hero-pills span:hover {

  transform: translateY(-2px);

  border-color: rgba(196, 144, 110, 0.34);

  background: rgba(196, 144, 110, 0.08);

  color: var(--c-text-primary);

  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.14);
}

.hero-pills span:hover::before {

  opacity: 1;
}

/* =========================================================
   OPTIONAL ICON DOT
========================================================= */

.hero-pills span::after {

  content: '';

  width: 6px;
  height: 6px;

  border-radius: 50%;

  margin-left: 10px;

  background: linear-gradient(
      135deg,
      var(--c-accent),
      var(--c-accent-2)
  );

  opacity: 0.7;
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 768px) {

  .hero-pills {

    gap: 10px;

    margin-top: 28px;
  }

  .hero-pills span {

    padding: 10px 15px;

    font-size: 12px;
  }
}

@media (max-width: 480px) {

  .hero-pills {

    gap: 8px;
  }

  .hero-pills span {

    width: fit-content;

    max-width: 100%;

    font-size: 11px;

    padding: 9px 14px;
  }
}
</style>
