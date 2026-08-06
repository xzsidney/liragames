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
          <router-link to="/dashboard" class="text-gray-400 hover:text-white transition-colors">Games</router-link>
          <span class="text-white font-bold border-b-2 border-vamp-c2 pb-1">Characters</span>
          <button @click="handleLogout" class="text-gray-400 hover:text-white transition-colors ml-4">Sair</button>
        </div>
      </div>
    </header>

    <!-- MAIN CONTENT -->
    <main class="relative z-10 max-w-7xl mx-auto px-6 py-10">
      
      <!-- TOP TITLE BAR -->
      <div class="flex items-center justify-between mb-8 pb-4 border-b border-vamp-border/40">
        <div>
          <h1 class="font-sans font-bold text-3xl text-white tracking-wide">My Characters</h1>
          <p class="text-gray-500 text-sm mt-1">Personagens ativos em Vampiro: A Máscara V5</p>
        </div>
        <button @click="router.push('/jogador/vampire/novo')" class="bg-[#1e88e5] hover:bg-blue-600 text-white text-xs font-bold px-6 py-2 rounded shadow-md uppercase tracking-wide transition-colors">
          Create Character
        </button>
      </div>

      <!-- GAMES FILTER RIBBON -->
      <div class="flex gap-4 overflow-x-auto pb-4 mb-8 custom-scrollbar">
        <!-- ALL GAMES PILL -->
        <div class="flex-shrink-0 w-32 h-24 border border-[#1e88e5] bg-black/40 rounded flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors">
          <span class="font-bold text-white uppercase text-center text-sm leading-tight">All<br>Games</span>
        </div>
        <!-- VAMPIRE PILL -->
        <div class="flex-shrink-0 w-32 h-24 border border-transparent hover:border-white/20 bg-vamp-c1/30 rounded flex items-center justify-center cursor-pointer transition-colors relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <span class="relative z-10 font-serif font-bold text-vamp-c2 text-center text-sm uppercase">Vampire<br><span class="text-[10px] text-white">The Masquerade</span></span>
        </div>
      </div>

      <!-- VAMPIRE SECTION BANNER -->
      <div class="demiplane-box rounded mb-6 p-4 flex items-center justify-between border-l-4 border-l-vamp-c2 bg-gradient-to-r from-vamp-c1/20 to-transparent">
        <h2 class="demiplane-title text-2xl flex items-center gap-3">
          Vampire: The Masquerade
          <span class="text-xs text-gray-400 font-sans tracking-normal bg-black/50 px-2 py-0.5 rounded cursor-pointer hover:text-white transition-colors" @click="router.push('/jogador/vampire/novo')">CREATE CHARACTER</span>
        </h2>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </div>

      <!-- CARDS GRID -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- PERSONAGENS EXISTENTES DO USUÁRIO -->
        <div 
          v-for="char in characters" 
          :key="char.id"
          class="demiplane-box relative flex items-center p-0 overflow-hidden group cursor-pointer border-l-[3px] border-l-vamp-c2 hover:border-white/30 transition-colors"
          @click="enterHub(char.id)"
        >
          <!-- Fundo hover sutil -->
          <div class="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors z-0"></div>
          
          <!-- Avatar Placeholder (Ankh ou Clan Icon) -->
          <div class="relative z-10 w-24 h-24 bg-black border-r border-vamp-border flex items-center justify-center shrink-0">
            <span class="text-3xl text-vamp-c2 font-serif opacity-70 group-hover:opacity-100 transition-opacity">☥</span>
          </div>

          <!-- Info Principal -->
          <div class="relative z-10 p-4 flex-1">
            <h3 class="font-sans font-bold text-lg text-white mb-0 uppercase tracking-wide">
              {{ char.name }}
            </h3>
            <p class="text-xs text-vamp-c2 font-serif italic uppercase tracking-wider mb-2">
              {{ char.DefinitionClan?.name || 'Sem Clã' }} {{ char.concept ? ' — ' + char.concept : '' }}
            </p>
            
            <div class="flex gap-4 text-[10px] text-gray-500 font-sans">
              <span>HUNGER: <strong class="text-white">{{ char.hunger }}</strong></span>
              <span>HUMANITY: <strong class="text-white">{{ char.humanity }}</strong></span>
              <span>GEN: <strong class="text-white">{{ char.generation }}ª</strong></span>
            </div>
          </div>

          <!-- Quick Actions Dropdown (Simulated via hover for now) -->
          <div class="relative z-10 px-4 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
            <button @click.stop="viewSheet(char.id)" class="text-xs text-gray-400 hover:text-white transition-colors p-1" title="Ficha Completa">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
            <button @click.stop="deleteCharacter(char.id, char.name)" class="text-xs text-vamp-c2 hover:text-red-500 transition-colors p-1" title="Excluir">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="characters.length === 0" class="col-span-full py-10 text-center text-gray-500 font-serif italic border border-dashed border-vamp-border rounded bg-black/20">
          Você ainda não possui personagens de Vampiro. Clique em "Create Character".
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const characters = ref<any[]>([])

const fetchCharacters = async () => {
  try {
    const res = await api.get('/api/character-vampires/my-characters')
    characters.value = res.data
  } catch (err) {
    console.error('Erro ao buscar personagens:', err)
  }
}

const enterHub = (characterId: string) => {
  localStorage.setItem('lira_active_character_id', characterId)
  router.push(`/personagem/hub?id=${characterId}`)
}

const viewSheet = (characterId: string) => {
  localStorage.setItem('lira_active_character_id', characterId)
  router.push(`/personagem/ficha?id=${characterId}`)
}

const deleteCharacter = async (id: string, name: string) => {
  if (confirm(`Tem certeza que deseja destruir a ficha de "${name}"? Esta ação não pode ser desfeita.`)) {
    try {
      await api.delete(`/api/character-vampires/${id}`)
      await fetchCharacters()
    } catch (err) {
      console.error('Erro ao excluir personagem:', err)
      alert('Erro ao excluir personagem.')
    }
  }
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
