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
const isOpen = ref(false);
watch(activeBrand, (brand) => {
    emit('brand', brand);
})
watch(activeTag, (tag) => {
    emit('tag', tag);
})

</script>

<template>
    <div>
        <div class="flex gap-2 mb-2">
            <div @click="isOpen = !isOpen" class="flex gap-1">
                <div class="transition-transform w-fit" :class="{ 'rotate-180': isOpen }">
                    <i class="bi bi-chevron-down "></i>
                </div>
                Filters
                <Transition>
                    <span v-if="activeBrand || activeTag" class="font-semibold">(active)</span>
                </Transition>
            </div>
            <Transition>
                <Button v-if="activeBrand || activeTag" text="Reset" @click="activeBrand = ''; activeTag = ''"
                    class="text-xs px-2 py-1" />
            </Transition>
        </div>

        <Transition name="toggleSuddenDissapear">
            <div v-if="isOpen" class="bg-gray-100 p-3 rounded-md">
                <div>
                    <h2 class="font-semibold mb-1 text-sm">Categories</h2>
                    <div class="flex gap-1 flex-wrap">
                        <button v-for="tag in tags" class="w-fit bg-gray-200 px-2 py-1 rounded-2xl text-xs"
                            :class="{ '!bg-blue-600 text-white': tag === activeTag }"
                            @click="activeTag === tag ? activeTag = '' : activeTag = tag">
                            {{ tag }}
                        </button>
                    </div>
                </div>
                <div>
                    <h2 class="font-semibold mb-1 text-sm">Brands</h2>
                    <div class="flex gap-1 flex-wrap">
                        <button v-for="brand in brands" class="w-fit bg-gray-200 px-2 py-1 rounded-2xl text-xs"
                            :class="{ '!bg-blue-600 text-white': brand === activeBrand }"
                            @click="activeBrand === brand ? activeBrand = '' : activeBrand = brand">
                            {{ brand }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>

    </div>

</template>

<style scoped>
.v-enter-active,
.v-leave-active,
.toggleSuddenDissapear-enter-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.toggleSuddenDissapear-enter-from,
.v-leave-to {
    opacity: 0;
}


</style>

