import { useState } from 'react';
import type { Category } from '@bouture/shared';
import { usePlants } from '@/api/plants';
import { CategorySelect } from '@/components/CategorySelect';
import { PlantGrid } from '@/components/PlantGrid';
import { ErrorMessage, Loading } from '@/components/QueryState';
import { SearchInput } from '@/components/SearchInput';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export function CatalogPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const debouncedSearch = useDebouncedValue(search);
  useDocumentTitle('Catalogue');

  // Le filtre se fait maintenant côté serveur : chaque combinaison a sa clé de cache
  const { data, isPending, error } = usePlants({
    search: debouncedSearch || undefined,
    category: category || undefined,
    inStock: inStockOnly || undefined,
    pageSize: 100,
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold text-primary">Catalogue</h1>
      <div className="flex flex-wrap items-center gap-4">
        <SearchInput value={search} onChange={setSearch} />
        <CategorySelect value={category} onChange={setCategory} />
        <div className="flex items-center gap-2">
          <Checkbox
            id="in-stock"
            checked={inStockOnly}
            onCheckedChange={(checked) => setInStockOnly(checked === true)}
          />
          <Label htmlFor="in-stock">En stock seulement</Label>
        </div>
      </div>
      {isPending ? (
        <Loading />
      ) : error ? (
        <ErrorMessage error={error} />
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {data.total} {data.total > 1 ? 'végétaux' : 'végétal'}
          </p>
          <PlantGrid plants={data.items} />
        </>
      )}
    </div>
  );
}
