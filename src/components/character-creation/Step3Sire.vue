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
      <div class="group bg-black/40 p-6 rounded-xl border border-white/10">
        <label class="block text-xs font-serif uppercase tracking-wider text-gray-400 mb-2">Pacote de Vantagens e Defeitos</label>
        <p class="text-xs text-gray-500 mb-4">Escolha os fardos e recursos que você traz da vida mortal para as noites.</p>
        
        <div class="space-y-3">
          <!-- Opção Limpa (Sempre disponível) -->
          <label class="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-black/20 hover:bg-black/50 cursor-pointer transition-colors">
            <input type="radio" v-model="store.form.backgroundId" value="none" class="text-blood-red bg-black border-white/20 focus:ring-blood-red" />
            <div>
              <p class="font-serif text-sm text-gray-200">Nenhum (Modo Limpo)</p>
              <p class="text-xs text-gray-500">Sem recursos extras, mas sem inimigos no seu calcanhar.</p>
            </div>
          </label>

          <!-- Pacotes Dinâmicos -->
          <label 
            v-for="pkg in store.backgroundPackages" 
            :key="pkg.id"
            class="flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer"
            :class="store.form.backgroundId === pkg.id ? 'border-blood-red bg-blood-red/10' : 'border-white/10 bg-black/20 hover:bg-black/50'"
          >
            <input type="radio" v-model="store.form.backgroundId" :value="pkg.id" class="text-blood-red bg-black border-white/20 focus:ring-blood-red" />
            <div>
              <p class="font-serif text-sm" :class="store.form.backgroundId === pkg.id ? 'text-white' : 'text-gray-200'">{{ pkg.name }}</p>
              <p class="text-xs text-gray-500">{{ pkg.description }}</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCharacterCreationStore } from '../../stores/characterCreationStore'

const store = useCharacterCreationStore()

onMounted(() => {
  if (store.form.clanId) {
    store.fetchAvailableSires(store.form.clanId)
  }
})
</script>
