import { defineStore } from 'pinia'
import api from '../services/api'

export const useCharacterCreationStore = defineStore('characterCreation', {
  state: () => ({
    // Definições carregadas da API
    clans: [] as any[],
    archetypes: [] as any[],
    predators: [] as any[],
    attributesList: [] as any[],
    skillsList: [] as any[],
    bloodPotencies: [] as any[],
    resonances: [] as any[],

    // Dados do Formulário do Jogador
    form: {
      name: '',
      concept: '', // Archetype ID ou Nome
      clanId: null as string | null,
      predatorId: null as string | null,
      sire: '', // Agora armazenaremos o ID ou nome do Senhor aqui
      ambition: '',
      desire: '',
      chronicleTenets: '',
      history: '',
      pillar: '',
    },

    // Sires dinâmicos baseados no clã
    availableSires: [] as any[],

    // Estado da UI
    isLoading: false,
    errorMessage: '',
    currentStep: 1
  }),

  getters: {
    selectedArchetype(state) {
      if (!state.form.concept) return null
      return state.archetypes.find(a => a.name === state.form.concept || a.id === state.form.concept)
    },
    
    // Apenas clãs interessados na profissão (usaremos uma lógica mockada se o DB não tiver)
    filteredClans(state): any[] {
      if (!this.selectedArchetype) return state.clans
      
      // Lógica de restrição baseada na categoria do arquétipo
      const category = this.selectedArchetype.category?.toUpperCase() || ''
      if (category === 'CEO' || category.includes('ELITE')) {
        return state.clans.filter(c => ['Ventrue', 'Lasombra', 'Hécata'].includes(c.name))
      } else if (category === 'STREET' || category.includes('RUA')) {
        return state.clans.filter(c => ['Gangrel', 'Brujah', 'Nosferatu'].includes(c.name))
      }
      
      return state.clans // Retorna todos caso não haja restrição clara
    },

    // Apenas predadores lógicos para o Clã
    filteredPredators(state): any[] {
      if (!state.form.clanId) return state.predators
      const clan = state.clans.find(c => c.id === state.form.clanId)
      if (!clan) return state.predators

      if (clan.name === 'Ventrue') {
        return state.predators.filter(p => !['Beco', 'Sanguessuga', 'Ratos'].some(b => p.name.includes(b)))
      }

      return state.predators
    },

    // Cálculo automático de Atributos com base na Profissão
    calculatedAttributes(state) {
      const attrs: Record<string, number> = {}
      state.attributesList.forEach(a => {
        attrs[a.id] = 1 // Padrão
      })

      if (this.selectedArchetype) {
        const focus = this.selectedArchetype.category?.toUpperCase() || ''
        state.attributesList.forEach(a => {
          if (a.category?.toUpperCase() === focus) {
            attrs[a.id] = 2 // Foco ganha +1
          }
        })
      }
      return attrs
    },

    // Cálculo automático de Perícias (Profissão + Predador)
    calculatedSkills(state) {
      const skills: Record<string, number> = {}
      state.skillsList.forEach(s => {
        skills[s.id] = 0 // Padrão
      })

      // TODO: Aplicar bônus do Archetype quando os dados do DB estiverem mapeados
      
      // Bônus do Predador (+1 em uma perícia relacionada)
      if (state.form.predatorId) {
        const pred = state.predators.find(p => p.id === state.form.predatorId)
        if (pred && pred.bonusSkillId) {
           skills[pred.bonusSkillId] = 1
        }
      }

      return skills
    },

    derivedStats(state) {
      let physical = 1
      let social = 1
      let mental = 1

      // Conta o nível mais alto para determinar vitalidade e força de vontade (simplificação V5 para o App)
      const attrs = this.calculatedAttributes as Record<string, number>
      state.attributesList.forEach(a => {
        const val = attrs[a.id] || 1
        const cat = a.category?.toUpperCase() || ''
        if (cat === 'PHYSICAL' || cat === 'FÍSICO') if (val > physical) physical = val
        if (cat === 'SOCIAL') if (val > social) social = val
        if (cat === 'MENTAL') if (val > mental) mental = val
      })

      return {
        health: physical + 3,
        willpower: social + mental,
        bloodPotency: 1, // Sangue-fraco seria 0, lidado no componente
        hunger: 1,
        humanity: 7 // Pode variar pela profissão
      }
    }
  },

  actions: {
    async fetchLibraries() {
      this.isLoading = true
      try {
        const [clanRes, predRes, archRes, resRes, bpRes, attrRes, skRes] = await Promise.all([
          api.get('/api/definition-clans'),
          api.get('/api/definition-predators'),
          api.get('/api/definition-archetypes'),
          api.get('/api/definition-resonances'),
          api.get('/api/definition-blood-potencies'),
          api.get('/api/definition-attributes'),
          api.get('/api/definition-skills')
        ])
        this.clans = clanRes.data
        this.predators = predRes.data
        this.archetypes = archRes.data
        this.resonances = resRes.data
        this.bloodPotencies = bpRes.data
        this.attributesList = attrRes.data
        this.skillsList = skRes.data
      } catch (err: any) {
        console.error('Erro ao carregar bibliotecas:', err)
        if (err.response && err.response.status === 401) {
          this.errorMessage = 'Sessão expirada ou inválida. Por favor, retorne e faça login novamente.'
        } else {
          this.errorMessage = 'Falha ao conectar com a Biblioteca Central.'
        }
      } finally {
        this.isLoading = false
      }
    },

    async fetchAvailableSires(clanId: string) {
      if (!clanId) return;
      try {
        const res = await api.get(`/api/character-vampires/sires?clanId=${clanId}`)
        this.availableSires = res.data
      } catch (err) {
        console.error('Erro ao buscar senhores do clã:', err)
        this.availableSires = []
      }
    },

    nextStep() {
      if (this.currentStep < 6) this.currentStep++
    },

    prevStep() {
      if (this.currentStep > 1) this.currentStep--
    },

    setStep(step: number) {
      if (step >= 1 && step <= 6) this.currentStep = step
    },

    async saveCharacter(userId: string) {
      this.isLoading = true
      this.errorMessage = ''
      
      try {
        const attributesPayload = Object.entries(this.calculatedAttributes).map(([id, val]) => ({
          definitionAttributeId: id,
          value: val
        }))

        const skillsPayload = Object.entries(this.calculatedSkills)
          .filter(([_, val]) => val > 0)
          .map(([id, val]) => ({
            definitionSkillId: id,
            value: val
          }))

        const stats = this.derivedStats

        const payload = {
          userId,
          name: this.form.name,
          concept: this.form.concept || null,
          clanId: this.form.clanId,
          predatorId: this.form.predatorId,
          sire: this.form.sire || null,
          generation: 12, // Padrão Neófito
          ambition: this.form.ambition || null,
          desire: this.form.desire || null,
          chronicleTenets: this.form.chronicleTenets || null,
          history: this.form.history || null,
          hunger: stats.hunger,
          humanity: stats.humanity,
          attributes: attributesPayload,
          skills: skillsPayload,
          disciplines: [], // Recebe pontos base no backend baseados no clã
          powers: [],
          meritsFlaws: [],
          backgrounds: [],
          equipments: []
        }

        const response = await api.post('/api/character-vampires', payload)
        return response.data
      } catch (err: any) {
        console.error('Erro ao criar personagem:', err)
        this.errorMessage = err.response?.data?.error || 'Erro ao salvar ficha no banco.'
        throw err
      } finally {
        this.isLoading = false
      }
    }
  }
})
