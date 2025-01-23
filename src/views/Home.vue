<template>
    <div>
      <LoadingSpinner :isLoading="isLoading" />
      <ErrorAlert :errorMessage="errorMessage" />
      <div class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4 dark:text-white">Phim mới cập nhật</h1>
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <router-link
            v-for="movie in movies"
            :key="movie._id"
            :to="`/phim/${movie.slug}`"
            class="relative"
          >
            <img :src="movie.poster_url" :alt="movie.name" class="w-full h-64 object-cover rounded-lg" />
            <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg p-4">
              <h2 class="text-white text-lg font-bold">{{ movie.name }}</h2>
              <p class="text-white text-sm">{{ movie.origin_name }}</p>
              <p class="text-white text-sm">{{ movie.year }}</p>
            </div>
          </router-link>
        </div>
        <div class="flex justify-center mt-8">
          <button @click="prevPage" :disabled="currentPage === 1" class="px-4 py-2 bg-blue-500 text-white rounded-lg mr-2">Trang trước</button>
          <button @click="nextPage" :disabled="currentPage === totalPages" class="px-4 py-2 bg-blue-500 text-white rounded-lg">Trang sau</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import LoadingSpinner from '@/components/LoadingSpinner.vue';
  import ErrorAlert from '@/components/ErrorAlert.vue';
  import { API_BASE_URL, DEFAULT_ERROR_MESSAGE } from '@/constants';
  
  const movies = ref([]);
  const currentPage = ref(1);
  const totalPages = ref(1);
  const isLoading = ref(true);
  const errorMessage = ref('');
  const cachedMovies = ref({});
  
  const fetchMovies = async (page) => {
    if (cachedMovies.value[page]) {
      movies.value = cachedMovies.value[page];
      return;
    }
  
    isLoading.value = true;
    errorMessage.value = '';
    try {
      const response = await axios.get(`${API_BASE_URL}/danh-sach/phim-moi-cap-nhat?page=${page}`);
      handleResponse(response);
    } catch (error) {
      handleError(error);
    } finally {
      isLoading.value = false;
    }
  };
  
  const handleResponse = (response) => {
    movies.value = response.data.items;
    totalPages.value = response.data.pagination.totalPages;
    cachedMovies.value[currentPage.value] = movies.value;
  };
  
  const handleError = (error) => {
    errorMessage.value = DEFAULT_ERROR_MESSAGE;
    console.error('Lỗi khi tải dữ liệu:', error);
  };
  
  onMounted(() => {
    fetchMovies(currentPage.value);
  });
  
  const nextPage = () => {
    currentPage.value += 1;
    fetchMovies(currentPage.value);
  };
  
  const prevPage = () => {
    currentPage.value -= 1;
    fetchMovies(currentPage.value);
  };
  </script>