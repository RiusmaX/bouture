// Configuration ESLint « à plat » (flat config), commune à tout le dépôt
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['**/dist/**', '**/generated/**', 'exercises/**'] },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    rules: {
      // Une variable préfixée par _ est volontairement ignorée
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
);
