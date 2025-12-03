import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import './style.css'
import { createPinia } from 'pinia'
import i18n from './i18n';

const pinia = createPinia()

createApp(App)
    .use(router)
    .use(pinia)
    .use(i18n)
    .mount('#app')
