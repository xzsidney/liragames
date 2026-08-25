<template>
  <div class="min-h-screen bg-[#050505] text-parchment font-sans relative overflow-x-hidden selection:bg-blood-red selection:text-white pb-24">
    <!-- NOISE OVERLAY -->
    <div class="fixed inset-0 pointer-events-none opacity-20 mix-blend-overlay z-0" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>
    
    <!-- GLOW EFFECT -->
    <div class="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[400px] bg-blood-red/10 blur-[160px] rounded-full pointer-events-none z-0"></div>

    <!-- NAVBAR -->
    <nav class="relative z-20 border-b border-white/5 bg-black/60 backdrop-blur-md sticky top-0">
      <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full border border-gold-dim flex items-center justify-center bg-black shadow-[0_0_15px_rgba(212,175,55,0.15)]">
            <span class="text-gold font-serif text-xl">L</span>
          </div>
          <div class="flex flex-col">
            <span class="font-serif text-xl tracking-widest text-parchment">LIRA<span class="text-blood-red">RPG</span></span>
            <span class="text-[9px] font-serif uppercase tracking-[3px] text-gold-dim">Painel do Narrador (GM)</span>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div class="hidden sm:flex items-center gap-2 px-3 py-1 rounded border border-gold/20 bg-gold/5 text-gold text-xs font-serif tracking-widest">
            <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            MESTRE: {{ masterInfo?.name || 'Carregando...' }}
          </div>
          
          <button @click="handleLogout" class="font-serif text-[11px] tracking-[2px] uppercase text-gray-400 hover:text-white transition-colors border border-white/10 px-4 py-2 rounded bg-black/40 hover:bg-black/80">
            Desconectar
          </button>
        </div>
      </div>
    </nav>

    <!-- SUB-NAV / TABS (Shown when not inside detail mode) -->
    <div v-if="!activeAdventureDetail && !activeMissionDetail" class="relative z-10 border-b border-white/5 bg-black/40">
      <div class="max-w-7xl mx-auto px-6 flex gap-8">
        <button 
          @click="activeTab = 'stories'"
          class="py-4 text-xs font-serif uppercase tracking-[2px] border-b-2 transition-all relative"
          :class="activeTab === 'stories' ? 'border-gold text-gold font-bold shadow-[0_2px_10px_rgba(212,175,55,0.3)]' : 'border-transparent text-gray-400 hover:text-parchment'"
        >
          📖 Crônicas &amp; Aventuras Solo (Livro-Jogo)
        </button>

        <button 
          @click="activeTab = 'missions'"
          class="py-4 text-xs font-serif uppercase tracking-[2px] border-b-2 transition-all relative"
          :class="activeTab === 'missions' ? 'border-blood-red text-blood-red font-bold shadow-[0_2px_10px_rgba(192,57,43,0.3)]' : 'border-transparent text-gray-400 hover:text-parchment'"
        >
          ⏳ Incursões &amp; Caçadas (Missões AFK)
        </button>
      </div>
    </div>

    <!-- MAIN CONTENT -->
    <main class="relative z-10 max-w-7xl mx-auto px-6 py-8">
      
      <!-- FEEDBACK ALERTS -->
      <div v-if="successMsg" class="mb-6 p-4 rounded bg-green-950/60 border border-green-500/50 text-green-300 text-xs font-serif tracking-wider flex justify-between items-center">
        <span>✓ {{ successMsg }}</span>
        <button @click="successMsg = ''" class="text-gray-400 hover:text-white">✕</button>
      </div>
      <div v-if="errorMsg" class="mb-6 p-4 rounded bg-red-950/60 border border-red-500/50 text-red-300 text-xs font-serif tracking-wider flex justify-between items-center">
        <span>✕ {{ errorMsg }}</span>
        <button @click="errorMsg = ''" class="text-gray-400 hover:text-white">✕</button>
      </div>

      <!-- ========================================================================= -->
      <!-- VIEW 1: CRÔNICAS NARRATIVAS (LISTA) -->
      <!-- ========================================================================= -->
      <div v-if="activeTab === 'stories' && !activeAdventureDetail" class="space-y-6">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/5">
          <div>
            <h1 class="font-serif text-3xl text-parchment tracking-wide">Crônicas Narrativas (Livro-Jogo)</h1>
            <p class="text-xs text-gray-400 font-light mt-1">Crie histórias com nós ramificados, diálogos, sprites e testes de dados V5.</p>
          </div>
          <button @click="openAdventureModal()" class="px-5 py-2.5 rounded bg-gold/10 border border-gold/40 text-gold hover:bg-gold hover:text-black font-serif text-xs uppercase tracking-widest font-bold transition-all shadow-[0_0_15px_rgba(212,175,55,0.15)] flex items-center gap-2">
            <span>+</span> Nova Crônica
          </button>
        </div>

        <div v-if="loading" class="text-center py-20 text-gold text-xs font-serif uppercase tracking-widest animate-pulse">
          Carregando crônicas...
        </div>

        <div v-else-if="adventures.length === 0" class="border border-white/5 bg-black/40 p-12 rounded-xl text-center space-y-4">
          <div class="text-4xl">📜</div>
          <h3 class="font-serif text-lg text-parchment">Nenhuma crônica criada ainda</h3>
          <p class="text-xs text-gray-400 max-w-md mx-auto">Você ainda não possui crônicas associadas ao seu Mestre. Comece criando sua primeira aventura interativa.</p>
          <button @click="openAdventureModal()" class="px-4 py-2 rounded bg-gold/10 border border-gold/40 text-gold hover:bg-gold hover:text-black font-serif text-xs uppercase tracking-widest font-bold">
            Criar Minha Primeira Crônica
          </button>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="adv in adventures" :key="adv.id" class="border border-white/10 bg-black/60 hover:border-gold/50 rounded-xl p-6 flex flex-col justify-between transition-all group">
            <div>
              <div class="flex items-center justify-between text-[10px] font-serif uppercase tracking-widest text-gold-dim mb-3">
                <span>{{ adv.nodes?.length || 0 }} Cenas / Nós</span>
                <span v-if="adv.maxCompletions" class="text-gray-400">Max: {{ adv.maxCompletions }}x</span>
                <span v-else class="text-gray-500">Ilimitada</span>
              </div>
              <h3 class="font-serif text-xl text-parchment group-hover:text-gold transition-colors mb-2 font-bold">{{ adv.title }}</h3>
              <p class="text-xs text-gray-400 line-clamp-3 leading-relaxed mb-6">{{ adv.description }}</p>
            </div>

            <div class="space-y-3 pt-4 border-t border-white/5">
              <button @click="openAdventureDetail(adv.id)" class="w-full py-2 rounded bg-gold/10 border border-gold/30 hover:bg-gold hover:text-black text-gold text-xs font-serif uppercase tracking-widest font-bold transition-all">
                Abrir Editor de Cenas →
              </button>
              
              <div class="flex gap-2">
                <button @click="openAdventureModal(adv)" class="flex-1 py-1.5 rounded bg-white/5 border border-white/10 hover:border-white/30 text-[10px] font-serif uppercase tracking-widest text-gray-300">
                  Editar Info
                </button>
                <button @click="confirmDeleteAdventure(adv)" class="px-3 py-1.5 rounded bg-red-950/40 border border-red-500/30 hover:bg-red-900/60 text-[10px] font-serif uppercase tracking-widest text-red-300">
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========================================================================= -->
      <!-- VIEW 1.2: EDITOR DE CENAS & ESCOLHAS DA AVENTURA (DETALHE) -->
      <!-- ========================================================================= -->
      <div v-else-if="activeTab === 'stories' && activeAdventureDetail" class="space-y-8">
        <!-- HEADER DETALHE -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/10">
          <div class="space-y-1">
            <button @click="closeAdventureDetail" class="text-[10px] text-gray-400 hover:text-gold flex items-center gap-1 font-serif uppercase tracking-widest transition-colors mb-2">
              <span>←</span> VOLTAR PARA A LISTA DE CRÔNICAS
            </button>
            <div class="flex items-center gap-3">
              <h1 class="font-serif text-2xl md:text-3xl text-gold font-bold">{{ activeAdventureDetail.title }}</h1>
              <span class="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-serif uppercase tracking-widest text-gray-400">
                {{ activeAdventureDetail.nodes?.length || 0 }} Cenas
              </span>
            </div>
            <p class="text-xs text-gray-400 max-w-3xl">{{ activeAdventureDetail.description }}</p>
          </div>

          <div class="flex gap-3">
            <button @click="openNodeModal()" class="px-4 py-2 rounded bg-gold/10 border border-gold/40 text-gold hover:bg-gold hover:text-black font-serif text-xs uppercase tracking-widest font-bold transition-all flex items-center gap-2">
              <span>+</span> Adicionar Cena
            </button>
          </div>
        </div>

        <!-- SELETOR DE NÓ INICIAL -->
        <div class="p-4 rounded-xl border border-white/10 bg-black/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div class="text-xs font-serif tracking-wider">
            <span class="text-gold-dim uppercase font-bold">Cena de Abertura (Nó Inicial):</span>
            <span class="text-parchment ml-2">
              {{ getNodeSnippet(activeAdventureDetail.firstNodeId) || 'Nenhuma cena definida como inicial' }}
            </span>
          </div>

          <div class="flex items-center gap-2">
            <select v-model="selectedFirstNodeId" @change="saveFirstNodeId" class="bg-black border border-white/20 text-xs text-parchment px-3 py-1.5 rounded focus:border-gold outline-none">
              <option :value="undefined">Selecionar Cena Inicial...</option>
              <option v-for="(node, idx) in activeAdventureDetail.nodes" :key="node.id" :value="node.id">
                Cena #{{ Number(idx) + 1 }}: {{ node.speakerName ? `[${node.speakerName}] ` : '' }}{{ node.narrativeText.substring(0, 40) }}...
              </option>
            </select>
          </div>
        </div>

        <!-- LISTA DE CENAS / NÓS -->
        <div v-if="!activeAdventureDetail.nodes || activeAdventureDetail.nodes.length === 0" class="text-center py-16 border border-white/5 rounded-xl bg-black/40 space-y-3">
          <p class="text-xs text-gray-400 font-serif uppercase tracking-widest">Nenhuma cena cadastrada nesta crônica.</p>
          <button @click="openNodeModal()" class="px-4 py-2 rounded bg-gold/10 border border-gold text-gold font-serif text-xs uppercase tracking-widest font-bold">
            Criar Primeira Cena
          </button>
        </div>

        <div v-else class="space-y-6">
          <div v-for="(node, index) in activeAdventureDetail.nodes" :key="node.id" class="border border-white/10 bg-black/60 rounded-xl p-6 space-y-6 relative overflow-hidden">
            
            <!-- HEADER DA CENA -->
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-4 border-b border-white/5">
              <div class="flex items-center gap-3">
                <span class="w-8 h-8 rounded-full border border-gold/30 bg-gold/10 text-gold flex items-center justify-center font-serif font-bold text-xs">
                  #{{ Number(index) + 1 }}
                </span>
                <div>
                  <div class="flex items-center gap-2">
                    <span v-if="node.speakerName" class="text-xs font-serif text-gold font-bold uppercase tracking-wider">
                      🗣️ {{ node.speakerName }}
                    </span>
                    <span v-else class="text-xs font-serif text-gray-400 uppercase tracking-wider">
                      Narrativa Neutra
                    </span>
                    <span v-if="node.isEnding" class="px-2 py-0.5 rounded bg-red-950/80 border border-red-500/50 text-red-300 text-[9px] font-serif uppercase tracking-widest">
                      🏁 Cena de Desfecho / Fim
                    </span>
                    <span v-if="activeAdventureDetail.firstNodeId === node.id" class="px-2 py-0.5 rounded bg-gold/10 border border-gold/40 text-gold text-[9px] font-serif uppercase tracking-widest font-bold">
                      ⭐ Nó Inicial
                    </span>
                  </div>
                  <div class="text-[10px] text-gray-500 font-mono">ID: {{ node.id }}</div>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <button @click="openChoiceModal(node.id)" class="px-3 py-1 rounded bg-gold/10 border border-gold/30 hover:bg-gold hover:text-black text-gold text-[10px] font-serif uppercase tracking-widest font-bold">
                  + Adicionar Escolha
                </button>
                <button @click="openNodeModal(node)" class="px-3 py-1 rounded bg-white/5 border border-white/10 hover:border-white/30 text-gray-300 text-[10px] font-serif uppercase tracking-widest">
                  Editar Cena
                </button>
                <button @click="confirmDeleteNode(node.id)" class="px-3 py-1 rounded bg-red-950/40 border border-red-500/30 hover:bg-red-900/60 text-red-300 text-[10px] font-serif uppercase tracking-widest">
                  Excluir
                </button>
              </div>
            </div>

            <!-- CORPO NARRATIVO E PREVIEWS -->
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div class="lg:col-span-3 space-y-3">
                <p class="text-sm text-parchment leading-relaxed whitespace-pre-line bg-black/40 p-4 rounded-lg border border-white/5 italic">
                  "{{ node.narrativeText }}"
                </p>
              </div>

              <!-- PREVIEW DE IMAGENS -->
              <div class="space-y-2 text-[10px] text-gray-400 font-serif uppercase tracking-wider">
                <div v-if="node.backgroundImageUrl" class="border border-white/10 rounded p-2 bg-black/80">
                  <div class="mb-1 text-gray-500">Fundo:</div>
                  <div class="h-16 rounded overflow-hidden relative">
                    <img :src="node.backgroundImageUrl" class="w-full h-full object-cover" />
                  </div>
                </div>
                <div v-if="node.leftCharacterImageUrl || node.rightCharacterImageUrl" class="flex gap-2">
                  <div v-if="node.leftCharacterImageUrl" class="flex-1 border border-white/10 rounded p-1 text-center bg-black/80">
                    <div class="text-[8px] text-gray-500 mb-1">Sprite Esq.</div>
                    <img :src="node.leftCharacterImageUrl" class="h-12 mx-auto object-contain" />
                  </div>
                  <div v-if="node.rightCharacterImageUrl" class="flex-1 border border-white/10 rounded p-1 text-center bg-black/80">
                    <div class="text-[8px] text-gray-500 mb-1">Sprite Dir.</div>
                    <img :src="node.rightCharacterImageUrl" class="h-12 mx-auto object-contain" />
                  </div>
                </div>
              </div>
            </div>

            <!-- SEÇÃO DE ESCOLHAS DESTA CENA -->
            <div class="pt-4 border-t border-white/5 space-y-3">
              <div class="text-xs font-serif uppercase tracking-widest text-gold-dim font-bold flex items-center justify-between">
                <span>Escolhas / Ramificações ({{ node.choices?.length || 0 }}):</span>
              </div>

              <div v-if="!node.choices || node.choices.length === 0" class="text-xs text-gray-500 italic p-3 border border-white/5 rounded bg-black/30">
                <span v-if="node.isEnding">Esta cena encerra a história. Nenhuma escolha necessária.</span>
                <span v-else>Nenhuma escolha cadastrada. Jogadores ficarão travados nesta cena a menos que adicione uma escolha ou marque como final.</span>
              </div>

              <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div v-for="ch in node.choices" :key="ch.id" class="p-3 rounded-lg border border-white/10 bg-black/80 hover:border-gold/40 transition-colors flex flex-col justify-between">
                  <div class="space-y-1 mb-2">
                    <div class="font-serif text-xs text-parchment font-bold flex items-center justify-between">
                      <span>🔘 {{ ch.choiceText }}</span>
                    </div>

                    <!-- TESTE DE DADOS -->
                    <div v-if="ch.attributeReq || ch.skillReq" class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-950/60 border border-red-500/40 text-[10px] text-red-300 font-mono">
                      <span>🎲 Teste:</span>
                      <span class="font-bold text-white">{{ ch.attributeReq || '' }} {{ ch.attributeReq && ch.skillReq ? '+' : '' }} {{ ch.skillReq || '' }}</span>
                      <span>(Dif. {{ ch.difficulty || 1 }})</span>
                    </div>
                    <div v-else class="text-[10px] text-gray-500">
                      ⚡ Avanço Automático (Sem Teste)
                    </div>

                    <!-- DESTINOS -->
                    <div class="text-[10px] text-gray-400 space-y-0.5 pt-1">
                      <div class="flex items-center gap-1">
                        <span class="text-green-400 font-bold">↳ Sucesso:</span>
                        <span class="truncate">{{ getNodeSnippet(ch.successNodeId) || 'Não configurado' }}</span>
                      </div>
                      <div v-if="ch.failureNodeId" class="flex items-center gap-1">
                        <span class="text-red-400 font-bold">↳ Falha:</span>
                        <span class="truncate">{{ getNodeSnippet(ch.failureNodeId) }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="flex justify-end gap-2 pt-2 border-t border-white/5">
                    <button @click="openChoiceModal(node.id, ch)" class="text-[9px] font-serif uppercase tracking-widest text-gold hover:underline">
                      Editar
                    </button>
                    <button @click="confirmDeleteChoice(ch.id)" class="text-[9px] font-serif uppercase tracking-widest text-red-400 hover:underline">
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- ========================================================================= -->
      <!-- VIEW 2: INCURSÕES & CAÇADAS AFK (LISTA) -->
      <!-- ========================================================================= -->
      <div v-else-if="activeTab === 'missions' && !activeMissionDetail" class="space-y-6">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/5">
          <div>
            <h1 class="font-serif text-3xl text-parchment tracking-wide">Incursões &amp; Caçadas (Missões AFK)</h1>
            <p class="text-xs text-gray-400 font-light mt-1">Crie despachos com tempos de espera, etapas sequenciais de testes de dados e recompensas de sangue/experiência.</p>
          </div>
          <button @click="openMissionModal()" class="px-5 py-2.5 rounded bg-blood-red/20 border border-blood-red text-blood-red hover:bg-blood-red hover:text-white font-serif text-xs uppercase tracking-widest font-bold transition-all shadow-[0_0_15px_rgba(192,57,43,0.2)] flex items-center gap-2">
            <span>+</span> Nova Missão AFK
          </button>
        </div>

        <div v-if="loading" class="text-center py-20 text-blood-red text-xs font-serif uppercase tracking-widest animate-pulse">
          Carregando missões...
        </div>

        <div v-else-if="missions.length === 0" class="border border-white/5 bg-black/40 p-12 rounded-xl text-center space-y-4">
          <div class="text-4xl">⏳</div>
          <h3 class="font-serif text-lg text-parchment">Nenhuma missão criada ainda</h3>
          <p class="text-xs text-gray-400 max-w-md mx-auto">Crie operações urbanas ou zonas de caçada para os membros explorarem no radar.</p>
          <button @click="openMissionModal()" class="px-4 py-2 rounded bg-blood-red/20 border border-blood-red text-blood-red hover:bg-blood-red hover:text-white font-serif text-xs uppercase tracking-widest font-bold">
            Criar Minha Primeira Missão
          </button>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="m in missions" :key="m.id" class="border border-white/10 bg-black/60 hover:border-blood-red/50 rounded-xl p-6 flex flex-col justify-between transition-all group">
            <div>
              <div class="flex items-center justify-between text-[10px] font-serif uppercase tracking-widest mb-3">
                <span :class="m.category === 'HUNT' ? 'text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-500/30' : 'text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-500/30'">
                  {{ m.category === 'HUNT' ? '🩸 Caçada de Sangue' : '⚔️ Operação Tática' }}
                </span>
                <span class="text-gray-400 font-mono">⏱️ {{ m.durationMinutes }} min</span>
              </div>
              <h3 class="font-serif text-xl text-parchment group-hover:text-blood-red transition-colors mb-2 font-bold">{{ m.title }}</h3>
              <p class="text-xs text-gray-400 line-clamp-3 leading-relaxed mb-4">{{ m.description }}</p>

              <!-- RECOMPENSAS / PENALIDADES -->
              <div class="bg-black/50 p-2.5 rounded border border-white/5 mb-6 text-[10px] font-mono space-y-1">
                <div class="text-gray-400">Recompensas: <span class="text-green-400 font-bold">{{ formatJson(m.rewardsJson) }}</span></div>
                <div v-if="m.penaltiesJson && Object.keys(m.penaltiesJson).length > 0" class="text-gray-400">Penalidades: <span class="text-red-400">{{ formatJson(m.penaltiesJson) }}</span></div>
              </div>
            </div>

            <div class="space-y-3 pt-4 border-t border-white/5">
              <button @click="openMissionDetail(m.id)" class="w-full py-2 rounded bg-blood-red/10 border border-blood-red/40 hover:bg-blood-red hover:text-white text-blood-red text-xs font-serif uppercase tracking-widest font-bold transition-all">
                Gerenciar Etapas ({{ m.Actions?.length || 0 }}) →
              </button>
              
              <div class="flex gap-2">
                <button @click="openMissionModal(m)" class="flex-1 py-1.5 rounded bg-white/5 border border-white/10 hover:border-white/30 text-[10px] font-serif uppercase tracking-widest text-gray-300">
                  Editar Info
                </button>
                <button @click="confirmDeleteMission(m)" class="px-3 py-1.5 rounded bg-red-950/40 border border-red-500/30 hover:bg-red-900/60 text-[10px] font-serif uppercase tracking-widest text-red-300">
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========================================================================= -->
      <!-- VIEW 2.2: GERENCIADOR DE ETAPAS DA MISSÃO AFK (DETALHE) -->
      <!-- ========================================================================= -->
      <div v-else-if="activeTab === 'missions' && activeMissionDetail" class="space-y-8">
        <!-- HEADER DETALHE -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/10">
          <div class="space-y-1">
            <button @click="closeMissionDetail" class="text-[10px] text-gray-400 hover:text-blood-red flex items-center gap-1 font-serif uppercase tracking-widest transition-colors mb-2">
              <span>←</span> VOLTAR PARA A LISTA DE MISSÕES
            </button>
            <div class="flex items-center gap-3">
              <h1 class="font-serif text-2xl md:text-3xl text-blood-red font-bold">{{ activeMissionDetail.title }}</h1>
              <span class="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-serif uppercase tracking-widest text-gray-400">
                {{ activeMissionDetail.Actions?.length || 0 }} Etapas
              </span>
            </div>
            <p class="text-xs text-gray-400 max-w-3xl">{{ activeMissionDetail.description }}</p>
          </div>

          <div class="flex gap-3">
            <button @click="openActionModal()" class="px-4 py-2 rounded bg-blood-red/20 border border-blood-red text-blood-red hover:bg-blood-red hover:text-white font-serif text-xs uppercase tracking-widest font-bold transition-all flex items-center gap-2">
              <span>+</span> Adicionar Etapa
            </button>
          </div>
        </div>

        <!-- LISTA DE ETAPAS DA MISSÃO -->
        <div v-if="!activeMissionDetail.Actions || activeMissionDetail.Actions.length === 0" class="text-center py-16 border border-white/5 rounded-xl bg-black/40 space-y-3">
          <p class="text-xs text-gray-400 font-serif uppercase tracking-widest">Nenhuma etapa cadastrada nesta missão.</p>
          <button @click="openActionModal()" class="px-4 py-2 rounded bg-blood-red/20 border border-blood-red text-blood-red font-serif text-xs uppercase tracking-widest font-bold">
            Adicionar Primeira Etapa
          </button>
        </div>

        <div v-else class="space-y-4">
          <div v-for="act in activeMissionDetail.Actions" :key="act.id" class="border border-white/10 bg-black/60 rounded-xl p-6 space-y-4">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-3 border-b border-white/5">
              <div class="flex items-center gap-3">
                <span class="w-8 h-8 rounded-full border border-blood-red/40 bg-blood-red/10 text-blood-red flex items-center justify-center font-serif font-bold text-xs">
                  #{{ act.stepOrder }}
                </span>
                <div>
                  <h4 class="font-serif text-base text-parchment font-bold">{{ act.name }}</h4>
                  <div class="text-[10px] text-gray-400 font-mono">
                    🎲 Teste: <span class="text-gold font-bold">{{ act.attributeReq || '' }} + {{ act.skillReq || '' }}</span> (Dif. {{ act.difficulty || 6 }})
                  </div>
                </div>
              </div>

              <div class="flex gap-2">
                <button @click="openActionModal(act)" class="px-3 py-1 rounded bg-white/5 border border-white/10 hover:border-white/30 text-gray-300 text-[10px] font-serif uppercase tracking-widest">
                  Editar
                </button>
                <button @click="confirmDeleteAction(act.id)" class="px-3 py-1 rounded bg-red-950/40 border border-red-500/30 hover:bg-red-900/60 text-red-300 text-[10px] font-serif uppercase tracking-widest">
                  Excluir
                </button>
              </div>
            </div>

            <p class="text-xs text-gray-300">{{ act.description }}</p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
              <div class="bg-green-950/30 border border-green-500/30 p-3 rounded">
                <div class="text-[10px] font-serif uppercase tracking-widest text-green-400 font-bold mb-1">✓ Texto de Sucesso</div>
                <div class="text-gray-300 italic">{{ act.successText }}</div>
              </div>
              <div class="bg-red-950/30 border border-red-500/30 p-3 rounded">
                <div class="text-[10px] font-serif uppercase tracking-widest text-red-400 font-bold mb-1">✕ Texto de Falha</div>
                <div class="text-gray-300 italic">{{ act.failureText }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </main>

    <!-- ========================================================================= -->
    <!-- MODAL 1: ADICIONAR / EDITAR CRÔNICA (AVENTURA) -->
    <!-- ========================================================================= -->
    <div v-if="showAdventureModal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-[#0c0c0c] border border-gold/40 rounded-xl max-w-xl w-full p-6 space-y-6 shadow-2xl">
        <div class="flex justify-between items-center border-b border-white/10 pb-4">
          <h3 class="font-serif text-xl text-gold font-bold">
            {{ adventureForm.id ? 'Editar Crônica' : 'Nova Crônica Narrativa' }}
          </h3>
          <button @click="showAdventureModal = false" class="text-gray-400 hover:text-white">✕</button>
        </div>

        <form @submit.prevent="saveAdventure" class="space-y-4 text-xs font-serif">
          <div>
            <label class="block text-gray-400 uppercase tracking-wider mb-1">Título da Crônica *</label>
            <input type="text" v-model="adventureForm.title" required class="w-full bg-black border border-white/20 px-3 py-2 rounded text-parchment focus:border-gold outline-none" placeholder="Ex: A Vingança de Sangue">
          </div>

          <div>
            <label class="block text-gray-400 uppercase tracking-wider mb-1">Sinopse / Descrição *</label>
            <textarea v-model="adventureForm.description" required rows="4" class="w-full bg-black border border-white/20 px-3 py-2 rounded text-parchment focus:border-gold outline-none" placeholder="Uma breve introdução sobre a trama e os perigos da noite..."></textarea>
          </div>

          <div>
            <label class="block text-gray-400 uppercase tracking-wider mb-1">Limite de Conclusões por Personagem</label>
            <input type="number" v-model.number="adventureForm.maxCompletions" class="w-full bg-black border border-white/20 px-3 py-2 rounded text-parchment focus:border-gold outline-none" placeholder="Deixe vazio para jogadas ilimitadas (ex: 1)">
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button type="button" @click="showAdventureModal = false" class="px-4 py-2 rounded border border-white/10 text-gray-400 hover:text-white uppercase tracking-widest">Cancelar</button>
            <button type="submit" class="px-6 py-2 rounded bg-gold text-black font-bold uppercase tracking-widest hover:bg-white transition-colors">Salvar Crônica</button>
          </div>
        </form>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- MODAL 2: ADICIONAR / EDITAR CENA (NÓ) -->
    <!-- ========================================================================= -->
    <div v-if="showNodeModal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div class="bg-[#0c0c0c] border border-gold/40 rounded-xl max-w-2xl w-full p-6 space-y-6 shadow-2xl my-8">
        <div class="flex justify-between items-center border-b border-white/10 pb-4">
          <h3 class="font-serif text-xl text-gold font-bold">
            {{ nodeForm.id ? 'Editar Cena / Nó' : 'Nova Cena Narrativa' }}
          </h3>
          <button @click="showNodeModal = false" class="text-gray-400 hover:text-white">✕</button>
        </div>

        <form @submit.prevent="saveNode" class="space-y-4 text-xs font-serif">
          <div>
            <label class="block text-gray-400 uppercase tracking-wider mb-1">Quem está falando? (Orador / Speaker)</label>
            <input type="text" v-model="nodeForm.speakerName" class="w-full bg-black border border-white/20 px-3 py-2 rounded text-parchment focus:border-gold outline-none" placeholder="Ex: André Maranhão, Voz nas Sombras, etc. (Deixe vazio para narrador neutro)">
          </div>

          <div>
            <label class="block text-gray-400 uppercase tracking-wider mb-1">Texto Narrativo da Cena *</label>
            <textarea v-model="nodeForm.narrativeText" required rows="5" class="w-full bg-black border border-white/20 px-3 py-2 rounded text-parchment focus:border-gold outline-none font-sans text-sm" placeholder="Descreva a cena, os diálogos e o clima que o jogador irá presenciar..."></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label class="block text-gray-400 uppercase tracking-wider mb-1">URL Imagem de Fundo</label>
              <input type="text" v-model="nodeForm.backgroundImageUrl" class="w-full bg-black border border-white/20 px-3 py-1.5 rounded text-parchment focus:border-gold outline-none text-[11px]" placeholder="/story_assets/refugio.jpg">
            </div>
            <div>
              <label class="block text-gray-400 uppercase tracking-wider mb-1">Sprite Esquerda (URL)</label>
              <input type="text" v-model="nodeForm.leftCharacterImageUrl" class="w-full bg-black border border-white/20 px-3 py-1.5 rounded text-parchment focus:border-gold outline-none text-[11px]" placeholder="/story_assets/membro1.png">
            </div>
            <div>
              <label class="block text-gray-400 uppercase tracking-wider mb-1">Sprite Direita (URL)</label>
              <input type="text" v-model="nodeForm.rightCharacterImageUrl" class="w-full bg-black border border-white/20 px-3 py-1.5 rounded text-parchment focus:border-gold outline-none text-[11px]" placeholder="/story_assets/npc2.png">
            </div>
          </div>

          <div class="p-3 rounded border border-white/10 bg-black/40 flex items-center gap-3">
            <input type="checkbox" id="isEndingCheck" v-model="nodeForm.isEnding" class="w-4 h-4 rounded text-blood-red focus:ring-0">
            <label for="isEndingCheck" class="text-xs text-parchment uppercase tracking-wider cursor-pointer">
              Esta é uma Cena de Desfecho / Fim da Crônica (Encerra a história ao chegar aqui)
            </label>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button type="button" @click="showNodeModal = false" class="px-4 py-2 rounded border border-white/10 text-gray-400 hover:text-white uppercase tracking-widest">Cancelar</button>
            <button type="submit" class="px-6 py-2 rounded bg-gold text-black font-bold uppercase tracking-widest hover:bg-white transition-colors">Salvar Cena</button>
          </div>
        </form>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- MODAL 3: ADICIONAR / EDITAR ESCOLHA (CHOICE) -->
    <!-- ========================================================================= -->
    <div v-if="showChoiceModal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div class="bg-[#0c0c0c] border border-gold/40 rounded-xl max-w-xl w-full p-6 space-y-6 shadow-2xl my-8">
        <div class="flex justify-between items-center border-b border-white/10 pb-4">
          <h3 class="font-serif text-xl text-gold font-bold">
            {{ choiceForm.id ? 'Editar Escolha' : 'Nova Escolha na Cena' }}
          </h3>
          <button @click="showChoiceModal = false" class="text-gray-400 hover:text-white">✕</button>
        </div>

        <form @submit.prevent="saveChoice" class="space-y-4 text-xs font-serif">
          <div>
            <label class="block text-gray-400 uppercase tracking-wider mb-1">Texto da Ação no Botão *</label>
            <input type="text" v-model="choiceForm.choiceText" required class="w-full bg-black border border-white/20 px-3 py-2 rounded text-parchment focus:border-gold outline-none" placeholder="Ex: Tentar arrombar a porta dos fundos">
          </div>

          <!-- CONFIGURAÇÃO DO TESTE DE DADOS -->
          <div class="p-4 rounded-lg border border-white/10 bg-black/40 space-y-3">
            <div class="text-[11px] uppercase tracking-wider text-gold-dim font-bold">Configuração de Teste de Dados (V5)</div>
            
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label class="block text-gray-400 uppercase tracking-wider mb-1 text-[10px]">Atributo</label>
                <select v-model="choiceForm.attributeReq" class="w-full bg-black border border-white/20 px-2 py-1.5 rounded text-parchment focus:border-gold outline-none text-xs">
                  <option :value="''">Nenhum</option>
                  <option v-for="attr in ATTR_LIST" :key="attr" :value="attr">{{ attr }}</option>
                </select>
              </div>

              <div>
                <label class="block text-gray-400 uppercase tracking-wider mb-1 text-[10px]">Habilidade</label>
                <select v-model="choiceForm.skillReq" class="w-full bg-black border border-white/20 px-2 py-1.5 rounded text-parchment focus:border-gold outline-none text-xs">
                  <option :value="''">Nenhuma</option>
                  <option v-for="skill in SKILL_LIST" :key="skill" :value="skill">{{ skill }}</option>
                </select>
              </div>

              <div>
                <label class="block text-gray-400 uppercase tracking-wider mb-1 text-[10px]">Dificuldade (Sucessos)</label>
                <input type="number" min="1" max="10" v-model.number="choiceForm.difficulty" class="w-full bg-black border border-white/20 px-2 py-1.5 rounded text-parchment focus:border-gold outline-none text-xs" placeholder="1">
              </div>
            </div>
          </div>

          <!-- DESTINOS -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-green-400 uppercase tracking-wider mb-1">Cena Destino (Sucesso) *</label>
              <select v-model="choiceForm.successNodeId" required class="w-full bg-black border border-green-500/40 px-3 py-2 rounded text-parchment focus:border-green-400 outline-none text-xs">
                <option :value="''">Selecione a Cena de Sucesso...</option>
                <option v-for="(node, idx) in activeAdventureDetail?.nodes" :key="node.id" :value="node.id">
                  Cena #{{ Number(idx) + 1 }}: {{ node.narrativeText.substring(0, 35) }}...
                </option>
              </select>
            </div>

            <div>
              <label class="block text-red-400 uppercase tracking-wider mb-1">Cena Destino (Falha - Opcional)</label>
              <select v-model="choiceForm.failureNodeId" class="w-full bg-black border border-red-500/40 px-3 py-2 rounded text-parchment focus:border-red-400 outline-none text-xs">
                <option :value="''">Mesma cena de sucesso / Sem falha</option>
                <option v-for="(node, idx) in activeAdventureDetail?.nodes" :key="node.id" :value="node.id">
                  Cena #{{ Number(idx) + 1 }}: {{ node.narrativeText.substring(0, 35) }}...
                </option>
              </select>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button type="button" @click="showChoiceModal = false" class="px-4 py-2 rounded border border-white/10 text-gray-400 hover:text-white uppercase tracking-widest">Cancelar</button>
            <button type="submit" class="px-6 py-2 rounded bg-gold text-black font-bold uppercase tracking-widest hover:bg-white transition-colors">Salvar Escolha</button>
          </div>
        </form>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- MODAL 4: ADICIONAR / EDITAR MISSÃO AFK -->
    <!-- ========================================================================= -->
    <div v-if="showMissionModal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div class="bg-[#0c0c0c] border border-blood-red/40 rounded-xl max-w-xl w-full p-6 space-y-6 shadow-2xl my-8">
        <div class="flex justify-between items-center border-b border-white/10 pb-4">
          <h3 class="font-serif text-xl text-blood-red font-bold">
            {{ missionForm.id ? 'Editar Missão AFK' : 'Nova Missão AFK / Caçada' }}
          </h3>
          <button @click="showMissionModal = false" class="text-gray-400 hover:text-white">✕</button>
        </div>

        <form @submit.prevent="saveMission" class="space-y-4 text-xs font-serif">
          <div>
            <label class="block text-gray-400 uppercase tracking-wider mb-1">Título da Missão *</label>
            <input type="text" v-model="missionForm.title" required class="w-full bg-black border border-white/20 px-3 py-2 rounded text-parchment focus:border-blood-red outline-none" placeholder="Ex: Incursão ao Porto Velho">
          </div>

          <div>
            <label class="block text-gray-400 uppercase tracking-wider mb-1">Descrição Narrativa *</label>
            <textarea v-model="missionForm.description" required rows="3" class="w-full bg-black border border-white/20 px-3 py-2 rounded text-parchment focus:border-blood-red outline-none" placeholder="Detalhes táticos da operação..."></textarea>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block text-gray-400 uppercase tracking-wider mb-1">Categoria *</label>
              <select v-model="missionForm.category" required class="w-full bg-black border border-white/20 px-3 py-2 rounded text-parchment focus:border-blood-red outline-none text-xs">
                <option value="OPERATION">⚔️ Operação</option>
                <option value="HUNT">🩸 Caçada</option>
              </select>
            </div>

            <div>
              <label class="block text-gray-400 uppercase tracking-wider mb-1">Duração (Minutos) *</label>
              <input type="number" min="1" v-model.number="missionForm.durationMinutes" required class="w-full bg-black border border-white/20 px-3 py-2 rounded text-parchment focus:border-blood-red outline-none" placeholder="5">
            </div>

            <div>
              <label class="block text-gray-400 uppercase tracking-wider mb-1">Dificuldade Base</label>
              <input type="number" min="1" max="10" v-model.number="missionForm.baseDifficulty" class="w-full bg-black border border-white/20 px-3 py-2 rounded text-parchment focus:border-blood-red outline-none" placeholder="6">
            </div>
          </div>

          <!-- RECOMPENSAS / PENALIDADES -->
          <div class="p-3 rounded border border-white/10 bg-black/40 space-y-3">
            <div class="text-[11px] uppercase tracking-wider text-green-400 font-bold">Recompensas na Conclusão</div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-gray-400 uppercase tracking-wider mb-1 text-[10px]">Alteração de Fome</label>
                <input type="number" v-model.number="missionForm.rewardHunger" class="w-full bg-black border border-white/20 px-2 py-1.5 rounded text-parchment focus:border-green-400 outline-none text-xs" placeholder="-1 (reduz) ou 0">
              </div>
              <div>
                <label class="block text-gray-400 uppercase tracking-wider mb-1 text-[10px]">Experiência (XP)</label>
                <input type="number" min="0" v-model.number="missionForm.rewardExp" class="w-full bg-black border border-white/20 px-2 py-1.5 rounded text-parchment focus:border-green-400 outline-none text-xs" placeholder="Ex: 5">
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button type="button" @click="showMissionModal = false" class="px-4 py-2 rounded border border-white/10 text-gray-400 hover:text-white uppercase tracking-widest">Cancelar</button>
            <button type="submit" class="px-6 py-2 rounded bg-blood-red text-white font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors">Salvar Missão</button>
          </div>
        </form>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- MODAL 5: ADICIONAR / EDITAR ETAPA DA MISSÃO (ACTION) -->
    <!-- ========================================================================= -->
    <div v-if="showActionModal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div class="bg-[#0c0c0c] border border-blood-red/40 rounded-xl max-w-xl w-full p-6 space-y-6 shadow-2xl my-8">
        <div class="flex justify-between items-center border-b border-white/10 pb-4">
          <h3 class="font-serif text-xl text-blood-red font-bold">
            {{ actionForm.id ? 'Editar Etapa da Missão' : 'Nova Etapa da Missão' }}
          </h3>
          <button @click="showActionModal = false" class="text-gray-400 hover:text-white">✕</button>
        </div>

        <form @submit.prevent="saveAction" class="space-y-4 text-xs font-serif">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="sm:col-span-2">
              <label class="block text-gray-400 uppercase tracking-wider mb-1">Nome da Etapa *</label>
              <input type="text" v-model="actionForm.name" required class="w-full bg-black border border-white/20 px-3 py-2 rounded text-parchment focus:border-blood-red outline-none" placeholder="Ex: Infiltração Silenciosa">
            </div>

            <div>
              <label class="block text-gray-400 uppercase tracking-wider mb-1">Ordem do Passo *</label>
              <input type="number" min="1" v-model.number="actionForm.stepOrder" required class="w-full bg-black border border-white/20 px-3 py-2 rounded text-parchment focus:border-blood-red outline-none" placeholder="1">
            </div>
          </div>

          <div>
            <label class="block text-gray-400 uppercase tracking-wider mb-1">Descrição do Desafio *</label>
            <textarea v-model="actionForm.description" required rows="2" class="w-full bg-black border border-white/20 px-3 py-2 rounded text-parchment focus:border-blood-red outline-none" placeholder="O que o personagem enfrenta neste momento?"></textarea>
          </div>

          <!-- TESTE DE DADOS -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block text-gray-400 uppercase tracking-wider mb-1">Atributo</label>
              <select v-model="actionForm.attributeReq" class="w-full bg-black border border-white/20 px-2 py-1.5 rounded text-parchment focus:border-blood-red outline-none text-xs">
                <option :value="''">Nenhum</option>
                <option v-for="attr in ATTR_LIST" :key="attr" :value="attr">{{ attr }}</option>
              </select>
            </div>

            <div>
              <label class="block text-gray-400 uppercase tracking-wider mb-1">Habilidade</label>
              <select v-model="actionForm.skillReq" class="w-full bg-black border border-white/20 px-2 py-1.5 rounded text-parchment focus:border-blood-red outline-none text-xs">
                <option :value="''">Nenhuma</option>
                <option v-for="skill in SKILL_LIST" :key="skill" :value="skill">{{ skill }}</option>
              </select>
            </div>

            <div>
              <label class="block text-gray-400 uppercase tracking-wider mb-1">Dificuldade Alvo</label>
              <input type="number" min="1" max="10" v-model.number="actionForm.difficulty" class="w-full bg-black border border-white/20 px-2 py-1.5 rounded text-parchment focus:border-blood-red outline-none text-xs" placeholder="6">
            </div>
          </div>

          <div>
            <label class="block text-green-400 uppercase tracking-wider mb-1">Narrativa de Sucesso *</label>
            <textarea v-model="actionForm.successText" required rows="2" class="w-full bg-black border border-green-500/40 px-3 py-2 rounded text-parchment focus:border-green-400 outline-none text-xs" placeholder="Ex: Você desliza pelas sombras sem ser notado..."></textarea>
          </div>

          <div>
            <label class="block text-red-400 uppercase tracking-wider mb-1">Narrativa de Falha *</label>
            <textarea v-model="actionForm.failureText" required rows="2" class="w-full bg-black border border-red-500/40 px-3 py-2 rounded text-parchment focus:border-red-400 outline-none text-xs" placeholder="Ex: Um guarda nota o ruído e soa o alarme..."></textarea>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button type="button" @click="showActionModal = false" class="px-4 py-2 rounded border border-white/10 text-gray-400 hover:text-white uppercase tracking-widest">Cancelar</button>
            <button type="submit" class="px-6 py-2 rounded bg-blood-red text-white font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors">Salvar Etapa</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const activeTab = ref<'stories' | 'missions'>('stories')
const loading = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

const masterInfo = ref<any>(null)

// ==================== LISTAS CONSTANTES V5 ====================
const ATTR_LIST = [
  'Força', 'Destreza', 'Vigor',
  'Carisma', 'Manipulação', 'Autocontrole',
  'Inteligência', 'Raciocínio', 'Percepção'
]

const SKILL_LIST = [
  'Prontidão', 'Briga', 'Esquiva', 'Empatia', 'Intimidação', 'Liderança', 'Lábia', 'Manha', 'Atletismo', 'Furtividade',
  'Ofícios', 'Condução', 'Armas de Fogo', 'Armas Brancas', 'Ladinagem', 'Sobrevivência', 'Segurança',
  'Acadêmicos', 'Computador', 'Finanças', 'Investigação', 'Medicina', 'Ocultismo', 'Política', 'Ciências'
]

// ==================== ESTADO: CRÔNICAS / AVENTURAS ====================
const adventures = ref<any[]>([])
const activeAdventureDetail = ref<any>(null)
const selectedFirstNodeId = ref<string | undefined>(undefined)

const showAdventureModal = ref(false)
const adventureForm = ref<any>({
  id: null,
  title: '',
  description: '',
  maxCompletions: null
})

const showNodeModal = ref(false)
const nodeForm = ref<any>({
  id: null,
  adventureId: '',
  narrativeText: '',
  speakerName: '',
  backgroundImageUrl: '',
  leftCharacterImageUrl: '',
  rightCharacterImageUrl: '',
  isEnding: false
})

const showChoiceModal = ref(false)
const choiceForm = ref<any>({
  id: null,
  nodeId: '',
  choiceText: '',
  attributeReq: '',
  skillReq: '',
  difficulty: 1,
  successNodeId: '',
  failureNodeId: ''
})

// ==================== ESTADO: MISSÕES AFK ====================
const missions = ref<any[]>([])
const activeMissionDetail = ref<any>(null)

const showMissionModal = ref(false)
const missionForm = ref<any>({
  id: null,
  title: '',
  description: '',
  category: 'OPERATION',
  durationMinutes: 5,
  baseDifficulty: 6,
  rewardHunger: 0,
  rewardExp: 5
})

const showActionModal = ref(false)
const actionForm = ref<any>({
  id: null,
  missionId: '',
  stepOrder: 1,
  name: '',
  description: '',
  attributeReq: '',
  skillReq: '',
  difficulty: 6,
  successText: '',
  failureText: ''
})

// ==================== CARREGAMENTO INICIAL ====================
onMounted(async () => {
  const localUserStr = sessionStorage.getItem('lira_user') || localStorage.getItem('lira_user')
  if (localUserStr) {
    try {
      masterInfo.value = JSON.parse(localUserStr)
    } catch (e) {
      console.error(e)
    }
  }

  await loadAdventures()
  await loadMissions()
})

// ==================== MÉTODOS: CRÔNICAS ====================
const loadAdventures = async () => {
  loading.value = true
  try {
    const res = await api.get('/api/gm/story/adventures')
    adventures.value = res.data || []
  } catch (err: any) {
    errorMsg.value = 'Erro ao carregar aventuras: ' + (err.response?.data?.error || err.message)
  } finally {
    loading.value = false
  }
}

const openAdventureModal = (adv?: any) => {
  if (adv) {
    adventureForm.value = {
      id: adv.id,
      title: adv.title,
      description: adv.description,
      maxCompletions: adv.maxCompletions
    }
  } else {
    adventureForm.value = {
      id: null,
      title: '',
      description: '',
      maxCompletions: null
    }
  }
  showAdventureModal.value = true
}

const saveAdventure = async () => {
  try {
    if (adventureForm.value.id) {
      await api.put(`/api/gm/story/adventures/${adventureForm.value.id}`, adventureForm.value)
      successMsg.value = 'Crônica atualizada com sucesso!'
    } else {
      await api.post('/api/gm/story/adventures', adventureForm.value)
      successMsg.value = 'Crônica criada com sucesso!'
    }
    showAdventureModal.value = false
    await loadAdventures()
  } catch (err: any) {
    errorMsg.value = err.response?.data?.error || 'Erro ao salvar crônica'
  }
}

const confirmDeleteAdventure = async (adv: any) => {
  if (confirm(`Tem certeza que deseja excluir a crônica "${adv.title}" e todas as suas cenas?`)) {
    try {
      await api.delete(`/api/gm/story/adventures/${adv.id}`)
      successMsg.value = 'Crônica excluída com sucesso!'
      await loadAdventures()
    } catch (err: any) {
      errorMsg.value = err.response?.data?.error || 'Erro ao excluir crônica'
    }
  }
}

const openAdventureDetail = async (adventureId: string) => {
  loading.value = true
  try {
    const res = await api.get(`/api/gm/story/adventures/${adventureId}`)
    activeAdventureDetail.value = res.data
    selectedFirstNodeId.value = res.data.firstNodeId
  } catch (err: any) {
    errorMsg.value = err.response?.data?.error || 'Erro ao carregar detalhes da crônica'
  } finally {
    loading.value = false
  }
}

const closeAdventureDetail = async () => {
  activeAdventureDetail.value = null
  await loadAdventures()
}

const saveFirstNodeId = async () => {
  if (!activeAdventureDetail.value) return
  try {
    await api.put(`/api/gm/story/adventures/${activeAdventureDetail.value.id}`, {
      firstNodeId: selectedFirstNodeId.value || null
    })
    activeAdventureDetail.value.firstNodeId = selectedFirstNodeId.value
    successMsg.value = 'Cena inicial atualizada!'
  } catch (err: any) {
    errorMsg.value = 'Erro ao definir nó inicial: ' + (err.response?.data?.error || err.message)
  }
}

const getNodeSnippet = (nodeId?: string) => {
  if (!nodeId || !activeAdventureDetail.value?.nodes) return ''
  const n = activeAdventureDetail.value.nodes.find((item: any) => item.id === nodeId)
  if (!n) return ''
  return `${n.speakerName ? `[${n.speakerName}] ` : ''}${n.narrativeText.substring(0, 45)}...`
}

// ==================== MÉTODOS: NÓS / CENAS ====================
const openNodeModal = (node?: any) => {
  if (node) {
    nodeForm.value = {
      id: node.id,
      adventureId: activeAdventureDetail.value.id,
      narrativeText: node.narrativeText,
      speakerName: node.speakerName || '',
      backgroundImageUrl: node.backgroundImageUrl || '',
      leftCharacterImageUrl: node.leftCharacterImageUrl || '',
      rightCharacterImageUrl: node.rightCharacterImageUrl || '',
      isEnding: !!node.isEnding
    }
  } else {
    nodeForm.value = {
      id: null,
      adventureId: activeAdventureDetail.value.id,
      narrativeText: '',
      speakerName: '',
      backgroundImageUrl: '',
      leftCharacterImageUrl: '',
      rightCharacterImageUrl: '',
      isEnding: false
    }
  }
  showNodeModal.value = true
}

const saveNode = async () => {
  try {
    if (nodeForm.value.id) {
      await api.put(`/api/gm/story/nodes/${nodeForm.value.id}`, nodeForm.value)
      successMsg.value = 'Cena atualizada com sucesso!'
    } else {
      await api.post('/api/gm/story/nodes', nodeForm.value)
      successMsg.value = 'Cena criada com sucesso!'
    }
    showNodeModal.value = false
    await openAdventureDetail(activeAdventureDetail.value.id)
  } catch (err: any) {
    errorMsg.value = err.response?.data?.error || 'Erro ao salvar cena'
  }
}

const confirmDeleteNode = async (nodeId: string) => {
  if (confirm('Deseja excluir esta cena e todas as suas escolhas?')) {
    try {
      await api.delete(`/api/gm/story/nodes/${nodeId}`)
      successMsg.value = 'Cena excluída com sucesso!'
      await openAdventureDetail(activeAdventureDetail.value.id)
    } catch (err: any) {
      errorMsg.value = err.response?.data?.error || 'Erro ao excluir cena'
    }
  }
}

// ==================== MÉTODOS: ESCOLHAS ====================
const openChoiceModal = (nodeId: string, choice?: any) => {
  if (choice) {
    choiceForm.value = {
      id: choice.id,
      nodeId,
      choiceText: choice.choiceText,
      attributeReq: choice.attributeReq || '',
      skillReq: choice.skillReq || '',
      difficulty: choice.difficulty || 1,
      successNodeId: choice.successNodeId || '',
      failureNodeId: choice.failureNodeId || ''
    }
  } else {
    choiceForm.value = {
      id: null,
      nodeId,
      choiceText: '',
      attributeReq: '',
      skillReq: '',
      difficulty: 1,
      successNodeId: '',
      failureNodeId: ''
    }
  }
  showChoiceModal.value = true
}

const saveChoice = async () => {
  try {
    if (choiceForm.value.id) {
      await api.put(`/api/gm/story/choices/${choiceForm.value.id}`, choiceForm.value)
      successMsg.value = 'Escolha atualizada com sucesso!'
    } else {
      await api.post('/api/gm/story/choices', choiceForm.value)
      successMsg.value = 'Escolha adicionada com sucesso!'
    }
    showChoiceModal.value = false
    await openAdventureDetail(activeAdventureDetail.value.id)
  } catch (err: any) {
    errorMsg.value = err.response?.data?.error || 'Erro ao salvar escolha'
  }
}

const confirmDeleteChoice = async (choiceId: string) => {
  if (confirm('Excluir esta escolha?')) {
    try {
      await api.delete(`/api/gm/story/choices/${choiceId}`)
      successMsg.value = 'Escolha excluída!'
      await openAdventureDetail(activeAdventureDetail.value.id)
    } catch (err: any) {
      errorMsg.value = err.response?.data?.error || 'Erro ao excluir escolha'
    }
  }
}

// ==================== MÉTODOS: MISSÕES AFK ====================
const loadMissions = async () => {
  try {
    const res = await api.get('/api/gm/missions-idle')
    missions.value = res.data || []
  } catch (err: any) {
    console.error('Erro ao carregar missões:', err)
  }
}

const formatJson = (val: any) => {
  if (!val || typeof val !== 'object') return 'Nenhum'
  return Object.entries(val).map(([k, v]) => `${k}: ${v}`).join(', ') || 'Nenhum'
}

const openMissionModal = (m?: any) => {
  if (m) {
    missionForm.value = {
      id: m.id,
      title: m.title,
      description: m.description,
      category: m.category,
      durationMinutes: m.durationMinutes,
      baseDifficulty: m.baseDifficulty,
      rewardHunger: m.rewardsJson?.hunger || 0,
      rewardExp: m.rewardsJson?.exp || 0
    }
  } else {
    missionForm.value = {
      id: null,
      title: '',
      description: '',
      category: 'OPERATION',
      durationMinutes: 5,
      baseDifficulty: 6,
      rewardHunger: 0,
      rewardExp: 5
    }
  }
  showMissionModal.value = true
}

const saveMission = async () => {
  const payload = {
    title: missionForm.value.title,
    description: missionForm.value.description,
    category: missionForm.value.category,
    durationMinutes: missionForm.value.durationMinutes,
    baseDifficulty: missionForm.value.baseDifficulty,
    rewardsJson: {
      hunger: missionForm.value.rewardHunger || 0,
      exp: missionForm.value.rewardExp || 0
    }
  }

  try {
    if (missionForm.value.id) {
      await api.put(`/api/gm/missions-idle/${missionForm.value.id}`, payload)
      successMsg.value = 'Missão atualizada!'
    } else {
      await api.post('/api/gm/missions-idle', payload)
      successMsg.value = 'Missão criada com sucesso!'
    }
    showMissionModal.value = false
    await loadMissions()
  } catch (err: any) {
    errorMsg.value = err.response?.data?.error || 'Erro ao salvar missão'
  }
}

const confirmDeleteMission = async (m: any) => {
  if (confirm(`Excluir a missão "${m.title}" e todas as suas etapas?`)) {
    try {
      await api.delete(`/api/gm/missions-idle/${m.id}`)
      successMsg.value = 'Missão excluída!'
      await loadMissions()
    } catch (err: any) {
      errorMsg.value = err.response?.data?.error || 'Erro ao excluir missão'
    }
  }
}

const openMissionDetail = async (missionId: string) => {
  loading.value = true
  try {
    const res = await api.get(`/api/gm/missions-idle/${missionId}`)
    activeMissionDetail.value = res.data
  } catch (err: any) {
    errorMsg.value = err.response?.data?.error || 'Erro ao carregar detalhes da missão'
  } finally {
    loading.value = false
  }
}

const closeMissionDetail = async () => {
  activeMissionDetail.value = null
  await loadMissions()
}

// ==================== MÉTODOS: ETAPAS DA MISSÃO ====================
const openActionModal = (act?: any) => {
  if (act) {
    actionForm.value = {
      id: act.id,
      missionId: activeMissionDetail.value.id,
      stepOrder: act.stepOrder,
      name: act.name,
      description: act.description,
      attributeReq: act.attributeReq || '',
      skillReq: act.skillReq || '',
      difficulty: act.difficulty || 6,
      successText: act.successText,
      failureText: act.failureText
    }
  } else {
    actionForm.value = {
      id: null,
      missionId: activeMissionDetail.value.id,
      stepOrder: (activeMissionDetail.value.Actions?.length || 0) + 1,
      name: '',
      description: '',
      attributeReq: '',
      skillReq: '',
      difficulty: 6,
      successText: '',
      failureText: ''
    }
  }
  showActionModal.value = true
}

const saveAction = async () => {
  try {
    if (actionForm.value.id) {
      await api.put(`/api/gm/missions-idle/actions/${actionForm.value.id}`, actionForm.value)
      successMsg.value = 'Etapa atualizada com sucesso!'
    } else {
      await api.post(`/api/gm/missions-idle/${activeMissionDetail.value.id}/actions`, actionForm.value)
      successMsg.value = 'Etapa adicionada à missão!'
    }
    showActionModal.value = false
    await openMissionDetail(activeMissionDetail.value.id)
  } catch (err: any) {
    errorMsg.value = err.response?.data?.error || 'Erro ao salvar etapa'
  }
}

const confirmDeleteAction = async (actionId: string) => {
  if (confirm('Excluir esta etapa da missão?')) {
    try {
      await api.delete(`/api/gm/missions-idle/actions/${actionId}`)
      successMsg.value = 'Etapa excluída!'
      await openMissionDetail(activeMissionDetail.value.id)
    } catch (err: any) {
      errorMsg.value = err.response?.data?.error || 'Erro ao excluir etapa'
    }
  }
}

const handleLogout = () => {
  sessionStorage.removeItem('lira_token')
  sessionStorage.removeItem('lira_user')
  localStorage.removeItem('token')
  localStorage.removeItem('lira_token')
  localStorage.removeItem('lira_user')
  router.push('/login')
}
</script>
