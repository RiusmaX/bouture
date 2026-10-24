// Décodeur du TD 2 : ce code a été généré par une IA à qui l'on a demandé
// « une fonction qui calcule le total d'une commande ». Lis-le sans l'exécuter
// et explique chaque ligne à ton voisin. Repère ce qui te paraît fragile.

import type { Plant } from './catalog.ts';

type OrderLine = Pick<Plant, 'id' | 'priceCents'> & { quantity: number };

type Discount =
  | { kind: 'none' }
  | { kind: 'percent'; rate: number }
  | { kind: 'amount'; cents: number };

export function orderTotal(lines: readonly OrderLine[], discount: Discount = { kind: 'none' }): number {
  const subtotal = lines.reduce((sum, { priceCents, quantity }) => sum + priceCents * quantity, 0);

  switch (discount.kind) {
    case 'none':
      return subtotal;
    case 'percent':
      return Math.round(subtotal * (1 - discount.rate / 100));
    case 'amount':
      return Math.max(0, subtotal - discount.cents);
  }
}
