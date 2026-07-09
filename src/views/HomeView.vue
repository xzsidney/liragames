<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref<any>(null)

onMounted(() => {
  const userData = sessionStorage.getItem('lira_user')
  if (userData) {
    try {
      user.value = JSON.parse(userData)
    } catch(e) {}
  }
})

const navigateToLogin = () => {
  router.push('/login')
}

const navigateToHub = () => {
  router.push('/dashboard')
}

const handleLogout = () => {
  sessionStorage.removeItem('lira_token')
  sessionStorage.removeItem('lira_user')
  user.value = null
}
</script>

<template>
  <div class="min-h-screen bg-[#0a0a0a] text-white font-sans overflow-x-hidden">
    <!-- Navbar -->
    <header class="flex items-center justify-between px-8 py-4 bg-black/50 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
      <div class="text-xl font-bold tracking-widest uppercase">LiraRPG</div>
      <nav class="hidden md:flex space-x-6 text-sm text-text-muted">
        <a href="#sistemas" class="hover:text-white transition-colors">Sistemas</a>
        <a href="#narrativas" class="hover:text-white transition-colors">Narrativas</a>
        <a href="#comunidade" class="hover:text-white transition-colors">Comunidade</a>
      </nav>
      <div class="flex items-center space-x-4">
        <template v-if="user">
          <span class="text-xs text-text-muted hidden md:inline">Bem-vindo(a), <span class="text-white">{{ user.name }}</span></span>
          <button @click="navigateToHub" class="text-sm font-medium hover:text-white transition-colors">Hub</button>
          <button @click="handleLogout" class="bg-blood-red hover:bg-blood-red-hover text-white px-4 py-1.5 rounded text-sm font-bold transition-colors shadow-[0_0_10px_rgba(139,0,0,0.4)]">
            Sair
          </button>
        </template>
        <template v-else>
          <button @click="navigateToLogin" class="text-sm font-medium hover:text-white transition-colors">Entrar</button>
          <button @click="navigateToLogin" class="bg-blood-red hover:bg-blood-red-hover text-white px-4 py-1.5 rounded text-sm font-bold transition-colors shadow-[0_0_10px_rgba(139,0,0,0.4)]">
            Cadastrar-se
          </button>
        </template>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="relative py-32 px-6 flex flex-col items-center text-center">
      <!-- Glow effect -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blood-red/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div class="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
        <div class="flex items-center space-x-2 text-blood-red text-xs font-bold uppercase tracking-widest mb-6">
          <span class="w-2 h-2 rounded-full bg-blood-red animate-pulse"></span>
          <span>O Universo Digital da Escuridão</span>
        </div>
        
        <h1 class="text-5xl md:text-6xl font-serif mb-6 leading-tight">
          Sua Próxima Crônica <br/> Começa nas <span class="italic text-text-muted">Sombras</span>
        </h1>
        
        <p class="text-text-muted mb-10 text-lg max-w-2xl leading-relaxed">
          Gerencie fichas complexas com facilidade e mergulhe em aventuras solo assíncronas no universo de World of Darkness. Onde a narrativa encontra a elegância da escuridão.
        </p>
        
        <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <button @click="navigateToLogin" class="bg-blood-red hover:bg-blood-red-hover text-white px-8 py-3 rounded text-sm font-bold transition-all shadow-[0_0_15px_rgba(139,0,0,0.5)]">
            Ir para o Hub →
          </button>
          <a href="#sistemas" class="border border-white/20 hover:bg-white/5 text-white px-8 py-3 rounded text-sm font-bold transition-colors flex items-center justify-center">
            Explorar Sistemas
          </a>
        </div>
      </div>
    </section>

    <!-- Sistemas Suportados -->
    <section id="sistemas" class="py-20 px-6 max-w-6xl mx-auto border-t border-white/5">
      <div class="mb-12 text-center md:text-left">
        <h2 class="text-3xl font-serif mb-3">Sistemas Suportados</h2>
        <p class="text-text-muted text-sm max-w-xl">Integração nativa com as regras da 5ª Edição e clássicos do WoD. Automatize sua ficha e foque no Roleplay.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- V5 -->
        <div class="group relative rounded-xl overflow-hidden border border-white/10 bg-[#111] hover:border-blood-red/50 transition-colors duration-500">
          <img src="/images/vampire.png" alt="Vampire V5" class="w-full h-48 object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500 grayscale group-hover:grayscale-0" />
          <div class="p-6">
            <h3 class="text-xl font-bold mb-2">Vampiro: A Máscara (V5)</h3>
            <p class="text-sm text-text-muted mb-4">Controle sua fome e mantenha sua humanidade em uma narrativa de horror político.</p>
            <div class="flex space-x-2">
              <span class="text-xs px-2 py-1 bg-white/5 rounded border border-white/10">Sangue Requisitório</span>
              <span class="text-xs px-2 py-1 bg-white/5 rounded border border-white/10">Lase Drops</span>
            </div>
          </div>
        </div>

        <!-- W5 -->
        <div class="group relative rounded-xl overflow-hidden border border-white/10 bg-[#111] hover:border-green-800/50 transition-colors duration-500">
          <img src="/images/werewolf.png" alt="Werewolf W5" class="w-full h-48 object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500 grayscale group-hover:grayscale-0" />
          <div class="p-6">
            <h3 class="text-xl font-bold mb-2">Lobisomem (W5)</h3>
            <p class="text-sm text-text-muted mb-4">Lute contra a corrupção da Wyrm e proteja Gaia com a fúria da sua matilha.</p>
            <div class="flex space-x-2">
              <span class="text-xs px-2 py-1 bg-white/5 rounded border border-white/10">Cinco Formas</span>
            </div>
          </div>
        </div>

        <!-- M20 -->
        <div class="group relative rounded-xl overflow-hidden border border-white/10 bg-[#111] hover:border-purple-800/50 transition-colors duration-500">
          <img src="/images/mage.png" alt="Mage M20" class="w-full h-48 object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500 grayscale group-hover:grayscale-0" />
          <div class="p-6">
            <h3 class="text-xl font-bold mb-2">Mago (M20)</h3>
            <p class="text-sm text-text-muted mb-4">A realidade é maleável. Desperte sua vontade e remolde o universo enfrentando o Paradoxo.</p>
            <div class="flex space-x-2">
              <span class="text-xs px-2 py-1 bg-white/5 rounded border border-white/10">Sistema de Esferas</span>
            </div>
          </div>
        </div>

        <!-- Hunter H5 (Full Width) -->
        <div class="md:col-span-3 group relative rounded-xl overflow-hidden border border-white/10 bg-[#111] hover:border-orange-800/50 transition-colors duration-500 flex flex-col md:flex-row">
          <div class="md:w-1/2 p-8 flex flex-col justify-center">
            <div class="text-orange-500 text-xs font-bold uppercase tracking-widest mb-2">Lançamento Recente</div>
            <h3 class="text-2xl font-bold mb-3">Caçador: A Revanche (H5)</h3>
            <p class="text-sm text-text-muted mb-6">Quando os monstros são reais, alguém precisa revidar. O sistema definitivo para caçar o que habita na noite, com ferramentas de gestão de equipamentos e motivações.</p>
            <div><button class="text-orange-500 hover:text-orange-400 text-sm font-bold flex items-center">Saiba mais sobre H5 <span class="ml-1">→</span></button></div>
          </div>
          <div class="md:w-1/2 h-64 md:h-auto">
            <img src="/images/hunter.png" alt="Hunter H5" class="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500 grayscale group-hover:grayscale-0" />
          </div>
        </div>
      </div>
    </section>

    <!-- Narrativas Section -->
    <section id="narrativas" class="py-20 px-6 bg-[#0a0a0a] border-t border-white/5 relative">
      <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div class="md:w-1/2">
          <img src="/images/adventure.png" alt="RPG Tabletop" class="rounded-xl border border-white/10 shadow-2xl opacity-80" />
        </div>
        <div class="md:w-1/2">
          <h2 class="text-3xl font-serif mb-6">Narrativas <span class="text-blood-red italic">Vivas</span> e Imersivas</h2>
          <p class="text-text-muted text-sm mb-10 leading-relaxed">
            Experimente nosso módulo de aventuras solo assíncronas, ideal para a união entre os RPGs clássicos de mesa e os sistemas modernos de APP. Suas escolhas moldam a crônica, com o sistema Lira calculando suas rolagens e consequências em tempo real.
          </p>

          <div class="space-y-8">
            <div class="flex items-start">
              <div class="mt-1 mr-4 w-4 h-4 rounded-full border-2 border-blood-red flex-shrink-0"></div>
              <div>
                <h4 class="font-bold text-sm mb-1">Decisões com Consequências</h4>
                <p class="text-xs text-text-muted">Cada escolha afeta permanentemente seus Atributos e Dinâmicas.</p>
              </div>
            </div>
            
            <div class="flex items-start">
              <div class="mt-1 mr-4 w-4 h-4 rounded-full border-2 border-blood-red flex-shrink-0"></div>
              <div>
                <h4 class="font-bold text-sm mb-1">Jogue no Seu Ritmo</h4>
                <p class="text-xs text-text-muted">Sistema assíncrono que salva seu progresso instantaneamente.</p>
              </div>
            </div>

            <div class="flex items-start">
              <div class="mt-1 mr-4 w-4 h-4 rounded-full border-2 border-blood-red flex-shrink-0"></div>
              <div>
                <h4 class="font-bold text-sm mb-1">Interface Focada no Texto</h4>
                <p class="text-xs text-text-muted">Elimina distrações e mergulha profundamente na atmosfera do WoD.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-16 border-y border-white/5 bg-[#0d0d0d]">
      <div class="max-w-4xl mx-auto text-center px-6">
        <h3 class="text-blood-red font-serif text-xl tracking-widest uppercase mb-4">A Arquitetura Ideal para Narrativas Infinitas</h3>
        <p class="text-text-muted text-xs mb-12">Construído por narradores para narradores. A ferramenta que você precisava para dar vida ao seu World of Darkness.</p>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div class="text-3xl font-serif text-white mb-1">15k+</div>
            <div class="text-[10px] uppercase tracking-widest text-text-muted">Fichas Criadas</div>
          </div>
          <div>
            <div class="text-3xl font-serif text-white mb-1">250+</div>
            <div class="text-[10px] uppercase tracking-widest text-text-muted">Crônicas Ativas</div>
          </div>
          <div>
            <div class="text-3xl font-serif text-white mb-1">98%</div>
            <div class="text-[10px] uppercase tracking-widest text-text-muted">Imersão Garantida</div>
          </div>
          <div>
            <div class="text-3xl font-serif text-white mb-1">24/7</div>
            <div class="text-[10px] uppercase tracking-widest text-text-muted">Disponibilidade</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-24 px-6 flex justify-center border-b border-white/5">
      <div class="glass-panel p-10 md:p-16 max-w-3xl w-full text-center relative overflow-hidden">
        <div class="absolute inset-0 bg-blood-red/5 z-0"></div>
        <div class="relative z-10">
          <h2 class="text-3xl font-serif mb-4">Pronto para sua primeira mordida?</h2>
          <p class="text-text-muted text-sm mb-8 max-w-lg mx-auto">
            Crie sua conta agora e ganhe acesso imediato a todas as ferramentas de criação de personagens e o privilégio da História de Lançamento!
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button @click="navigateToLogin" class="bg-blood-red hover:bg-blood-red-hover text-white px-8 py-3 rounded text-sm font-bold transition-colors w-full sm:w-auto">
              Inscrever-se Gratuitamente
            </button>
            <p class="text-[10px] text-text-muted text-left">
              Demora menos de 1 minuto.<br/>Apenas na sua Escuridão.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-12 px-6 bg-black text-text-muted text-xs">
      <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-8">
        <div class="md:w-1/3">
          <div class="text-white font-bold text-lg mb-4">LiraRPG</div>
          <p>© 2026 LiraRPG, World of Darkness. Ferramenta gerada internamente para ilustrar narrativas Épicas.</p>
        </div>
        <div class="grid grid-cols-2 gap-12">
          <div>
            <h4 class="text-white font-bold mb-4 uppercase tracking-wider">Comunidade</h4>
            <ul class="space-y-2">
              <li><a href="#" class="hover:text-white">Discord</a></li>
              <li><a href="#" class="hover:text-white">Instagram</a></li>
              <li><a href="#" class="hover:text-white">Twitch</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-white font-bold mb-4 uppercase tracking-wider">Legal</h4>
            <ul class="space-y-2">
              <li><a href="#" class="hover:text-white">Termos de Uso</a></li>
              <li><a href="#" class="hover:text-white">Privacidade</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
html {
  scroll-behavior: smooth;
}
</style>
