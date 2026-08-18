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
          <nav class="flex gap-8 border-b border-stone-800/50 mb-8 px-6">
            <button @click="activeTab = 'geral'" :class="activeTab === 'geral' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-stone-500 hover:text-stone-300'" class="pb-4 text-[10px] uppercase tracking-[0.2em] transition">Visão Geral</button>
            <button @click="activeTab = 'acoes'" :class="activeTab === 'acoes' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-stone-500 hover:text-stone-300'" class="pb-4 text-[10px] uppercase tracking-[0.2em] transition">Ações & Locais</button>
            <button @click="activeTab = 'aventura'" :class="activeTab === 'aventura' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-stone-500 hover:text-stone-300'" class="pb-4 text-[10px] uppercase tracking-[0.2em] transition">Aventura Solo</button>
            <button @click="activeTab = 'operacoes'" :class="activeTab === 'operacoes' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-stone-500 hover:text-stone-300'" class="pb-4 text-[10px] uppercase tracking-[0.2em] transition">Operações da Noite</button>
          </nav>

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

          <!-- ABA OPERACOES DA NOITE -->
          <div v-if="activeTab === 'operacoes'" class="animate-fade-in bg-stone-950/60 border border-[rgba(212,175,55,0.25)] rounded-xl p-6 shadow-lg">
            <h2 class="font-serif text-xs text-amber-400/80 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-amber-600 animate-pulse shadow-[0_0_8px_rgba(217,119,6,0.8)]"></span> Despachos e Missões
            </h2>
            
            <div v-if="loadingMissions" class="text-center text-stone-500 py-10">
              <div class="animate-spin w-6 h-6 border-2 border-amber-900 border-t-transparent rounded-full mx-auto mb-2"></div>
              Acessando contatos...
            </div>
            
            <div v-else>
              <!-- MISSÃO ATIVA -->
              <div v-if="activeMission" class="bg-stone-900/80 border border-amber-900/50 rounded-lg p-5 mb-6 shadow-[0_0_15px_rgba(217,119,6,0.1)] relative overflow-hidden">
                <div class="absolute -right-5 -top-5 w-24 h-24 bg-amber-600/10 blur-[30px] pointer-events-none"></div>
                <h3 class="font-serif text-amber-400 text-lg mb-1">{{ activeMission.DefinitionMissionIdle?.title }}</h3>
                <p class="text-xs text-stone-400 mb-4">{{ activeMission.DefinitionMissionIdle?.description }}</p>
                
                <div class="flex items-center justify-between border-t border-stone-800 pt-4">
                  <div class="flex items-center gap-3">
                    <span class="text-2xl animate-spin" style="animation-duration: 4s;">⏳</span>
                    <div>
                      <span class="block text-[10px] text-stone-500 uppercase tracking-widest">Tempo Restante</span>
                      <span class="text-lg font-mono text-stone-300">{{ formatTimeRemaining(activeMission.expiresAt) }}</span>
                    </div>
                  </div>
                  
                  <button 
                    v-if="isMissionExpired(activeMission.expiresAt)"
                    @click="resolveActiveMission()" 
                    class="bg-amber-900 hover:bg-amber-800 text-amber-100 px-6 py-2 rounded text-sm font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(217,119,6,0.4)] transition"
                  >
                    Receber Relatório
                  </button>
                  <button 
                    v-else
                    disabled
                    class="bg-stone-800 text-stone-500 cursor-not-allowed px-6 py-2 rounded text-sm font-bold uppercase tracking-widest"
                  >
                    Em Andamento...
                  </button>
                </div>
              </div>

              <!-- LISTA DE MISSÕES DISPONÍVEIS -->
              <div v-if="!activeMission">
                <h3 class="text-xs text-stone-500 uppercase tracking-widest mb-3">Missões Disponíveis</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    v-for="mission in availableMissions" :key="mission.id"
                    class="bg-stone-900/40 border border-stone-800 hover:border-amber-900/50 p-4 rounded-lg transition group cursor-pointer"
                    @click="openMissionModal(mission)"
                  >
                    <div class="flex justify-between items-start mb-2">
                      <h4 class="font-serif text-sm text-stone-300 group-hover:text-amber-400 transition">{{ mission.title }}</h4>
                      <span class="bg-stone-950 text-stone-500 border border-stone-800 text-[10px] px-2 py-0.5 rounded">{{ mission.durationMinutes }} min</span>
                    </div>
                    <p class="text-[11px] text-stone-500 line-clamp-2 mb-3">{{ mission.description }}</p>
                    <div class="flex items-center gap-2">
                      <span class="text-[10px] bg-stone-800 text-stone-400 px-2 py-0.5 rounded uppercase tracking-widest">{{ mission.Actions?.length || 0 }} Etapas</span>
                      <span class="text-[10px] bg-stone-800 text-stone-400 px-2 py-0.5 rounded uppercase tracking-widest">Dif. {{ mission.baseDifficulty }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <!-- MODAL INICIAR MISSÃO -->
      <div v-if="selectedMission" class="fixed inset-0 bg-black/90 flex items-center justify-center z-50 px-4">
        <div class="bg-[#0b0608] border border-amber-900/50 rounded-xl max-w-md w-full shadow-[0_0_50px_rgba(217,119,6,0.15)] relative overflow-hidden">
          
          <div class="p-6 relative z-10">
            <h3 class="font-serif text-amber-400 text-xl mb-2">{{ selectedMission.title }}</h3>
            <p class="text-sm text-stone-400 mb-6">{{ selectedMission.description }}</p>

            <div class="bg-stone-900/50 border border-stone-800 rounded p-4 mb-4">
              <span class="block text-[10px] text-stone-500 uppercase tracking-widest mb-1">Duração Estimada</span>
              <span class="text-lg font-mono text-stone-300">{{ selectedMission.durationMinutes }} Minutos</span>
            </div>

            <div v-if="selectedMission.Actions && selectedMission.Actions.length > 0" class="mb-6">
              <span class="block text-[10px] text-stone-500 uppercase tracking-widest mb-2">Etapas da Operação</span>
              <ul class="space-y-2">
                <li v-for="action in selectedMission.Actions" :key="action.id" class="bg-stone-900/80 border border-stone-800 p-3 rounded">
                  <div class="flex justify-between items-center mb-1">
                    <span class="text-sm font-serif text-amber-500">{{ action.stepOrder }}. {{ action.name }}</span>
                    <span class="text-[10px] bg-stone-800 text-stone-400 px-2 py-0.5 rounded uppercase tracking-widest">Dif. {{ action.difficulty || 6 }}</span>
                  </div>
                  <div class="text-xs text-stone-400 mb-2">{{ action.description }}</div>
                  <div class="flex gap-2">
                    <span v-if="action.attributeReq" class="text-[10px] text-stone-500 border border-stone-700 px-1 rounded">{{ action.attributeReq }}</span>
                    <span v-if="action.skillReq" class="text-[10px] text-stone-500 border border-stone-700 px-1 rounded">{{ action.skillReq }}</span>
                    <span class="text-[10px] text-red-500/70 border border-red-900/30 px-1 rounded ml-auto">3d10</span>
                  </div>
                </li>
              </ul>
            </div>

            <div class="flex items-center gap-3 mt-6">
              <button @click="selectedMission = null" class="flex-1 bg-transparent hover:bg-stone-900 text-stone-400 border border-stone-800 px-4 py-2.5 rounded text-xs uppercase tracking-widest transition font-bold">Cancelar</button>
              <button @click="startSelectedMission()" class="flex-1 bg-amber-900 hover:bg-amber-800 text-amber-100 border border-amber-700/50 px-4 py-2.5 rounded text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(217,119,6,0.3)] transition font-bold">
                Iniciar Expedição
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- MODAL DE RELATÓRIO DA MISSÃO -->
      <div v-if="reportModalData" class="fixed inset-0 bg-black/90 flex items-center justify-center z-50 px-4">
        <div class="bg-[#0b0608] border rounded-xl max-w-md w-full shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden" :class="reportModalData.isSuccess ? 'border-amber-600/50' : 'border-red-900/50'">
          <div class="absolute -right-10 -top-10 w-32 h-32 blur-[40px] pointer-events-none" :class="reportModalData.isSuccess ? 'bg-amber-600/20' : 'bg-red-900/20'"></div>
          
          <div class="p-6 relative z-10 text-center">
            <span class="text-4xl block mb-2">{{ reportModalData.isSuccess ? '🏆' : '💀' }}</span>
            <h3 class="font-serif text-2xl mb-2" :class="reportModalData.isSuccess ? 'text-amber-400' : 'text-red-500'">{{ reportModalData.title }}</h3>
            <p class="text-sm text-stone-400 mb-6 italic">"{{ reportModalData.narrative }}"</p>

            <div class="bg-stone-900/50 border border-stone-800 rounded p-4 mb-6 text-left">
              <span class="block text-[10px] text-stone-500 uppercase tracking-widest mb-2">Consequências da Noite</span>
              <ul class="space-y-2">
                <li v-for="(change, index) in reportModalData.changes" :key="index" class="text-sm text-stone-300 flex items-start gap-2">
                  <span :class="reportModalData.isSuccess ? 'text-amber-500' : 'text-red-500'">•</span> {{ change }}
                </li>
                <li v-if="reportModalData.changes.length === 0" class="text-sm text-stone-500 italic">Nenhuma mudança significativa.</li>
              </ul>
            </div>

            <button @click="closeReportModal()" class="w-full bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700 px-4 py-3 rounded text-xs uppercase tracking-widest transition font-bold">
              Compreendido
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api, { API_BASE_URL } from '../services/api'

const router = useRouter()
const route = useRoute()

const loading = ref(true)
const character = ref<any>(null)
const characterId = ref<string>('')
const activeTab = ref<string>('geral')

// Missões AFK
const loadingMissions = ref(false)
const availableMissions = ref<any[]>([])
const activeMission = ref<any>(null)
const selectedMission = ref<any>(null)
const reportModalData = ref<any>(null)
let timerInterval: any = null
const now = ref(new Date())

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

    fetchMissions()
  } catch (err) {
    console.error('Erro ao buscar personagem:', err)
    router.push('/jogador/vampire')
  } finally {
    loading.value = false
  }
}

const fetchMissions = async () => {
  loadingMissions.value = true
  try {
    // Busca missão ativa
    const resActive = await api.get(`/api/missions-idle/active/${characterId.value}`)
    if (resActive.data) {
      activeMission.value = resActive.data
    } else {
      activeMission.value = null
      // Se não tem ativa, busca disponíveis
      const resAvail = await api.get(`/api/missions-idle`)
      availableMissions.value = resAvail.data
    }
  } catch (err) {
    console.error('Erro ao buscar missões:', err)
  } finally {
    loadingMissions.value = false
  }
}

const openMissionModal = (mission: any) => {
  selectedMission.value = mission
}

const startSelectedMission = async () => {
  if (!selectedMission.value) return
  
  try {
    await api.post('/api/missions-idle/start', {
      characterId: characterId.value,
      missionId: selectedMission.value.id,
      selectedAttribute: 'Físico', // Placeholder por enquanto
      selectedSkill: 'Sobrevivência'
    })
    
    selectedMission.value = null
    fetchMissions() // Atualiza a tela para mostrar o andamento
  } catch (err: any) {
    alert(err.response?.data?.error || 'Erro ao iniciar missão')
  }
}

const resolveActiveMission = async () => {
  if (!activeMission.value) return
  try {
    const res = await api.post('/api/missions-idle/resolve', {
      activeMissionId: activeMission.value.id
    })
    
    // Atualiza personagem com os novos status
    character.value = res.data.character
    reportModalData.value = res.data.report
    
    fetchMissions() // Volta a tela para as missões disponíveis
  } catch (err: any) {
    alert(err.response?.data?.error || 'Erro ao resolver missão')
  }
}

const closeReportModal = () => {
  reportModalData.value = null
}

const isMissionExpired = (expiresAtStr: string) => {
  return now.value >= new Date(expiresAtStr)
}

const formatTimeRemaining = (expiresAtStr: string) => {
  const expires = new Date(expiresAtStr).getTime()
  const current = now.value.getTime()
  
  const diff = expires - current
  if (diff <= 0) return '00:00:00'
  
  const h = Math.floor(diff / (1000 * 60 * 60))
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const s = Math.floor((diff % (1000 * 60)) / 1000)
  
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

onMounted(() => {
  fetchCharacter()
  timerInterval = setInterval(() => {
    now.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>
