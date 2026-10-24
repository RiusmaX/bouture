import { useDocumentTitle } from '@/hooks/useDocumentTitle';

// Page provisoire, pour les écrans construits plus tard
export function PlaceholderPage({ title, when }: { title: string; when: string }) {
  useDocumentTitle(title);
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-semibold text-primary">{title}</h1>
      <p className="text-muted-foreground">Cet écran arrive {when}.</p>
    </div>
  );
}
