<template>
  <div class="min-h-screen demiplane-bg text-parchment font-sans relative overflow-x-hidden selection:bg-blood-red selection:text-white pb-20">
    <!-- SUBTLE NOISE/TEXTURE -->
    <div class="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay z-0" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>

    <!-- NAVBAR -->
    <nav class="relative z-20 border-b border-vamp-border bg-black/80 backdrop-blur-md sticky top-0">
      <div class="max-w-[1200px] mx-auto px-4 h-12 flex items-center justify-between">
        <button @click="router.push(`/personagem/hub?id=${characterId}`)" class="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 font-serif uppercase tracking-widest transition-colors">
          <span>←</span> Back to Hub
        </button>

        <div class="flex items-center gap-4 text-[10px] font-serif tracking-widest uppercase">
          <span class="text-gray-500">INVENTORY & STORE</span>
        </div>
      </div>
    </nav>

    <!-- MAIN CONTENT -->
    <main class="relative z-10 max-w-[1200px] mx-auto px-4 py-8">
      <!-- HEADER & TABS -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pb-6 border-b border-vamp-border">
        <div>
          <h1 class="demiplane-title text-3xl md:text-4xl text-white">
            Inventário & Mercado Subterrâneo
          </h1>
          <h2 class="demiplane-text text-vamp-c2 mt-1">
            Armas, proteções táticas e artefatos de São Paulo.
          </h2>
        </div>

        <!-- ABAS -->
        <div class="flex bg-black/60 border border-white/10 p-1 rounded-xl">
          <button 
            @click="activeTab = 'inventario'"
            class="px-5 py-2 rounded-lg text-xs font-serif tracking-wider transition-all duration-300 flex items-center gap-2"
            :class="activeTab === 'inventario' ? 'bg-blood-red text-white shadow-lg' : 'text-gray-400 hover:text-white'"
          >
            <span>⚔️ Meu Inventário</span>
            <span class="text-[10px] bg-black/40 px-2 py-0.5 rounded-full font-mono">{{ inventoryItems.length }}</span>
          </button>

          <button 
            @click="activeTab = 'loja'"
            class="px-5 py-2 rounded-lg text-xs font-serif tracking-wider transition-all duration-300 flex items-center gap-2"
            :class="activeTab === 'loja' ? 'bg-gold text-black font-semibold shadow-lg' : 'text-gray-400 hover:text-white'"
          >
            <span>🏪 Loja de Itens</span>
            <span class="text-[10px] bg-black/40 px-2 py-0.5 rounded-full font-mono">{{ storeCatalog.length }}</span>
          </button>
        </div>
      </div>

      <!-- ABA 1: MEU INVENTÁRIO -->
      <div v-if="activeTab === 'inventario'">
        <div v-if="!inventoryItems.length" class="bg-black/60 border border-white/10 rounded-2xl p-12 text-center text-gray-400 font-serif">
          <div class="text-3xl mb-2">🎒</div>
          Seu inventário está vazio no momento.<br>
          <button @click="activeTab = 'loja'" class="mt-4 px-4 py-2 bg-gold/20 border border-gold/40 text-gold text-xs rounded hover:bg-gold/30 transition-all">
            Ir para a Loja de Equipamentos
          </button>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="item in inventoryItems" 
            :key="item.definitionEquipmentId"
            class="bg-black/60 border rounded-xl p-5 backdrop-blur-md flex flex-col justify-between"
            :class="item.equipped ? 'border-blood-red/80 bg-blood-red/5' : 'border-white/10'"
          >
            <div>
              <div class="flex justify-between items-start mb-2">
                <span class="text-[10px] font-serif uppercase tracking-widest text-gold-dim">
                  {{ item.DefinitionEquipment?.type }}
                </span>
                <span 
                  class="text-[10px] font-serif uppercase tracking-wider px-2 py-0.5 rounded-full border"
                  :class="item.equipped ? 'bg-blood-red/20 border-blood-red text-blood-red' : 'bg-white/5 border-white/10 text-gray-400'"
                >
                  {{ item.equipped ? 'Equipado' : 'No Abrigo' }}
                </span>
              </div>

              <h3 class="font-serif text-lg text-parchment font-semibold mb-1">
                {{ item.DefinitionEquipment?.name }}
              </h3>
              <p class="text-xs text-gray-400 italic mb-4 leading-relaxed line-clamp-2">
                {{ item.DefinitionEquipment?.description }}
              </p>

              <!-- ATRIBUTOS DO EQUIPAMENTO -->
              <div class="grid grid-cols-2 gap-2 text-[11px] bg-black/40 p-2.5 rounded border border-white/5 text-gray-300 mb-4 font-mono">
                <div v-if="item.DefinitionEquipment?.damage">Dano: <strong class="text-blood-red">{{ item.DefinitionEquipment.damage }}</strong></div>
                <div v-if="item.DefinitionEquipment?.armorLevel">Proteção: <strong class="text-gold">{{ item.DefinitionEquipment.armorLevel }}</strong></div>
                <div>Qtd: <strong>{{ item.quantity }}</strong></div>
                <div v-if="item.DefinitionEquipment?.cost">Custo: <strong>{{ item.DefinitionEquipment.cost }}</strong></div>
              </div>
            </div>

            <!-- BOTÃO DE EQUIPAR/DESEQUIPAR -->
            <button 
              @click="toggleEquip(item)"
              class="w-full py-1.5 px-3 text-xs font-serif uppercase tracking-wider rounded border transition-all"
              :class="item.equipped ? 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10' : 'bg-blood-red/80 hover:bg-blood-red border-blood-red text-white'"
            >
              {{ item.equipped ? 'Guardar no Abrigo' : 'Equipar Item' }}
            </button>
          </div>
        </div>
      </div>

      <!-- ABA 2: LOJA DE ITENS -->
      <div v-if="activeTab === 'loja'">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="item in storeCatalog" 
            :key="item.id"
            class="bg-black/60 border border-white/10 hover:border-gold/40 rounded-xl p-5 backdrop-blur-md flex flex-col justify-between transition-all duration-300 shadow-lg"
          >
            <div>
              <div class="flex justify-between items-start mb-2">
                <span class="text-[10px] font-serif uppercase tracking-widest text-gold-dim">
                  {{ item.type }}
                </span>
                <span class="text-xs font-serif font-semibold text-gold">
                  {{ item.cost || 'Grátis' }}
                </span>
              </div>

              <h3 class="font-serif text-lg text-parchment font-semibold mb-1">
                {{ item.name }}
              </h3>
              <p class="text-xs text-gray-400 italic mb-4 leading-relaxed">
                {{ item.description }}
              </p>

              <!-- ESPECIFICAÇÕES -->
              <div class="grid grid-cols-2 gap-2 text-[11px] bg-black/40 p-2.5 rounded border border-white/5 text-gray-300 mb-4 font-mono">
                <div v-if="item.damage">Dano: <strong class="text-blood-red">{{ item.damage }}</strong></div>
                <div v-if="item.armorLevel">Proteção: <strong class="text-gold">{{ item.armorLevel }}</strong></div>
                <div v-if="item.concealment">Ocultamento: <strong>{{ item.concealment }}</strong></div>
                <div v-if="item.range">Alcance: <strong>{{ item.range }}m</strong></div>
              </div>
            </div>

            <!-- BOTÃO DE ADQUIRIR -->
            <button 
              @click="buyItem(item)"
              class="w-full py-2 px-3 bg-gold/20 hover:bg-gold border border-gold/40 text-gold hover:text-black font-serif text-xs uppercase tracking-wider rounded transition-all duration-300 font-semibold"
            >
              Adquirir Equipamento
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const route = useRoute()

const activeTab = ref<'inventario' | 'loja'>('inventario')
const character = ref<any>(null)
const characterId = ref<string>('')
const inventoryItems = ref<any[]>([])
const storeCatalog = ref<any[]>([])

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
  }
}

const toggleEquip = (item: any) => {
  item.equipped = item.equipped ? 0 : 1
}

const buyItem = async (equipment: any) => {
  try {
    // Adiciona ao inventario local do personagem
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
    activeTab.value = 'inventario'
    alert(`"${equipment.name}" foi adicionado ao seu inventário!`)
  } catch (err) {
    console.error('Erro ao comprar item:', err)
  }
}

onMounted(() => {
  fetchCharacterAndInventory()
})
</script>
