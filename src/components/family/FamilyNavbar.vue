<template>
  <nav class="bg-gradient-to-r from-[#20040c] via-[#120726] to-[#04132b] border-b-2 border-amber-500/40 px-4 py-3 sticky top-0 z-40 backdrop-blur-md shadow-2xl">
    <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
      
      <!-- Logo / Marca Família Lira -->
      <div class="flex items-center space-x-3">
        <router-link to="/familia/sala" class="flex items-center space-x-2 group">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-700 via-purple-700 to-blue-700 p-0.5 border border-amber-400 shadow-md shadow-amber-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
            <span class="text-xl">🏰</span>
          </div>
          <div>
            <h1 class="text-base md:text-lg font-black tracking-wide bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
              Família Lira
            </h1>
            <p class="text-[10px] text-blue-300 font-semibold flex items-center space-x-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Reino Online</span>
            </p>
          </div>
        </router-link>
      </div>

      <!-- Links de Navegação Unificada -->
      <div class="flex items-center flex-wrap gap-1 md:gap-1.5 text-xs font-bold">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          :class="[
            'px-2.5 py-1.5 rounded-xl transition-all duration-200 flex items-center space-x-1.5 border',
            $route.path === item.path 
              ? 'bg-gradient-to-r from-rose-900 via-rose-800 to-blue-900 text-amber-300 border-amber-400 shadow-lg shadow-amber-500/20 scale-105' 
              : 'bg-slate-900/80 text-slate-300 hover:text-amber-200 hover:bg-slate-800 border-slate-800 hover:border-amber-500/30'
          ]"
        >
          <span>{{ item.icon }}</span>
          <span class="hidden sm:inline">{{ item.label }}</span>
        </router-link>
      </div>

      <!-- Herói Ativo & Sair -->
      <div class="flex items-center space-x-2">
        <router-link 
          to="/familia/ficha" 
          v-if="activeHero"
          class="flex items-center space-x-2 bg-gradient-to-r from-rose-950 to-blue-950 border border-amber-500/40 px-2.5 py-1.5 rounded-xl hover:border-amber-400 transition-all cursor-pointer"
        >
          <img :src="activeHero.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500'" class="w-7 h-7 rounded-lg object-cover border border-amber-400" />
          <div class="hidden md:block text-left">
            <p class="text-[11px] font-black text-amber-300 leading-none">{{ activeHero.name }}</p>
            <p class="text-[9px] text-sky-300 font-semibold">Nv. {{ activeHero.level }} • 🪙 {{ activeHero.gold }}</p>
          </div>
        </router-link>

        <button
          @click="logout"
          class="bg-rose-950/70 hover:bg-rose-900 border border-rose-800/80 text-rose-300 hover:text-white p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          title="Sair da Conta"
        >
          🚪
        </button>
      </div>

    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { familyApi } from '../../services/familyApi';

const router = useRouter();
const activeHero = ref<any | null>(null);

const navItems = [
  { label: 'Salão', path: '/familia/sala', icon: '🏰' },
  { label: 'Ficha', path: '/familia/ficha', icon: '🛡️' },
  { label: 'Radar', path: '/familia/radar', icon: '🧭' },
  { label: 'Foco AFK', path: '/familia/missao-ativa', icon: '⏳' },
  { label: 'Arena', path: '/familia/batalha', icon: '⚔️' },
  { label: 'Missões', path: '/familia/tarefas', icon: '📋' },
  { label: 'Loja', path: '/familia/loja', icon: '🛍️' },
  { label: 'Contos', path: '/familia/aventuras', icon: '📜' },
  { label: 'Mural', path: '/familia/mural', icon: '🏆' },
];

function logout() {
  sessionStorage.removeItem('lira_token');
  sessionStorage.removeItem('lira_user');
  localStorage.removeItem('lira_token');
  localStorage.removeItem('lira_user');
  localStorage.removeItem('token');
  router.push('/login');
}

onMounted(async () => {
  try {
    const res = await familyApi.getMyCharacters();
    if (res.success && res.characters?.length > 0) {
      const savedId = localStorage.getItem('lira_active_family_char_id');
      activeHero.value = res.characters.find((c: any) => c.id === savedId) || res.characters[0];
    }
  } catch (err) {
    console.error('Erro ao carregar herói ativo na navbar:', err);
  }
});
</script>
