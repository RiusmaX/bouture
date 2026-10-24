import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  customerSchema,
  customerTypeLabels,
  customerTypes,
  type Customer,
  type CustomerInput,
  type CustomerType,
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
import { ApiError } from '@/lib/api';

// Le téléphone est saisi comme une chaîne : vide, il devient null pour l'API
const customerFormSchema = customerSchema.omit({ id: true, phone: true }).extend({
  phone: z.string().max(30),
});

type CustomerFormValues = z.infer<typeof customerFormSchema>;

interface CustomerFormProps {
  customer?: Customer;
  submitLabel: string;
  onSubmit: (input: CustomerInput) => Promise<unknown>;
}

export function CustomerForm({ customer, submitLabel, onSubmit }: CustomerFormProps) {
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: customer
      ? { ...customer, phone: customer.phone ?? '' }
      : { name: '', email: '', phone: '', city: '', type: 'professional' },
  });

  const submit = async ({ phone, ...values }: CustomerFormValues) => {
    try {
      await onSubmit({ ...values, phone: phone.trim() || null });
    } catch (error) {
      // 409 : l'adresse est déjà prise. L'erreur s'affiche sous le bon champ.
      if (error instanceof ApiError && error.status === 409) {
        setError('email', { message: error.message });
      } else {
        setError('root', { message: (error as Error).message });
      }
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit(submit)} className="max-w-lg">
      <FieldGroup>
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="name">Nom ou raison sociale</FieldLabel>
          <Input id="name" aria-invalid={!!errors.name} {...register('name')} />
          <FieldError errors={[errors.name]} />
        </Field>
        <Field data-invalid={!!errors.type}>
          <FieldLabel htmlFor="type">Type</FieldLabel>
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <Select value={field.value} onValueChange={(v) => field.onChange(v as CustomerType)}>
                <SelectTrigger id="type" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {customerTypes.map((value) => (
                    <SelectItem key={value} value={value}>
                      {customerTypeLabels[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">E-mail</FieldLabel>
          <Input id="email" type="email" aria-invalid={!!errors.email} {...register('email')} />
          <FieldError errors={[errors.email]} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field data-invalid={!!errors.phone}>
            <FieldLabel htmlFor="phone">Téléphone (facultatif)</FieldLabel>
            <Input id="phone" type="tel" {...register('phone')} />
            <FieldError errors={[errors.phone]} />
          </Field>
          <Field data-invalid={!!errors.city}>
            <FieldLabel htmlFor="city">Ville</FieldLabel>
            <Input id="city" aria-invalid={!!errors.city} {...register('city')} />
            <FieldError errors={[errors.city]} />
          </Field>
        </div>
        <FieldError errors={[errors.root]} />
        <Button type="submit" disabled={isSubmitting} className="self-start">
          {isSubmitting ? 'Enregistrement…' : submitLabel}
        </Button>
      </FieldGroup>
    </form>
  );
}
