<template>
  <div class="space-y-8 animate-fade-in">
    <header class="text-center mb-10">
      <h2 class="font-serif text-2xl md:text-3xl text-gold mb-2 drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]">O Abraço</h2>
      <p class="text-gray-400 font-serif text-sm">Sua vida chamou a atenção de predadores específicos. Escolha sua linhagem.</p>
    </header>

    <div class="max-w-4xl mx-auto">
      <div v-if="store.filteredClans.length === 0" class="text-center p-10 border border-white/10 rounded-xl bg-black/40">
        <p class="text-gray-500 italic">Retorne e selecione uma profissão primeiro para ver quem se interessa por você.</p>
      </div>

      <div v-else>
        <!-- Search -->
        <div class="mb-4 relative">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Pesquisar clã... (Ex: Brujah, Tremere)" 
            class="w-full bg-black/60 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-blood-red focus:ring-1 focus:ring-blood-red/50 transition-all duration-300 shadow-inner placeholder-gray-600"
          />
          <div class="absolute left-3 top-3.5 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          <div 
            v-for="clan in filteredClansWithSearch" 
            :key="clan.id"
            @click="store.form.clanId = clan.id"
            class="cursor-pointer relative flex flex-col h-full overflow-hidden rounded-xl border transition-all duration-500 group/card"
            :class="store.form.clanId === clan.id ? 'border-blood-red bg-gradient-to-b from-blood-red/20 to-black shadow-[0_0_20px_rgba(139,0,0,0.4)] scale-[1.02]' : 'border-white/10 bg-black/60 hover:border-white/30 hover:bg-black/80'"
          >
            <!-- Background image (placeholder ou logo do clã, se tiver no bd) -->
            <div class="h-32 w-full bg-gradient-to-br from-black to-gray-900 border-b border-white/5 relative flex items-center justify-center overflow-hidden">
              <!-- Tenta carregar o icone do clã na pasta public/img/clans, se falhar, mostra a letra -->
              <img 
                :src="`/img/clans/${clan.name.toLowerCase().replace(/\s+/g, '_')}.svg`" 
                class="h-20 w-20 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] opacity-80 group-hover/card:opacity-100 transition-opacity group-hover/card:scale-110 duration-500"
                @error="(e) => (e.target as HTMLImageElement).style.display = 'none'"
                alt=""
              />
              <span class="absolute font-serif text-5xl opacity-10 transition-opacity" :class="store.form.clanId === clan.id ? 'text-blood-red' : 'text-gray-500'">
                {{ clan.name.charAt(0) }}
              </span>
            </div>
            
            <div class="p-5 flex-grow flex flex-col">
              <h3 class="font-serif text-xl mb-2 text-center" :class="store.form.clanId === clan.id ? 'text-white' : 'text-gold-dim'">{{ clan.name }}</h3>
              <p class="text-xs text-gray-400 text-center flex-grow line-clamp-3 mb-4">{{ clan.description || 'Uma linhagem de vampiros antigos.' }}</p>
              
              <div class="border-t border-white/10 pt-3 mt-auto">
                <p class="text-[10px] text-center uppercase tracking-widest text-red-500/80 mb-1">Perdição do Clã</p>
                <div class="text-[10px] text-gray-400 text-center line-clamp-3 bg-red-950/20 p-2 rounded border border-red-900/30">
                  {{ clan.weakness || 'Fraqueza desconhecida.' }}
                </div>
              </div>
            </div>
            
            <!-- Selected border glow -->
            <div v-if="store.form.clanId === clan.id" class="absolute inset-0 border-2 border-blood-red rounded-xl pointer-events-none"></div>
          </div>
          
          <div v-if="filteredClansWithSearch.length === 0" class="col-span-full py-8 text-center text-gray-500 text-sm italic">
            Nenhum clã encontrado com este nome.
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

const filteredClansWithSearch = computed(() => {
  if (!searchQuery.value) return store.filteredClans;
  
  const query = searchQuery.value.toLowerCase();
  return store.filteredClans.filter(clan => 
    clan.name.toLowerCase().includes(query) || 
    (clan.description && clan.description.toLowerCase().includes(query))
  );
})
</script>
