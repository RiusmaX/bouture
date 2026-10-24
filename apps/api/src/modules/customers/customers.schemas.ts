import { z } from 'zod';

export const customerTypeSchema = z.enum(['professional', 'private']);

export const customerSchema = z.object({
  id: z.number().int(),
  name: z.string().trim().min(1).max(120),
  email: z.email().max(254),
  // nullable : la colonne accepte NULL en base (phone String? dans Prisma)
  phone: z.string().max(30).nullable(),
  city: z.string().trim().min(1).max(80),
  type: customerTypeSchema,
});

export const customerInputSchema = customerSchema.omit({ id: true }).extend({
  // À la création, le téléphone peut être absent : on enregistre alors null
  phone: z.string().max(30).nullable().default(null),
});

export const customerPatchSchema = customerSchema.omit({ id: true }).partial();

export const customerListQuerySchema = z.object({
  type: customerTypeSchema.optional(),
  search: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export const customerPageSchema = z.object({
  items: z.array(customerSchema),
  total: z.number().int(),
  page: z.number().int(),
  pageSize: z.number().int(),
});

export const customerIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type Customer = z.infer<typeof customerSchema>;
export type CustomerInput = z.infer<typeof customerInputSchema>;
export type CustomerPatch = z.infer<typeof customerPatchSchema>;
export type CustomerListQuery = z.infer<typeof customerListQuerySchema>;
