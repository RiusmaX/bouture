import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { PlusIcon } from 'lucide-react';
import { plantListQuerySchema, type PlantSort } from '@bouture/shared';
import { usePlants } from '@/api/plants';
import { CategorySelect } from '@/components/CategorySelect';
import { Pagination } from '@/components/Pagination';
import { PlantsTable } from '@/components/PlantsTable';
import { ErrorMessage, Loading } from '@/components/QueryState';
import { SearchInput } from '@/components/SearchInput';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export function CatalogPage() {
  useDocumentTitle('Catalogue');
  // Les filtres vivent dans l'adresse (?category=hedge&page=2) : la page se partage
  // et survit au rechargement. Le schéma partagé les valide, avec ses valeurs par défaut.
  const [searchParams, setSearchParams] = useSearchParams();
  const parsed = plantListQuerySchema.safeParse(Object.fromEntries(searchParams));
  const query = parsed.success ? parsed.data : plantListQuerySchema.parse({});

  // Met à jour certains paramètres ; tout changement de filtre ramène à la page 1
  const update = (changes: Record<string, string | undefined>) => {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      for (const [key, value] of Object.entries(changes)) {
        if (value) next.set(key, value);
        else next.delete(key);
      }
      if (!('page' in changes)) next.delete('page');
      return next;
    });
  };

  // La saisie reste locale, l'adresse ne change qu'une fois la frappe terminée
  const [search, setSearch] = useState(query.search ?? '');
  const debouncedSearch = useDebouncedValue(search);
  useEffect(() => {
    if (debouncedSearch !== (query.search ?? '')) update({ search: debouncedSearch });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- on ne réagit qu'à la frappe
  }, [debouncedSearch]);

  const { data, isPending, error, isFetching } = usePlants(query);

  const handleSort = (column: PlantSort) => {
    const order = query.sort === column && query.order === 'asc' ? 'desc' : 'asc';
    update({ sort: column, order });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-primary">Catalogue</h1>
        <Button asChild>
          <Link to="/plants/new">
            <PlusIcon aria-hidden /> Nouveau végétal
          </Link>
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <SearchInput value={search} onChange={setSearch} />
        <CategorySelect
          value={query.category ?? ''}
          onChange={(category) => update({ category: category || undefined })}
        />
        <div className="flex items-center gap-2">
          <Checkbox
            id="in-stock"
            checked={query.inStock === true}
            onCheckedChange={(checked) =>
              update({ inStock: checked === true ? 'true' : undefined })
            }
          />
          <Label htmlFor="in-stock">En stock seulement</Label>
        </div>
      </div>
      {isPending ? (
        <Loading />
      ) : error ? (
        <ErrorMessage error={error} />
      ) : (
        // L'opacité baisse pendant le chargement d'une autre page : l'ancienne reste affichée
        <div className={isFetching ? 'opacity-60 transition-opacity' : undefined}>
          <p className="mb-2 text-sm text-muted-foreground">
            {data.total} {data.total > 1 ? 'végétaux' : 'végétal'}
          </p>
          <PlantsTable
            plants={data.items}
            sort={query.sort}
            order={query.order}
            onSort={handleSort}
          />
          <Pagination
            page={data.page}
            pageSize={data.pageSize}
            total={data.total}
            onPageChange={(page) => update({ page: String(page) })}
          />
        </div>
      )}
    </div>
  );
}
