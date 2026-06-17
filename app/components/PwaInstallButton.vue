<script setup lang="ts">
// `$pwa` est injecté par @vite-pwa/nuxt côté client (undefined en SSR).
const { $pwa } = useNuxtApp()
</script>

<template>
  <ClientOnly>
    <button
      v-if="$pwa?.showInstallPrompt && !$pwa.isPWAInstalled"
      type="button"
      class="btn-primary"
      @click="$pwa.install()"
    >
      <span aria-hidden="true">⬇️</span>
      Installer l'application
    </button>
    <p v-else-if="$pwa?.isPWAInstalled" class="text-sm text-emerald-400">
      ✓ Application installée
    </p>
  </ClientOnly>
</template>
