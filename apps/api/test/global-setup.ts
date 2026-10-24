import { execSync } from 'node:child_process';

// Prépare la base de test : applique les migrations manquantes (sans rien effacer)
// puis recharge les données de démonstration (le seed vide les tables avant d'insérer).
export default function setup() {
  execSync('npx prisma migrate deploy', { stdio: 'inherit', env: process.env });
  execSync('npx prisma db seed', { stdio: 'inherit', env: process.env });
}
