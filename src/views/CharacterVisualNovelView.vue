<template>
  <div class="h-screen w-full bg-black text-parchment font-sans relative overflow-hidden flex flex-col">
    <!-- Navbar / Menu (Visible only when not in an active node, or overlay on top) -->
    <nav class="absolute top-0 w-full z-40 bg-gradient-to-b from-black/80 to-transparent p-4 flex justify-between items-center">
      <button @click="handleBack" class="text-xs text-gray-300 hover:text-white flex items-center gap-2 font-serif uppercase tracking-widest transition-colors">
        <span>←</span> {{ activeAdventure ? 'VOLTAR AO MENU' : 'VOLTAR AO HUB' }}
      </button>
      <div v-if="character && activeAdventure" class="flex gap-4">
        <!-- Minimal HUD based on screenshots -->
        <div class="flex items-center gap-2">
          <div class="w-10 h-10 rounded-full border-2 border-vamp-border bg-bg-deep overflow-hidden relative">
            <img :src="character.avatarUrl ? (character.avatarUrl.startsWith('http') ? character.avatarUrl : API_BASE_URL + character.avatarUrl) : ''" class="w-full h-full object-cover" />
            <div class="absolute bottom-0 left-0 w-full h-1/3 bg-black/60 flex items-center justify-center">
              <span class="text-[8px] font-bold text-vamp-c2">{{ character.hunger }}</span>
            </div>
          </div>
          <div class="flex flex-col gap-1 w-24">
            <div class="flex gap-0.5">
              <div v-for="i in 5" :key="i" class="h-1 flex-1 bg-black/80 border border-vamp-c2/30" :class="i <= character.hunger ? 'bg-vamp-c2 shadow-[0_0_5px_rgba(192,57,43,0.8)]' : ''"></div>
            </div>
            <div class="flex gap-0.5">
              <div v-for="i in 5" :key="i" class="h-1 flex-1 bg-black/80 border border-blue-900/50" :class="i <= (character.willpowerMax - character.willpowerDamageSuperficial - character.willpowerDamageAggravated) ? 'bg-blue-600/80 shadow-[0_0_5px_rgba(37,99,235,0.8)]' : ''"></div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- LOADING STATE -->
    <div v-if="loading" class="flex-1 flex items-center justify-center bg-bg-deep z-30">
      <div class="animate-spin w-12 h-12 border-2 border-vamp-border border-t-vamp-c2 rounded-full shadow-[0_0_15px_rgba(192,57,43,0.5)]"></div>
    </div>

    <!-- ADVENTURE LIST MENU -->
    <div v-else-if="!activeAdventure" class="flex-1 flex flex-col items-center justify-center bg-bg-deep p-4 pt-20 overflow-y-auto">
      <div class="max-w-3xl w-full space-y-8 pb-20">
        <header class="text-center border-b border-vamp-border pb-6">
          <h1 class="font-serif text-3xl md:text-5xl text-vamp-c2 mb-2 uppercase tracking-widest drop-shadow-[0_0_10px_rgba(192,57,43,0.5)]">Crônicas Narrativas</h1>
          <p class="text-xs text-parchment-dim uppercase tracking-widest font-serif">
            Vivencie histórias interativas. Suas escolhas moldam a noite.
          </p>
        </header>

        <div class="grid grid-cols-1 gap-6">
          <div v-for="adv in adventures" :key="adv.id" class="relative overflow-hidden border border-vamp-border bg-black/80 hover:border-gold-dim transition-colors cursor-pointer group rounded-sm shadow-xl" @click="startAdventure(adv.id)">
            <!-- Optional cover image if we add it later -->
            <div class="absolute inset-0 bg-vamp-c2/5 group-hover:bg-gold/5 transition-colors"></div>
            
            <div class="p-6 relative z-10 flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
              <div class="flex-1 text-center md:text-left">
                <h3 class="font-serif text-2xl text-white uppercase tracking-widest mb-2 group-hover:text-gold transition-colors">{{ adv.title }}</h3>
                <p class="text-sm text-parchment-dim italic leading-relaxed">{{ adv.description }}</p>
              </div>
              <div class="shrink-0">
                <button class="border border-vamp-border px-6 py-3 text-xs font-bold text-parchment uppercase tracking-widest font-serif group-hover:bg-gold group-hover:text-black group-hover:border-gold transition-all">
                  Iniciar / Continuar
                </button>
              </div>
            </div>
          </div>
          <div v-if="adventures.length === 0" class="text-center text-gray-500 font-serif italic py-10">
            Nenhuma crônica disponível no momento.
          </div>
        </div>
      </div>
    </div>

    <!-- ACTIVE VISUAL NOVEL SCENE -->
    <div v-else-if="currentNode" class="absolute inset-0 flex flex-col justify-end bg-black">
      
      <!-- 1. Background Image -->
      <div class="absolute inset-0 z-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
           :style="{ backgroundImage: currentNode.backgroundImageUrl ? `url('${resolveImageUrl(currentNode.backgroundImageUrl)}')` : 'none', opacity: transitionOpacity }">
      </div>
      <!-- Vignette / Darkening overlay for contrast -->
      <div class="absolute inset-0 z-0 bg-gradient-to-t from-black via-black/40 to-black/60 pointer-events-none mix-blend-multiply"></div>
      <div class="absolute inset-0 z-0 bg-black opacity-30 pointer-events-none"></div>

      <!-- 2. Character Sprites -->
      <div class="absolute inset-0 z-10 pointer-events-none flex justify-between items-end px-4 md:px-20 pb-[250px] md:pb-[300px]">
        <!-- Left Sprite -->
        <div class="w-full max-w-[350px] flex justify-start items-end transition-all duration-700 transform" :class="{'opacity-100 translate-x-0': currentNode.leftCharacterImageUrl, 'opacity-0 -translate-x-10': !currentNode.leftCharacterImageUrl}">
          <img v-if="currentNode.leftCharacterImageUrl" :src="resolveImageUrl(currentNode.leftCharacterImageUrl)" class="max-h-[60vh] md:max-h-[75vh] w-auto object-contain object-bottom drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]" />
        </div>
        <!-- Right Sprite -->
        <div class="w-full max-w-[350px] flex justify-end items-end transition-all duration-700 transform" :class="{'opacity-100 translate-x-0': currentNode.rightCharacterImageUrl, 'opacity-0 translate-x-10': !currentNode.rightCharacterImageUrl}">
          <img v-if="currentNode.rightCharacterImageUrl" :src="resolveImageUrl(currentNode.rightCharacterImageUrl)" class="max-h-[60vh] md:max-h-[75vh] w-auto object-contain object-bottom drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]" />
        </div>
      </div>

      <!-- 3. Bottom Dialog/Interaction Box (The 'Letterbox') -->
      <div class="relative z-20 w-full bg-gradient-to-t from-black via-black/95 to-transparent pt-32 pb-8 px-4 md:px-20 min-h-[40vh] flex flex-col items-center">
        
        <div class="max-w-4xl w-full mx-auto space-y-8">
          
          <!-- Speaker Name & Narrative Text -->
          <div class="text-center space-y-4">
            <div v-if="currentNode.speakerName" class="inline-block relative">
              <div class="absolute top-1/2 left-0 w-full h-px bg-vamp-border -translate-y-1/2 -z-10"></div>
              <span class="bg-black px-4 font-serif text-sm uppercase tracking-[0.2em] text-gold-dim font-bold drop-shadow-md">
                {{ currentNode.speakerName }}
              </span>
            </div>
            
            <div class="text-base md:text-xl font-serif leading-loose text-parchment whitespace-pre-line drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" :class="{'animate-fade-in': animateText}">
              {{ currentNode.narrativeText }}
            </div>
          </div>

          <!-- Ending Controls -->
          <div v-if="currentNode.isEnding" class="pt-10 text-center animate-fade-in">
            <div class="w-32 h-px bg-vamp-c2 mx-auto mb-6 opacity-50"></div>
            <button @click="activeAdventure = null; currentNode = null" class="border border-gold-dim text-gold-dim px-8 py-3 uppercase tracking-[0.2em] text-xs hover:bg-gold-dim hover:text-black transition-colors font-bold shadow-[0_0_15px_rgba(201,168,76,0.1)]">
              Encerrar e Retornar
            </button>
          </div>

          <!-- Choices List -->
          <div v-else class="flex flex-col items-center gap-3 w-full max-w-2xl mx-auto pt-6 animate-fade-in">
            <button 
              v-for="choice in currentNode.choices" 
              :key="choice.id" 
              @click="makeChoice(choice)"
              :disabled="processingChoice"
              class="w-full text-center p-3 md:p-4 transition-all duration-300 relative group overflow-hidden border-b border-transparent hover:border-vamp-border"
              :class="[
                choice.customStyle === 'DISCIPLINE' || choice.customStyle === 'RED' 
                  ? 'text-vamp-c2 hover:text-red-400 hover:bg-vamp-c2/5' 
                  : 'text-parchment-dim hover:text-parchment hover:bg-white/5'
              ]"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              
              <div class="flex flex-col items-center gap-1 relative z-10">
                <span class="font-serif text-sm md:text-base tracking-wider uppercase">
                  {{ choice.choiceText }}
                </span>
                <span v-if="choice.attributeReq || choice.skillReq" class="text-[9px] uppercase font-bold tracking-widest font-sans opacity-60 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  <span class="inline-block w-1.5 h-1.5 rounded-full" :class="choice.customStyle === 'DISCIPLINE' ? 'bg-vamp-c2' : 'bg-gray-400'"></span>
                  Teste de {{ choice.attributeReq }}<span v-if="choice.skillReq"> + {{ choice.skillReq }}</span> (Dif: {{ choice.difficulty || 1 }})
                </span>
              </div>
            </button>
          </div>
          
        </div>
      </div>
    </div>

    <!-- DICE ROLL RESULT OVERLAY (Cinematic) -->
    <div v-if="showResultModal && lastResult" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/90 backdrop-blur-md"></div>
      
      <div class="relative z-10 max-w-2xl w-full text-center space-y-8 animate-fade-in">
        <h3 class="font-serif text-5xl md:text-7xl uppercase tracking-[0.2em] font-bold drop-shadow-[0_0_20px_currentColor]" :class="lastResult.success ? 'text-green-600' : 'text-vamp-c2'">
          {{ lastResult.success ? 'SUCESSO' : 'FALHA' }}
        </h3>
        
        <div class="text-sm md:text-base text-parchment-dim uppercase tracking-[0.3em] font-serif border-y border-vamp-border/30 py-4 max-w-md mx-auto">
          Alvo: {{ lastResult.requiredSuccesses }} &nbsp;|&nbsp; Alcançado: <strong class="text-white">{{ lastResult.totalSuccesses }}</strong>
        </div>

        <div class="flex flex-wrap justify-center gap-4 py-8">
          <div v-for="(roll, i) in lastResult.diceRolls" :key="i" 
            class="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center font-serif text-2xl md:text-3xl rounded-md border-2 shadow-2xl transition-all"
            :class="roll >= 6 
              ? (roll === 10 ? 'border-green-400 bg-green-900/40 text-green-400 shadow-[0_0_20px_rgba(74,222,128,0.3)] scale-110' : 'border-green-700 bg-green-900/20 text-green-500') 
              : (roll === 1 ? 'border-vamp-c2 bg-red-900/40 text-vamp-c2 shadow-[0_0_15px_rgba(192,57,43,0.4)] scale-95' : 'border-gray-800 bg-black text-gray-600')">
            {{ roll }}
          </div>
        </div>
        
        <div class="pt-8">
          <button @click="closeResultModal" class="border border-white/20 text-white/80 px-10 py-4 font-serif uppercase tracking-[0.3em] font-bold hover:bg-white hover:text-black hover:border-white transition-all duration-500">
            Continuar Narrativa
          </button>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api, { API_BASE_URL } from '../services/api'

const router = useRouter()
const route = useRoute()

const characterId = ref<string>('')
const character = ref<any>(null)
const loading = ref(true)
const adventures = ref<any[]>([])

const activeAdventure = ref<string | null>(null)
const currentNode = ref<any>(null)
const progressData = ref<any>(null)

const processingChoice = ref(false)
const showResultModal = ref(false)
const lastResult = ref<any>(null)

// Animation states
const transitionOpacity = ref(1)
const animateText = ref(true)

const resolveImageUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  
  // Se for upload persistente do backend da Hostinger, precisa pegar a API_BASE_URL
  if (url.startsWith('/uploads/')) {
    return API_BASE_URL + url;
  }
  
  // Se for asset local (/story_assets/...)
  return url;
}

const fetchCharacter = async () => {
  try {
    const res = await api.get(`/api/character-vampires/${characterId.value}`)
    character.value = res.data
  } catch (e) {
    console.error('Erro ao buscar personagem:', e)
  }
}

const fetchAdventures = async () => {
  try {
    const res = await api.get('/api/story/adventures')
    adventures.value = res.data
  } catch (e) {
    console.error(e)
  }
}

const handleBack = () => {
  if (activeAdventure.value) {
    // Retorna para a lista de aventuras
    activeAdventure.value = null
    currentNode.value = null
  } else {
    // Retorna pro hub
    router.push(`/personagem/hub?id=${characterId.value}`)
  }
}

const startAdventure = async (advId: string) => {
  try {
    loading.value = true
    const res = await api.get(`/api/story/adventures/${advId}/progress/${characterId.value}`)
    triggerSceneTransition()
    activeAdventure.value = advId
    progressData.value = res.data.progress
    currentNode.value = res.data.currentNode
  } catch (e) {
    console.error(e)
    alert('Erro ao carregar crônica')
  } finally {
    loading.value = false
  }
}

const makeChoice = async (choice: any) => {
  try {
    processingChoice.value = true
    
    const res = await api.post('/api/story/adventures/choice', {
      characterId: characterId.value,
      adventureId: activeAdventure.value,
      choiceId: choice.id
    })
    
    // Se rolou dados
    if (res.data.dicePool > 0) {
      lastResult.value = res.data
      showResultModal.value = true
    } else {
      applyNewNode(res.data)
    }
  } catch (e) {
    console.error(e)
    alert('Erro ao processar escolha')
  } finally {
    processingChoice.value = false
  }
}

const closeResultModal = () => {
  showResultModal.value = false
  if (lastResult.value && lastResult.value.newNode) {
    applyNewNode(lastResult.value)
  }
  lastResult.value = null
}

const applyNewNode = (data: any) => {
  triggerSceneTransition()
  setTimeout(() => {
    currentNode.value = data.newNode
    progressData.value = data.progress
  }, 300) // Troca a cena no meio do fade
}

const triggerSceneTransition = () => {
  transitionOpacity.value = 0
  animateText.value = false
  setTimeout(() => {
    transitionOpacity.value = 1
    animateText.value = true
  }, 500)
}

onMounted(() => {
  characterId.value = (route.query.id as string) || localStorage.getItem('lira_active_character_id') || ''
  if (!characterId.value) {
    router.push('/jogador/vampire')
    return
  }
  
  Promise.all([fetchCharacter(), fetchAdventures()]).finally(() => {
    loading.value = false
  })
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 1s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
