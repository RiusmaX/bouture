import { Link } from 'react-router';
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
    <Card className="relative">
      <CardHeader>
        <CardTitle>
          {/* Le lien couvre la carte entière grâce à after:absolute (carte en relative) */}
          <Link to={`/plants/${plant.id}`} className="after:absolute after:inset-0 hover:underline">
            {plant.name}
          </Link>
        </CardTitle>
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
