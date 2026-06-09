<template>
  <!-- ===================== CTA ===================== -->
  <section class="cta-section" ref="ctaRef">

    <div class="cta-inner" :class="{ 'animate-in': ctaVisible }">

      <!-- Floating particles -->
      <div class="cta-particles">
        <div
            v-for="n in 12"
            :key="n"
            class="particle"
            :style="{ '--p': n }"
        ></div>
      </div>

      <!-- LEFT CONTENT -->
      <div class="cta-text">

        <div class="cta-eyebrow">
          COMPANY DIGITAL IDENTITY
        </div>

        <h2>
          Your business card,
          <em>smarter with QR</em>
          and Wallet.
        </h2>

        <p>
          Stop handing out paper. Give every employee a digital card
          with a built-in QR code, saved straight to Apple or Google Wallet -
          all created, distributed and tracked from one company dashboard.
        </p>

        <!-- Trust pills -->
        <div class="cta-stats">

          <span>✔ Employee Wallet Passes</span>
          <span>✔ QR & Link Sharing</span>
          <span>✔ Company Analytics</span>

        </div>

      </div>

      <!-- ACTIONS -->
      <div class="cta-actions">

        <router-link
            to="/register"
            class="cta-primary-btn"
        >
          Create Company Workspace

          <span class="btn-arrow">→</span>
        </router-link>

      </div>

    </div>

  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const ctaRef = ref(null)
const ctaVisible = ref(false)

onMounted(() => {

  const observer = new IntersectionObserver(
      ([entry]) => {

        if (entry.isIntersecting) {

          ctaVisible.value = true
          observer.unobserve(ctaRef.value)
        }
      },
      {
        threshold: 0.2
      }
  )

  if (ctaRef.value) {
    observer.observe(ctaRef.value)
  }
})
</script>

<style scoped>

/* =========================================================
   CTA SECTION
========================================================= */

.cta-section {

  position: relative;

  padding:
      100px
      32px
      130px;

  overflow: hidden;
}

/* =========================================================
   CONTAINER
========================================================= */

.cta-inner {

  position: relative;

  max-width: 1320px;

  margin: 0 auto;

  padding:
      72px
      72px;

  border-radius: 36px;

  border: 1px solid var(--c-border);

  background:
      linear-gradient(
          180deg,
          rgba(255,255,255,0.03),
          rgba(255,255,255,0.01)
      );

  backdrop-filter: blur(14px);

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 56px;

  overflow: hidden;

  opacity: 0;

  transform: translateY(36px);

  transition:
      opacity 0.7s ease,
      transform 0.7s cubic-bezier(0.16,1,0.3,1),
      border-color 0.25s ease,
      box-shadow 0.25s ease;
}

.cta-inner.animate-in {

  opacity: 1;

  transform: translateY(0);
}

.cta-inner:hover {

  border-color:
      rgba(196,144,110,0.28);

  box-shadow:
      0 24px 80px rgba(0,0,0,0.16);
}

/* =========================================================
   GLOW BACKGROUND
========================================================= */

.cta-inner::before {

  content: '';

  position: absolute;

  inset: 0;

  background:
      radial-gradient(
          circle at top right,
          rgba(196,144,110,0.12),
          transparent 35%
      ),
      radial-gradient(
          circle at bottom left,
          rgba(196,144,110,0.08),
          transparent 30%
      );

  pointer-events: none;
}

.cta-inner::after {

  content: '';

  position: absolute;

  inset: 0;

  background:
      repeating-linear-gradient(
          -45deg,
          transparent,
          transparent 32px,
          rgba(255,255,255,0.015) 32px,
          rgba(255,255,255,0.015) 33px
      );

  pointer-events: none;
}

/* =========================================================
   PARTICLES
========================================================= */

.cta-particles {

  position: absolute;

  inset: 0;

  overflow: hidden;

  pointer-events: none;
}

.particle {

  position: absolute;

  width: 5px;
  height: 5px;

  border-radius: 50%;

  background:
      rgba(196,144,110,0.35);

  top:
      calc(8% + (var(--p) * 6.5%));

  left:
      calc(5% + (var(--p) * 7%));

  animation:
      particleFloat calc(5s + (var(--p) * 0.45s))
      ease-in-out
      infinite;

  animation-delay:
      calc(var(--p) * 0.25s);
}

@keyframes particleFloat {

  0%,100% {

    transform:
        translateY(0)
        scale(1);

    opacity: 0.3;
  }

  50% {

    transform:
        translateY(-24px)
        scale(1.5);

    opacity: 0.8;
  }
}

/* =========================================================
   TEXT
========================================================= */

.cta-text {

  position: relative;

  z-index: 2;

  flex: 1;
}

/* =========================================================
   EYEBROW
========================================================= */

.cta-eyebrow {

  display: inline-flex;

  align-items: center;

  gap: 10px;

  margin-bottom: 18px;

  font-size: 11px;

  font-weight: 700;

  letter-spacing: 2.6px;

  text-transform: uppercase;

  color: var(--c-accent);

  opacity: 0.9;
}

/* =========================================================
   HEADING
========================================================= */

.cta-text h2 {

  margin: 0;

  max-width: 760px;

  font-family:
      'Georgia',
      'Times New Roman',
      serif;

  font-size:
      clamp(2.4rem, 4vw, 4.3rem);

  font-weight: 900;

  line-height: 1.02;

  letter-spacing: -2px;

  color: var(--c-text-primary);
}

.cta-text h2 em {

  position: relative;

  display: inline-block;

  font-style: italic;

  color: var(--c-accent);
}

.cta-text h2 em::after {

  content: '';

  position: absolute;

  left: 0;
  bottom: 4px;

  width: 100%;
  height: 2px;

  border-radius: 20px;

  background:
      linear-gradient(
          90deg,
          var(--c-accent),
          var(--c-accent-2)
      );

  opacity: 0.35;
}

/* =========================================================
   DESCRIPTION
========================================================= */

.cta-text p {

  margin:
      24px 0 0;

  max-width: 620px;

  font-size: 1rem;

  line-height: 1.85;

  color: var(--c-text-secondary);
}

/* =========================================================
   TRUST STATS
========================================================= */

.cta-stats {

  display: flex;

  flex-wrap: wrap;

  gap: 12px;

  margin-top: 24px;
}

.cta-stats span {

  display: inline-flex;

  align-items: center;

  padding:
      9px
      14px;

  border-radius: 999px;

  background:
      rgba(255,255,255,0.03);

  border:
      1px solid var(--c-border);

  color:
      var(--c-text-secondary);

  font-size: 12px;

  font-weight: 600;

  transition:
      border-color 0.25s ease,
      background 0.25s ease,
      transform 0.25s ease;
}

.cta-stats span:hover {

  transform:
      translateY(-2px);

  border-color:
      rgba(196,144,110,0.28);

  background:
      rgba(196,144,110,0.06);
}

/* =========================================================
   ACTIONS
========================================================= */

.cta-actions {

  position: relative;

  z-index: 2;

  display: flex;

  flex-direction: column;

  gap: 16px;

  min-width: 260px;
}

/* =========================================================
   PRIMARY BUTTON
========================================================= */

.cta-primary-btn {

  position: relative;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  gap: 12px;

  padding:
      18px
      28px;

  border-radius: 18px;

  background:
      linear-gradient(
          135deg,
          var(--c-accent-2),
          var(--c-accent)
      );

  color: white;

  text-decoration: none;

  font-size: 15px;

  font-weight: 800;

  letter-spacing: 0.2px;

  box-shadow:
      0 14px 40px rgba(124,92,78,0.28);

  transition:
      transform 0.25s ease,
      box-shadow 0.25s ease;
}

.cta-primary-btn:hover {

  transform:
      translateY(-3px);

  box-shadow:
      0 20px 50px rgba(124,92,78,0.38);
}

.btn-arrow {

  transition:
      transform 0.25s ease;
}

.cta-primary-btn:hover .btn-arrow {

  transform:
      translateX(4px);
}

/* =========================================================
   SECONDARY BUTTON
========================================================= */

.cta-secondary-btn {

  display: inline-flex;

  align-items: center;

  justify-content: center;

  padding:
      18px
      28px;

  border-radius: 18px;

  border:
      1px solid var(--c-border);

  background:
      rgba(255,255,255,0.03);

  color:
      var(--c-text-primary);

  text-decoration: none;

  font-size: 15px;

  font-weight: 700;

  backdrop-filter: blur(10px);

  transition:
      transform 0.25s ease,
      border-color 0.25s ease,
      background 0.25s ease;
}

.cta-secondary-btn:hover {

  transform:
      translateY(-2px);

  border-color:
      rgba(196,144,110,0.34);

  background:
      rgba(196,144,110,0.08);
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 980px) {

  .cta-inner {

    flex-direction: column;

    align-items: flex-start;

    padding:
        52px
        42px;
  }

  .cta-actions {

    width: 100%;

    flex-direction: row;
  }
}

@media (max-width: 768px) {

  .cta-text h2 {

    font-size:
        clamp(2.1rem, 8vw, 3.4rem);
  }

  .cta-text p {

    font-size: 0.98rem;
  }
}

@media (max-width: 640px) {

  .cta-section {

    padding:
        70px
        18px
        90px;
  }

  .cta-inner {

    padding:
        38px
        24px;

    border-radius: 28px;

    gap: 34px;
  }

  .cta-actions {

    width: 100%;

    flex-direction: column;
  }

  .cta-primary-btn,
  .cta-secondary-btn {

    width: 100%;
  }

  .cta-stats {

    gap: 10px;
  }

  .cta-stats span {

    font-size: 11px;
  }
}

/* =========================================================
   REDUCED MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {

  .cta-inner,
  .particle {

    animation: none !important;

    transition: none !important;

    transform: none !important;

    opacity: 1 !important;
  }
}

</style>
