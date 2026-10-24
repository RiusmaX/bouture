import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  categories,
  categoryLabels,
  plantInputSchema,
  type Category,
  type Plant,
  type PlantInput,
} from '@bouture/shared';
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

// Le schéma du formulaire part du schéma partagé avec l'API.
// Seule différence : on saisit le prix en euros, l'API le reçoit en centimes.
const plantFormSchema = plantInputSchema.omit({ priceCents: true }).extend({
  price: z.number({ error: 'Le prix est obligatoire' }).min(0, 'Le prix ne peut pas être négatif'),
});

type PlantFormValues = z.infer<typeof plantFormSchema>;

interface PlantFormProps {
  plant?: Plant;
  submitLabel: string;
  onSubmit: (input: PlantInput) => Promise<unknown>;
}

export function PlantForm({ plant, submitLabel, onSubmit }: PlantFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PlantFormValues>({
    // zodResolver : les règles de validation sont celles du schéma, rien à réécrire
    resolver: zodResolver(plantFormSchema),
    defaultValues: plant
      ? { ...plant, price: plant.priceCents / 100 }
      : { name: '', latinName: '', potSize: '', category: 'shrub', stock: 0 },
  });

  const submit = ({ price, ...values }: PlantFormValues) =>
    onSubmit({ ...values, priceCents: Math.round(price * 100) });

  return (
    // noValidate : la validation est celle de Zod, pas celle du navigateur
    <form noValidate onSubmit={handleSubmit(submit)} className="max-w-lg">
      <FieldGroup>
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="name">Nom</FieldLabel>
          <Input id="name" aria-invalid={!!errors.name} {...register('name')} />
          <FieldError errors={[errors.name]} />
        </Field>
        <Field data-invalid={!!errors.latinName}>
          <FieldLabel htmlFor="latinName">Nom latin</FieldLabel>
          <Input id="latinName" {...register('latinName')} />
          <FieldError errors={[errors.latinName]} />
        </Field>
        <Field data-invalid={!!errors.category}>
          <FieldLabel htmlFor="category">Catégorie</FieldLabel>
          {/* Controller relie à React Hook Form un composant qui n'est pas un <input> natif */}
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Select value={field.value} onValueChange={(v) => field.onChange(v as Category)}>
                <SelectTrigger id="category" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {categoryLabels[category]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
        <Field data-invalid={!!errors.potSize}>
          <FieldLabel htmlFor="potSize">Pot</FieldLabel>
          <Input id="potSize" placeholder="C3, godet 9 cm…" {...register('potSize')} />
          <FieldError errors={[errors.potSize]} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field data-invalid={!!errors.price}>
            <FieldLabel htmlFor="price">Prix (€)</FieldLabel>
            {/* valueAsNumber : React Hook Form renvoie un nombre, pas la chaîne du champ */}
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              aria-invalid={!!errors.price}
              {...register('price', { valueAsNumber: true })}
            />
            <FieldError errors={[errors.price]} />
          </Field>
          <Field data-invalid={!!errors.stock}>
            <FieldLabel htmlFor="stock">Stock</FieldLabel>
            <Input
              id="stock"
              type="number"
              min="0"
              aria-invalid={!!errors.stock}
              {...register('stock', { valueAsNumber: true })}
            />
            <FieldError errors={[errors.stock]} />
          </Field>
        </div>
        <Button type="submit" disabled={isSubmitting} className="self-start">
          {isSubmitting ? 'Enregistrement…' : submitLabel}
        </Button>
      </FieldGroup>
    </form>
  );
}
