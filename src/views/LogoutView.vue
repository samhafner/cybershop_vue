<script setup lang="ts">

import Button from '../components/Button.vue';

</script>

<template>
    <div class="section space-y-4 my-24">
        <p class="text-2xl font-semibold text-center">You have been logged out</p>
        <Button text="Go to Login" @click="$router.push('/login')" class="block mx-auto" />

    </div>
    

</template>

<style scoped>

</style>
