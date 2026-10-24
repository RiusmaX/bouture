import { ArrowLeftIcon, PencilIcon } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router';
import { categoryLabels } from '@bouture/shared';
import { useDeletePlant, usePlant } from '@/api/plants';
import { ConfirmDelete } from '@/components/ConfirmDelete';
import { ErrorMessage, Loading } from '@/components/QueryState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/format';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export function PlantDetailPage() {
  // Le paramètre :id de l'adresse /plants/:id, toujours une chaîne
  const id = Number(useParams().id);
  const navigate = useNavigate();
  const { data: plant, isPending, error } = usePlant(id);
  const deletePlant = useDeletePlant();
  useDocumentTitle(plant?.name ?? 'Végétal');

  if (isPending) return <Loading />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="flex flex-col gap-4">
      <Link to="/plants" className="flex items-center gap-1 text-sm text-primary hover:underline">
        <ArrowLeftIcon aria-hidden className="size-4" /> Retour au catalogue
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold text-primary">{plant.name}</h1>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to={`/plants/${id}/edit`}>
              <PencilIcon aria-hidden /> Modifier
            </Link>
          </Button>
          <ConfirmDelete
            title={`Supprimer ${plant.name} ?`}
            description="Le végétal disparaît du catalogue. Cette action est définitive."
            onConfirm={() =>
              deletePlant.mutate(id, { onSuccess: () => navigate('/plants', { replace: true }) })
            }
          />
        </div>
      </div>
      {deletePlant.error && <ErrorMessage error={deletePlant.error} />}
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
