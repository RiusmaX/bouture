import { formatPrice } from '../format.ts';
import type { Plant } from '../types.ts';

// Les props sont typées : le composant refuse un végétal incomplet
interface PlantCardProps {
  plant: Plant;
}

export function PlantCard({ plant }: PlantCardProps) {
  const outOfStock = plant.stock === 0;

  return (
    <article className="plant-card">
      <h2>{plant.name}</h2>
      <p className="latin">{plant.latinName}</p>
      <p>
        {formatPrice(plant.priceCents)} · pot {plant.potSize}
      </p>
      {/* Rendu conditionnel : l'un ou l'autre selon le stock */}
      {outOfStock ? (
        <p className="badge badge-out">Rupture</p>
      ) : (
        <p className="badge">{plant.stock} en stock</p>
      )}
    </article>
  );
}
