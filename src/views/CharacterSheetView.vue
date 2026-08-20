<template>
  <div class="min-h-screen pb-20">
    <!-- Navbar / Back -->
    <nav class="relative z-20 border-b border-border-dark bg-bg-deep/90 backdrop-blur-md sticky top-0">
      <div class="max-w-[1300px] mx-auto px-6 h-14 flex items-center justify-between">
        <button @click="router.push('/jogador/vampire')" class="text-gold hover:text-gold-bright flex items-center gap-2 font-serif uppercase tracking-widest text-xs transition-colors">
          <span>←</span> Retornar à Galeria
        </button>
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
              :src="character?.avatarUrl ? API_BASE_URL + character.avatarUrl : 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'600\'%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'%231a0b12\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' fill=\'%23c9a84c\' font-family=\'serif\' font-size=\'48\' dominant-baseline=\'middle\' text-anchor=\'middle\'%3E%E2%98%A5%3C/text%3E%3C/svg%3E'" 
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
              Senhor: {{ character?.sire || 'Desconhecido' }}
            </p>
            <p class="font-sans text-parchment-dim">
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
            <div v-if="activeTab === 'attributes'" class="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div v-for="col in attributeColumns" :key="col.title">
                <div class="font-serif text-xs tracking-[3px] uppercase text-gold-dim mb-4 flex items-center gap-3">
                  {{ col.title }}
                  <div class="flex-1 h-px bg-gradient-to-r from-gold-dim to-transparent"></div>
                </div>
                <div class="space-y-2.5">
                  <div v-for="attr in col.items" :key="attr.id" class="flex justify-between items-center">
                    <span class="font-serif text-[11px] tracking-wide text-text-main uppercase min-w-[90px]">{{ attr.DefinitionAttribute?.name }}</span>
                    <DotRating :value="attr.value" :max="5" color="gold" />
                  </div>
                </div>
              </div>
            </div>

            <!-- HABILIDADES -->
            <div v-if="activeTab === 'skills'" class="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div v-for="col in skillColumns" :key="col.title">
                <div class="font-serif text-xs tracking-[3px] uppercase text-gold-dim mb-4 flex items-center gap-3">
                  {{ col.title }}
                  <div class="flex-1 h-px bg-gradient-to-r from-gold-dim to-transparent"></div>
                </div>
                <div class="space-y-2">
                  <div v-for="skill in col.items" :key="skill.id" class="flex justify-between items-center bg-gold/5 border border-border-dark rounded-md px-3 py-2">
                    <span class="font-serif text-[11px] tracking-wide text-text-main capitalize">{{ skill.DefinitionSkill?.name }}</span>
                    <DotRating :value="skill.value" :max="5" color="gold" />
                  </div>
                </div>
              </div>
            </div>

            <!-- DISCIPLINAS -->
            <div v-if="activeTab === 'disciplines'" class="space-y-4">
              <div v-if="!character?.CharacterVampireDisciplines?.length" class="text-parchment-dim italic text-center py-10">
                Nenhuma Disciplina manifestada.
              </div>

              <div v-for="disc in character?.CharacterVampireDisciplines" :key="disc.id" 
                   class="flex items-center gap-4 px-4 py-3 rounded-md bg-gold/5 border border-border-dark hover:border-gold-dim hover:bg-gold/10 transition-colors">
                <span class="font-serif text-[13px] tracking-wide text-parchment capitalize flex-1">
                  {{ disc.DefinitionDiscipline?.name }}
                </span>
                <DotRating :value="disc.value" :max="5" color="blue" />
              </div>
            </div>

            <!-- HISTÓRICO E OUTROS -->
            <div v-if="activeTab === 'history'" class="space-y-6">
              <!-- Background / Qualities etc... placeholder for now, matches HTML prototype style -->
              <div class="bg-gold/5 border border-border-dark rounded-xl p-6 leading-relaxed text-[0.95rem] text-text-main">
                <h3 class="font-serif text-[13px] tracking-wide text-gold mb-2">História de Fundo</h3>
                <p>{{ character?.history || 'Sua história ainda será escrita nas sombras.' }}</p>
              </div>

              <div class="bg-blood/5 border border-blood/20 rounded-xl p-6">
                <h3 class="font-serif text-[10px] tracking-widest text-blood-bright uppercase mb-2">Fraqueza de Clã</h3>
                <p class="font-sans text-[0.88rem] text-text-main">As restrições de sua linhagem amaldiçoada pesam sobre sua alma.</p>
              </div>
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
import api, { API_BASE_URL } from '../services/api'
import DotRating from '../components/DotRating.vue'

const router = useRouter()
const route = useRoute()

const loading = ref(true)
const character = ref<any>(null)
const characterId = ref<string>('')
const fileInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)

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
  { id: 'history', label: 'HISTÓRICO' }
]

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

const skillColumns = computed(() => {
  if (!character.value?.CharacterVampireSkills) return []
  const skills = character.value.CharacterVampireSkills
  
  return [
    { title: 'Talentos', items: skills.filter((s: any) => s.DefinitionSkill?.type === 'TALENTOS') },
    { title: 'Perícias', items: skills.filter((s: any) => s.DefinitionSkill?.type === 'PERICIAS') },
    { title: 'Conhecimentos', items: skills.filter((s: any) => s.DefinitionSkill?.type === 'CONHECIMENTOS') }
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
