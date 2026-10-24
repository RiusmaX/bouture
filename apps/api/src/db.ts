import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client.ts';
import { config } from './config.ts';

// Un seul client pour toute l'API : il gère lui-même un groupe de connexions (pool).
// L'adaptateur PrismaPg passe par le pilote PostgreSQL de Node (pg).
export const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: config.databaseUrl }),
});
