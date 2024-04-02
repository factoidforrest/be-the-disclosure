import { RouteLocationNormalized, createRouter, createWebHistory } from 'vue-router';
import TorrentList from './views/torrent-list/TorrentList.vue';
import About from './views/about/About.vue';
import Subscribe from './views/subscribe/Subscribe.vue';
import Upload from './views/upload/Upload.vue'; // Import the Upload component


const routes = [
    {
        path: '/',
        name: 'torrent-list',
        component: TorrentList,
        props: (route: RouteLocationNormalized) => ({
            search: route.query.search,
            tag: route.query.tag
        })
    },
    {
        path: '/about',
        name: 'About',
        component: About
    },
    {
        path: '/subscribe',
        name: 'Subscribe',
        component: Subscribe
    },
    {
        path: '/upload', // Add the route for the Upload component
        name: 'Upload',
        component: Upload
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;