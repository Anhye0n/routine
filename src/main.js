import { createApp } from 'vue';

import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import '@/assets/default.css'
import '@/assets/fonts/fonts.css'

import App from './App.vue';
import router from './router';

import today from '@/plugins/today';

// import axios from "axios"
// axios.defaults.withCredentials = true;
// import { useUserStore } from "@/stores/userManage"
// import { checkAccessToken, checkRefreshToken } from "@/plugins/jwt/checkToken"
// import { useRouter } from "vue-router"

const app = createApp(App);
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia);

app.use(today)
app.use(router);

app.mount('#app');