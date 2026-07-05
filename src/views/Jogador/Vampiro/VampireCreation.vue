<template>
  <div class="min-h-screen text-[#e2e2e2] overflow-x-hidden" style="background-color:#000; background-image: radial-gradient(circle at center, #131313 0%, #000000 100%);">
    <div class="grain-overlay"></div>

    <!-- Top App Bar -->
    <header class="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 border-b border-[#5a403c] bg-black/95 backdrop-blur-sm">
      <div class="flex items-center gap-4">
        <span class="cursor-pointer text-[#ffb4a8] text-2xl">☰</span>
        <h1 class="font-serif text-2xl uppercase tracking-widest text-[#ffb4a8]">Vampiro: A Máscara</h1>
      </div>
      <nav class="hidden md:flex gap-6 items-center text-sm">
        <a class="text-[#ffb4a8] font-bold">Personagem</a>
        <a class="text-[#e3beb8] hover:text-[#ffb4a8] transition-colors cursor-pointer">Coterie</a>
        <a class="text-[#e3beb8] hover:text-[#ffb4a8] transition-colors cursor-pointer">Crônica</a>
        <a class="text-[#e3beb8] hover:text-[#ffb4a8] transition-colors cursor-pointer">Configurações</a>
      </nav>
      <div class="flex items-center gap-4">
        <span class="text-[#ffb4a8] cursor-pointer text-xl">🩸</span>
        <span class="text-[#ffb4a8] cursor-pointer text-xl">👤</span>
      </div>
    </header>

    <!-- Side Nav (Desktop) -->
    <aside class="hidden lg:flex flex-col h-screen w-[240px] fixed left-0 top-0 z-40 pt-[72px] border-r border-[#5a403c] bg-[#0e0e0e]">
      <div class="px-6 py-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 bg-[#8b0000] border border-[#5a403c] flex items-center justify-center flex-shrink-0">
            <span class="text-white">👤</span>
          </div>
          <div class="min-w-0">
            <h3 class="font-bold text-[#e2e2e2] text-sm truncate">{{ form.name || 'Novo Personagem' }}</h3>
            <p class="text-xs text-[#e3beb8] truncate">{{ form.clan ? 'Clan: ' + form.clan : 'Clã a definir' }}</p>
          </div>
        </div>
        <button @click="handleSave" :disabled="saving"
          class="w-full bg-[#8b0000] text-white py-2 font-bold uppercase tracking-widest text-xs hover:bg-[#690000] transition-all active:scale-95 disabled:opacity-50">
          {{ saving ? 'CRIANDO...' : 'CAÇAR SANGUE' }}
        </button>
      </div>
      <nav class="flex-1 flex flex-col">
        <a class="bg-[#8b0000]/20 text-[#ff907f] font-bold border-l-4 border-[#ffb4a8] px-6 py-3 flex items-center gap-3 text-sm">
          <span>👥</span> Coterie
        </a>
        <a class="text-[#e3beb8] hover:bg-[#353535] px-6 py-3 flex items-center gap-3 text-sm transition-all cursor-pointer">
          <span>📖</span> Crônica
        </a>
        <a class="text-[#e3beb8] hover:bg-[#353535] px-6 py-3 flex items-center gap-3 text-sm transition-all cursor-pointer">
          <span>✨</span> Disciplinas
        </a>
        <a class="text-[#e3beb8] hover:bg-[#353535] px-6 py-3 flex items-center gap-3 text-sm transition-all cursor-pointer">
          <span>📚</span> Lore
        </a>
        <a class="text-[#e3beb8] hover:bg-[#353535] px-6 py-3 flex items-center gap-3 text-sm transition-all cursor-pointer">
          <span>⚙️</span> Configurações
        </a>
        <div class="mt-auto px-6 py-4 border-t border-[#5a403c]">
          <button @click="router.push('/jogador/vampire')" class="text-[#e3beb8] hover:text-[#ffb4ab] flex items-center gap-2 text-sm">← Sair</button>
        </div>
      </nav>
    </aside>

    <!-- Main Content Area -->
    <main class="lg:ml-[240px] pt-[72px] pb-24 px-4 md:px-6 max-w-[1200px] mx-auto">

      <!-- Error Alert -->
      <div v-if="errorMsg" class="mt-4 mb-2 bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 text-sm rounded">{{ errorMsg }}</div>
      <div v-if="successMsg" class="mt-4 mb-2 bg-green-900/50 border border-green-700 text-green-200 px-4 py-3 text-sm rounded">{{ successMsg }}</div>

      <!-- Header Info Bento -->
      <div class="bg-[#1f1f1f] p-6 border border-[#5a403c] mt-6 mb-6 relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-1 bg-[#8b0000]"></div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="flex flex-col gap-1">
            <label class="text-xs uppercase tracking-widest text-[#ffb4a8]">Nome</label>
            <input v-model="form.name" class="input-ledger font-serif text-xl" type="text" placeholder="Julian Giovanni" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs uppercase tracking-widest text-[#ffb4a8]">Conceito</label>
            <input v-model="form.concept" class="input-ledger" type="text" placeholder="Ex: Historiador Macabro" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs uppercase tracking-widest text-[#ffb4a8]">Predador</label>
            <input v-model="form.predatorType" class="input-ledger" type="text" placeholder="Ex: Extorsão" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs uppercase tracking-widest text-[#ffb4a8]">Crônica</label>
            <input v-model="form.chronicle" class="input-ledger" type="text" placeholder="Sombras de Veneza" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs uppercase tracking-widest text-[#ffb4a8]">Ambição</label>
            <input v-model="form.ambition" class="input-ledger" type="text" placeholder="O que você deseja?" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs uppercase tracking-widest text-[#ffb4a8]">Clã</label>
            <input v-model="form.clan" class="input-ledger" type="text" placeholder="Hecata" />
          </div>
        </div>
      </div>

      <!-- Main Stats Grid: 8/12 + 4/12 -->
      <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">

        <!-- ── Left Column (8/12) ── -->
        <div class="xl:col-span-8 space-y-6">

          <!-- Atributos -->
          <section class="bg-[#1f1f1f] border border-[#5a403c] p-6">
            <h2 class="font-serif text-3xl border-b border-[#ffb4a8] mb-6 italic">Atributos</h2>
            <div class="grid grid-cols-3 gap-8">
              <!-- Físicos -->
              <div>
                <h3 class="text-xs uppercase tracking-widest text-[#aa8984] border-b border-[#5a403c] pb-1 mb-4 italic text-center">Físicos</h3>
                <div class="space-y-4">
                  <div v-for="attr in physicalAttrs" :key="attr.key" class="flex justify-between items-center">
                    <span class="text-sm font-semibold hover:text-[#ffb4a8] transition-colors cursor-default">{{ attr.label }}</span>
                    <div class="flex gap-1">
                      <button v-for="i in 5" :key="i" @click="setPip(attrs, attr.key, i)"
                        class="pip-btn" :style="i <= attrs[attr.key] ? pipFilled : pipEmpty"></button>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Sociais -->
              <div>
                <h3 class="text-xs uppercase tracking-widest text-[#aa8984] border-b border-[#5a403c] pb-1 mb-4 italic text-center">Sociais</h3>
                <div class="space-y-4">
                  <div v-for="attr in socialAttrs" :key="attr.key" class="flex justify-between items-center">
                    <span class="text-sm font-semibold hover:text-[#ffb4a8] transition-colors cursor-default">{{ attr.label }}</span>
                    <div class="flex gap-1">
                      <button v-for="i in 5" :key="i" @click="setPip(attrs, attr.key, i)"
                        class="pip-btn" :style="i <= attrs[attr.key] ? pipFilled : pipEmpty"></button>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Mentais -->
              <div>
                <h3 class="text-xs uppercase tracking-widest text-[#aa8984] border-b border-[#5a403c] pb-1 mb-4 italic text-center">Mentais</h3>
                <div class="space-y-4">
                  <div v-for="attr in mentalAttrs" :key="attr.key" class="flex justify-between items-center">
                    <span class="text-sm font-semibold hover:text-[#ffb4a8] transition-colors cursor-default">{{ attr.label }}</span>
                    <div class="flex gap-1">
                      <button v-for="i in 5" :key="i" @click="setPip(attrs, attr.key, i)"
                        class="pip-btn" :style="i <= attrs[attr.key] ? pipFilled : pipEmpty"></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Habilidades -->
          <section class="bg-[#1f1f1f] border border-[#5a403c] p-6">
            <h2 class="font-serif text-3xl border-b border-[#ffb4a8] mb-6 italic">Habilidades</h2>
            <div class="grid grid-cols-3 gap-x-8 gap-y-2">
              <!-- Físicas -->
              <div>
                <h3 class="text-xs uppercase tracking-widest text-[#aa8984] border-b border-[#5a403c] pb-1 mb-3 italic text-center">Físicas</h3>
                <div class="space-y-2">
                  <div v-for="sk in physicalSkills" :key="sk.key" class="flex justify-between items-center">
                    <span class="text-xs">{{ sk.label }}</span>
                    <div class="flex gap-[3px]">
                      <button v-for="i in 5" :key="i" @click="setPip(skills, sk.key, i)"
                        class="pip-sm" :style="i <= skills[sk.key] ? pipFilled : pipEmpty"></button>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Sociais -->
              <div>
                <h3 class="text-xs uppercase tracking-widest text-[#aa8984] border-b border-[#5a403c] pb-1 mb-3 italic text-center">Sociais</h3>
                <div class="space-y-2">
                  <div v-for="sk in socialSkills" :key="sk.key" class="flex justify-between items-center">
                    <span class="text-xs">{{ sk.label }}</span>
                    <div class="flex gap-[3px]">
                      <button v-for="i in 5" :key="i" @click="setPip(skills, sk.key, i)"
                        class="pip-sm" :style="i <= skills[sk.key] ? pipFilled : pipEmpty"></button>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Mentais -->
              <div>
                <h3 class="text-xs uppercase tracking-widest text-[#aa8984] border-b border-[#5a403c] pb-1 mb-3 italic text-center">Mentais</h3>
                <div class="space-y-2">
                  <div v-for="sk in mentalSkills" :key="sk.key" class="flex justify-between items-center">
                    <span class="text-xs">{{ sk.label }}</span>
                    <div class="flex gap-[3px]">
                      <button v-for="i in 5" :key="i" @click="setPip(skills, sk.key, i)"
                        class="pip-sm" :style="i <= skills[sk.key] ? pipFilled : pipEmpty"></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Disciplinas -->
          <section class="bg-[#1f1f1f] border border-[#5a403c] p-6">
            <h2 class="font-serif text-3xl border-b border-[#ffb4a8] mb-6 italic">Disciplinas</h2>
            <div class="grid grid-cols-2 gap-6">
              <div v-for="(disc, idx) in disciplines" :key="idx" class="border border-[#5a403c] border-l-4 border-l-[#8b0000] p-4">
                <div class="flex justify-between items-center mb-3">
                  <input v-model="disc.name" class="input-ledger font-bold text-[#ffb4a8] uppercase text-xs w-1/2" placeholder="NOME" />
                  <div class="flex gap-1">
                    <button v-for="i in 5" :key="i" @click="setPip(disc, 'level', i)"
                      class="pip-btn" :style="i <= disc.level ? pipFilled : pipEmpty"></button>
                  </div>
                </div>
                <textarea v-model="disc.powers" class="w-full bg-transparent border-none text-[#e3beb8] text-xs h-14 focus:outline-none leading-relaxed resize-none" placeholder="• Poder 1&#10;• Poder 2"></textarea>
              </div>
              <button @click="addDiscipline" class="border-2 border-dashed border-[#5a403c] hover:border-[#ffb4a8] p-4 flex items-center justify-center gap-2 text-[#aa8984] hover:text-[#ffb4a8] transition-colors text-sm cursor-pointer">
                + Adicionar Disciplina
              </button>
            </div>
          </section>

          <!-- Aparência e História -->
          <div class="grid grid-cols-2 gap-6">
            <section class="bg-[#1f1f1f] border border-[#5a403c] p-6">
              <h2 class="font-serif text-2xl border-b border-[#ffb4a8] mb-4 italic">Aparência</h2>
              <textarea v-model="form.appearance" class="w-full bg-transparent border-none text-[#e3beb8] text-sm h-32 focus:outline-none leading-relaxed resize-none" placeholder="Descreva a aparência física e maneirismos do personagem..."></textarea>
            </section>
            <section class="bg-[#1f1f1f] border border-[#5a403c] p-6">
              <h2 class="font-serif text-2xl border-b border-[#ffb4a8] mb-4 italic">História</h2>
              <textarea v-model="form.history" class="w-full bg-transparent border-none text-[#e3beb8] text-sm h-32 focus:outline-none leading-relaxed resize-none" placeholder="Resuma a trajetória do seu personagem..."></textarea>
            </section>
          </div>

        </div>
        <!-- ── Right Column (4/12) ── -->
        <div class="xl:col-span-4 space-y-4">

          <!-- Vitalidade & Força de Vontade -->
          <section class="bg-[#1f1f1f] border border-[#5a403c] p-5 space-y-5">
            <div>
              <div class="flex justify-between items-end mb-2">
                <h2 class="text-xs uppercase tracking-widest text-[#ffb4a8] italic">Vitalidade</h2>
                <span class="text-[10px] text-[#aa8984]">Vigor + 3</span>
              </div>
              <div class="flex flex-wrap gap-1">
                <button v-for="i in healthMax" :key="'hp-'+i" @click="cycleBox(health, i-1)"
                  class="damage-box">{{ health[i-1] }}</button>
              </div>
            </div>
            <div>
              <div class="flex justify-between items-end mb-2">
                <h2 class="text-xs uppercase tracking-widest text-[#ffb4a8] italic">Força de Vontade</h2>
                <span class="text-[10px] text-[#aa8984]">Compost. + Deter.</span>
              </div>
              <div class="flex flex-wrap gap-1">
                <button v-for="i in wpMax" :key="'wp-'+i" @click="cycleBox(willpower, i-1)"
                  class="damage-box">{{ willpower[i-1] }}</button>
              </div>
            </div>
          </section>

          <!-- Potência de Sangue, Humanidade, Fome -->
          <section class="bg-[#1f1f1f] border border-[#5a403c] p-5 space-y-5">
            <div>
              <h2 class="text-xs uppercase tracking-widest text-[#ffb4a8] italic mb-2">Potência de Sangue</h2>
              <div class="flex flex-wrap gap-1 mb-3">
                <button v-for="i in 10" :key="i" @click="setPip(traits, 'bloodPotency', i)"
                  class="pip-btn" :style="i <= traits.bloodPotency ? pipFilled : pipEmpty"></button>
              </div>
              <table class="w-full text-[#e3beb8]" style="font-size:10px;">
                <tbody>
                  <tr><td class="border border-[#2a2a2a] px-2 py-1">Surto de Sangue</td><td class="border border-[#2a2a2a] px-2 py-1">+2 dados</td></tr>
                  <tr><td class="border border-[#2a2a2a] px-2 py-1">Bônus de Poder</td><td class="border border-[#2a2a2a] px-2 py-1">+1 dado</td></tr>
                  <tr><td class="border border-[#2a2a2a] px-2 py-1">Penalidade de Alim.</td><td class="border border-[#2a2a2a] px-2 py-1">Nenhuma</td></tr>
                  <tr><td class="border border-[#2a2a2a] px-2 py-1">Gravidade da Perdição</td><td class="border border-[#2a2a2a] px-2 py-1">2</td></tr>
                </tbody>
              </table>
            </div>
            <div>
              <h2 class="text-xs uppercase tracking-widest text-[#ffb4a8] italic mb-2">Humanidade</h2>
              <div class="flex flex-wrap gap-1">
                <button v-for="i in 10" :key="i" @click="setPip(traits, 'humanity', i)"
                  class="pip-btn" :style="i <= traits.humanity ? pipFilled : pipEmpty"></button>
              </div>
              <p class="text-[10px] text-[#aa8984] italic mt-1">Mácula: [ ] [ ] [ ] [ ] [ ]</p>
            </div>
            <div>
              <h2 class="text-xs uppercase tracking-widest text-[#ffb4a8] italic mb-2">Fome</h2>
              <div class="flex gap-1">
                <button v-for="i in 5" :key="i" @click="setPip(traits, 'hunger', i)"
                  class="pip-btn" :style="i <= traits.hunger ? pipFilled : pipEmpty"></button>
              </div>
            </div>
          </section>

          <!-- Vantagens & Defeitos -->
          <section class="bg-[#1f1f1f] border border-[#5a403c] p-5">
            <h2 class="text-xs uppercase tracking-widest text-[#ffb4a8] italic mb-4">Vantagens & Defeitos</h2>
            <div class="space-y-3">
              <div v-for="(mf, idx) in meritsFlaws" :key="idx" class="flex justify-between items-center border-b border-[#5a403c]/30 pb-2">
                <input v-model="mf.name" class="input-ledger text-xs w-1/2" :class="mf.type === 'FLAW' ? 'text-[#ffb4ab]' : ''" placeholder="Nome" />
                <div class="flex gap-1">
                  <button v-for="i in 5" :key="i" @click="setPip(mf, 'level', i)"
                    class="pip-sm" :style="i <= mf.level ? pipFilled : pipEmpty"></button>
                </div>
              </div>
              <button @click="addMeritFlaw" class="text-xs text-[#aa8984] hover:text-[#ffb4a8] transition-colors">+ Adicionar</button>
            </div>
          </section>

        </div>
      </div>
    </main>

    <!-- Floating Action Button -->
    <div class="fixed bottom-8 right-8 z-50">
      <button @click="handleSave" :disabled="saving"
        class="bg-[#8b0000] text-white font-bold px-8 py-4 uppercase tracking-widest shadow-2xl hover:bg-[#690000] transition-all active:scale-95 flex items-center gap-3 disabled:opacity-50 text-sm">
        💾 {{ saving ? 'Criando...' : 'Criar Personagem' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../../services/api';

const router = useRouter();
const saving = ref(false);
const errorMsg = ref('');
const successMsg = ref('');

// ─── Pip Styles ─────────────────────────────────────────────────────
const pipFilled = 'width:12px;height:12px;border-radius:50%;background-color:#8b0000;border:1px solid #8b0000;box-shadow:0 0 5px rgba(139,0,0,0.5);cursor:pointer;transition:all 0.2s;';
const pipEmpty  = 'width:12px;height:12px;border-radius:50%;background:transparent;border:1px solid #aa8984;cursor:pointer;transition:all 0.2s;';

const setPip = (obj, key, val) => {
  obj[key] = obj[key] === val ? val - 1 : val;
};
const cycleBox = (arr, idx) => {
  const states = ['', '/', 'X'];
  arr[idx] = states[(states.indexOf(arr[idx]) + 1) % states.length];
};

// ─── Form State ─────────────────────────────────────────────────────
const form = ref({ name: '', concept: '', predatorType: '', chronicle: '', ambition: '', clan: '', appearance: '', history: '' });

const attrs = ref({ forca: 1, destreza: 1, vigor: 1, carisma: 1, manipulacao: 1, autocontrole: 1, inteligencia: 1, raciocinio: 1, determinacao: 1 });
const traits = ref({ bloodPotency: 1, humanity: 7, hunger: 1 });

const health     = ref(Array(10).fill(''));
const willpower  = ref(Array(10).fill(''));
const healthMax  = computed(() => attrs.value.vigor + 3);
const wpMax      = computed(() => attrs.value.autocontrole + attrs.value.determinacao);

const skills = ref({
  armasBrancas: 0, armasDeFogo: 0, atletismo: 0, briga: 0, conducao: 0,
  furtividade: 0, ladroagem: 0, oficios: 0, sobrevivencia: 0,
  empatiaAnimal: 0, etiqueta: 0, intimidacao: 0, lideranca: 0, manha: 0,
  performance: 0, persuasao: 0, sagacidade: 0, subferfugio: 0,
  ciencia: 0, erudicao: 0, financas: 0, investigacao: 0,
  medicina: 0, ocultismo: 0, percepcao: 0, politica: 0, tecnologia: 0,
});

const disciplines = ref([
  { name: 'AUSPEX', level: 2, powers: '• Sentidos Aguçados\n• Premonição' },
  { name: 'OBLIVION', level: 3, powers: '• Manto de Sombras\n• Braços de Ahriman\n• Toque do Túmulo' },
]);
const meritsFlaws = ref([
  { name: 'Contatos', type: 'MERIT', level: 2 },
  { name: 'Recursos', type: 'MERIT', level: 3 },
  { name: 'Inimigo', type: 'FLAW', level: 2 },
]);

const addDiscipline = () => disciplines.value.push({ name: '', level: 0, powers: '' });
const addMeritFlaw  = () => meritsFlaws.value.push({ name: '', type: 'MERIT', level: 0 });

// ─── Attribute / Skill Definitions ──────────────────────────────────
const physicalAttrs = [{ key:'forca', label:'Força' }, { key:'destreza', label:'Destreza' }, { key:'vigor', label:'Vigor' }];
const socialAttrs   = [{ key:'carisma', label:'Carisma' }, { key:'manipulacao', label:'Manipulação' }, { key:'autocontrole', label:'Autocontrole' }];
const mentalAttrs   = [{ key:'inteligencia', label:'Inteligência' }, { key:'raciocinio', label:'Raciocínio' }, { key:'determinacao', label:'Determinação' }];

const physicalSkills = [
  { key:'armasBrancas', label:'Armas Brancas' }, { key:'armasDeFogo', label:'Armas de Fogo' },
  { key:'atletismo', label:'Atletismo' }, { key:'briga', label:'Briga' },
  { key:'conducao', label:'Condução' }, { key:'furtividade', label:'Furtividade' },
  { key:'ladroagem', label:'Ladroagem' }, { key:'oficios', label:'Ofícios' },
  { key:'sobrevivencia', label:'Sobrevivência' },
];
const socialSkills = [
  { key:'empatiaAnimal', label:'Empatia Anim.' }, { key:'etiqueta', label:'Etiqueta' },
  { key:'intimidacao', label:'Intimidação' }, { key:'lideranca', label:'Liderança' },
  { key:'manha', label:'Manha' }, { key:'performance', label:'Performance' },
  { key:'persuasao', label:'Persuasão' }, { key:'sagacidade', label:'Sagacidade' },
  { key:'subferfugio', label:'Subterfúgio' },
];
const mentalSkills = [
  { key:'ciencia', label:'Ciência' }, { key:'erudicao', label:'Erudição' },
  { key:'financas', label:'Finanças' }, { key:'investigacao', label:'Investigação' },
  { key:'medicina', label:'Medicina' }, { key:'ocultismo', label:'Ocultismo' },
  { key:'percepcao', label:'Percepção' }, { key:'politica', label:'Política' },
  { key:'tecnologia', label:'Tecnologia' },
];

// ─── Save ────────────────────────────────────────────────────────────
const handleSave = async () => {
  if (!form.value.name.trim()) { errorMsg.value = 'O nome do personagem é obrigatório.'; return; }
  saving.value = true; errorMsg.value = '';
  try {
    const res = await api.post('/characters', { name: form.value.name, gameStyle: 'VAMPIRE' });
    const charId = res.data.id;

    const attrPayload = [
      { name: 'Força', value: attrs.value.forca }, { name: 'Destreza', value: attrs.value.destreza },
      { name: 'Vigor', value: attrs.value.vigor }, { name: 'Carisma', value: attrs.value.carisma },
      { name: 'Manipulação', value: attrs.value.manipulacao }, { name: 'Autocontrole', value: attrs.value.autocontrole },
      { name: 'Inteligência', value: attrs.value.inteligencia }, { name: 'Raciocínio', value: attrs.value.raciocinio },
      { name: 'Determinação', value: attrs.value.determinacao },
      { name: 'clan', value: form.value.clan }, { name: 'concept', value: form.value.concept },
      { name: 'chronicle', value: form.value.chronicle }, { name: 'predatorType', value: form.value.predatorType },
      { name: 'ambition', value: form.value.ambition }, { name: 'appearance', value: form.value.appearance },
      { name: 'history', value: form.value.history },
      { name: 'bloodPotency', value: traits.value.bloodPotency },
      { name: 'humanity', value: traits.value.humanity }, { name: 'hunger', value: traits.value.hunger },
    ];
    await Promise.allSettled(attrPayload.filter(a => a.value || a.value === 0).map(a =>
      api.post(`/characters/${charId}/attributes`, { name: a.name, value: String(a.value) })
    ));
    await Promise.allSettled(
      Object.entries(skills.value).filter(([, v]) => v > 0).map(([name, value]) =>
        api.post(`/characters/${charId}/skills`, { name, value })
      )
    );
    router.push('/jogador/vampire');
  } catch (err) {
    errorMsg.value = err.response?.data?.message || 'Erro ao criar personagem.';
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
.grain-overlay {
  position: fixed; top:0; left:0; width:100%; height:100%;
  pointer-events:none; z-index:9999; opacity:0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
.input-ledger {
  background: transparent;
  border: none;
  border-bottom: 1px solid #474646;
  color: #e2e2e2;
  padding: 4px 0;
  width: 100%;
  transition: border-color 0.3s ease;
}
.input-ledger:focus { outline: none; border-bottom-color: #8b0000; }

.pip-btn {
  width: 12px; height: 12px; border-radius: 50%;
  cursor: pointer; transition: all 0.2s ease; flex-shrink: 0;
}
.pip-sm {
  width: 10px; height: 10px; border-radius: 50%;
  cursor: pointer; transition: all 0.2s ease; flex-shrink: 0;
}
.damage-box {
  width: 20px; height: 20px;
  border: 1px solid #aa8984;
  display: flex; align-items: center; justify-content: center;
  font-family: 'JetBrains Mono', monospace;
  cursor: pointer; color: #ffb4a8; font-size: 11px;
  transition: border-color 0.2s;
}
.damage-box:hover { border-color: #8b0000; }
</style>
