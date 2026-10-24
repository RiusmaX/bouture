import type { Plant, PlantListQuery } from './plants.schemas.ts';
import initialPlants from '../../data/plants.json' with { type: 'json' };

// Stockage en mémoire, le temps d'arriver à PostgreSQL (TD 6) :
// les données repartent de zéro à chaque redémarrage de l'API.
const plants: Plant[] = structuredClone(initialPlants as Plant[]);

// Comparaison sans accents ni majuscules : « erable » trouve « Érable du Japon »
const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

export function listPlants({ category, search, page, pageSize }: PlantListQuery) {
  const filtered = plants.filter(
    (plant) =>
      (!category || plant.category === category) &&
      (!search ||
        normalize(plant.name).includes(normalize(search)) ||
        normalize(plant.latinName).includes(normalize(search))),
  );
  const start = (page - 1) * pageSize;
  return {
    items: filtered.slice(start, start + pageSize),
    total: filtered.length,
    page,
    pageSize,
  };
}

export function findPlant(id: number) {
  return plants.find((plant) => plant.id === id);
}
