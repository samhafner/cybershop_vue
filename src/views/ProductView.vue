<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import ProductCard from '../components/ProductCard.vue';
import Searchbar from '../components/Searchbar.vue';
import { Product } from '../interfaces';
import { useProductStore } from '../stores/products.store';
import { useRouter, useRoute } from 'vue-router';
import FilterSidebar from '../components/FilterSidebar.vue';
import FilterMobile from '../components/FilterMobile.vue';

const productStore = useProductStore();
const products = ref<Product[] | undefined>(undefined);
const searchQuery = ref('');
const tagQuery = ref('');
const brandQuery = ref('');
const router = useRouter();
const route = useRoute();
const filterParams = [searchQuery, tagQuery, brandQuery]

const tags = ref<string[]>([]);
const brands = ref<string[]>([]);

onMounted(() => {
    Promise.allSettled([productStore.getTags(), productStore.getBrands()]).then((results) => {
    if (results[0].status === 'fulfilled') {
        if (results[0].value.success) {
            tags.value = productStore.tags;
        }
    }
    if (results[1].status === 'fulfilled') {
        if (results[1].value.success) {
            brands.value = productStore.brands;
        }
    }
});
})

watch(() => route.query, (query) => {
    if (query.q) {
        searchQuery.value = query.q as string;
    } else {
        searchQuery.value = '';
    }
    if (query.tag) {
        tagQuery.value = query.tag as string;
    } else {
        tagQuery.value = '';
    }
    if (query.brand) {
        brandQuery.value = query.brand as string;
    } else {
        brandQuery.value = '';
    }
}, { immediate: true })

watch(filterParams, async () => {
    let params: any = {};
    if (searchQuery.value) {
        params.q = searchQuery.value;
    }
    if (tagQuery.value) {
        params.tag = tagQuery.value;
    }
    if (brandQuery.value) {
        params.brand = brandQuery.value;
    }
    router.push({ query: params })

    products.value = undefined;
    const result = await productStore.getProducts(params);
    if (result.success) {
        products.value = productStore.products;
    }
}, { immediate: true });

function searchDetailsString() {
    let str = `Showing ${products.value?.length} results for `;
    if (searchQuery.value !== '') {
        str += `"${searchQuery.value}"`;
    } else {
        str += '"All products" ';
    }
    if (tagQuery.value && brandQuery.value) {
        str += `with tag "${tagQuery.value}" and brand "${brandQuery.value}"`;
    } 
    if (tagQuery.value && !brandQuery.value) {
        str += `with tag "${tagQuery.value}"`;
    }
    if (!tagQuery.value && brandQuery.value) {
        str += `with brand "${brandQuery.value}"`;
    }
    return str;
}

</script>

<template>
    <div class="section py-6 space-y-4">

        <Searchbar placeholder="Search for products..." @submit:search="(value) => searchQuery = value"
            :search-query="searchQuery" />

        <FilterMobile class="md:hidden" :brands="brands" :tags="tags" :active-brand="brandQuery" :active-tag="tagQuery"
            @brand="(brand) => brandQuery = brand" @tag="(tag) => tagQuery = tag" />

        <div class="flex gap-4">
            <FilterSidebar class="hidden md:block" :brands="brands" :tags="tags" :active-brand="brandQuery"
                :active-tag="tagQuery" @brand="(brand) => brandQuery = brand" @tag="(tag) => tagQuery = tag" />

            <div v-if="products" class="space-y-3">
                <div class="text-sm text-gray-600">{{ searchDetailsString() }}</div>

                <div class="space-y-3">
                    <ProductCard v-for="product in products" :key="product.id" :product="product" />
                </div>

            </div>
        </div>




    </div>

</template>

<style scoped>
.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>
