<template>
  <div class="min-h-screen bg-[#0b0608] text-stone-300 font-sans relative overflow-x-hidden selection:bg-red-900 selection:text-white pb-20 select-none">
    
    <!-- SUBTLE NOISE/TEXTURE -->
    <div class="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay z-0" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>

    <!-- LOADING STATE -->
    <div v-if="loading" class="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center text-stone-500 font-serif">
      <div class="animate-spin w-8 h-8 border-2 border-red-900 border-t-transparent rounded-full mx-auto mb-4"></div>
      Despertando o refúgio...
    </div>

    <div v-else class="relative z-10">
      <!-- BARRA SUPERIOR DE NAVEGAÇÃO -->
      <header class="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between p-6 border-b border-stone-900 gap-4 sticky top-0 bg-[#0b0608]/90 backdrop-blur-sm z-20">
        <button @click="router.push('/jogador/vampire')" class="flex items-center gap-2 text-stone-500 hover:text-amber-500 transition text-sm uppercase tracking-widest font-serif">
          <span>←</span> Retornar à Galeria
        </button>
        <div class="flex items-center gap-4">
          <span class="hidden md:inline-block text-xs uppercase tracking-widest text-stone-500 bg-stone-950 px-3 py-1.5 rounded border border-stone-800">
            Local: <b class="text-stone-300">Refúgio Principal</b>
          </span>
          <button @click="router.push(`/personagem/ficha?id=${characterId}`)" class="bg-red-950/80 hover:bg-red-900 text-amber-200 border border-amber-500/40 px-5 py-2 rounded text-xs font-serif tracking-widest uppercase shadow-[0_0_15px_rgba(139,0,0,0.5)] hover:shadow-[0_0_20px_rgba(139,0,0,0.8)] transition">
            Ver Ficha Completa →
          </button>
        </div>
      </header>

      <!-- CORPO PRINCIPAL DO HUB -->
      <main class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 px-6">
        
        <!-- COLUNA DA ESQUERDA: AVATAR + STATUS RÁPIDO -->
        <div class="lg:col-span-4 flex flex-col items-center bg-stone-950/60 border border-[rgba(212,175,55,0.25)] rounded-xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.8)] relative overflow-hidden h-fit">
          <div class="relative group cursor-pointer" @click="router.push(`/personagem/ficha?id=${characterId}`)">
            <!-- Moldura e Avatar -->
            <div class="w-64 h-80 rounded-lg overflow-hidden border-2 border-stone-800 relative shadow-inner">
              <img 
                :src="character?.avatarUrl ? API_BASE_URL + character.avatarUrl : 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'600\'%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'%231a0b12\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' fill=\'%23c9a84c\' font-family=\'serif\' font-size=\'48\' dominant-baseline=\'middle\' text-anchor=\'middle\'%3E%E2%98%A5%3C/text%3E%3C/svg%3E'" 
                alt="Avatar" 
                class="w-full h-full object-cover grayscale-[0.3] contrast-125 group-hover:scale-105 group-hover:grayscale-0 transition duration-700 saturate-90" 
              />
              <div class="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
            </div>
            <span class="absolute top-3 left-3 bg-red-950/90 text-amber-400 border border-amber-500/30 text-[10px] uppercase font-serif tracking-widest px-2.5 py-1 rounded shadow-lg">
              👑 {{ character?.DefinitionClan?.name || 'Sem Clã' }} • {{ character?.generation }}ª Geração
            </span>
          </div>

          <h1 class="font-serif text-3xl text-amber-100 font-bold tracking-wider mt-5 text-center drop-shadow-md" style="font-family: 'Cinzel Decorative', serif;">{{ character?.name }}</h1>
          <p class="text-stone-500 text-xs italic text-center mt-1">"{{ character?.concept || 'Um habitante das sombras de Nocturna.' }}"</p>

          <!-- MEDIDORES VITAIS -->
          <div class="w-full grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-stone-900 text-center">
            <div class="bg-stone-900/50 p-2 rounded border border-stone-800 flex flex-col justify-center">
              <span class="text-[9px] uppercase tracking-widest text-stone-500 block mb-1">Fome</span>
              <span class="text-red-500 text-xl font-serif font-bold drop-shadow-[0_0_8px_rgba(239,68,68,0.3)]">{{ character?.hunger || 0 }} / 5</span>
            </div>
            <div class="bg-stone-900/50 p-2 rounded border border-stone-800 flex flex-col justify-center">
              <span class="text-[9px] uppercase tracking-widest text-stone-500 block mb-1">Humanidade</span>
              <span class="text-amber-500 text-xl font-serif font-bold drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]">{{ character?.humanity || 7 }}</span>
            </div>
            <div class="bg-stone-900/50 p-2 rounded border border-stone-800 flex flex-col justify-center">
              <span class="text-[9px] uppercase tracking-widest text-stone-500 block mb-1">Vontade</span>
              <span class="text-stone-300 text-xl font-serif font-bold">{{ character?.willpower || 0 }} / 6</span>
            </div>
          </div>
        </div>

        <!-- COLUNA DA DIREITA: ABAS E CONTEÚDO -->
        <div class="lg:col-span-8 flex flex-col gap-6">
          
          <!-- SISTEMA DE ABAS -->
          <div class="flex items-center gap-6 border-b border-[rgba(212,175,55,0.2)] overflow-x-auto no-scrollbar">
            <button @click="activeTab = 'geral'" class="pb-3 text-[11px] tracking-widest font-serif uppercase transition border-b-2 whitespace-nowrap" :class="activeTab === 'geral' ? 'text-amber-500 border-amber-500' : 'text-stone-500 border-transparent hover:text-stone-300'">VISÃO GERAL</button>
            <button @click="activeTab = 'acoes'" class="pb-3 text-[11px] tracking-widest font-serif uppercase transition border-b-2 whitespace-nowrap" :class="activeTab === 'acoes' ? 'text-amber-500 border-amber-500' : 'text-stone-500 border-transparent hover:text-stone-300'">AÇÕES & LOCAIS</button>
            <button @click="activeTab = 'aventura'" class="pb-3 text-[11px] tracking-widest font-serif uppercase transition border-b-2 whitespace-nowrap" :class="activeTab === 'aventura' ? 'text-amber-500 border-amber-500' : 'text-stone-500 border-transparent hover:text-stone-300'">AVENTURA SOLO</button>
            <button @click="activeTab = 'missoes'" class="pb-3 text-[11px] tracking-widest font-serif uppercase transition border-b-2 whitespace-nowrap" :class="activeTab === 'missoes' ? 'text-amber-500 border-amber-500' : 'text-stone-500 border-transparent hover:text-stone-300'">MISSÕES AFK</button>
          </div>

          <!-- CONTEÚDO DAS ABAS -->
          
          <!-- ABA: VISÃO GERAL (Radar + Objetivos) -->
          <div v-show="activeTab === 'geral'" class="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 animate-[fadeIn_0.3s_ease-out]">
            
            <!-- FEED DO MUNDO VIVO -->
            <div class="bg-stone-950/60 border border-stone-900 rounded-xl p-5 shadow-lg relative overflow-hidden">
              <div class="absolute -right-10 -bottom-10 w-32 h-32 bg-red-900/10 blur-[40px] pointer-events-none"></div>
              
              <h3 class="font-serif text-[10px] text-stone-400 uppercase tracking-widest mb-4">Radar de Nocturna</h3>
              <ul class="space-y-3 text-xs font-sans">
                <li class="p-3 rounded bg-stone-900/40 border-l-2 border-red-600 shadow-sm">
                  <span class="text-stone-300 block font-semibold mb-1">Boletim Policial (02:14)</span>
                  <p class="text-stone-500 leading-relaxed">Corpo drenado encontrado no Viaduto do Chá. Caçadores em alerta máximo na região central.</p>
                </li>
                <li class="p-3 rounded bg-stone-900/40 border-l-2 border-amber-600 shadow-sm">
                  <span class="text-stone-300 block font-semibold mb-1">Édito do Príncipe Silveira</span>
                  <p class="text-stone-500 leading-relaxed">Reforço no toque de recolher para caças não autorizadas. Infratores sofrerão a Caçada de Sangue.</p>
                </li>
              </ul>
            </div>

            <!-- AMBIÇÃO E RELÓGIOS -->
            <div class="bg-stone-950/60 border border-stone-900 rounded-xl p-5 shadow-lg">
              <h3 class="font-serif text-[10px] text-stone-400 uppercase tracking-widest mb-4">Agendas & Prazos</h3>
              <div class="space-y-4 text-xs font-sans">
                <div>
                  <div class="flex justify-between text-stone-400 mb-1.5">
                    <span class="uppercase tracking-wider text-[10px]">Vigilância da Inquisição</span>
                    <span class="text-red-400 font-bold">2 / 4 Turnos</span>
                  </div>
                  <div class="w-full bg-stone-900 h-1.5 rounded-full overflow-hidden shadow-inner">
                    <div class="bg-red-600 h-full w-2/4 shadow-[0_0_8px_rgba(220,38,38,0.8)]"></div>
                  </div>
                </div>
                
                <div class="pt-3 border-t border-stone-800/50">
                  <span class="text-stone-500 uppercase tracking-widest text-[9px] block mb-1">Ambição Ativa</span>
                  <p class="text-stone-300 italic">"Decifrar o manuscrito roubado da capela rival antes do amanhecer."</p>
                </div>
                
                <div class="pt-3 border-t border-stone-800/50">
                  <span class="text-stone-500 uppercase tracking-widest text-[9px] block mb-1">Desejo da Noite</span>
                  <p class="text-stone-300 italic">"Encontrar o contato que vazou a localização do meu rebanho."</p>
                </div>
              </div>
            </div>

          </div>

          <!-- ABA: AÇÕES & LOCAIS -->
          <div v-show="activeTab === 'acoes'" class="bg-stone-950/60 border border-[rgba(212,175,55,0.25)] rounded-xl p-6 shadow-lg animate-[fadeIn_0.3s_ease-out]">
            <h2 class="font-serif text-xs text-amber-400/80 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-red-600 animate-ping shadow-[0_0_8px_rgba(220,38,38,0.8)]"></span> Ações da Noite
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
              
              <button @click="router.push(`/personagem/aventuras?id=${characterId}`)" class="bg-stone-900/70 hover:bg-red-950/40 border border-stone-800 hover:border-red-600/50 p-4 rounded-lg text-left transition group shadow-md hover:shadow-[0_0_15px_rgba(153,27,27,0.3)]">
                <span class="text-2xl block mb-2 drop-shadow-md group-hover:scale-110 transition-transform origin-bottom-left">🩸</span>
                <h3 class="font-serif text-sm tracking-wide text-stone-200 group-hover:text-red-400 font-bold uppercase">Caçar Sangue</h3>
                <p class="text-[11px] text-stone-500 mt-1 leading-relaxed">Alimentar-se no banco de sangue ou nas ruas. Reduza sua fome.</p>
              </button>
              
              <button @click="router.push(`/personagem/inventario?id=${characterId}`)" class="bg-stone-900/70 hover:bg-amber-950/40 border border-stone-800 hover:border-amber-600/50 p-4 rounded-lg text-left transition group shadow-md hover:shadow-[0_0_15px_rgba(146,64,14,0.3)]">
                <span class="text-2xl block mb-2 drop-shadow-md group-hover:scale-110 transition-transform origin-bottom-left">⚔️</span>
                <h3 class="font-serif text-sm tracking-wide text-stone-200 group-hover:text-amber-300 font-bold uppercase">Inventário & Loja</h3>
                <p class="text-[11px] text-stone-500 mt-1 leading-relaxed">Adquira suprimentos, armas e relíquias com seus recursos.</p>
              </button>

              <button @click="router.push(`/personagem/noticias?id=${characterId}`)" class="bg-stone-900/70 hover:bg-purple-950/40 border border-stone-800 hover:border-purple-600/50 p-4 rounded-lg text-left transition group shadow-md hover:shadow-[0_0_15px_rgba(88,28,135,0.3)]">
                <span class="text-2xl block mb-2 drop-shadow-md group-hover:scale-110 transition-transform origin-bottom-left">📰</span>
                <h3 class="font-serif text-sm tracking-wide text-stone-200 group-hover:text-purple-300 font-bold uppercase">Gazeta da Noite</h3>
                <p class="text-[11px] text-stone-500 mt-1 leading-relaxed">Notícias do submundo, política e boatos vitais para a Camarilla.</p>
              </button>

              <button @click="router.push(`/personagem/radar?id=${characterId}`)" class="bg-stone-900/70 hover:bg-cyan-950/40 border border-stone-800 hover:border-cyan-600/50 p-4 rounded-lg text-left transition group shadow-md hover:shadow-[0_0_15px_rgba(8,145,178,0.3)]">
                <span class="text-2xl block mb-2 drop-shadow-md group-hover:scale-110 transition-transform origin-bottom-left" style="color: #00ffff; text-shadow: 0 0 10px #00ffff;">⚜</span>
                <h3 class="font-serif text-sm tracking-wide text-stone-200 group-hover:text-cyan-300 font-bold uppercase">Explorar Nocturna</h3>
                <p class="text-[11px] text-stone-500 mt-1 leading-relaxed">Acesse o radar tático de domínios, segurança e dificuldades.</p>
              </button>

            </div>
          </div>

          <!-- ABA: AVENTURA SOLO -->
          <div v-show="activeTab === 'aventura'" class="bg-stone-950/60 border border-stone-900 border-dashed rounded-xl p-10 shadow-lg text-center animate-[fadeIn_0.3s_ease-out] flex flex-col items-center justify-center min-h-[300px]">
            <span class="text-4xl mb-4 grayscale opacity-50 block">📜</span>
            <h3 class="font-serif text-amber-500/80 uppercase tracking-widest text-sm mb-2">Motor de Aventura Solo</h3>
            <p class="text-stone-500 text-xs max-w-md mx-auto leading-relaxed">O sistema de Livro-Jogo guiado pelo narrador está sendo preparado. Suas escolhas moldarão a crônica em breve.</p>
          </div>

          <!-- ABA: MISSÕES AFK -->
          <div v-show="activeTab === 'missoes'" class="bg-stone-950/60 border border-stone-900 border-dashed rounded-xl p-10 shadow-lg text-center animate-[fadeIn_0.3s_ease-out] flex flex-col items-center justify-center min-h-[300px]">
            <span class="text-4xl mb-4 grayscale opacity-50 block">⏳</span>
            <h3 class="font-serif text-amber-500/80 uppercase tracking-widest text-sm mb-2">Despachos e Missões em Tempo Real</h3>
            <p class="text-stone-500 text-xs max-w-md mx-auto leading-relaxed">Envie carniçais e aliados para executarem tarefas pela cidade enquanto você está offline.</p>
          </div>

        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api, { API_BASE_URL } from '../services/api'

const router = useRouter()
const route = useRoute()

const loading = ref(true)
const character = ref<any>(null)
const characterId = ref<string>('')
const activeTab = ref<string>('geral')

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
