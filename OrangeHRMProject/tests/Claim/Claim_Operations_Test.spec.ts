import { test, expect } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('Claim_Operations_Test', () => {
    test.beforeEach(async ({ loginPage, dashboardPage }) => {
        await test.step('Login to Application', async () => {
            await loginPage.navigateTo(TestConfig.BASE_URL);
            await loginPage.login(TestConfig.USERNAME, TestConfig.PASSWORD);
        });

        await test.step('Navigate to Claim Module', async () => {
            await dashboardPage.navigateToModule("Claim");
        });
    });

    test('TC01 - Verify Submit Claim Logic @regression', async ({ claimPage }) => {
        await test.step('Create Claim', async () => {
            await claimPage.navigateToSection("Submit Claim");
            await claimPage.selectDropdownOption("Event", "Global QA Summit 2025");
            await claimPage.selectDropdownOption("Currency", "United States Dollar")
            await claimPage.clickCreate();
            await claimPage.verifySuccessToast();
        });

        await test.step('Add Transport Expense', async () => {
            await claimPage.clickAddExpense();
            await claimPage.selectDropdownOption("Expense Type", "Transport");
            await claimPage.typeInField("Date", "2024-12-01");
            await claimPage.typeInField("Amount", "50.00");
            await claimPage.clickSave();
            await claimPage.verifySuccessToast();
        });

        await test.step('Add Accommodation Expense and Submit', async () => {
            await claimPage.clickAddExpense();
            await claimPage.selectDropdownOption("Expense Type", "Accommodation");
            await claimPage.typeInField("Date", "2024-12-01");
            await claimPage.typeInField("Amount", "20");
            await claimPage.clickSave();
            await claimPage.clickSubmit();
        });
    });

    test('TC02 - Verify Submit, Edit Claim Logic @regression', async ({ claimPage }) => {
        await test.step('Create Claim', async () => {
            await claimPage.navigateToSection("Submit Claim");
            await claimPage.selectDropdownOption("Event", "Global QA Summit 2025");
            await claimPage.selectDropdownOption("Currency", "Euro")
            await claimPage.clickCreate();
            await claimPage.verifySuccessToast();
        });

        await test.step('Add and Edit Transport Expense', async () => {
            await claimPage.clickAddExpense();
            await claimPage.selectDropdownOption("Expense Type", "Transport");
            await claimPage.typeInField("Date", "2024-12-01");
            await claimPage.typeInField("Amount", "50.00");
            await claimPage.clickSave();
            await claimPage.verifySuccessToast();
            await claimPage.editRecord("Transport");
            await claimPage.typeInField("Amount", "90");
            await claimPage.clickSave();
            await claimPage.verifySuccessToast();
        });

        await test.step('Add and Edit Accommodation Expense', async () => {
            await claimPage.clickAddExpense();
            await claimPage.selectDropdownOption("Expense Type", "Accommodation");
            await claimPage.typeInField("Date", "2024-12-01");
            await claimPage.typeInField("Amount", "20");
            await claimPage.clickSave();
            
            await claimPage.editRecord("Accommodation");
            await claimPage.typeInField("Amount", "100");
            await claimPage.clickSave();
            await claimPage.verifySuccessToast();
        });

        await test.step('Submit Claim', async () => {
            await claimPage.clickSubmit();
            await claimPage.verifySuccessToast();
        });
    });

});
