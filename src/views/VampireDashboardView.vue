<template>
  <div class="min-h-screen bg-[#050505] text-parchment font-sans relative overflow-x-hidden selection:bg-blood-red selection:text-white">
    <!-- NOISE OVERLAY -->
    <div class="fixed inset-0 pointer-events-none opacity-20 mix-blend-overlay z-0" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>
    
    <!-- SUBTLE GLOWS -->
    <div class="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-blood-red/10 blur-[150px] rounded-full pointer-events-none z-0"></div>

    <!-- HEADER / NAVBAR -->
    <nav class="relative z-20 border-b border-white/5 bg-black/60 backdrop-blur-md sticky top-0">
      <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3 cursor-pointer" @click="router.push('/dashboard')">
          <div class="w-8 h-8 rounded-full border border-gold-dim flex items-center justify-center bg-black shadow-[0_0_15px_rgba(212,175,55,0.15)]">
            <span class="text-gold font-serif text-lg">L</span>
          </div>
          <span class="font-serif text-sm tracking-widest text-parchment">CAMARILLA <span class="text-xs text-gold-dim">DE SÃO PAULO</span></span>
        </div>

        <div class="flex items-center gap-6 text-[11px] font-serif tracking-[2px] uppercase">
          <router-link to="/dashboard" class="text-gray-400 hover:text-white transition-colors">+ MUNDO DAS TREVAS</router-link>
          <span class="text-gray-600">|</span>
          <span class="text-blood-red font-semibold">VAMPIRO: A MÁSCARA</span>
          <span class="text-gray-600">|</span>
          <button @click="handleLogout" class="text-gray-400 hover:text-white transition-colors">SAIR</button>
        </div>
      </div>
    </nav>

    <!-- MAIN CONTENT -->
    <main class="relative z-10 max-w-7xl mx-auto px-6 py-12">
      <!-- HEADER TITLE -->
      <div class="text-center mb-10">
        <h1 class="font-serif text-4xl md:text-5xl text-gold-dim tracking-wide mb-3 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
          Os Filhos da Noite
        </h1>
        <p class="text-gray-400 text-sm italic font-serif tracking-wide max-w-xl mx-auto">
          Treze almas condenadas habitam as sombras de São Paulo. Escolha um, se ousar tocá-lo.
        </p>

        <!-- DROPDOWN / ICON DECORATION -->
        <div class="flex justify-center mt-4 text-blood-red opacity-80 animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
          </svg>
        </div>
      </div>

      <!-- FILTER TAGS / CLAN PILLS -->
      <div class="flex flex-wrap items-center justify-center gap-2 mb-12">
        <button 
          @click="selectedClan = 'Todos'"
          class="px-4 py-1.5 rounded-full text-xs font-serif tracking-wider border transition-all duration-300"
          :class="selectedClan === 'Todos' ? 'border-gold text-gold bg-gold/10 shadow-[0_0_10px_rgba(212,175,55,0.2)]' : 'border-white/10 text-gray-400 hover:border-white/30 hover:text-white'"
        >
          Todos
        </button>

        <button 
          v-for="clan in filterClans" 
          :key="clan"
          @click="selectedClan = clan"
          class="px-3 py-1.5 rounded-full text-xs font-serif tracking-wider border transition-all duration-300 flex items-center gap-1.5"
          :class="selectedClan === clan ? 'border-gold text-gold bg-gold/10 shadow-[0_0_10px_rgba(212,175,55,0.2)]' : 'border-white/10 text-gray-400 hover:border-white/30 hover:text-white'"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-blood-red"></span>
          {{ clan }}
        </button>
      </div>

      <!-- CARDS GRID -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
        <!-- CARD: NOVO MEMBRO (BOTÃO DE CRIAÇÃO) -->
        <div 
          @click="router.push('/jogador/vampire/novo')"
          class="group relative border border-dashed border-gold/40 hover:border-gold rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-500 bg-black/40 hover:bg-gold/5 min-h-[320px] shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.15)]"
        >
          <div class="w-16 h-16 rounded-full border border-gold/30 group-hover:border-gold flex items-center justify-center text-gold text-3xl font-light mb-6 group-hover:scale-110 transition-transform duration-300">
            +
          </div>
          <h3 class="font-serif text-lg text-gold font-medium mb-2 tracking-wide">
            Novo Membro
          </h3>
          <p class="text-xs text-gray-500 italic max-w-[200px] leading-relaxed">
            Sua linhagem aguarda uma nova adição às sombras de São Paulo.
          </p>
        </div>

        <!-- PERSONAGENS EXISTENTES DO USUÁRIO -->
        <div 
          v-for="char in filteredCharacters" 
          :key="char.id"
          @click="router.push(`/jogador/vampire/${char.id}`)"
          class="group relative border border-white/10 hover:border-blood-red/60 rounded-xl p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 bg-black/60 hover:bg-black/80 min-h-[320px] shadow-xl hover:shadow-[0_0_25px_rgba(139,0,0,0.3)]"
        >
          <div>
            <!-- BANNER/HEADER DO CARACTER -->
            <div class="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
              <span class="text-[10px] font-serif uppercase tracking-widest text-gold-dim">
                {{ char.DefinitionClan?.name || 'Sem Clã' }}
              </span>
              <span class="text-[10px] font-mono text-gray-500">
                Gen {{ char.generation }}ª
              </span>
            </div>

            <h3 class="font-serif text-xl text-parchment group-hover:text-gold transition-colors mb-2">
              {{ char.name }}
            </h3>
            <p class="text-xs text-gray-400 italic mb-4 line-clamp-2">
              {{ char.concept || 'Sem conceito informado' }}
            </p>
          </div>

          <div class="pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
            <span>Fome: <strong class="text-blood-red">{{ char.hunger }}</strong></span>
            <span>Humanidade: <strong class="text-gold-dim">{{ char.humanity }}</strong></span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const selectedClan = ref('Todos')
const characters = ref<any[]>([])

const filterClans = ['Ventrue', 'Gangrel', 'Toreador', 'Nosferatu', 'Brujah', 'Tremere', 'Malkaviano', 'Lasombra']

const fetchCharacters = async () => {
  try {
    const res = await api.get('/api/character-vampires/my-characters')
    characters.value = res.data
  } catch (err) {
    console.error('Erro ao buscar personagens:', err)
  }
}

const filteredCharacters = computed(() => {
  if (selectedClan.value === 'Todos') return characters.value
  return characters.value.filter(c => c.DefinitionClan?.name === selectedClan.value)
})

const handleLogout = () => {
  sessionStorage.clear()
  localStorage.clear()
  router.push('/login')
}

onMounted(() => {
  fetchCharacters()
})
</script>

<style scoped>
/* Transições suaves */
</style>
