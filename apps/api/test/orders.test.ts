import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.ts';
import { login } from './helpers.ts';

const app = await buildApp();
let headers: { cookie: string };

beforeAll(async () => {
  await app.ready();
  headers = await login(app);
});
afterAll(() => app.close());

// Le stock d'un végétal, relu par l'API
async function stockOf(plantId: number) {
  const response = await app.inject({ headers, method: 'GET', url: `/plants/${plantId}` });
  return response.json().stock as number;
}

describe('POST /orders', () => {
  it('crée la commande, calcule le total et décrémente le stock', async () => {
    const before = await stockOf(5);
    const response = await app.inject({
      headers,
      method: 'POST',
      url: '/orders',
      payload: { customerId: 3, items: [{ plantId: 5, quantity: 2 }] },
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toMatchObject({ status: 'confirmed', totalCents: 2 * 1990 });
    expect(await stockOf(5)).toBe(before - 2);
  });

  it('refuse une quantité supérieure au stock, sans rien modifier', async () => {
    const before = await stockOf(1);
    const response = await app.inject({
      headers,
      method: 'POST',
      url: '/orders',
      payload: {
        customerId: 3,
        items: [
          { plantId: 1, quantity: 1 },
          { plantId: 7, quantity: 1 },
        ],
      },
    });

    expect(response.statusCode).toBe(409);
    // La transaction a été annulée : la première ligne n'a pas décrémenté le stock
    expect(await stockOf(1)).toBe(before);
  });

  it('refuse une commande vide', async () => {
    const response = await app.inject({
      headers,
      method: 'POST',
      url: '/orders',
      payload: { customerId: 3, items: [] },
    });

    expect(response.statusCode).toBe(400);
  });
});

describe('PATCH /orders/:id/status', () => {
  it("remet en stock à l'annulation", async () => {
    const created = await app.inject({
      headers,
      method: 'POST',
      url: '/orders',
      payload: { customerId: 3, items: [{ plantId: 6, quantity: 4 }] },
    });
    const before = await stockOf(6);

    const response = await app.inject({
      headers,
      method: 'PATCH',
      url: `/orders/${created.json().id}/status`,
      payload: { status: 'cancelled' },
    });

    expect(response.json().status).toBe('cancelled');
    expect(await stockOf(6)).toBe(before + 4);
  });
});

describe('DELETE /customers/:id', () => {
  it('refuse de supprimer un client qui a des commandes', async () => {
    const response = await app.inject({ headers, method: 'DELETE', url: '/customers/1' });

    expect(response.statusCode).toBe(409);
  });
});
