<template>
  <nav class="navbar" :class="{ 'dark-mode': isDark }">
    <div class="nav-container">
      <router-link to="/" class="logo-wrap">
        <img src="/images/logo.jpeg" alt="TapMyName" class="logo-img" />
      </router-link>

      <div class="nav-links">
        <router-link to="/" exact-active-class="router-link-exact-active">
          Home
        </router-link>
        <router-link to="/features">Features</router-link>
        <router-link to="/pricing">Pricing</router-link>
        <router-link to="/contact">Contact</router-link>
        <router-link to="/about">About</router-link>

        <button class="theme-toggle" @click="toggleTheme" :title="isDark ? 'Switch to light' : 'Switch to dark'">
          <span v-if="isDark">☀</span>
          <span v-else>☾</span>
        </button>

        <router-link to="/login" class="nav-btn">Login</router-link>
      </div>

      <!-- Mobile hamburger -->
      <button class="hamburger" @click="mobileOpen = !mobileOpen" :class="{ open: mobileOpen }">
        <span /><span /><span />
      </button>
    </div>

    <!-- Mobile drawer -->
    <transition name="drawer">
      <div v-if="mobileOpen" class="mobile-drawer">
        <router-link to="/"         @click="mobileOpen = false">Home</router-link>
        <router-link to="/features" @click="mobileOpen = false">Features</router-link>
        <router-link to="/pricing"  @click="mobileOpen = false">Pricing</router-link>
        <router-link to="/contact"  @click="mobileOpen = false">Contact</router-link>
        <router-link to="/about"    @click="mobileOpen = false">About</router-link>
        <router-link to="/login"    @click="mobileOpen = false" class="mobile-login-btn">Login</router-link>
        <button class="theme-toggle mobile-theme" @click="toggleTheme">
          {{ isDark ? '☀ Light Mode' : '☾ Dark Mode' }}
        </button>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, inject } from 'vue'

const { isDark, toggleDarkMode } = inject('theme')

const mobileOpen = ref(false)

function toggleTheme() {
  toggleDarkMode()
}
</script>

<style scoped>
/* ── CSS Variables ── */
.navbar {
  --c-bg:            #ffffff;
  --c-border:        #e8e3dc;
  --c-text-secondary:#5a4f46;
  --c-text-primary:  #1c1410;
  --c-surface-2:     #faf9f7;
  --c-accent:        #7c5c4e;
  --c-accent-2:      #a07060;
}

.navbar.dark-mode {
  --c-bg:            rgba(10,10,15,0.45);
  --c-border:        #2c2838;
  --c-text-secondary:#a89490;
  --c-text-primary:  #f2ede8;
  --c-surface-2:     #1e1b26;
  --c-accent:        #c4906e;
  --c-accent-2:      #d4a880;
}

/* ── Base ── */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.65);
  border-bottom: 1px solid var(--c-border);
  transition: background 0.3s ease, border-color 0.3s ease;
}

.navbar.dark-mode {
  background: var(--c-bg);
}

.nav-container {
  max-width: 1450px;
  margin: auto;
  padding: 18px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* ── Logo ── */
.logo-wrap {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo-img {
  height: 44px;
  width: auto;
  object-fit: contain;
  border-radius: 10px;
}

/* ── Desktop links ── */
.nav-links {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-links a {
  color: var(--c-text-secondary);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  transition: color 0.25s;
}

.nav-links a:hover,
.nav-links a.router-link-exact-active {
  color: var(--c-text-primary);
}

/* Theme toggle */
.theme-toggle {
  width: 46px;
  height: 46px;
  border: 1px solid var(--c-border);
  border-radius: 14px;
  cursor: pointer;
  font-size: 1rem;
  background: var(--c-surface-2);
  color: var(--c-text-primary);
  transition: transform 0.3s ease, border-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-toggle:hover {
  transform: translateY(-2px);
  border-color: var(--c-accent);
}

/* Login button */
.nav-btn {
  background: linear-gradient(135deg, var(--c-accent-2), var(--c-accent));
  padding: 12px 24px;
  border-radius: 14px;
  color: white !important;
  font-weight: 700;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  transition: transform 0.3s ease;
  text-decoration: none;
}

.nav-btn:hover {
  transform: translateY(-2px);
}

/* ── Hamburger (mobile only) ── */
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 40px;
  height: 40px;
  background: transparent;
  border: 1px solid var(--c-border);
  border-radius: 10px;
  cursor: pointer;
  padding: 8px;
}

.hamburger span {
  display: block;
  height: 2px;
  background: var(--c-text-primary);
  border-radius: 2px;
  transition: all 0.3s ease;
  transform-origin: center;
}

.hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
.hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* ── Mobile drawer ── */
.mobile-drawer {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 20px 20px;
  background: var(--c-bg);
  border-top: 1px solid var(--c-border);
}

.mobile-drawer a {
  color: var(--c-text-secondary);
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  padding: 10px 0;
  border-bottom: 1px solid var(--c-border);
  transition: color 0.2s;
}

.mobile-drawer a:hover,
.mobile-drawer a.router-link-exact-active {
  color: var(--c-accent);
}

.mobile-login-btn {
  margin-top: 8px;
  background: linear-gradient(135deg, var(--c-accent-2), var(--c-accent));
  color: white !important;
  border-radius: 12px;
  padding: 12px 16px !important;
  text-align: center;
  border-bottom: none !important;
  font-weight: 700;
}

.mobile-theme {
  width: 100%;
  margin-top: 8px;
  border-radius: 12px;
  height: auto;
  padding: 12px 16px;
  font-size: 0.95rem;
  font-weight: 600;
  background: var(--c-surface-2);
  color: var(--c-text-primary);
  border: 1px solid var(--c-border);
}

/* ── Drawer animation ── */
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .nav-links   { display: none; }
  .hamburger   { display: flex; }

  .nav-container { padding: 16px 20px; }
}
</style>
