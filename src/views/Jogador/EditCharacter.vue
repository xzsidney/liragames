<template>
  <div class="min-h-screen bg-background text-gray-200 font-body flex flex-col">
    <header class="border-b shadow-md p-4 flex justify-between items-center transition-colors duration-500" :class="themeClasses.header">
      <div class="flex items-center gap-4">
        <button @click="router.push(`/jogador/personagem/${characterId}`)" class="text-gray-300 hover:text-white transition-colors">
          <span class="text-xl">←</span> Voltar ao Sistema
        </button>
        <h1 class="font-headline text-2xl font-bold tracking-wider text-white">Editar Ficha: {{ character?.name || '...' }}</h1>
      </div>
    </header>

    <main class="flex-grow p-8 max-w-7xl mx-auto w-full">
      <div v-if="loading" class="flex justify-center items-center h-64">
        <p class="text-xl text-gray-400 animate-pulse">Descriptografando registros akáshicos...</p>
      </div>

      <div v-else-if="character" class="bg-surface border border-gray-800 rounded-xl p-6">
        
        <div class="mb-8 border-b border-gray-800 pb-4">
          <h2 class="text-xl font-headline font-bold text-gray-100 flex items-center gap-3">
            <span :class="themeClasses.textAccent">✦</span>
            Sistema Detectado: {{ formatGameStyle(character.gameStyle) }}
          </h2>
          <p class="text-sm text-gray-400 mt-2">
            As regras de validação para a edição (Limites de Pontos, Fome, Paradoxo, etc.) estão sendo aplicadas dinamicamente com base no seu sistema.
          </p>
        </div>

        <form @submit.prevent="saveCharacter" class="space-y-8">
          
          <!-- Basic Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-bold text-gray-400 mb-2">Nome do Personagem</label>
              <input 
                v-model="formData.name" 
                type="text" 
                class="w-full bg-background border border-gray-700 text-white p-3 rounded focus:outline-none focus:border-gray-500"
              />
            </div>
            <!-- Dynamic Basic Info based on System -->
            <div v-if="character.gameStyle === 'VAMPIRE'">
              <label class="block text-sm font-bold text-red-500 mb-2">Conceito Predatório</label>
              <input type="text" class="w-full bg-background border border-gray-700 text-white p-3 rounded focus:outline-none focus:border-red-500" placeholder="Ex: Sereia, Sandman..."/>
            </div>
            <div v-if="character.gameStyle === 'MAGE'">
              <label class="block text-sm font-bold text-purple-400 mb-2">Essência do Avatar</label>
              <select class="w-full bg-background border border-gray-700 text-white p-3 rounded focus:outline-none focus:border-purple-500">
                <option>Dinâmica</option>
                <option>Padrão</option>
                <option>Primordial</option>
                <option>Buscadora</option>
              </select>
            </div>
          </div>

          <!-- Dynamic Warning / Placeholder -->
          <div class="p-4 rounded bg-gray-900 border border-dashed border-gray-700 flex items-start gap-4">
            <span class="text-2xl mt-1">🚧</span>
            <div>
              <h3 class="font-bold text-gray-300">Construção Dinâmica da Ficha</h3>
              <p class="text-sm text-gray-500 mt-1">
                A interface completa para {{ formatGameStyle(character.gameStyle) }} será carregada aqui em breve. 
                <br/>O backend fornecerá os {{ character.gameStyle === 'MAGE' ? '30' : '27' }} atributos/habilidades corretos e a interface renderizará automaticamente.
              </p>
            </div>
          </div>

          <div class="flex justify-end gap-4 pt-6 border-t border-gray-800">
            <button 
              type="button"
              @click="router.push(`/jogador/personagem/${characterId}`)"
              class="px-6 py-2 bg-transparent hover:bg-gray-800 border border-gray-700 text-white rounded transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              class="px-6 py-2 bg-gray-200 hover:bg-white text-black font-bold rounded transition-colors"
            >
              Salvar Alterações
            </button>
          </div>

        </form>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../../services/api';

const route = useRoute();
const router = useRouter();
const characterId = route.params.id;

const character = ref(null);
const loading = ref(true);
const formData = ref({
  name: ''
});

const fetchCharacter = async () => {
  try {
    const response = await api.get(`/characters/${characterId}`);
    character.value = response.data;
    formData.value.name = response.data.name;
  } catch (error) {
    console.error("Erro ao buscar detalhes do personagem:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchCharacter();
});

const saveCharacter = async () => {
  try {
    await api.patch(`/characters/${characterId}`, {
      name: formData.value.name
    });
    alert("Personagem atualizado com sucesso!");
    router.push(`/jogador/personagem/${characterId}`);
  } catch (error) {
    console.error("Erro ao salvar:", error);
    alert("Falha ao atualizar o personagem. Verifique as regras de validação.");
  }
};

// Dynamic Theming based on system
const themeClasses = computed(() => {
  if (!character.value) return { header: 'bg-surface border-gray-800', textAccent: 'text-gray-300' };
  
  switch(character.value.gameStyle) {
    case 'VAMPIRE':
      return { header: 'bg-red-950/80 border-red-900', textAccent: 'text-red-500' };
    case 'WEREWOLF':
      return { header: 'bg-green-950/80 border-green-900', textAccent: 'text-green-500' };
    case 'MAGE':
      return { header: 'bg-purple-950/80 border-purple-900', textAccent: 'text-purple-400' };
    case 'HUNTER':
      return { header: 'bg-orange-950/80 border-orange-900', textAccent: 'text-orange-500' };
    default:
      return { header: 'bg-surface border-gray-800', textAccent: 'text-gray-300' };
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
