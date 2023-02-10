<script setup lang="ts">
import Button from '../components/Button.vue'

</script>

<template>
    <div class="max-w-md mx-auto border border-gray-300 px-6 py-10 rounded-lg my-10">

        <h1 class="text-3xl font-bold mb-8 flex flex-col text-center">
            <i class="bi bi-patch-check" aria-hidden="true"></i>
            <span>Thank you for your purchase</span>

        </h1>

        <div class="space-y-4">
            <p>
                Your order has been successfully placed. You will receive an email confirmation shortly.
            </p>
            <RouterLink :to="{ name: 'products'}" class="block">
                <Button text="Discover more products" class="mx-auto" />
            </RouterLink>
        </div>

    </div>
</template>

<style scoped>

</style>
