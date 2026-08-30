<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans selection:bg-amber-500 selection:text-slate-950 relative overflow-hidden">
    <!-- Modal de Convite de Batalha Recebido em Tempo Real -->
    <transition name="slide-down">
      <div 
        v-if="incomingBattleInvite && incomingBattleInvite.leaderId !== activeCharacter?.id"
        class="fixed top-6 left-1/2 -translate-x-1/2 z-50 max-w-lg w-full px-4"
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
              @click="acceptInviteAndGo"
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

    <!-- Emojis Flutuantes em Tempo Real -->
    <div class="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <transition-group name="float-up">
        <div
          v-for="reaction in floatingReactions"
          :key="reaction.id"
          class="absolute bottom-20 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-amber-500/50 backdrop-blur-md px-4 py-2 rounded-full shadow-2xl flex items-center space-x-2 animate-bounce text-lg"
        >
          <span class="text-2xl">{{ reaction.emoji }}</span>
          <span class="font-bold text-amber-300">{{ reaction.characterName }}:</span>
          <span class="text-slate-200 text-sm">{{ reaction.text || 'mandou uma reação!' }}</span>
        </div>
      </transition-group>
    </div>

    <!-- Banner de Alerta em Tempo Real (Conquistas/Tarefas) -->
    <transition name="slide-down">
      <div 
        v-if="familyAlerts.length > 0"
        class="mb-6 max-w-4xl mx-auto bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-slate-950 px-6 py-3 rounded-2xl shadow-xl shadow-amber-500/20 font-bold flex items-center justify-between border-2 border-yellow-200"
      >
        <div class="flex items-center space-x-3">
          <span class="text-3xl animate-spin">⭐</span>
          <div>
            <p class="text-sm uppercase tracking-wider font-extrabold text-amber-950">Conquista em Família!</p>
            <p class="text-base">
              🎉 <strong>{{ familyAlerts[0].characterName }}</strong> concluiu <em>"{{ familyAlerts[0].taskTitle }}"</em> (+{{ familyAlerts[0].rewardXp }} XP • +{{ familyAlerts[0].rewardGold }} Ouro)!
            </p>
          </div>
        </div>
        <button @click="familyAlerts.shift()" class="text-amber-950 font-black text-xl hover:scale-110 transition-transform">✕</button>
      </div>
    </transition>

    <!-- Topo / Header da Família Lira -->
    <header class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
      <div class="flex items-center space-x-4">
        <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 p-1 shadow-lg shadow-amber-500/20 flex items-center justify-center">
          <span class="text-3xl">🏰</span>
        </div>
        <div>
          <h1 class="text-2xl md:text-3xl font-black tracking-wide bg-gradient-to-r from-amber-300 via-yellow-200 to-orange-400 bg-clip-text text-transparent">
            Crônicas da Família Lira
          </h1>
          <p class="text-xs md:text-sm text-slate-400 flex items-center space-x-2">
            <span>🔥 Salão do Clã em Tempo Real</span>
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span class="text-emerald-400 font-semibold">Multijogador Conectado</span>
          </p>
        </div>
      </div>

      <!-- Seletor de Perfil Ativo (Facilita jogar e testar com qualquer membro) -->
      <div class="bg-slate-900 border border-slate-800 p-2 rounded-xl flex items-center space-x-3">
        <label class="text-xs text-slate-400 font-medium pl-1">Jogando como:</label>
        <select 
          v-model="selectedCharacterId" 
          @change="changeActiveCharacter"
          class="bg-slate-800 text-amber-300 font-bold text-sm px-3 py-1.5 rounded-lg border border-amber-500/30 focus:outline-none focus:border-amber-400 cursor-pointer"
        >
          <option v-for="m in members" :key="m.id" :value="m.id">
            {{ m.name }} ({{ m.characterClass }}) - Nv. {{ m.level }}
          </option>
        </select>
      </div>
    </header>

    <!-- Barra de Reações Rápidas -->
    <div class="max-w-6xl mx-auto my-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2 backdrop-blur-sm">
      <div class="flex items-center space-x-2 text-xs font-semibold text-slate-400 pl-2">
        <span>Interagir com a família:</span>
      </div>
      <div class="flex flex-wrap gap-2">
        <button 
          v-for="btn in reactionButtons" 
          :key="btn.emoji"
          @click="sendReaction(btn.emoji, btn.text)"
          class="bg-slate-800 hover:bg-amber-500/20 hover:border-amber-500 border border-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition-all active:scale-95"
        >
          <span class="text-base">{{ btn.emoji }}</span>
          <span>{{ btn.label }}</span>
        </button>
      </div>
    </div>

    <!-- Herói Selecionado / Card de Destaque -->
    <section v-if="activeCharacter" class="max-w-6xl mx-auto my-6">
      <div class="bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/40 border-2 border-amber-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div class="absolute -right-10 -bottom-10 opacity-10 text-9xl pointer-events-none">🛡️</div>
        
        <div class="flex flex-col md:flex-row items-center gap-6 relative z-10">
          <!-- Avatar -->
          <div class="relative">
            <div class="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-4 border-amber-400/80 shadow-xl shadow-amber-500/20 bg-slate-800">
              <img :src="activeCharacter.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500'" :alt="activeCharacter.name" class="w-full h-full object-cover" />
            </div>
            <span class="absolute -bottom-2 -right-2 bg-amber-500 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-full shadow">
              Nv. {{ activeCharacter.level }}
            </span>
          </div>

          <!-- Info & Barras -->
          <div class="flex-1 text-center md:text-left space-y-2">
            <div class="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h2 class="text-2xl md:text-3xl font-black text-slate-100">{{ activeCharacter.name }}</h2>
              <span class="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {{ activeCharacter.characterClass }} • {{ activeCharacter.title }}
              </span>
              <span v-if="activeCharacter.isParent" class="bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-bold px-3 py-1 rounded-full">
                👑 Mestre Parental
              </span>
            </div>

            <!-- Barras de Vida, Mana e XP -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <!-- HP -->
              <div class="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                <div class="flex justify-between text-xs font-bold mb-1">
                  <span class="text-rose-400">❤️ Vida (HP)</span>
                  <span class="text-slate-300">{{ activeCharacter.hpCurrent }} / {{ activeCharacter.hpMax }}</span>
                </div>
                <div class="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div class="bg-rose-500 h-full rounded-full transition-all duration-500" :style="{ width: `${(activeCharacter.hpCurrent / activeCharacter.hpMax) * 100}%` }"></div>
                </div>
              </div>

              <!-- MP -->
              <div class="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                <div class="flex justify-between text-xs font-bold mb-1">
                  <span class="text-sky-400">💧 Mana (MP)</span>
                  <span class="text-slate-300">{{ activeCharacter.mpCurrent }} / {{ activeCharacter.mpMax }}</span>
                </div>
                <div class="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div class="bg-sky-500 h-full rounded-full transition-all duration-500" :style="{ width: `${(activeCharacter.mpCurrent / activeCharacter.mpMax) * 100}%` }"></div>
                </div>
              </div>

              <!-- XP & Gold -->
              <div class="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                <div class="flex justify-between text-xs font-bold mb-1">
                  <span class="text-amber-400">⭐ Experiência (XP)</span>
                  <span class="text-yellow-400 font-extrabold flex items-center space-x-1">
                    <span>🪙</span>
                    <span>{{ activeCharacter.gold }} Ouro</span>
                  </span>
                </div>
                <div class="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div class="bg-amber-400 h-full rounded-full transition-all duration-500" :style="{ width: `${(activeCharacter.currentXp / activeCharacter.nextLevelXp) * 100}%` }"></div>
                </div>
              </div>
            </div>

            <!-- Equipamentos equipados -->
            <div class="flex flex-wrap gap-2 text-xs pt-1">
              <span class="bg-slate-800/80 text-slate-300 px-3 py-1 rounded-lg border border-slate-700">
                🗡️ Arma: <strong class="text-amber-300">{{ activeCharacter.equippedWeapon }}</strong>
              </span>
              <span class="bg-slate-800/80 text-slate-300 px-3 py-1 rounded-lg border border-slate-700">
                🛡️ Armadura: <strong class="text-amber-300">{{ activeCharacter.equippedArmor }}</strong>
              </span>
              <span v-if="activeCharacter.equippedPet" class="bg-slate-800/80 text-slate-300 px-3 py-1 rounded-lg border border-slate-700">
                🐾 Mascote: <strong class="text-amber-300">{{ activeCharacter.equippedPet }}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Os 4 Portais de Ação do Jogo -->
    <section class="max-w-6xl mx-auto my-8">
      <h3 class="text-lg font-bold text-slate-300 mb-4 flex items-center space-x-2">
        <span>🧭 Escolha seu Caminho:</span>
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- 1. Missões da Vida Real -->
        <router-link
          to="/familia/tarefas"
          class="group bg-gradient-to-b from-slate-900 to-slate-950 hover:from-slate-850 hover:to-amber-950/40 border border-slate-800 hover:border-amber-500/60 p-6 rounded-3xl transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 flex flex-col justify-between"
        >
          <div>
            <div class="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform mb-4">
              📋
            </div>
            <h4 class="text-lg font-black text-slate-100 group-hover:text-amber-300 transition-colors">Missões Diárias</h4>
            <p class="text-xs text-slate-400 mt-1">Lave a louça, arrume a cama e faça a lição para ganhar XP e Ouro real!</p>
          </div>
          <div class="mt-6 flex items-center justify-between text-xs font-bold text-amber-400">
            <span>Ver Tarefas da Casa</span>
            <span class="group-hover:translate-x-1 transition-transform">➔</span>
          </div>
        </router-link>

        <!-- 2. Arena de Batalha -->
        <router-link
          to="/familia/batalha"
          class="group bg-gradient-to-b from-slate-900 to-slate-950 hover:from-slate-850 hover:to-rose-950/40 border border-slate-800 hover:border-rose-500/60 p-6 rounded-3xl transition-all duration-300 hover:shadow-xl hover:shadow-rose-500/10 flex flex-col justify-between"
        >
          <div>
            <div class="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform mb-4">
              ⚔️
            </div>
            <h4 class="text-lg font-black text-slate-100 group-hover:text-rose-300 transition-colors">Arena de Batalha</h4>
            <p class="text-xs text-slate-400 mt-1">Lute em turnos ao vivo contra o Golem da Bagunça junto com sua família!</p>
          </div>
          <div class="mt-6 flex items-center justify-between text-xs font-bold text-rose-400">
            <span>Entrar na Batalha</span>
            <span class="group-hover:translate-x-1 transition-transform">➔</span>
          </div>
        </router-link>

        <!-- 3. Loja e Baú dos Desejos -->
        <router-link
          to="/familia/loja"
          class="group bg-gradient-to-b from-slate-900 to-slate-950 hover:from-slate-850 hover:to-yellow-950/40 border border-slate-800 hover:border-yellow-500/60 p-6 rounded-3xl transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/10 flex flex-col justify-between"
        >
          <div>
            <div class="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform mb-4">
              🛍️
            </div>
            <h4 class="text-lg font-black text-slate-100 group-hover:text-yellow-300 transition-colors">Loja & Recompensas</h4>
            <p class="text-xs text-slate-400 mt-1">Compre armas, mascotes ou troque seu ouro por 1h de videogame e pizza!</p>
          </div>
          <div class="mt-6 flex items-center justify-between text-xs font-bold text-yellow-400">
            <span>Abrir Mercado</span>
            <span class="group-hover:translate-x-1 transition-transform">➔</span>
          </div>
        </router-link>

        <!-- 4. Painel dos Pais (Mestre) -->
        <router-link
          to="/familia/mestre"
          class="group bg-gradient-to-b from-slate-900 to-slate-950 hover:from-slate-850 hover:to-purple-950/40 border border-slate-800 hover:border-purple-500/60 p-6 rounded-3xl transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 flex flex-col justify-between"
        >
          <div>
            <div class="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform mb-4">
              👑
            </div>
            <h4 class="text-lg font-black text-slate-100 group-hover:text-purple-300 transition-colors">Painel dos Pais</h4>
            <p class="text-xs text-slate-400 mt-1">Aprove as tarefas concluídas pelos filhos com 1 clique e entregue o ouro!</p>
          </div>
          <div class="mt-6 flex items-center justify-between text-xs font-bold text-purple-400">
            <span>Acessar Painel Mestre</span>
            <span class="group-hover:translate-x-1 transition-transform">➔</span>
          </div>
        </router-link>
      </div>
    </section>

    <!-- Galeria dos 7 Heróis Reunidos (Salão da Família) -->
    <section class="max-w-6xl mx-auto my-8">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-slate-300 flex items-center space-x-2">
          <span>👥 Os 7 Heróis da Família Lira no Salão:</span>
        </h3>
        <span class="text-xs text-slate-400">Clique em qualquer herói para inspecionar</span>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <div
          v-for="member in members"
          :key="member.id"
          @click="selectCharacter(member.id)"
          :class="[
            'bg-slate-900 border rounded-2xl p-3 text-center cursor-pointer transition-all duration-200 hover:-translate-y-1',
            member.id === selectedCharacterId ? 'border-amber-400 shadow-lg shadow-amber-500/20 bg-slate-850 ring-2 ring-amber-500/30' : 'border-slate-800 hover:border-slate-700'
          ]"
        >
          <div class="relative w-16 h-16 mx-auto mb-2">
            <img :src="member.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500'" :alt="member.name" class="w-full h-full object-cover rounded-xl border border-slate-700" />
            <span 
              :class="[
                'absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-900',
                isOnline(member.id) ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'
              ]"
              :title="isOnline(member.id) ? 'Online Agora' : 'Descansando'"
            ></span>
          </div>
          <h5 class="text-xs font-bold text-slate-200 truncate">{{ member.name }}</h5>
          <p class="text-[10px] text-amber-400 font-semibold">{{ member.characterClass }}</p>
          <div class="mt-2 text-[10px] text-slate-400 bg-slate-950 py-0.5 rounded border border-slate-800/80">
            Nv. {{ member.level }} • 🪙 {{ member.gold }}
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { familyApi } from '../../services/familyApi';
import { 
  joinFamilyRoom, 
  sendFamilyReaction, 
  floatingReactions, 
  familyAlerts, 
  onlineFamilyMembers,
  incomingBattleInvite,
  acceptPartyInvite
} from '../../services/familySocket';

const router = useRouter();
const members = ref<any[]>([]);
const selectedCharacterId = ref<string>('');

function acceptInviteAndGo() {
  if (activeCharacter.value) {
    acceptPartyInvite(activeCharacter.value);
    router.push('/familia/batalha');
  }
}

const activeCharacter = computed(() => {
  return members.value.find(m => m.id === selectedCharacterId.value) || members.value[0];
});

const reactionButtons = [
  { emoji: '👏', label: 'Parabéns!', text: 'Mandou bem na missão!' },
  { emoji: '🔥', label: 'Bora time!', text: 'Vamos vencer o monstro!' },
  { emoji: '💖', label: 'Amo vocês!', text: 'Família unida!' },
  { emoji: '🛡️', label: 'Defesa!', text: 'Cuidado com o chefe!' },
  { emoji: '😂', label: 'Hahaha!', text: 'Muito divertido!' },
  { emoji: '⭐', label: 'Super Estrela!', text: 'Arrasou!' },
];

function isOnline(characterId: string) {
  return onlineFamilyMembers.value.some(m => m.characterId === characterId);
}

function sendReaction(emoji: string, text: string) {
  if (activeCharacter.value) {
    sendFamilyReaction(activeCharacter.value.id, activeCharacter.value.name, emoji, text);
  }
}

function selectCharacter(id: string) {
  selectedCharacterId.value = id;
  localStorage.setItem('lira_active_family_char_id', id);
  if (activeCharacter.value) {
    joinFamilyRoom(activeCharacter.value.id, activeCharacter.value.name);
  }
}

function changeActiveCharacter() {
  selectCharacter(selectedCharacterId.value);
}

onMounted(async () => {
  try {
    const res = await familyApi.getMembers();
    if (res.success && res.members.length > 0) {
      members.value = res.members;
      
      const savedId = localStorage.getItem('lira_active_family_char_id');
      if (savedId && members.value.some(m => m.id === savedId)) {
        selectedCharacterId.value = savedId;
      } else {
        selectedCharacterId.value = members.value[0].id;
      }

      if (activeCharacter.value) {
        joinFamilyRoom(activeCharacter.value.id, activeCharacter.value.name);
      }
    }
  } catch (error) {
    console.error('Erro ao carregar membros da família:', error);
  }
});
</script>

<style scoped>
.float-up-enter-active, .float-up-leave-active {
  transition: all 0.6s ease;
}
.float-up-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.8);
}
.float-up-leave-to {
  opacity: 0;
  transform: translateY(-50px) scale(1.1);
}

.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.4s ease;
}
.slide-down-enter-from, .slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
