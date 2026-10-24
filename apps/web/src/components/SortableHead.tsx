import { ArrowDownIcon, ArrowUpIcon, ArrowUpDownIcon } from 'lucide-react';
import type { SortOrder } from '@bouture/shared';
import { TableHead } from '@/components/ui/table';

interface SortableHeadProps<T extends string> {
  column: T;
  label: string;
  sort: T;
  order: SortOrder;
  onSort: (column: T) => void;
  className?: string;
}

// En-tête de colonne cliquable. Générique : il fonctionne pour n'importe quelle liste de colonnes.
export function SortableHead<T extends string>(props: SortableHeadProps<T>) {
  const { column, label, sort, order, onSort, className } = props;
  const active = sort === column;
  const Icon = !active ? ArrowUpDownIcon : order === 'asc' ? ArrowUpIcon : ArrowDownIcon;

  return (
    // aria-sort annonce le tri aux lecteurs d'écran
    <TableHead
      className={className}
      aria-sort={active ? (order === 'asc' ? 'ascending' : 'descending') : undefined}
    >
      <button
        type="button"
        className="inline-flex items-center gap-1 hover:text-primary"
        onClick={() => onSort(column)}
      >
        {label}
        <Icon aria-hidden className="size-3.5" />
      </button>
    </TableHead>
  );
}
