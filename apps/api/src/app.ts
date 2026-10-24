import Fastify from 'fastify';
import sensible from '@fastify/sensible';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { config } from './config.ts';
import { prisma } from './db.ts';
import { plantRoutes } from './modules/plants/plants.routes.ts';

// Construit l'application sans la démarrer : les tests pourront l'utiliser sans ouvrir de port.
export async function buildApp() {
  const app = Fastify({ logger: { level: config.logLevel } }).withTypeProvider<ZodTypeProvider>();

  // Zod valide les entrées (body, query, params) et filtre les sorties (response)
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  // app.httpErrors.notFound(), badRequest()… : des erreurs HTTP prêtes à l'emploi
  await app.register(sensible);

  // La documentation OpenAPI est générée à partir des schémas Zod des routes
  await app.register(swagger, {
    openapi: { info: { title: 'Bouture API', version: '1.0.0' } },
    transform: jsonSchemaTransform,
  });
  await app.register(swaggerUi, { routePrefix: '/docs' });

  // À l'arrêt de l'API, on ferme proprement les connexions à la base
  app.addHook('onClose', () => prisma.$disconnect());

  // Une fonctionnalité = un plugin, monté sous son préfixe
  await app.register(plantRoutes, { prefix: '/plants' });

  return app;
}
