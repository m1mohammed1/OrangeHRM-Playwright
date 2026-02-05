import { test, expect } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('Leave_Configuration_Test', () => {
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

    test('TC01 - Verify Leave Type Lifecycle: Create, Verify, Delete @regression', async ({ leavePage }) => {
        const typeName = 'Casual Leave - Tests';
//defect when create leave type and delete it and try to ceate again it shows already exists
        await test.step('Navigate to Leave Types', async () => {
            await leavePage.navigateToSection('Configure', 'Leave Types');
        });

        await test.step('Create Leave Type', async () => {
            await leavePage.clickAdd();
            await leavePage.typeInField('Name', typeName);
            await leavePage.clickSave();
            await leavePage.verifySuccessToast();
        });

        await test.step('Verify and Delete', async () => {
            await leavePage.verifyRecordVisible(typeName);
            await leavePage.deleteRecord(typeName);
            await leavePage.verifySuccessToast();
            await leavePage.deleteRecord(typeName);
        });
    });

    test('TC02 - Verify Leave Type Duplicate Validation @regression', async ({ leavePage }) => {
        const typeName = 'US - Vacation';

        await test.step('Navigate to Leave Types', async () => {
            await leavePage.navigateToSection('Configure', 'Leave Types');
        });

        await test.step('Attempt to Create Duplicate', async () => {
            await leavePage.clickAdd();
            await leavePage.typeInField('Name', typeName);
            await leavePage.clickSave();
            await leavePage.verifyFieldError('Name', 'Already exists');
        });
    });

    test('TC03 - Verify Work Week Configuration Update @regression', async ({ leavePage }) => {
        await test.step('Navigate to Work Week', async () => {
            await leavePage.navigateToSection('Configure', 'Work Week');
        });

        await test.step('Update Configuration', async () => {
            await leavePage.selectDropdownOption('Saturday', 'Non-working Day');
            await leavePage.selectDropdownOption('Sunday', 'Non-working Day');
            await leavePage.clickSave();
            await leavePage.verifySuccessToast();
        });
    });

    test('TC04 - Verify Holiday Lifecycle: Create, Verify, Delete @regression', async ({ leavePage }) => {
        const holidayName = 'Automation Day';
        const fromDate = '2025-07-31';
        const toDate = '2025-12-15';

        await test.step('Navigate to Holidays', async () => {
            await leavePage.navigateToSection('Configure', 'Holidays');
            await leavePage.clickAdd();
        });

        await test.step('Create Holiday', async () => {
            await leavePage.typeInField('Name', holidayName);
            await leavePage.typeInField('Date', fromDate);
            await leavePage.clickSave();
            await leavePage.verifySuccessToast();
        });

        await test.step('Search Holiday', async () => {
            await leavePage.typeInField('From', fromDate);
            await leavePage.typeInField('To', toDate);
            await leavePage.clickSearch();
        });

        await test.step('Verify and Delete', async () => {
            await leavePage.verifyRecordVisible(holidayName);
            await leavePage.deleteRecord(holidayName);
            await leavePage.verifySuccessToast();
        });
    });

    test('TC05 - Verify Holiday Validation Error @regression', async ({ leavePage }) => {
        await test.step('Navigate to Holidays', async () => {
            await leavePage.navigateToSection('Configure', 'Holidays');
            await leavePage.clickAdd();
            await leavePage.hardWait(2);
        });

        await test.step('Submit without Required Fields', async () => {
            await leavePage.clickSave();
            await leavePage.verifyFieldError('Name', 'Required');
            await leavePage.verifyFieldError('Date', 'Required');
        });
    });

    test('TC06 - Verify Leave Period Configuration Update @regression', async ({ leavePage }) => {
        await test.step('Navigate to Leave Period', async () => {
            await leavePage.navigateToSection('Configure', 'Leave Period');
        });

        await test.step('Update Configuration', async () => {
            await leavePage.selectDropdownOption('Start Month', 'January');
            await leavePage.selectDropdownOption('Start Date', '01');
            await leavePage.clickSave();
            await leavePage.verifySuccessToast();
        });
    });
});
    