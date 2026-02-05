import { test, expect } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('Time_BusinessLogic_Test', () => {
    test.beforeEach(async ({ loginPage, dashboardPage }) => {
        await test.step('Initialize pages and login', async () => {
            await loginPage.navigateTo(TestConfig.BASE_URL);
            await loginPage.enterUsername(TestConfig.USERNAME);
            await loginPage.enterPassword(TestConfig.PASSWORD);
            await loginPage.clickLogin();
            await dashboardPage.navigateToModule('Time');
        });
    });

    test('TC01 - Verify Cannot Punch In Future Date @regression', async ({ timePage }) => {
        await test.step('Navigate to Punch In/Out', async () => {
            await timePage.navigateToSection('Attendance', 'Punch In/Out');
        });
        await test.step('Attempt to Punch In with Future Date', async () => {
            await timePage.typeInField('Date', '2029-01-01');
            await timePage.clickPunchIn();
        });
    });
});
