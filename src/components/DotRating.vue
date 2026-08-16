<template>
  <div class="flex gap-1" :class="containerClass">
    <!-- Se não for renderização de caixas (como willpower/health) -->
    <template v-if="!isBox">
      <div 
        v-for="i in max" 
        :key="i"
        class="w-3 h-3 rounded-full border transition-all duration-300"
        :class="getDotClass(i)"
      ></div>
    </template>
    <!-- Se for renderização em caixas quadradas -->
    <template v-else>
      <div 
        v-for="i in max" 
        :key="i"
        class="w-4 h-4 border transition-all duration-300"
        :class="getBoxClass(i)"
      ></div>
    </template>
  </div>
</template>

<script setup lang="ts">

const props = withDefaults(defineProps<{
  value: number;
  max?: number;
  color?: 'gold' | 'blood' | 'blue' | 'parchment';
  isBox?: boolean;
  damageSuperficial?: number;
  damageAggravated?: number;
  containerClass?: string;
}>(), {
  max: 5,
  color: 'gold',
  isBox: false,
  damageSuperficial: 0,
  damageAggravated: 0,
  containerClass: ''
})

const getDotClass = (index: number) => {
  const isFilled = index <= props.value;
  
  if (!isFilled) {
    if (props.color === 'blood') return 'border-blood/40 bg-transparent'
    if (props.color === 'blue') return 'border-blue-500/40 bg-transparent'
    return 'border-border-mid bg-transparent' // Default (gold)
  }

  // Preenchido
  if (props.color === 'blood') return 'bg-blood-bright border-blood-bright shadow-[0_0_6px_rgba(192,57,43,0.6)]'
  if (props.color === 'blue') return 'bg-blue-400 border-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.6)]'
  if (props.color === 'parchment') return 'bg-parchment border-parchment shadow-[0_0_6px_rgba(232,220,200,0.4)]'
  
  // Default: Gold
  return 'bg-gold border-gold shadow-[0_0_6px_rgba(201,168,76,0.5)]'
}

const getBoxClass = (index: number) => {
  const isFilled = index <= props.value;
  
  // Lógica de Dano para Health e Willpower
  // Aggravated Damage toma os primeiros slots, depois Superficial
  const isAggravated = index <= props.damageAggravated;
  const isSuperficial = index > props.damageAggravated && index <= (props.damageAggravated + props.damageSuperficial);
  
  if (isAggravated) return 'border-blood-bright bg-blood text-center relative after:content-[\'X\'] after:text-xs after:text-white after:absolute after:inset-0 after:flex after:items-center after:justify-center'
  if (isSuperficial) return 'border-blood bg-transparent text-center relative after:content-[\'/\'] after:text-xs after:text-blood-bright after:absolute after:inset-0 after:flex after:items-center after:justify-center'
  
  if (!isFilled) return 'border-white/20 bg-black/40'
  
  if (props.color === 'blood') return 'border-blood-bright bg-blood mx-0.5'
  return 'border-vamp-c2 bg-vamp-c2 mx-0.5'
}
</script>
