<template>
  <div class="pricing-page">

    <!-- HERO -->
    <section class="page-hero">
      <div class="hero-glow glow-1"/>
      <div class="hero-glow glow-2"/>
      <div class="hero-inner">
        <div class="pill-badge">PRICING</div>
        <h1 class="hero-title">
          Simple, transparent<br/>
          <em>pricing for everyone</em>
        </h1>
        <p class="hero-desc">
          Start free. Scale as you grow. No hidden fees, no surprises.
        </p>

        <!-- Billing toggle -->
        <div class="billing-toggle">
          <span :class="{ active: !annual }">Monthly</span>
          <button class="toggle-pill" @click="annual = !annual" :class="{ on: annual }">
            <span class="toggle-thumb"/>
          </button>
          <span :class="{ active: annual }">
            Annual
            <span class="save-badge">Save 20%</span>
          </span>
        </div>
      </div>
    </section>

    <!-- PLANS -->
    <section class="plans-section">
      <div class="plans-grid">
        <div
            v-for="(plan, i) in plans"
            :key="plan.name"
            class="plan-card"
            :class="{ featured: plan.featured, 'custom-plan': plan.custom }"
            :style="{ '--i': i }"
        >
          <div v-if="plan.featured" class="popular-badge">Most Popular</div>

          <div class="plan-header">
            <div class="plan-icon">{{ plan.icon }}</div>
            <h3 class="plan-name">{{ plan.name }}</h3>
            <p class="plan-tagline">{{ plan.tagline }}</p>
          </div>

          <div class="plan-price">
            <template v-if="plan.custom">
              <span class="amount custom-price">Custom</span>
            </template>
            <template v-else>
              <span class="currency">$</span>
              <span class="amount">{{ annual ? plan.annual : plan.monthly }}</span>
              <span class="period">/mo</span>
            </template>
          </div>
          <p v-if="!plan.custom && annual && plan.monthly !== '0'" class="billed-note">
            Billed annually · ${{ Math.round(Number(annual ? plan.annual : plan.monthly) * 12) }}/yr
          </p>
          <p v-if="plan.custom" class="billed-note">Pricing based on your needs</p>
          <p v-if="!plan.custom && plan.monthly === '0'" class="billed-note">&nbsp;</p>

          <div class="plan-divider"></div>

          <ul class="plan-features">
            <li
                v-for="feat in plan.features"
                :key="feat.label"
                class="plan-feature"
                :class="{ disabled: !feat.included }"
            >
              <span class="feat-icon">
                <svg v-if="feat.included" width="13" height="13" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="3">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="3">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </span>
              <span>{{ feat.label }}</span>
            </li>
          </ul>

          <!-- CTA button — always "Contact Us" linking to email -->
          <a
              :href="`mailto:hello@tapmy.name?subject=Inquiry about ${plan.name} Plan`"
              class="plan-btn"
              :class="{ 'plan-btn-primary': plan.featured, 'plan-btn-custom': plan.custom }"
          >
            {{ plan.cta.label }}
          </a>
        </div>
      </div>

      <p class="contact-note">
        Have questions? Contact us at <a href="mailto:hello@tapmy.name">hello@tapmy.name</a>
      </p>
    </section>

    <!-- COMPARISON TABLE -->
    <section class="compare-section">
      <div class="compare-inner">
        <div class="pill-badge" style="display:inline-flex;margin-bottom:20px">COMPARE PLANS</div>
        <h2 class="section-title">What's included</h2>

        <div class="compare-table">
          <div class="compare-header">
            <div class="compare-feature-col">Feature</div>
            <div
                v-for="p in plans"
                :key="p.name"
                class="compare-plan-col"
                :class="{ featured: p.featured }"
            >
              {{ p.name }}
            </div>
          </div>
          <div v-for="row in compareRows" :key="row.label" class="compare-row">
            <div class="compare-feature-col">{{ row.label }}</div>
            <div
                v-for="(val, idx) in row.values"
                :key="idx"
                class="compare-plan-col"
                :class="{ featured: plans[idx].featured }"
            >
              <span v-if="val === true" class="yes">✓</span>
              <span v-else-if="val === false" class="no">—</span>
              <span v-else class="val-text">{{ val }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="faq-section">
      <div class="faq-inner">
        <div class="pill-badge" style="display:inline-flex;margin-bottom:20px">FAQ</div>
        <h2 class="section-title">Common questions</h2>
        <div class="faq-list">
          <div
              v-for="(q, i) in faqs"
              :key="q.q"
              class="faq-item"
              :class="{ open: openFaq === i }"
              @click="openFaq = openFaq === i ? null : i"
          >
            <div class="faq-q">
              <span>{{ q.q }}</span>
              <span class="faq-arrow">{{ openFaq === i ? '−' : '+' }}</span>
            </div>
            <div class="faq-a" v-show="openFaq === i">{{ q.a }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA STRIP -->
    <section class="cta-strip">
      <div class="cta-inner">
        <div class="cta-copy">
          <h2>Still not sure? <em>Try it free.</em></h2>
          <p>No credit card required. Get started in seconds.</p>
        </div>
        <a href="mailto:hello@tapmy.name" class="cta-btn">Contact Us →</a>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const annual  = ref(false)
const openFaq = ref(null)

const plans = [
  {
    icon: '🌱',
    name: 'Free',
    tagline: 'Get started at no cost',
    monthly: '0',
    annual: '0',
    featured: false,
    custom: false,
    features: [
      { label: '1 Company (limited features)', included: true },
      { label: '1 Contact',                   included: true },
      { label: 'Google Wallet',               included: false },
      { label: 'Apple Wallet',                included: false },
      { label: 'Analytics',                   included: false },
      { label: 'Premium Themes',              included: false },
    ],
    cta: { label: 'Contact Us' },
  },
  {
    icon: '⚡',
    name: 'Plus',
    tagline: 'For growing professionals',
    monthly: '12',
    annual: '10',
    featured: true,
    custom: false,
    features: [
      { label: '2 Companies (full features)', included: true },
      { label: '5 Contacts',                 included: true },
      { label: 'Google Wallet',              included: true },
      { label: 'Apple Wallet',               included: true },
      { label: 'Analytics Included',         included: true },
      { label: 'Plus Themes',                included: true },
    ],
    cta: { label: 'Contact Us' },
  },
  {
    icon: '🏢',
    name: 'Premium',
    tagline: 'For teams & companies',
    monthly: '39',
    annual: '32',
    featured: false,
    custom: false,
    features: [
      { label: '5 Companies (full features)', included: true },
      { label: '15 Contacts',                included: true },
      { label: 'Google Wallet',              included: true },
      { label: 'Apple Wallet',               included: true },
      { label: 'Analytics Included',         included: true },
      { label: 'All Premium Themes',         included: true },
    ],
    cta: { label: 'Contact Us' },
  },
  {
    icon: '✨',
    name: 'Custom',
    tagline: 'Tailored for large organisations',
    monthly: null,
    annual: null,
    featured: false,
    custom: true,
    features: [
      { label: 'Custom number of Companies',  included: true },
      { label: 'Minimum 100 Contacts',        included: true },
      { label: 'Google Wallet',               included: true },
      { label: 'Apple Wallet',                included: true },
      { label: 'Analytics Included',          included: true },
      { label: 'All Premium Themes',          included: true },
      { label: 'Dedicated account manager',   included: true },
      { label: 'Custom integrations',         included: true },
    ],
    cta: { label: 'Contact Us →' },
  },
]

const compareRows = [
  { label: 'Companies',       values: ['1 (limited)', '2 (full)', '5 (full)', 'Custom'] },
  { label: 'Contacts',        values: ['1', '5', '15', '100+ (custom)'] },
  { label: 'Google Wallet',   values: [false, true, true, true] },
  { label: 'Apple Wallet',    values: [false, true, true, true] },
  { label: 'Analytics',       values: [false, true, true, true] },
  { label: 'Premium Themes',  values: [false, 'Plus', 'All', 'All'] },
  { label: 'Account Manager', values: [false, false, false, true] },
  { label: 'Custom Setup',    values: [false, false, false, true] },
]

const faqs = [
  {
    q: 'Can I upgrade or downgrade at any time?',
    a: 'Yes — plan changes take effect immediately. If you upgrade mid-cycle you\'ll be charged a prorated amount. Downgrades apply from the next billing date.',
  },
  {
    q: 'Do I need a credit card to start the free plan?',
    a: 'No credit card required. Sign up with just your email and get started in seconds.',
  },
  {
    q: 'What happens to my cards if I cancel?',
    a: 'Your cards remain visible for 30 days after cancellation. You can export your data at any time from the dashboard.',
  },
  {
    q: 'Is there a discount for non-profits or education?',
    a: 'Yes — contact us at hello@tapmy.name and we\'ll set you up with a custom plan.',
  },
  {
    q: 'How does the Custom plan work?',
    a: 'The Custom plan starts at a minimum of 100 contacts and any number of companies. Reach out via email and we\'ll tailor a package to your exact needs.',
  },
]
</script>

<style scoped>
/* ─────────────────────────────────────────────
   BASE
───────────────────────────────────────────── */
.pricing-page {
  padding-top: 80px;
  min-height: 100vh;
  color: var(--c-text-primary, #1c1410);
}

/* ─────────────────────────────────────────────
   HERO
───────────────────────────────────────────── */
.page-hero {
  position: relative;
  text-align: center;
  padding: 100px 32px 70px;
  overflow: hidden;
}

.hero-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  pointer-events: none;
}

.glow-1 {
  width: 340px; height: 340px;
  background: rgba(124,92,78,0.14);
  top: -80px; right: -60px;
}

.glow-2 {
  width: 260px; height: 260px;
  background: rgba(200,148,114,0.10);
  bottom: -60px; left: -40px;
}

.hero-inner {
  position: relative;
  z-index: 1;
  max-width: 680px;
  margin: 0 auto;
}

.pill-badge {
  display: inline-flex;
  padding: 8px 18px;
  border-radius: 100px;
  background: var(--c-accent-subtle, #f8f3f0);
  border: 1px solid var(--c-border, #e8e3dc);
  color: var(--c-accent, #7c5c4e);
  font-size: 0.70rem;
  font-weight: 700;
  letter-spacing: 1.8px;
  margin-bottom: 24px;
}

.hero-title {
  font-size: clamp(2.4rem, 5vw, 4rem);
  font-weight: 900;
  line-height: 1.08;
  letter-spacing: -1.5px;
  color: var(--c-text-primary, #1c1410);
  margin: 0 0 20px;
}

.hero-title em {
  font-style: italic;
  font-family: Georgia, serif;
  color: var(--c-accent, #7c5c4e);
}

.hero-desc {
  color: var(--c-text-secondary, #5a4f46);
  line-height: 1.8;
  font-size: 1.05rem;
  margin: 0 auto 40px;
}

/* Billing toggle */
.billing-toggle {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--c-text-muted, #9e8e84);
}

.billing-toggle .active { color: var(--c-text-primary, #1c1410); }

.toggle-pill {
  position: relative;
  width: 52px; height: 28px;
  border-radius: 100px;
  background: var(--c-border, #e8e3dc);
  border: none;
  cursor: pointer;
  transition: background 0.3s;
}

.toggle-pill.on { background: var(--c-accent, #7c5c4e); }

.toggle-thumb {
  position: absolute;
  top: 3px; left: 3px;
  width: 22px; height: 22px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
  display: block;
}

.toggle-pill.on .toggle-thumb { transform: translateX(24px); }

.save-badge {
  display: inline-flex;
  margin-left: 6px;
  padding: 3px 8px;
  background: linear-gradient(135deg, var(--c-accent-2, #a07060), var(--c-accent, #7c5c4e));
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  border-radius: 100px;
  letter-spacing: 0.5px;
}

/* ─────────────────────────────────────────────
   PLANS GRID — 4 equal columns on desktop
───────────────────────────────────────────── */
.plans-section {
  padding: 20px 32px 80px;
}

.plans-grid {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  align-items: start;
}

/* ─────────────────────────────────────────────
   PLAN CARD
───────────────────────────────────────────── */
.plan-card {
  position: relative;
  background: var(--c-surface, #fff);
  border: 1px solid var(--c-border, #e8e3dc);
  border-radius: 24px;
  padding: 32px 28px 28px;
  animation: rise 0.55s ease both;
  animation-delay: calc(var(--i) * 80ms);
  transition: transform 0.3s ease, border-color 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
}

.plan-card:hover {
  transform: translateY(-5px);
  border-color: var(--c-accent, #7c5c4e);
  box-shadow: 0 16px 48px rgba(124,92,78,0.10);
}

/* Featured (Plus) */
.plan-card.featured {
  border-color: var(--c-accent, #7c5c4e);
  background: var(--c-accent-subtle, #f8f3f0);
  box-shadow: 0 24px 60px rgba(124,92,78,0.14);
}

.plan-card.featured:hover {
  transform: translateY(-5px);
}

/* Custom plan */
.plan-card.custom-plan {
  border: 2px dashed var(--c-accent, #7c5c4e);
  background: linear-gradient(145deg, var(--c-accent-subtle, #f8f3f0) 0%, var(--c-surface, #fff) 100%);
  overflow: hidden;
}

.plan-card.custom-plan::before {
  content: '';
  position: absolute;
  top: -60px; right: -60px;
  width: 180px; height: 180px;
  background: radial-gradient(circle, rgba(160,112,96,0.12), transparent 70%);
  pointer-events: none;
}

.popular-badge {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, var(--c-accent-2, #a07060), var(--c-accent, #7c5c4e));
  color: white;
  font-size: 0.70rem;
  font-weight: 700;
  letter-spacing: 0.8px;
  padding: 6px 16px;
  border-radius: 100px;
  white-space: nowrap;
}

/* Plan header */
.plan-header { margin-bottom: 4px; }

.plan-icon {
  font-size: 1.8rem;
  margin-bottom: 10px;
}

.plan-name {
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--c-text-primary, #1c1410);
  margin: 0 0 4px;
}

.plan-tagline {
  font-size: 0.82rem;
  color: var(--c-text-muted, #9e8e84);
  margin: 0 0 16px;
  line-height: 1.4;
}

/* Price */
.plan-price {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  margin-bottom: 2px;
}

.currency {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--c-text-secondary, #5a4f46);
  margin-bottom: 6px;
}

.amount {
  font-size: 3.2rem;
  font-weight: 900;
  color: var(--c-text-primary, #1c1410);
  line-height: 1;
}

.period {
  font-size: 0.9rem;
  color: var(--c-text-muted, #9e8e84);
  margin-bottom: 6px;
}

.billed-note {
  font-size: 0.75rem;
  color: var(--c-text-muted, #9e8e84);
  margin: 0 0 4px;
  min-height: 18px;
}

/* Custom price */
.custom-price {
  font-size: 2.4rem !important;
  font-weight: 900;
  background: linear-gradient(135deg, var(--c-accent-2, #a07060), var(--c-accent, #7c5c4e));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

/* Divider */
.plan-divider {
  height: 1px;
  background: var(--c-border, #e8e3dc);
  margin: 16px 0;
}

/* Features list */
.plan-features {
  list-style: none;
  padding: 0;
  margin: 0 0 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.plan-feature {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.88rem;
  color: var(--c-text-secondary, #5a4f46);
  line-height: 1.4;
}

.plan-feature.disabled {
  color: var(--c-text-muted, #9e8e84);
  text-decoration: line-through;
  opacity: 0.55;
}

.feat-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.plan-feature:not(.disabled) .feat-icon {
  background: linear-gradient(135deg, var(--c-accent-2, #a07060), var(--c-accent, #7c5c4e));
  color: white;
}

.plan-feature.disabled .feat-icon {
  background: var(--c-border, #e8e3dc);
  color: var(--c-text-muted, #9e8e84);
}

/* CTA buttons */
.plan-btn {
  display: block;
  text-align: center;
  padding: 13px 20px;
  border-radius: 14px;
  border: 1.5px solid var(--c-border, #e8e3dc);
  background: var(--c-surface, #fff);
  color: var(--c-text-primary, #1c1410);
  font-weight: 700;
  font-size: 0.9rem;
  text-decoration: none;
  transition: all 0.3s ease;
  margin-top: auto;
}

.plan-btn:hover {
  border-color: var(--c-accent, #7c5c4e);
  background: var(--c-accent-subtle, #f8f3f0);
  transform: translateY(-1px);
}

.plan-btn-primary {
  background: linear-gradient(135deg, var(--c-accent-2, #a07060), var(--c-accent, #7c5c4e));
  border-color: transparent;
  color: white;
}

.plan-btn-primary:hover {
  opacity: 0.9;
  background: linear-gradient(135deg, var(--c-accent-2, #a07060), var(--c-accent, #7c5c4e));
}

.plan-btn-custom {
  border: 2px solid var(--c-accent, #7c5c4e);
  background: transparent;
  color: var(--c-accent, #7c5c4e);
  font-weight: 700;
}

.plan-btn-custom:hover {
  background: var(--c-accent, #7c5c4e);
  color: white;
  box-shadow: 0 10px 28px rgba(124,92,78,0.22);
}

/* Contact note */
.contact-note {
  text-align: center;
  margin-top: 28px;
  font-size: 0.88rem;
  color: var(--c-text-muted, #9e8e84);
}

.contact-note a {
  color: var(--c-accent, #7c5c4e);
  font-weight: 600;
  text-decoration: none;
}

.contact-note a:hover { text-decoration: underline; }

/* ─────────────────────────────────────────────
   COMPARE TABLE
───────────────────────────────────────────── */
.compare-section { padding: 0 32px 80px; }

.compare-inner {
  max-width: 1100px;
  margin: 0 auto;
}

.section-title {
  font-size: clamp(1.8rem, 3vw, 2.8rem);
  font-weight: 900;
  letter-spacing: -1px;
  color: var(--c-text-primary, #1c1410);
  margin: 0 0 40px;
}

.section-title em {
  font-style: italic;
  font-family: Georgia, serif;
  color: var(--c-accent, #7c5c4e);
}

.compare-table {
  border: 1px solid var(--c-border, #e8e3dc);
  border-radius: 20px;
  overflow: hidden;
}

.compare-header,
.compare-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
}

.compare-header {
  background: var(--c-accent-subtle, #f8f3f0);
  border-bottom: 1px solid var(--c-border, #e8e3dc);
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--c-text-primary, #1c1410);
}

.compare-row { border-bottom: 1px solid var(--c-border, #e8e3dc); }
.compare-row:last-child { border-bottom: none; }
.compare-row:hover { background: var(--c-accent-subtle, #f8f3f0); }

.compare-feature-col,
.compare-plan-col {
  padding: 14px 16px;
  font-size: 0.88rem;
  color: var(--c-text-secondary, #5a4f46);
}

.compare-plan-col { text-align: center; }
.compare-plan-col.featured {
  background: rgba(124,92,78,0.04);
  font-weight: 600;
}

.yes { color: var(--c-accent, #7c5c4e); font-weight: 700; font-size: 1rem; }
.no  { color: var(--c-text-muted, #9e8e84); }
.val-text { color: var(--c-text-secondary, #5a4f46); font-weight: 600; }

/* ─────────────────────────────────────────────
   FAQ
───────────────────────────────────────────── */
.faq-section { padding: 0 32px 80px; }
.faq-inner { max-width: 720px; margin: 0 auto; }
.faq-list { display: flex; flex-direction: column; gap: 12px; }

.faq-item {
  border: 1px solid var(--c-border, #e8e3dc);
  border-radius: 16px;
  padding: 20px 24px;
  cursor: pointer;
  background: var(--c-surface, #fff);
  transition: border-color 0.3s, background 0.3s;
}

.faq-item.open {
  border-color: var(--c-accent, #7c5c4e);
  background: var(--c-accent-subtle, #f8f3f0);
}

.faq-q {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 0.97rem;
  color: var(--c-text-primary, #1c1410);
  gap: 12px;
}

.faq-arrow {
  font-size: 1.4rem;
  font-weight: 300;
  color: var(--c-accent, #7c5c4e);
  flex-shrink: 0;
}

.faq-a {
  margin-top: 14px;
  color: var(--c-text-secondary, #5a4f46);
  line-height: 1.8;
  font-size: 0.93rem;
}

/* ─────────────────────────────────────────────
   CTA STRIP
───────────────────────────────────────────── */
.cta-strip { padding: 0 32px 100px; }

.cta-inner {
  max-width: 1200px;
  margin: 0 auto;
  background: linear-gradient(135deg, var(--c-accent, #7c5c4e), var(--c-accent-2, #a07060));
  border-radius: 28px;
  padding: 56px 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  flex-wrap: wrap;
  position: relative;
  overflow: hidden;
}

.cta-inner::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
  linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size: 48px 48px;
  pointer-events: none;
}

.cta-copy {
  position: relative;
  z-index: 1;
}

.cta-copy h2 {
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  font-weight: 900;
  color: white;
  letter-spacing: -0.8px;
  margin: 0 0 8px;
}

.cta-copy h2 em {
  font-style: italic;
  font-family: Georgia, serif;
  opacity: 0.88;
}

.cta-copy p {
  color: rgba(255,255,255,0.75);
  font-size: 0.95rem;
  margin: 0;
}

.cta-btn {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  padding: 15px 32px;
  background: white;
  color: var(--c-accent, #7c5c4e);
  font-weight: 800;
  font-size: 0.98rem;
  border-radius: 16px;
  text-decoration: none;
  white-space: nowrap;
  box-shadow: 0 12px 32px rgba(0,0,0,0.12);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.cta-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 48px rgba(0,0,0,0.2);
}

/* ─────────────────────────────────────────────
   ANIMATION
───────────────────────────────────────────── */
@keyframes rise {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ─────────────────────────────────────────────
   RESPONSIVE
───────────────────────────────────────────── */
@media (max-width: 1100px) {
  .plans-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .compare-header,
  .compare-row {
    grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
    font-size: 0.78rem;
  }

  .compare-feature-col,
  .compare-plan-col {
    padding: 12px 10px;
  }
}

@media (max-width: 768px) {
  .page-hero { padding: 80px 20px 60px; }

  .plans-section { padding: 20px 20px 60px; }

  .plans-grid {
    grid-template-columns: 1fr;
    max-width: 440px;
  }

  .compare-section,
  .faq-section,
  .cta-strip {
    padding-left: 20px;
    padding-right: 20px;
  }

  .compare-header,
  .compare-row {
    grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr;
    font-size: 0.72rem;
  }

  .compare-feature-col,
  .compare-plan-col {
    padding: 10px 6px;
  }

  .cta-inner { padding: 40px 28px; }

  .cta-inner {
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .plans-grid {
    max-width: 100%;
  }
}
</style>
