<!--<template>-->
<!--  <div id="app">-->
<!--    <router-view />-->
<!--  </div>-->
<!--</template>-->
<template>
  <div id="app" :class="{ 'dark-mode': isDark }">
    <router-view />
  </div>
</template>

<script setup>
import { ref, provide, watch } from 'vue'

const saved = localStorage.getItem('theme')
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

const isDark = ref(saved ? saved === 'dark' : prefersDark)

provide('theme', {
  isDark,
  toggleDarkMode: () => { isDark.value = !isDark.value }
})

watch(isDark, (val) => {
  localStorage.setItem('theme', val ? 'dark' : 'light')
  document.documentElement.classList.toggle('dark', val)
}, { immediate: true })
</script>
<style>
/* ═══════════════════════════════════════════════════════
   GLOBAL APP STYLES
═══════════════════════════════════════════════════════ */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  width: 100%;
  min-height: 100vh;
  transition: background-color 0.3s ease, color 0.3s ease;
}

/*
  Note: Individual pages/layouts handle their own dark mode styles
  via CSS variables:

  .landing-layout { --c-bg: #faf9f7; }
  .landing-layout.dark-mode { --c-bg: #100e14; }

  This app.vue just applies the .dark-mode class globally,
  and all children pick it up via their own scoped styles.
*/
</style>
