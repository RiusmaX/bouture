import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import {
  orderIdParamsSchema,
  orderInputSchema,
  orderListQuerySchema,
  orderPageSchema,
  orderSchema,
  orderStatusInputSchema,
} from '@bouture/shared';
import {
  createOrder,
  findOrder,
  listOrders,
  OrderError,
  updateOrderStatus,
} from './orders.service.ts';

export const orderRoutes: FastifyPluginAsyncZod = async (app) => {
  app.addHook('onRequest', app.authenticate);

  // Les erreurs métier du service deviennent des 409, les autres suivent le chemin normal
  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof OrderError) {
      return reply.code(409).send({ statusCode: 409, error: 'Conflict', message: error.message });
    }
    return reply.send(error);
  });

  const notFound = (id: number) => app.httpErrors.notFound(`Aucune commande avec l'id ${id}`);

  app.get(
    '/',
    {
      schema: {
        tags: ['orders'],
        summary: 'Liste les commandes',
        querystring: orderListQuerySchema,
        response: { 200: orderPageSchema },
      },
    },
    (request) => listOrders(request.query),
  );

  app.get(
    '/:id',
    {
      schema: {
        tags: ['orders'],
        summary: "Détail d'une commande",
        params: orderIdParamsSchema,
        response: { 200: orderSchema },
      },
    },
    async (request) => {
      const order = await findOrder(request.params.id);
      if (!order) throw notFound(request.params.id);
      return order;
    },
  );

  app.post(
    '/',
    {
      schema: {
        tags: ['orders'],
        summary: 'Passe une commande (le stock est décrémenté)',
        body: orderInputSchema,
        response: { 201: orderSchema },
      },
    },
    async (request, reply) => reply.code(201).send(await createOrder(request.body)),
  );

  app.patch(
    '/:id/status',
    {
      schema: {
        tags: ['orders'],
        summary: "Change le statut d'une commande (annuler remet en stock)",
        params: orderIdParamsSchema,
        body: orderStatusInputSchema,
        response: { 200: orderSchema },
      },
    },
    async (request) => {
      const order = await updateOrderStatus(request.params.id, request.body.status);
      if (!order) throw notFound(request.params.id);
      return order;
    },
  );
};
