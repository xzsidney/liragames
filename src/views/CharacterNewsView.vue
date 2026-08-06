<template>
  <div class="min-h-screen demiplane-bg text-parchment font-sans relative overflow-x-hidden selection:bg-blood-red selection:text-white pb-20">
    <!-- SUBTLE NOISE/TEXTURE -->
    <div class="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay z-0" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>

    <!-- NAVBAR -->
    <nav class="relative z-20 border-b border-vamp-border bg-black/80 backdrop-blur-md sticky top-0">
      <div class="max-w-[1200px] mx-auto px-4 h-12 flex items-center justify-between">
        <button @click="router.push(`/personagem/hub?id=${characterId}`)" class="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 font-serif uppercase tracking-widest transition-colors">
          <span>←</span> Back to Hub
        </button>

        <div class="flex items-center gap-4 text-[10px] font-serif tracking-widest uppercase">
          <span class="text-gray-500">URBAN NEWS FEED</span>
        </div>
      </div>
    </nav>

    <!-- MAIN CONTENT -->
    <main class="relative z-10 max-w-[1200px] mx-auto px-4 py-8">
      <!-- NEWSPAPER HEADER -->
      <div class="text-center border-b border-vamp-border pb-8 mb-10">
        <div class="text-[11px] font-serif uppercase tracking-[4px] text-gray-400 mb-2">
          Jornal das Sombras de São Paulo • Edição Diária
        </div>
        <h1 class="demiplane-title text-4xl md:text-6xl text-white drop-shadow-md">
          A GAZETA DA NOITE
        </h1>
        <h2 class="demiplane-text text-vamp-c2 mt-2 max-w-xl mx-auto">
          Relatos, investigações policiais e desdobramentos urbanos provocado pelas ações da Camarilla e dos Anarchs na metrópole.
        </h2>
      </div>

      <!-- ARTICLES LIST -->
      <div class="space-y-6">
        <div 
          v-for="news in newsList" 
          :key="news.id"
          class="demiplane-box p-6 md:p-8 hover:border-vamp-c1 transition-all duration-300"
        >
          <div class="flex items-center justify-between gap-4 mb-3 pb-3 border-b border-vamp-border/50">
            <span class="px-2.5 py-0.5 bg-black/50 border border-vamp-c2 text-white text-[10px] font-sans font-bold uppercase tracking-widest rounded-sm">
              {{ news.tag }}
            </span>
            <span class="text-[11px] font-mono text-gray-500">
              {{ news.date }}
            </span>
          </div>

          <h2 class="font-sans font-bold text-xl uppercase text-white hover:text-vamp-c2 transition-colors mb-3 tracking-wide">
            {{ news.title }}
          </h2>
          <p class="text-sm text-gray-300 leading-relaxed font-sans">
            {{ news.content }}
          </p>

          <div class="mt-4 pt-4 border-t border-vamp-border/50 flex items-center justify-between text-xs text-gray-500 italic">
            <span>Fonte: {{ news.source }}</span>
            <span class="text-vamp-c1">Impacto na Máscara: {{ news.impact }}</span>
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

const newsList = ref([
  {
    id: '1',
    tag: 'POLÍCIA / MÁSCARA',
    date: 'Hoje, 03:14',
    title: 'Apagão repentino e tiroteio movimentam o centro da Praça da Sé',
    content: 'Moradores do Centro Velho relataram explosão em um transformador seguida de tiros de grosso calibre. A Polícia Militar nega baixas e atribui a ação a um confronto entre facções rivais.',
    source: 'Diário Paulistano',
    impact: 'Estável (Máscara Preservada)'
  },
  {
    id: '2',
    tag: 'ANARCHS / TERRENO',
    date: 'Ontem, 23:45',
    title: 'Boate na Augusta tem movimento atípico de segurança privada',
    content: 'Um grupo misterioso de indivíduos vestindo trajes escuros assumiu a segurança do estabelecimento. Rumores entre os frequentadores apontam para uma disputa territorial no circuito noturno.',
    source: 'Fórum da Noite',
    impact: 'Tensão Moderada'
  },
  {
    id: '3',
    tag: 'CAMARILLA / ELÍSIO',
    date: 'Há 2 dias',
    title: 'Leilão de arte na Galeria Jardins quebra recorde de arrecadação',
    content: 'Colecionadores renomados arremataram obras históricas em uma sessão privada. Entre os benfeitores destacados está a alta sociedade empresarial de São Paulo.',
    source: 'Coluna Social SP',
    impact: 'Prestígio Elevado'
  }
])

onMounted(() => {
  characterId.value = (route.query.id as string) || localStorage.getItem('lira_active_character_id') || ''
})
</script>
