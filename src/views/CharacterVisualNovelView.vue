<template>
  <div class="min-h-screen bg-[#050505] text-parchment font-sans pb-20 relative">
    <nav class="border-b border-vamp-border bg-black/80 backdrop-blur-md sticky top-0 z-20">
      <div class="max-w-[800px] mx-auto px-4 h-12 flex items-center justify-between">
        <button @click="router.push(`/personagem/hub?id=${characterId}`)" class="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 font-serif uppercase tracking-widest transition-colors">
          <span>←</span> VOLTAR AO HUB
        </button>
        <div class="text-[10px] font-serif tracking-widest uppercase text-vamp-c2">
          CRÔNICAS NARRATIVAS
        </div>
      </div>
    </nav>

    <main class="max-w-[800px] mx-auto px-4 py-8 space-y-10">
      <div v-if="loading" class="text-center py-20 text-vamp-c2 text-sm uppercase tracking-widest font-serif animate-pulse">
        Carregando a narrativa...
      </div>

      <!-- Adventure List -->
      <div v-else-if="!activeAdventure" class="space-y-8">
        <header class="text-center border-b border-vamp-border pb-6">
          <h1 class="font-serif text-3xl md:text-5xl text-vamp-c2 mb-2 uppercase tracking-widest">Crônicas</h1>
          <p class="text-xs text-parchment-dim uppercase tracking-widest font-serif max-w-2xl mx-auto">
            Vivencie histórias interativas onde suas escolhas e a ficha de seu personagem moldam o destino.
          </p>
        </header>

        <div class="grid grid-cols-1 gap-6">
          <div v-for="adv in adventures" :key="adv.id" class="border border-vamp-border bg-black/40 p-6 hover:border-gold-dim transition-colors cursor-pointer group" @click="startAdventure(adv.id)">
            <h3 class="font-serif text-xl text-white uppercase tracking-widest mb-2 group-hover:text-gold">{{ adv.title }}</h3>
            <p class="text-sm text-parchment-dim italic">{{ adv.description }}</p>
            <div class="mt-4 text-xs font-bold text-vamp-c2 uppercase tracking-widest font-serif flex items-center gap-2">
              <span>Iniciar Crônica</span>
              <span class="group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Active Node View (Visual Novel Interface) -->
      <div v-else-if="currentNode" class="space-y-6">
        <!-- Node Text -->
        <div class="border border-vamp-c2/30 bg-black/60 p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-b from-transparent to-vamp-c2/5 pointer-events-none"></div>
          
          <div class="text-lg md:text-xl font-serif leading-relaxed text-parchment whitespace-pre-line relative z-10">
            {{ currentNode.narrativeText }}
          </div>

          <div v-if="currentNode.isEnding" class="mt-12 text-center border-t border-vamp-border pt-6">
            <div class="text-gold font-serif text-2xl uppercase tracking-widest mb-4">Fim da Crônica</div>
            <button @click="activeAdventure = null; currentNode = null" class="border border-gold text-gold px-6 py-2 uppercase tracking-widest text-xs font-bold hover:bg-gold hover:text-black transition-colors">
              Retornar à Seleção
            </button>
          </div>
        </div>

        <!-- Choices -->
        <div v-if="!currentNode.isEnding" class="space-y-3">
          <button 
            v-for="choice in currentNode.choices" 
            :key="choice.id" 
            @click="makeChoice(choice)"
            :disabled="processingChoice"
            class="w-full text-left border border-vamp-border bg-black/80 hover:bg-vamp-bg hover:border-vamp-c2 p-4 transition-all group relative overflow-hidden flex justify-between items-center"
          >
            <div class="absolute inset-0 bg-gradient-to-r from-vamp-c2/10 to-transparent -translate-x-[100%] group-hover:translate-x-0 transition-transform duration-500"></div>
            
            <span class="font-serif text-sm md:text-base text-parchment group-hover:text-white relative z-10 transition-colors">
              {{ choice.choiceText }}
            </span>

            <!-- Requisitos do Teste -->
            <span v-if="choice.attributeReq || choice.skillReq" class="text-[10px] text-vamp-c2 uppercase font-bold tracking-widest font-serif relative z-10 flex gap-2 items-center bg-black/50 px-2 py-1 rounded">
              <span>TESTE:</span>
              <span>{{ choice.attributeReq }}<span v-if="choice.skillReq"> + {{ choice.skillReq }}</span></span>
              <span class="text-gray-500">(Dif: {{ choice.difficulty || 1 }})</span>
            </span>
          </button>
        </div>
      </div>
    </main>

    <!-- Dice Result Modal -->
    <div v-if="showResultModal && lastResult" class="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div class="border border-vamp-c2 bg-bg-deep p-8 max-w-lg w-full relative text-center">
        <h3 class="font-serif text-3xl mb-2 uppercase tracking-widest" :class="lastResult.success ? 'text-green-500' : 'text-vamp-c2'">
          {{ lastResult.success ? 'SUCESSO' : 'FALHA' }}
        </h3>
        
        <div class="text-sm text-parchment-dim uppercase tracking-widest mb-6 font-serif">
          Alvo: {{ lastResult.requiredSuccesses }} | Alcançado: {{ lastResult.totalSuccesses }}
        </div>

        <div class="flex flex-wrap justify-center gap-2 mb-8">
          <div v-for="(roll, i) in lastResult.diceRolls" :key="i" 
            class="w-10 h-10 border flex items-center justify-center font-bold text-lg rounded-sm"
            :class="roll >= 6 ? (roll === 10 ? 'border-green-400 bg-green-500/20 text-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]' : 'border-green-600 bg-green-600/20 text-green-500') : (roll === 1 ? 'border-vamp-c2 bg-vamp-c2/20 text-vamp-c2' : 'border-gray-700 bg-gray-800 text-gray-400')">
            {{ roll }}
          </div>
        </div>
        
        <button @click="closeResultModal" class="w-full bg-vamp-c2 text-black p-4 font-serif uppercase tracking-widest font-bold hover:bg-white transition-colors">
          Continuar
        </button>
      </div>
    </div>
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
const adventures = ref<any[]>([])

const activeAdventure = ref<string | null>(null)
const currentNode = ref<any>(null)
const progressData = ref<any>(null)

const processingChoice = ref(false)
const showResultModal = ref(false)
const lastResult = ref<any>(null)

const fetchAdventures = async () => {
  try {
    const res = await api.get('/api/story/adventures')
    adventures.value = res.data
  } catch (e) {
    console.error(e)
  }
}

const startAdventure = async (advId: string) => {
  try {
    loading.value = true
    const res = await api.get(`/api/story/adventures/${advId}/progress/${characterId.value}`)
    activeAdventure.value = advId
    progressData.value = res.data.progress
    currentNode.value = res.data.currentNode
  } catch (e) {
    console.error(e)
    alert('Erro ao carregar aventura')
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
      // Se nao rolou dados, avanca direto
      currentNode.value = res.data.newNode
      progressData.value = res.data.progress
      window.scrollTo(0,0)
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
    currentNode.value = lastResult.value.newNode
    progressData.value = lastResult.value.progress
    window.scrollTo(0,0)
  }
  lastResult.value = null
}

onMounted(() => {
  characterId.value = (route.query.id as string) || localStorage.getItem('lira_active_character_id') || ''
  fetchAdventures().finally(() => {
    loading.value = false
  })
})
</script>
