<script setup lang="ts">
import { ref } from 'vue';

const lobbyName = ref('');
const password = ref('');
const isPrivate = ref(false);
const roundTime = ref(30);
const goalPoints = ref(null);
const maxRounds = ref(null);
const categories = ref('');
const categoryOptions = ['category 1', 'category 2', 'category 3'];

const errors = ref({
  lobbyName: '',
  goalPoints: '',
  maxRounds: '',
});

const validateForm = () => {
  errors.value.lobbyName = lobbyName.value ? '' : 'Lobby name is required';
  errors.value.goalPoints = goalPoints.value ? '' : 'This is a required field';
  errors.value.maxRounds = maxRounds.value ? '' : 'This is a required field';

  return (
    !errors.value.lobbyName &&
    !errors.value.goalPoints &&
    !errors.value.maxRounds
  );
};

const createLobby = () => {
  if (validateForm()) {
    console.log('Lobby created with:', {
      lobbyName: lobbyName.value,
      password: password.value,
      isPrivate: isPrivate.value,
      roundTime: roundTime.value,
      goalPoints: goalPoints.value,
      maxRounds: maxRounds.value,
      categories: categories.value,
    });
  }
};
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
          min="30"
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
              goalPoints = e.target.value < 0 ? 0 : e.target.value;
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
              maxRounds = e.target.value < 0 ? 0 : e.target.value;
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
          <option disabled value="">Select a category</option>
          <option
            v-for="category in categoryOptions"
            :key="category"
            :value="category"
          >
            {{ category }}
          </option>
        </select>
      </div>

      <button
        @click="createLobby"
        class="w-full bg-blue-500 text-white py-2 rounded-md"
      >
        Create Lobby
      </button>
    </div>
  </div>
</template>
