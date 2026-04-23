<template>
  <div
      class="additional-actions"
      :class="{
      'additional-actions-group': isGroup,
      'additional-actions--two-lines': !isGroup && additionalActionsCount > 3,
      'additional-actions--two-lines-group': isGroup && additionalActionsCount > 2
    }"
      v-if="hasSecondaryButtons"
  >
    <!-- 360 View -->
    <a
        v-if="company.view360"
        @click.prevent="handlers.handle360Click(company.view360)"
        class="action-link-secondary"
        :class="{ 'action-link-secondary-group': isGroup }"
    >
      <span v-html="getIcon('360')" class="action-icon" :class="{ 'action-icon-group': isGroup }"></span>
      <span>{{ handlers.t('view360') }}</span>
    </a>

    <!-- Reviews -->
    <button
        v-if="handlers.hasReviewLinks()"
        @click="handlers.handleReviewClick"
        class="action-link-secondary"
        :class="{ 'action-link-secondary-group': isGroup }"
    >
      <span v-html="getIcon('review')" class="action-icon" :class="{ 'action-icon-group': isGroup }"></span>
      <span>{{ handlers.t('reviews') }}</span>
    </button>

    <!-- Shop Now Links -->
    <template v-for="(file, idx) in shopNowLinks" :key="'shop-' + idx">
      <a
          @click.prevent="handlers.handleFileClick(file)"
          class="action-link-secondary shop-now-btn"
          :class="{ 'action-link-secondary-group': isGroup, 'shop-now-btn-group': isGroup }"
          :title="file.name"
      >
        <span v-html="getFileIcon(file)" class="action-icon" :class="{ 'action-icon-group': isGroup }"></span>
        <span>{{ locale === 'ar' ? 'تسوق الآن' : 'Shop Now' }}</span>
      </a>
    </template>

    <!-- Order Now Links -->
    <template v-for="(file, idx) in orderNowLinks" :key="'order-' + idx">
      <a
          @click.prevent="handlers.handleFileClick(file)"
          class="action-link-secondary order-now-btn"
          :class="{ 'action-link-secondary-group': isGroup, 'order-now-btn-group': isGroup }"
          :title="file.name"
      >
        <span v-html="getFileIcon(file)" class="action-icon" :class="{ 'action-icon-group': isGroup }"></span>
        <span>{{ locale === 'ar' ? 'اطلب الآن' : 'Order Now' }}</span>
      </a>
    </template>

    <!-- Brochure Links -->
    <template v-for="(file, idx) in brochureLinks" :key="'brochure-' + idx">
      <a
          @click.prevent="handlers.handleFileClick(file)"
          class="action-link-secondary brochure-btn"
          :class="{ 'action-link-secondary-group': isGroup, 'brochure-btn-group': isGroup }"
          :title="file.name"
      >
        <span v-html="getFileIcon(file)" class="action-icon" :class="{ 'action-icon-group': isGroup }"></span>
        <span>{{ locale === 'ar' ? 'بروشور' : 'Brochure' }}</span>
      </a>
    </template>

    <!-- Menu Links -->
    <template v-for="(file, idx) in menuLinks" :key="'menu-' + idx">
      <a
          @click.prevent="handlers.handleFileClick(file)"
          class="action-link-secondary menu-btn"
          :class="{ 'action-link-secondary-group': isGroup, 'menu-btn-group': isGroup }"
          :title="file.name"
      >
        <span v-html="getFileIcon(file)" class="action-icon" :class="{ 'action-icon-group': isGroup }"></span>
        <span>{{ locale === 'ar' ? 'قائمة' : 'Menu' }}</span>
      </a>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  locale: String,
  company: Object,
  handlers: Object,
  shopNowLinks: {
    type: Array,
    default: () => []
  },
  orderNowLinks: {
    type: Array,
    default: () => []
  },
  brochureLinks: {
    type: Array,
    default: () => []
  },
  menuLinks: {
    type: Array,
    default: () => []
  },
  isGroup: {
    type: Boolean,
    default: false
  }
});

const hasSecondaryButtons = computed(() => {
  return props.company.view360 ||
      props.handlers.hasReviewLinks() ||
      props.shopNowLinks.length ||
      props.orderNowLinks.length ||
      props.brochureLinks.length ||
      props.menuLinks.length;
});

const additionalActionsCount = computed(() => {
  let count = 0;
  if (props.company.view360) count++;
  if (props.handlers.hasReviewLinks()) count++;
  count += props.shopNowLinks.length;
  count += props.orderNowLinks.length;
  count += props.brochureLinks.length;
  count += props.menuLinks.length;
  return count;
});

const getIcon = (name) => {
  const icons = {
    '360': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20"/><path d="M12 2c2.5 0 5 4.5 5 10s-2.5 10-5 10M12 2C9.5 2 7 6.5 7 12s2.5 10 5 10"/></svg>`,
    'review': `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/></svg>`,
  };
  return icons[name] || '';
};

const getFileIcon = (file) => {
  if (!file) {
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;
  }

  if (file.isShopNow) {
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>`;
  }

  if (file.isOrderNow) {
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>`;
  }

  if (file.isMenu) {
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><circle cx="3" cy="6" r="1.5"></circle><circle cx="3" cy="12" r="1.5"></circle><circle cx="3" cy="18" r="1.5"></circle></svg>`;
  }

  if (file.isBrochure) {
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;
  }

  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 7h8M8 12h8M8 17h5"/></svg>`;
};
</script>
