import { test, expect } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('Leave_Reports_Test', () => {
    test.beforeEach(async ({ loginPage, dashboardPage }) => {
        await test.step('Initialize pages and login', async () => {
            await loginPage.navigateTo(TestConfig.BASE_URL);
            await loginPage.enterUsername(TestConfig.USERNAME);
            await loginPage.enterPassword(TestConfig.PASSWORD);
            await loginPage.clickLogin();
            await dashboardPage.verifyDashboard('Dashboard');
            await dashboardPage.navigateToModule('Leave');
        });
    });

    test('TC01 - Generate Leave Entitlements and Usage Report @regression', async ({ leavePage }) => {
        await test.step('Navigate to Reports', async () => {
            await leavePage.navigateToSection('Reports', 'Leave Entitlements and Usage Report');
        });

        await test.step('Generate Report', async () => {
            await leavePage.selectDropdownOption('Leave Type', 'US - Vacation');
            await leavePage.selectDropdownOption('Job Title', 'Software Engineer');
            await leavePage.clickGenerate();
            await leavePage.verifySearchTable();
        });
    });

    test('TC02 - Generate My Leave Entitlements Report @regression', async ({ leavePage }) => {
        await test.step('Navigate and Generate Report', async () => {
            await leavePage.navigateToSection('Reports', 'My Leave Entitlements and Usage Report');
            await leavePage.verifySearchTable();
        });
    });
});
