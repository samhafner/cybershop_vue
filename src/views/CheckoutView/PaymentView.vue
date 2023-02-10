<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useCheckoutStore } from '../../stores/checkout.store';
import { useVuelidate } from '@vuelidate/core'
import { required, helpers, numeric, between, not } from '@vuelidate/validators'
import { UserAddress } from '../../interfaces'
import { computed, onMounted, ref, watch } from 'vue';

import Button from '../../components/Button.vue';
import InputFieldText from '../../components/InputFieldText.vue';
import AlertField from '../../components/AlertField.vue';
import { useUserStore } from '../../stores/user.store';


onMounted(async () => {
    if (checkoutStore.paymentInfo) {
        cardHolder.value = checkoutStore.paymentInfo.cardHolder
        cardNumber.value = checkoutStore.paymentInfo.cardNumber
        cardExpiry.value = checkoutStore.paymentInfo.cardExpiry
        cardCvc.value = checkoutStore.paymentInfo.cvv
        billingSameAsDelivery.value = checkoutStore.billingSameAsDelivery
    }
})

const checkoutStore = useCheckoutStore()
const userStore = useUserStore()
const router = useRouter()

const cardHolder = ref('');
const cardNumber = ref('');
const cardExpiry = ref('');
const cardCvc = ref('');
const billingSameAsDelivery = ref(true);
const alertCardHolder = ref('');
const alertCardNumber = ref('');
const alertCardExpiry = ref('');
const alertCardCvc = ref('');

const REQUIRED_MESSAGE = 'This field is required'
// Vuelidate rules
const rules = computed(() => ({
    cardHolder: { required: helpers.withMessage(REQUIRED_MESSAGE, required) },
    cardNumber: { required: helpers.withMessage(REQUIRED_MESSAGE, required) },
    cardExpiry: {
        required: helpers.withMessage(REQUIRED_MESSAGE, required),
        expiryFormat: helpers.withMessage('Invalid expiry date (MM/YY)', isValidExpirationDate)
    },
    cardCvc: {
        required: helpers.withMessage('Required', required),
        hasThreeDigits: helpers.withMessage('Invalid', (value: string) => /^\d{3}$/.test(value)),
        numeric: helpers.withMessage('Invalid', numeric)
    }
}))
const v$ = useVuelidate(rules, { cardHolder, cardNumber, cardExpiry, cardCvc })

// Watchers for instant validation messages
watch([() => v$.value.cardHolder.$error, cardHolder], async () => {
    await v$.value.cardHolder.$validate()
    if (v$.value.cardHolder.$error) {
        alertCardHolder.value = v$.value.cardHolder.$errors[0].$message.toString()
    } else {
        alertCardHolder.value = ''
    }
})
watch([() => v$.value.cardNumber.$error, cardNumber], async () => {
    await v$.value.cardNumber.$validate()
    if (v$.value.cardNumber.$error && v$.value.cardNumber.$errors[0]) {
        alertCardNumber.value = v$.value.cardNumber.$errors[0].$message.toString()
    } else {
        alertCardNumber.value = ''
    }
})

watch([() => v$.value.cardExpiry.$error, cardExpiry], async () => {
    await v$.value.cardExpiry.$validate()
    if (v$.value.cardExpiry.$error && v$.value.cardExpiry.$errors[0]) {
        alertCardExpiry.value = v$.value.cardExpiry.$errors[0].$message.toString()
    } else {
        alertCardExpiry.value = ''
    }
})
watch([() => v$.value.cardCvc.$error, cardCvc], async () => {
    await v$.value.cardCvc.$validate()
    if (v$.value.cardCvc.$error && v$.value.cardCvc.$errors[0]) {
        alertCardCvc.value = v$.value.cardCvc.$errors[0].$message.toString()
    } else {
        alertCardCvc.value = ''
    }
})

function isValidExpirationDate(expirationDate: string) {
    if (!/^\d{2}\/\d{2}$/.test(expirationDate)) {
        return false;
    }    
    let today = new Date();
    let [month, year] = expirationDate.split('/');
    let expMonth = parseInt(month, 10);
    let expYear = parseInt(year, 10) + 2000;

    if (expMonth < 1 || expMonth > 12) {
        return false;
    }

    if (expYear < today.getFullYear() || (expYear === today.getFullYear() && expMonth < today.getMonth() + 1)) {
        return false;
    }

    return true;
}

async function proceedToReview() {

    let valid: boolean = false

    Promise.allSettled([
        v$.value.cardHolder.$validate(),
        v$.value.cardNumber.$validate(),
        v$.value.cardExpiry.$validate(),
        v$.value.cardCvc.$validate(),
    ]).then(async () => {
        valid = await v$.value.$validate()

        if (!valid) {
            console.log('Form is not valid');
            return
        }

        checkoutStore.paymentInfo = {
            cardHolder: cardHolder.value,
            cardNumber: cardNumber.value,
            cardExpiry: cardExpiry.value,
            cvv: cardCvc.value,
        }
        checkoutStore.billingSameAsDelivery = billingSameAsDelivery.value

        router.push({ name: 'review' })
    })


}

</script>

<template>
    <div class="max-w-md mx-auto mb-8">

        <button @click="$router.push({ name: 'shipping'})" class="py-3 mb-4 text-gray-500 hover:text-black transition-colors"><i class="bi bi-chevron-left" aria-hidden="true"></i> Back to shipping</button>

        <h1 class="text-2xl font-bold mb-8">Payment Information</h1>

        <form @submit.prevent="proceedToReview" class="space-y-4">
            <div>
                <InputFieldText v-model="cardHolder" :alertText="alertCardHolder" label="Name on card" />
                <Transition name="toggle">
                    <AlertField v-if="alertCardHolder" :message="alertCardHolder" type="error" class="text-xs" />
                </Transition>
            </div>
            <div>
                <InputFieldText v-model="cardNumber" :alertText="alertCardNumber" label="Card number" />
                <Transition name="toggle">
                    <AlertField v-if="alertCardNumber" :message="alertCardNumber" type="error" class="text-xs" />
                </Transition>
            </div>
            <div class="flex gap-4">
                <div class="flex-1">
                    <InputFieldText v-model="cardExpiry" :alertText="alertCardExpiry" label="Expiry date (MM/YY)" />
                    <Transition name="toggle">
                        <AlertField v-if="alertCardExpiry" :message="alertCardExpiry" type="error" class="text-xs" />
                    </Transition>
                </div>
                <div class="max-w-[110px]">
                    <InputFieldText v-model="cardCvc" :alertText="alertCardCvc" label="Security code" />
                    <Transition name="toggle">
                        <AlertField v-if="alertCardCvc" :message="alertCardCvc" type="error" class="text-xs" />
                    </Transition>
                </div>
            </div>

            <div class="flex items-start mb-6">
                <div class="flex items-center h-5">
                    <input id="billingSameAsDelivery" type="checkbox" value="" v-model="billingSameAsDelivery"
                        class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300">
                </div>
                <label for="billingSameAsDelivery" class="ml-2 text-sm font-medium">Billing address same as shipping
                    address</label>
            </div>


            <Button text="Review your order" class="w-full" type="submit" />
            <p class="italic text-sm text-blue-600 text-center font-semibold">You will not be charged until you confirm
                your order in the last step.</p>

        </form>
    </div>
</template>

<style scoped>

</style>
