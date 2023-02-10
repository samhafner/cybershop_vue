<script setup lang="ts">

import Footer from './components/Footer.vue';
import Navbar from './components/Navbar.vue';
import { useUserStore } from './stores/user.store';
import { useStorage } from '@vueuse/core';
import { watchEffect } from 'vue';
import { useCartStore } from './stores/cart.store';

const cartStore = useCartStore();          
const userStore = useUserStore();
const token = useStorage('access-token', '');
watchEffect(() => {
  if (token.value) {
    userStore.access_token = token.value;
    userStore.setAuthHeader();
    userStore.loggedIn = true;
    cartStore.getCart();
  }
})

</script>

<template>
  <header class="sticky top-0 z-10">
    <Navbar />
  </header>
  <main class="min-h-[calc(100vh-40px-36px+1px)]">
    <RouterView />
  </main>
  <footer>
    <Footer />
  </footer>
  
</template>

<style scoped>

</style>
