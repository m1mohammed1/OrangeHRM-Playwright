import { test as base } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { DashboardPage } from '@pages/DashboardPage';
import { AdminPage } from '@pages/AdminPage';
import { LeavePage } from '@pages/LeavePage';
import { RecruitmentPage } from '@pages/RecruitmentPage';
import { PIMPage } from '@pages/PIMPage';
import { TimePage } from '@pages/TimePage';
import { PerformancePage } from '@pages/PerformancePage';
import { MaintenancePage } from '@pages/MaintenancePage';
import { ClaimPage } from '@pages/ClaimPage';
import { BuzzPage } from '@pages/BuzzPage';
import { DirectoryPage } from '@pages/DirectoryPage';

type MyFixtures = {
    loginPage: LoginPage;
    dashboardPage: DashboardPage;
    adminPage: AdminPage;
    leavePage: LeavePage;
    recruitmentPage: RecruitmentPage;
    pimPage: PIMPage;
    timePage: TimePage;
    performancePage: PerformancePage;
    maintenancePage: MaintenancePage;
    claimPage: ClaimPage;
    buzzPage: BuzzPage;
    directoryPage: DirectoryPage;
};

export const test = base.extend<MyFixtures>({
    
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },

    dashboardPage: async ({ page }, use) => {
        await use(new DashboardPage(page));
    },

    adminPage: async ({ page }, use) => {
        await use(new AdminPage(page));
    },

    leavePage: async ({ page }, use) => {
        await use(new LeavePage(page));
    },

    recruitmentPage: async ({ page }, use) => {
        await use(new RecruitmentPage(page));
    },

    pimPage: async ({ page }, use) => {
        await use(new PIMPage(page));
    },

    timePage: async ({ page }, use) => {
        await use(new TimePage(page));
    },

    performancePage: async ({ page }, use) => {
        await use(new PerformancePage(page));
    },

    maintenancePage: async ({ page }, use) => {
        await use(new MaintenancePage(page));
    },

    claimPage: async ({ page }, use) => {
        await use(new ClaimPage(page));
    },

    buzzPage: async ({ page }, use) => {
        await use(new BuzzPage(page));
    },

    directoryPage: async ({ page }, use) => {
        await use(new DirectoryPage(page));
    },
});

export { expect } from '@playwright/test';