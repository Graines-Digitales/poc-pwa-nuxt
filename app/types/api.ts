/**
 * Contrats de données partagés entre la couche service, les composables et l'UI.
 * Calqués sur une future API Symfony (réponses JSON typées).
 */

export interface DashboardStats {
  users: number
  notifications: number
  lastEvent: {
    label: string
    at: string // ISO 8601
  }
  sync: {
    status: 'synced' | 'pending' | 'offline'
    at: string // ISO 8601
  }
}

/** Enveloppe d'erreur normalisée, indépendante du transport HTTP. */
export interface ApiError {
  status: number
  message: string
}
