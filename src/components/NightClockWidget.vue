<template>
  <div class="night-clock-container bg-[#050914]/90 border border-cyan-500/30 rounded-lg p-3 backdrop-blur-md shadow-[0_0_20px_rgba(0,150,255,0.15)] font-mono text-xs">
    
    <!-- HEADER DO RELÓGIO -->
    <div class="flex items-center justify-between gap-3 border-b border-cyan-500/20 pb-2 mb-2">
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full" :class="nightStatus?.isSunHazardActive ? 'bg-red-500 animate-ping shadow-[0_0_10px_#ff0000]' : 'bg-cyan-400 shadow-[0_0_8px_#00ffff]'"></span>
        <span class="text-cyan-400 font-serif tracking-widest uppercase text-[11px] font-bold">Ciclo Noturno</span>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-stone-400 text-[10px]">LOCAL:</span>
        <span class="text-gold font-bold uppercase truncate max-w-[130px]" :title="nightStatus?.currentLocation?.name || 'Refúgio'">
          📍 {{ nightStatus?.currentLocation?.name || 'Refúgio' }}
        </span>
      </div>
    </div>

    <!-- DISPLAY DO RELÓGIO & PROGRESSO -->
    <div class="grid grid-cols-2 gap-3 items-center">
      <!-- Hora e Barra -->
      <div>
        <div class="flex justify-between items-baseline mb-1">
          <span class="text-xl font-bold font-mono tracking-wider" :class="nightStatus?.isSunHazardActive ? 'text-red-400 drop-shadow-[0_0_8px_rgba(255,0,0,0.8)]' : 'text-cyan-300 drop-shadow-[0_0_8px_rgba(0,255,255,0.4)]'">
            {{ nightStatus?.currentHourFormatted || '20:00' }}
          </span>
          <span class="text-[10px] text-stone-400 tracking-wider">
            {{ nightStatus?.isDaytime ? '☀️ DIA' : `🌙 ${nightStatus?.hoursRemaining || 10}h rest.` }}
          </span>
        </div>

        <!-- Barra de Progresso da Noite (0% = 20h, 100% = 06h) -->
        <div class="w-full bg-black/60 h-1.5 rounded-full overflow-hidden border border-cyan-950">
          <div 
            class="h-full transition-all duration-500" 
            :class="nightStatus?.isSunHazardActive ? 'bg-red-500' : 'bg-gradient-to-r from-cyan-500 to-amber-400'"
            :style="{ width: `${progressPercent}%` }"
          ></div>
        </div>
      </div>

      <!-- Botões de Ação do Ciclo -->
      <div class="flex flex-col gap-1.5">
        <button 
          v-if="!nightStatus?.isSunHazardActive" 
          @click="awakenNight" 
          :disabled="isProcessing"
          class="w-full py-1 px-2 rounded bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 text-[10px] uppercase tracking-wider font-bold transition-all disabled:opacity-50"
        >
          {{ isProcessing ? 'Descansando...' : '🌙 Avançar Noite' }}
        </button>

        <button 
          v-else 
          @click="showEmergencyModal = true"
          class="w-full py-1 px-2 rounded bg-red-950/90 hover:bg-red-900 border border-red-500 text-red-200 text-[10px] uppercase tracking-wider font-bold animate-pulse"
        >
          ⚠️ ABRIGO SOLAR
        </button>
      </div>
    </div>

    <!-- MODAL DE EMERGÊNCIA SOLAR (RÖTSCHRECK) -->
    <div v-if="showEmergencyModal || nightStatus?.isSunHazardActive" class="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div class="max-w-md w-full bg-[#0a0505] border-2 border-red-600 rounded-lg p-6 shadow-[0_0_50px_rgba(255,0,0,0.4)] space-y-6 text-stone-200">
        
        <div class="text-center space-y-2">
          <div class="text-4xl animate-bounce">☀️</div>
          <h2 class="text-xl font-serif text-red-500 font-bold uppercase tracking-widest drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]">
            O Sol Raiou em Nocturna!
          </h2>
          <p class="text-xs text-stone-300 font-sans leading-relaxed">
            Você está na rua após as 06:00 da manhã. Os raios solares estão queimando sua carne morta (+1 Dano Agravado). Encontre um abrigo imediatamente antes de entrar em torpor!
          </p>
        </div>

        <!-- 4 OPÇÕES DE ABRIGO -->
        <div class="space-y-3">
          <!-- Opção 1: Fuga ao Refúgio -->
          <button 
            @click="takeShelter('GO_HOME')" 
            :disabled="isProcessing"
            class="w-full text-left p-3 rounded border border-stone-800 hover:border-red-500 bg-stone-950/60 hover:bg-red-950/30 transition-all flex items-center justify-between group"
          >
            <div>
              <div class="font-bold text-xs text-red-300 group-hover:text-white uppercase">🏠 Correr para o Refúgio</div>
              <div class="text-[10px] text-stone-400">Dirige em fuga. Sofre dano proporcional ao trânsito.</div>
            </div>
            <span class="text-xs font-mono text-red-400 font-bold">&rarr;</span>
          </button>

          <!-- Opção 2: Alugar Motel -->
          <button 
            @click="takeShelter('BUY_MOTEL')" 
            :disabled="isProcessing"
            class="w-full text-left p-3 rounded border border-stone-800 hover:border-amber-500 bg-stone-950/60 hover:bg-amber-950/30 transition-all flex items-center justify-between group"
          >
            <div>
              <div class="font-bold text-xs text-amber-300 group-hover:text-white uppercase">🏨 Motel com Blackout (R$ 400)</div>
              <div class="text-[10px] text-stone-400">Paga diária de emergência. Abrigo imediato e seguro.</div>
            </div>
            <span class="text-xs font-mono text-amber-400 font-bold">&rarr;</span>
          </button>

          <!-- Opção 3: Arrombar Bueiro / Esgoto -->
          <button 
            @click="takeShelter('BREACH_SEWER')" 
            :disabled="isProcessing"
            class="w-full text-left p-3 rounded border border-stone-800 hover:border-emerald-500 bg-stone-950/60 hover:bg-emerald-950/30 transition-all flex items-center justify-between group"
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
            class="w-full text-left p-3 rounded border border-stone-800 hover:border-cyan-500 bg-stone-950/60 hover:bg-cyan-950/30 transition-all flex items-center justify-between group"
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
  if (!confirm('Deseja avançar para a próxima noite? O vampiro retornará ao refúgio e realizará o Rouse Check de Fome do V5.')) return

  try {
    isProcessing.value = true
    const res = await api.post(`/api/night-cycle/${props.characterId}/awaken`)
    const { rouseSuccess, hungerIncreased, willpowerHealed } = res.data

    let msg = `🌙 Uma nova noite cai sobre Nocturna!\n`
    msg += `🎲 Rouse Check: ${rouseSuccess ? 'SUCESSO (Fome mantida)' : `FALHA (${hungerIncreased ? '+1 Fome!' : 'Fome no Limite'})`}\n`
    if (willpowerHealed > 0) msg += `🧠 Força de Vontade recuperada (+${willpowerHealed}).`

    alert(msg)
    await fetchStatus()
  } catch (e: any) {
    console.error(e)
    alert(e.response?.data?.error || 'Erro ao avançar noite')
  } finally {
    isProcessing.value = false
  }
}

const takeShelter = async (type: string) => {
  if (!props.characterId || isProcessing.value) return
  try {
    isProcessing.value = true
    const res = await api.post(`/api/night-cycle/${props.characterId}/shelter`, { shelterType: type })
    alert(res.data.message)
    showEmergencyModal.value = false
    await fetchStatus()
  } catch (e: any) {
    console.error(e)
    alert(e.response?.data?.error || 'Erro ao buscar abrigo')
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
