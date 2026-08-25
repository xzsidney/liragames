
<template>
  <div class="min-h-screen demiplane-bg text-parchment font-sans relative overflow-x-hidden selection:bg-blood-red selection:text-white pb-10">

    <!-- SUBTLE NOISE/TEXTURE -->
    <div class="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay z-0" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>

    <!-- TELA DE REPOUSO / DORMIR -->
    <div v-if="character && !character.isAwake" class="fixed inset-0 z-50 bg-bg-deep/95 backdrop-blur-md flex flex-col items-center justify-center">
      <div class="fixed inset-0 pointer-events-none opacity-[0.05] mix-blend-overlay z-0" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>
      <div class="text-center space-y-10 z-10">
        <div class="text-vamp-c2 tracking-[0.5em] text-sm uppercase font-serif drop-shadow-[0_0_10px_rgba(192,57,43,0.8)]">Protocolo de Repouso Ativo</div>
        <button @click="awakenCharacter" :disabled="isAwakening" class="relative group border border-vamp-c2/50 text-vamp-c2 px-12 py-5 uppercase tracking-[0.3em] font-bold text-lg hover:bg-vamp-c2 hover:text-white transition-all duration-500 shadow-[0_0_30px_rgba(139,0,0,0.3)] hover:shadow-[0_0_60px_rgba(192,57,43,0.6)] disabled:opacity-50 disabled:cursor-wait rounded-sm bg-black/40 overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
          {{ isAwakening ? 'Despertando...' : 'Despertar' }}
        </button>
        <div class="text-parchment-dim text-sm tracking-widest max-w-md mx-auto font-serif italic leading-relaxed">
          "O sangue chama. O mundo dos vivos continua sem você, até agora."
        </div>
      </div>
    </div>

    <!-- NAVBAR TATICA (PREMIUM) -->
    <header class="relative z-20 border-b border-vamp-border bg-vamp-bg/90 backdrop-blur-md sticky top-0 shadow-xl">
      <div class="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button @click="router.push('/jogador/vampire')" class="text-parchment-dim hover:text-gold transition-colors flex items-center gap-2 font-serif text-xs uppercase tracking-widest">
            <span>&larr;</span> Galeria
          </button>
          <div class="h-4 w-px bg-vamp-border mx-2"></div>
          <div class="font-serif font-bold text-sm tracking-widest flex items-center gap-3 text-gold">
            <span class="w-2 h-2 rounded-full bg-vamp-c2 shadow-[0_0_8px_rgba(192,57,43,0.8)] animate-pulse"></span>
            TERMINAL NOCTURNA
          </div>
        </div>
        
        <div class="flex items-center gap-6 text-[10px] font-sans tracking-widest uppercase text-parchment-dim">
          <div class="hidden md:block">Domínio: <span class="text-parchment font-bold ml-1">{{ character?.chronicle || 'Alto do Mirante' }}</span></div>
          <div class="hidden sm:block">Status: <span class="text-vamp-c2 font-bold ml-1">Noite Ativa</span></div>
          <button @click="router.push('/personagem/ficha?id=' + characterId)" class="border border-gold-dim px-4 py-1.5 text-gold hover:bg-gold/10 transition-colors rounded-sm shadow-[0_0_10px_rgba(201,168,76,0.1)]">
            Ficha Completa
          </button>
        </div>
      </div>
    </header>

    <div v-if="loading" class="flex items-center justify-center min-h-[80vh] relative z-10">
      <div class="animate-spin w-12 h-12 border-2 border-vamp-border border-t-vamp-c2 rounded-full shadow-[0_0_15px_rgba(192,57,43,0.5)]"></div>
    </div>

    <!-- MAIN DASHBOARD -->
    <main v-else-if="character" class="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-12 grid grid-cols-1 xl:grid-cols-12 gap-6 relative z-10">
      
      <!-- ESQUERDA: Identidade Operativa -->
      <section class="xl:col-span-3 flex flex-col gap-6">
        <div class="demiplane-box rounded-lg overflow-hidden">
          <div class="bg-black/80 border-b border-vamp-border p-3 flex justify-between items-center text-[10px] uppercase tracking-widest text-parchment-dim font-serif">
            <span>Identidade</span>
            <span class="text-vamp-c2">#{{ character.id.substring(0,6).toUpperCase() }}</span>
          </div>

          <div class="p-5 space-y-6">
            <!-- AVATAR (PREMIUM) -->
            <div class="relative w-full aspect-[3/4] border border-vamp-border rounded-md overflow-hidden bg-bg-deep group shadow-[0_0_20px_rgba(0,0,0,0.8)]">
              <img 
                :src="character.avatarUrl ? (character.avatarUrl.startsWith('http') || character.avatarUrl.startsWith('data:')) ? character.avatarUrl : API_BASE_URL + character.avatarUrl : 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'600\'%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'%231a0b12\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' fill=\'%23c9a84c\' font-family=\'serif\' font-size=\'48\' dominant-baseline=\'middle\' text-anchor=\'middle\'%3E%E2%98%A5%3C/text%3E%3C/svg%3E'" 
                @error="handleImageError"
                class="w-full h-full object-cover object-top saturate-[0.8] group-hover:saturate-100 transition-all duration-700" 
              />
              <div class="absolute inset-0 bg-gradient-to-t from-bg-deep via-bg-deep/40 to-transparent opacity-90"></div>
              <div class="absolute bottom-0 left-0 right-0 p-4">
                <div class="text-xl font-serif font-bold text-parchment tracking-wider uppercase drop-shadow-lg">{{ character.name }}</div>
                <div class="text-xs text-gold uppercase font-serif tracking-widest mt-1">
                  {{ character.DefinitionClan?.name || 'Clã Desconhecido' }}
                </div>
              </div>
            </div>

            <!-- BARRAS DE STATUS (PREMIUM) -->
            <div class="space-y-5">
              <div>
                <div class="flex justify-between text-[10px] uppercase tracking-widest mb-1.5 font-serif text-parchment-dim">
                  <span>Fome (Hunger)</span>
                  <span class="text-vamp-c2 font-bold">{{ character.hunger }} / 5</span>
                </div>
                <div class="flex gap-1">
                  <div v-for="i in 5" :key="i" class="h-2 flex-1 rounded-sm border border-vamp-border bg-black/50" :class="i <= character.hunger ? 'bg-vamp-c2 border-vamp-c2 shadow-[0_0_8px_rgba(192,57,43,0.6)]' : ''"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-[10px] uppercase tracking-widest mb-1.5 font-serif text-parchment-dim">
                  <span>Força de Vontade</span>
                  <span class="text-blue-500/80 font-bold">{{ character.willpowerMax - character.willpowerDamageSuperficial - character.willpowerDamageAggravated }} / {{ character.willpowerMax }}</span>
                </div>
                <div class="flex gap-1">
                  <div v-for="i in character.willpowerMax" :key="i" class="h-2 flex-1 rounded-sm border border-blue-900/50 bg-black/50" :class="i <= (character.willpowerMax - character.willpowerDamageSuperficial - character.willpowerDamageAggravated) ? 'bg-blue-600/70 border-blue-500/50 shadow-[0_0_8px_rgba(37,99,235,0.4)]' : ''"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-[10px] uppercase tracking-widest mb-1.5 font-serif text-parchment-dim">
                  <span>Humanidade</span>
                  <span class="text-parchment font-bold">{{ character.humanity }} / 10</span>
                </div>
                <div class="flex gap-1">
                  <div v-for="i in 10" :key="i" class="h-2 flex-1 rounded-sm border border-white/10 bg-black/50" :class="i <= character.humanity ? 'bg-parchment-dim border-parchment/50' : ''"></div>
                </div>
              </div>

              <!-- CARTEIRA / SALDO DE RECURSOS -->
              <div class="bg-black/50 border border-white/10 p-3 rounded-lg flex items-center justify-between">
                <span class="text-[10px] uppercase font-serif tracking-widest text-parchment-dim flex items-center gap-1.5">
                  <span>💵</span> Carteira / Dinheiro
                </span>
                <span class="text-xs font-mono font-bold text-green-400">
                  R$ {{ Number(character.money || 0).toLocaleString('pt-BR') }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CENTRO: Terminal de Operações e Feed -->
      <section class="xl:col-span-6 flex flex-col gap-6">
        <div class="demiplane-box rounded-lg overflow-hidden flex flex-col flex-1">
          <div class="bg-black/80 border-b border-vamp-border p-3 flex justify-between items-center text-[10px] uppercase tracking-widest text-parchment-dim font-serif">
            <span>Terminal de Operações e Vigilância</span>
            <span class="text-gold">REDE GLOBAL</span>
          </div>

          <!-- Feed -->
          <div class="p-5 flex-1 space-y-4 overflow-y-auto">
            
            <div class="bg-black/40 border border-vamp-border/50 border-l-2 border-l-vamp-c2 p-4 rounded-sm shadow-md">
              <div class="text-[9px] text-parchment-dim/60 mb-2 tracking-widest uppercase font-serif">SISTEMA V.5.2 • AGORA</div>
              <div class="text-xs text-parchment leading-relaxed"><strong class="text-vamp-c2">Acesso Concedido:</strong> Conexão estabelecida com a rede Nocturna. O sangue está em temperatura ideal para a noite de caça.</div>
            </div>
            
            <div v-if="activeMission" class="bg-black/40 border border-gold-dim/30 border-l-2 border-l-gold p-4 rounded-sm shadow-md">
              <div class="text-[9px] text-parchment-dim/60 mb-2 tracking-widest uppercase font-serif">OPERAÇÃO EM ANDAMENTO</div>
              <div class="text-xs text-parchment leading-relaxed"><strong class="text-gold">Despacho Ativo:</strong> {{ activeMission.DefinitionMissionIdle?.title }}</div>
              <div class="text-[11px] text-parchment-dim mt-2 italic">{{ activeMission.DefinitionMissionIdle?.description }}</div>
              <div class="mt-4 flex items-center justify-between border-t border-vamp-border/30 pt-3">
                 <span class="text-xs text-gold font-mono tracking-widest bg-black/50 px-2 py-1 rounded">TEMPO: {{ formatTimeRemaining(activeMission.expiresAt) }}</span>
                 <button v-if="isMissionExpired(activeMission.expiresAt)" @click="resolveActiveMission()" class="text-[10px] font-bold border border-gold text-gold px-4 py-1.5 hover:bg-gold hover:text-black transition-colors rounded-sm uppercase tracking-widest shadow-[0_0_10px_rgba(201,168,76,0.3)]">Resolver</button>
              </div>
            </div>

            <div class="bg-black/40 border border-vamp-border/50 border-l-2 border-l-gold-dim p-4 rounded-sm shadow-md opacity-80 hover:opacity-100 transition-opacity">
              <div class="text-[9px] text-parchment-dim/60 mb-2 tracking-widest uppercase font-serif">HÁ 34 MINUTOS • PÁTIO DOS SUSPIROS</div>
              <div class="text-xs text-parchment leading-relaxed"><strong class="text-gold-dim">Boato:</strong> Relatos de confronto armado entre forças civis armadas e uma entidade não catalogada nas linhas férreas. Ameaça de área elevada para Nível 3.</div>
            </div>

          </div>

          <!-- CARD DE OPERAÇÃO ATIVA / MISSÃO EM ANDAMENTO -->
          <div v-if="activeMission" class="p-4 mx-5 my-3 rounded-lg border border-vamp-c2 bg-black/80 shadow-[0_0_20px_rgba(192,57,43,0.3)] space-y-3 animate-fade-in">
            <div class="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-vamp-c2">
              <span class="flex items-center gap-1.5 font-bold">
                <span class="w-2 h-2 rounded-full bg-vamp-c2 animate-ping"></span>
                Operação em Andamento
              </span>
              <span>Etapa {{ activeMission.currentStage || 1 }}/{{ activeMission.totalStages || 1 }}</span>
            </div>

            <div>
              <h4 class="font-serif text-sm font-bold text-parchment">{{ activeMission.currentReport?.title || activeMission.DefinitionMissionIdle?.title || 'Caçada Urbana' }}</h4>
              <p class="text-[11px] text-gray-400 font-light mt-0.5">Vampiro despachado em território de Nocturna.</p>
            </div>

            <div class="space-y-1">
              <div class="flex justify-between text-[10px] font-mono text-gray-400">
                <span>Progresso</span>
                <span class="text-gold font-bold">{{ isMissionExpired(activeMission.expiresAt) ? 'Concluído' : formatTimeRemaining(activeMission.expiresAt) }}</span>
              </div>
              <div class="w-full bg-zinc-900 h-2 rounded overflow-hidden border border-white/10">
                <div 
                  class="bg-vamp-c2 h-full transition-all duration-1000 shadow-[0_0_8px_rgba(192,57,43,0.8)]"
                  :style="{ width: isMissionExpired(activeMission.expiresAt) ? '100%' : `${((activeMission.currentStage || 1) / (activeMission.totalStages || 1)) * 100}%` }"
                ></div>
              </div>
            </div>

            <div class="pt-1 flex gap-2">
              <button 
                v-if="isMissionExpired(activeMission.expiresAt) || activeMission.readyToResolve"
                @click="resolveActiveMission"
                class="flex-1 py-2 rounded bg-gold hover:bg-gold-light text-black text-xs font-serif font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(212,175,55,0.4)] animate-bounce"
              >
                🏆 Coletar Recompensas & Sangue
              </button>
              <button 
                v-else
                @click="router.push('/personagem/aventuras?id=' + characterId)"
                class="flex-1 py-2 rounded border border-white/20 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-serif uppercase tracking-wider transition-all"
              >
                Inspecionar Relatório Tático
              </button>
            </div>
          </div>

          <!-- Botões de Ação -->
          <div class="p-5 border-t border-vamp-border bg-black/60 mt-auto rounded-b-lg">
            <div class="text-[10px] uppercase tracking-widest text-parchment-dim mb-4 font-serif text-center">Ações Operacionais</div>
            <div class="grid grid-cols-2 gap-4">
              
              <button @click="router.push('/personagem/radar?id=' + characterId)" class="bg-bg-card border border-vamp-border p-4 text-center rounded-md hover:bg-bg-mid hover:border-blue-900/80 hover:shadow-[0_0_20px_rgba(30,58,138,0.2)] transition-all duration-300 group flex flex-col items-center justify-center min-h-[100px]">
                <div class="text-xl mb-2 text-blue-700/80 group-hover:scale-110 transition-transform">📡</div>
                <div class="text-xs font-serif font-bold text-parchment group-hover:text-white tracking-widest uppercase mb-1">Varredura Tática</div>
                <div class="text-[9px] text-parchment-dim/60 uppercase">Mapa da Cidade</div>
              </button>
              <button @click="router.push('/personagem/inventario?id=' + characterId)" class="bg-bg-card border border-vamp-border p-4 text-center rounded-md hover:bg-bg-mid hover:border-gold-dim hover:shadow-[0_0_20px_rgba(201,168,76,0.15)] transition-all duration-300 group flex flex-col items-center justify-center min-h-[100px]">
                <div class="text-xl mb-2 text-gold-dim group-hover:scale-110 transition-transform">💼</div>
                <div class="text-xs font-serif font-bold text-parchment group-hover:text-white tracking-widest uppercase mb-1">Contatar Lacaios</div>
                <div class="text-[9px] text-parchment-dim/60 uppercase">Finanças e Itens</div>
              </button>
              <button @click="router.push('/personagem/noticias?id=' + characterId)" class="bg-bg-card border border-vamp-border p-4 text-center rounded-md hover:bg-bg-mid hover:border-gray-700 hover:shadow-[0_0_20px_rgba(156,163,175,0.1)] transition-all duration-300 group flex flex-col items-center justify-center min-h-[100px]">
                <div class="text-xl mb-2 text-gray-500 group-hover:scale-110 transition-transform">🗞️</div>
                <div class="text-xs font-serif font-bold text-parchment group-hover:text-white tracking-widest uppercase mb-1">Acessar Gazeta</div>
                <div class="text-[9px] text-parchment-dim/60 uppercase">Informações da Noite</div>
              </button>
              <button @click="router.push('/personagem/aventuras?id=' + characterId)" class="bg-bg-card border border-vamp-border p-4 text-center rounded-md hover:bg-vamp-bg hover:border-vamp-c2 hover:shadow-[0_0_20px_rgba(192,57,43,0.2)] transition-all duration-300 group flex flex-col items-center justify-center min-h-[100px]">
                <div class="text-xl mb-2 text-vamp-c2 group-hover:scale-110 transition-transform">🩸</div>
                <div class="text-xs font-serif font-bold text-parchment group-hover:text-white tracking-widest uppercase mb-1">Incursões e Caçadas</div>
                <div class="text-[9px] text-parchment-dim/60 uppercase">Missões de Campo e Alimentação</div>
              </button>
              <button @click="router.push('/personagem/cronicas?id=' + characterId)" class="bg-bg-card border border-vamp-border p-4 text-center rounded-md hover:bg-black hover:border-gold hover:shadow-[0_0_20px_rgba(201,168,76,0.2)] transition-all duration-300 group flex flex-col items-center justify-center min-h-[100px] col-span-2">
                <div class="text-xl mb-2 text-gold group-hover:scale-110 transition-transform">📖</div>
                <div class="text-xs font-serif font-bold text-parchment group-hover:text-white tracking-widest uppercase mb-1">Crônicas Narrativas</div>
                <div class="text-[9px] text-parchment-dim/60 uppercase">Livro-Jogo Interativo (Solo)</div>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- DIREITA: Ameaça e Território -->
      <section class="xl:col-span-3 flex flex-col gap-6">
        <div class="demiplane-box rounded-lg overflow-hidden">
          <div class="bg-black/80 border-b border-vamp-border p-3 flex justify-between items-center text-[10px] uppercase tracking-widest text-parchment-dim font-serif">
            <span>Vigilância Local</span>
            <span class="text-vamp-c2 font-bold animate-pulse">ALERTA</span>
          </div>

          <div class="p-5 space-y-6">
            <div class="bg-black/40 border border-vamp-border p-4 rounded-md text-center shadow-inner">
              <div class="text-[9px] text-parchment-dim uppercase tracking-widest mb-1.5 font-serif">Setor Atual</div>
              <div class="text-lg font-bold text-parchment font-serif tracking-wider">{{ character.chronicle || 'Alto do Mirante' }}</div>
              <div class="text-[10px] text-vamp-c2 uppercase mt-2 tracking-widest">Domínio da Camarilla</div>
            </div>

            <div>
              <div class="flex justify-between text-[10px] uppercase tracking-widest mb-2 font-serif text-parchment-dim">
                <span>Inquisição</span>
                <span class="text-vamp-c2 font-bold">NÍVEL 4/5</span>
              </div>
              <div class="h-2 bg-black/50 border border-vamp-border rounded-sm overflow-hidden mb-3">
                <div class="h-full bg-vamp-c2 w-4/5 shadow-[0_0_8px_rgba(192,57,43,0.8)]"></div>
              </div>
              <p class="text-[11px] text-parchment-dim/80 leading-relaxed italic border-l-2 border-vamp-border pl-3">
                Drones com leitura térmica operando nos helipontos. Qualquer quebra de Máscara acionará equipes de resposta em 3 turnos.
              </p>
            </div>

            <div class="pt-5 border-t border-vamp-border">
              <div class="text-[10px] uppercase tracking-widest text-parchment-dim mb-3 font-serif">Bolsa de Recursos</div>
              <ul class="text-[11px] space-y-3 text-parchment-dim">
                <li class="flex justify-between items-center border-b border-white/5 pb-1">
                  <span>Financeiro</span>
                  <strong class="text-gold font-serif">Nível {{ character.CharacterVampireBackgrounds?.find((b: any) => b.DefinitionBackground?.name === 'Recursos')?.value || 0 }}</strong>
                </li>
                <li class="flex justify-between items-center border-b border-white/5 pb-1">
                  <span>Status (Cidade)</span>
                  <strong class="text-gold font-serif">Nível {{ character.CharacterVampireBackgrounds?.find((b: any) => b.DefinitionBackground?.name === 'Status')?.value || 0 }}</strong>
                </li>
                <li class="flex justify-between items-center border-b border-white/5 pb-1">
                  <span>Refúgio</span>
                  <strong class="text-gold font-serif">Nível {{ character.CharacterVampireBackgrounds?.find((b: any) => b.DefinitionBackground?.name === 'Refúgio')?.value || 0 }}</strong>
                </li>
              </ul>
            </div>
            
            <div class="pt-3">
              <div class="text-[10px] uppercase tracking-widest text-parchment-dim mb-3 font-serif">Disciplinas</div>
              <div class="text-[11px] space-y-1 text-parchment-dim/80 leading-relaxed max-h-[100px] overflow-y-auto">
                <div v-for="disc in character.CharacterVampireDisciplines" :key="disc.id" class="flex justify-between">
                  <span class="text-parchment font-serif">{{ disc.DefinitionDiscipline?.name }}</span> 
                  <span class="text-vamp-c2">Nível {{ disc.value }}</span>
                </div>
                <div v-if="!character.CharacterVampireDisciplines?.length" class="italic text-gray-600">
                  Nenhuma disciplina despertada.
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </main>
    
    <!-- BARRA INFERIOR / DOCK DO CICLO NOTURNO -->
    <NightClockWidget 
      v-if="characterId" 
      :characterId="characterId" 
      ref="nightClockRef" 
      @status-updated="onNightStatusUpdated" 
    />

  </div>
</template>
\n<script setup lang="ts">
const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  if (target) target.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'600\'%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'%231a0b12\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' fill=\'%23c9a84c\' font-family=\'serif\' font-size=\'48\' dominant-baseline=\'middle\' text-anchor=\'middle\'%3E%E2%98%A5%3C/text%3E%3C/svg%3E';
}

import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api, { API_BASE_URL } from '../services/api'
import NightClockWidget from '../components/NightClockWidget.vue'

const router = useRouter()
const route = useRoute()

const loading = ref(true)
const character = ref<any>(null)
const characterId = ref<string>('')
const nightClockRef = ref<any>(null)
const currentNightStatus = ref<any>(null)

const onNightStatusUpdated = (status: any) => {
  currentNightStatus.value = status
}

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
    await nightClockRef.value?.fetchStatus();
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
    await fetchActiveMission()
  } catch (error) {
    console.error('Erro ao buscar personagem:', error)
  } finally {
    loading.value = false
  }
}

const fetchActiveMission = async () => {
  if (!characterId.value) return
  try {
    const res = await api.get(`/api/missions-idle/active/${characterId.value}`)
    activeMission.value = res.data
  } catch (e) {
    console.error('Erro ao buscar missão ativa:', e)
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
  if (!activeMission.value) return
  try {
    const res = await api.post('/api/missions-idle/resolve', {
      activeMissionId: activeMission.value.id
    })
    const report = res.data.report
    alert(`🎉 Operação Finalizada!\nResultado: ${report.isSuccess ? 'SUCESSO' : 'FALHA'}\n${report.finalChanges?.join('\n') || ''}`)
    activeMission.value = null
    await fetchCharacter()
    await nightClockRef.value?.fetchStatus()
  } catch (e: any) {
    console.error(e)
    alert(e.response?.data?.error || 'Erro ao resolver missão')
  }
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
