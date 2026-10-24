import { categories, categoryLabels } from '../categories.ts';
import type { Category } from '../types.ts';

interface CategorySelectProps {
  value: Category | '';
  onChange: (value: Category | '') => void;
}

export function CategorySelect({ value, onChange }: CategorySelectProps) {
  return (
    <select
      aria-label="Catégorie"
      value={value}
      // La valeur d'un select est une chaîne : on l'affirme en Category, la liste est fermée
      onChange={(event) => onChange(event.target.value as Category | '')}
    >
      <option value="">Toutes les catégories</option>
      {categories.map((category) => (
        <option key={category} value={category}>
          {categoryLabels[category]}
        </option>
      ))}
    </select>
  );
}
