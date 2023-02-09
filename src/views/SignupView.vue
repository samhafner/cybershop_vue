<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user.store';
import { useDebounceFn } from '@vueuse/core'
import { useVuelidate } from '@vuelidate/core'
import { required, email, sameAs, helpers, minLength, maxLength } from '@vuelidate/validators'
import { AlertType } from '../interfaces'

import Button from '../components/Button.vue';
import InputFieldText from '../components/InputFieldText.vue';
import InputFieldPassword from '../components/InputFieldPassword.vue';
import AlertField from '../components/AlertField.vue';
import PasswordStrength from '../components/PasswordStrength.vue';

const userStore = useUserStore()

const MIN_PASSWORD_LENGTH = 6
const MAX_PASSWORD_LENGTH = 40
const REC_PASSWORD_LENGTH = 10
const passwordHint = `Strong passwords contain more than ${REC_PASSWORD_LENGTH} characters, have numbers and uppercase letters, and contain special characters like !@#$%`

const passwordStrength = ref(0)
const router = useRouter()

const firstName = ref('')
const lastName = ref('')
const password = ref('')
const passwordConfirm = ref('')
const userEmail = ref('')
// Vuelidate rules
const rules = computed(() => ({
    firstName: { required: helpers.withMessage('This field is required', required) },
    lastName: { required: helpers.withMessage('This field is required', required) },
    userEmail: {
        required: helpers.withMessage('This field is required', required),
        email
    },
    password: {
        required: helpers.withMessage('This field is required', required),
        minLength: helpers.withMessage(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`, minLength(MIN_PASSWORD_LENGTH)),
        maxLength: helpers.withMessage(`Password must be less than ${MAX_PASSWORD_LENGTH} characters`, maxLength(MAX_PASSWORD_LENGTH)),
        hasUpper: helpers.withMessage('Password must contain at least one uppercase letter', (value: string) => /[A-Z]/.test(value)),
        hasNumber: helpers.withMessage('Password must contain at least one number', (value: string) => /[0-9]/.test(value)),
        hasSpecialChar: helpers.withMessage('Password must contain at least one special character like !@#$%', (value: string) => (/[^a-zA-Z0-9]/).test(value)), // test if the string contains any characters that are not letters or numbers
    },
    passwordConfirm: {
        required: helpers.withMessage('This field is required', required),
        sameAsPassword: helpers.withMessage('Passwords do not match', sameAs(password)),
    },
}))
const v$ = useVuelidate(rules, { firstName, lastName, userEmail, password, passwordConfirm })

const alertFirstName = ref('')
const alertLastName = ref('')
const alertPassword = ref('')
const alertPasswordConfirm = ref('')
const alertEmail = ref('')
const alertEmailAvailable = ref({
    msg: '',
    type: '' as AlertType
})
const alertSignup = ref('')

// for loading spinner on submit
const loading = ref(false)

// Watchers for instat validation messages
watch(firstName, async () => {
    await v$.value.firstName.$validate()
    if (v$.value.firstName.$error) {
        alertFirstName.value = v$.value.firstName.$errors[0].$message.toString()
    } else {
        alertFirstName.value = ''
    }
})
watch(lastName, async () => {
    await v$.value.lastName.$validate()
    if (v$.value.lastName.$error && v$.value.lastName.$errors[0]) {
        alertLastName.value = v$.value.lastName.$errors[0].$message.toString()
    } else {
        alertLastName.value = ''
    }
})
watch(userEmail, async () => {
    await v$.value.userEmail.$validate()
    if (v$.value.userEmail.$error && v$.value.userEmail.$errors[0]) {
        alertEmail.value = v$.value.userEmail.$errors[0].$message.toString()
    } else {
        alertEmail.value = ''
    }
    // Check if email is available
    if (v$.value.userEmail.email.$invalid === false && v$.value.userEmail.required.$invalid === false) {
        const isAvailable = await isEmailAvailableDebounced(userEmail.value)
        if (isAvailable) {
            alertEmailAvailable.value = {
                msg: 'Email available',
                type: 'success'
            }
        } else if (isAvailable === false) {
            alertEmailAvailable.value = {
                msg: 'This email is already in use',
                type: 'error'
            }
        } else {
            alertEmailAvailable.value = {
                msg: 'Cannot check if email is available',
                type: 'info'
            }
        }
    } else {
        alertEmailAvailable.value = {
            msg: '',
            type: '' as AlertType
        }
    }
})
watch(password, async () => {
    await v$.value.password.$validate()
    if (v$.value.password.$error && v$.value.password.$errors[0]) {
        alertPassword.value = v$.value.password.$errors[0].$message.toString()
    } else {
        alertPassword.value = ''
    }
    // Assess and show password strength
    if (password.value !== '') {
        passwordStrength.value = assessPasswordStrength(password.value)
    }
})
watch(passwordConfirm, async () => {
    await v$.value.passwordConfirm.$validate()
    if (v$.value.passwordConfirm.$error && v$.value.passwordConfirm.$errors[0]) {
        alertPasswordConfirm.value = v$.value.passwordConfirm.$errors[0].$message.toString()
    } else {
        alertPasswordConfirm.value = ''
    }
})

// Debounced function to check if email is available
const isEmailAvailableDebounced = useDebounceFn(isEmailAvailable, 300)
async function isEmailAvailable(email: string) {
    const isAvailable = (await userStore.checkEmail(email)).available
    return isAvailable
}

function assessPasswordStrength(password: string) {

    let strenght = 1

    if (password.length > 8) {
        strenght++

        if ((/[A-Z]/).test(password) && (/[0-9]/).test(password)) {
            strenght++
        }
        // test if there are special characters (here we test if there are any characters that are NOT letters or numbers)
        if ((/[^a-zA-Z0-9]/).test(password)) {
            strenght++
        }

    }
    return strenght
}

async function handleSignup() {
    loading.value = true
    alertSignup.value = ''
    const valid = await v$.value.$validate()

    if (!valid) {
        console.log('Form is not valid');
        alertSignup.value = 'There are errors in the form. Please check the fields.'
        loading.value = false
        return
    }

    const r = await userStore.signup({ firstname: firstName.value, lastname: lastName.value, email: userEmail.value, password: password.value })
    if (r.success === true) {
        alertSignup.value = ''
        sessionStorage.setItem('signup-email', userEmail.value)
        router.push({ name: 'signup-success' })
    } else {
        alertSignup.value = 'Something went wrong. Please try again.'
    }

    loading.value = false
}

</script>

<template>

    <div class="max-w-md mx-auto border border-gray-300 px-6 py-10 rounded-lg my-10 ">

        <h1 class="text-3xl font-bold mb-8">Register</h1>

        <p class="mb-4">Already registered? <RouterLink :to="{ name: 'login' }" class="font-bold text-blue-600">Login
                here.
            </RouterLink>
        </p>

        <form @submit.prevent="handleSignup" class="space-y-4">
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
                <InputFieldText v-model="userEmail" :alertText="alertEmail" label="Email" />
                <Transition name="toggle">
                    <AlertField v-if="alertEmail" :message="alertEmail" type="error" class="text-xs" />
                </Transition>
                <Transition name="toggle">
                    <AlertField v-if="alertEmailAvailable.msg" :message="alertEmailAvailable.msg"
                        :type="alertEmailAvailable.type" class="text-xs" />
                </Transition>
            </div>
            <div>
                <InputFieldPassword v-model="password" :alertText="alertPassword" label="Password" />
                <Transition name="toggle">
                    <AlertField v-if="alertPassword" :message="alertPassword" type="error" class="text-xs" />
                </Transition>
                <Transition name="toggle">
                    <PasswordStrength v-if="passwordStrength > 0 && password !== ''" :strenght="passwordStrength"
                        :password-hint="passwordHint" />
                </Transition>
            </div>
            <div>
                <InputFieldPassword v-model.lazy="passwordConfirm" :alertText="alertPasswordConfirm"
                    label="Repeat password" />
                <Transition name="toggle">
                    <AlertField v-if="alertPasswordConfirm" :message="alertPasswordConfirm" type="error"
                        class="text-xs" />
                </Transition>
            </div>

            <Transition name="toggle">
                <AlertField v-if="alertSignup" :message="alertSignup" type="error" />
            </Transition>

            <Button text="Register" class="w-full" type="submit" :loading="loading" />


        </form>

    </div>

</template>

<style scoped>
.toggle-enter-active {
    transition: opacity 0.5s ease;
}

.toggle-enter-from {
    opacity: 0;
}
</style>
