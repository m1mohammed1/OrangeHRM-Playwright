import { test, expect } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('PIM_Configuration_Test', () => {
    test.beforeEach(async ({ loginPage, dashboardPage }) => {
        await test.step('Login to Application', async () => {
            await loginPage.navigateTo(TestConfig.BASE_URL);
            await loginPage.login(TestConfig.USERNAME, TestConfig.PASSWORD);
        });

        await test.step('Verify Dashboard and Navigate to PIM', async () => {
            await dashboardPage.verifyDashboard("Dashboard");
            await dashboardPage.navigateToModule("PIM");
        });
    });

    test('TC01 - Verify Optional Fields Configuration Save @regression', async ({ pimPage }) => {
        await test.step('Navigate and Save', async () => {
            await pimPage.navigateToSection("Configuration", "Optional Fields");
            await pimPage.clickSave();
            await pimPage.verifySuccessToast();
        });
    });

    test('TC02 - Verify Custom Field Lifecycle: Create, Verify @foundation', async ({ pimPage }) => {
        const fieldName = "Automation Badge ID";

        await test.step('Navigate to Custom Fields', async () => {
            await pimPage.navigateToSection("Configuration", "Custom Fields");
        });

        await test.step('Create Custom Field', async () => {
            await pimPage.clickAdd();
            await pimPage.typeInField("Field Name", fieldName);
            await pimPage.selectDropdownOption("Screen", "Personal Details");
            await pimPage.selectDropdownOption("Type", "Text or Number");
            await pimPage.clickSave();
        });

        await test.step('Verify Creation', async () => {
            await pimPage.verifySuccessToast();
            await pimPage.verifyRecordVisible(fieldName);
        });
    });

    test('TC03 - Verify Custom Field Lifecycle: Create, Verify, Edit, Delete @regression', async ({ pimPage }) => {
        const fieldName = "Automation Badge ID Edit";
        const updatedFieldName = "Ai Automation Badge";

        await test.step('Create Custom Field', async () => {
            await pimPage.navigateToSection("Configuration", "Custom Fields");
            await pimPage.clickAdd();
            await pimPage.typeInField("Field Name", fieldName);
            await pimPage.selectDropdownOption("Screen", "Personal Details");
            await pimPage.selectDropdownOption("Type", "Text or Number");
            await pimPage.clickSave();
            await pimPage.verifySuccessToast();
        });

        await test.step('Edit Custom Field', async () => {
            await pimPage.editRecord(fieldName);
            await pimPage.typeInField("Field Name", updatedFieldName);
            await pimPage.clickSave();
            await pimPage.verifySuccessToast();
            await pimPage.verifyRecordVisible(updatedFieldName);
        });

        await test.step('Delete Custom Field', async () => {
            await pimPage.deleteRecord(updatedFieldName);
            await pimPage.verifySuccessToast();
            await pimPage.verifyRecordNotVisible(updatedFieldName);
        });
    });

    test('TC04 - Verify Custom Field Validation Errors @regression', async ({ pimPage }) => {
        await test.step('Trigger Validation Errors', async () => {
            await pimPage.navigateToSection("Configuration", "Custom Fields");
            await pimPage.clickAdd();
            await pimPage.clickSave();
        });

        await test.step('Verify Error Messages', async () => {
            await pimPage.verifyFieldError("Field Name", "Required");
            await pimPage.verifyFieldError("Screen", "Required");
            await pimPage.verifyFieldError("Type", "Required");
        });
    });

    test('TC05 - Verify Data Import Validation (No File Selected) @regression', async ({ pimPage }) => {
        await test.step('Trigger Validation', async () => {
            await pimPage.navigateToSection("Configuration", "Data Import");
            await pimPage.clickSubmit();
        });

        await test.step('Verify Error Message', async () => {
            await pimPage.verifyFieldError("Select File", "Required");
        });
    });

    test('TC06 - Verify Reporting Method Lifecycle: Create, Verify @foundation', async ({ pimPage }) => {
        const methodName = "Weekly Scrum Report";

        await test.step('Create Reporting Method', async () => {
            await pimPage.navigateToSection("Configuration", "Reporting Methods");
            await pimPage.clickAdd();
            await pimPage.typeInField("Name", methodName);
            await pimPage.clickSave();
        });

        await test.step('Verify Creation', async () => {
            await pimPage.verifySuccessToast();
            await pimPage.verifyRecordVisible(methodName);
        });
    });

    test('TC07 - Verify Reporting Method Lifecycle: Create, Verify, Edit, Delete @regression', async ({ pimPage }) => {
        const methodName = "Weekly Scrum Report";
        const updatedMethodName = "Monthly Scrum Report";

        await test.step('Create Reporting Method', async () => {
            await pimPage.navigateToSection("Configuration", "Reporting Methods");
            await pimPage.clickAdd();
            await pimPage.typeInField("Name", methodName);
            await pimPage.clickSave();
            await pimPage.verifySuccessToast();
        });

        await test.step('Edit Reporting Method', async () => {
            await pimPage.editRecord(methodName);
            await pimPage.typeInField("Name", updatedMethodName);
            await pimPage.clickSave();
            await pimPage.verifySuccessToast();
            await pimPage.verifyRecordVisible(updatedMethodName);
        });

        await test.step('Delete Reporting Method', async () => {
            await pimPage.deleteRecord(updatedMethodName);
            await pimPage.verifySuccessToast();
            await pimPage.verifyRecordNotVisible(updatedMethodName);
        });
    });

    test('TC08 - Verify Reporting Method Validation & Duplicates @regression', async ({ pimPage }) => {
        const duplicateName = "duplicateName";

        await test.step('Verify Required Field Validation', async () => {
            await pimPage.navigateToSection("Configuration", "Reporting Methods");
            await pimPage.clickAdd();
            await pimPage.clickSave();
            await pimPage.verifyFieldError("Name", "Required");
        });

        await test.step('Create Reporting Method', async () => {
            await pimPage.typeInField("Name", duplicateName);
            await pimPage.clickSave();
            await pimPage.verifySuccessToast();
        });

        await test.step('Verify Duplicate Error', async () => {
            await pimPage.clickAdd();
            await pimPage.typeInField("Name", duplicateName);
            await pimPage.clickSave();
            await pimPage.verifyFieldError("Name", "Already exists");
        });

        await test.step('Cleanup', async () => {
            await pimPage.navigateToSection("Configuration", "Reporting Methods");
            await pimPage.deleteRecord(duplicateName);
        });
    });

    test('TC09 - Verify Termination Reason Lifecycle: Create, Verify @foundation', async ({ pimPage }) => {
        const reasonName = "Better Salary Opportunity";

        await test.step('Create Termination Reason', async () => {
            await pimPage.navigateToSection("Configuration", "Termination Reasons");
            await pimPage.clickAdd();
            await pimPage.typeInField("Name", reasonName);
            await pimPage.clickSave();
        });

        await test.step('Verify Creation', async () => {
            await pimPage.verifySuccessToast();
            await pimPage.verifyRecordVisible(reasonName);
        });
    });

    test('TC10 - Verify Termination Reason Lifecycle: Create, Verify, Edit, Delete @regression', async ({ pimPage }) => {
        const reasonName = "Better Salary Opportunity Edit";
        const updatedReasonName = "Better Job Opportunity";

        await test.step('Create Termination Reason', async () => {
            await pimPage.navigateToSection("Configuration", "Termination Reasons");
            await pimPage.clickAdd();
            await pimPage.typeInField("Name", reasonName);
            await pimPage.clickSave();
            await pimPage.verifySuccessToast();
        });

        await test.step('Edit Termination Reason', async () => {
            await pimPage.editRecord(reasonName);
            await pimPage.typeInField("Name", updatedReasonName);
            await pimPage.clickSave();
            await pimPage.verifySuccessToast();
            await pimPage.verifyRecordVisible(updatedReasonName);
        });

        await test.step('Delete Termination Reason', async () => {
            await pimPage.deleteRecord(updatedReasonName);
            await pimPage.verifySuccessToast();
            await pimPage.verifyRecordNotVisible(updatedReasonName);
        });
    });

    test('TC11 - Verify Termination Reason Validation @regression', async ({ pimPage }) => {
        await test.step('Trigger Validation', async () => {
            await pimPage.navigateToSection("Configuration", "Termination Reasons");
            await pimPage.clickAdd();
            await pimPage.clickSave();
        });

        await test.step('Verify Error Message', async () => {
            await pimPage.verifyFieldError("Name", "Required");
        });
    });

});
