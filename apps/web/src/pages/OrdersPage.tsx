import { useState } from 'react';
import { Link } from 'react-router';
import { PlusIcon } from 'lucide-react';
import { orderStatuses, orderStatusLabels, type OrderStatus } from '@bouture/shared';
import { useOrders } from '@/api/orders';
import { OrderStatusBadge } from '@/components/OrderStatusBadge';
import { Pagination } from '@/components/Pagination';
import { ErrorMessage, Loading } from '@/components/QueryState';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate, formatPrice } from '@/format';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const ALL = 'all';

export function OrdersPage() {
  useDocumentTitle('Commandes');
  const [status, setStatus] = useState<OrderStatus | ''>('');
  const [page, setPage] = useState(1);
  const { data, isPending, error } = useOrders({ status: status || undefined, page });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-primary">Commandes</h1>
        <Button asChild>
          <Link to="/orders/new">
            <PlusIcon aria-hidden /> Nouvelle commande
          </Link>
        </Button>
      </div>
      <Select
        value={status || ALL}
        onValueChange={(value) => {
          setStatus(value === ALL ? '' : (value as OrderStatus));
          setPage(1);
        }}
      >
        <SelectTrigger aria-label="Statut" className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Tous les statuts</SelectItem>
          {orderStatuses.map((value) => (
            <SelectItem key={value} value={value}>
              {orderStatusLabels[value]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isPending ? (
        <Loading />
      ) : error ? (
        <ErrorMessage error={error} />
      ) : (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N°</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Link
                      to={`/orders/${order.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {order.id}
                    </Link>
                  </TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatPrice(order.totalCents)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination
            page={data.page}
            pageSize={data.pageSize}
            total={data.total}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
