import { defineConfig } from 'vitest/config';

export default defineConfig({
  oxc: {
    jsx: {
      runtime: 'automatic',
    },
  },
  test: {
    environment: 'jsdom',
    server: {
      deps: {
        inline: ['next-intl'],
      },
    },
    setupFiles: ['./tests/setup.ts'],
  },
});
