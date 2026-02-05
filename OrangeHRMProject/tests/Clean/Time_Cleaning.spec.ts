import { test } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('Time Test Cleaning', () => {
    test.beforeEach(async ({ loginPage, dashboardPage }) => {
        await loginPage.navigateTo(TestConfig.BASE_URL);
        await loginPage.login(TestConfig.USERNAME, TestConfig.PASSWORD);
        await dashboardPage.navigateToModule("Time");
    });

    test('TC01 - Cleanup Attendance Record - Started working on Automation @regression', async ({ timePage }) => {
        await timePage.navigateToSection("Attendance", "My Records");
        await timePage.typeInField("Date", "2024-12-15");
        await timePage.clickView();
        await timePage.deleteIfExists("Started working on Automation");
    });

    test('TC02 - Cleanup Attendance Record - Leaving for the day @regression', async ({ timePage }) => {
        await timePage.navigateToSection("Attendance", "My Records");
        await timePage.typeInField("Date", "2024-12-30");
        await timePage.clickView();
        await timePage.deleteIfExists("Leaving for the day");
    });

    test('TC03 - Cleanup Customer - Auto Test Customer @regression', async ({ timePage }) => {
        await timePage.navigateToSection("Project Info", "Customers");
        await timePage.deleteIfExists("Auto Test Customer");
    });
});
