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

// FR-05-TC-01: Coupon with total odds 3.0 shows potential winnings of 75.00 DKK
test('FR-05-TC-01: Coupon with total odds 3.0 shows winnings of 75.00 DKK', async ({ request }) => {
  const token = await loginAs(request, 'marcus');
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
  const { id } = await res.json();

  const couponRes = await request.get(`/api/coupons/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const coupon = await couponRes.json();

  expect(coupon.total_odds).toBeCloseTo(3.0, 2);
  expect(coupon.potential_winnings).toBeCloseTo(75.0, 2);
});

// FR-05-TC-02: Coupon with total odds 1.75 shows potential winnings of 43.75 DKK
test('FR-05-TC-02: Coupon with total odds 1.75 shows winnings of 43.75 DKK not 25.00 DKK', async ({ request }) => {
  const token = await loginAs(request, 'marcus');
  const res = await request.post('/api/coupons', {
    headers: { Authorization: `Bearer ${token}` },
    data: {
      week: 1, year: 2025,
      bets: [
        { event: 'Arsenal vs Chelsea', prediction: 'Arsenal win', odds: 1.25 },
        { event: 'Lakers vs Bulls', prediction: 'Lakers win', odds: 1.4 },
      ],
    },
  });
  const { id } = await res.json();

  const couponRes = await request.get(`/api/coupons/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const coupon = await couponRes.json();

  expect(coupon.total_odds).toBeCloseTo(1.75, 2);
  expect(coupon.potential_winnings).toBeCloseTo(43.75, 2);
  expect(coupon.potential_winnings).not.toBeCloseTo(25.0, 2);
});
