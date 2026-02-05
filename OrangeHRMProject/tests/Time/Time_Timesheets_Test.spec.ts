import { test, expect } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('Time_Timesheets_Test', () => {
    test.beforeEach(async ({ loginPage, dashboardPage }) => {
        await test.step('Initialize pages and login', async () => {
            await loginPage.navigateTo(TestConfig.BASE_URL);
            await loginPage.enterUsername(TestConfig.USERNAME);
            await loginPage.enterPassword(TestConfig.PASSWORD);
            await loginPage.clickLogin();
            await dashboardPage.navigateToModule('Time');
        });
    });

    test('TC01 - Verify My Timesheet: Add Row, Edit Hours, Save @regression', async ({ timePage }) => {
        const projectName = 'ACME Ltd - ACME Ltd';
        const activityName = 'Bug Fixes';

        await test.step('Navigate to My Timesheets', async () => {
            await timePage.navigateToSection('Timesheets', 'My Timesheets');
        });

        await test.step('Edit Timesheet', async () => {
            await timePage.editRecord('Edit');
            await timePage.typeInField('Project', projectName);
            await timePage.selectFromList();
            await timePage.selectDropdownOption('Activity', activityName);
            await timePage.clickSave();
            await timePage.verifySuccessToast();
        });
    });

    test('TC02 - Verify Submit Timesheet (Workflow Status) @regression', async ({ timePage }) => {
        await test.step('Navigate to My Timesheets', async () => {
            await timePage.navigateToSection('Timesheets', 'My Timesheets');
        });

        await test.step('Submit Timesheet', async () => {
            await timePage.clickSubmit
            await timePage.verifySuccessToast();
            await timePage.verifyBodyContains('Submitted');
        });
    });

    test('TC03 - Verify Employee Timesheet Approval (Admin Action) @regression', async ({ timePage }) => {
        const employeeName = 'Script Automation Tester';

        await test.step('Navigate to Employee Timesheets', async () => {
            await timePage.navigateToSection('Timesheets', 'Employee Timesheets');
        });

        await test.step('Search and Approve Timesheet', async () => {
            await timePage.typeInField('Employee Name', employeeName);
            await timePage.selectFromList();
            await timePage.clickSearch();
            await timePage.clickApprove();
            await timePage.verifySuccessToast();
            await timePage.verifyBodyContains('Approved');
        });
    });
});
