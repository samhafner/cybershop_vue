<script setup lang="ts">
import { useCartStore } from '../stores/cart.store';
import Button from './Button.vue';

const cartStore = useCartStore();


</script>

<template>
    <div class="flex flex-col gap-2">
        <div class="flex justify-between">
            <span>Sum</span>
            <span>{{ cartStore.cartTotal.toFixed(2) }} €</span>
        </div>
        <div class="flex justify-between">
            <span>Delivery</span>
            <span id="cart-shipping-cost">0.00 €</span>
        </div>
        <hr class="border-gray-300">
        <div class="flex justify-between">
            <span>Subotal</span>
            <span>{{ cartStore.cartTotal.toFixed(2) }} €</span>
        </div>
        <div class="flex justify-between">
            <span>VAT</span>
            <span>{{ cartStore.cartTax.toFixed(2) }} €</span>
        </div>
        <hr class="border-gray-300">
        <div class="flex justify-between font-bold">
            <span>Total</span>
            <span>{{ cartStore.cartTotal.toFixed(2) }} €</span>
        </div>

        
            <Button text="Checkout" class="block mx-auto mt-8" />

        </div>

</template>

<style scoped>

</style>
