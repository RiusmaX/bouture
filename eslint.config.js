// Configuration ESLint « à plat » (flat config), commune à tout le dépôt
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

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
  // L'interface : code exécuté dans le navigateur, règles des hooks de React
  {
    files: ['apps/web/**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
    extends: [reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
  },
);
