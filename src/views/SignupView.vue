<script setup lang="ts">
import { ref, watch } from 'vue';
import Button from '../components/Button.vue';
import InputFieldText from '../components/InputFieldText.vue';
import InputFieldPassword from '../components/InputFieldPassword.vue';
import AlertField from '../components/AlertField.vue';
import { validate } from 'email-validator';
import { useUserStore } from '../stores/user.store';
import { useDebounceFn } from '@vueuse/core'
import PasswordStrength from '../components/PasswordStrength.vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const passwordStrength = ref(0)
const userStore = useUserStore()

const firstName = ref('')
const lastName = ref('')
const password = ref('')
const passwordRepeat = ref('')
const email = ref('')
const fields = [firstName, lastName, password, passwordRepeat, email]

const alertFirstName = ref('')
const alertLastName = ref('')
const alertPassword = ref('')
const alertPasswordRepeat = ref('')
const alertEmail = ref('')
const alerts = [alertFirstName, alertLastName, alertPassword, alertPasswordRepeat, alertEmail]
const alertSignup = ref('')

const loading = ref(false)

const MIN_PASSWORD_LENGTH = 6
const MAX_PASSWORD_LENGTH = 40
const REC_PASSWORD_LENGTH = 10

const passwordHint = `Strong passwords contain more than ${REC_PASSWORD_LENGTH} characters, have numbers and uppercase letters, and contain special characters.`


watch(email, async (newEmail) => {
    if (validate(newEmail)) {
        alertEmail.value = ''
        useDebounceisEmailAvailable(newEmail)
    } else {
        alertEmail.value = 'Invalid email'
    }
})

const useDebounceisEmailAvailable = useDebounceFn(isEmailAvailable, 500)
async function isEmailAvailable(email: string) {
    const isAvailable = (await userStore.checkEmail(email)).available
    if (isAvailable === false) {
        alertEmail.value = 'Email is already in use'
        return false
    } else {
        return true
    }
}

watch(fields, () => {
    for (let i = 0; i < fields.length; i++) {
        if (fields[i].value !== '' && alerts[i].value === 'This field is required') {
            alerts[i].value = ''
            console.log(fields[i].value, alerts[i].value);
        }
    }
})

async function formValidation() {
    let isValid = true;

    for (let i = 0; i < fields.length; i++) {
        if (fields[i].value === '') {
            alerts[i].value = 'This field is required';
            isValid = false;
        }
    }

    if (password.value !== passwordRepeat.value) {
        console.log(password.value, passwordRepeat.value, 'passwords do not match');
        alertPasswordRepeat.value = 'Passwords do not match'
        isValid = false
    } else {
        alertPasswordRepeat.value = ''
    }

    if (!await isEmailAvailable(email.value)) {
        alertEmail.value = 'Email is already in use'
        isValid = false
    }

    if (checkPassword(password.value) === false) {
        console.log('password is not valid');
        
        isValid = false
    }

    return isValid
}

watch(password, () => {
    if (password.value !== '') {
        checkPassword(password.value)
        passwordStrength.value = assessPasswordStrength(password.value)
    } else {
        alertPassword.value = ''
    }
})

function checkPassword(password: string) {
    let requirementsMet = true
    if (password.length < MIN_PASSWORD_LENGTH) {
        alertPassword.value = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
        requirementsMet = false
    } else if (password.length > MAX_PASSWORD_LENGTH) {
        alertPassword.value = `Password must be less than ${MAX_PASSWORD_LENGTH} characters`
        requirementsMet = false
    } else if (!(/[A-Z]/).test(password)) {
        alertPassword.value = 'Password must contain at least one uppercase letter'
        requirementsMet = false
    } else if (!(/[0-9]/).test(password)) {
        alertPassword.value = 'Password must contain at least one number'
        requirementsMet = false
    } else if (!(/[^a-zA-Z0-9]/).test(password)) {
        alertPassword.value = 'Password must contain at least one special character like !@#$%'
        requirementsMet = false
    } else {
        alertPassword.value = ''
    }

    return requirementsMet
}

function assessPasswordStrength(password: string) {

    let strenght = 1

    if (password.length > 8) {
        strenght++

        if ((/[A-Z]/).test(password) && (/[0-9]/).test(password)) {
            strenght++
        }

        // test if there are special characters (i.e. not letters or numbers)
        if ((/[^a-zA-Z0-9]/).test(password)) {
            strenght++
        }

    }
    return strenght
}

async function handleSignup() {
    if (await formValidation() === true) {
        loading.value = true
        const r = await userStore.signup({ firstname: firstName.value, lastname: lastName.value, email: email.value, password: password.value })
        if (r.success === true) {
            alertSignup.value = ''
            loading.value = false
            sessionStorage.setItem('signup-email', email.value)
            router.push({ name: 'signup-success'})
        } else {
            alertSignup.value = 'Something went wrong. Please try again.'
            loading.value = false
        }
    } else {
        console.log('form is not valid');
    }
}

</script>

<template>

    <div class="max-w-md mx-auto border border-gray-300 px-6 py-10 rounded-lg my-10 ">

        <h1 class="text-3xl font-bold mb-8">Register</h1>

        <p class="mb-4">Already registered? <RouterLink to="/login" class="font-bold text-blue-600">Login here.
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
                <InputFieldText v-model="email" :alertText="alertEmail" label="Email" />
                <Transition name="toggle">
                    <AlertField v-if="alertEmail" :message="alertEmail" type="error" class="text-xs" />
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
                <InputFieldPassword v-model.lazy="passwordRepeat" :alertText="alertPasswordRepeat"
                    label="Repeat password" />
                <Transition name="toggle">
                    <AlertField v-if="alertPasswordRepeat" :message="alertPasswordRepeat" type="error"
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
