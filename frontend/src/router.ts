import { createRouter, createWebHistory } from 'vue-router';
import TorrentList from './views/torrent-list/TorrentList.vue';
import About from './views/about/About.vue';
import Subscribe from './views/subscribe/Subscribe.vue'; // Import the Subscribe component


const routes = [
    {
        path: '/',
        name: 'torrent-list',
        component: TorrentList
    },
    {
        path: '/about',
        name: 'About',
        component: About
    },
    {
        path: '/subscribe', // Add the route for the Subscribe component
        name: 'Subscribe',
        component: Subscribe
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;