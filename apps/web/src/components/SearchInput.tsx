import { SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="relative w-full sm:w-72">
      {/* L'icône est décorative : aria-hidden la cache aux lecteurs d'écran */}
      <SearchIcon
        aria-hidden
        className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        type="search"
        placeholder="Rechercher un végétal…"
        aria-label="Rechercher un végétal"
        className="pl-8"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
