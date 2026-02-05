import { test, expect } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('PIM_Employee_Test', () => {
    test.beforeEach(async ({ loginPage, dashboardPage }) => {
        await test.step('Login and Navigate to PIM', async () => {
            await loginPage.navigateTo(TestConfig.BASE_URL);
            await loginPage.login(TestConfig.USERNAME, TestConfig.PASSWORD);
            await dashboardPage.verifyDashboard("Dashboard");
            await dashboardPage.navigateToModule("PIM");
        });
    });

    test('TC01 - Verify Add Employee Lifecycle: Create, Search @foundation', async ({ pimPage }) => {
        const firstName = "Script";
        const middleName = "Automation";
        const lastName = "Tester";
        const empId = "77777";
        await test.step('Navigate to Add Employee', async () => {
            await pimPage.navigateToSection("Add Employee");
        });

        await test.step('Create Employee', async () => {
            await pimPage.typeInNameField("Employee Full Name", "First Name", firstName);
            await pimPage.typeInNameField("Employee Full Name", "Middle Name", middleName);
            await pimPage.typeInNameField("Employee Full Name", "Last Name", lastName);
            await pimPage.typeInField("Employee Id", empId);
            await pimPage.clickSave();
            await pimPage.hardWait(2);
            await pimPage.verifySuccessToast();
        });

        await test.step('Search and Verify Employee', async () => {
            await pimPage.navigateToSection("Employee List");
            await pimPage.typeInField("Employee Id", empId);
            await pimPage.selectDropdownOption("Include", "Current Employees Only");
            await pimPage.clickSearch();
            await pimPage.verifyRecordVisible(empId);
        });
    });

    test('TC02 - Verify Add Employee with Login Details (Create User Account) @foundation', async ({ pimPage }) => {
        const firstName = "Dev";
        const middleName = "Sec";
        const lastName = "Ops";
        const username = "devops_user";
        const password = "Password123!";

        await test.step('Create Employee with Login', async () => {
            await pimPage.navigateToSection("Add Employee");
            await pimPage.typeInNameField("Employee Full Name", "First Name", firstName);
            await pimPage.typeInNameField("Employee Full Name", "Middle Name", middleName);
            await pimPage.typeInNameField("Employee Full Name", "Last Name", lastName);
            await pimPage.typeInField("Employee Id", "0777");
            await pimPage.toggleSwitch("Create Login Details");
            await pimPage.typeInField("Username", username);
            await pimPage.typeInField("Password", password);
            await pimPage.typeInField("Confirm Password", password);
            await pimPage.clickSave();
            await pimPage.verifySuccessToast();
        });

        await test.step('Add Report-to Details', async () => {
            await pimPage.clickSidebarTab("Report-to");
            await pimPage.clickAdd("Assigned Supervisors")
            await pimPage.typeInField("Name", "Script Automation Tester");
            await pimPage.selectFromList();
            await pimPage.selectDropdownOption("Reporting Method", "Test_Reporting");
            await pimPage.clickSave();
        });

        await test.step('Add Job Details', async () => {
            await pimPage.clickSidebarTab("Job");
            await pimPage.typeInField("Joined Date", "2025-2-15");
            await pimPage.selectDropdownOption("Job Title", "QA Engineer");
            await pimPage.clickSave();
        });

        await test.step('Verify Employee Created', async () => {
            await pimPage.navigateToSection("Employee List");
            await pimPage.typeInField("Employee Name", firstName+ " " + middleName + " " + lastName);
            await pimPage.selectFromList();
            await pimPage.clickSearch();
            await pimPage.verifyRecordVisible("0777");
        });
    });

    test('TC03 - Verify Add Employee with Termination @foundation', async ({ pimPage }) => {
        const firstName = "Dev";
        const middleName = "Ops";
        const lastName = "Trem";

        await test.step('Create Employee', async () => {
            await pimPage.navigateToSection("Add Employee");
            await pimPage.typeInNameField("Employee Full Name", "First Name", firstName);
            await pimPage.typeInNameField("Employee Full Name", "Middle Name", middleName);
            await pimPage.typeInNameField("Employee Full Name", "Last Name", lastName);
            await pimPage.typeInField("Employee Id", "0333");
            await pimPage.clickSave();
            await pimPage.verifySuccessToast();
        });

        await test.step('Terminate Employee', async () => {
            await pimPage.clickSidebarTab("Job");
            await pimPage.clickTerminate();
            await pimPage.typeInField("Termination Date", "2024-09-30");
            await pimPage.closePopup();
            await pimPage.selectDropdownOption("Termination Reason", "Other");
            await pimPage.hardWait(2);
            await pimPage.clickSave(1);
            await pimPage.verifySuccessToast();
        });
    });

    test('TC04 - Verify Add Employee Validation @regression', async ({ pimPage }) => {
        await test.step('Trigger Validation', async () => {
            await pimPage.navigateToSection("Add Employee");
            await pimPage.clickSave();
        });

        await test.step('Verify Error Message', async () => {
            await pimPage.verifyFieldError("Employee Full Name", "Required");
        });
    });

    test('TC05 - Verify Search by Employment Status @regression', async ({ pimPage }) => {
        await test.step('Search by Employment Status', async () => {
            await pimPage.navigateToSection("Employee List");
            await pimPage.selectDropdownOption("Employment Status", "Full-Time Contract");
            await pimPage.clickSearch();
            await pimPage.verifyFilterVisible();
        });
    });

});
