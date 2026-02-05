import { test, expect } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('Dashboard_Widgets_Test', () => {
    test.beforeEach(async ({ loginPage, dashboardPage }) => {
        await test.step('Initialize pages and login', async () => {
            await loginPage.navigateTo(TestConfig.BASE_URL);
            await loginPage.enterUsername(TestConfig.USERNAME);
            await loginPage.enterPassword(TestConfig.PASSWORD);
            await loginPage.clickLogin();
            await dashboardPage.verifyDashboard('Dashboard');
        });
    });

    test('TC01 - Verify Core Dashboard Widgets are Visible @regression', async ({ dashboardPage }) => {
        await test.step('Verify All Widgets', async () => {
            await dashboardPage.verifyElementVisible('Time at Work');
            await dashboardPage.verifyElementVisible('My Actions');
            await dashboardPage.verifyElementVisible('Quick Launch');
            await dashboardPage.verifyElementVisible('Employees on Leave Today');
            await dashboardPage.verifyElementVisible('Employee Distribution by Sub Unit');
            await dashboardPage.verifyElementVisible('Employee Distribution by Location');
        });
    });

    test('TC02 - Verify Quick Launch Shortcuts Redirection @regression', async ({ dashboardPage }) => {
        await test.step('Test Assign Leave Navigation', async () => {
            await dashboardPage.clickQuickItem('Assign Leave');
            await dashboardPage.verifyPageTitle('Leave');
            await dashboardPage.navigateToModule('Dashboard');
        });

        await test.step('Test Leave List Navigation', async () => {
            await dashboardPage.clickQuickItem('Leave List');
            await dashboardPage.verifyPageTitle('Leave');
            await dashboardPage.navigateToModule('Dashboard');
        });

        await test.step('Test Timesheets Navigation', async () => {
            await dashboardPage.clickQuickItem('Timesheets');
            await dashboardPage.verifyPageTitle('Time');
        });
    });

    test('TC03 - Verify Time at Work Stopwatch Integration @regression', async ({ dashboardPage }) => {
        await test.step('Click Time Clock Button', async () => {
            await dashboardPage.clickTimeClockButton();
            await dashboardPage.verifyPageTitle('Attendance');
        });
    });

    test('TC04 - Verify Buzz Latest Posts Widget is Visible @regression', async ({ dashboardPage }) => {
        await test.step('Verify Buzz Latest Posts Widget', async () => {
            await dashboardPage.verifyElementVisible('Buzz Latest Posts');
        });
    });

    test('TC05 - Verify Remaining Quick Launch Shortcuts @regression', async ({ dashboardPage }) => {
        await test.step('Test Apply Leave Navigation', async () => {
            await dashboardPage.clickQuickItem('Apply Leave');
            await dashboardPage.verifyPageTitle('Leave');
            await dashboardPage.navigateToModule('Dashboard');
        });

        await test.step('Test My Leave Navigation', async () => {
            await dashboardPage.clickQuickItem('My Leave');
            await dashboardPage.verifyPageTitle('Leave');
            await dashboardPage.navigateToModule('Dashboard');
        });

        await test.step('Test My Timesheet Navigation', async () => {
            await dashboardPage.clickQuickItem('My Timesheet');
            await dashboardPage.verifyPageTitle('Time');
        });
    });
});
