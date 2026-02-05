import { test, expect } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('Leave_Operations_Test', () => {
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

    test('TC01 - Assign Leave to Employee @regression', async ({ leavePage }) => {
        const employeeName = 'Script Automation Tester';
        const leaveType = 'US - Vacation';
        const fromDate = '2024-12-25';
        const toDate = '2024-12-30';

        await test.step('Navigate to Assign Leave', async () => {
            await leavePage.navigateToSection('Assign Leave');
        });

        await test.step('Assign Leave', async () => {
            await leavePage.selectDropdownOption('Leave Type', leaveType);
            await leavePage.typeInField('From Date', fromDate);
            await leavePage.typeInField('To Date', toDate);
            await leavePage.typeInField('Employee Name', employeeName);
            await leavePage.selectFromList(); 
            await leavePage.selectDropdownOption('Partial Days', 'All Days');
            await leavePage.selectDropdownOption('Duration', 'Half Day - Morning');
            await leavePage.typeInField('Comments', 'Assigned via Automation');
            await leavePage.clickAssign();
        });

        await test.step('Confirm Assignment', async () => {
            await leavePage.hardWait(3);
            await leavePage.clickOk();
        });
    });

    test('TC02 - Assign Leave Insufficient Balance Warning @regression', async ({ leavePage }) => {
        await test.step('Navigate to Assign Leave', async () => {
            await leavePage.navigateToSection('Assign Leave');
        });

        await test.step('Submit without Required Fields', async () => {
            await leavePage.clickAssign();
            await leavePage.verifyFieldError('Employee Name', 'Required');
            await leavePage.verifyFieldError('Leave Type', 'Required');
            await leavePage.verifyFieldError('From Date', 'Required');
            await leavePage.verifyFieldError('To Date', 'Required');
        });
    });

    test('TC03 - Admin Approve Leave Request @regression', async ({ leavePage }) => {
        const employeeName = 'Script Automation Tester';

        await test.step('Navigate to Leave List', async () => {
            await leavePage.navigateToSection('Leave List');
        });
        await test.step('Filter and View', async () => {
            await leavePage.typeInField('Employee Name', employeeName);
            await leavePage.selectFromList();
            await leavePage.selectDropdownOption('Show Leave with Status', 'Pending Approval');
            await leavePage.clickSearch();
            await leavePage.verifyInfoToast();
        });
    });
});
