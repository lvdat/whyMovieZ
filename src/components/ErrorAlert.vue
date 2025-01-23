<template>
    <div v-if="errorMessage" class="fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg">
      {{ errorMessage }}
    </div>
  </template>
  
  <script setup>
  defineProps({
    errorMessage: {
      type: String,
      default: '',
    },
  });
  </script>