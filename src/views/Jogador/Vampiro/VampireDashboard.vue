<template>
  <div class="font-body-md selection:bg-primary-container selection:text-white bg-[#000000] text-[#e2e2e2] min-h-screen overflow-x-hidden">
    <div class="grain-overlay"></div>
    
    <!-- Top Navigation Shell -->
    <header class="fixed top-0 left-0 w-full z-50 border-b border-[#5a403c] bg-[#131313]/95 backdrop-blur-sm flex justify-between items-center px-6 py-4">
      <div class="flex items-center gap-4">
        <button @click="router.push('/jogador')" class="text-[#ffb4a8] cursor-pointer hover:opacity-70 transition-opacity flex items-center gap-2">
          <span>←</span>
        </button>
        <h1 class="font-serif text-3xl uppercase tracking-widest text-[#ffb4a8]">Vampiro: A Máscara</h1>
      </div>
      <div class="flex items-center gap-6">
        <div class="hidden md:flex gap-8">
          <a class="text-[#ffb4a8] font-bold text-xs tracking-widest transition-colors duration-300" href="#">COTERIE</a>
          <a class="text-[#e3beb8] hover:text-[#ffb4a8] text-xs tracking-widest transition-colors duration-300" href="#">CHRONICLE</a>
          <a class="text-[#e3beb8] hover:text-[#ffb4a8] text-xs tracking-widest transition-colors duration-300" href="#">LORE</a>
        </div>
        <div class="flex items-center gap-4">
          <span class="text-[#ffb4a8] text-2xl cursor-pointer hover:scale-110 transition-transform">🩸</span>
          <span class="text-[#ffb4a8] text-2xl cursor-pointer hover:scale-110 transition-transform" @click="handleLogout">👤</span>
        </div>
      </div>
    </header>

    <!-- Side Navigation (Desktop Only Anchor) -->
    <aside class="hidden lg:flex flex-col h-screen w-72 fixed left-0 top-0 z-40 border-r border-[#5a403c] bg-[#1b1b1b] pt-24 pb-8">
      <div class="px-6 mb-10">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-12 h-12 bg-[#8b0000] flex items-center justify-center border border-[#5a403c]">
            <span class="text-[#ff907f] text-2xl">💀</span>
          </div>
          <div>
            <p class="font-serif text-lg text-[#e2e2e2]">Julian Giovanni</p>
            <p class="text-xs text-[#e3beb8]">Clan: Hecata | Gen: 9th</p>
          </div>
        </div>
        <button class="w-full bg-[#8b0000] text-white py-3 text-xs tracking-widest hover:bg-[#690000] transition-all active:scale-95">HUNT FOR BLOOD</button>
      </div>
      <nav class="flex-grow flex flex-col gap-1">
        <a class="bg-[#8b0000]/20 text-[#ff907f] font-bold border-l-4 border-[#ffb4a8] px-6 py-4 flex items-center gap-4 transition-all" href="#">
          <span>👥</span> COTERIE
        </a>
        <a class="text-[#e3beb8] hover:bg-[#353535] hover:text-[#e2e2e2] px-6 py-4 flex items-center gap-4 transition-all" href="#">
          <span>📖</span> CHRONICLE
        </a>
        <a class="text-[#e3beb8] hover:bg-[#353535] hover:text-[#e2e2e2] px-6 py-4 flex items-center gap-4 transition-all" href="#">
          <span>✨</span> DISCIPLINES
        </a>
        <a class="text-[#e3beb8] hover:bg-[#353535] hover:text-[#e2e2e2] px-6 py-4 flex items-center gap-4 mt-auto transition-all" href="#">
          <span>⚙️</span> SETTINGS
        </a>
      </nav>
    </aside>

    <!-- Main Canvas -->
    <main class="lg:ml-72 pt-24 pb-32 px-6 min-h-screen">
      <div class="max-w-6xl mx-auto">
        <!-- Header Section -->
        <div class="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-[#5a403c] pb-4">
          <div>
            <h2 class="font-serif text-5xl text-[#e2e2e2] mb-2 font-bold tracking-tight">Seus Personagens</h2>
            <p class="text-[#e3beb8] text-base max-w-xl">Mantenha a Máscara. O sangue clama por aqueles que caminham na noite. Gerencie seus vampiros e suas crônicas.</p>
          </div>
          <div class="mt-4 md:mt-0 flex gap-4">
            <button class="bg-[#353535] border border-[#5a403c] px-6 py-3 text-xs tracking-widest hover:bg-[#393939] transition-colors flex items-center gap-2 text-[#e2e2e2]">
              <span>🔍</span> FILTRAR
            </button>
            <button @click="router.push('/jogador/vampire/novo')" class="bg-[#8b0000] px-6 py-3 text-xs tracking-widest text-white hover:bg-[#690000] transition-all flex items-center gap-2 shadow-lg">
              <span>➕</span> NOVO PERSONAGEM
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <p class="text-[#ffb4a8] text-xl animate-pulse font-serif italic">Despertando as sombras...</p>
        </div>

        <!-- Character Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          
          <!-- Loop através dos personagens de VAMPIRE -->
          <article 
            v-for="char in characters" 
            :key="char.id"
            @click="router.push(`/jogador/vampire/personagem/${char.id}`)"
            class="vampire-card bg-[#0e0e0e] overflow-hidden flex flex-col h-full cursor-pointer"
          >
            <div class="relative h-72 overflow-hidden border-b border-[#5a403c]/30">
              <img class="card-img w-full h-full object-cover" :src="char.avatarUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDa3dN6ra7trV_8BC_vI122eGjBoNIObgEa08L3pCQ7ZYGP_gCb86wHjSaQr1dbdJAaMJiPcKMmhFpc7DnfmZWqE6DV6a44ZpaO8FAW_Vc1Suf0yvaGI_4Ow5qkOAAHYyZruZsGaGE9EdbESnhjzr01LDx4YSDP1i8uSFxYCBL07I1KlAEpxtZuMwjyMqO1PC9fR0W0LIEKNmg_03c2iyiEIWVa3iSgBmbw8WiK3HNbZslAidf0iv-9'"/>
              <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
              <div class="absolute top-4 right-4">
                <span class="bg-black/80 border border-[#ffb4a8] text-[#ffb4a8] px-3 py-1 text-xs tracking-tighter">{{ getAttribute(char, 'generation') || '13' }}ª Geração</span>
              </div>
            </div>
            <div class="p-4 flex flex-col flex-grow">
              <h3 class="font-serif text-3xl text-[#e2e2e2] mb-2">{{ char.name }}</h3>
              <p class="text-[#e3beb8] text-base mb-6 leading-relaxed">
                A Máscara (V5). Horror pessoal e intriga política. Lide com a Fome e a Besta interior.
              </p>
              <div class="mt-auto flex items-center justify-between border-t border-[#5a403c]/20 pt-4">
                <span class="text-xs text-[#aa8984] tracking-widest uppercase">CLÃ {{ getAttribute(char, 'clan') || 'DESCONHECIDO' }}</span>
                <button class="blood-btn text-xs text-[#ffb4a8] tracking-widest uppercase py-2 font-bold">ABRAÇAR A ESCURIDÃO</button>
              </div>
            </div>
          </article>

          <!-- Empty State / New Card Slot -->
          <div @click="router.push('/jogador/vampire/novo')" class="border-2 border-dashed border-[#5a403c] flex flex-col items-center justify-center p-8 text-center opacity-60 hover:opacity-100 hover:border-[#ffb4a8] transition-all cursor-pointer min-h-[400px]">
            <span class="text-4xl mb-4 text-[#ffb4a8]">➕</span>
            <h3 class="font-serif text-2xl text-[#e2e2e2] mb-2">Despertar um Novo</h3>
            <p class="text-[#e3beb8] text-base">Sua linhagem aguarda uma nova adição às sombras.</p>
          </div>

        </div>
      </div>
    </main>

    <!-- Floating Action Button -->
    <button @click="router.push('/jogador/vampire/novo')" class="fab-blood fixed bottom-8 right-8 w-16 h-16 bg-[#8b0000] text-white rounded-full flex items-center justify-center z-50 transition-transform active:scale-90 lg:w-20 lg:h-20" title="Criar Personagem">
      <span class="text-3xl">➕</span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../../stores/authStore';
import api from '../../../services/api';

const router = useRouter();
const authStore = useAuthStore();
const characters = ref([]);
const loading = ref(true);

const fetchVampires = async () => {
  loading.value = true;
  try {
    const response = await api.get('/characters');
    // Filtra apenas personagens do sistema VAMPIRE
    characters.value = response.data.filter(c => c.gameStyle === 'VAMPIRE');
  } catch (error) {
    console.error("Erro ao buscar vampiros:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchVampires();
});

const getAttribute = (char, attrName) => {
  if (!char.attributes) return null;
  const attr = char.attributes.find(a => a.name.toLowerCase() === attrName.toLowerCase());
  return attr ? attr.value : null;
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.grain-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}
.vampire-card {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #2a2a2a;
}
.vampire-card:hover {
  border-color: #8b0000;
  transform: translateY(-4px);
  box-shadow: 0 10px 30px -10px rgba(139, 0, 0, 0.3);
}
.vampire-card:hover .card-img {
  filter: grayscale(0%) contrast(1.1);
  scale: 1.05;
}
.card-img {
  transition: all 0.6s ease;
  filter: grayscale(30%);
}
.blood-btn {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}
.blood-btn::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; width: 100%; height: 2px;
  background: #8b0000;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s ease;
}
.blood-btn:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}
.fab-blood {
  box-shadow: 0 0 20px rgba(139, 0, 0, 0.5);
  animation: pulse-blood 3s infinite;
}
@keyframes pulse-blood {
  0% { box-shadow: 0 0 0 0 rgba(139, 0, 0, 0.7); }
  70% { box-shadow: 0 0 0 15px rgba(139, 0, 0, 0); }
  100% { box-shadow: 0 0 0 0 rgba(139, 0, 0, 0); }
}
</style>
