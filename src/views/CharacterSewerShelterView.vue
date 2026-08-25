<template>
  <div class="min-h-screen bg-[#040807] text-parchment font-sans relative overflow-x-hidden selection:bg-emerald-900 selection:text-white pb-24 select-none">
    
    <!-- ATMOSPHERIC BACKGROUND OVERLAYS -->
    <div class="fixed inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-emerald-950/40 via-cyan-950/20 to-black z-0"></div>
    <div class="fixed inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay z-0" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.75%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>

    <!-- NAVBAR ESGOTO -->
    <header class="relative z-20 border-b border-emerald-500/30 bg-[#030806]/95 backdrop-blur-md sticky top-0 shadow-2xl">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button 
            @click="awakenForNextNight" 
            class="text-stone-400 hover:text-emerald-300 transition-colors flex items-center gap-1.5 font-serif text-xs uppercase tracking-widest"
            title="Ao retornar ao Hub, o personagem dorme durante o dia e desperta às 20:00 com o Rouse Check."
          >
            <span>&larr;</span> Hub (Despertar 20:00)
          </button>
          <div class="font-serif font-bold text-xs sm:text-sm tracking-widest flex items-center gap-2 text-emerald-400">
            <span>🕳️</span>
            GALERIAS SUBTERRÂNEAS • DOMÍNIO NOSFERATU
          </div>
        </div>

        <div class="flex items-center gap-4 text-xs font-mono">
          <div v-if="character" class="flex items-center gap-3">
            <span class="text-stone-400 hidden sm:inline">{{ character.name }}</span>
            <span class="text-red-400 font-bold bg-black/60 px-3 py-1 rounded border border-red-900/50 shadow-inner">
              🩸 Fome {{ character.hunger }}/5
            </span>
          </div>
        </div>
      </div>
    </header>

    <div v-if="loading" class="flex flex-col items-center justify-center min-h-[70vh] relative z-10 space-y-4">
      <div class="animate-spin w-12 h-12 border-2 border-emerald-900 border-t-emerald-400 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)]"></div>
      <p class="text-emerald-500/80 font-serif text-xs tracking-widest uppercase animate-pulse">
        Descendo pelas tubulações úmidas sob o asfalto...
      </p>
    </div>

    <!-- MAIN CONTENT -->
    <main v-else class="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-12 relative z-10 space-y-6">

      <!-- BANNER DE STATUS DO ABRIGO SUBTERRÂNEO -->
      <div class="border border-emerald-500/40 bg-black/75 rounded-xl p-5 sm:p-6 shadow-[0_0_30px_rgba(16,185,129,0.15)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-md">
        <div class="space-y-1">
          <div class="flex items-center gap-2 text-xs font-mono uppercase text-emerald-400">
            <span>🕳️</span>
            <span class="font-bold">Esconderijo Seguro nas Galerias Subterrâneas</span>
          </div>
          <p class="text-xs text-stone-300 font-sans leading-relaxed">
            Dezenas de metros abaixo das ruas ensolaradas, a luz do dia jamais penetra o concreto. O ar é pesado e frio, mas sua carne está a salvo da incineração solar.
          </p>
        </div>
      </div>

      <!-- CARD INTERATIVO: CAÇADA DE RATOS NO LODO -->
      <div class="border border-white/10 bg-black/60 rounded-xl p-6 space-y-4">
        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <h3 class="font-serif font-bold text-sm text-parchment flex items-center gap-2">
              <span>🐀</span> Caçada Emergencial de Ratos
            </h3>
            <p class="text-xs text-stone-400 font-light">
              Nas regras do V5, sangue de pequenos roedores pode saciar a Besta no limite do frenesi (reduz Fome 5 para 4).
            </p>
          </div>
          <button 
            @click="huntRats" 
            :disabled="isHunting || character.hunger < 5"
            class="px-5 py-2.5 rounded bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 font-serif font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(16,185,129,0.2)]"
          >
            {{ character.hunger < 5 ? 'Fome Já Controlada (<5)' : (isHunting ? 'Caçando...' : '🐀 Caçar Ratos') }}
          </button>
        </div>

        <!-- RELATÓRIO DO TESTE DE CAÇADA -->
        <div v-if="huntResult" class="p-3.5 rounded-lg border bg-black/70 text-xs space-y-1.5" :class="huntResult.success ? 'border-emerald-700/50 text-emerald-300' : 'border-red-800/50 text-red-300'">
          <div class="font-mono font-bold uppercase tracking-wider text-[11px]">
            {{ huntResult.success ? '✔ Caçada Bem-Sucedida' : '✖ Roedores Escaparam' }}
          </div>
          <p class="text-stone-300 leading-relaxed">{{ huntResult.message }}</p>
          <div v-if="huntResult.diceRolls" class="text-[10px] font-mono text-stone-500">
            🎲 Dados: [{{ huntResult.diceRolls.join(', ') }}] &rarr; {{ huntResult.successes }} sucessos
          </div>
        </div>
      </div>

      <!-- CARD DO SONO DIURNO & DESPERTAR -->
      <div class="border-2 border-emerald-600/60 bg-[#040c08]/90 rounded-xl p-6 sm:p-8 text-center space-y-6 shadow-[0_0_40px_rgba(16,185,129,0.25)] backdrop-blur-md">
        <div class="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500/50 mx-auto flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(16,185,129,0.3)]">
          🦇
        </div>

        <div class="space-y-2 max-w-md mx-auto">
          <span class="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">Sono Diurno nas Profundezas</span>
          <h2 class="text-xl sm:text-2xl font-serif font-bold text-parchment">Túneis e Aquíferos de Nocturna</h2>
          <p class="text-xs text-stone-300 leading-relaxed font-sans">
            Você encontrou uma câmara seca e silenciosa atrás das grades de escoamento. O sol não tem poder aqui embaixo.
          </p>
        </div>

        <div class="pt-4 border-t border-white/10 max-w-md mx-auto space-y-3">
          <button 
            @click="awakenForNextNight" 
            :disabled="isAwakening"
            class="w-full py-4 rounded-lg bg-gold hover:bg-gold-light text-black font-serif font-bold text-sm uppercase tracking-widest transition-all shadow-[0_0_25px_rgba(212,175,55,0.5)] animate-bounce disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span>{{ isAwakening ? 'Despertando...' : '🌙 Passar o Dia na Escuridão & Despertar às 20:00' }}</span>
          </button>
          <div class="text-[10px] font-mono text-stone-400">
            Ao cair da noite, o Teste de Despertar de Fome (Rouse Check) do V5 será processado.
          </div>
        </div>
      </div>

    </main>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../services/api'
import { notifySuccess, notifyError } from '../utils/gothicAlerts'

const router = useRouter()
const route = useRoute()

const characterId = ref<string>('')
const character = ref<any>(null)
const loading = ref(true)
const isHunting = ref(false)
const isAwakening = ref(false)
const huntResult = ref<any>(null)

const fetchCharacter = async () => {
  try {
    const res = await api.get(`/api/character-vampires/${characterId.value}`)
    character.value = res.data
  } catch (e) {
    console.error('Erro ao carregar personagem:', e)
  }
}

const huntRats = async () => {
  try {
    isHunting.value = true
    const res = await api.post(`/api/night-cycle/${characterId.value}/sewer/hunt`)
    huntResult.value = res.data
    character.value = res.data.character
    if (res.data.hungerReduced) {
      notifySuccess('Sangue Animal Absorvido', 'Sua Fome foi reduzida para 4.')
    }
  } catch (e: any) {
    notifyError('Falha na Caçada', e.response?.data?.error || 'Não foi possível caçar roedores.')
  } finally {
    isHunting.value = false
  }
}

const awakenForNextNight = async () => {
  try {
    isAwakening.value = true
    const res = await api.post(`/api/night-cycle/${characterId.value}/awaken`)
    const { rouseSuccess, hungerIncreased, willpowerHealed } = res.data

    let msg = `🎲 Rouse Check: ${rouseSuccess ? 'SUCESSO (Fome mantida)' : `FALHA (${hungerIncreased ? '+1 Fome!' : 'Fome no Limite'})`}`
    if (willpowerHealed > 0) msg += ` | 🧠 Força de Vontade recuperada (+${willpowerHealed}).`

    notifySuccess('Uma Nova Noite Cai Sobre Nocturna', msg)
    router.push(`/personagem/hub?id=${characterId.value}`)
  } catch (e: any) {
    notifyError('Erro ao Despertar', e.response?.data?.error || 'Não foi possível iniciar a nova noite.')
  } finally {
    isAwakening.value = false
  }
}

onMounted(async () => {
  characterId.value = (route.query.id as string) || localStorage.getItem('lira_active_character_id') || ''
  if (!characterId.value) {
    router.push('/jogador/vampire')
    return
  }

  await fetchCharacter()
  loading.value = false
})
</script>
