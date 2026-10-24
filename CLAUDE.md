# Bouture

Gestion de pépinière : catalogue de végétaux, clients, commandes. Monorepo npm (workspaces).

## Structure

- `apps/api` : API REST, Node.js, Fastify, Zod, Prisma (PostgreSQL).
  - une fonctionnalité par dossier dans `src/modules/` : `*.schemas.ts` (Zod), `*.service.ts` (Prisma), `*.routes.ts` (Fastify).
  - `prisma/schema.prisma` : le schéma de la base ; toute modification passe par une migration (`npm run db:migrate`).
  - `src/generated/` : client Prisma généré, ne jamais le modifier.
- `exercises/` : exercices du jour 1, hors application. Ne pas modifier.

## Commandes (à la racine)

- `npm run db:up` : démarre PostgreSQL (Docker).
- `npm run db:migrate` puis `npm run db:seed` : crée les tables et les données de démonstration.
- `npm run dev:api` : lance l'API en mode surveillance.
- `npm run typecheck` : vérifie les types de tous les paquets.
- `npm run lint` et `npm run format` : ESLint et Prettier.

## Conventions

- Code en anglais (variables, fonctions, types, routes, champs), commentaires en français.
- TypeScript strict, pas de `any`. Unions de chaînes plutôt que `enum`.
- Imports relatifs avec l'extension `.ts`.
- Les prix sont des entiers en centimes (`priceCents`).
- La configuration passe par les variables d'environnement (`.env`, jamais commité ; `.env.example` à jour).

## Façon de travailler

- Avant de coder, propose un plan court et attends la validation.
- Petits changements, une fonctionnalité à la fois. Explique le code produit en quelques lignes.
- Lance `npm run typecheck` et `npm run lint` avant de dire qu'une tâche est finie.
