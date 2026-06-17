const siteUrl = process.env.NUXT_PUBLIC_SITE_URL ?? 'https://pwa.graines-digitales.online'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-06-01',
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss', '@vite-pwa/nuxt'],

  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: '~~/tailwind.config.ts',
  },

  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      title: 'PWA Nuxt — Labo',
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, viewport-fit=cover',
        },
        {
          name: 'description',
          content:
            "Mini application PWA Nuxt 4 pour valider l'installation, le cache et le mode hors ligne.",
        },
        { name: 'theme-color', content: '#0f172a' },
        // Support du mode standalone sur iOS.
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'PWA Nuxt' },
      ],
      link: [
        { rel: 'canonical', href: siteUrl },
        { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
        { rel: 'apple-touch-icon', href: '/icons/apple-touch-icon.png' },
      ],
    },
  },

  runtimeConfig: {
    public: {
      // Base de l'API : surchargée à l'exécution par `NUXT_PUBLIC_API_BASE`
      // (mapping automatique Nuxt). Pointera vers l'API Symfony en production.
      apiBase: '/api',
      siteUrl,
    },
  },

  // https://vite-pwa-org.netlify.app/frameworks/nuxt
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'PWA Nuxt — Labo',
      short_name: 'PWA Nuxt',
      description:
        'Mini application de validation PWA avant intégration sur un projet SaaS.',
      id: '/',
      lang: 'fr',
      theme_color: '#0f172a',
      background_color: '#0f172a',
      display: 'standalone',
      display_override: ['standalone', 'fullscreen', 'minimal-ui'],
      orientation: 'portrait',
      start_url: '/',
      scope: '/',
      icons: [
        {
          src: '/icons/icon-192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/icons/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/icons/icon-maskable-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    workbox: {
      // Pages mises en cache + fallback hors ligne.
      navigateFallback: '/offline',
      globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
      runtimeCaching: [
        {
          // Pages HTML visitées : réseau d'abord, cache en secours pour le test hors ligne.
          urlPattern: /^https?:\/\/[^/]+\/(?:dashboard|offline)?\/?$/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'page-cache',
            networkTimeoutSeconds: 3,
            expiration: { maxEntries: 16, maxAgeSeconds: 60 * 60 * 24 * 7 },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
        {
          // Fausse réponse API : cache puis réseau pour rester consultable hors ligne.
          urlPattern: /^https?:\/\/[^/]+\/api\/.*$/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            networkTimeoutSeconds: 5,
            expiration: { maxEntries: 32, maxAgeSeconds: 60 * 60 * 24 },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
        {
          // Icônes et images servies depuis /public.
          urlPattern: /^https?:\/\/[^?]+\.(?:png|jpg|jpeg|svg|webp|ico)(?:\?.*)?$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'image-cache',
            expiration: { maxEntries: 64, maxAgeSeconds: 60 * 60 * 24 * 30 },
          },
        },
      ],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      // Permet de tester le service worker en `nuxt dev`.
      enabled: true,
      suppressWarnings: true,
      navigateFallback: '/offline',
      type: 'module',
    },
  },
})
