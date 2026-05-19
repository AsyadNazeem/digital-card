<template>
  <div class="landing-page" :class="{ 'dark-mode': isDark }">
    <!-- HERO (unchanged) -->
    <section class="hero-section">
      <div class="hero-glow glow-1"></div>
      <div class="hero-glow glow-2"></div>
      <div class="hero-container">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="dot"></span>
            DIGITAL BUSINESS PLATFORM
          </div>
          <h1 class="hero-title">
            Your identity,
            <span>one tap</span>
            away.
          </h1>
          <p class="hero-description">
            Modern digital business cards with QR, Apple Wallet and Google Wallet integration
            for teams and professionals.
          </p>
          <div class="hero-actions">
            <router-link to="/register" class="primary-btn">Get Started</router-link>
            <a href="#about" class="secondary-btn">Explore Features</a>
          </div>
          <div class="hero-stats">
            <div class="stat-card"><h3>12K+</h3><p>Cards Created</p></div>
            <div class="stat-card"><h3>98%</h3><p>User Satisfaction</p></div>
            <div class="stat-card"><h3>24/7</h3><p>Cloud Access</p></div>
          </div>
        </div>
        <div class="hero-image-wrap">
          <div class="image-backdrop"></div>
          <img
              :src="isDark ? '/images/darkheader.png' : '/images/lightheader.png'"
              alt="TapMyName Platform"
              class="hero-image"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { inject } from 'vue'

// Inject isDark from parent (LandingLayout) to sync theme
const { isDark, toggleDarkMode } = inject('theme')

</script>

<style scoped>

/* =========================================================
   HERO (unchanged)
========================================================= */

.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding-top: 30px;
}

.hero-container {
  width: 100%;
  max-width: 1450px;
  margin: auto;
  padding: 0 32px;
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  align-items: center;
  gap: 60px;
}

.hero-content {
  position: relative;
  z-index: 2;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px;
  border-radius: 100px;
  background: var(--c-accent-subtle);
  border: 1px solid var(--c-border);
  color: var(--c-accent);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 1.8px;
  margin-bottom: 28px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--c-accent);
}

.hero-title {
  font-size: clamp(3rem, 6vw, 5.5rem);
  line-height: 1;
  font-weight: 900;
  letter-spacing: -3px;
  color: var(--c-text-primary);
  margin: 0;
}

.hero-title span {
  display: block;
  margin-top: 12px;
  color: var(--c-accent);
  font-style: italic;
  font-family: Georgia, serif;
}

.hero-description {
  margin-top: 28px;
  max-width: 560px;
  color: var(--c-text-secondary);
  line-height: 1.8;
  font-size: 1.05rem;
}

.hero-actions {
  margin-top: 38px;
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
}

.primary-btn {
  background: linear-gradient(135deg, var(--c-accent-2), var(--c-accent));
  color: white;
  text-decoration: none;
  padding: 15px 28px;
  border-radius: 16px;
  font-weight: 700;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  transition: 0.3s ease;
}

.primary-btn:hover {
  transform: translateY(-3px);
}

.secondary-btn {
  padding: 15px 28px;
  border-radius: 16px;
  text-decoration: none;
  color: var(--c-text-primary);
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  transition: 0.3s ease;
}

.secondary-btn:hover {
  border-color: var(--c-accent);
}

.hero-stats {
  margin-top: 55px;
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
}

.stat-card {
  min-width: 160px;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  padding: 22px;
  border-radius: 22px;
  backdrop-filter: blur(14px);
  transition: 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  border-color: var(--c-accent);
}

.stat-card h3 {
  margin: 0;
  font-size: 1.8rem;
  color: var(--c-text-primary);
}

.stat-card p {
  margin-top: 6px;
  color: var(--c-text-secondary);
  font-size: 0.88rem;
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
  z-index: 2;
  width: 100%;
  max-width: 850px;
  filter: drop-shadow(0 40px 80px rgba(0, 0, 0, 0.30));
  animation: float 5s ease-in-out infinite;
}

.hero-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
}

.glow-1 {
  width: 300px;
  height: 300px;
  background: rgba(124, 92, 78, 0.18);
  top: -60px;
  left: -100px;
}

.glow-2 {
  width: 260px;
  height: 260px;
  background: rgba(200, 148, 114, 0.12);
  bottom: -100px;
  right: -60px;
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
  .hero-container {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .hero-description {
    margin-left: auto;
    margin-right: auto;
  }

  .hero-actions {
    justify-content: center;
  }

  .hero-stats {
    justify-content: center;
  }

  .hero-image {
    max-width: 650px;
    margin-top: 40px;
  }
}

@media (max-width: 768px) {
  .nav-container {
    padding: 16px 20px;
  }

  .nav-links {
    gap: 12px;
  }

  .nav-links a {
    display: none;
  }

  .hero-title {
    font-size: 3.3rem;
  }

  .hero-section {
    padding-top: 120px;
  }

  .hero-image {
    max-width: 100%;
  }

  .hero-stats {
    gap: 12px;
  }

  .stat-card {
    width: 100%;
  }
}
</style>



