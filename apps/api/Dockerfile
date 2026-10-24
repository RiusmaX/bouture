# Image de l'API. Construite depuis la racine du dépôt (le paquet partagé est nécessaire) :
#   docker build -f apps/api/Dockerfile .

FROM node:24-slim AS build
WORKDIR /app
# 1. Les dépendances d'abord : cette couche reste en cache tant que les package.json ne changent pas
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/
COPY packages/shared/package.json packages/shared/
COPY apps/api/prisma apps/api/prisma
COPY apps/api/prisma.config.ts apps/api/
# Le client Prisma est généré à l'installation : la commande lit le schéma, pas la base
RUN DATABASE_URL=postgresql://build@localhost/build npm ci -w @bouture/api
# 2. Puis le code, compilé en JavaScript
COPY tsconfig.base.json ./
COPY packages/shared packages/shared
COPY apps/api apps/api
RUN npm run build -w @bouture/api

FROM node:24-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app /app
WORKDIR /app/apps/api
# On ne tourne jamais en root dans un conteneur
USER node
EXPOSE 3000
# Au démarrage : les migrations en attente, puis l'API
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
