# syntax=docker/dockerfile:1

# --- Étape build : installe et compile l'app Nuxt en mode SSR ---
FROM oven/bun:1 AS build
WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile || bun install

COPY . .
RUN bun run build

# --- Étape runtime : image Node légère ne servant que .output ---
FROM node:22-slim AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV NITRO_PORT=3000
ENV NITRO_HOST=0.0.0.0

COPY --from=build /app/.output ./.output

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
