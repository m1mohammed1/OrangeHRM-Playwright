import { test, expect } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('Maintenance_Authentication_Test', () => {
    test.beforeEach(async ({ loginPage }) => {
        await test.step('Initialize pages and login', async () => {
            await loginPage.navigateTo(TestConfig.BASE_URL);
            await loginPage.enterUsername(TestConfig.USERNAME);
            await loginPage.enterPassword(TestConfig.PASSWORD);
            await loginPage.clickLogin();
        });
    });

    test('TC01 - Verify Maintenance Access Requires Password @regression', async ({ dashboardPage, maintenancePage }) => {
        await test.step('Navigate to Maintenance', async () => {
            await dashboardPage.navigateToModule('Maintenance');
        });
        await test.step('Attempt Access with Wrong Password', async () => {
            await maintenancePage.verifyAccessPassword('WrongPass');
            await maintenancePage.verifyError();
        });
        await test.step('Access with Correct Password', async () => {
            await maintenancePage.verifyAccessPassword(TestConfig.PASSWORD);
            await maintenancePage.verifyHeader('Maintenance');
        });
    });
});
