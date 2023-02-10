<script setup lang="ts">

import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useProductStore } from '../stores/products.store';
import { Product } from '../interfaces';
import { useCartStore } from '../stores/cart.store';

import Loading from '../components/Loading.vue';

const productStore = useProductStore()
const route = useRoute()
const loading = ref(true)
const id = route.params.id as string
const product = ref<Product | undefined>(undefined)

const cartStore = useCartStore();

getProduct()

function getProduct() {
  productStore.getProductById(id).then((data) => {
    loading.value = false
    product.value = data
  })
}

</script>

<template>

  <div class="section space-y-4 py-4">

    <button @click="$router.go(-1)" class="py-3"><i class="bi bi-chevron-left" aria-hidden="true"></i> Back to
      products</button>

    <div v-if="loading" class="w-fit mx-auto">
      <Loading />
    </div>
    <div v-else>

      <div v-if="!product">Product not found</div>
      <div v-else class="flex">
        <!-- Image for bigger screens -->
        <img :src="product.image" :alt="product.name"
          class="w-[300px] max-h-[500px] object-contain object-top hidden md:block sticky top-0">

        <div class="px-4 flex flex-col gap-4 flex-1">
          <div class="flex flex-wrap gap-1">
            <span v-for="item in [product.brand, ...product.tags]" :key="item"
              class="px-3 py-1 text-white text-xs bg-black rounded-3xl">{{ item }}</span>
          </div>
          <h1 class="text-3xl font-bold two-lines">{{ product.name }}</h1>

          <!-- Image for smaller screens -->
          <div class="max-h-[350px] flex-shrink-0 md:hidden mx-auto">
            <img :src="product.image" :alt="product.name" class="h-full w-full object-cover object-center">
          </div>

          <div class="min-h-40 flex w-full flex-col justify-between space-y-4">
            <div class="flex text-3xl">{{ product.price }} <span class="text-base"> €</span></div>
            <p>{{ product.description }}</p>
            <button @click="cartStore.addToCart(product?.id ?? 0, 1)"
              class="mx-auto md:mx-0 w-fit whitespace-nowrap rounded-xl bg-amber-300 hover:bg-amber-400 transition-colors py-0.5 px-3 text-black">
              Add to Cart
            </button>
          </div>

        </div>

      </div>

    </div>

  </div>


</template>

<style scoped>

</style>
