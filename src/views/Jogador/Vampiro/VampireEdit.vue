<template>
  <div class="min-h-screen font-body flex flex-col" style="background-color: var(--bg-deep); color: var(--text-main); background-image: radial-gradient(ellipse at 20% 10%, rgba(139,0,0,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 90%, rgba(42,26,92,0.1) 0%, transparent 60%);">
    
    <!-- PARTICLES -->
    <div id="particles" aria-hidden="true" class="pointer-events-none fixed inset-0 z-0"></div>

    <!-- Loading inicial -->
    <div v-if="loading" class="fixed inset-0 flex items-center justify-center bg-[#06000a] z-[200]">
      <p class="font-title text-xl text-[var(--blood-bright)] animate-pulse italic">Despertando as sombras...</p>
    </div>

    <header id="main-header">
      <div class="header-inner">
        <div class="header-logo" @click="router.push('/jogador')" style="cursor: pointer;">
          <span class="logo-symbol">⚜</span>
          <div class="logo-text">
            <span class="logo-title">Camarilla</span>
            <span class="logo-sub">de São Paulo</span>
          </div>
        </div>
        <nav class="header-nav hidden md:flex items-center">
          <a @click.prevent="router.push('/jogador')" class="header-home-link" style="cursor: pointer;">⚜ Mundo das Trevas</a>
          <span class="nav-sep">|</span>
          <a href="#" class="header-home-link cursor-not-allowed">🗺️ Mapa da Cidade</a>
          <span class="nav-sep">|</span>
          <span class="text-[var(--blood-bright)] font-bold cursor-pointer" @click="router.push('/jogador/vampire')">Vampiro: A Máscara</span>
        </nav>
      </div>
      <div class="header-bar"></div>
    </header>

    <main class="flex-grow pb-24 relative z-10" v-if="!loading">
      
      <button class="back-btn" @click="router.push('/jogador/vampire')">
        <span class="back-arrow">←</span> Voltar à Galeria
      </button>

      <div class="detail-container">
        <!-- Notificações -->
        <div v-if="errorMsg" class="mb-4 mt-4 bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 text-sm rounded">{{ errorMsg }}</div>
        <div v-if="successMsg" class="mb-4 mt-4 bg-green-900/50 border border-green-700 text-green-200 px-4 py-3 text-sm rounded">{{ successMsg }}</div>

        <div class="detail-grid mt-6">
          
          <!-- LEFT COLUMN -->
          <div class="detail-portrait-col">
            <div class="detail-portrait-wrap" :style="`--detail-glow: ${getClanConfig().cor}88;`" @click="triggerAvatarUpload">
              <input type="file" ref="avatarInput" hidden @change="handleAvatarChange" accept="image/*" />
              <img :src="form.avatarUrl || '/images/vampire.png'" alt="Retrato do Personagem" class="min-h-[400px] object-cover" />
              <div class="detail-portrait-overlay"></div>
              <div class="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/50 cursor-pointer">
                <span class="text-white text-3xl">📸</span>
              </div>
              <div class="detail-portrait-info">
                <div class="detail-hum-label">Humanidade</div>
                <div class="detail-humanidade flex gap-1 cursor-pointer">
                  <span v-for="i in 10" :key="i" @click="traits.humanity = i" :class="['detail-hum-dot', { 'empty': i > traits.humanity }]"></span>
                </div>
              </div>
            </div>

            <!-- Stats -->
            <div class="detail-stat-row" style="margin-top:18px;">
              <div class="detail-stat cursor-pointer hover:border-[var(--gold)]" @click="increaseStat('wp')">
                <span class="stat-label">F. Vontade</span>
                <span class="stat-value" :style="`color: ${getClanConfig().corTexto};`">{{ wpMax }}</span>
              </div>
              <div class="detail-stat cursor-pointer hover:border-[var(--blood-bright)]" @click="traits.humanity = traits.humanity >= 10 ? 1 : traits.humanity + 1">
                <span class="stat-label">Humanidade</span>
                <span class="stat-value" style="color:var(--blood-bright);">{{ traits.humanity }}</span>
              </div>
              <div class="detail-stat cursor-pointer hover:border-[var(--blood-bright)]" @click="traits.bloodPotency = traits.bloodPotency >= 10 ? 1 : traits.bloodPotency + 1">
                <span class="stat-label">P. Sangue</span>
                <span class="stat-value" style="color:var(--blood-bright);">{{ traits.bloodPotency }}</span>
              </div>
            </div>

            <!-- Badges -->
            <div class="detail-badges" style="margin-top:18px;">
              <div class="detail-badge-row">
                <span class="detail-badge flex items-center" :style="`background:${getClanConfig().cor}44; color:${getClanConfig().corTexto}; border-color:${getClanConfig().corTexto}55;`">
                  <span class="mr-1">{{ getClanConfig().icone }}</span>
                  <input v-model="form.clan" class="bg-transparent border-b border-transparent hover:border-[#aaa] focus:border-white focus:outline-none ml-1 w-24 uppercase font-title" placeholder="Clã" />
                  — SANGUE AZUL
                </span>
              </div>
              <div class="detail-badge-row">
                <span class="detail-badge flex items-center" style="color:var(--parchment-dim);border-color:var(--border-dark);">
                  <input v-model="form.predatorType" class="bg-transparent border-b border-transparent hover:border-[#aaa] focus:border-white focus:outline-none w-20 text-center uppercase font-title text-[9px]" placeholder="Natureza" />
                </span>
                <span class="detail-badge flex items-center" style="color:var(--parchment-dim);border-color:var(--border-dark);">
                  <input v-model="form.ambition" class="bg-transparent border-b border-transparent hover:border-[#aaa] focus:border-white focus:outline-none w-24 text-center uppercase font-title text-[9px]" placeholder="Comportamento" />
                </span>
              </div>
            </div>

          </div>

          <!-- RIGHT COLUMN -->
          <div class="detail-info-col">
            <div class="detail-header-block" :style="`border-left: 3px solid ${getClanConfig().corTexto};`">
              <div class="detail-cla-badge" :style="`background:${getClanConfig().cor}44; color:${getClanConfig().corTexto}; border-color:${getClanConfig().corTexto}55;`">
                 {{ getClanConfig().icone }} {{ form.clan || 'Desconhecido' }}
              </div>
              
              <button @click="handleSave" :disabled="saving" class="btn-missions" style="float: right; cursor: pointer;">
                <span v-if="saving">SALVANDO...</span>
                <span v-else>💾 SALVAR FICHA</span>
              </button>
              
              <input v-model="form.name" class="bg-transparent border-none w-full detail-nome focus:outline-none focus:ring-0 mb-1" placeholder="Nome do Personagem" />
              
              <div class="flex items-center mb-2">
                <span class="detail-pseudonimo mr-1" style="margin-bottom:0;">Conceito:</span>
                <input v-model="form.concept" class="bg-transparent border-none w-full detail-pseudonimo focus:outline-none" style="margin-bottom:0;" placeholder="Ex: Historiador Macabro" />
              </div>
              
              <textarea v-model="form.chronicle" class="w-full bg-transparent border-none detail-descricao-cla focus:outline-none resize-none mt-2 h-16" placeholder="Descrição rápida ou Crônica atual..."></textarea>
            </div>

            <!-- TABS NAV -->
            <div class="tabs-nav" role="tablist">
              <button :class="['tab-btn', { active: activeTab === 'atributos' }]" @click="activeTab = 'atributos'">Atributos</button>
              <button :class="['tab-btn', { active: activeTab === 'habilidades' }]" @click="activeTab = 'habilidades'">Habilidades</button>
              <button :class="['tab-btn', { active: activeTab === 'disciplinas' }]" @click="activeTab = 'disciplinas'">Disciplinas</button>
              <button :class="['tab-btn', { active: activeTab === 'historico' }]" @click="activeTab = 'historico'">Histórico</button>
            </div>

            <!-- TAB: ATRIBUTOS -->
            <div class="tab-panel" :class="{ active: activeTab === 'atributos' }">
              
              <div class="attr-group">
                <p class="section-title">Físicos</p>
                <div class="attr-row"><span class="attr-name">Força</span><PipRow v-model="attrs.forca" :max="5" /></div>
                <div class="attr-row"><span class="attr-name">Destreza</span><PipRow v-model="attrs.destreza" :max="5" /></div>
                <div class="attr-row"><span class="attr-name">Vigor</span><PipRow v-model="attrs.vigor" :max="5" /></div>
              </div>
              
              <div class="attr-group">
                <p class="section-title">Sociais</p>
                <div class="attr-row"><span class="attr-name">Carisma</span><PipRow v-model="attrs.carisma" :max="5" /></div>
                <div class="attr-row"><span class="attr-name">Manipulação</span><PipRow v-model="attrs.manipulacao" :max="5" /></div>
                <div class="attr-row"><span class="attr-name">Autocontrole</span><PipRow v-model="attrs.autocontrole" :max="5" /></div>
              </div>

              <div class="attr-group">
                <p class="section-title">Mentais</p>
                <div class="attr-row"><span class="attr-name">Inteligência</span><PipRow v-model="attrs.inteligencia" :max="5" /></div>
                <div class="attr-row"><span class="attr-name">Raciocínio</span><PipRow v-model="attrs.raciocinio" :max="5" /></div>
                <div class="attr-row"><span class="attr-name">Determinação</span><PipRow v-model="attrs.determinacao" :max="5" /></div>
              </div>
              
              <p class="section-title">Fome</p>
              <div class="attr-row">
                 <span class="attr-name">Nível de Fome</span>
                 <PipRow v-model="traits.hunger" :max="5" color="var(--blood-bright)" />
              </div>

            </div>

            <!-- TAB: HABILIDADES -->
            <div class="tab-panel" :class="{ active: activeTab === 'habilidades' }">
               <p class="section-title">Físicas (Talentos)</p>
               <div class="skill-grid">
                  <div class="skill-item" v-for="sk in physicalSkills" :key="sk.key">
                    <span class="skill-name">{{ sk.label }}</span><PipRow v-model="skills[sk.key]" :max="5" isSkill />
                  </div>
               </div>
               
               <p class="section-title">Sociais (Perícias)</p>
               <div class="skill-grid">
                  <div class="skill-item" v-for="sk in socialSkills" :key="sk.key">
                    <span class="skill-name">{{ sk.label }}</span><PipRow v-model="skills[sk.key]" :max="5" isSkill />
                  </div>
               </div>
               
               <p class="section-title">Mentais (Conhecimentos)</p>
               <div class="skill-grid">
                  <div class="skill-item" v-for="sk in mentalSkills" :key="sk.key">
                    <span class="skill-name">{{ sk.label }}</span><PipRow v-model="skills[sk.key]" :max="5" isSkill />
                  </div>
               </div>
            </div>

            <!-- TAB: DISCIPLINAS -->
            <div class="tab-panel" :class="{ active: activeTab === 'disciplinas' }">
              <p class="section-title">Poderes Sobrenaturais</p>
              <div class="disc-grid">
                <div class="disc-item" v-for="(disc, idx) in disciplines" :key="idx" :style="`border-left: 2px solid ${getClanConfig().corTexto};`">
                  <div style="flex:1; display:flex; flex-direction:column;">
                    <input v-model="disc.name" class="bg-transparent border-none text-[var(--parchment)] font-title text-[13px] tracking-[1px] uppercase focus:outline-none w-full" placeholder="Nome da Disciplina" />
                    <textarea v-model="disc.powers" class="bg-transparent border-none text-[var(--text-dim)] text-[12px] font-body italic resize-none w-full mt-2 focus:outline-none" rows="2" placeholder="Poder 1, Poder 2..."></textarea>
                  </div>
                  <div class="disc-bar" style="margin-left: 16px;">
                    <PipRow v-model="disc.level" :max="5" :color="getClanConfig().corTexto" />
                  </div>
                </div>
                
                <button @click="addDiscipline" class="filter-btn mt-4 text-center mx-auto block" style="width: 200px;">
                  + Adicionar Disciplina
                </button>
              </div>
            </div>

            <!-- TAB: HISTÓRICO -->
            <div class="tab-panel" :class="{ active: activeTab === 'historico' }">
              <p class="section-title">História Completa</p>
              <textarea v-model="form.history" class="w-full bg-[rgba(201,168,76,0.03)] text-[var(--text-main)] border border-[var(--border-dark)] rounded-[var(--radius-lg)] p-6 mb-5 font-body leading-relaxed focus:outline-none resize-none min-h-[250px]" placeholder="Escreva a trajetória do personagem..."></textarea>

              <p class="section-title">Aparência</p>
              <textarea v-model="form.appearance" class="w-full bg-[rgba(201,168,76,0.03)] text-[var(--text-main)] border border-[var(--border-dark)] rounded-[var(--radius-lg)] p-6 mb-5 font-body leading-relaxed focus:outline-none resize-none min-h-[150px]" placeholder="Descreva os traços físicos e roupas..."></textarea>

              <p class="section-title">Vantagens & Defeitos</p>
              <div class="dicas-block">
                <div v-for="(mf, idx) in meritsFlaws" :key="idx" class="flex justify-between items-center mb-3 border-b border-[var(--border-dark)] pb-3">
                  <input v-model="mf.name" class="bg-transparent text-[13px] text-[var(--parchment-dim)] border-none focus:outline-none flex-1 font-title uppercase tracking-wider" placeholder="Nome da Vantagem/Defeito" />
                  <PipRow v-model="mf.level" :max="5" />
                </div>
                <button @click="addMerit" class="text-[var(--gold-dim)] hover:text-[var(--gold)] text-xs font-title uppercase tracking-widest mt-2">+ Adicionar Nova</button>
              </div>
            </div>

          </div>

        </div>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineComponent, h } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '../../../services/api';

const router = useRouter();
const route = useRoute();
const charId = route.params.id;

const loading = ref(true);
const saving = ref(false);
const errorMsg = ref('');
const successMsg = ref('');
const activeTab = ref('atributos');

// ─── Componente Pip Reativo adaptado para a UI Gothic Dark ────────────────
const PipRow = defineComponent({
  props: { 
    modelValue: { type: Number, default: 0 }, 
    max: { type: Number, default: 5 }, 
    color: { type: String, default: 'var(--gold)' }, 
    isSkill: { type: Boolean, default: false } 
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const pips = computed(() => Array.from({ length: props.max }, (_, i) => i < props.modelValue));
    const setPip = (i) => emit('update:modelValue', props.modelValue === i + 1 ? 0 : i + 1);
    
    return () => h('div', { class: props.isSkill ? 'skill-dots' : 'attr-dots' }, pips.value.map((filled, i) => {
      // Estilo do pip dependendo do tipo (skill ou attr/disciplina)
      const dotClass = props.isSkill ? 'skill-dot' : 'dot';
      let styleObj = {};
      if (filled) {
         if (props.isSkill) {
            styleObj = { backgroundColor: 'var(--gold-dim)', borderColor: 'var(--gold-dim)' };
         } else {
            styleObj = { backgroundColor: props.color, borderColor: props.color, boxShadow: `0 0 6px ${props.color}88` };
         }
      }
      return h('span', {
        style: styleObj,
        class: `${dotClass} cursor-pointer hover:border-[#fff] transition-all`,
        onClick: () => setPip(i)
      });
    }));
  }
});

// ─── Estado ────────────────────────────────
const form = ref({ name: '', concept: '', predatorType: '', chronicle: '', ambition: '', clan: '', appearance: '', history: '', avatarUrl: '' });
const attrs = ref({ forca: 1, destreza: 1, vigor: 1, carisma: 1, manipulacao: 1, autocontrole: 1, inteligencia: 1, raciocinio: 1, determinacao: 1 });
const skills = ref({ armasBrancas: 0, armasDeFogo: 0, atletismo: 0, briga: 0, conducao: 0, furtividade: 0, ladroagem: 0, oficios: 0, sobrevivencia: 0, empatiaAnimal: 0, etiqueta: 0, intimidacao: 0, lideranca: 0, manha: 0, performance: 0, persuasao: 0, sagacidade: 0, subferfugio: 0, ciencia: 0, erudicao: 0, financas: 0, investigacao: 0, medicina: 0, ocultismo: 0, percepcao: 0, politica: 0, tecnologia: 0 });
const traits = ref({ bloodPotency: 1, humanity: 7, hunger: 1 });

const wpMax = computed(() => attrs.value.autocontrole + attrs.value.determinacao);
const disciplines = ref([]);
const meritsFlaws = ref([]);

// ─── Upload de Avatar ─────────────────────────
const avatarInput = ref(null);
const triggerAvatarUpload = () => {
  if (charId === 'novo') {
    errorMsg.value = 'Salve o personagem primeiro antes de enviar uma foto.';
    return;
  }
  avatarInput.value.click();
};

const handleAvatarChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('avatar', file);

  try {
    const res = await api.post(`/characters/${charId}/avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    successMsg.value = 'Foto atualizada com sucesso!';
    form.value.avatarUrl = res.data.avatarUrl.startsWith('http') 
      ? res.data.avatarUrl 
      : `${api.defaults.baseURL.replace('/api', '')}${res.data.avatarUrl}`;
  } catch (err) {
    console.error('Erro no upload da foto:', err);
    errorMsg.value = err.response?.data?.error || 'Erro ao enviar a foto.';
  }
};

const physicalSkills = [
  { key: 'armasBrancas', label: 'Armas Brancas' }, { key: 'armasDeFogo', label: 'Armas de Fogo' },
  { key: 'atletismo', label: 'Atletismo' }, { key: 'briga', label: 'Briga' },
  { key: 'conducao', label: 'Condução' }, { key: 'furtividade', label: 'Furtividade' },
  { key: 'ladroagem', label: 'Ladroagem' }, { key: 'oficios', label: 'Ofícios' },
  { key: 'sobrevivencia', label: 'Sobrevivência' }
];
const socialSkills = [
  { key: 'empatiaAnimal', label: 'Empatia Anim.' }, { key: 'etiqueta', label: 'Etiqueta' },
  { key: 'intimidacao', label: 'Intimidação' }, { key: 'lideranca', label: 'Liderança' },
  { key: 'manha', label: 'Manha' }, { key: 'performance', label: 'Performance' },
  { key: 'persuasao', label: 'Persuasão' }, { key: 'sagacidade', label: 'Sagacidade' },
  { key: 'subferfugio', label: 'Subterfúgio' }
];
const mentalSkills = [
  { key: 'ciencia', label: 'Ciência' }, { key: 'erudicao', label: 'Erudição' },
  { key: 'financas', label: 'Finanças' }, { key: 'investigacao', label: 'Investigação' },
  { key: 'medicina', label: 'Medicina' }, { key: 'ocultismo', label: 'Ocultismo' },
  { key: 'percepcao', label: 'Percepção' }, { key: 'politica', label: 'Política' },
  { key: 'tecnologia', label: 'Tecnologia' }
];

const increaseStat = (type) => {
   // Apenas um exemplo visual se houver interação nos stats laterais
   console.log('Clicked', type);
};

const addDiscipline = () => {
   disciplines.value.push({ name: '', level: 1, powers: '' });
};

const addMerit = () => {
   meritsFlaws.value.push({ name: '', level: 1, type: 'MERIT' });
};

// Cores baseadas no protótipo original
const clanConfigs = {
  'Ventrue': { cor: '#1a3a5c', corTexto: '#6fa8dc', icone: '👑' },
  'Gangrel': { cor: '#3d2b1f', corTexto: '#c4894a', icone: '🐺' },
  'Toreador': { cor: '#5c1a3a', corTexto: '#e07aad', icone: '🌹' },
  'Nosferatu': { cor: '#1a2a1a', corTexto: '#6abf69', icone: '🦇' },
  'Brujah': { cor: '#5c1a1a', corTexto: '#e07070', icone: '✊' },
  'Tremere': { cor: '#2a1a5c', corTexto: '#9a7ae0', icone: '🔮' },
};

const getClanConfig = () => {
  const clan = form.value.clan;
  if (clan) {
    const found = Object.keys(clanConfigs).find(k => k.toLowerCase() === clan.toLowerCase());
    if (found) return clanConfigs[found];
  }
  return { cor: '#3a3a3a', corTexto: '#c9a84c', icone: '●' };
};

const attributeDefs = ref([]);
const skillDefs = ref([]);
const powerDefs = ref([]);
const mfDefs = ref([]);

// ─── Carregar dados do personagem ────────────────────────────────
const loadCharacter = async () => {
  try {
    if (charId === 'novo') {
       loading.value = false;
       return;
    }

    const [charRes, attrRes, skillRes, powerRes, mfRes, statusRes, attrDefRes, skillDefRes, powerDefRes, mfDefRes] = await Promise.all([
      api.get(`/characters/${charId}`),
      api.get(`/characters/${charId}/attributes`),
      api.get(`/characters/${charId}/skills`),
      api.get(`/characters/${charId}/powers`),
      api.get(`/characters/${charId}/merits-flaws`),
      api.get(`/characters/${charId}/statuses`).catch(() => ({ data: [] })),
      api.get(`/attribute-definitions`).catch(() => ({ data: [] })),
      api.get(`/skill-definitions`).catch(() => ({ data: [] })),
      api.get(`/power-definitions`).catch(() => ({ data: [] })),
      api.get(`/merit-flaw-definitions`).catch(() => ({ data: [] }))
    ]);

    attributeDefs.value = attrDefRes.data || [];
    skillDefs.value = skillDefRes.data || [];
    powerDefs.value = powerDefRes.data || [];
    mfDefs.value = mfDefRes.data || [];

    form.value.name = charRes.data.name || '';
    if (charRes.data.avatarUrl) {
      form.value.avatarUrl = charRes.data.avatarUrl.startsWith('http') 
        ? charRes.data.avatarUrl 
        : `${api.defaults.baseURL.replace('/api', '')}${charRes.data.avatarUrl}`;
    }

    const getDefName = (list, id) => {
      if (!list || !Array.isArray(list)) return '';
      const item = list.find(d => d.id === id);
      return item ? item.name : '';
    };

    const attrNames = {
      'Força': 'forca', 'Destreza': 'destreza', 'Vigor': 'vigor',
      'Carisma': 'carisma', 'Manipulação': 'manipulacao', 'Autocontrole': 'autocontrole',
      'Inteligência': 'inteligencia', 'Raciocínio': 'raciocinio', 'Determinação': 'determinacao',
      'clan': 'clan', 'concept': 'concept', 'predatorType': 'predatorType',
      'chronicle': 'chronicle', 'ambition': 'ambition', 'appearance': 'appearance',
      'history': 'history', 'bloodPotency': 'bloodPotency', 'humanity': 'humanity', 'hunger': 'hunger'
    };

    attrRes.data.forEach(attr => {
      const realName = attr.attributeDefinition?.name || attr.name || getDefName(attributeDefs.value, attr.attributeId);
      const key = attrNames[realName];
      if (!key) return;

      const numericKeys = ['forca','destreza','vigor','carisma','manipulacao','autocontrole','inteligencia','raciocinio','determinacao','bloodPotency','humanity','hunger'];
      if (numericKeys.includes(key)) {
        if (['bloodPotency','humanity','hunger'].includes(key)) traits.value[key] = Number(attr.value);
        else attrs.value[key] = Number(attr.value);
      } else {
        form.value[key] = attr.description || attr.value || '';
      }
    });

    skillRes.data.forEach(sk => {
      const realName = sk.skillDefinition?.name || sk.name || getDefName(skillDefs.value, sk.skillId);
      if (skills.value[realName] !== undefined) skills.value[realName] = Number(sk.value);
    });

    if (powerRes.data?.length) {
      disciplines.value = powerRes.data.map(p => ({
        id: p.id,
        name: p.powerDefinition?.name || p.name || getDefName(powerDefs.value, p.powerDefinitionId) || '',
        level: Number(p.level || p.value) || 0,
        powers: p.description || ''
      }));
    }

    if (mfRes.data?.length) {
      meritsFlaws.value = mfRes.data.map(mf => ({
        id: mf.id,
        name: mf.meritFlawDefinition?.name || mf.name || getDefName(mfDefs.value, mf.meritFlawId) || 'Desconhecido',
        type: mf.type || mf.meritFlawDefinition?.type || 'MERIT',
        level: Number(mf.points || mf.value) || 0
      }));
    }

  } catch (err) {
    console.error('Erro ao carregar personagem:', err);
    errorMsg.value = 'Erro ao carregar dados do personagem.';
  } finally {
    loading.value = false;
  }
};

onMounted(loadCharacter);

// ─── Salvar alterações ────────────────────────────────
const handleSave = async () => {
  saving.value = true;
  errorMsg.value = '';
  successMsg.value = '';
  try {
    const getDefId = (list, name) => {
      const item = list.find(d => d.name.toLowerCase() === name.toLowerCase());
      return item ? item.id : null;
    };

    // Montar Atributos
    const payloadAttributes = [];
    const attrMap = [
      { name: 'Força', value: attrs.value.forca, type: 'number' }, { name: 'Destreza', value: attrs.value.destreza, type: 'number' },
      { name: 'Vigor', value: attrs.value.vigor, type: 'number' }, { name: 'Carisma', value: attrs.value.carisma, type: 'number' },
      { name: 'Manipulação', value: attrs.value.manipulacao, type: 'number' }, { name: 'Autocontrole', value: attrs.value.autocontrole, type: 'number' },
      { name: 'Inteligência', value: attrs.value.inteligencia, type: 'number' }, { name: 'Raciocínio', value: attrs.value.raciocinio, type: 'number' },
      { name: 'Determinação', value: attrs.value.determinacao, type: 'number' },
      { name: 'clan', value: form.value.clan, type: 'string' }, { name: 'concept', value: form.value.concept, type: 'string' },
      { name: 'chronicle', value: form.value.chronicle, type: 'string' }, { name: 'predatorType', value: form.value.predatorType, type: 'string' },
      { name: 'ambition', value: form.value.ambition, type: 'string' }, { name: 'appearance', value: form.value.appearance, type: 'string' },
      { name: 'history', value: form.value.history, type: 'string' },
      { name: 'bloodPotency', value: traits.value.bloodPotency, type: 'number' }, { name: 'humanity', value: traits.value.humanity, type: 'number' },
      { name: 'hunger', value: traits.value.hunger, type: 'number' },
    ];

    for (const a of attrMap) {
      if (a.value !== undefined && a.value !== '') {
        const id = getDefId(attributeDefs.value, a.name);
        if (id) {
          if (a.type === 'string') {
             payloadAttributes.push({ attributeId: id, value: 1, description: String(a.value) });
          } else {
             payloadAttributes.push({ attributeId: id, value: Number(a.value) });
          }
        }
      }
    }

    // Montar Habilidades
    const payloadSkills = [];
    for (const [sName, sValue] of Object.entries(skills.value)) {
       if (sValue > 0) {
         const id = getDefId(skillDefs.value, sName);
         if (id) payloadSkills.push({ skillId: id, value: Number(sValue) });
       }
    }

    // Montar Disciplinas (simplificado para nível)
    const payloadPowers = [];
    for (const d of disciplines.value) {
      if (d.name && d.level > 0) {
        const id = getDefId(powerDefs.value, d.name);
        if (id) payloadPowers.push({ powerDefinitionId: id, level: Number(d.level) });
      }
    }

    const payload = {
      name: form.value.name,
      gameStyle: 'VAMPIRE',
      attributes: payloadAttributes,
      skills: payloadSkills,
      powers: payloadPowers
    };

    if (charId === 'novo') {
       const res = await api.post('/characters', payload);
       successMsg.value = 'Personagem criado com sucesso!';
       setTimeout(() => router.push(`/jogador/vampire/personagem/${res.data.id}`), 1500);
    } else {
       await api.put(`/characters/${charId}`, payload);
       successMsg.value = 'Ficha salva com sucesso!';
    }
  } catch (err) {
    console.error('Erro ao salvar ficha:', err);
    errorMsg.value = err.response?.data?.error || 'Erro ao salvar ficha. Verifique sua conexão.';
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
/* O layout principal está no src/style.css, herda automaticamente as classes de .detail-container, .tabs-nav, etc. */
</style>
