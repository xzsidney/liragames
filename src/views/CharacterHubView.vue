<template>
  <div class="min-h-screen bg-[#090b10] text-[#a9b3c7] font-sans overflow-x-hidden selection:bg-red-900/50">

    <!-- TELA DE REPOUSO / DORMIR -->
    <div v-if="character && !character.isAwake" class="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center bg-[url('/img/noise.png')] opacity-95 mix-blend-overlay">
      <div class="text-center space-y-8 animate-[pulse_3s_ease-in-out_infinite]">
        <div class="text-red-700 tracking-[0.5em] text-sm uppercase font-serif">Protocolo de Repouso Ativo</div>
        <button @click="awakenCharacter" :disabled="isAwakening" class="border border-red-700/50 text-red-700 px-10 py-4 uppercase tracking-[0.3em] font-bold text-lg hover:bg-red-700 hover:text-white transition-all shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:shadow-[0_0_40px_rgba(220,38,38,0.6)] disabled:opacity-50 disabled:cursor-wait">
          {{ isAwakening ? 'Despertando...' : 'Despertar' }}
        </button>
        <div class="text-[#a9b3c7]/50 text-xs tracking-widest max-w-sm mx-auto">
          "O sangue chama. O mundo dos vivos continua sem você, até agora."
        </div>
      </div>
    </div>

    <!-- NAVBAR TATICA -->
    <header class="flex items-center justify-between px-6 py-2 bg-[#090b10] border-b border-red-700/30 sticky top-0 z-40 text-xs tracking-widest uppercase shadow-lg">
      <div class="flex items-center gap-4">
        <button @click="router.push('/personagem/galeria')" class="text-gray-500 hover:text-white transition-colors flex items-center gap-2">
          <span>&larr;</span> VOLTAR
        </button>
        <div class="text-white font-bold tracking-widest flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.8)]"></span>
          NOCTURNA // TERMINAL V.5.2
        </div>
      </div>
      <div>LOCAL ATUAL: <span class="text-white font-bold ml-2">{{ character?.chronicle || 'ALTO DO MIRANTE' }}</span></div>
      <div>STATUS: <span class="text-red-600 font-bold ml-2">NOITE ATIVA</span></div>
      <div>
        <button @click="router.push('/personagem/ficha?id=' + characterId)" class="border border-red-700/40 px-3 py-1 text-red-700 hover:bg-red-700/10 transition-colors">
          VER FICHA COMPLETA
        </button>
      </div>
    </header>

    <div v-if="loading" class="flex items-center justify-center min-h-[80vh]">
      <div class="animate-spin w-8 h-8 border-2 border-red-700 border-t-transparent rounded-full"></div>
    </div>

    <!-- MAIN DASHBOARD -->
    <main v-else-if="character" class="max-w-[1600px] mx-auto p-4 grid grid-cols-1 xl:grid-cols-12 gap-4">
      
      <!-- ESQUERDA: Identidade Operativa -->
      <section class="xl:col-span-3 bg-[#0a0c12]/80 border border-[#1c2230] rounded-sm flex flex-col">
        <div class="bg-[#10141f] border-b border-[#1c2230] p-2 flex justify-between items-center text-[10px] uppercase tracking-widest text-[#a9b3c7]">
          <span>Identidade Operativa</span>
          <span>ID #{{ character.id.substring(0,6).toUpperCase() }}</span>
        </div>

        <div class="p-4 space-y-6">
          <div class="relative w-full aspect-square border border-[#1c2230] overflow-hidden bg-black/50 group">
            <img :src="character.avatarUrl || '/img/default_vamp.jpg'" class="w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 transition-opacity mix-blend-luminosity hover:mix-blend-normal" />
            <div class="absolute inset-0 bg-[url('/img/scanline.png')] opacity-10 pointer-events-none"></div>
            <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-[#090b10] to-transparent pt-12">
              <div class="text-lg font-bold text-white tracking-wider uppercase">{{ character.name }}</div>
              <div class="text-[10px] text-red-600 uppercase font-semibold tracking-widest">
                {{ character.DefinitionClan?.name || 'Clã Desconhecido' }}
              </div>
            </div>
          </div>

          <!-- Barras -->
          <div class="space-y-4">
            <div>
              <div class="flex justify-between text-[11px] uppercase tracking-widest mb-1">
                <span>Fome (Hunger)</span>
                <span class="text-red-600 font-bold">{{ character.hunger }} / 5</span>
              </div>
              <div class="h-1.5 bg-[#10141f] border border-[#21283a] rounded-sm overflow-hidden">
                <div class="h-full bg-red-600 transition-all duration-500" :style="{ width: (character.hunger / 5 * 100) + '%' }"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-[11px] uppercase tracking-widest mb-1">
                <span>Força de Vontade</span>
                <span class="text-blue-500 font-bold">{{ character.willpowerMax - character.willpowerDamageSuperficial - character.willpowerDamageAggravated }} / {{ character.willpowerMax }}</span>
              </div>
              <div class="h-1.5 bg-[#10141f] border border-[#21283a] rounded-sm overflow-hidden">
                <div class="h-full bg-blue-500 transition-all duration-500" :style="{ width: ((character.willpowerMax - character.willpowerDamageSuperficial - character.willpowerDamageAggravated) / character.willpowerMax * 100) + '%' }"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-[11px] uppercase tracking-widest mb-1">
                <span>Humanidade</span>
                <span class="text-gray-400 font-bold">{{ character.humanity }} / 10</span>
              </div>
              <div class="h-1.5 bg-[#10141f] border border-[#21283a] rounded-sm overflow-hidden">
                <div class="h-full bg-gray-400 transition-all duration-500" :style="{ width: (character.humanity / 10 * 100) + '%' }"></div>
              </div>
            </div>
          </div>

          <!-- Disciplinas -->
          <div>
            <div class="text-[10px] uppercase tracking-widest text-red-600 border-b border-[#1c2230] pb-1 mb-2">Disciplinas Prontas</div>
            <div class="text-[11px] space-y-2 text-[#8b95a8] leading-relaxed">
              <div v-for="disc in character.CharacterVampireDisciplines" :key="disc.id">
                <span class="text-gray-300 font-semibold">• {{ disc.DefinitionDiscipline?.name }}</span> (Nível {{ disc.value }})
              </div>
              <div v-if="!character.CharacterVampireDisciplines?.length" class="italic text-gray-600">
                Nenhuma disciplina despertada.
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CENTRO: Feed e Ações -->
      <section class="xl:col-span-6 bg-[#0a0c12]/80 border border-[#1c2230] rounded-sm flex flex-col min-h-[600px]">
        <div class="bg-[#10141f] border-b border-[#1c2230] p-2 flex justify-between items-center text-[10px] uppercase tracking-widest text-[#a9b3c7]">
          <span>Transmissões e Fatos da Noite</span>
          <span>CANAL GLOBAL</span>
        </div>

        <!-- Feed -->
        <div class="p-4 flex-1 space-y-3 overflow-y-auto">
          
          <div class="bg-[#0a0c12]/60 border-l-[3px] border-red-600 p-3 rounded-r-sm">
            <div class="text-[9px] text-[#6b7280] mb-1 tracking-widest uppercase">SISTEMA V.5.2 • AGORA</div>
            <div class="text-xs text-gray-300"><strong class="text-white">Acesso Concedido:</strong> Conexão estabelecida com a rede Nocturna. O sangue está em temperatura ideal.</div>
          </div>
          
          <div v-if="activeMission" class="bg-[#0a0c12]/60 border-l-[3px] border-amber-500 p-3 rounded-r-sm">
            <div class="text-[9px] text-[#6b7280] mb-1 tracking-widest uppercase">OPERAÇÃO EM ANDAMENTO</div>
            <div class="text-xs text-gray-300"><strong class="text-amber-500">Despacho Ativo:</strong> {{ activeMission.DefinitionMissionIdle?.title }}</div>
            <div class="text-[10px] text-gray-400 mt-1">{{ activeMission.DefinitionMissionIdle?.description }}</div>
            <div class="mt-3 flex items-center justify-between border-t border-[#1c2230] pt-2">
               <span class="text-xs text-amber-500 font-mono tracking-widest">TEMPO: {{ formatTimeRemaining(activeMission.expiresAt) }}</span>
               <button v-if="isMissionExpired(activeMission.expiresAt)" @click="resolveActiveMission()" class="text-[10px] font-bold border border-amber-500 text-amber-500 px-3 py-1 hover:bg-amber-500 hover:text-black transition-colors">RESOLVER MISSÃO</button>
            </div>
          </div>

          <div class="bg-[#0a0c12]/60 border-l-[3px] border-amber-500 p-3 rounded-r-sm">
            <div class="text-[9px] text-[#6b7280] mb-1 tracking-widest uppercase">HÁ 34 MINUTOS • PÁTIO DOS SUSPIROS</div>
            <div class="text-xs text-gray-300"><strong class="text-white">Alerta de Incêndio / TIROTEIO:</strong> Relatos de confronto armado entre forças civis armadas e uma entidade não catalogada nas linhas férreas. Ameaça de área elevada para Nível 3.</div>
          </div>

          <div class="bg-[#0a0c12]/60 border-l-[3px] border-green-600 p-3 rounded-r-sm">
            <div class="text-[9px] text-[#6b7280] mb-1 tracking-widest uppercase">HÁ 1 HORA • SERRA DA MORTE</div>
            <div class="text-xs text-gray-300"><strong class="text-white">Eco Espiritual:</strong> O Véu da Umbra oscilou nas divisas do Cinturão. Rituais de cura dos Garou detectados na fronteira norte.</div>
          </div>

        </div>

        <!-- Botões de Ação -->
        <div class="p-4 border-t border-[#1c2230] mt-auto">
          <div class="text-[10px] uppercase tracking-widest text-[#a9b3c7] mb-3">Ações Operacionais em Aberto</div>
          <div class="grid grid-cols-2 gap-3">
            <button @click="router.push('/personagem/aventuras?id=' + characterId)" class="bg-[#141824] border border-[#21283a] p-4 text-center rounded-sm hover:bg-red-900/20 hover:border-red-600 hover:shadow-[0_0_15px_rgba(220,38,38,0.2)] transition-all group flex flex-col items-center">
              <div class="text-sm font-bold text-[#a9b3c7] group-hover:text-white tracking-wide uppercase mb-1">🩸 Iniciar Caçada Urbana</div>
              <div class="text-[10px] text-gray-500">Reduzir Fome</div>
            </button>
            <button @click="router.push('/personagem/radar?id=' + characterId)" class="bg-[#141824] border border-[#21283a] p-4 text-center rounded-sm hover:bg-cyan-900/20 hover:border-cyan-500 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all group flex flex-col items-center">
              <div class="text-sm font-bold text-[#a9b3c7] group-hover:text-white tracking-wide uppercase mb-1">📡 Varredura Tática</div>
              <div class="text-[10px] text-gray-500">Detectar Inquisição</div>
            </button>
            <button @click="router.push('/personagem/inventario?id=' + characterId)" class="bg-[#141824] border border-[#21283a] p-4 text-center rounded-sm hover:bg-amber-900/20 hover:border-amber-500 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all group flex flex-col items-center">
              <div class="text-sm font-bold text-[#a9b3c7] group-hover:text-white tracking-wide uppercase mb-1">💼 Contatar Lacaios</div>
              <div class="text-[10px] text-gray-500">Movimentar Finanças</div>
            </button>
            <button @click="router.push('/personagem/noticias?id=' + characterId)" class="bg-[#141824] border border-[#21283a] p-4 text-center rounded-sm hover:bg-gray-700/20 hover:border-gray-400 hover:shadow-[0_0_15px_rgba(156,163,175,0.2)] transition-all group flex flex-col items-center">
              <div class="text-sm font-bold text-[#a9b3c7] group-hover:text-white tracking-wide uppercase mb-1">🗺️ Deslocar Setor</div>
              <div class="text-[10px] text-gray-500">Mudar de Bairro</div>
            </button>
          </div>
        </div>
      </section>

      <!-- DIREITA: Ameaça e Território -->
      <section class="xl:col-span-3 bg-[#0a0c12]/80 border border-[#1c2230] rounded-sm flex flex-col">
        <div class="bg-[#10141f] border-b border-[#1c2230] p-2 flex justify-between items-center text-[10px] uppercase tracking-widest text-[#a9b3c7]">
          <span>Vigilância Local</span>
          <span class="text-red-600 font-bold">ALERTA CRÍTICO</span>
        </div>

        <div class="p-4 space-y-6">
          <div class="bg-[#090b10] border border-[#1c2230] p-3 rounded-sm">
            <div class="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Setor Atual</div>
            <div class="text-xl font-bold text-white">{{ character.chronicle || 'Alto do Mirante' }}</div>
            <div class="text-[11px] text-red-500 uppercase mt-1">Domínio da Camarilla</div>
          </div>

          <div>
            <div class="flex justify-between text-[11px] uppercase tracking-widest mb-1">
              <span>Presença da Inquisição</span>
              <span class="text-red-600 font-bold">NÍVEL 4 / 5</span>
            </div>
            <div class="h-1.5 bg-[#10141f] border border-[#21283a] rounded-sm overflow-hidden mb-2">
              <div class="h-full bg-red-600 w-4/5 shadow-[0_0_8px_rgba(220,38,38,0.8)]"></div>
            </div>
            <p class="text-[10px] text-gray-500 leading-relaxed mt-2">
              Drones com leitura térmica operando nos helipontos. Qualquer quebra de Máscara acionará equipes de resposta em 3 turnos.
            </p>
          </div>

          <div class="pt-4 border-t border-[#1c2230]">
            <div class="text-[10px] uppercase tracking-widest text-[#a9b3c7] mb-3">Bolsa de Recursos</div>
            <div class="text-xs space-y-2 text-gray-400 leading-relaxed">
              <div>• Recursos Financeiros: <strong class="text-white">$$$ (Nível {{ character.CharacterVampireBackgrounds?.find((b: any) => b.DefinitionBackground?.name === 'Recursos')?.value || 0 }})</strong></div>
              <div>• Sangue em Estoque: <strong class="text-white">2 Bolsas O-</strong></div>
              <div>• Status na Cidade: <strong class="text-white">Nível {{ character.CharacterVampireBackgrounds?.find((b: any) => b.DefinitionBackground?.name === 'Status')?.value || 0 }}</strong></div>
            </div>
          </div>
        </div>
      </section>

    </main>
  </div>
</template>\n
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const route = useRoute()

const loading = ref(true)
const character = ref<any>(null)
const characterId = ref<string>('')

// Missions AFK
const activeMission = ref<any>(null)
let timerInterval: any = null
const now = ref(new Date())

const isAwakening = ref(false)

const awakenCharacter = async () => {
  if (!character.value) return;
  isAwakening.value = true;
  try {
    const res = await api.post(`/api/character-vampires/${character.value.id}/awaken`);
    character.value.isAwake = res.data.character.isAwake;
    character.value.hunger = res.data.character.hunger;
  } catch (err) {
    alert('Erro ao despertar.');
  } finally {
    isAwakening.value = false;
  }
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

  } catch (error) {
    console.error('Erro ao buscar personagem:', error)
  } finally {
    loading.value = false
  }
}

const formatTimeRemaining = (expiresAtStr: string) => {
  if (!expiresAtStr) return '00:00:00'
  const exp = new Date(expiresAtStr).getTime()
  const diff = exp - now.value.getTime()
  if (diff <= 0) return '00:00:00'
  
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const m = Math.floor((diff / 1000 / 60) % 60)
  const s = Math.floor((diff / 1000) % 60)
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

const isMissionExpired = (expiresAtStr: string) => {
  if (!expiresAtStr) return false
  const exp = new Date(expiresAtStr).getTime()
  return now.value.getTime() >= exp
}

const resolveActiveMission = async () => {
  // To be implemented in future
  alert('Resolvendo missão...');
}

onMounted(() => {
  fetchCharacter()
  timerInterval = setInterval(() => {
    now.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>
<style scoped>
/* Scrollbar */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: #090b10; }
::-webkit-scrollbar-thumb { background: #1c2230; border-radius: 2px; }
::-webkit-scrollbar-thumb:hover { background: #dc2626; }
</style>
