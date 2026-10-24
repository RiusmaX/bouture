// Crée un compte, par exemple le premier administrateur d'un serveur neuf :
//   docker compose -f compose.prod.yaml exec api node dist/cli/create-user.js admin@aquila.example "Prénom Nom" admin
// Le mot de passe est tiré au hasard et affiché une seule fois.
import { randomBytes } from 'node:crypto';
import { roleSchema } from '@bouture/shared';
import { prisma } from '../db.ts';
import { hashPassword } from '../modules/auth/password.ts';

const [email, name, role = 'seller'] = process.argv.slice(2);
if (!email || !name) {
  console.error('Usage : create-user <email> <nom> [admin|seller]');
  process.exit(1);
}

const password = randomBytes(12).toString('base64url');
await prisma.user.create({
  data: { email, name, role: roleSchema.parse(role), passwordHash: await hashPassword(password) },
});
console.log(`Compte créé : ${email} (${role}). Mot de passe : ${password}`);
await prisma.$disconnect();
