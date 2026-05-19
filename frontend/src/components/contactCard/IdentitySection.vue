<template>
  <div class="company-info" :class="{ 'company-info-group': isGroup }">
    <h1 class="company-name" :class="{ 'company-name-group': isGroup }">
      {{ displayFirstName }} {{ displayLastName }}
    </h1>
    <p class="designation" :class="{ 'designation-group': isGroup }" v-if="displayDesignation">
      {{ displayDesignation }}
    </p>
    <div
        class="company-bio"
        :class="{ 'company-bio-group': isGroup }"
        v-if="displayBio"
        v-html="displayBio"
    ></div>
  </div>
</template>

<script setup>
defineProps({
  locale: String,
  displayFirstName: String,
  displayLastName: String,
  displayDesignation: String,
  displayBio: String,
  isGroup: {
    type: Boolean,
    default: false
  }
});
</script>
