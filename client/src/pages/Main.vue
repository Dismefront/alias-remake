<script setup lang="ts">
import { ROUTE_NAMES } from '@/router';
import { getUserLastResults } from '@/services/api';
import { useUserStore } from '@/services/userStore';
import JoinLobbyModal from '@/widgets/join-lobby/JoinLobbyModal.vue';
import SuggestWordModal from '@/widgets/suggets-word/SuggestWordModal.vue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const goToProfile = () => {
  router.push(`/profile/${userStore.user!.username}`);
};

const showSuggestModal = ref<boolean>(false);
const showJoinLobbyModal = ref<boolean>(false);

const lastData = ref<any>(null);

onMounted(() => {
  getUserLastResults().then((data) => {
    lastData.value = data;
  });
});

const userStore = useUserStore();

const formatTime = (time: Date) => new Date(time).toLocaleString();
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
        @click="showJoinLobbyModal = true"
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
        @click="showSuggestModal = true"
      >
        Propose
      </button>
    </div>
    <div v-if="lastData" class="border p-4 rounded-lg shadow-md bg-white">
      <h2 class="text-lg font-semibold">Latest Wins</h2>
      <div v-for="el in lastData">
        <p><strong>Lobby Name:</strong> {{ el.lobby_name }}</p>
        <p><strong>Start Time:</strong> {{ formatTime(el.start_time) }}</p>
        <p><strong>End Time:</strong> {{ formatTime(el.end_time) }}</p>
      </div>
    </div>
    <SuggestWordModal
      v-if="showSuggestModal"
      @close="showSuggestModal = false"
      @open="showSuggestModal = true"
      @submit="showSuggestModal = false"
    />
    <JoinLobbyModal
      v-if="showJoinLobbyModal"
      @close="showJoinLobbyModal = false"
      @open="showJoinLobbyModal = true"
      @submit="showJoinLobbyModal = false"
    />
  </div>
</template>
