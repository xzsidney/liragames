<template>
  <div class="min-h-screen demiplane-bg text-parchment font-sans relative overflow-x-hidden selection:bg-blood-red selection:text-white pb-20">
    <nav class="relative z-20 border-b border-vamp-border bg-black/80 backdrop-blur-md sticky top-0">
      <div class="max-w-[1200px] mx-auto px-4 h-12 flex items-center justify-between">
        <button @click="router.push('/personagem/hub?id='+characterId)" class="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 font-serif uppercase tracking-widest transition-colors">
          <span>&larr;</span> Voltar ao Hub
        </button>
        <div class="flex items-center gap-4 text-[10px] font-serif tracking-widest uppercase">
          <span class="text-vamp-c2">TERRENOS DE CAÇA • NOCTURNA</span>
        </div>
      </div>
    </nav>

    <main class="max-w-[1200px] mx-auto px-4 py-8 space-y-8">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-vamp-border">
        <div>
          <h1 class="demiplane-title text-3xl md:text-5xl text-white">Terrenos de Caça</h1>
          <h2 class="demiplane-text text-vamp-c2 mt-1">Escolha uma abordagem de predação para saciar sua Fome e nutrir a Besta.</h2>
        </div>
      </div>

      <!-- STATUS DE CAÇADA EM ANDAMENTO -->
      <div v-if="activeMission" class="p-6 rounded-lg border border-vamp-c2 bg-black/80 shadow-[0_0_30px_rgba(192,57,43,0.4)] space-y-4">
        <div class="flex justify-between items-center text-xs font-mono text-vamp-c2 uppercase tracking-widest">
          <span class="flex items-center gap-2 font-bold">
            <span class="w-2.5 h-2.5 rounded-full bg-vamp-c2 animate-ping"></span>
            Caçada Ativa em Andamento
          </span>
          <span>{{ activeMission.readyToResolve ? 'Tempo Expirado' : timeRemainingDisplay }}</span>
        </div>

        <div>
          <h3 class="font-serif text-xl font-bold text-parchment">{{ activeMission.currentReport?.title || 'Caçada Urbana' }}</h3>
          <p class="text-xs text-gray-400 italic mt-1">Vampiro espreitando as sombras de Nocturna para alimentar a Besta.</p>
        </div>

        <div class="pt-2 flex gap-3">
          <button 
            v-if="activeMission.readyToResolve"
            @click="resolveActiveHunt" 
            :disabled="resolving"
            class="flex-1 py-3 rounded bg-gold hover:bg-gold-light text-black font-serif font-bold uppercase tracking-widest text-xs transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)]"
          >
            {{ resolving ? 'Coletando Sangue...' : '🩸 Saciar Fome & Ver Relatório de Sangue' }}
          </button>
          <button 
            v-else
            @click="cancelActiveHunt"
            class="py-2.5 px-6 rounded border border-vamp-c2/60 hover:bg-vamp-c2 hover:text-white text-vamp-c2 font-serif text-xs uppercase tracking-wider transition-all"
          >
            Abortar Caçada
          </button>
        </div>
      </div>

      <div v-if="loading" class="text-center py-12 text-gray-500 font-serif">Carregando zonas de caça...</div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="mission in missions" :key="mission.id" class="demiplane-box rounded-sm p-6 flex flex-col justify-between hover:border-gold/40 transition-all">
          <div>
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-xl font-bold text-white uppercase tracking-wider font-serif">{{ mission.title }}</h3>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 border border-red-800 text-red-400 uppercase">
                ⏱ {{ mission.durationMinutes }} min
              </span>
            </div>
            <p class="text-sm text-gray-400 mb-6 italic">{{ mission.description }}</p>
            
            <div class="space-y-4">
              <div v-for="action in mission.Actions" :key="action.id" class="bg-black/40 border border-vamp-border rounded p-4 hover:border-vamp-c2 transition-colors space-y-2">
                <div class="flex justify-between items-start">
                  <h4 class="text-sm font-bold text-parchment">{{ action.name }}</h4>
                  <span class="text-xs bg-vamp-bg text-vamp-c2 px-2 py-0.5 rounded uppercase font-mono">{{ action.attributeReq }} + {{ action.skillReq }}</span>
                </div>
                <p class="text-xs text-gray-400 leading-relaxed font-light">{{ action.description }}</p>
                <button 
                  @click="startHunt(mission, action)" 
                  :disabled="!!activeMission || starting"
                  class="w-full mt-2 bg-vamp-c2/10 border border-vamp-c2 text-vamp-c2 py-2.5 text-xs uppercase font-bold tracking-widest hover:bg-vamp-c2 hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {{ activeMission ? 'Vampiro Ocupado em Caçada' : 'Iniciar Abordagem de Caça' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de Resultado de Sangue -->
    <div v-if="showModal" class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm">
      <div class="demiplane-box max-w-md w-full p-8 text-center relative border-vamp-c2 space-y-6">
        <h2 class="text-2xl font-serif" :class="huntSuccess ? 'text-green-500' : 'text-vamp-c2'">
          {{ huntSuccess ? '🩸 SANGUE FRESCO COLETADO' : '❌ CAÇADA FRUSTRADA' }}
        </h2>
        <div class="text-sm text-parchment whitespace-pre-line leading-relaxed">{{ huntMessage }}</div>
        <button @click="closeModal" class="px-8 py-3 bg-vamp-c2 hover:bg-white hover:text-black text-white uppercase text-xs font-bold tracking-widest transition">
          Retornar ao Terreno
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const route = useRoute()
const characterId = (route.query.id as string) || localStorage.getItem('lira_active_character_id') || ''

const loading = ref(true)
const starting = ref(false)
const resolving = ref(false)
const missions = ref<any[]>([])
const activeMission = ref<any>(null)

const showModal = ref(false)
const huntSuccess = ref(false)
const huntMessage = ref('')

const fetchHunts = async () => {
  try {
    const res = await api.get('/api/missions-idle?category=HUNT')
    missions.value = res.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const fetchActiveMission = async () => {
  if (!characterId) return
  try {
    const res = await api.get(`/api/missions-idle/active/${characterId}`)
    activeMission.value = res.data
  } catch (e) {
    console.error('Erro ao buscar missão ativa:', e)
  }
}

const startHunt = async (mission: any, action: any) => {
  if (!characterId) return
  try {
    starting.value = true
    await api.post('/api/missions-idle/start', {
      characterId,
      definitionMissionIdleId: mission.id,
      forcedActionId: action.id
    })
    alert(`Caçada '${action.name}' iniciada com sucesso!`)
    await fetchActiveMission()
  } catch (e: any) {
    console.error(e)
    alert(e.response?.data?.error || 'Erro ao iniciar caçada')
  } finally {
    starting.value = false
  }
}

const resolveActiveHunt = async () => {
  if (!activeMission.value) return
  try {
    resolving.value = true
    const res = await api.post('/api/missions-idle/resolve', {
      activeMissionId: activeMission.value.id
    })
    const report = res.data.report
    huntSuccess.value = report.isSuccess
    huntMessage.value = report.steps?.map((s: any) => `${s.actionName}: ${s.narrative}`).join('\n\n') + 
      (report.finalChanges?.length ? `\n\n${report.finalChanges.join('\n')}` : '')
    showModal.value = true
    activeMission.value = null
    await fetchActiveMission()
  } catch (e: any) {
    console.error(e)
    alert(e.response?.data?.error || 'Erro ao resolver caçada')
  } finally {
    resolving.value = false
  }
}

const cancelActiveHunt = async () => {
  if (!activeMission.value) return
  if (!confirm('Deseja realmente abortar esta caçada? Todo o progresso será perdido.')) return
  try {
    await api.post('/api/missions-idle/cancel', {
      activeMissionId: activeMission.value.id
    })
    alert('Caçada abortada.')
    activeMission.value = null
  } catch (e: any) {
    alert(e.response?.data?.error || 'Erro ao abortar caçada')
  }
}

const timeRemainingDisplay = computed(() => {
  if (!activeMission.value || !activeMission.value.expiresAt) return ''
  const diff = new Date(activeMission.value.expiresAt).getTime() - new Date().getTime()
  if (diff <= 0) return 'Pronto para Coletar'
  const mins = Math.floor(diff / 60000)
  const secs = Math.floor((diff % 60000) / 1000)
  return `${mins}m ${secs}s restantes`
})

const closeModal = () => {
  showModal.value = false
}

onMounted(() => {
  if (!characterId) {
    router.push('/jogador/vampire')
    return
  }
  fetchHunts()
  fetchActiveMission()
})
</script>
