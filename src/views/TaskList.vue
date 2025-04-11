<template>
    <div class="container mt-5">
        <h2>Tasks</h2>
        <button @click="logout" class="btn btn-danger mb-3">Logout</button>
        <form @submit.prevent="editingTask ? editTask() : addTask()" class="mb-3">
            <div class="row">
                <div class="col-md-4">
                    <input v-model="newTask.title" class="form-control" placeholder="Title" required />
                </div>
                <div class="col-md-4">
                    <input v-model="newTask.description" class="form-control" placeholder="Description" />
                </div>
                <div class="col-md-2">
                    <input v-model="newTask.due_date" type="date" class="form-control" />
                </div>
                <div class="col-md-2">
                    <button type="submit" class="btn btn-primary w-100">{{ editingTask ? 'Save' : 'Add Task' }}</button>
                </div>
            </div>
        </form>
        <ul class="list-group">
            <li v-for="task in tasks" :key="task.id" class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <strong>{{ task.title }}</strong> - {{ task.description || 'No description' }} (Due: {{ task.due_date || 'N/A' }})
                    <span :class="task.status === 'completed' ? 'text-success' : 'text-warning'">{{ task.status }}</span>
                </div>
                <div>
                    <button @click="toggleStatus(task)" class="btn btn-sm btn-success me-2">Toggle</button>
                    <button @click="startEdit(task)" class="btn btn-sm btn-warning me-2">Edit</button>
                    <button @click="deleteTask(task.id)" class="btn btn-sm btn-danger">Delete</button>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {
            newTask: { title: '', description: '', due_date: '', status: 'pending' },
            editingTask: null,
        };
    },
    computed: {
        tasks() {
            return this.$store.getters.tasks;
        },
    },
    mounted() {
        this.$store.dispatch('fetchTasks');
    },
    methods: {
        async addTask() {
            try {
                if (!this.newTask.title) {
                    alert('Title is required!');
                    return;
                }
                await this.$store.dispatch('addTask', this.newTask);
                this.newTask = { title: '', description: '', due_date: '', status: 'pending' };
            } catch (error) {
                alert('Failed to add task: ' + (error.response?.data?.message || 'Something went wrong.'));
            }
        },
        async toggleStatus(task) {
            try {
                task.status = task.status === 'pending' ? 'completed' : 'pending';
                await this.$store.dispatch('updateTask', task);
            } catch (error) {
                alert('Failed to toggle status: ' + (error.response?.data?.message || 'Something went wrong.'));
            }
        },
        startEdit(task) {
            this.editingTask = task;
            this.newTask = { ...task };
        },
        async editTask() {
            try {
                if (!this.newTask.title) {
                    alert('Title is required!');
                    return;
                }
                const updatedTask = {
                    id: this.editingTask.id,
                    title: this.newTask.title,
                    description: this.newTask.description || '',
                    due_date: this.newTask.due_date || null,
                    status: this.newTask.status || 'pending',
                };
                console.log('Sending Task for Update:', updatedTask);
                await this.$store.dispatch('updateTask', updatedTask);
                this.newTask = { title: '', description: '', due_date: '', status: 'pending' };
                this.editingTask = null;
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Failed to update task.';
                alert(errorMessage);
            }
        },
        async deleteTask(taskId) {
            try {
                await this.$store.dispatch('deleteTask', taskId);
            } catch (error) {
                alert('Failed to delete task: ' + (error.response?.data?.message || 'Something went wrong.'));
            }
        },
        logout() {
            this.$store.commit('logout');
            this.$router.push('/login');
        },
    },
};
</script>