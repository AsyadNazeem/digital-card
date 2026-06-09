<template>
  <!-- ===================== FOOTER ===================== -->
  <footer class="footer">
    <div class="footer-inner">

      <div class="footer-brand">
        <img :src="'/images/logo.webp'"
             class="footer-logo"
             width="140"
             height="30"
             alt="TapMyName Logo"
        />

        <p>Modern digital business cards for professionals and teams.</p>
        <div class="social-row">
          <a href="#" class="social-btn">𝕏</a>
          <a href="#" class="social-btn">in</a>
          <a href="#" class="social-btn">ig</a>
        </div>
      </div>

      <div class="footer-links">
        <div class="footer-col">
          <h4>Platform</h4>
          <a href="#">Features</a>
          <a href="#">Pricing</a>
          <a href="#">Analytics</a>
        </div>
        <div class="footer-col">
          <h4>Company</h4>
          <a href="#">About</a>
          <a href="#">Contact</a>
          <a href="#">Careers</a>
        </div>
        <div class="footer-col">
          <h4>Legal</h4>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </div>
      </div>

    </div>

    <div class="footer-bottom">
      <span>© 2026 TapMyName. All rights reserved.</span>
      <div class="footer-dot-row">
        <span class="fdot" v-for="n in 3" :key="n"></span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import {inject} from 'vue'

// Inject isDark from parent (LandingLayout) to sync theme
const {isDark, toggleDarkMode} = inject('theme')
</script>

<style scoped>
/* =========================================================
   FOOTER
========================================================= */

.footer {
  border-top: 1px solid var(--c-border);
  padding: 72px 32px 32px;
}

.footer-inner {
  max-width: 1300px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  gap: 60px;
  flex-wrap: wrap;
}

.footer-logo {
  width: 140px;
  margin-bottom: 18px;
  border-radius: 8px;
}

.footer-brand p {
  max-width: 320px;
  color: var(--c-text-secondary);
  line-height: 1.8;
  font-size: 0.95rem;
}

.social-row {
  display: flex;
  gap: 10px;
  margin-top: 24px;
}

.social-btn {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid var(--c-border);
  background: var(--c-surface-2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--c-text-secondary);
  font-size: 0.85rem;
  font-weight: 700;
  text-decoration: none;
  transition: 0.25s ease;
}

.social-btn:hover {
  border-color: var(--c-accent);
  color: var(--c-accent);
  transform: translateY(-2px);
}

.footer-links {
  display: flex;
  gap: 64px;
  flex-wrap: wrap;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-col h4 {
  margin: 0 0 8px;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--c-text-primary);
}

.footer-col a {
  text-decoration: none;
  color: var(--c-text-secondary);
  font-size: 0.95rem;
  transition: 0.25s;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.footer-col a:hover {
  color: var(--c-accent);
  transform: translateX(4px);
}

.footer-bottom {
  max-width: 1300px;
  margin: 52px auto 0;
  padding-top: 24px;
  border-top: 1px solid var(--c-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  color: var(--c-text-muted);
  font-size: 0.88rem;
}

.footer-dot-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.fdot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--c-accent);
  animation: dot-pulse 2s ease-in-out infinite;
}

.fdot:nth-child(2) {
  animation-delay: 0.3s;
}

.fdot:nth-child(3) {
  animation-delay: 0.6s;
}

@keyframes dot-pulse {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.4);
  }
}

@media (max-width: 768px) {
  .footer-inner {
    flex-direction: column;
  }

  .footer-links {
    gap: 40px;
  }
}

</style>
