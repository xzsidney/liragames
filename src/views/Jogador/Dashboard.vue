<template>
  <div class="min-h-screen bg-[#131313] text-[#e2e2e2] font-body flex flex-col">
    <div class="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999] opacity-5 bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuA3IQweR8TYJK9r_umNc7OyIfEVHD517wZFaAR9W8KqymrZ_G3aHDYxD4qbEuhh3lwwVHClvV9bfRIiUUpmHhQW5wZ5Eh7sZdifJPIwNwnIedxYA00aU-uS1PvmeRcYu8CYRBDFA9waDnXK9JFf-ySdr1ZGitkaQwgIqOZs214mhVtQRND9ChZ0M-o9I8619TZ4U-YGr6JJph-bwNtAFVFKbXtPBfzYTGdAvc9Zf_NduJ16Y0MPLz3g')]"></div>
    
    <header class="bg-[#131313]/95 backdrop-blur-sm border-b border-[#5a403c] fixed top-0 w-full z-[100] px-6 py-4 flex justify-between items-center">
      <div class="flex items-center gap-4">
        <!-- Logo Text -->
        <h1 class="font-serif text-xl uppercase tracking-widest leading-none text-[#ffb4a8]">LiraRPG: Hub Central</h1>
      </div>
      <div class="flex items-center gap-6">
        <div class="flex items-center gap-3 pr-6 border-r border-[#5a403c]">
          <div class="text-right hidden sm:block">
            <p class="text-xs text-[#e2e2e2] uppercase tracking-tighter font-bold">LiraRPG</p>
            <p class="text-[10px] text-[#ffb4a8]/70 uppercase">Jogador</p>
          </div>
          <span class="text-3xl text-[#bab8b7]">👤</span>
        </div>
      </div>
    </header>

    <main class="flex-grow pt-32 pb-24 px-6 max-w-[1400px] mx-auto w-full">
      
      <div class="mb-8">
        <h2 class="text-5xl font-serif text-[#e2e2e2] mb-4 italic">Mundo das Trevas</h2>
        <p class="text-base text-[#e3beb8] max-w-2xl border-l-2 border-[#8b0000] pl-4">
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

const router = useRouter();

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