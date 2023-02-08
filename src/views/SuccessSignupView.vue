<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import Button from '../components/Button.vue';


const email = ref('')

onBeforeMount(() => {
    email.value = sessionStorage.getItem('signup-email') || ''
})

</script>

<template>

    <div class="max-w-md mx-auto border border-gray-300 px-6 py-10 rounded-lg my-10">

        <h1 class="text-3xl font-bold mb-8"><i class="bi bi-patch-check" aria-hidden="true"></i> You have successfully registered.</h1>

        <div class="space-y-4">
            <p>
                Your username is your email address <span v-if="email" class="font-semibold">{{ email }}</span>. Please
                go to the login page and login with your credentials.
            </p>
            <RouterLink to="/login" class="block">
                <Button text="Login" class="mx-auto" />
            </RouterLink>
        </div>

    </div>

</template>

<style scoped>

</style>
