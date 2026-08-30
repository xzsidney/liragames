import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import VampireDashboardView from '../views/VampireDashboardView.vue'
import CharacterVampireCreateView from '../views/CharacterVampireCreateView.vue'
import CharacterHubView from '../views/CharacterHubView.vue'
import RadarNocturnaView from '../views/RadarNocturnaView.vue'
import CharacterHuntingView from '../views/CharacterHuntingView.vue'
import CharacterSheetView from '../views/CharacterSheetView.vue'
import CharacterInventoryStoreView from '../views/CharacterInventoryStoreView.vue'
import CharacterNewsView from '../views/CharacterNewsView.vue'
import CharacterAdventuresView from '../views/CharacterAdventuresView.vue'
import CharacterVisualNovelView from '../views/CharacterVisualNovelView.vue'
import GmDashboardView from '../views/GmDashboardView.vue'
import DiceTestView from '../views/DiceTestView.vue'
import CharacterActiveMissionView from '../views/CharacterActiveMissionView.vue'
import CharacterHotelShelterView from '../views/CharacterHotelShelterView.vue'
import CharacterSewerShelterView from '../views/CharacterSewerShelterView.vue'
import CharacterHavenView from '../views/CharacterHavenView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/teste-dados',
    name: 'dice-test',
    component: DiceTestView
  },
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
    path: '/mestre',
    name: 'gm-dashboard',
    component: GmDashboardView,
    meta: { requiresAuth: true, role: 'MESTRE' }
  },
  {
    path: '/vampiro',
    name: 'vampire-dashboard',
    component: VampireDashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/personagem/criar-vampiro',
    name: 'character-vampire-create',
    component: CharacterVampireCreateView,
    meta: { requiresAuth: true }
  },
  {
    path: '/personagem/hub',
    name: 'character-hub',
    component: CharacterHubView,
    meta: { requiresAuth: true }
  },
  {
    path: '/personagem/radar',
    name: 'radar-nocturna',
    component: RadarNocturnaView,
    meta: { requiresAuth: true }
  },
  {
    path: '/personagem/hotel-shelter',
    name: 'character-hotel-shelter',
    component: CharacterHotelShelterView,
    meta: { requiresAuth: true }
  },
  {
    path: '/personagem/sewer-shelter',
    name: 'character-sewer-shelter',
    component: CharacterSewerShelterView,
    meta: { requiresAuth: true }
  },
  {
    path: '/personagem/haven',
    name: 'character-haven',
    component: CharacterHavenView,
    meta: { requiresAuth: true }
  },
  {
    path: '/personagem/missao-ativa',
    name: 'character-active-mission',
    component: CharacterActiveMissionView,
    meta: { requiresAuth: true }
  },
  {
    path: '/personagem/cacada',
    name: 'character-hunting',
    component: CharacterHuntingView,
    meta: { requiresAuth: true }
  },
  {
    path: '/personagem/ficha',
    name: 'character-sheet',
    component: CharacterSheetView,
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
  },
  {
    path: '/personagem/cronicas',
    name: 'character-visual-novel',
    component: CharacterVisualNovelView,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation Guard
router.beforeEach((to) => {
  const token = sessionStorage.getItem('lira_token') || localStorage.getItem('token') || localStorage.getItem('lira_token')
  const userStr = sessionStorage.getItem('lira_user') || localStorage.getItem('lira_user')
  let user: any = null
  if (userStr) {
    try {
      user = JSON.parse(userStr)
    } catch (e) {
      user = null
    }
  }
  
  // 1. Bloqueia rotas protegidas se não estiver logado
  if (to.meta.requiresAuth && !token) {
    return { name: 'login' }
  }

  // 2. Bloqueia rotas exclusivas se a role não coincidir
  if (to.meta.role) {
    if (!token || !user) {
      return { name: 'login' }
    }
    if (to.meta.role === 'MESTRE' && user.role !== 'MESTRE') {
      return { name: 'dashboard' }
    }
  }

  // 3. Se já estiver autenticado e tentar acessar login, envia para a sua respectiva tela
  if (to.name === 'login' && token) {
    if (user && user.role === 'MESTRE') {
      return { name: 'gm-dashboard' }
    } else {
      return { name: 'dashboard' }
    }
  }

  return true
})

export default router
