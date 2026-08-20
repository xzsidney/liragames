<template>
  <div class="space-y-8 animate-fade-in">
    <header class="text-center mb-10">
      <h2 class="font-serif text-2xl md:text-3xl text-gold mb-2 drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]">Nascimento Sombrio</h2>
      <p class="text-gray-400 font-serif text-sm">Sua vida mortal acabou. Esta é sua nova forma.</p>
    </header>

    <div class="max-w-3xl mx-auto bg-black/80 border border-white/20 rounded-xl p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
      <!-- Background Texture -->
      <div class="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blood-red/40 via-black to-black pointer-events-none"></div>

      <div class="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <!-- Identidade Resumo -->
        <div class="space-y-4">
          <div>
            <h3 class="text-[10px] text-gray-500 uppercase tracking-widest font-serif mb-1">Nome</h3>
            <p class="text-xl font-serif text-white">{{ store.form.name || 'Sem Nome' }}</p>
          </div>
          
          <div>
            <h3 class="text-[10px] text-gray-500 uppercase tracking-widest font-serif mb-1">Conceito (Vida Mortal)</h3>
            <p class="text-md text-gray-300">{{ professionName }}</p>
          </div>

          <div>
            <h3 class="text-[10px] text-gray-500 uppercase tracking-widest font-serif mb-1">Clã</h3>
            <p class="text-lg font-serif text-gold">{{ clanName }}</p>
          </div>

          <div>
            <h3 class="text-[10px] text-gray-500 uppercase tracking-widest font-serif mb-1">Tipo de Predador</h3>
            <p class="text-md text-gray-300">{{ predatorName }}</p>
          </div>
        </div>

        <!-- Estatísticas Derivadas (Calculadas Automagicamente) -->
        <div class="bg-black/50 border border-white/10 rounded-lg p-5 space-y-5">
          <h3 class="text-center text-xs font-serif uppercase tracking-widest text-gold-dim border-b border-white/10 pb-2 mb-4">Núcleo do Personagem</h3>

          <div class="flex justify-between items-center">
            <span class="text-sm font-serif text-gray-300">Vitalidade (Físico + 3)</span>
            <div class="flex gap-1">
              <span v-for="i in stats.health" :key="i" class="w-3 h-3 bg-black border border-white/30 transform rotate-45"></span>
            </div>
          </div>

          <div class="flex justify-between items-center">
            <span class="text-sm font-serif text-gray-300">Força de Vontade</span>
            <div class="flex gap-1">
              <span v-for="i in stats.willpower" :key="i" class="w-3 h-3 bg-black border border-white/30 transform rotate-45"></span>
            </div>
          </div>

          <div class="flex justify-between items-center">
            <span class="text-sm font-serif text-gray-300">Fome</span>
            <div class="flex gap-1">
              <span class="w-3 h-3 bg-blood-red border border-blood-red transform rotate-45 shadow-[0_0_5px_rgba(139,0,0,0.8)]"></span>
              <span v-for="i in 4" :key="i" class="w-3 h-3 bg-black border border-red-900/50 transform rotate-45"></span>
            </div>
          </div>

          <div class="flex justify-between items-center pt-2 border-t border-white/5">
            <span class="text-sm font-serif text-gray-300">Humanidade</span>
            <span class="text-lg font-serif text-gold">{{ stats.humanity }}</span>
          </div>
        </div>

      </div>

      <div class="relative z-10 mt-8 pt-6 border-t border-white/10 text-center">
        <p class="text-xs text-gray-400 italic font-serif">
          Todos os Atributos e Perícias foram distribuídos secretamente pelo Motor do Jogo com base na sua Vida Mortal e Caçada.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCharacterCreationStore } from '../../stores/characterCreationStore'

const store = useCharacterCreationStore()

const stats = computed(() => store.derivedStats)

const professionName = computed(() => {
  const prof = store.packages.find(p => p.id === store.form.concept)
  return prof ? prof.name : (store.form.concept || 'Não Definido')
})

const clanName = computed(() => {
  const clan = store.clans.find(c => c.id === store.form.clanId)
  return clan ? clan.name : 'Sangue-Fraco / Desconhecido'
})

const predatorName = computed(() => {
  const pred = store.packages.find(p => p.id === store.form.predatorId)
  return pred ? pred.name : 'Nenhum'
})
</script>
