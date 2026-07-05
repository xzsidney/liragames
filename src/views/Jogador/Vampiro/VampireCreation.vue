<template>
  <div class="min-h-screen bg-[#000000] text-[#e2e2e2] flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-4xl font-serif text-[#ffb4a8] mb-4">Criação de Personagem (Vampiro)</h1>
      <p class="text-[#e3beb8] mb-8">Esta tela será construída usando o template teladecriação/code.html</p>
      <button @click="router.push('/jogador/vampire')" class="bg-[#8b0000] px-6 py-2 text-white hover:bg-[#690000]">Voltar ao Dashboard</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
</script>
