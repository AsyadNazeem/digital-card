<template>
  <div
      class="review-modal-overlay"
      :class="{ 'review-modal-overlay-group': isGroup }"
      @click="onClose"
  >
    <div
        class="review-modal"
        :class="{ 'review-modal-group': isGroup }"
        @click.stop
    >
      <button
          class="modal-close-btn"
          :class="{ 'modal-close-btn-group': isGroup }"
          @click="onClose"
      >
        &times;
      </button>

      <h3>{{ handlers.t('reviewUs') }}</h3>

      <div style="display: flex; gap: 5px; margin-bottom: 20px; justify-content: center;">
        <img
            v-for="i in 5"
            :key="i"
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADPklEQVR4nO3Z3UtTYRwH8ANREESEgVeFUESZ842UXiEyCypSe4EoZqaz1RYLuogIgopuuuo+6qZLZ1P3nJP/QrAzw5rbjjMMesGX57jyJjXm+cY5y83ppjtzz3GH9oVzuec8n/2ec55nv3FcMcUUs+7BiOMEfrw6ypk9CDRFQN/2c2YORhxH4KsAqAegpJ4zaxBoGoZvXxwiEy9n6mr4FiA8QPvqOLMFgWZJQyyGyHwvZ6bgi+tQohopFSEKqHCAM0sw1BxKIFIromI8nBmCYefBlGoshyiY4Ku5Qg8CLcEUxFJIHNPNFX41LMgCoiDqreIKNQi0BJYh0kE0DN/FFWIw7KyBWAkdkHlE31VyhRR8vrUnsYtnC4kvsR6MeUqNneyoswyS3Ypw2wuErvZrr9jBxin46+YzAlaDJC4yA8oHQYkbMnkOKtghC40YF3blNtmIaysijuOQ2p+lTPbD4T/wla882TVBVrgoiUIm/hRklBzDz95tmSHqty3uz33CLCByWpwCWXCtXJXwjadpX6GFAqHqMYc4s1tioY7HEC2FB6H8PGTSru95CXc8yhsmHxDKxyDzbboQycrYHmbcG4yEUD4GKlhzQiQr0+mCWKWsG4SqCHJtTYgERrLfgVitGA6h/Bxk/kJeEAlMpPN2zphcIJSfA/U25xWRwEg3W+GvUdhDyCwoOc8EkcTYrRBrFYaQ35C9p5giUjB6Nk09EOptMAShQYZsJbqOMroq0r/DOIj6rLBaWlPkjHGQUOtrZhBK7hsHCV4UGULeGAf5eFpm+NYaMA4yUBdjByEzgHsDe0TEtZv5hkj79rKHqIdIPYiB+hhoz6jOI8pl9pCQtSsrgLr7a7/7bSWAf6P2W5uS71mes56sT0s0BVClIHjpPUYcO5d9Fu5N8Q4JP77Km6ubPWSwYTo9ogJa1yV017LqGBPuLaDCA1DyKwNGYg8Rl5x+1aOKCgg7dP/vgume7VqLRzso8ouXVgxf3ZsZN6kXEOXAp3PfINlPrnncMU9pHERmE5jJvtr8zDpTd0VFqE07yXEl7+NHhTLI5OW/RsP1fI+fvJFku4ewTV87Jpf7TPEWTPJnWd+nmGL+l/wFaFDV+oS5VJ0AAAAASUVORK5CYII="
            alt="star"
        />
      </div>

      <div class="review-options" :class="{ 'review-options-group': isGroup }">
        <button
            v-if="company.googleReviews"
            @click="handlers.redirectToReview(company.googleReviews)"
            class="review-icon-btn google"
            :class="{ 'review-icon-btn-group': isGroup, 'google-group': isGroup }"
            title="Google Reviews"
        >
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
            <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            ></path>
            <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
            ></path>
            <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
            ></path>
            <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            ></path>
          </svg>
        </button>

        <button
            v-if="company.tripAdvisor"
            @click="handlers.redirectToReview(company.tripAdvisor)"
            class="review-icon-btn tripadvisor"
            :class="{ 'review-icon-btn-group': isGroup, 'tripadvisor-group': isGroup }"
            title="TripAdvisor"
        >
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="60" height="60" viewBox="0 0 50 50">
            <path
                d="M 25 11 C 19.167969 11 13.84375 12.511719 9.789063 15 L 2 15 C 2 15 3.753906 17.152344 4.578125 19.578125 C 2.96875 21.621094 2 24.195313 2 27 C 2 33.628906 7.371094 39 14 39 C 17.496094 39 20.636719 37.492188 22.828125 35.105469 L 25 38 L 27.171875 35.105469 C 29.363281 37.492188 32.503906 39 36 39 C 42.628906 39 48 33.628906 48 27 C 48 24.195313 47.03125 21.621094 45.421875 19.578125 C 46.246094 17.152344 48 15 48 15 L 40.203125 15 C 36.148438 12.511719 30.828125 11 25 11 Z M 14 18 C 18.972656 18 23 22.027344 23 27 C 23 31.972656 18.972656 36 14 36 C 9.027344 36 5 31.972656 5 27 C 5 22.027344 9.027344 18 14 18 Z M 36 18 C 40.972656 18 45 22.027344 45 27 C 45 31.972656 40.972656 36 36 36 C 31.027344 36 27 31.972656 27 27 C 27 22.027344 31.027344 18 36 18 Z M 14 21 C 10.6875 21 8 23.6875 8 27 C 8 30.3125 10.6875 33 14 33 C 17.3125 33 20 30.3125 20 27 C 20 23.6875 17.3125 21 14 21 Z M 36 21 C 32.6875 21 30 23.6875 30 27 C 30 30.3125 32.6875 33 36 33 C 39.3125 33 42 30.3125 42 27 C 42 23.6875 39.3125 21 36 21 Z M 14 23 C 16.210938 23 18 24.789063 18 27 C 18 29.210938 16.210938 31 14 31 C 11.789063 31 10 29.210938 10 27 C 10 24.789063 11.789063 23 14 23 Z M 36 23 C 38.210938 23 40 24.789063 40 27 C 40 29.210938 38.210938 31 36 31 C 33.789063 31 32 29.210938 32 27 C 32 24.789063 33.789063 23 36 23 Z M 14 25 C 12.894531 25 12 25.894531 12 27 C 12 28.105469 12.894531 29 14 29 C 15.105469 29 16 28.105469 16 27 C 16 25.894531 15.105469 25 14 25 Z M 36 25 C 34.894531 25 34 25.894531 34 27 C 34 28.105469 34.894531 29 36 29 C 37.105469 29 38 28.105469 38 27 C 38 25.894531 37.105469 25 36 25 Z"
                fill="#26e07f"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  locale: String,
  company: Object,
  handlers: Object,
  onClose: Function,
  isGroup: {
    type: Boolean,
    default: false
  }
});
</script>
