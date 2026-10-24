import Fastify from 'fastify';
import rateLimit from '@fastify/rate-limit';
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
import { authRoutes } from './modules/auth/auth.routes.ts';
import { customerRoutes } from './modules/customers/customers.routes.ts';
import { plantRoutes } from './modules/plants/plants.routes.ts';
import { userRoutes } from './modules/users/users.routes.ts';
import { authPlugin } from './plugins/auth.ts';

// Construit l'application sans la démarrer : les tests pourront l'utiliser sans ouvrir de port.
export async function buildApp() {
  const app = Fastify({ logger: { level: config.logLevel } }).withTypeProvider<ZodTypeProvider>();

  // Zod valide les entrées (body, query, params) et filtre les sorties (response)
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  // app.httpErrors.notFound(), badRequest()… : des erreurs HTTP prêtes à l'emploi
  await app.register(sensible);
  // Limitation de débit : active seulement sur les routes qui la demandent (connexion)
  await app.register(rateLimit, { global: false });
  await app.register(authPlugin);

  // La documentation OpenAPI est générée à partir des schémas Zod des routes
  await app.register(swagger, {
    openapi: { info: { title: 'Bouture API', version: '1.0.0' } },
    transform: jsonSchemaTransform,
  });
  await app.register(swaggerUi, { routePrefix: '/docs' });

  // À l'arrêt de l'API, on ferme proprement les connexions à la base
  app.addHook('onClose', () => prisma.$disconnect());

  // Une fonctionnalité = un plugin, monté sous son préfixe
  await app.register(authRoutes, { prefix: '/auth' });
  await app.register(userRoutes, { prefix: '/users' });
  await app.register(plantRoutes, { prefix: '/plants' });
  await app.register(customerRoutes, { prefix: '/customers' });

  return app;
}
