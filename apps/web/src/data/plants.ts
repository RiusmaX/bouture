import plantsJson from '@/data/plants.json';
import type { Plant } from '@/types';

// Données locales pour apprendre React ; elles viendront de l'API au TD 12
export const plants = plantsJson as Plant[];
