<template>
  <div class="min-h-screen bg-[#070408] text-parchment font-sans relative overflow-x-hidden selection:bg-blood-red selection:text-white pb-24 select-none">
    
    <!-- ATMOSPHERIC BACKGROUND OVERLAYS -->
    <div class="fixed inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/30 via-purple-950/20 to-black z-0"></div>
    <div class="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay z-0" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>

    <!-- NAVBAR HOTEL -->
    <header class="relative z-20 border-b border-amber-500/30 bg-[#07040a]/95 backdrop-blur-md sticky top-0 shadow-2xl">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button 
            @click="awakenForNextNight" 
            class="text-stone-400 hover:text-amber-300 transition-colors flex items-center gap-1.5 font-serif text-xs uppercase tracking-widest"
            title="Ao retornar ao Hub, o personagem dorme durante o dia e desperta às 20:00 com o Rouse Check."
          >
            <span>&larr;</span> Hub (Despertar 20:00)
          </button>
          <div class="font-serif font-bold text-xs sm:text-sm tracking-widest flex items-center gap-2 text-amber-400">
            <span>🏨</span>
            REDE DE HOTÉIS & ABRIGOS • NOCTURNA
          </div>
        </div>

        <div class="flex items-center gap-4 text-xs font-mono">
          <div v-if="character" class="flex items-center gap-3">
            <span class="text-stone-400 hidden sm:inline">{{ character.name }}</span>
            <span class="text-green-400 font-bold bg-black/60 px-3 py-1 rounded border border-green-700/50 shadow-inner">
              💵 R$ {{ Number(character.money || 0).toLocaleString('pt-BR') }}
            </span>
          </div>
        </div>
      </div>
    </header>

    <div v-if="loading" class="flex flex-col items-center justify-center min-h-[70vh] relative z-10 space-y-4">
      <div class="animate-spin w-12 h-12 border-2 border-amber-900 border-t-amber-400 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.3)]"></div>
      <p class="text-amber-500/80 font-serif text-xs tracking-widest uppercase animate-pulse">
        Consultando vagas e quartos com blackout em Nocturna...
      </p>
    </div>

    <!-- MAIN CONTENT -->
    <main v-else class="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-12 relative z-10 space-y-6">

      <!-- BANNER DE AVISO DE SOBREVIVÊNCIA SOLAR -->
      <div class="border border-amber-500/40 bg-black/70 rounded-xl p-5 sm:p-6 shadow-[0_0_30px_rgba(245,158,11,0.15)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-md">
        <div class="space-y-1">
          <div class="flex items-center gap-2 text-xs font-mono uppercase text-amber-400">
            <span>☀️</span>
            <span class="font-bold">Abrigo Contra o Sol da Manhã</span>
          </div>
          <p class="text-xs text-stone-300 font-sans leading-relaxed">
            O dia amanheceu enquanto você estava em trânsito. Alugue uma suíte segura com isolamento de luz para descansar o dia e recuperar Força de Vontade antes de despertar na próxima noite.
          </p>
        </div>
      </div>

      <!-- SE O JOGADOR JÁ CONTRATOU UM QUARTO -->
      <div v-if="hasBookedRoom" class="border-2 border-green-600/70 bg-[#090e09]/90 rounded-xl p-6 sm:p-8 text-center space-y-6 shadow-[0_0_40px_rgba(34,197,94,0.25)] backdrop-blur-md animate-fade-in">
        <div class="w-16 h-16 rounded-full bg-green-950/60 border border-green-500/50 mx-auto flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(34,197,94,0.3)]">
          🛌
        </div>

        <div class="space-y-2 max-w-md mx-auto">
          <span class="text-xs font-mono uppercase tracking-widest text-green-400 font-bold">Quarto Trancado com Blackout</span>
          <h2 class="text-xl sm:text-2xl font-serif font-bold text-parchment">{{ bookedHotelName }}</h2>
          <p class="text-xs text-stone-300 leading-relaxed font-sans">
            As cortinas pesadas bloqueiam 100% dos raios solares. Você está em sono diurno seguro e protegido contra a Inquisição e o calor do sol.
          </p>
        </div>

        <div class="pt-4 border-t border-white/10 max-w-md mx-auto space-y-3">
          <button 
            @click="awakenForNextNight" 
            :disabled="isAwakening"
            class="w-full py-4 rounded-lg bg-gold hover:bg-gold-light text-black font-serif font-bold text-sm uppercase tracking-widest transition-all shadow-[0_0_25px_rgba(212,175,55,0.5)] animate-bounce disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span>{{ isAwakening ? 'Despertando...' : '🌙 Dormir Durante o Dia & Despertar à Noite' }}</span>
          </button>
          <div class="text-[10px] font-mono text-stone-400">
            Ao despertar às 20:00, o Teste de Fome (Rouse Check) do V5 será processado.
          </div>
        </div>
      </div>

      <!-- SE O JOGADOR AINDA NÃO CONTRATOU QUARTO (SELEÇÃO DE 1 A 5 ESTRELAS) -->
      <div v-else class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="font-serif text-sm uppercase tracking-widest text-stone-300 font-bold flex items-center gap-2">
            <span>🏨</span> Escolha sua Categoria de Hospedagem
          </h2>
          <span class="text-[10px] font-mono text-stone-500">Preços por diária diurna</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            v-for="hotel in hotelTiers" 
            :key="hotel.stars"
            class="p-5 rounded-xl border transition-all duration-300 space-y-3 relative overflow-hidden flex flex-col justify-between"
            :class="[
              hotel.stars === 5 ? 'border-gold/50 bg-gradient-to-br from-amber-950/30 to-black md:col-span-2' : 'border-white/10 bg-black/60 hover:border-amber-500/50'
            ]"
          >
            <div class="space-y-2">
              <div class="flex justify-between items-start">
                <div>
                  <div class="flex items-center gap-1 text-amber-400 text-sm">
                    <span v-for="s in hotel.stars" :key="s">★</span>
                  </div>
                  <h3 class="font-serif font-bold text-base text-parchment mt-0.5">{{ hotel.name }}</h3>
                </div>
                <div class="text-right">
                  <span class="text-sm font-mono font-bold" :class="character.money >= hotel.cost ? 'text-green-400' : 'text-red-400'">
                    R$ {{ hotel.cost.toLocaleString('pt-BR') }}
                  </span>
                  <span class="text-[9px] block text-stone-500 uppercase font-mono">Diária</span>
                </div>
              </div>

              <p class="text-xs text-stone-400 font-light leading-relaxed">
                {{ hotel.desc }}
              </p>

              <!-- BENEFÍCIOS -->
              <div class="pt-2 flex flex-wrap gap-2 text-[10px] font-mono">
                <span class="px-2 py-0.5 rounded bg-blue-950/60 border border-blue-800/40 text-blue-300">
                  🧠 +{{ hotel.willpowerHeal }} Força de Vontade
                </span>
                <span v-if="hotel.hungerBonus > 0" class="px-2 py-0.5 rounded bg-red-950/60 border border-red-800/40 text-red-300 font-bold">
                  🩸 -{{ hotel.hungerBonus }} Fome (Bolsa de Sangue O-)
                </span>
                <span class="px-2 py-0.5 rounded bg-zinc-900 text-stone-400 border border-zinc-800">
                  🛡️ Blackout 100%
                </span>
              </div>
            </div>

            <button 
              @click="bookRoom(hotel.stars)"
              :disabled="isBooking || character.money < hotel.cost"
              class="w-full mt-3 py-2.5 rounded font-serif font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
              :class="[
                hotel.stars === 5 ? 'bg-gold hover:bg-gold-light text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'bg-amber-950/70 hover:bg-amber-800 border border-amber-600/50 text-amber-200'
              ]"
            >
              {{ character.money < hotel.cost ? 'Saldo Insuficiente' : (isBooking ? 'Reservando...' : `Alugar por R$ ${hotel.cost.toLocaleString('pt-BR')}`) }}
            </button>
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
const isBooking = ref(false)
const isAwakening = ref(false)
const hasBookedRoom = ref(false)
const bookedHotelName = ref('')

const hotelTiers = [
  { stars: 1, name: 'Pensão "O Repouso das Sombras"', cost: 150, willpowerHeal: 1, hungerBonus: 0, desc: 'Quarto simples nos fundos com cortinas velhas grampeadas. Seguro porém decadente.' },
  { stars: 2, name: 'Motel Neon Blackout', cost: 350, willpowerHeal: 2, hungerBonus: 0, desc: 'Persiana blackout reforçada na beira da avenida, sem janelas externas. Privacidade padrão.' },
  { stars: 3, name: 'Grand Hotel Nocturna', cost: 800, willpowerHeal: 3, hungerBonus: 0, desc: 'Suíte executiva no centro com isolamento acústico de primeira linha e atendimento discreto.' },
  { stars: 4, name: 'Palace Boutique Hotel', cost: 1800, willpowerHeal: 4, hungerBonus: 0, desc: 'Suíte de luxo em prédio histórico, persianas automatizadas à prova de radiação e segurança privada.' },
  { stars: 5, name: 'The Elysium Royal Suite', cost: 4000, willpowerHeal: 10, hungerBonus: 1, desc: 'Suíte presidencial blindada em cobertura. Inclui frigobar privativo com bolsas de sangue O-negativo fresco e serviço de mordomo sigiloso.' }
]

const fetchCharacter = async () => {
  try {
    const res = await api.get(`/api/character-vampires/${characterId.value}`)
    character.value = res.data
  } catch (e) {
    console.error('Erro ao carregar personagem:', e)
  }
}

const bookRoom = async (stars: number) => {
  try {
    isBooking.value = true
    const res = await api.post(`/api/night-cycle/${characterId.value}/hotel/book`, { stars })
    if (res.data.success) {
      hasBookedRoom.value = true
      bookedHotelName.value = res.data.hotelName
      character.value = res.data.character
      notifySuccess('Quarto Reservado!', res.data.message)
    } else {
      notifyError('Falha na Reserva', res.data.message)
    }
  } catch (e: any) {
    notifyError('Erro ao Reservar', e.response?.data?.error || 'Não foi possível alugar o quarto.')
  } finally {
    isBooking.value = false
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
