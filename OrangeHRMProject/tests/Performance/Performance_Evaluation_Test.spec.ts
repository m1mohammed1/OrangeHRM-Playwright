import { test, expect } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('Performance_Evaluation_Test', () => {
    test.beforeEach(async ({ loginPage, dashboardPage }) => {
        await test.step('Initialize pages and login', async () => {
            await loginPage.navigateTo(TestConfig.BASE_URL);
            await loginPage.enterUsername(TestConfig.USERNAME);
            await loginPage.enterPassword(TestConfig.PASSWORD);
            await loginPage.clickLogin();
            await dashboardPage.navigateToModule('Performance');
        });
    });
    
    test('TC01 - Verify Supervisor Grading Employee Review @regression', async ({ performancePage }) => {
        const employeeName = 'Script Automation Tester';
        const kpiName = 'Zero Production Bugs';
        const rating = '95';
        const comment = 'Excellent work.';

        await test.step('Navigate to Employee Reviews', async () => {
            await performancePage.navigateToSection('Manage Reviews', 'Employee Reviews');
        });
        await test.step('Search Employee', async () => {
            await performancePage.typeInField('Employee Name', employeeName);
            await performancePage.selectFromList();
            await performancePage.clickSearch();
        });
        await test.step('Submit Supervisor Review', async () => {
            await performancePage.clickActionStatus('Evaluate');
            await performancePage.setRatingForKPI(kpiName, rating);
            await performancePage.typeInField('Supervisor Comments', comment);
            await performancePage.clickSubmit
            await performancePage.verifySuccessToast();
        });
    });
});
