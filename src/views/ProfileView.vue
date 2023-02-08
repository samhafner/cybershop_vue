<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AlertField from '../components/AlertField.vue';
import Button from '../components/Button.vue';
import Loading from '../components/Loading.vue';
import { useUserStore } from '../stores/user.store';

const userStore = useUserStore();
const router = useRouter();
const profileLoaded = ref(false);

function logout() {
    userStore.logout();
    router.push({ name: 'logout' });
}

if (userStore.profile) {
    profileLoaded.value = true;
} else {
    userStore.getProfile().then((result) => {
        // even if the profile is not loaded, we can still show the page (and the error message)
        profileLoaded.value = true;
    });
}

</script>

<template>
    <div class="section space-y-6 my-10">
        <h1 class="text-3xl font-bold mb-8">User Profile</h1>
        <template v-if="!profileLoaded">
            <Loading />
        </template>
        <template v-else>
            <template v-if="userStore.profile">
                <div class="space-y-2 sm_space-y-0">
                    <div class="flex flex-col sm:flex-row">
                        <p class="font-semibold w-48">ID:</p>
                        <p>{{ userStore.profile.id }}</p>
                    </div>

                    <div class="flex flex-col sm:flex-row">
                        <p class="font-semibold w-48">Username:</p>
                        <p>{{ userStore.profile.username }}</p>
                    </div>

                    <div class="flex flex-col sm:flex-row">
                        <p class="font-semibold w-48">First Name:</p>
                        <p>{{ userStore.profile.firstName }}</p>

                    </div>

                    <div class="flex flex-col sm:flex-row">
                        <p class="font-semibold w-48">Last Name:</p>
                        <p>{{ userStore.profile.lastName }}</p>

                    </div>

                    <div class="flex flex-col sm:flex-row">
                        <p class="font-semibold w-48">Department:</p>
                        <p>{{ userStore.profile.department }}</p>
                    </div>

                    <div class="flex flex-col sm:flex-row">
                        <p class="font-semibold w-48">Level:</p>
                        <p>{{ userStore.profile.level }}</p>
                    </div>

                    <div class="flex flex-col sm:flex-row">
                        <p class="font-semibold w-48">Email:</p>
                        <p>{{ userStore.profile.email }}</p>
                    </div>

                    <div class="flex flex-col sm:flex-row">
                        <p class="font-semibold w-48">Joined:</p>
                        <p>{{
                            new Date(userStore.profile.joinDate).toLocaleDateString('de-DE', { dateStyle: 'medium' })
                        }}
                        </p>
                    </div>
                </div>

                <Button text="Log out" @click="logout" class="block mx-auto sm:inline-block sm:mx-0" />

            </template>

            <template v-else>
                <AlertField message="Error loading profile." type="error" />
            </template>
        </template>
    </div>


</template>

<style scoped>

</style>
