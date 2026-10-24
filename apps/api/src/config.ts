import { z } from 'zod';

// La configuration vient des variables d'environnement, jamais du code :
// le même code tourne en local, en recette et en production.
// Zod vérifie au démarrage : une variable manquante arrête l'API tout de suite, avec un message clair.
const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  HOST: z.string().default('localhost'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
});

const env = envSchema.parse(process.env);

export const config = {
  port: env.PORT,
  host: env.HOST,
  logLevel: env.LOG_LEVEL,
};
