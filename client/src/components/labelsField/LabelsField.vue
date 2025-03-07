<script setup lang="ts">
import { ref, reactive, watch } from 'vue';

const { tags } = defineProps<{
  tags: { words: string[]; collections: string[] };
}>();

const inputValue = ref('');

const allTags = reactive([...tags.words, ...tags.collections]);

watch(
  [() => tags.words, () => tags.collections],
  ([newWords, newCollections]) => {
    allTags.splice(0, allTags.length, ...newWords, ...newCollections);
  },
);

const addTag = () => {
  const newTags = inputValue.value
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag && !tags.words.includes(tag));

  if (newTags.length) {
    tags.words = [...tags.words, ...newTags];
  }
  inputValue.value = '';
};

const removeWordTag = (index: number) => {
  tags.words.splice(index, 1);
};

const removeCollectionTag = (index: number) => {
  tags.collections.splice(index, 1);
};
</script>

<template>
  <div
    class="border rounded-lg p-2 flex flex-wrap gap-2 w-full min-h-[40px] items-center"
  >
    <span
      v-for="(tag, index) in tags.words"
      :key="index"
      class="bg-gray-200 text-gray-700 px-2 py-1 rounded-md flex items-center gap-1 cursor-pointer"
      @click="removeWordTag(index)"
    >
      w: {{ tag }}
      <button
        class="text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
      >
        &times;
      </button>
    </span>
    <span
      v-for="(tag, index) in tags.collections"
      :key="index"
      class="bg-gray-200 text-gray-700 px-2 py-1 rounded-md flex items-center gap-1 cursor-pointer"
      @click="removeCollectionTag(index)"
    >
      c: {{ tag }}
      <button
        class="text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
      >
        &times;
      </button>
    </span>
    <input
      v-model="inputValue"
      @keydown.enter.prevent="addTag"
      placeholder="Add a word..."
      class="outline-none flex-1 min-w-[100px] bg-transparent"
    />
  </div>
</template>
