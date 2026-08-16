<template>
  <div class="space-y-8 animate-fade-in">
    <header class="text-center mb-10">
      <h2 class="font-serif text-2xl md:text-3xl text-gold mb-2 drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]">Identidade & Vida Mortal</h2>
      <p class="text-gray-400 font-serif text-sm">Quem você era antes da noite engolir sua alma?</p>
    </header>

    <div class="space-y-6 max-w-2xl mx-auto">
      <!-- Nome -->
      <div class="group">
        <label class="block text-xs font-serif uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-gold transition-colors">Nome do Personagem</label>
        <input 
          v-model="store.form.name" 
          type="text" 
          placeholder="Ex: Kael Lira" 
          class="w-full bg-black/60 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-blood-red focus:ring-1 focus:ring-blood-red/50 transition-all duration-300 shadow-inner"
        />
      </div>

      <!-- Arquétipo / Profissão -->
      <div class="group">
        <label class="block text-xs font-serif uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-gold transition-colors">Profissão / Vida Mortal</label>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            v-for="pkg in store.professionPackages" 
            :key="pkg.id"
            @click="store.form.concept = pkg.id"
            class="cursor-pointer relative overflow-hidden rounded-xl border p-4 transition-all duration-300 group/card"
            :class="store.form.concept === pkg.id ? 'border-blood-red bg-blood-red/10 shadow-[0_0_15px_rgba(139,0,0,0.3)]' : 'border-white/10 bg-black/40 hover:border-white/30 hover:bg-black/60'"
          >
            <!-- Background fx -->
            <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
            
            <h3 class="font-serif text-lg mb-1" :class="store.form.concept === pkg.id ? 'text-white' : 'text-gray-300'">{{ pkg.name }}</h3>
            <p class="text-xs text-gray-500 font-sans line-clamp-2">{{ pkg.description || 'Uma vida mundana normal...' }}</p>
            
            <div class="mt-3 flex items-center justify-between text-[10px] uppercase tracking-widest">
              <span class="text-gold-dim border border-gold-dim/30 px-2 py-0.5 rounded-full">Profissão</span>
              <span v-if="store.form.concept === pkg.id" class="text-blood-red font-bold">Selecionado</span>
            </div>
          </div>
        </div>
        
        <p v-if="store.professionPackages.length === 0" class="text-sm text-gray-500 italic mt-2">Carregando profissões do servidor...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCharacterCreationStore } from '../../stores/characterCreationStore'

const store = useCharacterCreationStore()
</script>
