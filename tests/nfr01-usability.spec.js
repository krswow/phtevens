import { test, expect } from '@playwright/test';

async function login(page) {
  await page.goto('/');
  await page.fill('#username-input', 'marcus');
  await page.fill('#password-input', 'phtevens2024');
  await page.click('button[type="submit"]');
  await expect(page.locator('#app-page')).toHaveClass(/active/);
}

// NFR-01-TC-01: Application is usable on mobile (375px width)
test('NFR-01-TC-01: Application is usable on mobile (375px width)', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await login(page);

  await expect(page.locator('header h1')).toBeVisible();
  await expect(page.locator('#logout-btn')).toBeVisible();
  await expect(page.locator('#submit-coupon')).toBeVisible();
  await expect(page.locator('#weekly-bets')).toBeVisible();
  await expect(page.locator('#leaderboard')).toBeVisible();
});

// NFR-01-TC-02: No content cut off when resized to 375px
test('NFR-01-TC-02: No content cut off when resized to 375px', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await login(page);

  const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
  expect(bodyWidth).toBeLessThanOrEqual(375);
});
