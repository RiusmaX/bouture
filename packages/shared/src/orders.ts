import { z } from 'zod';
import { pageSchema, paginationQuerySchema } from './pagination.ts';

export const orderStatuses = ['confirmed', 'delivered', 'cancelled'] as const;

export const orderStatusSchema = z.enum(orderStatuses);

export const orderItemSchema = z.object({
  plantId: z.number().int(),
  plantName: z.string(),
  quantity: z.number().int(),
  unitPriceCents: z.number().int(),
});

export const orderSchema = z.object({
  id: z.number().int(),
  customerId: z.number().int(),
  customerName: z.string(),
  status: orderStatusSchema,
  createdAt: z.iso.datetime(),
  totalCents: z.number().int(),
  items: z.array(orderItemSchema),
});

// Pour créer une commande : un client et au moins une ligne. Le prix vient du catalogue, pas du client.
export const orderInputSchema = z.object({
  customerId: z.number({ error: 'Choisissez un client' }).int().positive('Choisissez un client'),
  items: z
    .array(
      z.object({
        plantId: z
          .number({ error: 'Choisissez un végétal' })
          .int()
          .positive('Choisissez un végétal'),
        quantity: z
          .number({ error: 'Quantité obligatoire' })
          .int()
          .min(1, 'Au moins 1')
          .max(10_000),
      }),
    )
    .min(1, 'Ajoutez au moins une ligne'),
});

export const orderStatusInputSchema = z.object({ status: orderStatusSchema });

export const orderListQuerySchema = paginationQuerySchema.extend({
  status: orderStatusSchema.optional(),
  customerId: z.coerce.number().int().positive().optional(),
});

export const orderPageSchema = pageSchema(orderSchema);

export const orderIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type OrderStatus = z.infer<typeof orderStatusSchema>;
export type Order = z.infer<typeof orderSchema>;
export type OrderInput = z.infer<typeof orderInputSchema>;
export type OrderListQuery = z.infer<typeof orderListQuerySchema>;
