<script setup lang="ts">

const images = [
    '/cute-cat.jpg',
    '/cute-dog.jpg',
    '/cute-dog2.jpg',
    '/cute-fox.jpg',
    '/cute-hamster.jpg',
    '/cute-pig.jpg',
]

const randomImage = images[Math.floor(Math.random() * images.length)]

</script>

<template>
    <div class="relative h-[calc(100vh-40px-36px+1px)] bg-cover bg-center bg-no-repeat" :style="{ backgroundImage: `url(${randomImage})` }">
     
        <div class="p-5 max-w-lg mx-auto">
            <div class=" text-white text-center text-lg md:text-xl bg-black/50 p-6 space-y-2" > 
                <h1 class="text-6xl md:text-8xl font-bold">404</h1>
                <p>I looks like the resource you are looking for does not exist or was moved.</p>
                <p>Enjoy this cute animal instead.</p>
            </div>
        </div>
    </div>
        
</template>

<style scoped>

</style>
