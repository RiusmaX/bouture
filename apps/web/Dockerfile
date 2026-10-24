# Image de l'interface : Vite construit des fichiers statiques, Caddy les sert.
# Caddy relaie aussi /api vers l'API et obtient tout seul le certificat HTTPS.
#   docker build -f apps/web/Dockerfile .

FROM node:24-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/
COPY packages/shared/package.json packages/shared/
RUN npm ci -w @bouture/web --ignore-scripts
COPY tsconfig.base.json ./
COPY packages/shared packages/shared
COPY apps/web apps/web
RUN npm run build -w @bouture/web

FROM caddy:2-alpine
COPY apps/web/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/apps/web/dist /srv
