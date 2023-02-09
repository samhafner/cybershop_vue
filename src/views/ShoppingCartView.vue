<script setup lang="ts">
import { useCartStore } from '../stores/cart.store';
import { onBeforeMount, ref } from 'vue';
import { CartItem } from '../interfaces';
import ShoppingCart from '../components/ShoppingCart.vue'
import CartOverview from '../components/CartOverview.vue';

const cartStore = useCartStore();

onBeforeMount(async () => {
    await cartStore.getCart()
})

</script>

<template>

    <div class="section space-y-6 my-10">
        <h1  class="text-3xl font-bold mb-8">Shopping Cart</h1>
        <div class="flex flex-col md:flex-row gap-10">

            <div class="flex-grow">

                <ShoppingCart v-if="cartStore.cart?.items" :cart="cartStore.cart.items" />
            </div>
            <div class="bg-gray-100 p-6 flex flex-col gap-2 md:w-[280px] md:sticky md:top-20">
                <h2 class="font-semibold uppercase mb-6">Overview</h2>
                <CartOverview />
            </div>
        </div>
    </div>



</template>

<style scoped>

</style>
