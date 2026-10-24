import { Navigate, Outlet, useLocation } from 'react-router';
import type { Role } from '@bouture/shared';
import { Loading } from '@/components/QueryState';
import { useAuth } from './AuthContext';

// Garde de routes : les routes enfants ne s'affichent que pour un utilisateur connecté
// (et, si role est donné, seulement pour ce rôle)
export function RequireAuth({ role }: { role?: Role }) {
  const { state } = useAuth();
  const location = useLocation();

  if (state.status === 'restoring') return <Loading />;
  if (state.status === 'anonymous') {
    // On mémorise la page demandée pour y revenir après la connexion
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (role && state.user.role !== role) return <Navigate to="/" replace />;
  return <Outlet />;
}
