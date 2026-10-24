import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.ts';
import { ADMIN, login } from './helpers.ts';

const app = await buildApp();

beforeAll(() => app.ready());
afterAll(() => app.close());

describe('POST /auth/login', () => {
  it("pose un cookie httpOnly et renvoie l'utilisateur sans son mot de passe", async () => {
    const response = await app.inject({ method: 'POST', url: '/auth/login', payload: ADMIN });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      id: expect.any(Number),
      email: ADMIN.email,
      name: 'Alice Martin',
      role: 'admin',
    });
    const cookie = response.cookies.find((c) => c.name === 'token');
    expect(cookie?.httpOnly).toBe(true);
  });

  it('refuse un mauvais mot de passe', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: { email: ADMIN.email, password: 'faux' },
    });

    expect(response.statusCode).toBe(401);
  });
});

describe('GET /auth/me', () => {
  it("renvoie l'utilisateur connecté", async () => {
    const headers = await login(app);
    const response = await app.inject({ headers, method: 'GET', url: '/auth/me' });

    expect(response.json().email).toBe(ADMIN.email);
  });
});
