import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import VampireDashboardView from '../views/VampireDashboardView.vue'
import CharacterVampireCreateView from '../views/CharacterVampireCreateView.vue'
import CharacterHubView from '../views/CharacterHubView.vue'
import CharacterSheetView from '../views/CharacterSheetView.vue'
import CharacterInventoryStoreView from '../views/CharacterInventoryStoreView.vue'
import CharacterNewsView from '../views/CharacterNewsView.vue'
import CharacterAdventuresView from '../views/CharacterAdventuresView.vue'

const routes: Array<RouteRecordRaw> = [
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
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/jogador/vampire',
    name: 'vampire-dashboard',
    component: VampireDashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/jogador/vampire/novo',
    name: 'vampire-create',
    component: CharacterVampireCreateView,
    meta: { requiresAuth: true }
  },
  // NÍVEL DO PERSONAGEM (JOGABILIDADE ATIVA)
  {
    path: '/personagem/hub',
    name: 'character-hub',
    component: CharacterHubView,
    meta: { requiresAuth: true }
  },
  {
    path: '/personagem/ficha',
    name: 'character-sheet',
    component: CharacterSheetView,
    meta: { requiresAuth: true }
  },
  {
    path: '/personagem/inventario',
    name: 'character-inventory',
    component: CharacterInventoryStoreView,
    meta: { requiresAuth: true }
  },
  {
    path: '/personagem/loja',
    name: 'character-store',
    component: CharacterInventoryStoreView,
    meta: { requiresAuth: true }
  },
  {
    path: '/personagem/noticias',
    name: 'character-news',
    component: CharacterNewsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/personagem/aventuras',
    name: 'character-adventures',
    component: CharacterAdventuresView,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation Guard
router.beforeEach((to, _from, next) => {
  const token = sessionStorage.getItem('lira_token') || localStorage.getItem('token') || localStorage.getItem('lira_token')
  
  if (to.meta.requiresAuth && !token) {
    next({ name: 'login' })
  } else if (to.name === 'login' && token) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router
