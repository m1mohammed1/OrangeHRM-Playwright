import { test, expect } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('PIM_Reports_Test', () => {
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

    test('TC01 - Verify Report Lifecycle: Create, Verify @regression', async ({ pimPage }) => {
        const reportName = "QA Employee Audit Report";

        await test.step('Navigate to Reports', async () => {
            await pimPage.navigateToSection("Reports");
        });

        await test.step('Create Report', async () => {
            await pimPage.clickAdd();
            await pimPage.typeInField("Report Name", reportName);
            await pimPage.selectDropdownOption("Selection Criteria", "Job Title");
            await pimPage.selectDropdownOption("Include", "Current and Past Employees");
            await pimPage.selectDropdownOption("Select Display Field Group", "Personal");
            await pimPage.selectDropdownOption("Select Display Field", "Employee Id");
            await pimPage.dynamicPlusBtn("Select Display Field");
            await pimPage.clickSave();
        });

        await test.step('Verify Creation', async () => {
            await pimPage.verifySuccessToast();
        });
    });

    test('TC02 - Generate Employee Report @regression', async ({ pimPage }) => {
        const reportName = "QA Employee Audit Report";

        await test.step('Navigate and Edit Report', async () => {
            await pimPage.navigateToSection("Reports");
            await pimPage.editRecord(reportName);
            await pimPage.clickSubmit();
        });
    });

    test('TC03 - Verify Report Lifecycle: Create, Verify, Edit, Delete @regression', async ({ pimPage }) => {
        const reportName = "QA Automation Employee Audit Report";
        const updatedReportName = "QA Automation All Employee Audit Report";

        await test.step('Create Report', async () => {
            await pimPage.navigateToSection("Reports");
            await pimPage.clickAdd();
            await pimPage.typeInField("Report Name", reportName);
            await pimPage.selectDropdownOption("Selection Criteria", "Job Title");
            await pimPage.selectDropdownOption("Include", "Current and Past Employees");
            await pimPage.selectDropdownOption("Select Display Field Group", "Personal");
            await pimPage.selectDropdownOption("Select Display Field", "Employee Id");
            await pimPage.dynamicPlusBtn("Select Display Field");
            await pimPage.clickSave();
            await pimPage.verifySuccessToast();
        });

        await test.step('Edit Report', async () => {
            await pimPage.navigateToSection("Reports");
            await pimPage.editRecord(reportName);
            await pimPage.typeInField("Report Name", updatedReportName);
            await pimPage.clickSave();
            await pimPage.verifySuccessToast();
        });

        await test.step('Delete Report', async () => {
            await pimPage.navigateToSection("Reports");
            await pimPage.deleteRecord(updatedReportName);
            await pimPage.verifySuccessToast();
            await pimPage.verifyRecordNotVisible(updatedReportName);
        });
    });

    test('TC04 - Verify Report Validation Error @regression', async ({ pimPage }) => {
        await test.step('Trigger Validation', async () => {
            await pimPage.navigateToSection("Reports");
            await pimPage.clickAdd();
            await pimPage.clickSave();
        });

        await test.step('Verify Error Message', async () => {
            await pimPage.verifyFieldError("Report Name", "Required");
        });
    });

});
