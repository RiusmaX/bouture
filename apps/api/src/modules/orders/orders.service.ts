import type { OrderInput, OrderListQuery, OrderStatus } from '@bouture/shared';
import { prisma } from '../../db.ts';
import type { Prisma } from '../../generated/prisma/client.ts';

// Ce qu'on charge avec une commande : le client et les lignes avec leur végétal
const orderInclude = {
  customer: { select: { name: true } },
  items: { include: { plant: { select: { name: true } } }, orderBy: { id: 'asc' } },
} satisfies Prisma.OrderInclude;

type OrderWithRelations = Prisma.OrderGetPayload<{ include: typeof orderInclude }>;

// Erreur métier : la route la traduit en 409 Conflict
export class OrderError extends Error {}

// La forme renvoyée par l'API : à plat, avec le total calculé
function toOrder(order: OrderWithRelations) {
  const items = order.items.map((item) => ({
    plantId: item.plantId,
    plantName: item.plant.name,
    quantity: item.quantity,
    unitPriceCents: item.unitPriceCents,
  }));
  return {
    id: order.id,
    customerId: order.customerId,
    customerName: order.customer.name,
    status: order.status,
    createdAt: order.createdAt.toISOString(),
    totalCents: items.reduce((sum, item) => sum + item.quantity * item.unitPriceCents, 0),
    items,
  };
}

export async function listOrders({ status, customerId, page, pageSize }: OrderListQuery) {
  const where: Prisma.OrderWhereInput = { status, customerId };
  const [orders, total] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      include: orderInclude,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.order.count({ where }),
  ]);
  return { items: orders.map(toOrder), total, page, pageSize };
}

export async function findOrder(id: number) {
  const order = await prisma.order.findUnique({ where: { id }, include: orderInclude });
  return order && toOrder(order);
}

// Une commande touche plusieurs tables : tout réussit ou rien n'est enregistré (transaction).
export async function createOrder({ customerId, items }: OrderInput) {
  return prisma.$transaction(async (tx) => {
    const customer = await tx.customer.findUnique({ where: { id: customerId } });
    if (!customer) throw new OrderError(`Aucun client avec l'id ${customerId}`);

    const lines = [];
    for (const { plantId, quantity } of items) {
      // Décrément conditionnel : la ligne n'est modifiée que s'il reste assez de stock.
      // Deux commandes simultanées ne peuvent pas vendre la même plante deux fois.
      const { count } = await tx.plant.updateMany({
        where: { id: plantId, stock: { gte: quantity } },
        data: { stock: { decrement: quantity } },
      });
      const plant = await tx.plant.findUnique({ where: { id: plantId } });
      if (!plant) throw new OrderError(`Aucun végétal avec l'id ${plantId}`);
      if (count === 0)
        throw new OrderError(`Stock insuffisant pour ${plant.name} : ${plant.stock} disponible(s)`);
      lines.push({ plantId, quantity, unitPriceCents: plant.priceCents });
    }

    const order = await tx.order.create({
      data: { customerId, items: { create: lines } },
      include: orderInclude,
    });
    return toOrder(order);
  });
}

export async function updateOrderStatus(id: number, status: OrderStatus) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { id }, include: { items: true } });
    if (!order) return null;
    if (order.status === 'cancelled') throw new OrderError('Une commande annulée ne change plus');
    if (status === 'cancelled') {
      // Annuler remet les végétaux en stock
      for (const item of order.items) {
        await tx.plant.update({
          where: { id: item.plantId },
          data: { stock: { increment: item.quantity } },
        });
      }
    }
    const updated = await tx.order.update({
      where: { id },
      data: { status },
      include: orderInclude,
    });
    return toOrder(updated);
  });
}
