<template>
  <div class="min-h-screen bg-background text-gray-200 font-body flex flex-col">
    <header class="bg-surface border-b border-gray-800 p-4 shadow-md flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button @click="router.push('/jogador')" class="text-gray-400 hover:text-white transition-colors">
          <span class="text-xl">←</span> Voltar
        </button>
        <h1 class="font-headline text-2xl text-gray-100 font-bold tracking-wider">Escolha seu Sistema</h1>
      </div>
    </header>
    
    <main class="flex-grow p-8 max-w-7xl mx-auto w-full flex flex-col items-center justify-center">
      <div class="text-center mb-12">
        <h2 class="text-4xl font-headline font-bold mb-4 text-white">O Mundo das Trevas aguarda</h2>
        <p class="text-xl text-gray-400 max-w-2xl mx-auto">
          Selecione a criatura que você irá se tornar. Cada escolha define não apenas seus poderes, mas a natureza da sua maldição.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        <!-- Vampire -->
        <div 
          @click="selectSystem('VAMPIRE')"
          class="bg-surface border-2 border-gray-800 rounded-xl overflow-hidden cursor-pointer group hover:border-red-600 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-900/40 flex flex-col"
        >
          <div class="h-48 bg-gradient-to-b from-red-900/40 to-surface flex items-center justify-center relative overflow-hidden">
            <div class="absolute inset-0 bg-[url('https://www.worldofdarkness.com/images/brands/vampire-logo.svg')] bg-no-repeat bg-center bg-contain opacity-10 group-hover:opacity-20 transition-opacity"></div>
            <span class="text-6xl group-hover:scale-110 transition-transform">🦇</span>
          </div>
          <div class="p-6 flex-grow flex flex-col">
            <h3 class="text-2xl font-headline font-bold text-gray-100 group-hover:text-red-500 transition-colors mb-2">Vampiro</h3>
            <p class="text-sm text-gray-400 mb-4 flex-grow">A Máscara (V5). Horror pessoal e intriga política. Lide com a Fome e a Besta interior.</p>
            <div class="text-xs font-bold text-red-500 uppercase tracking-widest group-hover:tracking-[0.2em] transition-all">
              Abraçar a Escuridão
            </div>
          </div>
        </div>

        <!-- Werewolf -->
        <div 
          @click="selectSystem('WEREWOLF')"
          class="bg-surface border-2 border-gray-800 rounded-xl overflow-hidden cursor-pointer group hover:border-green-600 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-900/40 flex flex-col"
        >
          <div class="h-48 bg-gradient-to-b from-green-900/40 to-surface flex items-center justify-center relative overflow-hidden">
            <div class="absolute inset-0 bg-[url('https://www.worldofdarkness.com/images/brands/werewolf-logo.svg')] bg-no-repeat bg-center bg-contain opacity-10 group-hover:opacity-20 transition-opacity"></div>
            <span class="text-6xl group-hover:scale-110 transition-transform">🐺</span>
          </div>
          <div class="p-6 flex-grow flex flex-col">
            <h3 class="text-2xl font-headline font-bold text-gray-100 group-hover:text-green-500 transition-colors mb-2">Lobisomem</h3>
            <p class="text-sm text-gray-400 mb-4 flex-grow">O Apocalipse (W5). Horror feral e fúria sagrada. Lute contra a destruição de Gaia.</p>
            <div class="text-xs font-bold text-green-500 uppercase tracking-widest group-hover:tracking-[0.2em] transition-all">
              Despertar a Fúria
            </div>
          </div>
        </div>

        <!-- Mage -->
        <div 
          @click="selectSystem('MAGE')"
          class="bg-surface border-2 border-gray-800 rounded-xl overflow-hidden cursor-pointer group hover:border-purple-600 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-900/40 flex flex-col"
        >
          <div class="h-48 bg-gradient-to-b from-purple-900/40 to-surface flex items-center justify-center relative overflow-hidden">
             <div class="absolute inset-0 bg-no-repeat bg-center bg-contain opacity-10 group-hover:opacity-20 transition-opacity"></div>
            <span class="text-6xl group-hover:scale-110 transition-transform">👁️</span>
          </div>
          <div class="p-6 flex-grow flex flex-col">
            <h3 class="text-2xl font-headline font-bold text-gray-100 group-hover:text-purple-500 transition-colors mb-2">Mago</h3>
            <p class="text-sm text-gray-400 mb-4 flex-grow">A Ascensão (M20). Moldar a realidade com a vontade. Sobreviva ao Paradoxo e à Tecnocracia.</p>
            <div class="text-xs font-bold text-purple-500 uppercase tracking-widest group-hover:tracking-[0.2em] transition-all">
              Alterar a Realidade
            </div>
          </div>
        </div>

        <!-- Hunter -->
        <div 
          @click="selectSystem('HUNTER')"
          class="bg-surface border-2 border-gray-800 rounded-xl overflow-hidden cursor-pointer group hover:border-orange-600 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-900/40 flex flex-col"
        >
          <div class="h-48 bg-gradient-to-b from-orange-900/40 to-surface flex items-center justify-center relative overflow-hidden">
             <div class="absolute inset-0 bg-no-repeat bg-center bg-contain opacity-10 group-hover:opacity-20 transition-opacity"></div>
            <span class="text-6xl group-hover:scale-110 transition-transform">🏹</span>
          </div>
          <div class="p-6 flex-grow flex flex-col">
            <h3 class="text-2xl font-headline font-bold text-gray-100 group-hover:text-orange-500 transition-colors mb-2">Caçador</h3>
            <p class="text-sm text-gray-400 mb-4 flex-grow">A Revanche (H5). Humanos contra o impossível. Use o Ímpeto, a tática e sobreviva à noite.</p>
            <div class="text-xs font-bold text-orange-500 uppercase tracking-widest group-hover:tracking-[0.2em] transition-all">
              Iniciar a Caçada
            </div>
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
  // Pass the selected system as a query parameter to the character creation view
  router.push({
    path: '/jogador/personagem/novo',
    query: { system: systemCode }
  });
};
</script>
