# Bouture

Gestion de pépinière (catalogue de végétaux, clients, commandes) : le fil rouge de la formation **TypeScript full-stack**, de la maquette à la mise en ligne, avec Node.js, React et Claude Code.

| Partie                      | Technologies                                                                        |
| --------------------------- | ----------------------------------------------------------------------------------- |
| API (`apps/api`)            | Node.js 24, TypeScript, Fastify, Zod, Prisma, PostgreSQL                            |
| Interface (`apps/web`)      | React, Vite, React Router, TanStack Query, React Hook Form, Tailwind CSS, shadcn/ui |
| Partagé (`packages/shared`) | les schémas Zod et les types, communs aux deux                                      |
| Outillage                   | npm (workspaces), ESLint, Prettier, Vitest, Docker, GitHub Actions                  |

## Prérequis

Node.js 24 (LTS), Git, Docker Desktop et VS Code. Le détail est dans la fiche d'installation de la formation.

## Démarrer

```bash
git clone https://github.com/RiusmaX/bouture.git
cd bouture
cp apps/api/.env.example apps/api/.env   # sous PowerShell : Copy-Item
npm install
npm run db:up        # PostgreSQL dans Docker
npm run db:migrate   # crée les tables
npm run db:seed      # données de démonstration
npm run dev:api      # l'API sur http://localhost:3000 (documentation : /docs)
npm run dev:web      # dans un second terminal : l'interface sur http://localhost:5173
```

Comptes de démonstration : `admin@bouture.example` / `bouture-admin` (administrateur) et `vente@bouture.example` / `bouture-vente` (vendeur).

## Les exercices du jour 1

Ils ne touchent pas à l'application et se lancent avec Node, dans le dossier `exercises` :

```bash
cd exercises
npm install
npm run td1          # TD 1 · JavaScript
npm run td2          # TD 2 · TypeScript
npm run typecheck    # TD 2 · ce que TypeScript reproche au code
```

Les corrigés sont sur le tag `exercises-solution`.

## Les étapes

La branche `main` contient l'application terminée. Chaque activité part d'un tag ; sa correction est le tag suivant.

| Tag de départ   | Activité | Ce qu'on construit                              |
| --------------- | -------- | ----------------------------------------------- |
| `td03-start`    | TD 3     | Le monorepo initialisé à la main                |
| `td04-start`    | TD 4     | Requêtes HTTP, lecture du contrat OpenAPI       |
| `td05-start`    | TD 5     | L'API Fastify du catalogue                      |
| `tp01-start`    | TP 1     | Créer, modifier, supprimer un végétal           |
| `td06-start`    | TD 6     | PostgreSQL et Prisma                            |
| `tp02-start`    | TP 2     | La ressource Clients                            |
| `td07-start`    | TD 7     | Les tests de l'API                              |
| `td08-start`    | TD 8     | L'interface initialisée avec Vite               |
| `td09-start`    | TD 9     | La grille du catalogue et sa recherche          |
| `tp03-start`    | TP 3     | Le filtre par catégorie                         |
| `td10-start`    | TD 10    | Design tokens, Tailwind CSS, shadcn/ui          |
| `td11-start`    | TD 11    | La navigation                                   |
| `td12-start`    | TD 12    | Le catalogue servi par l'API                    |
| `td13-start`    | TD 13    | Tableau trié et paginé, formulaire d'un végétal |
| `tp04-start`    | TP 4     | La liste et le formulaire Clients               |
| `tp04-solution` |          | Correction du TP 4, avant la connexion côté API |
| `td14-start`    | TD 14    | La connexion et les rôles                       |
| `td15-start`    | TD 15    | Une pull request relue en binôme                |
| `td16-start`    | TD 16    | Docker, intégration et déploiement continus     |
| `tp05-start`    | TP final | Le module Commandes                             |
| `final`         |          | L'application complète                          |

### Repartir d'une étape

En retard ou bloqué ? Repars du tag de l'étape suivante, sur une branche à toi :

```bash
git add -A
git commit -m "Mon travail sur le TP 1"   # ton travail est gardé sur ta branche
git switch -c td06 td06-start
npm install                               # les dépendances changent d'une étape à l'autre
npm run db:migrate && npm run db:seed     # à partir du TD 6 : le schéma de la base aussi
```

Si tu préfères ne pas commiter : `git stash -u` (le `-u` met aussi de côté les fichiers nouveaux).

## Commandes utiles

```bash
npm run typecheck    # vérifie les types de tous les paquets
npm run lint         # ESLint
npm run format       # Prettier
npm test             # tests de l'API (base bouture_test)
```

## Mise en ligne

Voir [docs/deploy.md](docs/deploy.md) : Docker Compose, Caddy (HTTPS automatique) et GitHub Actions.
