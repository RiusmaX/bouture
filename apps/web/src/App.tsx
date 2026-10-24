import { useState } from 'react';
import { CategorySelect } from '@/components/CategorySelect';
import { PlantGrid } from '@/components/PlantGrid';
import { SearchInput } from '@/components/SearchInput';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import plantsJson from '@/data/plants.json';
import type { Category, Plant } from '@/types';

// Données locales pour apprendre React ; elles viendront de l'API au TD 12
const plants = plantsJson as Plant[];

const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

export default function App() {
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
    <main className="mx-auto flex max-w-6xl flex-col gap-6 p-6">
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
    </main>
  );
}
