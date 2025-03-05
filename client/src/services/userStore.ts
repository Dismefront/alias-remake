import { defineStore } from 'pinia';
import { getUserInfo } from './api';
import type { UserStore } from '@/types/data';

export const useUserStore = defineStore('userStore', {
  state: () => ({
    user: null as UserStore | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state,
  },

  actions: {
    async fetchUser() {
      const user = await getUserInfo();
      this.user = user;
      return user;
    },

    removeUser() {
      this.user = null;
    },
  },
});
