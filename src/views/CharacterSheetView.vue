<template>
  <div class="min-h-screen pb-20">
    <!-- Navbar / Back -->
    <nav class="relative z-20 border-b border-border-dark bg-bg-deep/90 backdrop-blur-md sticky top-0">
      <div class="max-w-[1300px] mx-auto px-6 h-14 flex items-center justify-between">
        <button @click="router.push('/jogador/vampire')" class="text-gold hover:text-gold-bright flex items-center gap-2 font-serif uppercase tracking-widest text-xs transition-colors">
          <span class="text-lg">←</span> Retornar à Galeria
        </button>
        <button @click="confirmDelete" class="flex items-center gap-2 text-blood-red hover:text-red-500 transition-colors font-serif text-xs tracking-widest uppercase border border-blood-red/50 hover:border-red-500 px-3 py-1 rounded">
          <span>☠</span> Deletar Personagem
        </button>

          <!-- Evoluir Button -->
          <div class="flex items-center gap-4">
            <button @click="toggleXpMode" class="bg-gold-dim/10 hover:bg-gold-dim/20 text-gold-dim border border-gold-dim/50 px-4 py-1.5 rounded text-xs font-serif tracking-widest uppercase transition-all duration-300 flex items-center gap-2">
              <span class="text-lg leading-none">+</span> {{ isXpMode ? 'Sair da Evolução' : 'Evoluir' }}
            </button>
          </div>

      </div>
    </nav>

    <!-- LOADING STATE -->
    <div v-if="loading" class="relative z-10 max-w-[1300px] mx-auto px-6 py-20 text-center text-parchment-dim font-serif">
      <div class="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full mx-auto mb-4"></div>
      Invocando dados...
    </div>

    <!-- SHEET CONTENT -->
    <main v-else class="relative z-10 max-w-[1300px] mx-auto px-6 py-10">
      <div class="grid grid-cols-1 md:grid-cols-[340px_1fr] gap-10 items-start">
        
        <!-- LEFT COLUMN: PORTRAIT & VITALS -->
        <div class="sticky top-20">
          <div class="relative rounded-xl overflow-hidden border border-border-mid shadow-[0_8px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(139,0,0,0.4)] group/avatar cursor-pointer" @click="triggerFileInput">
            <img 
              :src="character?.avatarUrl ? (character.avatarUrl.startsWith('http') ? character.avatarUrl : API_BASE_URL + character.avatarUrl) : 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'600\'%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'%231a0b12\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' fill=\'%23c9a84c\' font-family=\'serif\' font-size=\'48\' dominant-baseline=\'middle\' text-anchor=\'middle\'%3E%E2%98%A5%3C/text%3E%3C/svg%3E'" 
              class="w-full object-cover saturate-90 transition-all duration-300 group-hover/avatar:saturate-100"
            />
            
            <!-- Upload Overlay -->
            <div class="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300">
               <span class="text-gold font-serif text-sm tracking-widest uppercase mb-1">Mudar Retrato</span>
               <div v-if="uploading" class="animate-spin w-5 h-5 border-2 border-gold border-t-transparent rounded-full mt-2"></div>
            </div>
            <input type="file" ref="fileInput" accept="image/jpeg,image/png,image/webp" class="hidden" @change="handleFileUpload" />

            <div class="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-bg-deep to-transparent pointer-events-none"></div>
            
            <div class="absolute bottom-0 left-0 right-0 p-5 z-10">
              <div class="flex flex-col items-end gap-1 mb-3">
                <span class="font-serif text-[10px] tracking-widest text-parchment-dim uppercase">Humanidade</span>
                <DotRating :value="character?.humanity || 7" :max="10" color="blood" />
              </div>
            </div>
          </div>

          <!-- Vitals -->
          <div class="mt-6 flex flex-col gap-4">
            <!-- Health -->
            <div>
               <span class="font-serif text-[10px] tracking-widest text-parchment-dim uppercase block mb-1">Vitalidade</span>
               <DotRating :value="character?.healthMax || 0" :max="7" :isBox="true" color="blood" />
            </div>
            <!-- Willpower -->
            <div>
               <span class="font-serif text-[10px] tracking-widest text-parchment-dim uppercase block mb-1">F. Vontade</span>
               <DotRating :value="character?.willpowerMax || 0" :max="6" :isBox="true" color="gold" />
            </div>
          </div>

          <!-- Backgrounds & Quick Stats -->
          <div class="grid grid-cols-2 gap-2 mt-6">
            <div class="bg-gold/5 border border-border-dark rounded-lg p-3 text-center">
              <span class="font-serif text-[9px] tracking-widest text-text-dim uppercase block mb-1">Fome</span>
              <span class="font-serif text-2xl text-blood-bright drop-shadow-md">{{ character?.hunger || 0 }}</span>
            </div>
            <div class="bg-gold/5 border border-border-dark rounded-lg p-3 text-center">
              <span class="font-serif text-[9px] tracking-widest text-text-dim uppercase block mb-1">Geração</span>
              <span class="font-serif text-2xl text-gold drop-shadow-md">{{ character?.generation }}ª</span>
            </div>
          </div>

          <!-- Potência de Sangue -->
          <div class="mt-6 border border-border-dark rounded-xl bg-bg-deep/50 overflow-hidden">
            <div class="bg-blood/10 px-4 py-2 border-b border-border-dark flex justify-between items-center">
              <span class="font-serif text-[11px] tracking-widest text-blood-bright uppercase font-bold">Potência de Sangue</span>
              <DotRating :value="character?.DefinitionBloodPotency?.level || 1" :max="10" color="blood" />
            </div>
            <div class="grid grid-cols-2 text-[10px] divide-x divide-border-dark font-sans">
              <div class="p-3 border-b border-border-dark">
                <span class="text-parchment-dim block mb-1">Surto de Sangue</span>
                <span class="text-gray-200">{{ character?.DefinitionBloodPotency?.bloodSurge || '-' }}</span>
              </div>
              <div class="p-3 border-b border-border-dark">
                <span class="text-parchment-dim block mb-1">Qtd. Recuperada</span>
                <span class="text-gray-200">{{ character?.DefinitionBloodPotency?.mendAmount || '-' }}</span>
              </div>
              <div class="p-3 border-b border-border-dark">
                <span class="text-parchment-dim block mb-1">Bônus de Poder</span>
                <span class="text-gray-200">{{ character?.DefinitionBloodPotency?.disciplineBonus || '-' }}</span>
              </div>
              <div class="p-3 border-b border-border-dark">
                <span class="text-parchment-dim block mb-1">Penalidade Alimentação</span>
                <span class="text-gray-200">{{ character?.DefinitionBloodPotency?.feedingPenalty || '-' }}</span>
              </div>
              <div class="p-3 col-span-2 text-center bg-black/20">
                <span class="text-parchment-dim block mb-1">Gravidade da Perdição</span>
                <span class="text-purple-400 font-bold text-xs">{{ character?.DefinitionBloodPotency?.baneSeverity || 0 }}</span>
              </div>
            </div>
          </div>

          <!-- XP -->
          <div class="mt-6 space-y-2">
            <div class="flex items-end text-sm">
              <span class="font-serif text-gold-dim w-32 shrink-0">Experiência Total</span>
              <div class="flex-1 border-b border-dashed border-white/20 mx-2 mb-1"></div>
              <span class="font-mono text-gray-300 w-8 text-right">{{ character?.experienceTotal || 0 }}</span>
            </div>
            <div class="flex items-end text-sm">
              <span class="font-serif text-gold-dim w-32 shrink-0">Experiência Gasta</span>
              <div class="flex-1 border-b border-dashed border-white/20 mx-2 mb-1"></div>
              <span class="font-mono text-gray-300 w-8 text-right">{{ character?.experienceSpent || 0 }}</span>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: DETAILS & TABS -->
        <div>
          <!-- Header BIOGRÁFICO -->
          <div class="border-l-4 border-l-blood pl-5 mb-8">
            <div class="inline-flex items-center gap-2 font-serif text-[11px] tracking-widest uppercase px-3 py-1 rounded-full border border-border-dark mb-3">
              <span>👑</span> {{ character?.DefinitionClan?.name || 'Sem Clã' }}
            </div>
            <h1 class="font-serif text-4xl lg:text-5xl text-gold mb-2 drop-shadow-[0_0_20px_rgba(201,168,76,0.2)]" style="font-family: 'Cinzel Decorative', serif;">
              {{ character?.name }}
            </h1>
            <p class="font-sans italic text-[15px] text-parchment-dim mb-2">
              Senhor: {{ character?.sire || 'Desconhecido' }} &nbsp;•&nbsp; Predador: <span class="text-gray-300 not-italic font-serif">{{ character?.DefinitionPredator?.name || 'Desconhecido' }}</span>
            </p>
            <p class="font-serif text-[15px] text-gray-300">
              {{ character?.concept || 'Conceito não definido' }}
            </p>
          </div>

          <!-- TABS -->
          <div class="flex gap-0 border-b border-border-mid overflow-x-auto no-scrollbar mb-6">
            <button 
              v-for="tab in tabs" 
              :key="tab.id"
              @click="activeTab = tab.id"
              class="bg-transparent border-none border-b-2 border-transparent text-text-dim font-serif text-[11px] tracking-widest uppercase px-5 py-3 cursor-pointer whitespace-nowrap transition-all duration-300"
              :class="activeTab === tab.id ? 'text-gold border-b-gold drop-shadow-[0_0_10px_rgba(201,168,76,0.3)]' : 'hover:text-parchment'"
            >
              {{ tab.label }}
            </button>
          </div>

          <!-- TAB CONTENT -->
          <div class="min-h-[400px]">
            
            <!-- ATRIBUTOS -->
            <div v-if="activeTab === 'attributes'" class="space-y-8 max-w-2xl">
              <div v-for="col in attributeColumns" :key="col.title">
                <div class="font-serif text-[11px] tracking-[3px] uppercase text-gold-dim mb-6 flex items-center gap-4">
                  {{ col.title }}
                  <div class="flex-1 h-px bg-gradient-to-r from-gold-dim/50 to-transparent"></div>
                </div>
                <div class="space-y-3">
                  <div v-for="attr in col.items" :key="attr.id" class="flex items-center">
                    <span class="font-serif text-[11px] tracking-widest text-text-main uppercase w-40 shrink-0">{{ attr.DefinitionAttribute?.name }}</span>
                    <DotRating :value="attr.value" :max="5" color="gold" :interactive="isXpMode" @update:value="val => handleDotClick(attr, 'attribute', val)" />
                  </div>
                </div>
              </div>
            </div>

            <!-- HABILIDADES -->
            <div v-if="activeTab === 'skills'" class="max-w-4xl">
              <div class="w-full h-px bg-gradient-to-r from-blood-red/80 via-blood-red/40 to-transparent mb-8"></div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-6">
                <div v-for="col in skillColumns" :key="col.title" class="space-y-3">
                  <div v-for="skill in col.items" :key="skill.id" class="flex items-center">
                    <span class="font-serif text-[11px] tracking-wide text-text-main capitalize truncate mr-2">{{ skill.DefinitionSkill?.name }}</span>
                    <!-- Border dashed for leader -->
                    <div class="flex-1 border-b border-dashed border-white/20 mx-2 self-end mb-1"></div>
                    <DotRating :value="skill.value" :max="5" color="gold" class="shrink-0" :interactive="isXpMode" @update:value="val => handleDotClick(skill, 'skill', val)" />
                  </div>
                </div>
              </div>
            </div>

            <!-- DISCIPLINAS -->
            <div v-if="activeTab === 'disciplines'" class="space-y-4">
              <div v-if="!character?.CharacterVampireDisciplines?.length && !isXpMode" class="text-parchment-dim italic text-center py-10">
                Nenhuma Disciplina manifestada.
              </div>

              <!-- Add Button -->
              <div v-if="isXpMode" class="mt-6 flex justify-center">
                <button @click="fetchDefinitions('discipline')" class="px-6 py-2 border border-dashed border-blood-red/50 text-blood-bright hover:bg-blood-red/10 rounded font-serif text-xs tracking-widest uppercase transition-colors">
                  + Despertar Nova Disciplina
                </button>
              </div>

              <div v-for="disc in character?.CharacterVampireDisciplines" :key="disc.id" 
                   class="flex items-center gap-4 px-4 py-3 rounded-md bg-gold/5 border border-border-dark hover:border-gold-dim hover:bg-gold/10 transition-colors">
                <span class="font-serif text-[13px] tracking-wide text-parchment capitalize flex-1">
                  {{ disc.DefinitionDiscipline?.name }}
                </span>
                <DotRating :value="disc.value" :max="5" color="blue" :interactive="isXpMode" @update:value="val => handleDotClick(disc, 'discipline', val)" />
              </div>
            </div>

            <!-- VANTAGENS E DEFEITOS -->
            <div v-if="activeTab === 'advantages'" class="space-y-6">
              <div v-if="!(character?.CharacterVampireBackgrounds?.length || character?.CharacterVampireMeritFlaws?.length) && !isXpMode" class="text-parchment-dim italic text-center py-10">
                Nenhuma Vantagem registrada.
              </div>

              <div v-if="isXpMode" class="mt-4 flex justify-center">
                <button @click="fetchDefinitions('advantage')" class="px-6 py-2 border border-dashed border-gold-dim/50 text-gold-dim hover:bg-gold-dim/10 rounded font-serif text-xs tracking-widest uppercase transition-colors">
                  + Adicionar Vantagem
                </button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Antecedentes -->
                <div v-if="character?.CharacterVampireBackgrounds?.length" class="bg-gold/5 border border-border-dark rounded-xl p-6 md:col-span-2">
                  <h3 class="font-serif text-[13px] tracking-wide text-gold mb-4">Antecedentes (Backgrounds)</h3>
                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div v-for="bg in character.CharacterVampireBackgrounds" :key="bg.id" class="bg-black/30 p-3 rounded border border-white/5">
                      <div class="flex justify-between items-center mb-1">
                        <span class="font-serif text-[11px] uppercase text-gray-200">{{ bg.DefinitionBackground?.name }}</span>
                        <DotRating :value="bg.value" :max="5" color="gold" :interactive="isXpMode" @update:value="val => handleDotClick(bg, 'advantage', val)" />
                      </div>
                      <p class="text-[10px] text-gray-500 leading-tight">{{ bg.DefinitionBackground?.description }}</p>
                    </div>
                  </div>
                </div>

                <!-- Qualidades e Defeitos -->
                <div v-if="character?.CharacterVampireMeritFlaws?.length" class="bg-gold/5 border border-border-dark rounded-xl p-6 md:col-span-2">
                  <h3 class="font-serif text-[13px] tracking-wide text-gold mb-4">Qualidades & Defeitos</h3>
                  <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <li v-for="mf in character.CharacterVampireMeritFlaws" :key="mf.id" class="flex justify-between items-start bg-black/30 p-3 rounded border border-white/5">
                      <div>
                        <span class="font-serif text-[11px] uppercase" :class="mf.DefinitionMeritFlaw?.type === 'QUALIDADE' ? 'text-green-400' : 'text-blood-red'">
                          {{ mf.DefinitionMeritFlaw?.name }}
                        </span>
                        <p class="text-[10px] text-gray-500 mt-1 leading-tight">{{ mf.DefinitionMeritFlaw?.description }}</p>
                      </div>
                      <span class="font-mono text-xs ml-2" :class="mf.DefinitionMeritFlaw?.type === 'QUALIDADE' ? 'text-green-400' : 'text-blood-red'">
                        {{ mf.DefinitionMeritFlaw?.type === 'QUALIDADE' ? '+' : '-' }}{{ mf.DefinitionMeritFlaw?.cost }}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- HISTÓRICO E OUTROS -->
            <div v-if="activeTab === 'history'" class="space-y-8 max-w-4xl">
              <!-- História -->
              <div class="space-y-4">
                <div class="font-serif text-[11px] tracking-[3px] uppercase text-gold-dim mb-4 flex items-center gap-4">
                  HISTÓRIA
                  <div class="flex-1 h-px bg-gradient-to-r from-gold-dim/50 to-transparent"></div>
                </div>
                <div class="bg-[#0f0a0a] border border-white/5 rounded-xl p-6 leading-relaxed text-[0.95rem] text-gray-300">
                  <p class="whitespace-pre-wrap font-serif">{{ character?.history || 'Sua história ainda será escrita nas sombras.' }}</p>
                </div>
              </div>

              <!-- Dicas de Interpretação -->
              <div class="space-y-4">
                <div class="font-serif text-[11px] tracking-[3px] uppercase text-gold-dim mb-4 flex items-center gap-4">
                  DICAS DE INTERPRETAÇÃO
                  <div class="flex-1 h-px bg-gradient-to-r from-gold-dim/50 to-transparent"></div>
                </div>
                <div class="bg-[#120505] border border-blood-red/20 rounded-xl p-6">
                  <div class="flex items-center gap-2 mb-3">
                    <span class="text-xs">🎭</span>
                    <h3 class="font-serif text-[10px] tracking-widest text-blood-bright uppercase">COMO INTERPRETAR</h3>
                  </div>
                  <div class="space-y-2 text-[0.88rem] text-gray-300 font-serif italic">
                    <p v-if="character?.concept"><strong class="text-gold-dim not-italic">Conceito:</strong> {{ character.concept }}</p>
                    <p v-if="character?.ambition"><strong class="text-gold-dim not-italic">Ambição:</strong> {{ character.ambition }}</p>
                    <p v-if="character?.desire"><strong class="text-gold-dim not-italic">Desejo:</strong> {{ character.desire }}</p>
                    <p v-if="!character?.concept && !character?.ambition && !character?.desire">Siga os instintos da sua Besta interior.</p>
                  </div>
                </div>
              </div>

              <!-- Fraqueza de Clã -->
              <div v-if="character?.DefinitionClan?.weakness" class="space-y-4">
                <div class="font-serif text-[11px] tracking-[3px] uppercase text-gold-dim mb-4 flex items-center gap-4">
                  FRAQUEZA DE CLÃ
                  <div class="flex-1 h-px bg-gradient-to-r from-gold-dim/50 to-transparent"></div>
                </div>
                <div class="bg-[#0c0812] border border-purple-900/30 rounded-xl p-6">
                  <div class="flex items-center gap-2 mb-3">
                    <span class="text-xs text-purple-400">⚠</span>
                    <h3 class="font-serif text-[10px] tracking-widest text-purple-400 uppercase">A MALDIÇÃO DO SANGUE</h3>
                  </div>
                  <p class="font-serif text-[0.88rem] text-gray-300 leading-relaxed whitespace-pre-wrap">{{ character.DefinitionClan.weakness }}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  </div>

    <!-- Floating XP Panel -->
    <div v-if="isXpMode" class="fixed bottom-0 left-0 right-0 bg-black/90 border-t border-gold-dim backdrop-blur-md z-50 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
      <div class="max-w-[1300px] mx-auto flex items-center justify-between">
        <div class="flex items-center gap-6">
          <div class="text-gold-dim font-serif uppercase tracking-widest text-xs border-r border-white/10 pr-6">
            XP Restante: <span class="text-white text-lg ml-2">{{ character?.experienceTotal - character?.experienceSpent - xpSpent }}</span>
          </div>
          <div class="text-gray-400 text-xs font-sans">
            Gasto no carrinho: <span class="text-white">{{ xpSpent }} XP</span>
          </div>
        </div>
        <div class="flex gap-4">
          <button @click="toggleXpMode" class="px-6 py-2 border border-white/20 text-gray-300 rounded font-serif uppercase tracking-widest text-xs hover:bg-white/5 transition-colors">Cancelar</button>
          <button @click="confirmXpChanges" class="px-6 py-2 bg-gold-dim text-black font-bold rounded font-serif uppercase tracking-widest text-xs hover:bg-gold transition-colors">Confirmar Evolução</button>
        </div>
      </div>
    </div>


    <!-- Modal Add Item -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div class="bg-bg-deep border border-border-dark rounded-xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl">
        <div class="p-4 border-b border-border-dark flex justify-between items-center bg-black/40">
          <h3 class="font-serif text-gold text-lg uppercase tracking-widest">
            Adicionar {{ showAddModal === 'discipline' ? 'Disciplina' : 'Vantagem' }}
          </h3>
          <button @click="showAddModal = null" class="text-gray-500 hover:text-white">✕</button>
        </div>
        
        <div class="p-4 overflow-y-auto flex-1 space-y-2 custom-scrollbar">
          <template v-if="showAddModal === 'discipline'">
            <div v-for="disc in allDisciplines" :key="disc.id" 
                 @click="addNewDiscipline(disc)"
                 class="p-3 border border-white/5 rounded bg-white/5 hover:bg-blood/20 cursor-pointer transition-colors group">
              <h4 class="font-serif text-blood-bright text-sm tracking-wide group-hover:text-white">{{ disc.name }}</h4>
              <p class="text-xs text-gray-400 mt-1 truncate">{{ disc.description }}</p>
            </div>
          </template>

          <template v-if="showAddModal === 'advantage'">
            <div class="mb-4">
              <h4 class="font-serif text-gold-dim text-xs tracking-widest uppercase mb-2 border-b border-white/10 pb-1">Antecedentes</h4>
              <div v-for="bg in allBackgrounds" :key="'bg'+bg.id" 
                   @click="addNewAdvantage(bg, 'background')"
                   class="p-3 border border-white/5 rounded bg-white/5 hover:bg-gold-dim/20 cursor-pointer transition-colors group mb-2">
                <h4 class="font-serif text-gold text-sm tracking-wide group-hover:text-white">{{ bg.name }}</h4>
                <p class="text-xs text-gray-400 mt-1 truncate">{{ bg.description }}</p>
              </div>
            </div>
            
            <div>
              <h4 class="font-serif text-gold-dim text-xs tracking-widest uppercase mb-2 border-b border-white/10 pb-1">Qualidades e Defeitos</h4>
              <div v-for="mf in allMerits" :key="'mf'+mf.id" 
                   @click="addNewAdvantage(mf, 'merit')"
                   class="p-3 border border-white/5 rounded bg-white/5 hover:bg-gold-dim/20 cursor-pointer transition-colors group mb-2">
                <h4 class="font-serif text-sm tracking-wide group-hover:text-white" :class="mf.type === 'QUALIDADE' ? 'text-green-400' : 'text-blood-red'">
                  [{{ mf.type }}] {{ mf.name }}
                </h4>
                <p class="text-xs text-gray-400 mt-1 truncate">{{ mf.description }}</p>
              </div>
            </div>
          </template>

</div>
</div>
</div>

</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api, { API_BASE_URL } from '../services/api'
import DotRating from '../components/DotRating.vue'

const router = useRouter()
const route = useRoute()

const loading = ref(true)
const character = ref<any>(null)
const characterId = ref<string>('')
const fileInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)


const showAddModal = ref<'discipline' | 'advantage' | null>(null)
const allDisciplines = ref<any[]>([])
const allBackgrounds = ref<any[]>([])
const allMerits = ref<any[]>([])

const fetchDefinitions = async (type: 'discipline' | 'advantage') => {
  try {
    if (type === 'discipline' && allDisciplines.value.length === 0) {
      const res = await api.get('/api/definition-disciplines');
      allDisciplines.value = res.data;
    }
    if (type === 'advantage' && allBackgrounds.value.length === 0) {
      const [bgRes, mfRes] = await Promise.all([
        api.get('/api/definition-backgrounds'),
        api.get('/api/definition-merit-flaws')
      ]);
      allBackgrounds.value = bgRes.data;
      allMerits.value = mfRes.data;
    }
    showAddModal.value = type;
  } catch(e) {
    console.error(e);
  }
}

const addNewDiscipline = (def: any) => {
  if (!character.value.CharacterVampireDisciplines) character.value.CharacterVampireDisciplines = [];
  if (character.value.CharacterVampireDisciplines.find((d:any) => d.definitionDisciplineId === def.id)) {
    showAddModal.value = null; return;
  }
  const newItem = {
    definitionDisciplineId: def.id,
    value: 0,
    DefinitionDiscipline: def
  };
  character.value.CharacterVampireDisciplines.push(newItem);
  xpCart.value.push({ isNewItem: true, arrayRef: character.value.CharacterVampireDisciplines, item: newItem });
  showAddModal.value = null;
}

const addNewAdvantage = (def: any, type: 'background' | 'merit') => {
  if (type === 'background') {
    if (!character.value.CharacterVampireBackgrounds) character.value.CharacterVampireBackgrounds = [];
    if (character.value.CharacterVampireBackgrounds.find((b:any) => b.definitionBackgroundId === def.id)) {
      showAddModal.value = null; return;
    }
    const newItem = {
      definitionBackgroundId: def.id,
      value: 0,
      DefinitionBackground: def
    };
    character.value.CharacterVampireBackgrounds.push(newItem);
    xpCart.value.push({ isNewItem: true, arrayRef: character.value.CharacterVampireBackgrounds, item: newItem });
  } else {
    if (!character.value.CharacterVampireMeritFlaws) character.value.CharacterVampireMeritFlaws = [];
    if (character.value.CharacterVampireMeritFlaws.find((m:any) => m.definitionMeritFlawId === def.id)) {
      showAddModal.value = null; return;
    }
    
    // Deduct XP immediately for merits
    if (def.type === 'QUALIDADE') {
      const cost = def.cost * 3;
      if (character.value.experienceTotal - character.value.experienceSpent - xpSpent.value < cost) {
         alert('Experiência insuficiente para essa Qualidade!');
         return;
      }
      xpSpent.value += cost;
    }
    
    const newItem = {
      definitionMeritFlawId: def.id,
      details: '',
      DefinitionMeritFlaw: def
    };
    character.value.CharacterVampireMeritFlaws.push(newItem);
    xpCart.value.push({ isNewItem: true, arrayRef: character.value.CharacterVampireMeritFlaws, item: newItem });
  }
  showAddModal.value = null;
}


const isXpMode = ref(false)
const xpSpent = ref(0)
const xpCart = ref<any[]>([])

const toggleXpMode = () => {
  if (isXpMode.value) {
    // Revert visual changes if cancelling
    xpCart.value.forEach(change => {
      if (change.isNewItem) {
         const idx = change.arrayRef.indexOf(change.item);
         if (idx > -1) change.arrayRef.splice(idx, 1);
      } else {
         change.ref.value = change.old
      }
    })
    xpSpent.value = 0
    xpCart.value = []
  }
  isXpMode.value = !isXpMode.value
}

const confirmXpChanges = async () => {
  if (xpCart.value.length === 0) return toggleXpMode()
  try {
    const updatedTotalSpent = character.value.experienceSpent + xpSpent.value
    await api.put('/api/character-vampires/' + characterId.value, {
      experienceSpent: updatedTotalSpent,
      attributes: character.value.CharacterVampireAttributes,
      skills: character.value.CharacterVampireSkills,
      disciplines: character.value.CharacterVampireDisciplines,
      backgrounds: character.value.CharacterVampireBackgrounds,
      meritsFlaws: character.value.CharacterVampireMeritFlaws
    })
    
    character.value.experienceSpent = updatedTotalSpent
    xpSpent.value = 0
    xpCart.value = []
    alert('Evolução salva com sucesso!')
    toggleXpMode()
  } catch (e) {
    alert('Erro ao salvar evolução')
  }
}

const handleDotClick = (item: any, type: string, newLevel: number) => {
  if (!isXpMode.value) return
  let oldLevel = item.value || 0
  if (newLevel <= oldLevel) return

  let costMultiplier = 0
  if (type === 'attribute') costMultiplier = 5
  else if (type === 'skill') costMultiplier = 3
  else if (type === 'discipline') costMultiplier = 5
  else if (type === 'advantage') costMultiplier = 3

  let totalCost = 0
  for (let l = oldLevel + 1; l <= newLevel; l++) {
    totalCost += l * costMultiplier
  }

  const xpAvailable = character.value.experienceTotal - character.value.experienceSpent - xpSpent.value
  if (totalCost > xpAvailable) {
    alert('Experiência insuficiente!')
    return
  }

  item.value = newLevel
  xpSpent.value += totalCost
  
  xpCart.value.push({
    name: item.DefinitionAttribute?.name || item.DefinitionSkill?.name || item.DefinitionDiscipline?.name,
    cost: totalCost,
    old: oldLevel,
    new: newLevel,
    type,
    ref: item
  })
}

const confirmDelete = async () => {
  if (confirm('Tem certeza que deseja DELETAR este personagem para sempre?')) {
    try {
      await api.delete('/api/character-vampires/' + characterId.value)
      router.push('/jogador/vampire')
    } catch (e) {
      alert('Erro ao deletar personagem')
    }
  }
}


const triggerFileInput = () => {
  if (fileInput.value) fileInput.value.click()
}

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    uploading.value = true
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      
      const res = await api.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      const newUrl = res.data.url
      character.value.avatarUrl = newUrl
      
      // Update DB
      await api.put(`/api/character-vampires/${characterId.value}`, {
        avatarUrl: newUrl
      })
      
    } catch (err) {
      alert('Erro ao enviar imagem. O arquivo pode ser muito grande ou inválido.')
    } finally {
      uploading.value = false
    }
  }
}

const activeTab = ref('attributes')
const tabs = [
  { id: 'attributes', label: 'ATRIBUTOS' },
  { id: 'skills', label: 'HABILIDADES' },
  { id: 'disciplines', label: 'DISCIPLINAS' },
  { id: 'advantages', label: 'VANTAGENS' },
  { id: 'history', label: 'HISTÓRICO' }
]

const physicalAttrNames = ['Força', 'Destreza', 'Vigor', 'Strength', 'Dexterity', 'Stamina']
const socialAttrNames = ['Carisma', 'Manipulação', 'Autocontrole', 'Charisma', 'Manipulation', 'Composure']
const mentalAttrNames = ['Inteligência', 'Raciocínio', 'Perseverança', 'Determinação', 'Intelligence', 'Wits', 'Resolve']

const attributeColumns = computed(() => {
  if (!character.value?.CharacterVampireAttributes) return []
  const attrs = character.value.CharacterVampireAttributes
  
  return [
    { title: 'Físicos', items: attrs.filter((a: any) => physicalAttrNames.includes(a.DefinitionAttribute?.name)) },
    { title: 'Sociais', items: attrs.filter((a: any) => socialAttrNames.includes(a.DefinitionAttribute?.name)) },
    { title: 'Mentais', items: attrs.filter((a: any) => mentalAttrNames.includes(a.DefinitionAttribute?.name)) }
  ]
})

const physicalSkillNames = ['Armas Brancas', 'Armas de Fogo', 'Atletismo', 'Briga', 'Condução', 'Furtividade', 'Ladroagem', 'Ofícios', 'Sobrevivência']
const socialSkillNames = ['Empatia com Animais', 'Etiqueta', 'Intimidação', 'Liderança', 'Manha', 'Performance', 'Persuasão', 'Sagacidade', 'Subterfúgio']
const mentalSkillNames = ['Ciência', 'Erudição', 'Finanças', 'Investigação', 'Medicina', 'Ocultismo', 'Percepção', 'Política', 'Tecnologia']

const skillColumns = computed(() => {
  if (!character.value?.CharacterVampireSkills) return []
  let skills = character.value.CharacterVampireSkills
  
  // Sort alphabetically by name
  skills = [...skills].sort((a: any, b: any) => {
    const nameA = a.DefinitionSkill?.name || ''
    const nameB = b.DefinitionSkill?.name || ''
    return nameA.localeCompare(nameB)
  })
  
  return [
    { title: 'Físicas', items: skills.filter((s: any) => physicalSkillNames.includes(s.DefinitionSkill?.name)) },
    { title: 'Sociais', items: skills.filter((s: any) => socialSkillNames.includes(s.DefinitionSkill?.name)) },
    { title: 'Mentais', items: skills.filter((s: any) => mentalSkillNames.includes(s.DefinitionSkill?.name)) }
  ]
})

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
