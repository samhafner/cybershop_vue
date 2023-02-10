<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useCheckoutStore } from '../../stores/checkout.store';
import { useVuelidate } from '@vuelidate/core'
import { required, email, helpers, numeric } from '@vuelidate/validators'
import { UserAddress } from '../../interfaces'
import { computed, onBeforeMount, ref, watch } from 'vue';

import Button from '../../components/Button.vue';
import InputFieldText from '../../components/InputFieldText.vue';
import AlertField from '../../components/AlertField.vue';
import { useUserStore } from '../../stores/user.store';

const checkoutStore = useCheckoutStore()
const userStore = useUserStore()
const router = useRouter()

onBeforeMount(async () => {
    if (checkoutStore.deliveryAddress) {
        firstName.value = checkoutStore.deliveryAddress.firstName
        lastName.value = checkoutStore.deliveryAddress.lastName
        userEmail.value = checkoutStore.deliveryAddress.email
        phone.value = checkoutStore.deliveryAddress.phone
        street.value = checkoutStore.deliveryAddress.street
        streetNo.value = checkoutStore.deliveryAddress.streetNo
        zipCode.value = checkoutStore.deliveryAddress.zip
        city.value = checkoutStore.deliveryAddress.city
        country.value = checkoutStore.deliveryAddress.country
    } else {
        if (!userStore.profile) {
            await userStore.getProfile()
        }
        if (userStore.profile) {
            firstName.value = userStore.profile.firstName
            lastName.value = userStore.profile.lastName
            userEmail.value = userStore.profile.email
        }
    }
})

const firstName = ref('')
const lastName = ref('')
const userEmail = ref('')
const phone = ref('')
const street = ref('')
const streetNo = ref('')
const zipCode = ref('')
const city = ref('')
const country = ref('')


const REQUIRED_MESSAGE = 'This field is required'
// Vuelidate rules
const rules = computed(() => ({
    firstName: { required: helpers.withMessage(REQUIRED_MESSAGE, required) },
    lastName: { required: helpers.withMessage(REQUIRED_MESSAGE, required) },
    userEmail: {
        required: helpers.withMessage(REQUIRED_MESSAGE, required),
        email
    },
    phone: { required: helpers.withMessage(REQUIRED_MESSAGE, required) },
    street: { required: helpers.withMessage(REQUIRED_MESSAGE, required) },
    streetNo: { required: helpers.withMessage(REQUIRED_MESSAGE, required) },
    zipCode: {
        required: helpers.withMessage(REQUIRED_MESSAGE, required),
        numeric: helpers.withMessage('This field must be numeric', numeric)
    },
    city: { required: helpers.withMessage(REQUIRED_MESSAGE, required) },
    country: { required: helpers.withMessage(REQUIRED_MESSAGE, required) }
}))
const v$ = useVuelidate(rules, { firstName, lastName, userEmail, phone, street, streetNo, zipCode, city, country })

const alertFirstName = ref('')
const alertLastName = ref('')
const alertEmail = ref('')
const alertPhone = ref('')
const alertStreet = ref('')
const alertStreetNo = ref('')
const alertZipCode = ref('')
const alertCity = ref('')
const alertCountry = ref('')
const alertShipping = ref('')

const countryFlag = ref('/flags/countries.png')

// Watchers for instant validation messages
watch([() => v$.value.firstName.$error, firstName], async () => {
    await v$.value.firstName.$validate()
    if (v$.value.firstName.$error) {
        alertFirstName.value = v$.value.firstName.$errors[0].$message.toString()
    } else {
        alertFirstName.value = ''
    }
})
watch([() => v$.value.lastName.$error, lastName], async () => {
    await v$.value.lastName.$validate()
    if (v$.value.lastName.$error && v$.value.lastName.$errors[0]) {
        alertLastName.value = v$.value.lastName.$errors[0].$message.toString()
    } else {
        alertLastName.value = ''
    }
})
watch([() => v$.value.userEmail.$error, userEmail], async () => {
    await v$.value.userEmail.$validate()
    if (v$.value.userEmail.$error && v$.value.userEmail.$errors[0]) {
        alertEmail.value = v$.value.userEmail.$errors[0].$message.toString()
    } else {
        alertEmail.value = ''
    }
})
watch([() => v$.value.phone.$error, phone], async () => {
    await v$.value.phone.$validate()
    if (v$.value.phone.$error && v$.value.phone.$errors[0]) {
        alertPhone.value = v$.value.phone.$errors[0].$message.toString()
    } else {
        alertPhone.value = ''
    }
})
watch([() => v$.value.street.$error, street], async () => {
    await v$.value.street.$validate()
    if (v$.value.street.$error && v$.value.street.$errors[0]) {
        alertStreet.value = v$.value.street.$errors[0].$message.toString()
    } else {
        alertStreet.value = ''
    }
})
watch([() => v$.value.streetNo.$error, streetNo], async () => {
    await v$.value.streetNo.$validate()
    if (v$.value.streetNo.$error && v$.value.streetNo.$errors[0]) {
        alertStreetNo.value = v$.value.streetNo.$errors[0].$message.toString()
    } else {
        alertStreetNo.value = ''
    }
})
watch([() => v$.value.zipCode.$error, zipCode], async () => {
    await v$.value.zipCode.$validate()
    if (v$.value.zipCode.$error && v$.value.zipCode.$errors[0]) {
        alertZipCode.value = v$.value.zipCode.$errors[0].$message.toString()
    } else {
        alertZipCode.value = ''
    }
})
watch([() => v$.value.city.$error, city], async () => {
    await v$.value.city.$validate()
    if (v$.value.city.$error && v$.value.city.$errors[0]) {
        alertCity.value = v$.value.city.$errors[0].$message.toString()
    } else {
        alertCity.value = ''
    }
})
watch([() => v$.value.country.$error, country], async () => {
    await v$.value.country.$validate()
    if (v$.value.country.$error && v$.value.country.$errors[0]) {
        alertCountry.value = v$.value.country.$errors[0].$message.toString()
    } else {
        alertCountry.value = ''
    }
    switch (country.value) {
        case 'DE':
            countryFlag.value = '/flags/germany.png'
            break
        case 'AT':
            countryFlag.value = '/flags/austria.png'
            break
        case 'FR':
            countryFlag.value = '/flags/france.png'
            break
        default:
            countryFlag.value = '/flags/countries.png'
            break
    }
})

async function processToPayment() {
    alertShipping.value = ''
    let valid: boolean = false

    Promise.allSettled([
        v$.value.firstName.$validate(),
        v$.value.lastName.$validate(),
        v$.value.userEmail.$validate(),
        v$.value.phone.$validate(),
        v$.value.street.$validate(),
        v$.value.streetNo.$validate(),
        v$.value.zipCode.$validate(),
        v$.value.city.$validate(),
        v$.value.country.$validate()
    ]).then(async () => {
        valid = await v$.value.$validate()

        if (!valid) {
            console.log('Form is not valid');
            alertShipping.value = 'There are errors in the form. Please check the fields.'
            return
        }

        const shippingData: UserAddress = {
            firstName: firstName.value,
            lastName: lastName.value,
            email: userEmail.value,
            phone: phone.value,
            street: street.value,
            streetNo: streetNo.value,
            zip: zipCode.value,
            city: city.value,
            country: country.value
        }

        checkoutStore.deliveryAddress = shippingData
        router.push({ name: 'payment' })
    })


}

</script>

<template>

    <div class="max-w-md mx-auto mb-8">

        <button @click="$router.push({ name: 'shopping-cart'})" class="py-3 mb-4 text-gray-500 hover:text-black transition-colors"><i class="bi bi-chevron-left" aria-hidden="true"></i> Back to shopping cart</button>


        <h1 class="text-2xl font-bold mb-8">Shipping Information</h1>

        <form @submit.prevent="processToPayment" class="space-y-4">
            <div>
                <InputFieldText v-model="firstName" :alertText="alertFirstName" label="First name" />
                <Transition name="toggle">
                    <AlertField v-if="alertFirstName" :message="alertFirstName" type="error" class="text-xs" />
                </Transition>
            </div>
            <div>
                <InputFieldText v-model="lastName" :alertText="alertLastName" label="Last name" />
                <Transition name="toggle">
                    <AlertField v-if="alertLastName" :message="alertLastName" type="error" class="text-xs" />
                </Transition>
            </div>
            <div>
                <InputFieldText v-model="street" :alertText="alertStreet" label="Street" />
                <Transition name="toggle">
                    <AlertField v-if="alertStreet" :message="alertStreet" type="error" class="text-xs" />
                </Transition>
            </div>
            <div>
                <InputFieldText v-model="streetNo" :alertText="alertStreetNo" label="Street No." />
                <Transition name="toggle">
                    <AlertField v-if="alertStreetNo" :message="alertStreetNo" type="error" class="text-xs" />
                </Transition>
            </div>
            <div>
                <InputFieldText v-model="zipCode" :alertText="alertZipCode" label="Zip Code" />
                <Transition name="toggle">
                    <AlertField v-if="alertZipCode" :message="alertZipCode" type="error" class="text-xs" />
                </Transition>
            </div>
            <div>
                <InputFieldText v-model="city" :alertText="alertCity" label="City" />
                <Transition name="toggle">
                    <AlertField v-if="alertCity" :message="alertCity" type="error" class="text-xs" />
                </Transition>
            </div>
            <div>
                <label for="countries" class="sr-only">Select a country</label>
                <div class="flex items-center gap-2">
                    <img :src="countryFlag" alt="Country flag" class="h-6">
                    <select id="countries" v-model="country"
                        :class="{ 'border-red-600 text-red-600': alertCountry, 'border-gray-300': !alertCountry }"
                        class="bg-gray-50 border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                        <option disabled value="">Choose a country</option>
                        <option value="AT">Austria</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                    </select>
                </div>
                <Transition name="toggle">
                    <AlertField v-if="alertCountry" :message="alertCountry" type="error" class="text-xs" />
                </Transition>
            </div>


            <div>
                <InputFieldText v-model="userEmail" :alertText="alertEmail" label="Email" />
                <Transition name="toggle">
                    <AlertField v-if="alertEmail" :message="alertEmail" type="error" class="text-xs" />
                </Transition>
            </div>
            <div>
                <InputFieldText v-model="phone" :alertText="alertPhone" label="Phone" />
                <Transition name="toggle">
                    <AlertField v-if="alertPhone" :message="alertPhone" type="error" class="text-xs" />
                </Transition>
            </div>


            <Transition name="toggle">
                <AlertField v-if="alertShipping" :message="alertShipping" type="error" />
            </Transition>

            <Button text="Proceed to Payment" class="w-full" type="submit" />

        </form>
    </div>

</template>

<style scoped>

</style>
