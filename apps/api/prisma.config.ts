// Configuration de la ligne de commande Prisma (migrations, données de démonstration)
import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    // process.env plutôt que env() : npm install (prisma generate) fonctionne aussi sans .env
    url: process.env.DATABASE_URL,
  },
});
