import { ArrowLeftIcon } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { Badge } from '@/components/ui/badge';
import { categoryLabels } from '@bouture/shared';
import { usePlant } from '@/api/plants';
import { ErrorMessage, Loading } from '@/components/QueryState';
import { formatPrice } from '@/format';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export function PlantDetailPage() {
  // Le paramètre :id de l'adresse /plants/:id, toujours une chaîne
  const { id } = useParams();
  const { data: plant, isPending, error } = usePlant(Number(id));
  useDocumentTitle(plant?.name ?? 'Végétal');

  if (isPending) return <Loading />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="flex flex-col gap-4">
      <Link to="/plants" className="flex items-center gap-1 text-sm text-primary hover:underline">
        <ArrowLeftIcon aria-hidden className="size-4" /> Retour au catalogue
      </Link>
      <h1 className="text-3xl font-semibold text-primary">{plant.name}</h1>
      <p className="text-muted-foreground italic">{plant.latinName}</p>
      <dl className="grid max-w-md grid-cols-2 gap-2 text-sm">
        <dt className="text-muted-foreground">Catégorie</dt>
        <dd>
          <Badge variant="secondary">{categoryLabels[plant.category]}</Badge>
        </dd>
        <dt className="text-muted-foreground">Pot</dt>
        <dd>{plant.potSize}</dd>
        <dt className="text-muted-foreground">Prix</dt>
        <dd>{formatPrice(plant.priceCents)}</dd>
        <dt className="text-muted-foreground">Stock</dt>
        <dd>{plant.stock}</dd>
      </dl>
    </div>
  );
}
