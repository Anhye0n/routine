import { createApp } from 'vue';
import { createPinia } from 'pinia';

import '@/assets/default.css'
import '@/assets/fonts/fonts.css'

import App from './App.vue';
import router from './router';

import today from '@/plugins/today';

const app = createApp(App);

app.use(createPinia());

app.use(today)
app.use(router);

app.mount('#app');
