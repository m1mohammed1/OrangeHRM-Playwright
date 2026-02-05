import { test } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('Claim Test Cleaning', () => {
    test.beforeEach(async ({ loginPage, dashboardPage }) => {
        await loginPage.navigateTo(TestConfig.BASE_URL);
        await loginPage.login(TestConfig.USERNAME, TestConfig.PASSWORD);
        await dashboardPage.navigateToModule("Claim");
    });

    test('TC01 - Cleanup Event - Global QA Summit 2025 @regression', async ({ claimPage }) => {
        await claimPage.navigateToSection("Configuration", "Events");
        await claimPage.deleteIfExists("Global QA Summit 2025");
    });
});
