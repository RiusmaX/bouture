import { LeafIcon, ShoppingCartIcon, SproutIcon, UsersIcon } from 'lucide-react';
import { NavLink, Outlet } from 'react-router';
import { cn } from '@/lib/utils';

const links = [
  { to: '/plants', label: 'Catalogue', icon: SproutIcon },
  { to: '/customers', label: 'Clients', icon: UsersIcon },
  { to: '/orders', label: 'Commandes', icon: ShoppingCartIcon },
];

// Gabarit d'une application de gestion : menu à gauche, page à droite.
// <Outlet /> affiche la page de la route enfant qui correspond à l'adresse.
export function AppLayout() {
  return (
    <div className="flex min-h-screen">
      <aside className="flex w-56 shrink-0 flex-col gap-6 bg-sidebar p-4 text-sidebar-foreground">
        <p className="flex items-center gap-2 text-xl font-semibold">
          <LeafIcon aria-hidden className="size-5" /> Bouture
        </p>
        <nav aria-label="Menu principal" className="flex flex-col gap-1">
          {links.map(({ to, label, icon: Icon }) => (
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
      </aside>
      <main className="mx-auto w-full max-w-6xl flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
