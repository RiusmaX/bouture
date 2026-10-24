import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Order, OrderInput, OrderListQuery, OrderStatus, Page } from '@bouture/shared';
import { apiFetch, withQuery } from '@/lib/api';
import { plantKeys } from './plants';

export const orderKeys = {
  all: ['orders'] as const,
  list: (query: Partial<OrderListQuery>) => [...orderKeys.all, 'list', query] as const,
  detail: (id: number) => [...orderKeys.all, 'detail', id] as const,
};

export function useOrders(query: Partial<OrderListQuery>) {
  return useQuery({
    queryKey: orderKeys.list(query),
    queryFn: () => apiFetch<Page<Order>>(withQuery('/orders', query)),
    placeholderData: keepPreviousData,
  });
}

export function useOrder(id: number) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => apiFetch<Order>(`/orders/${id}`),
  });
}

// Une commande change aussi le stock : on invalide les commandes ET les végétaux
export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: OrderInput) =>
      apiFetch<Order>('/orders', { method: 'POST', body: JSON.stringify(input) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: plantKeys.all });
      return queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}

export function useUpdateOrderStatus(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: OrderStatus) =>
      apiFetch<Order>(`/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: plantKeys.all });
      return queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}
