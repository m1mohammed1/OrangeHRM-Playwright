import { test, expect } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('Leave_LeaveList_Test', () => {
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

    test('TC01 - Verify Leave List Display @regression', async ({ leavePage }) => {
        await test.step('Navigate and Verify Display', async () => {
            await leavePage.navigateToSection('Leave List');
            await leavePage.verifySearchTable();
        });
    });

    test('TC02 - Verify Leave List Filter by Date @regression', async ({ leavePage }) => {
        const fromDate = '2024-01-01';
        const toDate = '2025-12-31';

        await test.step('Filter by Date', async () => {
            await leavePage.navigateToSection('Leave List');
            await leavePage.typeInField('From Date', fromDate);
            await leavePage.typeInField('To Date', toDate);
            await leavePage.clickSearch();
            await leavePage.verifySearchTable();
        });
    });

    test('TC03 - Verify Leave List Filter by Status @regression', async ({ leavePage }) => {
        await test.step('Filter by Status', async () => {
            await leavePage.navigateToSection('Leave List');
            await leavePage.selectDropdownOption('Show Leave with Status', 'Pending Approval');
            await leavePage.clickSearch();
            await leavePage.verifySearchTable();
        });
    });

    test('TC04 - Verify Leave List Filter by Employee @regression', async ({ leavePage }) => {
        const employeeName = 'Script Automation Tester';

        await test.step('Filter by Employee', async () => {
            await leavePage.navigateToSection('Leave List');
            await leavePage.typeInField('Employee Name', employeeName);
            await leavePage.selectFromList();
            await leavePage.clickSearch();
            await leavePage.verifySearchTable();
        });
    });

    test('TC05 - Verify Leave List Filter by Leave Type @regression', async ({ leavePage }) => {
        await test.step('Filter by Leave Type', async () => {
            await leavePage.navigateToSection('Leave List');
            await leavePage.selectDropdownOption('Leave Type', 'US - Vacation');
            await leavePage.clickSearch();
            await leavePage.verifySearchTable();
        });
    });

    test('TC06 - Verify Leave List Filter by Sub Unit @regression', async ({ leavePage }) => {
        await test.step('Filter by Sub Unit', async () => {
            await leavePage.navigateToSection('Leave List');
            await leavePage.selectDropdownOption('Sub Unit', 'Engineering');
            await leavePage.clickSearch();
            await leavePage.verifySearchTable();
        });
    });

    test('TC07 - Verify Leave Approve Action @regression', async ({ leavePage }) => {
        await test.step('Approve Leave', async () => {
            await leavePage.navigateToSection('Leave List');
            await leavePage.selectDropdownOption('Show Leave with Status', 'Pending Approval');
            await leavePage.clickSearch();
            await leavePage.clickApprove();
            await leavePage.verifySuccessToast();
        });
    });

    test('TC08 - Verify Leave Reject Action @regression', async ({ leavePage }) => {
        await test.step('Reject Leave', async () => {
            await leavePage.navigateToSection('Leave List');
            await leavePage.selectDropdownOption('Show Leave with Status', 'Pending Approval');
            await leavePage.clickSearch();
            await leavePage.clickReject();
            await leavePage.verifySuccessToast();
        });
    });

    test('TC09 - Verify Leave Cancel Action @regression', async ({ leavePage }) => {
        await test.step('Cancel Leave', async () => {
            await leavePage.navigateToSection('Leave List');
            await leavePage.selectDropdownOption('Show Leave with Status', 'Scheduled');
            await leavePage.clickSearch();
            await leavePage.clickCancel();
            await leavePage.verifySuccessToast();
        });
    });

    test('TC10 - Verify Leave List View Details @regression', async ({ leavePage }) => {
        await test.step('View Details', async () => {
            await leavePage.navigateToSection('Leave List');
            await leavePage.clickSearch();
            await leavePage.clickView();
            await leavePage.verifyElementVisible('Leave Details');
        });
    });

    test('TC11 - Verify Leave List Add Comment @regression', async ({ leavePage }) => {
        await test.step('Add Comment', async () => {
            await leavePage.navigateToSection('Leave List');
            await leavePage.selectDropdownOption('Show Leave with Status', 'Pending Approval');
            await leavePage.clickSearch();
            await leavePage.clickAddComment();
            await leavePage.typeInField('Comment', 'Approved by Admin - Auto Test');
            await leavePage.clickSave();
            await leavePage.verifySuccessToast();
        });
    });

    test('TC12 - Verify Leave List Reset Filters @regression', async ({ leavePage }) => {
        await test.step('Apply and Reset Filters', async () => {
            await leavePage.navigateToSection('Leave List');
            await leavePage.typeInField('From Date', '2024-01-01');
            await leavePage.typeInField('To Date', '2024-12-31');
            await leavePage.selectDropdownOption('Show Leave with Status', 'Scheduled');
            await leavePage.clickReset();
            await leavePage.verifySearchTable();
        });
    });
});
