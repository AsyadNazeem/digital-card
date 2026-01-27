<template>
  <transition name="fade">
    <div v-if="open" class="upgrade-overlay">
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
      </div>
    </div>
  </transition>
</template>

<script setup>
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
.upgrade-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  z-index: 3000;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
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
}

/* Header */
.upgrade-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.upgrade-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #6B4423;
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

.close-btn:hover {
  background: #6B4423;
  color: white;
  border-color: #6B4423;
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
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.plan-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
}

/* Highlighted Plan */
.plan-card.highlight {
  border: 2px solid #8B5A3C;
  background: #FDF8F3;
  transform: scale(1.03);
}

/* Title */
.plan-title {
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #6B4423;
}

/* Price */
.plan-price {
  font-size: 1rem;
  font-weight: 600;
  color: #8B5A3C;
  margin-bottom: 1.75rem;
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
}

.plan-features li::before {
  content: "✓";
  color: #8B5A3C;
  font-weight: bold;
}

.plan-features li.disabled {
  color: #9ca3af;
  text-decoration: line-through;
}

.plan-features li.disabled::before {
  content: "✕";
  color: #9ca3af;
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

.choose-btn:hover {
  background: #8B5A3C;
  color: white;
}

/* Primary Button */
.choose-btn.primary {
  background: #6B4423;
  color: white;
  border-color: #6B4423;
}

.choose-btn.primary:hover {
  background: #8B5A3C;
  border-color: #8B5A3C;
}

.choose-btn:disabled {
  background: #e5e7eb;
  border-color: #e5e7eb;
  color: #9ca3af;
  cursor: not-allowed;
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

  .upgrade-header h2 {
    font-size: 1.5rem;
  }

  .plans-grid {
    gap: 1.5rem;
  }

  .plan-card.highlight {
    transform: none;
  }
}

</style>
