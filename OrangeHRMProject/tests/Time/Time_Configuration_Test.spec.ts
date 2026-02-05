import { test, expect } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('Time_Configuration_Test', () => {
    test.beforeEach(async ({ loginPage, dashboardPage }) => {
        await test.step('Initialize pages and login', async () => {
            await loginPage.navigateTo(TestConfig.BASE_URL);
            await loginPage.enterUsername(TestConfig.USERNAME);
            await loginPage.enterPassword(TestConfig.PASSWORD);
            await loginPage.clickLogin();
            await dashboardPage.navigateToModule('Time');
        });
    });

    test('TC01 - Verify Attendance Configuration Updates @regression', async ({ timePage }) => {
        await test.step('Navigate to Configuration and Save', async () => {
            await timePage.navigateToSection('Attendance', 'Configuration');
            await timePage.clickSave();
            await timePage.verifySuccessToast();
        });
    });
});
