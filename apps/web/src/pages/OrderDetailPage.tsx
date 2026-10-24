import { ArrowLeftIcon } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { useOrder, useUpdateOrderStatus } from '@/api/orders';
import { OrderStatusBadge } from '@/components/OrderStatusBadge';
import { ErrorMessage, Loading } from '@/components/QueryState';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate, formatPrice } from '@/format';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export function OrderDetailPage() {
  const id = Number(useParams().id);
  const { data: order, isPending, error } = useOrder(id);
  const updateStatus = useUpdateOrderStatus(id);
  useDocumentTitle(`Commande ${id}`);

  if (isPending) return <Loading />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="flex flex-col gap-4">
      <Link to="/orders" className="flex items-center gap-1 text-sm text-primary hover:underline">
        <ArrowLeftIcon aria-hidden className="size-4" /> Retour aux commandes
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="flex items-center gap-3 text-3xl font-semibold text-primary">
          Commande {order.id} <OrderStatusBadge status={order.status} />
        </h1>
        {/* Les actions possibles dépendent du statut */}
        {order.status === 'confirmed' && (
          <div className="flex gap-2">
            <Button onClick={() => updateStatus.mutate('delivered')}>Marquer livrée</Button>
            <Button variant="outline" onClick={() => updateStatus.mutate('cancelled')}>
              Annuler
            </Button>
          </div>
        )}
      </div>
      {updateStatus.error && <ErrorMessage error={updateStatus.error} />}
      <p className="text-muted-foreground">
        {order.customerName} · {formatDate(order.createdAt)}
      </p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Végétal</TableHead>
            <TableHead className="text-right">Quantité</TableHead>
            <TableHead className="text-right">Prix unitaire</TableHead>
            <TableHead className="text-right">Montant</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {order.items.map((item) => (
            <TableRow key={item.plantId}>
              <TableCell>
                <Link to={`/plants/${item.plantId}`} className="text-primary hover:underline">
                  {item.plantName}
                </Link>
              </TableCell>
              <TableCell className="text-right tabular-nums">{item.quantity}</TableCell>
              <TableCell className="text-right tabular-nums">
                {formatPrice(item.unitPriceCents)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatPrice(item.unitPriceCents * item.quantity)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right tabular-nums">
              {formatPrice(order.totalCents)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
