<script setup lang="ts">import { computed, ref } from 'vue';


const props = defineProps<{
    modelValue: string,
    alertText?: string,
    label: string
}>()

const emit = defineEmits(['update:modelValue'])

const value = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value)
    }
})
const passwordVisibility = ref(false)
const passwordInputMode = computed(() => {
    if (passwordVisibility.value) {
        return 'text'
    } else {
        return 'password'
    }
})
function changeVisibility() {
    passwordVisibility.value = !passwordVisibility.value;
}
const id = ref(Array.from({ length: 9 }, () => Math.random().toString(36)[2]).join(""))

</script>

<template>
    <div class="relative">
        <input :type="passwordInputMode" :id="id" v-model="value"
            class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer transition-colors"
            placeholder=" " :class="{ 'border-red-600': alertText, 'border-gray-300': !alertText }" />
        <label :for="id"
            class="absolute text-sm  duration-300 transform -translate-y-4 scale-90 top-2 z-10 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-4 left-1 transition-all"
            :class="{ 'text-red-600': alertText, 'text-gray-500': !alertText }">
            {{ label }}
        </label>
        <button type="button" class="absolute right-2 top-0 translate-y-1/2" @click="changeVisibility">
            <i class="bi" :class="{ 'bi-eye-fill': !passwordVisibility, 'bi-eye-slash-fill': passwordVisibility }"></i>
        </button>
    </div>
</template>

<style scoped>

</style>
