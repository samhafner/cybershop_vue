<script setup lang="ts">
import { CartItem } from '../interfaces';
import { useCartStore } from '../stores/cart.store';


const props = defineProps<{
    item: CartItem
}>()

const cartStore = useCartStore();

const increaseCount = () => {
    cartStore.addToCart(props.item.id)
}

const decreaseCount = () => {
    if (props.item.count === 1) {
        cartStore.decreaseCount(props.item.id)
    }
    cartStore.decreaseCount(props.item.id)
}

</script>

<template>
    <div class="py-3 px-1.5 border-b border-gray-200">
        <div class="flex gap-3 w-full">
            <img :src="item.image" :alt="item.name" class="h-16 w-16 object-contain flex-shrink-0">
            <div class="flex flex-col gap-3 justify-between w-full">
                <p class="font-bold">{{ item.name }}</p>
                <div class="flex justify-between ">
                    <div
                        class="flex items-center rounded-lg overflow-hidden border border-gray-300 bg-gray-50 h-min shrink-0">
                        <button @click="decreaseCount"
                            class="bg-gray-200 hover:bg-gray-300 transition-colors border-r border-gray-300 px-0.5">
                            <i class="bi bi-dash" aria-hidden="true"></i>
                            <span class="sr-only">Desccrease count</span>
                        </button>
                        <span class="px-2 text-sm">{{ item.count }}</span>
                        <button @click="increaseCount"
                            class="bg-gray-200 hover:bg-gray-300 transition-colors border-l border-gray-300 px-0.5">
                            <i class="bi bi-plus" aria-hidden="true"></i>
                            <span class="sr-only">Increase count</span>
                        </button>
                    </div>

                    <div class="flex gap-4 items-center">
                        <div class="whitespace-nowrap">
                            <span>{{ item.count * item.price }} €</span>
                        </div>
                        <button class="" @click="cartStore.removeFromCart(item.id)">
                            <i class="bi bi-trash3 hover:text-red-700 transition-colors"></i>
                            <span class="sr-only">Remove</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>
