<template>
  <div class="min-h-screen font-body flex flex-col" style="background-color: var(--bg-deep); color: var(--text-main); background-image: radial-gradient(ellipse at 20% 10%, rgba(139,0,0,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 90%, rgba(42,26,92,0.1) 0%, transparent 60%);">
    
    <!-- PARTICLES (Opicional) -->
    <div id="particles" aria-hidden="true" class="pointer-events-none fixed inset-0 z-0"></div>

    <header id="main-header">
      <div class="header-inner">
        <div class="header-logo">
          <span class="logo-symbol">⚜</span>
          <div class="logo-text">
            <span class="logo-title">LiraRPG</span>
            <span class="logo-sub">Portal</span>
          </div>
        </div>
        <div class="flex items-center gap-6 z-10">
          <div class="flex items-center gap-3 pr-6 border-r" style="border-color: var(--gold-dim);">
            <div class="text-right hidden sm:block">
              <p class="text-xs uppercase font-bold" style="color: var(--parchment); font-family: var(--font-title); letter-spacing: 2px;">JOGADOR</p>
              <p class="text-[10px] uppercase" style="color: var(--gold-dim); font-family: var(--font-title); letter-spacing: 2px;">Conectado</p>
            </div>
            <span class="text-2xl" style="filter: drop-shadow(0 0 5px var(--gold-dim));">👤</span>
          </div>
          <button @click="handleLogout" class="header-home-link z-10 relative" style="cursor: pointer;">
            Sair
          </button>
        </div>
      </div>
      <div class="header-bar"></div>
    </header>

    <main class="flex-grow pt-24 pb-24 px-6 max-w-[1400px] mx-auto w-full relative z-10">
      
      <div class="mb-12 text-center">
        <h2 class="gallery-title" style="margin-bottom: 24px;">Os Filhos da Noite</h2>
        <div class="gallery-divider" style="margin-bottom: 24px;">
          <span class="divider-line"></span>
          <span class="divider-icon" style="color: var(--blood-bright);">🩸</span>
          <span class="divider-line"></span>
        </div>
        <p class="gallery-subtitle">
          Selecione sua crônica. O destino da humanidade e dos monstros está em suas mãos. Entre na escuridão e molde a narrativa do horror pessoal.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 h-full min-h-[600px] perspective-1000">
        
        <!-- Vampiro: A Máscara -->
        <div 
          @click="selectSystem('VAMPIRE')"
          @mousemove="handleMouseMove"
          @mouseleave="handleMouseLeave"
          class="game-card relative overflow-hidden group border border-[#5a403c] bg-[#0e0e0e] flex flex-col cursor-pointer transition-all duration-500 hover:shadow-[0_0_40px_-10px_#8B0000]"
        >
          <div class="absolute inset-0 z-0">
            <img class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" src="/images/vampire.png"/>
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent group-hover:opacity-80 transition-opacity duration-500"></div>
          </div>
          <div class="relative z-10 p-8 h-full flex flex-col justify-end">
            <span class="text-xs font-bold text-[#ffb4a8] mb-2 uppercase tracking-widest">Gothic Horror</span>
            <h3 class="text-3xl font-serif text-white mb-4">Vampiro</h3>
            <p class="text-base text-[#e3beb8] mb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 h-16">
                A Máscara (V5). Horror pessoal e intriga política. Lide com a Fome e a Besta interior.
            </p>
            <button class="w-full bg-[#8b0000] hover:bg-[#920703] text-white py-4 text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                ABRAÇAR A ESCURIDÃO <span class="text-sm">➔</span>
            </button>
          </div>
          <div class="absolute top-0 right-0 p-4 z-10">
            <span class="text-[#8B0000] text-3xl drop-shadow-md">🩸</span>
          </div>
        </div>

        <!-- Lobisomem: O Apocalipse -->
        <div 
          @click="selectSystem('WEREWOLF')"
          @mousemove="handleMouseMove"
          @mouseleave="handleMouseLeave"
          class="game-card relative overflow-hidden group border border-[#5a403c] bg-[#0e0e0e] flex flex-col cursor-pointer transition-all duration-500 hover:shadow-[0_0_40px_-10px_#2e7d32]"
        >
          <div class="absolute inset-0 z-0">
            <img class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" src="/images/werewolf.png"/>
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent group-hover:opacity-80 transition-opacity duration-500"></div>
          </div>
          <div class="relative z-10 p-8 h-full flex flex-col justify-end">
            <span class="text-xs font-bold text-[#4CAF50] mb-2 uppercase tracking-widest">Feral Horror</span>
            <h3 class="text-3xl font-serif text-white mb-4">Lobisomem</h3>
            <p class="text-base text-[#e3beb8] mb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 h-16">
                O Apocalipse (W5). Horror feral e fúria sagrada. Lute contra a destruição de Gaia.
            </p>
            <button class="w-full bg-[#1b5e20] hover:bg-[#2e7d32] text-white py-4 text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                DESPERTAR A FÚRIA <span class="text-sm">➔</span>
            </button>
          </div>
          <div class="absolute top-0 right-0 p-4 z-10">
            <span class="text-[#4CAF50] text-3xl drop-shadow-md">🌳</span>
          </div>
        </div>

        <!-- Mago: A Ascensão -->
        <div 
          @click="selectSystem('MAGE')"
          @mousemove="handleMouseMove"
          @mouseleave="handleMouseLeave"
          class="game-card relative overflow-hidden group border border-[#5a403c] bg-[#0e0e0e] flex flex-col cursor-pointer transition-all duration-500 hover:shadow-[0_0_40px_-10px_#7b1fa2]"
        >
          <div class="absolute inset-0 z-0">
            <img class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" src="/images/mage.png"/>
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent group-hover:opacity-80 transition-opacity duration-500"></div>
          </div>
          <div class="relative z-10 p-8 h-full flex flex-col justify-end">
            <span class="text-xs font-bold text-[#BB86FC] mb-2 uppercase tracking-widest">Mystic Horror</span>
            <h3 class="text-3xl font-serif text-white mb-4">Mago</h3>
            <p class="text-base text-[#e3beb8] mb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 h-16">
                A Ascensão (M20). Moldar a realidade com a vontade. Sobreviva ao Paradoxo e à Tecnocracia.
            </p>
            <button class="w-full bg-[#4a148c] hover:bg-[#7b1fa2] text-white py-4 text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                ALTERAR A REALIDADE <span class="text-sm">➔</span>
            </button>
          </div>
          <div class="absolute top-0 right-0 p-4 z-10">
            <span class="text-[#BB86FC] text-3xl drop-shadow-md">✨</span>
          </div>
        </div>

        <!-- Caçador: A Revanche -->
        <div 
          @click="selectSystem('HUNTER')"
          @mousemove="handleMouseMove"
          @mouseleave="handleMouseLeave"
          class="game-card relative overflow-hidden group border border-[#5a403c] bg-[#0e0e0e] flex flex-col cursor-pointer transition-all duration-500 hover:shadow-[0_0_40px_-10px_#e65100]"
        >
          <div class="absolute inset-0 z-0">
            <img class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" src="/images/hunter.png"/>
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent group-hover:opacity-80 transition-opacity duration-500"></div>
          </div>
          <div class="relative z-10 p-8 h-full flex flex-col justify-end">
            <span class="text-xs font-bold text-[#FF9800] mb-2 uppercase tracking-widest">Tactical Horror</span>
            <h3 class="text-3xl font-serif text-white mb-4">Caçador</h3>
            <p class="text-base text-[#e3beb8] mb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 h-16">
                A Revanche (H5). Humanos contra o impossível. Use o Ímpeto, a tática e sobreviva à noite.
            </p>
            <button class="w-full bg-[#bf360c] hover:bg-[#e65100] text-white py-4 text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                INICIAR A CAÇADA <span class="text-sm">➔</span>
            </button>
          </div>
          <div class="absolute top-0 right-0 p-4 z-10">
            <span class="text-[#FF9800] text-3xl drop-shadow-md">🎯</span>
          </div>
        </div>

      </div>
    </main>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

const selectSystem = (systemCode) => {
  if (systemCode === 'VAMPIRE') {
    router.push('/jogador/vampire');
  } else {
    // Para outros sistemas (Lobisomem, Mago, Caçador), mostraremos um placeholder depois.
    alert(`O sistema ${systemCode} será implementado em breve!`);
  }
};

const handleMouseMove = (e) => {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  
  const rotateX = (y - centerY) / 20;
  const rotateY = (centerX - x) / 20;
  
  card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02) translateY(-8px)`;
  card.style.zIndex = '10';
};

const handleMouseLeave = (e) => {
  const card = e.currentTarget;
  card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1) translateY(0)`;
  card.style.zIndex = '1';
};
</script>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}
.game-card {
  transform-style: preserve-3d;
}
</style>