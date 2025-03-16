<script setup lang="ts">
import ModalWindow from '@/components/modal/ModalWindow.vue';
import { getAllCollectionsToSuggest, postSuggestOneWord } from '@/services/api';
import type { CollectionStore } from '@/types/data';
import { onBeforeMount, ref } from 'vue';
import { toast } from 'vue3-toastify';

const emit = defineEmits(['close', 'open', 'submit']);

const collections = ref<CollectionStore[]>([]);
const collectionId = ref<number>(-1);
const wordContent = ref<string>('');

onBeforeMount(() => {
  getAllCollectionsToSuggest().then((data) => {
    collections.value = data;
  });
});

const handleSubmit = () => {
  const validateWordContent = Boolean(wordContent.value);
  const validateCategoryId = collectionId.value >= 0;
  validateWordContent &&
    validateCategoryId &&
    postSuggestOneWord(wordContent.value, collectionId.value)
      .then((data) => {
        toast.success(data.message);
        emit('close');
      })
      .catch((e) => {
        toast.error(e.message);
      });
};
</script>

<template>
  <ModalWindow
    @submit="handleSubmit"
    @close="() => emit('close')"
    title="Suggest a word"
  >
    <div class="grid grid-cols-2 gap-4 mb-4">
      <div>
        <label class="block">Word:</label>
        <input
          v-model="wordContent"
          placeholder="Input here"
          class="w-full p-2 h-10 border rounded"
        />
      </div>

      <div>
        <label class="block">Collection:</label>
        <select v-model="collectionId" class="w-full h-10 p-2 border rounded">
          <option disabled :value="-1">Search & Select</option>
          <option
            v-for="collection in collections"
            :key="collection.category_name"
            :value="collection.category_id"
          >
            {{ collection.category_name }}
          </option>
        </select>
      </div>
    </div>
  </ModalWindow>
</template>
