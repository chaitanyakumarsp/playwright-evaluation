//** Employee Tests */
import { test, expect } from '../fixtures/basetest';
import data from '../data.json';
test.describe('Employee Tests', () => {

  test.beforeEach(async ({}, testInfo) => {
    console.log(`Starting test: ${testInfo.title}`);
  });

  test('@regression search employee and validate results', async ({
    loginPage,
    dashboardPage,
    employeePage,
    page
  }, testInfo) => {

    await loginPage.goto(testInfo.title);

    // const username: string = process.env.Web_USERNAME ?? '';
    // const password: string = process.env.Web_PASSWORD ?? '';

    //await loginPage.login(username, password, testInfo.title);
    await loginPage.login(data.Web_USERNAME, data.Web_PASSWORD, testInfo.title);
    await dashboardPage.navigateToPIM();

    await page.waitForSelector('h6:has-text("PIM")');

    const employeeName: string = process.env.EMPLOYEE_NAME ?? 'Employee';
    console.log(`Employee test using employeeName='${employeeName}'`);

    await employeePage.searchEmployee(employeeName);

    const noRecords: boolean = await employeePage.isNoRecordsDisplayed();

    if (!noRecords) {
      const names: string[] = await employeePage.getEmployeeNames();
      console.log(`Employee test retrieved names: ${JSON.stringify(names)}`);

      expect(names.length).toBeGreaterThan(0);

      for (const name of names) {
        expect(name).not.toBe('');
      }
    } else {
      expect(noRecords).toBeTruthy();
    }
  });

});