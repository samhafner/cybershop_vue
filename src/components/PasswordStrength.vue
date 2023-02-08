<script setup lang="ts">import { computed, ref } from 'vue';


const props = defineProps<{
    strenght: number,
    passwordHint?: string,
}>()

const strength = computed(() => {
    if (props.strenght === 1) {
        return 'Very weak'
    } else if (props.strenght === 2) {
        return 'Weak'
    } else if (props.strenght === 3) {
        return 'Medium'
    } else {
        return 'Strong'
    }
})

const colorsBars = computed(() => {

    return {
        '[&>*:nth-child(1)]:bg-red-600': props.strenght === 1,
        '[&>*:nth-child(1)]:bg-orange-300': props.strenght === 2 || props.strenght === 3,
        '[&>*:nth-child(1)]:bg-green-500': props.strenght === 4,
        '[&>*:nth-child(2)]:bg-orange-300': props.strenght === 2 || props.strenght === 3,
        '[&>*:nth-child(2)]:bg-green-500': props.strenght === 4,
        '[&>*:nth-child(3)]:bg-orange-300': props.strenght === 3,
        '[&>*:nth-child(3)]:bg-green-500': props.strenght === 4,
        '[&>*:nth-child(4)]:bg-green-500': props.strenght === 4,
    }
})

const colorsAssessment = computed(() => {
    return {
        'text-red-600': props.strenght === 1,
        'text-orange-300': props.strenght === 2 || props.strenght === 3,
        'text-green-500': props.strenght === 4,
    }
})

</script>

<template>
    <div class="space-y-1">
        <p class="text-sm" :class="colorsAssessment">Password strength: {{ strength }}</p>
        <div class="grid grid-cols-4 gap-2" :class="colorsBars">
            <div class="h-1 bg-gray-200"></div>
            <div class="h-1 bg-gray-200"></div>
            <div class="h-1 bg-gray-200"></div>
            <div class="h-1 bg-gray-200"></div>
        </div>
        <div v-if="props.strenght < 4 && props.passwordHint">
            <p class="text-xs text-gray-450"> {{  props.passwordHint }}</p>
        </div>
    </div>

</template>

<style scoped>

</style>
