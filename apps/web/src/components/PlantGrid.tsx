import type { Plant } from '@bouture/shared';
import { PlantCard } from './PlantCard';

export function PlantGrid({ plants }: { plants: Plant[] }) {
  if (plants.length === 0) {
    return <p className="text-muted-foreground">Aucun végétal ne correspond à la recherche.</p>;
  }

  return (
    // Grille responsive : 1 colonne sur mobile, jusqu'à 4 sur grand écran
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {plants.map((plant) => (
        <PlantCard key={plant.id} plant={plant} />
      ))}
    </div>
  );
}
