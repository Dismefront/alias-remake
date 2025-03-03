<script setup>
import router, { ROUTE_NAMES } from '@/router';
import { postLogin, postRegister } from '@/services/api';
import { ref, reactive } from 'vue';

const loginUsername = ref('');
const loginPassword = ref('');
const registerUsername = ref('');
const registerPassword = ref('');
const registerRepeatPassword = ref('');
const loginError = ref(false);
const registerError = reactive({
  username: false,
  password: false,
  repeatPassword: false,
});

const validateLogin = () => {
  loginError.value = !loginUsername.value || !loginPassword.value;
  if (!loginError.value) {
    postLogin(loginUsername.value, loginPassword.value).then(() => {
      router.push(ROUTE_NAMES.HOME);
    });
  }
};

const validateRegister = () => {
  registerError.username = !registerUsername.value;
  registerError.password = !registerPassword.value;
  registerError.repeatPassword =
    !registerRepeatPassword.value ||
    registerPassword.value !== registerRepeatPassword.value;
  if (
    !(
      registerError.username &&
      registerError.password &&
      registerError.repeatPassword
    )
  ) {
    postRegister(registerUsername.value, registerPassword.value).then(() => {
      router.push(ROUTE_NAMES.HOME);
    });
  }
};
</script>

<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gray-100"
  >
    <div class="bg-white p-8 rounded-lg shadow-md w-96">
      <h2 class="text-2xl font-bold mb-4">Login</h2>
      <input
        type="text"
        v-model="loginUsername"
        placeholder="Username"
        class="w-full p-2 border rounded-md mb-2"
        :class="{ 'border-red-500': loginError && !loginUsername }"
      />
      <input
        type="password"
        v-model="loginPassword"
        placeholder="Password"
        class="w-full p-2 border rounded-md mb-2"
        :class="{ 'border-red-500': loginError && !loginPassword }"
      />
      <button
        @click="validateLogin"
        class="w-full bg-blue-500 text-white py-2 rounded-md cursor-pointer"
      >
        Login
      </button>
    </div>

    <div class="bg-white p-8 rounded-lg shadow-md w-96 mt-6">
      <h2 class="text-2xl font-bold mb-4">Register</h2>
      <input
        type="text"
        v-model="registerUsername"
        placeholder="Username"
        class="w-full p-2 border rounded-md mb-2"
        :class="{ 'border-red-500': registerError.username }"
      />
      <input
        type="password"
        v-model="registerPassword"
        placeholder="Password"
        class="w-full p-2 border rounded-md mb-2"
        :class="{ 'border-red-500': registerError.password }"
      />
      <input
        type="password"
        v-model="registerRepeatPassword"
        placeholder="Repeat Password"
        class="w-full p-2 border rounded-md mb-2"
        :class="{ 'border-red-500': registerError.repeatPassword }"
      />
      <button
        @click="validateRegister"
        class="w-full bg-green-500 text-white py-2 rounded-md cursor-pointer"
      >
        Register
      </button>
    </div>
  </div>
</template>

<style scoped>
.border-red-500 {
  border: 1px solid red;
}
</style>
