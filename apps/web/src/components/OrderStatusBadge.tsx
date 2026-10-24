import { orderStatusLabels, type OrderStatus } from '@bouture/shared';
import { Badge } from '@/components/ui/badge';

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  if (status === 'cancelled') {
    return <Badge className="bg-warning-soft text-warning">{orderStatusLabels[status]}</Badge>;
  }
  return (
    <Badge variant={status === 'delivered' ? 'outline' : 'secondary'}>
      {orderStatusLabels[status]}
    </Badge>
  );
}
