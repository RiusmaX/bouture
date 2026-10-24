import type { Category } from './types.ts';

// Libellés français des catégories : Record oblige à n'en oublier aucune
export const categoryLabels: Record<Category, string> = {
  tree: 'Arbre',
  shrub: 'Arbuste',
  perennial: 'Vivace',
  climber: 'Grimpante',
  hedge: 'Haie',
  fruit: 'Fruitier',
  aromatic: 'Aromatique',
};

export const categories = Object.keys(categoryLabels) as Category[];
