# Travailler à plusieurs sur Bouture

## Le flux : une branche par changement

1. On part toujours d'une `main` à jour : `git switch main && git pull`.
2. On crée une branche courte, nommée par son type : `feat/stock-value`, `fix/customer-email`, `docs/readme`.
3. On fait de petits commits, au message clair, à l'impératif : « Ajoute la valeur du stock à la fiche ».
4. On pousse la branche et on ouvre une pull request vers `main`, avec le modèle proposé.
5. Une autre personne relit. La pull request n'est fusionnée qu'après son accord et des vérifications au vert.
6. On fusionne, on supprime la branche, on revient sur `main`.

`main` est toujours déployable : on n'y pousse jamais directement.

## Relire une pull request

- Lancer le code : `git switch <branche>`, `npm install`, puis l'écran ou la requête concernés.
- Comprendre avant d'approuver : une ligne qu'on ne sait pas expliquer est une question à poser.
- Vérifier ce que l'IA oublie souvent : les cas d'erreur (404, 409, champ vide), les droits (qui peut supprimer ?), les tests, les migrations.
- Commenter le code, pas la personne. Proposer une solution quand on signale un problème.

Avec Claude Code, la compétence `/review` du dépôt fait une première relecture selon ces règles. Elle ne remplace pas la vôtre.
