<script lang="ts" setup>
const globalWindow = window;
const globalNavigator = navigator;
import router, { ROUTE_NAMES } from '@/router';
import { useUserStore } from '@/services/userStore';
import type { Lobby, RoundInfo, Team, Word } from '@/types/data';
import GameButtons from '@/widgets/game-buttons/GameButtons.vue';
import WordCards from '@/widgets/game-buttons/WordCards.vue';
import { io, Socket } from 'socket.io-client';
import { nextTick, onBeforeMount, onBeforeUnmount, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { toast } from 'vue3-toastify';

let socket: Socket;

const route = useRoute();
const lobbyId = route.params.lobbyId;

const words = reactive<{ data: Word[] }>({ data: [] });
const winnerTeam = ref<Team | null>(null);
const messages = ref([
  'Welcome to the chat.',
  'You can type your suggestions here!',
]);
const newMessage = ref('');
const messageContainer = ref<HTMLDivElement | null>(null);
const state = reactive<{ lobby: null | Lobby; roundInfo: RoundInfo | null }>({
  lobby: null,
  roundInfo: null,
});

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
    console.log(data);
  });

  socket.on('round-info', (data: RoundInfo) => {
    state.roundInfo = data;
    words.data = data.words;
    console.log(data);
  });

  socket.on('declare-winner', (data: Team) => {
    winnerTeam.value = data;
  });
});

const createTeam = () => {
  socket.emit('create-team');
};

const switchTeam = (id: number) => {
  socket.emit('switch-team', id);
};

const clearWinner = () => {
  winnerTeam.value = null;
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
            class="p-4 relative text-white rounded-lg shadow-md min-w-60 bg-gray-600 flex justify-around flex-wrap max-w-30 cursor-pointer"
            :class="
              state.lobby?.hostTeamId === index && state.lobby.is_game_going
                ? 'bg-yellow-600'
                : !state.lobby?.is_game_going && winnerTeam?.id === team.id
                  ? 'bg-green-500'
                  : ''
            "
            @click="switchTeam(team.id)"
          >
            <div class="absolute top-[0.2rem] left-1 text-[0.7rem]">
              score: {{ (team.wordsGuessed ?? []).length }}
            </div>
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
          <h1 v-if="words.data.length === 0">There will be words</h1>
          <WordCards
            :socket="socket"
            :state="{ lobby: state.lobby, roundInfo: state.roundInfo }"
            :words="words.data"
          />
        </div>
      </div>

      <!-- Bottom Button -->
      <div
        v-if="
          state.roundInfo?.is_round_going && state.roundInfo?.leftSeconds >= 0
        "
        class="flex justify-center text-[2rem] font-bold"
      >
        {{ state.roundInfo.leftSeconds }}
      </div>
      <div class="flex justify-center p-4">
        <GameButtons
          v-if="state.lobby"
          :clearWinner="clearWinner"
          :roundInfo="state.roundInfo"
          :socket="socket"
          :state="state.lobby"
        />
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
