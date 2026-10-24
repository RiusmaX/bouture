import { z } from 'zod';
import { pageSchema, paginationQuerySchema } from './pagination.ts';

// Les schémas Zod décrivent les données une seule fois.
// Ils servent à la fois à valider à l'exécution et à typer (z.infer) à la compilation.

export const categories = [
  'tree',
  'shrub',
  'perennial',
  'climber',
  'hedge',
  'fruit',
  'aromatic',
] as const;

export const categorySchema = z.enum(categories);

export const plantSchema = z.object({
  id: z.number().int(),
  name: z.string().trim().min(1, 'Le nom est obligatoire').max(120),
  latinName: z.string().trim().max(120),
  category: categorySchema,
  potSize: z.string().trim().min(1, 'Le pot est obligatoire').max(30),
  priceCents: z.number().int().min(0, 'Le prix ne peut pas être négatif'),
  stock: z.number().int().min(0, 'Le stock ne peut pas être négatif'),
});

// Ce que le client envoie pour créer : tout sauf l'id, attribué par le serveur
export const plantInputSchema = plantSchema.omit({ id: true });

// Pour modifier : les mêmes champs, tous facultatifs
export const plantPatchSchema = plantInputSchema.partial();

// Paramètres de la liste : la query string n'a que des chaînes, coerce les convertit
export const plantListQuerySchema = paginationQuerySchema.extend({
  category: categorySchema.optional(),
  search: z.string().trim().min(1).optional(),
  // « true » dans l'adresse : seulement les végétaux disponibles
  inStock: z.stringbool().optional(),
});

export const plantPageSchema = pageSchema(plantSchema);

export const plantIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type Category = z.infer<typeof categorySchema>;
export type Plant = z.infer<typeof plantSchema>;
export type PlantInput = z.infer<typeof plantInputSchema>;
export type PlantPatch = z.infer<typeof plantPatchSchema>;
export type PlantListQuery = z.infer<typeof plantListQuerySchema>;
