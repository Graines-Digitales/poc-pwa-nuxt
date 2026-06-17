<script setup lang="ts">
const { isOnline } = useOnlineStatus()
</script>

<template>
  <Transition
    enter-active-class="transition-transform duration-200"
    enter-from-class="-translate-y-full"
    leave-active-class="transition-transform duration-200"
    leave-to-class="-translate-y-full"
  >
    <div
      v-if="!isOnline"
      role="status"
      aria-live="polite"
      class="bg-amber-500 px-4 py-2 text-center text-sm font-medium text-amber-950"
    >
      Vous êtes hors ligne. Certaines données peuvent être indisponibles.
    </div>
  </Transition>
</template>
