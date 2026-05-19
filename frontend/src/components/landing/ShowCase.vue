<template>
  <section class="sc" ref="sectionRef" :class="{ 'dark-mode': isDark }">

    <!-- Background decoration -->
    <div class="sc-bg">
      <div class="sc-bg__panel"></div>
      <div class="sc-bg__line sc-bg__line--1"></div>
      <div class="sc-bg__line sc-bg__line--2"></div>
    </div>

    <div class="sc-shell">

      <!-- ── LEFT: Dashboard visual ── -->
      <div class="sc-visual" :class="{ visible: vis }">

        <div class="sc-glow"></div>

        <div class="sc-dashboard">

          <!-- Topbar -->
          <div class="scd-topbar">
            <div class="scd-topbar__left">
              <div class="scd-avatar">TM</div>
              <div>
                <div class="scd-name">TapMyName</div>
                <div class="scd-sub">Company Identity Platform</div>
              </div>
            </div>
            <div class="scd-plan">
              <span class="scd-plan__dot"></span>
              Premium
            </div>
          </div>

          <!-- Stat row -->
          <div class="scd-stats">
            <div
                class="scd-stat"
                v-for="(s, i) in stats"
                :key="i"
                :style="{ '--sd': i * 80 + 'ms' }"
                :class="{ visible: vis }"
            >
              <span class="scd-stat__val">{{ s.val }}</span>
              <span class="scd-stat__lbl">{{ s.lbl }}</span>
              <span class="scd-stat__delta up">↑ {{ s.delta }}</span>
            </div>
          </div>

          <!-- Chart -->
          <div class="scd-chart-head">
          <span class="scd-chart-title">
  Employee Card Engagement
</span>
            <span class="scd-chart-total">
  ↑ 38% engagement growth
</span>
          </div>
          <div class="scd-chart">
            <div class="scd-chart__bars">
              <div
                  v-for="(b, i) in bars"
                  :key="i"
                  class="scd-bar"
                  :class="{ active: b.active, visible: vis }"
                  :style="{ '--bh': b.h, '--bd': i * 90 + 'ms' }"
              >
                <span class="scd-bar__tip">{{ b.val }}</span>
              </div>
            </div>
            <div class="scd-chart__labels">
              <span v-for="m in months" :key="m">{{ m }}</span>
            </div>
          </div>

          <!-- Activity feed -->
          <div class="scd-activity">
            <div class="scd-activity__head">Recent Activity</div>
            <div class="scd-activity__list">
              <div
                  class="scd-act"
                  v-for="(a, i) in activity"
                  :key="i"
                  :style="{ '--ad': i * 70 + 'ms' }"
                  :class="{ visible: vis }"
              >
                <div class="scd-act__icon" :style="{ background: a.color }">
                  <svg v-if="a.type === 'scan'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white"
                       stroke-width="2.5">
                    <rect x="3" y="3" width="7" height="7" rx="1"/>
                    <rect x="14" y="3" width="7" height="7" rx="1"/>
                    <rect x="3" y="14" width="7" height="7" rx="1"/>
                    <rect x="14" y="14" width="3" height="3" rx="0.5"/>
                  </svg>
                  <svg v-else-if="a.type === 'wallet'" width="12" height="12" viewBox="0 0 24 24" fill="none"
                       stroke="white" stroke-width="2.5">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/>
                    <path d="M2 10h20"/>
                  </svg>
                  <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                  </svg>
                </div>
                <div class="scd-act__body">
                  <span class="scd-act__msg">{{ a.msg }}</span>
                  <span class="scd-act__time">{{ a.time }}</span>
                </div>
                <div class="scd-act__pulse" v-if="i === 0"></div>
              </div>
            </div>
          </div>

        </div>

        <!-- Floating employee card -->
        <div class="sc-emp-card" :class="{ visible: vis }">
          <div class="sc-emp-card__av">RK</div>
          <div class="sc-emp-card__info">
            <span class="sc-emp-card__name">Ryan Kim</span>
            <span class="sc-emp-card__role">
  Sales Lead · Wallet Enabled
</span>
          </div>
          <div class="sc-emp-card__qr">
            <svg width="28" height="28" viewBox="0 0 52 52" fill="none">
              <rect x="2" y="2" width="20" height="20" rx="2" stroke="currentColor" stroke-width="2.5"/>
              <rect x="8" y="8" width="8" height="8" fill="currentColor"/>
              <rect x="30" y="2" width="20" height="20" rx="2" stroke="currentColor" stroke-width="2.5"/>
              <rect x="36" y="8" width="8" height="8" fill="currentColor"/>
              <rect x="2" y="30" width="20" height="20" rx="2" stroke="currentColor" stroke-width="2.5"/>
              <rect x="8" y="36" width="8" height="8" fill="currentColor"/>
              <rect x="30" y="30" width="5" height="5" fill="currentColor"/>
              <rect x="38" y="30" width="5" height="5" fill="currentColor"/>
            </svg>
          </div>
        </div>

      </div>

      <!-- ── RIGHT: Copy ── -->
      <div class="sc-copy" :class="{ visible: vis }">

        <div class="sc-eyebrow">
          <span class="sc-eyebrow__pip"></span>
          Business Management
        </div>

        <h2 class="sc-title">
          Manage your entire<br>
          team from <em>one place.</em>
        </h2>

        <p class="sc-desc">
          Create company profiles, provision digital cards for every employee,
          and track engagement across your whole organisation — all from a
          single clean dashboard.
        </p>

        <ul class="sc-list">
          <li
              v-for="(item, i) in items"
              :key="i"
              :style="{ '--ld': i * 70 + 'ms' }"
              :class="{ visible: vis }"
          >
            <div class="sc-list__icon">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div class="sc-list__text">
              <strong>{{ item.title }}</strong>
              <span>{{ item.desc }}</span>
            </div>
          </li>
        </ul>

        <div class="sc-cta">
          <router-link to="/register" class="sc-btn">
            Create Company Workspace
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </router-link>
          <span class="sc-note">No credit card required</span>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import {inject, onMounted, ref} from 'vue'

const { isDark, toggleDarkMode } = inject('theme')
const sectionRef = ref(null)
const vis = ref(false)

const stats = [
  {val: '24', lbl: 'Companies', delta: '3 new this month'},
  {val: '1.4K', lbl: 'Employee Cards', delta: '142 active today'},
  {val: '98K', lbl: 'Interactions', delta: '38% engagement growth'},
]

const bars = [
  {h: '45%', val: '1.8K', active: false},
  {h: '62%', val: '2.5K', active: false},
  {h: '50%', val: '2.0K', active: false},
  {h: '85%', val: '3.4K', active: true},
  {h: '70%', val: '2.8K', active: false},
  {h: '78%', val: '3.1K', active: false},
]
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']

const activity = [
  {
    type: 'scan',
    msg: 'Sales employee card scanned',
    time: 'Just now',
    color: '#7c5c4e'
  },
  {
    type: 'wallet',
    msg: 'Employee pass saved to Apple Wallet',
    time: '2m ago',
    color: '#a07060'
  },
  {
    type: 'user',
    msg: 'New employee added to Nexus Co.',
    time: '14m ago',
    color: '#5e443a'
  },
]

const items = [
  {
    title: 'Company Workspaces',
    desc: 'Create and manage multiple company profiles.'
  },
  {
    title: 'Employee Digital Cards',
    desc: 'Assign branded business cards to every employee.'
  },
  {
    title: 'Apple & Google Wallet',
    desc: 'Distribute wallet-ready passes instantly.'
  },
  {
    title: 'QR & Smart Sharing',
    desc: 'Each employee gets QR codes and shareable links.'
  },
  {
    title: 'Centralized Analytics',
    desc: 'Track scans, saves and engagement across teams.'
  },
]

onMounted(() => {
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) {
      vis.value = true;
      io.unobserve(sectionRef.value)
    }
  }, {threshold: 0.15})
  if (sectionRef.value) io.observe(sectionRef.value)
})
</script>

<style scoped>
.sc {
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

  font-family: 'Segoe UI', 'SF Pro Text', system-ui, sans-serif;
  position: relative;
  background: var(--c-bg);
  padding: 120px 40px;
  overflow: hidden;
}

.sc.dark-mode {
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
}

*, *::before, *::after {
  box-sizing: border-box;
}

/* Background */
.sc-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.sc-bg__panel {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 52%;
  background: var(--c-surface);
  border-right: 1.5px solid var(--c-border);
  clip-path: polygon(0 0, 100% 0, 92% 100%, 0 100%);
}

.sc-bg__line {
  position: absolute;
  height: 1.5px;
  background: linear-gradient(90deg, transparent, var(--c-accent), transparent);
  opacity: 0.2;
  left: 0;
  right: 0;
}

.sc-bg__line--1 {
  top: 30%;
}

.sc-bg__line--2 {
  bottom: 28%;
  opacity: 0.1;
}

/* Shell */
.sc-shell {
  position: relative;
  z-index: 2;
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: 72px;
  align-items: center;
}

/* Visual */
.sc-visual {
  position: relative;
  opacity: 0;
  transform: translateX(-40px);
  transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

.sc-visual.visible {
  opacity: 1;
  transform: translateX(0);
}

.sc-glow {
  position: absolute;
  inset: -40px;
  pointer-events: none;
  background: radial-gradient(ellipse 60% 50% at 50% 50%, rgba(124, 92, 78, 0.1), transparent);
}

/* Dashboard */
.sc-dashboard {
  background: var(--c-surface);
  border: 1.5px solid var(--c-border);
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 24px 64px rgba(28, 20, 16, 0.12), 0 4px 16px rgba(28, 20, 16, 0.06);
}

.scd-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 18px;
  border-bottom: 1.5px solid var(--c-border);
}

.scd-topbar__left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.scd-avatar {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--c-accent-2), var(--c-accent));
  color: #fff;
  font-weight: 800;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scd-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--c-text-primary);
}

.scd-sub {
  font-size: 11px;
  color: var(--c-text-muted);
  margin-top: 1px;
}

.scd-plan {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 100px;
  background: var(--c-accent-subtle);
  border: 1.5px solid var(--c-accent-light);
  font-size: 11.5px;
  font-weight: 700;
  color: var(--c-accent);
}

.scd-plan__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--c-success);
  animation: blink 2s ease infinite;
}

@keyframes blink {
  0%, 100% {
    opacity: 1
  }
  50% {
    opacity: 0.3
  }
}

.scd-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}

.scd-stat {
  background: var(--c-surface-2);
  border: 1.5px solid var(--c-border);
  border-radius: 14px;
  padding: 14px 12px;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.5s ease, transform 0.5s ease;
  transition-delay: var(--sd);
}

.scd-stat.visible {
  opacity: 1;
  transform: translateY(0);
}

.scd-stat__val {
  display: block;
  font-size: 20px;
  font-weight: 900;
  color: var(--c-text-primary);
}

.scd-stat__lbl {
  display: block;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: var(--c-text-muted);
  margin-top: 2px;
}

.scd-stat__delta {
  display: block;
  font-size: 10.5px;
  font-weight: 600;
  margin-top: 4px;
}

.scd-stat__delta.up {
  color: var(--c-success);
}

.scd-chart-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.scd-chart-title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: var(--c-text-muted);
}

.scd-chart-total {
  font-size: 11.5px;
  font-weight: 700;
  color: var(--c-success);
}

.scd-chart {
  margin-bottom: 18px;
}

.scd-chart__bars {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 80px;
  margin-bottom: 6px;
}

.scd-bar {
  flex: 1;
  border-radius: 6px 6px 0 0;
  background: var(--c-accent-subtle);
  border: 1.5px solid var(--c-border);
  position: relative;
  cursor: pointer;
  height: 0;
  animation: barUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: var(--bd);
  animation-play-state: paused;
  transition: filter 0.2s;
}

.scd-bar.visible {
  animation-play-state: running;
}

.scd-bar.active {
  background: linear-gradient(180deg, var(--c-accent-2), var(--c-accent));
  border-color: transparent;
}

.scd-bar:hover {
  filter: brightness(1.12);
}

.scd-bar__tip {
  position: absolute;
  top: -22px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 9.5px;
  font-weight: 700;
  color: var(--c-text-muted);
  opacity: 0;
  transition: opacity 0.18s;
  white-space: nowrap;
}

.scd-bar:hover .scd-bar__tip {
  opacity: 1;
}

@keyframes barUp {
  from {
    height: 0;
    opacity: 0;
  }
  to {
    height: var(--bh);
    opacity: 1;
  }
}

.scd-chart__labels {
  display: flex;
  gap: 6px;
}

.scd-chart__labels span {
  flex: 1;
  text-align: center;
  font-size: 9px;
  color: var(--c-text-muted);
  font-weight: 600;
}

.scd-activity {
  border-top: 1.5px solid var(--c-border);
  padding-top: 16px;
}

.scd-activity__head {
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--c-text-muted);
  margin-bottom: 10px;
}

.scd-activity__list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.scd-act {
  display: flex;
  align-items: center;
  gap: 10px;
  opacity: 0;
  transform: translateX(-10px);
  transition: opacity 0.5s ease, transform 0.5s ease;
  transition-delay: calc(var(--ad) + 300ms);
}

.scd-act.visible {
  opacity: 1;
  transform: translateX(0);
}

.scd-act__icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scd-act__body {
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex: 1;
}

.scd-act__msg {
  font-size: 12px;
  font-weight: 600;
  color: var(--c-text-primary);
}

.scd-act__time {
  font-size: 10.5px;
  color: var(--c-text-muted);
}

.scd-act__pulse {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--c-success);
  animation: liveBlip 1.6s ease infinite;
}

@keyframes liveBlip {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(45, 106, 80, 0.5);
  }
  50% {
    box-shadow: 0 0 0 5px rgba(45, 106, 80, 0);
  }
}

/* Floating employee card */
.sc-emp-card {
  position: absolute;
  bottom: -20px;
  right: -24px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--c-surface);
  border: 1.5px solid var(--c-border);
  border-radius: 16px;
  padding: 12px 14px;
  box-shadow: 0 12px 40px rgba(28, 20, 16, 0.16);
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.6s ease 0.5s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.5s;
}

.sc-emp-card.visible {
  opacity: 1;
  transform: translateY(0);
  animation: empFloat 4s ease-in-out 1.2s infinite;
}

@keyframes empFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-7px);
  }
}

.sc-emp-card__av {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: linear-gradient(135deg, #c4906e, #7c5c4e);
  color: #fff;
  font-weight: 800;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sc-emp-card__info {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.sc-emp-card__name {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--c-text-primary);
}

.sc-emp-card__role {
  font-size: 10.5px;
  color: var(--c-text-muted);
}

.sc-emp-card__qr {
  color: var(--c-accent);
  margin-left: 4px;
}

/* Copy */
.sc-copy {
  opacity: 0;
  transform: translateX(36px);
  transition: opacity 0.7s ease 0.15s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.15s;
}

.sc-copy.visible {
  opacity: 1;
  transform: translateX(0);
}

.sc-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2.4px;
  text-transform: uppercase;
  color: var(--c-accent);
  margin-bottom: 22px;
}

.sc-eyebrow__pip {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--c-accent);
}

.sc-title {
  font-family: 'Georgia', 'Times New Roman', serif;
  font-size: clamp(2.1rem, 3.2vw, 3.2rem);
  font-weight: 900;
  letter-spacing: -1.5px;
  line-height: 1.1;
  color: var(--c-text-primary);
  margin: 0 0 20px;
}

.sc-title em {
  font-style: italic;
  color: var(--c-accent);
  position: relative;
  display: inline-block;
}

.sc-title em::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 2px;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, var(--c-accent), var(--c-accent-2));
  border-radius: 2px;
  opacity: 0.4;
}

.sc-desc {
  font-size: 1rem;
  line-height: 1.78;
  color: var(--c-text-secondary);
  margin: 0 0 36px;
  max-width: 440px;
}

.sc-list {
  list-style: none;
  padding: 0;
  margin: 0 0 40px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.sc-list li {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  opacity: 0;
  transform: translateX(16px);
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: calc(var(--ld) + 250ms);
}

.sc-list li.visible {
  opacity: 1;
  transform: translateX(0);
}

.sc-list__icon {
  width: 26px;
  height: 26px;
  border-radius: 8px;
  flex-shrink: 0;
  background: linear-gradient(135deg, var(--c-accent-2), var(--c-accent));
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1px;
}

.sc-list__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sc-list__text strong {
  font-size: 14px;
  font-weight: 700;
  color: var(--c-text-primary);
}

.sc-list__text span {
  font-size: 13px;
  color: var(--c-text-muted);
  line-height: 1.5;
}

.sc-cta {
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
}

.sc-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--c-accent-2), var(--c-accent));
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  letter-spacing: 0.2px;
  box-shadow: 0 8px 28px rgba(124, 92, 78, 0.3);
  transition: transform 0.2s, box-shadow 0.2s;
}

.sc-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 40px rgba(124, 92, 78, 0.42);
}

.sc-btn svg {
  transition: transform 0.2s;
}

.sc-btn:hover svg {
  transform: translateX(3px);
}

.sc-note {
  font-size: 12.5px;
  color: var(--c-text-muted);
}

/* Responsive */
@media (max-width: 1024px) {
  .sc-shell {
    grid-template-columns: 1fr;
    gap: 52px;
  }

  .sc-bg__panel {
    display: none;
  }

  .sc-visual {
    order: 2;
  }

  .sc-copy {
    order: 1;
  }
}

@media (max-width: 600px) {
  .sc {
    padding: 80px 20px;
  }

  .sc-emp-card {
    display: none;
  }

  .scd-stats {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .scd-stat__val {
    font-size: 16px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sc-visual, .sc-copy, .scd-stat, .scd-act, .sc-list li, .scd-bar, .sc-emp-card,
  .scd-plan__dot, .scd-act__pulse {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
</style>
