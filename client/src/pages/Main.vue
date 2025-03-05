<script setup>
import { getUserInfo } from '@/services/api';
import { useUserStore } from '@/services/userStore';
import { onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const goToProfile = () => {
  router.push(`/profile/${userStore.user.username}`);
};

const userStore = useUserStore();
</script>

<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gray-100"
  >
    <h1 class="text-3xl font-bold mb-6 text-blue-600 flex">
      Hello,&nbsp;
      <div class="cursor-pointer hover:underline" @click="goToProfile">
        {{ userStore.user.username }}
      </div>
    </h1>
    <div class="flex flex-col space-y-4 w-64">
      <button
        class="cursor-pointer w-full bg-blue-500 text-white py-2 rounded-md"
      >
        Create Lobby
      </button>
      <button
        class="cursor-pointer w-full bg-green-500 text-white py-2 rounded-md"
      >
        Join Lobby
      </button>
      <button
        class="cursor-pointer w-full bg-yellow-500 text-white py-2 rounded-md"
      >
        Create Collection
      </button>
      <button
        class="cursor-pointer w-full bg-purple-500 text-white py-2 rounded-md"
      >
        Propose
      </button>
    </div>
  </div>
</template>
