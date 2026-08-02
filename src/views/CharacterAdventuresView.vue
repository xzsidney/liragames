<template>
  <div class="min-h-screen bg-[#050505] text-parchment font-sans relative overflow-x-hidden selection:bg-blood-red selection:text-white">
    <!-- BACKGROUND ATMOSPHERE -->
    <div class="fixed inset-0 pointer-events-none opacity-20 mix-blend-overlay z-0" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>
    <div class="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[450px] bg-blood-red/15 blur-[160px] rounded-full pointer-events-none z-0"></div>

    <!-- NAVBAR -->
    <nav class="relative z-20 border-b border-white/10 bg-black/70 backdrop-blur-md sticky top-0">
      <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <button @click="router.push(`/personagem/hub?id=${characterId}`)" class="text-xs text-gray-400 hover:text-white flex items-center gap-1 font-serif uppercase tracking-wider">
          <span>←</span> Voltar ao Hub
        </button>

        <div class="flex items-center gap-4 text-xs font-serif tracking-widest uppercase">
          <span class="text-gold-dim">Central de Aventuras Solo</span>
        </div>
      </div>
    </nav>

    <!-- MAIN CONTENT -->
    <main class="relative z-10 max-w-5xl mx-auto px-6 py-10 space-y-10">
      <!-- HEADER -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-white/10">
        <div>
          <h1 class="font-serif text-3xl md:text-5xl text-gold-dim tracking-wide">
            Caçada & Investigações da Semana
          </h1>
          <p class="text-xs text-gray-400 italic font-serif mt-1">
            Escolha uma missão para consumir seu ponto de ação diário e avançar na narrativa.
          </p>
        </div>

        <div class="bg-blood-red/20 border border-blood-red/40 px-4 py-2 rounded-xl text-center">
          <span class="text-[10px] font-serif uppercase tracking-widest text-blood-red block">Energia Diária</span>
          <span class="text-lg font-serif text-white font-bold">1 / 1 Ponto</span>
        </div>
      </div>

      <!-- MISSÃO PRINCIPAL DA SEMANA (CARD DE DESTAQUE) -->
      <div class="bg-black/80 border border-blood-red/50 hover:border-blood-red rounded-2xl p-8 backdrop-blur-md relative overflow-hidden shadow-[0_0_30px_rgba(139,0,0,0.2)]">
        <div class="absolute top-0 right-0 w-80 h-80 bg-blood-red/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div class="flex items-center gap-3 mb-4">
          <span class="px-3 py-1 bg-blood-red text-white text-[10px] font-serif uppercase tracking-widest font-bold rounded-full">
            Missão Principal
          </span>
          <span class="text-xs text-gold font-serif">Dificuldade: Média • V5</span>
        </div>

        <h2 class="font-serif text-2xl md:text-3xl text-parchment mb-3">
          Capítulo 1: O Segredo debaixo do Anhangabaú
        </h2>
        <p class="text-sm text-gray-300 font-serif leading-relaxed mb-6">
          Um mensageiro do Primógeno Nosferatu foi interceptado nas galerias subterrâneas de São Paulo. Você foi encarregado de investigar o local antes que os Caçadores da Segunda Inquisição descubram o refúgio.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-xs bg-white/5 p-4 rounded-xl border border-white/5 font-serif">
          <div>Recompensa: <strong class="text-gold">+10 XP</strong></div>
          <div>Itens Possíveis: <strong class="text-parchment">Chave Antiga, Relatório</strong></div>
          <div>Custo: <strong class="text-blood-red">1 Ponto de Ação</strong></div>
        </div>

        <button 
          @click="startSoloAdventure('cap1')"
          class="w-full md:w-auto px-8 py-3.5 bg-blood-red hover:bg-red-700 text-white font-serif text-sm uppercase tracking-widest rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(139,0,0,0.5)] flex items-center justify-center gap-3 font-semibold"
        >
          <span>Iniciar Aventura Solo</span>
          <span>→</span>
        </button>
      </div>

      <!-- HISTÓRICO DE DIÁRIOS DE BORDO CONCLUÍDOS -->
      <div class="bg-black/60 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md">
        <h3 class="font-serif text-xl text-gold-dim border-b border-white/10 pb-3 mb-6">
          📜 Diário de Bordo & Registro de Caçadas
        </h3>

        <div class="space-y-4">
          <div class="bg-white/5 border border-white/5 rounded-xl p-4 text-xs text-gray-400 italic">
            Nenhuma missão foi concluída anteriormente por este personagem. Sua jornada começa hoje nas sombras.
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const characterId = ref<string>('')

const startSoloAdventure = (adventureId: string) => {
  router.push(`/aventura/inicio?id=${adventureId}&characterId=${characterId.value}`)
}

onMounted(() => {
  characterId.value = (route.query.id as string) || localStorage.getItem('lira_active_character_id') || ''
})
</script>
