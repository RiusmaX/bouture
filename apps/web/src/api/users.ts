import { useQuery } from '@tanstack/react-query';
import type { User } from '@bouture/shared';
import { apiFetch } from '@/lib/api';

export function useUsers() {
  return useQuery({ queryKey: ['users'], queryFn: () => apiFetch<User[]>('/users') });
}
