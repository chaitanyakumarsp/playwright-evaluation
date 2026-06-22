//** Login page successful and incorrect login
// **

import process from 'process';
import { test, expect } from '../fixtures/basetest';
import data from '../data.json';


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
  await loginPage.login(data.Web_USERNAME, data.Web_PASSWORD, 'Login Test');
  await loginPage.loginWithRetry(data.Web_USERNAME, data.Web_PASSWORD);

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

console.log('USERNAME:', data.Web_USERNAME);
console.log('PASSWORD:', data.Web_PASSWORD);


});