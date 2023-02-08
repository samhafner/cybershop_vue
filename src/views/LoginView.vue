<script setup lang="ts">import { computed, ref, watch } from 'vue';
import AlertField from '../components/AlertField.vue';
import { useUserStore } from '../stores/user.store';
import { useRouter } from 'vue-router';
import Button from '../components/Button.vue';
import InputFieldText from '../components/InputFieldText.vue';
import InputFieldPassword from '../components/InputFieldPassword.vue';

const router = useRouter()
const username = ref('')
const password = ref('')
const alertPassword = ref('')
const alertUsername = ref('')
const alertLogin = ref('')
const passwordVisibility = ref(false)
const passwordInputMode = computed(() => {
    if (passwordVisibility.value) {
        return 'text'
    } else {
        return 'password'
    }
})
const rememberMe = ref(false)
const userStore = useUserStore()
const loading = ref(false)

function changeVisibility() {
    passwordVisibility.value = !passwordVisibility.value;
}

async function handleLogin() {
    formValidation()

    if (!formValidation()) {
        return
    }

    loading.value = true

    const loginResult = await userStore.login(username.value, password.value, rememberMe.value);

    loading.value = false

    if (loginResult.success) {
        router.push('/profile')
    }

    if (!loginResult.success) {

        if (loginResult.status === 401) {
            alertLogin.value = 'Invalid username or password'
        } else if (loginResult.status === 500) {
            alertLogin.value = 'Couldn\'t login: Server error'
        } else {
            alertLogin.value = 'Couldn\'t login: Unknown error'
        }
    }
}

function formValidation() {
    let isValid = true
    if (username.value === '') {
        alertUsername.value = 'This field is required'
        isValid = false
    } else {
        alertUsername.value = ''
    }
    if (password.value === '') {
        alertPassword.value = 'This field is required'
        isValid = false
    } else {
        alertPassword.value = ''
    }

    return isValid
}

</script>

<template>

    <div class="max-w-md mx-auto border border-gray-300 px-6 py-10 rounded-lg my-10">

        <h1 class="text-3xl font-bold mb-8">Login</h1>

        <p class="mb-4">New here? <RouterLink to="/signup" class="font-bold text-blue-600">Register now.</RouterLink></p>

        <form @submit.prevent="handleLogin" class="space-y-4">
            <div>
                <InputFieldText v-model="username" :alertText="alertUsername" label="Username" />
                <Transition name="toggle">
                    <AlertField v-if="alertUsername" :message="alertUsername" type="error" class="text-xs" />
                </Transition>
            </div>
            <div>
                <InputFieldPassword v-model="password" :alertText="alertPassword" label="Password" />
                <Transition name="toggle">
                    <AlertField v-if="alertPassword" :message="alertPassword" type="error" class="text-xs" />
                </Transition>
            </div>

            <div class="flex items-start mb-6">
                <div class="flex items-center h-5">
                    <input id="remember" type="checkbox" value="" v-model="rememberMe"
                        class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300">
                </div>
                <label for="remember" class="ml-2 text-sm font-medium">Remember me</label>
            </div>

            <Transition name="toggle">
                <AlertField v-if="alertLogin" :message="alertLogin" type="error" />
            </Transition>

            <Button text="Login" class="w-full" type="submit" :loading="loading" />


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
