import { usePlantStats } from '@/api/plants';
import { formatPrice } from '@/format';

// Trois chiffres en tête du catalogue. Pendant le chargement, rien : la liste suffit.
export function StockSummary() {
  const { data } = usePlantStats();
  if (!data) return null;

  const items = [
    { label: 'Végétaux au catalogue', value: String(data.count) },
    { label: 'En rupture', value: String(data.outOfStock) },
    { label: 'Valeur du stock', value: formatPrice(data.stockValueCents) },
  ];

  return (
    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {items.map(({ label, value }) => (
        <div key={label} className="rounded-lg border bg-card p-4">
          <dt className="text-sm text-muted-foreground">{label}</dt>
          <dd className="text-2xl font-semibold tabular-nums">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
