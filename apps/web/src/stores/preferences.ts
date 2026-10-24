import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Zustand, pour comparer avec Context + useReducer : un magasin global en quelques lignes,
// sans fournisseur à placer dans l'arbre. persist le garde dans le localStorage du navigateur.
// Bon usage : des préférences d'interface. La session, elle, reste dans AuthContext.
interface PreferencesState {
  pageSize: number;
  setPageSize: (pageSize: number) => void;
}

export const usePreferences = create<PreferencesState>()(
  persist(
    (set) => ({
      pageSize: 20,
      setPageSize: (pageSize) => set({ pageSize }),
    }),
    { name: 'bouture-preferences' },
  ),
);
