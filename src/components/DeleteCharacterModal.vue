<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
    <div class="bg-surface border-2 border-red-900 rounded-xl max-w-md w-full p-6 shadow-2xl shadow-red-900/50">
      
      <div class="flex items-center gap-3 mb-4 text-red-500">
        <span class="text-3xl">⚠️</span>
        <h2 class="text-2xl font-headline font-bold">Excluir Personagem</h2>
      </div>

      <p class="text-gray-300 mb-2">
        Atenção! Esta ação é <strong class="text-red-500">irreversível</strong> e você perderá todo o progresso deste personagem.
      </p>
      
      <p class="text-gray-400 text-sm mb-6">
        Para confirmar a exclusão, digite o nome exato do personagem abaixo:
        <br/><strong class="text-white select-none">{{ characterName }}</strong>
      </p>

      <input 
        v-model="confirmText" 
        type="text" 
        class="w-full bg-background border border-gray-700 text-white p-3 rounded focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 mb-6"
        placeholder="Digite o nome do personagem..."
        @paste.prevent
      />

      <div class="flex gap-4 justify-end">
        <button 
          @click="closeModal" 
          class="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors"
        >
          Cancelar
        </button>
        <button 
          @click="confirmDelete" 
          :disabled="!isNameMatched"
          class="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded transition-colors flex items-center gap-2"
        >
          Confirmar Exclusão
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  characterName: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['close', 'confirm']);

const confirmText = ref('');

// Reset the input when the modal opens
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    confirmText.value = '';
  }
});

const isNameMatched = computed(() => {
  return confirmText.value === props.characterName;
});

const closeModal = () => {
  emit('close');
};

const confirmDelete = () => {
  if (isNameMatched.value) {
    emit('confirm');
  }
};
</script>
