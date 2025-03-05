import { createApp, type Component } from 'vue';
import App from './App.vue';
import router from './router/';
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { createPinia } from 'pinia';

createApp(App as Component)
  .use(router)
  .use(Vue3Toastify, { autoClose: 3000 } as ToastContainerOptions)
  .use(createPinia())
  .mount('#app');
