import { createRouter, createWebHistory, RouteLocationNormalized } from 'vue-router'
import { useUserStore } from '../stores/user.store'

import HomeViewVue from '../views/HomeView.vue'
import ProfileView from '../views/ProfileView.vue'
import LoginView from '../views/LoginView.vue'
import LogoutView from '../views/LogoutView.vue'
import SignupView from '../views/SignupView.vue'
import ProductView from '../views/ProductView.vue'
import SuccessSignupView from '../views/SuccessSignupView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import ProductDetailsView from '../views/ProductDetailsView.vue'



const routes = [
    { name: 'home', path: '/', component: HomeViewVue },
    { name: 'profile', path: '/profile', component: ProfileView, meta: { requiresAuth: true } },
    { name: 'products', path: '/products', component: ProductView, meta: { requiresAuth: true } },
    { name: 'product', path: '/product/:id', component: ProductDetailsView, meta: { requiresAuth: true } },
    { name: 'login', path: '/login', component: LoginView },
    { name: 'logout', path: '/logout', component: LogoutView },
    { name: 'signup', path: '/signup', component: SignupView },
    {
        name: 'signup-success', path: '/signup-success', component: SuccessSignupView,
        beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
            if (from.name !== 'signup') {
                return { name: 'signup' }
            }
        }
    },
    { path: '/:pathMatch(.*)*', component: NotFoundView }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0 }
        }
    }
})

router.beforeEach((to: RouteLocationNormalized) => {

    const userStore = useUserStore();
    if (to.meta.requiresAuth && !userStore.isLoggedIn) {
        return { name: 'login' }
    }
})

export default router