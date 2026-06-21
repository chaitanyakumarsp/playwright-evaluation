//** Login page successful and incorrect login
// **

import process from 'process';
import { test, expect } from '../fixtures/basetest';


test.describe('Login Tests', () => {
  test.beforeEach(async ({}, testInfo) => {
    console.log(`Starting test: ${testInfo.title}`);
  });

test('@smoke @login successful login', async ({ loginPage, page }, testInfo) => {

  await loginPage.goto(testInfo.title);

const username: string = process.env.Web_USERNAME ?? '';
const password: string = process.env.Web_PASSWORD ?? '';

  await loginPage.loginWithRetry(username, password, 1, testInfo.title);


  const currentUrl: string = page.url();

  if (!currentUrl.includes('dashboard')) {
      const errorText: string = (await page.locator('.oxd-alert-content-text')
        .textContent()) ?? 'No error message';

    throw new Error(`Login failed. URL: ${currentUrl}, Error: ${errorText}`);
  }

  await expect(page).toHaveURL(/dashboard/);
});

  test('@smoke @login failed login', async ({ loginPage }, testInfo) => {
    await loginPage.goto(testInfo.title);

    await loginPage.login('Admin', 'wrongpass', testInfo.title);

    const error: string = await loginPage.getErrorMessage();
    expect(error).toContain('Invalid');
  });

test('@regression @login successful login', async ({ loginPage, page }, testInfo) => {

  await loginPage.goto(testInfo.title);

const username: string = process.env.Web_USERNAME ?? '';
const password: string = process.env.Web_PASSWORD ?? '';

  await loginPage.loginWithRetry(username, password, 1, testInfo.title);


  const currentUrl: string = page.url();

  if (!currentUrl.includes('dashboard')) {
      const errorText: string = (await page.locator('.oxd-alert-content-text')
        .textContent()) ?? 'No error message';

    throw new Error(`Login failed. URL: ${currentUrl}, Error: ${errorText}`);
  }

  await expect(page).toHaveURL(/dashboard/);
});
  test('@regression @login failed login', async ({ loginPage }, testInfo) => {
    await loginPage.goto(testInfo.title);

    await loginPage.login('Admin', 'wrongpass', testInfo.title);

    const error: string = await loginPage.getErrorMessage();
    expect(error).toContain('Invalid');
  });

console.log('USERNAME:', process.env.Web_USERNAME);
console.log('PASSWORD:', process.env.Web_PASSWORD);


});