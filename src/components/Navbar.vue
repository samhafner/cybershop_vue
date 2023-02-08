<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user.store';

const userStore = useUserStore();


</script>

<template>
    <div class="bg-gray-900 text-white">
        <div class="section flex items-center justify-between py-2">
            <nav class="space-x-4">
                <RouterLink to="/" active-class="underline">Home</RouterLink>
                <RouterLink to="/profile" active-class="underline">Profile</RouterLink>
                <RouterLink to="/products" active-class="underline">Products</RouterLink>
            </nav>
            <RouterLink v-if="!userStore.access_token" to="/login" active-class="underline">Login</RouterLink>
            <RouterLink v-else to="/logout" active-class="underline" @click="userStore.logout()">Logout</RouterLink>



        </div>

    </div>

</template>

<style scoped>

</style>
