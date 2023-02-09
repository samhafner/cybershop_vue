<script setup lang="ts">

import { Product } from '../interfaces';
import { useCartStore } from '../stores/cart.store';

const props = defineProps<{
    product: Product
}>()

const cartStore = useCartStore();

</script>

<template>
    <div class="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row shadow-md">
        <RouterLink :to="{ name: 'product', params: { id: product.id } }" class="sm:hidden block">
            <h2 class="text-2xl hover:text-blue-600">{{ product.name }}</h2>
        </RouterLink>
        <RouterLink :to="{ name: 'product', params: { id: product.id } }">
            <img class="h-48 md:h-40 w-48 md:w-40 shrink-0 object-contain mx-auto" :src="product.image"
                :alt="product.name" />
        </RouterLink>
        <div class="min-h-40 flex w-full flex-col justify-between space-y-2">
            <div class="flex w-full items-start">
                <RouterLink :to="{ name: 'product', params: { id: product.id } }" class="hidden sm:block">
                    <h2 class="text-2xl hover:text-blue-600">{{ product.name }}</h2>
                </RouterLink>
                <button @click="cartStore.addToCart(product.id, 1)"
                    class="ml-auto hidden whitespace-nowrap rounded-xl bg-amber-300 hover:bg-amber-400 transition-colors py-0.5 px-3 text-black md:block">
                    Add to Cart
                </button>
            </div>
            <div class="flex text-3xl">{{ product.price }} <span class="text-base"> €</span></div>
            <p>{{ product.description }}</p>
            <button @click="cartStore.addToCart(product.id, 1)"
                class="mx-auto whitespace-nowrap rounded-xl bg-amber-300 hover:bg-amber-400 transition-colors py-0.5 px-3 text-black md:hidden">
                Add to Cart
            </button>
        </div>
    </div>

</template>

<style scoped>

</style>



