<template>
    <div>
      <LoadingSpinner :isLoading="isLoading" />
      <ErrorAlert :errorMessage="errorMessage" />
      <div class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">{{ movie.name }} - {{ currentEpisode.name }}</h1>
        <div class="flex flex-col md:flex-row">
          <div class="w-full md:w-2/3">
            <iframe :src="currentEpisode.link_embed" class="w-full h-96" frameborder="0" allowfullscreen></iframe>
          </div>
          <div class="w-full md:w-1/3 mt-4 md:mt-0 md:ml-4">
            <h2 class="text-xl font-bold mb-4">Danh sách tập</h2>
            <div v-for="server in episodes" :key="server.server_name">
              <h3 class="text-lg font-semibold">{{ server.server_name }}</h3>
              <div class="grid grid-cols-1 gap-2">
                <button
                  v-for="episode in server.server_data"
                  :key="episode.slug"
                  @click="changeEpisode(episode)"
                  class="p-2 border rounded-lg text-left"
                  :class="{ 'bg-blue-500 text-white': episode.slug === currentEpisode.slug }"
                >
                  {{ episode.name }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import axios from 'axios';
  import LoadingSpinner from '@/components/LoadingSpinner.vue';
  import ErrorAlert from '@/components/ErrorAlert.vue';
  import { API_BASE_URL, DEFAULT_ERROR_MESSAGE } from '@/constants';
  
  const route = useRoute();
  const router = useRouter();
  const movie = ref({});
  const episodes = ref([]);
  const currentEpisode = ref({});
  const isLoading = ref(true);
  const errorMessage = ref('');
  
  const fetchMovie = async () => {
    isLoading.value = true;
    errorMessage.value = '';
    try {
      const response = await axios.get(`${API_BASE_URL}/phim/${route.params.movieSlug}`);
      movie.value = response.data.movie;
      episodes.value = response.data.episodes;
      const episode = episodes.value
        .flatMap(server => server.server_data)
        .find(ep => ep.slug === route.params.episodeSlug);
      if (episode) {
        currentEpisode.value = episode;
      } else {
        router.push({ name: 'MovieDetail', params: { slug: route.params.movieSlug } });
      }
    } catch (error) {
      errorMessage.value = DEFAULT_ERROR_MESSAGE;
      console.error('Lỗi khi tải dữ liệu:', error);
    } finally {
      isLoading.value = false;
    }
  };
  
  const changeEpisode = (episode) => {
    currentEpisode.value = episode;
    router.push({ name: 'WatchMovie', params: { movieSlug: route.params.movieSlug, episodeSlug: episode.slug } });
  };
  
  onMounted(() => {
    fetchMovie();
  });
  </script>