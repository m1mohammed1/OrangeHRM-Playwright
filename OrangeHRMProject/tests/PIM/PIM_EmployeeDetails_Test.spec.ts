import { test, expect } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('PIM_EmployeeDetails_Test', () => {
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

    test('TC01 - Verify Personal Details View @regression', async ({ pimPage }) => {
        await test.step('Navigate to Employee', async () => {
            await pimPage.navigateToSection("Employee List");
            await pimPage.typeInField("Employee Name", "Script Automation Tester");
            await pimPage.selectFromList();
            await pimPage.clickSubmit();
            await pimPage.editRecord("Script");
        });

        await test.step('Verify Personal Details Section', async () => {
            await pimPage.verifySection("Personal Details");
        });
    });

    test('TC02 - Verify Personal Details Edit @regression', async ({ pimPage }) => {
        await test.step('Navigate to Employee', async () => {
            await pimPage.navigateToSection("Employee List");
            await pimPage.typeInField("Employee Name", "Script Automation");
            await pimPage.selectFromList();
            await pimPage.clickSubmit();
            await pimPage.editRecord("Script");
        });

        await test.step('Update Details', async () => {
            await pimPage.typeInField("Driver's License Number", "DL123456789");
            await pimPage.clickSave();
            await pimPage.verifySuccessToast();
        });
    });

    test('TC03 - Verify Contact Details Update @regression', async ({ pimPage }) => {
        await test.step('Navigate to Employee Contact Details', async () => {
            await pimPage.navigateToSection("Employee List");
            await pimPage.typeInField("Employee Name", "Script Automation");
            await pimPage.selectFromList();
            await pimPage.clickSubmit();
            await pimPage.editRecord("Script");
            await pimPage.clickSidebarTab("Contact Details");
        });

        await test.step('Update Contact Information', async () => {
            await pimPage.typeInField("Street 1", "123 Automation Street");
            await pimPage.typeInField("City", "Cairo");
            await pimPage.typeInField("Mobile", "+201234567890");
            await pimPage.typeInField("Work Email", "script.test@company.com");
            await pimPage.clickSave();
            await pimPage.verifySuccessToast();
        });
    });

    test('TC04 - Verify Emergency Contact Add @regression', async ({ pimPage }) => {
        await test.step('Navigate to Emergency Contacts', async () => {
            await pimPage.navigateToSection("Employee List");
            await pimPage.typeInField("Employee Name", "Script Automation");
            await pimPage.selectFromList();
            await pimPage.clickSubmit();
            await pimPage.editRecord("Script");
            await pimPage.clickSidebarTab("Emergency Contacts");
        });

        await test.step('Add Emergency Contact', async () => {
            await pimPage.clickAdd();
            await pimPage.typeInField("Name", "Emergency Contact Person");
            await pimPage.typeInField("Relationship", "Spouse");
            await pimPage.typeInField("Home Telephone", "+201111111111");
            await pimPage.typeInField("Mobile", "+201222222222");
            await pimPage.clickSave();
            await pimPage.verifySuccessToast();
            await pimPage.verifyRecordVisible("Emergency Contact Person");
        });
    });

    test('TC05 - Verify Emergency Contact Delete @regression', async ({ pimPage }) => {
        await test.step('Navigate and Delete', async () => {
            await pimPage.navigateToSection("Employee List");
            await pimPage.typeInField("Employee Name", "Script Automation");
            await pimPage.selectFromList();
            await pimPage.clickSubmit();
            await pimPage.editRecord("Script");
            await pimPage.clickSidebarTab("Emergency Contacts");
            await pimPage.deleteRecord("Emergency Contact Person");
            await pimPage.verifySuccessToast();
        });
    });

});
