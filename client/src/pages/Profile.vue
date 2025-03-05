<script setup>
import { postLogout } from '@/services/api';
import { useUserStore } from '@/services/userStore';
import { defineProps, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const logout = async () => {
  await postLogout();
  router.push('/login');
};

const { user } = useUserStore();

const gameHistory = reactive([
  { game: 'Chess', result: 'Win', date: '2024-02-15' },
  { game: 'Poker', result: 'Lose', date: '2024-02-16' },
  { game: 'Checkers', result: 'Win', date: '2024-02-17' },
  { game: 'Go', result: 'Draw', date: '2024-02-18' },
]);
</script>

<template>
  <div
    class="flex items-start flex-wrap gap-2 justify-center min-h-screen bg-gray-100 p-6"
  >
    <div class="bg-white p-6 rounded-lg shadow-md w-96">
      <h1 class="text-2xl font-bold mb-4">Profile</h1>
      <p><strong>Username:</strong> {{ user.username }}</p>
      <p><strong>Role:</strong> {{ user.role }}</p>
      <p><strong>Blocked:</strong> {{ user.is_blocked ? 'Yes' : 'No' }}</p>
      <p v-if="user.is_blocked">
        <strong class="text-red-400">Blocked due:</strong>
      </p>
      <p>
        <strong>Created At:</strong>
        {{ new Date(user.created_at).toUTCString() }}
      </p>
      <button
        @click="logout"
        class="w-full bg-red-500 text-white py-2 mt-4 rounded-md cursor-pointer"
      >
        Logout
      </button>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-md w-96">
      <h2 class="text-xl font-bold mb-4">Game History</h2>
      <table class="w-full border-collapse border border-gray-300">
        <thead>
          <tr class="bg-gray-200">
            <th class="border border-gray-300 px-4 py-2">Game</th>
            <th class="border border-gray-300 px-4 py-2">Result</th>
            <th class="border border-gray-300 px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(history, index) in gameHistory"
            :key="index"
            class="text-center"
          >
            <td class="border border-gray-300 px-4 py-2">{{ history.game }}</td>
            <td class="border border-gray-300 px-4 py-2">
              {{ history.result }}
            </td>
            <td class="border border-gray-300 px-4 py-2">{{ history.date }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-md w-96">
      <h2 class="text-xl font-bold mb-4">Game History</h2>
      <table class="w-full border-collapse border border-gray-300">
        <thead>
          <tr class="bg-gray-200">
            <th class="border border-gray-300 px-4 py-2">Game</th>
            <th class="border border-gray-300 px-4 py-2">Result</th>
            <th class="border border-gray-300 px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(history, index) in gameHistory"
            :key="index"
            class="text-center"
          >
            <td class="border border-gray-300 px-4 py-2">{{ history.game }}</td>
            <td class="border border-gray-300 px-4 py-2">
              {{ history.result }}
            </td>
            <td class="border border-gray-300 px-4 py-2">{{ history.date }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-md w-96">
      <h2 class="text-xl font-bold mb-4">Game History</h2>
      <table class="w-full border-collapse border border-gray-300">
        <thead>
          <tr class="bg-gray-200">
            <th class="border border-gray-300 px-4 py-2">Game</th>
            <th class="border border-gray-300 px-4 py-2">Result</th>
            <th class="border border-gray-300 px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(history, index) in gameHistory"
            :key="index"
            class="text-center"
          >
            <td class="border border-gray-300 px-4 py-2">{{ history.game }}</td>
            <td class="border border-gray-300 px-4 py-2">
              {{ history.result }}
            </td>
            <td class="border border-gray-300 px-4 py-2">{{ history.date }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
