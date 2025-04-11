import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../views/LoginPage.vue';  // Updated
import RegisterPage from '../views/RegisterPage.vue';  // Updated
import TaskList from '../views/TaskList.vue';  // Updated

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'Login', component: LoginPage },  // Updated
    { path: '/register', name: 'Register', component: RegisterPage },  // Updated
    { path: '/tasks', name: 'Tasks', component: TaskList, meta: { requiresAuth: true } },  // Updated
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    if (to.meta.requiresAuth && !token) {
        next('/login');
    } else {
        next();
    }
});

export default router;