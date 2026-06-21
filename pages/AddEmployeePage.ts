import { Page, Locator } from '@playwright/test';

export class AddEmployeePage {
  private readonly page: Page;
  private readonly firstName: Locator;
  private readonly lastName: Locator;
  private readonly saveButton: Locator;

  public constructor(page: Page) {
    this.page = page;
    this.firstName = page.locator('input[name="firstName"]');
    this.lastName = page.locator('input[name="lastName"]');
    this.saveButton = page.locator('button[type="submit"]');
  }

  public async addEmployee(first: string, last: string): Promise<void> {
    await this.firstName.fill(first);
    await this.lastName.fill(last);
    await this.saveButton.click();
  }
}