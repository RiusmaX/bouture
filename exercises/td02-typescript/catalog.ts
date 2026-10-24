// TD 2 · Typer le catalogue de végétaux
// Deux commandes, dans le dossier exercises :
//   npm run typecheck   → TypeScript vérifie les types (aucune erreur attendue à la fin)
//   npm run td2         → Node exécute les tests (il efface les types, sans les vérifier)

import plantsJson from '../data/plants.json' with { type: 'json' };

// 1. Les catégories possibles, en type union de chaînes (pas d'enum : Node ne sait pas l'effacer)
//    tree, shrub, perennial, climber, hedge, fruit, aromatic
export type Category = string; // À remplacer

// 2. Un végétal du catalogue : id, name, latinName, category, potSize, priceCents, stock
export interface Plant {
  id: number;
  // À compléter
}

// 3. Ce qu'on envoie pour créer un végétal : tout sauf l'id (type utilitaire Omit)
export type PlantDraft = unknown; // À remplacer

// 4. Ce qu'on envoie pour modifier un végétal : tous les champs du brouillon, facultatifs (Partial)
export type PlantPatch = unknown; // À remplacer

// 5. Le résultat d'une opération qui peut échouer, générique :
//    { ok: true, value: T } ou { ok: false, error: string } (union discriminée par ok)
export type Result<T> = unknown; // À remplacer

// Le JSON n'a pas de type précis : on l'affirme une seule fois, ici
export const plants = plantsJson as Plant[];

// 6. Type les paramètres et le retour, puis complète
export function byCategory(list, category) {
  throw new Error('À compléter');
}

// 7. Crée un végétal à partir d'un brouillon : l'id est le plus grand id + 1.
//    Refuse un prix négatif ou un nom vide avec un Result en erreur.
export function createPlant(list: Plant[], draft: PlantDraft): Result<Plant> {
  throw new Error('À compléter');
}

// 8. Applique une modification partielle. Erreur si l'id n'existe pas.
export function updatePlant(list: Plant[], id: number, patch: PlantPatch): Result<Plant> {
  throw new Error('À compléter');
}

// 9. Générique : regroupe n'importe quelle liste selon une clé calculée
//    groupBy(plants, (p) => p.category) → { tree: [...], shrub: [...] }
export function groupBy<T, K extends string>(list: T[], key: (item: T) => K): Record<K, T[]> {
  throw new Error('À compléter');
}

// 10. Le libellé français d'une catégorie. Le switch doit couvrir tous les cas :
//     si on ajoute une catégorie au type, TypeScript doit signaler ce switch.
export function categoryLabel(category: Category): string {
  throw new Error('À compléter');
}
