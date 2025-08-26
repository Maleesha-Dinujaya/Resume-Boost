import { test, expect } from '@playwright/test';

test('register, login, access history and logout', async ({ page }) => {
  await page.goto('http://localhost:4173/register');
  await page.fill('input#email', 'user@example.com');
  await page.fill('input#password', 'password');
  await page.click('button:has-text("Register")');

  await page.goto('http://localhost:4173/login');
  await page.fill('input#email', 'user@example.com');
  await page.fill('input#password', 'password');
  await page.click('button:has-text("Login")');

  await page.goto('http://localhost:4173/history');
  await expect(page).toHaveURL(/history/);

  await page.click('text=Logout');
  await page.goto('http://localhost:4173/history');
  await expect(page).toHaveURL(/login/);
});
