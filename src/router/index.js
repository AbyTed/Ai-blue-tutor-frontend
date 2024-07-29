// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import UserLogin from '../components/UserLogin.vue'
import UserSignUp from '../components/UserSignUp.vue'
import WelcomeItem from '../components/WelcomeItem.vue'
import ImageTextExtractor from '@/components/ImageTextExtractor.vue'
const routes = [
  {
    path: '/',
    name: 'Home',
    component: WelcomeItem
  },
  {
    path: '/login',
    name: 'Login',
    component: UserLogin
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: UserSignUp
  },

  {
    path: '/image-text-extractor',
    name: 'ImageTextExtractor',
    component: ImageTextExtractor
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
