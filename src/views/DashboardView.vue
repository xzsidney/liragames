<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref<any>(null)
const particlesContainer = ref<HTMLElement | null>(null)

// Sistema de partículas animadas do protótipo
const initParticles = () => {
  if (!particlesContainer.value) return
  const systems = [
    { color: '192,57,43', count: 8 },
    { color: '74,154,26', count: 6 },
    { color: '122,64,224', count: 6 },
    { color: '212,130,10', count: 5 },
    { color: '201,168,76', count: 4 },
  ];
  
  systems.forEach(({ color, count }) => {
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      const size = 1.5 + Math.random() * 2.5;
      p.style.cssText = `
        position: absolute; border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${80 + Math.random() * 20}%;
        width: ${size}px; height: ${size}px;
        background: rgb(${color});
        box-shadow: 0 0 ${size * 3}px rgba(${color}, 0.6);
        animation: rise linear infinite;
        animation-delay: ${Math.random() * 15}s;
        animation-duration: ${10 + Math.random() * 20}s;
      `;
      particlesContainer.value?.appendChild(p);
    }
  });
}

onMounted(() => {
  const token = sessionStorage.getItem('lira_token')
  const userData = sessionStorage.getItem('lira_user')
  
  if (!token || !userData) {
    router.push('/login')
    return
  }
  
  try {
    user.value = JSON.parse(userData)
  } catch(e) {
    console.error(e)
  }
  
  // Iniciar partículas logo após montar a DOM
  setTimeout(initParticles, 100)
})

onUnmounted(() => {
  if (particlesContainer.value) {
    particlesContainer.value.innerHTML = ''
  }
})

const handleLogout = () => {
  sessionStorage.removeItem('lira_token')
  sessionStorage.removeItem('lira_user')
  router.push('/')
}

const selectSystem = (system: string) => {
  router.push(`/characters/${system}`)
}
</script>

<template>
  <main class="min-h-screen bg-bg-deep text-parchment font-sans overflow-x-hidden selection:bg-vamp-c2 selection:text-white pb-20 relative">
    
    <!-- PARTICLES -->
    <div ref="particlesContainer" class="fixed inset-0 pointer-events-none z-0 overflow-hidden"></div>

    <!-- HERO BACKGROUND GLOW -->
    <div class="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(139,0,0,0.18)_0%,transparent_70%),radial-gradient(ellipse_60%_40%_at_20%_100%,rgba(42,0,112,0.12)_0%,transparent_60%),radial-gradient(ellipse_60%_40%_at_80%_100%,rgba(74,154,26,0.08)_0%,transparent_60%)]"></div>

    <!-- Top Navbar -->
    <header class="relative z-50 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/60 backdrop-blur-md">
      <div class="flex items-center space-x-3">
        <div class="text-gold">
          <span class="text-2xl drop-shadow-[0_0_12px_var(--color-gold-dim)] leading-none">🩸</span>
        </div>
        <div class="flex flex-col">
          <span class="font-deco text-base text-gold tracking-[2px] leading-tight">LiraRPG</span>
          <span class="font-serif text-[11px] text-parchment-dim tracking-[3px] uppercase">Portal</span>
        </div>
      </div>
      
      <div class="flex items-center space-x-6" v-if="user">
        <div class="flex items-center space-x-3">
          <div class="text-right">
            <div class="font-serif text-[10px] uppercase tracking-widest text-parchment-dim">{{ user.role === 'USER' ? 'JOGADOR' : user.role }}</div>
            <div class="font-sans font-semibold text-sm text-parchment">{{ user.name }}</div>
          </div>
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-gray-900 to-black border border-gold-dim flex items-center justify-center shadow-lg">
            <span class="text-lg font-serif text-gold drop-shadow">{{ user.name?.charAt(0).toUpperCase() }}</span>
          </div>
        </div>
        <div class="h-6 w-px bg-gold-dim/50"></div>
        <button @click="handleLogout" class="font-serif text-[11px] uppercase tracking-[2px] text-parchment-dim hover:text-gold transition-colors duration-300">
          Sair
        </button>
      </div>
    </header>

    <!-- HERO SECTION -->
    <div class="relative z-10 text-center pt-24 pb-16 px-6 overflow-hidden">
      <p class="font-serif text-[11px] tracking-[6px] uppercase color-gold-dim mb-4 flex items-center justify-center gap-4">
        <span class="w-10 h-px bg-gold-dim"></span>
        LiraRPG · Portal dos Sistemas
        <span class="w-10 h-px bg-gold-dim"></span>
      </p>

      <h1 class="font-deco text-5xl md:text-7xl leading-tight tracking-[4px] mb-2 bg-gradient-to-b from-[#f0d080] via-[#c9a84c] to-[#8a6020] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(201,168,76,0.35)]">
        Mundo<br/>das Trevas
      </h1>
      <p class="font-deco text-lg md:text-2xl tracking-[8px] text-gold/50 mb-8 uppercase">World of Darkness</p>

      <p class="font-sans italic text-sm md:text-base text-text-dim max-w-2xl mx-auto mb-12 leading-loose">
        Quatro sistemas. Quatro perspectivas da noite. Uma única verdade: os monstros são reais — e alguns deles ainda lutam para lembrar o que são.
      </p>

      <div class="flex items-center justify-center gap-6 mb-4">
        <span class="flex-1 max-w-[200px] h-px bg-gradient-to-r from-transparent to-gold-dim"></span>
        <span class="text-xl">⚜</span>
        <span class="flex-1 max-w-[200px] h-px bg-gradient-to-l from-transparent to-gold-dim"></span>
      </div>
    </div>

    <!-- SYSTEMS GRID -->
    <div class="relative z-10 max-w-[1300px] mx-auto px-8 pb-32">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-7">
        
        <!-- VAMPIRO -->
        <div class="group relative rounded-2xl overflow-hidden cursor-pointer block border border-white/5 transition-all duration-500 hover:border-vamp-c2/40 hover:shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(192,57,43,0.25)] bg-[#08000f] min-h-[520px]" @click="selectSystem('vampire')">
          <div class="absolute inset-0 overflow-hidden">
            <img src="/images/vampire.png" alt="Vampiro" class="w-full h-full object-cover transition-all duration-700 saturate-50 brightness-50 group-hover:scale-105 group-hover:saturate-100 group-hover:brightness-75" />
          </div>
          <div class="absolute inset-0 bg-gradient-to-br from-black/30 via-black/60 to-black/95 opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
          
          <!-- Cantos decorativos -->
          <span class="absolute top-4 left-4 w-7 h-7 border-vamp-c1 border-t-2 border-l-2 rounded-tl-sm opacity-40 transition-all duration-400 group-hover:opacity-100 group-hover:w-10 group-hover:h-10"></span>
          <span class="absolute top-4 right-4 w-7 h-7 border-vamp-c1 border-t-2 border-r-2 rounded-tr-sm opacity-40 transition-all duration-400 group-hover:opacity-100 group-hover:w-10 group-hover:h-10"></span>
          <span class="absolute bottom-4 left-4 w-7 h-7 border-vamp-c1 border-b-2 border-l-2 rounded-bl-sm opacity-40 transition-all duration-400 group-hover:opacity-100 group-hover:w-10 group-hover:h-10"></span>
          <span class="absolute bottom-4 right-4 w-7 h-7 border-vamp-c1 border-b-2 border-r-2 rounded-br-sm opacity-40 transition-all duration-400 group-hover:opacity-100 group-hover:w-10 group-hover:h-10"></span>

          <div class="absolute inset-0 flex flex-col justify-end p-8 z-10">
            <span class="font-serif text-[10px] tracking-[3px] uppercase px-3 py-1 rounded-full border border-vamp-c2/50 bg-vamp-c1/30 text-[#e87070] inline-block mb-3 w-fit group-hover:shadow-[0_0_12px_rgba(192,57,43,0.6)] transition-shadow">V5 · Vampiro</span>
            <span class="text-4xl mb-2 block drop-shadow-[0_0_12px_rgba(255,255,255,0.3)] transition-all duration-400 group-hover:scale-110 group-hover:-rotate-3 group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] origin-left">🎭</span>
            <h2 class="font-deco text-3xl md:text-4xl leading-tight mb-2 text-[#f0a0a0] transition-all group-hover:drop-shadow-[0_0_20px_rgba(192,57,43,0.6)]">Vampiro:<br/>A Máscara</h2>
            <p class="font-serif text-[11px] tracking-[2px] uppercase mb-4 text-vamp-c2/90">Horror Pessoal & Intriga Política</p>
            <div class="w-12 h-px mb-4 bg-gradient-to-r from-vamp-c1 to-transparent transition-all duration-400 group-hover:w-20"></div>
            <p class="font-sans italic text-[0.88rem] leading-relaxed text-parchment/75 max-w-[420px] mb-5">
              Você foi transformado em um monstro sugador de sangue. A Besta dentro de você uiva por sangue enquanto a sociedade vampírica exige elegância. Equilibre sua Humanidade — ou sucumba à escuridão.
            </p>
            <div class="inline-flex items-center gap-2 font-serif text-[10px] tracking-[2px] uppercase px-3 py-1.5 rounded-full border border-vamp-c2/40 bg-vamp-c1/20 text-[#e07070] mb-6 w-fit opacity-80 transition-all group-hover:opacity-100 group-hover:shadow-[0_0_10px_rgba(192,57,43,0.6)]">
              <span>⚡</span> Mecânica: Fome · Humanidade · Disciplinas
            </div>
            <div class="flex items-center gap-2 font-serif text-xs tracking-[3px] uppercase text-[#e07070] transition-all group-hover:gap-4">
              <span>Ver Personagens</span>
              <span class="inline-flex items-center justify-center w-8 h-8 rounded-full border border-vamp-c2/50 text-base transition-all group-hover:translate-x-1 group-hover:shadow-[0_0_14px_rgba(192,57,43,0.6)]">→</span>
            </div>
          </div>
        </div>

        <!-- LOBISOMEM -->
        <div class="group relative rounded-2xl overflow-hidden cursor-pointer block border border-white/5 transition-all duration-500 hover:border-wolf-c2/35 hover:shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(74,154,26,0.2)] bg-[#030d00] min-h-[520px]" @click="selectSystem('werewolf')">
          <div class="absolute inset-0 overflow-hidden">
            <img src="/images/werewolf.png" alt="Lobisomem" class="w-full h-full object-cover transition-all duration-700 saturate-50 brightness-50 group-hover:scale-105 group-hover:saturate-100 group-hover:brightness-75" />
          </div>
          <div class="absolute inset-0 bg-gradient-to-br from-black/30 via-black/60 to-black/95 opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
          
          <span class="absolute top-4 left-4 w-7 h-7 border-wolf-c1 border-t-2 border-l-2 rounded-tl-sm opacity-40 transition-all duration-400 group-hover:opacity-100 group-hover:w-10 group-hover:h-10"></span>
          <span class="absolute top-4 right-4 w-7 h-7 border-wolf-c1 border-t-2 border-r-2 rounded-tr-sm opacity-40 transition-all duration-400 group-hover:opacity-100 group-hover:w-10 group-hover:h-10"></span>
          <span class="absolute bottom-4 left-4 w-7 h-7 border-wolf-c1 border-b-2 border-l-2 rounded-bl-sm opacity-40 transition-all duration-400 group-hover:opacity-100 group-hover:w-10 group-hover:h-10"></span>
          <span class="absolute bottom-4 right-4 w-7 h-7 border-wolf-c1 border-b-2 border-r-2 rounded-br-sm opacity-40 transition-all duration-400 group-hover:opacity-100 group-hover:w-10 group-hover:h-10"></span>

          <div class="absolute inset-0 flex flex-col justify-end p-8 z-10">
            <span class="font-serif text-[10px] tracking-[3px] uppercase px-3 py-1 rounded-full border border-wolf-c2/50 bg-wolf-c1/30 text-[#80d040] inline-block mb-3 w-fit group-hover:shadow-[0_0_12px_rgba(74,154,26,0.6)] transition-shadow">W5 · Lobisomem</span>
            <span class="text-4xl mb-2 block drop-shadow-[0_0_12px_rgba(255,255,255,0.3)] transition-all duration-400 group-hover:scale-110 group-hover:-rotate-3 group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] origin-left">🐺</span>
            <h2 class="font-deco text-3xl md:text-4xl leading-tight mb-2 text-[#a0e070] transition-all group-hover:drop-shadow-[0_0_20px_rgba(74,154,26,0.6)]">Lobisomem:<br/>O Apocalipse</h2>
            <p class="font-serif text-[11px] tracking-[2px] uppercase mb-4 text-wolf-c2/90">Horror Feral & Tragédia Ambiental</p>
            <div class="w-12 h-px mb-4 bg-gradient-to-r from-wolf-c1 to-transparent transition-all duration-400 group-hover:w-20"></div>
            <p class="font-sans italic text-[0.88rem] leading-relaxed text-parchment/75 max-w-[420px] mb-5">
              Os Garou são guerreiros sagrados de Gaia, lutando uma batalha perdida contra a Devastadora. Cada ato de fúria pode salvar o mundo — ou destruí-lo. Harano ou Hauglosk: qual será seu fim?
            </p>
            <div class="inline-flex items-center gap-2 font-serif text-[10px] tracking-[2px] uppercase px-3 py-1.5 rounded-full border border-wolf-c2/40 bg-wolf-c1/20 text-[#80d040] mb-6 w-fit opacity-80 transition-all group-hover:opacity-100 group-hover:shadow-[0_0_10px_rgba(74,154,26,0.6)]">
              <span>⚡</span> Mecânica: Fúria · Renome · Tribos
            </div>
            <div class="flex items-center gap-2 font-serif text-xs tracking-[3px] uppercase text-[#80d040] transition-all group-hover:gap-4">
              <span>Ver A Nação Garou</span>
              <span class="inline-flex items-center justify-center w-8 h-8 rounded-full border border-wolf-c2/50 text-base transition-all group-hover:translate-x-1 group-hover:shadow-[0_0_14px_rgba(74,154,26,0.6)]">→</span>
            </div>
          </div>
        </div>

        <!-- MAGO -->
        <div class="group relative rounded-2xl overflow-hidden cursor-pointer block border border-white/5 transition-all duration-500 hover:border-mage-c2/40 hover:shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(122,64,224,0.25)] bg-[#04001a] min-h-[520px]" @click="selectSystem('mage')">
          <div class="absolute inset-0 overflow-hidden">
            <img src="/images/mage.png" alt="Mago" class="w-full h-full object-cover transition-all duration-700 saturate-50 brightness-50 group-hover:scale-105 group-hover:saturate-100 group-hover:brightness-75" />
          </div>
          <div class="absolute inset-0 bg-gradient-to-br from-black/30 via-black/60 to-black/95 opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
          
          <span class="absolute top-4 left-4 w-7 h-7 border-mage-c1 border-t-2 border-l-2 rounded-tl-sm opacity-40 transition-all duration-400 group-hover:opacity-100 group-hover:w-10 group-hover:h-10"></span>
          <span class="absolute top-4 right-4 w-7 h-7 border-mage-c1 border-t-2 border-r-2 rounded-tr-sm opacity-40 transition-all duration-400 group-hover:opacity-100 group-hover:w-10 group-hover:h-10"></span>
          <span class="absolute bottom-4 left-4 w-7 h-7 border-mage-c1 border-b-2 border-l-2 rounded-bl-sm opacity-40 transition-all duration-400 group-hover:opacity-100 group-hover:w-10 group-hover:h-10"></span>
          <span class="absolute bottom-4 right-4 w-7 h-7 border-mage-c1 border-b-2 border-r-2 rounded-br-sm opacity-40 transition-all duration-400 group-hover:opacity-100 group-hover:w-10 group-hover:h-10"></span>

          <div class="absolute inset-0 flex flex-col justify-end p-8 z-10">
            <span class="font-serif text-[10px] tracking-[3px] uppercase px-3 py-1 rounded-full border border-mage-c2/50 bg-mage-c1/30 text-[#b080f0] inline-block mb-3 w-fit group-hover:shadow-[0_0_12px_rgba(122,64,224,0.6)] transition-shadow">M20 · Mago</span>
            <span class="text-4xl mb-2 block drop-shadow-[0_0_12px_rgba(255,255,255,0.3)] transition-all duration-400 group-hover:scale-110 group-hover:-rotate-3 group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] origin-left">🔮</span>
            <h2 class="font-deco text-3xl md:text-4xl leading-tight mb-2 text-[#c0a0f8] transition-all group-hover:drop-shadow-[0_0_20px_rgba(122,64,224,0.6)]">Mago:<br/>A Ascensão</h2>
            <p class="font-serif text-[11px] tracking-[2px] uppercase mb-4 text-mage-c2/90">A Luta pela Realidade</p>
            <div class="w-12 h-px mb-4 bg-gradient-to-r from-mage-c1 to-transparent transition-all duration-400 group-hover:w-20"></div>
            <p class="font-sans italic text-[0.88rem] leading-relaxed text-parchment/75 max-w-[420px] mb-5">
              A realidade é maleável — moldada pela crença coletiva. Você Despertou para esta verdade e agora briga contra a Tecnocracia pelo direito de definir o que é real. Nove Esferas. Infinitas possibilidades. Um Paradoxo mortal.
            </p>
            <div class="inline-flex items-center gap-2 font-serif text-[10px] tracking-[2px] uppercase px-3 py-1.5 rounded-full border border-mage-c2/40 bg-mage-c1/20 text-[#b080f0] mb-6 w-fit opacity-80 transition-all group-hover:opacity-100 group-hover:shadow-[0_0_10px_rgba(122,64,224,0.6)]">
              <span>⚡</span> Mecânica: 9 Esferas · Arete · Paradoxo
            </div>
            <div class="flex items-center gap-2 font-serif text-xs tracking-[3px] uppercase text-[#b080f0] transition-all group-hover:gap-4">
              <span>Ver Tradições</span>
              <span class="inline-flex items-center justify-center w-8 h-8 rounded-full border border-mage-c2/50 text-base transition-all group-hover:translate-x-1 group-hover:shadow-[0_0_14px_rgba(122,64,224,0.6)]">→</span>
            </div>
          </div>
        </div>

        <!-- CAÇADOR -->
        <div class="group relative rounded-2xl overflow-hidden cursor-pointer block border border-white/5 transition-all duration-500 hover:border-hunt-c2/35 hover:shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(212,130,10,0.2)] bg-[#0d0800] min-h-[520px]" @click="selectSystem('hunter')">
          <div class="absolute inset-0 overflow-hidden">
            <img src="/images/hunter.png" alt="Caçador" class="w-full h-full object-cover transition-all duration-700 saturate-50 brightness-50 group-hover:scale-105 group-hover:saturate-100 group-hover:brightness-75" />
          </div>
          <div class="absolute inset-0 bg-gradient-to-br from-black/30 via-black/60 to-black/95 opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
          
          <span class="absolute top-4 left-4 w-7 h-7 border-hunt-c1 border-t-2 border-l-2 rounded-tl-sm opacity-40 transition-all duration-400 group-hover:opacity-100 group-hover:w-10 group-hover:h-10"></span>
          <span class="absolute top-4 right-4 w-7 h-7 border-hunt-c1 border-t-2 border-r-2 rounded-tr-sm opacity-40 transition-all duration-400 group-hover:opacity-100 group-hover:w-10 group-hover:h-10"></span>
          <span class="absolute bottom-4 left-4 w-7 h-7 border-hunt-c1 border-b-2 border-l-2 rounded-bl-sm opacity-40 transition-all duration-400 group-hover:opacity-100 group-hover:w-10 group-hover:h-10"></span>
          <span class="absolute bottom-4 right-4 w-7 h-7 border-hunt-c1 border-b-2 border-r-2 rounded-br-sm opacity-40 transition-all duration-400 group-hover:opacity-100 group-hover:w-10 group-hover:h-10"></span>

          <div class="absolute inset-0 flex flex-col justify-end p-8 z-10">
            <span class="font-serif text-[10px] tracking-[3px] uppercase px-3 py-1 rounded-full border border-hunt-c2/50 bg-hunt-c1/30 text-[#f0a040] inline-block mb-3 w-fit group-hover:shadow-[0_0_12px_rgba(212,130,10,0.6)] transition-shadow">H5 · Caçador</span>
            <span class="text-4xl mb-2 block drop-shadow-[0_0_12px_rgba(255,255,255,0.3)] transition-all duration-400 group-hover:scale-110 group-hover:-rotate-3 group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] origin-left">🔫</span>
            <h2 class="font-deco text-3xl md:text-4xl leading-tight mb-2 text-[#f0c080] transition-all group-hover:drop-shadow-[0_0_20px_rgba(212,130,10,0.6)]">Caçador:<br/>A Revanche</h2>
            <p class="font-serif text-[11px] tracking-[2px] uppercase mb-4 text-hunt-c2/90">O Oprimido Contra o Sobrenatural</p>
            <div class="w-12 h-px mb-4 bg-gradient-to-r from-hunt-c1 to-transparent transition-all duration-400 group-hover:w-20"></div>
            <p class="font-sans italic text-[0.88rem] leading-relaxed text-parchment/75 max-w-[420px] mb-5">
              Você é humano. Sem superpoderes divinos, sem magia ancestral. Só perspicácia, fé, equipamento e a determinação de que a humanidade não será apenas gado. O desespero é seu combustível. Cuide para não se queimar.
            </p>
            <div class="inline-flex items-center gap-2 font-serif text-[10px] tracking-[2px] uppercase px-3 py-1.5 rounded-full border border-hunt-c2/40 bg-hunt-c1/20 text-[#f0a040] mb-6 w-fit opacity-80 transition-all group-hover:opacity-100 group-hover:shadow-[0_0_10px_rgba(212,130,10,0.6)]">
              <span>⚡</span> Mecânica: Ímpeto · Credo · Trunfos
            </div>
            <div class="flex items-center gap-2 font-serif text-xs tracking-[3px] uppercase text-[#f0a040] transition-all group-hover:gap-4">
              <span>Acessar Arquivos</span>
              <span class="inline-flex items-center justify-center w-8 h-8 rounded-full border border-hunt-c2/50 text-base transition-all group-hover:translate-x-1 group-hover:shadow-[0_0_14px_rgba(212,130,10,0.6)]">→</span>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- BOTTOM SECTION -->
    <div class="relative z-10 text-center pb-8 px-6">
      <div class="flex items-center justify-center gap-5 mb-8">
        <span class="flex-1 max-w-[300px] h-px bg-gradient-to-r from-transparent to-gold/30"></span>
        <span class="text-gold-dim">⚜</span>
        <span class="flex-1 max-w-[300px] h-px bg-gradient-to-l from-transparent to-gold/30"></span>
      </div>
      <p class="font-sans italic text-sm text-text-dim leading-loose max-w-[600px] mx-auto mb-10">
        "A noite pertence a muitos. Vampiros que conspiram em salões dourados. Lobisomens que uivam para uma lua moribunda. Magos que dobram a realidade com a força da vontade. E humanos que recusam aceitar que são presas."
      </p>
      
      <button class="font-serif text-[10px] tracking-[2px] uppercase px-4 py-2 rounded-full border border-gold text-gold hover:bg-gold/10 transition-all shadow-[0_0_10px_rgba(201,168,76,0.3)]">
        🗺️ Acessar Mapa Tático da Cidade
      </button>
    </div>

    <footer class="relative z-10 text-center pt-8 mt-12 pb-6 border-t border-gold/10 font-serif text-[10px] tracking-[2px] uppercase text-text-dim">
      <p>LiraRPG &bull; Mundo das Trevas &bull; World of Darkness &bull; Curitiba</p>
    </footer>

  </main>
</template>

<style>
@keyframes rise {
  0% { transform: translateY(0) scale(1); opacity: 0; }
  15% { opacity: 1; }
  85% { opacity: 0.3; }
  100% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
}
</style>
