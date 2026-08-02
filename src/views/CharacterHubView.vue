<template>
  <div class="min-h-screen bg-[#050505] text-parchment font-sans relative overflow-x-hidden selection:bg-blood-red selection:text-white">
    <!-- BACKGROUND ATMOSPHERE -->
    <div class="fixed inset-0 pointer-events-none opacity-20 mix-blend-overlay z-0" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>
    <div class="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[450px] bg-blood-red/15 blur-[160px] rounded-full pointer-events-none z-0"></div>

    <!-- NAVBAR -->
    <nav class="relative z-20 border-b border-white/10 bg-black/70 backdrop-blur-md sticky top-0">
      <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3 cursor-pointer" @click="router.push('/jogador/vampire')">
          <button class="text-xs text-gray-400 hover:text-white flex items-center gap-1 font-serif uppercase tracking-wider">
            <span>←</span> Dossiê de Personagens
          </button>
        </div>

        <div class="flex items-center gap-4 text-xs font-serif tracking-widest uppercase">
          <span class="text-gold-dim">{{ character?.name }}</span>
          <span class="text-gray-600">|</span>
          <span class="text-blood-red font-semibold">{{ character?.DefinitionClan?.name || 'Vampiro' }}</span>
        </div>
      </div>
    </nav>

    <!-- LOADING STATE -->
    <div v-if="loading" class="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center text-gray-400 font-serif">
      <div class="animate-spin w-8 h-8 border-2 border-blood-red border-t-transparent rounded-full mx-auto mb-4"></div>
      Invocando dados da noite...
    </div>

    <!-- MAIN HUB CONTENT -->
    <main v-else class="relative z-10 max-w-7xl mx-auto px-6 py-10">
      <!-- HEADER DO PERSONAGEM (STATUS VIVO) -->
      <div class="bg-black/70 border border-white/10 rounded-2xl p-6 md:p-8 mb-10 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.8)] relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-blood-red/10 blur-[80px] rounded-full pointer-events-none"></div>

        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <span class="px-2.5 py-1 bg-blood-red/20 border border-blood-red/40 text-blood-red text-[11px] font-serif uppercase tracking-widest rounded-full">
                {{ character?.DefinitionClan?.name || 'Sem Clã' }}
              </span>
              <span class="text-xs text-gray-400 font-mono">
                Geração {{ character?.generation }}ª
              </span>
            </div>
            <h1 class="font-serif text-3xl md:text-5xl text-gold-dim tracking-wide drop-shadow-md">
              {{ character?.name }}
            </h1>
            <p class="text-gray-400 text-sm italic font-serif mt-1">
              "{{ character?.concept || 'Conceito não informado' }}"
            </p>
          </div>

          <!-- PONTOS DE AÇÃO DIÁRIOS -->
          <div class="bg-white/5 border border-white/10 rounded-xl p-4 text-center min-w-[180px]">
            <div class="text-[10px] font-serif uppercase tracking-widest text-gray-400 mb-1">
              Energia da Noite
            </div>
            <div class="text-2xl font-serif text-gold flex items-center justify-center gap-1">
              <span class="text-blood-red">🩸</span> 1 / 1
            </div>
            <div class="text-[10px] text-gray-500 mt-1 italic">
              Ponto de Ação Solo Disponível
            </div>
          </div>
        </div>

        <!-- BARRAS VITAIS (FOME, VITALIDADE, FORÇA DE VONTADE) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <!-- FOME -->
          <div class="bg-black/50 border border-blood-red/30 rounded-xl p-4">
            <div class="flex justify-between items-center mb-2">
              <span class="text-xs font-serif tracking-wider uppercase text-blood-red font-semibold flex items-center gap-1">
                🩸 Fome
              </span>
              <span class="text-xs font-mono font-bold text-blood-red">{{ character?.hunger }} / 5</span>
            </div>
            <div class="flex gap-2 justify-between">
              <div 
                v-for="i in 5" 
                :key="i"
                class="flex-1 h-3 rounded-full border transition-all duration-300"
                :class="i <= (character?.hunger || 0) ? 'bg-blood-red border-blood-red shadow-[0_0_8px_rgba(139,0,0,0.8)]' : 'bg-black border-white/20'"
              ></div>
            </div>
          </div>

          <!-- VITALIDADE -->
          <div class="bg-black/50 border border-white/10 rounded-xl p-4">
            <div class="flex justify-between items-center mb-2">
              <span class="text-xs font-serif tracking-wider uppercase text-gray-300 font-semibold">
                ❤️ Vitalidade
              </span>
              <span class="text-xs font-mono text-gray-400">Max: {{ character?.healthMax }}</span>
            </div>
            <div class="flex gap-1.5 justify-between">
              <div 
                v-for="i in (character?.healthMax || 3)" 
                :key="i"
                class="flex-1 h-3 rounded border text-[9px] flex items-center justify-center font-bold"
                :class="i <= (character?.healthDamageAggravated || 0) ? 'bg-red-950 border-red-600 text-red-500' : (i <= (character?.healthDamageAggravated || 0) + (character?.healthDamageSuperficial || 0) ? 'bg-yellow-950 border-yellow-600 text-yellow-500' : 'bg-black border-white/20')"
              >
                <span v-if="i <= (character?.healthDamageAggravated || 0)">X</span>
                <span v-else-if="i <= (character?.healthDamageAggravated || 0) + (character?.healthDamageSuperficial || 0)">/</span>
              </div>
            </div>
          </div>

          <!-- FORÇA DE VONTADE -->
          <div class="bg-black/50 border border-white/10 rounded-xl p-4">
            <div class="flex justify-between items-center mb-2">
              <span class="text-xs font-serif tracking-wider uppercase text-gold-dim font-semibold">
                🧠 Força de Vontade
              </span>
              <span class="text-xs font-mono text-gold-dim">Max: {{ character?.willpowerMax }}</span>
            </div>
            <div class="flex gap-1.5 justify-between">
              <div 
                v-for="i in (character?.willpowerMax || 3)" 
                :key="i"
                class="flex-1 h-3 rounded border text-[9px] flex items-center justify-center font-bold"
                :class="i <= (character?.willpowerDamageAggravated || 0) ? 'bg-red-950 border-red-600 text-red-500' : (i <= (character?.willpowerDamageAggravated || 0) + (character?.willpowerDamageSuperficial || 0) ? 'bg-yellow-950 border-yellow-600 text-yellow-500' : 'bg-black border-white/20')"
              >
                <span v-if="i <= (character?.willpowerDamageAggravated || 0)">X</span>
                <span v-else-if="i <= (character?.willpowerDamageAggravated || 0) + (character?.willpowerDamageSuperficial || 0)">/</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- MENU CENTRAL DE NAVEGAÇÃO DO PERSONAGEM (4 CARDS) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- 1. FICHA COMPLETA -->
        <div 
          @click="router.push(`/personagem/ficha?id=${characterId}`)"
          class="group bg-black/60 border border-white/10 hover:border-gold/60 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow-xl hover:shadow-[0_0_25px_rgba(212,175,55,0.15)] flex flex-col justify-between min-h-[220px]"
        >
          <div>
            <div class="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold text-2xl mb-4 group-hover:scale-110 transition-transform">
              📄
            </div>
            <h3 class="font-serif text-xl text-gold-dim group-hover:text-gold transition-colors mb-2">
              Ficha do Personagem
            </h3>
            <p class="text-xs text-gray-400 leading-relaxed">
              Consulte os Atributos, Perícias, Disciplinas, Qualidades e evolua seus traços com XP.
            </p>
          </div>
          <div class="mt-4 text-xs font-serif text-gold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>Acessar Ficha</span>
            <span>→</span>
          </div>
        </div>

        <!-- 2. INVENTÁRIO & LOJA -->
        <div 
          @click="router.push(`/personagem/inventario?id=${characterId}`)"
          class="group bg-black/60 border border-white/10 hover:border-blood-red/60 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow-xl hover:shadow-[0_0_25px_rgba(139,0,0,0.2)] flex flex-col justify-between min-h-[220px]"
        >
          <div>
            <div class="w-12 h-12 rounded-xl bg-blood-red/10 border border-blood-red/30 flex items-center justify-center text-blood-red text-2xl mb-4 group-hover:scale-110 transition-transform">
              ⚔️
            </div>
            <h3 class="font-serif text-xl text-parchment group-hover:text-blood-red transition-colors mb-2">
              Inventário & Loja
            </h3>
            <p class="text-xs text-gray-400 leading-relaxed">
              Gerencie suas armas, armaduras e suprimentos ou compre novos equipamentos na cidade.
            </p>
          </div>
          <div class="mt-4 text-xs font-serif text-blood-red flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>Abrir Mercado</span>
            <span>→</span>
          </div>
        </div>

        <!-- 3. FEED DE NOTÍCIAS -->
        <div 
          @click="router.push(`/personagem/noticias?id=${characterId}`)"
          class="group bg-black/60 border border-white/10 hover:border-blue-500/60 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow-xl hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] flex flex-col justify-between min-h-[220px]"
        >
          <div>
            <div class="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 text-2xl mb-4 group-hover:scale-110 transition-transform">
              📰
            </div>
            <h3 class="font-serif text-xl text-parchment group-hover:text-blue-400 transition-colors mb-2">
              Feed de Notícias
            </h3>
            <p class="text-xs text-gray-400 leading-relaxed">
              Leia o jornal urbano fictício e os desdobramentos gerados pelas ações de outros vampiros.
            </p>
          </div>
          <div class="mt-4 text-xs font-serif text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>Ler Notícias</span>
            <span>→</span>
          </div>
        </div>

        <!-- 4. CENTRAL DE AVENTURAS -->
        <div 
          @click="router.push(`/personagem/aventuras?id=${characterId}`)"
          class="group bg-black/60 border border-blood-red/40 hover:border-blood-red rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow-[0_0_20px_rgba(139,0,0,0.15)] hover:shadow-[0_0_30px_rgba(139,0,0,0.3)] flex flex-col justify-between min-h-[220px]"
        >
          <div>
            <div class="w-12 h-12 rounded-xl bg-blood-red/20 border border-blood-red/50 flex items-center justify-center text-blood-red text-2xl mb-4 group-hover:scale-110 transition-transform animate-pulse">
              📜
            </div>
            <h3 class="font-serif text-xl text-gold-dim group-hover:text-gold transition-colors mb-2">
              Central de Aventuras
            </h3>
            <p class="text-xs text-gray-400 leading-relaxed">
              Inicie a missão solo da semana ou consulte o histórico e os diários de bordo concluídos.
            </p>
          </div>
          <div class="mt-4 text-xs font-serif text-blood-red flex items-center gap-1 group-hover:translate-x-1 transition-transform font-bold">
            <span>Caçar na Noite</span>
            <span>→</span>
          </div>
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
