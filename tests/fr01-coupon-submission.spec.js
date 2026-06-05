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

// FR-01-TC-01: Member submits a coupon with 2 bets from different sports
test('FR-01-TC-01: Member submits a coupon with 2 bets from different sports', async ({ page }) => {
  await login(page);

  await page.fill('.bet-event', 'Arsenal vs Chelsea');
  await page.fill('.bet-prediction', 'Arsenal win');
  await page.fill('.bet-odds', '2.0');

  await page.click('#add-bet-btn');

  const rows = page.locator('.bet-input-row');
  await rows.nth(1).locator('.bet-event').fill('Lakers vs Bulls');
  await rows.nth(1).locator('.bet-prediction').fill('Lakers win');
  await rows.nth(1).locator('.bet-odds').fill('2.0');

  await page.click('#submit-coupon-btn');

  await expect(page.locator('#submit-coupon-success')).not.toHaveClass(/hidden/);
  await expect(page.locator('#coupons-list .coupon-card')).toHaveCount(1);
  await expect(page.locator('.coupon-member')).toHaveText('marcus');
});

// FR-01-TC-02: Member submits a coupon with no bets
test('FR-01-TC-02: Member submits a coupon with no bets — rejected', async ({ page, request }) => {
  await login(page);

  await page.fill('.bet-event', '');
  await page.fill('.bet-prediction', '');
  await page.fill('.bet-odds', '');

  await page.click('#submit-coupon-btn');

  await expect(page.locator('#submit-coupon-error')).not.toHaveClass(/hidden/);
  await expect(page.locator('#submit-coupon-success')).toHaveClass(/hidden/);
});
