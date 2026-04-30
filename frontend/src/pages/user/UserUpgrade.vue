<template>
  <transition name="fade">
    <div v-if="open" :class="['upgrade-overlay', { 'dark-mode': isDarkMode }]">
      <div class="upgrade-container">

        <div class="upgrade-header">
          <h2>Choose Your Plan</h2>

          <button class="close-btn" @click="$emit('close')">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="plans-grid">

          <div class="plan-card" :class="{ highlight: currentPlan === 'free' }">
            <div class="plan-title">Free</div>
            <div class="plan-price">Contact admin</div>
            <ul class="plan-features">
              <li>1 Company (limited features)</li>
              <li>1 Contact</li>
              <li>1 Review</li>
              <li class="disabled">No Analytics</li>
              <li class="disabled">No Premium Themes</li>
            </ul>
            <button class="choose-btn">Choose Plan</button>
          </div>

          <div class="plan-card" :class="{ highlight: currentPlan === 'plus' }">
            <div class="plan-title">Plus</div>
            <div class="plan-price">Contact admin</div>
            <ul class="plan-features">
              <li>2 Companies (full features)</li>
              <li>6 Contacts</li>
              <li>2 Reviews</li>
              <li>With Analytics</li>
              <li>With Plus Themes</li>
            </ul>
            <button class="choose-btn primary">Choose Plan</button>
          </div>

          <div class="plan-card" :class="{ highlight: currentPlan === 'premium' }">
            <div class="plan-title">Premium</div>
            <div class="plan-price">Contact admin</div>
            <ul class="plan-features">
              <li>5 Companies (full features)</li>
              <li>15 Contacts</li>
              <li>5 Reviews</li>
              <li>With Analytics</li>
              <li>With Premium Themes</li>
            </ul>
            <button class="choose-btn">Choose Plan</button>
          </div>

        </div>
        <!-- Contact Us -->
        <div class="contact-us-note">
          <p>Ready to upgrade? Contact us at
            <a href="mailto:hello@tapmy.name">hello@tapmy.name</a>
          </p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { inject, ref } from 'vue';

// Add this line after your imports
const isDarkMode = inject('isDarkMode', ref(false));

defineProps({
  open: Boolean,
  currentPlan: {
    type: String,
    default: 'free'
  }
})

defineEmits(['close'])
</script>


<style scoped>

.contact-us-note {
  text-align: center;
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.dark-mode .contact-us-note {
  border-top-color: #2d2640;
}

.contact-us-note p {
  font-size: 0.95rem;
  color: #6b7280;
}

.dark-mode .contact-us-note p {
  color: #9ca3af;
}

.contact-us-note a {
  color: #6B4423;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;
}

.dark-mode .contact-us-note a {
  color: #a78bfa;
}

.contact-us-note a:hover {
  color: #8B5A3C;
  text-decoration: underline;
}

.dark-mode .contact-us-note a:hover {
  color: #c4b5fd;
}
.upgrade-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  z-index: 3000;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  transition: background 0.3s ease;
}

.dark-mode.upgrade-overlay {
  background: rgba(0, 0, 0, 0.85);
}

/* Full Screen Container */
.upgrade-container {
  background: #ffffff;
  width: 100vw;
  height: 100vh;
  padding: 3rem 3rem 2rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.dark-mode .upgrade-container {
  background: #0f0d1a;
}

/* Header */
.upgrade-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
  transition: border-color 0.3s ease;
}

.dark-mode .upgrade-header {
  border-bottom-color: #2d2640;
}

.upgrade-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #6B4423;
  transition: color 0.3s ease;
}

.dark-mode .upgrade-header h2 {
  color: #a78bfa;
}

/* Close Button */
.close-btn {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  color: #6B4423;
  padding: 0.6rem;
  border-radius: 10px;
  transition: all 0.2s ease;
}

.dark-mode .close-btn {
  background: #1a1626;
  border-color: #2d2640;
  color: #a78bfa;
}

.close-btn:hover {
  background: #6B4423;
  color: white;
  border-color: #6B4423;
}

.dark-mode .close-btn:hover {
  background: #6366f1;
  color: white;
  border-color: #6366f1;
}

/* Plans Layout */
.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* Plan Card */
.plan-card {
  background: #ffffff;
  border-radius: 18px;
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  border: 1px solid #e5e7eb;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.dark-mode .plan-card {
  background: #1a1626;
  border-color: #2d2640;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.plan-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
}

.dark-mode .plan-card:hover {
  box-shadow: 0 20px 50px rgba(99, 102, 241, 0.3);
}

/* Highlighted Plan */
.plan-card.highlight {
  border: 2px solid #8B5A3C;
  background: #FDF8F3;
  transform: scale(1.03);
}

.dark-mode .plan-card.highlight {
  border-color: #6366f1;
  background: #2d2640;
}

/* Title */
.plan-title {
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #6B4423;
  transition: color 0.3s ease;
}

.dark-mode .plan-title {
  color: #a78bfa;
}

/* Price */
.plan-price {
  font-size: 1rem;
  font-weight: 600;
  color: #8B5A3C;
  margin-bottom: 1.75rem;
  transition: color 0.3s ease;
}

.dark-mode .plan-price {
  color: #c4b5fd;
}

/* Features */
.plan-features {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
}

.plan-features li {
  padding: 0.6rem 0;
  font-size: 0.95rem;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.3s ease;
}

.dark-mode .plan-features li {
  color: #e5e7eb;
}

.plan-features li::before {
  content: "✓";
  color: #8B5A3C;
  font-weight: bold;
  transition: color 0.3s ease;
}

.dark-mode .plan-features li::before {
  color: #a78bfa;
}

.plan-features li.disabled {
  color: #9ca3af;
  text-decoration: line-through;
}

.dark-mode .plan-features li.disabled {
  color: #6b7280;
}

.plan-features li.disabled::before {
  content: "✕";
  color: #9ca3af;
}

.dark-mode .plan-features li.disabled::before {
  color: #6b7280;
}

/* Buttons */
.choose-btn {
  margin-top: 2rem;
  padding: 0.85rem;
  border-radius: 12px;
  border: 1px solid #8B5A3C;
  background: #ffffff;
  cursor: pointer;
  font-weight: 600;
  color: #6B4423;
  transition: all 0.2s ease;
}

.dark-mode .choose-btn {
  background: #0f0d1a;
  border-color: #6366f1;
  color: #a78bfa;
}

.choose-btn:hover {
  background: #8B5A3C;
  color: white;
}

.dark-mode .choose-btn:hover {
  background: #6366f1;
  color: white;
  border-color: #6366f1;
}

/* Primary Button */
.choose-btn.primary {
  background: #6B4423;
  color: white;
  border-color: #6B4423;
}

.dark-mode .choose-btn.primary {
  background: #6366f1;
  color: white;
  border-color: #6366f1;
}

.choose-btn.primary:hover {
  background: #8B5A3C;
  border-color: #8B5A3C;
}

.dark-mode .choose-btn.primary:hover {
  background: #818cf8;
  border-color: #818cf8;
}

.choose-btn:disabled {
  background: #e5e7eb;
  border-color: #e5e7eb;
  color: #9ca3af;
  cursor: not-allowed;
}

.dark-mode .choose-btn:disabled {
  background: #1a1626;
  border-color: #2d2640;
  color: #6b7280;
}

/* Scrollbar Styling */
.upgrade-container::-webkit-scrollbar {
  width: 10px;
}

.upgrade-container::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.dark-mode .upgrade-container::-webkit-scrollbar-track {
  background: #1a1626;
}

.upgrade-container::-webkit-scrollbar-thumb {
  background: #8B5A3C;
  border-radius: 5px;
}

.dark-mode .upgrade-container::-webkit-scrollbar-thumb {
  background: #6366f1;
}

.upgrade-container::-webkit-scrollbar-thumb:hover {
  background: #6B4423;
}

.dark-mode .upgrade-container::-webkit-scrollbar-thumb:hover {
  background: #818cf8;
}

/* Fade Animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Mobile */
@media (max-width: 768px) {
  .upgrade-container {
    padding: 2rem 1.25rem;
  }

  .upgrade-header {
    margin-bottom: 2rem;
  }

  .upgrade-header h2 {
    font-size: 1.5rem;
  }

  .plans-grid {
    gap: 1.5rem;
    grid-template-columns: 1fr;
  }

  .plan-card {
    padding: 2rem 1.5rem;
  }

  .plan-card.highlight {
    transform: none;
  }

  .plan-card:hover {
    transform: none;
  }

  .plan-title {
    font-size: 1.4rem;
  }

  .plan-price {
    font-size: 0.9375rem;
  }

  .plan-features li {
    font-size: 0.875rem;
    padding: 0.5rem 0;
  }

  .choose-btn {
    padding: 0.75rem;
    font-size: 0.9375rem;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .upgrade-container {
    padding: 1.5rem 1rem;
  }

  .upgrade-header {
    margin-bottom: 1.5rem;
    padding-bottom: 0.875rem;
  }

  .upgrade-header h2 {
    font-size: 1.25rem;
  }

  .close-btn {
    padding: 0.5rem;
  }

  .close-btn svg {
    width: 20px;
    height: 20px;
  }

  .plans-grid {
    gap: 1.25rem;
  }

  .plan-card {
    padding: 1.5rem 1.25rem;
    border-radius: 14px;
  }

  .plan-title {
    font-size: 1.25rem;
  }

  .plan-price {
    font-size: 0.875rem;
    margin-bottom: 1.5rem;
  }

  .plan-features li {
    font-size: 0.8125rem;
    padding: 0.4rem 0;
  }

  .choose-btn {
    padding: 0.7rem;
    font-size: 0.875rem;
    margin-top: 1.5rem;
    border-radius: 10px;
  }
}

/* Accessibility */
.choose-btn:focus-visible,
.close-btn:focus-visible {
  outline: 3px solid #8B5A3C;
  outline-offset: 2px;
}

.dark-mode .choose-btn:focus-visible,
.dark-mode .close-btn:focus-visible {
  outline-color: #6366f1;
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .plan-card:hover {
    transform: none;
  }
}
</style>
