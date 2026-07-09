<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const systemParam = route.params.system as string
const characterId = route.params.id as string

const character = ref<any>(null)
const loading = ref(true)
const errorMsg = ref('')

const activeTab = ref('stats') // 'stats', 'skills', 'disciplines', 'lore', 'raw'

// Mapeamento dinâmico de cores por sistema
const theme = computed(() => {
  const s = systemParam.toLowerCase()
  if (s === 'vampire') return { 
    bgClass: 'bg-[#06000a]', c1: '#8b0000', c2: '#c0392b', 
    c1Class: 'bg-vamp-c1', borderClass: 'border-vamp-c1', textClass: 'text-vamp-c2',
    glow: 'rgba(192,57,43,0.4)', icon: '🩸', label: 'V5 · Vampiro', name: 'Vampiro: A Máscara' 
  }
  if (s === 'werewolf') return { 
    bgClass: 'bg-[#030a00]', c1: '#1a4a00', c2: '#4a9a1a', 
    c1Class: 'bg-wolf-c1', borderClass: 'border-wolf-c1', textClass: 'text-wolf-c2',
    glow: 'rgba(74,154,26,0.4)', icon: '🐺', label: 'W5 · Lobisomem', name: 'Lobisomem: O Apocalipse' 
  }
  if (s === 'mage') return { 
    bgClass: 'bg-[#03000d]', c1: '#2a0070', c2: '#7a40e0', 
    c1Class: 'bg-mage-c1', borderClass: 'border-mage-c1', textClass: 'text-mage-c2',
    glow: 'rgba(122,64,224,0.4)', icon: '🔮', label: 'M20 · Mago', name: 'Mago: A Ascensão' 
  }
  if (s === 'hunter') return { 
    bgClass: 'bg-[#0a0600]', c1: '#5a3000', c2: '#d4820a', 
    c1Class: 'bg-hunt-c1', borderClass: 'border-hunt-c1', textClass: 'text-hunt-c2',
    glow: 'rgba(212,130,10,0.4)', icon: '🔫', label: 'H5 · Caçador', name: 'Caçador: A Revanche' 
  }
  return { 
    bgClass: 'bg-[#06000a]', c1: '#7a6228', c2: '#c9a84c', 
    c1Class: 'bg-gold-dim', borderClass: 'border-gold-dim', textClass: 'text-gold',
    glow: 'rgba(201,168,76,0.4)', icon: '⚜', label: 'LiraRPG', name: 'Mundo das Trevas' 
  }
})

onMounted(async () => {
  const token = sessionStorage.getItem('lira_token')
  if (!token) {
    router.push('/login')
    return
  }
  
  try {
    const response = await axios.get(`https://api.liragames.com.br/api/characters/${characterId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    character.value = response.data
  } catch (err: any) {
    console.error(err)
    errorMsg.value = 'Erro ao buscar dados do personagem.'
  } finally {
    loading.value = false
  }
})

const goBack = () => {
  router.push(`/characters/${systemParam}`)
}

// Helpers para extrair dados brutos da API
const factionName = computed(() => {
  if (!character.value) return 'Desconhecido';
  const c = character.value;
  if (c.gameStyle === 'VAMPIRE') return c.vampireCla?.name || 'Sem Clã';
  if (c.gameStyle === 'WEREWOLF') return c.werewolfTribe?.name || 'Sem Tribo';
  if (c.gameStyle === 'MAGE') return c.mageTradition?.name || 'Sem Tradição';
  if (c.gameStyle === 'HUNTER') return c.hunterCreed?.name || 'Sem Credo';
  return 'Desconhecido';
});

const energyName = computed(() => {
  const s = systemParam.toLowerCase();
  if (s === 'vampire') return 'Sangue';
  if (s === 'werewolf') return 'Fúria';
  if (s === 'mage') return 'Quintessência';
  if (s === 'hunter') return 'Convicção';
  return 'Energia';
});

const primaryStatusName = computed(() => {
  const s = systemParam.toLowerCase();
  if (s === 'vampire') return 'Humanidade';
  if (s === 'werewolf') return 'Gnose';
  if (s === 'mage') return 'Arete';
  if (s === 'hunter') return ''; 
  return 'Status';
});

const getAttributes = (typeFilter: string) => {
  if (!character.value?.attributes) return []
  return character.value.attributes
    .filter((a: any) => {
      const type = a.attributeDefinition?.type?.toLowerCase() || '';
      const desc = a.attributeDefinition?.description?.toLowerCase() || '';
      // Retira acentos para busca mais flexível
      const normalize = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      
      const filter = normalize(typeFilter);
      return normalize(type).includes(filter) || normalize(desc).includes(filter);
    })
    .map((a: any) => ({
      name: a.attributeDefinition?.name || '?',
      value: a.value || 0
    }))
}

const getStatus = (statusName: string, defaultVal: number) => {
  if (!character.value?.statuses) return defaultVal;
  const status = character.value.statuses.find((s: any) => s.statusDefinition?.name === statusName);
  return status ? status.value : defaultVal;
}

const getPowers = () => {
  if (!character.value?.powers) return [];
  return character.value.powers.map((p: any) => ({
    name: p.powerDefinition?.name || '?',
    level: p.level || 0,
    type: p.powerDefinition?.type
  }))
}

const getSkills = (typeFilter?: string) => {
  if (!character.value?.skills) return [];
  let skills = character.value.skills;
  if (typeFilter) {
    skills = skills.filter((s: any) => {
      const type = s.skillDefinition?.type?.toLowerCase() || '';
      return type.includes(typeFilter.toLowerCase());
    });
  }
  return skills.map((s: any) => ({
    name: s.skillDefinition?.name || '?',
    value: s.value || 0
  }))
}
</script>

<template>
  <main :class="['min-h-screen font-sans overflow-x-hidden text-parchment pb-20 relative bg-[#06000a]']">
    
    <!-- Background Radial Gradient (Prototype style) -->
    <div class="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_20%_10%,rgba(139,0,0,0.08)_0%,transparent_60%),radial-gradient(ellipse_at_80%_90%,rgba(42,26,92,0.1)_0%,transparent_60%)]"></div>

    <!-- HEADER (Prototype style) -->
    <header class="relative z-50 bg-gradient-to-b from-[#06000a] to-[#0d0010]/90 backdrop-blur-md border-b border-gold-dim/30 sticky top-0">
      <div class="max-w-[1300px] mx-auto flex items-center justify-between px-8 py-3">
        <div class="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
          <span class="text-[28px] text-gold drop-shadow-[0_0_12px_var(--color-gold-dim)] leading-none">⚜</span>
          <div class="flex flex-col">
            <span class="font-deco text-base text-gold tracking-[2px] leading-[1.1]">Camarilla</span>
            <span class="font-serif text-[11px] text-parchment-dim tracking-[3px] uppercase">de Curitiba</span>
          </div>
        </div>
        <nav class="hidden md:flex items-center gap-3 font-serif text-[12px] tracking-[2px] text-parchment-dim uppercase">
          <span class="hover:text-gold cursor-pointer transition-colors">⚜ Mundo das Trevas</span>
          <span class="text-gold-dim">|</span>
          <span class="hover:text-gold cursor-pointer transition-colors">🗺️ Mapa da Cidade</span>
          <span class="text-gold-dim">|</span>
          <span :class="theme.textClass">{{ theme.name }}</span>
          <span class="text-gold-dim">|</span>
          <span>LiraRPG</span>
        </nav>
      </div>
      <div class="h-px w-full bg-gradient-to-r from-transparent via-gold to-transparent opacity-50"></div>
    </header>

    <!-- LOADING / ERROR -->
    <div v-if="loading" class="relative z-10 flex flex-col items-center justify-center py-32 space-y-4">
      <div class="w-12 h-12 border-4 border-t-gold border-r-gold border-b-white/10 border-l-white/10 rounded-full animate-spin"></div>
      <p class="font-serif text-[10px] tracking-[3px] uppercase text-gold-dim">Acessando Arquivos...</p>
    </div>
    <div v-else-if="errorMsg" class="relative z-10 max-w-[1200px] mx-auto mt-10 bg-red-900/30 border border-red-500/50 p-6 rounded-xl text-center backdrop-blur-sm">
      <p class="font-serif text-red-400 tracking-widest uppercase text-sm">{{ errorMsg }}</p>
    </div>

    <!-- MAIN DETAIL VIEW -->
    <div v-else-if="character" class="relative z-10 max-w-[1200px] mx-auto mt-8 px-8 pb-20">
      
      <!-- Back Button -->
      <button @click="goBack" class="inline-flex items-center gap-2.5 bg-transparent border border-gold-dim/35 text-gold font-serif text-[13px] tracking-[2px] uppercase px-5 py-2.5 rounded-full hover:bg-gold/10 hover:border-gold hover:shadow-[0_0_16px_rgba(201,168,76,0.2)] transition-all group mb-8">
        <span class="transform group-hover:-translate-x-1 transition-transform">←</span> Voltar à Galeria
      </button>

      <!-- DETAIL GRID -->
      <div class="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-10 items-start">
        
        <!-- ==================== LEFT COLUMN ==================== -->
        <div class="sticky top-[90px] flex flex-col gap-5">
          
          <!-- Portrait -->
          <div class="relative rounded-2xl overflow-hidden border border-gold-dim/35 shadow-[0_8px_40px_rgba(0,0,0,0.8)]" :style="{ boxShadow: `0 8px 40px rgba(0,0,0,0.8), 0 0 30px ${theme.glow}` }">
            <img :src="character.avatarUrl || '/images/adventure.png'" alt="Retrato" class="w-full aspect-square object-cover saturate-90 contrast-[1.05]" />
            <div class="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-[#06000a]/95 to-transparent pointer-events-none"></div>
            
            <div class="absolute bottom-0 left-0 right-0 p-5 z-10" v-if="primaryStatusName">
              <div class="flex flex-col gap-1">
                <span class="font-serif text-[10px] tracking-[2px] text-parchment-dim uppercase">{{ primaryStatusName }}</span>
                <div class="flex gap-1.5 mb-2">
                  <div v-for="i in 10" :key="i" :class="['w-2.5 h-2.5 rounded-full border', i <= getStatus(primaryStatusName, 0) ? theme.c1Class + ' ' + theme.borderClass : 'border-white/20 bg-transparent']" :style="{ boxShadow: i <= getStatus(primaryStatusName, 0) ? `0 0 6px ${theme.glow}` : 'none' }"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Stats Row -->
          <div :class="['grid gap-2', primaryStatusName ? 'grid-cols-3' : 'grid-cols-2']">
            <div class="bg-gold/5 border border-gold-dim/15 rounded-lg p-2.5 text-center">
              <span class="block font-serif text-[9px] tracking-[1px] text-text-dim uppercase mb-1">F. Vontade</span>
              <span class="font-deco text-[1.3rem] text-gold drop-shadow-[0_0_10px_rgba(201,168,76,0.3)]">{{ getStatus('Força de Vontade', character.willpower || 1) }}</span>
            </div>
            <div class="bg-gold/5 border border-gold-dim/15 rounded-lg p-2.5 text-center" v-if="primaryStatusName">
              <span class="block font-serif text-[9px] tracking-[1px] text-text-dim uppercase mb-1">{{ primaryStatusName.substring(0, 10) }}</span>
              <span class="font-deco text-[1.3rem] text-gold drop-shadow-[0_0_10px_rgba(201,168,76,0.3)]">{{ getStatus(primaryStatusName, 0) }}</span>
            </div>
            <div class="bg-gold/5 border border-gold-dim/15 rounded-lg p-2.5 text-center">
              <span class="block font-serif text-[9px] tracking-[1px] text-text-dim uppercase mb-1">{{ energyName }}</span>
              <span class="font-deco text-[1.3rem] text-gold drop-shadow-[0_0_10px_rgba(201,168,76,0.3)]">{{ character.energy || 0 }}</span>
            </div>
          </div>

          <!-- Clan Badge & Concepts -->
          <div class="flex flex-col gap-2.5">
            <div :class="['inline-flex items-center justify-center gap-2 font-serif text-[10px] tracking-[1.5px] uppercase px-3 py-1.5 rounded-full border', theme.borderClass, theme.textClass]">
              <span>{{ theme.icon }}</span> {{ factionName }}
            </div>
            <div class="flex flex-wrap gap-2">
              <span v-if="character.vampireCla?.sectAlignment" class="font-serif text-[10px] tracking-[1.5px] uppercase px-3 py-1 rounded-full border border-gold-dim/30 text-parchment-dim bg-gold/5">Seita: {{ character.vampireCla.sectAlignment }}</span>
              <span v-if="character.nature" class="font-serif text-[10px] tracking-[1.5px] uppercase px-3 py-1 rounded-full border border-gold-dim/30 text-parchment-dim bg-gold/5">Nat: {{ character.nature }}</span>
              <span v-if="character.demeanor" class="font-serif text-[10px] tracking-[1.5px] uppercase px-3 py-1 rounded-full border border-gold-dim/30 text-parchment-dim bg-gold/5">Comp: {{ character.demeanor }}</span>
            </div>
          </div>

          <!-- Fraqueza (Weakness) -->
          <div v-if="character.vampireCla?.weaknessName" class="mt-2 bg-red-900/10 border border-red-900/30 rounded-lg p-3">
            <h4 class="font-serif text-[10px] tracking-[1px] uppercase text-red-500 mb-1 flex items-center gap-2">
              <span>🩸</span> Fraqueza: {{ character.vampireCla.weaknessName }}
            </h4>
            <p class="font-sans italic text-[0.8rem] text-red-300/70 leading-relaxed">
              {{ character.vampireCla.weaknessDescription }}
            </p>
          </div>

          <!-- Antecedentes Box -->
          <div class="mt-2">
            <h4 class="font-serif text-xs tracking-[3px] uppercase text-gold-dim flex items-center gap-3 mb-3">
              <span>Antecedentes</span>
              <span class="flex-1 h-px bg-gradient-to-r from-gold-dim to-transparent"></span>
            </h4>
            <div class="grid grid-cols-2 gap-2.5">
              <div class="bg-gold/5 border border-gold-dim/15 rounded-lg p-3 text-center">
                <span class="block font-serif text-[10px] tracking-[1px] text-text-dim uppercase mb-1.5">Recursos</span>
                <div class="flex justify-center gap-1 mb-1">
                  <div v-for="i in 5" :key="i" :class="['w-2 h-2 rounded-full border', i <= 4 ? 'bg-gold-dim border-gold-dim' : 'border-gold-dim/30 bg-transparent']"></div>
                </div>
              </div>
              <div class="bg-gold/5 border border-gold-dim/15 rounded-lg p-3 text-center">
                <span class="block font-serif text-[10px] tracking-[1px] text-text-dim uppercase mb-1.5">Lacaios</span>
                <div class="flex justify-center gap-1 mb-1">
                  <div v-for="i in 5" :key="i" :class="['w-2 h-2 rounded-full border', i <= 2 ? 'bg-gold-dim border-gold-dim' : 'border-gold-dim/30 bg-transparent']"></div>
                </div>
                <span class="block font-sans italic text-[0.75rem] text-text-dim">Segurança</span>
              </div>
              <div class="bg-gold/5 border border-gold-dim/15 rounded-lg p-3 text-center">
                <span class="block font-serif text-[10px] tracking-[1px] text-text-dim uppercase mb-1.5">Influência</span>
                <div class="flex justify-center gap-1 mb-1">
                  <div v-for="i in 5" :key="i" :class="['w-2 h-2 rounded-full border', i <= 3 ? 'bg-gold-dim border-gold-dim' : 'border-gold-dim/30 bg-transparent']"></div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- ==================== RIGHT COLUMN ==================== -->
        <div class="flex flex-col pt-2">
          
          <!-- Header Block (Name & Clan Desc) -->
          <div :class="['border-l-[3px] pl-5 mb-8', theme.borderClass]">
            <div class="flex justify-between items-start mb-3">
              <div :class="['inline-flex items-center gap-2 font-serif text-[11px] tracking-[2px] uppercase px-3.5 py-1 rounded-full border', theme.borderClass, theme.textClass]">
                <span>{{ theme.icon }}</span> {{ factionName }}
              </div>
            </div>
            <h1 class="font-deco text-4xl md:text-[2.8rem] text-gold leading-[1.1] mb-2 drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] uppercase">
              {{ character.name }}
            </h1>
            <p class="font-sans italic text-[0.95rem] text-parchment-dim mb-3">
              {{ character.concept || 'Desconhecido' }}
            </p>
          </div>

          <!-- TABS NAV -->
          <div class="flex gap-0 border-b border-gold-dim/30 overflow-x-auto hide-scrollbar mb-8">
            <button @click="activeTab = 'stats'" :class="['font-serif text-[11px] tracking-[2px] uppercase px-5 py-3 border-b-2 transition-all -mb-px', activeTab === 'stats' ? 'text-gold border-gold drop-shadow-[0_0_10px_rgba(201,168,76,0.3)]' : 'border-transparent text-text-dim hover:text-parchment']">
              Atributos
            </button>
            <button @click="activeTab = 'skills'" :class="['font-serif text-[11px] tracking-[2px] uppercase px-5 py-3 border-b-2 transition-all -mb-px', activeTab === 'skills' ? 'text-gold border-gold drop-shadow-[0_0_10px_rgba(201,168,76,0.3)]' : 'border-transparent text-text-dim hover:text-parchment']">
              Habilidades
            </button>
            <button @click="activeTab = 'disciplines'" :class="['font-serif text-[11px] tracking-[2px] uppercase px-5 py-3 border-b-2 transition-all -mb-px', activeTab === 'disciplines' ? 'text-gold border-gold drop-shadow-[0_0_10px_rgba(201,168,76,0.3)]' : 'border-transparent text-text-dim hover:text-parchment']">
              Disciplinas
            </button>
            <button @click="activeTab = 'lore'" :class="['font-serif text-[11px] tracking-[2px] uppercase px-5 py-3 border-b-2 transition-all -mb-px', activeTab === 'lore' ? 'text-gold border-gold drop-shadow-[0_0_10px_rgba(201,168,76,0.3)]' : 'border-transparent text-text-dim hover:text-parchment']">
              Histórico
            </button>
            <button @click="activeTab = 'raw'" :class="['ml-auto font-serif text-[10px] tracking-[2px] uppercase px-5 py-3 border-b-2 transition-all -mb-px', activeTab === 'raw' ? 'text-green-400 border-green-500' : 'border-transparent text-text-dim hover:text-parchment']">
              [ RAW DATA ]
            </button>
          </div>

          <!-- TAB CONTENT: ATRIBUTOS -->
          <div v-show="activeTab === 'stats'" class="animate-fade-in space-y-8">
            
            <!-- Físicos -->
            <div>
              <h3 class="font-serif text-[10px] tracking-[2px] uppercase text-parchment-dim mb-3">Físicos</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6">
                <div v-for="attr in getAttributes('Físico')" :key="attr.name" class="flex items-center justify-between">
                  <span class="font-serif text-[12px] tracking-[1px] text-parchment capitalize min-w-[90px]">{{ attr.name }}</span>
                  <div class="flex gap-1.5">
                    <div v-for="i in 5" :key="i" :class="['w-3 h-3 rounded-full border', i <= attr.value ? 'bg-gold border-gold shadow-[0_0_6px_rgba(201,168,76,0.5)]' : 'border-gold-dim/30 bg-transparent']"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sociais -->
            <div>
              <h3 class="font-serif text-[10px] tracking-[2px] uppercase text-parchment-dim mb-3">Sociais</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6">
                <div v-for="attr in getAttributes('Social')" :key="attr.name" class="flex items-center justify-between">
                  <span class="font-serif text-[12px] tracking-[1px] text-parchment capitalize min-w-[90px]">{{ attr.name }}</span>
                  <div class="flex gap-1.5">
                    <div v-for="i in 5" :key="i" :class="['w-3 h-3 rounded-full border', i <= attr.value ? 'bg-gold border-gold shadow-[0_0_6px_rgba(201,168,76,0.5)]' : 'border-gold-dim/30 bg-transparent']"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Mentais -->
            <div>
              <h3 class="font-serif text-[10px] tracking-[2px] uppercase text-parchment-dim mb-3">Mentais</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6">
                <div v-for="attr in getAttributes('Mental')" :key="attr.name" class="flex items-center justify-between">
                  <span class="font-serif text-[12px] tracking-[1px] text-parchment capitalize min-w-[90px]">{{ attr.name }}</span>
                  <div class="flex gap-1.5">
                    <div v-for="i in 5" :key="i" :class="['w-3 h-3 rounded-full border', i <= attr.value ? 'bg-gold border-gold shadow-[0_0_6px_rgba(201,168,76,0.5)]' : 'border-gold-dim/30 bg-transparent']"></div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- TAB CONTENT: SKILLS -->
          <div v-show="activeTab === 'skills'" class="animate-fade-in space-y-8">
            <div v-for="cat in ['TALENTOS', 'PERICIAS', 'CONHECIMENTOS', 'NIVEL_1', 'NIVEL_2', 'NIVEL_3']" :key="cat">
              <div v-if="getSkills(cat).length > 0">
                <h3 class="font-serif text-[10px] tracking-[2px] uppercase text-parchment-dim mb-3">{{ cat.replace('_', ' ') }}</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  <div v-for="skill in getSkills(cat)" :key="skill.name" class="flex items-center justify-between p-2 px-3 bg-gold/[0.03] border border-gold-dim/30 rounded">
                    <span class="font-serif text-[11px] tracking-[0.5px] text-parchment capitalize line-clamp-1 mr-2">{{ skill.name }}</span>
                    <div class="flex gap-1 shrink-0">
                      <div v-for="i in 5" :key="i" :class="['w-2 h-2 rounded-full border', i <= skill.value ? 'bg-gold-dim border-gold-dim' : 'border-gold-dim/30 bg-transparent']"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- VIRTUDES (Extraídas temporariamente de Status) -->
            <div v-if="character.statuses && character.statuses.some((s: any) => ['Consciência', 'Autocontrole', 'Coragem'].includes(s.statusDefinition?.name))">
              <h3 class="font-serif text-[10px] tracking-[2px] uppercase text-parchment-dim mb-3 mt-8">Virtudes</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div v-for="virtue in ['Consciência', 'Autocontrole', 'Coragem']" :key="virtue">
                  <div v-if="getStatus(virtue, -1) !== -1" class="flex flex-col items-center justify-center p-3 bg-gold/[0.03] border border-gold-dim/30 rounded">
                    <span class="font-serif text-[11px] tracking-[1px] text-gold capitalize mb-2">{{ virtue }}</span>
                    <div class="flex gap-1">
                      <div v-for="i in 5" :key="i" :class="['w-2.5 h-2.5 rounded-full border', i <= getStatus(virtue, 0) ? 'bg-gold border-gold' : 'border-gold-dim/30 bg-transparent']"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- TAB CONTENT: DISCIPLINES -->
          <div v-show="activeTab === 'disciplines'" class="animate-fade-in space-y-4">
            <h3 class="font-serif text-xs tracking-[3px] uppercase text-gold-dim flex items-center gap-3 mb-4">
              <span>Poderes Sobrenaturais</span>
              <span class="flex-1 h-px bg-gradient-to-r from-gold-dim to-transparent"></span>
            </h3>
            
            <div v-for="power in getPowers()" :key="power.name" :class="['flex items-center gap-4 p-3.5 rounded bg-gold/5 border border-gold-dim/30 transition-all hover:bg-gold/10 hover:border-gold-dim', theme.hoverBorder]">
              <span class="font-serif text-[13px] tracking-[1px] text-parchment uppercase flex-1">{{ power.name }}</span>
              <div class="flex gap-1.5 shrink-0">
                <div v-for="i in 5" :key="i" :class="['w-3.5 h-3.5 rounded-full border transition-all', i <= power.level ? theme.c1Class + ' ' + theme.borderClass : 'border-gold-dim/50 bg-transparent']" :style="{ boxShadow: i <= power.level ? `0 0 8px ${theme.glow}` : 'none' }"></div>
              </div>
            </div>
            <div v-if="getPowers().length === 0" class="text-text-dim text-sm italic">Nenhum poder registrado.</div>
          </div>

          <!-- TAB CONTENT: LORE -->
          <div v-show="activeTab === 'lore'" class="animate-fade-in space-y-6">
            
            <div class="bg-gold/[0.03] border border-gold-dim/30 rounded-xl p-6 text-[0.95rem] text-parchment leading-[1.8]" v-if="character.history">
              <h3 class="font-serif text-[10px] tracking-[2px] uppercase text-gold-dim mb-4">História</h3>
              <p class="whitespace-pre-wrap">{{ character.history }}</p>
            </div>

            <!-- QUALIDADES E DEFEITOS -->
            <div v-if="character.meritFlaws && character.meritFlaws.length > 0" class="mt-8">
              <h3 class="font-serif text-xs tracking-[3px] uppercase text-gold-dim flex items-center gap-3 mb-4">
                <span>Qualidades & Defeitos</span>
                <span class="flex-1 h-px bg-gradient-to-r from-gold-dim to-transparent"></span>
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div v-for="mf in character.meritFlaws" :key="mf.id" class="p-3 border border-gold-dim/20 rounded-lg bg-gold/5 flex flex-col">
                  <span class="font-serif text-[12px] tracking-[1px] text-parchment uppercase">{{ mf.meritFlawDefinition?.name || '?' }}</span>
                  <span class="text-[10px] font-sans italic text-text-dim mt-1">{{ mf.meritFlawDefinition?.type || 'QUALIDADE' }} • {{ mf.meritFlawDefinition?.points || 1 }} pt(s)</span>
                </div>
              </div>
            </div>

            <div v-if="character.roleplayHints">
              <h3 class="font-serif text-xs tracking-[3px] uppercase text-gold-dim flex items-center gap-3 mt-8 mb-4">
                <span>Dicas de Interpretação</span>
                <span class="flex-1 h-px bg-gradient-to-r from-gold-dim to-transparent"></span>
              </h3>
              
              <div class="bg-vamp-c1/5 border border-vamp-c1/20 rounded-xl p-5 mb-5">
                <span class="block font-serif text-[10px] tracking-[2px] uppercase text-vamp-c2 mb-2.5">🎭 Como Interpretar</span>
                <p class="font-sans italic text-[0.9rem] text-parchment-dim leading-[1.7] whitespace-pre-wrap">{{ character.roleplayHints }}</p>
              </div>
            </div>

            <div v-if="!character.history && !character.roleplayHints && (!character.meritFlaws || character.meritFlaws.length === 0)" class="text-text-dim text-sm italic">
              Nenhum dado registrado.
            </div>
          </div>

          <!-- TAB CONTENT: RAW -->
          <div v-show="activeTab === 'raw'" class="animate-fade-in">
            <div class="bg-[#04000a] border border-[#222] p-6 rounded shadow-xl overflow-x-auto relative">
              <div class="absolute top-0 right-0 bg-green-900/50 text-green-400 font-mono text-[10px] px-2 py-1 border-b border-l border-green-800">SYSTEM.DUMP</div>
              <pre class="text-green-500 text-[11px] font-mono leading-relaxed whitespace-pre-wrap mt-4">{{ JSON.stringify(character, null, 2) }}</pre>
            </div>
          </div>

        </div>
      </div>

    </div>
  </main>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
