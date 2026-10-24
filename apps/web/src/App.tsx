import { Navigate, Route, Routes } from 'react-router';
import { RequireAuth } from '@/auth/RequireAuth';
import { AppLayout } from '@/layouts/AppLayout';
import { CatalogPage } from '@/pages/CatalogPage';
import { EditCustomerPage, NewCustomerPage } from '@/pages/CustomerFormPage';
import { CustomersPage } from '@/pages/CustomersPage';
import { LoginPage } from '@/pages/LoginPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { NewOrderPage } from '@/pages/NewOrderPage';
import { OrderDetailPage } from '@/pages/OrderDetailPage';
import { OrdersPage } from '@/pages/OrdersPage';
import { PlantDetailPage } from '@/pages/PlantDetailPage';
import { EditPlantPage, NewPlantPage } from '@/pages/PlantFormPage';
import { UsersPage } from '@/pages/UsersPage';

// Les routes de l'application : une adresse, un écran.
// Les routes imbriquées dans AppLayout s'affichent à la place de son <Outlet />.
export default function App() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      {/* Tout le reste demande une connexion */}
      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/plants" replace />} />
          <Route path="plants" element={<CatalogPage />} />
          <Route path="plants/new" element={<NewPlantPage />} />
          <Route path="plants/:id" element={<PlantDetailPage />} />
          <Route path="plants/:id/edit" element={<EditPlantPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="customers/new" element={<NewCustomerPage />} />
          <Route path="customers/:id/edit" element={<EditCustomerPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/new" element={<NewOrderPage />} />
          <Route path="orders/:id" element={<OrderDetailPage />} />
          <Route element={<RequireAuth role="admin" />}>
            <Route path="users" element={<UsersPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
