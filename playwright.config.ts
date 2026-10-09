import { defineConfig, devices } from '@playwright/test';

const webBaseUrl = 'http://localhost:3000';
const apiBaseUrl = 'http://127.0.0.1:4000/api/v1';
const databaseUrl =
  process.env.DATABASE_URL ??
  'postgresql://portfolio:portfolio_local_only@127.0.0.1:5432/portfolio';
const reuseExistingServer = !process.env.CI;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  ...(process.env.CI ? { workers: 1 } : {}),
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL: webBaseUrl,
    screenshot: 'off',
    trace: 'off',
    video: 'off',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], locale: 'es-AR' },
    },
  ],
  webServer: [
    {
      command: 'pnpm test:e2e:web',
      url: webBaseUrl,
      reuseExistingServer,
      timeout: 120_000,
      env: {
        NEXT_PUBLIC_API_BASE_URL: apiBaseUrl,
      },
    },
    {
      command: 'pnpm test:e2e:api',
      url: `${apiBaseUrl}/health/live`,
      reuseExistingServer,
      timeout: 120_000,
      env: {
        API_PORT: '4000',
        DATABASE_URL: databaseUrl,
        NODE_ENV: 'test',
      },
    },
  ],
});
