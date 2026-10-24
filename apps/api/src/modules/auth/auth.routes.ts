import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { loginInputSchema, userSchema } from '@bouture/shared';
import { prisma } from '../../db.ts';
import { config } from '../../config.ts';
import { TOKEN_COOKIE } from '../../plugins/auth.ts';
import { verifyPassword } from './password.ts';

const cookieOptions = {
  path: '/',
  httpOnly: true,
  // strict : le navigateur n'envoie pas le cookie depuis un autre site (protection CSRF)
  sameSite: 'strict' as const,
  // secure : cookie envoyé seulement en HTTPS (activé en production)
  secure: config.cookieSecure,
  maxAge: 8 * 60 * 60,
};

export const authRoutes: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/login',
    {
      // Au plus 5 essais par minute et par adresse IP : on freine les attaques par force brute
      config: { rateLimit: { max: 5, timeWindow: '1 minute' } },
      schema: {
        tags: ['auth'],
        summary: 'Se connecter',
        body: loginInputSchema,
        response: { 200: userSchema },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;
      const user = await prisma.user.findUnique({ where: { email } });
      // Même message que l'adresse soit inconnue ou le mot de passe faux : on ne renseigne pas un attaquant
      if (!user || !(await verifyPassword(password, user.passwordHash))) {
        throw app.httpErrors.unauthorized('Adresse e-mail ou mot de passe incorrect');
      }
      const token = await reply.jwtSign({ id: user.id, role: user.role });
      reply.setCookie(TOKEN_COOKIE, token, cookieOptions);
      return user;
    },
  );

  app.post(
    '/logout',
    { schema: { tags: ['auth'], summary: 'Se déconnecter', response: { 204: z.null() } } },
    async (_request, reply) => reply.clearCookie(TOKEN_COOKIE, cookieOptions).code(204).send(null),
  );

  app.get(
    '/me',
    {
      onRequest: [app.authenticate],
      schema: { tags: ['auth'], summary: 'Utilisateur connecté', response: { 200: userSchema } },
    },
    async (request) => {
      const user = await prisma.user.findUnique({ where: { id: request.user.id } });
      if (!user) throw app.httpErrors.unauthorized('Connexion requise');
      return user;
    },
  );
};
