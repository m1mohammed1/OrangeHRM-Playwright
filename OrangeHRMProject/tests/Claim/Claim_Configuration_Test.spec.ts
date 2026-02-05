import { test, expect } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('Claim_Configuration_Test', () => {
    test.beforeEach(async ({ loginPage, dashboardPage }) => {
        await test.step('Login to Application', async () => {
            await loginPage.navigateTo(TestConfig.BASE_URL);
            await loginPage.login(TestConfig.USERNAME, TestConfig.PASSWORD);
        });

        await test.step('Navigate to Claim Module', async () => {
            await dashboardPage.navigateToModule("Claim");
        });
    });

    test('TC01 - Verify Event: Validate Empty Field @regression', async ({ claimPage }) => {
        await test.step('Trigger Validation', async () => {
            await claimPage.navigateToSection("Configuration", "Events");
            await claimPage.clickAdd();
            await claimPage.typeInField("Event Name", "");
            await claimPage.clickSave();
        });

        await test.step('Verify Error', async () => {
            await claimPage.verifyFieldError("Event Name", "Required");
        });
    });

    test('TC02 - Verify Event Lifecycle: Create, Verify @foundation', async ({ claimPage }) => {
        const eventName = "Global QA Summit 2025";

        await test.step('Create Event', async () => {
            await claimPage.navigateToSection("Configuration", "Events");
            await claimPage.clickAdd();
            await claimPage.typeInField("Event Name", eventName);
            await claimPage.typeInField("Description", "Annual QA Conference");
            await claimPage.clickSave();
        });

        await test.step('Verify Creation', async () => {
            await claimPage.verifySuccessToast();
            await claimPage.verifyRecordVisible(eventName);
        });
    });

    test('TC03 - Verify Event Lifecycle: Create, Verify, Edit, Delete @regression', async ({ claimPage }) => {
        const eventName = "Global CyberSecurity Summit 2025";
        const newEventName = "Global Ai Summit 2025";

        await test.step('Create Event', async () => {
            await claimPage.navigateToSection("Configuration", "Events");
            await claimPage.clickAdd();
            await claimPage.typeInField("Event Name", eventName);
            await claimPage.typeInField("Description", "Annual CyberSecurity Conference");
            await claimPage.clickSave();
            await claimPage.verifySuccessToast();
            await claimPage.verifyRecordVisible(eventName);
        });

        await test.step('Edit Event', async () => {
            await claimPage.editRecord(eventName);
            await claimPage.typeInField("Event Name", newEventName);
            await claimPage.clickSave();
            await claimPage.verifySuccessToast();
            await claimPage.verifyRecordVisible(newEventName);
        });

        await test.step('Delete Event', async () => {
            await claimPage.deleteRecord(newEventName);
            await claimPage.verifySuccessToast();
        });
    });

    test('TC04 - Verify Event: Handle Duplication @regression', async ({ claimPage }) => {
        const eventName = "Global Software Summit 2025";

        await test.step('Create Event', async () => {
            await claimPage.navigateToSection("Configuration", "Events");
            await claimPage.clickAdd();
            await claimPage.typeInField("Event Name", eventName);
            await claimPage.typeInField("Description", "Annual Software Conference");
            await claimPage.clickSave();
            await claimPage.verifySuccessToast();
            await claimPage.verifyRecordVisible(eventName);
        });

        await test.step('Try to Create Duplicate', async () => {
            await claimPage.clickAdd();
            await claimPage.typeInField("Event Name", eventName);
            await claimPage.clickSave();
        });

        await test.step('Verify Duplicate Error and Cleanup', async () => {
            await claimPage.verifyFieldError("Event Name", "Already exists");
            await claimPage.navigateToSection("Configuration", "Events");
            await claimPage.deleteRecord(eventName);
            await claimPage.verifySuccessToast();
        });
    });

    test('TC05 - Verify Expense Type: Validate Empty Field @regression', async ({ claimPage }) => {
        await test.step('Trigger Validation', async () => {
            await claimPage.navigateToSection("Configuration", "Expense Types");
            await claimPage.clickAdd();
            await claimPage.typeInField("Name", "");
            await claimPage.clickSave();
        });

        await test.step('Verify Error', async () => {
            await claimPage.verifyFieldError("Name", "Required");
        });
    });

    test('TC06 - Verify Expense Type Lifecycle: Create, Verify @foundation', async ({ claimPage }) => {
        const expenseName = "Local Transport";

        await test.step('Create Expense Type', async () => {
            await claimPage.navigateToSection("Configuration", "Expense Types");
            await claimPage.clickAdd();
            await claimPage.typeInField("Name", expenseName);
            await claimPage.typeInField("Description", "Transport Reimbursement");
            await claimPage.clickSave();
        });

        await test.step('Verify and Delete', async () => {
            await claimPage.verifySuccessToast();
            await claimPage.verifyRecordVisible(expenseName);
            await claimPage.deleteRecord(expenseName);
            await claimPage.verifySuccessToast();
        });
    });

    test('TC07 - Verify Expense Type Lifecycle: Create, Edit, Delete @regression', async ({ claimPage }) => {
        const expenseName = "Team Lunch";
        const newExpenseName = "Client Dinner";

        await test.step('Create Expense Type', async () => {
            await claimPage.navigateToSection("Configuration", "Expense Types");
            await claimPage.clickAdd();
            await claimPage.typeInField("Name", expenseName);
            await claimPage.typeInField("Description", "Monthly Team Lunch");
            await claimPage.clickSave();
            await claimPage.verifySuccessToast();
            await claimPage.verifyRecordVisible(expenseName);
        });

        await test.step('Edit Expense Type', async () => {
            await claimPage.editRecord(expenseName);
            await claimPage.typeInField("Name", newExpenseName);
            await claimPage.clickSave();
            await claimPage.verifySuccessToast();
            await claimPage.verifyRecordVisible(newExpenseName);
        });

        await test.step('Delete Expense Type', async () => {
            await claimPage.deleteRecord(newExpenseName);
            await claimPage.verifySuccessToast();
        });
    });

    test('TC08 - Verify Expense Type: Handle Duplication @regression', async ({ claimPage }) => {
        const expenseName = "Internet Bill";

        await test.step('Create Expense Type', async () => {
            await claimPage.navigateToSection("Configuration", "Expense Types");
            await claimPage.clickAdd();
            await claimPage.typeInField("Name", expenseName);
            await claimPage.typeInField("Description", "Remote work internet");
            await claimPage.clickSave();
            await claimPage.verifySuccessToast();
        });

        await test.step('Try to Create Duplicate', async () => {
            await claimPage.clickAdd();
            await claimPage.typeInField("Name", expenseName);
            await claimPage.clickSave();
        });

        await test.step('Verify Duplicate Error and Cleanup', async () => {
            await claimPage.verifyFieldError("Name", "Already exists");
            await claimPage.navigateToSection("Configuration", "Expense Types");
            await claimPage.deleteRecord(expenseName);
            await claimPage.verifySuccessToast();
        });
    });

});
