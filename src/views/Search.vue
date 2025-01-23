<template>
    <div>
      <LoadingSpinner :isLoading="isLoading" />
      <ErrorAlert :errorMessage="errorMessage" />
      <div class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4 dark:text-white">Tìm kiếm phim</h1>
        <input
          v-model="keyword"
          @input="search"
          type="text"
          placeholder="Nhập từ khóa..."
          class="w-full p-2 border rounded-lg mb-4 dark:bg-gray-800 dark:text-white"
        />
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div v-for="movie in results" :key="movie._id" class="relative">
            <img :src="movie.poster_url" :alt="movie.name" class="w-full h-64 object-cover rounded-lg" />
            <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg p-4">
              <h2 class="text-white text-lg font-bold">{{ movie.name }}</h2>
              <p class="text-white text-sm">{{ movie.origin_name }}</p>
              <p class="text-white text-sm">{{ movie.year }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import LoadingSpinner from '@/components/LoadingSpinner.vue';
  import ErrorAlert from '@/components/ErrorAlert.vue';
  import { API_BASE_URL, DEFAULT_ERROR_MESSAGE } from '@/constants';
  
  const keyword = ref('');
  const results = ref([]);
  const isLoading = ref(false);
  const errorMessage = ref('');
  
  const search = async () => {
    if (keyword.value.length > 2) {
      isLoading.value = true;
      errorMessage.value = '';
      try {
        const response = await axios.get(`${API_BASE_URL}/v1/api/tim-kiem?keyword=${keyword.value}&limit=10`);
        results.value = response.data.data.items;
      } catch (error) {
        errorMessage.value = DEFAULT_ERROR_MESSAGE;
        console.error('Lỗi khi tải dữ liệu:', error);
      } finally {
        isLoading.value = false;
      }
    }
  };
  </script>