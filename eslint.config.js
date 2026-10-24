// Configuration ESLint « à plat » (flat config), commune à tout le dépôt
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['**/dist/**', 'exercises/**'] },
  js.configs.recommended,
  tseslint.configs.recommended,
);
