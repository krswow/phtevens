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

// NFR-03-TC-01: Member can edit bets on their own coupon after submission
test('NFR-03-TC-01: Member can edit their own coupon after submission', async ({ request }) => {
  const token = await loginAs(request, 'marcus');
  const couponId = await submitCoupon(request, token);

  const res = await request.put(`/api/coupons/${couponId}/bets`, {
    headers: { Authorization: `Bearer ${token}` },
    data: {
      bets: [
        { event: 'Arsenal vs Chelsea', prediction: 'Draw', odds: 2.5 },
        { event: 'Lakers vs Bulls', prediction: 'Bulls win', odds: 1.8 },
      ],
    },
  });

  expect(res.status()).toBe(200);

  const couponRes = await request.get(`/api/coupons/${couponId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const coupon = await couponRes.json();
  expect(coupon.bets[0].prediction).toBe('Draw');
  expect(coupon.bets[0].odds).toBeCloseTo(2.5, 2);
});

// NFR-03-TC-02: Member cannot set the result of their own coupon
test('NFR-03-TC-02: Member cannot set result of their own coupon', async ({ request }) => {
  const token = await loginAs(request, 'marcus');
  const couponId = await submitCoupon(request, token);

  const res = await request.patch(`/api/coupons/${couponId}/result`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { result: 'won' },
  });

  expect(res.status()).toBe(403);
});
