import { test, expect } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('Admin_Organization_Test', () => {
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

    test('TC01 - Verify Location Lifecycle: Create, Verify in Table @foundation', async ({ adminPage }) => {
        const locName = "Cairo Innovation Hub";
        const country = "Egypt";
        const city = "New Cairo";

        await test.step('Create New Location', async () => {
            await adminPage.navigateToSection("Organization", "Locations");
            await adminPage.clickAdd();
            await adminPage.typeInField("Name", locName);
            await adminPage.selectDropdownOption("Country", country);
            await adminPage.typeInField("City", city);
            await adminPage.typeInField("Address", "Building 5, Tech Park");
            await adminPage.typeInField("Zip/Postal Code", "11835");
            await adminPage.typeInField("Phone", "+201000000000");
            await adminPage.clickSave();
        });

        await test.step('Verify Success Message', async () => {
            await adminPage.verifySuccessToast();
        });

        await test.step('Search and Verify Location', async () => {
            await adminPage.typeInField("Name", locName);
            await adminPage.clickSearch();
            await adminPage.verifyRecordVisible(locName);
        });
    });

    test('TC02 - Verify updating an existing Location @regression', async ({ adminPage }) => {
        const oldName = "Giza Branch";
        const newName = "Cairo Main Office";

        await test.step('Create Initial Location', async () => {
            await adminPage.navigateToSection("Organization", "Locations");
            await adminPage.clickAdd();
            await adminPage.typeInField("Name", oldName);
            await adminPage.selectDropdownOption("Country", "Egypt");
            await adminPage.clickSave();
            await adminPage.verifySuccessToast();
        });

        await test.step('Edit Location', async () => {
            await adminPage.typeInField("Name", oldName);
            await adminPage.clickSearch();
            await adminPage.editRecord(oldName);
            await adminPage.typeInField("Name", newName);
            await adminPage.typeInField("State/Province", "Sheikh Zayed");
            await adminPage.typeInField("Zip/Postal Code", "77777");
            await adminPage.clickSave();
            await adminPage.verifySuccessToast();
        });

        await test.step('Verify Update and Delete', async () => {
            await adminPage.typeInField("Name", newName);
            await adminPage.clickSearch();
            await adminPage.verifyRecordVisible(newName);
            await adminPage.deleteRecord(newName);
        });
    });

    test('TC03 - Verify validation errors for required Location fields @regression', async ({ adminPage }) => {
        await test.step('Trigger Validation Errors', async () => {
            await adminPage.navigateToSection("Organization", "Locations");
            await adminPage.clickAdd();
            await adminPage.clickSave();
        });

        await test.step('Verify Error Messages', async () => {
            await adminPage.verifyFieldError("Name", "Required");
            await adminPage.verifyFieldError("Country", "Required");
        });
    });

    test('TC04 - Verify error when creating a duplicate Location Name @regression', async ({ adminPage }) => {
        const duplicateName = "Alexandria Hub";

        await test.step('Create Duplicate Location', async () => {
            await adminPage.navigateToSection("Organization", "Locations");
            await adminPage.clickAdd();
            await adminPage.typeInField("Name", duplicateName);
            await adminPage.selectDropdownOption("Country", "Egypt");
            await adminPage.clickSave();
            await adminPage.verifySuccessToast();
        });

        await test.step('Try Creating Duplicate Again', async () => {
            await adminPage.clickAdd();
            await adminPage.typeInField("Name", duplicateName);
            await adminPage.selectDropdownOption("Country", "Egypt");
            await adminPage.clickSave();
        });

        await test.step('Verify Error and Cleanup', async () => {
            await adminPage.verifyFieldError("Name", "Already exists");
        });
        
        await test.step('Cleanup', async () => {
             await adminPage.navigateToSection("Organization", "Locations");
             await adminPage.typeInField("Name", duplicateName);
             await adminPage.clickSearch();
             await adminPage.deleteRecord(duplicateName);
        });
    });

    test('TC05 - Verify Search by City and Country filters @regression', async ({ adminPage }) => {
        const searchCity = "SearchTest City";
        const searchCountry = "Canada";
        const locName = "Filter Test Location";

        await test.step('Create Location for Filtering', async () => {
            await adminPage.navigateToSection("Organization", "Locations");
            await adminPage.clickAdd();
            await adminPage.typeInField("Name", locName);
            await adminPage.selectDropdownOption("Country", searchCountry);
            await adminPage.typeInField("City", searchCity);
            await adminPage.clickSave();
            await adminPage.verifySuccessToast();
        });

        await test.step('Search by City and Country', async () => {
            await adminPage.typeInField("City", searchCity);
            await adminPage.selectDropdownOption("Country", searchCountry);
            await adminPage.clickSearch();
            await adminPage.verifyRecordVisible(locName);
        });

        await test.step('Cleanup', async () => {
            await adminPage.deleteRecord(locName);
        });
    });

    test('TC06 - Verify Reset Button functionality @regression', async ({ adminPage }) => {
        await test.step('Fill Filters and Reset', async () => {
            await adminPage.navigateToSection("Organization", "Locations");
            await adminPage.typeInField("City", "New York");
            await adminPage.selectDropdownOption("Country", "United States");
            await adminPage.clickSearch();
            await adminPage.clickReset();
        });

        await test.step('Verify Reset', async () => {
            await adminPage.verifySearchTable();
        });
    });

    test('TC07 - Verify Organization Unit Lifecycle: Enable Edit, Create, Verify, Delete @regression', async ({ adminPage }) => {
        const unitId = "QA-UNIT-01";
        const unitName = "Quality Assurance Dept";

        await test.step('Navigate and Enable Edit Mode', async () => {
            await adminPage.navigateToSection("Organization", "Structure");
            await adminPage.toggleSwitch("Edit"); 
        });

        await test.step('Add Unit', async () => {
            await adminPage.clickAdd();
            await adminPage.typeInField("Unit Id", unitId);
            await adminPage.typeInField("Name", unitName);
            await adminPage.typeInField("Description", "Handling all Testing Activities");
            await adminPage.clickSave();
            await adminPage.verifySuccessToast();
        });

        await test.step('Delete Unit', async () => {
            await adminPage.deleteRecord(unitId);
            await adminPage.verifySuccessToast();
        });
    });

    test('TC08 - Verify validation error for empty Unit Name in Structure @regression', async ({ adminPage }) => {
        await test.step('Trigger Validation Error', async () => {
            await adminPage.navigateToSection("Organization", "Structure");
            await adminPage.toggleSwitch("Edit");
            await adminPage.clickAdd();
            await adminPage.clickSave();
        });

        await test.step('Verify Error Message', async () => {
            await adminPage.verifyFieldError("Name", "Required");
        });
    });

    test('TC09 - Verify error when creating a duplicate Unit ID @regression', async ({ adminPage }) => {
        const unitId = "DEV-01";
        const unitName = "Development Dept";

        await test.step('Create Initial Unit', async () => {
            await adminPage.navigateToSection("Organization", "Structure");
            await adminPage.toggleSwitch("Edit");
            await adminPage.clickAdd();
            await adminPage.typeInField("Unit Id", unitId);
            await adminPage.typeInField("Name", unitName);
            await adminPage.clickSave();
            await adminPage.verifySuccessToast();
        });

        await test.step('Try Creating Duplicate', async () => {
            await adminPage.clickAdd();
            await adminPage.typeInField("Unit Id", unitId);
            await adminPage.typeInField("Name", unitName);
            await adminPage.clickSave();
        });

        await test.step('Verify Error and Cleanup', async () => {
            await adminPage.verifyFieldError("Name", "Organization unit name should be unique");
            await adminPage.clickCancel();
            await adminPage.deleteRecord(unitId);
            await adminPage.verifySuccessToast();
        });
    });
});
