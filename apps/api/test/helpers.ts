import type { FastifyInstance } from 'fastify';

export const ADMIN = { email: 'admin@bouture.example', password: 'bouture-admin' };
export const SELLER = { email: 'vente@bouture.example', password: 'bouture-vente' };

// Se connecte et renvoie l'en-tête cookie à joindre aux requêtes suivantes
export async function login(app: FastifyInstance, account = ADMIN) {
  const response = await app.inject({ method: 'POST', url: '/auth/login', payload: account });
  const token = response.cookies.find((cookie) => cookie.name === 'token');
  if (!token) throw new Error(`Connexion impossible : ${response.body}`);
  return { cookie: `token=${token.value}` };
}
