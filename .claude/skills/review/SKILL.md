---
name: review
description: Relire une pull request ou une branche de Bouture selon les conventions de l'équipe. À utiliser quand on demande de relire, de vérifier une pull request ou une branche avant fusion.
---

# Relire une pull request de Bouture

1. Lis `CLAUDE.md` et `CONTRIBUTING.md`.
2. Affiche les changements : `git diff main...HEAD` (ou `gh pr diff <numéro>`).
3. Lance `npm run typecheck`, `npm run lint` et `npm test`. Note les échecs.
4. Relis chaque fichier modifié et signale, avec le fichier et la ligne :
   - les écarts aux conventions (identifiants en anglais, schémas Zod dans `packages/shared`, tokens de couleur) ;
   - les cas d'erreur non traités (404, 409, validation) ;
   - les droits : une route sans `app.authenticate`, une suppression sans `requireRole('admin')` ;
   - une route sans test, une modification de `schema.prisma` sans migration ;
   - tout secret ou fichier `.env` ajouté.
5. Termine par un avis : « prête à fusionner », ou la liste courte de ce qui bloque.

Ne modifie aucun fichier : tu relis seulement.
