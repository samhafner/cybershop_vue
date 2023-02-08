import { defineStore, acceptHMRUpdate } from 'pinia'
import { useNetworkRequest } from '../composables/network';
import { FilterParams, Product } from '../interfaces'

export const useProductStore = defineStore('products', {
    state: () => ({
        products: <Product[]>[],
        brands: <string[]>[],
        tags: <string[]>[],
    }),
    getters: {},
    actions: {
        async getTags() {
            const response = await useNetworkRequest({
                url: 'http://localhost:3000/products/tags',
                method: 'GET'
            })
            if (!response || !response?.data || response?.status !== 200) return { success: false };
            this.tags = response.data;
            return { success: true };
        },
        async getBrands() {
            const response = await useNetworkRequest({
                url: 'http://localhost:3000/products/brands',
                method: 'GET',
            })
            if (!response || !response?.data || response?.status !== 200) return { success: false };
            this.brands = response.data;
            return { success: true };
        },
        async getProducts(FilterParams: FilterParams) {

            const query = new URLSearchParams();
            if (FilterParams.brand) query.append('brand', FilterParams.brand);
            if (FilterParams.tag) query.append('tag', FilterParams.tag);
            if (FilterParams.q) query.append('q', FilterParams.q);

            const response = await useNetworkRequest({
                url: 'http://localhost:3000/products',
                method: 'GET',
                params: query
            })
            if (!response || !response?.data || response?.status !== 200) return { success: false };
            this.products = response.data;
            return { success: true };
        },
        async getProductById(id: string): Promise<Product | undefined> {
            const response = await useNetworkRequest({
                url: `http://localhost:3000/products/${id}?delay=1000`,
                method: 'GET'
            })
            if (!response || !response?.data || response?.status !== 200) return undefined;
            return response.data;
        }
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useProductStore, import.meta.hot))
}

