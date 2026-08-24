<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import MainFooter from './components/layout/MainFooter.vue'

const route = useRoute()
const showFooter = computed(() => {
  return !route.path.includes('/cronicas') && !route.path.includes('/visual-novel')
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-bg-dark text-text-main font-sans">
    <div class="flex-1" :class="{'h-screen overflow-hidden': !showFooter}">
      <RouterView />
    </div>
    <MainFooter v-if="showFooter" />
  </div>
</template>

<style scoped>
</style>
