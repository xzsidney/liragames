<template>
  <div class="space-y-8 animate-fade-in">
    <header class="text-center mb-10">
      <h2 class="font-serif text-2xl md:text-3xl text-gold mb-2 drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]">O Senhor e A Herança</h2>
      <p class="text-gray-400 font-serif text-sm">Todo neófito tem um criador. Quem o trouxe para a noite?</p>
    </header>

    <div class="space-y-8 max-w-2xl mx-auto">
      <!-- Sire -->
      <div class="group bg-black/40 p-6 rounded-xl border border-white/10">
        <label class="block text-xs font-serif uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-gold transition-colors">Nome do Senhor (Sire)</label>
        <p class="text-xs text-gray-500 mb-4">Escolha um NPC do seu clã com geração mais antiga, ou deixe como Desconhecido.</p>
        
        <select 
          v-model="store.form.sire" 
          class="w-full bg-black/60 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-blood-red transition-all duration-300"
        >
          <option value="">Desconhecido / Abandonado</option>
          <option v-for="sire in store.availableSires" :key="sire.id" :value="sire.name">
            {{ sire.name }} (Geração {{ sire.generation }})
          </option>
        </select>
        <p v-if="store.availableSires.length === 0" class="text-xs text-red-400 mt-2">Nenhum Ancião ou Ancillae deste clã foi encontrado em Nocturna.</p>
      </div>

      <!-- Life Packages (Vantagens) -->
      <div class="group bg-black/40 p-6 rounded-xl border border-white/10 flex flex-col">
        <label class="block text-xs font-serif uppercase tracking-wider text-gray-400 mb-2">Pacote de Vantagens e Defeitos</label>
        <p class="text-xs text-gray-500 mb-4">Escolha os fardos e recursos que você traz da vida mortal para as noites.</p>
        
        <!-- Search -->
        <div class="mb-4 relative">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Pesquisar pacote... (Ex: Herdeiro, Criminoso)" 
            class="w-full bg-black/60 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-blood-red focus:ring-1 focus:ring-blood-red/50 transition-all duration-300 shadow-inner placeholder-gray-600"
          />
          <div class="absolute left-3 top-3 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div class="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
          <!-- Opção Limpa (Sempre disponível, a menos que digite algo que não bata) -->
          <label v-if="'nenhum (modo limpo)'.includes(searchQuery.toLowerCase())" class="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-black/20 hover:bg-black/50 cursor-pointer transition-colors">
            <input type="radio" v-model="store.form.backgroundId" value="none" class="text-blood-red bg-black border-white/20 focus:ring-blood-red" />
            <div>
              <p class="font-serif text-sm text-gray-200">Nenhum (Modo Limpo)</p>
              <p class="text-xs text-gray-500">Sem recursos extras, mas sem inimigos no seu calcanhar.</p>
            </div>
          </label>

          <!-- Pacotes Dinâmicos -->
          <label 
            v-for="pkg in filteredBackgrounds" 
            :key="pkg.id"
            class="flex flex-col p-3 rounded-lg border transition-colors cursor-pointer"
            :class="store.form.backgroundId === pkg.id ? 'border-blood-red bg-blood-red/10' : 'border-white/10 bg-black/20 hover:bg-black/50'"
          >
            <div class="flex items-center gap-3">
              <input type="radio" v-model="store.form.backgroundId" :value="pkg.id" class="text-blood-red bg-black border-white/20 focus:ring-blood-red" />
              <div>
                <p class="font-serif text-sm" :class="store.form.backgroundId === pkg.id ? 'text-white' : 'text-gray-200'">{{ pkg.name }}</p>
                <p class="text-xs text-gray-500">{{ pkg.description }}</p>
              </div>
            </div>
            
            <!-- Expandable Bonuses Area -->
            <div v-if="store.form.backgroundId === pkg.id" class="mt-3 pt-3 border-t border-blood-red/30 pl-8 animate-fade-in">
              <p class="text-[10px] text-blood-red uppercase tracking-widest mb-2 font-bold">Conteúdo do Pacote:</p>
              <div v-for="bonus in store.getPackageBonusesSummary(pkg.id)" :key="bonus.group" class="mb-2 last:mb-0">
                <span class="text-[9px] text-gray-400 uppercase tracking-wider block mb-1">{{ bonus.group }}</span>
                <div class="flex flex-wrap gap-1">
                  <span v-for="item in bonus.items" :key="item" class="text-[10px] bg-black/50 border border-gold-dim/20 text-gold-dim px-1.5 py-0.5 rounded">
                    {{ item }}
                  </span>
                </div>
              </div>
            </div>
          </label>
          
          <div v-if="filteredBackgrounds.length === 0 && !'nenhum (modo limpo)'.includes(searchQuery.toLowerCase())" class="text-center py-4 text-gray-500 text-sm italic">
            Nenhum pacote encontrado com este nome.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCharacterCreationStore } from '../../stores/characterCreationStore'

const store = useCharacterCreationStore()
const searchQuery = ref('')

const filteredBackgrounds = computed(() => {
  if (!searchQuery.value) return store.backgroundPackages;
  
  const query = searchQuery.value.toLowerCase();
  return store.backgroundPackages.filter(pkg => 
    pkg.name.toLowerCase().includes(query) || 
    (pkg.description && pkg.description.toLowerCase().includes(query))
  );
})

onMounted(() => {
  if (store.form.clanId) {
    store.fetchAvailableSires(store.form.clanId)
  }
})
</script>
