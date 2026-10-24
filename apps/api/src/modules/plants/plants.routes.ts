import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import {
  plantIdParamsSchema,
  plantListQuerySchema,
  plantPageSchema,
  plantSchema,
} from './plants.schemas.ts';
import { findPlant, listPlants } from './plants.store.ts';

// Les routes du catalogue. Le préfixe /plants est donné à l'enregistrement (app.ts).
export const plantRoutes: FastifyPluginAsyncZod = async (app) => {
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
    async (request) => listPlants(request.query),
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
      const plant = findPlant(request.params.id);
      // Une erreur levée devient une réponse 404 au format { statusCode, error, message }
      if (!plant) throw app.httpErrors.notFound(`Aucun végétal avec l'id ${request.params.id}`);
      return plant;
    },
  );
};
