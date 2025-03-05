import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router';
import Main from '@/pages/Main.vue';
import Login from '@/pages/Login.vue';
import { useUserStore } from '@/services/userStore';
import Profile from '@/pages/Profile.vue';

export const ROUTE_NAMES = {
  HOME: 'Home',
  LOGIN: 'Login',
  PROFILE: 'Profile',
};

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: ROUTE_NAMES.HOME,
    component: Main,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile/:username',
    name: ROUTE_NAMES.PROFILE,
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: ROUTE_NAMES.LOGIN,
    component: Login,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useUserStore();
  if (
    to.meta.requiresAuth &&
    (!authStore.isAuthenticated || !(await authStore.fetchUser()))
  ) {
    next('/login');
  } else {
    next();
  }
});

export default router;
