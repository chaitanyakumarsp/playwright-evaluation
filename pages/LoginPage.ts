import { Page, Locator } from '@playwright/test';
import data from '../data.json';

export class LoginPage {
  private readonly page: Page;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly dashboardMenu: Locator;

  public constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.oxd-alert-content-text');
    this.dashboardMenu = page.locator('span:has-text("PIM")');
  }

  public async goto(testName?: string): Promise<void> {
    const info = testName ? `Test: ${testName} -` : 'Info:';
    console.log(`${info} Navigating to login page`);
    await this.page.goto(data.BASE_URL);
    await this.page.waitForLoadState('domcontentloaded');
    console.log(`${info} Navigation completed`);
  }


public async login(
  username: string,
  password: string,
  testName?: string
): Promise<void> {
  const info = testName ? `Test: ${testName} -` : 'Info:';

  console.log(`${info} Preparing to login`);
  console.log(`${info} Using credentials username='${username}', password='${password}'`);


  // Ensure page is ready
  await this.page.waitForLoadState('domcontentloaded');

  // Enter credentials
  console.log(`${info} Entering username`);
  await this.usernameInput.pressSequentially(username);

  console.log(`${info} Entering password`);
  await this.passwordInput.pressSequentially(password);

  // Click login
  console.log(`${info} Clicking login button`);
  await this.loginButton.click();

  // Wait for either success or error
  const result = await Promise.race([
    this.page.waitForURL(/dashboard/, { timeout: 10000 }).then(() => 'success'),
    this.dashboardMenu.waitFor({ state: 'visible', timeout: 10000 }).then(() => 'success'),
    this.errorMessage.waitFor({ state: 'visible', timeout: 10000 }).then(() => 'error')
  ]);

  // Handle failure explicitly
  if (result === 'error') {
    const errorText = await this.errorMessage.textContent();
    throw new Error(`${info} Login failed: ${errorText ?? 'Unknown error'}`);
  }

  console.log(`${info} Login completed successfully`);
}

  public async getErrorMessage(): Promise<string> {
    return await this.errorMessage.innerText();
  }

  public async loginWithRetry(
  username: string,
  password: string,
  maxRetries: number = 1,
  testName?: string
): Promise<void> {
  const info = testName ? `Test: ${testName} -` : 'Info:';

  for (let attempt: number = 1; attempt <= maxRetries; attempt++) {
    try {
      await this.page.waitForLoadState('domcontentloaded');

      await this.usernameInput.click();
      await this.usernameInput.clear();
      await this.usernameInput.pressSequentially(username, { delay: 100 });

      await this.passwordInput.click();
      await this.passwordInput.clear();
      await this.passwordInput.pressSequentially(password, { delay: 100 });

      await this.loginButton.click();
      await this.page.waitForLoadState('domcontentloaded');

      // Wait for success or failure
      await Promise.race([
        this.page.waitForURL(/dashboard/, { timeout: 2000 }),
        this.dashboardMenu.waitFor({ state: 'visible', timeout: 2000 }),
        this.errorMessage.waitFor({ state: 'visible', timeout: 2000 })
      ]);

      // Check if success
      if (this.page.url().includes('dashboard')) {
        console.log(`${info} Login success on attempt ${attempt}`);
        return;
      }

      console.log(`${info} Login failed on attempt ${attempt}`);

    } catch (error) {
      console.log(`${info} Error on attempt ${attempt}:`, error);
    }

    // Retry if not last attempt
    if (attempt < maxRetries) {
      console.log(`${info} Retrying login...`);
      await this.page.reload();
    }

    await this.page.screenshot({
      path: `login-failure-attempt-${attempt}.png`
    });
  }

  throw new Error(`Login failed after all retry attempts${testName ? ` for test: ${testName}` : ''}`);
}

}