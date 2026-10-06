import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

const baseConfig = [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    rules: {
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
    },
  },
];

export default baseConfig;
