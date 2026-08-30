<template>
  <div 
    class="sprite-fighter relative select-none pointer-events-none flex items-end justify-center"
    :style="{
      width: `${frameWidth * scale}px`,
      height: `${frameHeight * scale}px`,
    }"
  >
    <img
      v-if="currentFrameUrl"
      :src="currentFrameUrl"
      :alt="character"
      :class="[
        'sprite-image object-contain transition-transform duration-100',
        flip ? '-scale-x-100' : 'scale-x-100'
      ]"
      :style="{
        width: '100%',
        height: '100%',
        imageRendering: 'pixelated',
        filter: state === 'hit' ? 'brightness(1.8) drop-shadow(0 0 10px rgba(239, 68, 68, 0.8))' : 'drop-shadow(0 4px 12px rgba(0,0,0,0.6))'
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

const props = withDefaults(
  defineProps<{
    character: 'colossus' | 'kenshin';
    state: 'idle' | 'walk' | 'attack' | 'hit';
    flip?: boolean;
    scale?: number;
  }>(),
  {
    flip: false,
    scale: 1.4,
  }
);

const currentFrameIndex = ref<number>(0);
let animationTimer: any = null;

const frameWidth = computed(() => (props.character === 'colossus' ? 140 : 110));
const frameHeight = computed(() => (props.character === 'colossus' ? 160 : 130));

// Mapeamento de sequências de frames extraídos do MUGEN
const animations: Record<string, Record<string, number[]>> = {
  colossus: {
    // Postura Stance / Idle
    idle: [45, 46, 47, 48, 49, 50, 51, 52, 53, 54],
    // Caminhada Pesada
    walk: [20, 21, 22, 23, 24, 25],
    // Soco de Titânio / Golpe
    attack: [200, 201, 202, 203, 204, 205, 206, 207, 208],
    // Impacto / Dano
    hit: [340, 341, 342, 343],
  },
  kenshin: {
    // Postura com Katana
    idle: [0, 1, 2, 3, 4, 5],
    // Avanço / Corrida
    walk: [20, 21, 22, 23, 24, 25],
    // Corte de Espada
    attack: [40, 41, 42, 43, 44, 45, 46, 47, 48],
    // Impacto / Dano
    hit: [100, 101, 102, 103],
  },
};

const activeFrames = computed<number[]>(() => {
  const charAnims = animations[props.character] || animations.colossus;
  return charAnims[props.state] || charAnims.idle;
});

const currentFrameUrl = computed<string>(() => {
  const frames = activeFrames.value;
  if (!frames || frames.length === 0) return '';
  const frameNum = frames[currentFrameIndex.value % frames.length];
  const prefix = props.character === 'colossus' ? 'col' : 'ken';
  const padded = String(frameNum).padStart(3, '0');
  return `/sprites/${props.character}/${prefix}${padded}.png`;
});

function startAnimation() {
  if (animationTimer) clearInterval(animationTimer);
  currentFrameIndex.value = 0;

  // Velocidade da animação (10 FPS no idle/walk, 14 FPS no attack)
  const fps = props.state === 'attack' ? 70 : 100;

  animationTimer = setInterval(() => {
    const frames = activeFrames.value;
    if (frames.length > 0) {
      if (props.state === 'attack' || props.state === 'hit') {
        // Ações pontuais rodam uma vez ou em loop controlado
        currentFrameIndex.value = (currentFrameIndex.value + 1) % frames.length;
      } else {
        currentFrameIndex.value = (currentFrameIndex.value + 1) % frames.length;
      }
    }
  }, fps);
}

watch(
  () => [props.character, props.state],
  () => {
    startAnimation();
  }
);

onMounted(() => {
  startAnimation();
});

onUnmounted(() => {
  if (animationTimer) clearInterval(animationTimer);
});
</script>

<style scoped>
.sprite-image {
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}
</style>
