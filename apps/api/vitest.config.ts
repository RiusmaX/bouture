import { readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Prépare la base de test une fois, avant tous les fichiers de tests
    globalSetup: './test/global-setup.ts',
    // Les variables de .env.test remplacent celles de .env
    env: parseEnv(readFileSync('.env.test', 'utf8')) as Record<string, string>,
    // Les fichiers partagent la même base : on les lance l'un après l'autre
    fileParallelism: false,
  },
});
