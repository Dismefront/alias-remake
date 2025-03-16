<script setup lang="ts">
import { defineEmits } from 'vue';

const props = defineProps<{ title: string }>();
const emit = defineEmits(['close', 'submit']);
</script>

<template>
  <div
    @click="() => emit('close')"
    class="fixed inset-1 bg-gray-400/50 flex items-center justify-center"
  >
    <div
      @click="(e) => e.stopPropagation()"
      class="bg-white p-6 rounded-lg shadow-lg w-96"
    >
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">{{ props.title }}</h2>
        <button
          @click="emit('close')"
          class="text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          &times;
        </button>
      </div>
      <div class="mb-4">
        <slot></slot>
      </div>
      <div class="flex justify-between gap-2">
        <button
          @click="emit('close')"
          class="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer"
        >
          Close
        </button>
        <button
          @click="emit('submit')"
          class="bg-green-500 text-white px-4 py-2 rounded-md cursor-pointer"
        >
          Apply
        </button>
      </div>
    </div>
  </div>
</template>
