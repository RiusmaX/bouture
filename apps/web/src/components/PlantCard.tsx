import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { categoryLabels } from '@/categories';
import { formatPrice } from '@/format';
import type { Plant } from '@/types';

interface PlantCardProps {
  plant: Plant;
}

export function PlantCard({ plant }: PlantCardProps) {
  const outOfStock = plant.stock === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{plant.name}</CardTitle>
        <CardDescription className="italic">{plant.latinName}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-sm">
          <span className="text-lg font-semibold">{formatPrice(plant.priceCents)}</span> · pot{' '}
          {plant.potSize}
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{categoryLabels[plant.category]}</Badge>
          {outOfStock ? (
            <Badge className="bg-warning-soft text-warning">Rupture</Badge>
          ) : (
            <Badge variant="outline">{plant.stock} en stock</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
