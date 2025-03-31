<script lang="ts" setup>
import { getCurrentHost } from '@/services/common';
import { useUserStore } from '@/services/userStore';
import type { Lobby, RoundInfo } from '@/types/data';
import type { Socket } from 'socket.io-client';

const currentUser = useUserStore();
const { state, socket, roundInfo, clearWinner } = defineProps<{
  state: Lobby;
  socket: Socket;
  roundInfo: RoundInfo | null;
  clearWinner: () => void;
}>();
</script>

<template>
  <button
    class="px-6 py-2 bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-600 cursor-pointer"
    v-if="
      !state.is_game_going &&
      currentUser.user?.user_id === state?.created_by?.user_id &&
      state?.teams?.length !== 0
    "
    @click="
      () => {
        clearWinner();
        socket.emit('start-game');
      }
    "
  >
    Start Game
  </button>
  <button
    class="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-600 cursor-pointer"
    v-if="
      state.is_game_going &&
      getCurrentHost(state)?.user_id === currentUser.user?.user_id &&
      !(roundInfo?.is_round_going ?? false)
    "
    @click="
      () => {
        socket.emit('start-round');
      }
    "
  >
    Start Round
  </button>
  <button
    class="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-600 cursor-pointer"
    v-if="
      roundInfo &&
      roundInfo.is_round_going &&
      getCurrentHost(state)?.user_id === currentUser.user?.user_id
    "
    @click="
      () => {
        socket.emit('get-word');
      }
    "
  >
    Next Word
  </button>
</template>
