import { test, expect } from '@playwright/test';

// FR-08 — User Login

test('FR-08-TC-01: Valid credentials grant access', async ({ page }) => {
  await page.goto('/');
  await page.fill('#username-input', 'marcus');
  await page.fill('#password-input', 'phtevens2024');
  await page.click('button[type="submit"]');
  await expect(page.locator('#app-page')).toHaveClass(/active/);
  await expect(page.locator('#logged-in-user')).toHaveText('marcus');
});

test('FR-08-TC-02: Invalid password denies access', async ({ page }) => {
  await page.goto('/');
  await page.fill('#username-input', 'marcus');
  await page.fill('#password-input', 'wrongpassword');
  await page.click('button[type="submit"]');
  await expect(page.locator('#login-error')).not.toHaveClass(/hidden/);
  await expect(page.locator('#app-page')).not.toHaveClass(/active/);
});
