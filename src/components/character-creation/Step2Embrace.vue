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

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="clan in store.filteredClans" 
          :key="clan.id"
          @click="store.form.clanId = clan.id"
          class="cursor-pointer relative flex flex-col h-full overflow-hidden rounded-xl border transition-all duration-500 group/card"
          :class="store.form.clanId === clan.id ? 'border-blood-red bg-gradient-to-b from-blood-red/20 to-black shadow-[0_0_20px_rgba(139,0,0,0.4)] scale-[1.02]' : 'border-white/10 bg-black/60 hover:border-white/30 hover:bg-black/80'"
        >
          <!-- Background image (placeholder ou logo do clã, se tiver no bd) -->
          <div class="h-24 w-full bg-gradient-to-br from-black to-gray-900 border-b border-white/5 relative flex items-center justify-center overflow-hidden">
            <span class="font-serif text-4xl opacity-20 group-hover/card:opacity-40 transition-opacity" :class="store.form.clanId === clan.id ? 'text-blood-red' : 'text-gray-500'">
              {{ clan.name.charAt(0) }}
            </span>
          </div>
          
          <div class="p-5 flex-grow flex flex-col">
            <h3 class="font-serif text-xl mb-2 text-center" :class="store.form.clanId === clan.id ? 'text-white' : 'text-gold-dim'">{{ clan.name }}</h3>
            <p class="text-xs text-gray-400 text-center flex-grow line-clamp-3 mb-4">{{ clan.description || 'Uma linhagem de vampiros antigos.' }}</p>
            
            <div class="border-t border-white/10 pt-3 mt-auto">
              <p class="text-[10px] text-center uppercase tracking-widest text-gray-500 mb-2">Bônus de Sistema</p>
              <div class="flex justify-center gap-2">
                <span class="bg-black border border-white/10 text-[10px] px-2 py-1 rounded text-gray-300">Disciplinas +1</span>
              </div>
            </div>
          </div>
          
          <!-- Selected border glow -->
          <div v-if="store.form.clanId === clan.id" class="absolute inset-0 border-2 border-blood-red rounded-xl pointer-events-none"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCharacterCreationStore } from '../../stores/characterCreationStore'

const store = useCharacterCreationStore()
</script>
