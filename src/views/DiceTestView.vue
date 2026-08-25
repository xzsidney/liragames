<template>
  <div class="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans relative overflow-hidden select-none">
    <!-- Top Header -->
    <header class="bg-neutral-900/90 border-b border-red-950/60 px-6 py-4 flex items-center justify-between z-10 backdrop-blur-md">
      <div class="flex items-center space-x-3">
        <div class="w-9 h-9 rounded-full bg-red-950/80 border border-red-600/40 flex items-center justify-center text-red-500 font-serif font-bold text-lg shadow-[0_0_15px_rgba(220,38,38,0.3)]">
          🎲
        </div>
        <div>
          <h1 class="text-xl font-bold tracking-wider text-red-100 font-serif">Mesa de Rolagem 3D (Vampiro V5)</h1>
          <p class="text-xs text-neutral-400">Simulação de física 3D com Three.js & Cannon-es (Estilo Foundry Dice So Nice)</p>
        </div>
      </div>

      <div class="flex items-center space-x-4">
        <router-link
          to="/dashboard"
          class="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded border border-neutral-700 text-xs font-semibold uppercase tracking-wider transition-all"
        >
          ← Voltar ao Hub
        </router-link>
      </div>
    </header>

    <!-- Main Workspace -->
    <div class="flex-1 flex flex-col lg:flex-row relative">
      <!-- 3D Canvas Viewport (Dice Arena) -->
      <div class="flex-1 relative bg-gradient-to-b from-neutral-950 via-neutral-900 to-black overflow-hidden flex items-center justify-center min-h-[500px]">
        <!-- 3D Canvas -->
        <canvas ref="canvasRef" class="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing"></canvas>

        <!-- Watermark / Arena Overlay Text -->
        <div v-if="!results && !isRolling" class="absolute bottom-6 left-6 pointer-events-none text-neutral-500/60 font-serif text-sm">
          Arena de Dados 3D • Clique em <span class="text-red-400 font-bold">"Rolar Dados 3D"</span> para arremessar na mesa.
        </div>

        <!-- Banner de Resultado Animado no Topo da Arena -->
        <div
          v-if="results"
          class="absolute top-6 left-1/2 transform -translate-x-1/2 z-10 w-11/12 max-w-xl animate-fade-in"
        >
          <div
            :class="[
              'p-4 rounded-xl border backdrop-blur-xl shadow-2xl transition-all',
              verdictClass
            ]"
          >
            <div class="flex items-center justify-between border-b pb-2 mb-3" :class="verdictBorderClass">
              <div class="flex items-center space-x-2">
                <span class="text-2xl">{{ verdictIcon }}</span>
                <div>
                  <h3 class="font-serif font-bold text-lg tracking-wide uppercase">{{ verdictTitle }}</h3>
                  <p class="text-xs opacity-80">{{ verdictSubtitle }}</p>
                </div>
              </div>
              <div class="text-right">
                <div class="text-3xl font-black font-serif tracking-tight">
                  {{ totalSuccesses }} <span class="text-sm font-normal opacity-70">sucessos</span>
                </div>
                <div class="text-xs opacity-75">Dificuldade: {{ difficulty }}</div>
              </div>
            </div>

            <!-- Badges dos Dados -->
            <div class="flex flex-wrap gap-2 justify-center">
              <div
                v-for="(die, idx) in results"
                :key="die.id || idx"
                :class="[
                  'w-10 h-10 rounded-lg flex items-center justify-center font-bold font-serif text-sm border shadow transition-transform transform hover:scale-110',
                  die.type === 'hunger'
                    ? die.value === 10
                      ? 'bg-red-700 text-white border-red-400 shadow-[0_0_12px_rgba(239,68,68,0.8)]'
                      : die.value === 1
                      ? 'bg-neutral-900 text-red-500 border-red-600 shadow-[0_0_12px_rgba(185,28,28,0.8)]'
                      : die.value >= 6
                      ? 'bg-red-800 text-red-100 border-red-600'
                      : 'bg-neutral-950 text-red-300/60 border-red-900/50'
                    : die.value === 10
                    ? 'bg-amber-600 text-black border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.8)]'
                    : die.value >= 6
                    ? 'bg-neutral-800 text-amber-300 border-amber-600/60'
                    : 'bg-neutral-950 text-neutral-500 border-neutral-800'
                ]"
              >
                {{ die.value }}
                <span v-if="die.type === 'hunger' && die.value === 1" class="text-[10px] ml-0.5">☠</span>
                <span v-else-if="die.value === 10" class="text-[10px] ml-0.5">☥</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Control Sidebar -->
      <aside class="w-full lg:w-96 bg-neutral-900/95 border-l border-red-950/60 p-6 flex flex-col justify-between z-10">
        <div class="space-y-6">
          <h2 class="text-sm font-semibold uppercase tracking-wider text-red-400 font-serif border-b border-red-950/80 pb-2">
            Configurar Parada de Dados
          </h2>

          <!-- Dados Normais -->
          <div>
            <div class="flex justify-between items-center mb-1">
              <label class="text-sm font-medium text-neutral-300 flex items-center">
                <span class="w-3 h-3 rounded-full bg-neutral-800 border border-amber-500/80 inline-block mr-2"></span>
                Dados Normais (Pretos)
              </label>
              <span class="text-amber-400 font-bold font-serif text-lg">{{ regularCount }}</span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              v-model.number="regularCount"
              class="w-full accent-amber-500 bg-neutral-800 rounded-lg cursor-pointer h-2"
            />
            <div class="flex justify-between text-[11px] text-neutral-500 mt-1">
              <span>0</span>
              <span>5</span>
              <span>10</span>
              <span>15</span>
            </div>
          </div>

          <!-- Dados de Fome -->
          <div>
            <div class="flex justify-between items-center mb-1">
              <label class="text-sm font-medium text-neutral-300 flex items-center">
                <span class="w-3 h-3 rounded-full bg-red-700 border border-red-400 inline-block mr-2 animate-pulse"></span>
                Dados de Fome (Vermelhos)
              </label>
              <span class="text-red-400 font-bold font-serif text-lg">{{ hungerCount }}</span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              v-model.number="hungerCount"
              class="w-full accent-red-600 bg-neutral-800 rounded-lg cursor-pointer h-2"
            />
            <div class="flex justify-between text-[11px] text-neutral-500 mt-1">
              <span>0</span>
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5 (Fome Extrema)</span>
            </div>
          </div>

          <!-- Dificuldade -->
          <div>
            <div class="flex justify-between items-center mb-1">
              <label class="text-sm font-medium text-neutral-300">Dificuldade do Teste</label>
              <span class="text-neutral-200 font-bold font-serif text-lg">{{ difficulty }}</span>
            </div>
            <input
              type="range"
              min="1"
              max="8"
              v-model.number="difficulty"
              class="w-full accent-neutral-400 bg-neutral-800 rounded-lg cursor-pointer h-2"
            />
            <div class="flex justify-between text-[11px] text-neutral-500 mt-1">
              <span>1 (Fácil)</span>
              <span>3 (Médio)</span>
              <span>5 (Difícil)</span>
              <span>8 (Quase Impossível)</span>
            </div>
          </div>

          <!-- Atalhos Rápidos -->
          <div class="pt-2">
            <label class="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2 block">
              Atalhos de Teste V5
            </label>
            <div class="grid grid-cols-2 gap-2">
              <button
                @click="setPreset(4, 1, 2)"
                class="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded text-xs text-neutral-300 text-left border border-neutral-700/60 transition-all hover:border-red-600/40"
              >
                🧛 <strong>Ataque Furtivo</strong> (4+1F, Dif 2)
              </button>
              <button
                @click="setPreset(6, 2, 3)"
                class="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded text-xs text-neutral-300 text-left border border-neutral-700/60 transition-all hover:border-red-600/40"
              >
                ⚔️ <strong>Combate Frenético</strong> (6+2F, Dif 3)
              </button>
              <button
                @click="setPreset(1, 0, 1)"
                class="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded text-xs text-neutral-300 text-left border border-neutral-700/60 transition-all hover:border-red-600/40"
              >
                🩸 <strong>Rouse Check</strong> (1 Dado)
              </button>
              <button
                @click="setPreset(7, 3, 4)"
                class="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded text-xs text-neutral-300 text-left border border-neutral-700/60 transition-all hover:border-red-600/40"
              >
                🩸 <strong>Fome Desenfreada</strong> (7+3F, Dif 4)
              </button>
            </div>
          </div>
        </div>

        <!-- Botões de Ação -->
        <div class="space-y-3 pt-6 border-t border-neutral-800">
          <button
            @click="handleRoll"
            :disabled="isRolling || (regularCount === 0 && hungerCount === 0)"
            class="w-full py-4 bg-gradient-to-r from-red-800 via-red-600 to-red-900 hover:from-red-700 hover:to-red-800 disabled:opacity-50 text-white font-serif font-bold text-base tracking-wider rounded-lg shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all transform active:scale-98 flex items-center justify-center space-x-2 border border-red-500/30 cursor-pointer"
          >
            <span v-if="isRolling" class="inline-block animate-spin">🎲</span>
            <span v-else>🎲</span>
            <span>{{ isRolling ? 'ROLANDO DADOS 3D...' : 'ROLAR DADOS 3D' }}</span>
          </button>

          <button
            @click="handleClear"
            :disabled="isRolling"
            class="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-200 rounded-lg text-xs font-semibold uppercase tracking-wider border border-neutral-700/50 transition-all cursor-pointer"
          >
            Limpar Mesa
          </button>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Dice3DEngine, type DieRollResult } from '../utils/diceEngine'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let engine: Dice3DEngine | null = null

const regularCount = ref<number>(4)
const hungerCount = ref<number>(1)
const difficulty = ref<number>(2)

const isRolling = ref<boolean>(false)
const results = ref<DieRollResult[] | null>(null)

onMounted(() => {
  if (canvasRef.value) {
    engine = new Dice3DEngine({
      canvas: canvasRef.value,
      onSettle: (rolledResults) => {
        results.value = rolledResults
        isRolling.value = false
      }
    })
  }
})

onUnmounted(() => {
  if (engine) {
    engine.destroy()
    engine = null
  }
})

function handleRoll() {
  if (!engine || isRolling.value) return
  if (regularCount.value === 0 && hungerCount.value === 0) return

  results.value = null
  isRolling.value = true
  engine.rollDice(regularCount.value, hungerCount.value)
}

function handleClear() {
  if (!engine) return
  results.value = null
  isRolling.value = false
  engine.clearDice()
}

function setPreset(reg: number, hung: number, diff: number) {
  regularCount.value = reg
  hungerCount.value = hung
  difficulty.value = diff
  handleRoll()
}

// Apuração de Regras V5
const totalSuccesses = computed(() => {
  if (!results.value) return 0
  let count = 0
  let tensCount = 0

  for (const d of results.value) {
    if (d.value >= 6) {
      count++
    }
    if (d.value === 10) {
      tensCount++
    }
  }

  // A cada par de 10s, ganha +2 sucessos extras (crítico V5)
  const critBonus = Math.floor(tensCount / 2) * 2
  return count + critBonus
})

const hasCritical = computed(() => {
  if (!results.value) return false
  const tens = results.value.filter(d => d.value === 10).length
  return tens >= 2
})

const hasMessyCritical = computed(() => {
  if (!hasCritical.value || !results.value) return false
  // Crítico é bestial se pelo menos um 10 estiver em um dado de fome
  return results.value.some(d => d.type === 'hunger' && d.value === 10)
})

const hasBestialFailure = computed(() => {
  if (!results.value) return false
  const isFail = totalSuccesses.value < difficulty.value
  const hasHungerOne = results.value.some(d => d.type === 'hunger' && d.value === 1)
  return isFail && hasHungerOne
})

const isVictory = computed(() => {
  return totalSuccesses.value >= difficulty.value
})

const verdictTitle = computed(() => {
  if (hasMessyCritical.value && isVictory.value) return 'Crítico Bestial! (Messy Critical)'
  if (hasCritical.value && isVictory.value) return 'Vitória com Crítico!'
  if (isVictory.value) return 'Vitória (Sucesso)'
  if (hasBestialFailure.value) return 'Falha Bestial! (Bestial Failure)'
  return 'Falha no Teste'
})

const verdictSubtitle = computed(() => {
  if (hasMessyCritical.value && isVictory.value) {
    return 'A Besta assumiu o controle momentâneo para garantir a vitória através de violência ou impulsos animalescos!'
  }
  if (hasCritical.value && isVictory.value) {
    return 'Um triunfo magnífico e controlado de maestria vampírica.'
  }
  if (isVictory.value) {
    return `Você alcançou a dificuldade ${difficulty.value} com sucesso.`
  }
  if (hasBestialFailure.value) {
    return 'A fome e a Besta sabotaram suas ações resultando em uma catástrofe dramática!'
  }
  return `Você não atingiu a dificuldade ${difficulty.value}.`
})

const verdictIcon = computed(() => {
  if (hasMessyCritical.value && isVictory.value) return '🩸⚡'
  if (hasCritical.value && isVictory.value) return '☥✨'
  if (isVictory.value) return '✓'
  if (hasBestialFailure.value) return '☠️'
  return '✗'
})

const verdictClass = computed(() => {
  if (hasMessyCritical.value && isVictory.value) {
    return 'bg-red-950/90 border-red-500 text-red-100 shadow-[0_0_30px_rgba(239,68,68,0.5)]'
  }
  if (hasCritical.value && isVictory.value) {
    return 'bg-amber-950/90 border-amber-400 text-amber-100 shadow-[0_0_30px_rgba(245,158,11,0.5)]'
  }
  if (isVictory.value) {
    return 'bg-emerald-950/90 border-emerald-500 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
  }
  if (hasBestialFailure.value) {
    return 'bg-neutral-950/95 border-red-600 text-red-400 shadow-[0_0_30px_rgba(220,38,38,0.6)]'
  }
  return 'bg-neutral-900/90 border-neutral-700 text-neutral-300'
})

const verdictBorderClass = computed(() => {
  if (hasMessyCritical.value && isVictory.value) return 'border-red-800'
  if (hasCritical.value && isVictory.value) return 'border-amber-800'
  if (isVictory.value) return 'border-emerald-800'
  if (hasBestialFailure.value) return 'border-red-900'
  return 'border-neutral-800'
})
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -10px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}
</style>
