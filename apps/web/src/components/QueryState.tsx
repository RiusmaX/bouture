import { Loader2Icon } from 'lucide-react';

// Affichages communs pendant un chargement ou après une erreur
export function Loading() {
  return (
    <p role="status" className="flex items-center gap-2 text-muted-foreground">
      <Loader2Icon aria-hidden className="size-4 animate-spin" /> Chargement…
    </p>
  );
}

export function ErrorMessage({ error }: { error: Error }) {
  return (
    <p role="alert" className="text-destructive">
      Impossible de charger les données : {error.message}
    </p>
  );
}
