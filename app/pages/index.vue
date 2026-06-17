<script setup lang="ts">
useHead({ title: 'PWA Nuxt — Accueil' })

const features = [
  'Installation sur mobile et ordinateur',
  'Icône sur l’écran d’accueil',
  'Affichage plein écran (mode application)',
  'Cache des pages principales et mode hors ligne',
]
</script>

<template>
  <section class="space-y-10">
    <div class="space-y-5">
      <span
        class="inline-block rounded-full bg-brand/15 px-3 py-1 text-xs font-medium text-brand"
      >
        Labo PWA · Nuxt 4
      </span>
      <h1 class="text-4xl font-bold leading-tight sm:text-5xl">PWA Nuxt</h1>
      <p class="max-w-2xl text-lg text-slate-300">
        Mini application servant à valider les bases d’une Progressive Web App
        avant de l’intégrer à un vrai projet SaaS : installation, cache,
        comportement hors ligne et structure compatible avec une future API
        Symfony.
      </p>

      <div class="flex flex-wrap items-center gap-3">
        <NuxtLink to="/dashboard" class="btn-primary">
          Ouvrir le tableau de bord
          <span aria-hidden="true">→</span>
        </NuxtLink>
        <PwaInstallButton />
      </div>
    </div>

    <ul class="grid gap-3 sm:grid-cols-2">
      <li
        v-for="feature in features"
        :key="feature"
        class="card flex items-center gap-3 text-sm text-slate-300"
      >
        <span class="text-brand" aria-hidden="true">●</span>
        {{ feature }}
      </li>
    </ul>
  </section>
</template>
