<template> <!-- <HeroSection/>-->
  <HeroSection/>
  <FeaturesSection/>
  <ShowCase/>
  <Testimonial/>
  <Cta/>
</template>
<script setup>
import {useHead} from '@vueuse/head'

// import HeroSection from "@/components/landing/HeroSection.vue";
import HeroSection from "../../components/landing/HeroSection.vue";
import FeaturesSection from "@/components/landing/FeaturesSection.vue";
import ShowCase from "@/components/landing/ShowCase.vue";
import Testimonial from "@/components/landing/Testimonial.vue";
import Cta from "@/components/landing/Cta.vue";

useHead({
  title: 'TapMyName | Digital Business Cards',
  meta: [
    {
      name: 'description',
      content:
          'Create professional digital business cards with QR codes, Apple Wallet, Google Wallet, analytics, reviews and team management using TapMyName.'
    }
  ]
})
</script>
<style
    scoped> /* ========================================================= SCROLL ANIMATION STATES ========================================================= */
.animate-in {
  animation: rise var(--dur, 0.6s) ease forwards;
  animation-delay: var(--delay, 0ms);
}

.slide-in-left {
  animation: slideLeft 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.slide-in-right {
  animation: slideRight 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards;
}

/* start states */
.features-header, .feature-card, .t-card, .cta-inner {
  opacity: 0;
  transform: translateY(32px);
}

.showcase-text {
  opacity: 0;
  transform: translateX(-40px);
}

.dashboard-wrap {
  opacity: 0;
  transform: translateX(40px);
}

.showcase-item {
  opacity: 0;
  transform: translateX(-20px);
}

.showcase-item.animate-in {
  animation: slideLeft 0.5s ease forwards;
  animation-delay: var(--item-delay, 0ms);
}

@keyframes rise {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideLeft {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideRight {
  to {
    opacity: 1;
    transform: translateX(0);
  }
} </style>
