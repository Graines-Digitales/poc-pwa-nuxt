import { createApiClient, type ApiClient } from '~/services/api'

/**
 * Expose le client API configuré via `runtimeConfig.public.apiBase`.
 * Le client est léger (sans état) : on le reconstruit à la demande plutôt
 * que de le stocker dans le payload SSR.
 *
 * @example
 * const api = useApi()
 * const stats = await api.getDashboardStats()
 */
export const useApi = (): ApiClient => {
  const { apiBase } = useRuntimeConfig().public
  return createApiClient(apiBase)
}
