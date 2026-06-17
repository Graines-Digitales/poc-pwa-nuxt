<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{ error: NuxtError }>()

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="grid min-h-screen place-items-center bg-slate-950 px-4 text-slate-100">
    <section class="max-w-md space-y-5 text-center">
      <p class="text-6xl font-bold text-brand">{{ error.statusCode }}</p>
      <h1 class="text-2xl font-semibold">Une erreur est survenue</h1>
      <p class="text-slate-400">{{ error.message }}</p>
      <button type="button" class="btn-primary" @click="handleError">
        Retour à l’accueil
      </button>
    </section>
  </div>
</template>
