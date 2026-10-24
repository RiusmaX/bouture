import {
  LeafIcon,
  LogOutIcon,
  ShieldIcon,
  ShoppingCartIcon,
  SproutIcon,
  UsersIcon,
} from 'lucide-react';
import { NavLink, Outlet } from 'react-router';
import { roleLabels } from '@bouture/shared';
import { useAuth } from '@/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const links = [
  { to: '/plants', label: 'Catalogue', icon: SproutIcon },
  { to: '/customers', label: 'Clients', icon: UsersIcon },
  { to: '/orders', label: 'Commandes', icon: ShoppingCartIcon },
  // adminOnly : le lien n'apparaît que pour un administrateur
  { to: '/users', label: 'Utilisateurs', icon: ShieldIcon, adminOnly: true },
];

// Gabarit d'une application de gestion : menu à gauche, page à droite.
// <Outlet /> affiche la page de la route enfant qui correspond à l'adresse.
export function AppLayout() {
  const { state, logout } = useAuth();
  // RequireAuth garantit qu'on est connecté ici ; le test rassure TypeScript
  if (state.status !== 'authenticated') return null;
  const { user } = state;
  const visibleLinks = links.filter((link) => !link.adminOnly || user.role === 'admin');

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-56 shrink-0 flex-col gap-6 bg-sidebar p-4 text-sidebar-foreground">
        <p className="flex items-center gap-2 text-xl font-semibold">
          <LeafIcon aria-hidden className="size-5" /> Bouture
        </p>
        <nav aria-label="Menu principal" className="flex flex-col gap-1">
          {visibleLinks.map(({ to, label, icon: Icon }) => (
            // NavLink sait si son lien est actif : on change alors son style
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-sidebar-accent',
                  isActive && 'bg-sidebar-primary text-sidebar-primary-foreground',
                )
              }
            >
              <Icon aria-hidden className="size-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-2 border-t border-sidebar-border pt-4 text-sm">
          <p>
            {user.name}
            <span className="block text-xs opacity-80">{roleLabels[user.role]}</span>
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="justify-start hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={logout}
          >
            <LogOutIcon aria-hidden /> Se déconnecter
          </Button>
        </div>
      </aside>
      <main className="mx-auto w-full max-w-6xl flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
