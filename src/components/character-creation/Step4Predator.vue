<template>
  <div class="space-y-8 animate-fade-in">
    <header class="text-center mb-10">
      <h2 class="font-serif text-2xl md:text-3xl text-gold mb-2 drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]">A Caçada (Predador)</h2>
      <p class="text-gray-400 font-serif text-sm">A Fome é a única constante. Como você sobrevive na noite?</p>
    </header>

    <div class="max-w-4xl mx-auto">
      <div class="mb-6 relative">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Pesquisar predador... (Ex: Beco, Fazendeiro, Hack)" 
          class="w-full bg-black/60 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-blood-red focus:ring-1 focus:ring-blood-red/50 transition-all duration-300 shadow-inner placeholder-gray-600"
        />
        <div class="absolute left-3 top-3.5 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div v-if="filteredPredators.length === 0" class="text-center p-10 border border-white/10 rounded-xl bg-black/40">
        <p class="text-gray-500 italic">Nenhum estilo de predador encontrado.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        <div 
          v-for="pkg in filteredPredators" 
          :key="pkg.id"
          @click="store.form.predatorId = pkg.id"
          class="cursor-pointer flex flex-col p-5 h-full rounded-xl border transition-all duration-300 group/card relative overflow-hidden"
          :class="store.form.predatorId === pkg.id ? 'border-blood-red bg-blood-red/10 shadow-[0_0_15px_rgba(139,0,0,0.3)]' : 'border-white/10 bg-black/40 hover:border-white/30 hover:bg-black/60'"
        >
          <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity"></div>

          <h3 class="font-serif text-lg mb-2 relative z-10 leading-tight" :class="store.form.predatorId === pkg.id ? 'text-white' : 'text-gold-dim'">{{ pkg.name }}</h3>
          <p class="text-xs text-gray-400 flex-grow relative z-10 line-clamp-4 mb-4">{{ pkg.description || 'Uma forma de caçar nas ruas de Nocturna.' }}</p>
          
          <div class="border-t border-white/10 pt-3 mt-auto relative z-10 flex justify-between items-center">
            <span class="text-[10px] text-gray-500 uppercase tracking-widest">Bônus:</span>
            <span class="bg-black/50 border border-white/10 text-gold text-[10px] px-2 py-0.5 rounded shadow-inner flex items-center gap-1">
              Pacote de Caça
              <span v-if="store.form.predatorId === pkg.id" class="text-blood-red font-bold">✓</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCharacterCreationStore } from '../../stores/characterCreationStore'

const store = useCharacterCreationStore()
const searchQuery = ref('')

const filteredPredators = computed(() => {
  let list = store.filteredPredatorPackages
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    list = list.filter(pkg => 
      pkg.name.toLowerCase().includes(query) || 
      (pkg.description && pkg.description.toLowerCase().includes(query))
    )
  }
  return list
})
</script>
