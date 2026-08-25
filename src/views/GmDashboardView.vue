<template>
  <div class="min-h-screen bg-[#030304] text-parchment font-sans relative overflow-x-hidden selection:bg-blood-red selection:text-white flex flex-col">
    <!-- NOISE & GLOW OVERLAYS -->
    <div class="fixed inset-0 pointer-events-none opacity-20 mix-blend-overlay z-0" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>
    <div class="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-blood-red/10 blur-[180px] rounded-full pointer-events-none z-0"></div>

    <!-- TOPBAR HEADER -->
    <header class="relative z-30 border-b border-white/5 bg-black/80 backdrop-blur-md sticky top-0 h-16 flex items-center px-6 justify-between">
      <div class="flex items-center gap-4">
        <div class="w-9 h-9 rounded-full border border-gold/40 flex items-center justify-center bg-black shadow-[0_0_12px_rgba(212,175,55,0.2)]">
          <span class="text-gold font-serif text-lg font-bold">L</span>
        </div>
        <div class="flex flex-col">
          <div class="flex items-center gap-2">
            <span class="font-serif text-base tracking-widest text-parchment font-bold">LIRA<span class="text-blood-red">RPG</span></span>
            <span class="px-2 py-0.5 rounded bg-gold/10 border border-gold/30 text-[9px] font-serif uppercase tracking-widest text-gold font-bold">GM Studio</span>
          </div>
          <span class="text-[9px] uppercase tracking-[2px] text-gray-500 font-serif">Central de Controle do Mundo Vivo</span>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <!-- LEAD MASTER BADGE -->
        <div v-if="isLeadMaster" class="flex items-center gap-2 px-3 py-1 rounded-full border border-gold/40 bg-gold/10 text-gold text-xs font-serif tracking-widest shadow-[0_0_15px_rgba(212,175,55,0.2)]">
          <span class="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
          <span>👑 SUPER MESTRE: {{ masterInfo?.name || 'Sid' }}</span>
        </div>
        <div v-else class="flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-gray-300 text-xs font-serif tracking-widest">
          <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span>MESTRE: {{ masterInfo?.name || 'Narrador' }}</span>
        </div>

        <button @click="handleLogout" class="font-serif text-[10px] tracking-[2px] uppercase text-gray-400 hover:text-white transition-colors border border-white/10 px-3 py-1.5 rounded bg-black/40 hover:bg-black/80">
          Sair
        </button>
      </div>
    </header>

    <!-- WORKSPACE BODY WITH SIDEBAR -->
    <div class="flex-1 flex relative z-10">
      
      <!-- SIDEBAR -->
      <aside class="w-64 border-r border-white/5 bg-black/60 backdrop-blur-sm flex flex-col justify-between p-4 hidden md:flex shrink-0">
        <div class="space-y-1">
          <div class="px-3 py-2 text-[10px] font-serif uppercase tracking-[2px] text-gray-500 font-bold">
            Mundo &amp; Campanhas
          </div>
          
          <button 
            @click="setTab('overview')"
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-serif uppercase tracking-wider transition-all text-left"
            :class="activeTab === 'overview' ? 'bg-gold/10 text-gold border border-gold/30 font-bold shadow-[0_0_10px_rgba(212,175,55,0.15)]' : 'text-gray-400 hover:text-parchment hover:bg-white/5'"
          >
            <span>📊</span>
            <span>Visão Geral</span>
          </button>

          <button 
            @click="setTab('stories')"
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-serif uppercase tracking-wider transition-all text-left"
            :class="activeTab === 'stories' ? 'bg-gold/10 text-gold border border-gold/30 font-bold shadow-[0_0_10px_rgba(212,175,55,0.15)]' : 'text-gray-400 hover:text-parchment hover:bg-white/5'"
          >
            <span>📖</span>
            <span class="flex-1">Crônicas (Livro-Jogo)</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-gray-300 font-sans">{{ adventures.length }}</span>
          </button>

          <button 
            @click="setTab('missions')"
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-serif uppercase tracking-wider transition-all text-left"
            :class="activeTab === 'missions' ? 'bg-blood-red/10 text-blood-red border border-blood-red/30 font-bold shadow-[0_0_10px_rgba(192,57,43,0.15)]' : 'text-gray-400 hover:text-parchment hover:bg-white/5'"
          >
            <span>⏳</span>
            <span class="flex-1">Incursões &amp; Caçadas</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-gray-300 font-sans">{{ missions.length }}</span>
          </button>

          <div class="pt-4 px-3 py-2 text-[10px] font-serif uppercase tracking-[2px] text-gray-500 font-bold">
            Jogadores &amp; Acervo
          </div>

          <button 
            @click="setTab('players')"
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-serif uppercase tracking-wider transition-all text-left"
            :class="activeTab === 'players' ? 'bg-white/10 text-parchment border border-white/20 font-bold' : 'text-gray-400 hover:text-parchment hover:bg-white/5'"
          >
            <span>👥</span>
            <span>Monitor de Jogadores</span>
          </button>

          <button 
            @click="setTab('compendium')"
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-serif uppercase tracking-wider transition-all text-left"
            :class="activeTab === 'compendium' ? 'bg-gold/10 text-gold border border-gold/30 font-bold' : 'text-gray-400 hover:text-parchment hover:bg-white/5'"
          >
            <span>📚</span>
            <span>Compêndio de Nocturna</span>
          </button>
        </div>

        <div class="border-t border-white/5 pt-4">
          <div class="p-3 rounded-lg bg-black/40 border border-white/5 text-[11px] text-gray-400 space-y-1">
            <div class="text-gold font-serif font-bold uppercase tracking-wider text-[10px]">Nocturna V5 CORE</div>
            <p class="text-[10px] text-gray-500 leading-tight">Campanha viva interligada por nós e testes de atributos.</p>
          </div>
        </div>
      </aside>

      <!-- MAIN VIEWPORT -->
      <main class="flex-1 flex flex-col overflow-y-auto p-6 md:p-8 max-w-7xl mx-auto w-full">
        
        <!-- MOBILE TABS -->
        <div class="flex md:hidden gap-2 pb-4 overflow-x-auto border-b border-white/5 mb-6 shrink-0">
          <button @click="setTab('overview')" :class="activeTab === 'overview' ? 'bg-gold text-black font-bold' : 'bg-black/60 text-gray-400'" class="px-3 py-1.5 rounded text-xs font-serif uppercase whitespace-nowrap">Overview</button>
          <button @click="setTab('stories')" :class="activeTab === 'stories' ? 'bg-gold text-black font-bold' : 'bg-black/60 text-gray-400'" class="px-3 py-1.5 rounded text-xs font-serif uppercase whitespace-nowrap">Crônicas</button>
          <button @click="setTab('missions')" :class="activeTab === 'missions' ? 'bg-blood-red text-white font-bold' : 'bg-black/60 text-gray-400'" class="px-3 py-1.5 rounded text-xs font-serif uppercase whitespace-nowrap">Incursões</button>
          <button @click="setTab('players')" :class="activeTab === 'players' ? 'bg-white/20 text-white' : 'bg-black/60 text-gray-400'" class="px-3 py-1.5 rounded text-xs font-serif uppercase whitespace-nowrap">Jogadores</button>
          <button @click="setTab('compendium')" :class="activeTab === 'compendium' ? 'bg-gold/30 text-gold' : 'bg-black/60 text-gray-400'" class="px-3 py-1.5 rounded text-xs font-serif uppercase whitespace-nowrap">Compêndio</button>
        </div>

        <!-- ALERTS -->
        <div v-if="successMsg" class="mb-6 p-4 rounded-lg bg-green-950/60 border border-green-500/50 text-green-300 text-xs font-serif tracking-wider flex justify-between items-center animate-fade-in shadow-lg">
          <span>✓ {{ successMsg }}</span>
          <button @click="successMsg = ''" class="text-gray-400 hover:text-white">✕</button>
        </div>
        <div v-if="errorMsg" class="mb-6 p-4 rounded-lg bg-red-950/60 border border-red-500/50 text-red-300 text-xs font-serif tracking-wider flex justify-between items-center animate-fade-in shadow-lg">
          <span>✕ {{ errorMsg }}</span>
          <button @click="errorMsg = ''" class="text-gray-400 hover:text-white">✕</button>
        </div>

        <!-- ========================================================================= -->
        <!-- TAB 1: VISÃO GERAL (DASHBOARD) -->
        <!-- ========================================================================= -->
        <section v-if="activeTab === 'overview'" class="space-y-8 animate-fade-in">
          <!-- WELCOME BANNER -->
          <div class="border border-gold/30 bg-gradient-to-r from-black via-zinc-950 to-black p-8 rounded-2xl relative overflow-hidden shadow-[0_0_30px_rgba(212,175,55,0.08)]">
            <div class="relative z-10 max-w-3xl space-y-3">
              <div class="flex items-center gap-2 text-gold font-serif uppercase tracking-[3px] text-xs font-bold">
                <span>🏙️ Campanha Canônica em Andamento</span>
              </div>
              <h1 class="font-serif text-3xl md:text-4xl text-parchment font-bold leading-tight">
                Estúdio de Criação de <span class="text-gold">Nocturna</span>
              </h1>
              <p class="text-xs md:text-sm text-gray-400 leading-relaxed font-light">
                Bem-vindo ao centro de comando narrativo. Aqui você cria histórias interativas com testes mecânicos de Vampiro V5, gerencia caçadas urbanas e monitora as consequências das escolhas dos jogadores.
              </p>
              <div class="flex flex-wrap gap-3 pt-3">
                <button @click="setTab('stories'); openAdventureModal()" class="px-4 py-2 rounded-lg bg-gold text-black font-serif text-xs uppercase tracking-widest font-bold hover:bg-gold-dim transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                  + Nova Crônica
                </button>
                <button @click="setTab('missions'); openMissionModal()" class="px-4 py-2 rounded-lg bg-blood-red/20 border border-blood-red/50 text-blood-red hover:bg-blood-red hover:text-white font-serif text-xs uppercase tracking-widest font-bold transition-all">
                  + Nova Incursão / Caçada
                </button>
                <button @click="setTab('compendium')" class="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 font-serif text-xs uppercase tracking-widest transition-all">
                  Explorar Compêndio →
                </button>
              </div>
            </div>
          </div>

          <!-- METRICS GRID -->
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div class="border border-white/10 bg-black/60 p-4 rounded-xl flex flex-col justify-between hover:border-gold/40 transition-all">
              <span class="text-[10px] font-serif uppercase tracking-widest text-gray-400">Crônicas</span>
              <div class="font-serif text-2xl font-bold text-gold mt-2">{{ overviewStats?.adventuresCount ?? adventures.length }}</div>
              <span class="text-[9px] text-gray-500 mt-1">Histórias Ativas</span>
            </div>

            <div class="border border-white/10 bg-black/60 p-4 rounded-xl flex flex-col justify-between hover:border-gold/40 transition-all">
              <span class="text-[10px] font-serif uppercase tracking-widest text-gray-400">Cenas / Nós</span>
              <div class="font-serif text-2xl font-bold text-parchment mt-2">{{ overviewStats?.nodesCount ?? 0 }}</div>
              <span class="text-[9px] text-gray-500 mt-1">Nós Narrativos</span>
            </div>

            <div class="border border-white/10 bg-black/60 p-4 rounded-xl flex flex-col justify-between hover:border-blood-red/40 transition-all">
              <span class="text-[10px] font-serif uppercase tracking-widest text-gray-400">Incursões AFK</span>
              <div class="font-serif text-2xl font-bold text-blood-red mt-2">{{ overviewStats?.missionsCount ?? missions.length }}</div>
              <span class="text-[9px] text-gray-500 mt-1">Caçadas &amp; Despachos</span>
            </div>

            <div class="border border-white/10 bg-black/60 p-4 rounded-xl flex flex-col justify-between hover:border-white/30 transition-all">
              <span class="text-[10px] font-serif uppercase tracking-widest text-gray-400">NPCs V5</span>
              <div class="font-serif text-2xl font-bold text-purple-400 mt-2">{{ overviewStats?.npcsCount ?? 25 }}</div>
              <span class="text-[9px] text-gray-500 mt-1">Acervo Canônico</span>
            </div>

            <div class="border border-white/10 bg-black/60 p-4 rounded-xl flex flex-col justify-between hover:border-white/30 transition-all">
              <span class="text-[10px] font-serif uppercase tracking-widest text-gray-400">Bairros</span>
              <div class="font-serif text-2xl font-bold text-blue-400 mt-2">{{ overviewStats?.locationsCount ?? 35 }}</div>
              <span class="text-[9px] text-gray-500 mt-1">Zonas de Nocturna</span>
            </div>

            <div class="border border-white/10 bg-black/60 p-4 rounded-xl flex flex-col justify-between hover:border-white/30 transition-all">
              <span class="text-[10px] font-serif uppercase tracking-widest text-gray-400">Armas &amp; Itens</span>
              <div class="font-serif text-2xl font-bold text-emerald-400 mt-2">{{ overviewStats?.equipmentsCount ?? 55 }}</div>
              <span class="text-[9px] text-gray-500 mt-1">Equipamentos</span>
            </div>
          </div>

          <!-- RECENT ACTIVITY FEED -->
          <div class="border border-white/10 bg-black/60 rounded-2xl p-6 space-y-4">
            <div class="flex justify-between items-center pb-3 border-b border-white/5">
              <div class="flex items-center gap-2">
                <span class="text-base font-serif font-bold text-parchment">📜 Registro de Atividades em Nocturna</span>
                <span class="text-[10px] px-2 py-0.5 rounded bg-white/10 text-gray-400">Últimas Conclusões</span>
              </div>
            </div>

            <div v-if="recentLogs.length === 0" class="text-center py-8 text-xs text-gray-500 font-serif">
              Nenhuma jogada concluída recentemente registrada no servidor.
            </div>

            <div v-else class="divide-y divide-white/5">
              <div v-for="log in recentLogs" :key="log.id" class="py-3 flex items-center justify-between text-xs">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full border border-white/10 bg-zinc-900 overflow-hidden shrink-0 flex items-center justify-center">
                    <img v-if="log.character?.avatarUrl" :src="log.character.avatarUrl" class="w-full h-full object-cover" />
                    <span v-else class="text-xs">🦇</span>
                  </div>
                  <div>
                    <span class="font-bold text-parchment">{{ log.character?.name || 'Vampiro Anônimo' }}</span>
                    <span class="text-gray-500 ml-2">concluiu</span>
                    <span class="text-gold font-serif ml-1">{{ log.activityType === 'STORY_ADVENTURE' ? 'uma Crônica Narrativa' : 'uma Incursão / Caçada' }}</span>
                  </div>
                </div>
                <span class="text-[10px] text-gray-500">{{ formatDate(log.createdAt) }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- ========================================================================= -->
        <!-- TAB 2: CRÔNICAS NARRATIVAS (LISTA E ESTÚDIO DIVIDIDO) -->
        <!-- ========================================================================= -->
        <section v-if="activeTab === 'stories'" class="space-y-6 animate-fade-in">
          
          <!-- LIST VIEW (WHEN NO CHRONICLE SELECTED) -->
          <div v-if="!activeAdventureDetail" class="space-y-6">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/5">
              <div>
                <h1 class="font-serif text-2xl md:text-3xl text-parchment font-bold tracking-wide">Crônicas Narrativas (Livro-Jogo)</h1>
                <p class="text-xs text-gray-400 font-light mt-1">Crie histórias com nós ramificados, diálogos com sprites e testes mecânicos de V5.</p>
              </div>
              <button @click="openAdventureModal()" class="px-5 py-2.5 rounded-lg bg-gold text-black hover:bg-gold-dim font-serif text-xs uppercase tracking-widest font-bold transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)] flex items-center gap-2">
                <span>+</span> Nova Crônica
              </button>
            </div>

            <div v-if="loading" class="text-center py-20 text-gold text-xs font-serif uppercase tracking-widest animate-pulse">
              Carregando crônicas...
            </div>

            <div v-else-if="adventures.length === 0" class="border border-white/5 bg-black/40 p-12 rounded-2xl text-center space-y-4">
              <div class="text-5xl">📜</div>
              <h3 class="font-serif text-lg text-parchment font-bold">Nenhuma crônica criada ainda</h3>
              <p class="text-xs text-gray-400 max-w-md mx-auto">Você ainda não possui crônicas associadas ao seu Mestre. Comece criando sua primeira aventura interativa.</p>
              <button @click="openAdventureModal()" class="px-5 py-2.5 rounded-lg bg-gold text-black font-serif text-xs uppercase tracking-widest font-bold">
                Criar Minha Primeira Crônica
              </button>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div v-for="adv in adventures" :key="adv.id" class="border border-white/10 bg-gradient-to-b from-zinc-950 to-black hover:border-gold/60 rounded-2xl overflow-hidden flex flex-col justify-between transition-all group shadow-xl">
                <!-- CARD HEADER BANNER -->
                <div class="h-28 bg-zinc-900 relative p-4 flex flex-col justify-between border-b border-white/5 overflow-hidden">
                  <div class="absolute inset-0 bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-500" style="background-image: url('https://images.unsplash.com/photo-1518002171953-a080ee817e1f?q=80&w=600&auto=format&fit=crop');"></div>
                  <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent"></div>
                  
                  <div class="relative z-10 flex justify-between items-start">
                    <span class="px-2 py-0.5 rounded bg-black/70 border border-white/10 text-[9px] font-serif uppercase tracking-widest text-gold font-bold backdrop-blur-sm">
                      {{ adv.nodes?.length || 0 }} Cenas
                    </span>
                    <span v-if="adv.firstNodeId" class="px-2 py-0.5 rounded bg-green-950/80 border border-green-500/40 text-[9px] font-serif uppercase tracking-widest text-green-300 font-bold backdrop-blur-sm">
                      ● Nó Inicial Ativo
                    </span>
                    <span v-else class="px-2 py-0.5 rounded bg-red-950/80 border border-red-500/40 text-[9px] font-serif uppercase tracking-widest text-red-300 font-bold backdrop-blur-sm">
                      ⚠️ Sem Nó Inicial
                    </span>
                  </div>

                  <h3 class="relative z-10 font-serif text-lg text-parchment font-bold group-hover:text-gold transition-colors truncate">
                    {{ adv.title }}
                  </h3>
                </div>

                <!-- CARD BODY -->
                <div class="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <p class="text-xs text-gray-400 line-clamp-3 leading-relaxed font-light">
                    {{ adv.description || 'Sem descrição informada.' }}
                  </p>

                  <div class="space-y-2 pt-3 border-t border-white/5">
                    <button @click="openAdventureDetail(adv.id)" class="w-full py-2.5 rounded-lg bg-gold text-black hover:bg-gold-dim text-xs font-serif uppercase tracking-widest font-bold transition-all shadow-[0_0_15px_rgba(212,175,55,0.15)] flex items-center justify-center gap-2">
                      <span>🎮 Abrir Estúdio de Cenas</span>
                    </button>
                    
                    <div class="flex gap-2">
                      <button @click="openAdventureModal(adv)" class="flex-1 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-white/30 text-[10px] font-serif uppercase tracking-widest text-gray-300">
                        Editar Dados
                      </button>
                      <button @click="confirmDeleteAdventure(adv)" class="px-3 py-1.5 rounded-lg bg-red-950/30 border border-red-500/30 hover:bg-red-900/50 text-[10px] font-serif uppercase tracking-widest text-red-300">
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- SPLIT-SCREEN CHRONICLE STUDIO (WHEN DETAIL OPEN) -->
          <div v-else class="space-y-6">
            <!-- STUDIO BREADCRUMB & HEADER -->
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10">
              <div class="space-y-1">
                <button @click="closeAdventureDetail" class="text-[10px] text-gray-400 hover:text-gold flex items-center gap-1 font-serif uppercase tracking-widest transition-colors">
                  <span>←</span> Voltar para Todas as Crônicas
                </button>
                <div class="flex items-center gap-3">
                  <h1 class="font-serif text-2xl md:text-3xl text-gold font-bold">{{ activeAdventureDetail.title }}</h1>
                  <span class="px-2.5 py-0.5 rounded-full bg-gold/10 border border-gold/30 text-[10px] font-serif uppercase tracking-widest text-gold font-bold">
                    {{ activeAdventureDetail.nodes?.length || 0 }} Cenas Criadas
                  </span>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <button @click="openNodeModal()" class="px-4 py-2 rounded-lg bg-gold text-black hover:bg-gold-dim font-serif text-xs uppercase tracking-widest font-bold transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)] flex items-center gap-2">
                  <span>+</span> Adicionar Nova Cena
                </button>
              </div>
            </div>

            <!-- SPLIT VIEW CONTAINER -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[650px]">
              
              <!-- LEFT PANEL: SCENE SELECTOR LIST (4 COLS) -->
              <div class="lg:col-span-4 border border-white/10 bg-black/60 rounded-2xl p-4 flex flex-col space-y-3 overflow-hidden">
                <div class="flex justify-between items-center pb-2 border-b border-white/5">
                  <span class="text-xs font-serif font-bold uppercase tracking-widest text-gray-400">Navegador de Cenas</span>
                  <span class="text-[10px] text-gray-500">{{ activeAdventureDetail.nodes?.length || 0 }} nós</span>
                </div>

                <div v-if="!activeAdventureDetail.nodes || activeAdventureDetail.nodes.length === 0" class="p-8 text-center text-gray-500 text-xs font-serif">
                  Nenhuma cena adicionada. Clique em "+ Adicionar Nova Cena".
                </div>

                <div v-else class="flex-1 overflow-y-auto space-y-2 pr-1">
                  <div 
                    v-for="(node, index) in activeAdventureDetail.nodes" 
                    :key="node.id"
                    @click="selectNode(node)"
                    class="p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-2"
                    :class="selectedNode?.id === node.id 
                      ? 'border-gold bg-gold/10 shadow-[0_0_15px_rgba(212,175,55,0.15)]' 
                      : 'border-white/5 bg-zinc-950/60 hover:border-white/20 hover:bg-white/5'"
                  >
                    <div class="flex justify-between items-center">
                      <div class="flex items-center gap-2">
                        <span class="text-[10px] font-serif font-bold px-1.5 py-0.5 rounded" :class="selectedNode?.id === node.id ? 'bg-gold text-black' : 'bg-white/10 text-gray-400'">
                          #{{ (Number(index) || 0) + 1 }}
                        </span>
                        <span class="text-xs font-serif font-bold truncate text-parchment">
                          {{ node.speakerName || 'Narrativa' }}
                        </span>
                      </div>

                      <div class="flex items-center gap-1.5">
                        <span v-if="activeAdventureDetail.firstNodeId === node.id" class="px-1.5 py-0.5 rounded bg-green-950 border border-green-500 text-[8px] text-green-300 font-bold uppercase tracking-wider">
                          Início
                        </span>
                        <span v-if="node.isEnding" class="px-1.5 py-0.5 rounded bg-red-950 border border-red-500 text-[8px] text-red-300 font-bold uppercase tracking-wider">
                          Fim
                        </span>
                      </div>
                    </div>

                    <p class="text-[11px] text-gray-400 line-clamp-2 font-light leading-snug">
                      {{ node.narrativeText }}
                    </p>

                    <div class="flex justify-between items-center text-[9px] text-gray-500 pt-2 border-t border-white/5">
                      <span>{{ node.choices?.length || 0 }} Escolhas</span>
                      <span class="text-gold-dim">Clique para editar →</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- RIGHT PANEL: ACTIVE SCENE STUDIO & CHOICES (8 COLS) -->
              <div class="lg:col-span-8 border border-white/10 bg-black/60 rounded-2xl p-6 flex flex-col space-y-6">
                
                <div v-if="!selectedNode" class="flex-1 flex flex-col items-center justify-center text-center p-12 text-gray-500 space-y-3">
                  <span class="text-4xl">🎬</span>
                  <h3 class="font-serif text-lg text-parchment font-bold">Nenhuma Cena Selecionada</h3>
                  <p class="text-xs max-w-sm">Selecione uma cena no menu à esquerda para editar seus diálogos, imagens e opções de ramificação.</p>
                </div>

                <div v-else class="space-y-6">
                  <!-- SCENE TOOLBAR -->
                  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-white/10">
                    <div class="flex items-center gap-3">
                      <span class="font-serif text-xl font-bold text-gold">Editor da Cena</span>
                      <span class="text-xs text-gray-400 font-mono">ID: {{ selectedNode.id }}</span>
                    </div>

                    <div class="flex flex-wrap gap-2">
                      <button 
                        v-if="activeAdventureDetail.firstNodeId !== selectedNode.id"
                        @click="setAsStartingNode(selectedNode.id)" 
                        class="px-3 py-1.5 rounded-lg bg-green-950/60 border border-green-500/40 text-green-300 hover:bg-green-900/60 text-xs font-serif uppercase tracking-wider font-bold transition-all"
                      >
                        ✓ Definir Como Cena Inicial
                      </button>
                      <button @click="openNodeModal(selectedNode)" class="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-white/30 text-xs font-serif uppercase tracking-wider text-gray-300">
                        Editar Cena
                      </button>
                      <button @click="confirmDeleteNode(selectedNode)" class="px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-500/30 hover:bg-red-900/60 text-xs font-serif uppercase tracking-wider text-red-300">
                        Excluir Cena
                      </button>
                    </div>
                  </div>

                  <!-- SCENE VISUAL PREVIEW & NARRATIVE -->
                  <div class="border border-white/10 rounded-xl overflow-hidden bg-zinc-950">
                    <!-- BACKGROUND WITH SPRITES -->
                    <div class="h-48 bg-zinc-900 relative flex items-end justify-between px-8 pb-2 overflow-hidden border-b border-white/5">
                      <div class="absolute inset-0 bg-cover bg-center opacity-60" :style="selectedNode.backgroundImageUrl ? `background-image: url('${selectedNode.backgroundImageUrl}')` : `background-image: url('https://images.unsplash.com/photo-1518002171953-a080ee817e1f?q=80&w=1200&auto=format&fit=crop')`"></div>
                      <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

                      <!-- SPRITE ESQUERDA -->
                      <div class="relative z-10 w-24 h-36 flex items-end justify-center">
                        <img v-if="selectedNode.leftCharacterImageUrl" :src="selectedNode.leftCharacterImageUrl" class="max-h-full object-contain filter drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]" />
                        <span v-else class="text-[9px] text-gray-500 bg-black/70 px-2 py-0.5 rounded border border-white/10">Sem Sprite Esq.</span>
                      </div>

                      <!-- SPEAKER CENTER BADGE -->
                      <div class="relative z-10 mb-2">
                        <span class="px-3 py-1 rounded-full bg-gold/20 border border-gold/50 text-gold text-xs font-serif font-bold uppercase tracking-widest backdrop-blur-md">
                          {{ selectedNode.speakerName || 'O Narrador' }}
                        </span>
                      </div>

                      <!-- SPRITE DIREITA -->
                      <div class="relative z-10 w-24 h-36 flex items-end justify-center">
                        <img v-if="selectedNode.rightCharacterImageUrl" :src="selectedNode.rightCharacterImageUrl" class="max-h-full object-contain filter drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]" />
                        <span v-else class="text-[9px] text-gray-500 bg-black/70 px-2 py-0.5 rounded border border-white/10">Sem Sprite Dir.</span>
                      </div>
                    </div>

                    <!-- NARRATIVE TEXT BOX -->
                    <div class="p-5 bg-black/80 space-y-2">
                      <p class="text-sm text-parchment font-serif leading-relaxed font-light whitespace-pre-wrap">
                        {{ selectedNode.narrativeText }}
                      </p>
                    </div>
                  </div>

                  <!-- CHOICES & BRANCHING SECTION -->
                  <div class="space-y-4">
                    <div class="flex justify-between items-center pb-2 border-b border-white/5">
                      <div class="flex items-center gap-2">
                        <span class="font-serif text-sm font-bold text-parchment uppercase tracking-wider">🔀 Escolhas &amp; Testes de Dados V5</span>
                        <span class="text-[10px] px-2 py-0.5 rounded bg-white/10 text-gray-400">{{ selectedNode.choices?.length || 0 }} botões</span>
                      </div>
                      <button @click="openChoiceModal(null, selectedNode.id)" class="px-3 py-1 rounded-lg bg-gold/10 border border-gold/30 hover:bg-gold hover:text-black text-gold text-xs font-serif uppercase tracking-wider font-bold transition-all">
                        + Nova Escolha
                      </button>
                    </div>

                    <div v-if="!selectedNode.choices || selectedNode.choices.length === 0" class="p-6 rounded-xl border border-dashed border-white/10 text-center text-xs text-gray-500 font-serif">
                      <p v-if="selectedNode.isEnding" class="text-red-400">Esta cena é marcada como Desfecho (Fim de História). Não requer botões de escolha.</p>
                      <p v-else>Nenhuma escolha configurada para esta cena. Adicione uma escolha para permitir que o jogador continue a história.</p>
                    </div>

                    <div v-else class="grid grid-cols-1 gap-3">
                      <div v-for="choice in selectedNode.choices" :key="choice.id" class="p-4 rounded-xl border border-white/10 bg-zinc-950/80 flex flex-col justify-between gap-3 hover:border-gold/40 transition-all">
                        <div class="flex justify-between items-start">
                          <div class="space-y-1">
                            <span class="font-serif text-sm text-parchment font-bold">{{ choice.choiceText }}</span>
                            <div class="flex flex-wrap gap-2 text-[10px]">
                              <span v-if="choice.attributeReq" class="px-2 py-0.5 rounded bg-blue-950/60 border border-blue-500/30 text-blue-300 font-bold uppercase">
                                Teste: {{ choice.attributeReq }} + {{ choice.skillReq || 'Perícia' }} (Dif. {{ choice.difficulty }})
                              </span>
                              <span v-else class="px-2 py-0.5 rounded bg-white/5 text-gray-400 font-bold uppercase">
                                Escolha Direta (Sem Teste)
                              </span>
                            </div>
                          </div>

                          <div class="flex gap-1.5">
                            <button @click="openChoiceModal(choice, selectedNode.id)" class="px-2 py-1 rounded bg-white/5 border border-white/10 hover:border-white/30 text-[10px] text-gray-300">
                              Editar
                            </button>
                            <button @click="confirmDeleteChoice(choice)" class="px-2 py-1 rounded bg-red-950/30 border border-red-500/30 hover:bg-red-900/50 text-[10px] text-red-300">
                              ✕
                            </button>
                          </div>
                        </div>

                        <!-- DESTINATION NODES -->
                        <div class="text-[10px] text-gray-400 flex flex-wrap items-center gap-3 pt-2 border-t border-white/5">
                          <div class="flex items-center gap-1">
                            <span class="text-green-400">✓ Sucesso vai para:</span>
                            <span class="text-parchment font-bold">{{ getNodeName(choice.successNodeId) }}</span>
                          </div>
                          <div v-if="choice.attributeReq" class="flex items-center gap-1">
                            <span class="text-red-400">✕ Falha vai para:</span>
                            <span class="text-parchment font-bold">{{ getNodeName(choice.failureNodeId) }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ========================================================================= -->
        <!-- TAB 3: INCURSÕES & CAÇADAS (AFK) -->
        <!-- ========================================================================= -->
        <section v-if="activeTab === 'missions'" class="space-y-6 animate-fade-in">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/5">
            <div>
              <h1 class="font-serif text-2xl md:text-3xl text-parchment font-bold tracking-wide">Incursões &amp; Caçadas (Missões AFK)</h1>
              <p class="text-xs text-gray-400 font-light mt-1">Despachos táticos no radar de Nocturna com tempo de espera e resolução automática de testes.</p>
            </div>
            <button @click="openMissionModal()" class="px-5 py-2.5 rounded-lg bg-blood-red text-white hover:bg-red-700 font-serif text-xs uppercase tracking-widest font-bold transition-all shadow-[0_0_15px_rgba(192,57,43,0.3)] flex items-center gap-2">
              <span>+</span> Nova Missão AFK
            </button>
          </div>

          <div v-if="missions.length === 0" class="border border-white/5 bg-black/40 p-12 rounded-2xl text-center space-y-4">
            <div class="text-5xl">⏳</div>
            <h3 class="font-serif text-lg text-parchment font-bold">Nenhuma missão AFK criada ainda</h3>
            <p class="text-xs text-gray-400 max-w-md mx-auto">Crie operações táticas ou zonas de caçada de sangue para os personagens explorarem no radar.</p>
            <button @click="openMissionModal()" class="px-5 py-2.5 rounded-lg bg-blood-red text-white font-serif text-xs uppercase tracking-widest font-bold">
              Criar Primeira Missão
            </button>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="mission in missions" :key="mission.id" class="border border-white/10 bg-gradient-to-b from-zinc-950 to-black hover:border-blood-red/60 rounded-2xl p-6 flex flex-col justify-between transition-all group shadow-xl">
              <div class="space-y-3">
                <div class="flex items-center justify-between text-[10px] font-serif uppercase tracking-widest">
                  <span class="px-2 py-0.5 rounded font-bold" :class="mission.category === 'HUNT' ? 'bg-red-950 text-red-300 border border-red-500/40' : 'bg-blue-950 text-blue-300 border border-blue-500/40'">
                    {{ mission.category === 'HUNT' ? '🩸 Caçada de Sangue' : '🎯 Operação Tática' }}
                  </span>
                  <span class="text-gray-400 font-mono">{{ mission.durationMinutes }} Minutos</span>
                </div>

                <h3 class="font-serif text-xl text-parchment font-bold group-hover:text-blood-red transition-colors">
                  {{ mission.title }}
                </h3>

                <p class="text-xs text-gray-400 line-clamp-3 leading-relaxed font-light">
                  {{ mission.description }}
                </p>

                <div class="text-[10px] text-gray-500 pt-2 border-t border-white/5 space-y-1">
                  <div>Dificuldade Base: <span class="text-parchment font-bold">{{ mission.baseDifficulty }}</span></div>
                  <div>Etapas Mecânicas: <span class="text-gold font-bold">{{ mission.Actions?.length || 0 }} ações</span></div>
                </div>
              </div>

              <div class="space-y-2 pt-4 border-t border-white/5 mt-4">
                <button @click="openMissionDetail(mission.id)" class="w-full py-2.5 rounded-lg bg-blood-red/20 border border-blood-red/40 hover:bg-blood-red hover:text-white text-blood-red text-xs font-serif uppercase tracking-widest font-bold transition-all">
                  Gerenciar Etapas ({{ mission.Actions?.length || 0 }}) →
                </button>
                
                <div class="flex gap-2">
                  <button @click="openMissionModal(mission)" class="flex-1 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-white/30 text-[10px] font-serif uppercase tracking-widest text-gray-300">
                    Editar
                  </button>
                  <button @click="confirmDeleteMission(mission)" class="px-3 py-1.5 rounded-lg bg-red-950/30 border border-red-500/30 hover:bg-red-900/50 text-[10px] font-serif uppercase tracking-widest text-red-300">
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ========================================================================= -->
        <!-- TAB 4: MONITOR DE JOGADORES -->
        <!-- ========================================================================= -->
        <section v-if="activeTab === 'players'" class="space-y-6 animate-fade-in">
          <div class="pb-6 border-b border-white/5">
            <h1 class="font-serif text-2xl md:text-3xl text-parchment font-bold tracking-wide">Monitor de Jogadores &amp; Vampiros Ativos</h1>
            <p class="text-xs text-gray-400 font-light mt-1">Acompanhe todos os personagens criados pelos jogadores que habitam a metrópole de Nocturna.</p>
          </div>

          <div v-if="playersList.length === 0" class="text-center py-16 text-xs text-gray-500 font-serif border border-white/5 rounded-2xl bg-black/40">
            Nenhum personagem de jogador cadastrado ainda.
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="player in playersList" :key="player.id" class="border border-white/10 bg-zinc-950/80 rounded-2xl p-5 space-y-4 hover:border-gold/40 transition-all">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-full border border-gold/30 overflow-hidden bg-black shrink-0 flex items-center justify-center">
                  <img v-if="player.avatarUrl" :src="player.avatarUrl" class="w-full h-full object-cover" />
                  <span v-else class="text-lg">🧛</span>
                </div>
                <div>
                  <h3 class="font-serif text-base font-bold text-parchment">{{ player.name }}</h3>
                  <p class="text-[10px] text-gold font-serif uppercase tracking-wider">{{ player.DefinitionClan?.name || player.clan?.name || 'Caitiff' }} • Geração {{ player.generation }}ª</p>
                  <p class="text-[9px] text-gray-500 font-mono">Jogador: {{ player.User?.name || player.user?.name || player.User?.email || player.user?.email || 'N/A' }}</p>
                </div>
              </div>

              <div class="grid grid-cols-3 gap-2 text-center text-[10px] pt-3 border-t border-white/5 font-serif">
                <div class="p-2 rounded bg-black/60 border border-white/5">
                  <span class="text-gray-500 block">Fome</span>
                  <span class="text-blood-red font-bold text-sm">{{ player.hunger }}/5</span>
                </div>
                <div class="p-2 rounded bg-black/60 border border-white/5">
                  <span class="text-gray-500 block">Humanidade</span>
                  <span class="text-gold font-bold text-sm">{{ player.humanity }}/10</span>
                </div>
                <div class="p-2 rounded bg-black/60 border border-white/5">
                  <span class="text-gray-500 block">Status</span>
                  <span class="text-green-400 font-bold text-[10px]">{{ player.isAwake ? 'Ativo' : 'Torpor' }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ========================================================================= -->
        <!-- TAB 5: COMPÊNDIO CANÔNICO (NPCS, LOCAIS, ARSENAL) -->
        <!-- ========================================================================= -->
        <section v-if="activeTab === 'compendium'" class="space-y-6 animate-fade-in">
          <div class="pb-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 class="font-serif text-2xl md:text-3xl text-parchment font-bold tracking-wide">Compêndio Canônico de Nocturna</h1>
              <p class="text-xs text-gray-400 font-light mt-1">Biblioteca central com os 25 NPCs oficiais, zonas urbanas e arsenal de itens cadastrados no banco.</p>
            </div>
            
            <div class="flex gap-2">
              <button @click="compendiumCategory = 'npcs'" :class="compendiumCategory === 'npcs' ? 'bg-gold text-black font-bold' : 'bg-white/5 text-gray-400'" class="px-3 py-1.5 rounded-lg text-xs font-serif uppercase tracking-wider">🎭 NPCs ({{ compendiumNpcs.length }})</button>
              <button @click="compendiumCategory = 'locations'" :class="compendiumCategory === 'locations' ? 'bg-gold text-black font-bold' : 'bg-white/5 text-gray-400'" class="px-3 py-1.5 rounded-lg text-xs font-serif uppercase tracking-wider">🏙️ Locais ({{ compendiumLocations.length }})</button>
              <button @click="compendiumCategory = 'equipments'" :class="compendiumCategory === 'equipments' ? 'bg-gold text-black font-bold' : 'bg-white/5 text-gray-400'" class="px-3 py-1.5 rounded-lg text-xs font-serif uppercase tracking-wider">🗡️ Itens ({{ compendiumEquipments.length }})</button>
            </div>
          </div>

          <!-- NPCS VIEW -->
          <div v-if="compendiumCategory === 'npcs'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="npc in compendiumNpcs" :key="npc.id" class="border border-white/10 bg-zinc-950 rounded-2xl p-5 space-y-3 hover:border-gold/40 transition-all">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-full border border-gold/40 overflow-hidden bg-black shrink-0 flex items-center justify-center">
                  <img v-if="npc.avatarUrl" :src="npc.avatarUrl" class="w-full h-full object-cover" />
                  <span v-else class="text-lg">👑</span>
                </div>
                <div>
                  <h3 class="font-serif text-base font-bold text-parchment">{{ npc.name }}</h3>
                  <span class="text-[10px] text-gold font-serif uppercase tracking-wider">{{ npc.DefinitionClan?.name || npc.clan?.name || 'Ancião' }} • Geração {{ npc.generation }}ª</span>
                </div>
              </div>
              <p class="text-xs text-gray-400 font-light line-clamp-3 leading-relaxed">{{ npc.history || npc.concept || 'Personagem canônico de Nocturna.' }}</p>
            </div>
          </div>

          <!-- LOCATIONS VIEW -->
          <div v-if="compendiumCategory === 'locations'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="loc in compendiumLocations" :key="loc.id" class="border border-white/10 bg-zinc-950 rounded-2xl p-5 space-y-2 hover:border-blue-500/40 transition-all">
              <div class="flex justify-between items-center">
                <h3 class="font-serif text-base font-bold text-parchment">{{ loc.name }}</h3>
                <span class="text-[9px] px-2 py-0.5 rounded bg-blue-950 border border-blue-500/30 text-blue-300 font-bold uppercase">
                  {{ loc.level === 1 ? 'Metrópole' : loc.level === 2 ? 'Zona' : 'Bairro' }}
                </span>
              </div>
              <p class="text-xs text-gray-400 font-light line-clamp-2">{{ loc.description || 'Zona urbana de Nocturna.' }}</p>
            </div>
          </div>

          <!-- EQUIPMENTS VIEW -->
          <div v-if="compendiumCategory === 'equipments'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div v-for="eq in compendiumEquipments" :key="eq.id" class="border border-white/10 bg-zinc-950 rounded-xl p-4 space-y-1 hover:border-emerald-500/40 transition-all">
              <div class="flex justify-between items-center text-[9px] text-gray-500 uppercase font-mono">
                <span>{{ eq.type }}</span>
                <span v-if="eq.damage" class="text-blood-red font-bold">Dano: {{ eq.damage }}</span>
              </div>
              <h3 class="font-serif text-sm font-bold text-parchment truncate">{{ eq.name }}</h3>
              <p class="text-[10px] text-gray-400 line-clamp-2 font-light">{{ eq.description }}</p>
            </div>
          </div>
        </section>

      </main>
    </div>

    <!-- ========================================================================= -->
    <!-- MODAIS DE CRIAÇÃO / EDIÇÃO (ADVENTURE, NODE, CHOICE, MISSION, ACTION) -->
    <!-- ========================================================================= -->
    
    <!-- MODAL CRÔNICA -->
    <div v-if="showAdventureModal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div class="bg-zinc-950 border border-gold/40 w-full max-w-lg rounded-2xl p-6 space-y-6 shadow-2xl animate-fade-in">
        <h3 class="font-serif text-xl text-gold font-bold">{{ adventureForm.id ? 'Editar Crônica' : 'Nova Crônica' }}</h3>
        <div class="space-y-4 text-xs font-serif">
          <div>
            <label class="block text-gray-400 uppercase tracking-wider mb-1">Título da Crônica</label>
            <input v-model="adventureForm.title" class="w-full bg-black border border-white/10 rounded-lg p-3 text-parchment focus:border-gold outline-none" placeholder="Ex: A Noite Inicial" />
          </div>
          <div>
            <label class="block text-gray-400 uppercase tracking-wider mb-1">Sinopse / Descrição</label>
            <textarea v-model="adventureForm.description" rows="3" class="w-full bg-black border border-white/10 rounded-lg p-3 text-parchment focus:border-gold outline-none" placeholder="Uma breve introdução à história..."></textarea>
          </div>
        </div>
        <div class="flex justify-end gap-3 pt-4 border-t border-white/10">
          <button @click="showAdventureModal = false" class="px-4 py-2 rounded-lg bg-white/5 text-gray-400 hover:text-white text-xs uppercase font-serif">Cancelar</button>
          <button @click="saveAdventure" class="px-5 py-2 rounded-lg bg-gold text-black hover:bg-gold-dim text-xs uppercase font-serif font-bold">Salvar Crônica</button>
        </div>
      </div>
    </div>

    <!-- MODAL CENA / NÓ -->
    <div v-if="showNodeModal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div class="bg-zinc-950 border border-gold/40 w-full max-w-2xl rounded-2xl p-6 space-y-6 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
        <h3 class="font-serif text-xl text-gold font-bold">{{ nodeForm.id ? 'Editar Cena' : 'Nova Cena' }}</h3>
        <div class="space-y-4 text-xs font-serif">
          <div>
            <label class="block text-gray-400 uppercase tracking-wider mb-1">Nome do Orador (Speaker)</label>
            <input v-model="nodeForm.speakerName" class="w-full bg-black border border-white/10 rounded-lg p-3 text-parchment focus:border-gold outline-none" placeholder="Ex: O Narrador, André Maranhão, Vítima Embriagada" />
          </div>
          <div>
            <label class="block text-gray-400 uppercase tracking-wider mb-1">Texto Narrativo da Cena</label>
            <textarea v-model="nodeForm.narrativeText" rows="4" class="w-full bg-black border border-white/10 rounded-lg p-3 text-parchment focus:border-gold outline-none leading-relaxed" placeholder="Descreva o ambiente, os diálogos e o suspense..."></textarea>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block text-gray-400 uppercase tracking-wider mb-1">URL Imagem de Fundo</label>
              <input v-model="nodeForm.backgroundImageUrl" class="w-full bg-black border border-white/10 rounded-lg p-2.5 text-parchment text-[11px] focus:border-gold outline-none font-mono" placeholder="URL ou /story_assets/..." />
            </div>
            <div>
              <label class="block text-gray-400 uppercase tracking-wider mb-1">URL Sprite Esquerdo</label>
              <input v-model="nodeForm.leftCharacterImageUrl" class="w-full bg-black border border-white/10 rounded-lg p-2.5 text-parchment text-[11px] focus:border-gold outline-none font-mono" placeholder="Sprite NPC..." />
            </div>
            <div>
              <label class="block text-gray-400 uppercase tracking-wider mb-1">URL Sprite Direito</label>
              <input v-model="nodeForm.rightCharacterImageUrl" class="w-full bg-black border border-white/10 rounded-lg p-2.5 text-parchment text-[11px] focus:border-gold outline-none font-mono" placeholder="Sprite Jogador..." />
            </div>
          </div>
          <div class="flex items-center gap-2 pt-2">
            <input type="checkbox" v-model="nodeForm.isEnding" id="isEndingCheck" class="rounded accent-blood-red" />
            <label for="isEndingCheck" class="text-red-300 cursor-pointer">Marcar esta cena como Desfecho / Fim da História</label>
          </div>
        </div>
        <div class="flex justify-end gap-3 pt-4 border-t border-white/10">
          <button @click="showNodeModal = false" class="px-4 py-2 rounded-lg bg-white/5 text-gray-400 hover:text-white text-xs uppercase font-serif">Cancelar</button>
          <button @click="saveNode" class="px-5 py-2 rounded-lg bg-gold text-black hover:bg-gold-dim text-xs uppercase font-serif font-bold">Salvar Cena</button>
        </div>
      </div>
    </div>

    <!-- MODAL ESCOLHA / TESTE V5 -->
    <div v-if="showChoiceModal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div class="bg-zinc-950 border border-gold/40 w-full max-w-lg rounded-2xl p-6 space-y-6 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
        <h3 class="font-serif text-xl text-gold font-bold">{{ choiceForm.id ? 'Editar Escolha' : 'Nova Escolha' }}</h3>
        <div class="space-y-4 text-xs font-serif">
          <div>
            <label class="block text-gray-400 uppercase tracking-wider mb-1">
              Texto do Botão de Escolha <span class="text-red-400 font-bold">* (Obrigatório)</span>
            </label>
            <input 
              v-model="choiceForm.choiceText" 
              class="w-full bg-black border border-white/10 rounded-lg p-3 text-parchment focus:border-gold outline-none" 
              placeholder="Digite a ação do jogador (Ex: Investigar a sala, Atacar, Fugir...)" 
              required
            />
          </div>

          <div class="p-3.5 rounded-xl border border-white/10 bg-black/40 space-y-3">
            <div class="text-gold font-bold uppercase tracking-wider text-[11px]">Teste Mecânico de Vampiro V5 (Opcional)</div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-gray-400 mb-1">Atributo</label>
                <select v-model="choiceForm.attributeReq" class="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-parchment outline-none">
                  <option value="">Nenhum (Direto)</option>
                  <option v-for="attr in attributesList" :key="attr" :value="attr">{{ attr }}</option>
                </select>
              </div>
              <div>
                <label class="block text-gray-400 mb-1">Perícia / Habilidade</label>
                <select v-model="choiceForm.skillReq" class="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-parchment outline-none">
                  <option value="">Nenhuma</option>
                  <option v-for="sk in skillsList" :key="sk" :value="sk">{{ sk }}</option>
                </select>
              </div>
            </div>

            <div v-if="choiceForm.attributeReq">
              <label class="block text-gray-400 mb-1">Dificuldade Alvo (Número de Sucessos)</label>
              <input type="number" v-model.number="choiceForm.difficulty" min="1" max="10" class="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-parchment outline-none" />
            </div>
          </div>

          <div class="space-y-3">
            <div>
              <label class="block text-green-400 uppercase tracking-wider mb-1">Destino em Caso de Sucesso / Caminho Direto</label>
              <select v-model="choiceForm.successNodeId" class="w-full bg-black border border-green-500/40 rounded-lg p-2.5 text-parchment outline-none">
                <option value="">Selecione a Cena de Destino...</option>
                <option v-for="node in activeAdventureDetail?.nodes" :key="node.id" :value="node.id">
                  #{{ node.speakerName || 'Cena' }}: {{ node.narrativeText.substring(0, 45) }}...
                </option>
              </select>
            </div>

            <div v-if="choiceForm.attributeReq">
              <label class="block text-red-400 uppercase tracking-wider mb-1">Destino em Caso de Falha no Teste</label>
              <select v-model="choiceForm.failureNodeId" class="w-full bg-black border border-red-500/40 rounded-lg p-2.5 text-parchment outline-none">
                <option value="">Selecione a Cena de Falha...</option>
                <option v-for="node in activeAdventureDetail?.nodes" :key="node.id" :value="node.id">
                  #{{ node.speakerName || 'Cena' }}: {{ node.narrativeText.substring(0, 45) }}...
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-white/10">
          <button @click="showChoiceModal = false" class="px-4 py-2 rounded-lg bg-white/5 text-gray-400 hover:text-white text-xs uppercase font-serif">Cancelar</button>
          <button @click="saveChoice" class="px-5 py-2 rounded-lg bg-gold text-black hover:bg-gold-dim text-xs uppercase font-serif font-bold">Salvar Escolha</button>
        </div>
      </div>
    </div>

    <!-- MODAL MISSÃO AFK -->
    <div v-if="showMissionModal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div class="bg-zinc-950 border border-blood-red/40 w-full max-w-lg rounded-2xl p-6 space-y-6 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
        <h3 class="font-serif text-xl text-blood-red font-bold">{{ missionForm.id ? 'Editar Missão AFK' : 'Nova Missão AFK' }}</h3>
        <div class="space-y-4 text-xs font-serif">
          <div>
            <label class="block text-gray-400 uppercase tracking-wider mb-1">Título da Missão</label>
            <input v-model="missionForm.title" class="w-full bg-black border border-white/10 rounded-lg p-3 text-parchment focus:border-blood-red outline-none" placeholder="Ex: Caçada pelas Ruas da Sé" />
          </div>
          <div>
            <label class="block text-gray-400 uppercase tracking-wider mb-1">Categoria</label>
            <select v-model="missionForm.category" class="w-full bg-black border border-white/10 rounded-lg p-3 text-parchment outline-none">
              <option value="HUNT">🩸 Caçada de Sangue (Alimentação)</option>
              <option value="OPERATION">🎯 Operação Tática (Incursão)</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-gray-400 mb-1">Duração (Minutos)</label>
              <input type="number" v-model.number="missionForm.durationMinutes" min="1" class="w-full bg-black border border-white/10 rounded-lg p-3 text-parchment outline-none" />
            </div>
            <div>
              <label class="block text-gray-400 mb-1">Dificuldade Base</label>
              <input type="number" v-model.number="missionForm.baseDifficulty" min="1" max="10" class="w-full bg-black border border-white/10 rounded-lg p-3 text-parchment outline-none" />
            </div>
          </div>
          <div>
            <label class="block text-gray-400 uppercase tracking-wider mb-1">Descrição Imersiva</label>
            <textarea v-model="missionForm.description" rows="3" class="w-full bg-black border border-white/10 rounded-lg p-3 text-parchment outline-none"></textarea>
          </div>
        </div>
        <div class="flex justify-end gap-3 pt-4 border-t border-white/10">
          <button @click="showMissionModal = false" class="px-4 py-2 rounded-lg bg-white/5 text-gray-400 hover:text-white text-xs uppercase font-serif">Cancelar</button>
          <button @click="saveMission" class="px-5 py-2 rounded-lg bg-blood-red text-white hover:bg-red-700 text-xs uppercase font-serif font-bold">Salvar Missão</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const router = useRouter();

// ==================== STATE ====================
const activeTab = ref<'overview' | 'stories' | 'missions' | 'players' | 'compendium'>('overview');
const compendiumCategory = ref<'npcs' | 'locations' | 'equipments'>('npcs');
const loading = ref(false);
const successMsg = ref('');
const errorMsg = ref('');

const masterInfo = ref<any>(null);
const isLeadMaster = ref(false);
const overviewStats = ref<any>(null);
const recentLogs = ref<any[]>([]);
const playersList = ref<any[]>([]);

// Compendium Data
const compendiumNpcs = ref<any[]>([]);
const compendiumLocations = ref<any[]>([]);
const compendiumEquipments = ref<any[]>([]);

// Stories & Adventures
const adventures = ref<any[]>([]);
const activeAdventureDetail = ref<any>(null);
const selectedNode = ref<any>(null);

// Missions AFK
const missions = ref<any[]>([]);

// Constants for V5 Rolls
const attributesList = [
  'Força', 'Destreza', 'Vigor',
  'Carisma', 'Manipulação', 'Autocontrole',
  'Inteligência', 'Raciocínio', 'Percepção'
];

const skillsList = [
  'Briga', 'Armas Brancas', 'Armas de Fogo', 'Furtividade', 'Atletismo', 'Ladroagem', 'Condução',
  'Persuasão', 'Lábia', 'Intimidação', 'Liderança', 'Etiqueta', 'Performance', 'Subterfúgio', 'Manha',
  'Investigação', 'Ocultismo', 'Medicina', 'Ciência', 'Tecnologia', 'Finanças', 'Política', 'Erudição', 'Sobrevivência'
];

// Forms
const showAdventureModal = ref(false);
const adventureForm = ref<any>({ id: '', title: '', description: '', maxCompletions: null });

const showNodeModal = ref(false);
const nodeForm = ref<any>({ id: '', adventureId: '', narrativeText: '', isEnding: false, speakerName: '', backgroundImageUrl: '', leftCharacterImageUrl: '', rightCharacterImageUrl: '' });

const showChoiceModal = ref(false);
const choiceForm = ref<any>({ id: '', nodeId: '', choiceText: '', attributeReq: '', skillReq: '', difficulty: 1, successNodeId: '', failureNodeId: '', customStyle: null });

const showMissionModal = ref(false);
const missionForm = ref<any>({ id: '', title: '', description: '', durationMinutes: 2, baseDifficulty: 5, category: 'OPERATION' });

// ==================== LIFECYCLE ====================
onMounted(async () => {
  await checkStatus();
  await loadOverview();
  await loadAdventures();
  await loadMissions();
});

const setTab = (tab: any) => {
  activeTab.value = tab;
  if (tab === 'overview') loadOverview();
  if (tab === 'stories' && !activeAdventureDetail.value) loadAdventures();
  if (tab === 'missions') loadMissions();
  if (tab === 'players') loadPlayers();
  if (tab === 'compendium') loadCompendium();
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

// ==================== API ACTIONS ====================
const checkStatus = async () => {
  try {
    const res = await api.get('/api/gm/status');
    masterInfo.value = res.data.master;
    isLeadMaster.value = masterInfo.value?.id === '37339df8-b042-458d-8d9c-d15cf18adbd8' || masterInfo.value?.role === 'ADMIN';
  } catch (err: any) {
    if (err.response?.status === 403 || err.response?.status === 401) {
      router.push('/login');
    }
  }
};

const loadOverview = async () => {
  try {
    const res = await api.get('/api/gm/dashboard/overview');
    overviewStats.value = res.data.stats;
    recentLogs.value = res.data.recentLogs || [];
    isLeadMaster.value = res.data.isLeadMaster || isLeadMaster.value;
  } catch (err) {
    console.error('Erro ao carregar dashboard:', err);
  }
};

const loadPlayers = async () => {
  try {
    const res = await api.get('/api/gm/players');
    playersList.value = res.data;
  } catch (err) {
    console.error('Erro ao carregar jogadores:', err);
  }
};

const loadCompendium = async () => {
  try {
    const [npcsRes, locsRes, eqsRes] = await Promise.all([
      api.get('/api/gm/compendium/npcs'),
      api.get('/api/gm/compendium/locations'),
      api.get('/api/gm/compendium/equipments')
    ]);
    compendiumNpcs.value = npcsRes.data;
    compendiumLocations.value = locsRes.data;
    compendiumEquipments.value = eqsRes.data;
  } catch (err) {
    console.error('Erro ao carregar compêndio:', err);
  }
};

const loadAdventures = async () => {
  loading.value = true;
  try {
    const res = await api.get('/api/gm/story/adventures');
    adventures.value = res.data;
  } catch (err: any) {
    errorMsg.value = err.response?.data?.error || 'Erro ao carregar crônicas';
  } finally {
    loading.value = false;
  }
};

const openAdventureDetail = async (adventureId: string) => {
  loading.value = true;
  try {
    const res = await api.get(`/api/gm/story/adventures/${adventureId}`);
    activeAdventureDetail.value = res.data;
    if (res.data.nodes && res.data.nodes.length > 0) {
      // Se tiver nó inicial, seleciona ele, senão seleciona o primeiro
      const initialNode = res.data.nodes.find((n: any) => n.id === res.data.firstNodeId) || res.data.nodes[0];
      selectedNode.value = initialNode;
    } else {
      selectedNode.value = null;
    }
  } catch (err: any) {
    errorMsg.value = err.response?.data?.error || 'Erro ao abrir crônica';
  } finally {
    loading.value = false;
  }
};

const closeAdventureDetail = () => {
  activeAdventureDetail.value = null;
  selectedNode.value = null;
  loadAdventures();
};

const selectNode = (node: any) => {
  selectedNode.value = node;
};

const getNodeName = (nodeId: string) => {
  if (!nodeId) return 'Nenhum (Finaliza)';
  const node = activeAdventureDetail.value?.nodes?.find((n: any) => n.id === nodeId);
  if (!node) return 'Cena #' + nodeId.substring(0, 6);
  return `#${node.speakerName || 'Cena'}: ${node.narrativeText.substring(0, 20)}...`;
};

// ==================== CRÔNICA CRUD ====================
const openAdventureModal = (adv?: any) => {
  if (adv) {
    adventureForm.value = { id: adv.id, title: adv.title, description: adv.description, maxCompletions: adv.maxCompletions };
  } else {
    adventureForm.value = { id: '', title: '', description: '', maxCompletions: null };
  }
  showAdventureModal.value = true;
};

const saveAdventure = async () => {
  try {
    if (adventureForm.value.id) {
      await api.put(`/api/gm/story/adventures/${adventureForm.value.id}`, adventureForm.value);
      successMsg.value = 'Crônica atualizada com sucesso!';
    } else {
      await api.post('/api/gm/story/adventures', adventureForm.value);
      successMsg.value = 'Nova crônica criada com sucesso!';
    }
    showAdventureModal.value = false;
    await loadAdventures();
  } catch (err: any) {
    errorMsg.value = err.response?.data?.error || 'Erro ao salvar crônica';
  }
};

const confirmDeleteAdventure = async (adv: any) => {
  if (!confirm(`Deseja realmente excluir a crônica "${adv.title}" e todas as suas cenas?`)) return;
  try {
    await api.delete(`/api/gm/story/adventures/${adv.id}`);
    successMsg.value = 'Crônica excluída com sucesso!';
    await loadAdventures();
  } catch (err: any) {
    errorMsg.value = err.response?.data?.error || 'Erro ao excluir crônica';
  }
};

// ==================== NODE CRUD ====================
const openNodeModal = (node?: any) => {
  if (node) {
    nodeForm.value = { ...node };
  } else {
    nodeForm.value = {
      id: '',
      adventureId: activeAdventureDetail.value?.id,
      narrativeText: '',
      isEnding: false,
      speakerName: '',
      backgroundImageUrl: '',
      leftCharacterImageUrl: '',
      rightCharacterImageUrl: ''
    };
  }
  showNodeModal.value = true;
};

const saveNode = async () => {
  try {
    if (nodeForm.value.id) {
      await api.put(`/api/gm/story/nodes/${nodeForm.value.id}`, nodeForm.value);
      successMsg.value = 'Cena atualizada com sucesso!';
    } else {
      await api.post('/api/gm/story/nodes', nodeForm.value);
      successMsg.value = 'Nova cena adicionada!';
    }
    showNodeModal.value = false;
    await openAdventureDetail(activeAdventureDetail.value.id);
  } catch (err: any) {
    errorMsg.value = err.response?.data?.error || 'Erro ao salvar cena';
  }
};

const setAsStartingNode = async (nodeId: string) => {
  try {
    await api.put(`/api/gm/story/adventures/${activeAdventureDetail.value.id}`, { firstNodeId: nodeId });
    activeAdventureDetail.value.firstNodeId = nodeId;
    successMsg.value = 'Nó inicial da crônica definido com sucesso!';
  } catch (err: any) {
    errorMsg.value = err.response?.data?.error || 'Erro ao definir nó inicial';
  }
};

const confirmDeleteNode = async (node: any) => {
  if (!confirm('Deseja realmente excluir esta cena e suas escolhas?')) return;
  try {
    await api.delete(`/api/gm/story/nodes/${node.id}`);
    successMsg.value = 'Cena excluída com sucesso!';
    await openAdventureDetail(activeAdventureDetail.value.id);
  } catch (err: any) {
    errorMsg.value = err.response?.data?.error || 'Erro ao excluir cena';
  }
};

// ==================== CHOICE CRUD ====================
const openChoiceModal = (choice?: any, nodeId?: string) => {
  if (choice) {
    choiceForm.value = { ...choice };
  } else {
    choiceForm.value = {
      id: '',
      nodeId: nodeId || selectedNode.value?.id,
      choiceText: '',
      attributeReq: '',
      skillReq: '',
      difficulty: 1,
      successNodeId: '',
      failureNodeId: '',
      customStyle: null
    };
  }
  showChoiceModal.value = true;
};

const saveChoice = async () => {
  if (!choiceForm.value.choiceText || !choiceForm.value.choiceText.trim()) {
    alert('Por favor, digite o Texto do Botão de Escolha (ex: Investigar a sala, Atacar, Fugir).');
    return;
  }

  if (!choiceForm.value.nodeId) {
    choiceForm.value.nodeId = selectedNode.value?.id;
  }

  try {
    if (choiceForm.value.id) {
      await api.put(`/api/gm/story/choices/${choiceForm.value.id}`, choiceForm.value);
      successMsg.value = 'Escolha atualizada!';
    } else {
      await api.post('/api/gm/story/choices', choiceForm.value);
      successMsg.value = 'Nova escolha vinculada!';
    }
    showChoiceModal.value = false;
    await openAdventureDetail(activeAdventureDetail.value.id);
  } catch (err: any) {
    errorMsg.value = err.response?.data?.error || 'Erro ao salvar escolha';
  }
};

const confirmDeleteChoice = async (choice: any) => {
  if (!confirm('Deseja excluir esta opção de escolha?')) return;
  try {
    await api.delete(`/api/gm/story/choices/${choice.id}`);
    successMsg.value = 'Escolha excluída!';
    await openAdventureDetail(activeAdventureDetail.value.id);
  } catch (err: any) {
    errorMsg.value = err.response?.data?.error || 'Erro ao excluir escolha';
  }
};

// ==================== MISSIONS CRUD ====================
const loadMissions = async () => {
  try {
    const res = await api.get('/api/gm/missions-idle');
    missions.value = res.data;
  } catch (err: any) {
    console.error('Erro ao carregar missões:', err);
  }
};

const openMissionModal = (mission?: any) => {
  if (mission) {
    missionForm.value = { ...mission };
  } else {
    missionForm.value = { id: '', title: '', description: '', durationMinutes: 2, baseDifficulty: 5, category: 'OPERATION' };
  }
  showMissionModal.value = true;
};

const saveMission = async () => {
  try {
    if (missionForm.value.id) {
      await api.put(`/api/gm/missions-idle/${missionForm.value.id}`, missionForm.value);
      successMsg.value = 'Missão AFK atualizada!';
    } else {
      await api.post('/api/gm/missions-idle', missionForm.value);
      successMsg.value = 'Nova missão AFK criada!';
    }
    showMissionModal.value = false;
    await loadMissions();
  } catch (err: any) {
    errorMsg.value = err.response?.data?.error || 'Erro ao salvar missão';
  }
};

const openMissionDetail = (missionId: string) => {
  alert('Editor de etapas da missão: ' + missionId);
};

const confirmDeleteMission = async (mission: any) => {
  if (!confirm(`Deseja excluir a missão "${mission.title}"?`)) return;
  try {
    await api.delete(`/api/gm/missions-idle/${mission.id}`);
    successMsg.value = 'Missão excluída com sucesso!';
    await loadMissions();
  } catch (err: any) {
    errorMsg.value = err.response?.data?.error || 'Erro ao excluir missão';
  }
};

// ==================== AUTH ====================
const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/login');
};
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.25s ease-out forwards;
}
</style>
