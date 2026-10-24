// Tests du TD 1, lancés par le lanceur de tests intégré à Node : npm run td1
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  formatPrice, names, inStock, findById, stockValue, countByCategory,
  sortByPrice, describe, withPriceLabel, loadCatalog,
} from './catalog.js';

const CATALOG = new URL('../data/plants.json', import.meta.url);
const plants = await loadCatalog(CATALOG).catch(() => []);

// Intl sépare les euros par une espace insécable fine : on la normalise pour comparer
const clean = (s) => s.replace(/\s/g, ' ');

test('1. formatPrice', () => {
  assert.equal(clean(formatPrice(4590)), '45,90 €');
  assert.equal(clean(formatPrice(150)), '1,50 €');
});

test('10. loadCatalog lit les 30 végétaux', async () => {
  const list = await loadCatalog(CATALOG);
  assert.equal(list.length, 30);
  assert.equal(list[0].name, 'Érable du Japon');
});

test('2. names', () => {
  assert.equal(names(plants).length, 30);
  assert.equal(names(plants)[9], 'Lavande vraie');
});

test('3. inStock', () => {
  assert.equal(inStock(plants).length, 26);
  assert.ok(inStock(plants).every((p) => p.stock > 0));
});

test('4. findById', () => {
  assert.equal(findById(plants, 2).name, 'Olivier');
  assert.equal(findById(plants, 999), undefined);
});

test('5. stockValue', () => {
  assert.equal(stockValue(plants.slice(0, 2)), 4590 * 12 + 8900 * 6);
});

test('6. countByCategory', () => {
  assert.deepEqual(countByCategory(plants), {
    tree: 4, shrub: 5, perennial: 6, climber: 4, hedge: 4, fruit: 4, aromatic: 3,
  });
});

test('7. sortByPrice ne modifie pas le tableau reçu', () => {
  const sorted = sortByPrice(plants);
  assert.equal(sorted[0].name, 'Troène');
  assert.equal(sorted.at(-1).name, 'Olivier');
  assert.equal(plants[0].name, 'Érable du Japon');
});

test('8. describe', () => {
  assert.equal(describe(plants[9]), 'Lavande vraie (Lavandula angustifolia), pot C2');
});

test('9. withPriceLabel', () => {
  const [first] = withPriceLabel(plants);
  assert.equal(clean(first.priceLabel), '45,90 €');
  assert.equal(first.name, 'Érable du Japon');
  assert.equal(plants[0].priceLabel, undefined);
});
