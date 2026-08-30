<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans relative overflow-hidden">
    <!-- Header -->
    <div class="max-w-5xl mx-auto flex items-center justify-between pb-6 border-b border-slate-800">
      <div class="flex items-center space-x-4">
        <router-link to="/familia/sala" class="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-slate-700 transition-colors">
          ➔
        </router-link>
        <div>
          <h1 class="text-2xl md:text-3xl font-black text-rose-400 flex items-center space-x-2">
            <span>⚔️ Arena de Batalha da Família</span>
          </h1>
          <p class="text-xs md:text-sm text-slate-400">Combate cooperativo em turnos sincronizado ao vivo!</p>
        </div>
      </div>

      <div class="flex items-center space-x-2 bg-rose-500/10 border border-rose-500/30 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-300">
        <span class="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
        <span>Ao Vivo</span>
      </div>
    </div>

    <!-- Arena Central -->
    <div v-if="battle" class="max-w-5xl mx-auto my-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Coluna da Esquerda / Centro: Chefe & Ações de Turno -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- Card do Chefe Monstruoso -->
        <div class="bg-gradient-to-b from-slate-900 via-slate-900 to-rose-950/40 border-2 border-rose-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden text-center">
          <div class="text-xs font-bold uppercase tracking-widest text-rose-400 bg-rose-500/10 inline-block px-3 py-1 rounded-full border border-rose-500/20 mb-3">
            {{ battle.title }}
          </div>

          <!-- Avatar do Chefe com Animação -->
          <div class="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-3xl overflow-hidden border-4 border-rose-500 shadow-2xl shadow-rose-500/30 mb-4 bg-slate-800 relative">
            <img :src="battle.monsterAvatar" :alt="battle.monsterName" class="w-full h-full object-cover" />
            <div v-if="monsterHit" class="absolute inset-0 bg-red-600/60 flex items-center justify-center animate-ping text-3xl font-black text-white">
              💥
            </div>
          </div>

          <h2 class="text-2xl md:text-3xl font-black text-slate-100">{{ battle.monsterName }}</h2>
          <p class="text-xs text-slate-400 mb-4">Ataque: {{ battle.monsterAttack }} • Defesa: {{ battle.monsterDefense }}</p>

          <!-- Barra de Vida do Chefe -->
          <div class="max-w-md mx-auto space-y-1.5">
            <div class="flex justify-between text-xs font-bold">
              <span class="text-rose-400">Vida do Monstro</span>
              <span class="text-slate-200">{{ battle.monsterHpCurrent }} / {{ battle.monsterHpMax }} HP</span>
            </div>
            <div class="w-full bg-slate-950 h-4 rounded-full border border-rose-500/40 p-0.5 overflow-hidden">
              <div 
                class="bg-gradient-to-r from-rose-600 to-red-400 h-full rounded-full transition-all duration-500"
                :style="{ width: `${(battle.monsterHpCurrent / battle.monsterHpMax) * 100}%` }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Indicador de Turno Ativo -->
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <span class="text-2xl">⏳</span>
            <div>
              <p class="text-xs text-slate-400 uppercase tracking-wider font-bold">Turno Atual:</p>
              <p class="text-sm md:text-base font-black text-amber-300">
                {{ currentTurnHeroName }}
              </p>
            </div>
          </div>

          <div v-if="isMyTurn" class="bg-emerald-500 text-slate-950 text-xs font-extrabold px-3 py-1.5 rounded-xl animate-bounce shadow-lg shadow-emerald-500/20">
            👉 É SUA VEZ DE JOGAR!
          </div>
          <div v-else class="text-xs text-slate-400 font-medium">
            Aguardando jogada do irmão/pais...
          </div>
        </div>

        <!-- Painel de Comandos de Batalha -->
        <div class="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h4 class="text-xs font-extrabold uppercase tracking-wider text-slate-400">Escolha sua Ação no Combate:</h4>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <!-- Ataque Básico -->
            <button
              :disabled="!isMyTurn || battle.status !== 'IN_PROGRESS'"
              @click="executeAction('ATTACK')"
              class="bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-xs md:text-sm py-4 px-3 rounded-2xl shadow-lg shadow-rose-600/20 flex flex-col items-center justify-center space-y-1 transition-all active:scale-95"
            >
              <span class="text-2xl">🗡️</span>
              <span>Ataque Físico</span>
            </button>

            <!-- Magia / Poder Especial -->
            <button
              :disabled="!isMyTurn || battle.status !== 'IN_PROGRESS'"
              @click="executeAction('SKILL')"
              class="bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black text-xs md:text-sm py-4 px-3 rounded-2xl shadow-lg shadow-amber-500/20 flex flex-col items-center justify-center space-y-1 transition-all active:scale-95"
            >
              <span class="text-2xl">🔥</span>
              <span>Magia Especial</span>
            </button>

            <!-- Bênção de Cura -->
            <button
              :disabled="!isMyTurn || battle.status !== 'IN_PROGRESS'"
              @click="executeAction('HEAL')"
              class="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-xs md:text-sm py-4 px-3 rounded-2xl shadow-lg shadow-emerald-600/20 flex flex-col items-center justify-center space-y-1 transition-all active:scale-95"
            >
              <span class="text-2xl">✨</span>
              <span>Cura Coletiva</span>
            </button>

            <!-- Defender -->
            <button
              :disabled="!isMyTurn || battle.status !== 'IN_PROGRESS'"
              @click="executeAction('DEFEND')"
              class="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-xs md:text-sm py-4 px-3 rounded-2xl shadow-lg shadow-indigo-600/20 flex flex-col items-center justify-center space-y-1 transition-all active:scale-95"
            >
              <span class="text-2xl">🛡️</span>
              <span>Defender</span>
            </button>
          </div>
        </div>

      </div>

      <!-- Coluna da Direita: Os Heróis & Diário de Batalha ao Vivo -->
      <div class="space-y-6">
        
        <!-- Status da Equipe da Família -->
        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-4">
          <h4 class="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
            <span>🛡️ A Família em Batalha</span>
            <span>7 Heróis</span>
          </h4>

          <div class="space-y-2 max-h-56 overflow-y-auto pr-1">
            <div
              v-for="m in members"
              :key="m.id"
              :class="[
                'flex items-center justify-between p-2 rounded-xl border text-xs',
                m.id === activeCharacter?.id ? 'bg-amber-500/10 border-amber-500/40' : 'bg-slate-950 border-slate-800'
              ]"
            >
              <div class="flex items-center space-x-2">
                <img :src="m.avatarUrl" class="w-8 h-8 rounded-lg object-cover border border-slate-700" />
                <div>
                  <p class="font-bold text-slate-200">{{ m.name }}</p>
                  <p class="text-[10px] text-amber-400">{{ m.characterClass }} • Nv. {{ m.level }}</p>
                </div>
              </div>

              <!-- HP Bar mini -->
              <div class="text-right w-20">
                <span class="text-[10px] font-bold text-rose-400">{{ m.hpCurrent }}/{{ m.hpMax }} HP</span>
                <div class="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div class="bg-rose-500 h-full rounded-full" :style="{ width: `${(m.hpCurrent / m.hpMax) * 100}%` }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Diário de Batalha em Tempo Real -->
        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex flex-col h-72">
          <h4 class="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-2">
            <span>📜 Diário de Combate</span>
          </h4>

          <div class="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
            <div
              v-for="(log, idx) in battle.battleLogs"
              :key="idx"
              class="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed text-slate-300"
              v-html="formatLog(log)"
            ></div>
          </div>
        </div>

      </div>

    </div>

    <!-- Modal de Vitória Épica -->
    <div v-if="battle?.status === 'VICTORY'" class="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div class="bg-gradient-to-b from-slate-900 to-amber-950 border-2 border-amber-400 p-8 rounded-3xl max-w-md w-full text-center shadow-2xl animate-bounce">
        <div class="text-6xl mb-4">🏆</div>
        <h2 class="text-3xl font-black text-amber-300 mb-2">VITÓRIA DA FAMÍLIA!</h2>
        <p class="text-sm text-slate-300 mb-6">
          Vocês se uniram e derrotaram <strong>{{ battle.monsterName }}</strong> com maestria!
        </p>

        <div class="bg-slate-950/80 p-4 rounded-2xl border border-amber-500/30 mb-6 flex justify-around">
          <div>
            <p class="text-xs text-slate-400">Recompensa</p>
            <p class="text-lg font-black text-amber-400">+{{ battle.rewardXp }} XP</p>
          </div>
          <div>
            <p class="text-xs text-slate-400">Recompensa</p>
            <p class="text-lg font-black text-yellow-400">🪙 +{{ battle.rewardGold }} Ouro</p>
          </div>
        </div>

        <router-link
          to="/familia/sala"
          class="inline-block w-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black py-3 px-6 rounded-2xl shadow-xl shadow-amber-500/20"
        >
          Voltar ao Salão da Família
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { familyApi } from '../../services/familyApi';
import { getFamilySocket, sendFamilyBattleAction, joinFamilyRoom } from '../../services/familySocket';
import confetti from 'canvas-confetti';

const battle = ref<any>(null);
const members = ref<any[]>([]);
const activeCharacter = ref<any>(null);
const monsterHit = ref<boolean>(false);

const currentTurnHeroId = computed(() => {
  if (!battle.value || !Array.isArray(battle.value.currentTurnOrder)) return null;
  return battle.value.currentTurnOrder[battle.value.activeTurnIndex];
});

const currentTurnHeroName = computed(() => {
  if (!currentTurnHeroId.value) return 'Aguardando...';
  if (currentTurnHeroId.value === 'MONSTER') return `🐲 ${battle.value?.monsterName || 'Monstro'}`;
  const h = members.value.find(m => m.id === currentTurnHeroId.value);
  return h ? `🧙‍♂️ ${h.name} (${h.characterClass})` : 'Herói';
});

const isMyTurn = computed(() => {
  return activeCharacter.value && currentTurnHeroId.value === activeCharacter.value.id;
});

function formatLog(log: string) {
  return log
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-amber-300">$1</strong>');
}

async function loadData() {
  try {
    const savedCharId = localStorage.getItem('lira_active_family_char_id');
    const membersRes = await familyApi.getMembers();
    if (membersRes.success && membersRes.members.length > 0) {
      members.value = membersRes.members;
      activeCharacter.value = members.value.find((m: any) => m.id === savedCharId) || members.value[0];
    }

    const battleRes = await familyApi.getActiveBattle();
    if (battleRes.success) {
      battle.value = battleRes.battle;
    }

    if (activeCharacter.value) {
      joinFamilyRoom(activeCharacter.value.id, activeCharacter.value.name);
    }
  } catch (error) {
    console.error('Erro ao carregar batalha:', error);
  }
}

function executeAction(actionType: 'ATTACK' | 'SKILL' | 'DEFEND' | 'HEAL') {
  if (!battle.value || !activeCharacter.value) return;

  monsterHit.value = true;
  setTimeout(() => { monsterHit.value = false; }, 600);

  sendFamilyBattleAction(battle.value.id, activeCharacter.value.id, actionType);
}

onMounted(() => {
  loadData();

  const socket = getFamilySocket();
  socket.on('family:battle_updated', (data: any) => {
    battle.value = data.battle;
    monsterHit.value = true;
    setTimeout(() => { monsterHit.value = false; }, 500);
  });

  socket.on('family:battle_victory', (data: any) => {
    battle.value = data.battle;
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#f59e0b', '#fbbf24', '#e11d48', '#10b981', '#6366f1']
    });
  });
});

onUnmounted(() => {
  const socket = getFamilySocket();
  socket.off('family:battle_updated');
  socket.off('family:battle_victory');
});
</script>
