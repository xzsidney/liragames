<template>
  <div class="min-h-screen bg-[#050505] text-parchment font-sans relative overflow-x-hidden selection:bg-blood-red selection:text-white flex flex-col">
    <!-- NOISE OVERLAY (Estética Living World Engine) -->
    <div class="fixed inset-0 pointer-events-none opacity-[0.15] mix-blend-overlay z-0" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>
    
    <!-- SUBTLE GLOW BACKGROUNDS -->
    <div class="fixed top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blood-red/10 blur-[150px] rounded-full pointer-events-none z-0"></div>

    <!-- HEADER / NAVBAR -->
    <nav class="relative z-20 border-b border-white/5 bg-black/60 backdrop-blur-md sticky top-0">
      <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3 cursor-pointer" @click="router.push('/jogador/vampire')">
          <div class="w-8 h-8 rounded-full border border-gold-dim flex items-center justify-center bg-black shadow-[0_0_15px_rgba(212,175,55,0.15)]">
            <span class="text-gold font-serif text-lg">L</span>
          </div>
          <span class="font-serif text-sm tracking-widest text-parchment">Nocturna (V5)</span>
        </div>
        
        <div class="flex items-center gap-2">
          <!-- Passo Atual Indicator -->
          <div class="hidden md:flex gap-1 mr-4">
            <div v-for="step in 6" :key="step" 
                 class="h-1 rounded-full transition-all duration-300"
                 :class="store.currentStep >= step ? 'w-6 bg-blood-red shadow-[0_0_8px_rgba(139,0,0,0.8)]' : 'w-2 bg-white/20'">
            </div>
          </div>
          
          <button @click="router.push('/jogador/vampire')" class="text-xs font-serif tracking-widest uppercase text-gray-400 hover:text-white transition-colors">
            Abandonar
          </button>
        </div>
      </div>
    </nav>

    <!-- CONTAINER PRINCIPAL DOS PASSOS -->
    <main class="relative z-10 flex-grow max-w-6xl w-full mx-auto px-6 py-10 flex flex-col justify-center">
      
      <!-- ALERTS -->
      <div v-if="store.errorMessage" class="mb-6 p-4 rounded-lg bg-red-950/80 border border-red-500/50 text-red-200 text-sm text-center animate-fade-in shadow-[0_0_20px_rgba(255,0,0,0.1)]">
        {{ store.errorMessage }}
      </div>

      <!-- COMPONENTES DOS PASSOS (Transições suaves) -->
      <transition name="fade-slide" mode="out-in">
        <Step1Identity v-if="store.currentStep === 1" />
        <Step2Embrace v-else-if="store.currentStep === 2" />
        <Step3Sire v-else-if="store.currentStep === 3" />
        <Step4Predator v-else-if="store.currentStep === 4" />
        <Step5Philosophy v-else-if="store.currentStep === 5" />
        <Step6Summary v-else-if="store.currentStep === 6" />
      </transition>

    </main>

    <!-- FOOTER / NAVEGAÇÃO -->
    <footer class="relative z-20 border-t border-white/5 bg-black/80 backdrop-blur-md mt-auto">
      <div class="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        
        <button 
          v-if="store.currentStep > 1"
          @click="store.prevStep"
          class="px-6 py-2.5 rounded-lg border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white text-xs font-serif tracking-widest uppercase transition-colors"
        >
          ← Voltar
        </button>
        <div v-else></div> <!-- Placeholder para flex justify-between -->

        <button 
          v-if="store.currentStep < 6"
          @click="store.nextStep"
          :disabled="!canProceed"
          class="px-8 py-2.5 rounded-lg border border-gold/40 text-gold hover:border-gold hover:bg-gold/10 text-xs font-serif tracking-widest uppercase transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-[0_0_15px_rgba(212,175,55,0.3)]"
        >
          Continuar →
        </button>

        <button 
          v-if="store.currentStep === 6"
          @click="handleFinish"
          :disabled="store.isLoading"
          class="px-8 py-2.5 rounded-lg bg-blood-red hover:bg-red-700 text-white font-serif text-xs tracking-widest uppercase transition-all duration-300 shadow-[0_0_20px_rgba(139,0,0,0.6)] disabled:opacity-50 hover:scale-105"
        >
          {{ store.isLoading ? 'Iniciando...' : 'Entrar em Nocturna' }}
        </button>

      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCharacterCreationStore } from '../stores/characterCreationStore'

// Componentes
import Step1Identity from '../components/character-creation/Step1Identity.vue'
import Step2Embrace from '../components/character-creation/Step2Embrace.vue'
import Step3Sire from '../components/character-creation/Step3Sire.vue'
import Step4Predator from '../components/character-creation/Step4Predator.vue'
import Step5Philosophy from '../components/character-creation/Step5Philosophy.vue'
import Step6Summary from '../components/character-creation/Step6Summary.vue'

const router = useRouter()
const store = useCharacterCreationStore()

onMounted(() => {
  store.fetchLibraries()
  store.setStep(1) // Garante que comece no passo 1 ao montar
})

// Validações simples para impedir avanço sem preencher campos obrigatórios
const canProceed = computed(() => {
  if (store.currentStep === 1) return store.form.name.trim() !== '' && store.form.concept !== ''
  if (store.currentStep === 2) return store.form.clanId !== null
  if (store.currentStep === 4) return store.form.predatorId !== null
  // Passos 3 e 5 podem ter opcionais, mas podemos exigir ambição/pilar
  if (store.currentStep === 5) return store.form.ambition.trim() !== '' && store.form.pillar?.trim() !== ''
  return true
})

const handleFinish = async () => {
  try {
    const userString = sessionStorage.getItem('lira_user') || localStorage.getItem('lira_user')
    const user = userString ? JSON.parse(userString) : null
    
    if (!user || !user.id) {
      store.errorMessage = "Sessão expirada. Refaça o login."
      return
    }

    await store.saveCharacter(user.id)
    
    // Sucesso - Animação ou redirecionamento direto
    router.push('/jogador/vampire')
    
  } catch (err) {
    // Erro já tratado na store (errorMessage atualizada)
  }
}
</script>

<style scoped>
/* Transições de Fade & Slide para os Passos */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
