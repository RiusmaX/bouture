import { prisma } from '../../db.ts';
import type { PlantInput, PlantListQuery, PlantPatch } from '@bouture/shared';
import type { Prisma } from '../../generated/prisma/client.ts';

// Le service porte l'accès aux données : les routes ne parlent jamais SQL ni Prisma directement.

export async function listPlants({
  category,
  search,
  inStock,
  sort,
  order,
  page,
  pageSize,
}: PlantListQuery) {
  // Le filtre est un objet typé : l'éditeur propose les champs et les opérateurs
  const where: Prisma.PlantWhereInput = {
    category,
    ...(inStock && { stock: { gt: 0 } }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { latinName: { contains: search, mode: 'insensitive' } },
      ],
    }),
  };
  // Deux requêtes dans une même transaction : la page et le nombre total de résultats
  const [items, total] = await prisma.$transaction([
    prisma.plant.findMany({
      where,
      // L'id départage les égalités : l'ordre reste stable d'une page à l'autre
      orderBy: [{ [sort]: order }, { id: 'asc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.plant.count({ where }),
  ]);
  return { items, total, page, pageSize };
}

export function findPlant(id: number) {
  // findUnique renvoie null si rien ne correspond
  return prisma.plant.findUnique({ where: { id } });
}

export function createPlant(input: PlantInput) {
  return prisma.plant.create({ data: input });
}

// updateMany et deleteMany ne lèvent pas d'erreur si l'id n'existe pas : on regarde le compte
export async function updatePlant(id: number, patch: PlantPatch) {
  const { count } = await prisma.plant.updateMany({ where: { id }, data: patch });
  return count === 0 ? null : findPlant(id);
}

export async function deletePlant(id: number) {
  const { count } = await prisma.plant.deleteMany({ where: { id } });
  return count > 0;
}
