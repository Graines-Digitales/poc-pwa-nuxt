<script setup lang="ts">
const links = [
  { to: '/', label: 'Accueil' },
  { to: '/dashboard', label: 'Tableau de bord' },
]
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <OfflineBanner />

    <header class="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
      <nav
        class="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3"
        aria-label="Navigation principale"
      >
        <NuxtLink to="/" class="flex items-center gap-2 font-semibold">
          <span
            class="grid h-8 w-8 place-items-center rounded-lg bg-brand text-sm text-white"
            aria-hidden="true"
          >
            PN
          </span>
          <span>PWA Nuxt</span>
        </NuxtLink>

        <ul class="flex items-center gap-1">
          <li v-for="link in links" :key="link.to">
            <NuxtLink
              :to="link.to"
              class="rounded-md px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
              active-class="bg-slate-800 text-white"
            >
              {{ link.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </header>

    <main class="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
      <slot />
    </main>

    <footer class="border-t border-slate-800 px-4 py-6 text-center text-xs text-slate-500">
      Labo PWA Nuxt 4 — validation installation, cache et hors ligne.
    </footer>
  </div>
</template>
