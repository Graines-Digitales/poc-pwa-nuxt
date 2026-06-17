import type { DashboardStats } from '~/types/api'

/**
 * Fausse réponse API pour le tableau de bord.
 * Sert de cible au cache `NetworkFirst` du service worker : une fois visitée,
 * la réponse reste consultable hors ligne. À remplacer par l'API Symfony.
 */
export default defineEventHandler((): DashboardStats => {
  const now = new Date()

  return {
    users: 1287,
    notifications: 4,
    lastEvent: {
      label: 'Nouvel utilisateur inscrit',
      at: new Date(now.getTime() - 1000 * 60 * 12).toISOString(),
    },
    sync: {
      status: 'synced',
      at: now.toISOString(),
    },
  }
})
