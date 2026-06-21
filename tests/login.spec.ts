//** Login page successful and incorrect login
// **

import process from 'process';
import { test, expect } from '../fixtures/basetest';


test.describe('Login Tests', () => {


test('@smoke @login successful login', async ({ loginPage, page }) => {

  await loginPage.goto();

const username: string = process.env.Web_USERNAME ?? '';
const password: string = process.env.Web_PASSWORD ?? '';

  await loginPage.loginWithRetry(username, password);


  const currentUrl: string = page.url();

  if (!currentUrl.includes('dashboard')) {
      const errorText: string = (await page.locator('.oxd-alert-content-text')
        .textContent()) ?? 'No error message';

    throw new Error(`Login failed. URL: ${currentUrl}, Error: ${errorText}`);
  }

  await expect(page).toHaveURL(/dashboard/);
});

  test('@smoke @login failed login', async ({ loginPage }) => {
    await loginPage.goto();

    await loginPage.login('Admin', 'wrongpass');

    const error: string = await loginPage.getErrorMessage();
    expect(error).toContain('Invalid');
  });

test('@regression @login successful login', async ({ loginPage, page }) => {

  await loginPage.goto();

const username: string = process.env.Web_USERNAME ?? '';
const password: string = process.env.Web_PASSWORD ?? '';

  await loginPage.loginWithRetry(username, password);


  const currentUrl: string = page.url();

  if (!currentUrl.includes('dashboard')) {
      const errorText: string = (await page.locator('.oxd-alert-content-text')
        .textContent()) ?? 'No error message';

    throw new Error(`Login failed. URL: ${currentUrl}, Error: ${errorText}`);
  }

  await expect(page).toHaveURL(/dashboard/);
});
  test('@regression @login failed login', async ({ loginPage }) => {
    await loginPage.goto();

    await loginPage.login('Admin', 'wrongpass');

    const error: string = await loginPage.getErrorMessage();
    expect(error).toContain('Invalid');
  });

console.log('USERNAME:', process.env.USERNAME);
console.log('PASSWORD:', process.env.PASSWORD);


});