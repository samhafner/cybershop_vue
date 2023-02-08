<script setup lang="ts">
import { ref, watch } from 'vue';
import Button from './Button.vue';

const props = defineProps<{
    activeTag: string;
    activeBrand: string;
    tags: string[];
    brands: string[];
}>()

const emit = defineEmits<{
    (event: 'tag', tag: string): void;
    (event: 'brand', brand: string): void;
}>()

const activeTag = ref(props.activeTag)
const activeBrand = ref(props.activeBrand)

watch(activeBrand, (brand) => {
    emit('brand', brand);
})
watch(activeTag, (tag) => {
    emit('tag', tag);
})

const isTrue = ref(false);

</script>

<template>
    <aside class="h-fit rounded-lg border px-6 py-4 space-y-3 w-[200px] shrink-0">
        <div class="flex gap-2 items-center">
            <h2 class="font-bold text-lg">Filter</h2>
            <Button v-if="activeBrand || activeTag" text="Reset" @click="activeBrand = ''; activeTag = ''"
                class="text-xs px-2 py-1" />
        </div>
        <div>
            <h2 class="font-semibold mb-1">Categories</h2>
            <div class="flex flex-col pl-2 space-y-1.5 text-sm">
                <button v-for="tag in tags" class="w-fit text-left hover:text-blue-600 leading-none"
                    :class="{ 'text-blue-600 font-bold': tag === activeTag }"
                    @click="activeTag === tag ? activeTag = '' : activeTag = tag">
                    {{ tag }}
                </button>
            </div>
        </div>
        <div>
            <h2 class="font-semibold mb-1">Brands</h2>
            <div class="flex flex-col pl-2 space-y-1.5 text-sm">
                <button v-for="brand in brands" class="w-fit text-left hover:text-blue-600 leading-none"
                    :class="{ 'text-blue-600 font-bold': brand === activeBrand }"
                    @click="activeBrand === brand ? activeBrand = '' : activeBrand = brand">
                    {{ brand }}
                </button>
            </div>
        </div>
    </aside>

</template>

<style scoped>

</style>
