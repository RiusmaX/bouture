import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import type { ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { LoginInput, User } from '@bouture/shared';
import { apiFetch } from '@/lib/api';

// ---- L'état de la session
// « restoring » : au démarrage, on ne sait pas encore si un cookie de session est valide
type AuthState =
  | { status: 'restoring'; user: null }
  | { status: 'anonymous'; user: null }
  | { status: 'authenticated'; user: User };

// ---- Les actions : tout ce qui peut arriver à la session, et rien d'autre
type AuthAction =
  | { type: 'RESTORED'; user: User | null }
  | { type: 'LOGGED_IN'; user: User }
  | { type: 'LOGGED_OUT' };

// ---- Les fabriques d'actions : on n'écrit jamais un objet action à la main dans un composant
const restored = (user: User | null): AuthAction => ({ type: 'RESTORED', user });
const loggedIn = (user: User): AuthAction => ({ type: 'LOGGED_IN', user });
const loggedOut = (): AuthAction => ({ type: 'LOGGED_OUT' });

// ---- Le reducer : une fonction pure, (état, action) → nouvel état. Facile à tester.
function authReducer(_state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'RESTORED':
      return action.user
        ? { status: 'authenticated', user: action.user }
        : { status: 'anonymous', user: null };
    case 'LOGGED_IN':
      return { status: 'authenticated', user: action.user };
    case 'LOGGED_OUT':
      return { status: 'anonymous', user: null };
  }
}

interface AuthContextValue {
  state: AuthState;
  login: (input: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Événement émis par le cache de requêtes quand l'API répond 401 (session expirée)
export const SESSION_EXPIRED = 'bouture:session-expired';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, { status: 'restoring', user: null });
  const queryClient = useQueryClient();

  // Réhydratation : le cookie est invisible pour le JavaScript, on demande à l'API qui est connecté
  useEffect(() => {
    apiFetch<User>('/auth/me')
      .then((user) => dispatch(restored(user)))
      .catch(() => dispatch(restored(null)));
  }, []);

  // Session expirée pendant l'utilisation : retour à l'état anonyme, donc à l'écran de connexion
  useEffect(() => {
    const onExpired = () => dispatch(loggedOut());
    window.addEventListener(SESSION_EXPIRED, onExpired);
    return () => window.removeEventListener(SESSION_EXPIRED, onExpired);
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    const user = await apiFetch<User>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    dispatch(loggedIn(user));
  }, []);

  const logout = useCallback(async () => {
    await apiFetch<void>('/auth/logout', { method: 'POST' }).catch(() => undefined);
    // Les données de l'utilisateur précédent ne doivent pas rester en cache
    queryClient.clear();
    dispatch(loggedOut());
  }, [queryClient]);

  // useMemo : la valeur ne change que si l'état change, les consommateurs ne se redessinent pas pour rien
  const value = useMemo(() => ({ state, login, logout }), [state, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Le hook gardé : une erreur claire si on l'utilise hors du fournisseur
// eslint-disable-next-line react-refresh/only-export-components -- le hook va avec son contexte
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth doit être utilisé dans <AuthProvider>');
  return context;
}
