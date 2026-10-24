import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon, Trash2Icon } from 'lucide-react';
import { useNavigate } from 'react-router';
import { orderInputSchema, type OrderInput } from '@bouture/shared';
import { useCustomers } from '@/api/customers';
import { useCreateOrder } from '@/api/orders';
import { usePlants } from '@/api/plants';
import { ErrorMessage, Loading } from '@/components/QueryState';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatPrice } from '@/format';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export function NewOrderPage() {
  useDocumentTitle('Nouvelle commande');
  const navigate = useNavigate();
  const createOrder = useCreateOrder();
  // Les listes des deux sélecteurs : clients, et végétaux disponibles seulement
  const customers = useCustomers({ pageSize: 100 });
  const plants = usePlants({ inStock: true, pageSize: 100 });

  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<OrderInput>({
    resolver: zodResolver(orderInputSchema),
    defaultValues: { items: [{ quantity: 1 } as OrderInput['items'][number]] },
  });
  // useFieldArray gère une liste de lignes : ajouter, retirer, chacune avec ses champs
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  // useWatch relit les lignes à chaque saisie : le total se met à jour en direct
  const items = useWatch({ control, name: 'items' });

  if (customers.isPending || plants.isPending) return <Loading />;
  if (customers.error) return <ErrorMessage error={customers.error} />;
  if (plants.error) return <ErrorMessage error={plants.error} />;

  const priceOf = (plantId?: number) =>
    plants.data.items.find((plant) => plant.id === plantId)?.priceCents ?? 0;
  const total = (items ?? []).reduce(
    (sum, item) => sum + priceOf(item.plantId) * (Number(item.quantity) || 0),
    0,
  );

  const submit = async (input: OrderInput) => {
    try {
      const order = await createOrder.mutateAsync(input);
      navigate(`/orders/${order.id}`);
    } catch (error) {
      // 409 : stock insuffisant, le message de l'API dit pour quel végétal
      setError('root', { message: (error as Error).message });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold text-primary">Nouvelle commande</h1>
      <form noValidate onSubmit={handleSubmit(submit)} className="max-w-3xl">
        <FieldGroup>
          <Field data-invalid={!!errors.customerId}>
            <FieldLabel htmlFor="customerId">Client</FieldLabel>
            <Controller
              control={control}
              name="customerId"
              render={({ field }) => (
                <Select
                  value={field.value ? String(field.value) : ''}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <SelectTrigger id="customerId" className="w-full">
                    <SelectValue placeholder="Choisir un client" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.data.items.map((customer) => (
                      <SelectItem key={customer.id} value={String(customer.id)}>
                        {customer.name} · {customer.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={[errors.customerId]} />
          </Field>

          <fieldset className="flex flex-col gap-3">
            <legend className="mb-2 font-medium">Lignes</legend>
            {fields.map((line, index) => (
              // key = line.id : l'identifiant stable fourni par useFieldArray, pas l'index
              <div key={line.id} className="grid grid-cols-[1fr_7rem_7rem_auto] items-start gap-3">
                <Field data-invalid={!!errors.items?.[index]?.plantId}>
                  <Controller
                    control={control}
                    name={`items.${index}.plantId`}
                    render={({ field }) => (
                      <Select
                        value={field.value ? String(field.value) : ''}
                        onValueChange={(value) => field.onChange(Number(value))}
                      >
                        <SelectTrigger
                          aria-label={`Végétal, ligne ${index + 1}`}
                          className="w-full"
                        >
                          <SelectValue placeholder="Choisir un végétal" />
                        </SelectTrigger>
                        <SelectContent>
                          {plants.data.items.map((plant) => (
                            <SelectItem key={plant.id} value={String(plant.id)}>
                              {plant.name} · {plant.potSize} ({plant.stock} en stock)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FieldError errors={[errors.items?.[index]?.plantId]} />
                </Field>
                <Field data-invalid={!!errors.items?.[index]?.quantity}>
                  <Input
                    type="number"
                    min="1"
                    aria-label={`Quantité, ligne ${index + 1}`}
                    {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                  />
                  <FieldError errors={[errors.items?.[index]?.quantity]} />
                </Field>
                <p className="py-2 text-right tabular-nums">
                  {formatPrice(priceOf(items?.[index]?.plantId) * (items?.[index]?.quantity || 0))}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Retirer la ligne ${index + 1}`}
                  disabled={fields.length === 1}
                  onClick={() => remove(index)}
                >
                  <Trash2Icon aria-hidden />
                </Button>
              </div>
            ))}
            <FieldError errors={[errors.items?.root ?? errors.items]} />
            <Button
              type="button"
              variant="outline"
              className="self-start"
              onClick={() => append({ quantity: 1 } as OrderInput['items'][number])}
            >
              <PlusIcon aria-hidden /> Ajouter une ligne
            </Button>
          </fieldset>

          <p className="text-lg">
            Total : <strong className="tabular-nums">{formatPrice(total)}</strong>
          </p>
          <FieldError errors={[errors.root]} />
          <Button type="submit" disabled={isSubmitting} className="self-start">
            {isSubmitting ? 'Enregistrement…' : 'Passer la commande'}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
