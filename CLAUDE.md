# Bouture

Gestion de pépinière : catalogue de végétaux, clients, commandes. Monorepo npm (workspaces).

## Structure

- `apps/api` : API REST, Node.js, Fastify, Zod, Prisma (PostgreSQL).
  - une fonctionnalité par dossier dans `src/modules/` : `*.service.ts` (Prisma), `*.routes.ts` (Fastify).
  - `prisma/schema.prisma` : le schéma de la base ; toute modification passe par une migration (`npm run db:migrate`).
  - `src/generated/` : client Prisma généré, ne jamais le modifier.
- `apps/web` : interface React (Vite, TypeScript, Tailwind CSS, shadcn/ui).
  - imports par l'alias `@/` (dossier `src`), sans extension.
  - session : `src/auth/AuthContext.tsx` (Context + `useReducer`, hook `useAuth`) ; routes protégées par `RequireAuth`. Préférences d'interface : Zustand (`src/stores/`).
  - appels à l'API : `src/lib/api.ts` (`apiFetch`) et un fichier par ressource dans `src/api/` (hooks TanStack Query). En développement, `/api` est relayé vers l'API par Vite.
  - `src/components/ui/` : composants shadcn/ui, ajoutés avec `npx shadcn@latest add <nom>`.
  - couleurs : uniquement les tokens sémantiques (`bg-primary`, `text-muted-foreground`…), jamais de couleur en dur. Tokens de marque dans `design/tokens.json`.
- `packages/shared` : schémas Zod et types partagés par l'API et l'interface (`@bouture/shared`). Un champ qui change se modifie ici d'abord.
- `exercises/` : exercices du jour 1, hors application. Ne pas modifier.

## Commandes (à la racine)

- `npm run db:up` : démarre PostgreSQL (Docker).
- `npm run db:migrate` puis `npm run db:seed` : crée les tables et les données de démonstration.
- `npm run dev:api` : lance l'API en mode surveillance.
- `npm run dev:web` : lance l'interface (http://localhost:5173).
- `npm run typecheck` : vérifie les types de tous les paquets.
- `npm test` : lance les tests (Vitest), sur la base `bouture_test` (voir `apps/api/.env.test`).
- `npm run lint` et `npm run format` : ESLint et Prettier.

## Conventions

- Code en anglais (variables, fonctions, types, routes, champs), commentaires en français.
- TypeScript strict, pas de `any`. Unions de chaînes plutôt que `enum`.
- Imports relatifs avec l'extension `.ts`.
- Les prix sont des entiers en centimes (`priceCents`).
- La configuration passe par les variables d'environnement (`.env`, jamais commité ; `.env.example` à jour).

## Sécurité

- Toutes les routes de l'API demandent une connexion (`app.authenticate`), sauf `/auth/login`. Les suppressions sont réservées au rôle `admin` (`app.requireRole('admin')`).
- Le jeton JWT voyage dans un cookie httpOnly, jamais dans le stockage du navigateur.
- Les schémas de réponse filtrent les champs : `passwordHash` ne sort jamais de l'API.
- Comptes de démonstration (seed) : `admin@bouture.example` / `bouture-admin`, `vente@bouture.example` / `bouture-vente`.

## Façon de travailler

- Avant de coder, propose un plan court et attends la validation.
- Petits changements, une fonctionnalité à la fois. Explique le code produit en quelques lignes.
- Toute route nouvelle a ses tests (`apps/api/test/`, avec `app.inject`).
- Lance `npm run typecheck`, `npm run lint` et `npm test` avant de dire qu'une tâche est finie.
- Ne lance jamais de commande destructrice sur une base (`prisma migrate reset`, `DROP`) sans demander.
