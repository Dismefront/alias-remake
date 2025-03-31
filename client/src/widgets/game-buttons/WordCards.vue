<script lang="ts" setup>
import { getCurrentHost } from '@/services/common';
import { useUserStore } from '@/services/userStore';
import type { Lobby, RoundInfo, Word } from '@/types/data';
import type { Socket } from 'socket.io-client';

const { words, state } = defineProps<{
  words: Word[];
  state: {
    lobby: Lobby | null;
    roundInfo: RoundInfo | null;
  };
  socket: Socket;
}>();

const gameGoingCondition = () => {
  return state.roundInfo?.is_round_going ?? false;
};

const showWordCondition = (index: number) => {
  return (
    (gameGoingCondition() &&
      (index !== words.length - 1 ||
        getCurrentHost(state.lobby!)?.user_id === currentUser.user?.user_id)) ||
    !gameGoingCondition()
  );
};

const defineClassnames = (index: number) => {
  const classes = [];
  if (gameGoingCondition() && index === words.length - 1) {
    classes.push('bg-yellow-500');
  } else if (!gameGoingCondition()) {
    classes.push(
      words[index].guessed_approved ? 'bg-green-500' : 'bg-gray-200',
    );
  }
  return classes.join(' ');
};

const currentUser = useUserStore();
</script>

<template>
  <div
    v-for="(word, index) in words"
    :key="`${word.content}${index}`"
    class="p-2 bg-gray-200 rounded-lg shadow h-10 cursor-pointer"
    :class="defineClassnames(index)"
    @click="
      () => {
        if (!gameGoingCondition()) {
          socket.emit('toggle-word-approval', index);
        }
      }
    "
  >
    {{ showWordCondition(index) ? word.content : '' }}
  </div>
</template>
