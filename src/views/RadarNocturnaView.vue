<template>
  <div class="min-h-screen bg-[#02050a] text-stone-300 font-sans relative overflow-x-hidden selection:bg-cyan-900 selection:text-white pb-20 select-none">
    
    <!-- HEADER -->
    <header class="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between p-6 border-b border-[rgba(0,150,255,0.3)] gap-4 sticky top-0 bg-[#02050a]/90 backdrop-blur-sm z-20">
      <div class="flex items-center gap-3">
        <span class="text-cyan-400 text-2xl drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]">⚜</span>
        <div>
          <h1 class="text-cyan-400 font-serif text-xl tracking-widest uppercase">Radar Tático</h1>
          <span class="text-[rgba(0,150,255,0.8)] text-xs tracking-widest uppercase">Nocturna • Reconhecimento Urbano</span>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <!-- Status de Missão Ativa no Header -->
        <button 
          v-if="activeMission" 
          @click="router.push('/personagem/missao-ativa?id=' + characterId)" 
          class="flex items-center gap-2 px-3 py-1.5 rounded bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-xs font-mono text-red-300 shadow-[0_0_15px_rgba(255,0,0,0.2)] transition-all animate-pulse"
          title="Ver missão em andamento"
        >
          <span class="w-2 h-2 rounded-full bg-red-400"></span>
          <span class="uppercase tracking-wider font-bold">⚔️ Operação em Andamento</span>
        </button>

        <button @click="returnToHaven" class="text-cyan-500 hover:text-cyan-300 transition text-xs uppercase tracking-widest font-serif border border-cyan-500/30 px-4 py-2 rounded hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] hover:bg-cyan-900/20 flex items-center gap-1.5">
          <span>🏠</span>
          <span>Retornar ao Refúgio</span>
        </button>
      </div>
    </header>

    <div v-if="loading" class="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center text-cyan-500 font-serif">
      <div class="animate-spin w-8 h-8 border-2 border-cyan-900 border-t-transparent rounded-full mx-auto mb-4"></div>
      Calibrando frequências de sonar e névoa urbana...
    </div>

    <!-- MAPA E DOSSIÊ -->
    <main v-else class="mapa-container relative w-full h-[calc(100vh-85px)] overflow-hidden flex items-center justify-center bg-[#02050a]" @click="closeSidebarIfClickOutside">
      
      <div class="radar relative w-[85vh] h-[85vh] max-w-[800px] max-h-[800px] rounded-full border-2 border-[rgba(0,150,255,0.4)] bg-[radial-gradient(circle_at_center,rgba(0,50,100,0.15)_0%,rgba(0,10,20,0.9)_100%)] shadow-[0_0_50px_rgba(0,150,255,0.15),inset_0_0_80px_rgba(0,150,255,0.2)] overflow-hidden font-mono select-none">
        
        <!-- Crosshairs & Grid -->
        <div class="absolute inset-y-0 left-1/2 w-px bg-[rgba(0,150,255,0.3)] -translate-x-1/2 pointer-events-none"></div>
        <div class="absolute inset-x-0 top-1/2 h-px bg-[rgba(0,150,255,0.3)] -translate-y-1/2 pointer-events-none"></div>
        
        <div class="absolute inset-0 border-t border-[rgba(0,150,255,0.12)] top-1/2 rotate-45 pointer-events-none"></div>
        <div class="absolute inset-0 border-t border-[rgba(0,150,255,0.12)] top-1/2 -rotate-45 pointer-events-none"></div>

        <!-- 4 Anéis Concêntricos (A, B, C, D) -->
        <!-- Anel A (Centro - Raio 20%) -->
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-cyan-500/20 rounded-full pointer-events-none w-[20%] h-[20%]"></div>
        <!-- Anel B (Próximo - Raio 45%) -->
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-cyan-500/25 rounded-full pointer-events-none w-[45%] h-[45%]"></div>
        <!-- Anel C (Médio - Raio 70%) -->
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-cyan-500/25 rounded-full pointer-events-none w-[70%] h-[70%]"></div>
        <!-- Anel D (Fronteira - Raio 92%) -->
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-cyan-500/20 rounded-full pointer-events-none w-[92%] h-[92%]"></div>

        <!-- LABELS DE QUADRANTES TÁTICOS (01 NORTE, 02 LESTE, 03 SUL, 04 OESTE) -->
        <div class="absolute top-4 left-6 text-2xl sm:text-3xl font-mono font-bold text-yellow-400/40 pointer-events-none tracking-widest">
          01 <span class="text-[10px] text-cyan-400/40 uppercase block font-sans -mt-1 font-normal">ZN • Norte</span>
        </div>
        <div class="absolute top-4 right-6 text-2xl sm:text-3xl font-mono font-bold text-yellow-400/40 pointer-events-none tracking-widest text-right">
          02 <span class="text-[10px] text-cyan-400/40 uppercase block font-sans -mt-1 font-normal">ZL • Leste</span>
        </div>
        <div class="absolute bottom-4 right-6 text-2xl sm:text-3xl font-mono font-bold text-yellow-400/40 pointer-events-none tracking-widest text-right">
          03 <span class="text-[10px] text-cyan-400/40 uppercase block font-sans -mt-1 font-normal">ZS • Sul</span>
        </div>
        <div class="absolute bottom-4 left-6 text-2xl sm:text-3xl font-mono font-bold text-yellow-400/40 pointer-events-none tracking-widest">
          04 <span class="text-[10px] text-cyan-400/40 uppercase block font-sans -mt-1 font-normal">ZO • Oeste</span>
        </div>

        <!-- LABELS TÁTICOS DOS SETORES (1A, 1B, 1C, 1D, 2A...) -->
        <!-- Quadrante 01 (Norte) -->
        <div class="absolute top-[43%] left-[44%] text-[9px] font-mono text-yellow-400/30 pointer-events-none font-bold">1A</div>
        <div class="absolute top-[32%] left-[41%] text-[9px] font-mono text-yellow-400/30 pointer-events-none font-bold">1B</div>
        <div class="absolute top-[20%] left-[34%] text-[9px] font-mono text-yellow-400/30 pointer-events-none font-bold">1C</div>
        <div class="absolute top-[10%] left-[27%] text-[9px] font-mono text-yellow-400/30 pointer-events-none font-bold">1D</div>

        <!-- Quadrante 02 (Leste) -->
        <div class="absolute top-[43%] right-[44%] text-[9px] font-mono text-yellow-400/30 pointer-events-none font-bold">2A</div>
        <div class="absolute top-[38%] right-[32%] text-[9px] font-mono text-yellow-400/30 pointer-events-none font-bold">2B</div>
        <div class="absolute top-[28%] right-[22%] text-[9px] font-mono text-yellow-400/30 pointer-events-none font-bold">2C</div>
        <div class="absolute top-[18%] right-[12%] text-[9px] font-mono text-yellow-400/30 pointer-events-none font-bold">2D</div>

        <!-- Quadrante 03 (Sul) -->
        <div class="absolute bottom-[43%] right-[44%] text-[9px] font-mono text-yellow-400/30 pointer-events-none font-bold">3A</div>
        <div class="absolute bottom-[35%] right-[38%] text-[9px] font-mono text-yellow-400/30 pointer-events-none font-bold">3B</div>
        <div class="absolute bottom-[22%] right-[34%] text-[9px] font-mono text-yellow-400/30 pointer-events-none font-bold">3C</div>
        <div class="absolute bottom-[10%] right-[30%] text-[9px] font-mono text-yellow-400/30 pointer-events-none font-bold">3D</div>

        <!-- Quadrante 04 (Oeste) -->
        <div class="absolute bottom-[43%] left-[44%] text-[9px] font-mono text-yellow-400/30 pointer-events-none font-bold">4A</div>
        <div class="absolute bottom-[38%] left-[32%] text-[9px] font-mono text-yellow-400/30 pointer-events-none font-bold">4B</div>
        <div class="absolute bottom-[28%] left-[22%] text-[9px] font-mono text-yellow-400/30 pointer-events-none font-bold">4C</div>
        <div class="absolute bottom-[18%] left-[12%] text-[9px] font-mono text-yellow-400/30 pointer-events-none font-bold">4D</div>

        <!-- Radar Sweep -->
        <div class="absolute inset-0 origin-center rounded-full pointer-events-none z-10 animate-sweep" style="background: conic-gradient(from 0deg, transparent 70%, rgba(0, 200, 255, 0.1) 90%, rgba(0, 255, 255, 0.6) 100%);"></div>
        
        <!-- Radar Center -->
        <div class="absolute top-1/2 left-1/2 w-2.5 h-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400 shadow-[0_0_15px_#00ffff] z-20"></div>

        <!-- Blips Content -->
        <div class="absolute inset-0 z-20">
          <div 
            v-for="(node, index) in mapNodes" 
            :key="index"
            class="absolute w-2 h-2 rounded-full cursor-pointer transition-all duration-200 ease-out hover:scale-[2.5] hover:z-30 hover:opacity-100 flex items-center justify-center text-[8px]"
            :class="[node.blinking ? 'animate-[blipBlink_2s_infinite]' : 'opacity-80', node.knownStatus === 'RUMOR' ? 'border border-dashed border-gray-400' : '']"
            :style="{ left: `${node.x}%`, top: `${node.y}%`, animationDelay: `${node.delay}s`, backgroundColor: node.color, boxShadow: `0 0 10px ${node.color}` }"
            @mouseenter="(e) => showTooltip(e, node)"
            @mouseleave="hideTooltip"
            @click.stop="openSidebar(node)"
          >
            <span v-if="node.knownStatus === 'RUMOR'" class="text-[7px] text-black font-bold">?</span>
            <!-- Hover Ring -->
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-current opacity-0 transition-all duration-200 hover:opacity-100 hover:scale-150"></div>
          </div>
        </div>
      </div>

      <!-- Tooltip -->
      <div 
        class="fixed pointer-events-none opacity-0 bg-[rgba(2,5,10,0.95)] border border-cyan-500/60 px-3.5 py-2 rounded-lg z-[100] font-mono text-[11px] tracking-widest text-cyan-300 uppercase -translate-x-1/2 -translate-y-[120%] transition-opacity duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.9)] drop-shadow-[0_0_10px_rgba(0,255,255,0.5)] whitespace-nowrap"
        :class="{ 'opacity-100': tooltip.visible }"
        :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
      >
        <div class="flex items-center justify-between gap-3 text-[9px] text-white/50 mb-0.5">
          <span>{{ tooltip.zona }}</span>
          <span class="text-yellow-400 font-bold">[{{ tooltip.sectorCode }}]</span>
        </div>
        <span class="block text-white font-serif font-bold tracking-wider">{{ tooltip.nome }}</span>
        <span class="block text-[10px] mt-1 font-mono" :style="{ color: tooltip.facColor }">{{ tooltip.faccao }}</span>
      </div>

      <!-- Sidebar Dossiê -->
      <aside 
        class="absolute top-0 bottom-0 w-full md:w-[420px] bg-[rgba(5,5,12,0.96)] backdrop-blur-md border-l border-[rgba(0,150,255,0.3)] shadow-[-10px_0_30px_rgba(0,0,0,0.8)] z-30 p-6 md:p-8 overflow-y-auto transition-all duration-300 ease-out space-y-6"
        :class="sidebarNode ? 'right-0' : '-right-[100%] md:-right-[450px]'"
      >
        <button @click="closeSidebar" class="absolute top-5 right-5 text-[rgba(0,150,255,0.7)] text-2xl hover:text-cyan-400 hover:drop-shadow-[0_0_10px_#00ffff] transition-all">×</button>
        
        <div v-if="sidebarNode" class="pb-4 border-b border-[rgba(0,150,255,0.3)]">
          <div class="flex justify-between items-center text-[10px] font-mono tracking-widest uppercase mb-1">
            <span class="text-cyan-400">{{ sidebarNode.zona }}</span>
            <span class="px-2 py-0.5 rounded bg-yellow-950/80 border border-yellow-500/40 text-yellow-300 font-bold">SETOR: {{ sidebarNode.sectorCode }}</span>
          </div>
          <h2 class="font-serif text-2xl text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] leading-tight mb-2">{{ sidebarNode.nome }}</h2>
          
          <div class="flex items-center gap-2 mt-2">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border font-mono text-[11px] tracking-widest uppercase" :style="{ color: sidebarNode.color, borderColor: `${sidebarNode.color}55`, backgroundColor: `${sidebarNode.color}22` }">
              {{ sidebarNode.icon }} {{ sidebarNode.faccao }}
            </span>
            <span v-if="sidebarNode.knownStatus === 'RUMOR'" class="px-2 py-0.5 rounded bg-yellow-950/80 border border-yellow-500/50 text-yellow-400 font-mono text-[9px] uppercase tracking-wider">
              Névoa: Boato
            </span>
            <span v-else class="px-2 py-0.5 rounded bg-green-950/80 border border-green-500/50 text-green-400 font-mono text-[9px] uppercase tracking-wider">
              Explorado
            </span>
          </div>
        </div>

        <!-- ESTADO RUMOR (NÉVOA DE GUERRA) -->
        <div v-if="sidebarNode && sidebarNode.knownStatus === 'RUMOR'" class="space-y-4">
          <div class="p-4 rounded-xl border border-yellow-500/30 bg-yellow-950/20 text-xs font-serif leading-relaxed text-yellow-200/90 space-y-2.5">
            <div class="font-bold uppercase tracking-wider text-yellow-400 flex items-center gap-2">
              <span>⚠️</span> Território Não Mapeado
            </div>
            <p>Seus contatos e lacaios ouviram rumores sobre este local, mas você ainda não o explorou pessoalmente. Dados estratégicos e rotas de caça permanecem ocultos nas sombras.</p>
            
            <!-- PARÂMETROS DA OPERAÇÃO DE RECONHECIMENTO -->
            <div class="pt-2.5 border-t border-yellow-500/20 space-y-1.5 font-mono text-[11px] text-yellow-300/80">
              <div class="flex justify-between">
                <span>⏱ Duração Real:</span>
                <strong class="text-white">5 minutos</strong>
              </div>
              <div class="flex justify-between">
                <span>🌙 Custo Noturno:</span>
                <strong class="text-cyan-400">5 horas de noite</strong>
              </div>
              <div class="flex justify-between">
                <span>🎲 Dificuldade Base:</span>
                <strong class="text-red-400">Dificuldade 8</strong>
              </div>
              <div class="flex justify-between">
                <span>🎯 Testes V5:</span>
                <strong class="text-stone-300">Sobrevivência, Investigação, Furtividade</strong>
              </div>
              <div class="flex justify-between text-green-400">
                <span>🏆 Sucesso:</span>
                <span>Mapeamento Total & +5 XP</span>
              </div>
              <div class="flex justify-between text-red-400">
                <span>💀 Falha:</span>
                <span>Permanece Oculto & +1 Fome</span>
              </div>
            </div>
          </div>

          <button 
            @click="startReconMission" 
            :disabled="!!activeMission || exploring || currentNightStatus?.isDaytime"
            class="w-full py-3.5 rounded-lg border border-cyan-400 bg-cyan-950/70 hover:bg-cyan-500 hover:text-black text-cyan-300 font-serif font-bold uppercase tracking-widest text-xs transition-all shadow-[0_0_20px_rgba(0,255,255,0.25)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span v-if="exploring" class="animate-spin">⏳</span>
            <span v-else>🔍</span>
            <span>{{ activeMission ? 'Vampiro Ocupado em Missão' : (currentNightStatus?.isDaytime ? '☀️ Operação Bloqueada (Dia)' : (exploring ? 'Iniciando Expedição...' : 'Iniciar Missão de Reconhecimento')) }}</span>
          </button>
        </div>

        <!-- ESTADO DISCOVERED (TOTALMENTE EXPLORADO) -->
        <div v-else-if="sidebarNode" class="space-y-6">
          <div class="grid grid-cols-2 gap-3">
            <div class="border border-[rgba(0,150,255,0.2)] rounded p-2.5 text-center bg-black/40">
              <span class="block font-mono text-[9px] tracking-widest uppercase text-white/50 mb-1">Riqueza</span>
              <span class="font-serif text-xs tracking-widest text-white uppercase">{{ sidebarNode.attributes.riqueza }}</span>
            </div>
            <div class="border border-[rgba(0,150,255,0.2)] rounded p-2.5 text-center bg-black/40">
              <span class="block font-mono text-[9px] tracking-widest uppercase text-white/50 mb-1">Criminalidade</span>
              <span class="font-serif text-xs tracking-widest text-white uppercase">{{ sidebarNode.attributes.criminalidade }}</span>
            </div>
          </div>

          <div v-if="sidebarNode.attributes.seguranca_publica" class="bg-[rgba(0,150,255,0.05)] border border-[rgba(0,150,255,0.2)] rounded p-3.5">
            <div class="font-mono text-[10px] tracking-widest uppercase text-[rgba(0,200,255,0.8)] mb-1">Segurança Pública</div>
            <div class="font-sans text-xs text-[#dcd1b3] leading-relaxed">{{ sidebarNode.attributes.seguranca_publica }}</div>
          </div>

          <div v-if="sidebarNode.attributes.visibilidade_midiatica" class="bg-[rgba(0,150,255,0.05)] border border-[rgba(0,150,255,0.2)] rounded p-3.5">
            <div class="font-mono text-[10px] tracking-widest uppercase text-[rgba(0,200,255,0.8)] mb-1">Visibilidade Midiática</div>
            <div class="font-sans text-xs text-[#dcd1b3] leading-relaxed">{{ sidebarNode.attributes.visibilidade_midiatica }}</div>
          </div>

          <!-- SEÇÃO DE MISSÕES E CAÇADAS NESTE LOCAL -->
          <div class="border-t border-[rgba(0,150,255,0.2)] pt-4 space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="font-serif text-xs text-gold uppercase tracking-widest font-bold flex items-center gap-1.5">
                <span>🩸</span> Incursões & Caçadas no Bairro
              </h3>
              <span class="text-[10px] text-gray-400 font-mono">{{ sidebarNode.missions?.length || 0 }} ativas</span>
            </div>

            <div v-if="sidebarNode.missions && sidebarNode.missions.length > 0" class="space-y-3">
              <div v-for="m in sidebarNode.missions" :key="m.id" class="p-3.5 rounded-lg border border-white/10 bg-black/60 hover:border-gold/40 transition-all space-y-2">
                <div class="flex justify-between items-start">
                  <h4 class="font-serif text-sm text-parchment font-bold">{{ m.title }}</h4>
                  <span class="text-[9px] px-1.5 py-0.5 rounded uppercase font-mono" :class="m.category === 'HUNT' ? 'bg-red-950 text-red-400 border border-red-800/40' : 'bg-blue-950 text-cyan-400 border border-cyan-800/40'">
                    {{ m.category === 'HUNT' ? 'Caçada' : 'Operação' }}
                  </span>
                </div>
                <p class="text-xs text-gray-400 font-light line-clamp-2 leading-relaxed">{{ m.description }}</p>
                <div class="flex justify-between items-center text-[10px] font-mono text-gray-500 pt-1">
                  <span>⏱ {{ m.durationMinutes }} min</span>
                  <span>Dif. {{ m.baseDifficulty }}</span>
                </div>
                <button 
                  @click="dispatchMission(m)"
                  :disabled="!!activeMission || dispatching || currentNightStatus?.isDaytime" 
                  class="w-full mt-2 py-2 rounded border border-vamp-c2 bg-vamp-c2/10 hover:bg-vamp-c2 hover:text-white text-vamp-c2 text-xs font-serif font-bold uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {{ activeMission ? 'Vampiro Ocupado em Missão' : (currentNightStatus?.isDaytime ? '☀️ Operação Bloqueada (Dia)' : 'Despachar Personagem') }}
                </button>
              </div>
            </div>
            <div v-else class="text-center py-4 text-xs text-gray-500 font-serif italic border border-white/5 rounded-lg bg-black/20">
              Nenhuma operação ativa registrada neste domínio no momento.
            </div>
          </div>
        </div>

      </aside>
    </main>

    <!-- BARRA INFERIOR / DOCK DO CICLO NOTURNO -->
    <NightClockWidget 
      v-if="characterId" 
      :characterId="characterId" 
      @status-updated="onNightStatusUpdated" 
    />

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../services/api'
import NightClockWidget from '../components/NightClockWidget.vue'
import { notifySuccess, notifyError } from '../utils/gothicAlerts'

const router = useRouter()
const route = useRoute()
const characterId = ref<string>('')
const loading = ref(true)
const exploring = ref(false)
const dispatching = ref(false)
const currentNightStatus = ref<any>(null)

const onNightStatusUpdated = (status: any) => {
  currentNightStatus.value = status
}

const mapNodes = ref<any[]>([])
const sidebarNode = ref<any>(null)
const activeMission = ref<any>(null)

const returnToHaven = () => {
  router.push(`/personagem/hub?id=${characterId.value}`)
}

const tooltip = ref({
  visible: false,
  x: 0,
  y: 0,
  zona: '',
  sectorCode: '',
  nome: '',
  faccao: '',
  facColor: ''
})

const getFactionColor = (dom: string = '', status: string = 'DISCOVERED') => {
  if (status === 'RUMOR') return '#9ca3af' // Cinza para boato/rumor
  const d = dom.toLowerCase()
  if (d.includes('vampiro')) return '#ff3333'
  if (d.includes('lobisomem')) return '#33ff33'
  if (d.includes('mago')) return '#cc33ff'
  if (d.includes('caçador') || d.includes('cacador')) return '#ff9933'
  return '#00ffff'
}

const getFactionIcon = (dom: string = '', status: string = 'DISCOVERED') => {
  if (status === 'RUMOR') return '❔'
  const d = dom.toLowerCase()
  if (d.includes('vampiro')) return '🩸'
  if (d.includes('lobisomem')) return '🐺'
  if (d.includes('mago')) return '🔮'
  if (d.includes('caçador') || d.includes('cacador')) return '🔫'
  return '🏙️'
}

// Configuração Tática dos 4 Quadrantes e Anéis Concêntricos
const QUADRANTS_CONFIG: Record<string, { quadrantNum: string; name: string; minA: number; maxA: number }> = {
  'zona_norte':   { quadrantNum: '01', name: 'Zona Norte',   minA: 1.25 * Math.PI, maxA: 1.75 * Math.PI },
  'zona_leste':   { quadrantNum: '02', name: 'Zona Leste',   minA: 1.75 * Math.PI, maxA: 2.25 * Math.PI },
  'zona_sul':     { quadrantNum: '03', name: 'Zona Sul',     minA: 0.25 * Math.PI, maxA: 0.75 * Math.PI },
  'zona_oeste':   { quadrantNum: '04', name: 'Zona Oeste',   minA: 0.75 * Math.PI, maxA: 1.25 * Math.PI },
  'zona_central': { quadrantNum: '00', name: 'Zona Central', minA: 0,              maxA: 2 * Math.PI }
}

const RINGS = [
  { letter: 'B', r: 0.38 }, // Anel B (Próximo)
  { letter: 'C', r: 0.62 }, // Anel C (Intermediário)
  { letter: 'D', r: 0.84 }  // Anel D (Fronteira/Periferia)
]

const fetchLocations = async () => {
  try {
    characterId.value = (route.query.id as string) || localStorage.getItem('lira_active_character_id') || ''
    const res = await api.get(`/api/radar?characterId=${characterId.value}`)
    const zones = res.data

    const nodes: any[] = []

    zones.forEach((zone: any) => {
      let zoneAttrs = zone.attributes || {}
      if (typeof zoneAttrs === 'string') {
        try { zoneAttrs = JSON.parse(zoneAttrs) } catch (e) {}
      }
      const zoneKey = zoneAttrs.key || 'zona_central'
      const quad = QUADRANTS_CONFIG[zoneKey] || QUADRANTS_CONFIG['zona_central']

      if (zone.children && Array.isArray(zone.children)) {
        // Ordenação alfabética estrita para garantir posições 100% fixas e imutáveis
        const sortedBairros = [...zone.children].sort((a, b) => a.name.localeCompare(b.name))
        const totalBairros = sortedBairros.length || 1

        sortedBairros.forEach((bairro: any, index: number) => {
          let bairroAttrs = bairro.attributes || {}
          if (typeof bairroAttrs === 'string') {
            try { bairroAttrs = JSON.parse(bairroAttrs) } catch (e) {}
          }

          let r: number
          let a: number
          let sectorCode: string

          if (zoneKey === 'zona_central') {
            // Centro fica no Anel A (Raio 0.16)
            r = 0.16
            a = (index / totalBairros) * 2 * Math.PI
            sectorCode = `00-A`
          } else {
            // Anéis B, C, D alternados deterministicamente
            const ring = RINGS[index % 3]
            r = ring.r
            sectorCode = `${quad.quadrantNum}${ring.letter}`
            
            // Ângulo distribuído uniformemente na fatia angular do quadrante
            a = quad.minA + ((index + 0.5) / totalBairros) * (quad.maxA - quad.minA)
          }

          const x = 50 + (r * Math.cos(a) * 50)
          const y = 50 + (r * Math.sin(a) * 50)

          const status = bairro.knownStatus || 'DISCOVERED'
          const faccao = status === 'RUMOR' ? 'Boato Não Confirmado' : (bairroAttrs.dominio_faccao || 'Desconhecido')

          nodes.push({
            id: bairro.id,
            nome: bairro.name,
            zona: zone.name || quad.name,
            sectorCode,
            x,
            y,
            delay: (index * 0.3) % 2,
            blinking: true,
            knownStatus: status,
            color: getFactionColor(faccao, status),
            faccao: faccao,
            icon: getFactionIcon(faccao, status),
            attributes: bairroAttrs,
            missions: bairro.missions || []
          })
        })
      }
    })

    mapNodes.value = nodes
  } catch (err) {
    console.error('Erro ao buscar locations:', err)
  } finally {
    loading.value = false
  }
}

const fetchActiveMission = async () => {
  if (!characterId.value) return
  try {
    const res = await api.get(`/api/missions-idle/active/${characterId.value}`)
    activeMission.value = res.data
  } catch (e) {
    console.error('Erro ao buscar missão ativa:', e)
  }
}

const startReconMission = async () => {
  if (!sidebarNode.value || !characterId.value) return
  try {
    exploring.value = true
    await api.post(`/api/radar/locations/${sidebarNode.value.id}/start-recon`, {
      characterId: characterId.value
    })
    notifySuccess('Expedição Iniciada', `Missão de Reconhecimento iniciada para ${sidebarNode.value.nome}!`)
    router.push(`/personagem/missao-ativa?id=${characterId.value}`)
  } catch (e: any) {
    console.error('Erro ao iniciar reconhecimento:', e)
    notifyError('Falha no Reconhecimento', e.response?.data?.error || 'Não foi possível iniciar a expedição.')
  } finally {
    exploring.value = false
  }
}

const dispatchMission = async (mission: any) => {
  if (!characterId.value) return
  try {
    dispatching.value = true
    await api.post('/api/missions-idle/start', {
      characterId: characterId.value,
      definitionMissionIdleId: mission.id
    })
    notifySuccess('Incursão Iniciada', `Operação '${mission.title}' iniciada no distrito!`)
    router.push(`/personagem/missao-ativa?id=${characterId.value}`)
  } catch (e: any) {
    console.error(e)
    notifyError('Falha no Despacho', e.response?.data?.error || 'Não foi possível iniciar a operação.')
  } finally {
    dispatching.value = false
  }
}

const showTooltip = (e: MouseEvent, node: any) => {
  const target = e.target as HTMLElement
  const rect = target.getBoundingClientRect()
  
  tooltip.value = {
    visible: true,
    x: rect.left + (rect.width / 2),
    y: rect.top - 10,
    zona: node.zona,
    sectorCode: node.sectorCode || '00-A',
    nome: node.nome,
    faccao: node.faccao,
    facColor: node.color
  }
}

const hideTooltip = () => {
  tooltip.value.visible = false
}

const openSidebar = (node: any) => {
  sidebarNode.value = node
}

const closeSidebar = () => {
  sidebarNode.value = null
}

const closeSidebarIfClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (target.closest('.mapa-container') && !target.closest('.radar') && !target.closest('aside')) {
    closeSidebar()
  }
}

onMounted(async () => {
  await fetchLocations()
  await fetchActiveMission()
})
</script>

<style scoped>
.animate-sweep {
  animation: sweep 4s linear infinite;
}

@keyframes sweep {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes blipBlink {
  0% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.3); }
  100% { opacity: 0.3; transform: scale(1); }
}
</style>
