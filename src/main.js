import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

// Router is installed as a plugin before mount so the initial route resolves first.
createApp(App).use(router).mount('#app')
