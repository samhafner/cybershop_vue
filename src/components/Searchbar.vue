<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
    placeholder: string,
    searchQuery: string
}>()

defineEmits<{
    (e: 'submit:search', query: string): void
}>()

const searchQuery = ref(props.searchQuery)


</script>

<template>

    <div>
        <form @submit.prevent="$emit('submit:search', searchQuery)" class="">
            <label for="product-search" class="sr-only ">Search products</label>
            <div class="relative">
                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg aria-hidden="true" class="w-5 h-5 text-gray-500 hidden sm:block" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                </div>
                <input type="search" id="product-search" v-model.trim="searchQuery"
                    class="block w-full p-4 sm:pl-10 pr-24 text-sm rounded-lg text-gray-900 border border-gray-300 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 "
                    :placeholder="placeholder">
                <button type="submit"
                    class="text-white absolute right-2.5 bottom-2.5 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 transition-colors">Search</button>
            </div>

        </form>
    </div>

</template>

<style scoped>

</style>
