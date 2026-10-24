import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import {
  plantIdParamsSchema,
  plantInputSchema,
  plantListQuerySchema,
  plantPatchSchema,
  plantPageSchema,
  plantSchema,
  plantStatsSchema,
} from '@bouture/shared';
import {
  createPlant,
  deletePlant,
  findPlant,
  listPlants,
  plantStats,
  updatePlant,
} from './plants.service.ts';

// Les routes du catalogue. Le préfixe /plants est donné à l'enregistrement (app.ts).
export const plantRoutes: FastifyPluginAsyncZod = async (app) => {
  // Toutes les routes de ce plugin demandent un utilisateur connecté
  app.addHook('onRequest', app.authenticate);

  // GET /plants?category=hedge&search=laurier&page=1&pageSize=20
  app.get(
    '/',
    {
      schema: {
        tags: ['plants'],
        summary: 'Liste les végétaux du catalogue',
        querystring: plantListQuerySchema,
        response: { 200: plantPageSchema },
      },
    },
    // request.query est déjà validé et typé : page est un nombre, category une valeur connue
    (request) => listPlants(request.query),
  );

  // GET /plants/stats : déclarée avant /:id, sinon « stats » serait pris pour un id
  app.get(
    '/stats',
    {
      schema: {
        tags: ['plants'],
        summary: 'Résumé du stock',
        response: { 200: plantStatsSchema },
      },
    },
    () => plantStats(),
  );

  // GET /plants/10
  app.get(
    '/:id',
    {
      schema: {
        tags: ['plants'],
        summary: "Détail d'un végétal",
        params: plantIdParamsSchema,
        response: { 200: plantSchema },
      },
    },
    async (request) => {
      const plant = await findPlant(request.params.id);
      // Une erreur levée devient une réponse 404 au format { statusCode, error, message }
      if (!plant) throw app.httpErrors.notFound(`Aucun végétal avec l'id ${request.params.id}`);
      return plant;
    },
  );

  // POST /plants : 201 Created, avec le végétal créé
  app.post(
    '/',
    {
      schema: {
        tags: ['plants'],
        summary: 'Ajoute un végétal',
        body: plantInputSchema,
        response: { 201: plantSchema },
      },
    },
    async (request, reply) => reply.code(201).send(await createPlant(request.body)),
  );

  // PATCH /plants/10 : on n'envoie que les champs à changer
  app.patch(
    '/:id',
    {
      schema: {
        tags: ['plants'],
        summary: 'Modifie un végétal',
        params: plantIdParamsSchema,
        body: plantPatchSchema,
        response: { 200: plantSchema },
      },
    },
    async (request) => {
      const plant = await updatePlant(request.params.id, request.body);
      if (!plant) throw app.httpErrors.notFound(`Aucun végétal avec l'id ${request.params.id}`);
      return plant;
    },
  );

  // DELETE /plants/10 : 204 No Content, pas de corps de réponse
  app.delete(
    '/:id',
    {
      // Supprimer est réservé aux administrateurs
      onRequest: [app.requireRole('admin')],
      schema: {
        tags: ['plants'],
        summary: 'Supprime un végétal',
        params: plantIdParamsSchema,
        response: { 204: z.null() },
      },
    },
    async (request, reply) => {
      if (!(await deletePlant(request.params.id))) {
        throw app.httpErrors.notFound(`Aucun végétal avec l'id ${request.params.id}`);
      }
      return reply.code(204).send(null);
    },
  );
};
