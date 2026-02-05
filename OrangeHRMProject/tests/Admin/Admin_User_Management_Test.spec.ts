import { test, expect } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('Admin_User_Management_Test', () => {
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

    test('TC01 - Verify Admin User Lifecycle: Create, Search @foundation', async ({ adminPage }) => {
        const username = "TestAdmin_QA";

        await test.step('Create New User', async () => {
            await adminPage.verifyHeader("Admin");
            await adminPage.clickAdd();
            await adminPage.selectDropdownOption("User Role", "Admin");
            await adminPage.typeInField("Employee Name", "Script Automation Test");
            await adminPage.selectFromList();
            await adminPage.selectDropdownOption("Status", "Enabled");
            await adminPage.typeInField("Username", username);
            await adminPage.typeInField("Password", "Password123!");
            await adminPage.typeInField("Confirm Password", "Password123!");
            await adminPage.clickSave();
        });

        await test.step('Verify Creation', async () => {
            await adminPage.verifySuccessToast();
        });

        await test.step('Search and Verify User', async () => {
            await adminPage.typeInField("Username", username);
            await adminPage.clickSearch();
            await adminPage.verifyRecordVisible(username);
        });
    });

    test('TC02 - Verify validation errors for all required fields in User Form @regression', async ({ adminPage }) => {
        await test.step('Trigger Validation Errors', async () => {
            await adminPage.clickAdd();
            await adminPage.clickSave();
        });

        await test.step('Verify Error Messages', async () => {
            await adminPage.verifyFieldError("User Role", "Required");
            await adminPage.verifyFieldError("Employee Name", "Required");
            await adminPage.verifyFieldError("Status", "Required");
            await adminPage.verifyFieldError("Username", "Required");
            await adminPage.verifyFieldError("Password", "Required");
            await adminPage.verifyFieldError("Confirm Password", "Passwords do not match");
        });
    });

    test('TC03 - Verify search with non-existing username @regression', async ({ adminPage }) => {
        const invalidUsername = "InvalidUser_XYZ";

        await test.step('Search for Non-existing User', async () => {
            await adminPage.typeInField("Username", invalidUsername);
            await adminPage.clickSearch();
        });

        await test.step('Verify No Records Found', async () => {
            await adminPage.verifyRecordNotVisible(invalidUsername);
            await adminPage.verifyInfoToast();
        });
    });

    test('TC04 - Verify error message when Password and Confirm Password do not match @regression', async ({ adminPage }) => {
        await test.step('Create User with Mismatched Passwords', async () => {
            await adminPage.clickAdd();
            await adminPage.selectDropdownOption("User Role", "Admin");
            await adminPage.typeInField("Employee Name", "Script Automation Test");
            await adminPage.selectFromList();
            await adminPage.selectDropdownOption("Status", "Enabled");
            await adminPage.typeInField("Username", "TestMismatch_QA");
            await adminPage.typeInField("Password", "Pass1234!");
            await adminPage.typeInField("Confirm Password", "WrongPass123!");
        });

        await test.step('Verify Error Message', async () => {
            await adminPage.verifyFieldError("Confirm Password", "Passwords do not match");
        });
    });

    test('TC05 - Verify password validation: minimum requirements not met @regression', async ({ adminPage }) => {
        await test.step('Create User with Weak Password', async () => {
            await adminPage.clickAdd();
            await adminPage.selectDropdownOption("User Role", "Admin");
            await adminPage.typeInField("Employee Name", "Script Automation Test");
            await adminPage.selectFromList();
            await adminPage.selectDropdownOption("Status", "Enabled");
            await adminPage.typeInField("Username", "Test_QA");
            await adminPage.typeInField("Password", "PasswordQA!");
            await adminPage.typeInField("Confirm Password", "PasswordQA!");
        });

        await test.step('Verify Password Error', async () => {
            await adminPage.verifyFieldError("Password", "Your password must contain minimum 1 number");
        });
    });

    test('TC06 - Verify Edit User: Change Status from Enabled to Disabled @regression', async ({ adminPage }) => {
        const username = "EditTest_User";

        await test.step('Create User with Enabled Status', async () => {
            await adminPage.verifyHeader("Admin");
            await adminPage.clickAdd();
            await adminPage.selectDropdownOption("User Role", "ESS");
            await adminPage.typeInField("Employee Name", "Script Automation Test");
            await adminPage.selectFromList();
            await adminPage.selectDropdownOption("Status", "Enabled");
            await adminPage.typeInField("Username", username);
            await adminPage.typeInField("Password", "Password123!");
            await adminPage.typeInField("Confirm Password", "Password123!");
            await adminPage.clickSave();
            await adminPage.verifySuccessToast();
        });

        await test.step('Edit User Status to Disabled', async () => {
            await adminPage.typeInField("Username", username);
            await adminPage.clickSearch();
            await adminPage.editRecord(username);
            await adminPage.selectDropdownOption("Status", "Disabled");
            await adminPage.clickSave();
            await adminPage.verifySuccessToast();
        });

        await test.step('Verify and Delete User', async () => {
            await adminPage.typeInField("Username", username);
            await adminPage.selectDropdownOption("Status", "Disabled");
            await adminPage.clickSearch();
            await adminPage.verifyRecordVisible(username);
            await adminPage.deleteRecord(username);
            await adminPage.verifySuccessToast();
        });
    });

    test('TC07 - Verify Delete User Functionality @regression', async ({ adminPage }) => {
        const username = "DeleteTest_User";

        await test.step('Create User for Deletion', async () => {
            await adminPage.verifyHeader("Admin");
            await adminPage.clickAdd();
            await adminPage.selectDropdownOption("User Role", "ESS");
            await adminPage.typeInField("Employee Name", "Script Automation Test");
            await adminPage.selectFromList();
            await adminPage.selectDropdownOption("Status", "Enabled");
            await adminPage.typeInField("Username", username);
            await adminPage.typeInField("Password", "Password123!");
            await adminPage.typeInField("Confirm Password", "Password123!");
            await adminPage.clickSave();
            await adminPage.verifySuccessToast();
        });

        await test.step('Delete User', async () => {
            await adminPage.typeInField("Username", username);
            await adminPage.clickSearch();
            await adminPage.deleteRecord(username);
            await adminPage.verifySuccessToast();
            await adminPage.verifyRecordNotVisible(username);
        });
    });

    test('TC08 - Verify Search by User Role Filter @regression', async ({ adminPage }) => {
        await test.step('Search by Admin Role', async () => {
            await adminPage.verifyHeader("Admin");
            await adminPage.selectDropdownOption("User Role", "Admin");
            await adminPage.clickSearch();
            await adminPage.verifyRecordVisible("Admin");
        });
    });

    test('TC09 - Verify Search by Status Filter @regression', async ({ adminPage }) => {
        await test.step('Search by Enabled Status', async () => {
            await adminPage.verifyHeader("Admin");
            await adminPage.selectDropdownOption("Status", "Enabled");
            await adminPage.clickSearch();
            await adminPage.verifyFilterVisible();
        });
    });

    test('TC10 - Verify Duplicate Username Error @regression', async ({ adminPage }) => {
        await test.step('Try to Create Duplicate Username', async () => {
            await adminPage.verifyHeader("Admin");
            await adminPage.clickAdd();
            await adminPage.selectDropdownOption("User Role", "Admin");
            await adminPage.typeInField("Employee Name", "Script Automation Test");
            await adminPage.selectFromList();
            await adminPage.selectDropdownOption("Status", "Enabled");
            await adminPage.typeInField("Username", "Admin");
            await adminPage.typeInField("Password", "Password123!");
            await adminPage.typeInField("Confirm Password", "Password123!");
            await adminPage.clickSave();
        });

        await test.step('Verify Duplicate Error', async () => {
            await adminPage.verifyFieldError("Username", "Already exists");
        });
    });

    test('TC11 - Verify Reset Search Filters @regression', async ({ adminPage }) => {
        await test.step('Apply Filters and Reset', async () => {
            await adminPage.verifyHeader("Admin");
            await adminPage.typeInField("Username", "TestUser");
            await adminPage.selectDropdownOption("User Role", "Admin");
            await adminPage.selectDropdownOption("Status", "Enabled");
            await adminPage.clickReset();
            await adminPage.verifyFilterVisible();
        });
    });

});
