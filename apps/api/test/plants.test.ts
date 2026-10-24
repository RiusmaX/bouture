import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.ts';
import { login, SELLER } from './helpers.ts';

// app.inject simule une requête HTTP sans ouvrir de port : rapide et sans réseau
const app = await buildApp();

// En-têtes d'un administrateur connecté, joints à chaque requête
let headers: { cookie: string };

beforeAll(async () => {
  await app.ready();
  headers = await login(app);
});
afterAll(() => app.close());

describe('GET /plants', () => {
  it('renvoie la première page du catalogue', async () => {
    const response = await app.inject({ headers, method: 'GET', url: '/plants' });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.total).toBe(30);
    expect(body.items).toHaveLength(20);
  });

  it('filtre par catégorie', async () => {
    const response = await app.inject({ headers, method: 'GET', url: '/plants?category=hedge' });

    const body = response.json();
    expect(body.total).toBe(4);
    expect(body.items.every((plant: { category: string }) => plant.category === 'hedge')).toBe(
      true,
    );
  });

  it('trie par prix décroissant', async () => {
    const response = await app.inject({
      headers,
      method: 'GET',
      url: '/plants?sort=priceCents&order=desc',
    });

    expect(response.json().items[0].name).toBe('Olivier');
  });

  it('refuse un tri sur une colonne inconnue', async () => {
    const response = await app.inject({ headers, method: 'GET', url: '/plants?sort=password' });

    expect(response.statusCode).toBe(400);
  });

  it('refuse une catégorie inconnue', async () => {
    const response = await app.inject({ headers, method: 'GET', url: '/plants?category=cactus' });

    expect(response.statusCode).toBe(400);
  });
});

describe('GET /plants/stats', () => {
  it('résume le stock du catalogue', async () => {
    const response = await app.inject({ headers, method: 'GET', url: '/plants/stats' });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({ outOfStock: 4 });
  });
});

describe('GET /plants/:id', () => {
  it('renvoie 404 si le végétal n’existe pas', async () => {
    const response = await app.inject({ headers, method: 'GET', url: '/plants/9999' });

    expect(response.statusCode).toBe(404);
    expect(response.json().message).toContain('9999');
  });
});

describe('POST /plants', () => {
  it('crée un végétal puis le retrouve', async () => {
    const created = await app.inject({
      headers,
      method: 'POST',
      url: '/plants',
      payload: {
        name: 'Sauge officinale',
        latinName: 'Salvia officinalis',
        category: 'aromatic',
        potSize: 'C1',
        priceCents: 450,
        stock: 20,
      },
    });

    expect(created.statusCode).toBe(201);
    const { id } = created.json();
    const found = await app.inject({ headers, method: 'GET', url: `/plants/${id}` });
    expect(found.json().name).toBe('Sauge officinale');
  });

  it('refuse un prix négatif', async () => {
    const response = await app.inject({
      headers,
      method: 'POST',
      url: '/plants',
      payload: {
        name: 'Erreur',
        latinName: '',
        category: 'tree',
        potSize: 'C1',
        priceCents: -1,
        stock: 0,
      },
    });

    expect(response.statusCode).toBe(400);
  });
});

describe('Accès', () => {
  it('refuse un visiteur non connecté (401)', async () => {
    const response = await app.inject({ method: 'GET', url: '/plants' });

    expect(response.statusCode).toBe(401);
  });

  it('refuse la suppression à un vendeur (403)', async () => {
    const seller = await login(app, SELLER);
    const response = await app.inject({ headers: seller, method: 'DELETE', url: '/plants/1' });

    expect(response.statusCode).toBe(403);
  });
});
