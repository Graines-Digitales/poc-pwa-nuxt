import type { ApiError, DashboardStats } from '~/types/api'

/**
 * Couche service API — point d'entrée unique vers le backend.
 *
 * Aujourd'hui les endpoints sont servis par les routes mock `server/api/*`.
 * Demain il suffira de pointer `apiBase` vers l'API Symfony : les composants
 * et composables consommateurs n'ont pas à changer.
 */

/** Normalise n'importe quelle erreur de transport en {@link ApiError}. */
const toApiError = (error: unknown): ApiError => {
  if (typeof error === 'object' && error !== null && 'statusCode' in error) {
    const { statusCode, statusMessage } = error as {
      statusCode?: number
      statusMessage?: string
    }
    return {
      status: statusCode ?? 500,
      message: statusMessage ?? 'Erreur réseau inattendue.',
    }
  }
  return { status: 500, message: 'Erreur réseau inattendue.' }
}

export interface ApiClient {
  getDashboardStats: () => Promise<DashboardStats>
}

/**
 * Construit un client API typé pour une base d'URL donnée.
 * @param baseURL Préfixe des endpoints (ex. `/api` ou `https://api.exemple.fr`).
 */
export const createApiClient = (baseURL: string): ApiClient => {
  const request = async <TResponse>(path: string): Promise<TResponse> => {
    try {
      // Cast nécessaire : $fetch renvoie un type `TypedInternalResponse`
      // enveloppé, non réductible au générique `TResponse` côté appelant.
      return (await $fetch<TResponse>(path, { baseURL })) as TResponse
    } catch (error) {
      const apiError = toApiError(error)
      // Erreur standard porteuse du détail normalisé (consultable via `.cause`).
      throw new Error(apiError.message, { cause: apiError })
    }
  }

  return {
    getDashboardStats: () => request<DashboardStats>('/dashboard'),
  }
}
