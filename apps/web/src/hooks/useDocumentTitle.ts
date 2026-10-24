import { useEffect } from 'react';

// Hook personnalisé : un nom qui commence par use, des hooks à l'intérieur.
// L'effet se relance seulement quand title change (tableau de dépendances).
export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = `${title} · Bouture`;
  }, [title]);
}
