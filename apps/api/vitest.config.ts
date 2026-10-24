import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Prépare la base de test une fois, avant tous les fichiers de tests
    globalSetup: './test/global-setup.ts',
    // Les variables de .env.test remplacent celles de .env
    env: { ...loadTestEnv() },
    // Les fichiers partagent la même base : on les lance l'un après l'autre
    fileParallelism: false,
  },
});

function loadTestEnv() {
  process.loadEnvFile('.env.test');
  return { DATABASE_URL: process.env.DATABASE_URL!, LOG_LEVEL: process.env.LOG_LEVEL! };
}
