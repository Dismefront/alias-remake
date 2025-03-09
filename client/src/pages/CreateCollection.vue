<script setup lang="ts">
import { onBeforeMount, reactive, ref } from 'vue';
import LabelsField from '@/components/labelsField/LabelsField.vue';
import { getAllCollections, postCreateCollection } from '@/services/api';
import type { CreateCategoryReq } from '@/services/interfaces';
import router, { ROUTE_NAMES } from '@/router';
import { toast } from 'vue3-toastify';

const collectionName = ref('');
const collectionType = ref('');
const includeWord = ref('');
const includeCollection = ref('');

const collectionTypeOptions: { option: string; value: string }[] = [
  {
    option: 'Visible to all players',
    value: 'local_public',
  },
  {
    option: 'Visible to me only',
    value: 'local_local',
  },
];
const availableCollections = ref<string[]>([]);
onBeforeMount(async () => {
  availableCollections.value = (await getAllCollections()).map(
    (collection) => collection.category_name,
  );
});

const errors = ref({
  collectionName: '',
  collectionType: '',
  collectionEmpty: '',
});

const tags = reactive<{ words: string[]; collections: string[] }>({
  words: [],
  collections: [],
});

const validateForm = () => {
  errors.value.collectionName = collectionName.value
    ? ''
    : 'Collection name is required';
  errors.value.collectionType = collectionType.value
    ? ''
    : 'Collection type is required';
  errors.value.collectionEmpty =
    tags.collections.length || tags.words.length
      ? ''
      : 'You must add at least 1 element to the collection';
  return (
    !errors.value.collectionName &&
    !errors.value.collectionType &&
    !errors.value.collectionEmpty
  );
};

const createCollection = () => {
  if (validateForm()) {
    const bodyData: CreateCategoryReq = {
      collectionName: collectionName.value,
      collectionType: collectionType.value,
      includeWords: tags.words,
      includeCategories: tags.collections,
    };
    postCreateCollection(bodyData)
      .then((data) => {
        router.push({ name: ROUTE_NAMES.HOME }).then(() => {
          data.message && toast.success(data.message);
        });
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }
};

const addWord = (value: string) => {
  if (!tags.words.includes(value) && value.trim()) {
    tags.words.push(value.trim());
    includeWord.value = '';
  }
};

const addCollection = (value: string) => {
  if (!tags.collections.includes(value) && value.trim()) {
    tags.collections.push(value.trim());
    includeCollection.value = '';
  }
};
</script>

<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6"
  >
    <div class="bg-white p-6 rounded-lg shadow-md w-96">
      <h1 class="text-2xl font-bold mb-4">Create a Collection</h1>

      <div class="mb-4">
        <label class="block">Collection Name:</label>
        <input v-model="collectionName" class="w-full p-2 border rounded" />
        <p v-if="errors.collectionName" class="text-red-500 text-sm">
          {{ errors.collectionName }}
        </p>
      </div>

      <div class="mb-4">
        <label class="block">Collection Type:</label>
        <select v-model="collectionType" class="w-full p-2 border rounded">
          <option disabled value="">Collection Type</option>
          <option
            v-for="type in collectionTypeOptions"
            :key="type.value"
            :value="type.value"
          >
            {{ type.option }}
          </option>
        </select>
        <p v-if="errors.collectionType" class="text-red-500 text-sm">
          {{ errors.collectionType }}
        </p>
      </div>

      <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block">Include Word:</label>
          <input
            @keydown.enter="addWord(includeWord)"
            v-model="includeWord"
            class="w-full p-2 h-10 border rounded"
          />
          <button
            @click="addWord(includeWord)"
            class="w-full bg-blue-500 text-white py-2 rounded-md cursor-pointer mt-1"
          >
            Include word
          </button>
        </div>

        <div>
          <label class="block">Include Collection:</label>
          <select
            @keydown.enter="addCollection(includeCollection)"
            v-model="includeCollection"
            class="w-full h-10 p-2 border rounded"
          >
            <option disabled value="">Search & Select</option>
            <option
              v-for="collection in availableCollections"
              :key="collection"
              :value="collection"
            >
              {{ collection }}
            </option>
          </select>
          <button
            @click="addCollection(includeCollection)"
            class="w-full bg-blue-500 text-white py-2 rounded-md cursor-pointer mt-1"
          >
            Include collection
          </button>
        </div>
      </div>

      <LabelsField :tags="tags" />
      <p v-if="errors.collectionEmpty" class="text-red-500 text-sm">
        {{ errors.collectionEmpty }}
      </p>

      <button
        @click="createCollection"
        class="w-full bg-blue-500 text-white py-2 rounded-md cursor-pointer mt-1"
      >
        Create Collection
      </button>
    </div>
  </div>
</template>
