<script setup lang="ts">
import ModalWindow from '@/components/modal/ModalWindow.vue';
import router, { ROUTE_NAMES } from '@/router';
import { onMounted, ref } from 'vue';

const emit = defineEmits(['close', 'open', 'submit']);

const lobbyId = ref('');
const inputRef = ref<HTMLInputElement>();

onMounted(() => {
  inputRef.value?.focus();
});

const handleSubmit = () => {
  if (!lobbyId.value) {
    return;
  }
  router.push({
    name: ROUTE_NAMES.JOIN_LOBBY,
    params: { lobbyId: lobbyId.value },
  });
};
</script>

<template>
  <ModalWindow
    @submit="handleSubmit"
    @close="() => emit('close')"
    title="Join lobby"
  >
    <div>
      <label class="block">Lobby id:</label>
      <input
        ref="inputRef"
        v-model="lobbyId"
        placeholder="Input here"
        @keyup.enter="handleSubmit"
        class="w-full p-2 h-10 border rounded"
      />
    </div>
  </ModalWindow>
</template>
