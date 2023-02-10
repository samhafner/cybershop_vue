<script setup lang="ts">
import { useUserStore } from '../stores/user.store';
import { useCartStore } from '../stores/cart.store';

const userStore = useUserStore();
const cartStore = useCartStore();

</script>

<template>
    <div class="bg-gray-900 text-white">
        <div class="section flex items-center justify-between py-4">
            <nav class="space-x-4">
                <RouterLink to="/" active-class="underline">Home</RouterLink>

                <RouterLink to="/products" active-class="underline">Products</RouterLink>
            </nav>
            <div class="flex gap-4 pr-4 md:pl-0 items-center">
                <RouterLink v-if="!userStore.access_token" to="/login" active-class="underline">Login</RouterLink>
                <RouterLink v-else to="/logout" active-class="underline" @click="userStore.logout()">Logout</RouterLink>
                <RouterLink v-if="userStore.isLoggedIn" to="/profile" active-class="underline">
                    <i class="bi bi-person-fill text-xl"></i>
                    <span class="sr-only">Profil</span>
                </RouterLink>

                <RouterLink v-if="userStore.isLoggedIn" :to="{ name: 'shopping-cart'}">
                    <div class="relative">
                        <i class="bi bi-cart3 text-xl"></i>
                        <span id="cart-count"
                            class="absolute inline-flex items-center justify-center w-5 h-5 text-xs text-white bg-black border border-white rounded-full -top-2 -right-3 ">
                            <span>{{ cartStore.cartCount }}</span>
                        </span>
                    </div>
                    <span class="sr-only">Shopping cart</span>
                </RouterLink>
            </div>


        </div>

    </div>

</template>

<style scoped>

</style>
