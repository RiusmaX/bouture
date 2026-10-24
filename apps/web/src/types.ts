// Types de l'interface. Ils recopient ceux de l'API pour l'instant :
// au TD 12, ils viendront d'un paquet partagé, écrit une seule fois.
export type Category = 'tree' | 'shrub' | 'perennial' | 'climber' | 'hedge' | 'fruit' | 'aromatic';

export interface Plant {
  id: number;
  name: string;
  latinName: string;
  category: Category;
  potSize: string;
  priceCents: number;
  stock: number;
}
