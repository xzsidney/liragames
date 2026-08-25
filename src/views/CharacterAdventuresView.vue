<template>
  <div class="min-h-screen bg-[#050505] text-parchment font-sans pb-20 selection:bg-blood-red selection:text-white">
    <nav class="border-b border-vamp-border bg-black/80 backdrop-blur-md sticky top-0 z-20">
      <div class="max-w-[1200px] mx-auto px-4 h-12 flex items-center justify-between">
        <button @click="router.push(`/personagem/hub?id=${characterId}`)" class="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 font-serif uppercase tracking-widest transition-colors">
          <span>←</span> VOLTAR AO HUB
        </button>
        <div class="text-[10px] font-serif tracking-widest uppercase text-vamp-c2 flex items-center gap-2">
          <span>⚜</span> INCURSÕES DA NOITE
        </div>
      </div>
    </nav>

    <main class="max-w-[1200px] mx-auto px-4 py-8 space-y-10">
      <header class="text-center border-b border-vamp-border pb-6">
        <h1 class="font-serif text-3xl md:text-5xl text-vamp-c2 mb-2 uppercase tracking-widest">Incursões & Caçadas</h1>
        <p class="text-xs text-parchment-dim uppercase tracking-widest font-serif max-w-2xl mx-auto">
          Escolha uma área de atuação. Suas estatísticas e perícias V5 definirão seu sucesso nas sombras de Nocturna.
        </p>
      </header>

      <div v-if="loading" class="text-center py-20 text-vamp-c2 text-sm uppercase tracking-widest font-serif animate-pulse">
        Sincronizando com a rede...
      </div>

      <!-- CARD DA MISSÃO ATIVA / LINHA DO TEMPO EM TEMPO REAL -->
      <div v-else-if="activeMission" class="border border-vamp-c2/80 bg-zinc-950/90 p-6 md:p-8 rounded-xl shadow-[0_0_40px_rgba(192,57,43,0.25)] space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div>
            <div class="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-vamp-c2">
              <span class="w-2 h-2 rounded-full bg-vamp-c2 animate-ping"></span>
              Operação em Tempo Real
            </div>
            <h2 class="text-2xl font-serif text-parchment font-bold">{{ activeMission.currentReport?.title || activeMission.DefinitionMissionIdle?.title || 'Caçada Urbana' }}</h2>
          </div>

          <div class="flex items-center gap-3">
            <div class="text-right">
              <span class="text-[9px] text-gray-400 font-mono block uppercase">Tempo Restante</span>
              <span class="text-base font-serif font-bold text-gold">{{ activeMission.readyToResolve ? 'Tempo Esgotado' : timeRemainingDisplay }}</span>
            </div>
          </div>
        </div>
        
        <!-- BARRA DE PROGRESSO GERAL -->
        <div class="bg-black/60 border border-white/10 p-4 rounded-lg space-y-2">
          <div class="flex justify-between text-xs font-mono uppercase tracking-wider">
            <span class="text-gray-300">Progresso da Operação: <strong class="text-gold">{{ activeMission.currentStage }} / {{ activeMission.totalStages }} Etapas Concluídas</strong></span>
            <span :class="activeMission.readyToResolve ? 'text-green-400 font-bold' : 'text-vamp-c2 animate-pulse'">
              {{ activeMission.readyToResolve ? 'Pronto para Coleta' : 'Em Execução...' }}
            </span>
          </div>
          <div class="w-full bg-zinc-900 h-2.5 rounded overflow-hidden border border-white/5">
            <div 
              class="bg-gradient-to-r from-red-900 to-vamp-c2 h-full transition-all duration-1000 shadow-[0_0_10px_rgba(192,57,43,0.8)]" 
              :style="{ width: ((activeMission.currentStage || 1) / (activeMission.totalStages || 1)) * 100 + '%' }"
            ></div>
          </div>
        </div>

        <!-- LINHA DO TEMPO DAS ETAPAS MECÂNICAS -->
        <div class="space-y-4">
          <h3 class="font-serif text-xs uppercase tracking-widest text-parchment-dim font-bold flex items-center gap-2">
            <span>📜</span> Relatório Tático de Campo (Etapa por Etapa)
          </h3>

          <div class="space-y-3">
            <div 
              v-for="step in activeMission.currentReport?.steps || []" 
              :key="step.order"
              class="p-4 rounded-lg border transition-all duration-300 space-y-2"
              :class="{
                'bg-green-950/20 border-green-700/50 shadow-[0_0_15px_rgba(34,197,94,0.1)]': step.status === 'COMPLETED' && step.passed,
                'bg-red-950/30 border-red-800/60 shadow-[0_0_15px_rgba(239,68,68,0.15)]': step.status === 'COMPLETED' && !step.passed,
                'bg-yellow-950/20 border-yellow-500/50 animate-pulse shadow-[0_0_15px_rgba(234,179,8,0.15)]': step.status === 'IN_PROGRESS',
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
                      'bg-yellow-500 text-black': step.status === 'IN_PROGRESS',
                      'bg-zinc-800 text-gray-400': step.status === 'LOCKED'
                    }"
                  >
                    {{ step.order }}
                  </span>
                  <h4 class="font-serif font-bold text-sm text-parchment">{{ step.actionName }}</h4>
                </div>

                <div class="flex items-center gap-2 text-[10px] font-mono">
                  <span v-if="step.status === 'COMPLETED'" class="px-2 py-0.5 rounded font-bold uppercase" :class="step.passed ? 'bg-green-950 text-green-400 border border-green-800' : 'bg-red-950 text-red-400 border border-red-800'">
                    {{ step.passed ? '✔ Sucesso no Teste' : '✖ Falha no Teste' }}
                  </span>
                  <span v-else-if="step.status === 'IN_PROGRESS'" class="px-2 py-0.5 rounded bg-yellow-950 text-yellow-400 border border-yellow-700 font-bold uppercase">
                    ⏳ Em Execução Agora
                  </span>
                  <span v-else class="px-2 py-0.5 rounded bg-zinc-900 text-gray-500 font-mono uppercase">
                    🔒 Aguardando
                  </span>

                  <span v-if="step.pool" class="text-gray-400">({{ step.pool }})</span>
                </div>
              </div>

              <!-- CORPO DA NARRATIVA -->
              <p class="text-xs text-gray-300 leading-relaxed font-light pl-7">
                {{ step.narrative }}
              </p>

              <!-- DADOS ROLADOS (SE CONCLUÍDO) -->
              <div v-if="step.status === 'COMPLETED' && step.rolls" class="pl-7 text-[10px] font-mono text-gray-500 flex items-center gap-3 pt-1 border-t border-white/5">
                <span>Dados V5: <strong class="text-gray-300">[{{ step.rolls.join(', ') }}]</strong></span>
                <span>Sucessos Obtidos: <strong :class="step.passed ? 'text-green-400' : 'text-red-400'">{{ step.successes }}</strong></span>
              </div>
            </div>
          </div>
        </div>

        <!-- BOTÕES DE AÇÃO -->
        <div class="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/10">
          <button 
            v-if="activeMission.readyToResolve" 
            @click="resolveActiveMission" 
            class="flex-1 bg-gold hover:bg-gold-light text-black py-3.5 px-6 font-serif font-bold uppercase tracking-widest text-xs transition-all shadow-[0_0_25px_rgba(212,175,55,0.4)] animate-bounce"
          >
            🏆 Encerrar Operação & Coletar Recompensas
          </button>
          <button 
            v-else 
            @click="cancelActiveMission" 
            class="py-3 px-6 border border-vamp-c2/60 text-vamp-c2 hover:bg-vamp-c2 hover:text-white font-serif uppercase tracking-widest text-xs transition-all font-bold opacity-80"
          >
            Abortar Operação (Desistir)
          </button>
        </div>
      </div>

      <!-- LISTA DE MISSÕES DISPONÍVEIS (SE NÃO HOUVER ATIVA) -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div v-for="mission in missions" :key="mission.id" class="border border-vamp-border bg-black/40 p-6 hover:border-vamp-c2 transition-colors flex flex-col rounded-lg">
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-serif text-lg text-white uppercase tracking-widest">{{ mission.title }}</h3>
            <span class="text-[10px] px-2 py-1 bg-vamp-bg border border-vamp-border text-vamp-c2 uppercase font-bold">{{ mission.category === 'HUNT' ? 'Caçada' : 'Operação' }}</span>
          </div>
          <p class="text-sm text-parchment-dim mb-4 italic">{{ mission.description }}</p>
          <div class="text-xs text-gray-400 mb-6 font-mono space-y-1">
            <div>⏱ Duração Total: {{ mission.durationMinutes }} minutos</div>
            <div>⚠️ Dificuldade Base: {{ mission.baseDifficulty }}</div>
            <div>🎯 Ações: {{ mission.Actions?.length || 0 }} etapas mecânicas</div>
          </div>
          
          <div class="mt-auto space-y-3">
            <button v-if="mission.category === 'HUNT'" v-for="action in mission.Actions" :key="action.id" @click="startMission(mission.id, action.id)" class="w-full border border-vamp-border bg-vamp-bg hover:border-vamp-c2 hover:text-vamp-c2 transition-colors p-3 flex justify-between items-center group text-xs uppercase tracking-widest font-serif rounded">
              <span>{{ action.name }}</span>
              <span class="text-[9px] text-gray-500 group-hover:text-vamp-c2">{{ action.attributeReq }} + {{ action.skillReq }}</span>
            </button>

            <button v-if="mission.category === 'OPERATION'" @click="startMission(mission.id)" class="w-full border border-vamp-c2 bg-black hover:bg-vamp-c2 hover:text-black transition-colors p-3 text-center text-xs uppercase tracking-widest font-serif font-bold text-vamp-c2 rounded">
              Iniciar Infiltração Completa
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal Resultados -->
    <div v-if="showResultModal && finalReport" class="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div class="border border-vamp-c2 bg-vamp-bg p-8 max-w-lg w-full relative rounded-lg space-y-6">
        <h3 class="font-serif text-2xl text-center uppercase tracking-widest" :class="finalReport.isSuccess ? 'text-green-500' : 'text-vamp-c2'">
          {{ finalReport.title }}
        </h3>
        
        <div class="space-y-3 max-h-[250px] overflow-y-auto pr-2">
          <div v-for="(step, index) in finalReport.steps" :key="index" class="bg-black/80 border-l-2 p-3 text-xs space-y-1" :class="step.passed ? 'border-l-green-600' : 'border-l-vamp-c2'">
            <div class="font-bold uppercase tracking-widest text-[11px]" :class="step.passed ? 'text-green-500' : 'text-vamp-c2'">
              {{ step.actionName }} ({{ step.pool }})
            </div>
            <div class="text-gray-300">{{ step.narrative }}</div>
            <div v-if="step.rolls" class="text-[10px] text-gray-500">Dados rolados: [{{ step.rolls.join(', ') }}] -> {{ step.successes }} sucessos</div>
          </div>
        </div>

        <div v-if="finalReport.finalChanges && finalReport.finalChanges.length > 0">
          <h4 class="text-gold font-serif uppercase tracking-widest text-xs mb-2">Recompensas e Impactos no Personagem</h4>
          <div class="space-y-1 text-xs text-parchment font-mono">
            <div v-for="(change, i) in finalReport.finalChanges" :key="i" class="p-2 bg-black border border-vamp-border rounded">
              {{ change }}
            </div>
          </div>
        </div>
        
        <button @click="closeModal" class="w-full bg-vamp-c2 text-black p-3 font-serif uppercase tracking-widest font-bold hover:bg-white transition-colors rounded">
          Compreendido
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const route = useRoute()
const characterId = ref<string>('')

const loading = ref(true)
const missions = ref<any[]>([])
const activeMission = ref<any>(null)
const showResultModal = ref(false)
const finalReport = ref<any>(null)

const timeRemainingDisplay = ref<string>('00:00')
let timerInterval: any = null
let pollInterval: any = null

const fetchMissions = async () => {
  try {
    const res = await api.get('/api/missions-idle')
    missions.value = res.data
  } catch (e) {
    console.error(e)
  }
}

const fetchActiveMission = async () => {
  try {
    if (!characterId.value) return
    const res = await api.get(`/api/missions-idle/active/${characterId.value}`)
    activeMission.value = res.data || null
    updateTimer()
  } catch (e) {
    console.error(e)
  }
}

const startMission = async (missionId: string, forcedActionId?: string) => {
  try {
    loading.value = true
    await api.post('/api/missions-idle/start', {
      characterId: characterId.value,
      definitionMissionIdleId: missionId,
      forcedActionId
    })
    await fetchActiveMission()
  } catch (e: any) {
    alert(e.response?.data?.error || 'Erro ao iniciar missão')
  } finally {
    loading.value = false
  }
}

const resolveActiveMission = async () => {
  try {
    loading.value = true
    const res = await api.post('/api/missions-idle/resolve', {
      activeMissionId: activeMission.value.id
    })
    finalReport.value = res.data.report
    showResultModal.value = true
    activeMission.value = null
  } catch (e: any) {
    alert(e.response?.data?.error || 'Erro ao resolver')
  } finally {
    loading.value = false
  }
}

const cancelActiveMission = async () => {
  if (!confirm('Tem certeza que deseja abortar esta missão? Todo o progresso será perdido e nenhuma recompensa será ganha.')) return
  
  try {
    loading.value = true
    await api.post('/api/missions-idle/cancel', {
      activeMissionId: activeMission.value.id
    })
    activeMission.value = null
  } catch (e: any) {
    alert(e.response?.data?.error || 'Erro ao cancelar missão')
  } finally {
    loading.value = false
  }
}

const closeModal = () => {
  showResultModal.value = false
  finalReport.value = null
}

const updateTimer = () => {
  if (!activeMission.value || activeMission.value.readyToResolve) {
    timeRemainingDisplay.value = '00:00'
    return
  }
  const now = new Date().getTime()
  const expiresAt = new Date(activeMission.value.expiresAt).getTime()
  const diff = Math.max(0, Math.floor((expiresAt - now) / 1000))
  
  const minutes = Math.floor(diff / 60)
  const seconds = diff % 60
  timeRemainingDisplay.value = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

onMounted(async () => {
  characterId.value = (route.query.id as string) || localStorage.getItem('lira_active_character_id') || ''
  await Promise.all([fetchMissions(), fetchActiveMission()])
  loading.value = false
  
  // Auto-poll a cada 3 segundos para revelar etapas em tempo real!
  pollInterval = setInterval(() => {
    if (activeMission.value && !activeMission.value.readyToResolve) {
      fetchActiveMission()
    }
  }, 3000)

  // Timer local por segundo para o relógio
  timerInterval = setInterval(updateTimer, 1000)
})

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval)
  if (timerInterval) clearInterval(timerInterval)
})
</script>
