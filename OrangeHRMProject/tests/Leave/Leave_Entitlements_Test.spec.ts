import { test, expect } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('Leave_Entitlements_Test', () => {
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

    test('TC01 - Add Leave Entitlement to Employee @foundation', async ({ leavePage }) => {
        const employeeName = 'Script Automation Tester';
        const leaveType = 'US - Vacation';
        const entitlementDays = '10.00';

        await test.step('Navigate to Add Entitlements', async () => {
            await leavePage.navigateToSection('Entitlements', 'Add Entitlements');
        });

        await test.step('Add Entitlement', async () => {
            await leavePage.typeInField('Employee Name', employeeName);
            await leavePage.selectFromList();
            await leavePage.selectDropdownOption('Leave Type', leaveType);
            await leavePage.typeInField('Entitlement', entitlementDays);
            await leavePage.clickSave();
            await leavePage.clickConfirm();
            await leavePage.verifySuccessToast();
        });
    });

    test('TC02 - Verify Add Entitlement Validation @regression', async ({ leavePage }) => {
        await test.step('Navigate to Add Entitlements', async () => {
            await leavePage.navigateToSection('Entitlements', 'Add Entitlements');
        });

        await test.step('Submit without Required Fields', async () => {
            await leavePage.clickSave();
            await leavePage.verifyFieldError('Employee Name', 'Required');
            await leavePage.verifyFieldError('Leave Type', 'Required');
            await leavePage.verifyFieldError('Entitlement', 'Required');
        });
    });

    test('TC03 - Search Employee Entitlements @regression', async ({ leavePage }) => {
        const employeeName = 'Script Automation Tester';

        await test.step('Navigate to Employee Entitlements', async () => {
            await leavePage.navigateToSection('Entitlements', 'Employee Entitlements');
        });

        await test.step('Search Entitlements', async () => {
            await leavePage.typeInField('Employee Name', employeeName);
            await leavePage.selectFromList();
            await leavePage.clickSearch();
            await leavePage.verifyRecordVisible('US - Vacation');
        });
    });
});
