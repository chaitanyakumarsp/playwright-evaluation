import { Page, Locator, expect } from '@playwright/test';


export class DashboardPage {
  private readonly page: Page;
  private readonly pimMenu: Locator;

  public constructor(page: Page) {
    this.page = page;
    this.pimMenu = page.getByRole('link', { name: 'PIM' }); 
  }

  public async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  
public async navigateToPIM(): Promise<void> {
  await this.page.waitForLoadState('domcontentloaded');
  await this.pimMenu.waitFor({ state: 'visible', timeout: 10000 });
  await this.pimMenu.click();
  await expect(this.page).toHaveURL(/viewEmployeeList/);

  //Ensure page loaded
  await this.page.waitForLoadState('domcontentloaded');
}

}