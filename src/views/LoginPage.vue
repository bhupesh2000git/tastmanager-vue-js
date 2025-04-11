<template>
    <div class="container mt-5">
        <h2>Login</h2>
        <form @submit.prevent="login">
            <div class="mb-3">
                <input v-model="form.email" type="email" class="form-control" placeholder="Email" required />
            </div>
            <div class="mb-3">
                <input v-model="form.password" type="password" class="form-control" placeholder="Password" required />
            </div>
            <button type="submit" class="btn btn-primary">Login</button>
        </form>
        <p class="mt-2">Don't have an account? <router-link to="/register">Register</router-link></p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            form: { email: '', password: '' },
        };
    },
    methods: {
        async login() {
            try {
                await this.$store.dispatch('login', this.form);
                this.$router.push('/tasks');
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Something went wrong. Please try again.';
                alert('Login failed: ' + errorMessage);
            }
        },
    },
};
</script>