import { test, expect } from '@playwright/test';

test.beforeEach(async ({ request }) => {
  await request.post('/api/test/reset');
});

// FR-10 — Administrator Permissions

test('FR-10-TC-01: Administrator can register a coupon result', async ({ request }) => {
  // Login as marcus and submit a coupon
  const loginMarcus = await request.post('/api/auth/login', {
    data: { username: 'marcus', password: 'phtevens2024' },
  });
  const { token: marcusToken } = await loginMarcus.json();
  const couponRes = await request.post('/api/coupons', {
    headers: { Authorization: `Bearer ${marcusToken}` },
    data: {
      week: 3, year: 2099,
      bets: [{ event: 'Arsenal vs Chelsea', prediction: 'Arsenal win', odds: 2.0 }],
    },
  });
  const { id: couponId } = await couponRes.json();

  // Login as admin and set result
  const loginAdmin = await request.post('/api/auth/login', {
    data: { username: 'admin', password: 'admin2024' },
  });
  const { token: adminToken } = await loginAdmin.json();
  const res = await request.patch(`/api/coupons/${couponId}/result`, {
    headers: { Authorization: `Bearer ${adminToken}` },
    data: { result: 'won' },
  });
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.success).toBeTruthy();
});

test('FR-10-TC-02: Member cannot register a coupon result', async ({ request }) => {
  // Login as marcus and submit a coupon
  const login = await request.post('/api/auth/login', {
    data: { username: 'marcus', password: 'phtevens2024' },
  });
  const { token } = await login.json();
  const couponRes = await request.post('/api/coupons', {
    headers: { Authorization: `Bearer ${token}` },
    data: {
      week: 4, year: 2099,
      bets: [{ event: 'Arsenal vs Chelsea', prediction: 'Arsenal win', odds: 2.0 }],
    },
  });
  const { id: couponId } = await couponRes.json();

  // Try to set result as member
  const res = await request.patch(`/api/coupons/${couponId}/result`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { result: 'won' },
  });
  expect(res.status()).toBe(403);
});
