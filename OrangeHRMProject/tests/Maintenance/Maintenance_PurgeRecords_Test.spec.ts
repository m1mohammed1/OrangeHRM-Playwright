import { test, expect } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('Maintenance_PurgeRecords_Test', () => {
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

    test('TC01 - Verify Purge Employee Records Search & Delete @regression', async ({ maintenancePage }) => {
        const employeeName = 'Dev Ops Trem';

        await test.step('Navigate to Purge Employee Records', async () => {
            await maintenancePage.navigateToSection('Purge Records', 'Employee Records');
        });
        await test.step('Search Employee', async () => {
            await maintenancePage.typeInField('Past Employee', employeeName);
            await maintenancePage.selectFromList();
            await maintenancePage.clickSearch();
            await maintenancePage.verifySearchTable();
        });
    });

     test('TC02 - Verify Purge Employee Records Search & Delete @regression', async ({ maintenancePage }) => {
        const employeeName = 'Dev Ops Trem';
        await test.step('Navigate to Purge Employee Records', async () => {
            await maintenancePage.navigateToSection('Purge Records', 'Employee Records');
        });
        await test.step('Search Employee', async () => {
            await maintenancePage.typeInField('Past Employee', employeeName);
            await maintenancePage.selectFromList();
            await maintenancePage.clickSearch();
            await maintenancePage.clickPurge();
            await maintenancePage.clickYesPurge();
        });
    });
});
