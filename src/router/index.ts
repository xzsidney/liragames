import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import CharacterListView from '../views/CharacterListView.vue'
import CharacterDetailView from '../views/CharacterDetailView.vue'
import CharacterCreateView from '../views/CharacterCreateView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/characters/:system',
      name: 'characters',
      component: CharacterListView
    },
    {
      path: '/character/:system/create',
      name: 'character-create',
      component: CharacterCreateView
    },
    {
      path: '/character/:system/:id',
      name: 'character-detail',
      component: CharacterDetailView
    }
  ]
})

export default router
