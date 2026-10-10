import { test as base, expect } from '@playwright/test';

// Legacy scenarios exercise the site with a deliberate necessary-only preference.
// MOD011 scenarios use the original fixture to cover undecided and accepted states.
export const test = base.extend({
  context: async ({ context }, use) => {
    const response = await context.request.post('/api/v1/privacy/consent', {
      headers: { Origin: 'http://localhost:3000' },
      data: { analytics: false },
    });
    expect(response.ok()).toBe(true);
    await use(context);
  },
});
export { expect };
