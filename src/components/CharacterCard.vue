<template>
  <div 
    class="char-card relative bg-bg-card border border-border-dark rounded-xl overflow-hidden cursor-pointer transition-all duration-500 transform hover:-translate-y-2 hover:shadow-[0_16px_48px_rgba(0,0,0,0.8),0_0_24px_rgba(139,0,0,0.4)] hover:border-gold-dim group"
    @click="$emit('click')"
  >
    <!-- Background Image -->
    <div class="relative w-full aspect-[3/4] overflow-hidden">
      <img 
        :src="character.avatarUrl ? (character.avatarUrl.startsWith('http') || character.avatarUrl.startsWith('data:')) ? character.avatarUrl : API_BASE_URL + character.avatarUrl : 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'600\'%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'%231a0b12\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' fill=\'%23c9a84c\' font-family=\'serif\' font-size=\'48\' dominant-baseline=\'middle\' text-anchor=\'middle\'%3E%E2%98%A5%3C/text%3E%3C/svg%3E'" 
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 saturate-[0.85] group-hover:saturate-100"
        @error="handleImageError"
      />
      <!-- Gradiente por cima da imagem -->
      <div class="absolute bottom-0 left-0 right-0 h-3/5 bg-gradient-to-t from-bg-deep via-bg-deep/80 to-transparent pointer-events-none"></div>
    </div>

    <!-- Humanidade (Bolinhas vermelhas no topo) -->
    <div class="absolute top-3 right-3 flex gap-1 flex-wrap justify-end max-w-[80px]">
      <div 
        v-for="i in 10" 
        :key="i"
        class="w-2 h-2 rounded-full shadow-[0_0_4px_rgba(139,0,0,0.4)]"
        :class="i <= character.humanity ? 'bg-blood-bright' : 'bg-transparent border border-blood/40'"
      ></div>
    </div>

    <!-- Informações da Base -->
    <div class="absolute bottom-0 left-0 right-0 p-5 z-10">
      <!-- Badge do Clã -->
      <div class="inline-flex items-center gap-2 font-serif text-[10px] tracking-widest uppercase px-3 py-1 rounded-full border border-border-mid bg-black/40 text-gold-bright mb-2">
        <span>👑</span> <!-- Icon placeholder -->
        {{ character.DefinitionClan?.name || 'Desconhecido' }}
      </div>
      
      <h3 class="font-serif text-lg font-bold text-parchment leading-tight mb-1 drop-shadow-md">
        {{ character.name }}
      </h3>
      
      <p class="font-serif italic text-xs text-text-dim">
        {{ character.concept || 'Membro da Camarilla' }}
      </p>
    </div>

    <!-- CTA no Hover -->
    <div class="absolute inset-0 flex items-center justify-center bg-bg-deep/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl">
      <span class="font-serif text-sm tracking-[3px] text-gold uppercase drop-shadow-[0_0_8px_rgba(201,168,76,0.6)]">Abrir Ficha</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  if (target) target.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'600\'%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'%231a0b12\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' fill=\'%23c9a84c\' font-family=\'serif\' font-size=\'48\' dominant-baseline=\'middle\' text-anchor=\'middle\'%3E%E2%98%A5%3C/text%3E%3C/svg%3E';
}

import { API_BASE_URL } from '../services/api'

defineProps<{
  character: any;
}>()

defineEmits(['click'])
</script>

<style scoped>
/* Scoped styles para manter o isolamento se necessário, 
mas todo o visual veio do Tailwind */
</style>
