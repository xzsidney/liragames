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

const activeTab = ref('identidade')
const tabs = computed(() => [
  { id: 'identidade', label: 'IDENTIDADE' },
  { id: 'atributos', label: 'ATRIBUTOS' },
  { id: 'habilidades', label: 'HABILIDADES' },
  { id: 'vantagens', label: sysUpper === 'VAMPIRE' ? 'DISCIPLINAS' : 'VANTAGENS' },
  { id: 'antecedentes', label: 'ANTECEDENTES' },
  { id: 'tracos', label: 'QUALIDADES & DEFEITOS' },
  { id: 'revisao', label: 'FORJAR' }
])

const form = ref({
  name: '',
  concept: '',
  nature: '',
  demeanor: '',
  vampireClaId: '',
  vampirePredatorId: '',
  vampireResonanceId: '',
  vampireGeneration: 13,
  vampireSire: '',
  vampireHunger: 1,
  vampireAmbition: '',
  vampireDesire: '',
  attributes: [] as { attributeId: string, value: number }[],
  skills: [] as { skillId: string, value: number }[],
  powers: [] as { powerId: string, value: number }[],
  backgrounds: [] as { backgroundId: string, value: number }[],
  meritsFlaws: [] as { meritId: string, points: number, type: string }[]
})

const clans = ref<any[]>([])
const predatorsDef = ref<any[]>([])
const resonancesDef = ref<any[]>([])
const attributesDef = ref<any[]>([])
const skillsDef = ref<any[]>([])
const powersDef = ref<any[]>([])
const backgroundsDef = ref<any[]>([])
const meritsDef = ref<any[]>([])
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
    
    // Clans, Predators and Resonances
    if (sysUpper === 'VAMPIRE') {
      const res = await axios.get('https://api.liragames.com.br/api/vampire-clas', { headers })
      clans.value = res.data

      const resPred = await axios.get('https://api.liragames.com.br/api/vampire-predators', { headers })
      predatorsDef.value = resPred.data

      const resResonances = await axios.get('https://api.liragames.com.br/api/vampire-resonances', { headers })
      resonancesDef.value = resResonances.data
    }

    // Helper to filter by gameStyle robustly
    const filterByGameStyle = (item: any) => {
      if (!item.gameStyle) return true;
      try {
        let gs: string[];
        if (typeof item.gameStyle === 'string') {
          gs = item.gameStyle.startsWith('[') ? JSON.parse(item.gameStyle) : [item.gameStyle];
        } else {
          gs = item.gameStyle;
        }
        return gs.includes(sysUpper) || gs.includes('UNIVERSAL');
      } catch (e) {
        return item.gameStyle === sysUpper || item.gameStyle === 'UNIVERSAL';
      }
    };

    // Atributos
    const resAttr = await axios.get('https://api.liragames.com.br/api/attribute-definitions', { headers })
    attributesDef.value = resAttr.data.filter(filterByGameStyle)
    form.value.attributes = attributesDef.value.map(a => ({ attributeId: a.id, value: 1 }))

    // Habilidades
    const resSkill = await axios.get('https://api.liragames.com.br/api/skill-definitions', { headers })
    skillsDef.value = resSkill.data.filter(filterByGameStyle)
    form.value.skills = skillsDef.value.map(s => ({ skillId: s.id, value: 0 }))

    // Poderes / Vantagens
    const resPower = await axios.get('https://api.liragames.com.br/api/power-definitions', { headers })
    powersDef.value = resPower.data.filter(filterByGameStyle)
    form.value.powers = powersDef.value.map(p => ({ powerId: p.id, value: 0 }))

    // Antecedentes
    const resBg = await axios.get('https://api.liragames.com.br/api/background-definitions', { headers })
    backgroundsDef.value = resBg.data.filter(filterByGameStyle)
    form.value.backgrounds = backgroundsDef.value.map(b => ({ backgroundId: b.id, value: 0 }))

    // Qualidades e Defeitos
    const resMerit = await axios.get('https://api.liragames.com.br/api/merit-flaw-definitions', { headers })
    meritsDef.value = resMerit.data.filter(filterByGameStyle)
    // Para Qualidades/Defeitos, o usuário irá selecionar depois, iniciamos vazio
    form.value.meritsFlaws = meritsDef.value.map(m => ({ meritId: m.id, points: 0, type: m.type }))

  } catch (err) {
    console.error(err)
    errorMsg.value = 'Erro ao carregar banco de regras do sistema. Certifique-se que o backend está atualizado.'
  } finally {
    loading.value = false
  }
})

// Helpers Visuais
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
    if (s.value === val && s.value > 0) s.value = val - 1
    else s.value = val
  }
}

const getPowerVal = (id: string) => form.value.powers.find(p => p.powerId === id)?.value || 0
const setPowerVal = (id: string, val: number) => {
  const p = form.value.powers.find(x => x.powerId === id)
  if (p) {
    if (p.value === val && p.value > 0) p.value = val - 1
    else p.value = val
  }
}

const getBgVal = (id: string) => form.value.backgrounds.find(b => b.backgroundId === id)?.value || 0
const setBgVal = (id: string, val: number) => {
  const b = form.value.backgrounds.find(x => x.backgroundId === id)
  if (b) {
    if (b.value === val && b.value > 0) b.value = val - 1
    else b.value = val
  }
}

const toggleMerit = (id: string, points: any) => {
  const m = form.value.meritsFlaws.find(x => x.meritId === id)
  if (m) {
    if (m.points) m.points = 0
    else m.points = Number(points) || 1
  }
}

const goBack = () => router.push(`/characters/${systemParam.toLowerCase()}`)

// Avatar Upload na Criação
const avatarFile = ref<File | null>(null)
const avatarPreviewUrl = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const handleFileClick = () => {
  if (fileInput.value) fileInput.value.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    avatarFile.value = target.files[0]
    avatarPreviewUrl.value = URL.createObjectURL(target.files[0])
  }
}

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
      vampirePredatorId: form.value.vampirePredatorId || undefined,
      vampireResonanceId: form.value.vampireResonanceId || undefined,
      vampireGeneration: form.value.vampireGeneration || 13,
      vampireSire: form.value.vampireSire || undefined,
      vampireHunger: form.value.vampireHunger || 1,
      vampireAmbition: form.value.vampireAmbition || undefined,
      vampireDesire: form.value.vampireDesire || undefined,
      attributes: form.value.attributes,
      skills: form.value.skills.filter(s => s.value > 0),
      powers: form.value.powers.filter(p => p.value > 0).map(p => ({ powerDefinitionId: p.powerId, level: p.value })),
      backgrounds: form.value.backgrounds.filter(b => b.value > 0).map(b => ({ backgroundDefinitionId: b.backgroundId, value: b.value })),
      meritsFlaws: form.value.meritsFlaws.filter(m => m.points !== 0).map(m => ({ meritFlawId: m.meritId, points: m.points }))
    }

    const res = await axios.post('https://api.liragames.com.br/api/characters', payload, {
      headers: { Authorization: `Bearer ${token}` }
    })

    const newCharacterId = res.data.id;

    // Se escolheu uma imagem, faz o upload logo após criar o personagem
    if (avatarFile.value && newCharacterId) {
      const formData = new FormData()
      formData.append('avatar', avatarFile.value)
      
      try {
        await axios.post(`https://api.liragames.com.br/api/characters/${newCharacterId}/avatar`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
      } catch (imgError) {
        console.error("Erro ao subir a imagem na criação:", imgError)
        // Não impede a navegação se a imagem falhar, mas avisa
      }
    }

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
    <div class="fixed inset-0 pointer-events-none z-0" :style="{ background: `radial-gradient(ellipse at 50% 0%, ${theme.glow.replace('0.5', '0.15')} 0%, transparent 80%)` }"></div>

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
      
      <button @click="submit" :disabled="saving" class="bg-gold text-black font-bold px-5 py-2.5 rounded text-xs tracking-widest uppercase hover:bg-white hover:scale-105 transition-all disabled:opacity-50">
        {{ saving ? 'Forjando...' : 'Forjar Personagem' }}
      </button>
    </header>

    <div class="relative z-10 max-w-[1300px] mx-auto px-6 md:px-12 pt-12">
      <!-- LOADING -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20 space-y-4">
        <div class="w-12 h-12 border-4 border-t-gold border-r-gold border-b-white/10 border-l-white/10 rounded-full animate-spin"></div>
        <p class="font-serif text-[10px] tracking-[3px] uppercase text-gold-dim">Acessando Banco de Regras...</p>
      </div>

      <!-- MAIN LAYOUT 2 COLUMNS -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-10 items-start">
        
        <!-- LEFT COLUMN: PORTRAIT & SUMMARY -->
        <div class="sticky top-[90px] flex flex-col gap-5">
          <div 
            class="relative rounded-2xl overflow-hidden border border-gold-dim/35 shadow-[0_8px_40px_rgba(0,0,0,0.8)] group cursor-pointer" 
            :style="{ boxShadow: `0 8px 40px rgba(0,0,0,0.8), 0 0 30px ${theme.glow}` }"
            @click="handleFileClick"
          >
            <!-- Input oculto -->
            <input 
              type="file" 
              ref="fileInput" 
              class="hidden" 
              accept="image/png, image/jpeg, image/webp" 
              @change="handleFileSelect" 
            />

            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 pointer-events-none"></div>
            
            <img :src="avatarPreviewUrl || '/images/adventure.png'" class="w-full aspect-[3/4] object-cover saturate-[0.6] opacity-60 transition-transform duration-500 group-hover:scale-105" />
            
            <!-- Upload Overlay -->
            <div class="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
              <span class="text-3xl mb-2 text-gold-dim drop-shadow-md">📸</span>
              <span class="font-serif text-[12px] uppercase tracking-[2px] text-gold-dim drop-shadow-md">Escolher Imagem</span>
            </div>

            <div class="absolute inset-x-0 bottom-0 p-6 z-20 flex flex-col items-center justify-end">
              <span class="font-serif text-[10px] tracking-[3px] uppercase text-gold-dim mb-2 text-center drop-shadow-md">NOVA LENDA</span>
            </div>
            
            <span :class="['absolute top-3 left-3 w-4 h-4 border-t border-l rounded-tl-sm opacity-50 z-20', theme.borderClass]"></span>
            <span :class="['absolute top-3 right-3 w-4 h-4 border-t border-r rounded-tr-sm opacity-50 z-20', theme.borderClass]"></span>
            <span :class="['absolute bottom-3 left-3 w-4 h-4 border-b border-l rounded-bl-sm opacity-50 z-20', theme.borderClass]"></span>
            <span :class="['absolute bottom-3 right-3 w-4 h-4 border-b border-r rounded-br-sm opacity-50 z-20', theme.borderClass]"></span>
          </div>

          <!-- Basic Data Summary Panel -->
          <div class="bg-black/40 border border-white/10 rounded-xl p-5 space-y-4 shadow-xl">
            <div class="flex justify-between items-center border-b border-white/5 pb-2">
              <span class="font-serif text-[9px] tracking-[2px] uppercase text-text-dim">Clã / Tribo</span>
              <span :class="['font-serif text-[10px] tracking-[1px] uppercase', theme.textClass]">{{ clans.find(c => c.id === form.vampireClaId)?.name || 'Desconhecido' }}</span>
            </div>
            <div class="flex justify-between items-center border-b border-white/5 pb-2">
              <span class="font-serif text-[9px] tracking-[2px] uppercase text-text-dim">Natureza</span>
              <span class="font-sans text-xs text-parchment-dim">{{ form.nature || '---' }}</span>
            </div>
            <div class="flex justify-between items-center pb-2">
              <span class="font-serif text-[9px] tracking-[2px] uppercase text-text-dim">Comportamento</span>
              <span class="font-sans text-xs text-parchment-dim">{{ form.demeanor || '---' }}</span>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: NAME & TABS -->
        <div class="flex-1 flex flex-col min-w-0">
          
          <!-- NAME HEADER -->
          <div class="mb-8 relative border-l-2 pl-6" :class="theme.borderClass">
            <div v-if="sysUpper === 'VAMPIRE' && form.vampireClaId" :class="['inline-flex items-center justify-center gap-2 font-serif text-[10px] tracking-[2px] uppercase px-3 py-1 rounded-full border mb-4 bg-black/50', theme.textClass, theme.borderClass]">
              {{ theme.icon }} {{ clans.find(c => c.id === form.vampireClaId)?.name }}
            </div>
            <h1 class="font-deco text-4xl sm:text-5xl lg:text-6xl text-gold leading-none tracking-wide drop-shadow-[0_2px_10px_rgba(201,168,76,0.3)] mb-2 uppercase break-words">
              {{ form.name || 'SEM NOME' }}
            </h1>
            <p class="font-sans italic text-sm md:text-base text-parchment-dim">
              {{ form.concept || 'Qual é o seu conceito?' }}
            </p>
          </div>

          <div v-if="errorMsg" class="mb-6 bg-red-900/30 border border-red-500/50 p-4 rounded-xl text-center backdrop-blur-sm">
            <p class="font-serif text-red-400 tracking-widest uppercase text-xs">{{ errorMsg }}</p>
          </div>

          <!-- TABS -->
          <div class="flex flex-wrap items-center gap-x-8 gap-y-4 border-b border-white/10 mb-8">
            <button v-for="tab in tabs" :key="tab.id"
                    @click="activeTab = tab.id"
                    :class="[
                      'pb-2 font-serif text-[11px] tracking-[3px] uppercase whitespace-nowrap transition-all duration-300 relative',
                      activeTab === tab.id ? `text-gold` : 'text-text-dim hover:text-parchment'
                    ]">
              {{ tab.label }}
              <!-- Active Indicator -->
              <span v-if="activeTab === tab.id" 
                    :class="['absolute bottom-0 left-0 w-full h-[2px] shadow-[0_0_10px_currentColor]', theme.c1Class]"></span>
            </button>
          </div>

          <!-- TAB CONTENT -->
          <div class="bg-black/30 border border-white/5 rounded-xl p-6 lg:p-10 shadow-xl min-h-[400px]">
            
            <!-- IDENTIDADE -->
            <div v-show="activeTab === 'identidade'" class="animate-fade-in space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-2">
                  <label class="block font-serif text-[10px] tracking-[2px] uppercase text-gold-dim">Nome do Personagem</label>
                  <input v-model="form.name" type="text" placeholder="Nome Verdadeiro ou Alcunha" class="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-parchment focus:outline-none focus:border-gold transition-colors font-sans" />
                </div>
                <div class="space-y-2">
                  <label class="block font-serif text-[10px] tracking-[2px] uppercase text-gold-dim">Conceito</label>
                  <input v-model="form.concept" type="text" placeholder="Ex: Detetive Arruinado" class="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-parchment focus:outline-none focus:border-gold transition-colors font-sans" />
                </div>
                <!-- VAMPIRE SPECIFIC -->
                <div v-if="sysUpper === 'VAMPIRE'" class="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label class="block font-serif text-[10px] tracking-[2px] uppercase text-gold-dim mb-2">Clã</label>
                    <select v-model="form.vampireClaId" required class="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-parchment font-serif focus:outline-none focus:border-gold transition-colors appearance-none">
                      <option value="" disabled>Selecione um clã...</option>
                      <option v-for="c in clans" :key="c.id" :value="c.id">{{ c.name }}</option>
                    </select>
                  </div>
                  <div>
                    <label class="block font-serif text-[10px] tracking-[2px] uppercase text-gold-dim mb-2">Geração</label>
                    <select v-model="form.vampireGeneration" required class="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-parchment font-serif focus:outline-none focus:border-gold transition-colors appearance-none">
                      <option v-for="gen in [8, 9, 10, 11, 12, 13, 14, 15, 16]" :key="gen" :value="gen">{{ gen }}ª Geração</option>
                    </select>
                  </div>
                  <div>
                    <label class="block font-serif text-[10px] tracking-[2px] uppercase text-gold-dim mb-2">Predador</label>
                    <select v-model="form.vampirePredatorId" required class="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-parchment font-serif focus:outline-none focus:border-gold transition-colors appearance-none">
                      <option value="" disabled>Selecione...</option>
                      <option v-for="p in predatorsDef" :key="p.id" :value="p.id">{{ p.nome }}</option>
                    </select>
                  </div>
                  <div>
                    <label class="block font-serif text-[10px] tracking-[2px] uppercase text-gold-dim mb-2">Ressonância</label>
                    <select v-model="form.vampireResonanceId" required class="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-parchment font-serif focus:outline-none focus:border-gold transition-colors appearance-none">
                      <option value="" disabled>Selecione...</option>
                      <option v-for="r in resonancesDef" :key="r.id" :value="r.id">{{ r.nome }}</option>
                    </select>
                  </div>
                  <div>
                    <label class="block font-serif text-[10px] tracking-[2px] uppercase text-gold-dim mb-2">Senhor</label>
                    <input v-model="form.vampireSire" type="text" placeholder="Nome do Senhor..." class="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-parchment focus:outline-none focus:border-gold transition-colors font-sans" />
                  </div>
                  <div>
                    <label class="block font-serif text-[10px] tracking-[2px] uppercase text-gold-dim mb-2">Fome Inicial</label>
                    <select v-model="form.vampireHunger" required class="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-parchment font-serif focus:outline-none focus:border-gold transition-colors appearance-none">
                      <option v-for="n in 6" :key="n-1" :value="n-1">{{ n-1 }}</option>
                    </select>
                  </div>
                  <div>
                    <label class="block font-serif text-[10px] tracking-[2px] uppercase text-gold-dim mb-2">Ambição</label>
                    <input v-model="form.vampireAmbition" type="text" placeholder="O que deseja a longo prazo..." class="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-parchment focus:outline-none focus:border-gold transition-colors font-sans" />
                  </div>
                  <div>
                    <label class="block font-serif text-[10px] tracking-[2px] uppercase text-gold-dim mb-2">Desejo</label>
                    <input v-model="form.vampireDesire" type="text" placeholder="O que deseja esta noite..." class="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-parchment focus:outline-none focus:border-gold transition-colors font-sans" />
                  </div>
                </div>
                <div class="space-y-2">
                  <label class="block font-serif text-[10px] tracking-[2px] uppercase text-gold-dim">Natureza</label>
                  <input v-model="form.nature" type="text" placeholder="Ex: Sobrevivente" class="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-parchment focus:outline-none focus:border-gold transition-colors font-sans" />
                </div>
                <div class="space-y-2">
                  <label class="block font-serif text-[10px] tracking-[2px] uppercase text-gold-dim">Comportamento</label>
                  <input v-model="form.demeanor" type="text" placeholder="Ex: Galante" class="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-parchment focus:outline-none focus:border-gold transition-colors font-sans" />
                </div>
              </div>
            </div>

            <!-- ATRIBUTOS -->
            <div v-show="activeTab === 'atributos'" class="animate-fade-in space-y-8">
              <div v-for="type in ['FÍSICO', 'SOCIAL', 'MENTAL']" :key="type">
                <h3 class="font-serif text-[11px] tracking-[3px] uppercase text-gold-dim mb-4 border-b border-white/10 pb-2">{{ type }}</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div v-for="attr in getAttrsByType(type)" :key="attr.id" class="flex items-center justify-between group">
                    <span class="font-serif text-[13px] tracking-[1px] text-parchment group-hover:text-white transition-colors">{{ attr.name }}</span>
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

            <!-- HABILIDADES -->
            <div v-show="activeTab === 'habilidades'" class="animate-fade-in">
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div v-for="type in ['TALENTOS', 'PERICIAS', 'CONHECIMENTOS', 'FÍSICO', 'SOCIAL', 'MENTAL', 'NIVEL_1', 'NIVEL_2', 'NIVEL_3']" :key="type">
                  <div v-if="getSkillsByType(type).length > 0">
                    <h3 class="font-serif text-[11px] tracking-[3px] uppercase text-gold-dim mb-4 border-b border-white/10 pb-2">{{ type }}</h3>
                    <div class="space-y-4">
                      <div v-for="skill in getSkillsByType(type)" :key="skill.id" class="flex items-center justify-between group">
                        <span class="font-serif text-[11px] tracking-[0.5px] text-parchment group-hover:text-white transition-colors line-clamp-1 mr-2">{{ skill.name }}</span>
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
            </div>

            <!-- VANTAGENS / DISCIPLINAS -->
            <div v-show="activeTab === 'vantagens'" class="animate-fade-in">
              <h3 class="font-serif text-[11px] tracking-[3px] uppercase text-gold-dim mb-6 border-b border-white/10 pb-2">
                {{ sysUpper === 'VAMPIRE' ? 'DISCIPLINAS' : 'PODERES' }}
              </h3>
              <div class="columns-1 md:columns-2 lg:columns-3 gap-x-12">
                <div v-for="power in powersDef" :key="power.id" class="flex items-center justify-between group break-inside-avoid mb-5">
                  <span class="font-serif text-[12px] tracking-[0.5px] text-parchment group-hover:text-white transition-colors line-clamp-1 mr-2">{{ power.name }}</span>
                  <div class="flex gap-1 cursor-pointer shrink-0">
                    <div v-for="i in 5" :key="i" 
                         @click="setPowerVal(power.id, i)"
                         :class="[
                           'w-2.5 h-2.5 rounded-full border transition-all duration-300', 
                           i <= getPowerVal(power.id) ? `bg-gold border-gold shadow-[0_0_5px_rgba(201,168,76,0.5)]` : 'border-white/20 bg-transparent hover:border-white/50'
                         ]">
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ANTECEDENTES -->
            <div v-show="activeTab === 'antecedentes'" class="animate-fade-in">
              <h3 class="font-serif text-[11px] tracking-[3px] uppercase text-gold-dim mb-6 border-b border-white/10 pb-2">ANTECEDENTES</h3>
              <div class="columns-1 md:columns-2 lg:columns-3 gap-x-12">
                <div v-for="bg in backgroundsDef" :key="bg.id" class="flex items-center justify-between group break-inside-avoid mb-5">
                  <span class="font-serif text-[12px] tracking-[0.5px] text-parchment group-hover:text-white transition-colors line-clamp-1 mr-2">{{ bg.name }}</span>
                  <div class="flex gap-1 cursor-pointer shrink-0">
                    <div v-for="i in 5" :key="i" 
                         @click="setBgVal(bg.id, i)"
                         :class="[
                           'w-2.5 h-2.5 rounded-full border transition-all duration-300', 
                           i <= getBgVal(bg.id) ? `bg-gold border-gold shadow-[0_0_5px_rgba(201,168,76,0.5)]` : 'border-white/20 bg-transparent hover:border-white/50'
                         ]">
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- QUALIDADES E DEFEITOS -->
            <div v-show="activeTab === 'tracos'" class="animate-fade-in">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <!-- Qualidades -->
                <div>
                  <h3 class="font-serif text-[11px] tracking-[3px] uppercase text-gold-dim mb-4 border-b border-white/10 pb-2">QUALIDADES</h3>
                  <div class="space-y-3">
                    <div v-for="merit in meritsDef.filter(m => m.type === 'MERIT')" :key="merit.id" 
                         @click="toggleMerit(merit.id, merit.cost)"
                         class="cursor-pointer flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                      <div class="flex flex-col">
                        <span class="font-serif text-[11px] text-parchment">{{ merit.name }}</span>
                        <span class="font-sans text-[9px] text-text-dim italic mt-0.5">{{ merit.cost }} pts</span>
                      </div>
                      <button :class="[
                                'w-5 h-5 rounded-sm border transition-all flex items-center justify-center',
                                form.meritsFlaws.find(m => m.meritId === merit.id)?.points ? 'bg-gold border-gold' : 'border-white/20 bg-black/50'
                              ]">
                        <span v-if="form.meritsFlaws.find(m => m.meritId === merit.id)?.points" class="text-black text-xs font-bold leading-none">✓</span>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Defeitos -->
                <div>
                  <h3 class="font-serif text-[11px] tracking-[3px] uppercase text-red-500/70 mb-4 border-b border-red-500/20 pb-2">DEFEITOS</h3>
                  <div class="space-y-3">
                    <div v-for="flaw in meritsDef.filter(m => m.type === 'FLAW')" :key="flaw.id" 
                         @click="toggleMerit(flaw.id, flaw.cost)"
                         class="cursor-pointer flex items-center justify-between p-3 rounded-lg border border-red-500/10 bg-red-900/10 hover:bg-red-900/20 transition-colors">
                      <div class="flex flex-col">
                        <span class="font-serif text-[11px] text-parchment">{{ flaw.name }}</span>
                        <span class="font-sans text-[9px] text-red-400/70 italic mt-0.5">+{{ flaw.cost }} pts</span>
                      </div>
                      <button :class="[
                                'w-5 h-5 rounded-sm border transition-all flex items-center justify-center',
                                form.meritsFlaws.find(m => m.meritId === flaw.id)?.points ? 'bg-red-600 border-red-600' : 'border-red-500/30 bg-black/50'
                              ]">
                        <span v-if="form.meritsFlaws.find(m => m.meritId === flaw.id)?.points" class="text-white text-xs font-bold leading-none">✓</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- FORJAR / REVISÃO -->
            <div v-show="activeTab === 'revisao'" class="animate-fade-in flex flex-col items-center justify-center text-center py-10">
              <h2 class="font-deco text-3xl text-gold mb-6 drop-shadow-md">Revisão do Pacto</h2>
              <p class="font-sans text-sm text-parchment-dim max-w-xl mb-10 leading-relaxed">
                Toda criação exige um sacrifício. Certifique-se que seus atributos e habilidades refletem sua verdadeira natureza antes de finalizar o processo. Uma vez forjado, o destino estará traçado.
              </p>
              
              <button @click="submit" :disabled="saving" :class="['relative group overflow-hidden font-serif text-[14px] tracking-[3px] uppercase px-12 py-4 rounded bg-white text-black font-bold transition-all hover:text-white shadow-[0_0_30px_rgba(255,255,255,0.2)] disabled:opacity-50', theme.hoverBorder]">
                <div class="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
                <span class="relative z-10">{{ saving ? 'Forjando nas Trevas...' : 'Forjar Personagem' }}</span>
              </button>
            </div>

          </div>
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
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
