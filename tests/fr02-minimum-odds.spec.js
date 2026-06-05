import { test, expect } from '@playwright/test';

test.beforeEach(async ({ request }) => {
  await request.post('/api/test/reset');
});

// FR-02-TC-01: Coupon with total odds 3.0 is accepted
test('FR-02-TC-01: Coupon with total odds 3.0 is accepted', async ({ request }) => {
  const loginRes = await request.post('/api/auth/login', {
    data: { username: 'marcus', password: 'phtevens2024' },
  });
  const { token } = await loginRes.json();

  const res = await request.post('/api/coupons', {
    headers: { Authorization: `Bearer ${token}` },
    data: {
      week: 1,
      year: 2025,
      bets: [
        { event: 'Arsenal vs Chelsea', prediction: 'Arsenal win', odds: 2.0 },
        { event: 'Lakers vs Bulls', prediction: 'Lakers win', odds: 1.5 },
      ],
    },
  });

  expect(res.status()).toBe(201);
  const body = await res.json();
  expect(body.id).toBeTruthy();
});

// FR-02-TC-02: Coupon with total odds 1.56 is rejected
test('FR-02-TC-02: Coupon with total odds 1.56 is rejected with minimum odds message', async ({ request }) => {
  const loginRes = await request.post('/api/auth/login', {
    data: { username: 'marcus', password: 'phtevens2024' },
  });
  const { token } = await loginRes.json();

  const res = await request.post('/api/coupons', {
    headers: { Authorization: `Bearer ${token}` },
    data: {
      week: 1,
      year: 2025,
      bets: [
        { event: 'Arsenal vs Chelsea', prediction: 'Arsenal win', odds: 1.2 },
        { event: 'Lakers vs Bulls', prediction: 'Lakers win', odds: 1.3 },
      ],
    },
  });

  expect(res.status()).toBe(400);
  const body = await res.json();
  expect(body.error).toMatch(/1\.75/);
});
