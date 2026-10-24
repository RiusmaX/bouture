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
await prisma.$executeRaw`TRUNCATE TABLE order_items, orders, plants, customers, users RESTART IDENTITY CASCADE`;
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

// Quelques commandes pour que l'écran Commandes ne soit pas vide (ids des clients et végétaux du seed)
const demoOrders = [
  {
    customerId: 1,
    status: 'delivered' as const,
    items: [
      { plantId: 20, quantity: 40 },
      { plantId: 22, quantity: 120 },
    ],
  },
  {
    customerId: 2,
    status: 'confirmed' as const,
    items: [
      { plantId: 1, quantity: 3 },
      { plantId: 10, quantity: 24 },
    ],
  },
  { customerId: 4, status: 'confirmed' as const, items: [{ plantId: 9, quantity: 1 }] },
];
for (const { customerId, status, items } of demoOrders) {
  await prisma.order.create({
    data: {
      customerId,
      status,
      items: {
        create: items.map(({ plantId, quantity }) => ({
          plantId,
          quantity,
          unitPriceCents: plants[plantId - 1]!.priceCents,
        })),
      },
    },
  });
}

console.log(
  `${plants.length} végétaux, ${customers.length} clients, 2 utilisateurs et ${demoOrders.length} commandes insérés`,
);
await prisma.$disconnect();
