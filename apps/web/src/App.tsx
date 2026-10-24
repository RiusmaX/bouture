import { Navigate, Route, Routes } from 'react-router';
import { AppLayout } from '@/layouts/AppLayout';
import { CatalogPage } from '@/pages/CatalogPage';
import { EditCustomerPage, NewCustomerPage } from '@/pages/CustomerFormPage';
import { CustomersPage } from '@/pages/CustomersPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { PlaceholderPage } from '@/pages/PlaceholderPage';
import { PlantDetailPage } from '@/pages/PlantDetailPage';
import { EditPlantPage, NewPlantPage } from '@/pages/PlantFormPage';

// Les routes de l'application : une adresse, un écran.
// Les routes imbriquées dans AppLayout s'affichent à la place de son <Outlet />.
export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/plants" replace />} />
        <Route path="plants" element={<CatalogPage />} />
        <Route path="plants/new" element={<NewPlantPage />} />
        <Route path="plants/:id" element={<PlantDetailPage />} />
        <Route path="plants/:id/edit" element={<EditPlantPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="customers/new" element={<NewCustomerPage />} />
        <Route path="customers/:id/edit" element={<EditCustomerPage />} />
        <Route path="orders" element={<PlaceholderPage title="Commandes" when="au TP final" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
