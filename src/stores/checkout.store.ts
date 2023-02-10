import { defineStore, acceptHMRUpdate } from 'pinia'
import { PaymentInfo, ShoppingCart } from '../interfaces'
import { useNetworkRequest } from '../composables/network';
import { AxiosResponse } from 'axios';
import { UserAddress } from '../interfaces';

export const useCheckoutStore = defineStore('checkout', {
    state: () => ({
        deliveryAddress: <UserAddress | null>null,
        billingAddress: <UserAddress | null>null,
        billingSameAsDelivery: true,
        paymentInfo: <PaymentInfo | null>null,
        shippingComlete: false,
        paymentComplete: false,
    }),
    getters: {},
    actions: {
        async processPurchase() {
            const response = await useNetworkRequest({
                url: 'http://localhost:3000/shopping-cart/checkout',
                method: 'POST',
                data: {
                    "name": this.deliveryAddress?.firstName + ' ' + this.deliveryAddress?.lastName,
                    "street": this.deliveryAddress?.street + ' ' + this.deliveryAddress?.streetNo,
                    "plz": this.deliveryAddress?.zip,
                    "city": this.deliveryAddress?.city,
                    "country": this.deliveryAddress?.country,
                    "tel": this.deliveryAddress?.phone,
                  }
            })
            if (!response || !response?.data || response?.status !== 201) return { success: false };
            return { success: true };
        }
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useCheckoutStore, import.meta.hot))
}

