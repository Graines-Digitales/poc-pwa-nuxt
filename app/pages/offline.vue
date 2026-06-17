<script setup lang="ts">
useHead({ title: 'Hors ligne' })
</script>

<template>
  <section class="mx-auto max-w-lg space-y-6 py-10 text-center">
    <div
      class="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-amber-500/15 text-3xl"
      aria-hidden="true"
    >
      📡
    </div>
    <h1 class="text-2xl font-bold">Vous êtes hors ligne</h1>
    <p class="text-slate-300">
      Vous êtes hors ligne. Certaines données peuvent être indisponibles. Les
      pages déjà visitées restent accessibles depuis le cache.
    </p>
    <div class="flex justify-center gap-3">
      <NuxtLink to="/" class="btn-primary">Retour à l’accueil</NuxtLink>
    </div>
  </section>
</template>
