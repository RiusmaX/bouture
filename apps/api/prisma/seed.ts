// Données de démonstration : npm run db:seed (lancé aussi par prisma migrate reset)
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, type Category, type CustomerType } from '../src/generated/prisma/client.ts';
import plants from '../src/data/plants.json' with { type: 'json' };
import customers from '../src/data/customers.json' with { type: 'json' };

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

// On repart de tables vides, puis on insère le catalogue sans les id (la base les attribue)
await prisma.customer.deleteMany();
await prisma.plant.deleteMany();
await prisma.plant.createMany({
  data: plants.map(({ id: _id, ...plant }) => ({ ...plant, category: plant.category as Category })),
});

await prisma.customer.createMany({
  data: customers.map((customer) => ({ ...customer, type: customer.type as CustomerType })),
});

console.log(`${plants.length} végétaux et ${customers.length} clients insérés`);
await prisma.$disconnect();
