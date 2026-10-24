import type { Plant, PlantInput, PlantListQuery, PlantPatch } from './plants.schemas.ts';
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

export function createPlant(input: PlantInput) {
  const id = Math.max(0, ...plants.map((plant) => plant.id)) + 1;
  const plant = { id, ...input };
  plants.push(plant);
  return plant;
}

// Renvoie undefined si le végétal n'existe pas : la route décide de la réponse HTTP
export function updatePlant(id: number, patch: PlantPatch) {
  const plant = findPlant(id);
  if (!plant) return undefined;
  Object.assign(plant, patch);
  return plant;
}

export function deletePlant(id: number) {
  const index = plants.findIndex((plant) => plant.id === id);
  if (index === -1) return false;
  plants.splice(index, 1);
  return true;
}
