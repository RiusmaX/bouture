import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';

// Prépare la base de test : applique les migrations manquantes (sans rien effacer)
// puis recharge les données de démonstration (le seed vide les tables avant d'insérer).
// Les commandes reçoivent les variables de .env.test : elles visent la base bouture_test.
export default function setup() {
  const env = { ...process.env, ...parseEnv(readFileSync('.env.test', 'utf8')) };
  execSync('npx prisma migrate deploy', { stdio: 'inherit', env });
  execSync('npx prisma db seed', { stdio: 'inherit', env });
}
