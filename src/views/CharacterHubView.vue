
<template>
  <div class="min-h-screen demiplane-bg text-parchment font-sans relative overflow-x-hidden selection:bg-blood-red selection:text-white pb-24">

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
        
        <div class="flex items-center gap-6 text-xs font-sans tracking-wider uppercase text-parchment-dim">
          <div class="flex items-center gap-2">
            <span class="text-stone-400 font-serif">📍 Posição Atual:</span>
            <span class="text-gold font-bold font-serif">{{ currentLocationName }}</span>
          </div>
        </div>
      </div>
    </header>

    <div v-if="loading" class="flex items-center justify-center min-h-[80vh] relative z-10">
      <div class="animate-spin w-12 h-12 border-2 border-vamp-border border-t-vamp-c2 rounded-full shadow-[0_0_15px_rgba(192,57,43,0.5)]"></div>
    </div>

    <!-- MAIN DASHBOARD (3 COLUNAS) -->
    <main v-else-if="character" class="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-12 grid grid-cols-1 xl:grid-cols-12 gap-6 relative z-10">
      
      <!-- ========================================================================= -->
      <!-- ESQUERDA: Identidade & Vitalidade do Personagem (3 col) -->
      <!-- ========================================================================= -->
      <section class="xl:col-span-3 flex flex-col gap-6">
        <div class="demiplane-box rounded-2xl overflow-hidden bg-black/70 border border-white/10 shadow-xl">
          <div class="bg-black/80 border-b border-vamp-border p-3.5 flex justify-between items-center text-[10px] uppercase tracking-widest text-parchment-dim font-serif">
            <span>Identidade Operativa</span>
            <span class="text-vamp-c2">#{{ character.id.substring(0,6).toUpperCase() }}</span>
          </div>

          <div class="p-5 space-y-6">
            <!-- AVATAR (PREMIUM) -->
            <div class="relative w-full aspect-[3/4] border border-vamp-border rounded-xl overflow-hidden bg-bg-deep group shadow-[0_0_20px_rgba(0,0,0,0.8)]">
              <img 
                :src="character.avatarUrl ? (character.avatarUrl.startsWith('http') || character.avatarUrl.startsWith('data:')) ? character.avatarUrl : API_BASE_URL + character.avatarUrl : 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'600\'%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'%231a0b12\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' fill=\'%23c9a84c\' font-family=\'serif\' font-size=\'48\' dominant-baseline=\'middle\' text-anchor=\'middle\'%3E%E2%98%A5%3C/text%3E%3C/svg%3E'" 
                @error="handleImageError"
                class="w-full h-full object-cover object-top saturate-[0.85] group-hover:saturate-100 transition-all duration-700" 
              />
              <div class="absolute inset-0 bg-gradient-to-t from-bg-deep via-bg-deep/40 to-transparent opacity-90"></div>
              <div class="absolute bottom-0 left-0 right-0 p-4">
                <div class="text-xl font-serif font-bold text-parchment tracking-wider uppercase drop-shadow-lg">{{ character.name }}</div>
                <div class="text-xs text-gold uppercase font-serif tracking-widest mt-0.5">
                  {{ character.DefinitionClan?.name || 'Clã Desconhecido' }}
                </div>
                <div v-if="character.concept" class="text-[10px] text-stone-400 font-sans italic mt-1 truncate">
                  {{ character.concept }}
                </div>
              </div>
            </div>

            <!-- BARRAS DE STATUS VITAIS -->
            <div class="space-y-4">
              <!-- FOME -->
              <div>
                <div class="flex justify-between text-[10px] uppercase tracking-widest mb-1.5 font-serif text-parchment-dim">
                  <span class="flex items-center gap-1"><span>🩸</span> Fome (Hunger)</span>
                  <span class="text-vamp-c2 font-bold">{{ character.hunger }} / 5</span>
                </div>
                <div class="flex gap-1">
                  <div v-for="i in 5" :key="i" class="h-2 flex-1 rounded-sm border border-vamp-border bg-black/50" :class="i <= character.hunger ? 'bg-vamp-c2 border-vamp-c2 shadow-[0_0_8px_rgba(192,57,43,0.6)]' : ''"></div>
                </div>
              </div>

              <!-- FORÇA DE VONTADE -->
              <div>
                <div class="flex justify-between text-[10px] uppercase tracking-widest mb-1.5 font-serif text-parchment-dim">
                  <span class="flex items-center gap-1"><span>🔵</span> Força de Vontade</span>
                  <span class="text-blue-400 font-bold">{{ character.willpowerMax - character.willpowerDamageSuperficial - character.willpowerDamageAggravated }} / {{ character.willpowerMax }}</span>
                </div>
                <div class="flex gap-1">
                  <div v-for="i in character.willpowerMax" :key="i" class="h-2 flex-1 rounded-sm border border-blue-900/50 bg-black/50" :class="i <= (character.willpowerMax - character.willpowerDamageSuperficial - character.willpowerDamageAggravated) ? 'bg-blue-600/80 border-blue-500 shadow-[0_0_8px_rgba(37,99,235,0.4)]' : ''"></div>
                </div>
              </div>

              <!-- HUMANIDADE -->
              <div>
                <div class="flex justify-between text-[10px] uppercase tracking-widest mb-1.5 font-serif text-parchment-dim">
                  <span class="flex items-center gap-1"><span>⚪</span> Humanidade</span>
                  <span class="text-gold font-bold">{{ character.humanity }} / 10</span>
                </div>
                <div class="flex gap-1">
                  <div v-for="i in 10" :key="i" class="h-2 flex-1 rounded-sm border border-white/10 bg-black/50" :class="i <= character.humanity ? 'bg-gold-dim border-gold/40' : ''"></div>
                </div>
              </div>

              <!-- RELÓGIO NOTURNO / CICLO NOTURNO INLINE (CIRCULAR) -->
              <div class="pt-2">
                <NightClockWidget 
                  v-if="characterId" 
                  :characterId="characterId" 
                  :isHub="true"
                  :inline="true"
                  ref="nightClockRef" 
                  @status-updated="onNightStatusUpdated" 
                />
              </div>

            </div>
          </div>
        </div>
      </section>

      <!-- ========================================================================= -->
      <!-- CENTRO: Terminal de Operações & Feed de Vigilância (6 col) -->
      <!-- ========================================================================= -->
      <section class="xl:col-span-6 flex flex-col gap-6">
        <div class="demiplane-box rounded-2xl overflow-hidden flex flex-col flex-1 bg-black/70 border border-white/10 shadow-xl">
          
          <div class="bg-black/80 border-b border-vamp-border p-3.5 flex justify-between items-center text-[10px] uppercase tracking-widest text-parchment-dim font-serif">
            <span class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              Diário Operacional & Terminal de Bordo
            </span>
            <span class="text-gold font-mono">REDE NOCTURNA</span>
          </div>

          <div class="p-5 flex-1 space-y-6 overflow-y-auto">
            
            <!-- CARD DE OPERAÇÃO ATIVA EM CAMPO (SE HOUVER) -->
            <div v-if="activeMission" class="bg-black/80 border-2 border-red-600/70 border-l-4 border-l-vamp-c2 p-5 rounded-xl shadow-[0_0_25px_rgba(220,38,38,0.25)] space-y-2 animate-fade-in">
              <div class="flex justify-between items-center text-xs font-mono uppercase tracking-widest text-red-400">
                <span class="flex items-center gap-2 font-bold">
                  <span class="w-2.5 h-2.5 rounded-full bg-vamp-c2 animate-ping"></span>
                  Operação Ativa em Campo
                </span>
                <span class="text-gold font-bold px-2 py-0.5 rounded bg-black/60 border border-gold/40">
                  {{ activeMission.readyToResolve ? 'Pronto para Coleta' : 'Em Andamento' }}
                </span>
              </div>
              
              <div>
                <h4 class="font-serif text-base font-bold text-parchment">{{ activeMission.currentReport?.title || activeMission.DefinitionMissionIdle?.title || 'Operação de Campo' }}</h4>
                <p class="text-xs text-stone-400 font-light mt-1">{{ activeMission.DefinitionMissionIdle?.description }}</p>
              </div>
            </div>

            <!-- VIGILÂNCIA URBANA, RUÍDOS & NOTÍCIAS (MUNDO VIVO) -->
            <div class="space-y-3">
              <div class="flex justify-between items-center pb-2 border-b border-white/5">
                <span class="text-[11px] font-serif uppercase tracking-[2px] text-parchment-dim font-bold flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-vamp-c2 animate-pulse"></span>
                  Ruídos & Vigilância Urbana
                </span>
                <span class="text-[10px] font-mono text-stone-500">Transmissão Direta</span>
              </div>

              <!-- RUÍDO 1: STATUS DO SISTEMA -->
              <div class="bg-black/50 border border-vamp-border/60 border-l-2 border-l-vamp-c2 p-4 rounded-xl shadow-md space-y-1">
                <div class="text-[9px] text-stone-400 tracking-widest uppercase font-serif">SISTEMA V.5.2 • CONEXÃO SEGURA</div>
                <div class="text-xs text-parchment leading-relaxed">
                  <strong class="text-vamp-c2">Acesso Concedido:</strong> Conexão estabelecida com a rede Nocturna. O sangue está em temperatura ideal para a noite de caça.
                </div>
              </div>

              <!-- RUÍDO 2: BOATO URBANO / GM -->
              <div class="bg-black/50 border border-vamp-border/60 border-l-2 border-l-gold-dim p-4 rounded-xl shadow-md space-y-1">
                <div class="text-[9px] text-stone-400 tracking-widest uppercase font-serif">HÁ 34 MINUTOS • PÁTIO DOS SUSPIROS</div>
                <div class="text-xs text-parchment leading-relaxed">
                  <strong class="text-gold-dim">Boato:</strong> Relatos de confronto armado entre forças civis e uma entidade não catalogada nas linhas férreas. Ameaça de área elevada para Nível 3.
                </div>
              </div>
            </div>

            <!-- REGISTRO OPERACIONAL RECENTE (HISTÓRICO REAL) -->
            <div class="space-y-3">
              <div class="flex justify-between items-center pb-2 border-b border-white/5">
                <span class="text-[11px] font-serif uppercase tracking-[2px] text-gold-dim">
                  Últimas Atividades Concluídas
                </span>
                <span class="text-[10px] font-mono text-stone-500">Histórico de Campo</span>
              </div>

              <!-- LISTA DE ATIVIDADES REAIS -->
              <div v-if="recentActivities.length" class="space-y-3">
                <div 
                  v-for="act in recentActivities" 
                  :key="act.id"
                  @click="openActivityReport(act)"
                  class="bg-black/50 border border-white/10 hover:border-gold/50 rounded-xl p-4 transition-all duration-300 space-y-2 cursor-pointer group hover:bg-black/70 hover:shadow-[0_0_15px_rgba(212,175,55,0.15)]"
                >
                  <div class="flex justify-between items-start">
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="text-xs group-hover:scale-110 transition-transform">{{ act.activityType === 'IDLE_MISSION' ? '⚔️' : '📖' }}</span>
                        <h5 class="font-serif text-xs font-bold text-parchment group-hover:text-gold transition-colors">
                          {{ act.mission?.title || act.resultData?.title || 'Operação Tática' }}
                        </h5>
                      </div>
                      <div class="text-[10px] font-mono text-stone-400 mt-0.5 flex items-center gap-2">
                        <span>{{ formatActivityDate(act.createdAt) }}</span>
                        <span v-if="act.mission?.Location?.name" class="text-stone-500">• 📍 {{ act.mission.Location.name }}</span>
                      </div>
                    </div>

                    <div class="flex items-center gap-2">
                      <span 
                        class="text-[9px] font-mono uppercase px-2 py-0.5 rounded border font-bold"
                        :class="act.resultData?.success !== false ? 'bg-green-950/60 border-green-700/50 text-green-400' : 'bg-red-950/60 border-red-700/50 text-red-400'"
                      >
                        {{ act.resultData?.success !== false ? '✔ Concluída' : '☠ Abortada' }}
                      </span>
                      <span class="text-[10px] text-stone-500 group-hover:text-gold transition-colors font-mono">🔍 Ver</span>
                    </div>
                  </div>

                  <!-- RECOMPENSAS GANHAS -->
                  <div class="flex flex-wrap items-center gap-2 text-[11px] font-mono pt-1">
                    <span v-if="act.resultData?.rewards?.exp || act.mission?.rewardExp" class="bg-amber-950/40 text-gold px-2 py-0.5 rounded border border-amber-800/40">
                      +{{ act.resultData?.rewards?.exp || act.mission?.rewardExp }} XP
                    </span>
                    <span v-if="act.resultData?.rewards?.money || act.mission?.rewardMoney" class="bg-green-950/40 text-green-400 px-2 py-0.5 rounded border border-green-800/40">
                      +R$ {{ (act.resultData?.rewards?.money || act.mission?.rewardMoney).toLocaleString('pt-BR') }}
                    </span>
                    <span v-if="act.resultData?.rewards?.hunger" class="bg-red-950/40 text-red-300 px-2 py-0.5 rounded border border-red-800/40">
                      Fome {{ act.resultData.rewards.hunger > 0 ? '+' : '' }}{{ act.resultData.rewards.hunger }}
                    </span>
                    <span v-if="act.resultData?.rewards?.equipmentDropName" class="bg-purple-950/40 text-purple-300 px-2 py-0.5 rounded border border-purple-800/40">
                      🎁 {{ act.resultData.rewards.equipmentDropName }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- CASO NÃO TENHA ATIVIDADES RECENTES (SEM BOTÃO!) -->
              <div v-else class="p-8 text-center text-xs text-stone-500 font-serif italic border border-white/5 rounded-xl bg-black/40">
                <div class="text-2xl mb-2">📡</div>
                <p>Nenhuma operação recente registrada no terminal.</p>
              </div>

            </div>

          </div>
        </div>
      </section>

      <!-- ========================================================================= -->
      <!-- DIREITA: Ações Táticas & Navegação (3 col) -->
      <!-- ========================================================================= -->
      <section class="xl:col-span-3 flex flex-col gap-6">
        <div class="demiplane-box rounded-2xl overflow-hidden bg-black/70 border border-white/10 shadow-xl p-5 space-y-4">
          
          <div class="text-[11px] font-serif uppercase tracking-[2px] text-parchment-dim pb-3 border-b border-white/10 flex items-center justify-between">
            <span>Ações Operacionais</span>
            <span class="text-gold">ACESSO</span>
          </div>

          <!-- GRADE DE 6 ATALHOS TÁTICOS -->
          <div class="grid grid-cols-1 gap-3">
            
            <!-- 1. RADAR -->
            <button 
              @click="router.push('/personagem/radar?id=' + characterId)" 
              class="w-full bg-black/60 hover:bg-cyan-950/40 border border-white/10 hover:border-cyan-500/60 p-3.5 rounded-xl transition-all duration-300 flex items-center gap-3.5 group text-left shadow-sm hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]"
            >
              <div class="w-10 h-10 rounded-lg bg-black/80 border border-white/10 flex items-center justify-center text-xl text-cyan-400 group-hover:scale-110 transition-transform shrink-0">
                📡
              </div>
              <div class="min-w-0">
                <div class="font-serif text-xs font-bold text-parchment group-hover:text-white uppercase tracking-wider">Varredura Tática</div>
                <div class="text-[10px] text-stone-400 truncate">Radar Urbano dos 48 Distritos</div>
              </div>
            </button>

            <!-- 2. MEU REFÚGIO -->
            <button 
              @click="router.push('/personagem/refugio?id=' + characterId)" 
              class="w-full bg-black/60 hover:bg-amber-950/40 border border-white/10 hover:border-gold/60 p-3.5 rounded-xl transition-all duration-300 flex items-center gap-3.5 group text-left shadow-sm hover:shadow-[0_0_15px_rgba(212,175,55,0.2)]"
            >
              <div class="w-10 h-10 rounded-lg bg-black/80 border border-white/10 flex items-center justify-center text-xl text-gold group-hover:scale-110 transition-transform shrink-0">
                🏠
              </div>
              <div class="min-w-0">
                <div class="font-serif text-xs font-bold text-parchment group-hover:text-white uppercase tracking-wider">Meu Refúgio</div>
                <div class="text-[10px] text-stone-400 truncate">Segurança, Lacaios & Sangue</div>
              </div>
            </button>

            <!-- 3. MERCADO NEGRO -->
            <button 
              @click="router.push('/personagem/inventario?id=' + characterId)" 
              class="w-full bg-black/60 hover:bg-amber-950/40 border border-white/10 hover:border-gold/60 p-3.5 rounded-xl transition-all duration-300 flex items-center gap-3.5 group text-left shadow-sm hover:shadow-[0_0_15px_rgba(212,175,55,0.2)]"
            >
              <div class="w-10 h-10 rounded-lg bg-black/80 border border-white/10 flex items-center justify-center text-xl text-gold-dim group-hover:scale-110 transition-transform shrink-0">
                💼
              </div>
              <div class="min-w-0">
                <div class="font-serif text-xs font-bold text-parchment group-hover:text-white uppercase tracking-wider">Mercado Negro</div>
                <div class="text-[10px] text-stone-400 truncate">Arsenal & Especialistas</div>
              </div>
            </button>

            <!-- 4. CRÔNICAS NARRATIVAS -->
            <button 
              @click="router.push('/personagem/cronicas?id=' + characterId)" 
              class="w-full bg-black/60 hover:bg-purple-950/40 border border-white/10 hover:border-purple-500/60 p-3.5 rounded-xl transition-all duration-300 flex items-center gap-3.5 group text-left shadow-sm hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]"
            >
              <div class="w-10 h-10 rounded-lg bg-black/80 border border-white/10 flex items-center justify-center text-xl text-purple-400 group-hover:scale-110 transition-transform shrink-0">
                📖
              </div>
              <div class="min-w-0">
                <div class="font-serif text-xs font-bold text-parchment group-hover:text-white uppercase tracking-wider">Crônicas Narrativas</div>
                <div class="text-[10px] text-stone-400 truncate">Livro-Jogo Interativo (Solo)</div>
              </div>
            </button>

            <!-- 5. GAZETA DA NOITE -->
            <button 
              @click="router.push('/personagem/noticias?id=' + characterId)" 
              class="w-full bg-black/60 hover:bg-stone-900 border border-white/10 hover:border-white/30 p-3.5 rounded-xl transition-all duration-300 flex items-center gap-3.5 group text-left shadow-sm hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            >
              <div class="w-10 h-10 rounded-lg bg-black/80 border border-white/10 flex items-center justify-center text-xl text-stone-300 group-hover:scale-110 transition-transform shrink-0">
                🗞️
              </div>
              <div class="min-w-0">
                <div class="font-serif text-xs font-bold text-parchment group-hover:text-white uppercase tracking-wider">Gazeta da Noite</div>
                <div class="text-[10px] text-stone-400 truncate">Informações & Desdobramentos</div>
              </div>
            </button>

            <!-- 6. FICHA COMPLETA -->
            <button 
              @click="router.push('/personagem/ficha?id=' + characterId)" 
              class="w-full bg-blood-red/10 hover:bg-blood-red/30 border border-blood-red/40 hover:border-blood-red p-3.5 rounded-xl transition-all duration-300 flex items-center gap-3.5 group text-left shadow-sm hover:shadow-[0_0_15px_rgba(185,28,28,0.3)]"
            >
              <div class="w-10 h-10 rounded-lg bg-black/80 border border-blood-red/50 flex items-center justify-center text-xl text-red-400 group-hover:scale-110 transition-transform shrink-0">
                📜
              </div>
              <div class="min-w-0">
                <div class="font-serif text-xs font-bold text-parchment group-hover:text-white uppercase tracking-wider">Ficha Completa</div>
                <div class="text-[10px] text-stone-400 truncate">Atributos, Perícias & XP</div>
              </div>
            </button>

          </div>

        </div>
      </section>

    </main>

    <!-- MODAL DE RELATÓRIO DETALHADO DA ATIVIDADE (DEBRIEFING TÁTICO) -->
    <div v-if="selectedActivity" class="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div class="max-w-xl w-full bg-[#0a0507] border-2 border-red-900/80 rounded-2xl p-6 sm:p-7 shadow-[0_0_50px_rgba(153,27,27,0.4)] space-y-6 text-stone-200 relative max-h-[90vh] overflow-y-auto font-sans">
        
        <button @click="selectedActivity = null" class="absolute top-4 right-4 text-stone-400 hover:text-white text-xl transition-all">✕</button>

        <!-- CABEÇALHO DO RELATÓRIO -->
        <div class="border-b border-white/10 pb-4 space-y-1">
          <div class="flex items-center justify-between gap-2">
            <span class="text-[10px] font-mono uppercase tracking-widest text-gold">
              {{ selectedActivity.activityType === 'IDLE_MISSION' ? '⚔️ Relatório de Incursão Tática' : '📖 Crônica Narrativa Solo' }}
            </span>
            <span 
              class="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded border font-bold"
              :class="selectedActivity.resultData?.success !== false ? 'bg-green-950 text-green-400 border-green-700' : 'bg-red-950 text-red-400 border-red-700'"
            >
              {{ selectedActivity.resultData?.success !== false ? '✔ Missão Bem-Sucedida' : '☠ Incursão Abortada / Falha' }}
            </span>
          </div>
          <h2 class="text-xl sm:text-2xl font-serif font-bold text-parchment">
            {{ selectedActivity.mission?.title || selectedActivity.resultData?.title || 'Operação de Campo' }}
          </h2>
          <div class="text-xs text-stone-400 font-mono flex items-center gap-3 pt-1">
            <span>📅 {{ formatActivityDate(selectedActivity.createdAt) }}</span>
            <span v-if="selectedActivity.mission?.Location?.name">• 📍 {{ selectedActivity.mission.Location.name }}</span>
          </div>
        </div>

        <!-- DESCRIÇÃO / CONTEXTO -->
        <div v-if="selectedActivity.mission?.description" class="text-xs text-stone-300 font-light leading-relaxed bg-black/50 p-3.5 rounded-xl border border-white/5">
          {{ selectedActivity.mission.description }}
        </div>

        <!-- ETAPAS RESOLVIDAS E DADOS (SE HOUVER REPORT DETALHADO) -->
        <div v-if="selectedActivity.resultData?.report?.steps?.length" class="space-y-3">
          <h3 class="text-xs font-serif uppercase tracking-wider text-gold font-bold flex items-center gap-2">
            <span>🎲</span> Testes & Desdobramentos da Noite
          </h3>

          <div class="space-y-2.5">
            <div 
              v-for="step in selectedActivity.resultData.report.steps" 
              :key="step.stepId || step.order"
              class="bg-black/60 border border-white/10 rounded-xl p-3.5 space-y-1.5"
            >
              <div class="flex justify-between items-center text-xs">
                <span class="font-serif font-bold text-stone-200 flex items-center gap-1.5">
                  <span class="w-5 h-5 rounded-full bg-black border border-white/20 flex items-center justify-center text-[10px]">
                    {{ step.order }}
                  </span>
                  {{ step.actionName }}
                </span>
                <span 
                  class="text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold"
                  :class="step.passed ? 'bg-green-950 text-green-400 border border-green-800' : 'bg-red-950 text-red-400 border border-red-800'"
                >
                  {{ step.passed ? '✔ Sucesso' : '✖ Falha' }}
                </span>
              </div>
              <p v-if="step.narrative" class="text-[11px] text-stone-300 font-light leading-relaxed pl-6">
                {{ step.narrative }}
              </p>
              <div v-if="step.rolls" class="text-[10px] font-mono text-stone-400 pl-6 flex items-center gap-2">
                <span>Dados: [{{ Array.isArray(step.rolls) ? step.rolls.join(', ') : step.rolls }}]</span>
                <span>&rarr;</span>
                <span :class="step.passed ? 'text-green-400 font-bold' : 'text-red-400 font-bold'">
                  {{ step.successes }} {{ step.successes === 1 ? 'sucesso' : 'sucessos' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- ETAPAS DO MODELO DE MISSÃO (FALLBACK) -->
        <div v-else-if="selectedActivity.mission?.Actions?.length" class="space-y-3">
          <h3 class="text-xs font-serif uppercase tracking-wider text-gold font-bold flex items-center gap-2">
            <span>🎲</span> Protocolos Operacionais
          </h3>
          <div class="space-y-2">
            <div 
              v-for="act in selectedActivity.mission.Actions" 
              :key="act.id"
              class="bg-black/60 border border-white/10 rounded-xl p-3 text-xs space-y-1"
            >
              <div class="font-serif font-bold text-stone-200 flex items-center gap-2">
                <span class="text-gold">⚔️</span> {{ act.title }}
              </div>
              <p v-if="act.description" class="text-[11px] text-stone-400 font-light">
                {{ act.description }}
              </p>
            </div>
          </div>
        </div>

        <!-- MUDANÇAS & ESPÓLIOS FINAIS -->
        <div v-if="selectedActivity.resultData?.report?.finalChanges?.length" class="space-y-2">
          <h3 class="text-xs font-serif uppercase tracking-wider text-gold font-bold flex items-center gap-2">
            <span>🏆</span> Espólios & Consequências da Incursão
          </h3>
          <ul class="space-y-1.5 text-xs font-mono text-stone-300 bg-black/60 p-3.5 rounded-xl border border-white/5">
            <li v-for="(change, idx) in selectedActivity.resultData.report.finalChanges" :key="idx" class="flex items-center gap-2">
              <span>{{ change }}</span>
            </li>
          </ul>
        </div>

        <!-- RECOMPENSAS DIRETAS (FALLBACK) -->
        <div v-else-if="selectedActivity.resultData?.rewards || selectedActivity.mission?.rewards || selectedActivity.mission?.rewardExp || selectedActivity.mission?.rewardMoney" class="space-y-2">
          <h3 class="text-xs font-serif uppercase tracking-wider text-gold font-bold flex items-center gap-2">
            <span>🏆</span> Ganhos e Recompensas
          </h3>
          <div class="flex flex-wrap gap-2 text-xs font-mono">
            <span v-if="selectedActivity.resultData?.rewards?.exp || selectedActivity.mission?.rewards?.exp || selectedActivity.mission?.rewardExp" class="bg-amber-950/60 border border-amber-800 text-gold px-3 py-1 rounded-lg">
              ✨ +{{ selectedActivity.resultData?.rewards?.exp || selectedActivity.mission?.rewards?.exp || selectedActivity.mission?.rewardExp }} XP
            </span>
            <span v-if="selectedActivity.resultData?.rewards?.money || selectedActivity.mission?.rewards?.money || selectedActivity.mission?.rewardMoney" class="bg-green-950/60 border border-green-800 text-green-300 px-3 py-1 rounded-lg">
              💵 +R$ {{ (selectedActivity.resultData?.rewards?.money || selectedActivity.mission?.rewards?.money || selectedActivity.mission?.rewardMoney).toLocaleString('pt-BR') }}
            </span>
            <span v-if="selectedActivity.resultData?.rewards?.hunger || selectedActivity.mission?.rewards?.hunger" class="bg-red-950/60 border border-red-800 text-red-300 px-3 py-1 rounded-lg">
              🩸 Fome Saciada ({{ selectedActivity.resultData?.rewards?.hunger || selectedActivity.mission?.rewards?.hunger }})
            </span>
            <span v-if="selectedActivity.resultData?.rewards?.equipmentDropName || selectedActivity.mission?.rewards?.equipmentDropName" class="bg-purple-950/60 border border-purple-800 text-purple-300 px-3 py-1 rounded-lg">
              🗡️ {{ selectedActivity.resultData?.rewards?.equipmentDropName || selectedActivity.mission?.rewards?.equipmentDropName }}
            </span>
          </div>
        </div>

        <button 
          @click="selectedActivity = null"
          class="w-full py-3 rounded-xl bg-gold hover:bg-gold-light text-black font-serif font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)]"
        >
          Fechar Relatório
        </button>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api, { API_BASE_URL } from '../services/api'
import NightClockWidget from '../components/NightClockWidget.vue'
import { notifySuccess, notifyError } from '../utils/gothicAlerts'

const router = useRouter()
const route = useRoute()

const loading = ref(true)
const character = ref<any>(null)
const characterId = ref<string>('')
const nightClockRef = ref<any>(null)
const currentNightStatus = ref<any>(null)
const activeMission = ref<any>(null)
const recentActivities = ref<any[]>([])
const selectedActivity = ref<any>(null)
const isAwakening = ref(false)

const openActivityReport = (act: any) => {
  selectedActivity.value = act
}

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  if (target) target.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'600\'%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'%231a0b12\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' fill=\'%23c9a84c\' font-family=\'serif\' font-size=\'48\' dominant-baseline=\'middle\' text-anchor=\'middle\'%3E%E2%98%A5%3C/text%3E%3C/svg%3E';
}

const currentLocationName = computed(() => {
  if (currentNightStatus.value?.currentLocation?.name) {
    return currentNightStatus.value.currentLocation.name
  }
  if (character.value?.Haven?.DefinitionLocation?.name) {
    return character.value.Haven.DefinitionLocation.name
  }
  return 'Belenzinho'
})

const onNightStatusUpdated = async (status: any) => {
  currentNightStatus.value = status
  await fetchActiveMission()
  await fetchRecentActivities()
}

const formatActivityDate = (dateStr: string) => {
  if (!dateStr) return 'Hoje'
  try {
    const d = new Date(dateStr)
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) + ' • ' + d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  } catch {
    return 'Hoje'
  }
}

const awakenCharacter = async () => {
  if (!character.value) return;
  isAwakening.value = true;
  try {
    const res = await api.post(`/api/character-vampires/${character.value.id}/awaken`);
    character.value.isAwake = res.data.character.isAwake;
    character.value.hunger = res.data.character.hunger;
    notifySuccess('Despertar Concluído', 'O sangue atendeu ao chamado da noite.')
    await nightClockRef.value?.fetchStatus();
  } catch (err: any) {
    notifyError('Erro ao Despertar', err.response?.data?.error || 'Não foi possível acordar.')
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
    await fetchRecentActivities()
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

const fetchRecentActivities = async () => {
  if (!characterId.value) return
  try {
    const res = await api.get(`/api/character-vampires/${characterId.value}/activities`)
    recentActivities.value = res.data || []
  } catch (e) {
    console.error('Erro ao buscar atividades recentes:', e)
  }
}

onMounted(() => {
  fetchCharacter()
})
</script>

<style scoped>
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: #090b10; }
::-webkit-scrollbar-thumb { background: #1c2230; border-radius: 2px; }
::-webkit-scrollbar-thumb:hover { background: #dc2626; }
</style>

