import { test, expect } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('Performance_Reports_Test', () => {
    test.beforeEach(async ({ loginPage, dashboardPage }) => {
        await test.step('Initialize pages and login', async () => {
            await loginPage.navigateTo(TestConfig.BASE_URL);
            await loginPage.enterUsername(TestConfig.USERNAME);
            await loginPage.enterPassword(TestConfig.PASSWORD);
            await loginPage.clickLogin();
            await dashboardPage.navigateToModule('Performance');
        });
    });

    test('TC01 - Generate Employee Performance Report @regression', async ({ performancePage }) => {
        const employeeName = 'Script Automation';

        await test.step('Generate Report', async () => {
            await performancePage.navigateToSection('Manage Reviews', 'Employee Reviews');
            await performancePage.typeInField('Employee Name', employeeName);
            await performancePage.selectFromList();
            await performancePage.clickSearch();
            await performancePage.verifySearchTable();
        });
    });
});
