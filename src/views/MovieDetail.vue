<template>
    <div>
      <LoadingSpinner :isLoading="isLoading" />
      <ErrorAlert :errorMessage="errorMessage" />
      <div class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">{{ movie.name }}</h1>
        <div class="flex flex-col md:flex-row">
          <img :src="movie.poster_url" :alt="movie.name" class="w-full md:w-1/3 h-auto rounded-lg" />
          <div class="md:ml-4 mt-4 md:mt-0">
            <p class="text-lg">{{ movie.content }}</p>
            <p class="text-sm">Năm: {{ movie.year }}</p>
            <!-- <p class="text-sm">Thể loại: {{ movie.category.map(c => c.name).join(', ') || "None" }}</p>
            <p class="text-sm">Quốc gia: {{ movie.country.map(c => c.name).join(', ') || "None" }}</p> -->
          </div>
        </div>
        <div class="mt-8">
          <h2 class="text-xl font-bold mb-4">Danh sách tập</h2>
          <div v-for="server in episodes" :key="server.server_name">
            <h3 class="text-lg font-semibold">{{ server.server_name }}</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div v-for="episode in server.server_data" :key="episode.slug" class="p-2 border rounded-lg">
                <router-link :to="`/xem-phim/${movie.slug}/${episode.slug}`" class="text-blue-500">{{ episode.name }}</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import axios from 'axios';
  import LoadingSpinner from '@/components/LoadingSpinner.vue';
  import ErrorAlert from '@/components/ErrorAlert.vue';
  import { API_BASE_URL, DEFAULT_ERROR_MESSAGE } from '@/constants';
  
  const route = useRoute();
  const movie = ref({});
  const episodes = ref([]);
  const isLoading = ref(true);
  const errorMessage = ref('');
  
  onMounted(async () => {
    isLoading.value = true;
    errorMessage.value = '';
    try {
      const response = await axios.get(`${API_BASE_URL}/phim/${route.params.slug}`);
      console.log(response)
      movie.value = response.data.movie;
      episodes.value = response.data.episodes;
    } catch (error) {
      errorMessage.value = DEFAULT_ERROR_MESSAGE;
      console.error('Lỗi khi tải dữ liệu:', error);
    } finally {
      isLoading.value = false;
    }
  });
  </script>