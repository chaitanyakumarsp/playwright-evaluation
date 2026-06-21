import { Page, Locator } from '@playwright/test';

export class DashboardPage {
  private readonly page: Page;
  private readonly pimMenu: Locator;

  public constructor(page: Page) {
    this.page = page;
    this.pimMenu = page.locator('span:has-text("PIM")');
  }

  public async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  
public async navigateToPIM(): Promise<void> {
  await this.pimMenu.waitFor({ state: 'visible', timeout: 10000 });
  await this.pimMenu.click();

  //Ensure page loaded
  await this.page.waitForLoadState('domcontentloaded');
}

}