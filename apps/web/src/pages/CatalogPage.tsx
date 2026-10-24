import { useState } from 'react';
import { CategorySelect } from '@/components/CategorySelect';
import { PlantGrid } from '@/components/PlantGrid';
import { SearchInput } from '@/components/SearchInput';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { plants } from '@/data/plants';
import type { Category } from '@/types';

const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

export function CatalogPage() {
  // L'état : quand il change, React rappelle App et met l'écran à jour
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const debouncedSearch = useDebouncedValue(search);
  useDocumentTitle('Catalogue');

  // Valeur dérivée : calculée à chaque rendu, jamais stockée dans un état
  const visible = plants.filter(
    (plant) =>
      normalize(plant.name).includes(normalize(debouncedSearch)) &&
      (category === '' || plant.category === category) &&
      (!inStockOnly || plant.stock > 0),
  );

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
      <p className="text-sm text-muted-foreground">
        {visible.length} {visible.length > 1 ? 'végétaux' : 'végétal'}
      </p>
      <PlantGrid plants={visible} />
    </div>
  );
}
