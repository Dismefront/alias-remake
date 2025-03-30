<script lang="ts" setup>
const globalWindow = window;
const globalNavigator = navigator;
import router, { ROUTE_NAMES } from '@/router';
import { useUserStore } from '@/services/userStore';
import type { Lobby } from '@/types/data';
import { io, Socket } from 'socket.io-client';
import { nextTick, onBeforeMount, onBeforeUnmount, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { toast } from 'vue3-toastify';

let socket: Socket;

const route = useRoute();
const lobbyId = route.params.lobbyId;

const words = ref([]);
const messages = ref([
  'Welcome to the chat.',
  'You can type your suggestions here!',
]);
const newMessage = ref('');
const messageContainer = ref<HTMLDivElement | null>(null);
const state = reactive<{ lobby: null | Lobby }>({ lobby: null });

const currentUser = useUserStore();

const sendMessage = () => {
  if (newMessage.value.trim() !== '') {
    messages.value.push(newMessage.value);
    newMessage.value = '';
  }

  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
    }
  });
};

onBeforeMount(() => {
  socket = io('ws://localhost:91/play/', {
    withCredentials: true,
    transports: ['websocket'],
    query: {
      lobbyId,
    },
  });

  socket.on('permission-error', (data) => {
    router.push({ name: ROUTE_NAMES.HOME }).then(() => {
      toast.error(data);
    });
  });

  socket.on('connect', () => {
    console.log('connected');
  });

  socket.on('disconnect', () => {
    console.log('disconnected');
  });

  socket.on('lobby-state', (data: Lobby) => {
    state.lobby = data;
    console.log(state.lobby);
  });
});

const createTeam = () => {
  socket.emit('create-team');
};

const switchTeam = (id: number) => {
  console.log(id);
  socket.emit('switch-team', id);
};

onBeforeUnmount(() => {
  socket.disconnect();
});
</script>

<template>
  <div class="flex h-screen p-4 bg-gray-100">
    <!-- Main Container -->
    <div class="flex flex-col flex-grow">
      <div :class="`flex flex-wrap gap-4 justify-center`">
        <div
          @click="
            () => {
              globalNavigator.clipboard.writeText(lobbyId as string);
              toast.success('Идентификатор скопирован');
            }
          "
          class="p-4 text-white text-center rounded-lg shadow-md min-w-60 bg-green-500 cursor-pointer select-none hover:bg-green-600"
        >
          {{ lobbyId }}
        </div>
      </div>
      <!-- Top Team Blocks -->
      <div class="p-4 mr-20 ml-20">
        <div :class="`flex flex-wrap gap-4 justify-center`">
          <div
            v-for="(team, index) in state.lobby?.teams"
            :key="`${team.id}${index}`"
            class="p-4 text-white rounded-lg shadow-md min-w-60 bg-gray-600 flex justify-around flex-wrap max-w-30 cursor-pointer"
            @click="switchTeam(team.id)"
          >
            <div
              v-for="member in team.members"
              class="mr-1 ml-1"
              :class="
                member.username === currentUser.user?.username && 'font-bold'
              "
            >
              {{ member.username }}
            </div>
          </div>
          <div
            class="p-4 text-white flex rounded-lg shadow-md min-w-60 bg-gray-500 cursor-pointer justify-center items-center"
            @click="createTeam"
          >
            +
          </div>
        </div>
      </div>

      <!-- Center Container with Mini Cards -->
      <div class="flex-grow flex justify-center items-center p-4">
        <div
          class="grid grid-cols-3 gap-4 p-4 bg-white shadow-md rounded-lg max-h-80 overflow-y-auto w-2/3"
        >
          <h1 v-if="words.length === 0">There will be words</h1>
          <div
            v-for="(word, index) in words"
            :key="index"
            class="p-2 bg-gray-200 rounded-lg shadow"
          >
            {{ word }}
          </div>
        </div>
      </div>

      <!-- Bottom Button -->
      <div class="flex justify-center p-4">
        <button
          class="px-6 py-2 bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-600 cursor-pointer"
        >
          Action Button
        </button>
      </div>
    </div>

    <!-- Chat Window -->
    <div class="w-1/4 bg-white p-4 shadow-md rounded-lg ml-4 flex flex-col">
      <div
        ref="messageContainer"
        class="flex-grow overflow-y-auto max-h-80 p-2 border-b"
      >
        <div
          v-for="(message, index) in messages"
          :key="index"
          class="p-2 bg-gray-100 rounded-lg mb-2"
        >
          {{ message }}
        </div>
      </div>
      <input
        v-model="newMessage"
        @keyup.enter="sendMessage"
        placeholder="Type a message..."
        class="p-2 mt-2 border rounded-lg w-full"
      />
      <div class="flex-grow overflow-y-auto max-h-80 p-2 mt-10">
        <h1 v-if="state.lobby?.members.length !== 0">Observers:</h1>
        <h2
          v-for="user in state.lobby?.members.filter(
            (user) => (user.teamAttendanceId ?? -1) <= 0,
          )"
          :class="user.username === currentUser.user?.username && 'font-bold'"
          class="m-1 p-2 bg-orange-100 rounded-lg cursor-pointer"
          @click="
            () => {
              globalWindow.open(
                router.resolve({
                  name: ROUTE_NAMES.PROFILE,
                  params: { username: user.username },
                }).href,
                '_blank',
              );
            }
          "
        >
          {{ user.username }}
        </h2>
      </div>
    </div>
  </div>
</template>
