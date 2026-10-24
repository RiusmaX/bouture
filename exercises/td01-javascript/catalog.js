// TD 1 · Manipuler le catalogue de végétaux en JavaScript
// Complète chaque fonction, puis lance `npm run td1` dans le dossier exercises.
// Les tests (catalog.test.js) te disent ce qui est attendu.

import { readFile } from 'node:fs/promises';

// 1. Formate un prix en centimes : 4590 → « 45,90 € »
//    Indice : Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })
export function formatPrice(priceCents) {
  throw new Error('À compléter');
}

// 2. Les noms des végétaux, dans le même ordre (map)
export function names(plants) {
  throw new Error('À compléter');
}

// 3. Les végétaux disponibles, ceux dont le stock est supérieur à 0 (filter)
export function inStock(plants) {
  throw new Error('À compléter');
}

// 4. Le végétal qui porte cet identifiant, ou undefined (find)
export function findById(plants, id) {
  throw new Error('À compléter');
}

// 5. La valeur du stock en centimes : somme de prix × stock (reduce)
export function stockValue(plants) {
  throw new Error('À compléter');
}

// 6. Le nombre de végétaux par catégorie : { tree: 4, shrub: 5, … } (reduce)
export function countByCategory(plants) {
  throw new Error('À compléter');
}

// 7. Une copie triée du prix le plus bas au plus haut, sans modifier le tableau reçu
export function sortByPrice(plants) {
  throw new Error('À compléter');
}

// 8. Une phrase de présentation avec la déstructuration et un gabarit de chaîne :
//    « Lavande vraie (Lavandula angustifolia), pot C2 »
export function describe(plant) {
  throw new Error('À compléter');
}

// 9. Une copie de chaque végétal avec un champ priceLabel en plus (décomposition ...)
export function withPriceLabel(plants) {
  throw new Error('À compléter');
}

// 10. Lit le fichier JSON du catalogue et renvoie le tableau (async / await)
export async function loadCatalog(path) {
  throw new Error('À compléter');
}
