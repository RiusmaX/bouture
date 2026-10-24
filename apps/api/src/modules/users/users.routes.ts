import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { userSchema } from '@bouture/shared';
import { prisma } from '../../db.ts';

// Réservé aux administrateurs : le hook vaut pour toutes les routes de ce plugin
export const userRoutes: FastifyPluginAsyncZod = async (app) => {
  app.addHook('onRequest', app.requireRole('admin'));

  app.get(
    '/',
    {
      schema: {
        tags: ['users'],
        summary: 'Liste les utilisateurs',
        response: { 200: z.array(userSchema) },
      },
    },
    // Le schéma de réponse ne garde que id, email, name et role : passwordHash ne sort jamais
    () => prisma.user.findMany({ orderBy: { name: 'asc' } }),
  );
};
