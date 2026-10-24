import { Link } from 'react-router';

export function NotFoundPage() {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-semibold text-primary">Page introuvable</h1>
      <Link to="/plants" className="text-primary hover:underline">
        Retour au catalogue
      </Link>
    </div>
  );
}
