<template>
  <footer class="footer" :class="{ 'footer-group': isGroup }">
    {{ t('poweredBy') }} <span>TapMyName</span>
  </footer>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

defineProps({
  locale: String,
  isGroup: {
    type: Boolean,
    default: false
  }
});

const { t } = useI18n();
</script>
