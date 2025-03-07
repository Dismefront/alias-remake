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
      try {
        const user = await getUserInfo();
        this.user = user;
        return user;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        return null;
      }
    },

    removeUser() {
      this.user = null;
    },
  },
});
