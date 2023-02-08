<script setup lang="ts">
import LoadingSpinner from './LoadingSpinner.vue';


defineProps<{
    text: string,
    loading?: boolean
}>()

</script>

<template>

    <button type="button"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 transition-colors flex gap-2 justify-center">
        <LoadingSpinner v-if="loading"/>
        {{ text }}
    </button>

</template>

<style scoped>

</style>
