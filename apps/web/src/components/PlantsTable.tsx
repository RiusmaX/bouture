import { Link } from 'react-router';
import { categoryLabels, type Plant, type PlantSort, type SortOrder } from '@bouture/shared';
import { SortableHead } from '@/components/SortableHead';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatPrice } from '@/format';

interface PlantsTableProps {
  plants: Plant[];
  sort: PlantSort;
  order: SortOrder;
  onSort: (column: PlantSort) => void;
}

export function PlantsTable({ plants, sort, order, onSort }: PlantsTableProps) {
  const sortProps = { sort, order, onSort };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <SortableHead column="name" label="Nom" {...sortProps} />
          <TableHead>Catégorie</TableHead>
          <TableHead>Pot</TableHead>
          <SortableHead column="priceCents" label="Prix" className="text-right" {...sortProps} />
          <SortableHead column="stock" label="Stock" className="text-right" {...sortProps} />
        </TableRow>
      </TableHeader>
      <TableBody>
        {plants.map((plant) => (
          <TableRow key={plant.id}>
            <TableCell>
              <Link to={`/plants/${plant.id}`} className="font-medium text-primary hover:underline">
                {plant.name}
              </Link>
              <p className="text-xs text-muted-foreground italic">{plant.latinName}</p>
            </TableCell>
            <TableCell>
              <Badge variant="secondary">{categoryLabels[plant.category]}</Badge>
            </TableCell>
            <TableCell>{plant.potSize}</TableCell>
            <TableCell className="text-right tabular-nums">
              {formatPrice(plant.priceCents)}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {plant.stock === 0 ? (
                <Badge className="bg-warning-soft text-warning">Rupture</Badge>
              ) : (
                plant.stock
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
