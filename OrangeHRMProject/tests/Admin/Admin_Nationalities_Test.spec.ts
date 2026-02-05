import { test, expect } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('Admin_Nationalities_Test', () => {
    test.beforeEach(async ({ loginPage, dashboardPage }) => {
        await test.step('Login to Application', async () => {
            await loginPage.navigateTo(TestConfig.BASE_URL);
            await loginPage.login(TestConfig.USERNAME, TestConfig.PASSWORD);
        });

        await test.step('Verify Dashboard and Navigate to Admin', async () => {
            await dashboardPage.verifyDashboard("Dashboard");
            await dashboardPage.navigateToModule("Admin");
        });
    });

    test('TC01 - Verify Nationality Lifecycle: Create, Verify @regression', async ({ adminPage }) => {
        const nationalityName = "1-Automation Tester Nationality";

        await test.step('Navigate to Nationalities', async () => {
            await adminPage.navigateToSection("Nationalities");
        });

        await test.step('Create Nationality', async () => {
            await adminPage.clickAdd();
            await adminPage.typeInField("Name", nationalityName);
            await adminPage.clickSave();
        });

        await test.step('Verify Creation', async () => {
            await adminPage.verifySuccessToast();
            await adminPage.verifyRecordVisible(nationalityName);
        });
    });

    test('TC02 - Verify Nationality Lifecycle: Create, Edit, Delete @regression', async ({ adminPage }) => {
        const nationalityName = "1-Test Nationality";
        const updatedName = "1-Updated Test Nationality";

        await test.step('Create Nationality', async () => {
            await adminPage.navigateToSection("Nationalities");
            await adminPage.clickAdd();
            await adminPage.typeInField("Name", nationalityName);
            await adminPage.clickSave();
            await adminPage.verifySuccessToast();
            await adminPage.verifyRecordVisible(nationalityName);
        });

        await test.step('Edit Nationality', async () => {
            await adminPage.editRecord(nationalityName);
            await adminPage.typeInField("Name", updatedName);
            await adminPage.clickSave();
            await adminPage.verifySuccessToast();
            await adminPage.verifyRecordVisible(updatedName);
        });

        await test.step('Delete Nationality', async () => {
            await adminPage.deleteRecord(updatedName);
            await adminPage.verifySuccessToast();
            await adminPage.verifyRecordNotVisible(updatedName);
        });
    });

    test('TC03 - Verify Nationality Validation: Empty Field @regression', async ({ adminPage }) => {
        await test.step('Navigate and Trigger Error', async () => {
            await adminPage.navigateToSection("Nationalities");
            await adminPage.clickAdd();
            await adminPage.clickSave();
        });

        await test.step('Verify Error Message', async () => {
            await adminPage.verifyFieldError("Name", "Required");
        });
    });

    test('TC04 - Verify Nationality Duplicate Validation @regression', async ({ adminPage }) => {
        const duplicateName = "Egyptian";

        await test.step('Try to Create Duplicate', async () => {
            await adminPage.navigateToSection("Nationalities");
            await adminPage.clickAdd();
            await adminPage.typeInField("Name", duplicateName);
            await adminPage.clickSave();
        });

        await test.step('Verify Duplicate Error', async () => {
            await adminPage.verifyFieldError("Name", "Already exists");
        });
    });

    test('TC05 - Verify Nationality Search Functionality @regression', async ({ adminPage }) => {
        await test.step('Verify Existing Record', async () => {
            await adminPage.navigateToSection("Nationalities");
            await adminPage.verifyRecordVisible("American");
        });
    });

});