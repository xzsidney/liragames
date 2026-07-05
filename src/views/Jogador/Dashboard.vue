<template>
  <div class="min-h-screen bg-[#0B0B0B] text-gray-200 font-body flex flex-col">
    <!-- Header Minimalista Premium -->
    <header class="bg-[#111111] border-b border-[#222] px-6 py-4 flex justify-between items-center">
      <div class="flex items-center gap-6">
        <button class="text-gray-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 class="font-serif text-xl tracking-[0.2em] text-[#d4af37] uppercase">LiraRPG: Mundo das Trevas</h1>
      </div>
      
      <div class="flex items-center gap-6">
        <div class="flex items-center gap-3 text-right">
          <div class="flex flex-col">
            <span class="text-xs text-gray-500 font-bold uppercase tracking-widest">Jogador</span>
            <span class="text-sm text-gray-200">{{ authStore.user?.name || 'Membro' }}</span>
          </div>
          <div class="w-10 h-10 rounded-full border-2 border-gray-600 flex items-center justify-center overflow-hidden">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
        
        <div class="w-px h-8 bg-[#333]"></div>
        
        <button @click="handleLogout" class="flex items-center gap-2 text-gray-400 hover:text-white tracking-widest text-sm uppercase transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sair
        </button>
      </div>
    </header>
    
    <main class="flex-grow p-8 max-w-[1400px] mx-auto w-full flex flex-col justify-center">
      
      <!-- Seção de Título -->
      <div class="mb-12 border-l-4 border-red-800 pl-6 py-1">
        <h2 class="text-3xl font-serif italic text-gray-100 mb-2">Salão dos Personagens</h2>
        <p class="text-gray-400 max-w-2xl text-lg leading-relaxed">
          Selecione sua crônica. O destino da humanidade e dos monstros está em suas mãos.<br/>
          Entre na escuridão e molde a narrativa do horror pessoal.
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-20 flex justify-center items-center">
        <p class="text-xl text-gray-500 animate-pulse tracking-widest uppercase">Despertando as sombras...</p>
      </div>
      
      <!-- Grid de Personagens -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        <!-- Cartas dos Personagens -->
        <div 
          v-for="char in characters" 
          :key="char.id" 
          @click="openCharacterDashboard(char.id)"
          class="relative h-[600px] bg-[#1a1a1a] border border-[#333] cursor-pointer group overflow-hidden flex flex-col justify-end transition-all duration-500 hover:border-gray-500 hover:shadow-2xl hover:-translate-y-2"
        >
          <!-- Imagem de Fundo (Sistema) -->
          <div 
            class="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-105 opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-70"
            :style="{ backgroundImage: `url('/images/${getSystemImage(char.gameStyle)}')` }"
          ></div>
          
          <!-- Gradiente de escurecimento na base para legibilidade -->
          <div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
          
          <!-- Ícone do Sistema no Topo -->
          <div class="absolute top-4 right-4 w-10 h-10 rounded-full border border-gray-600 bg-black/50 backdrop-blur-sm flex items-center justify-center text-xl">
             {{ getSystemIcon(char.gameStyle) }}
          </div>

          <!-- Conteúdo Principal (Textos) -->
          <div class="relative z-10 p-6 pb-2">
            <div class="text-[0.65rem] font-bold tracking-[0.3em] uppercase mb-1" :class="getSystemTextColor(char.gameStyle)">
              {{ getSystemSubtitle(char.gameStyle) }}
            </div>
            <h3 class="text-4xl font-serif text-white mb-2 group-hover:text-gray-200 transition-colors">
              {{ char.name }}
            </h3>
            <p class="text-gray-400 text-sm italic font-serif">
               Criado em {{ new Date(char.createdAt).toLocaleDateString('pt-BR') }}
            </p>
          </div>
          
          <!-- Botão Rodapé Colorido -->
          <div 
            class="relative z-10 w-full py-4 px-6 mt-4 flex justify-between items-center uppercase text-sm font-bold tracking-widest text-white transition-colors"
            :class="getSystemButtonColor(char.gameStyle)"
          >
            Continuar Jornada
            <span class="text-xl">➔</span>
          </div>
        </div>

        <!-- Botão Especial: Criar Novo Personagem -->
        <div 
          @click="router.push('/jogador/personagem/novo/sistema')" 
          class="relative h-[600px] bg-[#0a0a0a] border-2 border-dashed border-[#333] cursor-pointer group flex flex-col justify-center items-center transition-all duration-300 hover:border-gray-500 hover:bg-[#111]"
        >
          <div class="w-20 h-20 rounded-full border border-[#444] group-hover:border-white text-[#444] group-hover:text-white flex items-center justify-center text-4xl font-light mb-6 transition-colors">
            +
          </div>
          <h3 class="text-xl font-serif text-gray-400 group-hover:text-white transition-colors tracking-wide">
            Nova Crônica
          </h3>
          <p class="text-sm text-gray-600 uppercase tracking-widest mt-4">
            Despertar Entidade
          </p>
        </div>

      </div>
    </main>
    
    <!-- Footer Elegante -->
    <footer class="bg-[#111] border-t border-[#222] p-6 text-center">
      <p class="text-gray-600 text-xs tracking-[0.2em] uppercase">
        &copy; 2024 World of Darkness &mdash; LiraRPG Plataforma
      </p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/authStore';
import api from '../../services/api';

const router = useRouter();
const authStore = useAuthStore();
const characters = ref([]);
const loading = ref(true);

const fetchCharacters = async () => {
  loading.value = true;
  try {
    const response = await api.get('/characters');
    characters.value = response.data;
  } catch (error) {
    console.error("Erro ao buscar personagens:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchCharacters();
});

const openCharacterDashboard = (id) => {
  router.push(`/jogador/personagem/${id}`);
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

// --- Funções Auxiliares de Estilização Dinâmica dos Cards ---

const getSystemImage = (style) => {
  const images = {
    'VAMPIRE': 'vampire.png',
    'WEREWOLF': 'werewolf.png',
    'MAGE': 'mage.png',
    'HUNTER': 'hunter.png'
  };
  return images[style] || 'Cena01.jpg';
};

const getSystemIcon = (style) => {
  const icons = {
    'VAMPIRE': '🩸',
    'WEREWOLF': '🐺',
    'MAGE': '👁️',
    'HUNTER': '🎯'
  };
  return icons[style] || '👤';
};

const getSystemSubtitle = (style) => {
  const titles = {
    'VAMPIRE': 'Gothic Horror',
    'WEREWOLF': 'Feral Horror',
    'MAGE': 'Mystic Horror',
    'HUNTER': 'Tactical Horror'
  };
  return titles[style] || 'World of Darkness';
};

const getSystemTextColor = (style) => {
  const colors = {
    'VAMPIRE': 'text-red-400',
    'WEREWOLF': 'text-green-400',
    'MAGE': 'text-purple-400',
    'HUNTER': 'text-orange-400'
  };
  return colors[style] || 'text-gray-400';
};

const getSystemButtonColor = (style) => {
  const colors = {
    'VAMPIRE': 'bg-[#8B0000] hover:bg-[#660000]',
    'WEREWOLF': 'bg-[#2E8B57] hover:bg-[#1f5e3b]',
    'MAGE': 'bg-[#4B0082] hover:bg-[#320057]',
    'HUNTER': 'bg-[#b85c00] hover:bg-[#8a4500]'
  };
  return colors[style] || 'bg-gray-800 hover:bg-gray-700';
};
</script>