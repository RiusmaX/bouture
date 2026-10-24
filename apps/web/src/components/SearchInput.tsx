interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

// Composant « contrôlé » : la valeur vient du parent, chaque frappe lui est remontée
export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <input
      type="search"
      placeholder="Rechercher un végétal…"
      aria-label="Rechercher un végétal"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
