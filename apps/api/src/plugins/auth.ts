import fp from 'fastify-plugin';
import cookie from '@fastify/cookie';
import jwt from '@fastify/jwt';
import type { FastifyRequest } from 'fastify';
import type { Role, User } from '@bouture/shared';
import { config } from '../config.ts';

export const TOKEN_COOKIE = 'token';

// Ce que contient le jeton, et ce que request.user renvoie ensuite
declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: Pick<User, 'id' | 'role'>;
    user: Pick<User, 'id' | 'role'>;
  }
}

// Les deux gardes ajoutées à l'application, utilisables dans toutes les routes
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest) => Promise<void>;
    requireRole: (role: Role) => (request: FastifyRequest) => Promise<void>;
  }
}

// fastify-plugin rend les décorations visibles par toute l'application, pas seulement par ce plugin
export const authPlugin = fp(async (app) => {
  await app.register(cookie);
  // Le jeton voyage dans un cookie httpOnly : le JavaScript de la page ne peut pas le lire
  await app.register(jwt, {
    secret: config.jwtSecret,
    cookie: { cookieName: TOKEN_COOKIE, signed: false },
    sign: { expiresIn: '8h' },
  });

  app.decorate('authenticate', async (request: FastifyRequest) => {
    try {
      await request.jwtVerify();
    } catch {
      throw app.httpErrors.unauthorized('Connexion requise');
    }
  });

  app.decorate('requireRole', (role: Role) => async (request: FastifyRequest) => {
    await app.authenticate(request);
    // 401 : on ne sait pas qui vous êtes. 403 : on sait, mais ce n'est pas permis.
    if (request.user.role !== role) throw app.httpErrors.forbidden('Action réservée');
  });
});
