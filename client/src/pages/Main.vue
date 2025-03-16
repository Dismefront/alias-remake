<script setup lang="ts">
import { ROUTE_NAMES } from '@/router';
import { useUserStore } from '@/services/userStore';
import SuggestWordModal from '@/widgets/suggets-word/SuggestWordModal.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const goToProfile = () => {
  router.push(`/profile/${userStore.user!.username}`);
};

const show = ref<boolean>(true);
const handleClose = () => {
  show.value = false;
};

const handleOpen = () => {
  show.value = true;
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
        {{ userStore.user!.username }}
      </div>
    </h1>
    <div class="flex flex-col space-y-4 w-64">
      <button
        @click="router.push({ name: ROUTE_NAMES.LOBBY_CREATE })"
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
        @click="router.push({ name: ROUTE_NAMES.COLLECTION_CREATE })"
      >
        Create Collection
      </button>
      <button
        class="cursor-pointer w-full bg-purple-500 text-white py-2 rounded-md"
        @click="handleOpen"
      >
        Propose
      </button>
    </div>
    <SuggestWordModal v-if="show" @close="handleClose" @open="handleOpen" />
  </div>
</template>
