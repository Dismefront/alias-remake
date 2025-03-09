import { defineStore } from 'pinia';
import { getUserInfo } from './api';
import type { UserStore } from '@/types/data';
import { toast } from 'vue3-toastify';

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
        toast.error(
          `Could not load your data. If you cannot log in, you might be blocked`,
        );
        return null;
      }
    },

    removeUser() {
      this.user = null;
    },
  },
});
