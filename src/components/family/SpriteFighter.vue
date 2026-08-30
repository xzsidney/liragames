<template>
  <div 
    ref="pixiContainer"
    class="sprite-fighter relative select-none pointer-events-none flex items-end justify-center"
    :style="{
      width: `${canvasWidth}px`,
      height: `${canvasHeight}px`,
      filter: state === 'hit' ? 'brightness(1.8) drop-shadow(0 0 10px rgba(239, 68, 68, 0.8))' : 'drop-shadow(0 4px 12px rgba(0,0,0,0.6))'
    }"
  ></div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { Application, Assets, AnimatedSprite, Texture } from 'pixi.js';

const props = withDefaults(
  defineProps<{
    character: 'colossus' | 'kenshin';
    state: 'idle' | 'walk' | 'attack' | 'hit';
    flip?: boolean;
    scale?: number;
  }>(),
  {
    flip: false,
    scale: 1.35,
  }
);

const pixiContainer = ref<HTMLDivElement | null>(null);
let app: Application | null = null;
let currentAnimSprite: AnimatedSprite | null = null;
const loadedTexturesCache: Record<string, Texture> = {};

const canvasWidth = computed(() => (props.character === 'colossus' ? 180 : 150) * (props.scale || 1.35));
const canvasHeight = computed(() => (props.character === 'colossus' ? 200 : 170) * (props.scale || 1.35));

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

async function loadTexture(url: string): Promise<Texture> {
  if (loadedTexturesCache[url]) {
    return loadedTexturesCache[url];
  }
  try {
    const tex = await Assets.load(url);
    loadedTexturesCache[url] = tex;
    return tex;
  } catch (e) {
    console.error(`Erro ao carregar textura Pixi: ${url}`, e);
    return Texture.WHITE;
  }
}

async function renderPixiAnimation() {
  if (!app || !app.stage) return;

  const frames = activeFrames.value;
  if (!frames || frames.length === 0) return;

  const prefix = props.character === 'colossus' ? 'col' : 'ken';
  const urls = frames.map(f => `/sprites/${props.character}/${prefix}${String(f).padStart(3, '0')}.png`);

  const textures: Texture[] = [];
  for (const url of urls) {
    const tex = await loadTexture(url);
    textures.push(tex);
  }

  if (!app || !app.stage) return;

  if (currentAnimSprite) {
    app.stage.removeChild(currentAnimSprite);
    currentAnimSprite.destroy();
    currentAnimSprite = null;
  }

  const anim = new AnimatedSprite(textures);
  anim.animationSpeed = props.state === 'attack' ? 0.22 : 0.12; // Velocidade do Pixi AnimatedSprite
  anim.anchor.set(0.5, 1.0); // Ponto de ancoragem na base/pés

  // Posição no centro inferior do Canvas Pixi
  anim.x = canvasWidth.value / 2;
  anim.y = canvasHeight.value;

  const baseScale = props.scale || 1.35;
  anim.scale.x = props.flip ? -baseScale : baseScale;
  anim.scale.y = baseScale;

  anim.play();
  app.stage.addChild(anim);
  currentAnimSprite = anim;
}

watch(
  () => [props.character, props.state, props.flip, props.scale],
  () => {
    renderPixiAnimation();
  }
);

onMounted(async () => {
  if (!pixiContainer.value) return;

  app = new Application();
  await app.init({
    width: canvasWidth.value,
    height: canvasHeight.value,
    backgroundAlpha: 0, // Canvas 100% transparente
    antialias: false,   // Mantém a nitidez do pixel art do MUGEN
    preference: 'webgl',
  });

  if (pixiContainer.value && app.canvas) {
    pixiContainer.value.appendChild(app.canvas);
  }

  await renderPixiAnimation();
});

onUnmounted(() => {
  if (currentAnimSprite) {
    currentAnimSprite.destroy();
    currentAnimSprite = null;
  }
  if (app) {
    app.destroy(true, { children: true, texture: false });
    app = null;
  }
});
</script>

<style scoped>
.sprite-fighter canvas {
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}
</style>
