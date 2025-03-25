<script lang="ts" setup>
import { io, Socket } from 'socket.io-client';
import { onBeforeMount, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';

let socket: Socket;

const route = useRoute();
const lobbyId = route.params.lobbyId;

onBeforeMount(() => {
  socket = io('ws://localhost:91/play/', {
    withCredentials: true,
    transports: ['websocket'],
    query: {
      lobbyId,
    },
  });
  socket.on('connect', () => {
    console.log('connected');
  });

  socket.on('disconnect', () => {
    console.log('disconnected');
  });
});

onBeforeUnmount(() => {
  socket.disconnect();
});
</script>

<template></template>
