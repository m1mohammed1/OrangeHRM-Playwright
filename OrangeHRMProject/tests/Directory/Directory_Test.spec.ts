import { test } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('Directory_Test', () => {
    
    test.beforeEach(async ({ loginPage, dashboardPage }) => {
        await test.step('Login to Application', async () => {
            await loginPage.navigateTo(TestConfig.BASE_URL);
            await loginPage.login(TestConfig.USERNAME, TestConfig.PASSWORD);
        });

        await test.step('Navigate to Directory Module', async () => {
            await dashboardPage.verifyDashboard("Dashboard");
            await dashboardPage.navigateToModule("Directory");
        });
    });

    test('TC01 - Verify Directory Page Display @regression', async ({ directoryPage }) => {
        await directoryPage.verifyHeader("Directory");
    });

    test('TC02 - Verify Directory Search by Job Title @regression', async ({ directoryPage }) => {
        await directoryPage.selectDropdownOption("Job Title", "QA Engineer");
        await directoryPage.clickSearch();
        await directoryPage.verifySearchTable();
    });

    test('TC03 - Verify Directory Search by Location @regression', async ({ directoryPage }) => {
        await directoryPage.selectDropdownOption("Location", "Texas R&D");
        await directoryPage.clickSearch();
        await directoryPage.verifySearchTable();
    });

    test('TC04 - Verify Directory Multiple Filters @regression', async ({ directoryPage }) => {
        await directoryPage.selectDropdownOption("Job Title", "QA Engineer");
        await directoryPage.selectDropdownOption("Location", "Texas R&D");
        await directoryPage.clickSearch();
        await directoryPage.verifySearchTable();
    });

    test('TC05 - Verify Directory Reset Filters @regression', async ({ directoryPage }) => {
        await directoryPage.typeInField("Employee Name", "Test");
        await directoryPage.selectDropdownOption("Job Title", "QA Engineer");
        await directoryPage.clickReset();
        await directoryPage.verifySearchTable();
    });

    test('TC06 - Verify Directory View Employee Details @regression', async ({ directoryPage }) => {
        const employeeName = "Script";
        const fullName = "Script Automation Tester";

        await directoryPage.typeInField("Employee Name", employeeName);
        await directoryPage.selectFromList();
        await directoryPage.clickSearch();
        await directoryPage.clickEmployeeCard(fullName);
    });

    test('TC07 - Verify Directory Empty Search Results @regression', async ({ directoryPage }) => {
        await directoryPage.typeInField("Employee Name", "NonExistentEmployee12345");
        await directoryPage.clickSearch();
        await directoryPage.verifyFieldError("Employee Name", "Invalid");
    });

    test('TC08 - Verify Directory Search by Location @regression', async ({ directoryPage }) => {
        await directoryPage.selectDropdownOption("Location", "Canadian Regional HQ"); 
        await directoryPage.clickSearch();
        await directoryPage.verifySearchTable();
    });
});
