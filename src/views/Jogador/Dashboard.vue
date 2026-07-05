<template>
  <div class="min-h-screen bg-background text-gray-200 font-body">
    <header class="bg-surface border-b border-gray-800 p-4 flex justify-between items-center shadow-md">
      <h1 class="font-headline text-2xl text-vampire font-bold tracking-wider">LiraRPG - Salão dos Personagens</h1>
      <button @click="handleLogout" class="text-sm bg-gray-800 hover:bg-red-900/80 px-4 py-2 rounded transition-colors text-white border border-gray-700">Sair</button>
    </header>
    
    <main class="p-8 max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <h2 class="text-3xl font-headline text-gray-100">Meus Personagens</h2>
        <button 
          @click="router.push('/jogador/personagem/novo/sistema')" 
          class="bg-vampire hover:bg-red-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-red-900/20 transition-all flex items-center gap-2"
        >
          <span class="text-xl">+</span> Criar Novo Personagem
        </button>
      </div>

      <div v-if="loading" class="text-center py-12">
        <p class="text-xl text-gray-400 animate-pulse">Buscando na umbra...</p>
      </div>
      
      <div v-else-if="characters.length === 0" class="text-center py-16 bg-surface/50 rounded-xl border border-gray-800 border-dashed">
        <p class="text-gray-400 text-lg mb-6">Você ainda não tem personagens criados para explorar o Mundo das Trevas.</p>
        <button 
          @click="router.push('/jogador/personagem/novo/sistema')" 
          class="bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold py-2 px-6 rounded border border-gray-700 transition-colors"
        >
          Iniciar minha jornada
        </button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          v-for="char in characters" 
          :key="char.id" 
          @click="openCharacterDashboard(char.id)"
          class="bg-surface border border-gray-800 rounded-xl p-6 cursor-pointer hover:border-vampire hover:shadow-lg hover:shadow-vampire/10 transition-all group relative overflow-hidden flex flex-col h-full"
        >
          <!-- Background effect based on game style (subtle) -->
          <div class="absolute inset-0 bg-gradient-to-br from-transparent to-black/40 pointer-events-none"></div>
          
          <div class="relative z-10 flex-grow">
            <h3 class="text-2xl font-headline font-bold text-gray-100 group-hover:text-vampire transition-colors mb-2 truncate" :title="char.name">
              {{ char.name }}
            </h3>
            
            <div class="inline-block px-3 py-1 bg-gray-900 border border-gray-700 rounded-full text-xs font-semibold tracking-wider text-gray-400 mb-4">
              {{ formatGameStyle(char.gameStyle) }}
            </div>
            
            <div class="space-y-2 mt-4 text-sm text-gray-400">
              <div class="flex justify-between border-b border-gray-800 pb-1">
                <span>XP Total</span>
                <span class="text-gray-200 font-mono">{{ char.experienceTotal }}</span>
              </div>
              <div class="flex justify-between">
                <span>XP Disponível</span>
                <span class="text-gray-200 font-mono">{{ char.experienceTotal - char.experienceSpent }}</span>
              </div>
            </div>
          </div>
          
          <div class="relative z-10 mt-6 pt-4 border-t border-gray-800 flex items-center justify-between text-sm text-gray-500">
            <span>Criado em: {{ new Date(char.createdAt).toLocaleDateString('pt-BR') }}</span>
            <span class="group-hover:translate-x-1 transition-transform">➔</span>
          </div>
        </div>
      </div>
    </main>
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
    // TODO: Adicionar notificação de erro visual
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

const formatGameStyle = (style) => {
  const styles = {
    'VAMPIRE': 'Vampiro: A Máscara',
    'WEREWOLF': 'Lobisomem: O Apocalipse',
    'MAGE': 'Mago: A Ascensão',
    'HUNTER': 'Caçador: A Revanche'
  };
  return styles[style] || style;
};
</script>