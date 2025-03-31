<script setup lang="ts">
import { ROUTE_NAMES } from '@/router';
import { getAllCollectionsToSuggest, postCreateLobby } from '@/services/api';
import { type GetAllCollectionsRes } from '@/services/interfaces';
import { onBeforeMount, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const lobbyName = ref('');
const password = ref('');
const isPrivate = ref(false);
const roundTime = ref(7);
const goalPoints = ref(1);
const maxRounds = ref(1);
const categories = ref(-1);
const categoryOptions = reactive<GetAllCollectionsRes>([]);

const router = useRouter();

const errors = ref({
  lobbyName: '',
  goalPoints: '',
  maxRounds: '',
  collection: '',
});

const validateForm = () => {
  errors.value.lobbyName = lobbyName.value ? '' : 'Lobby name is required';
  errors.value.goalPoints =
    goalPoints.value && goalPoints.value > 0
      ? ''
      : 'This is a required field and must be above 0';
  errors.value.maxRounds =
    maxRounds.value && maxRounds.value > 0
      ? ''
      : 'This is a required field and must be above 0';
  errors.value.collection =
    categories.value >= 0 ? '' : 'Please choose a collection';

  return (
    !errors.value.lobbyName &&
    !errors.value.goalPoints &&
    !errors.value.maxRounds &&
    !errors.value.collection
  );
};

const createLobby = () => {
  if (validateForm()) {
    postCreateLobby({
      lobby_name: lobbyName.value,
      password: password.value,
      is_private: isPrivate.value,
      round_time: roundTime.value,
      goal_points: goalPoints.value,
      max_rounds: maxRounds.value,
      categoryIds: [categories.value],
    }).then((data) => {
      router.push({
        name: ROUTE_NAMES.JOIN_LOBBY,
        params: { lobbyId: data.lobby_uuid },
      });
    });
  }
};

onBeforeMount(() => {
  getAllCollectionsToSuggest().then((data) => {
    Object.assign(categoryOptions, data);
  });
});
</script>

<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6"
  >
    <div class="bg-white p-6 rounded-lg shadow-md w-96">
      <h1 class="text-2xl font-bold mb-4">Create a Lobby</h1>

      <div class="mb-4">
        <label class="block">Lobby Name:</label>
        <input v-model="lobbyName" class="w-full p-2 border rounded" />
        <p v-if="errors.lobbyName" class="text-red-500 text-sm">
          {{ errors.lobbyName }}
        </p>
      </div>

      <div class="mb-4">
        <label class="block">Password:</label>
        <input
          v-model="password"
          type="text"
          class="w-full p-2 border rounded"
        />
      </div>

      <div class="mb-4">
        <label class="flex items-center">
          <input v-model="isPrivate" type="checkbox" class="mr-2" /> Private
          Lobby
        </label>
      </div>

      <div class="mb-4">
        <label class="block">Round Time:</label>
        <input
          v-model="roundTime"
          type="range"
          min="7"
          max="120"
          step="30"
          class="w-full"
        />
        <p>{{ roundTime }}s</p>
      </div>

      <div class="mb-4">
        <label class="block">Goal Points:</label>
        <input
          v-model.number="goalPoints"
          type="number"
          class="w-full p-2 border rounded"
          @change="
            (e: any) => {
              goalPoints = e.target.value < 1 ? 1 : e.target.value;
            }
          "
        />
        <p v-if="errors.goalPoints" class="text-red-500 text-sm">
          {{ errors.goalPoints }}
        </p>
      </div>

      <div class="mb-4">
        <label class="block">Max Rounds:</label>
        <input
          v-model.number="maxRounds"
          type="number"
          class="w-full p-2 border rounded"
          @change="
            (e: any) => {
              maxRounds = e.target.value < 1 ? 1 : e.target.value;
            }
          "
        />
        <p v-if="errors.maxRounds" class="text-red-500 text-sm">
          {{ errors.maxRounds }}
        </p>
      </div>

      <div class="mb-4">
        <label class="block">Collection:</label>
        <select v-model="categories" class="w-full p-2 border rounded">
          <option disabled value="">Select a collection</option>
          <option
            v-for="category in categoryOptions"
            :key="category.category_name"
            :value="category.category_id"
          >
            {{ category.category_name }}
          </option>
        </select>
        <p v-if="errors.collection" class="text-red-500 text-sm">
          {{ errors.collection }}
        </p>
      </div>

      <button
        @click="createLobby"
        class="w-full bg-blue-500 text-white py-2 rounded-md cursor-pointer"
      >
        Create Lobby
      </button>
    </div>
  </div>
</template>
