import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import MovieDetail from '@/views/MovieDetail.vue';
import WatchMovie from '@/views/WatchMovie.vue';
import Search from '@/views/Search.vue';
import AIChat from '@/views/AIChat.vue'; // Import trang AI Chat

const routes = [
    { path: '/', component: Home },
    { path: '/phim/:slug', component: MovieDetail, name: 'MovieDetail' },
    { path: '/xem-phim/:movieSlug/:episodeSlug', component: WatchMovie, name: 'WatchMovie' },
    { path: '/tim-kiem', component: Search, name: 'Search' },
    { path: '/ai-chat', component: AIChat, name: 'AIChat' }, // Thêm route AI Chat
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;