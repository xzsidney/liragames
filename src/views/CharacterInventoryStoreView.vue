<template>
  <div class="min-h-screen demiplane-bg text-parchment font-sans relative overflow-x-hidden selection:bg-blood-red selection:text-white pb-20">
    <!-- TEXTURA / GRAIN SUBTIL -->
    <div class="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay z-0" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>

    <!-- NAVBAR COM SALDO EM CARTEIRA -->
    <nav class="relative z-20 border-b border-vamp-border bg-black/85 backdrop-blur-md sticky top-0 shadow-xl">
      <div class="max-w-[1200px] mx-auto px-4 h-14 flex items-center justify-between">
        <button @click="router.push(`/personagem/hub?id=${characterId}`)" class="text-xs text-stone-400 hover:text-gold flex items-center gap-1.5 font-serif uppercase tracking-widest transition-colors">
          <span>&larr;</span> Voltar ao Hub
        </button>

        <div class="flex items-center gap-4">
          <div v-if="character" class="flex items-center gap-3">
            <span class="text-xs text-stone-400 font-serif hidden sm:inline">{{ character.name }}</span>
            <div class="flex items-center gap-1.5 bg-black/70 px-3 py-1 rounded-lg border border-green-700/50 shadow-inner font-mono text-xs text-green-400 font-bold">
              <span>💵</span>
              <span>R$ {{ Number(character.money || 0).toLocaleString('pt-BR') }}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- LOADING STATE -->
    <div v-if="loading" class="flex flex-col items-center justify-center min-h-[70vh] relative z-10 space-y-4">
      <div class="animate-spin w-12 h-12 border-2 border-amber-900 border-t-gold rounded-full shadow-[0_0_20px_rgba(212,175,55,0.3)]"></div>
      <p class="text-gold font-serif text-xs tracking-widest uppercase animate-pulse">
        Acessando redes criptografadas do Mercado Negro...
      </p>
    </div>

    <!-- MAIN CONTENT -->
    <main v-else class="relative z-10 max-w-[1200px] mx-auto px-4 py-8 space-y-8">
      
      <!-- HEADER -->
      <div class="space-y-6 pb-6 border-b border-white/10">
        <div>
          <h1 class="demiplane-title text-3xl md:text-5xl text-white">
            Mercado Subterrâneo & Arsenal
          </h1>
          <h2 class="demiplane-text text-vamp-c2 mt-1.5 text-xs sm:text-sm">
            Armas pesadas, blindagens táticas e contratação de especialistas em Nocturna.
          </h2>
        </div>

        <!-- AS 3 ABAS NA MESMA LINHA ABAIXO DO NOME -->
        <div class="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1">
          <button 
            @click="activeTab = 'inventario'"
            class="px-5 py-2.5 rounded-xl text-xs font-serif tracking-wider transition-all duration-300 flex items-center gap-2 shrink-0 border"
            :class="activeTab === 'inventario' ? 'bg-blood-red border-blood-red text-white shadow-[0_0_15px_rgba(185,28,28,0.4)]' : 'bg-black/60 border-white/10 text-stone-400 hover:text-white hover:border-white/20'"
          >
            <span>⚔️ Meu Inventário</span>
            <span class="text-[10px] bg-black/50 px-2 py-0.5 rounded-full font-mono">{{ inventoryItems.length }}</span>
          </button>

          <button 
            @click="activeTab = 'loja'"
            class="px-5 py-2.5 rounded-xl text-xs font-serif tracking-wider transition-all duration-300 flex items-center gap-2 shrink-0 border"
            :class="activeTab === 'loja' ? 'bg-gold border-gold text-black font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)]' : 'bg-black/60 border-white/10 text-stone-400 hover:text-white hover:border-white/20'"
          >
            <span>🏪 Mercado Negro</span>
            <span class="text-[10px] bg-black/50 px-2 py-0.5 rounded-full font-mono">{{ storeCatalog.length }}</span>
          </button>

          <button 
            @click="activeTab = 'lacaios'"
            class="px-5 py-2.5 rounded-xl text-xs font-serif tracking-wider transition-all duration-300 flex items-center gap-2 shrink-0 border"
            :class="activeTab === 'lacaios' ? 'bg-cyan-600 border-cyan-500 text-black font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'bg-black/60 border-white/10 text-stone-400 hover:text-white hover:border-white/20'"
          >
            <span>👥 Lacaios & Contatos</span>
            <span class="text-[10px] bg-black/50 px-2 py-0.5 rounded-full font-mono">4</span>
          </button>
        </div>
      </div>

      <!-- ========================================================================= -->
      <!-- ABA 1: MEU INVENTÁRIO -->
      <!-- ========================================================================= -->
      <div v-if="activeTab === 'inventario'" class="space-y-6 animate-fade-in">
        <div v-if="!inventoryItems.length" class="bg-black/60 border border-white/10 rounded-2xl p-12 text-center text-stone-400 font-serif space-y-4">
          <div class="text-4xl">🎒</div>
          <p class="text-sm">Seu arsenal está vazio no momento. Nenhuma arma ou blindagem adquirida.</p>
          <button @click="activeTab = 'loja'" class="px-5 py-2.5 bg-gold hover:bg-gold-light text-black font-bold text-xs uppercase tracking-widest rounded transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)]">
            Explorar Mercado Negro
          </button>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="item in inventoryItems" 
            :key="item.id || item.definitionEquipmentId"
            class="bg-black/70 border rounded-xl p-5 backdrop-blur-md flex flex-col justify-between transition-all duration-300 hover:border-gold/30 shadow-lg space-y-4"
            :class="item.equipped ? 'border-blood-red/80 bg-blood-red/10 shadow-[0_0_20px_rgba(185,28,28,0.2)]' : 'border-white/10'"
          >
            <div>
              <div class="flex justify-between items-start mb-2">
                <span class="text-[10px] font-serif uppercase tracking-widest text-gold-dim">
                  {{ getItemCategoryLabel(item.DefinitionEquipment?.type) }}
                </span>
                <span 
                  class="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border font-bold"
                  :class="item.equipped ? 'bg-blood-red/30 border-blood-red text-blood-bright' : 'bg-stone-900 border-stone-700 text-stone-400'"
                >
                  {{ item.equipped ? '✔ Equipado em Campo' : '📦 No Refúgio' }}
                </span>
              </div>

              <!-- CARD HEADER COM ÍCONE -->
              <div class="flex items-center gap-3 my-2">
                <div class="w-10 h-10 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center text-xl shadow-inner shrink-0">
                  {{ getItemIcon(item.DefinitionEquipment?.type) }}
                </div>
                <div>
                  <h3 class="font-serif text-base text-parchment font-bold">{{ item.DefinitionEquipment?.name }}</h3>
                  <div class="text-[10px] font-mono text-stone-400">Quantidade: {{ item.quantity }} un.</div>
                </div>
              </div>

              <p class="text-xs text-stone-400 italic mb-4 leading-relaxed line-clamp-2">
                {{ item.DefinitionEquipment?.description }}
              </p>

              <!-- ESPECIFICAÇÕES TÁTICAS -->
              <div class="grid grid-cols-2 gap-2 text-[11px] bg-black/40 p-2.5 rounded-lg border border-white/5 text-stone-300 font-mono">
                <div v-if="item.DefinitionEquipment?.damage">Dano: <strong class="text-red-400">{{ item.DefinitionEquipment.damage }}</strong></div>
                <div v-if="item.DefinitionEquipment?.armorLevel">Proteção: <strong class="text-gold">{{ item.DefinitionEquipment.armorLevel }}</strong></div>
                <div v-if="item.DefinitionEquipment?.range">Alcance: <strong>{{ item.DefinitionEquipment.range }}m</strong></div>
                <div v-if="item.DefinitionEquipment?.concealment">Ocultamento: <strong>{{ item.DefinitionEquipment.concealment }}</strong></div>
              </div>
            </div>

            <!-- BOTÃO DE EQUIPAR/DESEQUIPAR -->
            <button 
              @click="toggleEquip(item)"
              class="w-full py-2 px-3 text-xs font-serif uppercase tracking-wider rounded border transition-all font-bold"
              :class="item.equipped ? 'bg-white/5 border-white/20 text-stone-300 hover:bg-white/10' : 'bg-blood-red/80 hover:bg-blood-red border-blood-red text-white shadow-[0_0_15px_rgba(185,28,28,0.3)]'"
            >
              {{ item.equipped ? 'Guardar no Refúgio' : '⚔️ Equipar para Combate' }}
            </button>
          </div>
        </div>
      </div>

      <!-- ========================================================================= -->
      <!-- ABA 2: MERCADO NEGRO (LOJA DE EQUIPAMENTOS) -->
      <!-- ========================================================================= -->
      <div v-if="activeTab === 'loja'" class="space-y-6 animate-fade-in">
        
        <!-- BARRA DE PESQUISA & FILTRO POR CATEGORIA -->
        <div class="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-black/50 p-3 rounded-xl border border-white/10">
          
          <div class="relative flex-1">
            <input 
              v-model="storeSearch" 
              type="text" 
              placeholder="🔍 Buscar armas, blindagens ou equipamentos..." 
              class="w-full bg-black/80 border border-white/15 focus:border-gold rounded-lg px-3.5 py-2 text-xs text-parchment placeholder-stone-500 font-sans outline-none transition-all pr-8"
            />
            <button v-if="storeSearch" @click="storeSearch = ''" class="absolute right-2.5 top-2 text-stone-400 hover:text-white text-xs font-bold">✕</button>
          </div>

          <!-- FILTROS POR CATEGORIA -->
          <div class="flex flex-wrap items-center gap-1 text-[11px] font-mono">
            <button 
              @click="storeCategory = 'ALL'"
              class="px-3 py-1.5 rounded-lg transition-all"
              :class="storeCategory === 'ALL' ? 'bg-gold text-black font-bold' : 'bg-black/60 text-stone-400 border border-white/10 hover:text-white'"
            >
              Todas
            </button>
            <button 
              @click="storeCategory = 'ARMA_FOGO'"
              class="px-3 py-1.5 rounded-lg transition-all"
              :class="storeCategory === 'ARMA_FOGO' ? 'bg-gold text-black font-bold' : 'bg-black/60 text-stone-400 border border-white/10 hover:text-white'"
            >
              🔫 Fogo
            </button>
            <button 
              @click="storeCategory = 'ARMA_BRANCA'"
              class="px-3 py-1.5 rounded-lg transition-all"
              :class="storeCategory === 'ARMA_BRANCA' ? 'bg-gold text-black font-bold' : 'bg-black/60 text-stone-400 border border-white/10 hover:text-white'"
            >
              🗡️ Brancas
            </button>
            <button 
              @click="storeCategory = 'ARMADURA'"
              class="px-3 py-1.5 rounded-lg transition-all"
              :class="storeCategory === 'ARMADURA' ? 'bg-gold text-black font-bold' : 'bg-black/60 text-stone-400 border border-white/10 hover:text-white'"
            >
              🛡️ Armaduras
            </button>
          </div>
        </div>

        <!-- GRADE DE PRODUTOS -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="item in filteredCatalog" 
            :key="item.id"
            class="bg-black/70 border border-white/10 hover:border-gold/50 rounded-xl p-5 backdrop-blur-md flex flex-col justify-between transition-all duration-300 shadow-lg space-y-4 group"
          >
            <div>
              <div class="flex justify-between items-start mb-2">
                <span class="text-[10px] font-serif uppercase tracking-widest text-gold-dim">
                  {{ getItemCategoryLabel(item.type) }}
                </span>
                <span class="text-xs font-mono font-bold text-green-400 bg-green-950/40 px-2.5 py-0.5 rounded border border-green-700/40">
                  R$ {{ getNumericPrice(item).toLocaleString('pt-BR') }}
                </span>
              </div>

              <!-- CARD HEADER COM ÍCONE -->
              <div class="flex items-center gap-3 my-2">
                <div class="w-12 h-12 rounded-xl bg-black/80 border border-white/15 flex items-center justify-center text-2xl shadow-inner shrink-0 group-hover:border-gold/60 group-hover:scale-105 transition-all">
                  {{ getItemIcon(item.type) }}
                </div>
                <div>
                  <h3 class="font-serif text-base text-parchment font-bold">{{ item.name }}</h3>
                  <div class="text-[10px] font-mono text-stone-400">{{ item.clip ? `Carregador: ${item.clip}` : (item.armorPenalty ? `Penalidade: ${item.armorPenalty}` : 'Pronto para uso') }}</div>
                </div>
              </div>

              <p class="text-xs text-stone-400 italic mb-4 leading-relaxed line-clamp-2">
                {{ item.description }}
              </p>

              <!-- ESPECIFICAÇÕES -->
              <div class="grid grid-cols-2 gap-2 text-[11px] bg-black/40 p-2.5 rounded-lg border border-white/5 text-stone-300 font-mono">
                <div v-if="item.damage">Dano: <strong class="text-red-400">{{ item.damage }}</strong></div>
                <div v-if="item.armorLevel">Proteção: <strong class="text-gold">{{ item.armorLevel }}</strong></div>
                <div v-if="item.range">Alcance: <strong>{{ item.range }}m</strong></div>
                <div v-if="item.concealment">Ocultamento: <strong>{{ item.concealment }}</strong></div>
              </div>
            </div>

            <!-- BOTÃO DE COMPRA -->
            <button 
              @click="buyItem(item)"
              :disabled="buyingId === item.id || (character?.money || 0) < getNumericPrice(item)"
              class="w-full py-2.5 px-3 rounded-lg font-serif text-xs uppercase tracking-wider transition-all duration-300 font-bold flex items-center justify-center gap-2"
              :class="(character?.money || 0) >= getNumericPrice(item) 
                ? 'bg-gold/20 hover:bg-gold border border-gold/50 text-gold hover:text-black shadow-[0_0_15px_rgba(212,175,55,0.2)]' 
                : 'bg-stone-900 border border-stone-800 text-stone-600 cursor-not-allowed'"
            >
              <span v-if="buyingId === item.id" class="animate-spin">⏳</span>
              <span>{{ (character?.money || 0) >= getNumericPrice(item) ? '💵 Comprar Equipamento' : '⛔ Saldo Insuficiente' }}</span>
            </button>
          </div>
        </div>

        <div v-if="!filteredCatalog.length" class="p-8 text-center text-xs text-stone-500 font-serif italic border border-white/5 rounded-xl bg-black/20">
          Nenhum equipamento encontrado com os filtros selecionados.
        </div>
      </div>

      <!-- ========================================================================= -->
      <!-- ABA 3: SINDICATO DE LACAIOS & ESPECIALISTAS (RETAINERS) -->
      <!-- ========================================================================= -->
      <div v-if="activeTab === 'lacaios'" class="space-y-6 animate-fade-in">
        
        <div class="border border-cyan-500/30 bg-cyan-950/20 p-5 rounded-xl flex items-start gap-4">
          <div class="text-3xl">👥</div>
          <div class="space-y-1">
            <h3 class="font-serif text-sm font-bold text-cyan-300 uppercase tracking-wider">Rede de Lacaios Mortais & Especialistas (V5 Retainers)</h3>
            <p class="text-xs text-stone-300 leading-relaxed font-sans">
              Contrate humanos leais sob juramento de sangue (*Ghouls*) ou mercenários do submundo para fortalecer seu refúgio e conceder bônus estratégicos permanentes.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            v-for="lacaio in hireableRetainers" 
            :key="lacaio.id"
            class="bg-black/70 border border-white/10 hover:border-cyan-500/50 rounded-xl p-5 backdrop-blur-md flex flex-col justify-between transition-all duration-300 shadow-lg space-y-4"
          >
            <div>
              <div class="flex justify-between items-start mb-2">
                <span class="text-[10px] font-serif uppercase tracking-widest text-cyan-400">
                  {{ lacaio.role }}
                </span>
                <span class="text-xs font-mono font-bold text-green-400 bg-green-950/40 px-2.5 py-0.5 rounded border border-green-700/40">
                  R$ {{ lacaio.cost.toLocaleString('pt-BR') }}
                </span>
              </div>

              <div class="flex items-center gap-3 my-2">
                <div class="w-12 h-12 rounded-xl bg-black/80 border border-cyan-500/30 flex items-center justify-center text-2xl shadow-inner shrink-0">
                  {{ lacaio.icon }}
                </div>
                <div>
                  <h3 class="font-serif text-base text-parchment font-bold">{{ lacaio.name }}</h3>
                  <div class="text-[10px] font-mono text-cyan-300">{{ lacaio.bonusLabel }}</div>
                </div>
              </div>

              <p class="text-xs text-stone-400 leading-relaxed">
                {{ lacaio.description }}
              </p>
            </div>

            <button 
              @click="hireRetainer(lacaio)"
              :disabled="(character?.money || 0) < lacaio.cost"
              class="w-full py-2.5 px-3 rounded-lg font-serif text-xs uppercase tracking-wider transition-all duration-300 font-bold flex items-center justify-center gap-2"
              :class="(character?.money || 0) >= lacaio.cost 
                ? 'bg-cyan-950 hover:bg-cyan-600 border border-cyan-500/50 text-cyan-300 hover:text-black shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                : 'bg-stone-900 border border-stone-800 text-stone-600 cursor-not-allowed'"
            >
              <span>{{ (character?.money || 0) >= lacaio.cost ? '🤝 Contratar Especialista' : '⛔ Saldo Insuficiente' }}</span>
            </button>
          </div>
        </div>

      </div>

    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../services/api'
import { notifySuccess, notifyError } from '../utils/gothicAlerts'

const router = useRouter()
const route = useRoute()

const activeTab = ref<'inventario' | 'loja' | 'lacaios'>('inventario')
const character = ref<any>(null)
const characterId = ref<string>('')
const inventoryItems = ref<any[]>([])
const storeCatalog = ref<any[]>([])
const loading = ref(true)
const buyingId = ref<string | null>(null)

// Filtros da Loja
const storeSearch = ref('')
const storeCategory = ref('ALL')

// LACAIOS CONTRATÁVEIS (CANÔNICOS V5)
const hireableRetainers = ref([
  {
    id: 'ret_guard',
    name: 'Guarda-Costas Ex-Militar (Capanga)',
    role: 'Segurança do Refúgio',
    icon: '🛡️',
    cost: 5000,
    bonusLabel: '+2 Dados em Defesa & Proteção',
    description: 'Um veterano treinado que patrulha os arredores do seu refúgio, alertando contra invasores mortais e da Inquisição.'
  },
  {
    id: 'ret_hacker',
    name: 'Operador de Cibersegurança (Hacker)',
    role: 'Especialista em TI',
    icon: '💻',
    cost: 8000,
    bonusLabel: '+2 Dados em Tecnologia & Investigação',
    description: 'Monitora os canais da polícia e apaga registros de câmeras de vigilância para blindar a Máscara do seu vampiro.'
  },
  {
    id: 'ret_medic',
    name: 'Médico Clandestino (Biólogo)',
    role: 'Fornecedor de Sangue',
    icon: '🩸',
    cost: 12000,
    bonusLabel: 'Fornece Bolsas de Sangue O- no Refúgio',
    description: 'Acesso a bancos de sangue de hospitais particulares. Permite estocar bolsas de sangue no refúgio para emergências.'
  },
  {
    id: 'ret_driver',
    name: 'Piloto de Fuga (Motorista Ghoul)',
    role: 'Transporte & Trânsito',
    icon: '🚗',
    cost: 6000,
    bonusLabel: 'Reduz Tempo de Trânsito no Mapa em 50%',
    description: 'Conhece rotas clandestinas e vias expressas de Nocturna, permitindo cruzar distritos rapidamente antes do amanhecer.'
  }
])

const getNumericPrice = (item: any): number => {
  if (!item.cost) return 300
  const cleanNum = item.cost.replace(/\D/g, '')
  if (cleanNum && parseInt(cleanNum, 10) > 0) {
    return parseInt(cleanNum, 10)
  }
  const dotCount = (item.cost.match(/●/g) || []).length
  if (dotCount === 1) return 500
  if (dotCount === 2) return 1500
  if (dotCount === 3) return 4000
  if (dotCount === 4) return 10000
  if (dotCount >= 5) return 25000
  return 300
}

const getItemIcon = (type: string = '') => {
  if (type === 'ARMA_FOGO') return '🔫'
  if (type === 'ARMA_BRANCA') return '🗡️'
  if (type === 'ARMADURA') return '🛡️'
  if (type === 'EXPLOSIVO') return '💣'
  return '📦'
}

const getItemCategoryLabel = (type: string = '') => {
  if (type === 'ARMA_FOGO') return 'Arma de Fogo'
  if (type === 'ARMA_BRANCA') return 'Arma Branca'
  if (type === 'ARMADURA') return 'Proteção / Armadura'
  if (type === 'EXPLOSIVO') return 'Explosivo / Tático'
  return 'Equipamento'
}

const filteredCatalog = computed(() => {
  let list = [...storeCatalog.value]

  if (storeCategory.value !== 'ALL') {
    list = list.filter(item => item.type === storeCategory.value)
  }

  if (storeSearch.value.trim()) {
    const q = storeSearch.value.toLowerCase().trim()
    list = list.filter(item => 
      (item.name && item.name.toLowerCase().includes(q)) ||
      (item.description && item.description.toLowerCase().includes(q))
    )
  }

  return list
})

const fetchCharacterAndInventory = async () => {
  try {
    const id = (route.query.id as string) || localStorage.getItem('lira_active_character_id')
    if (!id) {
      router.push('/jogador/vampire')
      return
    }
    characterId.value = id
    localStorage.setItem('lira_active_character_id', id)

    const resChar = await api.get(`/api/character-vampires/${id}`)
    character.value = resChar.data
    inventoryItems.value = resChar.data.CharacterVampireEquipments || []

    const resCatalog = await api.get('/api/definition-equipments')
    storeCatalog.value = resCatalog.data || []
  } catch (err) {
    console.error('Erro ao buscar inventario:', err)
  } finally {
    loading.value = false
  }
}

const toggleEquip = async (item: any) => {
  try {
    const res = await api.put(`/api/character-vampires/${characterId.value}/equipments/${item.definitionEquipmentId}/equip`)
    item.equipped = res.data.equipped ? 1 : 0
    notifySuccess(
      item.equipped ? 'Item Equipado' : 'Guardado no Refúgio',
      `"${item.DefinitionEquipment?.name}" está ${item.equipped ? 'pronto para combate na rua' : 'armazenado com segurança no refúgio'}.`
    )
  } catch (err) {
    console.error('Erro ao equipar:', err)
    notifyError('Erro no Arsenal', 'Não foi possível alterar o status do equipamento.')
  }
}

const buyItem = async (equipment: any) => {
  try {
    buyingId.value = equipment.id
    const res = await api.post(`/api/character-vampires/${characterId.value}/equipments`, {
      definitionEquipmentId: equipment.id
    })
    
    // Atualiza saldo de dinheiro em carteira
    if (res.data.newMoney !== undefined) {
      character.value.money = res.data.newMoney
    }

    // Atualiza o inventário local
    const existing = inventoryItems.value.find(i => i.definitionEquipmentId === equipment.id)
    if (existing) {
      existing.quantity += 1
    } else {
      inventoryItems.value.push({
        characterVampireId: characterId.value,
        definitionEquipmentId: equipment.id,
        quantity: 1,
        equipped: 0,
        DefinitionEquipment: equipment
      })
    }

    notifySuccess(
      'Compra Concluída!',
      res.data.message || `"${equipment.name}" foi adicionado ao seu arsenal!`
    )
  } catch (err: any) {
    console.error('Erro ao comprar item:', err)
    notifyError('Falha na Compra', err.response?.data?.error || 'Erro ao processar a compra de equipamento.')
  } finally {
    buyingId.value = null
  }
}

const hireRetainer = async (lacaio: any) => {
  if ((character.value?.money || 0) < lacaio.cost) {
    notifyError('Saldo Insuficiente', 'Você não possui dinheiro suficiente para contratar este lacaio.')
    return
  }

  try {
    const newMoney = Math.max(0, (character.value.money || 0) - lacaio.cost)
    await api.put(`/api/character-vampires/${characterId.value}`, {
      money: newMoney
    })
    character.value.money = newMoney

    notifySuccess(
      'Lacaio Contratado!',
      `"${lacaio.name}" agora presta serviços jurados ao seu refúgio!`
    )
  } catch (err) {
    notifyError('Erro na Contratação', 'Não foi possível formalizar o pacto de sangue com o lacaio.')
  }
}

onMounted(() => {
  fetchCharacterAndInventory()
})
</script>
