import { Page, Locator } from '@playwright/test';
import data from '../data.json';

export class LoginPage {
  private readonly page: Page;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
   readonly dashboardMenu: Locator;
  static dashboardMenu: Locator;

  public constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.oxd-alert-content-text');  
    this.dashboardMenu = page.getByRole('link', { name: 'PIM' });

  }

  public async goto(testName?: string): Promise<void> {
    const info = testName ? `Test: ${testName} -` : 'Info:';
    console.log(`${info} Navigating to login page`);
    await this.page.goto(data.BASE_URL, { timeout: 120000 });
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

  public async loginExpectFailure(username: string,password: string,testName?: string): Promise<string> {
    const info = testName ? `Test: ${testName} -` : 'Info:';
    console.log(`${info} Failure login check`);

    await this.page.waitForLoadState('domcontentloaded');
    await this.usernameInput.pressSequentially(username, { delay: 100 });
    await this.passwordInput.pressSequentially(password, { delay: 100 });
    await this.loginButton.click();
    console.log(`${info} Waiting for login failure message`);
    const errorText = await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 })
      .then(() => this.errorMessage.textContent())
      .catch(() => null);

    const dashboardVisible = await this.dashboardMenu.isVisible().catch(() => false);
    if (dashboardVisible) {
      throw new Error(`${info} Expected login failure but dashboard was displayed`);
    }

    if (!errorText) {
      throw new Error(`${info} Login failed, but no error message was displayed`);
    }

    const trimmedError = errorText.trim();
    console.log(`${info} Login failed as expected: ${trimmedError}`);
    return trimmedError;
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
        await this.page.waitForLoadState('load'),
        await this.page.waitForURL(/dashboard/, { timeout: 5000 }),
        await this.dashboardMenu.waitFor({ state: 'visible', timeout: 5000 }),
         this.errorMessage.waitFor({ state: 'visible', timeout: 5000 })
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