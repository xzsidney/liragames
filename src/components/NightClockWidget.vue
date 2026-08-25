<template>
  <div>
    <!-- DOCK / FOOTER FIXO NA PARTE INFERIOR DA TELA -->
    <footer class="fixed bottom-0 left-0 right-0 z-40 bg-[#030712]/95 border-t border-cyan-500/30 backdrop-blur-md px-4 sm:px-8 py-2.5 shadow-[0_-5px_25px_rgba(0,0,0,0.8)] font-mono text-xs select-none">
      <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        
        <!-- ESQUERDA: Ícone, Status e Local Atual -->
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full" :class="nightStatus?.isSunHazardActive ? 'bg-red-500 animate-ping shadow-[0_0_10px_#ff0000]' : 'bg-cyan-400 shadow-[0_0_8px_#00ffff]'"></span>
            <span class="text-cyan-400 font-serif tracking-widest uppercase text-xs font-bold hidden sm:inline">Ciclo Noturno</span>
          </div>

          <div class="h-4 w-px bg-cyan-900/60 hidden sm:block"></div>

          <div class="flex items-center gap-1.5 text-stone-300 text-[11px]">
            <span class="text-stone-500 uppercase text-[10px]">Posição:</span>
            <span class="text-gold font-bold uppercase truncate max-w-[160px] sm:max-w-[220px]" :title="nightStatus?.currentLocation?.name || 'Refúgio'">
              📍 {{ nightStatus?.currentLocation?.name || 'Refúgio' }}
            </span>
          </div>
        </div>

        <!-- CENTRO: Relógio Digital e Barra de Tempo -->
        <div class="flex items-center gap-4 min-w-[200px] sm:min-w-[280px]">
          <div class="flex flex-col items-center">
            <span class="text-base sm:text-lg font-bold font-mono tracking-wider" :class="nightStatus?.isSunHazardActive ? 'text-red-400 drop-shadow-[0_0_8px_rgba(255,0,0,0.8)]' : 'text-cyan-300 drop-shadow-[0_0_8px_rgba(0,255,255,0.4)]'">
              {{ nightStatus?.currentHourFormatted || '20:00' }}
            </span>
          </div>

          <div class="flex-1 space-y-1">
            <div class="flex justify-between text-[9px] text-stone-400 uppercase tracking-widest">
              <span>20:00</span>
              <span :class="nightStatus?.isSunHazardActive ? 'text-red-400 font-bold' : 'text-cyan-400'">
                {{ nightStatus?.isDaytime ? '☀️ AMANHECEU' : `🌙 ${nightStatus?.hoursRemaining || 10}h rest.` }}
              </span>
              <span>06:00</span>
            </div>

            <!-- Barra de Progresso da Noite -->
            <div class="w-full bg-black/80 h-1.5 rounded-full overflow-hidden border border-cyan-950">
              <div 
                class="h-full transition-all duration-500 rounded-full" 
                :class="nightStatus?.isSunHazardActive ? 'bg-red-500 animate-pulse' : 'bg-gradient-to-r from-cyan-500 via-blue-500 to-amber-400'"
                :style="{ width: `${progressPercent}%` }"
              ></div>
            </div>
          </div>
        </div>

        <!-- DIREITA: Ações do Ciclo Noturno -->
        <div class="flex items-center gap-3">
          <!-- Se estiver em perigo solar (dia na rua) -->
          <button 
            v-if="nightStatus?.isSunHazardActive" 
            @click="showEmergencyModal = true"
            class="px-4 py-1.5 rounded bg-red-950/90 hover:bg-red-900 border border-red-500 text-red-200 text-xs font-serif font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(255,0,0,0.4)] animate-bounce"
          >
            ⚠️ Abrigo Solar
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

    <!-- MODAL DE EMERGÊNCIA SOLAR (RÖTSCHRECK) -->
    <div v-if="showEmergencyModal" class="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div class="max-w-md w-full bg-[#0a0505] border-2 border-red-600 rounded-lg p-6 shadow-[0_0_50px_rgba(255,0,0,0.5)] space-y-5 text-stone-200 relative max-h-[90vh] overflow-y-auto">
        
        <button @click="showEmergencyModal = false" class="absolute top-4 right-4 text-stone-500 hover:text-white text-xl transition-all">✕</button>

        <div class="text-center space-y-2">
          <div class="text-4xl animate-bounce">☀️</div>
          <h2 class="text-xl font-serif text-red-500 font-bold uppercase tracking-widest drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]">
            O Sol Raiou em Nocturna!
          </h2>
          <p class="text-xs text-stone-300 font-sans leading-relaxed">
            Você está fora de abrigo após as 06:00 da manhã. Os raios solares estão queimando sua carne morta (+1 Dano Agravado). Escolha uma rota de abrigo imediatamente:
          </p>
        </div>

        <!-- 4 OPÇÕES DE ABRIGO -->
        <div class="space-y-3">
          <!-- Opção 1: Fuga ao Refúgio -->
          <button 
            @click="takeShelter('GO_HOME')" 
            :disabled="isProcessing"
            class="w-full text-left p-3.5 rounded border border-stone-800 hover:border-red-500 bg-stone-950/80 hover:bg-red-950/40 transition-all flex items-center justify-between group"
          >
            <div>
              <div class="font-bold text-xs text-red-300 group-hover:text-white uppercase">🏠 Correr para o Refúgio</div>
              <div class="text-[10px] text-stone-400">Retorno rápido. Sofre dano proporcional ao trânsito sob o sol.</div>
            </div>
            <span class="text-xs font-mono text-red-400 font-bold">&rarr;</span>
          </button>

          <!-- Opção 2: Alugar Motel -->
          <button 
            @click="takeShelter('BUY_MOTEL')" 
            :disabled="isProcessing"
            class="w-full text-left p-3.5 rounded border border-stone-800 hover:border-amber-500 bg-stone-950/80 hover:bg-amber-950/40 transition-all flex items-center justify-between group"
          >
            <div>
              <div class="font-bold text-xs text-amber-300 group-hover:text-white uppercase">🏨 Motel com Blackout (R$ 400)</div>
              <div class="text-[10px] text-stone-400">Paga diária comercial de emergência. Abrigo imediato.</div>
            </div>
            <span class="text-xs font-mono text-amber-400 font-bold">&rarr;</span>
          </button>

          <!-- Opção 3: Arrombar Bueiro / Esgoto -->
          <button 
            @click="takeShelter('BREACH_SEWER')" 
            :disabled="isProcessing"
            class="w-full text-left p-3.5 rounded border border-stone-800 hover:border-emerald-500 bg-stone-950/80 hover:bg-emerald-950/40 transition-all flex items-center justify-between group"
          >
            <div>
              <div class="font-bold text-xs text-emerald-300 group-hover:text-white uppercase">🕳️ Forçar Bueiro / Esgoto</div>
              <div class="text-[10px] text-stone-400">Teste: Força + Ladroagem (Dificuldade 6).</div>
            </div>
            <span class="text-xs font-mono text-emerald-400 font-bold">&rarr;</span>
          </button>

          <!-- Opção 4: Refúgio de Aliado -->
          <button 
            @click="takeShelter('ALLY_HAVEN')" 
            :disabled="isProcessing"
            class="w-full text-left p-3.5 rounded border border-stone-800 hover:border-cyan-500 bg-stone-950/80 hover:bg-cyan-950/40 transition-all flex items-center justify-between group"
          >
            <div>
              <div class="font-bold text-xs text-cyan-300 group-hover:text-white uppercase">🤝 Bater na Porta de Aliado</div>
              <div class="text-[10px] text-stone-400">Requer antecedente Aliados/Mentor no distrito.</div>
            </div>
            <span class="text-xs font-mono text-cyan-400 font-bold">&rarr;</span>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '../services/api'
import { confirmAction, notifySuccess, notifyError } from '../utils/gothicAlerts'

const props = defineProps<{
  characterId: string
}>()

const emit = defineEmits(['status-updated'])

const nightStatus = ref<any>(null)
const isProcessing = ref(false)
const showEmergencyModal = ref(false)

const progressPercent = computed(() => {
  if (!nightStatus.value) return 0
  const mins = nightStatus.value.nightMinutesSpent || 0
  return Math.min(100, Math.max(0, (mins / 600) * 100))
})

const fetchStatus = async () => {
  if (!props.characterId) return
  try {
    const res = await api.get(`/api/night-cycle/${props.characterId}/status`)
    nightStatus.value = res.data
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
    const res = await api.post(`/api/night-cycle/${props.characterId}/shelter`, { shelterType: type })
    notifySuccess('Abrigo Conquistado', res.data.message)
    showEmergencyModal.value = false
    await fetchStatus()
  } catch (e: any) {
    console.error(e)
    notifyError('Falha no Abrigo', e.response?.data?.error || 'Não foi possível encontrar abrigo.')
  } finally {
    isProcessing.value = false
  }
}

onMounted(async () => {
  await fetchStatus()
})

defineExpose({
  fetchStatus
})
</script>
