<script setup lang="ts">
import { RouterView } from 'vue-router'
import MainFooter from './components/layout/MainFooter.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-bg-dark text-text-main font-sans">
    <div class="flex-1">
      <RouterView />
    </div>
    <MainFooter />
  </div>
</template>

<style scoped>
</style>
