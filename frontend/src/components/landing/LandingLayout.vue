<template>
  <div :class="['landing-root', { 'dark-mode': isDark }]">
    <LandingNavbar @theme-changed="toggleDarkMode" />
    <router-view :is-dark="isDark" />
    <Footer />
  </div>
</template>

<script setup>
import { inject } from 'vue'
import LandingNavbar from '@/components/landing/LandingNavbar.vue'
import Footer from '@/components/landing/Footer.vue'

const { isDark, toggleDarkMode } = inject('theme')
</script>

<style>
/*
  Global reset — scoped would not reach router-view children,
  so these are intentionally unscoped / placed in a global style block.
  If you prefer, move these into your main.css / global stylesheet.
*/

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'DM Sans', sans-serif;
}
</style>

<style scoped>
/* ── CSS Variables per theme ── */
.landing-root {
  --c-bg:            #ffffff;
  --c-surface:       #ffffff;
  --c-surface-2:     #faf9f7;
  --c-border:        #e8e3dc;
  --c-text-primary:  #1c1410;
  --c-text-secondary:#5a4f46;
  --c-text-muted:    #9e8e84;
  --c-accent:        #7c5c4e;
  --c-accent-2:      #a07060;
  --c-accent-hover:  #5e443a;
  --c-accent-light:  #f0e8e4;
  --c-accent-subtle: #f8f3f0;

  min-height: 100vh;
  color: var(--c-text-primary);
  background: radial-gradient(circle at top left,  rgba(124,92,78,0.08),  transparent 30%),
  radial-gradient(circle at bottom right, rgba(124,92,78,0.06), transparent 25%),
  var(--c-bg);
  transition: background 0.4s ease, color 0.4s ease;
}

.landing-root.dark-mode {
  --c-bg:            #131118;
  --c-surface:       #1a1720;
  --c-surface-2:     #1e1b26;
  --c-border:        #2c2838;
  --c-text-primary:  #f2ede8;
  --c-text-secondary:#a89490;
  --c-text-muted:    #6a5e5a;
  --c-accent:        #c4906e;
  --c-accent-2:      #d4a880;
  --c-accent-hover:  #d4a070;
  --c-accent-light:  #281e18;
  --c-accent-subtle: #1e1612;

  background: radial-gradient(circle at top left,  rgba(124,92,78,0.16), transparent 30%),
  radial-gradient(circle at bottom right, rgba(124,92,78,0.10), transparent 25%),
  #0d0712;
}
</style>
