import type { Plant } from '../types.ts';
import { PlantCard } from './PlantCard.tsx';

export function PlantGrid({ plants }: { plants: Plant[] }) {
  if (plants.length === 0) {
    return <p>Aucun végétal ne correspond à la recherche.</p>;
  }

  return (
    <div className="plant-grid">
      {/* key permet à React de suivre chaque carte d'un rendu à l'autre */}
      {plants.map((plant) => (
        <PlantCard key={plant.id} plant={plant} />
      ))}
    </div>
  );
}
