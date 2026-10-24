import { z } from 'zod';

export const roles = ['admin', 'seller'] as const;

export const roleSchema = z.enum(roles);

// L'utilisateur tel que l'API le renvoie : jamais le mot de passe, même haché
export const userSchema = z.object({
  id: z.number().int(),
  email: z.email(),
  name: z.string(),
  role: roleSchema,
});

export const loginInputSchema = z.object({
  email: z.email('Adresse e-mail invalide'),
  password: z.string().min(1, 'Le mot de passe est obligatoire'),
});

export type Role = z.infer<typeof roleSchema>;
export type User = z.infer<typeof userSchema>;
export type LoginInput = z.infer<typeof loginInputSchema>;
