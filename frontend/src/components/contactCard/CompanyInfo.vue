<template>
  <div class="company-details" :class="{ 'company-details-group': isGroup }">
    <h2 v-if="displayCompanyName">{{ displayCompanyName }}</h2>
    <h2 v-if="company.website">{{ company.displayUrl }}</h2>
  </div>
</template>

<script setup>
defineProps({
  displayCompanyName: String,
  company: Object,
  isGroup: {
    type: Boolean,
    default: false
  }
});
</script>
