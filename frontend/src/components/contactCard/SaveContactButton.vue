<template>
  <button @click="onSave" class="action-btn save">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
      <polyline points="17 21 17 13 7 13 7 21"></polyline>
      <polyline points="7 3 7 8 15 8"></polyline>
    </svg>
    {{ t('saveContact') }}
  </button>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

defineProps({
  locale: String,
  onSave: Function
});

const { t } = useI18n();
</script>
