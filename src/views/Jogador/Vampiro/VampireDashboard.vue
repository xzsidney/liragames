<template>
  <div class="min-h-screen font-body flex flex-col" style="background-color: var(--bg-deep); color: var(--text-main); background-image: radial-gradient(ellipse at 20% 10%, rgba(139,0,0,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 90%, rgba(42,26,92,0.1) 0%, transparent 60%);">
    
    <!-- PARTICLES -->
    <div id="particles" aria-hidden="true" class="pointer-events-none fixed inset-0 z-0"></div>

    <header id="main-header">
      <div class="header-inner">
        <div class="header-logo" @click="router.push('/jogador')" style="cursor: pointer;">
          <span class="logo-symbol">⚜</span>
          <div class="logo-text">
            <span class="logo-title">Camarilla</span>
            <span class="logo-sub">de São Paulo</span>
          </div>
        </div>
        <nav class="header-nav hidden md:flex items-center">
          <a @click.prevent="router.push('/jogador')" class="header-home-link" style="cursor: pointer;">⚜ Mundo das Trevas</a>
          <span class="nav-sep">|</span>
          <a href="#" class="header-home-link cursor-not-allowed">🗺️ Mapa da Cidade</a>
          <span class="nav-sep">|</span>
          <span class="text-[var(--blood-bright)] font-bold">Vampiro: A Máscara</span>
        </nav>
        <div class="flex items-center gap-4 z-10">
          <button @click="handleLogout" class="header-home-link" style="cursor: pointer;">
            Sair
          </button>
        </div>
      </div>
      <div class="header-bar"></div>
    </header>

    <main class="flex-grow pt-16 pb-24 relative z-10">
      
      <section id="gallery-view" class="view active">
        <div class="gallery-hero">
          <h1 class="gallery-title">Os Filhos da Noite</h1>
          <p class="gallery-subtitle">Treze almas condenadas habitam as sombras de São Paulo. Escolha um, se ousar conhecê-lo.</p>
          <div class="gallery-divider">
            <span class="divider-line"></span>
            <span class="divider-icon" style="color: var(--blood-bright);">🩸</span>
            <span class="divider-line"></span>
          </div>
        </div>

        <div class="filter-bar">
          <button @click="setFilter('all')" :class="['filter-btn', { active: activeFilter === 'all' }]">Todos</button>
          <button @click="setFilter('Ventrue')" :class="['filter-btn', { active: activeFilter === 'Ventrue' }]">👑 Ventrue</button>
          <button @click="setFilter('Gangrel')" :class="['filter-btn', { active: activeFilter === 'Gangrel' }]">🐺 Gangrel</button>
          <button @click="setFilter('Toreador')" :class="['filter-btn', { active: activeFilter === 'Toreador' }]">🌹 Toreador</button>
          <button @click="setFilter('Nosferatu')" :class="['filter-btn', { active: activeFilter === 'Nosferatu' }]">🦇 Nosferatu</button>
          <button @click="setFilter('Brujah')" :class="['filter-btn', { active: activeFilter === 'Brujah' }]">✊ Brujah</button>
          <button @click="setFilter('Tremere')" :class="['filter-btn', { active: activeFilter === 'Tremere' }]">🔮 Tremere</button>
        </div>

        <div v-if="loading" class="flex justify-center items-center py-20">
          <p class="text-[var(--blood-bright)] text-xl animate-pulse font-title italic">Despertando as sombras...</p>
        </div>

        <div v-else class="card-grid">
          <article 
            v-for="(char, idx) in filteredCharacters" 
            :key="char.id"
            @click="router.push(`/jogador/vampire/personagem/${char.id}`)"
            class="char-card card-loading"
            :style="getCardStyle(char, idx)"
          >
            <div class="card-img-wrap">
              <img class="card-img" :src="getAvatarUrl(char)" :alt="char.name" loading="lazy" />
              <div class="card-img-overlay"></div>
              
              <!-- Humanidade dots -->
              <div class="card-humanidade" :title="'Humanidade: ' + (getAttribute(char, 'humanity') || 7) + '/10'">
                 <span v-for="i in 10" :key="i" :class="['hum-dot', { 'empty': i > (getAttribute(char, 'humanity') || 7) }]"></span>
              </div>
              
              <div class="card-body">
                <div class="card-cla-badge" :style="getBadgeStyle(char)">
                  {{ getClanIcon(char) }} {{ getAttribute(char, 'clan') || 'Desconhecido' }}
                </div>
                <h2 class="card-nome">{{ char.name }}</h2>
                <p class="card-conceito">{{ char.concept || 'Membro da Camarilla' }}</p>
              </div>
            </div>
            <div class="card-hover-cta">Acessar Ficha →</div>
          </article>

          <!-- Botão de Novo Personagem (Estilizado como card) -->
          <article 
            @click="router.push('/jogador/vampire/novo')"
            class="char-card card-loading hover:border-[var(--gold)] hover:shadow-[0_0_20px_rgba(201,168,76,0.3)]"
            style="display: flex; flex-direction: column; align-items: center; justify-content: center; border-style: dashed; border-width: 2px; border-color: var(--border-mid); background: rgba(201,168,76,0.03); min-height: 400px; animation-delay: 0.5s;"
          >
            <span style="font-size: 3rem; color: var(--gold); margin-bottom: 16px;">➕</span>
            <h2 class="card-nome" style="color: var(--gold-bright);">Novo Membro</h2>
            <p class="card-conceito text-center px-8" style="color: var(--parchment-dim);">Sua linhagem aguarda uma nova adição às sombras de São Paulo.</p>
          </article>
        </div>
      </section>

    </main>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../../stores/authStore';
import api from '../../../services/api';

const router = useRouter();
const authStore = useAuthStore();
const characters = ref([]);
const attributeDefs = ref({});
const loading = ref(true);
const activeFilter = ref('all');

const fetchVampires = async () => {
  loading.value = true;
  try {
    const [charRes, defRes] = await Promise.all([
      api.get('/characters'),
      api.get('/attribute-definitions')
    ]);
    
    // Map definitions
    const defs = {};
    if (defRes.data && Array.isArray(defRes.data)) {
      defRes.data.forEach(d => {
        defs[d.id] = d.name;
      });
    }
    attributeDefs.value = defs;
    
    characters.value = charRes.data.filter(c => c.gameStyle === 'VAMPIRE');
  } catch (error) {
    console.error("Erro ao buscar vampiros:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchVampires();
});

const getAvatarUrl = (char) => {
  if (!char.avatarUrl) return '/images/vampire.png';
  if (char.avatarUrl.startsWith('http')) return char.avatarUrl;
  return `${api.defaults.baseURL.replace('/api', '')}${char.avatarUrl}`;
};

const getAttribute = (char, attrName) => {
  if (!char.attributes) return null;
  const attr = char.attributes.find(a => {
    const name = a.attribute?.name || a.name || attributeDefs.value[a.attributeId] || '';
    return name.toLowerCase() === attrName.toLowerCase();
  });
  // For text attributes, we used the 'description' field in our SQL script for things like clan, concept, etc.
  if (attr) {
    if (attr.description) return attr.description;
    return attr.value;
  }
  return null;
};

const setFilter = (clan) => {
  activeFilter.value = clan;
};

const filteredCharacters = computed(() => {
  if (activeFilter.value === 'all') return characters.value;
  return characters.value.filter(char => {
    const clan = getAttribute(char, 'clan');
    return clan && clan.toLowerCase() === activeFilter.value.toLowerCase();
  });
});

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

// Configurações e Cores baseadas no protótipo original
const clanConfigs = {
  'Ventrue': { cor: '#1a3a5c', corTexto: '#6fa8dc', icone: '👑' },
  'Gangrel': { cor: '#3d2b1f', corTexto: '#c4894a', icone: '🐺' },
  'Toreador': { cor: '#5c1a3a', corTexto: '#e07aad', icone: '🌹' },
  'Nosferatu': { cor: '#1a2a1a', corTexto: '#6abf69', icone: '🦇' },
  'Brujah': { cor: '#5c1a1a', corTexto: '#e07070', icone: '✊' },
  'Tremere': { cor: '#2a1a5c', corTexto: '#9a7ae0', icone: '🔮' },
};

const getClanConfig = (char) => {
  const clan = getAttribute(char, 'clan');
  if (clan) {
    const found = Object.keys(clanConfigs).find(k => k.toLowerCase() === clan.toLowerCase());
    if (found) return clanConfigs[found];
  }
  return { cor: '#3a3a3a', corTexto: '#aaaaaa', icone: '●' };
};

const getClanIcon = (char) => {
  return getClanConfig(char).icone;
};

const getCardStyle = (char, idx) => {
  const cfg = getClanConfig(char);
  return {
    'animation-delay': `${idx * 0.05}s`,
    '--card-glow-color': cfg.corTexto,
    '--card-glow-shadow': cfg.cor + 'aa'
  };
};

const getBadgeStyle = (char) => {
  const cfg = getClanConfig(char);
  return {
    background: cfg.cor + '33',
    color: cfg.corTexto,
    borderColor: cfg.corTexto + '55'
  };
};
</script>

<style scoped>
/* A maioria do CSS já está no style.css global que adaptamos! */
/* Os efeitos de hover, as bolinhas de humanidade e as fontes são herdadas. */
</style>
