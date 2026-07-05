<template>
  <div class="min-h-screen bg-black text-[#e2e2e2] overflow-x-hidden">
    <div class="grain-overlay"></div>

    <!-- Top App Bar -->
    <header class="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 border-b border-[#5a403c] bg-black/95 backdrop-blur-sm">
      <div class="flex items-center gap-4">
        <button @click="router.push('/jogador/vampire')" class="text-[#ffb4a8] hover:opacity-70 transition-opacity">←</button>
        <h1 class="font-serif text-2xl uppercase tracking-widest text-[#ffb4a8]">Vampiro: A Máscara</h1>
      </div>
      <nav class="hidden md:flex gap-6 items-center">
        <span class="text-[#ffb4a8] font-bold text-sm">Novo Personagem</span>
      </nav>
      <div class="flex items-center gap-4">
        <span class="text-[#ffb4a8] text-xl">🩸</span>
        <span class="text-[#ffb4a8] text-xl">👤</span>
      </div>
    </header>

    <!-- Side Nav (Desktop) -->
    <aside class="hidden lg:flex flex-col h-screen w-64 fixed left-0 top-0 z-40 pt-20 border-r border-[#5a403c] bg-[#0e0e0e]">
      <div class="px-6 mb-8">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-[#8b0000] border border-[#ffb4a8] flex items-center justify-center">
            <span class="text-white text-sm">👤</span>
          </div>
          <div>
            <h3 class="font-bold text-[#e2e2e2] text-sm">{{ form.name || 'Novo Personagem' }}</h3>
            <p class="text-xs text-[#e3beb8]">{{ form.clan || 'Clã a definir' }}</p>
          </div>
        </div>
        <button @click="handleSave" :disabled="saving" class="w-full bg-[#8b0000] text-white py-2 font-bold uppercase tracking-widest text-xs hover:bg-[#690000] transition-all active:scale-95 disabled:opacity-50">
          {{ saving ? 'CRIANDO...' : 'CRIAR PERSONAGEM' }}
        </button>
      </div>
      <nav class="flex-1">
        <a class="bg-[#8b0000]/20 text-[#ff907f] font-bold border-l-4 border-[#ffb4a8] px-6 py-3 flex items-center gap-3 text-sm" href="#">👥 Coterie</a>
        <a class="text-[#e3beb8] hover:bg-[#353535] px-6 py-3 flex items-center gap-3 text-sm transition-all" href="#">📖 Crônica</a>
        <a class="text-[#e3beb8] hover:bg-[#353535] px-6 py-3 flex items-center gap-3 text-sm transition-all" href="#">✨ Disciplinas</a>
        <a class="text-[#e3beb8] hover:bg-[#353535] px-6 py-3 flex items-center gap-3 text-sm transition-all" href="#">📚 Lore</a>
        <a class="text-[#e3beb8] hover:bg-[#353535] px-6 py-3 flex items-center gap-3 text-sm transition-all" href="#">⚙️ Configurações</a>
      </nav>
      <div class="p-6 border-t border-[#5a403c]">
        <button @click="router.push('/jogador/vampire')" class="text-[#e3beb8] hover:text-[#ffb4ab] flex items-center gap-3 text-sm">← Voltar</button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="lg:ml-64 pt-20 pb-24 px-4 md:px-6 max-w-[1200px] mx-auto">

      <!-- Error Alert -->
      <div v-if="errorMsg" class="mb-4 bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 text-sm">
        {{ errorMsg }}
      </div>

      <!-- Header Info Bento -->
      <div class="bg-[#1f1f1f] p-6 border border-[#5a403c] mb-6 relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-1 bg-[#8b0000]"></div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="block text-xs uppercase tracking-widest text-[#ffb4a8] mb-1">Nome</label>
            <input v-model="form.name" class="input-ledger font-serif text-xl" type="text" placeholder="Nome do Personagem" />
          </div>
          <div>
            <label class="block text-xs uppercase tracking-widest text-[#ffb4a8] mb-1">Conceito</label>
            <input v-model="form.concept" class="input-ledger" type="text" placeholder="Ex: Historiador Macabro" />
          </div>
          <div>
            <label class="block text-xs uppercase tracking-widest text-[#ffb4a8] mb-1">Predador</label>
            <input v-model="form.predatorType" class="input-ledger" type="text" placeholder="Ex: Extorsão" />
          </div>
          <div>
            <label class="block text-xs uppercase tracking-widest text-[#ffb4a8] mb-1">Crônica</label>
            <input v-model="form.chronicle" class="input-ledger" type="text" placeholder="Sombras de Veneza" />
          </div>
          <div>
            <label class="block text-xs uppercase tracking-widest text-[#ffb4a8] mb-1">Ambição</label>
            <input v-model="form.ambition" class="input-ledger" type="text" placeholder="O que você deseja?" />
          </div>
          <div>
            <label class="block text-xs uppercase tracking-widest text-[#ffb4a8] mb-1">Clã</label>
            <input v-model="form.clan" class="input-ledger" type="text" placeholder="Ex: Hecata" />
          </div>
        </div>
      </div>

      <!-- Main Stats Grid -->
      <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">

        <!-- Column 1: Attributes & Skills -->
        <div class="xl:col-span-8 space-y-6">

          <!-- Attributes -->
          <section class="bg-[#1f1f1f] border border-[#5a403c] p-6">
            <h2 class="font-serif text-3xl border-b border-[#ffb4a8] mb-6 italic text-[#e2e2e2]">Atributos</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <!-- Físicos -->
              <div class="space-y-4">
                <h3 class="text-xs uppercase tracking-widest text-[#aa8984] border-b border-[#5a403c] pb-1 mb-4 italic text-center">Físicos</h3>
                <PipRow label="Força" v-model="attrs.forca" />
                <PipRow label="Destreza" v-model="attrs.destreza" />
                <PipRow label="Vigor" v-model="attrs.vigor" />
              </div>
              <!-- Sociais -->
              <div class="space-y-4">
                <h3 class="text-xs uppercase tracking-widest text-[#aa8984] border-b border-[#5a403c] pb-1 mb-4 italic text-center">Sociais</h3>
                <PipRow label="Carisma" v-model="attrs.carisma" />
                <PipRow label="Manipulação" v-model="attrs.manipulacao" />
                <PipRow label="Autocontrole" v-model="attrs.autocontrole" />
              </div>
              <!-- Mentais -->
              <div class="space-y-4">
                <h3 class="text-xs uppercase tracking-widest text-[#aa8984] border-b border-[#5a403c] pb-1 mb-4 italic text-center">Mentais</h3>
                <PipRow label="Inteligência" v-model="attrs.inteligencia" />
                <PipRow label="Raciocínio" v-model="attrs.raciocinio" />
                <PipRow label="Determinação" v-model="attrs.determinacao" />
              </div>
            </div>
          </section>

          <!-- Habilidades -->
          <section class="bg-[#1f1f1f] border border-[#5a403c] p-6">
            <h2 class="font-serif text-3xl border-b border-[#ffb4a8] mb-6 italic text-[#e2e2e2]">Habilidades</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-3">
              <!-- Col 1: Físicas -->
              <div class="space-y-2">
                <h3 class="text-xs uppercase tracking-widest text-[#aa8984] border-b border-[#5a403c] pb-1 mb-3 italic text-center">Físicas</h3>
                <PipRow v-for="sk in physicalSkills" :key="sk.key" :label="sk.label" v-model="skills[sk.key]" :size="3" />
              </div>
              <!-- Col 2: Sociais -->
              <div class="space-y-2">
                <h3 class="text-xs uppercase tracking-widest text-[#aa8984] border-b border-[#5a403c] pb-1 mb-3 italic text-center">Sociais</h3>
                <PipRow v-for="sk in socialSkills" :key="sk.key" :label="sk.label" v-model="skills[sk.key]" :size="3" />
              </div>
              <!-- Col 3: Mentais -->
              <div class="space-y-2">
                <h3 class="text-xs uppercase tracking-widest text-[#aa8984] border-b border-[#5a403c] pb-1 mb-3 italic text-center">Mentais</h3>
                <PipRow v-for="sk in mentalSkills" :key="sk.key" :label="sk.label" v-model="skills[sk.key]" :size="3" />
              </div>
            </div>
          </section>

          <!-- Disciplinas -->
          <section class="bg-[#1f1f1f] border border-[#5a403c] p-6">
            <h2 class="font-serif text-3xl border-b border-[#ffb4a8] mb-6 italic text-[#e2e2e2]">Disciplinas</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-for="(disc, idx) in disciplines" :key="idx" class="border border-[#5a403c] border-l-4 border-l-[#8b0000] p-4">
                <div class="flex justify-between items-center mb-3">
                  <input v-model="disc.name" class="input-ledger font-bold text-[#ffb4a8] uppercase text-sm w-1/2" placeholder="Nome da Disciplina" />
                  <PipRow v-model="disc.level" :size="3" />
                </div>
                <textarea v-model="disc.powers" class="w-full bg-transparent border-none text-[#e3beb8] text-xs h-16 focus:ring-0 leading-relaxed resize-none" placeholder="• Poder 1&#10;• Poder 2"></textarea>
              </div>
              <button @click="addDiscipline" class="border-2 border-dashed border-[#5a403c] hover:border-[#ffb4a8] p-4 flex items-center justify-center gap-2 text-[#aa8984] hover:text-[#ffb4a8] transition-colors text-sm">
                ➕ Adicionar Disciplina
              </button>
            </div>
          </section>

          <!-- Aparência e História -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section class="bg-[#1f1f1f] border border-[#5a403c] p-6">
              <h2 class="font-serif text-2xl border-b border-[#ffb4a8] mb-4 italic text-[#e2e2e2]">Aparência</h2>
              <textarea v-model="form.appearance" class="w-full bg-transparent border-none text-[#e3beb8] text-sm h-32 focus:ring-0 leading-relaxed resize-none" placeholder="Descreva a aparência física e maneirismos..."></textarea>
            </section>
            <section class="bg-[#1f1f1f] border border-[#5a403c] p-6">
              <h2 class="font-serif text-2xl border-b border-[#ffb4a8] mb-4 italic text-[#e2e2e2]">História</h2>
              <textarea v-model="form.history" class="w-full bg-transparent border-none text-[#e3beb8] text-sm h-32 focus:ring-0 leading-relaxed resize-none" placeholder="Resuma a trajetória do personagem..."></textarea>
            </section>
          </div>
        </div>

        <!-- Column 2: Trilhas & Traços -->
        <div class="xl:col-span-4 space-y-6">

          <!-- Vitalidade & Força de Vontade -->
          <section class="bg-[#1f1f1f] border border-[#5a403c] p-6 space-y-6">
            <div>
              <div class="flex justify-between items-end mb-2">
                <h2 class="text-xs uppercase tracking-widest text-[#ffb4a8] italic">Vitalidade</h2>
                <span class="text-[10px] text-[#aa8984]">Vigor + 3</span>
              </div>
              <div class="flex flex-wrap gap-2">
                <DamageBox v-for="i in healthMax" :key="'hp-'+i" v-model="health[i-1]" />
              </div>
            </div>
            <div>
              <div class="flex justify-between items-end mb-2">
                <h2 class="text-xs uppercase tracking-widest text-[#ffb4a8] italic">Força de Vontade</h2>
                <span class="text-[10px] text-[#aa8984]">Compostura + Det.</span>
              </div>
              <div class="flex flex-wrap gap-2">
                <DamageBox v-for="i in wpMax" :key="'wp-'+i" v-model="willpower[i-1]" />
              </div>
            </div>
          </section>

          <!-- Traços do Vampiro -->
          <section class="bg-[#1f1f1f] border border-[#5a403c] p-6 space-y-6">
            <div>
              <h2 class="text-xs uppercase tracking-widest text-[#ffb4a8] italic mb-3">Potência de Sangue</h2>
              <PipRow v-model="traits.bloodPotency" :max="10" />
              <table class="w-full mt-3 text-[#e3beb8] text-[10px]">
                <tbody>
                  <tr><td class="border border-[#2a2a2a] px-2 py-1">Surto de Sangue</td><td class="border border-[#2a2a2a] px-2 py-1">+2 dados</td></tr>
                  <tr><td class="border border-[#2a2a2a] px-2 py-1">Bônus de Poder</td><td class="border border-[#2a2a2a] px-2 py-1">+1 dado</td></tr>
                  <tr><td class="border border-[#2a2a2a] px-2 py-1">Penalidade de Alim.</td><td class="border border-[#2a2a2a] px-2 py-1">Nenhuma</td></tr>
                </tbody>
              </table>
            </div>
            <div>
              <h2 class="text-xs uppercase tracking-widest text-[#ffb4a8] italic mb-2">Humanidade</h2>
              <PipRow v-model="traits.humanity" :max="10" />
            </div>
            <div>
              <h2 class="text-xs uppercase tracking-widest text-[#ffb4a8] italic mb-2">Fome</h2>
              <PipRow v-model="traits.hunger" :max="5" color="#8b0000" />
            </div>
          </section>

          <!-- Vantagens & Defeitos -->
          <section class="bg-[#1f1f1f] border border-[#5a403c] p-6">
            <h2 class="text-xs uppercase tracking-widest text-[#ffb4a8] italic mb-4">Vantagens & Defeitos</h2>
            <div class="space-y-3">
              <div v-for="(mf, idx) in meritsFlaws" :key="idx" class="flex justify-between items-center border-b border-[#5a403c]/30 pb-2">
                <input v-model="mf.name" class="input-ledger text-sm w-2/3" :class="mf.type === 'FLAW' ? 'text-[#ffb4ab]' : ''" placeholder="Nome" />
                <PipRow v-model="mf.level" :size="3" />
              </div>
              <button @click="addMeritFlaw" class="text-xs text-[#aa8984] hover:text-[#ffb4a8] transition-colors">➕ Adicionar</button>
            </div>
          </section>

        </div>
      </div>

      <!-- Botão Flutuante Salvar -->
      <div class="fixed bottom-8 right-8 z-50">
        <button @click="handleSave" :disabled="saving" class="bg-[#8b0000] text-white font-bold px-8 py-4 uppercase tracking-widest shadow-2xl hover:bg-[#690000] transition-all active:scale-95 flex items-center gap-3 disabled:opacity-50">
          <span>💾</span>
          {{ saving ? 'Criando...' : 'Criar Personagem' }}
        </button>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, computed, defineComponent, h } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../../services/api';

const router = useRouter();
const saving = ref(false);
const errorMsg = ref('');

// ─── Componente Pip Reativo ────────────────────────────────
const PipRow = defineComponent({
  props: { modelValue: { type: Number, default: 0 }, label: String, max: { type: Number, default: 5 }, size: { type: Number, default: 4 }, color: { type: String, default: '#8b0000' } },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const pips = computed(() => Array.from({ length: props.max }, (_, i) => i < props.modelValue));
    const setPip = (i) => emit('update:modelValue', props.modelValue === i + 1 ? 0 : i + 1);
    return () => h('div', { class: 'flex justify-between items-center' }, [
      props.label ? h('span', { class: 'text-sm text-[#e2e2e2]' }, props.label) : null,
      h('div', { class: 'flex gap-1' }, pips.value.map((filled, i) =>
        h('button', {
          class: `w-${props.size} h-${props.size} rounded-full border transition-all duration-200 ` + (filled ? `border-[${props.color}] bg-[${props.color}]` : 'border-[#aa8984] bg-transparent hover:border-[#ffb4a8]'),
          style: filled ? `background-color: ${props.color}; border-color: ${props.color};` : '',
          onClick: () => setPip(i)
        })
      ))
    ]);
  }
});

// ─── Componente Damage Box ────────────────────────────────
const DamageBox = defineComponent({
  props: { modelValue: { type: String, default: '' } },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const states = ['', '/', 'X'];
    const cycle = () => {
      const next = (states.indexOf(props.modelValue) + 1) % states.length;
      emit('update:modelValue', states[next]);
    };
    return () => h('button', {
      class: 'w-6 h-6 border border-[#aa8984] flex items-center justify-center text-[#ffb4a8] font-mono text-xs hover:border-[#8b0000] transition-colors',
      onClick: cycle
    }, props.modelValue);
  }
});

// ─── Estado do Formulário ────────────────────────────────
const form = ref({ name: '', concept: '', predatorType: '', chronicle: '', ambition: '', clan: '', appearance: '', history: '' });
const attrs = ref({ forca: 1, destreza: 1, vigor: 1, carisma: 1, manipulacao: 1, autocontrole: 1, inteligencia: 1, raciocinio: 1, determinacao: 1 });
const skills = ref({
  armasBrancas: 0, armasDeFogo: 0, atletismo: 0, briga: 0, conducao: 0, furtividade: 0, ladroagem: 0, oficios: 0, sobrevivencia: 0,
  empatiaAnimal: 0, etiqueta: 0, intimidacao: 0, lideranca: 0, manha: 0, performance: 0, persuasao: 0, sagacidade: 0, subferfugio: 0,
  ciencia: 0, erudicao: 0, financas: 0, investigacao: 0, medicina: 0, ocultismo: 0, percepcao: 0, politica: 0, tecnologia: 0
});
const traits = ref({ bloodPotency: 1, humanity: 7, hunger: 1 });
const health = ref(Array(10).fill(''));
const willpower = ref(Array(10).fill(''));
const healthMax = computed(() => attrs.value.vigor + 3);
const wpMax = computed(() => attrs.value.autocontrole + attrs.value.determinacao);
const disciplines = ref([{ name: '', level: 0, powers: '' }]);
const meritsFlaws = ref([{ name: '', type: 'MERIT', level: 0 }]);

const addDiscipline = () => disciplines.value.push({ name: '', level: 0, powers: '' });
const addMeritFlaw = () => meritsFlaws.value.push({ name: '', type: 'MERIT', level: 0 });

// ─── Definições de Habilidades ────────────────────────────────
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

// ─── Salvar Personagem ────────────────────────────────
const handleSave = async () => {
  if (!form.value.name.trim()) { errorMsg.value = 'O nome do personagem é obrigatório.'; return; }
  saving.value = true;
  errorMsg.value = '';
  try {
    // 1. Criar o personagem
    const res = await api.post('/characters', { name: form.value.name, gameStyle: 'VAMPIRE' });
    const charId = res.data.id;

    // 2. Salvar atributos
    const attrMap = [
      { name: 'Força', value: attrs.value.forca }, { name: 'Destreza', value: attrs.value.destreza },
      { name: 'Vigor', value: attrs.value.vigor }, { name: 'Carisma', value: attrs.value.carisma },
      { name: 'Manipulação', value: attrs.value.manipulacao }, { name: 'Autocontrole', value: attrs.value.autocontrole },
      { name: 'Inteligência', value: attrs.value.inteligencia }, { name: 'Raciocínio', value: attrs.value.raciocinio },
      { name: 'Determinação', value: attrs.value.determinacao },
      { name: 'clan', value: form.value.clan }, { name: 'concept', value: form.value.concept },
      { name: 'chronicle', value: form.value.chronicle }, { name: 'predatorType', value: form.value.predatorType },
      { name: 'ambition', value: form.value.ambition }, { name: 'appearance', value: form.value.appearance },
      { name: 'history', value: form.value.history },
      { name: 'bloodPotency', value: traits.value.bloodPotency }, { name: 'humanity', value: traits.value.humanity },
      { name: 'hunger', value: traits.value.hunger },
    ];
    await Promise.all(attrMap.filter(a => a.value).map(a =>
      api.post(`/characters/${charId}/attributes`, { name: a.name, value: String(a.value) })
    ));

    // 3. Salvar habilidades
    const skillEntries = Object.entries(skills.value).filter(([, v]) => v > 0);
    await Promise.all(skillEntries.map(([name, value]) =>
      api.post(`/characters/${charId}/skills`, { name, value })
    ));

    router.push('/jogador/vampire');
  } catch (err) {
    console.error(err);
    errorMsg.value = err.response?.data?.message || 'Erro ao criar personagem. Tente novamente.';
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
.grain-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  pointer-events: none; z-index: 9999; opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}
.input-ledger {
  background: transparent;
  border: none;
  border-bottom: 1px solid #474646;
  color: #e2e2e2;
  padding: 4px 0;
  width: 100%;
  transition: border-color 0.3s ease;
  font-size: 16px;
}
.input-ledger:focus {
  outline: none;
  border-bottom-color: #8b0000;
}
</style>
