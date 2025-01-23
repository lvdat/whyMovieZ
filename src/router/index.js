import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import MovieDetail from '@/views/MovieDetail.vue';
import WatchMovie from '@/views/WatchMovie.vue';
import Search from '@/views/Search.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/phim/:slug', component: MovieDetail, name: 'MovieDetail' },
    { path: '/xem-phim/:movieSlug/:episodeSlug', component: WatchMovie, name: 'WatchMovie' },
    { path: '/tim-kiem', component: Search, name: 'Search' },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;