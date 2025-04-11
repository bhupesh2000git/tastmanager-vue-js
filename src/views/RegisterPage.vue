<template>
    <div class="container mt-5">
        <h2>Register</h2>
        <form @submit.prevent="register">
            <div class="mb-3">
                <input v-model="form.name" type="text" class="form-control" placeholder="Name" required />
            </div>
            <div class="mb-3">
                <input v-model="form.email" type="email" class="form-control" placeholder="Email" required />
            </div>
            <div class="mb-3">
                <input v-model="form.password" type="password" class="form-control" placeholder="Password" required />
            </div>
            <button type="submit" class="btn btn-primary">Register</button>
        </form>
        <p class="mt-2">Already have an account? <router-link to="/login">Login</router-link></p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            form: { name: '', email: '', password: '' },
        };
    },
    methods: {
        async register() {
            try {
                await this.$store.dispatch('register', this.form);
                this.$router.push('/tasks');
            } catch (error) {
                alert('Registration failed: ' + error.response.data.message);
            }
        },
    },
};
</script>