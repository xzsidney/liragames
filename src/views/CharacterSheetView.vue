<template>
  <div class="min-h-screen bg-[#050505] text-parchment font-sans relative overflow-x-hidden selection:bg-blood-red selection:text-white">
    <!-- BACKGROUND ATMOSPHERE -->
    <div class="fixed inset-0 pointer-events-none opacity-20 mix-blend-overlay z-0" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>
    <div class="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[450px] bg-gold/10 blur-[160px] rounded-full pointer-events-none z-0"></div>

    <!-- NAVBAR -->
    <nav class="relative z-20 border-b border-white/10 bg-black/70 backdrop-blur-md sticky top-0">
      <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <button @click="router.push(`/personagem/hub?id=${characterId}`)" class="text-xs text-gray-400 hover:text-white flex items-center gap-1 font-serif uppercase tracking-wider">
          <span>←</span> Voltar ao Hub
        </button>

        <div class="flex items-center gap-4 text-xs font-serif tracking-widest uppercase">
          <span class="text-gold-dim">Ficha V5</span>
          <span class="text-gray-600">|</span>
          <span class="text-blood-red font-semibold">{{ character?.name }}</span>
        </div>
      </div>
    </nav>

    <!-- LOADING STATE -->
    <div v-if="loading" class="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center text-gray-400 font-serif">
      <div class="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full mx-auto mb-4"></div>
      Carregando Ficha do Personagem...
    </div>

    <!-- SHEET CONTENT -->
    <main v-else class="relative z-10 max-w-7xl mx-auto px-6 py-10 space-y-10">
      <!-- HEADER BIOGRÁFICO & PAINEL DE XP -->
      <div class="bg-black/70 border border-gold/30 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span class="text-xs font-serif uppercase tracking-widest text-gold-dim">
            {{ character?.DefinitionClan?.name }} • Geração {{ character?.generation }}ª
          </span>
          <h1 class="font-serif text-3xl md:text-4xl text-parchment mt-1">
            {{ character?.name }}
          </h1>
          <p class="text-xs text-gray-400 italic mt-1">
            Conceito: {{ character?.concept || 'Não informado' }} | Criador: {{ character?.sire || 'Desconhecido' }}
          </p>
        </div>

        <!-- PAINEL DE PONTOS DE EXPERIÊNCIA (XP) -->
        <div class="bg-gold/10 border border-gold/40 rounded-xl p-4 min-w-[220px] text-center">
          <div class="text-[11px] font-serif uppercase tracking-widest text-gold mb-1">
            Pontos de Experiência (XP)
          </div>
          <div class="text-2xl font-serif text-gold-dim font-bold">
            {{ availableXP }} <span class="text-xs font-normal text-gray-400">XP Livre</span>
          </div>
          <div class="text-[10px] text-gray-500 mt-1">
            Total: {{ character?.experienceTotal || 0 }} | Gasto: {{ character?.experienceSpent || 0 }}
          </div>
        </div>
      </div>

      <!-- SEÇÃO 1: ATRIBUTOS (FÍSICOS, SOCIAIS, MENTAIS) -->
      <div class="bg-black/60 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md">
        <h2 class="font-serif text-xl text-gold-dim border-b border-white/10 pb-3 mb-6 flex items-center justify-between">
          <span>⚔️ Atributos</span>
          <span class="text-xs font-sans text-gray-400 font-normal">Pontuação de 1 a 5</span>
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- FÍSICOS -->
          <div>
            <h3 class="text-xs font-serif uppercase tracking-widest text-blood-red mb-4">Físicos</h3>
            <div class="space-y-3">
              <div 
                v-for="attr in physicalAttributes" 
                :key="attr.id" 
                class="flex justify-between items-center bg-white/5 p-2.5 rounded border border-white/5"
              >
                <span class="text-xs font-medium text-gray-200">{{ attr.DefinitionAttribute?.name }}</span>
                <div class="flex items-center gap-1">
                  <span 
                    v-for="dot in 5" 
                    :key="dot"
                    class="w-2.5 h-2.5 rounded-full border transition-all"
                    :class="dot <= attr.value ? 'bg-gold border-gold' : 'bg-black border-white/20'"
                  ></span>
                </div>
              </div>
            </div>
          </div>

          <!-- SOCIAIS -->
          <div>
            <h3 class="text-xs font-serif uppercase tracking-widest text-gold-dim mb-4">Sociais</h3>
            <div class="space-y-3">
              <div 
                v-for="attr in socialAttributes" 
                :key="attr.id" 
                class="flex justify-between items-center bg-white/5 p-2.5 rounded border border-white/5"
              >
                <span class="text-xs font-medium text-gray-200">{{ attr.DefinitionAttribute?.name }}</span>
                <div class="flex items-center gap-1">
                  <span 
                    v-for="dot in 5" 
                    :key="dot"
                    class="w-2.5 h-2.5 rounded-full border transition-all"
                    :class="dot <= attr.value ? 'bg-gold border-gold' : 'bg-black border-white/20'"
                  ></span>
                </div>
              </div>
            </div>
          </div>

          <!-- MENTAIS -->
          <div>
            <h3 class="text-xs font-serif uppercase tracking-widest text-blue-400 mb-4">Mentais</h3>
            <div class="space-y-3">
              <div 
                v-for="attr in mentalAttributes" 
                :key="attr.id" 
                class="flex justify-between items-center bg-white/5 p-2.5 rounded border border-white/5"
              >
                <span class="text-xs font-medium text-gray-200">{{ attr.DefinitionAttribute?.name }}</span>
                <div class="flex items-center gap-1">
                  <span 
                    v-for="dot in 5" 
                    :key="dot"
                    class="w-2.5 h-2.5 rounded-full border transition-all"
                    :class="dot <= attr.value ? 'bg-gold border-gold' : 'bg-black border-white/20'"
                  ></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- SEÇÃO 2: PERÍCIAS (TALENTOS, PERÍCIAS, CONHECIMENTOS) -->
      <div class="bg-black/60 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md">
        <h2 class="font-serif text-xl text-gold-dim border-b border-white/10 pb-3 mb-6 flex items-center justify-between">
          <span>🎯 Perícias & Habilidades</span>
          <span class="text-xs font-sans text-gray-400 font-normal">Pontuação de 0 a 5</span>
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- TALENTOS -->
          <div>
            <h3 class="text-xs font-serif uppercase tracking-widest text-blood-red mb-4">Talentos (Físicos)</h3>
            <div class="space-y-2.5">
              <div 
                v-for="skill in talentSkills" 
                :key="skill.id" 
                class="flex justify-between items-center bg-white/5 p-2 rounded border border-white/5"
              >
                <div>
                  <span class="text-xs text-gray-200 block">{{ skill.DefinitionSkill?.name }}</span>
                  <span v-if="skill.specialty" class="text-[10px] text-gold italic">Esp: {{ skill.specialty }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <span 
                    v-for="dot in 5" 
                    :key="dot"
                    class="w-2 h-2 rounded-full border transition-all"
                    :class="dot <= skill.value ? 'bg-blood-red border-blood-red' : 'bg-black border-white/20'"
                  ></span>
                </div>
              </div>
            </div>
          </div>

          <!-- PERÍCIAS -->
          <div>
            <h3 class="text-xs font-serif uppercase tracking-widest text-gold-dim mb-4">Perícias (Sociais/Práticas)</h3>
            <div class="space-y-2.5">
              <div 
                v-for="skill in skillSkills" 
                :key="skill.id" 
                class="flex justify-between items-center bg-white/5 p-2 rounded border border-white/5"
              >
                <div>
                  <span class="text-xs text-gray-200 block">{{ skill.DefinitionSkill?.name }}</span>
                  <span v-if="skill.specialty" class="text-[10px] text-gold italic">Esp: {{ skill.specialty }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <span 
                    v-for="dot in 5" 
                    :key="dot"
                    class="w-2 h-2 rounded-full border transition-all"
                    :class="dot <= skill.value ? 'bg-gold border-gold' : 'bg-black border-white/20'"
                  ></span>
                </div>
              </div>
            </div>
          </div>

          <!-- CONHECIMENTOS -->
          <div>
            <h3 class="text-xs font-serif uppercase tracking-widest text-blue-400 mb-4">Conhecimentos (Mentais)</h3>
            <div class="space-y-2.5">
              <div 
                v-for="skill in knowledgeSkills" 
                :key="skill.id" 
                class="flex justify-between items-center bg-white/5 p-2 rounded border border-white/5"
              >
                <div>
                  <span class="text-xs text-gray-200 block">{{ skill.DefinitionSkill?.name }}</span>
                  <span v-if="skill.specialty" class="text-[10px] text-gold italic">Esp: {{ skill.specialty }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <span 
                    v-for="dot in 5" 
                    :key="dot"
                    class="w-2 h-2 rounded-full border transition-all"
                    :class="dot <= skill.value ? 'bg-blue-400 border-blue-400' : 'bg-black border-white/20'"
                  ></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- SEÇÃO 3: DISCIPLINAS & PODERES -->
      <div class="bg-black/60 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md">
        <h2 class="font-serif text-xl text-gold-dim border-b border-white/10 pb-3 mb-6">
          🩸 Disciplinas & Poderes Sobrenaturais
        </h2>

        <div v-if="!character?.CharacterVampireDisciplines?.length" class="text-xs text-gray-400 italic">
          Nenhuma disciplina registrada nesta ficha.
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            v-for="disc in character?.CharacterVampireDisciplines" 
            :key="disc.id"
            class="bg-white/5 border border-blood-red/30 rounded-xl p-5"
          >
            <div class="flex justify-between items-center mb-3 pb-2 border-b border-white/5">
              <h3 class="font-serif text-lg text-blood-red font-semibold">
                {{ disc.DefinitionDiscipline?.name }}
              </h3>
              <div class="flex items-center gap-1">
                <span 
                  v-for="dot in 5" 
                  :key="dot"
                  class="w-2.5 h-2.5 rounded-full border transition-all"
                  :class="dot <= disc.value ? 'bg-blood-red border-blood-red' : 'bg-black border-white/20'"
                ></span>
              </div>
            </div>
            <p class="text-xs text-gray-400 italic mb-4">
              {{ disc.DefinitionDiscipline?.description }}
            </p>

            <!-- PODERES DA DISCIPLINA -->
            <div class="space-y-2">
              <div class="text-[10px] font-serif uppercase tracking-widest text-gold-dim">Poderes Adquiridos:</div>
              <div 
                v-for="pow in getPowersForDiscipline(disc.definitionDisciplineId)" 
                :key="pow.id"
                class="bg-black/60 p-2.5 rounded border border-white/5 text-xs"
              >
                <div class="flex justify-between text-gold font-serif">
                  <span>{{ pow.DefinitionDisciplinePower?.name }}</span>
                  <span class="text-[10px] text-gray-400">Nível {{ pow.DefinitionDisciplinePower?.level }}</span>
                </div>
                <p class="text-[11px] text-gray-400 mt-1 leading-relaxed">
                  {{ pow.DefinitionDisciplinePower?.description }}
                </p>
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
import api from '../services/api'

const router = useRouter()
const route = useRoute()

const loading = ref(true)
const character = ref<any>(null)
const characterId = ref<string>('')

const availableXP = computed(() => {
  if (!character.value) return 0
  return (character.value.experienceTotal || 0) - (character.value.experienceSpent || 0)
})

const physicalAttributes = computed(() => {
  if (!character.value?.CharacterVampireAttributes) return []
  return character.value.CharacterVampireAttributes.filter((a: any) => a.DefinitionAttribute?.category === 'FISICO')
})

const socialAttributes = computed(() => {
  if (!character.value?.CharacterVampireAttributes) return []
  return character.value.CharacterVampireAttributes.filter((a: any) => a.DefinitionAttribute?.category === 'SOCIAL')
})

const mentalAttributes = computed(() => {
  if (!character.value?.CharacterVampireAttributes) return []
  return character.value.CharacterVampireAttributes.filter((a: any) => a.DefinitionAttribute?.category === 'MENTAL')
})

const talentSkills = computed(() => {
  if (!character.value?.CharacterVampireSkills) return []
  return character.value.CharacterVampireSkills.filter((s: any) => s.DefinitionSkill?.type === 'TALENTOS')
})

const skillSkills = computed(() => {
  if (!character.value?.CharacterVampireSkills) return []
  return character.value.CharacterVampireSkills.filter((s: any) => s.DefinitionSkill?.type === 'PERICIAS')
})

const knowledgeSkills = computed(() => {
  if (!character.value?.CharacterVampireSkills) return []
  return character.value.CharacterVampireSkills.filter((s: any) => s.DefinitionSkill?.type === 'CONHECIMENTOS')
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
