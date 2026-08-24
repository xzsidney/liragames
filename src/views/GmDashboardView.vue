<template>
  <div class="min-h-screen bg-[#050505] text-parchment font-sans relative overflow-x-hidden selection:bg-blood-red selection:text-white">
    <!-- NOISE OVERLAY -->
    <div class="fixed inset-0 pointer-events-none opacity-20 mix-blend-overlay z-0" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>
    
    <!-- GLOW EFFECT -->
    <div class="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[450px] bg-blood-red/10 blur-[160px] rounded-full pointer-events-none z-0"></div>

    <!-- NAVBAR -->
    <nav class="relative z-20 border-b border-white/5 bg-black/60 backdrop-blur-md sticky top-0">
      <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full border border-gold-dim flex items-center justify-center bg-black shadow-[0_0_15px_rgba(212,175,55,0.15)]">
            <span class="text-gold font-serif text-xl">L</span>
          </div>
          <div class="flex flex-col">
            <span class="font-serif text-xl tracking-widest text-parchment">LIRA<span class="text-blood-red">RPG</span></span>
            <span class="text-[9px] font-serif uppercase tracking-[3px] text-gold-dim">Painel do Mestre</span>
          </div>
        </div>

        <div class="flex items-center gap-6">
          <div class="hidden sm:flex items-center gap-2 px-3 py-1 rounded border border-gold/20 bg-gold/5 text-gold text-xs font-serif tracking-widest">
            <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            MESTRE AUTENTICADO
          </div>
          
          <button @click="handleLogout" class="font-serif text-[11px] tracking-[2px] uppercase text-gray-400 hover:text-white transition-colors border border-white/10 px-4 py-2 rounded bg-black/40 hover:bg-black/80">
            Desconectar
          </button>
        </div>
      </div>
    </nav>

    <!-- MAIN CONTENT -->
    <main class="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-16">
      <header class="mb-12">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded bg-blood-red/10 border border-blood-red/30 text-blood-red text-xs font-serif uppercase tracking-widest mb-4">
          <span>⚔️</span> Controle de Crônicas & Narrativa
        </div>
        <h1 class="font-serif text-4xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-b from-parchment via-parchment to-gold-dim tracking-wide drop-shadow-sm mb-4">
          Bem-vindo, Mestre.
        </h1>
        <p class="text-gray-400 max-w-2xl text-lg font-light leading-relaxed">
          Você está no centro de comando narrativo. Aqui você molda os destinos de Nocturna, tecendo novas crônicas, cenas e desafios para os Membros da noite.
        </p>
      </header>

      <!-- STATUS & PROFILE CARD -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div class="border border-white/10 bg-black/40 backdrop-blur-sm p-6 rounded-xl relative overflow-hidden">
          <div class="text-xs font-serif uppercase tracking-widest text-gray-500 mb-2">Narrador Ativo</div>
          <div class="text-xl font-serif text-parchment font-bold">{{ masterInfo?.name || 'Mestre da Noite' }}</div>
          <div class="text-xs text-gold-dim mt-1">{{ masterInfo?.email || 'carregando...' }}</div>
          <div class="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
            <span class="text-gray-400">Permissão:</span>
            <span class="text-gold font-mono font-bold tracking-wider uppercase">{{ masterInfo?.role || 'MESTRE' }}</span>
          </div>
        </div>

        <div class="border border-white/10 bg-black/40 backdrop-blur-sm p-6 rounded-xl relative overflow-hidden">
          <div class="text-xs font-serif uppercase tracking-widest text-gray-500 mb-2">Status da API GM</div>
          <div class="text-xl font-serif text-green-400 flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-green-500 inline-block animate-ping"></span>
            {{ connectionStatus }}
          </div>
          <div class="text-xs text-gray-400 mt-1">Conexão segura estabelecida</div>
          <div class="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
            <span class="text-gray-400">Ambiente:</span>
            <span class="text-parchment font-mono">Produção / Hostinger</span>
          </div>
        </div>

        <div class="border border-white/10 bg-black/40 backdrop-blur-sm p-6 rounded-xl relative overflow-hidden">
          <div class="text-xs font-serif uppercase tracking-widest text-gray-500 mb-2">Módulo em Desenvolvimento</div>
          <div class="text-xl font-serif text-gold">Editor de Crônicas</div>
          <div class="text-xs text-gray-400 mt-1">Nós de História &amp; Escolhas V5</div>
          <div class="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
            <span class="text-gray-400">Próxima Etapa:</span>
            <span class="text-gold-dim font-serif">Árvore de Cenas</span>
          </div>
        </div>
      </div>

      <!-- COMING SOON BANNER / INFO -->
      <div class="border border-gold/20 bg-gradient-to-r from-black/80 via-black/50 to-black/80 p-8 rounded-xl relative overflow-hidden shadow-2xl">
        <div class="max-w-2xl">
          <h2 class="font-serif text-2xl text-gold mb-3">Painel do Mestre Inicializado com Sucesso</h2>
          <p class="text-gray-300 text-sm leading-relaxed mb-6">
            O fluxo de autenticação por perfil (Role) está ativo e validado. Os próximos passos habilitarão o construtor visual de Aventuras Solo (Nós, Diálogos, Sprites e Testes de Atributo/Habilidade).
          </p>
          <div class="flex flex-wrap gap-4">
            <div class="px-4 py-2 rounded bg-white/5 border border-white/10 text-xs font-serif uppercase tracking-widest text-gray-300">
              ✓ Rotas GM Protegidas
            </div>
            <div class="px-4 py-2 rounded bg-white/5 border border-white/10 text-xs font-serif uppercase tracking-widest text-gray-300">
              ✓ Redirecionamento por Perfil
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const masterInfo = ref<any>(null)
const connectionStatus = ref('Verificando...')

onMounted(async () => {
  // Carrega dados locais se existirem
  const localUserStr = sessionStorage.getItem('lira_user') || localStorage.getItem('lira_user')
  if (localUserStr) {
    try {
      masterInfo.value = JSON.parse(localUserStr)
    } catch (e) {
      console.error('Erro ao ler usuário salvo:', e)
    }
  }

  // Testa conexão com a rota protegida do GM
  try {
    const response = await api.get('/api/gm/status')
    if (response.data && response.data.master) {
      masterInfo.value = response.data.master
      connectionStatus.value = 'Conectado'
    }
  } catch (error) {
    console.error('Erro ao consultar status do GM:', error)
    connectionStatus.value = 'Erro de Autenticação'
  }
})

const handleLogout = () => {
  sessionStorage.removeItem('lira_token')
  sessionStorage.removeItem('lira_user')
  localStorage.removeItem('token')
  localStorage.removeItem('lira_token')
  localStorage.removeItem('lira_user')
  router.push('/login')
}
</script>
