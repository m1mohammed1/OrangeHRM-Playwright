import { test } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('Buzz Test Cleaning', () => {
    test.beforeEach(async ({ loginPage, dashboardPage }) => {
        await loginPage.navigateTo(TestConfig.BASE_URL);
        await loginPage.login(TestConfig.USERNAME, TestConfig.PASSWORD);
        await dashboardPage.navigateToModule("Buzz");
    });

    test('TC01 - Cleanup Post - Engagement @regression', async ({ buzzPage }) => {
        await buzzPage.deleteIfExists("Engagement");
    });

    test('TC02 - Cleanup Post - Updated Text @regression', async ({ buzzPage }) => {
        await buzzPage.deleteIfExists("Updated Text");
    });

    test('TC03 - Cleanup Post - Safety Check @regression', async ({ buzzPage }) => {
        await buzzPage.deleteIfExists("Safety Check");
    });
});
