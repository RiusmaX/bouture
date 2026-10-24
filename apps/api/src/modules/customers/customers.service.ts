import { prisma } from '../../db.ts';
import type { Prisma } from '../../generated/prisma/client.ts';
import type { CustomerInput, CustomerListQuery, CustomerPatch } from '@bouture/shared';

export async function listCustomers({ type, search, page, pageSize }: CustomerListQuery) {
  const where: Prisma.CustomerWhereInput = {
    type,
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ],
    }),
  };
  const [items, total] = await prisma.$transaction([
    prisma.customer.findMany({
      where,
      orderBy: { name: 'asc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.customer.count({ where }),
  ]);
  return { items, total, page, pageSize };
}

export function findCustomer(id: number) {
  return prisma.customer.findUnique({ where: { id } });
}

export function findCustomerByEmail(email: string) {
  return prisma.customer.findUnique({ where: { email } });
}

export function createCustomer(input: CustomerInput) {
  return prisma.customer.create({ data: input });
}

export async function updateCustomer(id: number, patch: CustomerPatch) {
  const { count } = await prisma.customer.updateMany({ where: { id }, data: patch });
  return count === 0 ? null : findCustomer(id);
}

export function countCustomerOrders(id: number) {
  return prisma.order.count({ where: { customerId: id } });
}

export async function deleteCustomer(id: number) {
  const { count } = await prisma.customer.deleteMany({ where: { id } });
  return count > 0;
}
