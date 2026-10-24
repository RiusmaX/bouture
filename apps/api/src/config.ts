// La configuration vient des variables d'environnement, jamais du code :
// le même code tourne en local, en recette et en production.
export const config = {
  port: Number(process.env.PORT ?? 3000),
};
