<template>
    <div v-if="isLoading" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    isLoading: {
      type: Boolean,
      required: true,
    },
  });
  </script>