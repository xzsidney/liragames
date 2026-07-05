<template>
  <div class="min-h-screen bg-background text-gray-200 font-body flex flex-col">
    <header class="border-b shadow-md p-4 flex justify-between items-center transition-colors duration-500" :class="themeClasses.header">
      <div class="flex items-center gap-4">
        <button @click="router.push('/jogador/personagem/novo/sistema')" class="text-gray-300 hover:text-white transition-colors">
          <span class="text-xl">←</span> Voltar
        </button>
        <h1 class="font-headline text-2xl font-bold tracking-wider text-white">Criar Personagem: {{ formatGameStyle(selectedSystem) }}</h1>
      </div>
    </header>

    <main class="flex-grow p-8 max-w-7xl mx-auto w-full">
      <div v-if="!selectedSystem" class="bg-red-900/40 border border-red-500 p-6 rounded-xl text-center">
        <p class="text-xl text-white mb-4">Nenhum sistema selecionado.</p>
        <button @click="router.push('/jogador/personagem/novo/sistema')" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded">
          Escolher Sistema
        </button>
      </div>

      <div v-else class="bg-surface border border-gray-800 rounded-xl p-6">
        <div class="mb-8 border-b border-gray-800 pb-4">
          <p class="text-sm text-gray-400 mt-2">
            Preencha os dados básicos. A ficha será construída obedecendo as regras de 
            <strong :class="themeClasses.textAccent">{{ formatGameStyle(selectedSystem) }}</strong>.
          </p>
        </div>

        <form @submit.prevent="createCharacter" class="space-y-6">
          <div>
            <label class="block text-sm font-bold text-gray-400 mb-2">Nome do Personagem</label>
            <input 
              v-model="formData.name" 
              type="text" 
              required
              class="w-full bg-background border border-gray-700 text-white p-3 rounded focus:outline-none focus:border-gray-500"
              placeholder="Digite o nome..."
            />
          </div>

          <!-- Dynamic Fields based on System -->
          <div v-if="selectedSystem === 'VAMPIRE'">
            <label class="block text-sm font-bold text-red-500 mb-2">Conceito (Opcional)</label>
            <input type="text" class="w-full bg-background border border-gray-700 text-white p-3 rounded focus:outline-none focus:border-red-500" />
          </div>
          <div v-if="selectedSystem === 'WEREWOLF'">
            <label class="block text-sm font-bold text-green-500 mb-2">Tribo</label>
            <select class="w-full bg-background border border-gray-700 text-white p-3 rounded focus:outline-none focus:border-green-500">
              <option value="">Selecione uma Tribo (Em breve)</option>
            </select>
          </div>

          <div class="flex justify-end pt-6 border-t border-gray-800">
            <button 
              type="submit"
              :disabled="loading"
              class="px-8 py-3 font-bold rounded transition-colors text-white"
              :class="themeClasses.button"
            >
              {{ loading ? 'Forjando...' : 'Criar Personagem' }}
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../../services/api';

const route = useRoute();
const router = useRouter();

const selectedSystem = computed(() => route.query.system);
const loading = ref(false);

const formData = ref({
  name: ''
});

const createCharacter = async () => {
  if (!formData.value.name) return;
  loading.value = true;
  
  try {
    // According to Prisma schema, Character creation needs: name, gameStyle, userId
    // But backend should infer userId from JWT token
    const response = await api.post('/characters', {
      name: formData.value.name,
      gameStyle: selectedSystem.value
    });
    
    // Redirect to the new character's dashboard
    router.push(`/jogador/personagem/${response.data.id}`);
  } catch (error) {
    console.error("Erro ao criar personagem:", error);
    alert("Houve um erro na criação do personagem. Verifique se a API está online e aceitando cadastros.");
  } finally {
    loading.value = false;
  }
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

// Dynamic Theming based on system
const themeClasses = computed(() => {
  switch(selectedSystem.value) {
    case 'VAMPIRE':
      return { header: 'bg-red-950/80 border-red-900', textAccent: 'text-red-500', button: 'bg-red-700 hover:bg-red-600' };
    case 'WEREWOLF':
      return { header: 'bg-green-950/80 border-green-900', textAccent: 'text-green-500', button: 'bg-green-700 hover:bg-green-600' };
    case 'MAGE':
      return { header: 'bg-purple-950/80 border-purple-900', textAccent: 'text-purple-400', button: 'bg-purple-700 hover:bg-purple-600' };
    case 'HUNTER':
      return { header: 'bg-orange-950/80 border-orange-900', textAccent: 'text-orange-500', button: 'bg-orange-700 hover:bg-orange-600' };
    default:
      return { header: 'bg-surface border-gray-800', textAccent: 'text-gray-300', button: 'bg-gray-700 hover:bg-gray-600' };
  }
});
</script>