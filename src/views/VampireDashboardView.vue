<template>
  <div class="min-h-screen demiplane-bg text-parchment font-sans relative overflow-x-hidden selection:bg-blood-red selection:text-white pb-20">
    <!-- SUBTLE NOISE/TEXTURE (opcional) -->
    <div class="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay z-0" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>

    <!-- DEMIPLANE STYLE HEADER -->
    <header class="relative z-20 border-b border-vamp-border bg-vamp-bg/90 backdrop-blur-md sticky top-0">
      <div class="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div class="flex items-center gap-4 cursor-pointer" @click="router.push('/dashboard')">
          <div class="font-serif font-bold text-xl tracking-widest flex items-center gap-2">
            <span class="text-white">LIRA</span><span class="text-vamp-c2">RPG</span>
          </div>
        </div>

        <div class="flex items-center gap-6 text-xs font-sans tracking-wide uppercase">
          <router-link to="/dashboard" class="text-gray-400 hover:text-white transition-colors">Jogos</router-link>
          <span class="text-white font-bold border-b-2 border-vamp-c2 pb-1">Personagens</span>
          <button @click="handleLogout" class="text-gray-400 hover:text-white transition-colors ml-4">Sair</button>
        </div>
      </div>
    </header>

    <!-- MAIN CONTENT -->
    <main class="relative z-10">
      
      <!-- GALLERY HERO -->
      <section class="text-center pt-16 pb-10 px-6 relative z-10">
        <h1 class="font-serif font-bold text-4xl md:text-5xl lg:text-6xl text-gold mb-4 tracking-[4px] drop-shadow-[0_0_30px_rgba(201,168,76,0.4)]" style="font-family: 'Cinzel Decorative', serif;">
          OS FILHOS DA NOITE
        </h1>
        <p class="font-sans italic text-base md:text-lg text-parchment-dim max-w-2xl mx-auto leading-relaxed mb-8">
          Treze almas condenadas habitam as sombras de Curitiba. Escolha um, se ousar conhecê-lo.
        </p>
        <div class="flex items-center justify-center gap-4">
          <div class="w-20 h-px bg-gradient-to-r from-transparent to-gold-dim"></div>
          <span class="text-blood-bright drop-shadow-[0_0_6px_rgba(192,57,43,0.8)]">🩸</span>
          <div class="w-20 h-px bg-gradient-to-l from-transparent to-gold-dim"></div>
        </div>
      </section>

      <!-- FILTER BAR -->
      <section class="flex flex-wrap items-center justify-center gap-3 px-6 pb-10 relative z-10">
        <button 
          @click="activeFilter = ''" 
          class="bg-transparent border border-border-dark text-parchment-dim font-serif text-xs tracking-widest uppercase px-5 py-2 rounded-full hover:border-gold-dim hover:text-gold hover:bg-gold/5 transition-all duration-300"
          :class="activeFilter === '' ? 'bg-gold/10 border-gold text-gold-bright shadow-[0_0_12px_rgba(201,168,76,0.2)]' : ''"
        >
          Todos
        </button>
        <button 
          v-for="clan in availableClans" :key="clan"
          @click="activeFilter = clan"
          class="bg-transparent border border-border-dark text-parchment-dim font-serif text-xs tracking-widest uppercase px-5 py-2 rounded-full hover:border-gold-dim hover:text-gold hover:bg-gold/5 transition-all duration-300 flex items-center gap-2"
          :class="activeFilter === clan ? 'bg-gold/10 border-gold text-gold-bright shadow-[0_0_12px_rgba(201,168,76,0.2)]' : ''"
        >
          <span>👑</span> {{ clan }}
        </button>
        
        <!-- Botão Novo -->
        <button 
          @click="router.push('/jogador/vampire/novo')" 
          class="ml-4 bg-blood/20 border border-blood text-blood-bright font-serif text-xs tracking-widest uppercase px-5 py-2 rounded-full hover:bg-blood hover:text-white hover:shadow-[0_0_15px_rgba(139,0,0,0.4)] transition-all duration-300 transform hover:-translate-y-0.5"
        >
          + Criar Novo
        </button>
      </section>

      <!-- CARDS GRID -->
      <section class="max-w-7xl mx-auto px-8 pb-20 relative z-10">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
          <CharacterCard 
            v-for="char in filteredCharacters" 
            :key="char.id" 
            :character="char"
            @click="viewSheet(char.id)"
          />
        </div>

        <!-- Empty State -->
        <div v-if="filteredCharacters.length === 0" class="py-16 text-center text-parchment-dim font-serif italic border border-dashed border-border-dark rounded-xl bg-black/20 mt-8">
          Nenhum filho da noite encontrado. As ruas estão vazias.
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import CharacterCard from '../components/CharacterCard.vue'

const router = useRouter()
const characters = ref<any[]>([])
const activeFilter = ref('')

const fetchCharacters = async () => {
  try {
    const res = await api.get('/api/character-vampires/my-characters')
    characters.value = res.data
  } catch (err) {
    console.error('Erro ao buscar personagens:', err)
  }
}

const availableClans = computed(() => {
  const clans = new Set<string>()
  characters.value.forEach(c => {
    if (c.DefinitionClan?.name) clans.add(c.DefinitionClan.name)
  })
  return Array.from(clans)
})

const filteredCharacters = computed(() => {
  if (!activeFilter.value) return characters.value
  return characters.value.filter(c => c.DefinitionClan?.name === activeFilter.value)
})

const viewSheet = (characterId: string) => {
  localStorage.setItem('lira_active_character_id', characterId)
  router.push(`/personagem/ficha?id=${characterId}`)
}

const handleLogout = () => {
  sessionStorage.clear()
  localStorage.clear()
  router.push('/login')
}

onMounted(() => {
  fetchCharacters()
})
</script>
