<script setup lang="ts">
import {
  getUserProfile,
  postChangeUserBlockStatus,
  postLogout,
  postUpdateCategoryType,
  postUpdateWordStatus,
} from '@/services/api';
import { useUserStore } from '@/services/userStore';
import { CategoryType, type UserStore, type WordStore } from '@/types/data';
import { onBeforeMount, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';

const router = useRouter();

const route = useRoute();

const logout = async () => {
  await postLogout();
  router.push('/login');
};

const user = reactive<UserStore>({} as UserStore);
const myUser = useUserStore();
const isAdmin = myUser.user?.role === 'ADMIN';

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

const trimWord = (word: string) => {
  return word.length > 20 ? `${word.slice(0, 20)}...` : word;
};

const userReadableCollectionType = (type: CategoryType) => {
  switch (type) {
    case CategoryType.PUBLIC_PUBLIC:
      return 'Public';
    case CategoryType.LOCAL_LOCAL:
      return 'User visible only';
    case CategoryType.LOCAL_PUBLIC:
      return 'Custom';
  }
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

    <div class="bg-white p-6 rounded-lg shadow-md w-auto h-62 h-100">
      <h2 class="text-xl font-bold mb-4">Word Suggestions</h2>
      <table
        class="w-full border-collapse border border-gray-300 overflow-y-auto block max-h-78"
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
            <td :title="word.content" class="border border-gray-300 px-4 py-2">
              {{ trimWord(word.content) }}
            </td>
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

    <div class="bg-white p-6 rounded-lg shadow-md w-auto h-100">
      <h2 class="text-xl font-bold mb-4">User's Collections</h2>
      <table
        class="w-full border-collapse border border-gray-300 overflow-y-auto block max-h-78"
      >
        <thead>
          <tr class="bg-gray-200">
            <th class="border border-gray-300 px-4 py-2">Name</th>
            <th class="border border-gray-300 px-4 py-2">Approved</th>
            <th class="border border-gray-300 px-4 py-2">Type</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(collection, idx) in user.created_categories"
            :key="collection.category_name + idx"
            class="text-center"
          >
            <td
              :title="collection.category_name"
              class="border border-gray-300 px-4 py-2"
            >
              {{ trimWord(collection.category_name) }}
            </td>
            <td class="border border-gray-300 px-4 py-2">
              {{ collection.is_approved ? 'YES' : 'NO' }}
            </td>
            <td class="border border-gray-300 px-4 py-2 h-14">
              <select
                :value="collection.category_type"
                @change="
                  (event: Event) => {
                    const target = event.target as HTMLSelectElement;
                    const newValue = target.value;
                    target.value = collection.category_type;
                    postUpdateCategoryType(
                      collection.category_id,
                      newValue as CategoryType,
                    )
                      .then(() => {
                        target.value = newValue;
                      })
                      .catch((err) => {
                        toast.error(err.message);
                      });
                  }
                "
                v-if="
                  myUser?.user?.role === 'ADMIN' &&
                  collection.category_type !== CategoryType.LOCAL_LOCAL
                "
                class="w-full p-2 border rounded"
              >
                <option :value="CategoryType.LOCAL_PUBLIC">Custom</option>
                <option :value="CategoryType.PUBLIC_PUBLIC">Public</option>
              </select>
              {{
                myUser?.user?.role !== 'ADMIN' ||
                collection.category_type === CategoryType.LOCAL_LOCAL
                  ? userReadableCollectionType(collection.category_type)
                  : null
              }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- <div class="bg-white p-6 rounded-lg shadow-md w-96">
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
    </div> -->
  </div>
</template>
