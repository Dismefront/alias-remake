import { createApp, type Component } from 'vue';
import App from './App.vue';
import router from './router/';

createApp(App as Component)
  .use(router)
  .mount('#app');
