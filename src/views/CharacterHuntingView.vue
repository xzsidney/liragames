<template>
  <div class="min-h-screen demiplane-bg text-parchment font-sans relative overflow-x-hidden selection:bg-blood-red selection:text-white pb-20">
    <nav class="relative z-20 border-b border-vamp-border bg-black/80 backdrop-blur-md sticky top-0">
      <div class="max-w-[1200px] mx-auto px-4 h-12 flex items-center justify-between">
        <button @click="router.push('/personagem/hub?id='+characterId)" class="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 font-serif uppercase tracking-widest transition-colors">
          <span>&larr;</span> Voltar ao Hub
        </button>
        <div class="flex items-center gap-4 text-[10px] font-serif tracking-widest uppercase">
          <span class="text-vamp-c2">ZONAS DE CAÇA</span>
        </div>
      </div>
    </nav>
    <main class="relative z-10 max-w-[1200px] mx-auto px-4 py-8 space-y-10">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-vamp-border">
        <div>
          <h1 class="demiplane-title text-3xl md:text-5xl text-white">Terrenos de Caça</h1>
          <h2 class="demiplane-text text-vamp-c2 mt-1">Escolha uma zona e uma abordagem de predação para saciar sua Fome.</h2>
        </div>
      </div>
      <div v-if="loading" class="text-center text-gray-500 font-serif">Carregando zonas...</div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="mission in missions" :key="mission.id" class="demiplane-box rounded-sm p-6 flex flex-col justify-between">
          <div>
            <h3 class="text-xl font-bold text-white uppercase tracking-wider mb-2">{{ mission.title }}</h3>
            <p class="text-sm text-gray-400 mb-6 italic">{{ mission.description }}</p>
            <div class="space-y-4">
              <div v-for="action in mission.Actions" :key="action.id" class="bg-black/40 border border-vamp-border rounded p-4 hover:border-vamp-c2 transition-colors">
                <div class="flex justify-between items-start mb-2">
                  <h4 class="text-sm font-bold text-parchment">{{ action.name }}</h4>
                  <span class="text-xs bg-vamp-bg text-vamp-c2 px-2 py-0.5 rounded uppercase">{{ action.attributeReq }} + {{ action.skillReq }}</span>
                </div>
                <p class="text-[11px] text-gray-500 mb-4">{{ action.description }}</p>
                <button @click="hunt(mission, action)" class="w-full bg-vamp-c2/10 border border-vamp-c2 text-vamp-c2 py-2 text-xs uppercase font-bold tracking-widest hover:bg-vamp-c2 hover:text-white transition">
                  Iniciar Caçada
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <div v-if="showModal" class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div class="demiplane-box max-w-md w-full p-8 text-center relative border-vamp-c2">
        <h2 class="text-2xl font-serif mb-4" :class="huntSuccess ? 'text-green-500' : 'text-vamp-c2'">
          {{ huntSuccess ? 'SANGUE FRESCO' : 'CAÇADA FRUSTRADA' }}
        </h2>
        <p class="text-parchment mb-8">{{ huntMessage }}</p>
        <button @click="closeModal" class="px-6 py-2 bg-vamp-bg border border-vamp-border hover:border-white text-white uppercase text-sm font-bold tracking-widest transition">
          Retornar
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
const characterId = route.query.id as string

const loading = ref(true)
const missions = ref<any[]>([])
const showModal = ref(false)
const huntSuccess = ref(false)
const huntMessage = ref('')

const fetchHunts = async () => {
  try {
    const res = await api.get('/api/missions-idle?category=HUNT')
    missions.value = res.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const hunt = async (_mission: any, action: any) => {
  const roll = Math.floor(Math.random() * 10) + 1
  if (roll >= action.difficulty) {
    huntSuccess.value = true
    huntMessage.value = action.successText
  } else {
    huntSuccess.value = false
    huntMessage.value = action.failureText
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

onMounted(() => {
  if (!characterId) {
    router.push('/dashboard')
    return
  }
  fetchHunts()
})
</script>
