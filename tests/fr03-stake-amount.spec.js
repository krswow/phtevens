import { test, expect } from '@playwright/test';

test.beforeEach(async ({ request }) => {
  await request.post('/api/test/reset');
});

async function login(page) {
  await page.goto('/');
  await page.fill('#username-input', 'marcus');
  await page.fill('#password-input', 'phtevens2024');
  await page.click('button[type="submit"]');
  await expect(page.locator('#app-page')).toHaveClass(/active/);
}

function getCurrentWeek() {
  const now = new Date();
  const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return { week: Math.ceil((((d - yearStart) / 86400000) + 1) / 7), year: now.getFullYear() };
}

async function submitCoupon(request) {
  const loginRes = await request.post('/api/auth/login', {
    data: { username: 'marcus', password: 'phtevens2024' },
  });
  const { token } = await loginRes.json();
  const { week, year } = getCurrentWeek();
  const res = await request.post('/api/coupons', {
    headers: { Authorization: `Bearer ${token}` },
    data: {
      week,
      year,
      bets: [
        { event: 'Arsenal vs Chelsea', prediction: 'Arsenal win', odds: 2.0 },
        { event: 'Lakers vs Bulls', prediction: 'Lakers win', odds: 1.5 },
      ],
    },
  });
  return res.json();
}

// FR-03-TC-01: Coupon displays a stake of 25 DKK
test('FR-03-TC-01: Coupon displays a stake of 25 DKK', async ({ page, request }) => {
  await submitCoupon(request);
  await login(page);

  await expect(page.locator('.coupon-meta')).toContainText('Stake: 25 DKK');
});

// FR-03-TC-02: Stake field is not editable
test('FR-03-TC-02: Stake field is not editable', async ({ page }) => {
  await login(page);

  const stakeInput = page.locator('input[name="stake"], #stake-input, .stake-input');
  await expect(stakeInput).toHaveCount(0);
});
