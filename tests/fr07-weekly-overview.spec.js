import { test, expect } from '@playwright/test';

test.beforeEach(async ({ request }) => {
  await request.post('/api/test/reset');
});

async function loginAs(request, username) {
  const password = username === 'admin' ? 'admin2024' : 'phtevens2024';
  const res = await request.post('/api/auth/login', {
    data: { username, password },
  });
  const { token } = await res.json();
  return token;
}

// FR-07-TC-01: Past week with coupons shows all coupons
test('FR-07-TC-01: Past week with coupons shows all coupons', async ({ request }) => {
  const token = await loginAs(request, 'marcus');

  // Submit 2 coupons for week 5, 2025
  for (let i = 0; i < 2; i++) {
    await request.post('/api/coupons', {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        week: 5, year: 2025,
        bets: [
          { event: `Match ${i}A`, prediction: 'Team A wins', odds: 2.0 },
          { event: `Match ${i}B`, prediction: 'Team B wins', odds: 1.5 },
        ],
      },
    });
  }

  const res = await request.get('/api/coupons?week=5&year=2025', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const coupons = await res.json();

  expect(coupons.length).toBe(2);
});

// FR-07-TC-02: Week with no coupons shows empty overview
test('FR-07-TC-02: Week with no coupons shows empty overview', async ({ request }) => {
  const token = await loginAs(request, 'marcus');

  const res = await request.get('/api/coupons?week=1&year=2000', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const coupons = await res.json();

  expect(coupons.length).toBe(0);
});
