import { test, expect } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('Claim_Advanced_Test', () => {
    test.beforeEach(async ({ loginPage, dashboardPage }) => {
        await test.step('Login to Application', async () => {
            await loginPage.navigateTo(TestConfig.BASE_URL);
            await loginPage.login(TestConfig.USERNAME, TestConfig.PASSWORD);
        });

        await test.step('Navigate to Claim Module', async () => {
            await dashboardPage.navigateToModule("Claim");
        });
    });

    test('TC01 - Verify Admin Assigning Claim to Employee @foundation', async ({ claimPage }) => {
        const targetEmployee = "Script Automation Tester";

        await test.step('Assign Claim to Employee', async () => {
            await claimPage.navigateToSection("Assign Claim");
            await claimPage.typeInField("Employee Name", targetEmployee);
            await claimPage.selectFromList();
            await claimPage.selectDropdownOption("Event", "Accommodation");
            await claimPage.selectDropdownOption("Currency", "Euro");
            await claimPage.typeInField("Remarks", "Travel Reimbursement");
            await claimPage.clickCreate();
            await claimPage.verifySuccessToast();
        });

        await test.step('Add Transport Expense', async () => {
            await claimPage.clickAdd("Expenses");
            await claimPage.selectDropdownOption("Expense Type", "Transport");
            await claimPage.typeInField("Date", "2024-7-01");
            await claimPage.typeInField("Amount", "320.00");
            await claimPage.clickSave();
            await claimPage.verifySuccessToast();
        });

        await test.step('Add Accommodation Expense', async () => {
            await claimPage.hardWait(3);
            await claimPage.clickAdd("Expenses");
            await claimPage.selectDropdownOption("Expense Type", "Accommodation");
            await claimPage.typeInField("Date", "2024-7-01");
            await claimPage.typeInField("Amount", "70.00");
            await claimPage.clickSave();
            await claimPage.verifySuccessToast();
        });
    });

    test('TC02 - Verify My Claims History Search @regression', async ({ claimPage }) => {
        const fromDate = "2024-01-01";
        const toDate = "2024-12-31";

        await test.step('Search Claims History', async () => {
            await claimPage.navigateToSection("My Claims");
            await claimPage.typeInField("From Date", fromDate);
            await claimPage.typeInField("To Date", toDate);
            await claimPage.clickSearch();
            await claimPage.verifySearchTable();
        });
    });

});
