import { test, expect } from '@playwright/test';

// NFR-02-TC-01: Application loads outside business hours
test('NFR-02-TC-01: Application loads outside business hours', async ({ request }) => {
  const res = await request.get('/');
  expect(res.status()).toBe(200);
});

// NFR-02-TC-02: Application remains available after deployment
test('NFR-02-TC-02: Application remains available after deployment', async ({ request }) => {
  const res = await request.get('/api/standings', {
    headers: { Authorization: 'Bearer invalid' },
  });
  // Server is up and responding (401 means it's running, not down)
  expect([200, 401]).toContain(res.status());
});
