<template>
  <div class="min-h-screen bg-[#050505] text-parchment font-sans relative overflow-x-hidden selection:bg-blood-red selection:text-white">
    <!-- NOISE OVERLAY -->
    <div class="fixed inset-0 pointer-events-none opacity-20 mix-blend-overlay z-0" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>
    
    <!-- SUBTLE GLOWS -->
    <div class="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-blood-red/10 blur-[150px] rounded-full pointer-events-none z-0"></div>

    <!-- NAVBAR -->
    <nav class="relative z-20 border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0">
      <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full border border-gold-dim flex items-center justify-center bg-black shadow-[0_0_15px_rgba(212,175,55,0.15)]">
            <span class="text-gold font-serif text-xl">L</span>
          </div>
          <span class="font-serif text-xl tracking-widest text-parchment">LIRA<span class="text-blood-red">RPG</span></span>
        </div>

        <div class="flex items-center gap-6">
          <button @click="handleLogout" class="font-serif text-[11px] tracking-[2px] uppercase text-gray-400 hover:text-white transition-colors">
            Desconectar
          </button>
        </div>
      </div>
    </nav>

    <!-- MAIN CONTENT -->
    <main class="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-20">
      <header class="mb-16">
        <h1 class="font-serif text-4xl md:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-b from-parchment to-gold-dim tracking-wide drop-shadow-sm mb-4">
          Bem-vindo, Mestre.
        </h1>
        <p class="text-gray-400 max-w-2xl text-lg font-light leading-relaxed">
          O sistema foi completamente higienizado. O ambiente está pronto para iniciarmos a nova arquitetura do projeto.
        </p>
      </header>
      
      <div class="bg-black/30 border border-white/5 rounded-xl p-8 shadow-xl">
        <h2 class="font-serif text-2xl text-gold-dim mb-4">Painel de Controle Vazio</h2>
        <p class="text-gray-400">Não há dados ou fichas. O sistema possui apenas o módulo de autenticação ativado.</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const handleLogout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>
