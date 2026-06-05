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

async function submitCoupon(request, token, odds1, odds2) {
  const res = await request.post('/api/coupons', {
    headers: { Authorization: `Bearer ${token}` },
    data: {
      week: 1, year: 2025,
      bets: [
        { event: 'Match A', prediction: 'Team A wins', odds: odds1 },
        { event: 'Match B', prediction: 'Team B wins', odds: odds2 },
      ],
    },
  });
  const body = await res.json();
  return body.id;
}

// FR-06-TC-01: Member with 2 won coupons shows correct standings
test('FR-06-TC-01: Member with 2 won coupons shows correct standings', async ({ request }) => {
  const marcusToken = await loginAs(request, 'marcus');
  const adminToken = await loginAs(request, 'admin');

  // Submit 2 coupons for marcus (odds 2.0 × 1.5 = 3.0 → 75 DKK each)
  const id1 = await submitCoupon(request, marcusToken, 2.0, 1.5);
  const id2 = await submitCoupon(request, marcusToken, 2.0, 1.5);

  // Mark both as won
  await request.patch(`/api/coupons/${id1}/result`, {
    headers: { Authorization: `Bearer ${adminToken}` },
    data: { result: 'won' },
  });
  await request.patch(`/api/coupons/${id2}/result`, {
    headers: { Authorization: `Bearer ${adminToken}` },
    data: { result: 'won' },
  });

  const res = await request.get('/api/standings', {
    headers: { Authorization: `Bearer ${marcusToken}` },
  });
  const standings = await res.json();

  const marcus = standings.find(m => m.username === 'marcus');
  expect(marcus).toBeTruthy();
  expect(marcus.won).toBe(2);
  expect(marcus.winnings).toBeCloseTo(150.0, 2);

  // Marcus should be ranked first
  expect(standings[0].username).toBe('marcus');
});

// FR-06-TC-02: Member with no wins ranked below member with wins
test('FR-06-TC-02: Member with no wins ranked below member with wins', async ({ request }) => {
  const marcusToken = await loginAs(request, 'marcus');
  const leilaToken = await loginAs(request, 'leila');
  const adminToken = await loginAs(request, 'admin');

  // Marcus wins a coupon
  const id = await submitCoupon(request, marcusToken, 2.0, 1.5);
  await request.patch(`/api/coupons/${id}/result`, {
    headers: { Authorization: `Bearer ${adminToken}` },
    data: { result: 'won' },
  });

  const res = await request.get('/api/standings', {
    headers: { Authorization: `Bearer ${leilaToken}` },
  });
  const standings = await res.json();

  const marcusIdx = standings.findIndex(m => m.username === 'marcus');
  const leilaIdx = standings.findIndex(m => m.username === 'leila');
  expect(marcusIdx).toBeLessThan(leilaIdx);
});
