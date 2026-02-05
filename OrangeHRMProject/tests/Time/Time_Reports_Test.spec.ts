import { test, expect } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('Time_Reports_Test', () => {
    test.beforeEach(async ({ loginPage, dashboardPage }) => {
        await test.step('Initialize pages and login', async () => {
            await loginPage.navigateTo(TestConfig.BASE_URL);
            await loginPage.enterUsername(TestConfig.USERNAME);
            await loginPage.enterPassword(TestConfig.PASSWORD);
            await loginPage.clickLogin();
            await dashboardPage.navigateToModule('Time');
        });
    });

    test('TC01 - Generate Project Report @regression', async ({ timePage }) => {
        const projectName = 'Apache Software Foundation';

        await test.step('Navigate to Project Reports', async () => {
            await timePage.navigateToSection('Reports', 'Project Reports');
        });

        await test.step('Generate Report', async () => {
            await timePage.typeInField('Project Name', projectName);
            await timePage.selectFromList();
            await timePage.clickView();
            await timePage.verifySearchTable();
        });
    });

    test('TC02 - Generate Employee Report @regression', async ({ timePage }) => {
        const employeeName = 'Script Automation Tester';

        await test.step('Navigate to Employee Reports', async () => {
            await timePage.navigateToSection('Reports', 'Employee Reports');
        });

        await test.step('Generate Report', async () => {
            await timePage.typeInField('Employee Name', employeeName);
            await timePage.selectFromList();
            await timePage.clickView();
            await timePage.verifySearchTable();
        });
    });
});
