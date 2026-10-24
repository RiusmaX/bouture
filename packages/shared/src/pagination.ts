import { z } from 'zod';

// Une page de résultats, quel que soit le type des éléments (générique)
export const pageSchema = <T extends z.ZodType>(item: T) =>
  z.object({
    items: z.array(item),
    total: z.number().int(),
    page: z.number().int(),
    pageSize: z.number().int(),
  });

export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

// Les paramètres de pagination communs à toutes les listes
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
