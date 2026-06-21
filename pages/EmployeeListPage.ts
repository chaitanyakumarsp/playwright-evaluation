import { Page, Locator } from '@playwright/test';

export class EmployeeListPage {
    private readonly page: Page;
    private readonly employeeSearchInput: Locator;
    private readonly searchButton: Locator;
    private readonly tableRows: Locator;
    private readonly noRecordsMessage: Locator;


    public constructor(page: Page) {
        this.page = page;
        
this.employeeSearchInput = page
  .locator('label:has-text("Employee Name")')
  .locator('xpath=following::input[1]');

        this.searchButton = page.locator('button[type="submit"]');
        this.tableRows = page.locator('.oxd-table-body .oxd-table-row');
        this.noRecordsMessage = page.locator('.oxd-text').filter({ hasText: 'No Records Found' });
    }

    public async isNoRecordsDisplayed(): Promise<boolean> {
        const visible = await this.noRecordsMessage.isVisible().catch((): boolean => false);
        console.log(`EmployeeListPage: isNoRecordsDisplayed -> ${visible}`);
        return visible;
    }



    public async searchEmployee(name: string): Promise<void> {

        console.log(`EmployeeListPage: searchEmployee -> querying for '${name}'`);
        await this.page.waitForLoadState('domcontentloaded');
        await this.employeeSearchInput.click();
        await this.employeeSearchInput.fill(''); // clear
        await this.employeeSearchInput.pressSequentially(name);

        // Wait for dropdown
        try {
            await this.page.locator('.oxd-autocomplete-dropdown').waitFor({ state: 'visible', timeout: 2000 });
            console.log('EmployeeListPage: autocomplete dropdown visible');
        } catch (e) {
            console.log('EmployeeListPage: autocomplete dropdown did not appear');
        }

        await this.searchButton.click();
        console.log('EmployeeListPage: clicked search button');

        //Wait for results
        await this.page.waitForSelector('.oxd-table-body', { timeout: 5000 });
        console.log('EmployeeListPage: results table loaded');
    }



    public async getEmployeeNames(): Promise<string[]> {
        const names: string[] = [];

        console.log('EmployeeListPage: getEmployeeNames -> collecting names from table');
        await this.page.waitForSelector('.oxd-table-body .oxd-table-row', { timeout: 10000 });

        const rowCount: number = await this.tableRows.count();
        console.log(`EmployeeListPage: found ${rowCount} table rows`);

        for (let i: number = 0; i < rowCount; i++) {
            const row: Locator = this.tableRows.nth(i);


            const cells: Locator = row.locator('.oxd-table-cell');

            const cellCount: number = await cells.count();
            if (cellCount < 3) {
                continue; // Skip rows that don't have enough cells
            }

            const namecell: Locator = cells.nth(2); 
            //correct column selector

            const name: string = (await namecell.innerText()).trim();
            names.push(name);
        }

        return names;
    }
}