import { test, expect } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('Maintenance_AccessRecords_Test', () => {
    test.beforeEach(async ({ loginPage, dashboardPage, maintenancePage }) => {
        await test.step('Initialize pages and login', async () => {
            await loginPage.navigateTo(TestConfig.BASE_URL);
            await loginPage.enterUsername(TestConfig.USERNAME);
            await loginPage.enterPassword(TestConfig.PASSWORD);
            await loginPage.clickLogin();
            await dashboardPage.navigateToModule('Maintenance');
            await maintenancePage.verifyAccessPassword(TestConfig.PASSWORD);
        });
    });

    test('TC01 - Verify Access Records Download @regression', async ({ maintenancePage }) => {
        const employeeName = 'Script Automation Tester';

        await test.step('Navigate to Access Records', async () => {
            await maintenancePage.navigateToSection('Access Records');
        });

        await test.step('Search Employee', async () => {
            await maintenancePage.typeInField('Employee Name', employeeName);
            await maintenancePage.selectFromList();
            await maintenancePage.clickSearch();
            await maintenancePage.verifyBodyContains('Personal Data');
        });
        await test.step('Download Records', async () => {
            await maintenancePage.clickDownload();
        });
    });

    test('TC02 - Verify Validation for Access Records @regression', async ({ maintenancePage }) => {
        await test.step('Navigate to Access Records', async () => {
            await maintenancePage.navigateToSection('Access Records');
        });
        await test.step('Attempt Search without Employee Name', async () => {
            await maintenancePage.hardWait(2);
            await maintenancePage.clickSearch();
            await maintenancePage.verifyFieldError('Employee Name', 'Required');
        });
    });
});
