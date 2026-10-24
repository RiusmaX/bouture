// Tests du TD 2 : npm run td2
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  plants, byCategory, createPlant, updatePlant, groupBy, categoryLabel,
} from './catalog.ts';

test('6. byCategory', () => {
  assert.equal(byCategory(plants, 'hedge').length, 4);
});

test('7. createPlant ajoute un id', () => {
  const result = createPlant(plants, {
    name: 'Sauge officinale', latinName: 'Salvia officinalis', category: 'aromatic',
    potSize: 'C1', priceCents: 450, stock: 20,
  });
  assert.ok(result.ok);
  if (result.ok) assert.equal(result.value.id, 31);
});

test('7. createPlant refuse un prix négatif', () => {
  const result = createPlant(plants, {
    name: 'Erreur', latinName: '', category: 'tree', potSize: 'C1', priceCents: -1, stock: 0,
  });
  assert.equal(result.ok, false);
});

test('8. updatePlant', () => {
  const result = updatePlant(plants, 10, { stock: 0 });
  assert.ok(result.ok);
  if (result.ok) {
    assert.equal(result.value.stock, 0);
    assert.equal(result.value.name, 'Lavande vraie');
  }
  assert.equal(plants[9].stock, 120, 'la liste d\'origine ne doit pas changer');
  assert.equal(updatePlant(plants, 999, {}).ok, false);
});

test('9. groupBy', () => {
  const groups = groupBy(plants, (p) => p.category);
  assert.equal(groups.fruit.length, 4);
});

test('10. categoryLabel', () => {
  assert.equal(categoryLabel('climber'), 'Grimpante');
});
