<template>
    <nav class="bg-blue-500 p-4">
      <div class="container mx-auto flex justify-between items-center">
        <router-link to="/" class="text-white text-xl font-bold">Trang chủ</router-link>
        <div>
          <router-link to="/tim-kiem" class="text-white text-xl font-bold mr-4">Tìm kiếm</router-link>
          <router-link to="/ai-chat" class="text-white text-xl font-bold mr-4">AI Chat</router-link>
          <button @click="toggleTheme" class="text-white text-xl font-bold">
            {{ isDark ? '🌞' : '🌙' }}
          </button>
        </div>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const isDark = ref(false);
  
  const toggleTheme = () => {
    isDark.value = !isDark.value;
    emit('toggle-theme');
  };
  
  const emit = defineEmits(['toggle-theme']);
  </script>