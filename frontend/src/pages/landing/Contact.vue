<template>
  <div class="contact-page">

    <!-- HERO -->
    <section class="page-hero">
      <div class="hero-glow glow-1" />
      <div class="hero-glow glow-2" />
      <div class="hero-inner">
        <div class="pill-badge">CONTACT US</div>
        <h1 class="hero-title">
          We'd love to<br />
          <em>hear from you</em>
        </h1>
        <p class="hero-desc">
          Have a question, need a demo, or just want to say hi?
          Our team typically responds within 24 hours.
        </p>
      </div>
    </section>

    <!-- MAIN GRID -->
    <section class="contact-section">
      <div class="contact-grid">

        <!-- LEFT — info -->
        <div class="contact-info">
          <div class="info-card" v-for="(item, i) in infoItems" :key="item.title" :style="{ '--i': i }">
            <div class="info-icon">{{ item.icon }}</div>
            <div>
              <h4>{{ item.title }}</h4>
              <p>{{ item.value }}</p>
            </div>
          </div>

          <div class="social-block">
            <p class="social-label">Follow us</p>
            <div class="social-row">
              <a v-for="s in socials" :key="s.label" href="#" class="social-btn" :title="s.label">{{ s.symbol }}</a>
            </div>
          </div>

          <div class="hours-block">
            <h4>Business Hours</h4>
            <p>Mon – Fri: 9:00 AM – 6:00 PM (PST)</p>
            <p>Weekends: Email support only</p>
          </div>
        </div>

        <!-- RIGHT — form -->
        <div class="form-card">
          <h3>Send us a message</h3>

          <form @submit.prevent="handleSubmit" class="contact-form" novalidate>
            <div class="form-row">
              <div class="field-group">
                <label for="firstName">First name</label>
                <input id="firstName" v-model="form.firstName" type="text" placeholder="Alex" required />
              </div>
              <div class="field-group">
                <label for="lastName">Last name</label>
                <input id="lastName" v-model="form.lastName" type="text" placeholder="Rivera" required />
              </div>
            </div>

            <div class="field-group">
              <label for="email">Email address</label>
              <input id="email" v-model="form.email" type="email" placeholder="alex@company.com" required />
            </div>

            <div class="field-group">
              <label for="subject">Subject</label>
              <select id="subject" v-model="form.subject">
                <option value="">Select a topic</option>
                <option value="demo">Request a demo</option>
                <option value="sales">Sales enquiry</option>
                <option value="support">Technical support</option>
                <option value="billing">Billing question</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div class="field-group">
              <label for="message">Message</label>
              <textarea id="message" v-model="form.message" rows="5" placeholder="Tell us how we can help..." required></textarea>
            </div>

            <button type="submit" class="submit-btn" :class="{ loading: submitting }">
              <span v-if="!submitting && !submitted">Send message →</span>
              <span v-else-if="submitting">Sending…</span>
              <span v-else>✓ Message sent!</span>
            </button>
          </form>
        </div>

      </div>
    </section>

    <!-- MAP PLACEHOLDER -->
    <section class="map-section">
      <div class="map-inner">
        <div class="map-placeholder">
          <span class="map-pin">📍</span>
          <p>California, USA</p>
          <span class="map-sub">Global team · Fully remote-friendly</span>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useHead } from '@vueuse/head'

useHead({
  title: 'Contact | TapMyName',
  meta: [
    {
      name: 'description',
      content:
          'Contact TapMyName for sales enquiries, product demos, technical support, pricing questions, and digital business card solutions.'
    },

    {
      property: 'og:title',
      content: 'Contact | TapMyName'
    },
    {
      property: 'og:description',
      content:
          'Get in touch with the TapMyName team for support, demos, pricing information, and business enquiries.'
    },
    {
      property: 'og:url',
      content: 'https://tapmy.name/contact'
    },
    {
      property: 'og:type',
      content: 'website'
    },

    {
      name: 'twitter:card',
      content: 'summary_large_image'
    }
  ],

  link: [
    {
      rel: 'canonical',
      href: 'https://tapmy.name/contact'
    }
  ]
})

const submitting = ref(false)
const submitted  = ref(false)

const apiBase = import.meta.env.VITE_API_BASE_URL || ''

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  subject: '',
  message: '',
})

async function handleSubmit() {
  submitting.value = true
  try {
    const res = await fetch(`${apiBase}/api/contact/contact-form`, {  // ← backticks, not quotes
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: form.firstName,
        lastName:  form.lastName,
        email:     form.email,
        subject:   form.subject,
        message:   form.message,
      }),
    })

    // Guard against HTML error pages returning instead of JSON
    const contentType = res.headers.get("content-type") || ""
    if (!contentType.includes("application/json")) {
      throw new Error(`Server error (${res.status}) — check API URL and CORS config`)
    }

    const data = await res.json()
    if (!res.ok) throw new Error(data.message)

    submitted.value = true
    Object.keys(form).forEach(k => (form[k] = ""))
    setTimeout(() => (submitted.value = false), 4000)
  } catch (err) {
    console.error("Contact form error:", err)
    alert("Failed to send message. Please try again.")
  } finally {
    submitting.value = false
  }
}

const infoItems = [
  { icon: '✉️', title: 'Email',    value: 'hello@tapmyname.com' },
  { icon: '📍', title: 'Location', value: 'California, USA' },
]

const socials = [
  { label: 'Twitter / X', symbol: '𝕏' },
  { label: 'LinkedIn',    symbol: 'in' },
  { label: 'Instagram',   symbol: 'ig' },
]
</script>

<style scoped>
.contact-page { padding-top: 80px; min-height: 100vh; color: var(--c-text-primary, #1c1410); }

/* ── Hero ── */
.page-hero {
  position: relative;
  text-align: center;
  padding: 100px 32px 70px;
  overflow: hidden;
}
.hero-glow { position: absolute; border-radius: 50%; filter: blur(120px); pointer-events: none; }
.glow-1 { width: 300px; height: 300px; background: rgba(124,92,78,0.14); top: -60px; left: -60px; }
.glow-2 { width: 260px; height: 260px; background: rgba(200,148,114,0.10); bottom: -60px; right: -40px; }
.hero-inner { position: relative; z-index: 1; max-width: 640px; margin: 0 auto; }

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
.hero-title em { font-style: italic; font-family: Georgia, serif; color: var(--c-accent, #7c5c4e); }
.hero-desc { color: var(--c-text-secondary, #5a4f46); line-height: 1.8; font-size: 1.05rem; margin: 0 auto; }

/* ── Contact grid ── */
.contact-section { padding: 20px 32px 80px; }

.contact-grid {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1.6fr;
  gap: 40px;
  align-items: start;
}

/* Info column */
.contact-info { display: flex; flex-direction: column; gap: 16px; }

.info-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--c-surface, #fff);
  border: 1px solid var(--c-border, #e8e3dc);
  border-radius: 18px;
  padding: 20px 22px;
  animation: rise 0.5s ease both;
  animation-delay: calc(var(--i) * 80ms);
  transition: border-color 0.3s, transform 0.3s;
}
.info-card:hover { border-color: var(--c-accent, #7c5c4e); transform: translateX(4px); }

.info-icon { font-size: 1.5rem; flex-shrink: 0; }
.info-card h4 { margin: 0 0 4px; font-size: 0.8rem; font-weight: 700; color: var(--c-text-muted, #9e8e84); text-transform: uppercase; letter-spacing: 0.5px; }
.info-card p  { margin: 0; font-size: 0.97rem; font-weight: 600; color: var(--c-text-primary, #1c1410); }

.social-block { margin-top: 8px; }
.social-label { font-size: 0.8rem; font-weight: 700; color: var(--c-text-muted, #9e8e84); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }
.social-row { display: flex; gap: 10px; }
.social-btn {
  width: 44px; height: 44px;
  border-radius: 12px;
  border: 1px solid var(--c-border, #e8e3dc);
  background: var(--c-surface, #fff);
  display: flex; align-items: center; justify-content: center;
  color: var(--c-text-secondary, #5a4f46);
  font-size: 0.88rem; font-weight: 700;
  text-decoration: none;
  transition: all 0.25s;
}
.social-btn:hover { border-color: var(--c-accent, #7c5c4e); color: var(--c-accent, #7c5c4e); transform: translateY(-2px); }

.hours-block {
  background: var(--c-accent-subtle, #f8f3f0);
  border: 1px solid var(--c-border, #e8e3dc);
  border-radius: 18px;
  padding: 20px 22px;
}
.hours-block h4 { margin: 0 0 10px; font-size: 0.95rem; font-weight: 700; color: var(--c-text-primary, #1c1410); }
.hours-block p  { margin: 0 0 4px; font-size: 0.88rem; color: var(--c-text-secondary, #5a4f46); line-height: 1.6; }

/* Form card */
.form-card {
  background: var(--c-surface, #fff);
  border: 1px solid var(--c-border, #e8e3dc);
  border-radius: 28px;
  padding: 40px;
  animation: rise 0.55s ease 0.1s both;
}
.form-card h3 { margin: 0 0 28px; font-size: 1.4rem; font-weight: 800; color: var(--c-text-primary, #1c1410); }

.contact-form { display: flex; flex-direction: column; gap: 18px; }

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

.field-group { display: flex; flex-direction: column; gap: 7px; }
.field-group label { font-size: 0.82rem; font-weight: 700; color: var(--c-text-secondary, #5a4f46); }

.field-group input,
.field-group select,
.field-group textarea {
  padding: 13px 16px;
  border: 1.5px solid var(--c-border, #e8e3dc);
  border-radius: 12px;
  background: var(--c-surface-2, #faf9f7);
  color: var(--c-text-primary, #1c1410);
  font-size: 0.95rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.25s, box-shadow 0.25s;
  resize: vertical;
}
.field-group input:focus,
.field-group select:focus,
.field-group textarea:focus {
  border-color: var(--c-accent, #7c5c4e);
  box-shadow: 0 0 0 3px rgba(124,92,78,0.10);
}
.field-group input::placeholder,
.field-group textarea::placeholder { color: var(--c-text-muted, #9e8e84); }

.submit-btn {
  padding: 15px 28px;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--c-accent-2, #a07060), var(--c-accent, #7c5c4e));
  color: white;
  font-weight: 800;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: opacity 0.3s, transform 0.3s;
  align-self: flex-start;
}
.submit-btn:hover:not(.loading) { opacity: 0.92; transform: translateY(-2px); }
.submit-btn.loading { opacity: 0.7; cursor: not-allowed; }

/* ── Map placeholder ── */
.map-section { padding: 0 32px 100px; }
.map-inner { max-width: 1100px; margin: 0 auto; }

.map-placeholder {
  height: 220px;
  border: 1px solid var(--c-border, #e8e3dc);
  border-radius: 24px;
  background: var(--c-surface-2, #faf9f7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--c-text-secondary, #5a4f46);
}
.map-pin  { font-size: 2.5rem; }
.map-placeholder p { font-size: 1.1rem; font-weight: 700; color: var(--c-text-primary, #1c1410); margin: 0; }
.map-sub  { font-size: 0.85rem; color: var(--c-text-muted, #9e8e84); }

@keyframes rise { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 900px) { .contact-grid { grid-template-columns: 1fr; } }
@media (max-width: 768px) {
  .page-hero, .contact-section, .map-section { padding-left: 20px; padding-right: 20px; }
  .form-card { padding: 28px 22px; }
  .form-row { grid-template-columns: 1fr; }
}
</style>
