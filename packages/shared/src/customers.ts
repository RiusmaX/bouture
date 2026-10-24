import { z } from 'zod';
import { pageSchema, paginationQuerySchema } from './pagination.ts';

export const customerTypes = ['professional', 'private'] as const;

export const customerTypeSchema = z.enum(customerTypes);

export const customerSchema = z.object({
  id: z.number().int(),
  name: z.string().trim().min(1, 'Le nom est obligatoire').max(120),
  email: z.email('Adresse e-mail invalide').max(254),
  // nullable : la colonne accepte NULL en base (phone String? dans Prisma)
  phone: z.string().max(30).nullable(),
  city: z.string().trim().min(1, 'La ville est obligatoire').max(80),
  type: customerTypeSchema,
});

export const customerInputSchema = customerSchema.omit({ id: true }).extend({
  // À la création, le téléphone peut être absent : on enregistre alors null
  phone: z.string().max(30).nullable().default(null),
});

export const customerPatchSchema = customerSchema.omit({ id: true }).partial();

export const customerListQuerySchema = paginationQuerySchema.extend({
  type: customerTypeSchema.optional(),
  search: z.string().trim().min(1).optional(),
});

export const customerPageSchema = pageSchema(customerSchema);

export const customerIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type CustomerType = z.infer<typeof customerTypeSchema>;
export type Customer = z.infer<typeof customerSchema>;
export type CustomerInput = z.infer<typeof customerInputSchema>;
export type CustomerPatch = z.infer<typeof customerPatchSchema>;
export type CustomerListQuery = z.infer<typeof customerListQuerySchema>;
