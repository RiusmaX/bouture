import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

// scrypt est lent et gourmand en mémoire exprès : deviner un mot de passe par essais coûte cher.
// Il est fourni par Node : aucune dépendance à installer.
const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: Buffer,
  length: number,
) => Promise<Buffer>;

const KEY_LENGTH = 64;

// Résultat stocké en base : « sel:empreinte », en hexadécimal
export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const hash = await scryptAsync(password, salt, KEY_LENGTH);
  return `${salt.toString('hex')}:${hash.toString('hex')}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [saltHex, hashHex] = stored.split(':');
  if (!saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, 'hex');
  const actual = await scryptAsync(password, Buffer.from(saltHex, 'hex'), expected.length);
  // Comparaison en temps constant : la durée ne trahit pas où les empreintes diffèrent
  return timingSafeEqual(actual, expected);
}
