<template>
  <div class="min-h-screen bg-gradient-to-b from-[#180309] via-[#0d0a1a] to-[#040e24] text-slate-100 font-sans relative overflow-hidden pb-12">
    <FamilyNavbar />

    <div class="p-4 md:p-8">
      <!-- Modal / Toast de Convite de Batalha Recebido -->
      <transition name="slide-down">
        <div 
          v-if="incomingBattleInvite && incomingBattleInvite.leaderId !== activeCharacter?.id"
          class="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-lg w-full px-4"
        >
          <div class="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 border-2 border-purple-400 p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 animate-bounce">
            <div class="flex items-center space-x-3">
              <span class="text-3xl">⚔️</span>
              <div>
                <p class="text-xs font-extrabold uppercase tracking-wider text-purple-300">Convite de Batalha!</p>
                <p class="text-sm font-bold text-slate-100">
                  <strong>{{ incomingBattleInvite.leaderName }}</strong> te chamou para enfrentar <em>{{ incomingBattleInvite.monsterName }}</em>!
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="acceptInvite"
                class="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-3 py-2 rounded-xl shadow transition-all active:scale-95"
              >
                Aceitar!
              </button>
              <button
                @click="incomingBattleInvite = null"
                class="text-slate-400 hover:text-slate-200 text-xs px-2 py-1"
              >
                Recusar
              </button>
            </div>
          </div>
        </div>
      </transition>

      <!-- Header Principal -->
      <div class="max-w-5xl mx-auto flex items-center justify-between pb-6 border-b border-rose-900/60">
        <div class="flex items-center space-x-4">
          <div>
            <h1 class="text-2xl md:text-3xl font-black text-rose-400 flex items-center space-x-2">
            <span>⚔️ Arena de Batalha da Família</span>
          </h1>
          <p class="text-xs md:text-sm text-slate-400">Jogue Solo ou convide os membros online para lutar em grupo!</p>
        </div>
      </div>

      <div class="flex items-center space-x-3">
        <!-- Indicador de Herói Ativo -->
        <div v-if="activeCharacter" class="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
          <img :src="activeCharacter.avatarUrl" class="w-6 h-6 rounded-lg object-cover" />
          <span class="font-bold text-amber-300">{{ activeCharacter.name }}</span>
        </div>
        <div class="flex items-center space-x-2 bg-rose-500/10 border border-rose-500/30 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-300">
          <span class="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          <span>Ao Vivo</span>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- ESTADO 1: LOBBY DE FORMAÇÃO DO GRUPO (ANTES DE INICIAR A LUTA) -->
    <!-- ========================================================================= -->
    <div v-if="battleState === 'LOBBY'" class="max-w-5xl mx-auto my-8 space-y-6">
      
      <!-- Card de Apresentação do Chefe -->
      <div class="bg-gradient-to-b from-slate-900 via-slate-900 to-rose-950/40 border-2 border-rose-500/40 rounded-3xl p-6 text-center relative overflow-hidden shadow-2xl">
        <div class="w-28 h-28 md:w-36 md:h-36 mx-auto rounded-3xl overflow-hidden border-4 border-rose-500 shadow-2xl shadow-rose-500/30 mb-4 bg-slate-800">
          <img :src="monsterInfo.avatar" :alt="monsterInfo.name" class="w-full h-full object-cover" />
        </div>
        <span class="text-xs font-extrabold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20 mb-2 inline-block">
          Chefe da Masmorra
        </span>
        <h2 class="text-2xl md:text-3xl font-black text-slate-100">{{ monsterInfo.name }}</h2>
        <p class="text-xs text-slate-400 mt-1 max-w-md mx-auto">{{ monsterInfo.description }}</p>
      </div>

      <!-- Área de Formação de Grupo -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- Coluna 1: Membros no Grupo Atual -->
        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-base font-black text-slate-200 flex items-center space-x-2">
                <span>🛡️ Heróis Prontos para a Luta:</span>
              </h3>
              <span class="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                {{ activePartyLobby.length }} no Grupo
              </span>
            </div>

            <!-- Lista de Heróis no Lobby -->
            <div class="space-y-2 mb-4">
              <div
                v-for="p in activePartyLobby"
                :key="p.characterId"
                class="flex items-center justify-between bg-slate-950 p-3 rounded-2xl border border-slate-800"
              >
                <div class="flex items-center space-x-3">
                  <img :src="p.avatarUrl" class="w-10 h-10 rounded-xl object-cover border border-amber-400/60" />
                  <div>
                    <p class="text-xs font-bold text-slate-100">{{ p.name }}</p>
                    <p class="text-[10px] text-amber-400 font-semibold">{{ p.characterClass }}</p>
                  </div>
                </div>

                <div class="flex items-center space-x-2">
                  <span v-if="p.isLeader" class="text-[10px] font-black uppercase text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-500/30">
                    👑 Líder
                  </span>
                  <span v-else class="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    ✅ Confirmado
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Botões de Início -->
          <div class="space-y-2 pt-4 border-t border-slate-800">
            <!-- Iniciar Batalha Solo -->
            <button
              @click="startSoloBattle"
              class="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs md:text-sm py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all active:scale-95"
            >
              <span>🚀</span>
              <span>Iniciar Batalha Solo (Apenas Eu)</span>
            </button>

            <!-- Iniciar com o Grupo -->
            <button
              :disabled="activePartyLobby.length === 0"
              @click="startPartyBattleGroup"
              class="w-full bg-gradient-to-r from-rose-600 via-red-500 to-rose-600 hover:from-rose-500 hover:to-red-400 text-white font-black text-xs md:text-sm py-3.5 px-4 rounded-xl shadow-lg shadow-rose-600/20 flex items-center justify-center space-x-2 transition-all active:scale-95"
            >
              <span>⚔️</span>
              <span>Iniciar Combate com o Grupo ({{ activePartyLobby.length }} Heróis)</span>
            </button>
          </div>
        </div>

        <!-- Coluna 2: Membros Online na Casa & Convidar -->
        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-base font-black text-slate-200 flex items-center space-x-2">
                <span>🟢 Membros Online Agora:</span>
              </h3>
              <span class="text-xs text-slate-400">Total: {{ members.length }}</span>
            </div>

            <div class="space-y-2 mb-4">
              <div
                v-for="m in members"
                :key="m.id"
                class="flex items-center justify-between bg-slate-950 p-3 rounded-2xl border border-slate-800"
              >
                <div class="flex items-center space-x-3">
                  <div class="relative">
                    <img :src="m.avatarUrl" class="w-10 h-10 rounded-xl object-cover border border-slate-700" />
                    <span 
                      :class="[
                        'absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-900',
                        isMemberOnline(m.id) ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'
                      ]"
                    ></span>
                  </div>
                  <div>
                    <p class="text-xs font-bold text-slate-200">{{ m.name }}</p>
                    <p class="text-[10px] text-slate-400">
                      {{ isMemberOnline(m.id) ? 'Online no App' : 'Descansando' }}
                    </p>
                  </div>
                </div>

                <div>
                  <span v-if="isInParty(m.id)" class="text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2 py-1 rounded-lg">
                    No Grupo
                  </span>
                  <span v-else-if="isMemberOnline(m.id)" class="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">
                    Disponível
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Botão para Convidar Todos Online -->
          <div class="pt-4 border-t border-slate-800">
            <button
              @click="inviteOnlineMembers"
              class="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs md:text-sm py-3.5 px-4 rounded-xl shadow-lg shadow-purple-600/20 flex items-center justify-center space-x-2 transition-all active:scale-95"
            >
              <span>📢</span>
              <span>Convidar Membros Online para o Grupo</span>
            </button>
          </div>
        </div>

      </div>

    </div>

    <!-- ========================================================================= -->
    <!-- ESTADO 2: ARENA DE BATALHA EM ANDAMENTO -->
    <!-- ========================================================================= -->
    <div v-else-if="battle && battleState === 'BATTLE'" class="max-w-5xl mx-auto my-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Coluna da Esquerda / Centro: Chefe & Ações de Turno -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- Card do Chefe Monstruoso -->
        <div class="bg-gradient-to-b from-slate-900 via-slate-900 to-rose-950/40 border-2 border-rose-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden text-center">
          <div class="flex items-center justify-between mb-2">
            <div class="text-xs font-bold uppercase tracking-widest text-rose-400 bg-rose-500/10 inline-block px-3 py-1 rounded-full border border-rose-500/20">
              {{ battle.title }}
            </div>
            <button
              @click="resetToLobby"
              class="text-xs text-slate-400 hover:text-slate-200 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700"
            >
              ⚙️ Voltar ao Lobby
            </button>
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
                :style="{ width: `${Math.max(0, (battle.monsterHpCurrent / battle.monsterHpMax) * 100)}%` }"
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
            Aguardando jogada do herói/monstro...
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
              class="bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-xs md:text-sm py-4 px-3 rounded-2xl shadow-lg shadow-rose-600/20 flex flex-col items-center justify-center space-y-1 transition-all active:scale-95 cursor-pointer"
            >
              <span class="text-2xl">🗡️</span>
              <span>Ataque Físico</span>
            </button>

            <!-- Magia / Poder Especial -->
            <button
              :disabled="!isMyTurn || battle.status !== 'IN_PROGRESS'"
              @click="executeAction('SKILL')"
              class="bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black text-xs md:text-sm py-4 px-3 rounded-2xl shadow-lg shadow-amber-500/20 flex flex-col items-center justify-center space-y-1 transition-all active:scale-95 cursor-pointer"
            >
              <span class="text-2xl">🔥</span>
              <span>Magia Especial</span>
            </button>

            <!-- Bênção de Cura -->
            <button
              :disabled="!isMyTurn || battle.status !== 'IN_PROGRESS'"
              @click="executeAction('HEAL')"
              class="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-xs md:text-sm py-4 px-3 rounded-2xl shadow-lg shadow-emerald-600/20 flex flex-col items-center justify-center space-y-1 transition-all active:scale-95 cursor-pointer"
            >
              <span class="text-2xl">✨</span>
              <span>Cura Coletiva</span>
            </button>

            <!-- Defender -->
            <button
              :disabled="!isMyTurn || battle.status !== 'IN_PROGRESS'"
              @click="executeAction('DEFEND')"
              class="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-xs md:text-sm py-4 px-3 rounded-2xl shadow-lg shadow-indigo-600/20 flex flex-col items-center justify-center space-y-1 transition-all active:scale-95 cursor-pointer"
            >
              <span class="text-2xl">🛡️</span>
              <span>Defender</span>
            </button>
          </div>
        </div>

      </div>

      <!-- Coluna da Direita: Os Heróis Participantes & Diário de Batalha -->
      <div class="space-y-6">
        
        <!-- Status da Equipe da Batalha -->
        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-4">
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              🛡️ Heróis na Batalha
            </h4>
            <span class="text-xs font-bold text-amber-400">{{ activeParticipants.length }} Participante(s)</span>
          </div>

          <div class="space-y-2 max-h-56 overflow-y-auto pr-1">
            <div
              v-for="m in activeParticipants"
              :key="m.id"
              :class="[
                'flex items-center justify-between p-2 rounded-xl border text-xs',
                m.id === activeCharacter?.id ? 'bg-amber-500/10 border-amber-500/40' : 'bg-slate-950 border-slate-800'
              ]"
            >
              <div class="flex items-center space-x-2">
                <img :src="getDisplayImageUrl(m.avatarUrl)" class="w-8 h-8 rounded-lg object-cover border border-slate-700" />
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
              v-for="(log, idx) in formattedBattleLogs"
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
        <h2 class="text-3xl font-black text-amber-300 mb-2">VITÓRIA CONQUISTADA!</h2>
        <p class="text-sm text-slate-300 mb-6">
          O temível <strong>{{ battle.monsterName }}</strong> foi derrotado!
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

        <button
          @click="resetToLobby"
          class="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black py-3 px-6 rounded-2xl shadow-xl shadow-amber-500/20 transition-all active:scale-95"
        >
          Jogar Novamente / Voltar ao Lobby
        </button>
      </div>
    </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue';
import FamilyNavbar from '../../components/family/FamilyNavbar.vue';
import { familyApi, getDisplayImageUrl } from '../../services/familyApi';
import { 
  getFamilySocket, 
  sendFamilyBattleAction, 
  joinFamilyRoom, 
  createPartyLobby, 
  sendPartyInvite, 
  acceptPartyInvite, 
  startPartyBattle,
  activePartyLobby, 
  incomingBattleInvite, 
  onlineFamilyMembers 
} from '../../services/familySocket';
import confetti from 'canvas-confetti';

const battle = ref<any>(null);
const members = ref<any[]>([]);
const activeCharacter = ref<any>(null);
const monsterHit = ref<boolean>(false);
const battleState = ref<'LOBBY' | 'BATTLE'>('LOBBY');

const monsterInfo = {
  name: 'O Golem da Bagunça',
  avatar: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=500&auto=format&fit=crop&q=60',
  description: 'Criatura colossal feita de brinquedos fora do lugar e roupas espalhadas pelo quarto. Reúna seus irmãos ou lute sozinho para vencê-lo!',
};

function isMemberOnline(characterId: string) {
  return onlineFamilyMembers.value.some(m => m.characterId === characterId);
}

function isInParty(characterId: string) {
  return activePartyLobby.value.some(p => p.characterId === characterId);
}

const normalizedTurnOrder = computed<string[]>(() => {
  if (!battle.value || !battle.value.currentTurnOrder) return [];
  if (Array.isArray(battle.value.currentTurnOrder)) return battle.value.currentTurnOrder;
  if (typeof battle.value.currentTurnOrder === 'string') {
    try {
      const parsed = JSON.parse(battle.value.currentTurnOrder);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }
  return [];
});

const formattedBattleLogs = computed<string[]>(() => {
  if (!battle.value || !battle.value.battleLogs) return [];
  if (Array.isArray(battle.value.battleLogs)) return battle.value.battleLogs;
  if (typeof battle.value.battleLogs === 'string') {
    try {
      const parsed = JSON.parse(battle.value.battleLogs);
      return Array.isArray(parsed) ? parsed : [battle.value.battleLogs];
    } catch (e) {
      return [battle.value.battleLogs];
    }
  }
  return [];
});

const activeParticipants = computed(() => {
  const turns = normalizedTurnOrder.value;
  const ids = turns.filter((id: string) => id !== 'MONSTER');
  if (ids.length === 0) return members.value;
  return members.value.filter(m => ids.includes(m.id));
});

const currentTurnHeroId = computed(() => {
  const turns = normalizedTurnOrder.value;
  if (turns.length === 0) return activeCharacter.value?.id || null;
  const idx = (battle.value?.activeTurnIndex ?? 0) % turns.length;
  return turns[idx];
});

const currentTurnHeroName = computed(() => {
  const heroId = currentTurnHeroId.value;
  if (!heroId) return activeCharacter.value?.name || 'Seu Herói';
  if (heroId === 'MONSTER') return `🐲 ${battle.value?.monsterName || 'Monstro'}`;
  const h = members.value.find(m => m.id === heroId);
  return h ? `🧙‍♂️ ${h.name} (${h.characterClass})` : (activeCharacter.value?.name || 'Seu Herói');
});

const isMyTurn = computed(() => {
  if (!activeCharacter.value) return false;
  const turns = normalizedTurnOrder.value;
  if (turns.length === 0) return true;
  const heroId = currentTurnHeroId.value;
  if (heroId === 'MONSTER') return false;
  
  // Se for Solo (só tem 1 herói no combate), é sempre a vez dele!
  const activeHeroes = turns.filter(id => id !== 'MONSTER');
  if (activeHeroes.length === 1 && activeHeroes[0] === activeCharacter.value.id) {
    return true;
  }
  
  return heroId === activeCharacter.value.id;
});

function formatLog(log: string) {
  if (typeof log !== 'string') return '';
  return log.replace(/\*\*(.*?)\*\*/g, '<strong class="text-amber-300">$1</strong>');
}

function inviteOnlineMembers() {
  if (!activeCharacter.value) return;
  sendPartyInvite(activeCharacter.value.name, activeCharacter.value.id, monsterInfo.name);
  alert('📢 Convite de batalha enviado para todos os membros online na casa!');
}

function acceptInvite() {
  if (!activeCharacter.value) return;
  acceptPartyInvite(activeCharacter.value);
}

function startSoloBattle() {
  if (!activeCharacter.value) return;
  const soloParty = [{
    characterId: activeCharacter.value.id,
    name: activeCharacter.value.name,
    characterClass: activeCharacter.value.characterClass,
    avatarUrl: activeCharacter.value.avatarUrl,
    isLeader: true,
  }];
  startPartyBattle(soloParty, true);
}

function startPartyBattleGroup() {
  startPartyBattle(activePartyLobby.value, false);
}

function resetToLobby() {
  battleState.value = 'LOBBY';
  if (activeCharacter.value) {
    createPartyLobby(activeCharacter.value);
  }
}

async function loadData() {
  try {
    const savedCharId = localStorage.getItem('lira_active_family_char_id');
    const membersRes = await familyApi.getMembers();
    if (membersRes.success && membersRes.members.length > 0) {
      members.value = membersRes.members;
      activeCharacter.value = members.value.find((m: any) => m.id === savedCharId) || members.value[0];
    }

    if (activeCharacter.value) {
      joinFamilyRoom(activeCharacter.value.id, activeCharacter.value.name);
      createPartyLobby(activeCharacter.value);
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

  socket.on('family:battle_party_started', (data: any) => {
    battle.value = data.battle;
    battleState.value = 'BATTLE';
  });

  socket.on('family:battle_updated', (data: any) => {
    battle.value = data.battle;
    battleState.value = 'BATTLE';
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
  socket.off('family:battle_party_started');
  socket.off('family:battle_updated');
  socket.off('family:battle_victory');
});
</script>

<style scoped>
.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.4s ease;
}
.slide-down-enter-from, .slide-down-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}
</style>
