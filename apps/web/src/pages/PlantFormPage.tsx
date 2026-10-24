import { useNavigate, useParams } from 'react-router';
import { useCreatePlant, usePlant, useUpdatePlant } from '@/api/plants';
import { PlantForm } from '@/components/PlantForm';
import { ErrorMessage, Loading } from '@/components/QueryState';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export function NewPlantPage() {
  useDocumentTitle('Nouveau végétal');
  const navigate = useNavigate();
  const createPlant = useCreatePlant();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold text-primary">Nouveau végétal</h1>
      {createPlant.error && <ErrorMessage error={createPlant.error} />}
      <PlantForm
        submitLabel="Créer"
        onSubmit={async (input) => {
          const plant = await createPlant.mutateAsync(input);
          navigate(`/plants/${plant.id}`);
        }}
      />
    </div>
  );
}

export function EditPlantPage() {
  const id = Number(useParams().id);
  const navigate = useNavigate();
  const { data: plant, isPending, error } = usePlant(id);
  const updatePlant = useUpdatePlant(id);
  useDocumentTitle(plant ? `Modifier ${plant.name}` : 'Modifier');

  if (isPending) return <Loading />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold text-primary">Modifier {plant.name}</h1>
      {updatePlant.error && <ErrorMessage error={updatePlant.error} />}
      <PlantForm
        plant={plant}
        submitLabel="Enregistrer"
        onSubmit={async (patch) => {
          await updatePlant.mutateAsync(patch);
          navigate(`/plants/${id}`);
        }}
      />
    </div>
  );
}
