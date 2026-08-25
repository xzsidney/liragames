<template>
  <div class="min-h-screen bg-[#03060c] text-parchment font-sans relative overflow-x-hidden selection:bg-blood-red selection:text-white pb-24 select-none">
    
    <!-- NOISE / TEXTURE -->
    <div class="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay z-0" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>

    <!-- NAVBAR OPERACIONAL -->
    <header class="relative z-20 border-b border-cyan-500/30 bg-[#02050a]/90 backdrop-blur-md sticky top-0 shadow-xl">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button 
            @click="handleBackNavigation" 
            class="text-stone-400 hover:text-cyan-300 transition-colors flex items-center gap-1.5 font-serif text-xs uppercase tracking-widest"
          >
            <span>&larr;</span> {{ activeMission ? 'Hub' : 'Voltar' }}
          </button>
          <div class="h-4 w-px bg-cyan-900/60 mx-1"></div>
          <div class="font-serif font-bold text-xs sm:text-sm tracking-widest flex items-center gap-2 text-cyan-400">
            <span class="w-2 h-2 rounded-full" :class="activeMission ? 'bg-red-500 animate-ping' : 'bg-cyan-400'"></span>
            CENTRO DE OPERAÇÕES • NOCTURNA
          </div>
        </div>

        <div class="flex items-center gap-4 text-xs font-mono">
          <div v-if="character" class="hidden sm:flex items-center gap-3 text-[11px] text-stone-400">
            <span>Vampiro: <strong class="text-parchment font-serif">{{ character.name }}</strong></span>
            <span class="text-red-400 font-bold">🩸 Fome {{ character.hunger }}/5</span>
          </div>
          <button 
            @click="router.push('/personagem/ficha?id=' + characterId)" 
            class="border border-cyan-500/30 px-3 py-1 text-[10px] text-cyan-300 hover:bg-cyan-950/40 transition-colors rounded uppercase tracking-wider"
          >
            Ficha
          </button>
        </div>
      </div>
    </header>

    <!-- LOADING STATE -->
    <div v-if="loading" class="flex flex-col items-center justify-center min-h-[70vh] relative z-10 space-y-4">
      <div class="animate-spin w-12 h-12 border-2 border-cyan-900 border-t-cyan-400 rounded-full shadow-[0_0_20px_rgba(0,255,255,0.3)]"></div>
      <p class="text-cyan-500/80 font-serif text-xs tracking-widest uppercase animate-pulse">
        Sincronizando frequências táticas de campo...
      </p>
    </div>

    <!-- MAIN CONTAINER -->
    <main v-else class="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-12 relative z-10 space-y-6">

      <!-- CASO NÃO HAJA MISSÃO ATIVA -->
      <div v-if="!activeMission" class="border border-cyan-500/20 bg-black/60 rounded-xl p-8 text-center space-y-6 shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-sm">
        <div class="w-16 h-16 rounded-full bg-cyan-950/60 border border-cyan-500/40 mx-auto flex items-center justify-center text-2xl text-cyan-400 shadow-[0_0_20px_rgba(0,255,255,0.2)]">
          🦇
        </div>
        <div class="space-y-2 max-w-md mx-auto">
          <h2 class="text-xl font-serif font-bold text-parchment uppercase tracking-wider">Nenhuma Operação em Andamento</h2>
          <p class="text-xs text-stone-400 leading-relaxed font-sans">
            Seu vampiro encontra-se atualmente em segurança ou aguardando novas diretrizes. Abra o Radar Tático para inspecionar distritos e despachar novas incursões ou caçadas.
          </p>
        </div>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button 
            @click="router.push('/personagem/radar?id=' + characterId)" 
            class="w-full sm:w-auto px-8 py-3 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-400 text-cyan-300 font-serif font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(0,255,255,0.25)] flex items-center justify-center gap-2"
          >
            <span>📡</span> Abrir Radar Tático
          </button>
          <button 
            @click="router.push('/personagem/hub?id=' + characterId)" 
            class="w-full sm:w-auto px-8 py-3 rounded-lg border border-white/20 hover:bg-white/5 text-stone-300 font-serif text-xs uppercase tracking-widest transition-all"
          >
            🏠 Retornar ao Refúgio
          </button>
        </div>
      </div>

      <!-- CASO HAJA MISSÃO ATIVA -->
      <div v-else class="space-y-6">

        <!-- ALERTA SOLAR / EMERGÊNCIA DE DIA -->
        <div v-if="isSunHazardActive" class="border-2 border-red-600 bg-red-950/40 rounded-xl p-4 sm:p-5 shadow-[0_0_30px_rgba(255,0,0,0.4)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-pulse">
          <div class="flex items-center gap-3">
            <span class="text-3xl">☀️</span>
            <div>
              <h3 class="text-red-400 font-serif font-bold text-sm uppercase tracking-wider">Alerta Solar: O Dia Amanheceu!</h3>
              <p class="text-xs text-stone-300">Você está operando em campo aberto após as 06:00. O risco de dano solar agravado é iminente.</p>
            </div>
          </div>
          <button 
            @click="triggerEmergencyShelter" 
            class="px-5 py-2.5 rounded bg-red-600 hover:bg-red-500 text-white font-serif font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(255,0,0,0.6)] whitespace-nowrap"
          >
            🛡️ Buscar Abrigo Imediato
          </button>
        </div>

        <!-- CARD PRINCIPAL: STATUS DA OPERAÇÃO & CRONÔMETRO -->
        <div class="border border-red-900/60 bg-[#090507]/90 rounded-xl p-6 sm:p-8 shadow-[0_0_40px_rgba(153,27,27,0.25)] space-y-6 relative overflow-hidden backdrop-blur-md">
          
          <!-- EFEITO DE FUNDO -->
          <div class="absolute -right-20 -top-20 w-64 h-64 bg-red-900/10 rounded-full blur-3xl pointer-events-none"></div>

          <!-- CABEÇALHO DA OPERAÇÃO -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div class="space-y-1">
              <div class="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-red-400">
                <span class="w-2 h-2 rounded-full" :class="isReady ? 'bg-green-400' : 'bg-red-500 animate-ping'"></span>
                <span>{{ missionCategoryLabel }}</span>
                <span v-if="activeMission.DefinitionMissionIdle?.Location?.name" class="text-stone-400">
                  • 📍 {{ activeMission.DefinitionMissionIdle.Location.name }}
                </span>
              </div>
              <h1 class="text-xl sm:text-2xl font-serif text-parchment font-bold tracking-wide">
                {{ activeMission.currentReport?.title || activeMission.DefinitionMissionIdle?.title || 'Operação de Campo' }}
              </h1>
            </div>

            <!-- BADGE DE STATUS -->
            <div class="sm:text-right flex sm:flex-col items-center sm:items-end justify-between">
              <span class="text-[10px] text-stone-400 font-mono uppercase">Status Tático</span>
              <span 
                class="px-3 py-1 rounded text-xs font-mono font-bold uppercase tracking-wider"
                :class="isReady ? 'bg-green-950 text-green-400 border border-green-700/60 shadow-[0_0_12px_rgba(34,197,94,0.3)]' : 'bg-red-950 text-red-400 border border-red-800/60 shadow-[0_0_12px_rgba(239,68,68,0.3)] animate-pulse'"
              >
                {{ isReady ? '✔ Pronto para Coleta' : '⏳ Em Execução' }}
              </span>
            </div>
          </div>

          <!-- CRONÔMETRO CENTRAL E BARRA DE PROGRESSO -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-black/60 border border-white/10 p-5 sm:p-6 rounded-xl">
            
            <!-- CRONÔMETRO REGRESSIVO -->
            <div class="text-center md:border-r border-white/10 md:pr-6 space-y-1">
              <div class="text-[10px] text-stone-400 font-mono uppercase tracking-widest">Tempo Restante</div>
              <div 
                class="text-3xl sm:text-4xl font-mono font-bold tracking-widest"
                :class="isReady ? 'text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.6)]' : 'text-gold drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]'"
              >
                {{ isReady ? '00:00' : formattedTimeRemaining }}
              </div>
              <div class="text-[10px] text-stone-500 font-mono">
                {{ isReady ? 'Operação Finalizada' : 'Atualização ao vivo' }}
              </div>
            </div>

            <!-- BARRA DE PROGRESSO DAS ETAPAS -->
            <div class="md:col-span-2 space-y-3">
              <div class="flex justify-between text-xs font-mono">
                <span class="text-stone-300">
                  Progresso: <strong class="text-gold">{{ activeMission.currentStage || 0 }} / {{ activeMission.totalStages || 1 }} Etapas Concluídas</strong>
                </span>
                <span class="text-stone-400 font-bold">
                  {{ progressPercentage }}%
                </span>
              </div>

              <!-- BARRA -->
              <div class="w-full bg-zinc-950 h-3 rounded-full overflow-hidden border border-white/10 p-0.5">
                <div 
                  class="h-full rounded-full transition-all duration-1000"
                  :class="isReady ? 'bg-gradient-to-r from-green-700 to-green-400 shadow-[0_0_15px_rgba(34,197,94,0.8)]' : 'bg-gradient-to-r from-red-900 via-red-600 to-gold shadow-[0_0_15px_rgba(192,57,43,0.8)]'"
                  :style="{ width: `${progressPercentage}%` }"
                ></div>
              </div>

              <div class="flex justify-between text-[10px] font-mono text-stone-500">
                <span>Início da Incursão</span>
                <span>Desfecho</span>
              </div>
            </div>

          </div>

          <!-- LINHA DO TEMPO: ETAPAS MECÂNICAS AO VIVO -->
          <div class="space-y-4 pt-2">
            <div class="flex items-center justify-between">
              <h2 class="font-serif text-sm uppercase tracking-widest text-stone-300 font-bold flex items-center gap-2">
                <span>📜</span> Linha do Tempo e Testes de Dados (V5)
              </h2>
              <span class="text-[10px] font-mono text-stone-500">Avaliação sequencial</span>
            </div>

            <div class="space-y-3">
              <div 
                v-for="step in activeMission.currentReport?.steps || []" 
                :key="step.order"
                class="p-4 rounded-xl border transition-all duration-300 space-y-2"
                :class="{
                  'bg-green-950/20 border-green-700/50 shadow-[0_0_15px_rgba(34,197,94,0.1)]': step.status === 'COMPLETED' && step.passed,
                  'bg-red-950/30 border-red-800/60 shadow-[0_0_15px_rgba(239,68,68,0.15)]': step.status === 'COMPLETED' && !step.passed,
                  'bg-yellow-950/20 border-yellow-500/50 animate-pulse shadow-[0_0_15px_rgba(234,179,8,0.15)]': step.status === 'IN_PROGRESS',
                  'bg-black/40 border-white/5 opacity-50': step.status === 'LOCKED'
                }"
              >
                <!-- CABEÇALHO DA ETAPA -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div class="flex items-center gap-2.5">
                    <span 
                      class="w-6 h-6 rounded-full text-xs font-mono font-bold flex items-center justify-center shadow-md"
                      :class="{
                        'bg-green-600 text-black': step.status === 'COMPLETED' && step.passed,
                        'bg-red-600 text-white': step.status === 'COMPLETED' && !step.passed,
                        'bg-yellow-500 text-black animate-spin': step.status === 'IN_PROGRESS',
                        'bg-zinc-800 text-gray-400': step.status === 'LOCKED'
                      }"
                    >
                      {{ step.order }}
                    </span>
                    <h3 class="font-serif font-bold text-sm text-parchment">{{ step.actionName }}</h3>
                  </div>

                  <div class="flex items-center gap-2 text-[11px] font-mono">
                    <span v-if="step.status === 'COMPLETED'" class="px-2.5 py-0.5 rounded font-bold uppercase" :class="step.passed ? 'bg-green-950 text-green-400 border border-green-800' : 'bg-red-950 text-red-400 border border-red-800'">
                      {{ step.passed ? '✔ Sucesso' : '✖ Falha' }}
                    </span>
                    <span v-else-if="step.status === 'IN_PROGRESS'" class="px-2.5 py-0.5 rounded bg-yellow-950 text-yellow-400 border border-yellow-700 font-bold uppercase">
                      ⏳ Executando
                    </span>
                    <span v-else class="px-2.5 py-0.5 rounded bg-zinc-900 text-gray-500 border border-zinc-800 font-bold uppercase">
                      🔒 Bloqueada
                    </span>
                    <span class="text-stone-400 font-mono text-[10px] hidden sm:inline">({{ step.pool }})</span>
                  </div>
                </div>

                <!-- NARRATIVA -->
                <p class="text-xs text-stone-300 font-light leading-relaxed pl-8">
                  {{ step.narrative }}
                </p>

                <!-- DADOS ROLADOS -->
                <div v-if="step.status === 'COMPLETED' && step.rolls" class="text-[11px] text-stone-400 font-mono pl-8 pt-1 flex flex-wrap items-center gap-2">
                  <span>🎲 Dados: <strong class="text-white">[{{ step.rolls.join(', ') }}]</strong></span>
                  <span>&rarr;</span>
                  <span :class="step.passed ? 'text-green-400 font-bold' : 'text-red-400 font-bold'">
                    {{ step.successes }} {{ step.successes === 1 ? 'sucesso' : 'sucessos' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- PAINEL DO CICLO NOTURNO INTEGRADO -->
          <div class="bg-black/50 border border-cyan-950 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-stone-300">
            <div class="flex items-center gap-3">
              <span class="text-xl">🌙</span>
              <div>
                <span class="text-[10px] text-stone-400 uppercase block">Relógio Noturno</span>
                <span class="font-bold text-cyan-300">{{ liveNightTime }}</span>
              </div>
            </div>
            <div class="text-center sm:text-right">
              <span class="text-[10px] text-stone-400 uppercase block">Horas até o Amanhecer</span>
              <span :class="isSunHazardActive ? 'text-red-400 font-bold animate-pulse' : 'text-gold font-bold'">
                {{ hoursRemaining }}h restantes
              </span>
            </div>
          </div>

          <!-- BOTÕES DE AÇÃO PRINCIPAIS -->
          <div class="pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-4">
            
            <!-- BOTÃO COLETAR RECOMPENSAS (QUANDO PRONTO) -->
            <button 
              v-if="isReady" 
              @click="resolveMission" 
              :disabled="isResolving"
              class="flex-1 py-4 px-6 rounded-lg bg-gold hover:bg-gold-light text-black font-serif font-bold text-sm uppercase tracking-widest transition-all shadow-[0_0_25px_rgba(212,175,55,0.5)] animate-bounce disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{{ isResolving ? 'Processando Recompensas...' : '🏆 Coletar Recompensas & Finalizar Operação' }}</span>
            </button>

            <!-- BOTÃO ABORTAR OPERAÇÃO (DURANTE A MISSÃO) -->
            <button 
              v-else 
              @click="cancelMission" 
              :disabled="isCancelling"
              class="py-3 px-6 rounded-lg border border-red-700/80 bg-red-950/40 hover:bg-red-900 hover:text-white text-red-300 font-serif font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(185,28,28,0.3)] disabled:opacity-50"
            >
              {{ isCancelling ? 'Abortando...' : '🛑 Abortar Operação (Desistir)' }}
            </button>

            <!-- BOTÃO ATUALIZAR STATUS -->
            <button 
              @click="fetchActiveMission" 
              class="py-3 px-5 rounded-lg border border-white/10 hover:bg-white/5 text-stone-300 font-serif text-xs uppercase tracking-wider transition-all"
              title="Recarregar status da missão"
            >
              🔄 Atualizar
            </button>
          </div>

        </div>

      </div>

    </main>

    <!-- MODAL GÓTICO DE RESULTADO / RECOMPENSAS DA OPERAÇÃO -->
    <div v-if="showResultModal && finalReport" class="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-md">
      <div class="border-2 border-red-700/80 bg-[#0a0507] p-6 sm:p-8 max-w-lg w-full relative rounded-xl shadow-[0_0_50px_rgba(255,0,0,0.35)] space-y-6 max-h-[90vh] overflow-y-auto font-sans">
        
        <div class="text-center space-y-2">
          <div class="text-3xl font-serif" :class="finalReport.isSuccess ? 'text-green-400' : 'text-red-500'">
            {{ finalReport.isSuccess ? '🏆 OPERAÇÃO CONCLUÍDA' : '💀 OPERAÇÃO INTERROMPIDA' }}
          </div>
          <h2 class="font-serif text-lg text-parchment font-bold uppercase tracking-wider">
            {{ finalReport.title }}
          </h2>
          <p class="text-xs text-stone-400 font-light">
            {{ finalReport.isSuccess ? 'O plano correu com êxito pelas sombras de Nocturna.' : 'As forças locais reagiram e interromperam a incursão.' }}
          </p>
        </div>
        
        <!-- ETAPAS E ROLAGENS DE DADOS -->
        <div class="space-y-3 max-h-[200px] overflow-y-auto pr-2">
          <div 
            v-for="(step, index) in finalReport.steps || []" 
            :key="index" 
            class="bg-black/70 border-l-2 p-3 text-xs space-y-1 rounded-r" 
            :class="step.passed ? 'border-l-green-500' : 'border-l-red-600'"
          >
            <div class="font-bold uppercase tracking-widest text-[11px] font-mono" :class="step.passed ? 'text-green-400' : 'text-red-400'">
              {{ step.actionName }} ({{ step.pool || 'Teste' }})
            </div>
            <div class="text-gray-300 leading-relaxed">{{ step.narrative }}</div>
            <div v-if="step.rolls && Array.isArray(step.rolls)" class="text-[10px] text-gray-500 font-mono">
              🎲 Dados: [{{ step.rolls.join(', ') }}] &rarr; <strong :class="step.passed ? 'text-green-400' : 'text-red-400'">{{ step.successes || 0 }} sucessos</strong>
            </div>
          </div>
        </div>

        <!-- RECOMPENSAS E IMPACTOS -->
        <div v-if="finalReport.finalChanges && finalReport.finalChanges.length > 0" class="border-t border-white/10 pt-3">
          <h3 class="text-gold font-serif uppercase tracking-widest text-xs mb-2 font-bold flex items-center gap-1.5">
            <span>✨</span> Recompensas & Impactos na Ficha
          </h3>
          <div class="space-y-1.5 text-xs text-parchment font-mono">
            <div v-for="(change, i) in finalReport.finalChanges" :key="i" class="p-2.5 bg-black/60 border border-white/10 rounded flex items-center gap-2">
              <span>{{ change }}</span>
            </div>
          </div>
        </div>
        
        <button 
          @click="onCloseResultAndReturn" 
          class="w-full bg-vamp-c2 hover:bg-red-600 text-white p-3 font-serif uppercase tracking-widest font-bold transition-all rounded shadow-[0_0_15px_rgba(192,57,43,0.5)]"
        >
          🏠 Retornar ao Refúgio Seguro
        </button>
      </div>
    </div>

    <!-- MODAL DE EMERGÊNCIA SOLAR -->
    <div v-if="showEmergencyModal" class="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div class="max-w-md w-full bg-[#0d0404] border-2 border-red-600 rounded-xl p-6 shadow-[0_0_60px_rgba(255,0,0,0.6)] space-y-5 text-stone-200 relative">
        <button @click="showEmergencyModal = false" class="absolute top-4 right-4 text-stone-500 hover:text-white text-xl">✕</button>
        <div class="text-center space-y-2">
          <div class="text-4xl animate-bounce">☀️</div>
          <h2 class="text-xl font-serif text-red-500 font-bold uppercase tracking-widest">O Sol Raiou!</h2>
          <p class="text-xs text-stone-300 font-sans leading-relaxed">
            Selecione uma ação de emergência para proteger sua carne morta da queimação do dia:
          </p>
        </div>
        <div class="space-y-2">
          <button 
            @click="takeShelter('GO_HOME')" 
            class="w-full text-left p-3 rounded-lg border border-red-500/40 hover:border-red-500 bg-red-950/30 hover:bg-red-950/70 transition-all font-serif text-xs text-red-300 group"
          >
            🏠 Retornar às Pressas ao Refúgio
          </button>
          <button 
            @click="takeShelter('BUY_MOTEL')" 
            class="w-full text-left p-3 rounded-lg border border-amber-500/30 hover:border-amber-500 bg-stone-950/80 hover:bg-amber-950/40 transition-all font-serif text-xs text-amber-300"
          >
            🏨 Alugar Motel com Blackout (R$ 400)
          </button>
          <button 
            @click="takeShelter('BREACH_SEWER')" 
            class="w-full text-left p-3 rounded-lg border border-emerald-500/30 hover:border-emerald-500 bg-stone-950/80 hover:bg-emerald-950/40 transition-all font-serif text-xs text-emerald-300"
          >
            🕳️ Forçar Bueiro / Esgoto (Força + Ladroagem)
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../services/api'
import { confirmAction, notifySuccess, notifyError } from '../utils/gothicAlerts'

const router = useRouter()
const route = useRoute()

const characterId = ref<string>('')
const character = ref<any>(null)
const activeMission = ref<any>(null)
const nightStatus = ref<any>(null)
const loading = ref(true)
const isResolving = ref(false)
const isCancelling = ref(false)
const showResultModal = ref(false)
const showEmergencyModal = ref(false)
const finalReport = ref<any>(null)

const now = ref(Date.now())
let tickerInterval: any = null

const isReady = computed(() => {
  if (!activeMission.value?.expiresAt) return false
  return now.value >= new Date(activeMission.value.expiresAt).getTime()
})

const formattedTimeRemaining = computed(() => {
  if (!activeMission.value?.expiresAt) return '00:00'
  const diff = new Date(activeMission.value.expiresAt).getTime() - now.value
  if (diff <= 0) return 'Pronto'
  const mins = Math.floor(diff / 60000)
  const secs = Math.floor((diff % 60000) / 1000)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
})

const progressPercentage = computed(() => {
  if (isReady.value) return 100
  if (!activeMission.value?.totalStages) return 0
  const current = activeMission.value?.currentStage || 0
  const total = activeMission.value?.totalStages || 1
  return Math.min(100, Math.round((current / total) * 100))
})

const missionCategoryLabel = computed(() => {
  const cat = activeMission.value?.DefinitionMissionIdle?.category
  if (cat === 'HUNT') return '🩸 Caçada de Sangue'
  if (cat === 'RECON') return '🔍 Reconhecimento de Território'
  return '⚔️ Incursão Tática'
})

const isDaytime = computed(() => {
  const currentMinutes = nightStatus.value?.nightMinutesSpent || 0
  return currentMinutes >= 600
})

const isSunHazardActive = computed(() => {
  return isDaytime.value || !!nightStatus.value?.isSunHazardActive
})

const liveNightTime = computed(() => {
  const minsSpent = nightStatus.value?.nightMinutesSpent || 0
  const totalMin = 1200 + minsSpent // 20:00 = 1200 min
  const h = Math.floor((totalMin % 1440) / 60)
  const m = totalMin % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
})

const hoursRemaining = computed(() => {
  const minsSpent = nightStatus.value?.nightMinutesSpent || 0
  return Math.max(0, 10 - Math.floor(minsSpent / 60))
})

const handleBackNavigation = () => {
  if (activeMission.value && !isReady.value) {
    confirmAction(
      'MISSÃO EM ANDAMENTO',
      'A operação continuará rodando nas sombras em tempo real. Deseja retornar ao Hub?',
      'Ir ao Hub',
      'Permanecer na Missão'
    ).then(confirmed => {
      if (confirmed) {
        router.push(`/personagem/hub?id=${characterId.value}`)
      }
    })
  } else {
    router.push(`/personagem/hub?id=${characterId.value}`)
  }
}

const fetchCharacter = async () => {
  try {
    const res = await api.get(`/api/character-vampires/${characterId.value}`)
    character.value = res.data
  } catch (e) {
    console.error('Erro ao carregar personagem:', e)
  }
}

const fetchNightStatus = async () => {
  try {
    const res = await api.get(`/api/night-cycle/${characterId.value}/status`)
    nightStatus.value = res.data
  } catch (e) {
    console.error('Erro ao buscar status da noite:', e)
  }
}

const fetchActiveMission = async () => {
  try {
    const res = await api.get(`/api/missions-idle/active/${characterId.value}`)
    activeMission.value = res.data
  } catch (e) {
    console.error('Erro ao carregar missão ativa:', e)
  }
}

const resolveMission = async () => {
  if (!activeMission.value) return
  try {
    isResolving.value = true
    const res = await api.post('/api/missions-idle/resolve', {
      activeMissionId: activeMission.value.id
    })
    finalReport.value = res.data.report
    showResultModal.value = true
    activeMission.value = null
    await fetchCharacter()
    await fetchNightStatus()
  } catch (e: any) {
    console.error(e)
    notifyError('Erro ao Resolver', e.response?.data?.error || 'Não foi possível resolver a operação.')
  } finally {
    isResolving.value = false
  }
}

const cancelMission = async () => {
  if (!activeMission.value?.id) return
  const confirmed = await confirmAction(
    'ABORTAR OPERAÇÃO?',
    'Tem certeza que deseja abortar esta missão? Todo o progresso será cancelado e nenhuma recompensa será concedida.',
    'Sim, Abortar',
    'Manter Missão'
  )

  if (!confirmed) return

  try {
    isCancelling.value = true
    await api.post('/api/missions-idle/cancel', {
      activeMissionId: activeMission.value.id
    })
    notifySuccess('Operação Cancelada', 'O vampiro retornou e está livre para novas missões.')
    activeMission.value = null
    router.push(`/personagem/hub?id=${characterId.value}`)
  } catch (e: any) {
    notifyError('Erro ao Cancelar', e.response?.data?.error || 'Não foi possível cancelar a missão.')
  } finally {
    isCancelling.value = false
  }
}

const onCloseResultAndReturn = () => {
  showResultModal.value = false
  finalReport.value = null
  router.push(`/personagem/hub?id=${characterId.value}`)
}

const triggerEmergencyShelter = () => {
  showEmergencyModal.value = true
}

const takeShelter = async (type: string) => {
  try {
    if (type === 'GO_HOME') {
      await api.post(`/api/night-cycle/${characterId.value}/return-haven`)
      notifySuccess('Retorno Seguro', 'Você retornou com segurança ao seu refúgio antes que a luz do sol o destruísse!')
      showEmergencyModal.value = false
      router.push(`/personagem/hub?id=${characterId.value}`)
      return
    }

    const res = await api.post(`/api/night-cycle/${characterId.value}/shelter`, { shelterType: type })
    notifySuccess('Abrigo Conquistado', res.data.message)
    showEmergencyModal.value = false
    await fetchNightStatus()
  } catch (e: any) {
    notifyError('Falha no Abrigo', e.response?.data?.error || 'Não foi possível encontrar abrigo.')
  }
}

onMounted(async () => {
  characterId.value = (route.query.id as string) || localStorage.getItem('lira_active_character_id') || ''
  if (!characterId.value) {
    router.push('/jogador/vampire')
    return
  }

  await Promise.all([
    fetchCharacter(),
    fetchNightStatus(),
    fetchActiveMission()
  ])

  loading.value = false

  tickerInterval = setInterval(async () => {
    now.value = Date.now()
    // Atualização leve das etapas a cada 10s se estiver em progresso
    if (activeMission.value && !isReady.value && Math.floor(now.value / 1000) % 10 === 0) {
      await fetchActiveMission()
    }
  }, 1000)
})

onUnmounted(() => {
  if (tickerInterval) clearInterval(tickerInterval)
})
</script>
