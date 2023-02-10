<script setup lang="ts">
import { useCheckoutStore } from '../../stores/checkout.store';
import { useCartStore } from '../../stores/cart.store';
import ShoppingCart from '../../components/ShoppingCart.vue'
import Button from '../../components/Button.vue'
import { useRouter } from 'vue-router';
import AlertField from '../../components/AlertField.vue';
import { ref } from 'vue';

const router = useRouter();

const checkoutStore = useCheckoutStore();
const cartStore = useCartStore();
const alertPurchase = ref('');

async function processPurchase() {
    const success = await checkoutStore.processPurchase();
    if (success) {
        router.push({ name: 'checkout-success' })
        cartStore.getCart();
    } else {
        alertPurchase.value = 'Something went wrong. Please try again later.'
    }
}

</script>

<template>
    <div class="max-w-md mx-auto mb-8">
        <button @click="$router.push({ name: 'payment' })"
            class="py-3 mb-4 text-gray-500 hover:text-black transition-colors"><i class="bi bi-chevron-left"
                aria-hidden="true"></i> Back to payment</button>
        <h1 class="text-2xl font-bold mb-8">Checkout Review</h1>

        <div class="space-y-4">
            <div class="space-y-1">
                <h2 class="text-lg font-semibold uppercase">Shipping</h2>
                <div>
                    <p>{{ checkoutStore.deliveryAddress?.firstName }} {{ checkoutStore.deliveryAddress?.lastName }}</p>
                    <p>{{ checkoutStore.deliveryAddress?.email }}</p>
                    <p>{{ checkoutStore.deliveryAddress?.phone }}</p>
                    <p>{{ checkoutStore.deliveryAddress?.street }} {{ checkoutStore.deliveryAddress?.streetNo }}</p>
                    <p>{{ checkoutStore.deliveryAddress?.zip }} {{ checkoutStore.deliveryAddress?.city }}</p>
                    <p>{{ checkoutStore.deliveryAddress?.country }}</p>
                </div>

            </div>

            <div class="space-y-1">
                <h2 class="text-lg font-semibold uppercase">Order</h2>
                <div class="bg-gray-50 !mb-8">
                    <ShoppingCart v-if="cartStore.cart?.items" :cart="cartStore.cart.items" />
                </div>
                <div>
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
                        <div class="flex justify-between font-bold text-xl text-blue-600">
                            <span>Total</span>
                            <span>{{ cartStore.cartTotal.toFixed(2) }} €</span>
                        </div>
                    </div>
                </div>
                <Button text="Purchase" @click="processPurchase" class="block mx-auto !mt-8"/>
                <AlertField v-if="alertPurchase" :message="alertPurchase"  type="error"/>
            </div>


        </div>
    </div>


</template>

<style scoped>

</style>
