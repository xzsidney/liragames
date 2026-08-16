<template>
  <div class="min-h-screen demiplane-bg text-parchment font-sans relative overflow-x-hidden selection:bg-blood-red selection:text-white pb-20">
    <!-- SUBTLE NOISE/TEXTURE -->
    <div class="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay z-0" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>

    <!-- NAVBAR -->
    <nav class="relative z-20 border-b border-vamp-border bg-black/80 backdrop-blur-md sticky top-0">
      <div class="max-w-[1200px] mx-auto px-4 h-12 flex items-center justify-between">
        <button @click="router.push(`/personagem/hub?id=${characterId}`)" class="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 font-serif uppercase tracking-widest transition-colors">
          <span>←</span> Voltar ao Hub
        </button>

        <div class="flex items-center gap-4 text-[10px] font-serif tracking-widest uppercase">
          <span class="text-gray-500">HUB DE AVENTURA</span>
        </div>
      </div>
    </nav>

    <!-- MAIN CONTENT -->
    <main class="relative z-10 max-w-[1200px] mx-auto px-4 py-8 space-y-10">
      <!-- HEADER -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-vamp-border">
        <div>
          <h1 class="demiplane-title text-3xl md:text-5xl text-white">
            Caçada & Investigações da Semana
          </h1>
          <h2 class="demiplane-text text-vamp-c2 mt-1">
            Escolha uma missão para consumir seu ponto de ação diário e avançar na narrativa.
          </h2>
        </div>

        <div class="bg-black/60 border border-vamp-c2 rounded px-6 py-4 text-center">
          <span class="text-[10px] font-sans font-bold uppercase tracking-widest text-vamp-c2 block">Energia Diária</span>
          <span class="text-xl font-serif text-white mt-1 block">1 / 1 Ponto</span>
        </div>
      </div>

      <!-- MISSÃO PRINCIPAL DA SEMANA (CARD DE DESTAQUE) -->
      <div class="demiplane-box rounded-sm p-8 hover:border-vamp-c2/80 transition-all duration-300 relative overflow-hidden bg-gradient-to-tr from-black to-vamp-c2/5">
        <div class="absolute top-0 right-0 w-80 h-80 bg-vamp-c2/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div class="flex items-center gap-3 mb-4">
          <span class="px-3 py-1 bg-vamp-c2 text-black text-[10px] font-sans uppercase tracking-widest font-bold rounded-sm">
            Missão Principal
          </span>
          <span class="text-[11px] text-gray-400 font-sans tracking-widest uppercase">Dificuldade: Média • V5</span>
        </div>

        <h2 class="font-sans font-bold text-2xl md:text-3xl text-white uppercase tracking-wider mb-3">
          Capítulo 1: O Segredo debaixo do Anhangabaú
        </h2>
        <p class="text-sm text-gray-300 font-sans leading-relaxed mb-6">
          Um mensageiro do Primógeno Nosferatu foi interceptado nas galerias subterrâneas de São Paulo. Você foi encarregado de investigar o local antes que os Caçadores da Segunda Inquisição descubram o refúgio.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-xs bg-black/60 p-4 rounded border border-vamp-border font-sans">
          <div>Recompensa: <strong class="text-vamp-c2">+10 XP</strong></div>
          <div>Itens Possíveis: <strong class="text-white">Chave Antiga, Relatório</strong></div>
          <div>Custo: <strong class="text-vamp-c1">1 Ponto de Ação</strong></div>
        </div>

        <button 
          @click="startSoloAdventure('cap1')"
          class="w-full md:w-auto px-8 py-3 bg-black hover:bg-vamp-c2 text-vamp-c2 hover:text-black border border-vamp-c2 font-sans font-bold text-sm uppercase tracking-widest rounded-sm transition-all duration-300 flex items-center justify-center gap-3"
        >
          <span>Iniciar Aventura Solo</span>
          <span>→</span>
        </button>
      </div>

      <!-- HISTÓRICO DE DIÁRIOS DE BORDO CONCLUÍDOS -->
      <div class="demiplane-box p-6 md:p-8 rounded-sm">
        <h3 class="font-sans font-bold text-lg text-white uppercase tracking-wider border-b border-vamp-border pb-3 mb-6">
          📜 Diário de Bordo & Registro de Caçadas
        </h3>

        <div class="space-y-4">
          <div class="bg-black/50 border border-vamp-border rounded p-4 text-[11px] text-gray-400 font-sans uppercase tracking-widest text-center py-8">
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
