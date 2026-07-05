<template>
  <div class="min-h-screen bg-background text-gray-200 font-body flex flex-col">
    <!-- Header with System Theme -->
    <header class="border-b shadow-md p-4 flex justify-between items-center transition-colors duration-500" :class="themeClasses.header">
      <div class="flex items-center gap-4">
        <button @click="router.push('/jogador')" class="text-gray-300 hover:text-white transition-colors">
          <span class="text-xl">←</span> Trocar Personagem
        </button>
        <h1 class="font-headline text-2xl font-bold tracking-wider text-white">O Sistema de {{ character?.name || '...' }}</h1>
      </div>
      <div class="flex items-center gap-2">
        <span class="px-3 py-1 bg-black/40 rounded-full text-xs font-semibold text-gray-300 border border-white/10 uppercase tracking-widest">
          {{ formatGameStyle(character?.gameStyle) }}
        </span>
      </div>
    </header>

    <main class="flex-grow p-8 max-w-7xl mx-auto w-full">
      <div v-if="loading" class="flex justify-center items-center h-64">
        <p class="text-xl text-gray-400 animate-pulse">Acessando registros...</p>
      </div>

      <div v-else-if="character" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Left Column: Character Summary -->
        <div class="lg:col-span-1 space-y-6">
          <div class="bg-surface border border-gray-800 p-6 rounded-xl relative overflow-hidden" :class="themeClasses.cardBorder">
            <div class="absolute inset-0 bg-gradient-to-br from-transparent to-black/60 pointer-events-none"></div>
            
            <div class="relative z-10">
              <h2 class="text-3xl font-headline font-bold mb-1 truncate text-white" :title="character.name">{{ character.name }}</h2>
              <p class="text-gray-400 mb-6">{{ formatGameStyle(character.gameStyle) }}</p>
              
              <div class="space-y-3 text-sm border-t border-gray-800 pt-4">
                <div class="flex justify-between">
                  <span class="text-gray-400">XP Acumulado</span>
                  <span class="text-white font-mono">{{ character.experienceTotal }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">XP Gasto</span>
                  <span class="text-white font-mono">{{ character.experienceSpent }}</span>
                </div>
                <div class="flex justify-between font-bold border-t border-gray-800 pt-2">
                  <span class="text-gray-300">XP Livre</span>
                  <span :class="themeClasses.textAccent" class="font-mono">{{ character.experienceTotal - character.experienceSpent }}</span>
                </div>
              </div>

              <!-- Maintenance Actions -->
              <div class="mt-8 pt-4 border-t border-gray-800 flex flex-col gap-3">
                <button 
                  @click="router.push(`/jogador/personagem/${character.id}/editar`)"
                  class="w-full py-2 bg-gray-800 hover:bg-gray-700 text-white rounded border border-gray-600 transition-colors flex items-center justify-center gap-2"
                >
                  <span>✏️</span> Editar Ficha
                </button>
                <button 
                  @click="isDeleteModalOpen = true"
                  class="w-full py-2 bg-transparent hover:bg-red-900/40 text-red-500 rounded border border-red-900/50 hover:border-red-600 transition-colors flex items-center justify-center gap-2"
                >
                  <span>🗑️</span> Excluir Personagem
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Navigation Hub -->
        <div class="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <!-- Solo Adventure -->
          <div 
            @click="router.push(`/jogador/aventura/0/personagem/${character.id}`)"
            class="bg-surface border border-gray-800 hover:border-gray-500 rounded-xl p-6 cursor-pointer group transition-all h-48 flex flex-col justify-center items-center text-center relative overflow-hidden"
          >
            <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
            <span class="text-5xl mb-4 group-hover:scale-110 transition-transform z-10 drop-shadow-lg">📖</span>
            <h3 class="text-2xl font-headline font-bold text-gray-200 group-hover:text-white z-10">Aventura Solo</h3>
            <p class="text-xs text-gray-400 mt-2 z-10">Explore crônicas interativas</p>
          </div>

          <!-- Shopping / Mercado -->
          <div 
            @click="router.push('/jogador/loja')"
            class="bg-surface border border-gray-800 hover:border-gray-500 rounded-xl p-6 cursor-pointer group transition-all h-48 flex flex-col justify-center items-center text-center relative overflow-hidden"
          >
            <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
            <span class="text-5xl mb-4 group-hover:scale-110 transition-transform z-10 drop-shadow-lg">🛒</span>
            <h3 class="text-2xl font-headline font-bold text-gray-200 group-hover:text-white z-10">Mercado Negro</h3>
            <p class="text-xs text-gray-400 mt-2 z-10">Compre equipamentos e itens</p>
          </div>

          <!-- City Map -->
          <div 
            class="md:col-span-2 bg-surface border border-gray-800 hover:border-gray-500 rounded-xl p-6 cursor-pointer group transition-all h-48 flex flex-col justify-center items-center text-center relative overflow-hidden"
          >
            <!-- Map background placeholder -->
            <div class="absolute inset-0 bg-gray-900 opacity-50 group-hover:opacity-70 transition-opacity flex items-center justify-center overflow-hidden">
               <!-- A very subtle grid or map-like pattern could go here -->
               <div class="w-[200%] h-[200%] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </div>
            
            <span class="text-5xl mb-4 group-hover:scale-110 transition-transform z-10 drop-shadow-lg">🗺️</span>
            <h3 class="text-2xl font-headline font-bold text-gray-200 group-hover:text-white z-10">Mapa da Cidade</h3>
            <p class="text-xs text-gray-400 mt-2 z-10">Domínios, territórios e pontos turísticos</p>
            <span class="absolute top-4 right-4 bg-yellow-900/50 text-yellow-500 border border-yellow-700/50 text-xs px-2 py-1 rounded font-bold uppercase tracking-wider z-10">
              Em Breve
            </span>
          </div>

        </div>

      </div>
      
      <div v-else class="text-center py-12">
        <p class="text-red-500 text-xl">Personagem não encontrado.</p>
        <button @click="router.push('/jogador')" class="mt-4 px-4 py-2 bg-gray-800 text-white rounded">Voltar</button>
      </div>
    </main>

    <DeleteCharacterModal 
      :isOpen="isDeleteModalOpen"
      :characterName="character?.name || ''"
      @close="isDeleteModalOpen = false"
      @confirm="executeDeleteCharacter"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../../services/api';
import DeleteCharacterModal from '../../components/DeleteCharacterModal.vue';

const route = useRoute();
const router = useRouter();
const characterId = route.params.id;

const character = ref(null);
const loading = ref(true);
const isDeleteModalOpen = ref(false);

const fetchCharacter = async () => {
  try {
    const response = await api.get(`/characters/${characterId}`);
    character.value = response.data;
  } catch (error) {
    console.error("Erro ao buscar detalhes do personagem:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchCharacter();
});

const executeDeleteCharacter = async () => {
  try {
    // Expected endpoint: DELETE /api/characters/:id
    await api.delete(`/characters/${characterId}`);
    isDeleteModalOpen.value = false;
    router.push('/jogador'); // Return to list after successful deletion
  } catch (error) {
    console.error("Erro ao deletar personagem:", error);
    alert("Ocorreu um erro ao tentar excluir. Tente novamente.");
  }
};

// Dynamic Theming based on system
const themeClasses = computed(() => {
  if (!character.value) return { header: 'bg-surface border-gray-800', textAccent: 'text-gray-300', cardBorder: 'hover:border-gray-500' };
  
  switch(character.value.gameStyle) {
    case 'VAMPIRE':
      return { header: 'bg-red-950/80 border-red-900', textAccent: 'text-red-500', cardBorder: 'hover:border-red-900 border-red-900/30' };
    case 'WEREWOLF':
      return { header: 'bg-green-950/80 border-green-900', textAccent: 'text-green-500', cardBorder: 'hover:border-green-900 border-green-900/30' };
    case 'MAGE':
      return { header: 'bg-purple-950/80 border-purple-900', textAccent: 'text-purple-400', cardBorder: 'hover:border-purple-900 border-purple-900/30' };
    case 'HUNTER':
      return { header: 'bg-orange-950/80 border-orange-900', textAccent: 'text-orange-500', cardBorder: 'hover:border-orange-900 border-orange-900/30' };
    default:
      return { header: 'bg-surface border-gray-800', textAccent: 'text-gray-300', cardBorder: 'hover:border-gray-500' };
  }
});

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
