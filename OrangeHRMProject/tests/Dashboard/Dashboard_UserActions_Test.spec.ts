import { test, expect } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('Dashboard_UserActions_Test', () => {
    test.beforeEach(async ({ loginPage, dashboardPage }) => {
        await test.step('Initialize pages and login', async () => {
            await loginPage.navigateTo(TestConfig.BASE_URL);
            await loginPage.enterUsername(TestConfig.USERNAME);
            await loginPage.enterPassword(TestConfig.PASSWORD);
            await loginPage.clickLogin();
            await dashboardPage.verifyDashboard('Dashboard');
        });
    });

    test('TC01 - Verify About Modal Popup @regression', async ({ dashboardPage }) => {
        await test.step('Open About Dialog', async () => {
            await dashboardPage.clickAbout();
        });
        await test.step('Verify About Content', async () => {
            await dashboardPage.verifyDialogContains('OrangeHRM');
            await dashboardPage.verifyDialogContains('Version');
        });
        await test.step('Close Dialog', async () => {
            await dashboardPage.dismissDialog();
            await dashboardPage.verifyDialogNotVisible();
        });
    });

    test('TC02 - Verify Logout Functionality @regression', async ({ dashboardPage }) => {
        await test.step('Logout', async () => {
            await dashboardPage.clickLogout();
        });
    });

    test('TC03 - Verify Hiding and Showing Widgets @regression', async ({ dashboardPage }) => {
        const widgetName = 'Configurations';

        await test.step('Hide Widget', async () => {
            await dashboardPage.clickGearIcon();
            await dashboardPage.toggleWidgetVisibility(widgetName);
            await dashboardPage.clickSave();
            await dashboardPage.verifySuccessToast();
            await dashboardPage.verifyElementNotVisible(widgetName);
        });
        await test.step('Show Widget Again', async () => {
            await dashboardPage.clickGearIcon();
            await dashboardPage.toggleWidgetVisibility(widgetName);
            await dashboardPage.clickSave();
            await dashboardPage.verifyElementVisible(widgetName);
        });
    });

    test('TC04 - Verify Dashboard Presence @regression', async ({ dashboardPage }) => {
        await test.step('Verify Dashboard Header', async () => {
            await dashboardPage.verifyDashboard('Dashboard');
        });
    });
});

