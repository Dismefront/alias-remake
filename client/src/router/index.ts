import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router';
import Main from '@/pages/Main.vue';
import Login from '@/pages/Login.vue';

export const ROUTE_NAMES = {
  HOME: 'Home',
  LOGIN: 'Login',
};

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Main,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
