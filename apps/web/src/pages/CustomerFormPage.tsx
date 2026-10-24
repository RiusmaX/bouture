import { useNavigate, useParams } from 'react-router';
import {
  useCreateCustomer,
  useCustomer,
  useDeleteCustomer,
  useUpdateCustomer,
} from '@/api/customers';
import { ConfirmDelete } from '@/components/ConfirmDelete';
import { CustomerForm } from '@/components/CustomerForm';
import { ErrorMessage, Loading } from '@/components/QueryState';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export function NewCustomerPage() {
  useDocumentTitle('Nouveau client');
  const navigate = useNavigate();
  const createCustomer = useCreateCustomer();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold text-primary">Nouveau client</h1>
      <CustomerForm
        submitLabel="Créer"
        onSubmit={async (input) => {
          await createCustomer.mutateAsync(input);
          navigate('/customers');
        }}
      />
    </div>
  );
}

export function EditCustomerPage() {
  const id = Number(useParams().id);
  const navigate = useNavigate();
  const { data: customer, isPending, error } = useCustomer(id);
  const updateCustomer = useUpdateCustomer(id);
  const deleteCustomer = useDeleteCustomer();
  useDocumentTitle(customer?.name ?? 'Client');

  if (isPending) return <Loading />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold text-primary">{customer.name}</h1>
        <ConfirmDelete
          title={`Supprimer ${customer.name} ?`}
          description="Le client et ses coordonnées sont supprimés. Cette action est définitive."
          onConfirm={() =>
            deleteCustomer.mutate(id, {
              onSuccess: () => navigate('/customers', { replace: true }),
            })
          }
        />
      </div>
      {deleteCustomer.error && <ErrorMessage error={deleteCustomer.error} />}
      <CustomerForm
        customer={customer}
        submitLabel="Enregistrer"
        onSubmit={async (patch) => {
          await updateCustomer.mutateAsync(patch);
          navigate('/customers');
        }}
      />
    </div>
  );
}
