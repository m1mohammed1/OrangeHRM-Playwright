import { test, expect } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('Leave_ApplyLeave_Test', () => {
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

    test('TC01 - Verify Apply Leave Success @regression', async ({ leavePage }) => {
        const leaveType = 'US - Vacation';
        const fromDate = '2025-01-15';
        const toDate = '2025-01-17';

        await test.step('Navigate to Apply', async () => {
            await leavePage.navigateToSection('Apply');
        });

        await test.step('Apply Leave', async () => {
            await leavePage.selectDropdownOption('Leave Type', leaveType);
            await leavePage.typeInField('From Date', fromDate);
            await leavePage.typeInField('To Date', toDate);
            await leavePage.typeInField('Comments', 'Vacation - Automation Test');
            await leavePage.clickSubmit();
            await leavePage.verifySuccessToast();
        });
    });

    test('TC02 - Verify Apply Leave Validation - Empty Fields @regression', async ({ leavePage }) => {
        await test.step('Navigate to Apply', async () => {
            await leavePage.navigateToSection('Apply');
        });

        await test.step('Submit without filling fields', async () => {
            await leavePage.clickSubmit();
            await leavePage.verifyFieldError('Leave Type', 'Required');
            await leavePage.verifyFieldError('From Date', 'Required');
            await leavePage.verifyFieldError('To Date', 'Required');
        });
    });

    test('TC03 - Verify Apply Leave with Half Day @regression', async ({ leavePage }) => {
        const leaveType = 'US - Vacation';
        const date = '2025-01-20';

        await test.step('Navigate to Apply', async () => {
            await leavePage.navigateToSection('Apply');
        });

        await test.step('Apply Half Day Leave', async () => {
            await leavePage.selectDropdownOption('Leave Type', leaveType);
            await leavePage.typeInField('From Date', date);
            await leavePage.typeInField('To Date', date);
            await leavePage.selectDropdownOption('Duration', 'Half Day - Morning');
            await leavePage.typeInField('Comments', 'Half day leave - Auto Test');
            await leavePage.clickSubmit();
            await leavePage.verifySuccessToast();
        });
    });

    test('TC04 - Verify Apply Leave Balance Check @regression', async ({ leavePage }) => {
        const leaveType = 'US - Vacation';

        await test.step('Navigate to Apply and Check Balance', async () => {
            await leavePage.navigateToSection('Apply');
            await leavePage.selectDropdownOption('Leave Type', leaveType);
            await leavePage.verifyElementVisible('Balance');
        });
    });

    test('TC05 - Verify My Leave List Display @regression', async ({ leavePage }) => {
        await test.step('Navigate to My Leave', async () => {
            await leavePage.navigateToSection('My Leave');
            await leavePage.verifySearchTable();
        });
    });

    test('TC06 - Verify My Leave Filter by Status @regression', async ({ leavePage }) => {
        await test.step('Navigate to My Leave', async () => {
            await leavePage.navigateToSection('My Leave');
        });

        await test.step('Filter by Status', async () => {
            await leavePage.selectDropdownOption('Show Leave with Status', 'Pending Approval');
            await leavePage.clickSearch();
            await leavePage.verifySearchTable();
        });
    });

    test('TC07 - Verify My Leave Filter by Date Range @regression', async ({ leavePage }) => {
        const fromDate = '2024-01-01';
        const toDate = '2025-12-31';

        await test.step('Navigate to My Leave', async () => {
            await leavePage.navigateToSection('My Leave');
        });

        await test.step('Filter by Date Range', async () => {
            await leavePage.typeInField('From Date', fromDate);
            await leavePage.typeInField('To Date', toDate);
            await leavePage.clickSearch();
            await leavePage.verifySearchTable();
        });
    });

    test('TC08 - Verify My Leave Cancel Pending Request @regression', async ({ leavePage }) => {
        await test.step('Navigate to My Leave', async () => {
            await leavePage.navigateToSection('My Leave');
        });

        await test.step('Cancel Pending Request', async () => {
            await leavePage.selectDropdownOption('Show Leave with Status', 'Pending Approval');
            await leavePage.clickSearch();
            await leavePage.clickCancel();
            await leavePage.verifySuccessToast();
        });
    });

    test('TC09 - Verify My Leave Reset Filters @regression', async ({ leavePage }) => {
        await test.step('Navigate to My Leave', async () => {
            await leavePage.navigateToSection('My Leave');
        });

        await test.step('Apply and Reset Filters', async () => {
            await leavePage.typeInField('From Date', '2024-01-01');
            await leavePage.typeInField('To Date', '2024-12-31');
            await leavePage.selectDropdownOption('Show Leave with Status', 'Scheduled');
            await leavePage.clickReset();
            await leavePage.verifySearchTable();
        });
    });

    test('TC10 - Verify My Entitlements Display @regression', async ({ leavePage }) => {
        await test.step('Navigate to My Entitlements', async () => {
            await leavePage.navigateToSection('Entitlements', 'My Entitlements');
        });
        await test.step('Filter and Display', async () => {
            await leavePage.selectDropdownOption('Leave Type', 'US - Vacation');
            await leavePage.clickSearch();
            await leavePage.verifySearchTable();
        });
    });
});
