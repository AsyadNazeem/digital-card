import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import './style.css'
import './assets/global.css'
import { createPinia } from 'pinia'
import i18n from './i18n'
import VueGtag from 'vue-gtag-next'  // Changed to vue-gtag-next
import { createHead } from '@vueuse/head'

const pinia = createPinia()
const head = createHead()

createApp(App)
    .use(router)
    .use(pinia)
    .use(i18n)
    .use(VueGtag, {
        property: { id: 'G-Z9X7JZZVQF' },  // Changed 'config' to 'property'
        useRouter: router  // Changed 'router' to 'useRouter'
    })
    .use(head)
    .mount('#app')
