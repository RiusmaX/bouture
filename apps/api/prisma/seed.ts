// Données de démonstration : npm run db:seed
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, type Category, type CustomerType } from '../src/generated/prisma/client.ts';
import { hashPassword } from '../src/modules/auth/password.ts';
import plants from '../src/data/plants.json' with { type: 'json' };
import customers from '../src/data/customers.json' with { type: 'json' };

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

// On repart de tables vides, compteurs d'id remis à 1 : les végétaux gardent toujours les mêmes id.
// Puis on insère le catalogue sans les id (la base les attribue).
await prisma.$executeRaw`TRUNCATE TABLE plants, customers, users RESTART IDENTITY CASCADE`;
await prisma.plant.createMany({
  data: plants.map(({ id: _id, ...plant }) => ({ ...plant, category: plant.category as Category })),
});

await prisma.customer.createMany({
  data: customers.map((customer) => ({ ...customer, type: customer.type as CustomerType })),
});

// Deux comptes de démonstration, un par rôle (mots de passe de formation, à ne jamais réutiliser)
await prisma.user.createMany({
  data: [
    {
      email: 'admin@bouture.example',
      name: 'Alice Martin',
      role: 'admin',
      passwordHash: await hashPassword('bouture-admin'),
    },
    {
      email: 'vente@bouture.example',
      name: 'Bastien Roux',
      role: 'seller',
      passwordHash: await hashPassword('bouture-vente'),
    },
  ],
});

console.log(`${plants.length} végétaux, ${customers.length} clients et 2 utilisateurs insérés`);
await prisma.$disconnect();
