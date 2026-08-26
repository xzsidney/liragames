<template>
  <div class="min-h-screen demiplane-bg text-parchment font-sans relative overflow-x-hidden selection:bg-blood-red selection:text-white pb-20">
    <!-- TEXTURA / GRAIN SUBTIL -->
    <div class="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay z-0" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>

    <!-- NAVBAR -->
    <nav class="relative z-20 border-b border-vamp-border bg-black/85 backdrop-blur-md sticky top-0 shadow-xl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
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
        Acessando registros do Refúgio Seguro...
      </p>
    </div>

    <!-- MAIN CONTENT -->
    <main v-else class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      <!-- HEADER DO REFÚGIO -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-white/10">
        <div>
          <div class="flex items-center gap-2 text-xs font-serif uppercase tracking-widest text-gold mb-1">
            <span>🏠</span>
            <span>Propriedade Residencial do Vampiro</span>
          </div>
          <h1 class="demiplane-title text-3xl md:text-5xl text-white">
            Refúgio em {{ havenLocationName }}
          </h1>
          <h2 class="demiplane-text text-vamp-c2 mt-1.5 text-xs sm:text-sm">
            Santuário blindado contra os raios do sol e centro de comando dos seus lacaios.
          </h2>
        </div>

        <div class="flex items-center gap-3">
          <button 
            @click="router.push('/personagem/inventario?id=' + characterId)" 
            class="px-4 py-2.5 bg-gold/15 hover:bg-gold/30 border border-gold/40 text-gold text-xs font-serif uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.15)]"
          >
            <span>💼</span>
            <span>Contratar Lacaios / Arsenal</span>
          </button>
        </div>
      </div>

      <!-- GRID PRINCIPAL -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- ESQUERDA: INFRAESTRUTURA E UPGRADES (7 col) -->
        <section class="lg:col-span-7 space-y-6">
          
          <!-- CARD DE INFRAESTRUTURA DO IMÓVEL -->
          <div class="demiplane-box p-6 rounded-2xl space-y-6 bg-black/70 border border-white/10">
            <h3 class="font-serif text-sm font-bold text-parchment uppercase tracking-widest flex items-center gap-2 pb-3 border-b border-white/10">
              <span>🏗️</span>
              <span>Infraestrutura & Defesas do Refúgio</span>
            </h3>

            <!-- NÍVEL DE SEGURANÇA -->
            <div class="bg-black/50 border border-white/10 rounded-xl p-5 space-y-4">
              <div class="flex justify-between items-start">
                <div>
                  <div class="text-xs font-serif font-bold text-parchment flex items-center gap-2">
                    <span>🛡️</span>
                    <span>Segurança & Contramedidas</span>
                  </div>
                  <p class="text-xs text-stone-400 mt-1 leading-relaxed">
                    Trancas biométricas, alarmes silenciosos e blindagem contra invasões da Segunda Inquisição.
                  </p>
                </div>
                <span class="text-xs font-mono font-bold px-2.5 py-1 rounded bg-amber-950/60 border border-amber-700/50 text-gold">
                  Nível {{ haven?.securityLevel || 1 }}/5
                </span>
              </div>

              <!-- BARRA VISUAL DE NÍVEL -->
              <div class="flex gap-1.5">
                <div 
                  v-for="i in 5" 
                  :key="i"
                  class="h-2 flex-1 rounded-sm border transition-all"
                  :class="i <= (haven?.securityLevel || 1) ? 'bg-gold border-gold shadow-[0_0_8px_rgba(212,175,55,0.5)]' : 'bg-black/60 border-white/10'"
                ></div>
              </div>

              <div class="flex justify-between items-center pt-2">
                <span class="text-[11px] text-stone-400 font-mono">
                  {{ (haven?.securityLevel || 1) < 5 ? `Custo próximo nível: R$ ${((haven?.securityLevel || 1) + 1) * 3500}` : 'Defesa Máxima Atingida' }}
                </span>
                <button 
                  v-if="(haven?.securityLevel || 1) < 5"
                  @click="upgradeHaven('security')"
                  :disabled="upgrading || (character?.money || 0) < ((haven?.securityLevel || 1) + 1) * 3500"
                  class="px-3 py-1.5 rounded-lg text-xs font-serif uppercase tracking-wider transition-all font-bold"
                  :class="(character?.money || 0) >= ((haven?.securityLevel || 1) + 1) * 3500 
                    ? 'bg-gold hover:bg-gold-light text-black shadow-md' 
                    : 'bg-stone-900 border border-stone-800 text-stone-600 cursor-not-allowed'"
                >
                  <span>Reforçar Segurança</span>
                </button>
              </div>
            </div>

            <!-- NÍVEL DE LUXO E CONFORTO -->
            <div class="bg-black/50 border border-white/10 rounded-xl p-5 space-y-4">
              <div class="flex justify-between items-start">
                <div>
                  <div class="text-xs font-serif font-bold text-parchment flex items-center gap-2">
                    <span>✨</span>
                    <span>Luxo, Isolamento & Aposentos</span>
                  </div>
                  <p class="text-xs text-stone-400 mt-1 leading-relaxed">
                    Caixão selado com controle de temperatura e isolamento acústico. Acelera recuperação de Força de Vontade.
                  </p>
                </div>
                <span class="text-xs font-mono font-bold px-2.5 py-1 rounded bg-blue-950/60 border border-blue-700/50 text-cyan-400">
                  Nível {{ haven?.luxuryLevel || 1 }}/5
                </span>
              </div>

              <!-- BARRA VISUAL DE NÍVEL -->
              <div class="flex gap-1.5">
                <div 
                  v-for="i in 5" 
                  :key="i"
                  class="h-2 flex-1 rounded-sm border transition-all"
                  :class="i <= (haven?.luxuryLevel || 1) ? 'bg-cyan-500 border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.5)]' : 'bg-black/60 border-white/10'"
                ></div>
              </div>

              <div class="flex justify-between items-center pt-2">
                <span class="text-[11px] text-stone-400 font-mono">
                  {{ (haven?.luxuryLevel || 1) < 5 ? `Custo próximo nível: R$ ${((haven?.luxuryLevel || 1) + 1) * 3500}` : 'Luxo Máximo Atingido' }}
                </span>
                <button 
                  v-if="(haven?.luxuryLevel || 1) < 5"
                  @click="upgradeHaven('luxury')"
                  :disabled="upgrading || (character?.money || 0) < ((haven?.luxuryLevel || 1) + 1) * 3500"
                  class="px-3 py-1.5 rounded-lg text-xs font-serif uppercase tracking-wider transition-all font-bold"
                  :class="(character?.money || 0) >= ((haven?.luxuryLevel || 1) + 1) * 3500 
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-md' 
                    : 'bg-stone-900 border border-stone-800 text-stone-600 cursor-not-allowed'"
                >
                  <span>Reformar Aposentos</span>
                </button>
              </div>
            </div>

          </div>

          <!-- ESTOQUE DE SANGUE / GELADEIRA DO REFÚGIO -->
          <div class="demiplane-box p-6 rounded-2xl space-y-4 bg-black/70 border border-white/10">
            <h3 class="font-serif text-sm font-bold text-parchment uppercase tracking-widest flex items-center justify-between pb-3 border-b border-white/10">
              <span class="flex items-center gap-2">
                <span>🩸</span>
                <span>Geladeira Médica • Estoque de Sangue</span>
              </span>
              <span class="text-xs font-mono font-normal text-stone-400">
                Fome Atual: <strong class="text-red-400">{{ character?.hunger || 0 }}/5</strong>
              </span>
            </h3>

            <div v-if="hasRetainer('ret_medic')" class="bg-red-950/20 border border-red-900/50 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-red-900/30 border border-red-700/50 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                  🩸
                </div>
                <div>
                  <h4 class="font-serif text-sm font-bold text-red-200">Bolsas de Sangue O-Negativo Disponíveis</h4>
                  <p class="text-xs text-stone-300 mt-0.5 leading-relaxed">
                    Seu Médico Clandestino mantém o estoque refrigerado para emergências alimentares.
                  </p>
                </div>
              </div>

              <button 
                @click="consumeBloodBag"
                :disabled="consumingBlood || (character?.hunger || 0) <= 0"
                class="px-5 py-2.5 rounded-xl font-serif text-xs uppercase tracking-wider transition-all font-bold shrink-0 flex items-center gap-2"
                :class="(character?.hunger || 0) > 0 
                  ? 'bg-blood-red hover:bg-red-700 text-white shadow-[0_0_15px_rgba(185,28,28,0.4)]' 
                  : 'bg-stone-900 border border-stone-800 text-stone-600 cursor-not-allowed'"
              >
                <span v-if="consumingBlood" class="animate-spin">⏳</span>
                <span>{{ (character?.hunger || 0) > 0 ? '🩸 Alimentar-se (-1 Fome)' : '✔ Fome Saciada (0)' }}</span>
              </button>
            </div>

            <div v-else class="p-6 text-center text-xs text-stone-400 font-serif italic border border-white/5 rounded-xl bg-black/40 space-y-2">
              <div>🏥 Geladeira médica sem suprimentos.</div>
              <p class="text-[11px] text-stone-500 font-sans">
                Contrate um <strong>Médico Clandestino (Biólogo)</strong> no Mercado Negro para manter o refúgio abastecido com bolsas de sangue.
              </p>
            </div>
          </div>

        </section>

        <!-- DIREITA: LACAIOS & COFRE DE ARSENAL (5 col) -->
        <section class="lg:col-span-5 space-y-6">
          
          <!-- LACAIOS A SERVIÇO DO REFÚGIO -->
          <div class="demiplane-box p-6 rounded-2xl space-y-4 bg-black/70 border border-white/10">
            <div class="flex justify-between items-center pb-3 border-b border-white/10">
              <h3 class="font-serif text-sm font-bold text-cyan-300 uppercase tracking-widest flex items-center gap-2">
                <span>👥</span>
                <span>Lacaios & Guardas</span>
              </h3>
              <span class="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                {{ activeRetainersList.length }} Ativos
              </span>
            </div>

            <div v-if="activeRetainersList.length" class="space-y-3">
              <div 
                v-for="ret in activeRetainersList" 
                :key="ret.id"
                class="bg-black/60 border border-cyan-500/30 rounded-xl p-4 flex items-center gap-3.5 shadow-md"
              >
                <div class="w-10 h-10 rounded-lg bg-black/80 border border-cyan-500/40 flex items-center justify-center text-xl shrink-0">
                  {{ ret.icon }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <h4 class="font-serif text-xs font-bold text-parchment truncate">{{ ret.name }}</h4>
                    <span class="text-[9px] font-mono text-cyan-400 uppercase">Ativo</span>
                  </div>
                  <p class="text-[10px] text-cyan-300 font-mono mt-0.5">{{ ret.bonusLabel }}</p>
                </div>
              </div>
            </div>

            <div v-else class="p-6 text-center text-xs text-stone-500 font-serif italic border border-white/5 rounded-xl bg-black/40 space-y-3">
              <p>Nenhum lacaio contratado guardando o refúgio.</p>
              <button 
                @click="router.push('/personagem/inventario?id=' + characterId)" 
                class="px-4 py-2 bg-cyan-950 hover:bg-cyan-600 border border-cyan-500/40 text-cyan-300 hover:text-black font-serif text-[11px] uppercase tracking-wider rounded-lg transition-all font-bold"
              >
                Recrutar Especialistas
              </button>
            </div>
          </div>

          <!-- COFRE DE ARMAS GUARDADAS -->
          <div class="demiplane-box p-6 rounded-2xl space-y-4 bg-black/70 border border-white/10">
            <div class="flex justify-between items-center pb-3 border-b border-white/10">
              <h3 class="font-serif text-sm font-bold text-parchment uppercase tracking-widest flex items-center gap-2">
                <span>🎒</span>
                <span>Cofre de Armas & Itens</span>
              </h3>
              <span class="text-xs font-mono text-stone-400">
                {{ unequippedItems.length }} Guardados
              </span>
            </div>

            <div v-if="unequippedItems.length" class="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              <div 
                v-for="item in unequippedItems" 
                :key="item.id"
                class="bg-black/60 border border-white/10 rounded-xl p-3.5 flex items-center justify-between gap-3 hover:border-white/20 transition-colors"
              >
                <div>
                  <div class="font-serif text-xs font-bold text-stone-200">{{ item.DefinitionEquipment?.name }}</div>
                  <div class="text-[10px] font-mono text-stone-400">
                    <span v-if="item.DefinitionEquipment?.damage" class="text-red-400 mr-2">Dano: {{ item.DefinitionEquipment.damage }}</span>
                    <span v-if="item.DefinitionEquipment?.armorLevel" class="text-gold">Proteção: {{ item.DefinitionEquipment.armorLevel }}</span>
                  </div>
                </div>

                <button 
                  @click="toggleEquip(item)"
                  class="px-3 py-1 bg-blood-red/80 hover:bg-blood-red text-white text-[10px] font-serif uppercase tracking-wider rounded font-bold transition-all shrink-0 shadow"
                >
                  Equipar
                </button>
              </div>
            </div>

            <div v-else class="p-6 text-center text-xs text-stone-500 font-serif italic border border-white/5 rounded-xl bg-black/40">
              Nenhum item reserva no cofre.
            </div>
          </div>

        </section>

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

const character = ref<any>(null)
const haven = ref<any>(null)
const characterId = ref<string>('')
const inventoryItems = ref<any[]>([])
const loading = ref(true)
const upgrading = ref(false)
const consumingBlood = ref(false)

const allRetainers = [
  {
    id: 'ret_guard',
    name: 'Guarda-Costas Ex-Militar (Capanga)',
    role: 'Segurança do Refúgio',
    icon: '🛡️',
    cost: 5000,
    bonusLabel: '+2 Dados em Defesa & Proteção',
    description: 'Um veterano treinado que patrulha os arredores do seu refúgio.'
  },
  {
    id: 'ret_hacker',
    name: 'Operador de Cibersegurança (Hacker)',
    role: 'Especialista em TI',
    icon: '💻',
    cost: 8000,
    bonusLabel: '+2 Dados em Tecnologia & Investigação',
    description: 'Monitora os canais da polícia e blindagem da Máscara.'
  },
  {
    id: 'ret_medic',
    name: 'Médico Clandestino (Biólogo)',
    role: 'Fornecedor de Sangue',
    icon: '🩸',
    cost: 12000,
    bonusLabel: 'Fornece Bolsas de Sangue O- no Refúgio',
    description: 'Permite estocar bolsas de sangue no refúgio para emergências.'
  },
  {
    id: 'ret_driver',
    name: 'Piloto de Fuga (Motorista Ghoul)',
    role: 'Transporte & Trânsito',
    icon: '🚗',
    cost: 6000,
    bonusLabel: 'Reduz Tempo de Trânsito no Mapa em 50%',
    description: 'Conhece rotas clandestinas e vias expressas de Nocturna.'
  }
]

const havenLocationName = computed(() => {
  return haven.value?.DefinitionLocation?.name || character.value?.Haven?.DefinitionLocation?.name || 'Belenzinho'
})

const activeRetainersList = computed(() => {
  const retainersKeys = haven.value?.attributes?.retainers || []
  return allRetainers.filter(r => retainersKeys.includes(r.id))
})

const hasRetainer = (retainerId: string) => {
  const retainersKeys = haven.value?.attributes?.retainers || []
  return retainersKeys.includes(retainerId)
}

const unequippedItems = computed(() => {
  return inventoryItems.value.filter(i => !i.equipped)
})

const fetchHavenData = async () => {
  try {
    const id = (route.query.id as string) || localStorage.getItem('lira_active_character_id')
    if (!id) {
      router.push('/jogador/vampire')
      return
    }
    characterId.value = id

    const res = await api.get(`/api/character-vampires/${id}`)
    character.value = res.data
    haven.value = res.data.Haven || {
      securityLevel: 1,
      luxuryLevel: 1,
      attributes: { retainers: [] }
    }
    inventoryItems.value = res.data.CharacterVampireEquipments || []
  } catch (err) {
    console.error('Erro ao buscar dados do refúgio:', err)
  } finally {
    loading.value = false
  }
}

const upgradeHaven = async (type: 'security' | 'luxury') => {
  try {
    upgrading.value = true
    const res = await api.post(`/api/character-vampires/${characterId.value}/haven/upgrade`, { type })
    
    haven.value = res.data.haven
    if (res.data.newMoney !== undefined) {
      character.value.money = res.data.newMoney
    }

    notifySuccess('Refúgio Aprimorado!', res.data.message)
  } catch (err: any) {
    notifyError('Falha no Upgrade', err.response?.data?.error || 'Erro ao aprimorar refúgio.')
  } finally {
    upgrading.value = false
  }
}

const consumeBloodBag = async () => {
  try {
    consumingBlood.value = true
    const res = await api.post(`/api/character-vampires/${characterId.value}/haven/consume-blood`)
    
    if (res.data.hunger !== undefined) {
      character.value.hunger = res.data.hunger
    }

    notifySuccess('Sangue Consumido', res.data.message)
  } catch (err: any) {
    notifyError('Erro ao Consumir', err.response?.data?.error || 'Não foi possível consumir a bolsa de sangue.')
  } finally {
    consumingBlood.value = false
  }
}

const toggleEquip = async (item: any) => {
  try {
    const res = await api.put(`/api/character-vampires/${characterId.value}/equipments/${item.definitionEquipmentId}/equip`)
    item.equipped = res.data.equipped ? 1 : 0
    notifySuccess('Item Equipado', `"${item.DefinitionEquipment?.name}" está pronto para combate.`)
  } catch (err) {
    notifyError('Erro no Arsenal', 'Não foi possível alterar o status do equipamento.')
  }
}

onMounted(() => {
  fetchHavenData()
})
</script>
