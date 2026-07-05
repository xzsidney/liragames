import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const routes = [
  { path: '/', name: 'Home', component: () => import('../views/Home.vue') },
  { path: '/login', name: 'Login', component: () => import('../views/Login.vue'), meta: { guestOnly: true } },
  { path: '/cadastro', name: 'Cadastro', component: () => import('../views/Cadastro.vue'), meta: { guestOnly: true } },
  // Rotas de Mestre
  { 
    path: '/mestre', 
    name: 'MestreDashboard', 
    component: () => import('../views/Mestre/Dashboard.vue'),
    meta: { requiresAuth: true, role: 'MESTRE' }
  },
  { 
    path: '/mestre/npc', 
    name: 'MestreNPC', 
    component: () => import('../views/Mestre/NPC.vue'),
    meta: { requiresAuth: true, role: 'MESTRE' } 
  },
  { 
    path: '/mestre/aventura', 
    name: 'MestreAventura', 
    component: () => import('../views/Mestre/Aventura.vue'),
    meta: { requiresAuth: true, role: 'MESTRE' } 
  },
  // Rotas de Jogador (Silos por Sistema)
  { 
    path: '/jogador', 
    name: 'JogadorDashboard', 
    component: () => import('../views/Jogador/Dashboard.vue'), // Hub de Sistemas
    meta: { requiresAuth: true, role: 'JOGADOR' }
  },
  
  // --- VAMPIRO ---
  { 
    path: '/jogador/vampire', 
    name: 'VampireDashboard', 
    component: () => import('../views/Jogador/Vampiro/VampireDashboard.vue'),
    meta: { requiresAuth: true, role: 'JOGADOR' } 
  },
  { 
    path: '/jogador/vampire/novo', 
    name: 'VampireCreation', 
    component: () => import('../views/Jogador/Vampiro/VampireCreation.vue'),
    meta: { requiresAuth: true, role: 'JOGADOR' } 
  },
  { 
    path: '/jogador/vampire/personagem/:id', 
    name: 'VampireEdit', 
    component: () => import('../views/Jogador/Vampiro/VampireEdit.vue'),
    meta: { requiresAuth: true, role: 'JOGADOR' } 
  },
  
  // Loja e Aventura genéricas (se existirem)
  { 
    path: '/jogador/loja', 
    name: 'Loja', 
    component: () => import('../views/Jogador/Loja.vue'),
    meta: { requiresAuth: true, role: 'JOGADOR' } 
  },
  { 
    path: '/jogador/aventura/:advId/personagem/:charId', 
    name: 'AventuraSolo', 
    component: () => import('../views/Jogador/AdventurePlay.vue'),
    meta: { requiresAuth: true, role: 'JOGADOR' } 
  },
  // Admin
  { 
    path: '/admin', 
    name: 'Admin', 
    component: () => import('../views/Admin.vue'),
    meta: { requiresAuth: true, role: 'ADMIN' }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated
  const userRole = authStore.userRole

  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'Login' }
  } else if (to.meta.guestOnly && isAuthenticated) {
    if (userRole === 'ADMIN') return { name: 'Admin' }
    else if (userRole === 'MESTRE') return { name: 'MestreDashboard' }
    else return { name: 'JogadorDashboard' }
  } else if (to.meta.requiresAuth && to.meta.role && to.meta.role !== userRole) {
    if (userRole === 'ADMIN') return { name: 'Admin' }
    else if (userRole === 'MESTRE') return { name: 'MestreDashboard' }
    else return { name: 'JogadorDashboard' }
  }
})

export default router
