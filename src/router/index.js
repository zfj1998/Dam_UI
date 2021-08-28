import { createRouter, createWebHashHistory } from "vue-router";
import MainPage from "../components/MainPage.vue";
import From from "../components/Form.vue";
import Tree from "../components/Tree.vue";

const routes = [
    {
        path: '/',
        redirect: '/main'
    },
    { 
        path: '/main',
        name: 'MainPage',
        component: MainPage
    },
    {
        path: '/form',
        name: 'Form',
        component: From
    },
    {
        path: '/tree',
        name: 'Tree',
        component: Tree
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
});

export default router