import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
    state: {
        token: localStorage.getItem('token') || '',
        user: null,
        tasks: [],
    },
    mutations: {
        setToken(state, token) {
            state.token = token;
            localStorage.setItem('token', token);
        },
        setUser(state, user) {
            state.user = user;
        },
        setTasks(state, tasks) {
            state.tasks = tasks;
        },
        logout(state) {
            state.token = '';
            state.user = null;
            state.tasks = [];
            localStorage.removeItem('token');
        },
    },
    actions: {
        async login({ commit }, credentials) {
            try {
                const response = await axios.post('http://127.0.0.1:8000/api/login', credentials);
                commit('setToken', response.data.token);
                commit('setUser', response.data.user);
            } catch (error) {
                throw error;
            }
        },
        async register({ commit }, userData) {
            try {
                const response = await axios.post('http://127.0.0.1:8000/api/register', userData);
                commit('setToken', response.data.token);
                commit('setUser', response.data.user);
            } catch (error) {
                throw error;
            }
        },
        async fetchTasks({ commit, state }) {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/tasks', {
                    headers: { Authorization: `Bearer ${state.token}` },
                });
                commit('setTasks', response.data);
            } catch (error) {
                throw error;
            }
        },
        async addTask({ state, dispatch }, task) {
            try {
                await axios.post('http://127.0.0.1:8000/api/tasks', task, {
                    headers: { Authorization: `Bearer ${state.token}` },
                });
                dispatch('fetchTasks');
            } catch (error) {
                throw error;
            }
        },
        async updateTask({ state, dispatch }, task) {
            try {
                console.log('Updating Task with Data:', task);
                const response = await axios.put(`http://127.0.0.1:8000/api/tasks/${task.id}`, task, {
                    headers: { Authorization: `Bearer ${state.token}` },
                });
                console.log('Update Response:', response.data);
                dispatch('fetchTasks');
            } catch (error) {
                console.log('Update Error:', error.response?.data || error.message);
                throw error;
            }
        },
        async deleteTask({ state, dispatch }, taskId) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/tasks/${taskId}`, {
                    headers: { Authorization: `Bearer ${state.token}` },
                });
                dispatch('fetchTasks');
            } catch (error) {
                throw error;
            }
        },
    },
    getters: {
        isAuthenticated: state => !!state.token,
        tasks: state => state.tasks,
    },
});