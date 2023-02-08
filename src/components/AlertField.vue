<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    message: string,
    type: 'info' | 'success' | 'warning' | 'error'
}>()


const color = computed(() => {
    switch (props.type) {
        case 'info':
            return 'text-blue-600';
        case 'success':
            return 'text-green-500';
        case 'warning':
            return ' text-yellow-500';
        case 'error':
            return 'text-red-600';
    }
})

</script>

<template>
    <div class="flex p-1 rounded-lg space-x-2" :class="color" role="alert">
        <i class="bi bi-info-circle-fill"></i>
        <span class="sr-only">{{ type }}</span>
        <div>
            {{ message }}
        </div>
    </div>

</template>

<style scoped>

</style>
