// TD 2 · Typer le catalogue de végétaux (corrigé)

import plantsJson from '../data/plants.json' with { type: 'json' };

// 1. Une union de chaînes : l'éditeur propose les valeurs, et une faute de frappe est refusée
export type Category = 'tree' | 'shrub' | 'perennial' | 'climber' | 'hedge' | 'fruit' | 'aromatic';

// 2. L'interface décrit la forme d'un objet ; elle disparaît à l'exécution
export interface Plant {
  id: number;
  name: string;
  latinName: string;
  category: Category;
  potSize: string;
  priceCents: number;
  stock: number;
}

// 3. Omit retire des champs d'un type existant : pas de copie à maintenir
export type PlantDraft = Omit<Plant, 'id'>;

// 4. Partial rend tous les champs facultatifs
export type PlantPatch = Partial<PlantDraft>;

// 5. Union discriminée : en testant ok, TypeScript sait si value ou error existe
export type Result<T> = { ok: true; value: T } | { ok: false; error: string };

export const plants = plantsJson as Plant[];

// 6. Paramètres et retour typés : l'appelant ne peut plus passer une catégorie inventée
export function byCategory(list: Plant[], category: Category): Plant[] {
  return list.filter((plant) => plant.category === category);
}

// 7. Les règles métier renvoient une erreur plutôt que de lever une exception
export function createPlant(list: Plant[], draft: PlantDraft): Result<Plant> {
  if (draft.name.trim() === '') return { ok: false, error: 'Le nom est obligatoire' };
  if (draft.priceCents < 0) return { ok: false, error: 'Le prix ne peut pas être négatif' };
  const id = Math.max(0, ...list.map((plant) => plant.id)) + 1;
  return { ok: true, value: { id, ...draft } };
}

// 8. On renvoie une copie modifiée : la liste et l'objet d'origine restent intacts
export function updatePlant(list: Plant[], id: number, patch: PlantPatch): Result<Plant> {
  const plant = list.find((p) => p.id === id);
  if (!plant) return { ok: false, error: `Aucun végétal avec l'id ${id}` };
  return { ok: true, value: { ...plant, ...patch } };
}

// 9. Les génériques T et K sont déduits à l'appel : groupBy(plants, (p) => p.category)
export function groupBy<T, K extends string>(list: T[], key: (item: T) => K): Record<K, T[]> {
  const groups = {} as Record<K, T[]>;
  for (const item of list) {
    const k = key(item);
    (groups[k] ??= []).push(item);
  }
  return groups;
}

// 10. Le cas default affecte la valeur à never : il ne compile que si tous les cas sont traités
export function categoryLabel(category: Category): string {
  switch (category) {
    case 'tree': return 'Arbre';
    case 'shrub': return 'Arbuste';
    case 'perennial': return 'Vivace';
    case 'climber': return 'Grimpante';
    case 'hedge': return 'Haie';
    case 'fruit': return 'Fruitier';
    case 'aromatic': return 'Aromatique';
    default: {
      const unreachable: never = category;
      return unreachable;
    }
  }
}
