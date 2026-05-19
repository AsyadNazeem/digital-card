<template>
  <div class="about-page">

    <!-- HERO -->
    <section class="page-hero">
      <div class="hero-glow glow-1" />
      <div class="hero-glow glow-2" />
      <div class="hero-inner">
        <div class="pill-badge">ABOUT US</div>
        <h1 class="hero-title">
          Built for the way<br />
          <em>people actually network</em>
        </h1>
        <p class="hero-desc">
          TapMyName was born from a simple frustration — paper business cards get lost,
          smudged, and forgotten. We set out to build something better.
        </p>
      </div>
    </section>

    <!-- MISSION STRIP -->
    <section class="mission-section">
      <div class="mission-inner">
        <div class="mission-text">
          <div class="pill-badge">OUR MISSION</div>
          <h2 class="section-title">
            Making every first impression<br /><em>last forever</em>
          </h2>
          <p>
            We believe your professional identity deserves more than a rectangle of card stock.
            TapMyName gives every professional and team a living, breathing digital presence
            that updates in real time, travels in a wallet app, and never runs out.
          </p>
          <p>
            Founded in 2023 in Colombo, Sri Lanka, we've grown to serve over 12,000 professionals
            across 40+ countries — and we're just getting started.
          </p>
        </div>
        <div class="mission-stats">
          <div v-for="s in stats" :key="s.label" class="stat-pill">
            <span class="stat-num">{{ s.num }}</span>
            <span class="stat-label">{{ s.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- VALUES -->
    <section class="values-section">
      <div class="values-inner">
        <div class="section-header">
          <div class="pill-badge">OUR VALUES</div>
          <h2 class="section-title">What drives us every day</h2>
        </div>
        <div class="values-grid">
          <div
              v-for="(v, i) in values"
              :key="v.title"
              class="value-card"
              :style="{ '--i': i }"
          >
            <div class="value-icon">{{ v.icon }}</div>
            <h3>{{ v.title }}</h3>
            <p>{{ v.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- TEAM -->
    <section class="team-section">
      <div class="team-inner">
        <div class="section-header">
          <div class="pill-badge">THE TEAM</div>
          <h2 class="section-title">The people behind <em>TapMyName</em></h2>
        </div>
        <div class="team-grid">
          <div
              v-for="(member, i) in team"
              :key="member.name"
              class="team-card"
              :style="{ '--i': i }"
          >
            <div class="member-avatar">{{ member.initials }}</div>
            <h4 class="member-name">{{ member.name }}</h4>
            <p class="member-role">{{ member.role }}</p>
            <p class="member-bio">{{ member.bio }}</p>
            <div class="member-socials">
              <a href="#" class="social-btn">in</a>
              <a href="#" class="social-btn">𝕏</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- TIMELINE -->
    <section class="timeline-section">
      <div class="timeline-inner">
        <div class="section-header">
          <div class="pill-badge">OUR JOURNEY</div>
          <h2 class="section-title">How we got here</h2>
        </div>
        <div class="timeline">
          <div
              v-for="(event, i) in timeline"
              :key="event.year"
              class="timeline-item"
              :class="{ right: i % 2 !== 0 }"
              :style="{ '--i': i }"
          >
            <div class="timeline-dot" />
            <div class="timeline-content">
              <span class="timeline-year">{{ event.year }}</span>
              <h4>{{ event.title }}</h4>
              <p>{{ event.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-strip">
      <div class="cta-inner">
        <h2>Join the movement.<br /><em>Go digital today.</em></h2>
        <div class="cta-actions">
          <router-link to="/register" class="cta-btn-primary">Get started free →</router-link>
          <router-link to="/contact"  class="cta-btn-secondary">Talk to us</router-link>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
const stats = [
  { num: '12K+', label: 'Professionals' },
  { num: '40+',  label: 'Countries' },
  { num: '98%',  label: 'Satisfaction' },
  { num: '2023', label: 'Founded' },
]

const values = [
  { icon: '🎯', title: 'Simplicity first',   desc: 'Powerful features shouldn\'t be complicated. We obsess over making every interaction effortless.' },
  { icon: '🌿', title: 'Sustainability',      desc: 'Every digital card saves trees. We\'re committed to helping teams reduce paper waste at scale.' },
  { icon: '🔒', title: 'Privacy by design',  desc: 'Your data belongs to you. We never sell it, and we give you full control at every step.' },
  { icon: '🤝', title: 'Community-driven',    desc: 'Our roadmap is shaped by the people who use TapMyName every day. Your feedback matters.' },
  { icon: '⚡', title: 'Speed & reliability', desc: 'Uptime matters when a first impression is on the line. We target 99.9% uptime, always.' },
  { icon: '🌍', title: 'Global by default',   desc: 'Built for teams and professionals around the world, in every time zone, every industry.' },
]

const team = [
  { initials: 'AN', name: 'Asyad Nazeem',    role: 'Co-Founder & CEO',     bio: 'Ex-enterprise consultant turned founder. Obsessed with making professional networking human again.' },
  { initials: 'RS', name: 'Rania Silva',     role: 'Co-Founder & CTO',     bio: 'Full-stack architect with a love for clean APIs and pixel-perfect interfaces.' },
  { initials: 'KP', name: 'Keanu Perera',    role: 'Head of Product',       bio: 'Puts users first in every decision. Formerly led product at two Y Combinator startups.' },
  { initials: 'FM', name: 'Fatima Mohamed',  role: 'Head of Growth',        bio: 'Growth hacker and community builder. Scaled our user base 10× in under a year.' },
]

const timeline = [
  { year: 'Q1 2023', title: 'Idea born',        desc: 'Frustrated by lost paper cards at a networking event, our founders sketched the first prototype on a napkin.' },
  { year: 'Q3 2023', title: 'Beta launch',       desc: 'First 200 beta users onboarded. NFC card prototype shipped to early adopters in Colombo.' },
  { year: 'Q1 2024', title: 'Wallet integration',desc: 'Apple Wallet and Google Wallet support shipped. Usage grew 400% in 60 days.' },
  { year: 'Q3 2024', title: '10K users',         desc: 'Crossed 10,000 active professionals and expanded support to 30+ countries.' },
  { year: '2025',    title: 'Team dashboard',    desc: 'Enterprise tier launched with full team management, bulk NFC assignment, and analytics.' },
  { year: 'Today',   title: 'Still growing',     desc: '12K+ professionals, 40+ countries, and new features shipping every sprint.' },
]
</script>

<style scoped>
.about-page { padding-top: 80px; min-height: 100vh; color: var(--c-text-primary, #1c1410); }

/* ── Hero ── */
.page-hero { position: relative; text-align: center; padding: 100px 32px 70px; overflow: hidden; }
.hero-glow { position: absolute; border-radius: 50%; filter: blur(120px); pointer-events: none; }
.glow-1 { width: 320px; height: 320px; background: rgba(124,92,78,0.14); top: -80px; right: -80px; }
.glow-2 { width: 240px; height: 240px; background: rgba(200,148,114,0.10); bottom: -60px; left: -40px; }
.hero-inner { position: relative; z-index: 1; max-width: 700px; margin: 0 auto; }

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

.hero-title { font-size: clamp(2.4rem, 5vw, 4rem); font-weight: 900; line-height: 1.08; letter-spacing: -1.5px; color: var(--c-text-primary, #1c1410); margin: 0 0 20px; }
.hero-title em { font-style: italic; font-family: Georgia, serif; color: var(--c-accent, #7c5c4e); }
.hero-desc { color: var(--c-text-secondary, #5a4f46); line-height: 1.8; font-size: 1.05rem; margin: 0 auto; max-width: 600px; }

/* ── Section title ── */
.section-title { font-size: clamp(1.8rem, 3.5vw, 3rem); font-weight: 900; letter-spacing: -1px; color: var(--c-text-primary, #1c1410); margin: 0 0 20px; line-height: 1.1; }
.section-title em { font-style: italic; font-family: Georgia, serif; color: var(--c-accent, #7c5c4e); }
.section-header { margin-bottom: 50px; }

/* ── Mission ── */
.mission-section { padding: 40px 32px 80px; }
.mission-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }

.mission-text p { color: var(--c-text-secondary, #5a4f46); line-height: 1.85; font-size: 1rem; margin: 0 0 16px; max-width: 520px; }

.mission-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.stat-pill {
  background: var(--c-surface, #fff);
  border: 1px solid var(--c-border, #e8e3dc);
  border-radius: 20px;
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: border-color 0.3s, transform 0.3s;
}
.stat-pill:hover { border-color: var(--c-accent, #7c5c4e); transform: translateY(-4px); }
.stat-num   { font-size: 2.4rem; font-weight: 900; color: var(--c-text-primary, #1c1410); }
.stat-label { font-size: 0.85rem; color: var(--c-text-muted, #9e8e84); font-weight: 600; }

/* ── Values ── */
.values-section { padding: 0 32px 80px; }
.values-inner { max-width: 1200px; margin: 0 auto; }
.values-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }

.value-card {
  background: var(--c-surface, #fff);
  border: 1px solid var(--c-border, #e8e3dc);
  border-radius: 22px;
  padding: 30px 28px;
  animation: rise 0.55s ease both;
  animation-delay: calc(var(--i) * 70ms);
  transition: border-color 0.3s, transform 0.3s;
}
.value-card:hover { border-color: var(--c-accent, #7c5c4e); transform: translateY(-5px); }
.value-icon { font-size: 1.8rem; margin-bottom: 14px; }
.value-card h3 { font-size: 1.05rem; font-weight: 700; margin: 0 0 10px; color: var(--c-text-primary, #1c1410); }
.value-card p  { font-size: 0.92rem; color: var(--c-text-secondary, #5a4f46); line-height: 1.75; margin: 0; }

/* ── Team ── */
.team-section { padding: 0 32px 80px; }
.team-inner { max-width: 1200px; margin: 0 auto; }
.team-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; }

.team-card {
  background: var(--c-surface, #fff);
  border: 1px solid var(--c-border, #e8e3dc);
  border-radius: 24px;
  padding: 32px 28px;
  text-align: center;
  animation: rise 0.55s ease both;
  animation-delay: calc(var(--i) * 80ms);
  transition: border-color 0.3s, transform 0.3s;
}
.team-card:hover { border-color: var(--c-accent, #7c5c4e); transform: translateY(-6px); }

.member-avatar {
  width: 72px; height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--c-accent-2, #a07060), var(--c-accent, #7c5c4e));
  color: white;
  font-size: 1.2rem;
  font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 16px;
}
.member-name { margin: 0 0 4px; font-size: 1.05rem; font-weight: 800; color: var(--c-text-primary, #1c1410); }
.member-role { margin: 0 0 12px; font-size: 0.8rem; font-weight: 600; color: var(--c-accent, #7c5c4e); text-transform: uppercase; letter-spacing: 0.5px; }
.member-bio  { font-size: 0.88rem; color: var(--c-text-secondary, #5a4f46); line-height: 1.7; margin: 0 0 18px; }

.member-socials { display: flex; gap: 8px; justify-content: center; }
.social-btn {
  width: 36px; height: 36px;
  border-radius: 10px;
  border: 1px solid var(--c-border, #e8e3dc);
  background: var(--c-surface-2, #faf9f7);
  color: var(--c-text-secondary, #5a4f46);
  font-size: 0.8rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  text-decoration: none;
  transition: all 0.25s;
}
.social-btn:hover { border-color: var(--c-accent, #7c5c4e); color: var(--c-accent, #7c5c4e); transform: translateY(-2px); }

/* ── Timeline ── */
.timeline-section { padding: 0 32px 80px; }
.timeline-inner { max-width: 900px; margin: 0 auto; }

.timeline { position: relative; padding: 10px 0; }
.timeline::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0; bottom: 0;
  width: 2px;
  background: var(--c-border, #e8e3dc);
  transform: translateX(-50%);
}

.timeline-item {
  display: flex;
  justify-content: flex-end;
  padding-right: calc(50% + 32px);
  margin-bottom: 36px;
  position: relative;
  animation: rise 0.55s ease both;
  animation-delay: calc(var(--i) * 80ms);
}
.timeline-item.right { justify-content: flex-start; padding-right: 0; padding-left: calc(50% + 32px); }

.timeline-dot {
  position: absolute;
  left: 50%;
  top: 18px;
  width: 14px; height: 14px;
  border-radius: 50%;
  background: var(--c-accent, #7c5c4e);
  border: 3px solid var(--c-surface, #fff);
  box-shadow: 0 0 0 2px var(--c-accent, #7c5c4e);
  transform: translateX(-50%);
  z-index: 1;
}

.timeline-content {
  background: var(--c-surface, #fff);
  border: 1px solid var(--c-border, #e8e3dc);
  border-radius: 18px;
  padding: 20px 22px;
  max-width: 340px;
  width: 100%;
  transition: border-color 0.3s;
}
.timeline-content:hover { border-color: var(--c-accent, #7c5c4e); }
.timeline-year { font-size: 0.72rem; font-weight: 700; color: var(--c-accent, #7c5c4e); text-transform: uppercase; letter-spacing: 1px; }
.timeline-content h4 { margin: 6px 0 8px; font-size: 1rem; font-weight: 700; color: var(--c-text-primary, #1c1410); }
.timeline-content p  { margin: 0; font-size: 0.88rem; color: var(--c-text-secondary, #5a4f46); line-height: 1.7; }

/* ── CTA ── */
.cta-strip { padding: 0 32px 100px; }
.cta-inner {
  max-width: 1200px; margin: 0 auto;
  background: linear-gradient(135deg, var(--c-accent, #7c5c4e), var(--c-accent-2, #a07060));
  border-radius: 28px;
  padding: 64px 48px;
  text-align: center;
}
.cta-inner h2 { font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 900; color: white; letter-spacing: -1px; margin: 0 0 32px; line-height: 1.1; }
.cta-inner h2 em { font-style: italic; font-family: Georgia, serif; opacity: 0.88; }
.cta-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }

.cta-btn-primary {
  display: inline-flex; align-items: center;
  padding: 15px 30px; background: white;
  color: var(--c-accent, #7c5c4e);
  font-weight: 800; font-size: 0.98rem;
  border-radius: 16px; text-decoration: none;
  box-shadow: 0 12px 32px rgba(0,0,0,0.12);
  transition: transform 0.3s;
}
.cta-btn-primary:hover { transform: translateY(-3px); }

.cta-btn-secondary {
  display: inline-flex; align-items: center;
  padding: 15px 30px;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.28);
  color: white;
  font-weight: 700; font-size: 0.98rem;
  border-radius: 16px; text-decoration: none;
  backdrop-filter: blur(8px);
  transition: background 0.3s, transform 0.3s;
}
.cta-btn-secondary:hover { background: rgba(255,255,255,0.22); transform: translateY(-2px); }

@keyframes rise { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 900px) {
  .mission-inner { grid-template-columns: 1fr; }
  .timeline::before { left: 20px; }
  .timeline-item, .timeline-item.right { justify-content: flex-start; padding-left: 56px; padding-right: 0; }
  .timeline-dot { left: 20px; }
}
@media (max-width: 768px) {
  .page-hero { padding: 80px 20px 60px; }
  .mission-section, .values-section, .team-section, .timeline-section, .cta-strip { padding-left: 20px; padding-right: 20px; }
  .cta-inner { padding: 44px 28px; }
}
</style>
