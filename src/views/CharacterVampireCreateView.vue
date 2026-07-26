<template>
  <div class="min-h-screen bg-[#050505] text-parchment font-sans relative overflow-x-hidden selection:bg-blood-red selection:text-white">
    <!-- NOISE OVERLAY -->
    <div class="fixed inset-0 pointer-events-none opacity-20 mix-blend-overlay z-0" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>
    
    <!-- SUBTLE GLOWS -->
    <div class="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-blood-red/10 blur-[150px] rounded-full pointer-events-none z-0"></div>

    <!-- HEADER / NAVBAR -->
    <nav class="relative z-20 border-b border-white/5 bg-black/60 backdrop-blur-md sticky top-0">
      <div class="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3 cursor-pointer" @click="router.push('/jogador/vampire')">
          <div class="w-8 h-8 rounded-full border border-gold-dim flex items-center justify-center bg-black shadow-[0_0_15px_rgba(212,175,55,0.15)]">
            <span class="text-gold font-serif text-lg">L</span>
          </div>
          <span class="font-serif text-sm tracking-widest text-parchment">Criação de Membro</span>
        </div>

        <button @click="router.push('/jogador/vampire')" class="text-xs font-serif tracking-widest uppercase text-gray-400 hover:text-white transition-colors">
          ← Voltar à Lista
        </button>
      </div>
    </nav>

    <!-- FORM CONTAINER -->
    <main class="relative z-10 max-w-3xl mx-auto px-6 py-12">
      <header class="mb-10 text-center">
        <h1 class="font-serif text-3xl md:text-4xl text-gold-dim tracking-wide mb-2">
          Abraçar uma Nova Alma
        </h1>
        <p class="text-gray-400 text-sm font-light italic">
          Preencha os dados primários para registrar o novo Membro nas sombras da Camarilla.
        </p>
      </header>

      <!-- ALERT MESSAGES -->
      <div v-if="errorMessage" class="mb-6 p-4 rounded-lg bg-red-950/80 border border-red-500/50 text-red-200 text-sm text-center">
        {{ errorMessage }}
      </div>

      <div v-if="successMessage" class="mb-6 p-4 rounded-lg bg-green-950/80 border border-green-500/50 text-green-200 text-sm text-center">
        {{ successMessage }}
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-8 bg-black/60 border border-white/10 rounded-xl p-8 backdrop-blur-md shadow-2xl">
        <!-- SEÇÃO 1: IDENTIDADE -->
        <div>
          <h2 class="font-serif text-xl text-gold-dim mb-4 pb-2 border-b border-white/10 flex items-center gap-2">
            <span class="w-2 h-2 bg-blood-red rounded-full"></span>
            Identidade do Neófito
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-xs font-serif uppercase tracking-wider text-gray-400 mb-2">Nome do Personagem *</label>
              <input 
                v-model="form.name" 
                type="text" 
                required 
                placeholder="Ex: Julian Thorne" 
                class="w-full bg-black/80 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            <div>
              <label class="block text-xs font-serif uppercase tracking-wider text-gray-400 mb-2">Conceito</label>
              <input 
                v-model="form.concept" 
                type="text" 
                placeholder="Ex: Detetive Noturno Obsessivo" 
                class="w-full bg-black/80 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            <div>
              <label class="block text-xs font-serif uppercase tracking-wider text-gray-400 mb-2">Clã *</label>
              <select 
                v-model="form.clanId" 
                required
                class="w-full bg-black/80 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold transition-colors"
              >
                <option :value="null" disabled>Selecione um Clã</option>
                <option v-for="clan in clans" :key="clan.id" :value="clan.id">
                  {{ clan.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-serif uppercase tracking-wider text-gray-400 mb-2">Tipo de Predador</label>
              <select 
                v-model="form.predatorId"
                class="w-full bg-black/80 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold transition-colors"
              >
                <option :value="null">Nenhum / Não Definido</option>
                <option v-for="predator in predators" :key="predator.id" :value="predator.id">
                  {{ predator.name }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- SEÇÃO 2: LINHAGEM E MOTIVAÇÃO -->
        <div>
          <h2 class="font-serif text-xl text-gold-dim mb-4 pb-2 border-b border-white/10 flex items-center gap-2">
            <span class="w-2 h-2 bg-blood-red rounded-full"></span>
            Linhagem & Ambição
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-xs font-serif uppercase tracking-wider text-gray-400 mb-2">Senhor (Sire)</label>
              <input 
                v-model="form.sire" 
                type="text" 
                placeholder="Nome do Vampiro que o Abraçou" 
                class="w-full bg-black/80 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            <div>
              <label class="block text-xs font-serif uppercase tracking-wider text-gray-400 mb-2">Geração</label>
              <input 
                v-model.number="form.generation" 
                type="number" 
                min="4" 
                max="16" 
                class="w-full bg-black/80 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            <div>
              <label class="block text-xs font-serif uppercase tracking-wider text-gray-400 mb-2">Ambição</label>
              <input 
                v-model="form.ambition" 
                type="text" 
                placeholder="Objetivo de Longo Prazo" 
                class="w-full bg-black/80 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            <div>
              <label class="block text-xs font-serif uppercase tracking-wider text-gray-400 mb-2">Desejo</label>
              <input 
                v-model="form.desire" 
                type="text" 
                placeholder="Objetivo de Curto Prazo" 
                class="w-full bg-black/80 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold transition-colors"
              />
            </div>
          </div>
        </div>

        <!-- BOTÃO SUBMIT -->
        <div class="pt-4 flex items-center justify-end gap-4">
          <button 
            type="button" 
            @click="router.push('/jogador/vampire')"
            class="px-6 py-2.5 rounded-lg border border-white/10 text-gray-400 hover:text-white text-xs font-serif tracking-widest uppercase transition-colors"
          >
            Cancelar
          </button>

          <button 
            type="submit" 
            :disabled="isLoading"
            class="px-8 py-2.5 rounded-lg bg-blood-red hover:bg-red-700 text-white font-serif text-xs tracking-widest uppercase transition-all duration-300 shadow-[0_0_15px_rgba(139,0,0,0.5)] disabled:opacity-50"
          >
            {{ isLoading ? 'Gravando no Banco...' : 'Criar Ficha de Membro' }}
          </button>
        </div>
      </form>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const clans = ref<any[]>([])
const predators = ref<any[]>([])

const form = ref({
  name: '',
  concept: '',
  clanId: null as string | null,
  predatorId: null as string | null,
  sire: '',
  generation: 12,
  ambition: '',
  desire: '',
  hunger: 1,
  humanity: 7
})

const fetchDefinitions = async () => {
  try {
    const [clanRes, predRes] = await Promise.all([
      api.get('/api/definition-clans'),
      api.get('/api/definition-predators')
    ])
    clans.value = clanRes.data
    predators.value = predRes.data
  } catch (err) {
    console.error('Erro ao carregar bibliotecas:', err)
  }
}

const handleSubmit = async () => {
  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const userString = sessionStorage.getItem('lira_user') || localStorage.getItem('lira_user')
    const user = userString ? JSON.parse(userString) : null

    if (!user || !user.id) {
      errorMessage.value = 'Sessão inválida. Faça login novamente.'
      return
    }

    const payload = {
      userId: user.id,
      name: form.value.name,
      concept: form.value.concept || null,
      clanId: form.value.clanId,
      predatorId: form.value.predatorId,
      sire: form.value.sire || null,
      generation: form.value.generation,
      ambition: form.value.ambition || null,
      desire: form.value.desire || null,
      hunger: form.value.hunger,
      humanity: form.value.humanity,
      attributes: [],
      skills: [],
      disciplines: [],
      powers: [],
      meritsFlaws: [],
      backgrounds: [],
      equipments: []
    }

    await api.post('/api/character-vampires', payload)

    successMessage.value = 'Ficha de Vampiro criada com sucesso! Redirecionando...'
    setTimeout(() => {
      router.push('/jogador/vampire')
    }, 1200)
  } catch (err: any) {
    console.error('Erro ao criar personagem:', err)
    if (err.response && err.response.data && err.response.data.error) {
      errorMessage.value = err.response.data.error
    } else {
      errorMessage.value = 'Erro ao salvar o personagem no banco de dados.'
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchDefinitions()
})
</script>
