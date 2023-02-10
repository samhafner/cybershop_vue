import { defineStore, acceptHMRUpdate } from 'pinia'
import { ShoppingCart } from '../interfaces'
import { useNetworkRequest } from '../composables/network';
import { AxiosResponse } from 'axios';

export const useCartStore = defineStore('cart', {
    state: () => ({
        cart: <ShoppingCart | null>null,
        cartTotal: 0,
        cartCount: 0,
        cartTax: 0
    }),
    getters: {},
    actions: {
        async getCart() {
            const response: AxiosResponse<ShoppingCart> = await useNetworkRequest({
                url: 'http://localhost:3000/shopping-cart',
                method: 'GET'
            })
            if (!response || !response?.data || response?.status !== 200) return { success: false };
            this.cart = response.data;
            this.cartTotal = response.data.total;
            this.cartCount = response.data.distinctItems;
            this.cartTax = response.data.tax;
            return { success: true };

        },
        async addToCart(id: number, count: number = 1) {
            const response = await useNetworkRequest({
                url: 'http://localhost:3000/shopping-cart/add',
                method: 'POST',
                data: {
                    id,
                    count
                }
            })

            if (!response || !response?.data || response?.status !== 201) return { success: false };
            this.cartCount = response.data.distinctItems
            return { success: true };
        },
        async removeFromCart(id: number) {
            const response = await useNetworkRequest({
                url: 'http://localhost:3000/shopping-cart/' + id,
                method: 'DELETE',
            })

            if (!response || !response?.data || response?.status !== 200) return { success: false };
            this.getCart();
            return { success: true };
        },
        async decreaseCount(id: number, count: number = 1) {
            // count represent the amount of items remove
            const response = await useNetworkRequest({
                url: 'http://localhost:3000/shopping-cart/remove',
                method: 'POST',
                data: {
                    id,
                    count
                }
            })

            if (!response || !response?.data || response?.status !== 201) return { success: false };
            this.getCart();
            return { success: true };
        },

    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useCartStore, import.meta.hot))
}

