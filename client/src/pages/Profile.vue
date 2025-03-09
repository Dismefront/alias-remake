<script setup lang="ts">
import {
  getUserProfile,
  postChangeUserBlockStatus,
  postLogout,
  postUpdateWordStatus,
} from '@/services/api';
import { useUserStore } from '@/services/userStore';
import type { UserStore, WordStore } from '@/types/data';
import { onBeforeMount, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();

const route = useRoute();

const logout = async () => {
  await postLogout();
  router.push('/login');
};

const user = reactive<UserStore>({} as UserStore);
const myUser = useUserStore();
const isAdmin = myUser.user?.role === 'ADMIN';

const gameHistory = reactive([
  { game: 'Chess', result: 'Win', date: '2024-02-15' },
  { game: 'Poker', result: 'Lose', date: '2024-02-16' },
  { game: 'Checkers', result: 'Win', date: '2024-02-17' },
  { game: 'Go', result: 'Draw', date: '2024-02-18' },
]);

onBeforeMount(async () => {
  const userData = await getUserProfile(route.params.username as string);
  Object.assign(user, userData);
});

const changeWordStatus = (word: WordStore, idx: number) => {
  postUpdateWordStatus(word.word_id, !word.is_approved).then(() => {
    user.suggested_words![idx].is_approved = !word.is_approved;
  });
};

const changeUserBlockStatus = (user_id: number, is_blocked: boolean) => {
  postChangeUserBlockStatus(user_id, is_blocked, 'Manually blocked').then(
    () => {
      user.is_blocked = is_blocked;
    },
  );
};
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
      <p>
        <strong>Created At:</strong>
        {{ new Date(user.created_at).toUTCString() }}
      </p>
      <button
        v-if="myUser.user?.username === user.username"
        @click="logout"
        class="w-full bg-red-500 text-white py-2 mt-4 rounded-md cursor-pointer"
      >
        Logout
      </button>
      <button
        v-if="
          myUser.user?.role === 'ADMIN' &&
          user.username !== myUser.user.username &&
          !user.is_blocked
        "
        @click="changeUserBlockStatus(user.user_id, !user.is_blocked)"
        class="w-full bg-red-400 text-white py-2 mt-4 rounded-md cursor-pointer"
      >
        Block user
      </button>
      <button
        v-if="
          myUser.user?.role === 'ADMIN' &&
          user.username !== myUser.user.username &&
          user.is_blocked
        "
        @click="changeUserBlockStatus(user.user_id, !user.is_blocked)"
        class="w-full bg-green-400 text-white py-2 mt-4 rounded-md cursor-pointer"
      >
        Unblock user
      </button>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-md w-96 h-62">
      <h2 class="text-xl font-bold mb-4">Suggestions</h2>
      <table
        class="w-full border-collapse border border-gray-300 overflow-y-auto block max-h-40"
      >
        <thead>
          <tr class="bg-gray-200">
            <th class="border border-gray-300 px-4 py-2">Content</th>
            <th class="border border-gray-300 px-4 py-2">Approved</th>
            <th v-if="isAdmin" class="border border-gray-300 px-4 py-2">
              Admin-actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(word, idx) in user.suggested_words"
            :key="word.content"
            class="text-center"
          >
            <td class="border border-gray-300 px-4 py-2">{{ word.content }}</td>
            <td class="border border-gray-300 px-4 py-2">
              {{ word.is_approved ? 'YES' : 'NO' }}
            </td>
            <td v-if="isAdmin" class="border border-gray-300 px-4 py-2">
              <div
                @click="changeWordStatus(word, idx)"
                :class="word.is_approved ? 'text-red-600' : 'text-blue-600'"
                class="cursor-pointer hover:underline"
              >
                {{ word.is_approved ? 'disapprove' : 'approve' }}
              </div>
            </td>
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
