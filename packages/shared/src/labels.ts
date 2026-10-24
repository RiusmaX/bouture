import type { Category } from './plants.ts';
import type { CustomerType } from './customers.ts';

// Libellés français : Record oblige à n'oublier aucune valeur
export const categoryLabels: Record<Category, string> = {
  tree: 'Arbre',
  shrub: 'Arbuste',
  perennial: 'Vivace',
  climber: 'Grimpante',
  hedge: 'Haie',
  fruit: 'Fruitier',
  aromatic: 'Aromatique',
};

export const customerTypeLabels: Record<CustomerType, string> = {
  professional: 'Professionnel',
  private: 'Particulier',
};
