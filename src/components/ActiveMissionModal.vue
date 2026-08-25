<template>
  <div v-if="visible && activeMission" class="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
    <div class="border-2 border-red-800/80 bg-[#080507] p-6 md:p-8 max-w-2xl w-full relative rounded-xl shadow-[0_0_60px_rgba(153,27,27,0.35)] space-y-6 max-h-[90vh] overflow-y-auto font-sans select-none">
      
      <!-- BOTÃO DE FECHAR -->
      <button @click="close" class="absolute top-5 right-5 text-stone-500 hover:text-white text-2xl transition-colors">✕</button>

      <!-- CABEÇALHO DO DOSSIÊ -->
      <div class="border-b border-white/10 pb-4 space-y-1.5">
        <div class="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-vamp-c2">
          <span class="w-2.5 h-2.5 rounded-full bg-vamp-c2 animate-ping"></span>
          <span>Dossiê Tático • Operação em Andamento</span>
        </div>
        
        <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h2 class="text-xl sm:text-2xl font-serif text-parchment font-bold tracking-wide">
            {{ activeMission.currentReport?.title || activeMission.DefinitionMissionIdle?.title || 'Operação de Campo' }}
          </h2>
          <div class="text-right">
            <span class="text-[10px] text-gray-400 font-mono uppercase block">Tempo Restante</span>
            <span class="text-base font-mono font-bold text-gold">
              {{ isReady ? 'Tempo Esgotado' : formattedTimeRemaining }}
            </span>
          </div>
        </div>
      </div>

      <!-- BARRA DE PROGRESSO GERAL -->
      <div class="bg-black/60 border border-white/10 p-4 rounded-lg space-y-2">
        <div class="flex justify-between text-xs font-mono uppercase tracking-wider">
          <span class="text-gray-300">
            Progresso: <strong class="text-gold">{{ activeMission.currentStage || 0 }} / {{ activeMission.totalStages || 1 }} Etapas</strong>
          </span>
          <span :class="isReady ? 'text-green-400 font-bold' : 'text-vamp-c2 animate-pulse'">
            {{ isReady ? 'Pronto para Coleta' : 'Em Execução...' }}
          </span>
        </div>

        <div class="w-full bg-zinc-900 h-2.5 rounded-full overflow-hidden border border-white/5">
          <div 
            class="bg-gradient-to-r from-red-900 via-vamp-c2 to-gold h-full transition-all duration-1000 shadow-[0_0_12px_rgba(192,57,43,0.8)]"
            :style="{ width: isReady ? '100%' : `${((activeMission.currentStage || 0) / (activeMission.totalStages || 1)) * 100}%` }"
          ></div>
        </div>
      </div>

      <!-- LINHA DO TEMPO DAS ETAPAS MECÂNICAS AO VIVO -->
      <div class="space-y-3">
        <h3 class="font-serif text-xs uppercase tracking-widest text-parchment-dim font-bold flex items-center gap-2">
          <span>📜</span> Relatório Tático de Campo (Etapa por Etapa)
        </h3>

        <div class="space-y-2.5 max-h-[260px] overflow-y-auto pr-2">
          <div 
            v-for="step in activeMission.currentReport?.steps || []" 
            :key="step.order"
            class="p-3.5 rounded-lg border transition-all duration-300 space-y-1.5"
            :class="{
              'bg-green-950/20 border-green-700/50 shadow-[0_0_12px_rgba(34,197,94,0.1)]': step.status === 'COMPLETED' && step.passed,
              'bg-red-950/30 border-red-800/60 shadow-[0_0_12px_rgba(239,68,68,0.15)]': step.status === 'COMPLETED' && !step.passed,
              'bg-yellow-950/20 border-yellow-500/50 animate-pulse shadow-[0_0_12px_rgba(234,179,8,0.15)]': step.status === 'IN_PROGRESS',
              'bg-black/40 border-white/5 opacity-50': step.status === 'LOCKED'
            }"
          >
            <!-- CABEÇALHO DA ETAPA -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
              <div class="flex items-center gap-2">
                <span 
                  class="w-5 h-5 rounded-full text-[10px] font-mono font-bold flex items-center justify-center"
                  :class="{
                    'bg-green-600 text-black': step.status === 'COMPLETED' && step.passed,
                    'bg-red-600 text-white': step.status === 'COMPLETED' && !step.passed,
                    'bg-yellow-500 text-black animate-spin': step.status === 'IN_PROGRESS',
                    'bg-zinc-800 text-gray-400': step.status === 'LOCKED'
                  }"
                >
                  {{ step.order }}
                </span>
                <h4 class="font-serif font-bold text-sm text-parchment">{{ step.actionName }}</h4>
              </div>

              <div class="flex items-center gap-2 text-[10px] font-mono">
                <span v-if="step.status === 'COMPLETED'" class="px-2 py-0.5 rounded font-bold uppercase" :class="step.passed ? 'bg-green-950 text-green-400 border border-green-800' : 'bg-red-950 text-red-400 border border-red-800'">
                  {{ step.passed ? '✔ Sucesso' : '✖ Falha' }}
                </span>
                <span v-else-if="step.status === 'IN_PROGRESS'" class="px-2 py-0.5 rounded bg-yellow-950 text-yellow-400 border border-yellow-700 font-bold uppercase">
                  ⏳ Em Execução Agora
                </span>
                <span v-else class="px-2 py-0.5 rounded bg-zinc-900 text-gray-500 border border-zinc-800 font-bold uppercase">
                  🔒 Bloqueada
                </span>
                <span class="text-gray-500 font-mono text-[9px] hidden sm:inline">({{ step.pool }})</span>
              </div>
            </div>

            <!-- NARRATIVA E ROLAGEM -->
            <p class="text-xs text-stone-300 font-light leading-relaxed">
              {{ step.narrative }}
            </p>

            <div v-if="step.status === 'COMPLETED' && step.rolls" class="text-[10px] text-gray-400 font-mono pt-0.5">
              🎲 Dados: [{{ step.rolls.join(', ') }}] → <strong :class="step.passed ? 'text-green-400' : 'text-red-400'">{{ step.successes }} sucessos</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- BOTÕES DE AÇÃO NA PARTE INFERIOR -->
      <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
        <!-- BOTÃO COLETAR (QUANDO PRONTO) -->
        <button 
          v-if="isReady"
          @click="resolve"
          :disabled="isResolving"
          class="flex-1 py-3 px-6 rounded bg-gold hover:bg-gold-light text-black text-xs font-serif font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)] animate-bounce disabled:opacity-50"
        >
          {{ isResolving ? 'Coletando...' : '🏆 Encerrar Operação & Coletar Recompensas' }}
        </button>

        <!-- BOTÃO ABORTAR OPERAÇÃO -->
        <button 
          v-else
          @click="cancel"
          :disabled="isCancelling"
          class="py-2.5 px-6 rounded border border-red-700/80 bg-red-950/40 hover:bg-red-900 hover:text-white text-red-300 text-xs font-serif font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(185,28,28,0.3)] disabled:opacity-50"
        >
          {{ isCancelling ? 'Abortando...' : '🛑 Abortar Operação (Desistir)' }}
        </button>

        <button 
          @click="close"
          class="py-2.5 px-6 rounded border border-white/20 hover:bg-white/10 text-stone-300 text-xs font-serif uppercase tracking-wider transition-all"
        >
          Fechar Dossiê
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { confirmAction, notifySuccess, notifyError } from '../utils/gothicAlerts'
import api from '../services/api'

const props = defineProps<{
  visible: boolean
  activeMission: any
  timeRemaining?: string
}>()

const emit = defineEmits(['close', 'resolved', 'cancelled'])

const isResolving = ref(false)
const isCancelling = ref(false)
const now = ref(Date.now())
let tickerInterval: any = null

onMounted(() => {
  tickerInterval = setInterval(() => {
    now.value = Date.now()
  }, 1000)
})

onUnmounted(() => {
  if (tickerInterval) clearInterval(tickerInterval)
})

const isReady = computed(() => {
  if (!props.activeMission?.expiresAt) return false
  return now.value >= new Date(props.activeMission.expiresAt).getTime()
})

const formattedTimeRemaining = computed(() => {
  if (!props.activeMission?.expiresAt) return '00:00'
  const diff = new Date(props.activeMission.expiresAt).getTime() - now.value
  if (diff <= 0) return 'Pronto para Coleta'
  const mins = Math.floor(diff / 60000)
  const secs = Math.floor((diff % 60000) / 1000)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
})

const close = () => {
  emit('close')
}

const cancel = async () => {
  if (!props.activeMission?.id) return
  const confirmed = await confirmAction(
    'ABORTAR OPERAÇÃO?',
    'Tem certeza que deseja abortar esta missão? Todo o progresso será cancelado e nenhuma recompensa será obtida.',
    'Sim, Abortar',
    'Manter Missão'
  )

  if (!confirmed) return

  try {
    isCancelling.value = true
    await api.post('/api/missions-idle/cancel', {
      activeMissionId: props.activeMission.id
    })
    notifySuccess('Operação Cancelada', 'O vampiro retornou e está livre para novas missões.')
    emit('cancelled')
    emit('close')
  } catch (e: any) {
    notifyError('Erro ao Cancelar', e.response?.data?.error || 'Não foi possível cancelar a missão.')
  } finally {
    isCancelling.value = false
  }
}

const resolve = () => {
  emit('resolved')
}
</script>
