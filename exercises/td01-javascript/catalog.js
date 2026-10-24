// TD 1 · Manipuler le catalogue de végétaux en JavaScript (corrigé)

import { readFile } from 'node:fs/promises';

// Un seul formateur, créé une fois et réutilisé : c'est plus rapide que d'en créer un par appel
const euros = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });

// 1. Les prix sont stockés en centimes (des entiers) pour éviter les erreurs d'arrondi des décimaux
export function formatPrice(priceCents) {
  return euros.format(priceCents / 100);
}

// 2. map transforme chaque élément et renvoie un nouveau tableau de même longueur
export function names(plants) {
  return plants.map((plant) => plant.name);
}

// 3. filter garde les éléments pour lesquels la fonction renvoie true
export function inStock(plants) {
  return plants.filter((plant) => plant.stock > 0);
}

// 4. find renvoie le premier élément trouvé, ou undefined
export function findById(plants, id) {
  return plants.find((plant) => plant.id === id);
}

// 5. reduce fait tenir tout le tableau dans une seule valeur, ici une somme qui part de 0
export function stockValue(plants) {
  return plants.reduce((total, plant) => total + plant.priceCents * plant.stock, 0);
}

// 6. reduce peut aussi construire un objet : la clé est la catégorie, la valeur un compteur
export function countByCategory(plants) {
  return plants.reduce((counts, plant) => {
    counts[plant.category] = (counts[plant.category] ?? 0) + 1;
    return counts;
  }, {});
}

// 7. toSorted (ES2023) renvoie une copie triée ; sort, lui, modifierait le tableau reçu
export function sortByPrice(plants) {
  return plants.toSorted((a, b) => a.priceCents - b.priceCents);
}

// 8. La déstructuration sort les champs utiles dès les paramètres
export function describe({ name, latinName, potSize }) {
  return `${name} (${latinName}), pot ${potSize}`;
}

// 9. { ...plant } copie l'objet : on ajoute un champ sans toucher à l'original
export function withPriceLabel(plants) {
  return plants.map((plant) => ({ ...plant, priceLabel: formatPrice(plant.priceCents) }));
}

// 10. readFile renvoie une promesse : await attend le contenu sans bloquer Node
export async function loadCatalog(path) {
  const text = await readFile(path, 'utf8');
  return JSON.parse(text);
}
