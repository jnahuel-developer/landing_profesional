import baseConfig from '@portfolio/config/eslint/base';

export default [
  ...baseConfig,
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/playwright-report/**',
      'docs previos de ChatGPT/**',
    ],
  },
];
