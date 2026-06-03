import { test, expect } from '@playwright/test';

test.beforeEach(async ({ request }) => {
  await request.post('/api/test/reset');
});

// FR-09 — Member Permissions

test('FR-09-TC-01: Member can view all members coupons', async ({ request }) => {
  // Login as marcus and submit a coupon
  const loginMarcus = await request.post('/api/auth/login', {
    data: { username: 'marcus', password: 'phtevens2024' },
  });
  const { token: marcusToken } = await loginMarcus.json();
  await request.post('/api/coupons', {
    headers: { Authorization: `Bearer ${marcusToken}` },
    data: {
      week: 5, year: 2099,
      bets: [{ event: 'Arsenal vs Chelsea', prediction: 'Arsenal win', odds: 2.0 }],
    },
  });

  // Login as leila and submit a coupon
  const loginLeila = await request.post('/api/auth/login', {
    data: { username: 'leila', password: 'phtevens2024' },
  });
  const { token: leilaToken } = await loginLeila.json();
  await request.post('/api/coupons', {
    headers: { Authorization: `Bearer ${leilaToken}` },
    data: {
      week: 5, year: 2099,
      bets: [{ event: 'Lakers vs Bulls', prediction: 'Lakers win', odds: 2.0 }],
    },
  });

  // Marcus fetches all coupons — should see both
  const res = await request.get('/api/coupons?week=5&year=2099', {
    headers: { Authorization: `Bearer ${marcusToken}` },
  });
  const coupons = await res.json();
  expect(res.status()).toBe(200);
  expect(coupons.length).toBe(2);
  const usernames = coupons.map(c => c.username);
  expect(usernames).toContain('marcus');
  expect(usernames).toContain('leila');
});

test('FR-09-TC-02: Member cannot submit a coupon on behalf of another member', async ({ request }) => {
  // Login as leila
  const loginLeila = await request.post('/api/auth/login', {
    data: { username: 'leila', password: 'phtevens2024' },
  });
  const { token: leilaToken, user: leilaUser } = await loginLeila.json();

  // Login as marcus to get his ID
  const loginMarcus = await request.post('/api/auth/login', {
    data: { username: 'marcus', password: 'phtevens2024' },
  });
  const { user: marcusUser } = await loginMarcus.json();

  // Leila tries to submit a coupon with marcus's user_id — server ignores it and uses authenticated user
  const res = await request.post('/api/coupons', {
    headers: { Authorization: `Bearer ${leilaToken}` },
    data: {
      week: 6, year: 2099,
      user_id: marcusUser.id,
      bets: [{ event: 'Arsenal vs Chelsea', prediction: 'Arsenal win', odds: 2.0 }],
    },
  });
  expect(res.status()).toBe(201);
  const { id } = await res.json();

  // Verify coupon belongs to leila, not marcus
  const coupon = await request.get(`/api/coupons/${id}`, {
    headers: { Authorization: `Bearer ${leilaToken}` },
  });
  const data = await coupon.json();
  expect(data.username).toBe('leila');
});
