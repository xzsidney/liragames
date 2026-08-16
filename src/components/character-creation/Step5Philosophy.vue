<template>
  <div class="space-y-8 animate-fade-in">
    <header class="text-center mb-10">
      <h2 class="font-serif text-2xl md:text-3xl text-gold mb-2 drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]">Máquina de Retenção (Filosofia)</h2>
      <p class="text-gray-400 font-serif text-sm">A Besta está sempre à espreita. O que te mantém caminhando?</p>
    </header>

    <div class="space-y-6 max-w-2xl mx-auto">
      <!-- Ambição -->
      <div class="group bg-black/40 p-6 rounded-xl border border-white/10">
        <label class="block text-xs font-serif uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-gold transition-colors">Ambição (Endgame)</label>
        <p class="text-xs text-gray-500 mb-4">Qual é o seu objetivo de longo prazo? Aquilo que demorará meses para alcançar em Nocturna?</p>
        <input 
          v-model="store.form.ambition" 
          type="text" 
          placeholder="Ex: Destruir a Capela da cidade" 
          class="w-full bg-black/60 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-gold transition-all duration-300"
        />
      </div>

      <!-- Pilar -->
      <div class="group bg-black/40 p-6 rounded-xl border border-white/10">
        <label class="block text-xs font-serif uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-gold transition-colors">Pilar Humano</label>
        <p class="text-xs text-gray-500 mb-4">A pessoa mortal que ancora sua Humanidade. Quem você ainda ama?</p>
        <input 
          v-model="store.form.pillar" 
          type="text" 
          placeholder="Ex: Minha irmã mais nova, Sofia." 
          class="w-full bg-black/60 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-gold transition-all duration-300"
        />
      </div>

      <!-- História (Opcional, Lore) -->
      <div class="group bg-black/40 p-6 rounded-xl border border-white/10">
        <label class="block text-xs font-serif uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-gold transition-colors">Fragmento de Memória (Opcional)</label>
        <p class="text-xs text-gray-500 mb-4">Uma frase ou parágrafo curto sobre seu abraço ou vida passada.</p>
        <textarea 
          v-model="store.form.history" 
          rows="3" 
          placeholder="Eu não lembro da dor, apenas do frio no beco..." 
          class="w-full bg-black/60 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-gold transition-all duration-300 resize-none"
        ></textarea>
      </div>
      
      <div class="p-4 bg-blood-red/10 border border-blood-red/30 rounded-lg">
        <p class="text-xs text-red-200 text-center font-serif">
          * Nota de Sistema: Seu Desejo diário e Convicções morais serão definidos in-game pelas suas ações no Hub.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCharacterCreationStore } from '../../stores/characterCreationStore'

const store = useCharacterCreationStore()
</script>
