import { defineStore, acceptHMRUpdate } from 'pinia'
import { useNetworkRequest } from '../composables/network';
import { Profile, SignupData } from '../interfaces';
import { useStorage } from '@vueuse/core'
import axios from 'axios';

export const useUserStore = defineStore('user', {
    state: () => ({
        access_token: '',
        profile: <Profile | null>null
    }),
    getters: {
        isLoggedIn(): boolean {
            return this.access_token !== '';
        }
    },
    actions: {
        setAuthHeader() {
            if (this.access_token !== '') {
                axios.defaults.headers.common['Authorization'] = `Bearer ${this.access_token}`;
            }
        },
        async login(username: string, password: string, rememberMe: boolean = false) {
            const response = await useNetworkRequest({
                url: 'http://localhost:3000/auth/login?delay=1000',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                data: { username, password }
            })

            if (!response || !response?.data?.access_token) return { success: false, status: response?.status };

            if (rememberMe) {
                useStorage('access-token', '').value = response.data.access_token;
            }

            this.access_token = response.data.access_token;
            this.setAuthHeader();

            return { success: true, status: response.status };
        },
        async logout() {
            this.access_token = '';
            this.profile = null;
            useStorage('access-token', '').value = '';
        },
        async getProfile() {
            const response = await useNetworkRequest({
                url: 'http://localhost:3000/auth/profile?delay=1000',
                method: 'GET',
                // headers: { 'Authorization': `Bearer ${this.access_token}` }
            })

            if (!response || !response?.data || response?.status !== 200) return { success: false };

            this.profile = response.data;
            return { success: true };
        },
        async signup({ password, email, firstname, lastname }: SignupData) {
            const username = email;
            const response = await useNetworkRequest({
                url: 'http://localhost:3000/auth/sign-up?delay=1000',
                method: 'POST',
                // headers: { 'Authorization': `Bearer ${this.access_token}` },
                data: { username, password, email, firstName: firstname, lastName: lastname }
            })

            if (!response || !response?.data || response?.status !== 201) return { success: false, status: response?.status };

            return { success: true, status: response.status };
        },
        async checkEmail(email: string) {
            const params = new URLSearchParams()
            params.append('email', email)

            const response = await useNetworkRequest({
                url: 'http://localhost:3000/auth/check-email',
                method: 'GET',
                params: params
            })

            if (!response || !response?.data || response?.status !== 200) return { available: undefined };

            if (response.data.available === true) return { available: true };

            if (response.data.available === false) return { available: false };

            return { available: undefined };

        }

    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}