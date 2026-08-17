<template>
  <div class="min-h-screen bg-[#02050a] text-stone-300 font-sans relative overflow-x-hidden selection:bg-cyan-900 selection:text-white pb-20 select-none">
    
    <!-- HEADER -->
    <header class="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between p-6 border-b border-[rgba(0,150,255,0.3)] gap-4 sticky top-0 bg-[#02050a]/90 backdrop-blur-sm z-20">
      <div class="flex items-center gap-3">
        <span class="text-cyan-400 text-2xl drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]">⚜</span>
        <div>
          <h1 class="text-cyan-400 font-serif text-xl tracking-widest uppercase">Radar Tático</h1>
          <span class="text-[rgba(0,150,255,0.8)] text-xs tracking-widest uppercase">Nocturna</span>
        </div>
      </div>
      <button @click="router.push(`/personagem/hub?id=${characterId}`)" class="text-cyan-500 hover:text-cyan-300 transition text-xs uppercase tracking-widest font-serif border border-cyan-500/30 px-4 py-2 rounded hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] hover:bg-cyan-900/20">
        ← Retornar ao Refúgio
      </button>
    </header>

    <div v-if="loading" class="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center text-cyan-500 font-serif">
      <div class="animate-spin w-8 h-8 border-2 border-cyan-900 border-t-transparent rounded-full mx-auto mb-4"></div>
      Calibrando frequências...
    </div>

    <!-- MAPA E DOSSIÊ -->
    <main v-else class="mapa-container relative w-full h-[calc(100vh-85px)] overflow-hidden flex items-center justify-center bg-[#02050a]" @click="closeSidebarIfClickOutside">
      
      <div class="radar relative w-[85vh] h-[85vh] max-w-[800px] max-h-[800px] rounded-full border-2 border-[rgba(0,150,255,0.4)] bg-[radial-gradient(circle_at_center,rgba(0,50,100,0.1)_0%,rgba(0,10,20,0.8)_100%)] shadow-[0_0_40px_rgba(0,150,255,0.1),inset_0_0_60px_rgba(0,150,255,0.15)] overflow-hidden">
        
        <!-- Crosshairs & Grid -->
        <div class="absolute inset-y-0 left-1/2 w-px bg-[rgba(0,150,255,0.3)] -translate-x-1/2"></div>
        <div class="absolute inset-x-0 top-1/2 h-px bg-[rgba(0,150,255,0.3)] -translate-y-1/2"></div>
        
        <div class="absolute inset-0 border-t border-[rgba(0,150,255,0.15)] top-1/2 rotate-45"></div>
        <div class="absolute inset-0 border-t border-[rgba(0,150,255,0.15)] top-1/2 -rotate-45"></div>

        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-[rgba(0,150,255,0.25)] rounded-full pointer-events-none w-1/4 h-1/4"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-[rgba(0,150,255,0.25)] rounded-full pointer-events-none w-2/4 h-2/4"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-[rgba(0,150,255,0.25)] rounded-full pointer-events-none w-3/4 h-3/4"></div>

        <!-- Radar Sweep -->
        <div class="absolute inset-0 origin-center rounded-full pointer-events-none z-10 animate-sweep" style="background: conic-gradient(from 0deg, transparent 70%, rgba(0, 200, 255, 0.1) 90%, rgba(0, 255, 255, 0.6) 100%);"></div>
        
        <!-- Radar Center -->
        <div class="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400 shadow-[0_0_15px_#00ffff] z-20"></div>

        <!-- Blips Content -->
        <div class="absolute inset-0 z-20">
          <div 
            v-for="(node, index) in mapNodes" 
            :key="index"
            class="absolute w-1.5 h-1.5 rounded-full cursor-pointer transition-all duration-200 ease-out hover:scale-[2] hover:z-30 hover:opacity-100"
            :class="[node.facClass, node.blinking ? 'animate-[blipBlink_2s_infinite]' : 'opacity-80']"
            :style="{ left: `${node.x}%`, top: `${node.y}%`, animationDelay: `${node.delay}s`, backgroundColor: node.color, boxShadow: `0 0 8px ${node.color}` }"
            @mouseenter="(e) => showTooltip(e, node)"
            @mouseleave="hideTooltip"
            @click.stop="openSidebar(node)"
          >
            <!-- Hover Ring -->
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-current opacity-0 transition-all duration-200 hover:opacity-100 hover:scale-150"></div>
          </div>
        </div>
      </div>

      <!-- Tooltip -->
      <div 
        class="fixed pointer-events-none opacity-0 bg-[rgba(2,5,10,0.95)] border border-[rgba(0,150,255,0.5)] px-3 py-2 rounded z-[100] font-mono text-[11px] tracking-widest text-cyan-400 uppercase -translate-x-1/2 -translate-y-[120%] transition-opacity duration-200 shadow-[0_4px_12px_rgba(0,0,0,0.8)] drop-shadow-[0_0_5px_rgba(0,255,255,0.5)] whitespace-nowrap"
        :class="{ 'opacity-100': tooltip.visible }"
        :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
      >
        <span class="block text-[8px] text-white/50 mb-1">{{ tooltip.zona }}</span>
        <span class="block">{{ tooltip.nome }}</span>
        <span class="block text-[9px] mt-1" :style="{ color: tooltip.facColor }">{{ tooltip.faccao }}</span>
      </div>

      <!-- Sidebar Dossiê -->
      <aside 
        class="absolute top-0 bottom-0 w-full md:w-[400px] bg-[rgba(5,5,12,0.95)] backdrop-blur-md border-l border-[rgba(0,150,255,0.3)] shadow-[-10px_0_30px_rgba(0,0,0,0.8)] z-30 p-8 overflow-y-auto transition-all duration-300 ease-out"
        :class="sidebarNode ? 'right-0' : '-right-[100%] md:-right-[420px]'"
      >
        <button @click="closeSidebar" class="absolute top-5 right-5 text-[rgba(0,150,255,0.7)] text-2xl hover:text-cyan-400 hover:drop-shadow-[0_0_10px_#00ffff] transition-all">×</button>
        
        <div v-if="sidebarNode" class="mb-6 pb-4 border-b border-[rgba(0,150,255,0.3)]">
          <div class="font-mono text-[10px] tracking-widest uppercase text-[rgba(0,200,255,0.8)]">{{ sidebarNode.zona }}</div>
          <h2 class="font-serif text-[1.8rem] text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] leading-tight mb-2">{{ sidebarNode.nome }}</h2>
          
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-mono text-[11px] tracking-widest uppercase mt-2" :style="{ color: sidebarNode.color, borderColor: `${sidebarNode.color}55`, backgroundColor: `${sidebarNode.color}22` }">
            {{ sidebarNode.icon }} {{ sidebarNode.faccao }}
          </span>
        </div>

        <div v-if="sidebarNode" class="grid grid-cols-2 gap-3 mb-6">
          <div class="border border-[rgba(0,150,255,0.2)] rounded p-2.5 text-center">
            <span class="block font-mono text-[9px] tracking-widest uppercase text-white/50 mb-1">Riqueza</span>
            <span class="font-serif text-xs tracking-widest text-white uppercase">{{ sidebarNode.attributes.riqueza }}</span>
          </div>
          <div class="border border-[rgba(0,150,255,0.2)] rounded p-2.5 text-center">
            <span class="block font-mono text-[9px] tracking-widest uppercase text-white/50 mb-1">Criminalidade</span>
            <span class="font-serif text-xs tracking-widest text-white uppercase">{{ sidebarNode.attributes.criminalidade }}</span>
          </div>
        </div>

        <div v-if="sidebarNode" class="bg-[rgba(0,150,255,0.05)] border border-[rgba(0,150,255,0.2)] rounded p-4 mb-4">
          <div class="font-mono text-[10px] tracking-widest uppercase text-[rgba(0,200,255,0.8)] mb-1.5">Segurança Pública</div>
          <div class="font-sans text-[0.95rem] text-[#dcd1b3] leading-relaxed">{{ sidebarNode.attributes.seguranca_publica }}</div>
        </div>

        <div v-if="sidebarNode" class="bg-[rgba(0,150,255,0.05)] border border-[rgba(0,150,255,0.2)] rounded p-4 mb-4">
          <div class="font-mono text-[10px] tracking-widest uppercase text-[rgba(0,200,255,0.8)] mb-1.5">Visibilidade Midiática</div>
          <div class="font-sans text-[0.95rem] text-[#dcd1b3] leading-relaxed">{{ sidebarNode.attributes.visibilidade_midiatica }}</div>
        </div>

        <div v-if="sidebarNode" class="rounded p-4 mb-4" :style="{ backgroundColor: `${sidebarNode.color}15`, borderColor: `${sidebarNode.color}55`, borderWidth: '1px' }">
          <div class="font-mono text-[10px] tracking-widest uppercase mb-1.5" :style="{ color: sidebarNode.color }">Dificuldades (Rolagens)</div>
          <div class="flex flex-col gap-1.5 mt-2">
            <div class="flex items-center justify-between px-2.5 py-1.5 rounded" :style="{ backgroundColor: `${sidebarNode.color}22` }">
              <span class="font-mono text-[10px] tracking-widest uppercase text-white/70">Riqueza</span>
              <span class="font-serif text-[1.1rem]" :style="{ color: sidebarNode.color, textShadow: `0 0 5px ${sidebarNode.color}55` }">{{ sidebarNode.attributes.dificuldades?.teste_riqueza }}</span>
            </div>
            <div class="flex items-center justify-between px-2.5 py-1.5 rounded" :style="{ backgroundColor: `${sidebarNode.color}22` }">
              <span class="font-mono text-[10px] tracking-widest uppercase text-white/70">Criminalidade</span>
              <span class="font-serif text-[1.1rem]" :style="{ color: sidebarNode.color, textShadow: `0 0 5px ${sidebarNode.color}55` }">{{ sidebarNode.attributes.dificuldades?.teste_criminalidade }}</span>
            </div>
            <div class="flex items-center justify-between px-2.5 py-1.5 rounded" :style="{ backgroundColor: `${sidebarNode.color}22` }">
              <span class="font-mono text-[10px] tracking-widest uppercase text-white/70">Segurança</span>
              <span class="font-serif text-[1.1rem]" :style="{ color: sidebarNode.color, textShadow: `0 0 5px ${sidebarNode.color}55` }">{{ sidebarNode.attributes.dificuldades?.teste_seguranca }}</span>
            </div>
            <div class="flex items-center justify-between px-2.5 py-1.5 rounded" :style="{ backgroundColor: `${sidebarNode.color}22` }">
              <span class="font-mono text-[10px] tracking-widest uppercase text-white/70">Domínio</span>
              <span class="font-serif text-[1.1rem]" :style="{ color: sidebarNode.color, textShadow: `0 0 5px ${sidebarNode.color}55` }">{{ sidebarNode.attributes.dificuldades?.teste_dominio }}</span>
            </div>
            <div class="flex items-center justify-between px-2.5 py-1.5 rounded" :style="{ backgroundColor: `${sidebarNode.color}22` }">
              <span class="font-mono text-[10px] tracking-widest uppercase text-white/70">Visibilidade</span>
              <span class="font-serif text-[1.1rem]" :style="{ color: sidebarNode.color, textShadow: `0 0 5px ${sidebarNode.color}55` }">{{ sidebarNode.attributes.dificuldades?.teste_visibilidade }}</span>
            </div>
          </div>
        </div>

      </aside>
    </main>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const route = useRoute()
const characterId = ref<string>('')
const loading = ref(true)

const mapNodes = ref<any[]>([])
const sidebarNode = ref<any>(null)

const tooltip = ref({
  visible: false,
  x: 0,
  y: 0,
  zona: '',
  nome: '',
  faccao: '',
  facColor: ''
})

const ZONAS_MAP: Record<string, any> = {
  'zona_central': { minR: 0.05, maxR: 0.25, minA: 0, maxA: 2 * Math.PI },
  'zona_norte':   { minR: 0.35, maxR: 0.9, minA: 1.25 * Math.PI, maxA: 1.75 * Math.PI },
  'zona_leste':   { minR: 0.35, maxR: 0.9, minA: 1.75 * Math.PI, maxA: 2.25 * Math.PI },
  'zona_sul':     { minR: 0.35, maxR: 0.9, minA: 0.25 * Math.PI, maxA: 0.75 * Math.PI },
  'zona_oeste':   { minR: 0.35, maxR: 0.9, minA: 0.75 * Math.PI, maxA: 1.25 * Math.PI }
}

const getFactionColor = (dom: string = '') => {
  const d = dom.toLowerCase()
  if (d.includes('vampiro')) return '#ff3333'
  if (d.includes('lobisomem')) return '#33ff33'
  if (d.includes('mago')) return '#cc33ff'
  if (d.includes('caçador') || d.includes('cacador')) return '#ff9933'
  return '#00ffff'
}

const getFactionIcon = (dom: string = '') => {
  const d = dom.toLowerCase()
  if (d.includes('vampiro')) return '🩸'
  if (d.includes('lobisomem')) return '🐺'
  if (d.includes('mago')) return '🔮'
  if (d.includes('caçador') || d.includes('cacador')) return '🔫'
  return '❓'
}

let seed = 42
const seededRandom = () => {
  const x = Math.sin(seed++) * 10000
  return x - Math.floor(x)
}

const fetchLocations = async () => {
  try {
    characterId.value = (route.query.id as string) || localStorage.getItem('lira_active_character_id') || ''
    const res = await api.get('/api/radar/locations')
    const zones = res.data

    const nodes: any[] = []

    zones.forEach((zone: any) => {
      let zoneAttrs = zone.attributes || {}
      if (typeof zoneAttrs === 'string') {
        try { zoneAttrs = JSON.parse(zoneAttrs) } catch (e) {}
      }
      const zoneKey = zoneAttrs.key || 'zona_central'
      const sector = ZONAS_MAP[zoneKey] || ZONAS_MAP['zona_central']

      if (zone.children && Array.isArray(zone.children)) {
        zone.children.forEach((bairro: any) => {
          let bairroAttrs = bairro.attributes || {}
          if (typeof bairroAttrs === 'string') {
            try { bairroAttrs = JSON.parse(bairroAttrs) } catch (e) {}
          }

          const r = sector.minR + seededRandom() * (sector.maxR - sector.minR)
          const a = sector.minA + seededRandom() * (sector.maxA - sector.minA)
          
          const x = 50 + (r * Math.cos(a) * 50)
          const y = 50 + (r * Math.sin(a) * 50)

          const faccao = bairroAttrs.dominio_faccao || 'Desconhecido'

          nodes.push({
            id: bairro.id,
            nome: bairro.name,
            zona: zone.name || (zone.name === 'undefined' ? 'Zona Desconhecida' : zone.name),
            x,
            y,
            delay: seededRandom() * 2,
            blinking: true,
            color: getFactionColor(faccao),
            faccao: faccao,
            icon: getFactionIcon(faccao),
            attributes: bairroAttrs
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

const showTooltip = (e: MouseEvent, node: any) => {
  const target = e.target as HTMLElement
  const rect = target.getBoundingClientRect()
  
  tooltip.value = {
    visible: true,
    x: rect.left + (rect.width / 2),
    y: rect.top - 10,
    zona: node.zona,
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

onMounted(() => {
  fetchLocations()
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
  0% { opacity: 0.2; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
  100% { opacity: 0.2; transform: scale(1); }
}
</style>
