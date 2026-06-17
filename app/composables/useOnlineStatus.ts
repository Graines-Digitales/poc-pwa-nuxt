import { onMounted, onUnmounted, readonly, ref } from 'vue'

/**
 * État de connectivité réactif basé sur `navigator.onLine` et les événements
 * `online` / `offline`. SSR-safe : considéré en ligne côté serveur.
 */
export const useOnlineStatus = () => {
  const isOnline = ref(true)

  const update = () => {
    isOnline.value = navigator.onLine
  }

  onMounted(() => {
    update()
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
  })

  onUnmounted(() => {
    window.removeEventListener('online', update)
    window.removeEventListener('offline', update)
  })

  return { isOnline: readonly(isOnline) }
}
