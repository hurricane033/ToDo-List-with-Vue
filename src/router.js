import { createRouter, createWebHistory } from "vue-router";
import Register from "./pages/Register.vue";
import Login from "./pages/Login.vue";
import ToDo from "./pages/ToDo.vue";
import Home from "./pages/Home.vue";

const routes = [
    {path : '/login', name:'Login', component: Login},
    {path: '/register', name: 'Register', component: Register},
    {path:'/todo', name: 'ToDo', component: ToDo},
    {path:'/', name: 'Home', component: Home},
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;