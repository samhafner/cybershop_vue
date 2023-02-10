<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();

console.log(route.name);


</script>

<template>
    <div class="section">
        <div class="flex mt-16 mb-8">
            <div class="flex items-center flex-1 max-w-lg mx-auto">
                <div class="flex flex-col items-center px-4" :class="{ 'text-blue-600 font-bold': $route.name === 'shipping'}">
                    <i class="bi bi-truck text-3xl"></i>
                    <p>Shipping</p>
                </div>
                <div class="flex w-full bg-gray-300 h-0.5" aria-hidden="true"></div>
                <div class="flex flex-col items-center px-4" :class="{ 'text-blue-600 font-bold': $route.name === 'payment'}">
                    <i class="bi bi-credit-card-2-back text-3xl"></i>
                    <p>Payment</p>
                </div>
                <div class="flex w-full bg-gray-300 h-0.5" aria-hidden="true"></div>
                <div class="flex flex-col items-center px-4" :class="{ 'text-blue-600 font-bold': $route.name === 'review'}">
                    <i class="bi bi-search text-3xl"></i>
                    <p>Review</p>
                </div>
            </div>
            
        </div>
        
        <RouterView />
    </div>
        
</template>

<style scoped>

</style>
