import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { EmployeeListPage } from '../pages/EmployeeListPage';

type MyFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  employeePage: EmployeeListPage;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }: { page: Page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }: { page: Page }, use) => {
    await use(new DashboardPage(page));
  },

  employeePage: async ({ page }: { page: Page }, use) => {
    await use(new EmployeeListPage(page));
  }
});

export const expect = test.expect;