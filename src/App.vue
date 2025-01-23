<template>
    <div :class="{'dark': isDark}">
      <div class="bg-white dark:bg-gray-900 min-h-screen">
        <Navbar @toggle-theme="toggleTheme" />
        <router-view />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import Navbar from '@/components/Navbar.vue';
  
  const isDark = ref(false);
  
  const toggleTheme = () => {
    isDark.value = !isDark.value;
  };
  </script>
  
  <style>
  /* Global styles */
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px;
  }
  </style>