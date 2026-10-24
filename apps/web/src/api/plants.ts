import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Page, Plant, PlantInput, PlantListQuery, PlantPatch } from '@bouture/shared';
import { apiFetch, withQuery } from '@/lib/api';

// Les clés de cache : un tableau qui décrit la donnée. Même clé = même donnée en cache.
export const plantKeys = {
  all: ['plants'] as const,
  lists: () => [...plantKeys.all, 'list'] as const,
  list: (query: Partial<PlantListQuery>) => [...plantKeys.lists(), query] as const,
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

// Après chaque écriture, on invalide le cache des végétaux : les listes se rechargent
export function useCreatePlant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: PlantInput) =>
      apiFetch<Plant>('/plants', { method: 'POST', body: JSON.stringify(input) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: plantKeys.all }),
  });
}

export function useUpdatePlant(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (patch: PlantPatch) =>
      apiFetch<Plant>(`/plants/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: plantKeys.all }),
  });
}

export function useDeletePlant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiFetch<void>(`/plants/${id}`, { method: 'DELETE' }),
    // Seules les listes sont invalidées : recharger le détail supprimé donnerait un 404
    onSuccess: () => queryClient.invalidateQueries({ queryKey: plantKeys.lists() }),
  });
}
