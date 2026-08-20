<template>
  <div class="space-y-8 animate-fade-in">
    <header class="text-center mb-10">
      <h2 class="font-serif text-2xl md:text-3xl text-gold mb-2 drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]">Identidade & Vida Mortal</h2>
      <p class="text-gray-400 font-serif text-sm">Quem você era antes da noite engolir sua alma?</p>
    </header>

    <div class="space-y-6 max-w-2xl mx-auto">
      <!-- Nome & Avatar -->
      <div class="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-6 items-start">
        
        <!-- Avatar Upload -->
        <div class="group flex flex-col items-center">
          <label class="block text-[10px] font-serif uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-gold transition-colors text-center w-full">Retrato</label>
          <div class="relative w-24 h-32 bg-black/60 border border-white/10 rounded-xl overflow-hidden cursor-pointer hover:border-blood transition-colors group/avatar" @click="triggerFileInput">
            <img v-if="store.form.avatarUrl" :src="API_BASE_URL + store.form.avatarUrl" class="w-full h-full object-cover saturate-50 group-hover/avatar:saturate-100 transition-all" />
            <div v-else class="absolute inset-0 flex items-center justify-center text-4xl text-gray-600 font-serif pb-2">+</div>
            
            <div v-if="uploading" class="absolute inset-0 bg-black/80 flex items-center justify-center">
              <div class="animate-spin w-5 h-5 border-2 border-gold border-t-transparent rounded-full"></div>
            </div>
          </div>
          <input type="file" ref="fileInput" accept="image/jpeg,image/png,image/webp" class="hidden" @change="handleFileUpload" />
        </div>

        <!-- Nome e Biografia -->
        <div class="space-y-4">
          <div class="group">
            <label class="block text-xs font-serif uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-gold transition-colors">Nome do Personagem</label>
            <input 
              v-model="store.form.name" 
              type="text" 
              placeholder="Ex: Kael Lira" 
              class="w-full bg-black/60 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-blood focus:ring-1 focus:ring-blood/50 transition-all duration-300 shadow-inner"
            />
          </div>

          <div class="grid grid-cols-3 gap-4">
            <div class="group">
              <label class="block text-[10px] font-serif uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-gold transition-colors">Nascimento (Mortal)</label>
              <input 
                v-model="store.form.dateOfBirth" 
                type="date" 
                class="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blood focus:ring-1 focus:ring-blood/50 transition-all duration-300 shadow-inner [color-scheme:dark]"
              />
            </div>
            <div class="group">
              <label class="block text-[10px] font-serif uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-gold transition-colors">Data da Morte (Abraço)</label>
              <input 
                v-model="store.form.dateOfDeath" 
                type="date" 
                class="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blood focus:ring-1 focus:ring-blood/50 transition-all duration-300 shadow-inner [color-scheme:dark]"
              />
            </div>
            <div class="group">
              <label class="block text-[10px] font-serif uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-gold transition-colors">Idade Aparente</label>
              <input 
                v-model.number="store.form.apparentAge" 
                type="number" 
                min="18"
                placeholder="25" 
                class="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blood focus:ring-1 focus:ring-blood/50 transition-all duration-300 shadow-inner"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Arquétipo / Profissão -->
      <div class="group">
        <label class="block text-xs font-serif uppercase tracking-wider text-gray-400 mb-2 group-focus-within:text-gold transition-colors">Profissão / Vida Mortal</label>
        
        <div class="mb-4 relative">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Pesquisar profissão... (Ex: Hacker, Médico, Segurança)" 
            class="w-full bg-black/60 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-blood-red focus:ring-1 focus:ring-blood-red/50 transition-all duration-300 shadow-inner placeholder-gray-600"
          />
          <div class="absolute left-3 top-3.5 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          <div 
            v-for="pkg in filteredProfessions" 
            :key="pkg.id"
            @click="store.form.concept = pkg.id"
            class="cursor-pointer relative overflow-hidden rounded-lg border p-3 transition-all duration-300 group/card flex flex-col justify-between"
            :class="store.form.concept === pkg.id ? 'border-blood-red bg-blood-red/10 shadow-[0_0_10px_rgba(139,0,0,0.2)]' : 'border-white/10 bg-black/40 hover:border-white/30 hover:bg-black/60'"
          >
            <!-- Background fx -->
            <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
            
            <div>
              <h3 class="font-serif text-sm font-bold mb-1 leading-tight" :class="store.form.concept === pkg.id ? 'text-white' : 'text-gray-300'">{{ pkg.name }}</h3>
              <p class="text-[11px] text-gray-500 font-sans line-clamp-3 leading-snug">{{ pkg.description || 'Uma vida mundana normal...' }}</p>
            </div>
            
            <div class="mt-2 flex items-center justify-between text-[9px] uppercase tracking-widest border-t border-white/5 pt-2">
              <span class="text-gold-dim border border-gold-dim/30 px-1.5 py-0.5 rounded-sm">Profissão</span>
              <span v-if="store.form.concept === pkg.id" class="text-blood-red font-bold">✓ Sel</span>
            </div>
          </div>
          
          <div v-if="filteredProfessions.length === 0 && !store.isLoading" class="col-span-full py-8 text-center text-gray-500 text-sm italic">
            Nenhuma profissão encontrada com este nome.
          </div>
        </div>
        
        <p v-if="store.professionPackages.length === 0" class="text-sm text-gray-500 italic mt-2">Carregando profissões do servidor...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCharacterCreationStore } from '../../stores/characterCreationStore'
import { API_BASE_URL } from '../../services/api'

const store = useCharacterCreationStore()
const fileInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const searchQuery = ref('')

const filteredProfessions = computed(() => {
  if (!searchQuery.value) return store.professionPackages;
  
  const query = searchQuery.value.toLowerCase();
  return store.professionPackages.filter(pkg => 
    pkg.name.toLowerCase().includes(query) || 
    (pkg.description && pkg.description.toLowerCase().includes(query))
  );
})

const triggerFileInput = () => {
  if (fileInput.value) fileInput.value.click()
}

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    uploading.value = true
    try {
      await store.uploadAvatar(file)
    } catch (err) {
      alert('Erro ao enviar imagem. O arquivo pode ser muito grande ou estar em formato inválido.')
    } finally {
      uploading.value = false
    }
  }
}
</script>
