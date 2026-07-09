<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const systemParam = route.params.system as string
const sysUpper = systemParam.toUpperCase()

const theme = computed(() => {
  const s = systemParam.toLowerCase()
  if (s === 'vampire') return { 
    bg: '#0f0003', bgClass: 'bg-[#0f0003]', c1: '#8b0000', c2: '#c0392b', c1Class: 'bg-vamp-c1', borderClass: 'border-vamp-c1', textClass: 'text-vamp-c2',
    glow: 'rgba(192,57,43,0.5)', icon: '🩸', label: 'V5 · Vampiro', name: 'Vampiro: A Máscara' 
  }
  if (s === 'werewolf') return { 
    bg: '#020a00', bgClass: 'bg-[#020a00]', c1: '#1a4a00', c2: '#4a9a1a', c1Class: 'bg-wolf-c1', borderClass: 'border-wolf-c1', textClass: 'text-wolf-c2',
    glow: 'rgba(74,154,26,0.5)', icon: '🐺', label: 'W5 · Lobisomem', name: 'Lobisomem: O Apocalipse' 
  }
  if (s === 'mage') return { 
    bg: '#02000d', bgClass: 'bg-[#02000d]', c1: '#2a0070', c2: '#7a40e0', c1Class: 'bg-mage-c1', borderClass: 'border-mage-c1', textClass: 'text-mage-c2',
    glow: 'rgba(122,64,224,0.5)', icon: '🔮', label: 'M20 · Mago', name: 'Mago: A Ascensão' 
  }
  if (s === 'hunter') return { 
    bg: '#080500', bgClass: 'bg-[#080500]', c1: '#5a3000', c2: '#d4820a', c1Class: 'bg-hunt-c1', borderClass: 'border-hunt-c1', textClass: 'text-hunt-c2',
    glow: 'rgba(212,130,10,0.5)', icon: '🔫', label: 'H5 · Caçador', name: 'Caçador: A Revanche' 
  }
  return { 
    bg: '#04000a', bgClass: 'bg-bg-deep', c1: '#7a6228', c2: '#c9a84c', c1Class: 'bg-gold-dim', borderClass: 'border-gold-dim', textClass: 'text-gold',
    glow: 'rgba(201,168,76,0.5)', icon: '⚜', label: 'LiraRPG', name: 'Mundo das Trevas' 
  }
})

const currentStep = ref(1)
const steps = [
  { id: 1, name: 'Identidade' },
  { id: 2, name: 'Atributos' },
  { id: 3, name: 'Habilidades' },
  { id: 4, name: 'Revisão' }
]

const form = ref({
  name: '',
  concept: '',
  nature: '',
  demeanor: '',
  vampireClaId: '',
  attributes: [] as { attributeId: string, value: number }[],
  skills: [] as { skillId: string, value: number }[]
})

const clans = ref<any[]>([])
const attributesDef = ref<any[]>([])
const skillsDef = ref<any[]>([])
const loading = ref(true)
const saving = ref(false)
const errorMsg = ref('')

onMounted(async () => {
  const token = sessionStorage.getItem('lira_token')
  if (!token) {
    router.push('/login')
    return
  }

  try {
    const headers = { Authorization: `Bearer ${token}` }
    
    // Clans se for Vampiro
    if (sysUpper === 'VAMPIRE') {
      const res = await axios.get('https://api.liragames.com.br/api/vampire-clas', { headers })
      clans.value = res.data
    }

    // Atributos
    const resAttr = await axios.get('https://api.liragames.com.br/api/attribute-definitions', { headers })
    attributesDef.value = resAttr.data.filter((a: any) => {
      if (!a.gameStyle) return true
      // Verifica se é array ou string parseavel
      try {
        const gs = typeof a.gameStyle === 'string' ? JSON.parse(a.gameStyle) : a.gameStyle
        return gs.includes(sysUpper) || gs.includes('UNIVERSAL')
      } catch(e) { return true }
    })
    
    // Inicializar Atributos com 1 (mínimo humano)
    form.value.attributes = attributesDef.value.map(a => ({ attributeId: a.id, value: 1 }))

    // Habilidades
    const resSkill = await axios.get('https://api.liragames.com.br/api/skill-definitions', { headers })
    skillsDef.value = resSkill.data.filter((s: any) => {
      if (!s.gameStyle) return true
      try {
        const gs = typeof s.gameStyle === 'string' ? JSON.parse(s.gameStyle) : s.gameStyle
        return gs.includes(sysUpper) || gs.includes('UNIVERSAL')
      } catch(e) { return true }
    })

    // Inicializar Habilidades com 0
    form.value.skills = skillsDef.value.map(s => ({ skillId: s.id, value: 0 }))

  } catch (err) {
    console.error(err)
    errorMsg.value = 'Erro ao carregar banco de regras do sistema.'
  } finally {
    loading.value = false
  }
})

// Helpers Visuais e de Controle
const getAttrsByType = (type: string) => attributesDef.value.filter(a => a.type === type)
const getSkillsByType = (type: string) => skillsDef.value.filter(s => s.type === type)

const getAttrVal = (id: string) => form.value.attributes.find(a => a.attributeId === id)?.value || 1
const setAttrVal = (id: string, val: number) => {
  const a = form.value.attributes.find(x => x.attributeId === id)
  if (a) a.value = val
}

const getSkillVal = (id: string) => form.value.skills.find(s => s.skillId === id)?.value || 0
const setSkillVal = (id: string, val: number) => {
  const s = form.value.skills.find(x => x.skillId === id)
  if (s) {
    if (s.value === val && s.value > 0) s.value = val - 1 // Clicou no mesmo, desmarca
    else s.value = val
  }
}

const nextStep = () => { if (currentStep.value < 4) currentStep.value++ }
const prevStep = () => { if (currentStep.value > 1) currentStep.value-- }
const goBack = () => router.push(`/characters/${systemParam.toLowerCase()}`)

const submit = async () => {
  if (!form.value.name) {
    errorMsg.value = "O nome do personagem é obrigatório."
    return
  }
  
  saving.value = true
  errorMsg.value = ''
  try {
    const token = sessionStorage.getItem('lira_token')
    
    const payload = {
      gameStyle: sysUpper,
      name: form.value.name,
      concept: form.value.concept,
      nature: form.value.nature,
      demeanor: form.value.demeanor,
      vampireClaId: form.value.vampireClaId || undefined,
      attributes: form.value.attributes,
      skills: form.value.skills.filter(s => s.value > 0) // Envia só as marcadas
    }

    await axios.post('https://api.liragames.com.br/api/characters', payload, {
      headers: { Authorization: `Bearer ${token}` }
    })

    router.push(`/characters/${systemParam.toLowerCase()}`)
  } catch(e: any) {
    console.error(e)
    errorMsg.value = e.response?.data?.error || "Erro crítico ao forjar personagem."
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <main :class="['min-h-screen font-sans overflow-x-hidden text-parchment pb-20 relative', theme.bgClass]">
    <!-- Background Gradient -->
    <div class="fixed inset-0 pointer-events-none z-0" :style="{ background: `radial-gradient(ellipse at 50% -10%, ${theme.glow.replace('0.5', '0.2')} 0%, transparent 60%)` }"></div>

    <!-- Header / Navbar Mínima -->
    <header class="relative z-50 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0">
      <div class="flex items-center space-x-4">
        <button @click="goBack" class="group flex items-center justify-center w-10 h-10 rounded-full border border-white/10 hover:border-gold/50 bg-white/5 transition-all" title="Voltar à Galeria">
          <span class="text-gold font-sans transform group-hover:-translate-x-1 transition-transform">←</span>
        </button>
        <div class="flex flex-col">
          <span class="font-deco text-sm text-gold tracking-[2px] leading-tight">Forja de Lendas</span>
          <span :class="['font-serif text-[10px] tracking-[2px] uppercase', theme.textClass]">{{ theme.name }}</span>
        </div>
      </div>
    </header>

    <div class="relative z-10 max-w-[900px] mx-auto px-6 pt-10">
      <!-- WIZARD PROGRESS -->
      <div class="flex items-center justify-between mb-12 border-b border-white/10 pb-6">
        <div v-for="step in steps" :key="step.id" class="flex flex-col items-center flex-1 relative">
          <div :class="[
            'w-8 h-8 rounded-full border-2 flex items-center justify-center font-serif text-[12px] z-10 transition-all duration-500',
            currentStep >= step.id ? `bg-black ${theme.borderClass} ${theme.textClass} shadow-[0_0_15px_${theme.glow}]` : 'bg-black border-white/20 text-white/30'
          ]">
            {{ step.id }}
          </div>
          <span :class="['mt-3 font-serif text-[10px] tracking-[2px] uppercase transition-all duration-500', currentStep >= step.id ? 'text-parchment' : 'text-white/30']">
            {{ step.name }}
          </span>
          <!-- Linha conectora -->
          <div v-if="step.id < steps.length" class="absolute top-4 left-[50%] w-full h-[2px] bg-white/5 -z-0">
            <div class="h-full transition-all duration-700" :style="{ width: currentStep > step.id ? '100%' : '0%', backgroundColor: theme.c1 }"></div>
          </div>
        </div>
      </div>

      <!-- LOADING -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20 space-y-4">
        <div class="w-12 h-12 border-4 border-t-gold border-r-gold border-b-white/10 border-l-white/10 rounded-full animate-spin"></div>
        <p class="font-serif text-[10px] tracking-[3px] uppercase text-gold-dim">Preparando Fornalha...</p>
      </div>

      <!-- ERROR MSG -->
      <div v-if="errorMsg" class="mb-6 bg-red-900/30 border border-red-500/50 p-4 rounded-xl text-center backdrop-blur-sm">
        <p class="font-serif text-red-400 tracking-widest uppercase text-xs">{{ errorMsg }}</p>
      </div>

      <!-- FORMS -->
      <div v-if="!loading" class="bg-black/60 border border-white/10 rounded-2xl p-8 backdrop-blur shadow-2xl min-h-[500px] flex flex-col">
        
        <!-- PASSO 1: IDENTIDADE -->
        <div v-show="currentStep === 1" class="animate-fade-in flex-1">
          <h2 class="font-deco text-3xl text-gold mb-8 text-center drop-shadow-md">Quem é você na escuridão?</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-2">
              <label class="block font-serif text-[10px] tracking-[2px] uppercase text-gold-dim">Nome do Personagem</label>
              <input v-model="form.name" type="text" placeholder="Ex: Jean-Luc" class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-parchment focus:outline-none focus:border-gold transition-colors font-sans" />
            </div>

            <div class="space-y-2">
              <label class="block font-serif text-[10px] tracking-[2px] uppercase text-gold-dim">Conceito</label>
              <input v-model="form.concept" type="text" placeholder="Ex: Detetive Arruinado" class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-parchment focus:outline-none focus:border-gold transition-colors font-sans" />
            </div>

            <div class="space-y-2" v-if="sysUpper === 'VAMPIRE'">
              <label class="block font-serif text-[10px] tracking-[2px] uppercase text-gold-dim">Clã</label>
              <select v-model="form.vampireClaId" class="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-parchment focus:outline-none focus:border-gold transition-colors font-sans appearance-none">
                <option value="">-- Selecione o Clã --</option>
                <option v-for="c in clans" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="block font-serif text-[10px] tracking-[2px] uppercase text-gold-dim">Natureza</label>
              <input v-model="form.nature" type="text" placeholder="Ex: Sobrevivente" class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-parchment focus:outline-none focus:border-gold transition-colors font-sans" />
            </div>

            <div class="space-y-2">
              <label class="block font-serif text-[10px] tracking-[2px] uppercase text-gold-dim">Comportamento</label>
              <input v-model="form.demeanor" type="text" placeholder="Ex: Galante" class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-parchment focus:outline-none focus:border-gold transition-colors font-sans" />
            </div>
          </div>
        </div>

        <!-- PASSO 2: ATRIBUTOS -->
        <div v-show="currentStep === 2" class="animate-fade-in flex-1">
          <h2 class="font-deco text-3xl text-gold mb-2 text-center drop-shadow-md">Atributos Primordiais</h2>
          <p class="font-sans italic text-sm text-text-dim text-center mb-8">Distribua seus pontos nas categorias Físico, Social e Mental.</p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div v-for="type in ['FÍSICO', 'SOCIAL', 'MENTAL']" :key="type">
              <h3 class="font-serif text-[11px] tracking-[3px] uppercase text-gold-dim mb-4 border-b border-white/10 pb-2">{{ type }}</h3>
              
              <div class="space-y-4">
                <div v-for="attr in getAttrsByType(type)" :key="attr.id" class="flex items-center justify-between group">
                  <span class="font-serif text-[13px] tracking-[1px] text-parchment group-hover:text-white transition-colors" :title="attr.description || ''">{{ attr.name }}</span>
                  <div class="flex gap-1.5 cursor-pointer">
                    <div v-for="i in 5" :key="i" 
                         @click="setAttrVal(attr.id, i)"
                         :class="[
                           'w-3.5 h-3.5 rounded-full border transition-all duration-300', 
                           i <= getAttrVal(attr.id) ? `bg-gold border-gold shadow-[0_0_8px_rgba(201,168,76,0.6)]` : 'border-white/20 bg-transparent hover:border-white/50'
                         ]">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- PASSO 3: HABILIDADES -->
        <div v-show="currentStep === 3" class="animate-fade-in flex-1">
          <h2 class="font-deco text-3xl text-gold mb-2 text-center drop-shadow-md">Habilidades e Perícias</h2>
          <p class="font-sans italic text-sm text-text-dim text-center mb-8">O que você aprendeu durante sua vida mortal?</p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div v-for="type in ['FÍSICO', 'SOCIAL', 'MENTAL']" :key="type">
              <h3 class="font-serif text-[11px] tracking-[3px] uppercase text-gold-dim mb-4 border-b border-white/10 pb-2">{{ type }}</h3>
              
              <div class="space-y-3">
                <div v-for="skill in getSkillsByType(type)" :key="skill.id" class="flex items-center justify-between group">
                  <span class="font-serif text-[11px] tracking-[0.5px] text-parchment group-hover:text-white transition-colors line-clamp-1 mr-2" :title="skill.description || ''">{{ skill.name }}</span>
                  <div class="flex gap-1 cursor-pointer shrink-0">
                    <div v-for="i in 5" :key="i" 
                         @click="setSkillVal(skill.id, i)"
                         :class="[
                           'w-2.5 h-2.5 rounded-full border transition-all duration-300', 
                           i <= getSkillVal(skill.id) ? `bg-gold border-gold shadow-[0_0_5px_rgba(201,168,76,0.5)]` : 'border-white/20 bg-transparent hover:border-white/50'
                         ]">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- PASSO 4: REVISÃO -->
        <div v-show="currentStep === 4" class="animate-fade-in flex-1">
          <h2 class="font-deco text-3xl text-gold mb-6 text-center drop-shadow-md">Revisão do Pacto</h2>
          
          <div class="bg-black/50 border border-white/5 rounded-xl p-6 text-center mb-6 max-w-xl mx-auto">
            <h3 class="font-serif text-2xl text-parchment mb-2 uppercase tracking-widest">{{ form.name || 'Sem Nome' }}</h3>
            <p class="font-sans text-sm text-text-dim italic mb-4">"{{ form.concept || 'Sem Conceito' }}"</p>
            <div v-if="sysUpper === 'VAMPIRE' && form.vampireClaId" class="mt-4">
              <span class="inline-flex items-center gap-2 font-serif text-[10px] tracking-[1.5px] uppercase px-3 py-1.5 rounded-full border border-vamp-c1 text-vamp-c2 bg-black">
                🩸 {{ clans.find(c => c.id === form.vampireClaId)?.name }}
              </span>
            </div>
          </div>

          <p class="font-sans text-center text-sm text-parchment-dim leading-relaxed max-w-xl mx-auto">
            Verifique se os pontos de atributos e habilidades estão distribuídos corretamente. 
            Ao clicar em Forjar Personagem, o registro será gravado definitivamente nos anais da noite.
          </p>
        </div>

        <!-- CONTROLS -->
        <div class="flex items-center justify-between mt-10 pt-6 border-t border-white/10">
          <button v-if="currentStep > 1" @click="prevStep" class="font-serif text-[11px] tracking-[2px] uppercase text-text-dim hover:text-white transition-colors px-4 py-2">
            ← Retornar
          </button>
          <div v-else></div> <!-- Spacer -->

          <button v-if="currentStep < 4" @click="nextStep" :class="['font-serif text-[11px] tracking-[2px] uppercase px-6 py-2.5 rounded border transition-all hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]', theme.borderClass, theme.textClass]">
            Avançar →
          </button>
          
          <button v-if="currentStep === 4" @click="submit" :disabled="saving" class="relative group overflow-hidden font-serif text-[12px] tracking-[2px] uppercase px-8 py-3 rounded bg-white text-black font-bold transition-all hover:bg-gold hover:text-black shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-50">
            <span class="relative z-10">{{ saving ? 'Forjando...' : 'Forjar Personagem' }}</span>
          </button>
        </div>

      </div>
    </div>
  </main>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
