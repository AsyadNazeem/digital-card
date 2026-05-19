<template>
  <div class="contact-modal-overlay" @click="onClose">
    <div class="contact-modal" @click.stop>
      <button class="modal-close-btn" @click="onClose">&times;</button>

      <div class="contact-modal-header">
        <h3>{{ handlers.t('contactUs') }}</h3>
        <p>
          {{ handlers.t('sendMessageTo') }}
          {{ contacts[0]?.firstName }} {{ contacts[0]?.lastName }}
        </p>
      </div>

      <form @submit.prevent="handlers.submitContactMessage" class="contact-modal-form">
        <!-- Name Field -->
        <div class="form-group">
          <label for="sender-name">{{ handlers.t('yourName') }} *</label>
          <input
              id="sender-name"
              v-model="form.name"
              type="text"
              :placeholder="handlers.t('enterYourName')"
              maxlength="100"
              required
              :disabled="loading"
          />
        </div>

        <!-- Email Field -->
        <div class="form-group">
          <label for="sender-email">{{ handlers.t('yourEmail') }} *</label>
          <input
              id="sender-email"
              v-model="form.email"
              type="email"
              :placeholder="handlers.t('enterYourEmail')"
              maxlength="150"
              required
              :disabled="loading"
          />
        </div>

        <!-- Subject Field -->
        <div class="form-group">
          <label for="message-subject">{{ handlers.t('subject') }} *</label>
          <input
              id="message-subject"
              v-model="form.subject"
              type="text"
              :placeholder="handlers.t('messageSubject')"
              maxlength="200"
              required
              :disabled="loading"
          />
          <span class="char-count">{{ form.subject.length }}/200</span>
        </div>

        <!-- Message Field -->
        <div class="form-group">
          <label for="message-content">{{ handlers.t('message') }} *</label>
          <textarea
              id="message-content"
              v-model="form.message"
              :placeholder="handlers.t('enterYourMessage')"
              rows="6"
              maxlength="1000"
              required
              :disabled="loading"
          ></textarea>
          <span class="char-count">{{ form.message.length }}/1000</span>
        </div>

        <!-- Status Message -->
        <div
            v-if="status.message"
            :class="['alert', status.success ? 'alert-success' : 'alert-error']"
        >
          {{ status.message }}
        </div>

        <button type="submit" class="submit-contact-btn" :disabled="loading">
          <span v-if="loading">
            <svg class="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" stroke-width="3" stroke-dasharray="32" stroke-dashoffset="32">
                <animate attributeName="stroke-dashoffset" values="32;0" dur="1s" repeatCount="indefinite" />
              </circle>
            </svg>
            {{ handlers.t('sending') }}
          </span>
          <span v-else>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            {{ handlers.t('sendMessage') }}
          </span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
defineProps({
  locale: String,
  contacts: Array,
  form: Object,
  loading: Boolean,
  status: Object,
  handlers: Object,
  onClose: Function
});
</script>
