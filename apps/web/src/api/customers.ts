import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  Customer,
  CustomerInput,
  CustomerListQuery,
  CustomerPatch,
  Page,
} from '@bouture/shared';
import { apiFetch, withQuery } from '@/lib/api';

export const customerKeys = {
  all: ['customers'] as const,
  lists: () => [...customerKeys.all, 'list'] as const,
  list: (query: Partial<CustomerListQuery>) => [...customerKeys.lists(), query] as const,
  detail: (id: number) => [...customerKeys.all, 'detail', id] as const,
};

export function useCustomers(query: Partial<CustomerListQuery>) {
  return useQuery({
    queryKey: customerKeys.list(query),
    queryFn: () => apiFetch<Page<Customer>>(withQuery('/customers', query)),
    placeholderData: keepPreviousData,
  });
}

export function useCustomer(id: number) {
  return useQuery({
    queryKey: customerKeys.detail(id),
    queryFn: () => apiFetch<Customer>(`/customers/${id}`),
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CustomerInput) =>
      apiFetch<Customer>('/customers', { method: 'POST', body: JSON.stringify(input) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: customerKeys.all }),
  });
}

export function useUpdateCustomer(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (patch: CustomerPatch) =>
      apiFetch<Customer>(`/customers/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: customerKeys.all }),
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiFetch<void>(`/customers/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: customerKeys.lists() }),
  });
}
