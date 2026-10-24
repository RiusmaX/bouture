// Données de démonstration : npm run db:seed (lancé aussi par prisma migrate reset)
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, type Category } from '../src/generated/prisma/client.ts';
import plants from '../src/data/plants.json' with { type: 'json' };

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

// On repart d'une table vide, puis on insère le catalogue sans les id (la base les attribue)
await prisma.plant.deleteMany();
await prisma.plant.createMany({
  data: plants.map(({ id: _id, ...plant }) => ({ ...plant, category: plant.category as Category })),
});

console.log(`${plants.length} végétaux insérés`);
await prisma.$disconnect();
