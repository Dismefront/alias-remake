import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router';
import Main from '@/pages/Main.vue';
import Login from '@/pages/Login.vue';
import { useUserStore } from '@/services/userStore';
import Profile from '@/pages/Profile.vue';
import LobbyCreate from '@/pages/LobbyCreate.vue';
import CreateCollection from '@/pages/CreateCollection.vue';

export const ROUTE_NAMES = {
  HOME: 'Home',
  LOGIN: 'Login',
  PROFILE: 'Profile',
  LOBBY_CREATE: 'Create lobby',
  COLLECTION_CREATE: 'Create collection',
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
  {
    path: '/lobby/create',
    name: ROUTE_NAMES.LOBBY_CREATE,
    component: LobbyCreate,
    meta: { requiresAuth: true },
  },
  {
    path: '/collection/create',
    name: ROUTE_NAMES.COLLECTION_CREATE,
    component: CreateCollection,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, _from, next) => {
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
