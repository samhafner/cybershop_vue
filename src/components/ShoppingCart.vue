<script setup lang="ts">
import { CartItem } from '../interfaces';
import ShoppingCartItem from './ShoppingCartItem.vue'

defineProps<{
    cart: CartItem[]
}>()

</script>

<template>
    <div v-if="cart" class="flex flex-col">
        <TransitionGroup name="list">
            <ShoppingCartItem v-for="item in cart" :key="item.id" :item="item" />
        </TransitionGroup>
    </div>
</template>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
    transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
    display: none;
}
</style>
