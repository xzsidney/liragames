<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const systemParam = route.params.system as string

const theme = computed(() => {
  const s = systemParam.toLowerCase()
  if (s === 'vampire') return { 
    bg: '#1a0005', bgClass: 'bg-[#0f0003]', c1: '#8b0000', c2: '#c0392b', c1Class: 'bg-vamp-c1', borderClass: 'border-vamp-c1', textClass: 'text-vamp-c2', hoverBorder: 'hover:border-vamp-c2/40', hoverShadow: 'hover:shadow-[0_16px_40px_rgba(0,0,0,0.8),0_0_24px_rgba(192,57,43,0.3)]',
    glow: 'rgba(192,57,43,0.5)', icon: '🩸', label: 'V5 · Vampiro', name: 'Vampiro: A Máscara', title: 'Os Filhos da Noite', subtitle: 'Escolha um, se ousar conhecê-lo.' 
  }
  if (s === 'werewolf') return { 
    bg: '#030d00', bgClass: 'bg-[#020a00]', c1: '#1a4a00', c2: '#4a9a1a', c1Class: 'bg-wolf-c1', borderClass: 'border-wolf-c1', textClass: 'text-wolf-c2', hoverBorder: 'hover:border-wolf-c2/40', hoverShadow: 'hover:shadow-[0_16px_40px_rgba(0,0,0,0.8),0_0_24px_rgba(74,154,26,0.3)]',
    glow: 'rgba(74,154,26,0.5)', icon: '🐺', label: 'W5 · Lobisomem', name: 'Lobisomem: O Apocalipse', title: 'A Nação Garou', subtitle: 'Guerreiros de Gaia lutando contra a Devastadora.' 
  }
  if (s === 'mage') return { 
    bg: '#04001a', bgClass: 'bg-[#02000d]', c1: '#2a0070', c2: '#7a40e0', c1Class: 'bg-mage-c1', borderClass: 'border-mage-c1', textClass: 'text-mage-c2', hoverBorder: 'hover:border-mage-c2/40', hoverShadow: 'hover:shadow-[0_16px_40px_rgba(0,0,0,0.8),0_0_24px_rgba(122,64,224,0.3)]',
    glow: 'rgba(122,64,224,0.5)', icon: '🔮', label: 'M20 · Mago', name: 'Mago: A Ascensão', title: 'Os Despertos', subtitle: 'Aqueles que dobram a realidade com a Força de Vontade.' 
  }
  if (s === 'hunter') return { 
    bg: '#0d0800', bgClass: 'bg-[#080500]', c1: '#5a3000', c2: '#d4820a', c1Class: 'bg-hunt-c1', borderClass: 'border-hunt-c1', textClass: 'text-hunt-c2', hoverBorder: 'hover:border-hunt-c2/40', hoverShadow: 'hover:shadow-[0_16px_40px_rgba(0,0,0,0.8),0_0_24px_rgba(212,130,10,0.3)]',
    glow: 'rgba(212,130,10,0.5)', icon: '🔫', label: 'H5 · Caçador', name: 'Caçador: A Revanche', title: 'Os Imbuídos', subtitle: 'A última linha de defesa da Humanidade.' 
  }
  return { 
    bg: '#04000a', bgClass: 'bg-bg-deep', c1: '#7a6228', c2: '#c9a84c', c1Class: 'bg-gold-dim', borderClass: 'border-gold-dim', textClass: 'text-gold', hoverBorder: 'hover:border-gold/40', hoverShadow: 'hover:shadow-[0_16px_40px_rgba(0,0,0,0.8),0_0_24px_rgba(201,168,76,0.3)]',
    glow: 'rgba(201,168,76,0.5)', icon: '⚜', label: 'LiraRPG', name: 'Mundo das Trevas', title: 'Arquivos do Sistema', subtitle: 'Selecione um personagem para visualizar.' 
  }
})

const characters = ref<any[]>([])
const loading = ref(true)

onMounted(async () => {
  const token = sessionStorage.getItem('lira_token')
  if (!token) {
    router.push('/login')
    return
  }
  
  try {
    const response = await axios.get(`https://api.liragames.com.br/api/characters?gameStyle=${systemParam.toUpperCase()}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    // Filtrar apenas se houver lógica de sistema, no momento pegamos todos ou testamos pelo tipo
    characters.value = response.data
  } catch (err: any) {
    console.error(err)
    if (err.response && err.response.status === 401) {
      sessionStorage.removeItem('lira_token')
      router.push('/login')
    }
  } finally {
    loading.value = false
  }
})

const viewCharacterDetails = (id: string) => {
  router.push(`/character/${systemParam.toLowerCase()}/${id}`)
}

const createNewCharacter = () => {
  router.push(`/character/${systemParam.toLowerCase()}/create`)
}

const goBack = () => {
  router.push('/dashboard')
}
</script>

<template>
  <main :class="['min-h-screen font-sans overflow-x-hidden text-text-main pb-20 relative', theme.bgClass]">
    
    <!-- Background Gradient -->
    <div class="fixed inset-0 pointer-events-none z-0" :style="{ background: `radial-gradient(ellipse at 50% 0%, ${theme.glow.replace('0.5', '0.15')} 0%, transparent 70%)` }"></div>

    <!-- Header / Navbar Mínima -->
    <header class="relative z-50 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0">
      <div class="flex items-center space-x-4">
        <button @click="goBack" class="group flex items-center justify-center w-10 h-10 rounded-full border border-white/10 hover:border-gold/50 bg-white/5 transition-all" title="Voltar ao Hub">
          <span class="text-gold font-sans transform group-hover:-translate-x-1 transition-transform">←</span>
        </button>
        <div class="flex flex-col">
          <span class="font-deco text-sm text-gold tracking-[2px] leading-tight">LiraRPG</span>
          <span :class="['font-serif text-[10px] tracking-[2px] uppercase', theme.textClass]">{{ theme.name }}</span>
        </div>
      </div>
    </header>

    <div class="relative z-10 max-w-[1300px] mx-auto px-6 md:px-12 pt-16">
      
      <!-- HERO -->
      <div class="text-center mb-16">
        <h1 class="font-deco text-4xl md:text-5xl text-gold mb-4 drop-shadow-[0_0_20px_rgba(201,168,76,0.3)]">{{ theme.title }}</h1>
        <p class="font-sans italic text-text-dim text-sm md:text-base max-w-xl mx-auto mb-8">{{ theme.subtitle }}</p>
        
        <div class="flex items-center justify-center gap-6">
          <span class="flex-1 max-w-[100px] h-px bg-gradient-to-r from-transparent to-gold-dim"></span>
          <span class="text-2xl">{{ theme.icon }}</span>
          <span class="flex-1 max-w-[100px] h-px bg-gradient-to-l from-transparent to-gold-dim"></span>
        </div>
      </div>
      
      <!-- LOADING STATE -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20 space-y-4">
        <div class="w-12 h-12 border-4 border-t-gold border-r-gold border-b-white/10 border-l-white/10 rounded-full animate-spin"></div>
        <p class="font-serif text-[10px] tracking-[3px] uppercase text-gold-dim">Acessando Arquivos...</p>
      </div>

      <!-- CHARACTER GRID -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        
        <!-- CREATE NEW CHARACTER CARD -->
        <div @click="createNewCharacter"
             :class="['group relative bg-black/40 border-2 border-dashed border-white/20 rounded-xl overflow-hidden cursor-pointer transition-all duration-400 min-h-[360px] flex flex-col items-center justify-center', theme.hoverBorder, theme.hoverShadow]">
          <div class="absolute inset-0 bg-white/0 group-hover:bg-white/[0.02] transition-colors duration-400 pointer-events-none"></div>
          
          <div :class="['w-16 h-16 rounded-full border border-white/20 flex items-center justify-center mb-4 transition-all duration-400 group-hover:scale-110 group-hover:bg-white/5', theme.textClass]">
            <span class="text-3xl font-light">+</span>
          </div>
          
          <h3 class="font-serif text-lg font-bold text-parchment drop-shadow-md uppercase text-center transition-colors group-hover:text-gold">
            Forjar Nova Lenda
          </h3>
          <p class="font-sans italic text-xs text-text-dim mt-2 text-center max-w-[200px]">
            Inicie os ritos de criação e desperte um novo personagem
          </p>
        </div>

        <div v-for="char in characters" :key="char.id" 
             @click="viewCharacterDetails(char.id)"
             :class="['group relative bg-black/60 border border-white/10 rounded-xl overflow-hidden cursor-pointer transition-all duration-400 min-h-[360px]', theme.hoverBorder, theme.hoverShadow]">
          
          <!-- Image Wrap (se houver avatarUrl usaria, senao fallback padrao) -->
          <div class="absolute inset-0 overflow-hidden bg-[#0a0a0a]">
            <!-- Fallback image based on prototype -->
            <img :src="char.avatarUrl || '/images/adventure.png'" class="w-full h-full object-cover saturate-[0.7] contrast-[1.1] transition-all duration-700 group-hover:scale-105 group-hover:saturate-100" />
          </div>
          
          <!-- Gradient Overlay (Bottom heavy) -->
          <div class="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none"></div>

          <!-- Decorative Corners -->
          <span :class="['absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 rounded-tl-sm opacity-30 transition-all duration-400 group-hover:opacity-100 group-hover:w-8 group-hover:h-8', theme.borderClass]"></span>
          <span :class="['absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 rounded-tr-sm opacity-30 transition-all duration-400 group-hover:opacity-100 group-hover:w-8 group-hover:h-8', theme.borderClass]"></span>
          <span :class="['absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 rounded-bl-sm opacity-30 transition-all duration-400 group-hover:opacity-100 group-hover:w-8 group-hover:h-8', theme.borderClass]"></span>
          <span :class="['absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 rounded-br-sm opacity-30 transition-all duration-400 group-hover:opacity-100 group-hover:w-8 group-hover:h-8', theme.borderClass]"></span>

          <!-- Content -->
          <div class="absolute inset-0 flex flex-col justify-end p-6 z-10">
            <!-- Clan / Tribe Badge -->
            <div v-if="char.clan" :class="['inline-flex items-center gap-2 font-serif text-[9px] tracking-[2px] uppercase px-2.5 py-1 rounded-full border mb-2 w-fit bg-black/50 backdrop-blur', theme.borderClass, theme.textClass]">
              {{ char.clan }}
            </div>
            
            <h3 class="font-serif text-lg font-bold text-parchment drop-shadow-md mb-1 line-clamp-1 group-hover:text-gold transition-colors">{{ char.name }}</h3>
            
            <p v-if="char.concept" class="font-sans italic text-xs text-parchment-dim line-clamp-1 mb-4">
              "{{ char.concept }}"
            </p>
            
            <div class="flex items-center justify-between border-t border-white/10 pt-4 mt-auto">
              <span class="font-serif text-[9px] tracking-[1px] uppercase text-text-dim">XP: {{ char.experienceTotal || 0 }}</span>
              <span :class="['font-serif text-[10px] tracking-[2px] uppercase opacity-0 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300', theme.textClass]">
                Acessar →
              </span>
            </div>
          </div>
          
        </div>

      </div>

    </div>
  </main>
</template>
