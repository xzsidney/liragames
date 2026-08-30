<template>
  <div class="min-h-screen bg-gradient-to-b from-[#180309] via-[#0d0a1a] to-[#040e24] text-slate-100 font-sans pb-12">
    <FamilyNavbar />

    <main class="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      <!-- Topo: Título da Ficha -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-rose-900/60 pb-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-black text-amber-300 flex items-center space-x-2">
            <span>🛡️ Ficha do Herói da Família</span>
          </h1>
          <p class="text-xs md:text-sm text-blue-200">Evolua seus atributos, equipe armas mágicas e desbloqueie talentos!</p>
        </div>

        <div v-if="hero" class="flex items-center space-x-2 bg-gradient-to-r from-rose-950 to-blue-950 border border-amber-400/60 px-4 py-2 rounded-2xl shadow-lg shadow-amber-500/10">
          <span class="text-xs text-slate-300">XP Disponível:</span>
          <span class="text-sm font-black text-amber-300">⭐ {{ hero.currentXp }} XP</span>
          <span class="text-slate-500">•</span>
          <span class="text-sm font-black text-yellow-400">🪙 {{ hero.gold }} Ouro</span>
        </div>
      </div>

      <!-- Seletor se tiver mais de um herói ou aviso de criação -->
      <div v-if="!hero" class="bg-gradient-to-b from-rose-950/80 to-blue-950/80 border-2 border-amber-400/60 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
        <span class="text-5xl">🛡️</span>
        <h2 class="text-2xl font-black text-amber-300">Nenhum Herói Criado</h2>
        <p class="text-sm text-slate-300 max-w-md mx-auto">Crie seu primeiro personagem no Salão da Família para visualizar sua ficha completa!</p>
        <router-link to="/familia/sala" class="inline-block bg-gradient-to-r from-rose-600 via-purple-600 to-blue-600 text-white font-black px-6 py-3 rounded-2xl shadow-lg hover:scale-105 transition-transform">
          ➔ Ir para o Salão Criar Herói
        </router-link>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Coluna 1: Avatar, Status & Equipamentos -->
        <div class="space-y-6">
          
          <!-- Card do Personagem -->
          <div class="bg-gradient-to-b from-[#2a0611] to-[#0a1533] border-2 border-amber-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden text-center">
            <div class="w-32 h-32 mx-auto rounded-3xl overflow-hidden border-4 border-amber-400 shadow-xl shadow-amber-500/20 mb-4 bg-slate-900">
              <img :src="hero.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500'" class="w-full h-full object-cover" />
            </div>

            <h2 class="text-2xl font-black text-slate-100">{{ hero.name }}</h2>
            <p class="text-xs font-bold uppercase tracking-wider text-amber-300 mt-0.5">
              {{ hero.characterClass }} • {{ hero.title || 'Guardião da Família' }}
            </p>
            <div class="inline-block bg-rose-950/80 border border-rose-700/60 text-rose-300 text-xs font-black px-3 py-1 rounded-full mt-2">
              Nível {{ hero.level }}
            </div>

            <!-- Barras de Recursos -->
            <div class="space-y-3 mt-6 text-left">
              <!-- HP -->
              <div>
                <div class="flex justify-between text-xs font-bold mb-1">
                  <span class="text-rose-400">❤️ Vida Máxima (HP)</span>
                  <span class="text-slate-200">{{ hero.hpCurrent }} / {{ hero.hpMax }}</span>
                </div>
                <div class="w-full bg-slate-950 h-2.5 rounded-full border border-rose-800/40 overflow-hidden">
                  <div class="bg-gradient-to-r from-rose-600 to-red-400 h-full rounded-full" :style="{ width: `${(hero.hpCurrent / hero.hpMax) * 100}%` }"></div>
                </div>
              </div>

              <!-- MP -->
              <div>
                <div class="flex justify-between text-xs font-bold mb-1">
                  <span class="text-sky-400">💧 Mana Astral (MP)</span>
                  <span class="text-slate-200">{{ hero.mpCurrent }} / {{ hero.mpMax }}</span>
                </div>
                <div class="w-full bg-slate-950 h-2.5 rounded-full border border-blue-800/40 overflow-hidden">
                  <div class="bg-gradient-to-r from-blue-600 to-sky-400 h-full rounded-full" :style="{ width: `${(hero.mpCurrent / hero.mpMax) * 100}%` }"></div>
                </div>
              </div>

              <!-- XP para o Próximo Nível -->
              <div>
                <div class="flex justify-between text-xs font-bold mb-1">
                  <span class="text-amber-400">⭐ Progresso de Nível (XP)</span>
                  <span class="text-slate-200">{{ hero.currentXp }} / {{ hero.nextLevelXp }}</span>
                </div>
                <div class="w-full bg-slate-950 h-2.5 rounded-full border border-amber-800/40 overflow-hidden">
                  <div class="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full" :style="{ width: `${Math.min(100, (hero.currentXp / hero.nextLevelXp) * 100)}%` }"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Arsenal Equipado -->
          <div class="bg-gradient-to-b from-[#1f050e] to-[#0c1329] border border-blue-900/60 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 class="text-sm font-black uppercase tracking-wider text-blue-300 flex items-center space-x-2">
              <span>🗡️ Equipamentos Ativos</span>
            </h3>

            <div class="space-y-2 text-xs">
              <div class="bg-slate-950/80 p-3 rounded-2xl border border-rose-900/40 flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span class="text-xl">⚔️</span>
                  <div>
                    <p class="text-slate-400 text-[10px]">Arma Principal</p>
                    <p class="font-bold text-amber-300">{{ hero.equippedWeapon || 'Espada de Madeira' }}</p>
                  </div>
                </div>
                <span class="text-[10px] text-emerald-400 font-bold">+Ataque</span>
              </div>

              <div class="bg-slate-950/80 p-3 rounded-2xl border border-blue-900/40 flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span class="text-xl">🛡️</span>
                  <div>
                    <p class="text-slate-400 text-[10px]">Armadura / Traje</p>
                    <p class="font-bold text-amber-300">{{ hero.equippedArmor || 'Colete de Couro' }}</p>
                  </div>
                </div>
                <span class="text-[10px] text-blue-400 font-bold">+Defesa</span>
              </div>

              <div class="bg-slate-950/80 p-3 rounded-2xl border border-amber-900/40 flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span class="text-xl">🐾</span>
                  <div>
                    <p class="text-slate-400 text-[10px]">Mascote Leal</p>
                    <p class="font-bold text-amber-300">{{ hero.equippedPet || 'Nenhum equipado' }}</p>
                  </div>
                </div>
                <span v-if="hero.equippedPet" class="text-[10px] text-yellow-400 font-bold">+Sabedoria</span>
                <router-link v-else to="/familia/loja" class="text-[10px] text-amber-400 hover:underline">Adotar ➔</router-link>
              </div>
            </div>
          </div>

        </div>

        <!-- Coluna 2 & 3: Matriz de Atributos & Árvore de Talentos da Família -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- Matriz dos 5 Atributos Principais -->
          <div class="bg-gradient-to-b from-[#22050f] via-[#100b24] to-[#071433] border-2 border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-5">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-rose-900/60 pb-3">
              <div>
                <h3 class="text-lg font-black text-amber-300 flex items-center space-x-2">
                  <span>⚡ Atributos Nucleares do Herói</span>
                </h3>
                <p class="text-xs text-blue-200">Gaste 50 XP para aprimorar seus atributos e ficar mais forte nas batalhas e testes!</p>
              </div>
              <span class="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                50 XP por Atributo
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <!-- 1. Força -->
              <div class="bg-slate-950/80 p-4 rounded-2xl border border-rose-900/50 flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 rounded-xl bg-rose-950/80 border border-rose-600/40 flex items-center justify-center text-2xl">
                    💪
                  </div>
                  <div>
                    <p class="text-sm font-black text-slate-100">Força</p>
                    <p class="text-[11px] text-slate-400">Aumenta dano físico</p>
                  </div>
                </div>
                <div class="flex items-center space-x-3">
                  <span class="text-xl font-black text-rose-400">{{ hero.strength }}</span>
                  <button 
                    :disabled="hero.currentXp < 50"
                    @click="upgradeStat('strength')"
                    class="w-8 h-8 rounded-lg bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 disabled:opacity-30 disabled:cursor-not-allowed text-white font-black flex items-center justify-center shadow transition-transform active:scale-90 cursor-pointer"
                    title="Aprimorar +1 Força (Custa 50 XP)"
                  >
                    +
                  </button>
                </div>
              </div>

              <!-- 2. Vitalidade -->
              <div class="bg-slate-950/80 p-4 rounded-2xl border border-rose-900/50 flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 rounded-xl bg-rose-950/80 border border-rose-600/40 flex items-center justify-center text-2xl">
                    🛡️
                  </div>
                  <div>
                    <p class="text-sm font-black text-slate-100">Vitalidade</p>
                    <p class="text-[11px] text-slate-400">Aumenta Vida (+10 HP)</p>
                  </div>
                </div>
                <div class="flex items-center space-x-3">
                  <span class="text-xl font-black text-rose-400">{{ hero.vitality }}</span>
                  <button 
                    :disabled="hero.currentXp < 50"
                    @click="upgradeStat('vitality')"
                    class="w-8 h-8 rounded-lg bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 disabled:opacity-30 disabled:cursor-not-allowed text-white font-black flex items-center justify-center shadow transition-transform active:scale-90 cursor-pointer"
                    title="Aprimorar +1 Vitalidade (Custa 50 XP)"
                  >
                    +
                  </button>
                </div>
              </div>

              <!-- 3. Sabedoria -->
              <div class="bg-slate-950/80 p-4 rounded-2xl border border-blue-900/50 flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-600/40 flex items-center justify-center text-2xl">
                    🔮
                  </div>
                  <div>
                    <p class="text-sm font-black text-slate-100">Sabedoria</p>
                    <p class="text-[11px] text-slate-400">Poder mágico e estudos</p>
                  </div>
                </div>
                <div class="flex items-center space-x-3">
                  <span class="text-xl font-black text-sky-400">{{ hero.wisdom }}</span>
                  <button 
                    :disabled="hero.currentXp < 50"
                    @click="upgradeStat('wisdom')"
                    class="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 disabled:opacity-30 disabled:cursor-not-allowed text-white font-black flex items-center justify-center shadow transition-transform active:scale-90 cursor-pointer"
                    title="Aprimorar +1 Sabedoria (Custa 50 XP)"
                  >
                    +
                  </button>
                </div>
              </div>

              <!-- 4. Agilidade -->
              <div class="bg-slate-950/80 p-4 rounded-2xl border border-blue-900/50 flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-600/40 flex items-center justify-center text-2xl">
                    🏃
                  </div>
                  <div>
                    <p class="text-sm font-black text-slate-100">Agilidade</p>
                    <p class="text-[11px] text-slate-400">Velocidade nas tarefas</p>
                  </div>
                </div>
                <div class="flex items-center space-x-3">
                  <span class="text-xl font-black text-sky-400">{{ hero.agility }}</span>
                  <button 
                    :disabled="hero.currentXp < 50"
                    @click="upgradeStat('agility')"
                    class="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 disabled:opacity-30 disabled:cursor-not-allowed text-white font-black flex items-center justify-center shadow transition-transform active:scale-90 cursor-pointer"
                    title="Aprimorar +1 Agilidade (Custa 50 XP)"
                  >
                    +
                  </button>
                </div>
              </div>

              <!-- 5. Laço Familiar (Único do Sistema Lira) -->
              <div class="sm:col-span-2 bg-gradient-to-r from-rose-950/60 via-purple-950/60 to-blue-950/60 p-4 rounded-2xl border-2 border-amber-400/50 flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-2xl text-slate-950 shadow">
                    💖
                  </div>
                  <div>
                    <p class="text-sm font-black text-amber-300">Laço Familiar (União do Clã)</p>
                    <p class="text-[11px] text-slate-300">Aumenta bônus de cooperação e cura coletiva com pais e irmãos</p>
                  </div>
                </div>
                <div class="flex items-center space-x-3">
                  <span class="text-2xl font-black text-amber-300">{{ hero.heartBond }}</span>
                  <button 
                    :disabled="hero.currentXp < 50"
                    @click="upgradeStat('heartBond')"
                    class="w-8 h-8 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 disabled:opacity-30 disabled:cursor-not-allowed text-slate-950 font-black flex items-center justify-center shadow transition-transform active:scale-90 cursor-pointer"
                    title="Aprimorar +1 Laço Familiar (Custa 50 XP)"
                  >
                    +
                  </button>
                </div>
              </div>

            </div>
          </div>

          <!-- Talentos & Magias Especiais da Classe -->
          <div class="bg-gradient-to-b from-[#18050c] to-[#071029] border border-blue-900/60 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 class="text-sm font-black uppercase tracking-wider text-amber-300 flex items-center space-x-2">
              <span>✨ Habilidades & Talentos de {{ hero.characterClass }}</span>
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div class="bg-slate-950/80 p-3.5 rounded-2xl border border-rose-900/50 space-y-1">
                <div class="flex items-center justify-between">
                  <span class="font-black text-rose-300">🔥 Golpe Especial da Classe</span>
                  <span class="text-[10px] text-amber-400 font-bold">Nv. 1 (Ativo)</span>
                </div>
                <p class="text-[11px] text-slate-400">Dispara ataque devastador na arena causando dano multiplicado na batalha.</p>
              </div>

              <div class="bg-slate-950/80 p-3.5 rounded-2xl border border-blue-900/50 space-y-1">
                <div class="flex items-center justify-between">
                  <span class="font-black text-sky-300">✨ Bênção Coletiva</span>
                  <span class="text-[10px] text-amber-400 font-bold">Nv. 1 (Ativo)</span>
                </div>
                <p class="text-[11px] text-slate-400">Restaura a vida e a energia de todos os irmãos presentes no grupo.</p>
              </div>

              <div class="bg-slate-950/80 p-3.5 rounded-2xl border border-amber-900/50 space-y-1">
                <div class="flex items-center justify-between">
                  <span class="font-black text-amber-300">🧠 Mente Focada</span>
                  <span class="text-[10px] text-amber-400 font-bold">Nv. 2 (Ativo)</span>
                </div>
                <p class="text-[11px] text-slate-400">Garante +20% de bônus de XP ao completar missões no Centro de Foco.</p>
              </div>

              <div class="bg-slate-950/80 p-3.5 rounded-2xl border border-purple-900/50 space-y-1">
                <div class="flex items-center justify-between">
                  <span class="font-black text-purple-300">👑 Orgulho dos Pais</span>
                  <span class="text-[10px] text-amber-400 font-bold">Nv. 3 (Passivo)</span>
                </div>
                <p class="text-[11px] text-slate-400">Dobra as moedas de ouro ganhas nas tarefas aprovadas com nota máxima.</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import FamilyNavbar from '../../components/family/FamilyNavbar.vue';
import { familyApi } from '../../services/familyApi';

const hero = ref<any | null>(null);

async function loadHero() {
  try {
    const res = await familyApi.getMyCharacters();
    if (res.success && res.characters?.length > 0) {
      const savedId = localStorage.getItem('lira_active_family_char_id');
      hero.value = res.characters.find((c: any) => c.id === savedId) || res.characters[0];
    }
  } catch (err) {
    console.error('Erro ao carregar herói:', err);
  }
}

async function upgradeStat(attribute: string) {
  if (!hero.value) return;
  try {
    const res = await familyApi.updateCharacterStats(hero.value.id, attribute);
    if (res.success) {
      alert(`✨ ${res.message}`);
      hero.value = res.character;
    } else {
      alert(res.error || 'Erro ao aprimorar atributo.');
    }
  } catch (err) {
    console.error('Erro ao aprimorar atributo:', err);
  }
}

onMounted(() => {
  loadHero();
});
</script>
