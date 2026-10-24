import { z } from 'zod';

// Les schémas Zod décrivent les données une seule fois.
// Ils servent à la fois à valider à l'exécution et à typer (z.infer) à la compilation.

export const categorySchema = z.enum([
  'tree',
  'shrub',
  'perennial',
  'climber',
  'hedge',
  'fruit',
  'aromatic',
]);

export const plantSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1).max(120),
  latinName: z.string().max(120),
  category: categorySchema,
  potSize: z.string().max(30),
  priceCents: z.number().int().min(0),
  stock: z.number().int().min(0),
});

// Ce que le client envoie pour créer : tout sauf l'id, attribué par le serveur
export const plantInputSchema = plantSchema.omit({ id: true });

// Pour modifier : les mêmes champs, tous facultatifs
export const plantPatchSchema = plantInputSchema.partial();

// Paramètres de la liste : la query string n'a que des chaînes, coerce les convertit en nombres
export const plantListQuerySchema = z.object({
  category: categorySchema.optional(),
  search: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export const plantPageSchema = z.object({
  items: z.array(plantSchema),
  total: z.number().int(),
  page: z.number().int(),
  pageSize: z.number().int(),
});

export const plantIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type Category = z.infer<typeof categorySchema>;
export type Plant = z.infer<typeof plantSchema>;
export type PlantInput = z.infer<typeof plantInputSchema>;
export type PlantPatch = z.infer<typeof plantPatchSchema>;
export type PlantListQuery = z.infer<typeof plantListQuerySchema>;
