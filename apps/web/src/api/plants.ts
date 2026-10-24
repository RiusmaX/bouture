import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { Page, Plant, PlantListQuery } from '@bouture/shared';
import { apiFetch, withQuery } from '@/lib/api';

// Les clés de cache : un tableau qui décrit la donnée. Même clé = même donnée en cache.
export const plantKeys = {
  all: ['plants'] as const,
  list: (query: Partial<PlantListQuery>) => [...plantKeys.all, 'list', query] as const,
  detail: (id: number) => [...plantKeys.all, 'detail', id] as const,
};

export function usePlants(query: Partial<PlantListQuery>) {
  return useQuery({
    queryKey: plantKeys.list(query),
    queryFn: () => apiFetch<Page<Plant>>(withQuery('/plants', query)),
    // Pendant le chargement de la page suivante, on garde l'ancienne à l'écran
    placeholderData: keepPreviousData,
  });
}

export function usePlant(id: number) {
  return useQuery({
    queryKey: plantKeys.detail(id),
    queryFn: () => apiFetch<Plant>(`/plants/${id}`),
  });
}
