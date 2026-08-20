<template>
  <div class="space-y-8 animate-fade-in flex flex-col items-center justify-center min-h-[50vh]">
    <header class="text-center mb-8">
      <h2 class="font-serif text-3xl md:text-4xl text-gold mb-4 drop-shadow-[0_0_15px_rgba(212,175,55,0.4)] tracking-wide">
        NASCIMENTO SOMBRIO
      </h2>
      <p class="text-gray-300 font-serif text-lg italic">
        "Sua vida mortal acabou. Esta é sua nova forma."
      </p>
    </header>

    <div class="max-w-md w-full mx-auto bg-black/60 border border-gold/30 rounded-2xl p-8 backdrop-blur-md shadow-[0_0_40px_rgba(139,0,0,0.15)] relative overflow-hidden text-center">
      <!-- Background Glow -->
      <div class="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blood-red/30 via-black to-black pointer-events-none"></div>

      <div class="relative z-10 space-y-6">
        <div>
          <h3 class="text-xs text-gray-500 uppercase tracking-widest font-serif mb-2">Seu Nome na Noite</h3>
          <p class="text-2xl font-serif text-white drop-shadow-md">{{ store.form.name || 'Sem Nome' }}</p>
        </div>
        
        <div class="h-px w-24 bg-gradient-to-r from-transparent via-gold/50 to-transparent mx-auto"></div>

        <div>
          <h3 class="text-xs text-gray-500 uppercase tracking-widest font-serif mb-2">Seu Sangue</h3>
          <p class="text-xl font-serif text-blood-red font-bold tracking-wider">{{ clanName }}</p>
        </div>
      </div>
    </div>
    
    <div class="text-center mt-6">
      <p class="text-sm text-gray-400 font-serif mb-2">Clique no botão abaixo para gerar sua Ficha Completa e entrar no Hub.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCharacterCreationStore } from '../../stores/characterCreationStore'

const store = useCharacterCreationStore()

const clanName = computed(() => {
  const clan = store.clans.find(c => c.id === store.form.clanId)
  return clan ? clan.name : 'Sangue-Fraco / Desconhecido'
})
</script>
