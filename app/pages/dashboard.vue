<script setup lang="ts">
import type { ApiError } from '~/types/api'

useHead({ title: 'PWA Nuxt — Tableau de bord' })

const api = useApi()

const {
  data: stats,
  pending,
  error,
  refresh,
} = await useAsyncData('dashboard-stats', () => api.getDashboardStats())

const apiError = computed(() => error.value?.cause as ApiError | undefined)

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

const formatDate = (iso: string): string => dateFormatter.format(new Date(iso))

const syncLabels: Record<string, string> = {
  synced: 'Synchronisé',
  pending: 'En attente',
  offline: 'Hors ligne',
}
</script>

<template>
  <section class="space-y-6">
    <header class="flex items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold">Tableau de bord</h1>
        <p class="text-sm text-slate-400">Données de démonstration (API mock).</p>
      </div>
      <button
        type="button"
        class="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-800 disabled:opacity-50"
        :disabled="pending"
        @click="refresh()"
      >
        {{ pending ? 'Chargement…' : 'Rafraîchir' }}
      </button>
    </header>

    <div
      v-if="error"
      role="alert"
      class="card border-red-900/60 bg-red-950/40 text-sm text-red-200"
    >
      Impossible de charger les données
      <span v-if="apiError">(erreur {{ apiError.status }})</span>. Les dernières
      données en cache sont peut-être affichées hors ligne.
    </div>

    <div v-if="stats" class="grid gap-4 sm:grid-cols-2">
      <StatCard label="Utilisateurs" :value="stats.users.toLocaleString('fr-FR')" />
      <StatCard label="Notifications" :value="stats.notifications" />
      <StatCard
        label="Dernier événement"
        :value="stats.lastEvent.label"
        :hint="formatDate(stats.lastEvent.at)"
      />
      <StatCard
        label="Statut de synchronisation"
        :value="syncLabels[stats.sync.status] ?? stats.sync.status"
        :hint="formatDate(stats.sync.at)"
      />
    </div>
  </section>
</template>
