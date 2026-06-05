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

async function submitCoupon(request, token) {
  const now = new Date();
  const res = await request.post('/api/coupons', {
    headers: { Authorization: `Bearer ${token}` },
    data: {
      week: 1, year: 2025,
      bets: [
        { event: 'Arsenal vs Chelsea', prediction: 'Arsenal win', odds: 2.0 },
        { event: 'Lakers vs Bulls', prediction: 'Lakers win', odds: 1.5 },
      ],
    },
  });
  const body = await res.json();
  return body.id;
}

// FR-04-TC-01: Administrator registers a coupon result as won
test('FR-04-TC-01: Administrator registers a coupon result as won', async ({ request }) => {
  const memberToken = await loginAs(request, 'marcus');
  const couponId = await submitCoupon(request, memberToken);

  const adminToken = await loginAs(request, 'admin');
  const res = await request.patch(`/api/coupons/${couponId}/result`, {
    headers: { Authorization: `Bearer ${adminToken}` },
    data: { result: 'won' },
  });

  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.success).toBe(true);

  const couponRes = await request.get(`/api/coupons/${couponId}`, {
    headers: { Authorization: `Bearer ${memberToken}` },
  });
  const coupon = await couponRes.json();
  expect(coupon.result).toBe('won');
});

// FR-04-TC-02: Member cannot register a coupon result
test('FR-04-TC-02: Member cannot register a coupon result', async ({ request }) => {
  const memberToken = await loginAs(request, 'marcus');
  const couponId = await submitCoupon(request, memberToken);

  const res = await request.patch(`/api/coupons/${couponId}/result`, {
    headers: { Authorization: `Bearer ${memberToken}` },
    data: { result: 'won' },
  });

  expect(res.status()).toBe(403);
});
