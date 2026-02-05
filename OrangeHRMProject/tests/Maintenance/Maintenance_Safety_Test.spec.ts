import { test, expect } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('Maintenance_Safety_Test', () => {
    test.beforeEach(async ({ loginPage, dashboardPage }) => {
        await test.step('Initialize pages and login', async () => {
            await loginPage.navigateTo(TestConfig.BASE_URL);
            await loginPage.enterUsername(TestConfig.USERNAME);
            await loginPage.enterPassword(TestConfig.PASSWORD);
            await loginPage.clickLogin();
            await dashboardPage.navigateToModule('Maintenance');
        });
    });

    test('TC01 - Verify Cancel Button on Password Screen @regression', async ({ maintenancePage, dashboardPage }) => {
        await test.step('Cancel Password Entry', async () => {
            await maintenancePage.clickCancel();
            await dashboardPage.verifyDashboard('Dashboard');
        });
    });

    test('TC02 - Verify Canceling Purge Action in Modal @regression', async ({ maintenancePage }) => {
        const employeeName = 'Dev Ops Trem';

        await test.step('Verify Access Password', async () => {
            await maintenancePage.verifyAccessPassword(TestConfig.PASSWORD);
        });

        await test.step('Navigate to Purge Employee Records', async () => {
            await maintenancePage.navigateToSection('Purge Records', 'Employee Records');
            await maintenancePage.typeInField('Past Employee', employeeName);
            await maintenancePage.selectFromList();
            await maintenancePage.clickSearch();
        });
        await test.step('Select and Cancel Delete', async () => {
            await maintenancePage.clickPurge();
            await maintenancePage.clickNoCancel();
            await maintenancePage.verifySearchTable();
        });
    });

    test('TC03 - Verify All Vacancy @regression', async ({ maintenancePage }) => {
        await test.step('Verify Access Password', async () => {
            await maintenancePage.verifyAccessPassword(TestConfig.PASSWORD);
        });
        await test.step('Navigate to Purge Candidate Records', async () => {
            await maintenancePage.navigateToSection('Purge Records', 'Candidate Records');
            await maintenancePage.clickSearch();
        });
        await test.step('Select All Vacancy', async () => {
            await maintenancePage.typeInField("Vacancy", "Senior QA Lead");
            await maintenancePage.selectFromList();
            await maintenancePage.clickSearch();
        });
    });
});
