import nextConfig from '@portfolio/config/eslint/next';

export default [
  ...nextConfig,
  {
    ignores: ['.next/**'],
  },
  {
    files: ['*.config.mjs', 'eslint.config.mjs'],
    rules: {
      'import/no-anonymous-default-export': 'off',
    },
  },
];
