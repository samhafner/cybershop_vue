<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useUserStore } from '../stores/user.store';
import { useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

import Button from '../components/Button.vue';
import AlertField from '../components/AlertField.vue';
import InputFieldText from '../components/InputFieldText.vue';
import InputFieldPassword from '../components/InputFieldPassword.vue';

const router = useRouter()

const rememberMe = ref(false)
const userStore = useUserStore()
const loading = ref(false)

const username = ref('')
const password = ref('')
const rules = computed(() => ({
    username: { required },
    password: { required }
}))
const v$ = useVuelidate(rules, { username, password })
const alertPassword = ref('')
const alertUsername = ref('')
const alertLogin = ref('')

watch([() => v$.value.username.$error, username], async () => {
    await v$.value.username.$validate()
    if (v$.value.username.$error && v$.value.username.$errors[0]) {
        alertUsername.value = v$.value.username.$errors[0].$message.toString()
    } else {
        alertUsername.value = ''
    }
})
watch([() => v$.value.password.$error, password], async () => {
    await v$.value.password.$validate()
    if (v$.value.password.$error && v$.value.password.$errors[0]) {
        alertPassword.value = v$.value.password.$errors[0].$message.toString()
    } else {
        alertPassword.value = ''
    }
})

async function handleLogin() {
    alertLogin

    let valid: boolean = false

    Promise.allSettled([
        v$.value.username.$validate(),
        v$.value.password.$validate()
    ]).then(async () => {
        valid = await v$.value.$validate()
        
        if (!valid) {
            return
        }

        loading.value = true
        const loginResult = await userStore.login(username.value, password.value, rememberMe.value);

        loading.value = false

        if (loginResult.success) {
            router.push({ name: 'profile' })
        } else {
            if (loginResult.status === 401) {
                alertLogin.value = 'Invalid username or password'
            } else if (loginResult.status === 500) {
                alertLogin.value = 'Couldn\'t login: Server error'
            } else {
                alertLogin.value = 'Couldn\'t login: Unknown error. Please try again later.'
            }
        }
    })


}

</script>

<template>

    <div class="max-w-md mx-auto border border-gray-300 px-6 py-10 rounded-lg my-10">

        <h1 class="text-3xl font-bold mb-8">Login</h1>

        <p class="mb-4">New here? <RouterLink to="/signup" class="font-bold text-blue-600">Register now.</RouterLink>
        </p>

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
