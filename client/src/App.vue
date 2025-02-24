<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: "App",
    setup() {
        const message = "nigga";
        return {
            message
        }
    },
});
</script>

<template>
  <h1>{{ message }}</h1>
</template>
