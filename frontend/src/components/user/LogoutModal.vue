<template>
  <transition name="modal-fade">
    <div v-if="show" class="logout-modal-overlay" :class="{ 'dark-mode': isDarkMode }" @click="$emit('close')">
      <transition name="modal-scale">
        <div v-if="show" class="logout-modal" @click.stop>
          <!-- Icon -->
          <div class="logout-icon-wrapper">
            <svg class="logout-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </div>

          <!-- Content -->
          <h2 class="logout-title">Log Out</h2>
          <p class="logout-message">Are you sure you want to log out? You'll need to sign in again to access your account.</p>

          <!-- Actions -->
          <div class="logout-actions">
            <button @click="$emit('close')" class="btn-cancel">
              Cancel
            </button>
            <button @click="$emit('confirm')" class="btn-logout">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Log Out
            </button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup>
import { ref, inject } from 'vue';

defineProps({
  show: {
    type: Boolean,
    default: false
  }
});

defineEmits(['close', 'confirm']);

const theme = inject('theme', { isDark: ref(false) })
const isDarkMode = theme.isDark
</script>

<style scoped>
.logout-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000000;
  padding: 1rem;
}

.logout-modal-overlay.dark-mode {
  background: rgba(0, 0, 0, 0.8);
}

.logout-modal {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
}

.dark-mode .logout-modal {
  background: #1a1626;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
}

.logout-icon-wrapper {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dark-mode .logout-icon-wrapper {
  background: linear-gradient(135deg, #3a1a1a 0%, #2a1a1a 100%);
}

.logout-icon {
  color: #dc2626;
}

.dark-mode .logout-icon {
  color: #fca5a5;
}

.logout-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.dark-mode .logout-title {
  color: #e5e7eb;
}

.logout-message {
  font-size: 0.9375rem;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}

.dark-mode .logout-message {
  color: #9ca3af;
}

.logout-actions {
  display: flex;
  gap: 0.75rem;
  width: 100%;
  margin-top: 0.5rem;
}

.btn-cancel,
.btn-logout {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
}

.btn-cancel {
  background: #f3f4f6;
  color: #4b5563;
}

.dark-mode .btn-cancel {
  background: #0f0d1a;
  color: #9ca3af;
  border: 1px solid #2d2640;
}

.btn-cancel:hover {
  background: #e5e7eb;
  color: #1f2937;
}

.dark-mode .btn-cancel:hover {
  background: #2d2640;
  color: #e5e7eb;
}

.btn-logout {
  background: #dc2626;
  color: white;
}

.btn-logout:hover {
  background: #b91c1c;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}

.dark-mode .btn-logout {
  background: #ef4444;
}

.dark-mode .btn-logout:hover {
  background: #dc2626;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

/* Modal Animations */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-scale-enter-active,
.modal-scale-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-scale-enter-from,
.modal-scale-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}

/* Responsive */
@media (max-width: 480px) {
  .logout-modal {
    padding: 1.5rem;
  }

  .logout-icon-wrapper {
    width: 64px;
    height: 64px;
  }

  .logout-icon {
    width: 36px;
    height: 36px;
  }

  .logout-title {
    font-size: 1.25rem;
  }

  .logout-message {
    font-size: 0.875rem;
  }

  .logout-actions {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-logout {
    width: 100%;
  }
}
</style>
