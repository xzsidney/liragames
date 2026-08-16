<template>
  <div class="min-h-screen demiplane-bg text-parchment font-sans relative overflow-x-hidden selection:bg-blood-red selection:text-white pb-20">
    <!-- SUBTLE NOISE/TEXTURE -->
    <div class="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay z-0" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>

    <!-- NAVBAR -->
    <nav class="relative z-20 border-b border-vamp-border bg-black/80 backdrop-blur-md sticky top-0">
      <div class="max-w-[1200px] mx-auto px-4 h-12 flex items-center justify-between">
        <button @click="router.push('/jogador/vampire')" class="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 font-serif uppercase tracking-widest transition-colors">
          <span>←</span> Meus Personagens
        </button>

        <div class="flex items-center gap-4 text-[10px] font-serif tracking-widest uppercase">
          <span class="text-gray-500">HUB DO PERSONAGEM</span>
        </div>
      </div>
    </nav>

    <!-- LOADING STATE -->
    <div v-if="loading" class="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center text-gray-400 font-serif">
      <div class="animate-spin w-8 h-8 border-2 border-blood-red border-t-transparent rounded-full mx-auto mb-4"></div>
      Invocando dados da noite...
    </div>

    <!-- MAIN HUB CONTENT -->
    <main v-else class="relative z-10 max-w-[1200px] mx-auto px-4 py-8">
      <!-- HEADER DO PERSONAGEM (STATUS VIVO) -->
      <div class="demiplane-box rounded-sm p-6 md:p-8 mb-10 relative overflow-hidden bg-gradient-to-br from-black/80 to-vamp-c1/10">

        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-vamp-border">
          <div class="flex items-center gap-6">
            <div class="w-20 h-24 bg-black/50 border border-vamp-border flex items-center justify-center shrink-0">
              <span class="text-4xl text-vamp-c2 font-serif opacity-80">☥</span>
            </div>
            <div>
              <h1 class="demiplane-title text-3xl md:text-5xl text-white">{{ character?.name }}</h1>
              <h2 class="demiplane-text text-vamp-c2 mt-1">
                {{ character?.DefinitionClan?.name || 'VAMPIRE' }} {{ character?.concept ? '— ' + character?.concept : '' }}
              </h2>
              <div class="text-[10px] text-gray-400 font-sans tracking-widest uppercase mt-1">
                Geração {{ character?.generation }}ª
              </div>
            </div>
          </div>

          <!-- PONTOS DE AÇÃO DIÁRIOS -->
          <div class="bg-black/60 border border-vamp-border rounded p-4 text-center min-w-[160px]">
            <div class="text-[10px] font-sans uppercase tracking-widest text-gray-400 mb-1">
              Energia Diária
            </div>
            <div class="text-2xl font-serif text-white flex items-center justify-center gap-2">
              <span class="text-vamp-c2">🩸</span> 1 / 1
            </div>
          </div>
        </div>

        <!-- BARRAS VITAIS (FOME, VITALIDADE, FORÇA DE VONTADE) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <!-- FOME -->
          <div class="bg-black/60 border border-vamp-border p-4 rounded">
            <div class="flex justify-between items-center mb-3">
              <span class="text-[11px] font-sans tracking-widest uppercase text-vamp-c2 font-bold">Fome</span>
              <span class="text-xs font-mono font-bold text-gray-400">{{ character?.hunger }} / 5</span>
            </div>
            <div class="flex gap-2 justify-between">
              <div 
                v-for="i in 5" 
                :key="i"
                class="flex-1 h-2 rounded-full transition-all duration-300"
                :class="i <= (character?.hunger || 0) ? 'bg-vamp-c2 shadow-[0_0_8px_rgba(192,57,43,0.8)]' : 'bg-black border border-vamp-border'"
              ></div>
            </div>
          </div>

          <!-- VITALIDADE -->
          <div class="bg-black/60 border border-vamp-border p-4 rounded">
            <div class="flex justify-between items-center mb-3">
              <span class="text-[11px] font-sans tracking-widest uppercase text-gray-400 font-bold">Vitalidade</span>
              <span class="text-xs font-mono text-gray-500">Max: {{ character?.healthMax }}</span>
            </div>
            <div class="flex gap-1.5 justify-between">
              <div 
                v-for="i in (character?.healthMax || 3)" 
                :key="i"
                class="flex-1 h-3 rounded-sm border text-[9px] flex items-center justify-center font-bold"
                :class="i <= (character?.healthDamageAggravated || 0) ? 'bg-black border-red-600 text-red-500' : (i <= (character?.healthDamageAggravated || 0) + (character?.healthDamageSuperficial || 0) ? 'bg-black border-yellow-600 text-yellow-500' : 'bg-black border-vamp-border/50')"
              >
                <span v-if="i <= (character?.healthDamageAggravated || 0)">X</span>
                <span v-else-if="i <= (character?.healthDamageAggravated || 0) + (character?.healthDamageSuperficial || 0)">/</span>
              </div>
            </div>
          </div>

          <!-- FORÇA DE VONTADE -->
          <div class="bg-black/60 border border-vamp-border p-4 rounded">
            <div class="flex justify-between items-center mb-3">
              <span class="text-[11px] font-sans tracking-widest uppercase text-gray-400 font-bold">Força de Vontade</span>
              <span class="text-xs font-mono text-gray-500">Max: {{ character?.willpowerMax }}</span>
            </div>
            <div class="flex gap-1.5 justify-between">
              <div 
                v-for="i in (character?.willpowerMax || 3)" 
                :key="i"
                class="flex-1 h-3 rounded-sm border text-[9px] flex items-center justify-center font-bold"
                :class="i <= (character?.willpowerDamageAggravated || 0) ? 'bg-black border-red-600 text-red-500' : (i <= (character?.willpowerDamageAggravated || 0) + (character?.willpowerDamageSuperficial || 0) ? 'bg-black border-yellow-600 text-yellow-500' : 'bg-black border-vamp-border/50')"
              >
                <span v-if="i <= (character?.willpowerDamageAggravated || 0)">X</span>
                <span v-else-if="i <= (character?.willpowerDamageAggravated || 0) + (character?.willpowerDamageSuperficial || 0)">/</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- MENU CENTRAL DE NAVEGAÇÃO DO PERSONAGEM (4 CARDS) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- 1. FICHA COMPLETA -->
        <div 
          @click="router.push(`/personagem/ficha?id=${characterId}`)"
          class="demiplane-box relative flex flex-col p-6 overflow-hidden group cursor-pointer border-l-4 border-l-vamp-c2 hover:border-white/20 transition-all hover:-translate-y-1 min-h-[200px]"
        >
          <div class="text-3xl text-vamp-c2 mb-4 group-hover:scale-110 transition-transform origin-left">📄</div>
          <h3 class="font-sans font-bold text-lg text-white mb-2 uppercase tracking-wide">Ficha Completa</h3>
          <p class="text-[11px] text-gray-400 font-sans tracking-wide leading-relaxed">
            Acesse o dossier e atributos.
          </p>
        </div>

        <!-- 2. INVENTÁRIO & LOJA -->
        <div 
          @click="router.push(`/personagem/inventario?id=${characterId}`)"
          class="demiplane-box relative flex flex-col p-6 overflow-hidden group cursor-pointer border-l-4 border-l-vamp-c1 hover:border-white/20 transition-all hover:-translate-y-1 min-h-[200px]"
        >
          <div class="text-3xl text-vamp-c1 mb-4 group-hover:scale-110 transition-transform origin-left">⚔️</div>
          <h3 class="font-sans font-bold text-lg text-white mb-2 uppercase tracking-wide">Inventário & Loja</h3>
          <p class="text-[11px] text-gray-400 font-sans tracking-wide leading-relaxed">
            Armas e suprimentos na cidade.
          </p>
        </div>

        <!-- 3. FEED DE NOTÍCIAS -->
        <div 
          @click="router.push(`/personagem/noticias?id=${characterId}`)"
          class="demiplane-box relative flex flex-col p-6 overflow-hidden group cursor-pointer border-l-4 border-l-[#1e88e5] hover:border-white/20 transition-all hover:-translate-y-1 min-h-[200px]"
        >
          <div class="text-3xl text-[#1e88e5] mb-4 group-hover:scale-110 transition-transform origin-left">📰</div>
          <h3 class="font-sans font-bold text-lg text-white mb-2 uppercase tracking-wide">Gazeta da Noite</h3>
          <p class="text-[11px] text-gray-400 font-sans tracking-wide leading-relaxed">
            Notícias do submundo de São Paulo.
          </p>
        </div>

        <!-- 4. CENTRAL DE AVENTURAS -->
        <div 
          @click="router.push(`/personagem/aventuras?id=${characterId}`)"
          class="demiplane-box relative flex flex-col p-6 overflow-hidden group cursor-pointer border-l-4 border-l-vamp-c2 hover:border-white/20 transition-all hover:-translate-y-1 min-h-[200px]"
        >
          <div class="text-3xl text-vamp-c2 mb-4 group-hover:scale-110 transition-transform origin-left animate-pulse">📜</div>
          <h3 class="font-sans font-bold text-lg text-white mb-2 uppercase tracking-wide">Jogar (Solo)</h3>
          <p class="text-[11px] text-gray-400 font-sans tracking-wide leading-relaxed">
            Explore a noite e suas consequências.
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const route = useRoute()

const loading = ref(true)
const character = ref<any>(null)
const characterId = ref<string>('')

const fetchCharacter = async () => {
  try {
    const id = (route.query.id as string) || localStorage.getItem('lira_active_character_id')
    if (!id) {
      router.push('/jogador/vampire')
      return
    }
    characterId.value = id
    localStorage.setItem('lira_active_character_id', id)

    const res = await api.get(`/api/character-vampires/${id}`)
    character.value = res.data
  } catch (err) {
    console.error('Erro ao buscar personagem:', err)
    router.push('/jogador/vampire')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCharacter()
})
</script>
