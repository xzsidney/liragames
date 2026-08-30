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
import FamilyPartyRoomView from '../views/family/FamilyPartyRoomView.vue'
import FamilyTasksView from '../views/family/FamilyTasksView.vue'
import FamilyBattleView from '../views/family/FamilyBattleView.vue'
import FamilyShopView from '../views/family/FamilyShopView.vue'
import FamilyMasterView from '../views/family/FamilyMasterView.vue'
import FamilyHeroSheetView from '../views/family/FamilyHeroSheetView.vue'
import FamilyKingdomRadarView from '../views/family/FamilyKingdomRadarView.vue'
import FamilyActiveMissionView from '../views/family/FamilyActiveMissionView.vue'
import FamilyAdventuresView from '../views/family/FamilyAdventuresView.vue'
import FamilyFeedView from '../views/family/FamilyFeedView.vue'

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
    name: 'CharacterHub',
    component: CharacterHubView,
    meta: { requiresAuth: true }
  },
  {
    path: '/personagem/radar',
    name: 'RadarNocturna',
    component: RadarNocturnaView,
    meta: { requiresAuth: true }
  },
  {
    path: '/personagem/cacada',
    name: 'CharacterHunting',
    component: CharacterHuntingView,
    meta: { requiresAuth: true }
  },
  {
    path: '/personagem/missao-ativa',
    name: 'character-active-mission',
    component: CharacterActiveMissionView,
    meta: { requiresAuth: true }
  },
  {
    path: '/personagem/abrigo-hotel',
    name: 'character-hotel-shelter',
    component: CharacterHotelShelterView,
    meta: { requiresAuth: true }
  },
  {
    path: '/personagem/abrigo-esgoto',
    name: 'character-sewer-shelter',
    component: CharacterSewerShelterView,
    meta: { requiresAuth: true }
  },
  {
    path: '/personagem/refugio',
    name: 'character-haven',
    component: CharacterHavenView,
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
  },
  {
    path: '/personagem/cronicas',
    name: 'character-visual-novel',
    component: CharacterVisualNovelView,
    meta: { requiresAuth: true }
  },
  // JOGO DA FAMÍLIA LIRA (MULTIPLAYER REAL-TIME - EXCLUSIVO ROLE LIRA)
  {
    path: '/familia',
    redirect: '/familia/sala',
    meta: { requiresAuth: true, role: 'LIRA' }
  },
  {
    path: '/familia/sala',
    name: 'family-party-room',
    component: FamilyPartyRoomView,
    meta: { requiresAuth: true, role: 'LIRA' }
  },
  {
    path: '/familia/tarefas',
    name: 'family-tasks',
    component: FamilyTasksView,
    meta: { requiresAuth: true, role: 'LIRA' }
  },
  {
    path: '/familia/batalha',
    name: 'family-battle',
    component: FamilyBattleView,
    meta: { requiresAuth: true, role: 'LIRA' }
  },
  {
    path: '/familia/loja',
    name: 'family-shop',
    component: FamilyShopView,
    meta: { requiresAuth: true, role: 'LIRA' }
  },
  {
    path: '/familia/mestre',
    name: 'family-master',
    component: FamilyMasterView,
    meta: { requiresAuth: true, role: 'LIRA' }
  },
  {
    path: '/familia/ficha',
    name: 'family-hero-sheet',
    component: FamilyHeroSheetView,
    meta: { requiresAuth: true, role: 'LIRA' }
  },
  {
    path: '/familia/radar',
    name: 'family-kingdom-radar',
    component: FamilyKingdomRadarView,
    meta: { requiresAuth: true, role: 'LIRA' }
  },
  {
    path: '/familia/missao-ativa',
    name: 'family-active-mission',
    component: FamilyActiveMissionView,
    meta: { requiresAuth: true, role: 'LIRA' }
  },
  {
    path: '/familia/aventuras',
    name: 'family-adventures',
    component: FamilyAdventuresView,
    meta: { requiresAuth: true, role: 'LIRA' }
  },
  {
    path: '/familia/mural',
    name: 'family-feed',
    component: FamilyFeedView,
    meta: { requiresAuth: true, role: 'LIRA' }
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
    // Rota exclusiva da Família Lira: se não for LIRA, vai para login
    if (to.meta.role === 'LIRA' && user.role !== 'LIRA') {
      return { name: 'login' }
    }
    if (to.meta.role === 'MESTRE' && user.role !== 'MESTRE') {
      return { name: 'dashboard' }
    }
  }

  // 3. Se já estiver autenticado e tentar acessar login, envia para a sua respectiva tela
  if (to.name === 'login' && token) {
    if (user && user.role === 'LIRA') {
      return { name: 'family-party-room' }
    } else if (user && user.role === 'MESTRE') {
      return { name: 'gm-dashboard' }
    } else {
      return { name: 'dashboard' }
    }
  }

  return true
})

export default router

