import { categories, categoryLabels, type Category } from '@bouture/shared';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CategorySelectProps {
  value: Category | '';
  onChange: (value: Category | '') => void;
}

// Le Select de shadcn/ui n'accepte pas la valeur vide : « all » la remplace
const ALL = 'all';

export function CategorySelect({ value, onChange }: CategorySelectProps) {
  return (
    <Select
      value={value || ALL}
      onValueChange={(next) => onChange(next === ALL ? '' : (next as Category))}
    >
      <SelectTrigger aria-label="Catégorie" className="w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>Toutes les catégories</SelectItem>
        {categories.map((category) => (
          <SelectItem key={category} value={category}>
            {categoryLabels[category]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
