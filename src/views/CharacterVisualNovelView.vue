<template>
  <div class="h-screen w-full bg-[#050505] text-parchment font-sans relative overflow-hidden flex flex-col select-none">
    
    <!-- ========================================== -->
    <!-- 1. TOP NAVBAR (MODO LOBBY DE CRÔNICAS)     -->
    <!-- ========================================== -->
    <nav v-if="!activeAdventure" class="absolute top-0 w-full z-40 bg-gradient-to-b from-black via-black/80 to-transparent p-4 flex justify-between items-center border-b border-white/5 backdrop-blur-sm">
      <button @click="handleBack" class="text-xs text-gray-400 hover:text-white flex items-center gap-2 font-serif uppercase tracking-widest transition-colors cursor-pointer">
        <span>←</span> VOLTAR AO HUB CENTRAL
      </button>

      <div class="flex items-center gap-4 text-xs font-mono">
        <div v-if="character" class="flex items-center gap-3">
          <div class="flex items-center gap-1.5 text-stone-400">
            <span class="text-vamp-c2">🩸</span>
            <span>Fome: <strong class="text-vamp-c2 font-bold">{{ character.hunger }}/5</strong></span>
          </div>
          <div class="w-px h-3 bg-white/10"></div>
          <div class="flex items-center gap-1.5 text-stone-400">
            <span class="text-amber-400">✨</span>
            <span>XP: <strong class="text-amber-300 font-bold">{{ character.experienceTotal || 0 }}</strong></span>
          </div>
          <div class="w-px h-3 bg-white/10"></div>
          <div class="flex items-center gap-1.5 text-stone-400">
            <span class="text-emerald-400">💵</span>
            <span>R$ <strong class="text-emerald-300 font-bold">{{ (character.money || 0).toLocaleString('pt-BR') }}</strong></span>
          </div>
        </div>
      </div>
    </nav>

    <!-- ========================================== -->
    <!-- 2. HUD DO VAMPIRO (MODO CENA ATIVA)        -->
    <!-- ========================================== -->
    <header v-if="character && activeAdventure && currentNode" class="absolute top-0 left-0 w-full z-40 p-4 pointer-events-none bg-gradient-to-b from-black/95 via-black/60 to-transparent">
      <div class="max-w-5xl mx-auto flex justify-between items-center w-full">
        
        <!-- Perfil & Status Vitais V5 -->
        <div class="flex items-center gap-3 pointer-events-auto bg-black/80 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 shadow-2xl">
          <div class="w-10 h-10 rounded-full border-2 border-vamp-c2 bg-zinc-900 overflow-hidden relative shadow-[0_0_12px_rgba(192,57,43,0.5)]">
            <img 
              :src="character.avatarUrl ? (character.avatarUrl.startsWith('http') ? character.avatarUrl : API_BASE_URL + character.avatarUrl) : ''" 
              class="w-full h-full object-cover" 
              alt="Avatar"
            />
          </div>

          <div class="flex flex-col gap-0.5">
            <div class="flex items-center gap-2">
              <span class="font-serif font-bold text-xs text-parchment uppercase tracking-wider">{{ character.name }}</span>
              <span class="text-[9px] px-1.5 py-0.2 bg-red-950/80 text-red-300 border border-red-800/40 rounded font-mono uppercase">
                {{ character.Clan?.name || 'Caitiff' }}
              </span>
            </div>

            <!-- Medidor de Fome (Gotas de Sangue) -->
            <div class="flex items-center gap-2">
              <span class="text-[9px] font-mono text-stone-400 uppercase">Fome:</span>
              <div class="flex gap-1">
                <div 
                  v-for="i in 5" 
                  :key="'hunger-' + i" 
                  class="w-3 h-3 rounded-full border transition-all duration-300 flex items-center justify-center text-[7px]"
                  :class="i <= (character.hunger || 1) 
                    ? 'bg-gradient-to-br from-red-600 to-red-950 border-red-400 text-white shadow-[0_0_8px_rgba(239,68,68,0.8)]' 
                    : 'bg-black/60 border-red-950 text-transparent'"
                >
                  💧
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Controles de Navegação / Pausa -->
        <div class="flex items-center gap-2 pointer-events-auto">
          <button 
            @click="confirmResetCurrentAdventure" 
            title="Reiniciar esta Crônica"
            class="px-3 py-1.5 rounded-lg bg-black/80 border border-white/10 hover:border-amber-500/50 text-stone-400 hover:text-amber-300 text-[10px] font-serif uppercase tracking-widest transition-all backdrop-blur-md flex items-center gap-1.5 cursor-pointer shadow-lg"
          >
            <span>↺</span> REINICIAR CENA
          </button>

          <button 
            @click="handleBack" 
            title="Voltar à Seleção de Crônicas"
            class="w-9 h-9 rounded-full bg-black/80 border border-white/10 hover:border-vamp-c2 text-stone-300 hover:text-white flex items-center justify-center transition-all backdrop-blur-md shadow-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

      </div>
    </header>

    <!-- ========================================== -->
    <!-- 3. LOADING STATE                           -->
    <!-- ========================================== -->
    <div v-if="loading" class="flex-1 flex flex-col items-center justify-center bg-[#050505] z-30 space-y-4">
      <div class="animate-spin w-14 h-14 border-2 border-white/10 border-t-vamp-c2 rounded-full shadow-[0_0_20px_rgba(192,57,43,0.6)]"></div>
      <p class="text-xs font-serif uppercase tracking-[3px] text-vamp-c2 animate-pulse">Sincronizando Crônica das Trevas...</p>
    </div>

    <!-- ========================================== -->
    <!-- 4. LOBBY / SELEÇÃO DE CRÔNICAS             -->
    <!-- ========================================== -->
    <div v-else-if="!activeAdventure" class="flex-1 flex flex-col items-center justify-start bg-gradient-to-b from-[#0a0a0c] via-[#050505] to-black p-4 pt-24 overflow-y-auto">
      <div class="max-w-4xl w-full space-y-8 pb-20">
        
        <!-- Header da Página -->
        <header class="text-center space-y-2 border-b border-white/10 pb-6">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/40 border border-red-800/40 text-[10px] font-mono uppercase tracking-widest text-red-300">
            <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            Motor de Histórias Interativas V5
          </div>
          <h1 class="font-serif text-3xl md:text-5xl text-parchment uppercase tracking-[0.2em] font-bold drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            Crônicas Narrativas
          </h1>
          <p class="text-xs text-stone-400 uppercase tracking-widest font-serif max-w-xl mx-auto leading-relaxed">
            Livro-Jogo Solo de Vampiro: A Máscara. Suas decisões e rolagens com dados de fome moldam a escuridão de Nocturna.
          </p>
        </header>

        <!-- Lista de Cards de Crônicas -->
        <div class="grid grid-cols-1 gap-6">
          <div 
            v-for="adv in adventures" 
            :key="adv.id" 
            class="relative overflow-hidden border border-white/10 hover:border-vamp-c2/80 bg-zinc-950/80 transition-all duration-300 rounded-xl shadow-2xl group flex flex-col md:flex-row"
          >
            <!-- Faixa lateral decorativa / Efeito de sangue -->
            <div class="w-full md:w-2 bg-gradient-to-b from-vamp-c2 via-red-900 to-black shrink-0"></div>

            <div class="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div class="flex items-center gap-2">
                    <span class="text-lg">📜</span>
                    <h3 class="font-serif text-xl md:text-2xl text-parchment font-bold uppercase tracking-wider group-hover:text-gold transition-colors">
                      {{ adv.title }}
                    </h3>
                  </div>

                  <!-- Badges de Status -->
                  <div class="flex items-center gap-2">
                    <span v-if="adv.isCompleted" class="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-400 text-[10px] font-mono uppercase font-bold flex items-center gap-1">
                      <span>✔</span> Concluída ({{ adv.completionCount }}x)
                    </span>
                    <span v-else-if="adv.hasActiveProgress" class="px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-700/60 text-amber-300 text-[10px] font-mono uppercase font-bold flex items-center gap-1 animate-pulse">
                      <span>⏳</span> Em Andamento
                    </span>
                    <span v-else class="px-2.5 py-0.5 rounded-full bg-zinc-900 border border-white/10 text-stone-400 text-[10px] font-mono uppercase">
                      Inédita
                    </span>

                    <span class="px-2.5 py-0.5 rounded-full bg-black/60 border border-white/5 text-stone-400 text-[10px] font-mono">
                      {{ adv.totalNodes || 1 }} Cenas
                    </span>
                  </div>
                </div>

                <p class="text-sm text-stone-300 leading-relaxed font-light italic">
                  {{ adv.description }}
                </p>
              </div>

              <!-- Rodapé do Card com Ações -->
              <div class="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5">
                <div class="text-[11px] font-mono text-stone-500 flex items-center gap-2">
                  <span>Recompensas Estimadas:</span>
                  <span class="text-amber-400 font-bold">+8 XP</span>
                  <span>•</span>
                  <span class="text-emerald-400 font-bold">+R$ 800</span>
                  <span>•</span>
                  <span class="text-red-400 font-bold">-1 Fome</span>
                </div>

                <div class="flex items-center gap-2">
                  <button 
                    v-if="adv.hasActiveProgress"
                    @click="resetAdventure(adv.id)" 
                    class="px-4 py-2.5 rounded-lg border border-white/10 hover:border-amber-500/50 text-stone-400 hover:text-amber-300 text-xs font-serif uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Reiniciar
                  </button>

                  <button 
                    @click="startAdventure(adv.id)" 
                    class="px-6 py-2.5 rounded-lg bg-gradient-to-r from-red-800 to-vamp-c2 hover:from-red-700 hover:to-red-600 text-white font-serif text-xs font-bold uppercase tracking-[0.15em] transition-all shadow-[0_0_15px_rgba(192,57,43,0.4)] flex items-center gap-2 cursor-pointer"
                  >
                    <span>{{ adv.hasActiveProgress ? 'Continuar Crônica' : 'Iniciar Crônica' }}</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="adventures.length === 0" class="text-center py-16 bg-zinc-950/40 border border-white/5 rounded-xl space-y-3">
            <div class="text-4xl">🦇</div>
            <h3 class="font-serif text-lg text-stone-300 uppercase tracking-widest">Nenhuma crônica catalogada</h3>
            <p class="text-xs text-stone-500 font-mono max-w-md mx-auto">
              O Mestre ainda não publicou crônicas narrativas no GM Studio.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- 5. TEATRO NARRATIVO (VISUAL NOVEL ATIVA)   -->
    <!-- ========================================== -->
    <div v-else-if="currentNode" class="absolute inset-0 flex flex-col justify-end bg-black">
      
      <!-- 5.1 Cenário de Fundo com Transição Suave -->
      <div 
        class="absolute inset-0 z-0 bg-cover bg-center transition-all duration-700 ease-in-out scale-105"
        :style="{ 
          backgroundImage: currentNode.backgroundImageUrl ? `url('${resolveImageUrl(currentNode.backgroundImageUrl)}')` : 'none', 
          opacity: transitionOpacity 
        }"
      ></div>

      <!-- Vinheta e Camada de Escurecimento Atmosférico -->
      <div class="absolute inset-0 z-0 bg-gradient-to-t from-black via-black/60 to-black/80 pointer-events-none mix-blend-multiply"></div>
      <div class="absolute inset-0 z-0 bg-black/40 pointer-events-none"></div>

      <!-- 5.2 Container Principal Coeso e Centralizado (The Vampire Stage) -->
      <div class="relative z-20 w-full min-h-[50vh] flex flex-col justify-end pb-8 pointer-events-none">
        
        <div class="w-full max-w-5xl mx-auto flex flex-col justify-end items-center px-4 space-y-4">
          
          <!-- Linha de Personagens em Destaque (Cards / Sprites Enquadrados com Sombra) -->
          <div class="w-full flex justify-between items-end px-2 sm:px-6 pointer-events-none">
            
            <!-- Personagem Esquerdo (Interlocutor / NPC) -->
            <div 
              class="transition-all duration-700 transform flex flex-col items-center"
              :class="{'opacity-100 translate-y-0': currentNode.leftCharacterImageUrl, 'opacity-0 translate-y-8 pointer-events-none': !currentNode.leftCharacterImageUrl}"
            >
              <div v-if="currentNode.leftCharacterImageUrl" class="relative group">
                <!-- Moldura / Retrato Gótico com Efeito de Luz -->
                <div class="w-32 h-44 sm:w-40 sm:h-56 rounded-2xl overflow-hidden border-2 border-red-950/80 bg-zinc-950/90 shadow-[0_10px_30px_rgba(0,0,0,0.9)] backdrop-blur-md relative flex items-center justify-center">
                  <img 
                    :src="resolveImageUrl(currentNode.leftCharacterImageUrl)" 
                    class="w-full h-full object-cover object-top filter brightness-90 contrast-105" 
                    alt="Interlocutor"
                  />
                  <!-- Vinheta interna para escurecer as bordas do retrato -->
                  <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 pointer-events-none"></div>
                </div>
                <!-- Badge de Nome do NPC sob a moldura -->
                <div class="mt-2 px-3 py-0.5 rounded-full bg-black/80 border border-white/10 text-[10px] font-serif text-parchment-dim uppercase tracking-wider text-center shadow-md">
                  {{ currentNode.speakerName || 'Interlocutor' }}
                </div>
              </div>
            </div>

            <!-- Personagem Direito (Jogador / Protagonista) -->
            <div 
              class="transition-all duration-700 transform flex flex-col items-center"
              :class="{'opacity-100 translate-y-0': currentNode.rightCharacterImageUrl, 'opacity-0 translate-y-8 pointer-events-none': !currentNode.rightCharacterImageUrl}"
            >
              <div v-if="currentNode.rightCharacterImageUrl" class="relative group">
                <!-- Moldura / Retrato Gótico do Jogador -->
                <div class="w-32 h-44 sm:w-40 sm:h-56 rounded-2xl overflow-hidden border-2 border-amber-950/80 bg-zinc-950/90 shadow-[0_10px_30px_rgba(0,0,0,0.9)] backdrop-blur-md relative flex items-center justify-center">
                  <img 
                    :src="resolveImageUrl(currentNode.rightCharacterImageUrl)" 
                    class="w-full h-full object-cover object-top filter brightness-90 contrast-105" 
                    alt="Protagonista"
                  />
                  <!-- Vinheta interna -->
                  <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 pointer-events-none"></div>
                </div>
                <!-- Badge de Nome do Jogador -->
                <div class="mt-2 px-3 py-0.5 rounded-full bg-black/80 border border-gold/30 text-[10px] font-serif text-gold uppercase tracking-wider text-center shadow-md">
                  {{ character.name }}
                </div>
              </div>
            </div>

          </div>

          <!-- Caixa de Narrativa Central -->
          <div class="w-full pointer-events-auto space-y-6 pt-6 pb-6 px-6 md:px-10 bg-black/85 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.95)] transition-all">
            
            <!-- Orador & Texto Narrativo -->
            <div class="space-y-4">
              <div class="flex items-center justify-between border-b border-white/10 pb-3">
                <div class="flex items-center gap-2">
                  <span class="text-xs text-vamp-c2">⚜</span>
                  <span class="font-serif text-base md:text-lg uppercase tracking-[0.2em] text-gold font-bold drop-shadow-md">
                    {{ currentNode.speakerName || 'O Narrador' }}
                  </span>
                </div>
                <span class="text-[10px] font-mono uppercase tracking-widest text-stone-500">
                  Noite de Nocturna
                </span>
              </div>
              
              <div 
                class="text-base md:text-lg font-serif leading-relaxed text-parchment whitespace-pre-line drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] font-light"
                :class="{'animate-fade-in': animateText}"
              >
                {{ currentNode.narrativeText }}
              </div>
            </div>

            <!-- ========================================== -->
            <!-- 5.3 PAINEL DE DESFECHO / FINAL DE CRÔNICA  -->
            <!-- ========================================== -->
            <div v-if="currentNode.isEnding" class="pt-4 border-t border-white/10 text-center space-y-6 animate-fade-in">
              <div class="bg-red-950/40 border border-red-800/40 p-4 rounded-xl max-w-md mx-auto space-y-2">
                <div class="text-xs font-serif uppercase tracking-widest text-gold font-bold flex items-center justify-center gap-2">
                  <span>🏆</span> Desfecho da Crônica Alcançado
                </div>
                <p class="text-xs text-stone-300 font-light leading-relaxed">
                  Sua jornada nesta noite foi registrada no diário de Nocturna. As recompensas foram creditadas à sua ficha.
                </p>
                <div v-if="lastRewards" class="flex justify-center items-center gap-4 text-xs font-mono pt-2 text-stone-300">
                  <span class="text-amber-400 font-bold">+{{ lastRewards.exp }} XP</span>
                  <span>•</span>
                  <span class="text-emerald-400 font-bold">+R$ {{ lastRewards.money?.toLocaleString('pt-BR') }}</span>
                  <span>•</span>
                  <span class="text-red-400 font-bold">-1 Fome</span>
                </div>
              </div>

              <button 
                @click="finishAdventure" 
                class="px-10 py-3.5 rounded-lg bg-gradient-to-r from-amber-600 via-gold to-amber-700 text-black font-serif uppercase tracking-[0.2em] text-xs font-bold hover:brightness-110 transition-all shadow-[0_0_25px_rgba(212,175,55,0.4)] cursor-pointer"
              >
                Concluir & Retornar ao Hub
              </button>
            </div>

            <!-- ========================================== -->
            <!-- 5.4 LISTA DE ESCOLHAS & TESTES V5          -->
            <!-- ========================================== -->
            <div v-else class="flex flex-col gap-3 w-full pt-2 animate-fade-in">
              <div class="text-[10px] font-mono uppercase tracking-widest text-stone-400 pb-1 flex items-center gap-2">
                <span>⚔️</span> Suas Opções de Ação:
              </div>

              <button 
                v-for="choice in currentNode.choices" 
                :key="choice.id" 
                @click="makeChoice(choice)"
                :disabled="processingChoice"
                class="w-full text-left p-4 rounded-xl border transition-all duration-300 relative group overflow-hidden cursor-pointer"
                :class="[
                  choice.customStyle === 'DISCIPLINE' || choice.customStyle === 'RED' 
                    ? 'bg-red-950/30 border-red-800/60 hover:bg-red-900/40 hover:border-red-500 shadow-[0_0_15px_rgba(192,57,43,0.15)]' 
                    : 'bg-zinc-950/60 border-white/10 hover:bg-white/5 hover:border-gold/60 shadow-md'
                ]"
              >
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 relative z-10">
                  <div class="flex items-center gap-3">
                    <span class="text-xs group-hover:scale-125 transition-transform">
                      {{ choice.customStyle === 'DISCIPLINE' ? '🩸' : (choice.attributeReq ? '🎲' : '💬') }}
                    </span>
                    <span class="font-serif text-sm md:text-base text-parchment group-hover:text-white font-medium">
                      {{ choice.choiceText }}
                    </span>
                  </div>

                  <!-- Tag de Requisito de Teste V5 -->
                  <div v-if="choice.attributeReq || choice.skillReq" class="shrink-0 flex items-center gap-1 text-[10px] font-mono uppercase px-2.5 py-1 rounded bg-black/60 border border-white/10 group-hover:border-gold/40 text-stone-300">
                    <span class="text-amber-400 font-bold">Teste:</span>
                    <span>{{ choice.attributeReq }}<span v-if="choice.skillReq"> + {{ choice.skillReq }}</span></span>
                    <span class="text-red-400 font-bold ml-1">(Dif: {{ choice.difficulty || 1 }})</span>
                  </div>
                </div>
              </button>
            </div>
            
          </div>

        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- 6. MODAL DE ROLAGEM DE DADOS V5 (CINEMA)   -->
    <!-- ========================================== -->
    <div v-if="showResultModal && lastRollDetails" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop escuro -->
      <div class="absolute inset-0 bg-black/90 backdrop-blur-xl animate-fade-in"></div>
      
      <div class="relative z-10 max-w-xl w-full text-center space-y-6 animate-fade-in p-6 bg-zinc-950 border rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.95)]" :class="verdictBorderClass">
        
        <!-- Veredito Topo -->
        <div class="space-y-2">
          <div class="text-4xl">{{ verdictIcon }}</div>
          <h3 class="font-serif text-2xl md:text-4xl uppercase tracking-[0.15em] font-bold drop-shadow-md" :class="verdictTextClass">
            {{ lastRollDetails.verdictTitle }}
          </h3>
          <p class="text-xs text-stone-300 font-serif max-w-md mx-auto leading-relaxed">
            {{ lastRollDetails.verdictSubtitle }}
          </p>
        </div>

        <!-- Placar de Sucessos vs Dificuldade -->
        <div class="bg-black/60 border border-white/10 p-3 rounded-xl flex items-center justify-around text-xs font-mono uppercase">
          <div>
            <span class="text-stone-400 block text-[9px]">Parada de Dados</span>
            <strong class="text-parchment text-sm">{{ lastRollDetails.totalDicePool }} dados</strong>
          </div>
          <div class="w-px h-6 bg-white/10"></div>
          <div>
            <span class="text-stone-400 block text-[9px]">Dificuldade Alvo</span>
            <strong class="text-amber-400 text-sm">{{ lastRollDetails.difficulty }}</strong>
          </div>
          <div class="w-px h-6 bg-white/10"></div>
          <div>
            <span class="text-stone-400 block text-[9px]">Sucessos Totais</span>
            <strong class="text-sm font-bold" :class="lastRollDetails.isVictory ? 'text-emerald-400' : 'text-red-400'">
              {{ lastRollDetails.totalSuccesses }}
            </strong>
          </div>
        </div>

        <!-- Renderização dos Dados Físicos V5 -->
        <div class="space-y-4 py-2">
          <!-- Dados Normais (Pretos) -->
          <div v-if="lastRollDetails.regularDice && lastRollDetails.regularDice.length" class="space-y-1">
            <span class="text-[9px] font-mono uppercase tracking-widest text-stone-400 block">
              Dados Normais (Pretos)
            </span>
            <div class="flex flex-wrap justify-center gap-2">
              <div 
                v-for="(val, idx) in lastRollDetails.regularDice" 
                :key="'reg-' + idx"
                class="w-11 h-11 rounded-lg flex items-center justify-center font-serif font-bold text-base border shadow-lg transition-transform transform hover:scale-110"
                :class="val === 10 
                  ? 'bg-amber-600 text-black border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.8)]' 
                  : (val >= 6 ? 'bg-zinc-800 text-amber-300 border-amber-600/50' : 'bg-black text-stone-600 border-zinc-800')"
              >
                {{ val }}
                <span v-if="val === 10" class="text-[9px] ml-0.5">☥</span>
              </div>
            </div>
          </div>

          <!-- Dados de Fome (Vermelhos) -->
          <div v-if="lastRollDetails.hungerDice && lastRollDetails.hungerDice.length" class="space-y-1">
            <span class="text-[9px] font-mono uppercase tracking-widest text-red-400 block flex items-center justify-center gap-1">
              <span>🩸</span> Dados de Fome (Vermelhos)
            </span>
            <div class="flex flex-wrap justify-center gap-2">
              <div 
                v-for="(val, idx) in lastRollDetails.hungerDice" 
                :key="'hung-' + idx"
                class="w-11 h-11 rounded-lg flex items-center justify-center font-serif font-bold text-base border shadow-lg transition-transform transform hover:scale-110"
                :class="val === 10 
                  ? 'bg-red-600 text-white border-red-300 shadow-[0_0_15px_rgba(239,68,68,0.9)] animate-pulse' 
                  : (val === 1 ? 'bg-black text-red-500 border-red-600 shadow-[0_0_12px_rgba(185,28,28,0.8)]' : (val >= 6 ? 'bg-red-950 text-red-200 border-red-700' : 'bg-black text-red-900 border-red-950'))"
              >
                {{ val }}
                <span v-if="val === 10" class="text-[9px] ml-0.5">☥</span>
                <span v-else-if="val === 1" class="text-[9px] ml-0.5">☠</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Botão Continuar Cena -->
        <div class="pt-4">
          <button 
            @click="closeResultModal" 
            class="w-full py-3.5 rounded-xl border border-white/20 text-white font-serif uppercase tracking-[0.2em] text-xs font-bold hover:bg-white hover:text-black hover:border-white transition-all shadow-xl cursor-pointer"
          >
            Continuar Narrativa →
          </button>
        </div>

      </div>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api, { API_BASE_URL } from '../services/api'

const router = useRouter()
const route = useRoute()

const characterId = ref<string>('')
const character = ref<any>(null)
const loading = ref(true)
const adventures = ref<any[]>([])

const activeAdventure = ref<string | null>(null)
const currentNode = ref<any>(null)
const progressData = ref<any>(null)

const processingChoice = ref(false)
const showResultModal = ref(false)
const lastRollDetails = ref<any>(null)
const pendingNode = ref<any>(null)
const lastRewards = ref<any>(null)

// Efeitos de Transição
const transitionOpacity = ref(1)
const animateText = ref(true)

const resolveImageUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  if (url.startsWith('/uploads/')) return API_BASE_URL + url;
  return url;
}

const fetchCharacter = async () => {
  try {
    const res = await api.get(`/api/character-vampires/${characterId.value}`)
    character.value = res.data
  } catch (e) {
    console.error('Erro ao buscar personagem:', e)
  }
}

const fetchAdventures = async () => {
  try {
    const res = await api.get(`/api/story/adventures?characterId=${characterId.value}`)
    adventures.value = res.data
  } catch (e) {
    console.error(e)
  }
}

const handleBack = () => {
  if (activeAdventure.value) {
    activeAdventure.value = null
    currentNode.value = null
    fetchAdventures()
  } else {
    router.push(`/personagem/hub?id=${characterId.value}`)
  }
}

const startAdventure = async (advId: string) => {
  try {
    loading.value = true
    const res = await api.get(`/api/story/adventures/${advId}/progress/${characterId.value}`)
    if (!res.data.currentNode) {
      alert('Esta crônica ainda não possui cenas configuradas pelo Mestre.')
      return
    }
    triggerSceneTransition()
    activeAdventure.value = advId
    progressData.value = res.data.progress
    currentNode.value = res.data.currentNode
  } catch (e: any) {
    console.error(e)
    alert(e.response?.data?.error || 'Erro ao carregar crônica.')
  } finally {
    loading.value = false
  }
}

const resetAdventure = async (advId: string) => {
  if (!confirm('Deseja reiniciar esta crônica do primeiro capítulo? Todo o progresso anterior será resetado.')) return
  try {
    loading.value = true
    await api.post('/api/story/adventures/reset', {
      characterId: characterId.value,
      adventureId: advId
    })
    await startAdventure(advId)
  } catch (e: any) {
    console.error(e)
    alert(e.response?.data?.error || 'Erro ao reiniciar crônica')
  } finally {
    loading.value = false
  }
}

const confirmResetCurrentAdventure = () => {
  if (activeAdventure.value) {
    resetAdventure(activeAdventure.value)
  }
}

const makeChoice = async (choice: any) => {
  try {
    processingChoice.value = true
    
    const res = await api.post('/api/story/adventures/choice', {
      characterId: characterId.value,
      adventureId: activeAdventure.value,
      choiceId: choice.id
    })
    
    if (res.data.character) {
      character.value = res.data.character
    }

    if (res.data.rewards) {
      lastRewards.value = res.data.rewards
    }

    // Se houve teste de dados V5 com rollDetails
    if (res.data.rollDetails) {
      lastRollDetails.value = res.data.rollDetails
      pendingNode.value = res.data.newNode
      showResultModal.value = true
    } else {
      applyNewNode(res.data.newNode)
    }
  } catch (e: any) {
    console.error(e)
    alert(e.response?.data?.error || 'Erro ao processar escolha')
  } finally {
    processingChoice.value = false
  }
}

const closeResultModal = () => {
  showResultModal.value = false
  if (pendingNode.value) {
    applyNewNode(pendingNode.value)
    pendingNode.value = null
  }
  lastRollDetails.value = null
}

const applyNewNode = (node: any) => {
  triggerSceneTransition()
  setTimeout(() => {
    currentNode.value = node
  }, 300)
}

const finishAdventure = () => {
  activeAdventure.value = null
  currentNode.value = null
  lastRewards.value = null
  router.push(`/personagem/hub?id=${characterId.value}`)
}

const triggerSceneTransition = () => {
  transitionOpacity.value = 0
  animateText.value = false
  setTimeout(() => {
    transitionOpacity.value = 1
    animateText.value = true
  }, 400)
}

// Computados para o modal de dados
const verdictIcon = computed(() => {
  if (!lastRollDetails.value) return '🎲'
  switch (lastRollDetails.value.verdictType) {
    case 'MESSY_CRITICAL': return '🩸⚡'
    case 'CRITICAL': return '☥✨'
    case 'SUCCESS': return '✔'
    case 'BESTIAL_FAILURE': return '☠️'
    default: return '✖'
  }
})

const verdictTextClass = computed(() => {
  if (!lastRollDetails.value) return 'text-white'
  switch (lastRollDetails.value.verdictType) {
    case 'MESSY_CRITICAL': return 'text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]'
    case 'CRITICAL': return 'text-amber-400 drop-shadow-[0_0_20px_rgba(245,158,11,0.8)]'
    case 'SUCCESS': return 'text-emerald-400'
    case 'BESTIAL_FAILURE': return 'text-red-400'
    default: return 'text-stone-400'
  }
})

const verdictBorderClass = computed(() => {
  if (!lastRollDetails.value) return 'border-white/10'
  switch (lastRollDetails.value.verdictType) {
    case 'MESSY_CRITICAL': return 'border-red-600 shadow-[0_0_40px_rgba(239,68,68,0.4)]'
    case 'CRITICAL': return 'border-amber-400 shadow-[0_0_40px_rgba(245,158,11,0.4)]'
    case 'SUCCESS': return 'border-emerald-600'
    case 'BESTIAL_FAILURE': return 'border-red-900'
    default: return 'border-white/10'
  }
})

onMounted(() => {
  characterId.value = (route.query.id as string) || localStorage.getItem('lira_active_character_id') || ''
  if (!characterId.value) {
    router.push('/jogador/vampire')
    return
  }
  
  Promise.all([fetchCharacter(), fetchAdventures()]).finally(() => {
    loading.value = false
  })
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

