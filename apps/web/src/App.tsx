import { useState } from 'react';
import { PlantGrid } from './components/PlantGrid.tsx';
import { SearchInput } from './components/SearchInput.tsx';
import { useDebouncedValue } from './hooks/useDebouncedValue.ts';
import { useDocumentTitle } from './hooks/useDocumentTitle.ts';
import plantsJson from './data/plants.json';
import type { Plant } from './types.ts';

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
  const debouncedSearch = useDebouncedValue(search);
  useDocumentTitle('Catalogue');

  // Valeur dérivée : calculée à chaque rendu, jamais stockée dans un état
  const visible = plants.filter((plant) =>
    normalize(plant.name).includes(normalize(debouncedSearch)),
  );

  return (
    <main>
      <h1>Catalogue</h1>
      <SearchInput value={search} onChange={setSearch} />
      <p>
        {visible.length} {visible.length > 1 ? 'végétaux' : 'végétal'}
      </p>
      <PlantGrid plants={visible} />
    </main>
  );
}
