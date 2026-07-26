<template>
  <div class="min-h-screen bg-[#050505] text-parchment font-sans relative overflow-x-hidden selection:bg-blood-red selection:text-white">
    <!-- NOISE OVERLAY -->
    <div class="fixed inset-0 pointer-events-none opacity-20 mix-blend-overlay z-0" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>
    
    <!-- SUBTLE GLOWS -->
    <div class="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-blood-red/10 blur-[150px] rounded-full pointer-events-none z-0"></div>

    <!-- HEADER / NAVBAR -->
    <nav class="relative z-20 border-b border-white/5 bg-black/60 backdrop-blur-md sticky top-0">
      <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3 cursor-pointer" @click="router.push('/jogador/vampire')">
          <div class="w-8 h-8 rounded-full border border-gold-dim flex items-center justify-center bg-black shadow-[0_0_15px_rgba(212,175,55,0.15)]">
            <span class="text-gold font-serif text-lg">L</span>
          </div>
          <span class="font-serif text-sm tracking-widest text-parchment">Criação de Membro (V5)</span>
        </div>

        <button @click="router.push('/jogador/vampire')" class="text-xs font-serif tracking-widest uppercase text-gray-400 hover:text-white transition-colors">
          ← Voltar à Lista
        </button>
      </div>
    </nav>

    <!-- FORM CONTAINER -->
    <main class="relative z-10 max-w-5xl mx-auto px-6 py-10">
      <header class="mb-8 text-center">
        <h1 class="font-serif text-3xl md:text-4xl text-gold-dim tracking-wide mb-2">
          Abraçar uma Nova Alma
        </h1>
        <p class="text-gray-400 text-sm font-light italic">
          Configure a ficha oficial do seu Vampiro com todos os Atributos, Perícias e Bibliotecas do V5.
        </p>
      </header>

      <!-- ALERT MESSAGES -->
      <div v-if="errorMessage" class="mb-6 p-4 rounded-lg bg-red-950/80 border border-red-500/50 text-red-200 text-sm text-center animate-fade-in">
        {{ errorMessage }}
      </div>

      <div v-if="successMessage" class="mb-6 p-4 rounded-lg bg-green-950/80 border border-green-500/50 text-green-200 text-sm text-center animate-fade-in">
        {{ successMessage }}
      </div>

      <!-- TABS DE NAVEGAÇÃO DA FICHA -->
      <div class="flex border-b border-white/10 mb-8 overflow-x-auto">
        <button 
          @click="activeTab = 'identity'"
          type="button"
          class="px-6 py-3 font-serif text-xs uppercase tracking-widest transition-all duration-300 relative whitespace-nowrap"
          :class="activeTab === 'identity' ? 'text-gold font-semibold' : 'text-gray-400 hover:text-white'"
        >
          1. Identidade &amp; Linhagem
          <div v-if="activeTab === 'identity'" class="absolute bottom-0 left-0 w-full h-0.5 bg-gold shadow-[0_0_8px_rgba(212,175,55,0.8)]"></div>
        </button>

        <button 
          @click="activeTab = 'attributes'"
          type="button"
          class="px-6 py-3 font-serif text-xs uppercase tracking-widest transition-all duration-300 relative whitespace-nowrap"
          :class="activeTab === 'attributes' ? 'text-gold font-semibold' : 'text-gray-400 hover:text-white'"
        >
          2. Atributos (9)
          <div v-if="activeTab === 'attributes'" class="absolute bottom-0 left-0 w-full h-0.5 bg-gold shadow-[0_0_8px_rgba(212,175,55,0.8)]"></div>
        </button>

        <button 
          @click="activeTab = 'skills'"
          type="button"
          class="px-6 py-3 font-serif text-xs uppercase tracking-widest transition-all duration-300 relative whitespace-nowrap"
          :class="activeTab === 'skills' ? 'text-gold font-semibold' : 'text-gray-400 hover:text-white'"
        >
          3. Perícias (27)
          <div v-if="activeTab === 'skills'" class="absolute bottom-0 left-0 w-full h-0.5 bg-gold shadow-[0_0_8px_rgba(212,175,55,0.8)]"></div>
        </button>

        <button 
          @click="activeTab = 'philosophy'"
          type="button"
          class="px-6 py-3 font-serif text-xs uppercase tracking-widest transition-all duration-300 relative whitespace-nowrap"
          :class="activeTab === 'philosophy' ? 'text-gold font-semibold' : 'text-gray-400 hover:text-white'"
        >
          4. Filosofia &amp; Lore
          <div v-if="activeTab === 'philosophy'" class="absolute bottom-0 left-0 w-full h-0.5 bg-gold shadow-[0_0_8px_rgba(212,175,55,0.8)]"></div>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="bg-black/60 border border-white/10 rounded-xl p-8 backdrop-blur-md shadow-2xl space-y-8">
        
        <!-- ABA 1: IDENTIDADE & LINHAGEM -->
        <div v-show="activeTab === 'identity'" class="space-y-6">
          <h2 class="font-serif text-xl text-gold-dim mb-4 pb-2 border-b border-white/10 flex items-center gap-2">
            <span class="w-2 h-2 bg-blood-red rounded-full"></span>
            Dados de Identidade &amp; Sangue
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

            <!-- CONCEITO (SELETOR DE ARQUÉTIPOS DA BIBLIOTECA) -->
            <div>
              <label class="block text-xs font-serif uppercase tracking-wider text-gray-400 mb-2">Conceito / Arquétipo *</label>
              <select 
                v-model="form.concept" 
                class="w-full bg-black/80 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold transition-colors"
              >
                <option value="">Selecione um Arquétipo</option>
                <option v-for="arch in archetypes" :key="arch.id" :value="arch.name">
                  {{ arch.name }} {{ arch.category ? `(${arch.category})` : '' }}
                </option>
              </select>
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

            <div>
              <label class="block text-xs font-serif uppercase tracking-wider text-gray-400 mb-2">Ressonância do Sangue</label>
              <select 
                v-model="form.resonanceId"
                class="w-full bg-black/80 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold transition-colors"
              >
                <option :value="null">Nenhuma / Neutra</option>
                <option v-for="res in resonances" :key="res.id" :value="res.id">
                  {{ res.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-serif uppercase tracking-wider text-gray-400 mb-2">Potência de Sangue</label>
              <select 
                v-model="form.bloodPotencyId"
                class="w-full bg-black/80 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold transition-colors"
              >
                <option :value="null">Nível 1 (Padrão Neófito)</option>
                <option v-for="bp in bloodPotencies" :key="bp.id" :value="bp.id">
                  Nível {{ bp.level }} (Surge: {{ bp.bloodSurge }})
                </option>
              </select>
            </div>

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
              <label class="block text-xs font-serif uppercase tracking-wider text-gray-400 mb-2">Geração (4ª a 16ª)</label>
              <input 
                v-model.number="form.generation" 
                type="number" 
                min="4" 
                max="16" 
                class="w-full bg-black/80 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold transition-colors"
              />
            </div>
          </div>
        </div>

        <!-- ABA 2: ATRIBUTOS -->
        <div v-show="activeTab === 'attributes'" class="space-y-6">
          <h2 class="font-serif text-xl text-gold-dim mb-4 pb-2 border-b border-white/10 flex items-center justify-between">
            <span class="flex items-center gap-2">
              <span class="w-2 h-2 bg-blood-red rounded-full"></span>
              Atributos de Vampiro (V5)
            </span>
            <span class="text-xs font-mono text-gray-400">Valores de 1 a 5</span>
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- FÍSICOS -->
            <div class="bg-black/40 border border-white/5 rounded-xl p-5">
              <h3 class="font-serif text-sm text-gold uppercase tracking-wider mb-4 border-b border-gold/20 pb-2">Físicos</h3>
              <div class="space-y-4">
                <div v-for="attr in physicalAttributes" :key="attr.id" class="flex items-center justify-between">
                  <span class="text-xs font-serif text-gray-300">{{ attr.name }}</span>
                  <div class="flex items-center gap-1">
                    <button 
                      v-for="dot in 5" 
                      :key="dot"
                      type="button"
                      @click="setAttributeValue(attr.id, dot)"
                      class="w-4 h-4 rounded-full border transition-all duration-200"
                      :class="dot <= getAttributeValue(attr.id) ? 'bg-gold border-gold shadow-[0_0_6px_rgba(212,175,55,0.6)]' : 'border-white/20 bg-black/50 hover:border-white/50'"
                    ></button>
                  </div>
                </div>
              </div>
            </div>

            <!-- SOCIAIS -->
            <div class="bg-black/40 border border-white/5 rounded-xl p-5">
              <h3 class="font-serif text-sm text-gold uppercase tracking-wider mb-4 border-b border-gold/20 pb-2">Sociais</h3>
              <div class="space-y-4">
                <div v-for="attr in socialAttributes" :key="attr.id" class="flex items-center justify-between">
                  <span class="text-xs font-serif text-gray-300">{{ attr.name }}</span>
                  <div class="flex items-center gap-1">
                    <button 
                      v-for="dot in 5" 
                      :key="dot"
                      type="button"
                      @click="setAttributeValue(attr.id, dot)"
                      class="w-4 h-4 rounded-full border transition-all duration-200"
                      :class="dot <= getAttributeValue(attr.id) ? 'bg-gold border-gold shadow-[0_0_6px_rgba(212,175,55,0.6)]' : 'border-white/20 bg-black/50 hover:border-white/50'"
                    ></button>
                  </div>
                </div>
              </div>
            </div>

            <!-- MENTAIS -->
            <div class="bg-black/40 border border-white/5 rounded-xl p-5">
              <h3 class="font-serif text-sm text-gold uppercase tracking-wider mb-4 border-b border-gold/20 pb-2">Mentais</h3>
              <div class="space-y-4">
                <div v-for="attr in mentalAttributes" :key="attr.id" class="flex items-center justify-between">
                  <span class="text-xs font-serif text-gray-300">{{ attr.name }}</span>
                  <div class="flex items-center gap-1">
                    <button 
                      v-for="dot in 5" 
                      :key="dot"
                      type="button"
                      @click="setAttributeValue(attr.id, dot)"
                      class="w-4 h-4 rounded-full border transition-all duration-200"
                      :class="dot <= getAttributeValue(attr.id) ? 'bg-gold border-gold shadow-[0_0_6px_rgba(212,175,55,0.6)]' : 'border-white/20 bg-black/50 hover:border-white/50'"
                    ></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ABA 3: PERÍCIAS -->
        <div v-show="activeTab === 'skills'" class="space-y-6">
          <h2 class="font-serif text-xl text-gold-dim mb-4 pb-2 border-b border-white/10 flex items-center justify-between">
            <span class="flex items-center gap-2">
              <span class="w-2 h-2 bg-blood-red rounded-full"></span>
              Perícias &amp; Talentos
            </span>
            <span class="text-xs font-mono text-gray-400">Valores de 0 a 5</span>
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- TALENTOS / FÍSICAS -->
            <div class="bg-black/40 border border-white/5 rounded-xl p-5">
              <h3 class="font-serif text-sm text-gold uppercase tracking-wider mb-4 border-b border-gold/20 pb-2">Talentos</h3>
              <div class="space-y-3">
                <div v-for="sk in talentSkills" :key="sk.id" class="flex items-center justify-between">
                  <span class="text-xs font-serif text-gray-300">{{ sk.name }}</span>
                  <div class="flex items-center gap-1">
                    <button 
                      v-for="dot in 5" 
                      :key="dot"
                      type="button"
                      @click="setSkillValue(sk.id, dot)"
                      class="w-3.5 h-3.5 rounded-full border transition-all duration-200"
                      :class="dot <= getSkillValue(sk.id) ? 'bg-blood-red border-blood-red shadow-[0_0_5px_rgba(139,0,0,0.8)]' : 'border-white/20 bg-black/50 hover:border-white/50'"
                    ></button>
                  </div>
                </div>
              </div>
            </div>

            <!-- PERÍCIAS / SOCIAIS -->
            <div class="bg-black/40 border border-white/5 rounded-xl p-5">
              <h3 class="font-serif text-sm text-gold uppercase tracking-wider mb-4 border-b border-gold/20 pb-2">Perícias</h3>
              <div class="space-y-3">
                <div v-for="sk in physicalSkills" :key="sk.id" class="flex items-center justify-between">
                  <span class="text-xs font-serif text-gray-300">{{ sk.name }}</span>
                  <div class="flex items-center gap-1">
                    <button 
                      v-for="dot in 5" 
                      :key="dot"
                      type="button"
                      @click="setSkillValue(sk.id, dot)"
                      class="w-3.5 h-3.5 rounded-full border transition-all duration-200"
                      :class="dot <= getSkillValue(sk.id) ? 'bg-blood-red border-blood-red shadow-[0_0_5px_rgba(139,0,0,0.8)]' : 'border-white/20 bg-black/50 hover:border-white/50'"
                    ></button>
                  </div>
                </div>
              </div>
            </div>

            <!-- CONHECIMENTOS / MENTAIS -->
            <div class="bg-black/40 border border-white/5 rounded-xl p-5">
              <h3 class="font-serif text-sm text-gold uppercase tracking-wider mb-4 border-b border-gold/20 pb-2">Conhecimentos</h3>
              <div class="space-y-3">
                <div v-for="sk in mentalSkills" :key="sk.id" class="flex items-center justify-between">
                  <span class="text-xs font-serif text-gray-300">{{ sk.name }}</span>
                  <div class="flex items-center gap-1">
                    <button 
                      v-for="dot in 5" 
                      :key="dot"
                      type="button"
                      @click="setSkillValue(sk.id, dot)"
                      class="w-3.5 h-3.5 rounded-full border transition-all duration-200"
                      :class="dot <= getSkillValue(sk.id) ? 'bg-blood-red border-blood-red shadow-[0_0_5px_rgba(139,0,0,0.8)]' : 'border-white/20 bg-black/50 hover:border-white/50'"
                    ></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ABA 4: FILOSOFIA & LORE -->
        <div v-show="activeTab === 'philosophy'" class="space-y-6">
          <h2 class="font-serif text-xl text-gold-dim mb-4 pb-2 border-b border-white/10 flex items-center gap-2">
            <span class="w-2 h-2 bg-blood-red rounded-full"></span>
            Filosofia &amp; História Pessoal
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-xs font-serif uppercase tracking-wider text-gray-400 mb-2">Ambição (Objetivo Longo)</label>
              <input 
                v-model="form.ambition" 
                type="text" 
                placeholder="Ex: Controlar o conselho noturno" 
                class="w-full bg-black/80 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            <div>
              <label class="block text-xs font-serif uppercase tracking-wider text-gray-400 mb-2">Desejo (Objetivo Curto)</label>
              <input 
                v-model="form.desire" 
                type="text" 
                placeholder="Ex: Alimentar-se sem alertar a polícia" 
                class="w-full bg-black/80 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            <div class="md:col-span-2">
              <label class="block text-xs font-serif uppercase tracking-wider text-gray-400 mb-2">Princípios da Crônica</label>
              <textarea 
                v-model="form.chronicleTenets" 
                rows="3" 
                placeholder="As regras morais da sua mesa/mestre..."
                class="w-full bg-black/80 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold transition-colors"
              ></textarea>
            </div>

            <div class="md:col-span-2">
              <label class="block text-xs font-serif uppercase tracking-wider text-gray-400 mb-2">Histórico &amp; Lore do Vampiro</label>
              <textarea 
                v-model="form.history" 
                rows="4" 
                placeholder="Conte a história do seu Abraço, origem e segredos..."
                class="w-full bg-black/80 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold transition-colors"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- NAVEGAÇÃO E BOTÃO SUBMIT -->
        <div class="pt-6 border-t border-white/10 flex items-center justify-between">
          <div class="flex gap-2">
            <button 
              v-if="activeTab !== 'identity'"
              type="button" 
              @click="prevTab"
              class="px-4 py-2 rounded-lg border border-white/10 text-gray-400 hover:text-white text-xs font-serif tracking-widest uppercase transition-colors"
            >
              ← Anterior
            </button>

            <button 
              v-if="activeTab !== 'philosophy'"
              type="button" 
              @click="nextTab"
              class="px-4 py-2 rounded-lg border border-gold/40 text-gold hover:border-gold text-xs font-serif tracking-widest uppercase transition-colors"
            >
              Próximo →
            </button>
          </div>

          <div class="flex items-center gap-4">
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
              {{ isLoading ? 'Gravando no Banco...' : 'Criar Ficha Completa' }}
            </button>
          </div>
        </div>
      </form>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const activeTab = ref<'identity' | 'attributes' | 'skills' | 'philosophy'>('identity')
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Bibliotecas
const clans = ref<any[]>([])
const predators = ref<any[]>([])
const archetypes = ref<any[]>([])
const resonances = ref<any[]>([])
const bloodPotencies = ref<any[]>([])
const attributesList = ref<any[]>([])
const skillsList = ref<any[]>([])

// Mapeamento de Atributos e Perícias Selecionados
const selectedAttributes = ref<Record<string, number>>({})
const selectedSkills = ref<Record<string, number>>({})

const form = ref({
  name: '',
  concept: '',
  clanId: null as string | null,
  predatorId: null as string | null,
  resonanceId: null as string | null,
  bloodPotencyId: null as string | null,
  sire: '',
  generation: 12,
  ambition: '',
  desire: '',
  chronicleTenets: '',
  history: '',
  hunger: 1,
  humanity: 7
})

// Separadores de Atributos por categoria
const physicalAttributes = computed(() => attributesList.value.filter(a => a.category?.toUpperCase() === 'PHYSICAL' || a.category?.toUpperCase() === 'FÍSICO'))
const socialAttributes = computed(() => attributesList.value.filter(a => a.category?.toUpperCase() === 'SOCIAL'))
const mentalAttributes = computed(() => attributesList.value.filter(a => a.category?.toUpperCase() === 'MENTAL'))

// Separadores de Perícias por categoria
const talentSkills = computed(() => skillsList.value.filter(s => s.category?.toUpperCase() === 'TALENT' || s.category?.toUpperCase() === 'TALENTOS'))
const physicalSkills = computed(() => skillsList.value.filter(s => s.category?.toUpperCase() === 'SKILL' || s.category?.toUpperCase() === 'PERÍCIAS'))
const mentalSkills = computed(() => skillsList.value.filter(s => s.category?.toUpperCase() === 'KNOWLEDGE' || s.category?.toUpperCase() === 'CONHECIMENTOS'))

const getAttributeValue = (id: string) => selectedAttributes.value[id] || 1
const setAttributeValue = (id: string, val: number) => { selectedAttributes.value[id] = val }

const getSkillValue = (id: string) => selectedSkills.value[id] || 0
const setSkillValue = (id: string, val: number) => { selectedSkills.value[id] = val }

const nextTab = () => {
  if (activeTab.value === 'identity') activeTab.value = 'attributes'
  else if (activeTab.value === 'attributes') activeTab.value = 'skills'
  else if (activeTab.value === 'skills') activeTab.value = 'philosophy'
}

const prevTab = () => {
  if (activeTab.value === 'philosophy') activeTab.value = 'skills'
  else if (activeTab.value === 'skills') activeTab.value = 'attributes'
  else if (activeTab.value === 'attributes') activeTab.value = 'identity'
}

const fetchDefinitions = async () => {
  try {
    const [clanRes, predRes, archRes, resRes, bpRes, attrRes, skRes] = await Promise.all([
      api.get('/api/definition-clans'),
      api.get('/api/definition-predators'),
      api.get('/api/definition-archetypes'),
      api.get('/api/definition-resonances'),
      api.get('/api/definition-blood-potencies'),
      api.get('/api/definition-attributes'),
      api.get('/api/definition-skills')
    ])
    clans.value = clanRes.data
    predators.value = predRes.data
    archetypes.value = archRes.data
    resonances.value = resRes.data
    bloodPotencies.value = bpRes.data
    attributesList.value = attrRes.data
    skillsList.value = skRes.data

    // Inicializar atributos padrão em 1
    attrRes.data.forEach((a: any) => { selectedAttributes.value[a.id] = 1 })
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

    // Formata o array de atributos
    const attributesPayload = Object.entries(selectedAttributes.value).map(([definitionAttributeId, value]) => ({
      definitionAttributeId,
      value
    }))

    // Formata o array de perícias (apenas as que tiverem valor > 0)
    const skillsPayload = Object.entries(selectedSkills.value)
      .filter(([_, val]) => val > 0)
      .map(([definitionSkillId, value]) => ({
        definitionSkillId,
        value
      }))

    const payload = {
      userId: user.id,
      name: form.value.name,
      concept: form.value.concept || null,
      clanId: form.value.clanId,
      predatorId: form.value.predatorId,
      resonanceId: form.value.resonanceId,
      bloodPotencyId: form.value.bloodPotencyId,
      sire: form.value.sire || null,
      generation: form.value.generation,
      ambition: form.value.ambition || null,
      desire: form.value.desire || null,
      chronicleTenets: form.value.chronicleTenets || null,
      history: form.value.history || null,
      hunger: form.value.hunger,
      humanity: form.value.humanity,
      attributes: attributesPayload,
      skills: skillsPayload,
      disciplines: [],
      powers: [],
      meritsFlaws: [],
      backgrounds: [],
      equipments: []
    }

    await api.post('/api/character-vampires', payload)

    successMessage.value = 'Ficha Completa de Vampiro criada com sucesso no Banco! Redirecionando...'
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
