<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  setup() {
    const message = 'nigga';
    return {
      message,
    };
  },
});
</script>

<template>
  asdfasdf
  <router-view />
</template>
