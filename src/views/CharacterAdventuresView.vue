<template>
  <div class="min-h-screen bg-[#050505] text-parchment font-sans pb-20">
    <nav class="border-b border-vamp-border bg-black/80 backdrop-blur-md sticky top-0 z-20">
      <div class="max-w-[1200px] mx-auto px-4 h-12 flex items-center justify-between">
        <button @click="router.push(`/personagem/hub?id=${characterId}`)" class="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 font-serif uppercase tracking-widest transition-colors">
          <span>←</span> VOLTAR AO HUB
        </button>
        <div class="text-[10px] font-serif tracking-widest uppercase text-vamp-c2">
          INCURSÕES DA NOITE
        </div>
      </div>
    </nav>

    <main class="max-w-[1200px] mx-auto px-4 py-8 space-y-10">
      <header class="text-center border-b border-vamp-border pb-6">
        <h1 class="font-serif text-3xl md:text-5xl text-vamp-c2 mb-2 uppercase tracking-widest">Incursões & Caçadas</h1>
        <p class="text-xs text-parchment-dim uppercase tracking-widest font-serif max-w-2xl mx-auto">
          Escolha uma área de atuação. Suas estatísticas definirão seu sucesso.
        </p>
      </header>

      <div v-if="loading" class="text-center py-20 text-vamp-c2 text-sm uppercase tracking-widest font-serif animate-pulse">
        Sincronizando com a rede...
      </div>

      <div v-else-if="activeMission" class="border border-vamp-c2 bg-black/60 p-6 rounded-md">
        <h2 class="text-xl font-serif text-vamp-c2 uppercase tracking-widest mb-4">Missão em Andamento: {{ activeMission.currentReport?.title || 'Desconhecida' }}</h2>
        
        <div class="space-y-6">
          <div class="bg-vamp-bg border border-vamp-border p-4 rounded text-sm font-sans space-y-2">
                          <div class="flex justify-between text-xs text-gray-400 uppercase font-bold tracking-widest mb-2">
                <span>Etapa {{ activeMission.currentStage }} / {{ activeMission.totalStages }}</span>
                <span v-if="!activeMission.readyToResolve" class="text-vamp-c2 flex gap-2 items-center">
                  <span class="animate-pulse">Em progresso...</span>
                  <span class="text-white bg-vamp-c2/20 px-2 py-0.5 rounded">{{ timeRemainingDisplay }}</span>
                </span>
                <span v-else class="text-green-500">Concluído</span>
              </div>
            
            <div class="w-full bg-black h-2 rounded overflow-hidden">
              <div class="bg-vamp-c2 h-full transition-all duration-1000" :style="{ width: (activeMission.currentStage / activeMission.totalStages) * 100 + '%' }"></div>
            </div>
          </div>

          <div class="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            <div v-for="(step, index) in activeMission.currentReport?.steps || []" :key="index" class="bg-black/80 border-l-2 p-3 text-sm" :class="step.passed ? 'border-l-green-600' : 'border-l-vamp-c2'">
              <div class="font-bold uppercase tracking-widest text-xs mb-1" :class="step.passed ? 'text-green-500' : 'text-vamp-c2'">
                {{ step.actionName }} ({{ step.pool }})
              </div>
              <div class="text-gray-300">{{ step.narrative }}</div>
              <div class="text-[10px] text-gray-500 mt-2">Dados rolados: {{ step.rolls.join(', ') }} -> {{ step.successes }} sucessos</div>
            </div>
          </div>

          <button v-if="activeMission.readyToResolve" @click="resolveActiveMission" class="w-full bg-vamp-c2 text-black p-4 font-serif font-bold uppercase tracking-widest hover:bg-white transition-colors mt-4">
            Encerrar Missão e Ver Resultados Finais
          </button>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div v-for="mission in missions" :key="mission.id" class="border border-vamp-border bg-black/40 p-6 hover:border-vamp-c2 transition-colors flex flex-col">
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-serif text-lg text-white uppercase tracking-widest">{{ mission.title }}</h3>
            <span class="text-[10px] px-2 py-1 bg-vamp-bg border border-vamp-border text-vamp-c2 uppercase font-bold">{{ mission.category === 'HUNT' ? 'Caçada' : 'Operação' }}</span>
          </div>
          <p class="text-sm text-parchment-dim mb-4 italic">{{ mission.description }}</p>
          <div class="text-xs text-gray-400 mb-6 font-mono space-y-1">
            <div>⏱ Duração Total: {{ mission.durationMinutes }} minutos</div>
            <div>⚠️ Dificuldade Base: {{ mission.baseDifficulty }}</div>
            <div>🎯 Ações: {{ mission.Actions?.length || 0 }} etapas</div>
          </div>
          
          <div class="mt-auto space-y-3">
            <button v-if="mission.category === 'HUNT'" v-for="action in mission.Actions" :key="action.id" @click="startMission(mission.id, action.id)" class="w-full border border-vamp-border bg-vamp-bg hover:border-vamp-c2 hover:text-vamp-c2 transition-colors p-3 flex justify-between items-center group text-xs uppercase tracking-widest font-serif">
              <span>{{ action.name }}</span>
              <span class="text-[9px] text-gray-500 group-hover:text-vamp-c2">{{ action.attributeReq }} + {{ action.skillReq }}</span>
            </button>

            <button v-if="mission.category === 'OPERATION'" @click="startMission(mission.id)" class="w-full border border-vamp-c2 bg-black hover:bg-vamp-c2 hover:text-black transition-colors p-3 text-center text-xs uppercase tracking-widest font-serif font-bold text-vamp-c2">
              Iniciar Infiltração Completa
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal Resultados -->
    <div v-if="showResultModal && finalReport" class="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div class="border border-vamp-c2 bg-vamp-bg p-8 max-w-lg w-full relative">
        <h3 class="font-serif text-2xl mb-4 text-center uppercase tracking-widest" :class="finalReport.isSuccess ? 'text-green-500' : 'text-vamp-c2'">
          {{ finalReport.title }}
        </h3>
        
        <div class="space-y-4 mb-6 max-h-[250px] overflow-y-auto pr-2">
            <div v-for="(step, index) in finalReport.steps" :key="index" class="bg-black/80 border-l-2 p-3 text-sm" :class="step.passed ? 'border-l-green-600' : 'border-l-vamp-c2'">
              <div class="font-bold uppercase tracking-widest text-xs mb-1" :class="step.passed ? 'text-green-500' : 'text-vamp-c2'">
                {{ step.actionName }} ({{ step.pool }})
              </div>
              <div class="text-gray-300 mb-1">{{ step.narrative }}</div>
              <div class="text-[10px] text-gray-500">Dados rolados: [{{ step.rolls.join(', ') }}] -> {{ step.successes }} sucessos</div>
            </div>
          </div>

          <h4 class="text-vamp-c2 font-serif uppercase tracking-widest text-xs mb-2">Recompensas e Penalidades</h4>
          <div class="space-y-2 mb-6 text-sm text-parchment font-mono">
          <div v-for="(change, i) in finalReport.finalChanges" :key="i" class="p-2 bg-black border border-vamp-border">
            {{ change }}
          </div>
        </div>
        
        <button @click="closeModal" class="w-full bg-vamp-c2 text-black p-3 font-serif uppercase tracking-widest font-bold hover:bg-white transition-colors">
          Compreendido
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import api from '../services/api'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const characterId = ref<string>('')
const loading = ref(true)

const missions = ref<any[]>([])
const activeMission = ref<any>(null)
const showResultModal = ref(false)
const finalReport = ref<any>(null)

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

const closeModal = () => {
  showResultModal.value = false
  finalReport.value = null
}


  const timeRemainingDisplay = ref<string>('00:00')
  let timerInterval: any = null

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
  
  
    // Poll every 5 seconds for updates if active mission exists
    pollInterval = setInterval(() => {
      if (activeMission.value && !activeMission.value.readyToResolve) {
        fetchActiveMission()
      }
    }, 5000)

    // Fast timer for UI countdown
    timerInterval = setInterval(updateTimer, 1000)

})

onUnmounted(() => {
    if (pollInterval) clearInterval(pollInterval)
    if (timerInterval) clearInterval(timerInterval)
  })
</script>
