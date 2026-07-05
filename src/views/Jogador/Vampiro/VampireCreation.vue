<template>
  <div class="vtm-sheet">
    <div class="grain-overlay"></div>

    <!-- Top App Bar -->
    <header class="vtm-header">
      <div class="flex items-center gap-4">
        <button @click="router.push('/jogador/vampire')" class="text-[#ffb4a8] hover:opacity-70">←</button>
        <h1 class="font-serif text-2xl uppercase tracking-widest text-[#ffb4a8]">Vampiro: A Máscara</h1>
      </div>
      <nav class="hidden md:flex gap-6 items-center text-sm">
        <a class="text-[#ffb4a8] font-bold">Personagem</a>
        <a class="text-[#e3beb8] hover:text-[#ffb4a8] cursor-pointer">Coterie</a>
        <a class="text-[#e3beb8] hover:text-[#ffb4a8] cursor-pointer">Crônica</a>
        <a class="text-[#e3beb8] hover:text-[#ffb4a8] cursor-pointer">Configurações</a>
      </nav>
      <div class="flex items-center gap-4">
        <span class="text-[#ffb4a8] text-xl cursor-pointer">🩸</span>
        <span class="text-[#ffb4a8] text-xl cursor-pointer">👤</span>
      </div>
    </header>

    <!-- Side Nav -->
    <aside class="vtm-sidebar">
      <div style="padding: 24px 24px 16px;">
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
          <div style="width:48px;height:48px;background:#8b0000;border:1px solid #5a403c;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <span>👤</span>
          </div>
          <div style="min-width:0;">
            <p style="font-weight:bold;color:#e2e2e2;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{ form.name || 'Novo Personagem' }}</p>
            <p style="font-size:11px;color:#e3beb8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{ form.clan ? 'Clan: ' + form.clan : 'Clã a definir' }}</p>
          </div>
        </div>
        <button @click="handleSave" :disabled="saving" class="vtm-blood-btn">
          {{ saving ? 'CRIANDO...' : 'CAÇAR SANGUE' }}
        </button>
      </div>
      <nav style="flex:1;display:flex;flex-direction:column;">
        <a class="vtm-nav-item vtm-nav-active">👥 Coterie</a>
        <a class="vtm-nav-item">📖 Crônica</a>
        <a class="vtm-nav-item">✨ Disciplinas</a>
        <a class="vtm-nav-item">📚 Lore</a>
        <a class="vtm-nav-item">⚙️ Configurações</a>
        <div style="margin-top:auto;padding:16px 24px;border-top:1px solid #5a403c;">
          <button @click="router.push('/jogador/vampire')" style="color:#e3beb8;font-size:13px;background:none;border:none;cursor:pointer;">← Sair</button>
        </div>
      </nav>
    </aside>

    <!-- Main -->
    <main class="vtm-main">

      <div v-if="errorMsg" style="margin-bottom:12px;background:rgba(139,0,0,0.3);border:1px solid #8b0000;color:#ffb4a8;padding:12px;font-size:13px;">{{ errorMsg }}</div>

      <!-- Header Info -->
      <div class="vtm-card" style="margin-top:24px;margin-bottom:24px;position:relative;overflow:hidden;">
        <div style="position:absolute;top:0;left:0;width:100%;height:4px;background:#8b0000;"></div>
        <div class="grid-3">
          <div class="field-group"><label class="field-label">Nome</label><input v-model="form.name" class="input-ledger" style="font-family:serif;font-size:20px;" placeholder="Julian Giovanni"/></div>
          <div class="field-group"><label class="field-label">Conceito</label><input v-model="form.concept" class="input-ledger" placeholder="Ex: Historiador Macabro"/></div>
          <div class="field-group"><label class="field-label">Predador</label><input v-model="form.predatorType" class="input-ledger" placeholder="Ex: Extorsão"/></div>
          <div class="field-group"><label class="field-label">Crônica</label><input v-model="form.chronicle" class="input-ledger" placeholder="Sombras de Veneza"/></div>
          <div class="field-group"><label class="field-label">Ambição</label><input v-model="form.ambition" class="input-ledger" placeholder="O que você deseja?"/></div>
          <div class="field-group"><label class="field-label">Clã</label><input v-model="form.clan" class="input-ledger" placeholder="Hecata"/></div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid-8-4">

        <!-- Left Col (8) -->
        <div class="left-col">

          <!-- Atributos -->
          <div class="vtm-card">
            <h2 class="section-title">Atributos</h2>
            <div class="grid-3">
              <div>
                <h3 class="col-header">Físicos</h3>
                <div class="space-y-3">
                  <div v-for="a in physicalAttrs" :key="a.key" class="attr-row">
                    <span class="attr-label">{{ a.label }}</span>
                    <div class="pips">
                      <button v-for="i in 5" :key="i" class="pip" @click="setPip(attrs, a.key, i)" :style="i <= attrs[a.key] ? pipOn : pipOff"></button>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 class="col-header">Sociais</h3>
                <div class="space-y-3">
                  <div v-for="a in socialAttrs" :key="a.key" class="attr-row">
                    <span class="attr-label">{{ a.label }}</span>
                    <div class="pips">
                      <button v-for="i in 5" :key="i" class="pip" @click="setPip(attrs, a.key, i)" :style="i <= attrs[a.key] ? pipOn : pipOff"></button>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 class="col-header">Mentais</h3>
                <div class="space-y-3">
                  <div v-for="a in mentalAttrs" :key="a.key" class="attr-row">
                    <span class="attr-label">{{ a.label }}</span>
                    <div class="pips">
                      <button v-for="i in 5" :key="i" class="pip" @click="setPip(attrs, a.key, i)" :style="i <= attrs[a.key] ? pipOn : pipOff"></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Habilidades -->
          <div class="vtm-card">
            <h2 class="section-title">Habilidades</h2>
            <div class="grid-3">
              <div>
                <h3 class="col-header">Físicas</h3>
                <div class="space-y-2">
                  <div v-for="sk in physicalSkills" :key="sk.key" class="attr-row">
                    <span style="font-size:12px;color:#e2e2e2;">{{ sk.label }}</span>
                    <div class="pips">
                      <button v-for="i in 5" :key="i" class="pip-sm" @click="setPip(skills, sk.key, i)" :style="i <= skills[sk.key] ? pipOn : pipOff"></button>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 class="col-header">Sociais</h3>
                <div class="space-y-2">
                  <div v-for="sk in socialSkills" :key="sk.key" class="attr-row">
                    <span style="font-size:12px;color:#e2e2e2;">{{ sk.label }}</span>
                    <div class="pips">
                      <button v-for="i in 5" :key="i" class="pip-sm" @click="setPip(skills, sk.key, i)" :style="i <= skills[sk.key] ? pipOn : pipOff"></button>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 class="col-header">Mentais</h3>
                <div class="space-y-2">
                  <div v-for="sk in mentalSkills" :key="sk.key" class="attr-row">
                    <span style="font-size:12px;color:#e2e2e2;">{{ sk.label }}</span>
                    <div class="pips">
                      <button v-for="i in 5" :key="i" class="pip-sm" @click="setPip(skills, sk.key, i)" :style="i <= skills[sk.key] ? pipOn : pipOff"></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Disciplinas -->
          <div class="vtm-card">
            <h2 class="section-title">Disciplinas</h2>
            <div class="grid-2">
              <div v-for="(disc, idx) in disciplines" :key="idx" style="border:1px solid #5a403c;border-left:4px solid #8b0000;padding:16px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                  <input v-model="disc.name" class="input-ledger" style="font-weight:bold;color:#ffb4a8;text-transform:uppercase;font-size:12px;width:50%;" placeholder="NOME"/>
                  <div class="pips">
                    <button v-for="i in 5" :key="i" class="pip" @click="setPip(disc, 'level', i)" :style="i <= disc.level ? pipOn : pipOff"></button>
                  </div>
                </div>
                <textarea v-model="disc.powers" style="width:100%;background:transparent;border:none;color:#e3beb8;font-size:11px;height:56px;resize:none;outline:none;line-height:1.5;" placeholder="• Poder 1&#10;• Poder 2"></textarea>
              </div>
              <button @click="addDiscipline" style="border:2px dashed #5a403c;padding:16px;display:flex;align-items:center;justify-content:center;color:#aa8984;cursor:pointer;background:none;font-size:13px;transition:all 0.2s;" class="hover:border-[#ffb4a8] hover:text-[#ffb4a8]">+ Adicionar Disciplina</button>
            </div>
          </div>

          <!-- Aparência e História -->
          <div class="grid-2">
            <div class="vtm-card">
              <h2 class="section-title-sm">Aparência</h2>
              <textarea v-model="form.appearance" style="width:100%;background:transparent;border:none;color:#e3beb8;font-size:13px;height:120px;resize:none;outline:none;line-height:1.6;" placeholder="Descreva a aparência..."></textarea>
            </div>
            <div class="vtm-card">
              <h2 class="section-title-sm">História</h2>
              <textarea v-model="form.history" style="width:100%;background:transparent;border:none;color:#e3beb8;font-size:13px;height:120px;resize:none;outline:none;line-height:1.6;" placeholder="Trajetória do personagem..."></textarea>
            </div>
          </div>

        </div>

        <!-- Right Col (4) -->
        <div class="right-col">

          <!-- Vitalidade & FdV -->
          <div class="vtm-card">
            <div style="margin-bottom:20px;">
              <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:8px;">
                <h2 class="field-label">Vitalidade</h2>
                <span style="font-size:10px;color:#aa8984;">Vigor + 3</span>
              </div>
              <div class="pips" style="flex-wrap:wrap;gap:4px;">
                <button v-for="i in healthMax" :key="'h'+i" class="damage-box" @click="cycleBox(health, i-1)">{{ health[i-1] }}</button>
              </div>
            </div>
            <div>
              <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:8px;">
                <h2 class="field-label">Força de Vontade</h2>
                <span style="font-size:10px;color:#aa8984;">Compost. + Det.</span>
              </div>
              <div class="pips" style="flex-wrap:wrap;gap:4px;">
                <button v-for="i in wpMax" :key="'w'+i" class="damage-box" @click="cycleBox(willpower, i-1)">{{ willpower[i-1] }}</button>
              </div>
            </div>
          </div>

          <!-- Potência, Humanidade, Fome -->
          <div class="vtm-card">
            <div style="margin-bottom:20px;">
              <h2 class="field-label" style="margin-bottom:8px;">Potência de Sangue</h2>
              <div class="pips" style="flex-wrap:wrap;gap:4px;margin-bottom:10px;">
                <button v-for="i in 10" :key="i" class="pip" @click="setPip(traits,'bloodPotency',i)" :style="i<=traits.bloodPotency?pipOn:pipOff"></button>
              </div>
              <table style="width:100%;font-size:10px;color:#e3beb8;">
                <tr><td style="border:1px solid #2a2a2a;padding:3px 8px;">Surto de Sangue</td><td style="border:1px solid #2a2a2a;padding:3px 8px;">+2 dados</td></tr>
                <tr><td style="border:1px solid #2a2a2a;padding:3px 8px;">Bônus de Poder</td><td style="border:1px solid #2a2a2a;padding:3px 8px;">+1 dado</td></tr>
                <tr><td style="border:1px solid #2a2a2a;padding:3px 8px;">Penalidade de Alim.</td><td style="border:1px solid #2a2a2a;padding:3px 8px;">Nenhuma</td></tr>
                <tr><td style="border:1px solid #2a2a2a;padding:3px 8px;">Gravidade da Perdição</td><td style="border:1px solid #2a2a2a;padding:3px 8px;">2</td></tr>
              </table>
            </div>
            <div style="margin-bottom:20px;">
              <h2 class="field-label" style="margin-bottom:8px;">Humanidade</h2>
              <div class="pips" style="flex-wrap:wrap;gap:4px;margin-bottom:4px;">
                <button v-for="i in 10" :key="i" class="pip" @click="setPip(traits,'humanity',i)" :style="i<=traits.humanity?pipOn:pipOff"></button>
              </div>
              <p style="font-size:10px;color:#aa8984;font-style:italic;">Mácula: [ ] [ ] [ ] [ ] [ ]</p>
            </div>
            <div>
              <h2 class="field-label" style="margin-bottom:8px;">Fome</h2>
              <div class="pips" style="gap:4px;">
                <button v-for="i in 5" :key="i" class="pip" @click="setPip(traits,'hunger',i)" :style="i<=traits.hunger?pipOn:pipOff"></button>
              </div>
            </div>
          </div>

          <!-- Vantagens & Defeitos -->
          <div class="vtm-card">
            <h2 class="field-label" style="margin-bottom:16px;">Vantagens & Defeitos</h2>
            <div style="display:flex;flex-direction:column;gap:10px;">
              <div v-for="(mf, idx) in meritsFlaws" :key="idx" style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(90,64,60,0.3);padding-bottom:8px;">
                <input v-model="mf.name" class="input-ledger" style="font-size:12px;width:55%;" :style="mf.type==='FLAW'?'color:#ffb4ab;':''" placeholder="Nome"/>
                <div class="pips">
                  <button v-for="i in 5" :key="i" class="pip-sm" @click="setPip(mf,'level',i)" :style="i<=mf.level?pipOn:pipOff"></button>
                </div>
              </div>
              <button @click="addMeritFlaw" style="font-size:11px;color:#aa8984;background:none;border:none;cursor:pointer;text-align:left;">+ Adicionar</button>
            </div>
          </div>

        </div>
      </div>
    </main>

    <!-- FAB -->
    <button @click="handleSave" :disabled="saving" style="position:fixed;bottom:32px;right:32px;z-index:50;background:#8b0000;color:white;font-weight:bold;padding:16px 32px;text-transform:uppercase;letter-spacing:0.1em;border:none;cursor:pointer;display:flex;align-items:center;gap:12px;font-size:13px;box-shadow:0 10px 30px rgba(139,0,0,0.5);transition:all 0.2s;" class="hover:bg-[#690000] active:scale-95 disabled:opacity-50">
      💾 {{ saving ? 'Criando...' : 'Criar Personagem' }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../../services/api';

const router = useRouter();
const saving = ref(false);
const errorMsg = ref('');

const pipOn  = 'background:#8b0000;border-color:#8b0000;box-shadow:0 0 5px rgba(139,0,0,0.5);';
const pipOff = 'background:transparent;border-color:#aa8984;';

const setPip   = (obj, key, val) => { obj[key] = obj[key] === val ? val - 1 : val; };
const cycleBox = (arr, i)       => { const s=['','/',  'X']; arr[i] = s[(s.indexOf(arr[i])+1)%3]; };

const form  = ref({ name:'', concept:'', predatorType:'', chronicle:'', ambition:'', clan:'', appearance:'', history:'' });
const attrs = ref({ forca:1, destreza:1, vigor:1, carisma:1, manipulacao:1, autocontrole:1, inteligencia:1, raciocinio:1, determinacao:1 });
const traits= ref({ bloodPotency:1, humanity:7, hunger:1 });
const skills= ref({ armasBrancas:0, armasDeFogo:0, atletismo:0, briga:0, conducao:0, furtividade:0, ladroagem:0, oficios:0, sobrevivencia:0, empatiaAnimal:0, etiqueta:0, intimidacao:0, lideranca:0, manha:0, performance:0, persuasao:0, sagacidade:0, subferfugio:0, ciencia:0, erudicao:0, financas:0, investigacao:0, medicina:0, ocultismo:0, percepcao:0, politica:0, tecnologia:0 });

const health    = ref(Array(10).fill(''));
const willpower = ref(Array(10).fill(''));
const healthMax = computed(() => attrs.value.vigor + 3);
const wpMax     = computed(() => attrs.value.autocontrole + attrs.value.determinacao);

const disciplines = ref([{ name:'AUSPEX', level:2, powers:'• Sentidos Aguçados\n• Premonição' }, { name:'OBLIVION', level:3, powers:'• Manto de Sombras\n• Braços de Ahriman' }]);
const meritsFlaws = ref([{ name:'Contatos', type:'MERIT', level:2 }, { name:'Recursos', type:'MERIT', level:3 }, { name:'Inimigo', type:'FLAW', level:2 }]);
const addDiscipline = () => disciplines.value.push({ name:'', level:0, powers:'' });
const addMeritFlaw  = () => meritsFlaws.value.push({ name:'', type:'MERIT', level:0 });

const physicalAttrs = [{ key:'forca',    label:'Força'     }, { key:'destreza',    label:'Destreza'     }, { key:'vigor',       label:'Vigor'       }];
const socialAttrs   = [{ key:'carisma',  label:'Carisma'   }, { key:'manipulacao', label:'Manipulação'  }, { key:'autocontrole',label:'Autocontrole'}];
const mentalAttrs   = [{ key:'inteligencia',label:'Inteligência'}, { key:'raciocinio',label:'Raciocínio'}, { key:'determinacao',label:'Determinação'}];

const physicalSkills = [{ key:'armasBrancas',label:'Armas Brancas'},{ key:'armasDeFogo',label:'Armas de Fogo'},{ key:'atletismo',label:'Atletismo'},{ key:'briga',label:'Briga'},{ key:'conducao',label:'Condução'},{ key:'furtividade',label:'Furtividade'},{ key:'ladroagem',label:'Ladroagem'},{ key:'oficios',label:'Ofícios'},{ key:'sobrevivencia',label:'Sobrevivência'}];
const socialSkills   = [{ key:'empatiaAnimal',label:'Empatia Anim.'},{ key:'etiqueta',label:'Etiqueta'},{ key:'intimidacao',label:'Intimidação'},{ key:'lideranca',label:'Liderança'},{ key:'manha',label:'Manha'},{ key:'performance',label:'Performance'},{ key:'persuasao',label:'Persuasão'},{ key:'sagacidade',label:'Sagacidade'},{ key:'subferfugio',label:'Subterfúgio'}];
const mentalSkills   = [{ key:'ciencia',label:'Ciência'},{ key:'erudicao',label:'Erudição'},{ key:'financas',label:'Finanças'},{ key:'investigacao',label:'Investigação'},{ key:'medicina',label:'Medicina'},{ key:'ocultismo',label:'Ocultismo'},{ key:'percepcao',label:'Percepção'},{ key:'politica',label:'Política'},{ key:'tecnologia',label:'Tecnologia'}];

const handleSave = async () => {
  if (!form.value.name.trim()) { errorMsg.value = 'Nome obrigatório.'; return; }
  saving.value = true; errorMsg.value = '';
  try {
    const { data } = await api.post('/characters', { name: form.value.name, gameStyle: 'VAMPIRE' });
    const id = data.id;
    const attrPayload = [
      { name:'Força',         value:attrs.value.forca        }, { name:'Destreza',     value:attrs.value.destreza      },
      { name:'Vigor',         value:attrs.value.vigor        }, { name:'Carisma',       value:attrs.value.carisma       },
      { name:'Manipulação',   value:attrs.value.manipulacao  }, { name:'Autocontrole',  value:attrs.value.autocontrole  },
      { name:'Inteligência',  value:attrs.value.inteligencia }, { name:'Raciocínio',    value:attrs.value.raciocinio    },
      { name:'Determinação',  value:attrs.value.determinacao },
      { name:'clan',          value:form.value.clan          }, { name:'concept',       value:form.value.concept        },
      { name:'chronicle',     value:form.value.chronicle     }, { name:'predatorType',  value:form.value.predatorType   },
      { name:'ambition',      value:form.value.ambition      }, { name:'appearance',    value:form.value.appearance     },
      { name:'history',       value:form.value.history       }, { name:'bloodPotency',  value:traits.value.bloodPotency },
      { name:'humanity',      value:traits.value.humanity    }, { name:'hunger',        value:traits.value.hunger       },
    ];
    await Promise.allSettled(attrPayload.filter(a => a.value).map(a => api.post(`/characters/${id}/attributes`, { name: a.name, value: String(a.value) })));
    await Promise.allSettled(Object.entries(skills.value).filter(([,v]) => v > 0).map(([name, value]) => api.post(`/characters/${id}/skills`, { name, value })));
    router.push('/jogador/vampire');
  } catch(e) {
    errorMsg.value = e.response?.data?.message || 'Erro ao criar personagem.';
  } finally { saving.value = false; }
};
</script>

<style scoped>
/* ─── Layout Shell ─────────────────────────────────────────── */
.vtm-sheet { min-height:100vh; background-color:#000; background-image:radial-gradient(circle at center,#131313 0%,#000 100%); color:#e2e2e2; }

.vtm-header {
  position:fixed; top:0; left:0; width:100%; z-index:50;
  display:flex; justify-content:space-between; align-items:center;
  padding:16px 24px; border-bottom:1px solid #5a403c;
  background:rgba(0,0,0,0.95); backdrop-filter:blur(4px);
}

.vtm-sidebar {
  display:none;
  flex-direction:column;
  width:240px; height:100vh;
  position:fixed; left:0; top:0; z-index:40;
  border-right:1px solid #5a403c;
  background:#0e0e0e;
  padding-top:72px;
}
@media (min-width:1024px) { .vtm-sidebar { display:flex; } }

.vtm-main {
  padding-top:72px;
  padding-bottom:96px;
  padding-left:16px;
  padding-right:16px;
}
@media (min-width:1024px) { .vtm-main { margin-left:240px; } }
@media (min-width:768px)  { .vtm-main { padding-left:24px; padding-right:24px; } }

/* ─── Grids ─────────────────────────────────────────────────── */
.grid-3 { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
.grid-2 { display:grid; grid-template-columns:repeat(2,1fr); gap:24px; }

.grid-8-4 { display:grid; grid-template-columns:1fr; gap:24px; }
@media (min-width:1280px) { .grid-8-4 { grid-template-columns:2fr 1fr; } }

.left-col  { display:flex; flex-direction:column; gap:24px; }
.right-col { display:flex; flex-direction:column; gap:16px; }

/* ─── Cards ─────────────────────────────────────────────────── */
.vtm-card { background:#1f1f1f; border:1px solid #5a403c; padding:24px; }

/* ─── Typography ─────────────────────────────────────────────── */
.section-title { font-family:serif; font-size:28px; border-bottom:1px solid #ffb4a8; margin-bottom:20px; font-style:italic; }
.section-title-sm { font-family:serif; font-size:22px; border-bottom:1px solid #ffb4a8; margin-bottom:16px; font-style:italic; }
.field-label { font-size:11px; text-transform:uppercase; letter-spacing:0.15em; color:#ffb4a8; }
.col-header { font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:#aa8984; border-bottom:1px solid #5a403c; padding-bottom:4px; margin-bottom:12px; font-style:italic; text-align:center; }

/* ─── Fields & Rows ─────────────────────────────────────────── */
.field-group { display:flex; flex-direction:column; gap:4px; }
.input-ledger { background:transparent; border:none; border-bottom:1px solid #474646; color:#e2e2e2; padding:4px 0; width:100%; font-size:15px; transition:border-color 0.3s; }
.input-ledger:focus { outline:none; border-bottom-color:#8b0000; }
.attr-row { display:flex; justify-content:space-between; align-items:center; }
.attr-label { font-size:13px; font-weight:600; color:#e2e2e2; }

/* ─── Pips & Boxes ─────────────────────────────────────────── */
.pips { display:flex; gap:4px; align-items:center; }
.pip    { width:12px; height:12px; border-radius:50%; border:1px solid #aa8984; cursor:pointer; transition:all 0.2s; flex-shrink:0; }
.pip-sm { width:10px; height:10px; border-radius:50%; border:1px solid #aa8984; cursor:pointer; transition:all 0.2s; flex-shrink:0; }
.pip:hover, .pip-sm:hover { border-color:#ffb4a8; }
.damage-box { width:20px; height:20px; border:1px solid #aa8984; display:flex; align-items:center; justify-content:center; font-family:monospace; cursor:pointer; color:#ffb4a8; font-size:11px; background:transparent; transition:border-color 0.2s; }
.damage-box:hover { border-color:#8b0000; }

/* ─── Nav ───────────────────────────────────────────────────── */
.vtm-blood-btn { width:100%; background:#8b0000; color:white; padding:8px; font-weight:bold; text-transform:uppercase; letter-spacing:0.1em; font-size:11px; border:none; cursor:pointer; transition:all 0.2s; }
.vtm-blood-btn:hover { background:#690000; }
.vtm-nav-item { display:flex; align-items:center; gap:12px; padding:12px 24px; color:#e3beb8; font-size:13px; cursor:pointer; transition:all 0.2s; text-decoration:none; }
.vtm-nav-item:hover { background:#353535; color:#e2e2e2; }
.vtm-nav-active { background:rgba(139,0,0,0.2); color:#ff907f; font-weight:bold; border-left:4px solid #ffb4a8; }

/* ─── Grain Overlay ─────────────────────────────────────────── */
.grain-overlay { position:fixed; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:9999; opacity:0.03; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }

/* ─── Spacing helpers ─────────────────────────────────────────── */
.space-y-2 > * + * { margin-top:8px; }
.space-y-3 > * + * { margin-top:12px; }
</style>
