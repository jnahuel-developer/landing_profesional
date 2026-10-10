import { defineConfig, devices } from '@playwright/test';

const webBaseUrl = 'http://localhost:3000';
const apiBaseUrl = 'http://127.0.0.1:4000/api/v1';
const databaseUrl =
  process.env.DATABASE_URL ??
  'postgresql://portfolio:portfolio_local_only@127.0.0.1:5432/portfolio';
const reuseExistingServer = false;

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
        API_INTERNAL_ORIGIN: 'http://127.0.0.1:4000',
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
        MAIL_TRANSPORT: 'smtp',
        SMTP_HOST: '127.0.0.1',
        SMTP_PORT: '1025',
        MAIL_FROM: 'portfolio@localhost',
        MAIL_TO: 'e2e@localhost',
        CONTACT_RATE_LIMIT: '1000',
        WEB_ORIGIN: webBaseUrl,
        ADMIN_LOGIN_GLOBAL_ATTEMPTS: '1000',
        ADMIN_LOGIN_ATTEMPTS: '1000',
        ANALYTICS_COOKIE_SECRET: 'fictitious-e2e-only-analytics-signing-key',
      },
    },
  ],
});
