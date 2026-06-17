# PWA Nuxt — Labo

Mini application **Nuxt 4** servant à valider les bases d'une **Progressive Web App**
avant de l'intégrer à un vrai projet SaaS : installation, cache, mode hors ligne et
structure compatible avec une future **API Symfony**.

## Stack

- Nuxt 4 / Vue 3 / TypeScript strict
- Tailwind CSS (`@nuxtjs/tailwindcss`)
- PWA via `@vite-pwa/nuxt` (Workbox)
- Docker optionnel (build SSR Node)

## Démarrage

```bash
bun install
bun run dev          # http://localhost:3000
```

> Le port 3000 peut être occupé localement : adapter avec `NITRO_PORT=3999 bun run dev`.

### Build de production

```bash
bun run build
node .output/server/index.mjs   # sert l'app SSR + le service worker
```

### Docker

```bash
docker compose up --build       # http://localhost:3000
```

### Déploiement du POC

Le POC cible `https://pwa.graines-digitales.online`. Le conteneur Nuxt écoute en HTTP
sur le port `3000` ; il doit être placé derrière un reverse proxy HTTPS (Caddy, Traefik,
Nginx Proxy Manager ou Nginx avec certificat Let's Encrypt).

```bash
cp .env.example .env
docker compose up --build -d
```

Variables utiles :

```bash
NUXT_PUBLIC_SITE_URL=https://pwa.graines-digitales.online
NUXT_PUBLIC_API_BASE=/api
```

Prévoir côté DNS un enregistrement `A` ou `CNAME` pour `pwa.graines-digitales.online`
vers le serveur, puis une règle proxy :

- hôte public : `pwa.graines-digitales.online`
- upstream : `http://127.0.0.1:3000`
- HTTPS forcé
- WebSocket non requis pour le build production

Après déploiement, vérifier :

```bash
curl -I https://pwa.graines-digitales.online
curl -I https://pwa.graines-digitales.online/manifest.webmanifest
curl -I https://pwa.graines-digitales.online/sw.js
```

## Vérifier la PWA

1. `bun run build` puis lancer le serveur (le **service worker n'est actif qu'en build**,
   sauf `pwa.devOptions.enabled` activé pour le dev).
2. Ouvrir l'app dans Chrome → onglet **Application** → *Manifest* et *Service Workers*.
3. Cliquer sur **Installer l'application** (bouton sur l'accueil) ou l'icône d'installation
   de la barre d'adresse.
4. **Hors ligne** : DevTools → Network → *Offline*, puis recharger. Les pages visitées et
   la dernière réponse API restent disponibles ; une navigation inconnue tombe sur `/offline`.

### Test sur mobile

Le service worker exige un contexte sécurisé (HTTPS) ou `localhost`. Pour tester sur un
téléphone du même réseau, exposer l'app via un tunnel HTTPS (ex. `cloudflared`, `ngrok`)
puis ouvrir l'URL et utiliser *Ajouter à l'écran d'accueil*.

### Test Android

1. Ouvrir `https://pwa.graines-digitales.online` dans Chrome.
2. Ouvrir le menu Chrome puis choisir *Installer l'application* ou *Ajouter à l'écran
   d'accueil*.
3. Lancer l'application depuis l'icône ajoutée : elle doit s'ouvrir en mode standalone.
4. Visiter l'accueil puis `/dashboard`.
5. Passer le téléphone en mode avion.
6. Relancer l'application : l'accueil doit rester disponible hors ligne.
7. Ouvrir `/dashboard` hors ligne après l'avoir visité : les données mock doivent rester
   disponibles depuis le cache si la réponse API a été récupérée auparavant.
8. Ouvrir une route inconnue hors ligne : la page `/offline` doit fournir un fallback
   lisible.

### Test iPhone

1. Ouvrir `https://pwa.graines-digitales.online` dans Safari.
2. Utiliser le bouton de partage puis *Sur l'écran d'accueil*.
3. Lancer l'application depuis l'icône ajoutée : l'affichage doit utiliser le mode
   standalone iOS.
4. Visiter l'accueil puis `/dashboard`.
5. Activer le mode avion.
6. Relancer l'application et vérifier que l'accueil reste disponible.
7. Vérifier `/dashboard` hors ligne après visite préalable.
8. Vérifier qu'une route inconnue hors ligne affiche le fallback `/offline`.

### État du POC

Fonctionnel :

- manifest PWA avec icônes 192, 512, maskable et apple touch
- service worker actif en build production
- cache des assets générés
- cache des pages HTML déjà visitées
- cache NetworkFirst de l'API mock `/api/*`
- fallback `/offline` pour les navigations non disponibles
- configuration du domaine public `https://pwa.graines-digitales.online`

À améliorer après validation :

- ajouter un contrôle Lighthouse PWA automatisé
- versionner une checklist de release courte
- remplacer l'API mock par l'API Symfony lorsque le contrat sera stabilisé
- ajouter une bannière applicative indiquant la disponibilité d'une mise à jour

## Architecture

```
app/
├─ assets/css/tailwind.css   # directives Tailwind + composants (.btn-primary, .card)
├─ components/               # UI : StatCard, OfflineBanner, PwaInstallButton
├─ composables/
│  ├─ useApi.ts              # expose le client API (runtimeConfig.public.apiBase)
│  └─ useOnlineStatus.ts     # état de connectivité réactif (SSR-safe)
├─ layouts/default.vue       # header + bannière hors ligne + footer
├─ pages/
│  ├─ index.vue              # accueil
│  ├─ dashboard.vue          # tableau de bord (useAsyncData → service API)
│  └─ offline.vue            # fallback hors ligne
├─ services/api.ts           # couche service : client typé + erreurs normalisées
├─ types/api.ts              # contrats de données (DashboardStats, ApiError)
└─ error.vue                 # page d'erreur globale

server/api/dashboard.get.ts  # fausse réponse API (cible du cache NetworkFirst)
public/icons/                # icônes PWA (192 / 512 / maskable / apple-touch)
```

### Préparation API Symfony

Toute consommation passe par `useApi()` → `services/api.ts`. Aujourd'hui les données
viennent des routes mock `server/api/*`. Pour brancher l'API Symfony, il suffit de
définir l'URL de base — **aucun composant à modifier** :

```bash
NUXT_PUBLIC_API_BASE=https://api.exemple.fr
```

Les erreurs de transport sont normalisées en `ApiError { status, message }` et
exposées via `error.cause` dans les composants.

## Stratégie de cache

| Ressource                     | Stratégie     |
| ----------------------------- | ------------- |
| Pages / assets (`globPatterns`) | Precache (build) |
| Pages HTML visitées           | NetworkFirst (7 j) |
| `/api/*` (réponses API)       | NetworkFirst (timeout 5 s, 24 h) |
| Images / icônes               | CacheFirst (30 j) |
| Navigation inconnue hors ligne | Fallback `/offline` |
