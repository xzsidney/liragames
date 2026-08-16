<template>
  <div class="min-h-screen demiplane-bg text-parchment font-sans relative overflow-x-hidden selection:bg-vamp-c2 selection:text-white pb-20">
    <!-- NOISE / TEXTURE -->
    <div class="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay z-0" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>

    <!-- NAVBAR -->
    <nav class="relative z-20 border-b border-vamp-border bg-black/80 backdrop-blur-md sticky top-0">
      <div class="max-w-[1200px] mx-auto px-4 h-12 flex items-center justify-between">
        <button @click="router.push(`/personagem/hub?id=${characterId}`)" class="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 font-serif uppercase tracking-widest transition-colors">
          <span>←</span> Voltar ao Hub
        </button>

        <div class="flex items-center gap-4 text-[10px] font-serif tracking-widest uppercase">
          <span class="text-gray-500">VISUALIZANDO FICHA</span>
          <button class="border border-vamp-border hover:bg-white/5 text-gray-400 px-3 py-1 rounded transition-colors">SALVAR CÓPIA</button>
        </div>
      </div>
    </nav>

    <!-- LOADING STATE -->
    <div v-if="loading" class="relative z-10 max-w-[1200px] mx-auto px-6 py-20 text-center text-gray-400 font-serif">
      <div class="animate-spin w-8 h-8 border-2 border-vamp-c2 border-t-transparent rounded-full mx-auto mb-4"></div>
      Invocando dados da noite...
    </div>

    <!-- SHEET CONTENT -->
    <main v-else class="relative z-10 max-w-[1200px] mx-auto px-4 py-8">
      
      <!-- HEADER BIOGRÁFICO -->
      <div class="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 mb-8 border-b border-vamp-border/50 pb-6">
        <div class="flex items-center gap-6">
          <div class="w-20 h-24 bg-black/50 border border-vamp-border flex items-center justify-center shrink-0">
            <span class="text-4xl text-vamp-c2 font-serif opacity-80">☥</span>
          </div>
          <div>
            <h1 class="demiplane-title text-3xl md:text-4xl text-white">{{ character?.name }}</h1>
            <h2 class="demiplane-text text-vamp-c2 mt-1">
              {{ character?.DefinitionClan?.name || 'DESCONHECIDO' }} {{ character?.concept ? '— ' + character?.concept : '' }}
            </h2>
          </div>
        </div>

        <div class="flex items-center gap-6">
          <div class="text-right font-sans text-[11px] text-gray-400 uppercase tracking-widest leading-relaxed hidden sm:block">
            <div>GERAÇÃO: <span class="text-vamp-c2">{{ character?.generation }}ª</span></div>
            <div>MALDIÇÃO: <span class="text-vamp-c2">Maldição de Clã</span></div>
            <div>COMPULSÃO: <span class="text-vamp-c2">Nenhuma</span></div>
          </div>
          
          <button class="w-16 h-16 shrink-0 rounded-full bg-vamp-c2 hover:bg-red-700 flex flex-col items-center justify-center text-black font-bold uppercase tracking-widest text-[10px] shadow-[0_0_15px_rgba(192,57,43,0.5)] transition-colors border-2 border-black">
            <span>Rolar</span>
            <span class="text-[8px] opacity-70">Fome</span>
          </button>
          
          <div class="text-center shrink-0">
            <div class="text-xl font-serif text-white">{{ availableXP }}/{{ character?.experienceTotal || 0 }}</div>
            <div class="text-[10px] uppercase font-sans text-gray-500 tracking-widest">Experiência</div>
          </div>
        </div>
      </div>

      <div class="text-center mb-2">
        <span class="demiplane-title text-sm text-vamp-c1">ATRIBUTOS</span>
      </div>

      <!-- ATRIBUTOS -->
      <div class="demiplane-box p-6 mb-8 rounded-sm">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div v-for="col in attributeColumns" :key="col.title">
            <h3 class="text-[11px] font-sans text-gray-500 uppercase tracking-widest border-b border-vamp-border/50 pb-1 mb-4">{{ col.title }}</h3>
            <div class="space-y-3">
              <div v-for="attr in col.items" :key="attr.id" class="flex justify-between items-center group">
                <span class="text-xs font-sans text-gray-300 font-bold uppercase tracking-wider">{{ attr.DefinitionAttribute?.name }}</span>
                <div class="flex items-center">
                  <span v-for="dot in 5" :key="dot" :class="dot <= attr.value ? 'dot-filled' : 'dot-empty'"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center mb-2 mt-10">
        <span class="demiplane-title text-sm text-vamp-c1">PERÍCIAS</span>
      </div>

      <!-- PERÍCIAS -->
      <div class="demiplane-box p-6 mb-8 rounded-sm">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div v-for="col in skillColumns" :key="col.title">
            <h3 class="text-[11px] font-sans text-gray-500 uppercase tracking-widest border-b border-vamp-border/50 pb-1 mb-4">{{ col.title }}</h3>
            <div class="space-y-3">
              <div v-for="skill in col.items" :key="skill.id" class="flex justify-between items-center group">
                <div class="flex items-center gap-2">
                  <span class="text-[11px] font-sans text-gray-300 font-bold uppercase tracking-wider">{{ skill.DefinitionSkill?.name }}</span>
                  <span v-if="skill.specialty" class="w-4 h-4 rounded-full bg-[#1e88e5] text-white text-[9px] font-bold flex items-center justify-center cursor-help" :title="skill.specialty">S</span>
                </div>
                <div class="flex items-center">
                  <span v-for="dot in 5" :key="dot" :class="dot <= skill.value ? 'dot-filled' : 'dot-empty'"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- MEDIDORES VITAIS -->
      <div class="demiplane-box p-6 mb-8 rounded-sm flex flex-col md:flex-row items-center justify-center gap-12 font-sans relative">
        <div class="absolute top-0 text-[9px] text-vamp-border tracking-widest uppercase bg-black px-2 -translate-y-1/2">EXPANDIR</div>
        
        <!-- Esquerda (Health / Willpower) -->
        <div class="flex flex-col gap-3 text-right">
          <div class="flex items-center justify-end gap-3">
            <span class="text-[10px] text-gray-400 tracking-widest uppercase">Vitalidade <span class="text-vamp-c2 ml-1">({{character?.health || 0}})</span></span>
            <div class="flex gap-1">
               <span v-for="i in 7" :key="i" class="box-empty relative"></span>
            </div>
          </div>
          <div class="flex items-center justify-end gap-3">
            <span class="text-[10px] text-gray-400 tracking-widest uppercase">Força de Vontade <span class="text-vamp-c2 ml-1">({{character?.willpower || 0}})</span></span>
            <div class="flex gap-1">
               <span v-for="i in 6" :key="i" class="box-empty relative"></span>
            </div>
          </div>
        </div>

        <!-- Centro (Humanity / Hunger) -->
        <div class="flex flex-col gap-3 text-right">
          <div class="flex items-center justify-end gap-3">
            <span class="text-[10px] text-gray-400 tracking-widest uppercase">Humanidade <span class="text-vamp-c2 ml-1">({{character?.humanity || 7}})</span></span>
            <div class="flex gap-1">
               <span v-for="i in 10" :key="i" :class="i <= (character?.humanity || 7) ? 'box-filled' : 'box-empty'"></span>
            </div>
          </div>
          <div class="flex items-center justify-end gap-3">
            <span class="text-[10px] text-gray-400 tracking-widest uppercase">Fome <span class="text-vamp-c2 ml-1">({{character?.hunger || 1}})</span></span>
            <div class="flex gap-1">
               <span v-for="i in 5" :key="i" :class="i <= (character?.hunger || 1) ? 'box-filled' : 'box-empty'"></span>
            </div>
          </div>
        </div>

        <!-- Direita (Blood Potency / Resonance) -->
        <div class="flex flex-col gap-3 text-left">
          <div class="text-[10px] text-gray-400 tracking-widest uppercase">
            Potência de Sangue <span class="text-vamp-c2 ml-2">1</span>
          </div>
          <div class="text-[10px] text-gray-400 tracking-widest uppercase">
            Ressonância <span class="text-vamp-c2 ml-2">Nenhuma</span>
          </div>
        </div>
      </div>

      <!-- TABS NAVEGAÇÃO -->
      <div class="demiplane-box rounded-sm">
        <div class="flex overflow-x-auto border-b border-vamp-border no-scrollbar bg-vamp-border/20">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            class="px-5 py-3 font-serif text-[11px] tracking-widest whitespace-nowrap transition-colors uppercase relative"
            :class="activeTab === tab.id ? 'text-white italic' : 'text-gray-500 hover:text-gray-300'"
          >
            {{ tab.label }}
            <span v-if="activeTab === tab.id" class="absolute bottom-0 left-0 w-full h-[2px] bg-vamp-c2"></span>
          </button>
        </div>

        <!-- CONTEÚDO DAS ABAS -->
        <div class="p-6 min-h-[400px]">
          
          <!-- TAB: DISCIPLINES & POWERS -->
          <div v-if="activeTab === 'disciplines'" class="space-y-6">
            <div class="flex justify-between items-center mb-4">
              <input type="text" placeholder="Buscar Disciplinas e Poderes" class="bg-black/50 border border-vamp-border rounded text-sm px-3 py-1.5 text-white w-64 focus:outline-none focus:border-vamp-c2">
              <button class="text-[10px] text-gray-400 border border-vamp-border px-3 py-1 rounded hover:bg-white/5 uppercase">GERENCIAR</button>
            </div>
            
            <div v-if="!character?.CharacterVampireDisciplines?.length" class="text-center text-gray-500 italic py-10 font-serif">
              Nenhuma Disciplina adicionada.
            </div>

            <div v-for="disc in character?.CharacterVampireDisciplines" :key="disc.id" class="border-t border-vamp-border pt-4">
              <div class="flex items-center gap-3 mb-4">
                <span class="text-vamp-c2 text-xl font-serif">👁️</span>
                <h3 class="font-sans font-bold text-lg text-white uppercase tracking-wider">{{ disc.DefinitionDiscipline?.name }}</h3>
                <div class="flex items-center ml-2">
                  <span v-for="dot in 5" :key="dot" :class="dot <= disc.value ? 'dot-filled' : 'dot-empty'"></span>
                </div>
              </div>

              <!-- Lista de Poderes -->
              <div class="space-y-1">
                <div v-for="pow in getPowersForDiscipline(disc.definitionDisciplineId)" :key="pow.id" class="bg-black/40 border border-vamp-border p-3 flex flex-col md:flex-row items-start md:items-center gap-4 hover:border-vamp-c2/50 transition-colors">
                  <div class="w-48 shrink-0">
                    <span class="text-xs font-bold text-white uppercase tracking-wider">{{ pow.DefinitionDisciplinePower?.name }}</span>
                  </div>
                  <div class="w-32 shrink-0 text-xs text-gray-400">
                    {{ pow.DefinitionDisciplinePower?.cost || 'Free' }}
                  </div>
                  <div class="w-48 shrink-0 text-[10px] text-vamp-c2 font-bold uppercase tracking-widest">
                    {{ pow.DefinitionDisciplinePower?.dicePool || 'No Roll' }}
                  </div>
                  <div class="flex-1 text-[11px] text-gray-400 line-clamp-2">
                    {{ pow.DefinitionDisciplinePower?.description }}
                  </div>
                  <div class="text-xs font-bold text-white pl-4 border-l border-vamp-border flex items-center justify-center w-8 shrink-0">
                    {{ pow.DefinitionDisciplinePower?.level }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB: MERITS & FLAWS -->
          <div v-else-if="activeTab === 'merits'" class="space-y-6">
             <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
               <!-- Merits -->
               <div>
                  <div class="flex justify-between items-center border-b border-vamp-border pb-2 mb-4">
                    <h3 class="text-xs font-serif text-gray-400 uppercase tracking-widest">Vantagens</h3>
                    <button class="text-[10px] border border-vamp-border px-2 py-0.5 rounded text-gray-500">GERENCIAR</button>
                  </div>
                  <!-- Exemplos Estáticos Baseado na Tela (poderão ser dinâmicos depois) -->
                  <div class="bg-black/40 border border-vamp-border p-3 flex justify-between text-xs mb-2 items-center">
                    <span class="font-bold text-white uppercase">PREY EXCLUSION</span>
                    <span class="text-gray-400">Feeding</span>
                    <span class="text-vamp-c2">(O)</span>
                  </div>
                  <div class="bg-black/40 border border-vamp-border p-3 flex justify-between text-xs mb-2 items-center">
                    <span class="font-bold text-white uppercase">FOLKLORIC BANE</span>
                    <span class="text-gray-400">Mythic</span>
                    <span class="text-vamp-c2">(O)</span>
                  </div>
               </div>
               
               <!-- Backgrounds -->
               <div>
                  <div class="flex justify-between items-center border-b border-vamp-border pb-2 mb-4">
                    <h3 class="text-xs font-serif text-gray-400 uppercase tracking-widest">Antecedentes</h3>
                    <button class="text-[10px] border border-vamp-border px-2 py-0.5 rounded text-gray-500">GERENCIAR</button>
                  </div>
                  <div class="bg-black/40 border border-vamp-border p-3 flex justify-between text-xs mb-2 items-center">
                    <span class="font-bold text-white uppercase">FAME</span>
                    <div class="flex gap-1"><span class="w-2.5 h-2.5 rounded-full bg-vamp-c2"></span></div>
                  </div>
                  <div class="bg-black/40 border border-vamp-border p-3 flex justify-between text-xs mb-2 items-center">
                    <span class="font-bold text-white uppercase">HERD</span>
                    <div class="flex gap-1"><span class="w-2.5 h-2.5 rounded-full bg-vamp-c2"></span><span class="w-2.5 h-2.5 rounded-full bg-vamp-c2"></span></div>
                  </div>
               </div>
             </div>
          </div>

          <!-- TAB: COTERIE -->
          <div v-else-if="activeTab === 'coterie'" class="space-y-6">
             <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div class="space-y-4">
                  <div>
                   <label class="text-[10px] text-vamp-c2 uppercase font-bold tracking-widest">Nome</label>
                   <div class="border border-vamp-border bg-black/40 p-2 text-xs text-gray-300 min-h-[34px]">Nome da Coterie</div>
                 </div>
                 <div>
                   <label class="text-[10px] text-vamp-c2 uppercase font-bold tracking-widest">Tipo de Coterie</label>
                   <div class="border border-vamp-border bg-black/40 p-2 text-xs text-gray-300 min-h-[34px]"></div>
                 </div>
                 <div>
                   <label class="text-[10px] text-vamp-c2 uppercase font-bold tracking-widest">Princípios da Crônica</label>
                   <div class="border border-vamp-border bg-black/40 p-2 text-xs text-gray-300 min-h-[34px]"></div>
                 </div>
               </div>

               <div>
                 <div class="flex justify-between items-center mb-2">
                   <h3 class="text-xs font-serif text-vamp-c2 uppercase tracking-widest">DOMÍNIO</h3>
                   <span class="text-[10px] text-gray-500">PARADA DA COTERIE 0/1</span>
                 </div>
                 <div class="bg-black/40 border border-vamp-border p-2 mb-2 flex justify-between text-xs text-white uppercase">CHASSE</div>
                 <div class="bg-black/40 border border-vamp-border p-2 mb-2 flex justify-between text-xs text-white uppercase">LIEN</div>
                 <div class="bg-black/40 border border-vamp-border p-2 mb-2 flex justify-between text-xs text-white uppercase">PORTILLON</div>
               </div>
             </div>
          </div>

          <!-- TAB: CONCEPT & LORE -->
          <div v-else-if="activeTab === 'concept'" class="space-y-6">
             <!-- Details -->
             <div>
               <h3 class="text-xs font-serif text-gray-400 uppercase tracking-widest border-b border-vamp-border pb-2 mb-4">Detalhes</h3>
               <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label class="text-[10px] text-vamp-c2 uppercase font-bold tracking-widest">Conceito</label>
                   <div class="border border-vamp-border bg-black/40 p-2 text-xs text-gray-300 mt-1 min-h-[34px]">{{character?.concept}}</div>
                 </div>
                 <div>
                   <label class="text-[10px] text-vamp-c2 uppercase font-bold tracking-widest">Crônica</label>
                   <div class="border border-vamp-border bg-black/40 p-2 text-xs text-gray-300 mt-1 min-h-[34px]"></div>
                 </div>
                 <div>
                   <label class="text-[10px] text-vamp-c2 uppercase font-bold tracking-widest">Senhor(a)</label>
                   <div class="border border-vamp-border bg-black/40 p-2 text-xs text-gray-300 mt-1 min-h-[34px]">{{character?.sire}}</div>
                 </div>
                 <div>
                   <label class="text-[10px] text-vamp-c2 uppercase font-bold tracking-widest">Idade Aparente</label>
                   <div class="border border-vamp-border bg-black/40 p-2 text-xs text-gray-300 mt-1 min-h-[34px]"></div>
                 </div>
               </div>
             </div>

             <!-- Beliefs -->
             <div class="mt-8">
               <h3 class="text-xs font-serif text-gray-400 uppercase tracking-widest border-b border-vamp-border pb-2 mb-4">Crenças</h3>
               <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label class="text-[10px] text-vamp-c2 uppercase font-bold tracking-widest">Convicções</label>
                   <div class="border border-vamp-border bg-black/40 p-2 text-xs text-white mt-1 min-h-[34px]">A verdade é sagrada; não mentir</div>
                 </div>
                 <div>
                   <label class="text-[10px] text-vamp-c2 uppercase font-bold tracking-widest">Pilares</label>
                   <div class="border border-vamp-border bg-black/40 p-2 text-xs text-white mt-1 min-h-[34px]">Noa Fernandez, uma antiga aluna</div>
                 </div>
               </div>
             </div>
          </div>

          <!-- TAB: INVENTORY -->
          <div v-else-if="activeTab === 'inventory'" class="space-y-6">
            <div class="flex justify-between items-center mb-4">
              <input type="text" placeholder="Buscar Itens" class="bg-black/50 border border-vamp-border rounded text-sm px-3 py-1.5 text-white w-64 focus:outline-none focus:border-vamp-c2">
              <button class="text-[10px] text-gray-400 border border-vamp-border px-3 py-1 rounded hover:bg-white/5 uppercase">ADICIONAR ITENS</button>
            </div>
            <div class="text-gray-300 text-sm font-bold mb-6">Sem Itens</div>
            <div>
              <label class="text-[10px] text-vamp-c2 uppercase font-bold tracking-widest">Outras Posses</label>
              <div class="border border-vamp-border bg-black/40 p-2 text-xs text-gray-300 mt-1 min-h-[34px]"></div>
            </div>
          </div>

          <!-- TAB: NOTES -->
          <div v-else-if="activeTab === 'notes'" class="space-y-6">
            <div class="flex justify-between items-center mb-4">
              <input type="text" placeholder="Buscar Anotações..." class="bg-black/50 border border-vamp-border rounded text-sm px-3 py-1.5 text-white w-full max-w-md focus:outline-none focus:border-vamp-c2">
              <button class="text-[10px] text-gray-400 border border-vamp-border px-3 py-1 rounded hover:bg-white/5 uppercase">NOVA ENTRADA</button>
            </div>
            <div class="text-center text-gray-300 text-sm font-sans py-10">
              Seu diário está vazio - adicione uma nova entrada acima.
            </div>
          </div>

        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const route = useRoute()

const loading = ref(true)
const character = ref<any>(null)
const characterId = ref<string>('')

const activeTab = ref('disciplines')
const tabs = [
  { id: 'disciplines', label: 'DISCIPLINAS E PODERES' },
  { id: 'merits', label: 'VANTAGENS E DEFEITOS' },
  { id: 'coterie', label: 'COTERIE' },
  { id: 'concept', label: 'CONCEITO E HISTÓRIA' },
  { id: 'inventory', label: 'INVENTÁRIO' },
  { id: 'notes', label: 'ANOTAÇÕES' }
]

const availableXP = computed(() => {
  if (!character.value) return 0
  return (character.value.experienceTotal || 0) - (character.value.experienceSpent || 0)
})

// Mapeamento de atributos
const physicalAttrNames = ['Força', 'Destreza', 'Vigor', 'Strength', 'Dexterity', 'Stamina']
const socialAttrNames = ['Carisma', 'Manipulação', 'Autocontrole', 'Charisma', 'Manipulation', 'Composure']
const mentalAttrNames = ['Inteligência', 'Raciocínio', 'Perseverança', 'Intelligence', 'Wits', 'Resolve']

const attributeColumns = computed(() => {
  if (!character.value?.CharacterVampireAttributes) return []
  const attrs = character.value.CharacterVampireAttributes
  
  return [
    { title: 'Físicos', items: attrs.filter((a: any) => physicalAttrNames.includes(a.DefinitionAttribute?.name)) },
    { title: 'Sociais', items: attrs.filter((a: any) => socialAttrNames.includes(a.DefinitionAttribute?.name)) },
    { title: 'Mentais', items: attrs.filter((a: any) => mentalAttrNames.includes(a.DefinitionAttribute?.name)) }
  ]
})

// Mapeamento de perícias
const skillColumns = computed(() => {
  if (!character.value?.CharacterVampireSkills) return []
  const skills = character.value.CharacterVampireSkills
  
  return [
    { title: 'Físicos', items: skills.filter((s: any) => s.DefinitionSkill?.type === 'TALENTOS') },
    { title: 'Sociais', items: skills.filter((s: any) => s.DefinitionSkill?.type === 'PERICIAS') },
    { title: 'Mentais', items: skills.filter((s: any) => s.DefinitionSkill?.type === 'CONHECIMENTOS') }
  ]
})

const getPowersForDiscipline = (disciplineId: string) => {
  if (!character.value?.CharacterVampirePowers) return []
  return character.value.CharacterVampirePowers.filter((p: any) => p.DefinitionDisciplinePower?.definitionDisciplineId === disciplineId)
}

const fetchCharacter = async () => {
  try {
    const id = (route.query.id as string) || localStorage.getItem('lira_active_character_id')
    if (!id) {
      router.push('/jogador/vampire')
      return
    }
    characterId.value = id
    localStorage.setItem('lira_active_character_id', id)

    const res = await api.get(`/api/character-vampires/${id}`)
    character.value = res.data
  } catch (err) {
    console.error('Erro ao buscar ficha:', err)
    router.push('/jogador/vampire')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCharacter()
})
</script>
