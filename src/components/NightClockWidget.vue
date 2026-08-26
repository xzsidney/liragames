<template>
  <div>
    <!-- INLINE MODE (COLOCADO ABAIXO DA HUMANIDADE NA COLUNA DA ESQUERDA) -->
    <div v-if="inline" class="bg-black/60 border border-white/10 p-4 rounded-xl space-y-4 shadow-inner">
      <!-- TEXTOS INFORMATIVOS NO TOPO -->
      <div class="font-mono space-y-1 pb-2 border-b border-white/5 text-left">
        <div class="flex justify-between items-center text-[10px] text-stone-400 uppercase tracking-wider">
          <span>Janela de Caça:</span>
          <strong class="text-stone-200 font-bold">20:00 às 06:00</strong>
        </div>
        <div class="flex justify-between items-center text-xs uppercase tracking-wider font-bold">
          <span class="text-stone-400 font-mono text-[10px]">Restam:</span>
          <span :class="isSunHazardActive ? 'text-red-400 animate-pulse' : 'text-cyan-300'">
            {{ isDaytime ? '☀️ AMANHECEU' : timeRemainingDisplay }}
          </span>
        </div>
      </div>

      <!-- CÍRCULO ESTILIZADO CENTRALIZADO -->
      <div class="flex justify-center my-1">
        <div class="w-18 h-18 py-2 px-4 rounded-full border-2 border-cyan-900/60 relative flex flex-col items-center justify-center bg-black/90 shadow-[0_0_20px_rgba(0,255,255,0.2)]">
          <div class="absolute -top-1 w-3 h-1 bg-cyan-400 rounded-full shadow-[0_0_10px_#00ffff]"></div>
          <span class="text-xs mb-0.5">🌙</span>
          <span class="text-cyan-300 font-mono font-bold text-sm tracking-widest drop-shadow-[0_0_8px_rgba(0,255,255,0.4)]">
            {{ liveTimeFormatted.substring(0, 5) }}
          </span>
        </div>
      </div>

      <!-- BARRA DE PROGRESSO -->
      <div class="w-full bg-black/80 h-1.5 rounded-full overflow-hidden border border-cyan-950/80">
        <div 
          class="h-full transition-all duration-500 rounded-full" 
          :class="isSunHazardActive ? 'bg-red-500 animate-pulse' : 'bg-gradient-to-r from-cyan-500 via-blue-500 to-amber-400'"
          :style="{ width: `${progressPercent}%` }"
        ></div>
      </div>

      <!-- BOTÃO DE AVANÇAR NOITE / DORMIR -->
      <button 
        v-if="isSunHazardActive" 
        @click="showEmergencyModal = true"
        class="w-full py-2 rounded-lg bg-red-950/90 hover:bg-red-900 border border-red-500 text-red-200 text-xs font-serif font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(255,0,0,0.4)] animate-bounce"
      >
        ☀️ Perigo Solar (Abrigo)
      </button>

      <button 
        v-else 
        @click="awakenNight" 
        :disabled="isProcessing"
        class="w-full py-2.5 rounded-lg bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 hover:text-white text-xs font-serif font-bold uppercase tracking-wider transition-all shadow-[0_0_10px_rgba(0,255,255,0.15)] disabled:opacity-50 flex items-center justify-center gap-1.5"
      >
        <span>🌙</span>
        <span>{{ isProcessing ? 'Descansando...' : 'Avançar Noite / Dormir' }}</span>
      </button>
    </div>

    <!-- DOCK / FOOTER FIXO NA PARTE INFERIOR DA TELA (QUANDO NÃO FOR INLINE) -->
    <footer v-else class="fixed bottom-0 left-0 right-0 z-40 bg-[#030712]/95 border-t border-cyan-500/30 backdrop-blur-md px-4 sm:px-8 py-2.5 shadow-[0_-5px_25px_rgba(0,0,0,0.8)] font-mono text-xs select-none">
      <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        
        <!-- ESQUERDA: Ícone, Status e Local Atual -->
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full" :class="isSunHazardActive ? 'bg-red-500 animate-ping shadow-[0_0_10px_#ff0000]' : 'bg-cyan-400 shadow-[0_0_8px_#00ffff]'"></span>
            <span class="text-cyan-400 font-serif tracking-widest uppercase text-xs font-bold hidden sm:inline">Ciclo Noturno</span>
          </div>

          <div class="h-4 w-px bg-cyan-900/60 hidden sm:block"></div>

          <div class="flex items-center gap-1.5 text-stone-300 text-[11px]">
            <span class="text-stone-500 uppercase text-[10px]">Posição:</span>
            <span class="text-gold font-bold uppercase truncate max-w-[170px] sm:max-w-[240px]" :title="displayLocation">
              {{ displayLocation }}
            </span>
          </div>
        </div>

        <!-- CENTRO: Relógio Digital Vivo (HH:MM:SS) e Barra de Tempo -->
        <div class="flex items-center gap-4 min-w-[240px] sm:min-w-[320px]">
          <div class="flex flex-col items-center">
            <div class="text-base sm:text-lg font-bold font-mono tracking-widest flex items-center gap-1" :class="isSunHazardActive ? 'text-red-400 drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]' : 'text-cyan-300 drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]'">
              <span>{{ liveTimeFormatted }}</span>
            </div>
          </div>

          <div class="flex-1 space-y-1">
            <div class="flex justify-between text-[9px] text-stone-400 uppercase tracking-widest">
              <span>20:00</span>
              <span :class="isSunHazardActive ? 'text-red-400 font-bold animate-pulse' : 'text-cyan-400'">
                {{ isDaytime ? '☀️ AMANHECEU' : `🌙 ${hoursRemainingDisplay}h rest.` }}
              </span>
              <span>06:00</span>
            </div>

            <!-- Barra de Progresso da Noite -->
            <div class="w-full bg-black/80 h-1.5 rounded-full overflow-hidden border border-cyan-950">
              <div 
                class="h-full transition-all duration-500 rounded-full" 
                :class="isSunHazardActive ? 'bg-red-500 animate-pulse' : 'bg-gradient-to-r from-cyan-500 via-blue-500 to-amber-400'"
                :style="{ width: `${progressPercent}%` }"
              ></div>
            </div>
          </div>
        </div>

        <!-- DIREITA: Ações do Ciclo Noturno -->
        <div class="flex items-center gap-3">
          <!-- Se estiver em perigo solar (dia na rua) -->
          <button 
            v-if="isSunHazardActive" 
            @click="showEmergencyModal = true"
            class="px-4 py-1.5 rounded bg-red-950/90 hover:bg-red-900 border border-red-500 text-red-200 text-xs font-serif font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(255,0,0,0.4)] animate-bounce"
          >
            ☀️ Perigo Solar (Abrigo)
          </button>

          <!-- Se estiver em noite ativa -->
          <button 
            v-else 
            @click="awakenNight" 
            :disabled="isProcessing"
            class="px-4 py-1.5 rounded bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 hover:text-white text-xs font-serif font-bold uppercase tracking-wider transition-all shadow-[0_0_10px_rgba(0,255,255,0.2)] disabled:opacity-50"
          >
            {{ isProcessing ? 'Descansando...' : '🌙 Avançar Noite' }}
          </button>
        </div>

      </div>
    </footer>

    <!-- MODAL DE EMERGÊNCIA SOLAR DRAMÁTICO (CENTRO DA TELA) -->
    <div v-if="showEmergencyModal" class="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div class="max-w-md w-full bg-[#0d0404] border-2 border-red-600 rounded-xl p-6 sm:p-7 shadow-[0_0_60px_rgba(255,0,0,0.6)] space-y-5 text-stone-200 relative max-h-[92vh] overflow-y-auto font-sans">
        
        <button @click="dismissEmergencyModal" class="absolute top-4 right-4 text-stone-500 hover:text-white text-xl transition-all">✕</button>

        <div class="text-center space-y-2">
          <div class="text-4xl animate-bounce">☀️</div>
          <h2 class="text-xl font-serif text-red-500 font-bold uppercase tracking-widest drop-shadow-[0_0_12px_rgba(255,0,0,0.9)]">
            Emergência Solar: O Sol Raiou!
          </h2>
          <p class="text-xs text-stone-300 font-sans leading-relaxed">
            Você está fora do seu refúgio após as <strong>06:00:00 da manhã</strong>. A luz do dia queima a carne morta e a Besta entra em pânico. Escolha uma ação imediatamente:
          </p>
        </div>

        <!-- OPÇÕES DE SOBREVIVÊNCIA SOLAR BALANCEADAS -->
        <div class="space-y-3 font-sans text-left">
          
          <!-- OPÇÃO 1: HOTEL / MOTEL (SEGURO COM DINHEIRO) -->
          <button 
            @click="takeShelter('BUY_MOTEL')" 
            :disabled="isProcessing"
            class="w-full text-left p-4 rounded-xl border border-amber-500/50 hover:border-amber-400 bg-amber-950/20 hover:bg-amber-950/50 transition-all space-y-2 group shadow-[0_0_15px_rgba(245,158,11,0.15)]"
          >
            <div class="flex items-center justify-between">
              <div class="font-serif font-bold text-sm text-amber-300 group-hover:text-amber-200 flex items-center gap-2">
                <span>🏨</span> Alugar Quarto com Blackout (Hotel / Motel)
              </div>
              <span class="text-[10px] font-mono uppercase bg-amber-950 px-2 py-0.5 rounded text-amber-400 border border-amber-700/50 font-bold">
                1 a 5 Estrelas
              </span>
            </div>
            <p class="text-[11px] text-stone-400 font-light leading-relaxed">
              Gaste seus recursos financeiros (R$) para dormir o dia em quarto lacrado com cortinas grossas.
            </p>
            <div class="flex flex-wrap gap-1.5 text-[10px] font-mono pt-1">
              <span class="px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800 text-amber-300">💵 R$ 150 a R$ 4.000</span>
              <span class="px-2 py-0.5 rounded bg-blue-950/60 border border-blue-800 text-blue-300">🧠 +1 a +10 Força de Vontade</span>
              <span class="px-2 py-0.5 rounded bg-red-950/60 border border-red-800 text-red-300 font-bold">🩸 Opção de Sangue O-</span>
            </div>
          </button>

          <!-- OPÇÃO 2: ESGOTO / SUBTERRÂNEO (GRÁTIS COM RISCO / TESTE) -->
          <button 
            @click="takeShelter('BREACH_SEWER')" 
            :disabled="isProcessing"
            class="w-full text-left p-4 rounded-xl border border-emerald-500/50 hover:border-emerald-400 bg-emerald-950/20 hover:bg-emerald-950/50 transition-all space-y-2 group shadow-[0_0_15px_rgba(16,185,129,0.15)]"
          >
            <div class="flex items-center justify-between">
              <div class="font-serif font-bold text-sm text-emerald-300 group-hover:text-emerald-200 flex items-center gap-2">
                <span>🕳️</span> Galerias Subterrâneas (Esgotos Nosferatu)
              </div>
              <span class="text-[10px] font-mono uppercase bg-emerald-950 px-2 py-0.5 rounded text-emerald-400 border border-emerald-700/50 font-bold">
                Grátis • R$ 0
              </span>
            </div>
            <p class="text-[11px] text-stone-400 font-light leading-relaxed">
              Desça para as tubulações escuras sob a cidade. Gratuito contra o sol, com acesso a caçada de ratos.
            </p>
            <div class="flex flex-wrap gap-1.5 text-[10px] font-mono pt-1">
              <span class="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300">🛡️ 100% Protegido do Sol</span>
              <span class="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-stone-300">🐀 Caçada de Ratos (Fome 5 &rarr; 4)</span>
            </div>
          </button>

          <!-- OPÇÃO 3: FUGA DESESPERADA AO REFÚGIO (ÚLTIMO RECURSO - PENALIDADE TRIPLA) -->
          <button 
            @click="takeShelter('GO_HOME')" 
            :disabled="isProcessing"
            class="w-full text-left p-4 rounded-xl border border-red-600/70 hover:border-red-500 bg-red-950/30 hover:bg-red-950/60 transition-all space-y-2 group shadow-[0_0_15px_rgba(220,38,38,0.2)]"
          >
            <div class="flex items-center justify-between">
              <div class="font-serif font-bold text-sm text-red-400 group-hover:text-red-300 flex items-center gap-2">
                <span>🏠</span> Fuga Desesperada ao Refúgio
              </div>
              <span class="text-[10px] font-mono uppercase bg-red-950 px-2 py-0.5 rounded text-red-400 border border-red-700 font-bold">
                ⚠️ Penalidades Severas
              </span>
            </div>
            <p class="text-[11px] text-stone-400 font-light leading-relaxed">
              Você corre pelas ruas sob o sol da manhã. Chega ao refúgio, mas sofre queimaduras, desgaste de sangue e terror psicológico.
            </p>
            <div class="flex flex-wrap gap-1.5 text-[10px] font-mono pt-1">
              <span class="px-2 py-0.5 rounded bg-red-950 border border-red-700 text-red-300 font-bold">☀️ +1 Dano Agravado Solar</span>
              <span class="px-2 py-0.5 rounded bg-red-950 border border-red-700 text-red-300 font-bold">🩸 +1 Fome (Gasto no Pânico)</span>
              <span class="px-2 py-0.5 rounded bg-red-950 border border-red-700 text-red-300 font-bold">🧠 -1 Força de Vontade (Rötschreck)</span>
            </div>
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import { confirmAction, notifySuccess, notifyError } from '../utils/gothicAlerts'

const props = defineProps<{
  characterId: string
  isHub?: boolean
  inline?: boolean
}>()

const emit = defineEmits(['status-updated'])
const router = useRouter()

const nightStatus = ref<any>(null)
const isProcessing = ref(false)
const showEmergencyModal = ref(false)
const modalDismissed = ref(false)

// Relógio Vivo com Segundos
const liveSeconds = ref(72000) // 20:00:00 em segundos do dia
let clockInterval: any = null

const displayLocation = computed(() => {
  if (props.isHub || nightStatus.value?.isRestingInHaven) {
    const havenName = nightStatus.value?.havenLocation?.name || nightStatus.value?.currentLocation?.name || 'Refúgio'
    return `🏠 Refúgio (${havenName})`
  }
  return `📍 ${nightStatus.value?.currentLocation?.name || 'Nocturna'}`
})

const liveTimeFormatted = computed(() => {
  if (isDaytime.value) {
    return '06:00:00'
  }
  const totalSec = Math.floor(liveSeconds.value % 86400)
  const h = Math.floor(totalSec / 3600) % 24
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
})

const isDaytime = computed(() => {
  const currentMinutes = nightStatus.value?.nightMinutesSpent || 0
  return currentMinutes >= 600 || liveSeconds.value >= 108000
})

const isSunHazardActive = computed(() => {
  if (props.isHub || nightStatus.value?.isRestingInHaven) return false
  return isDaytime.value || !!nightStatus.value?.isSunHazardActive
})

const hoursRemainingDisplay = computed(() => {
  const minsSpent = nightStatus.value?.nightMinutesSpent || 0
  const rem = Math.max(0, 10 - Math.floor(minsSpent / 60))
  return rem
})

const timeRemainingDisplay = computed(() => {
  const minsSpent = nightStatus.value?.nightMinutesSpent || 0
  const remMins = Math.max(0, 600 - minsSpent)
  const h = Math.floor(remMins / 60)
  const m = remMins % 60
  return `${h}H ${m.toString().padStart(2, '0')}M`
})

const progressPercent = computed(() => {
  const mins = nightStatus.value?.nightMinutesSpent || 0
  return Math.min(100, Math.max(0, (mins / 600) * 100))
})

const startLiveClock = () => {
  if (clockInterval) clearInterval(clockInterval)
  clockInterval = setInterval(() => {
    if (liveSeconds.value < 108000) { // 108000s = 06:00:00
      liveSeconds.value += 1
    }
  }, 1000)
}

const syncClockFromStatus = (data: any) => {
  if (!data) return
  const mins = Math.min(600, Math.max(0, data.nightMinutesSpent || 0))
  // 20:00 (72000s) + minutos gastos * 60
  liveSeconds.value = 72000 + (mins * 60)

  if (isSunHazardActive.value && !modalDismissed.value) {
    showEmergencyModal.value = true
  }
}

const fetchStatus = async () => {
  if (!props.characterId) return
  try {
    const res = await api.get(`/api/night-cycle/${props.characterId}/status`)
    nightStatus.value = res.data
    syncClockFromStatus(res.data)
    emit('status-updated', res.data)
  } catch (e) {
    console.error('Erro ao buscar status da noite:', e)
  }
}

const awakenNight = async () => {
  if (!props.characterId || isProcessing.value) return
  const confirmed = await confirmAction(
    'AVANÇAR PARA A PRÓXIMA NOITE?',
    'O vampiro retornará ao seu refúgio e realizará o Teste de Despertar (Rouse Check) de Fome do V5.',
    'Sim, Despertar',
    'Permanecer na Noite'
  )
  if (!confirmed) return

  try {
    isProcessing.value = true
    const res = await api.post(`/api/night-cycle/${props.characterId}/awaken`)
    const { rouseSuccess, hungerIncreased, willpowerHealed } = res.data

    let msg = `🎲 Rouse Check: ${rouseSuccess ? 'SUCESSO (Fome mantida)' : `FALHA (${hungerIncreased ? '+1 Fome!' : 'Fome no Limite'})`}`
    if (willpowerHealed > 0) msg += ` | 🧠 Força de Vontade recuperada (+${willpowerHealed}).`

    notifySuccess('Uma Nova Noite Cai Sobre Nocturna', msg)
    modalDismissed.value = false
    showEmergencyModal.value = false
    await fetchStatus()
  } catch (e: any) {
    console.error(e)
    notifyError('Erro ao Avançar Noite', e.response?.data?.error || 'Não foi possível avançar a noite.')
  } finally {
    isProcessing.value = false
  }
}

const takeShelter = async (type: string) => {
  if (!props.characterId || isProcessing.value) return
  try {
    isProcessing.value = true
    if (type === 'GO_HOME') {
      await api.post(`/api/night-cycle/${props.characterId}/return-haven`)
      notifySuccess('Retorno Seguro', 'Você retornou às pressas ao seu refúgio antes que a luz o destruísse!')
      showEmergencyModal.value = false
      router.push(`/personagem/hub?id=${props.characterId}`)
      return
    }

    if (type === 'BUY_MOTEL') {
      showEmergencyModal.value = false
      router.push(`/personagem/abrigo-hotel?id=${props.characterId}`)
      return
    }

    if (type === 'BREACH_SEWER') {
      showEmergencyModal.value = false
      router.push(`/personagem/abrigo-esgoto?id=${props.characterId}`)
      return
    }
  } catch (e: any) {
    console.error(e)
    notifyError('Falha no Abrigo', e.response?.data?.error || 'Não foi possível encontrar abrigo.')
  } finally {
    isProcessing.value = false
  }
}

const dismissEmergencyModal = () => {
  modalDismissed.value = true
  showEmergencyModal.value = false
}

watch(() => isSunHazardActive.value, (newVal) => {
  if (newVal && !modalDismissed.value) {
    showEmergencyModal.value = true
  }
})

onMounted(async () => {
  startLiveClock()
  await fetchStatus()
})

onUnmounted(() => {
  if (clockInterval) clearInterval(clockInterval)
})

defineExpose({
  fetchStatus
})
</script>
