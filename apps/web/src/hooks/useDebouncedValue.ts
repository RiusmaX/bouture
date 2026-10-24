import { useEffect, useState } from 'react';

// Renvoie la valeur seulement quand elle n'a plus bougé depuis delay millisecondes :
// on évite de filtrer (et plus tard d'appeler l'API) à chaque frappe.
export function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    // Nettoyage : si value change avant la fin du délai, on annule le minuteur
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
