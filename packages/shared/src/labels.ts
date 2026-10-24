import type { Role } from './auth.ts';
import type { Category } from './plants.ts';
import type { CustomerType } from './customers.ts';
import type { OrderStatus } from './orders.ts';

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

export const roleLabels: Record<Role, string> = {
  admin: 'Administrateur',
  seller: 'Vendeur',
};

export const orderStatusLabels: Record<OrderStatus, string> = {
  confirmed: 'Confirmée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
};
