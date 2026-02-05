import { test } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('Performance Test Cleaning', () => {
    test.beforeEach(async ({ loginPage, dashboardPage }) => {
        await loginPage.navigateTo(TestConfig.BASE_URL);
        await loginPage.login(TestConfig.USERNAME, TestConfig.PASSWORD);
        await dashboardPage.navigateToModule("Performance");
    });

    test('TC01 - Cleanup KPI - Zero Production Bugs @regression', async ({ performancePage }) => {
        await performancePage.navigateToSection("Configure", "KPIs");
        await performancePage.selectDropdownOption("Job Title", "QA Engineer");
        await performancePage.clickSearch();
        await performancePage.deleteIfExists("Zero Production Bugs");
    });

    test('TC02 - Cleanup Tracker - Quality Tracker 2025 @regression', async ({ performancePage }) => {
        await performancePage.navigateToSection("Configure", "Trackers");
        await performancePage.deleteIfExists("Quality Tracker 2025");
    });
});