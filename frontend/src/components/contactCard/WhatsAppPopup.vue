<template>
  <Teleport to="body">
    <div class="whatsapp-modal-overlay" @click="onClose()">
      <div class="whatsapp-modal" @click.stop>

        <button class="modal-close-btn" @click="onClose()">
          &times;
        </button>

        <h3>
          {{ locale === 'ar' ? 'تواصل عبر واتساب' : 'Connect via WhatsApp' }}
        </h3>

        <div class="whatsapp-options">

          <!-- Personal WhatsApp -->
          <button
              v-if="contacts?.[0]?.whatsapp"
              class="whatsapp-icon-btn"
              @click="openPersonal"
          >
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#25D366">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            <p>{{ locale === 'ar' ? 'رسالة شخصية' : 'Personal Message' }}</p>
          </button>

          <!-- WhatsApp Channel -->
          <button
              v-if="contacts?.[0]?.whatsappChannel"
              class="whatsapp-icon-btn"
              @click="openChannel"
          >
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#075E54">
              <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l4.93-1.37A9.94 9.94 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.66 0-3.21-.46-4.54-1.25l-.32-.19-3.33.87.89-3.24-.21-.33A7.94 7.94 0 014 12c0-4.42 3.58-8 8-8s8 3.58 8 8-3.58 8-8 8zm4.5-6.1c-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.53.06-.24-.12-1.03-.38-1.96-1.21-.72-.64-1.21-1.44-1.35-1.68-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.8-.2-.48-.4-.41-.55-.42H8.1c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.1.15 1.51.09.46-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28z"/>
            </svg>
            <p>{{ locale === 'ar' ? 'قناة واتساب' : 'WhatsApp Channel' }}</p>
          </button>

        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  locale: String,
  contacts: Array,
  handlers: Object,
  onClose: Function
})

const openPersonal = () => {
  const phone = props.contacts[0].whatsapp.replace(/[^0-9]/g, '')
  props.handlers.redirectToWhatsApp(`https://wa.me/${phone}`)
}

const openChannel = () => {
  props.handlers.redirectToWhatsApp(props.contacts[0].whatsappChannel)
}
</script>

<style scoped>
.whatsapp-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
}

.whatsapp-modal {
  background: #fff;
  border-radius: 20px;
  padding: 32px 28px 28px;
  max-width: 360px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  position: relative;
  animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #f3f4f6;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.modal-close-btn:hover {
  background: #e5e7eb;
  color: #111827;
  transform: rotate(90deg);
}

h3 {
  margin: 0 0 24px 0;
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  text-align: center;
}

.whatsapp-options {
  display: flex;
  flex-direction: row;
  gap: 20px;
  justify-content: center;
  align-items: center;
}

.whatsapp-icon-btn {
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  cursor: pointer;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.25s ease;
  border-radius: 16px;
  width: 120px;
  min-height: 110px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  -webkit-appearance: none;
  appearance: none;
}

.whatsapp-icon-btn:hover,
.whatsapp-icon-btn:focus {
  transform: translateY(-4px);
  background: #ffffff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: #25D366;
  outline: none;
}

.whatsapp-icon-btn:active {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.whatsapp-icon-btn svg {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
}

.whatsapp-icon-btn p {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  text-align: center;
  line-height: 1.3;
}

/* RTL support */
[dir="rtl"] .modal-close-btn {
  right: auto;
  left: 12px;
}

@media (max-width: 400px) {
  .whatsapp-modal {
    padding: 28px 20px 24px;
  }

  .whatsapp-icon-btn {
    width: 105px;
    min-height: 100px;
    padding: 14px 10px;
  }

  .whatsapp-icon-btn svg {
    width: 42px;
    height: 42px;
  }

  .whatsapp-options {
    gap: 14px;
  }
}
</style>
