//** Login page successful and incorrect login
// **

import process from 'process';
import { test, expect } from '../fixtures/basetest';
import data from '../data.json';


test.describe('Login Tests', () => {


test('@smoke @login successful login using env creds', async ({ loginPage, page }) => {

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
    await loginPage.loginExpectFailure(data.Web_USERNAME, data.Web_InvalidPASSWORD, 'Failed Login Test');
    const error: string = await loginPage.getErrorMessage();
    expect(error).toContain('Invalid');
  });

test('@smoke @login successful login using data creds', async ({ loginPage, page }) => {

  await loginPage.goto();
  await loginPage.login(data.Web_USERNAME, data.Web_PASSWORD, 'Login Test');

  const currentUrl: string = page.url();

  if (!currentUrl.includes('dashboard')) {
      const errorText: string = (await page.locator('.oxd-alert-content-text')
        .textContent()) ?? 'No error message';

    throw new Error(`Login failed. URL: ${currentUrl}, Error: ${errorText}`);
  }

  await expect(page).toHaveURL(/dashboard/);
});

console.log('USERNAME:', data.Web_USERNAME,'PASSWORD:', data.Web_PASSWORD);

});