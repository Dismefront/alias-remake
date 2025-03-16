<script setup lang="ts">
import ModalWindow from '@/components/modal/ModalWindow.vue';

const emit = defineEmits(['close', 'open']);
</script>

<template>
  <ModalWindow @close="() => emit('close')" title="Suggest a word">
    <div class="grid grid-cols-2 gap-4 mb-4">
      <div>
        <label class="block">Word:</label>
        <input
          placeholder="Input here"
          class="w-full p-2 h-10 border rounded"
        />
      </div>

      <div>
        <label class="block">Collection:</label>
        <select value="" class="w-full h-10 p-2 border rounded">
          <option disabled value="">Search & Select</option>
        </select>
      </div>
    </div>
  </ModalWindow>
</template>
