import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import {
  customerIdParamsSchema,
  customerInputSchema,
  customerListQuerySchema,
  customerPageSchema,
  customerPatchSchema,
  customerSchema,
} from '@bouture/shared';
import {
  countCustomerOrders,
  createCustomer,
  deleteCustomer,
  findCustomer,
  findCustomerByEmail,
  listCustomers,
  updateCustomer,
} from './customers.service.ts';

export const customerRoutes: FastifyPluginAsyncZod = async (app) => {
  // Toutes les routes de ce plugin demandent un utilisateur connecté
  app.addHook('onRequest', app.authenticate);

  const notFound = (id: number) => app.httpErrors.notFound(`Aucun client avec l'id ${id}`);

  app.get(
    '/',
    {
      schema: {
        tags: ['customers'],
        summary: 'Liste les clients',
        querystring: customerListQuerySchema,
        response: { 200: customerPageSchema },
      },
    },
    (request) => listCustomers(request.query),
  );

  app.get(
    '/:id',
    {
      schema: {
        tags: ['customers'],
        summary: "Détail d'un client",
        params: customerIdParamsSchema,
        response: { 200: customerSchema },
      },
    },
    async (request) => {
      const customer = await findCustomer(request.params.id);
      if (!customer) throw notFound(request.params.id);
      return customer;
    },
  );

  app.post(
    '/',
    {
      schema: {
        tags: ['customers'],
        summary: 'Ajoute un client',
        body: customerInputSchema,
        response: { 201: customerSchema },
      },
    },
    async (request, reply) => {
      // L'adresse e-mail est unique : 409 Conflict plutôt qu'une erreur 500 de la base
      if (await findCustomerByEmail(request.body.email)) {
        throw app.httpErrors.conflict('Un client utilise déjà cette adresse e-mail');
      }
      return reply.code(201).send(await createCustomer(request.body));
    },
  );

  app.patch(
    '/:id',
    {
      schema: {
        tags: ['customers'],
        summary: 'Modifie un client',
        params: customerIdParamsSchema,
        body: customerPatchSchema,
        response: { 200: customerSchema },
      },
    },
    async (request) => {
      const { email } = request.body;
      if (email) {
        const other = await findCustomerByEmail(email);
        if (other && other.id !== request.params.id) {
          throw app.httpErrors.conflict('Un client utilise déjà cette adresse e-mail');
        }
      }
      const customer = await updateCustomer(request.params.id, request.body);
      if (!customer) throw notFound(request.params.id);
      return customer;
    },
  );

  app.delete(
    '/:id',
    {
      // Supprimer est réservé aux administrateurs
      onRequest: [app.requireRole('admin')],
      schema: {
        tags: ['customers'],
        summary: 'Supprime un client',
        params: customerIdParamsSchema,
        response: { 204: z.null() },
      },
    },
    async (request, reply) => {
      // Un client qui a des commandes reste en base : son historique doit rester lisible
      if ((await countCustomerOrders(request.params.id)) > 0) {
        throw app.httpErrors.conflict('Ce client a des commandes : il ne peut pas être supprimé');
      }
      if (!(await deleteCustomer(request.params.id))) throw notFound(request.params.id);
      return reply.code(204).send(null);
    },
  );
};
